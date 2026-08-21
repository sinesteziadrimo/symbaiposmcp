<#
.SYNOPSIS
    Impacheteaza marketplace-ul Symbai si il publica in doua locuri: samanta de
    instalare in nexuspos si pachetul viu, la Hub.

.DESCRIPTION
    Pana acum pluginul ajungea la clienti DOAR prin GitHub: Claude Code / Codex
    clonau marketplace-ul si se auto-actualizau, daca clientul avea autoUpdate
    pornit si daca clona nu ramanea in urma. Asta a produs clienti inghetati pe
    versiuni vechi, luni la rand, fara niciun semnal.

    Livrarea prin installer scoate GitHub din lant: marketplace-ul devine un
    DIRECTOR LOCAL pe calculatorul clientului, iar Symbai Connect il tine la zi
    prin acelasi mecanism ca binarele lui.

    Marketplace local, verificat pe Claude Code 2.1.222:
      settings.json → extraKnownMarketplaces.symbai.source =
        { "source": "directory", "path": "C:\\ProgramData\\Symbai\\plugin\\symbai" }
    si pe Codex, ~/.codex/config.toml:
      [marketplaces.symbai] source_type = "local"

    -Publish scrie in DOUA locuri, si amandoua conteaza:

      1. nexuspos (plugin\symbai-plugin.zip + server\installer\version.txt) —
         SAMANTA de instalare. Intra in imaginea POS si ajunge la un client abia
         dupa ce se redeployeaza containerul LUI. Buna pentru instalari noi.

      2. Hub (/api/ops/release/plugin-package) — PACHETUL VIU. De aici il iau
         calculatoarele care au deja Symbai Connect, la verificarea lor de la 6h,
         fara sa depinda de deploy-ul vreunui tenant. Fara pasul asta, o versiune
         noua nu ajunge la clientii existenti — exact defectul pentru care s-a
         mutat livrarea de pe GitHub.

    Urcarea la Hub cere SYMBAI_OPS_TOKEN in mediu. Fara el arhiva se construieste si
    samanta se scrie, dar scriptul iese cu COD 1 si o spune rosu pe ultima linie: la
    fel si daca urcarea esueaza. Altfel "am publicat" ar insemna tacut "n-am livrat".

.EXAMPLE
    .\build-package.ps1
    .\build-package.ps1 -Publish
    .\build-package.ps1 -Publish -SkipHub          # doar samanta, fara livrare
    .\build-package.ps1 -Publish -HubUrl https://hub-test.symbai.app
#>
param(
    [string]$Output = "",
    [switch]$Publish,
    [string]$HubUrl = "https://hub.symbai.app",
    [switch]$SkipHub,
    # Trece peste refuzul de a publica un numar de versiune pe care Hub-ul il are
    # deja. Vezi comentariul de la verificarea propriu-zisa: in mod normal asta e o
    # livrare invizibila, nu o livrare.
    [switch]$Republish
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$nexus = Join-Path (Split-Path $root -Parent) "nexuspos"

$marketplaceJson = Join-Path $root ".claude-plugin\marketplace.json"
if (-not (Test-Path $marketplaceJson)) { throw "Nu gasesc $marketplaceJson" }

# Versiunea pachetului = versiunea lui symbai-core. E pluginul care se activeaza
# implicit si singurul pe care il are fiecare client; celelalte doua il insotesc.
$mkt = Get-Content $marketplaceJson -Raw | ConvertFrom-Json
$core = $mkt.plugins | Where-Object { $_.name -eq "symbai-core" } | Select-Object -First 1
if (-not $core) { throw "marketplace.json nu contine symbai-core" }
$Version = [string]$core.version
if ($Version -notmatch '^\d+\.\d+\.\d+$') { throw "Versiune symbai-core invalida: '$Version'" }

if ([string]::IsNullOrWhiteSpace($Output)) { $Output = Join-Path $root "publish\symbai-plugin.zip" }
$outDir = Split-Path $Output -Parent
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force $outDir | Out-Null }

Write-Host "Symbai plugin marketplace $Version -> $Output" -ForegroundColor Cyan

# Fiecare plugin din marketplace TREBUIE sa aiba plugin.json cu aceeasi versiune ca
# intrarea din marketplace.json. Daca diverg, Claude Code rezolva versiunea din
# plugin.json (are prioritate) si `plugin update` nu se mai declanseaza niciodata,
# fiindca noi anuntam alt numar decat vede el.
foreach ($p in $mkt.plugins) {
    $manifest = Join-Path $root ".\plugins\$($p.name)\.claude-plugin\plugin.json"
    if (-not (Test-Path $manifest)) { throw "Lipseste $manifest pentru $($p.name)" }
    $pj = Get-Content $manifest -Raw | ConvertFrom-Json
    if ($pj.version -ne $p.version) {
        throw "$($p.name): marketplace.json spune $($p.version), plugin.json spune $($pj.version). Bumpeaza-le impreuna."
    }

    # Codex citeste .codex-plugin/plugin.json, nu pe cel de Claude. Cele doua au
    # divergat tacut luni de zile (symbai-core: 0.34.0 la Codex, 0.36.0 la Claude),
    # deci un client pe Codex vedea alt numar decat anunta manifestul de livrare.
    # Sufixul `+codex.<stamp>` e metadata de build si nu conteaza la comparatie —
    # se verifica doar baza semver.
    $codexManifest = Join-Path $root ".\plugins\$($p.name)\.codex-plugin\plugin.json"
    if (Test-Path $codexManifest) {
        $cj = Get-Content $codexManifest -Raw | ConvertFrom-Json
        $codexBase = ([string]$cj.version) -replace '\+.*$', ''
        if ($codexBase -ne $p.version) {
            throw "$($p.name): .codex-plugin/plugin.json spune $($cj.version), restul spun $($p.version). Aliniaza baza semver."
        }
    }
}

# Ce intra in arhiva: manifestul de marketplace + dosarele de plugin, exact cum le
# asteapta Claude Code cand i se da un director. Nimic din repo (.git, .local,
# .agents, publish) — clientul nu are ce face cu ele si ar umfla artefactul.
$staging = Join-Path $env:TEMP ("symbai-plugin-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force $staging | Out-Null
try {
    New-Item -ItemType Directory -Force (Join-Path $staging ".claude-plugin") | Out-Null
    Copy-Item $marketplaceJson (Join-Path $staging ".claude-plugin\marketplace.json") -Force
    New-Item -ItemType Directory -Force (Join-Path $staging "plugins") | Out-Null
    foreach ($p in $mkt.plugins) {
        Copy-Item (Join-Path $root "plugins\$($p.name)") (Join-Path $staging "plugins") -Recurse -Force
    }

    if (Test-Path $Output) { Remove-Item $Output -Force }
    # Ambele: ZipArchiveMode traieste in System.IO.Compression, ZipFile in .FileSystem.
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    # Intrarile se scriu una cate una, cu `/`, NU cu CreateFromDirectory: pe .NET
    # Framework (PowerShell 5.1) acela pune BACKSLASH in numele intrarilor, ceea ce
    # incalca specificatia ZIP (APPNOTE 4.4.17.1 cere `/`). Rezultatul e o arhiva pe
    # care unele unelte o despacheteaza in dosare, iar altele in fisiere cu backslash
    # in nume — exact genul de defect care se vede abia la client.
    $zipOut = [System.IO.Compression.ZipFile]::Open($Output, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $stagingRoot = (Resolve-Path $staging).ProviderPath.TrimEnd('\') + '\'
        foreach ($f in (Get-ChildItem $staging -Recurse -File)) {
            $rel = $f.FullName.Substring($stagingRoot.Length).Replace('\', '/')
            $null = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zipOut, $f.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
        }
    } finally {
        $zipOut.Dispose()
    }
} finally {
    Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
}

$info = Get-Item $Output
Write-Host ""
Write-Host ("  arhiva:   {0}" -f $Output)
Write-Host ("  marime:   {0:N2} MB" -f ($info.Length / 1MB))
Write-Host ("  plugins:  {0}" -f (($mkt.plugins | ForEach-Object { "$($_.name) $($_.version)" }) -join ", "))

# Verificare de continut: o arhiva fara marketplace.json ar trece de installer si ar
# lasa clientul cu un marketplace gol, greu de diagnosticat de la distanta.
Add-Type -AssemblyName System.IO.Compression
$zip = [System.IO.Compression.ZipFile]::OpenRead($Output)
try {
    $names = $zip.Entries | ForEach-Object { $_.FullName }
    foreach ($must in @(".claude-plugin/marketplace.json", "plugins/symbai-core/.claude-plugin/plugin.json")) {
        if ($names -notcontains $must) { throw "Arhiva nu contine $must" }
    }
    Write-Host ("  fisiere:  {0}" -f $names.Count)
} finally {
    $zip.Dispose()
}

if ($Publish) {
    $destDir = Join-Path $nexus "plugin"
    $dest = Join-Path $destDir "symbai-plugin.zip"
    $verFile = Join-Path $nexus "server\installer\version.txt"
    if (-not (Test-Path $nexus)) { throw "Nu gasesc $nexus - e nexuspos la locul lui?" }
    if (-not (Test-Path $verFile)) { throw "Nu gasesc $verFile" }
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force $destDir | Out-Null }

    # Manifestul e punctul de commit: se scrie ULTIMUL. O publicare intrerupta lasa
    # cloud-ul anuntand versiunea veche, deci niciun agent nu descarca nimic gresit.
    $raw = [System.IO.File]::ReadAllText($verFile)
    $nl = if ($raw -match "`r`n") { "`r`n" } else { "`n" }
    $lines = $raw -split "`r?`n"
    if (-not ($lines -match '^plugin=')) { throw "version.txt nu are linia plugin= - nu ghicesc unde s-o pun." }
    $newManifest = ($lines | ForEach-Object { if ($_ -match '^plugin=') { "plugin=$Version" } else { $_ } }) -join $nl

    Copy-Item $Output $dest -Force
    Write-Host ""
    Write-Host "  publicat: $dest"

    # UTF8Encoding($false), nu `-Encoding utf8`: in PowerShell 5.1 acela scrie BOM, iar
    # version.txt e citit si cu regex ancorat `^edge=` (server/index.ts, vite-plugin).
    [System.IO.File]::WriteAllText($verFile, $newManifest, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "  version.txt: plugin=$Version"

    # Urcarea la Hub e pasul care LIVREAZA. Copia din nexuspos de mai sus e doar
    # samanta de instalare: ea intra in imaginea POS a fiecarui tenant si ajunge la
    # oameni abia dupa ce se redeployeaza containerul lor. Calculatoarele care au
    # deja Symbai Connect isi iau versiunea noua de la Hub, la urmatoarea lor
    # verificare, fara sa atinga vreun POS.
    #
    # Se face ULTIMUL, din acelasi motiv pentru care manifestul se scria ultimul: o
    # rulare intrerupta inainte de pasul asta lasa lucrurile in starea veche, nu
    # intr-una in care Hub-ul anunta o versiune pe care nimeni n-o are.
    # Semnalul de livrare, urmarit explicit. Un `catch` care doar scrie pe consola
    # lasa exit code-ul 0, iar scriptul se termina cu "Gata." verde: omul citeste
    # ultima linie, comite samanta si deployeaza convins ca a livrat. Adica exact
    # esecul tacut pe care schimbarea asta il elimina, reintrodus in unealta.
    $hubDelivered = $false
    $hubAlreadyHad = $false
    if (-not $SkipHub) {
        $opsToken = $env:SYMBAI_OPS_TOKEN
        $publishUrl = "$($HubUrl.TrimEnd('/'))/api/ops/release/plugin-package?version=$Version"
        if ([string]::IsNullOrWhiteSpace($opsToken)) {
            Write-Host ""
            Write-Host "  ATENTIE: SYMBAI_OPS_TOKEN nu e setat - NU am urcat pachetul la Hub." -ForegroundColor Red
            Write-Host "  Pana nu-l urci, NICIUN client nu primeste versiunea $Version." -ForegroundColor Red
            Write-Host "  Ruleaza dupa ce setezi tokenul:" -ForegroundColor Yellow
            Write-Host "    .\build-package.ps1 -Publish"
        } else {
            try {
                # PowerShell 5.1 negociaza implicit protocoale vechi pe unele masini;
                # fara asta apare un handshake esuat care arata ca o eroare de retea.
                [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

                # Ce are Hub-ul ACUM. Doua lucruri se decid de aici:
                #
                #  1. Republicarea la acelasi numar nu ajunge la nimeni. Clientul
                #     compara numeric (`isNewer` in updater/plugin.go) si sare peste
                #     ce are deja; iar in cache-ul Claude Code copia e fixata pe
                #     versiune. Continut nou sub numar vechi = livrare invizibila,
                #     exact defectul pentru care s-a mutat livrarea de pe GitHub.
                #     Mai rau: daca acel numar a apucat sa fie carantinat pe un
                #     calculator (3 esecuri), acolo nu se mai incearca NICIODATA.
                #  2. Daca ruta raspunde, stim ca tokenul e bun inainte de a urca
                #     1,3 MB.
                $current = $null
                try {
                    $listUrl = "$($HubUrl.TrimEnd('/'))/api/ops/release/plugin-package"
                    $listing = Invoke-RestMethod -Method Get -Uri $listUrl `
                        -Headers @{ Authorization = "Bearer $opsToken" } -TimeoutSec 30
                    $current = $listing.current
                } catch {
                    # Nu blocam publicarea pe o interogare esuata: ruta poate lipsi pe
                    # un Hub mai vechi. Se spune, si se merge mai departe.
                    Write-Host ""
                    Write-Host "  NOTA: nu am putut citi ce e publicat la Hub ($($_.Exception.Message))" -ForegroundColor Yellow
                }
                # `servable` conteaza in conditie, nu doar mai jos: un rand publicat
                # dar care nu trece verificarea de integritate inseamna ca TOTI agentii
                # primesc 503 la nesfarsit. Acolo remediul e chiar reurcarea, iar un
                # refuz cu sfatul "bumpeaza versiunea" ar arde un numar de versiune
                # degeaba si ar lasa flota rupta. La fel si dupa un POST care a reusit
                # pe server dar a expirat la client: starea reala e "livrat", si se
                # spune asta, in loc sa se ceara un bump inutil.
                if ($current -and [string]$current.version -eq $Version -and $current.servable -eq $true -and -not $Republish) {
                    # Marcat separat de un esec de retea: nu e acelasi lucru, iar
                    # ultima linie a scriptului trebuie sa spuna care din doua e.
                    $script:hubAlreadyHad = $true
                    throw "Hub-ul are DEJA publicat $Version (din $($current.publishedAt)). Republicarea la acelasi numar nu ajunge la niciun client care il are deja - bumpeaza versiunea in marketplace.json + plugin.json + .codex-plugin/plugin.json. Daca chiar vrei sa suprascrii: -Republish."
                }
                # -MaximumRedirection 0: la un redirect, .NET converteste POST in GET si
                # arunca corpul. GET-ul ar ateriza pe ruta de LISTARE, montata pe aceeasi
                # cale, care raspunde 200 cu alt continut - adica o publicare care nu s-a
                # intamplat ar arata ca una reusita. Mai bine eroare.
                $resp = Invoke-RestMethod -Method Post -Uri $publishUrl `
                    -Headers @{ Authorization = "Bearer $opsToken" } `
                    -ContentType "application/zip" -InFile $Output -TimeoutSec 120 `
                    -MaximumRedirection 0

                # Livrat inseamna "Hub-ul a confirmat CE trebuia", nu "cererea n-a aruncat".
                # Invoke-RestMethod arunca doar la non-2xx; orice 2xx cu alt corp (proxy,
                # pagina de eroare, ruta gresita) ar trece altfel drept livrare.
                if (-not $resp.sha256 -or [string]$resp.version -ne $Version) {
                    throw "Hub-ul a raspuns 2xx, dar nu cu confirmarea publicarii (version='$($resp.version)'). Publicarea NU e confirmata."
                }

                # Recitire, cu ochii agentului. Randul poate exista si sa fie
                # neservibil: `getLatestPluginPackageContent` recalculeaza sha256-ul
                # continutului si refuza sa-l serveasca daca nu se potriveste (o
                # scriere base64 ciuntita arata identic in metadate). Atunci ruta de
                # update raspunde 503 la toti agentii - la nesfarsit, fiindca 5xx nu
                # consuma incercari - si nimeni n-ar afla, fiindca POST-ul de mai sus
                # a raspuns 201. `servable` e chiar verificarea aia, facuta de Hub.
                $check = Invoke-RestMethod -Method Get -TimeoutSec 30 `
                    -Uri "$($HubUrl.TrimEnd('/'))/api/ops/release/plugin-package" `
                    -Headers @{ Authorization = "Bearer $opsToken" }
                if ([string]$check.current.version -ne $Version) {
                    throw "Dupa publicare, Hub-ul anunta '$($check.current.version)', nu $Version. Publicarea NU e confirmata."
                }
                if ($check.current.servable -ne $true) {
                    throw "Hub-ul are $Version, dar NU o poate servi (arhiva nu trece verificarea de integritate). Agentii ar primi 503 la nesfarsit. Reincearca urcarea."
                }
                $hubDelivered = $true

                # Afisarea nu are voie sa arunce: o exceptie aici ar intra in catch cu
                # $hubDelivered deja $true, deci ar scrie rosu "a esuat" si ar iesi
                # totusi cu 0. Substring pe un sir mai scurt de 12 face exact asta.
                $shaScurt = [string]$resp.sha256
                if ($shaScurt.Length -gt 12) { $shaScurt = $shaScurt.Substring(0, 12) }

                Write-Host ""
                Write-Host ("  urcat la Hub: {0} ({1:N0} octeti, sha256 {2})" -f $resp.version, $resp.sizeBytes, $shaScurt) -ForegroundColor Green
                Write-Host "  clientii cu Symbai Connect il iau la urmatoarea verificare (max 6h)."
            } catch {
                # Un 3xx blocat de -MaximumRedirection 0 arunca InvalidOperationException
                # cu mesajul generic "Operation is not valid...", fara cod de stare. Fara
                # randul de mai jos, cauza reala ramane invizibila exact in cazul pentru
                # care s-a pus parametrul.
                $motiv = $_.Exception.Message
                if ($_.Exception -is [System.InvalidOperationException] -and -not $_.Exception.Response) {
                    $motiv += " (posibil redirect 3xx - blocat intentionat; verifica HubUrl, mai ales http:// in loc de https://)"
                }
                Write-Host ""
                if ($hubAlreadyHad) {
                    # Refuz deliberat, nu esec: "reincearca" ar fi un sfat gresit —
                    # aceeasi comanda va fi refuzata la fel.
                    Write-Host "  OPRIT: $motiv" -ForegroundColor Red
                } else {
                    Write-Host "  ATENTIE: urcarea la Hub a esuat - $motiv" -ForegroundColor Red
                    Write-Host "  Arhiva si version.txt sunt scrise local, dar NICIUN client nu primeste $Version" -ForegroundColor Red
                    Write-Host "  pana nu reusesti urcarea. Reincearca: .\build-package.ps1 -Publish" -ForegroundColor Red
                }
            }
        }
    }

    Write-Host ""
    Write-Host "Mai ramane de facut manual:" -ForegroundColor Cyan
    Write-Host "  git -C `"$nexus`" add plugin server/installer/version.txt"
    Write-Host "  (arhiva intra prin Git LFS - verifica cu: git -C `"$nexus`" lfs status)"

    # Ultima linie si codul de iesire trebuie sa spuna acelasi lucru ca avertismentul
    # de mai sus. Altfel semnalul citit de om (ultima linie, verde) contrazice ce s-a
    # intamplat de fapt.
    if (-not $SkipHub -and -not $hubDelivered) {
        Write-Host ""
        if ($hubAlreadyHad) {
            # Hub-ul ARE versiunea, verificata si servibila; ce n-a plecat e continutul
            # nou de sub acelasi numar. Spus altfel ("Hub-ul NU are $Version") ar
            # trimite omul sa reincerce o urcare care va fi refuzata la fel.
            Write-Host "OPRIT: Hub-ul are deja $Version, servibila - clientii o iau (sau au luat-o) de acolo." -ForegroundColor Yellow
            Write-Host "Daca ai schimbat continutul, bumpeaza versiunea: sub acelasi numar nu ajunge la nimeni." -ForegroundColor Yellow
        } else {
            Write-Host "NELIVRAT: samanta locala e scrisa, dar Hub-ul NU are versiunea $Version." -ForegroundColor Red
            Write-Host "Niciun client cu Symbai Connect nu o primeste pana nu reusesti urcarea." -ForegroundColor Red
        }
        exit 1
    }
}

Write-Host ""
Write-Host "Gata." -ForegroundColor Green

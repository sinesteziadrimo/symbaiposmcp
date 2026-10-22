# Symbai: newer model in the same family (Windows PowerShell 5.1, no Node).
# Twin of model-freshness.mjs for the Connect package: at session start/resume, when the session runs on a pinned
# model older than the newest one of the same family offered by the official picker (Opus 5 while Opus 5.5 exists),
# Claude tells the person and asks whether to switch. Riverside, 20.10.2026: Simina's posting sessions stayed on
# Opus 5 / Sonnet 5 for weeks and nobody knew.
# The catalog comes from the CLI picker (`initialize`, no AI prompt, no MCP, no hooks), cached 12 hours in
# <config>\symbai\model-catalog.json. A stale catalog is read again inside the hook, capped at 3 seconds: with the
# background-only refresh, a PC showed the lock written on 21.10.2026 but never a catalog. If the CLI is slower (a busy
# PC answered in 19 s), the background refresh still runs, for the next session.
# Each session is asked once per newer model. Any failure = the session starts without a notice.
# Keep this file ASCII-only: PowerShell 5.1 reads a BOM-less file as ANSI. The Romanian text lives in
# knowledge\model-nou.md and is read as UTF-8.
param([switch]$Refresh)
$ErrorActionPreference = 'Stop'

$configDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $env:USERPROFILE '.claude' }
$dataDir = Join-Path $configDir 'symbai'
$catalogFile = Join-Path $dataDir 'model-catalog.json'
$announcedFile = Join-Path $dataDir 'model-announced.json'
$lockFile = Join-Path $dataDir 'model-catalog.refresh'
$utf8 = [System.Text.UTF8Encoding]::new($false)

function Read-JsonFile([string]$file) {
    try { if (Test-Path -LiteralPath $file) { return [IO.File]::ReadAllText($file, [Text.Encoding]::UTF8) | ConvertFrom-Json } } catch { }
    return $null
}
function Write-JsonFile([string]$file, $value) {
    [void][IO.Directory]::CreateDirectory($dataDir)
    $temporary = "$file.$PID.tmp"
    [IO.File]::WriteAllText($temporary, ($value | ConvertTo-Json -Depth 6 -Compress), $utf8)
    # Replace keeps the destination readable for a concurrent session (Move-Item -Force deletes it first).
    # [NullString]::Value: a plain $null reaches .NET as "" and Replace rejects it as an illegal backup path.
    if (Test-Path -LiteralPath $file) { [IO.File]::Replace($temporary, $file, [NullString]::Value) } else { [IO.File]::Move($temporary, $file) }
}

function Get-ModelFamily([string]$value, [string]$label) {
    $raw = ("$value").Trim().ToLowerInvariant()
    $context = if ($raw -match '\[([a-z0-9]{1,8})\]$') { $Matches[1] } else { '' }
    $id = $raw -replace '\[[a-z0-9]{1,8}\]$', ''
    if ($id -match '^(opus|sonnet|haiku|fable)$') {
        $tier = $Matches[1]
        if (("$label").Trim() -match '(?:^|\s)(\d+)(?:[.,](\d{1,2}))?(?=\s|$|\))') {
            $minor = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
            return @{ Tier = $tier; Version = [int]$Matches[1] * 100 + $minor; Alias = $true; Context = $context }
        }
        return $null
    }
    if ($id -match '^claude-(opus|sonnet|haiku|fable)-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$') {
        $minor = if ($Matches[3]) { [int]$Matches[3] } else { 0 }
        return @{ Tier = $Matches[1]; Version = [int]$Matches[2] * 100 + $minor; Alias = $false; Context = $context }
    }
    if ($id -match '^claude-(\d+)(?:-(\d{1,2}))?-(opus|sonnet|haiku|fable)(?:-\d{8})?$') {
        $minor = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
        return @{ Tier = $Matches[3]; Version = [int]$Matches[1] * 100 + $minor; Alias = $false; Context = $context }
    }
    return $null
}

function Get-NewerModel([string]$current, $models) {
    if (-not $current) { return $null }
    $own = @($models | Where-Object { $_.value -eq $current } | Select-Object -First 1)
    $family = Get-ModelFamily $current $(if ($own.Count) { $own[0].displayName } else { '' })
    if (-not $family) { return $null }
    $best = $null; $bestFamily = $null
    foreach ($option in @($models)) {
        if (-not $option.value -or $option.value -eq $current) { continue }
        $candidate = Get-ModelFamily $option.value $option.displayName
        if (-not $candidate -or $candidate.Tier -ne $family.Tier -or $candidate.Version -le $family.Version) { continue }
        # Equal version: the same context variant as the session (1M stays 1M), then the explicit ID over the alias.
        $better = -not $bestFamily -or $candidate.Version -gt $bestFamily.Version
        if (-not $better -and $candidate.Version -eq $bestFamily.Version) {
            $sameContext = $candidate.Context -eq $family.Context; $bestSameContext = $bestFamily.Context -eq $family.Context
            $better = ($sameContext -and -not $bestSameContext) -or ($sameContext -eq $bestSameContext -and $bestFamily.Alias -and -not $candidate.Alias)
        }
        if ($better) { $best = $option; $bestFamily = $candidate }
    }
    return $best
}

# The CLI that runs this session, else the newest one installed by the Claude app (as Symbai Connect looks it up).
function Find-ClaudeCli {
    $cli = $env:CLAUDE_CODE_EXECPATH
    if ($cli -and (Test-Path -LiteralPath $cli)) { return $cli }
    $roots = @(Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Packages') -Directory -Filter 'Claude_*' -ErrorAction SilentlyContinue |
        ForEach-Object { Join-Path $_.FullName 'LocalCache\Roaming\Claude\claude-code' }) + @(Join-Path $env:APPDATA 'Claude\claude-code')
    $found = @($roots | Where-Object { Test-Path -LiteralPath $_ } | ForEach-Object { Get-ChildItem -LiteralPath $_ -Recurse -Filter 'claude.exe' -ErrorAction SilentlyContinue } |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1)
    if ($found.Count) { return $found[0].FullName }
    # Only a real executable: Process.Start refuses claude.ps1, and Kill() on claude.cmd stops only cmd.exe.
    $command = @(Get-Command claude -CommandType Application -ErrorAction SilentlyContinue | Where-Object { $_.Source -like '*.exe' } | Select-Object -First 1)
    if ($command.Count) { return $command[0].Source }
    return ''
}

function Update-Catalog([int]$waitMs = 20000) {
    $cli = Find-ClaudeCli
    if (-not $cli) { return $false }
    $psi = New-Object System.Diagnostics.ProcessStartInfo $cli
    $psi.Arguments = '-p --input-format stream-json --output-format stream-json --verbose --strict-mcp-config --mcp-config "{""mcpServers"":{}}" --tools "" --disable-slash-commands --setting-sources "" --settings "{""disableAllHooks"":true}" --no-session-persistence'
    $psi.UseShellExecute = $false; $psi.CreateNoWindow = $true
    $psi.RedirectStandardInput = $true; $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true
    $psi.StandardOutputEncoding = [Text.Encoding]::UTF8
    $psi.WorkingDirectory = $env:USERPROFILE
    foreach ($name in @($psi.EnvironmentVariables.Keys)) {
        if ($name -like 'CLAUDE_CODE_*' -or $name -eq 'CLAUDECODE') { $psi.EnvironmentVariables.Remove($name) }
    }
    $process = [System.Diagnostics.Process]::Start($psi)
    $null = $process.StandardError.ReadToEndAsync()
    $process.StandardInput.WriteLine('{"type":"control_request","request_id":"symbai-models","request":{"subtype":"initialize"}}')
    $process.StandardInput.Close()
    # The answer comes in about a second, but the CLI (or its children) can take seconds to exit: read line by line
    # until the answer or the cap, then stop the CLI without waiting for it.
    $deadline = [DateTime]::UtcNow.AddMilliseconds($waitMs)
    $message = $null
    try {
        while (-not $message) {
            $left = [int]($deadline - [DateTime]::UtcNow).TotalMilliseconds
            if ($left -le 0) { break }
            $next = $process.StandardOutput.ReadLineAsync()
            if (-not $next.Wait($left)) { break }
            $line = $next.Result
            if ($null -eq $line) { break }
            try { $candidate = $line | ConvertFrom-Json } catch { continue }
            if ($candidate.type -eq 'control_response' -and $candidate.response.request_id -eq 'symbai-models') { $message = $candidate }
        }
    } finally { try { if (-not $process.HasExited) { $process.Kill() } } catch { } }
    if (-not $message -or $message.response.subtype -ne 'success') { return $false }
    $models = @($message.response.response.models | Where-Object { $_.value -is [string] -and $_.value -ne 'default' } |
        Select-Object -First 80 | ForEach-Object { [ordered]@{ value = $_.value; displayName = "$($_.displayName)" } })
    if (-not $models.Count) { return $false }
    Write-JsonFile $catalogFile ([ordered]@{ at = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds(); models = $models })
    return $true
}

# Once per 12 hours (and at most every 10 minutes after a failure): the official picker, read now.
function Update-CatalogNow {
    try {
        if ((Test-Path -LiteralPath $lockFile) -and ((Get-Date) - (Get-Item -LiteralPath $lockFile).LastWriteTime).TotalMinutes -lt 10) { return }
        [void][IO.Directory]::CreateDirectory($dataDir)
        [IO.File]::WriteAllText($lockFile, "$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())", $utf8)
        if (Update-Catalog 3000) { return }
        # A busy PC can take 20 s to answer: try again in the background, for the next session. Same PowerShell and the
        # same scriptblock trick as the hook (no -File, so a GPO execution policy does not apply; no path quoting).
        $script = (Join-Path $env:CLAUDE_PLUGIN_ROOT 'scripts\model-freshness.ps1') -replace "'", "''"
        $command = "& ([scriptblock]::Create([IO.File]::ReadAllText('$script', [Text.Encoding]::UTF8))) -Refresh"
        $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($command))
        $shell = [Diagnostics.Process]::GetCurrentProcess().MainModule.FileName
        Start-Process -FilePath $shell -WindowStyle Hidden -ArgumentList "-NoProfile -NonInteractive -EncodedCommand $encoded" | Out-Null
    } catch { }
}

# Long desktop sessions resume or compact without a `model` field: the last assistant message names it.
function Get-TranscriptModel([string]$path) {
    try {
        if (-not $path -or -not (Test-Path -LiteralPath $path)) { return '' }
        $stream = [IO.File]::Open($path, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
        try {
            $length = [Math]::Min($stream.Length, 262144)
            [void]$stream.Seek(-$length, [IO.SeekOrigin]::End)
            $buffer = New-Object byte[] $length
            $read = $stream.Read($buffer, 0, $length)
            $tail = [Text.Encoding]::UTF8.GetString($buffer, 0, $read)
        } finally { $stream.Dispose() }
        $found = [regex]::Matches($tail, '"model":"(claude-[a-z0-9.\-]+(?:\[[a-z0-9]{1,8}\])?)","id":"msg_')
        if ($found.Count) { return $found[$found.Count - 1].Groups[1].Value }
    } catch { }
    return ''
}

if ($Refresh) { try { $null = Update-Catalog 30000 } catch { }; return }

$result = '{"continue":true}'
try {
    $hookInput = [Console]::In.ReadToEnd() | ConvertFrom-Json
    $catalog = Read-JsonFile $catalogFile
    $now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    if (-not $catalog -or -not ($now - [double]$catalog.at -lt 43200000)) { Update-CatalogNow; $fresh = Read-JsonFile $catalogFile; if ($fresh) { $catalog = $fresh } }
    $current = if ($hookInput.model -is [string]) { $hookInput.model.Trim() } else { '' }
    if (-not $current) { $current = Get-TranscriptModel "$($hookInput.transcript_path)" }
    $models = @(if ($catalog) { $catalog.models })
    $better = Get-NewerModel $current $models
    if ($better) {
        $session = "$($hookInput.session_id)"
        $announced = [ordered]@{}
        $saved = Read-JsonFile $announcedFile
        if ($saved) { foreach ($property in $saved.PSObject.Properties) { $announced[$property.Name] = $property.Value } }
        if (-not $session -or $announced[$session] -ne $better.value) {
            if ($session) {
                $announced.Remove($session); $announced[$session] = $better.value
                while ($announced.Count -gt 200) { $announced.RemoveAt(0) }
                Write-JsonFile $announcedFile $announced
            }
            # claude-opus-5[1m] is usually missing from the picker: use the base model label plus "1M".
            $base = $current -replace '\[[a-zA-Z0-9]{1,8}\]$', ''
            $own = @($models | Where-Object { $_.value -eq $current } | Select-Object -First 1)
            if (-not $own.Count) { $own = @($models | Where-Object { $_.value -eq $base } | Select-Object -First 1) }
            $label = $current
            if ($own.Count -and $own[0].displayName) {
                $label = if ($own[0].value -eq $current) { $own[0].displayName } else { "$($own[0].displayName) $($current.Substring($base.Length + 1, $current.Length - $base.Length - 2).ToUpperInvariant())" }
            }
            $values = @{
                current = $label
                currentId = $current
                newer = $(if ($better.displayName) { $better.displayName } else { $better.value })
                newerId = $better.value
            }
            $template = [IO.File]::ReadAllText((Join-Path $env:CLAUDE_PLUGIN_ROOT 'knowledge\model-nou.md'), [Text.Encoding]::UTF8)
            $context = [regex]::Replace($template, '\{(current|currentId|newer|newerId)\}', { param($m) $values[$m.Groups[1].Value] })
            $result = @{ hookSpecificOutput = @{ hookEventName = 'SessionStart'; additionalContext = $context } } | ConvertTo-Json -Depth 4 -Compress
        }
    }
} catch { $result = '{"continue":true}' }
$result

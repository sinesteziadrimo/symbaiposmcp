# Chat-uri comune: copies the Claude desktop app's Code chats between every
# Claude account that has logged in on this PC, so each account's sidebar
# lists all of them.
#
# The app keeps one folder per account and organization:
#   %APPDATA%\Claude\claude-code-sessions\<account>\<org>\local_<id>.json
# Those files are only the sidebar entries; the conversations themselves are
# in %USERPROFILE%\.claude\projects, shared by every account of this Windows
# user. Copies keep the source's modification time, so the newest copy of a
# chat always wins and unchanged chats are never copied twice.
#
# Rules:
# - a chat is added to an account only when its conversation still exists;
# - a chat the account deleted (deleted_<id> marker) is never brought back;
# - the account logged in now only receives new chats: the app holds its
#   list in memory, so its existing files are left alone;
# - other accounts also get newer versions of chats they have, unless they
#   archived them.
#
# Prints one line of JSON. -DryRun reports without writing anything. Each
# added copy is listed in %USERPROFILE%\.claude\chaturi-comune\copii-adaugate.txt.

[CmdletBinding()]
param(
    [string]$Root = (Join-Path $env:APPDATA 'Claude\claude-code-sessions'),
    [string]$Projects = (Join-Path $env:USERPROFILE '.claude\projects'),
    [string]$StateDir = (Join-Path $env:USERPROFILE '.claude\chaturi-comune'),
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$startedAt = Get-Date
$guidPattern = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
$sessionPattern = '^local_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.json$'
$tombstonePattern = '^deleted_([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$'

function Write-Result($result) {
    $result['ms'] = [int]((Get-Date) - $startedAt).TotalMilliseconds
    $result | ConvertTo-Json -Depth 6 -Compress
}

function Read-JsonMap([string]$path) {
    $map = @{}
    if (Test-Path -LiteralPath $path) {
        try {
            $parsed = [IO.File]::ReadAllText($path) | ConvertFrom-Json
            foreach ($property in $parsed.PSObject.Properties) { $map[$property.Name] = $property.Value }
        } catch { }
    }
    return $map
}

function Save-JsonMap([string]$path, $map) {
    $tmp = "$path.tmp-$PID"
    try {
        [IO.File]::WriteAllText($tmp, (([pscustomobject]$map) | ConvertTo-Json -Depth 4 -Compress))
        if ([IO.File]::Exists($path)) { [IO.File]::Replace($tmp, $path, [NullString]::Value) } else { [IO.File]::Move($tmp, $path) }
    } finally {
        if ([IO.File]::Exists($tmp)) { [IO.File]::Delete($tmp) }
    }
}

# One sync at a time on this PC. The lock disappears with the process.
$lockPath = Join-Path $env:TEMP 'chaturi-comune.lock'
function Open-Lock {
    New-Object IO.FileStream($lockPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write,
        [IO.FileShare]::None, 1, [IO.FileOptions]::DeleteOnClose)
}
$lock = $null
try { $lock = Open-Lock } catch {
    $stale = Get-Item -LiteralPath $lockPath -ErrorAction SilentlyContinue
    if ($stale -and $stale.LastWriteTime -lt (Get-Date).AddMinutes(-10)) {
        try { Remove-Item -LiteralPath $lockPath -Force; $lock = Open-Lock } catch { }
    }
}
if (-not $lock) {
    Write-Result @{ ok = $true; busy = $true }
    exit 0
}

try {
    if (-not (Test-Path -LiteralPath $Root)) {
        Write-Result @{ ok = $true; added = 0; updated = 0; accounts = @(); note = 'no-sessions-folder' }
        exit 0
    }

    # Accounts seen by this script: account -> { org, email, lastSeen }.
    $registryPath = Join-Path $StateDir 'conturi.json'
    $cachePath = Join-Path $StateDir 'cache.json'
    $registry = Read-JsonMap $registryPath
    $cache = Read-JsonMap $cachePath

    $activeAccount = $env:CLAUDE_CODE_ACCOUNT_UUID
    $activeOrg = $env:CLAUDE_CODE_ORGANIZATION_UUID
    if ($activeAccount -notmatch $guidPattern -or $activeOrg -notmatch $guidPattern) {
        $activeAccount = $null
        $activeOrg = $null
    }
    if ($activeAccount) {
        $email = $env:CLAUDE_CODE_USER_EMAIL
        if (-not $email -and $registry[$activeAccount]) { $email = $registry[$activeAccount].email }
        $registry[$activeAccount] = [pscustomobject]@{
            org      = $activeOrg
            email    = $email
            lastSeen = $startedAt.ToUniversalTime().ToString('o')
        }
    }

    # The newest copy of every chat, and the folder each account's list lives in.
    $newest = @{}
    $targets = New-Object System.Collections.ArrayList
    foreach ($accountDir in @(Get-ChildItem -LiteralPath $Root -Directory | Where-Object { $_.Name -match $guidPattern })) {
        $filesByOrg = @{}
        foreach ($orgDir in @(Get-ChildItem -LiteralPath $accountDir.FullName -Directory | Where-Object { $_.Name -match $guidPattern })) {
            $files = @(Get-ChildItem -LiteralPath $orgDir.FullName -File -Filter 'local_*.json' |
                Where-Object { $_.Name -match $sessionPattern })
            $filesByOrg[$orgDir.Name] = $files
            foreach ($file in $files) {
                $current = $newest[$file.Name]
                if (-not $current -or $file.LastWriteTimeUtc -gt $current.LastWriteTimeUtc) { $newest[$file.Name] = $file }
            }
        }

        $org = $null
        $known = $registry[$accountDir.Name]
        if ($accountDir.Name -eq $activeAccount) {
            $org = $activeOrg
        } elseif ($known -and $known.org -and $filesByOrg.ContainsKey([string]$known.org)) {
            $org = [string]$known.org
        } else {
            $org = ($filesByOrg.GetEnumerator() | Where-Object { $_.Value.Count -gt 0 } |
                Sort-Object { $_.Value.Count } -Descending | Select-Object -First 1).Key
        }
        if ($org) {
            [void]$targets.Add([pscustomobject]@{
                account  = $accountDir.Name
                org      = $org
                path     = Join-Path $accountDir.FullName $org
                isActive = ($accountDir.Name -eq $activeAccount)
            })
        }
    }
    if ($activeAccount -and -not ($targets | Where-Object { $_.account -eq $activeAccount })) {
        [void]$targets.Add([pscustomobject]@{
            account  = $activeAccount
            org      = $activeOrg
            path     = Join-Path (Join-Path $Root $activeAccount) $activeOrg
            isActive = $true
        })
    }

    # Conversations still on disk, by id.
    $transcripts = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
    if (Test-Path -LiteralPath $Projects) {
        foreach ($projectDir in [IO.Directory]::EnumerateDirectories($Projects)) {
            foreach ($transcript in [IO.Directory]::EnumerateFiles($projectDir, '*.jsonl')) {
                [void]$transcripts.Add([IO.Path]::GetFileNameWithoutExtension($transcript))
            }
        }
    }

    function Get-ConversationId([IO.FileInfo]$file) {
        $stamp = [string]$file.LastWriteTimeUtc.Ticks
        $cached = $cache[$file.Name]
        if ($cached -and $cached.t -eq $stamp) { return [string]$cached.id }
        $match = [regex]::Match([IO.File]::ReadAllText($file.FullName), '"cliSessionId"\s*:\s*"([^"]+)"')
        $id = if ($match.Success) { $match.Groups[1].Value } else { '' }
        $cache[$file.Name] = [pscustomobject]@{ t = $stamp; id = $id }
        return $id
    }

    function Test-Archived([IO.FileInfo]$file) {
        [regex]::IsMatch([IO.File]::ReadAllText($file.FullName), '"isArchived"\s*:\s*true')
    }

    # Set by the app when it quits mid-turn: at its next launch it resumes those
    # chats by itself. A copy must never carry them, or another account would
    # resume (and repeat) work that belongs to the account that ran it.
    $launchMarkers = @('interruptedByQuitAt', 'interruptedUnseenResume', 'interruptedAwaitingPerson',
        'remoteControlLiveAtUpdateQuit', 'armedWorkAtQuit')
    $launchMarkerPattern = '"(interruptedByQuitAt|interruptedUnseenResume|remoteControlLiveAtUpdateQuit|armedWorkAtQuit)"\s*:\s*(?!null\b)'
    $serializer = $null

    function Copy-Chat([IO.FileInfo]$source, [string]$destination) {
        $folder = Split-Path -Parent $destination
        if (-not (Test-Path -LiteralPath $folder)) { New-Item -ItemType Directory -Force -Path $folder | Out-Null }
        $tmp = "$destination.tmp-sync-$PID"
        try {
            $text = [IO.File]::ReadAllText($source.FullName)
            if ($text -match $launchMarkerPattern) {
                if (-not $script:serializer) {
                    Add-Type -AssemblyName System.Web.Extensions
                    $script:serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
                    $script:serializer.MaxJsonLength = [int]::MaxValue
                    $script:serializer.RecursionLimit = 1000
                }
                $record = $script:serializer.DeserializeObject($text)
                foreach ($key in $launchMarkers) { [void]$record.Remove($key) }
                [IO.File]::WriteAllText($tmp, $script:serializer.Serialize($record), (New-Object Text.UTF8Encoding($false)))
            } else {
                [IO.File]::Copy($source.FullName, $tmp, $true)
            }
            if ([IO.File]::Exists($destination)) { [IO.File]::Replace($tmp, $destination, [NullString]::Value) }
            else { [IO.File]::Move($tmp, $destination) }
            [IO.File]::SetLastWriteTimeUtc($destination, $source.LastWriteTimeUtc)
        } finally {
            if ([IO.File]::Exists($tmp)) { [IO.File]::Delete($tmp) }
        }
    }

    $missingConversation = New-Object 'System.Collections.Generic.HashSet[string]'
    $errors = New-Object System.Collections.ArrayList
    $copies = New-Object System.Collections.ArrayList
    $accounts = New-Object System.Collections.ArrayList
    $totalAdded = 0
    $totalUpdated = 0

    foreach ($target in $targets) {
        $existing = @{}
        $deleted = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
        if (Test-Path -LiteralPath $target.path) {
            foreach ($file in @(Get-ChildItem -LiteralPath $target.path -File)) {
                if ($file.Name -match $sessionPattern) { $existing[$file.Name] = $file }
                elseif ($file.Name -match $tombstonePattern) { [void]$deleted.Add("local_$($Matches[1]).json") }
            }
        }

        $added = 0
        $updated = 0
        foreach ($name in @($newest.Keys)) {
            $source = $newest[$name]
            if ($deleted.Contains($name)) { continue }
            $current = $existing[$name]
            try {
                if (-not $current) {
                    $conversationId = Get-ConversationId $source
                    if (-not $conversationId -or -not $transcripts.Contains($conversationId)) {
                        [void]$missingConversation.Add($name)
                        continue
                    }
                    $destination = Join-Path $target.path $name
                    if (-not $DryRun) { Copy-Chat $source $destination }
                    [void]$copies.Add($destination)
                    $added++
                } elseif (-not $target.isActive -and
                    $source.LastWriteTimeUtc -gt $current.LastWriteTimeUtc.AddSeconds(2) -and
                    -not (Test-Archived $current)) {
                    if (-not $DryRun) { Copy-Chat $source $current.FullName }
                    $updated++
                }
            } catch {
                if ($errors.Count -lt 5) { [void]$errors.Add("$name -> $($target.account): $($_.Exception.Message)") }
            }
        }

        $known = $registry[$target.account]
        [void]$accounts.Add([ordered]@{
            account  = $target.account
            email    = if ($known) { $known.email } else { $null }
            isActive = $target.isActive
            chats    = $existing.Count + $added
            added    = $added
            updated  = $updated
        })
        $totalAdded += $added
        $totalUpdated += $updated
    }

    if (-not $DryRun) {
        if (-not (Test-Path -LiteralPath $StateDir)) { New-Item -ItemType Directory -Force -Path $StateDir | Out-Null }
        Save-JsonMap $registryPath $registry
        Save-JsonMap $cachePath $cache
        # Every copy this script added, so they can be removed again.
        if ($copies.Count -gt 0) {
            [IO.File]::AppendAllLines((Join-Path $StateDir 'copii-adaugate.txt'), [string[]]@($copies))
        }
    }

    Write-Result ([ordered]@{
        ok                  = ($errors.Count -eq 0)
        dryRun              = [bool]$DryRun
        added               = $totalAdded
        updated             = $totalUpdated
        withoutConversation = $missingConversation.Count
        accounts            = @($accounts)
        errors              = @($errors)
    })
} finally {
    $lock.Dispose()
}

# Run the packaged "newer model in the same family" hook with native Windows PowerShell and no Node.
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$testRoot = Join-Path $env:TEMP ('symbai-model-test-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $testRoot | Out-Null
$saved = @{ PATH = $env:PATH; CLAUDE_PLUGIN_ROOT = $env:CLAUDE_PLUGIN_ROOT; CLAUDE_CONFIG_DIR = $env:CLAUDE_CONFIG_DIR; CLAUDE_CODE_EXECPATH = $env:CLAUDE_CODE_EXECPATH; LOCALAPPDATA = $env:LOCALAPPDATA; APPDATA = $env:APPDATA }
try {
    $archive = Join-Path $testRoot 'plugin.zip'
    & powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File (Join-Path $repo 'build-package.ps1') -Output $archive
    if ($LASTEXITCODE -ne 0) { throw 'Package failed' }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $unpacked = Join-Path $testRoot "plugin with spaces ' and accents ă"
    [IO.Compression.ZipFile]::ExtractToDirectory($archive, $unpacked)
    $plugin = Join-Path $unpacked 'plugins\symbai-core'
    $hooks = Get-Content (Join-Path $plugin 'hooks\hooks.json') -Raw | ConvertFrom-Json
    $groups = @($hooks.hooks.SessionStart | Where-Object { @($_.hooks | Where-Object { $_.command -like '*model-freshness*' }).Count })
    # No matcher: long desktop sessions reach it on resume and after compaction too.
    if ($groups.Count -ne 1 -or $groups[0].matcher) { throw 'The model hook must run once, on every session start' }
    $hook = @($groups[0].hooks | Where-Object { $_.command -like '*model-freshness*' })[0]
    if ($hook.shell -ne 'powershell' -or $hook.command -like 'node *') { throw 'The model hook must run in native PowerShell without Node' }
    $driver = Join-Path $testRoot 'invoke.ps1'
    [IO.File]::WriteAllText($driver, $hook.command, [Text.UTF8Encoding]::new($false))

    $config = Join-Path $testRoot 'config'
    $data = Join-Path $config 'symbai'
    New-Item -ItemType Directory -Path $data | Out-Null
    $now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    $catalog = @{ at = $now; models = @(
        @{ value = 'opus'; displayName = 'Opus 5.5' }, @{ value = 'opus[1m]'; displayName = 'Opus 5.5 (1M context)' }, @{ value = 'sonnet'; displayName = 'Sonnet 5.5' },
        @{ value = 'claude-opus-5'; displayName = 'Opus 5' }, @{ value = 'claude-sonnet-5'; displayName = 'Sonnet 5' }) }
    [IO.File]::WriteAllText((Join-Path $data 'model-catalog.json'), ($catalog | ConvertTo-Json -Depth 4), [Text.UTF8Encoding]::new($false))

    $ps = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
    $env:PATH = Split-Path $ps -Parent
    $env:CLAUDE_PLUGIN_ROOT = $plugin
    $env:CLAUDE_CONFIG_DIR = $config
    $env:CLAUDE_CODE_EXECPATH = $null
    # The CLI lookup must not find the real Claude app of this PC.
    $env:LOCALAPPDATA = Join-Path $testRoot 'local'; $env:APPDATA = Join-Path $testRoot 'roaming'
    function Read-JsonFileForTest([string]$file) {
        try { if (Test-Path -LiteralPath $file) { return [IO.File]::ReadAllText($file, [Text.Encoding]::UTF8) | ConvertFrom-Json } } catch { }
        return $null
    }
    function Invoke-Hook([string]$json) {
        $raw = $json | & $ps -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $driver
        if ($LASTEXITCODE -ne 0) { throw 'Hook failed without Node' }
        return ($raw -join "`n") | ConvertFrom-Json
    }

    $first = Invoke-Hook '{"session_id":"s1","source":"resume","model":"claude-opus-5"}'
    $context = $first.hookSpecificOutput.additionalContext
    if ($first.hookSpecificOutput.hookEventName -ne 'SessionStart' -or $context -notlike '*Opus 5.5*' -or $context -notlike '*claude-opus-5*') { throw 'Opus 5 must be told about Opus 5.5' }
    $expectedPhrase = [IO.File]::ReadAllText((Join-Path $plugin 'knowledge\model-nou.md'), [Text.Encoding]::UTF8).Split("`n")[0].Split('{')[0]
    if (-not $context.StartsWith($expectedPhrase)) { throw 'The Romanian notice was corrupted' }
    if ($context -match '\{(current|currentId|newer|newerId)\}') { throw 'Placeholders left in the notice' }
    if ((Invoke-Hook '{"session_id":"s1","source":"resume","model":"claude-opus-5"}').continue -ne $true) { throw 'A session is asked only once' }
    if ((Invoke-Hook '{"session_id":"s2","source":"startup","model":"claude-sonnet-5"}').hookSpecificOutput.additionalContext -notlike '*Sonnet 5.5*') { throw 'Sonnet 5 must be told about Sonnet 5.5' }
    $long = (Invoke-Hook '{"session_id":"s8","model":"claude-opus-5[1m]"}').hookSpecificOutput.additionalContext
    if ($long -notlike '*este Opus 5 1M (*') { throw 'A 1M session is named by its base model label' }
    if ($long -notlike '*/model opus`[1m`]*') { throw 'A 1M session is offered the 1M variant of the newer model' }
    if ((Invoke-Hook '{"session_id":"s9","model":"claude-opus-5"}').hookSpecificOutput.additionalContext -notlike '*/model opus``*') { throw 'A 200k session is offered the 200k variant' }
    foreach ($case in '{"session_id":"s3","model":"claude-opus-5-5"}', '{"session_id":"s4","model":"opus"}', '{"session_id":"s5"}', '{"session_id":"s6","model":"claude-haiku-4-5"}', 'not json') {
        if ((Invoke-Hook $case).continue -ne $true) { throw "No notice expected for $case" }
    }

    # Without `model` (resume, compaction) the last assistant message of the transcript names it.
    $transcript = Join-Path $testRoot 'session.jsonl'
    [IO.File]::WriteAllText($transcript, '{"type":"assistant","message":{"model":"claude-sonnet-4-6","id":"msg_1","role":"assistant"}}' + "`n" + '{"type":"assistant","message":{"model":"claude-opus-5","id":"msg_2","role":"assistant"}}' + "`n", [Text.UTF8Encoding]::new($false))
    $fromTranscript = Invoke-Hook ('{"session_id":"s11","source":"compact","transcript_path":' + (ConvertTo-Json $transcript) + '}')
    if ($fromTranscript.hookSpecificOutput.additionalContext -notlike '*Opus 5 (*Opus 5.5*') { throw 'The model must be read from the transcript when the input has none' }

    # A stale catalog without any CLI on the PC: one attempt (lock) and the old catalog still answers.
    $catalog.at = $now - 13 * 3600 * 1000
    [IO.File]::WriteAllText((Join-Path $data 'model-catalog.json'), ($catalog | ConvertTo-Json -Depth 4), [Text.UTF8Encoding]::new($false))
    if ((Invoke-Hook '{"session_id":"s7","model":"claude-opus-5"}').hookSpecificOutput.additionalContext -notlike '*Opus 5.5*') { throw 'A stale catalog still answers' }
    if (-not (Test-Path -LiteralPath (Join-Path $data 'model-catalog.refresh'))) { throw 'A stale catalog must start one refresh' }

    # The refresh inside the hook, end to end, with a fake CLI answering `initialize` like the official picker.
    $fake = Join-Path $testRoot 'fake claude.cmd'
    $response = '{"type":"control_response","response":{"subtype":"success","request_id":"symbai-models","response":{"models":[{"value":"default","displayName":"Default"},{"value":"opus","displayName":"Opus 6"},{"value":"claude-opus-5-5","displayName":"Opus 5.5"}]}}}'
    [IO.File]::WriteAllText($fake, "@echo off`r`necho $response`r`n", [Text.Encoding]::ASCII)
    $env:CLAUDE_CODE_EXECPATH = $fake
    Remove-Item -LiteralPath (Join-Path $data 'model-catalog.json'), (Join-Path $data 'model-catalog.refresh') -Force
    $timer = [Diagnostics.Stopwatch]::StartNew()
    if ((Invoke-Hook '{"session_id":"s10","model":"claude-opus-5-5"}').hookSpecificOutput.additionalContext -notlike '*Opus 6*') { throw 'The first session must read the picker and announce Opus 6 at once' }
    if ($timer.ElapsedMilliseconds -gt 8000) { throw "The hook took $($timer.ElapsedMilliseconds) ms; the cap is 4 s for the CLI" }
    $written = Read-JsonFileForTest (Join-Path $data 'model-catalog.json')
    if (-not $written -or @($written.models).Count -ne 2 -or @($written.models | Where-Object { $_.value -eq 'default' }).Count) { throw 'The refresh must write the picker catalog without "default"' }
    Write-Host 'PASS: packaged native hook, no Node, notice once per session, other families and current models silent, model from the transcript, stale catalog kept, picker read inside the hook, 1M variant kept.'
} finally {
    foreach ($name in $saved.Keys) { Set-Item -Path "env:$name" -Value $saved[$name] -ErrorAction SilentlyContinue; if ($null -eq $saved[$name]) { Remove-Item -Path "env:$name" -ErrorAction SilentlyContinue } }
    $resolved = [IO.Path]::GetFullPath($testRoot)
    $tempRoot = [IO.Path]::GetFullPath($env:TEMP).TrimEnd('\') + '\'
    if (-not $resolved.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase) -or (Split-Path $resolved -Leaf) -notmatch '^symbai-model-test-[a-f0-9]{32}$') { throw 'Unexpected test directory; cleanup refused' }
    Remove-Item -LiteralPath $resolved -Recurse -Force
}

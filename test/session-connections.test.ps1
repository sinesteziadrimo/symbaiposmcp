# Run the actual Connect package hook with native Windows PowerShell and no Node.
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$testRoot = Join-Path $env:TEMP ('symbai-orientation-test-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $testRoot | Out-Null
try {
    $archive = Join-Path $testRoot 'plugin.zip'
    & powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File (Join-Path $repo 'build-package.ps1') -Output $archive
    if ($LASTEXITCODE -ne 0) { throw 'Package failed' }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $unpacked = Join-Path $testRoot "plugin with spaces ' and accents ă"
    [IO.Compression.ZipFile]::ExtractToDirectory($archive, $unpacked)
    $plugin = Join-Path $unpacked 'plugins\symbai-core'
    $hooks = Get-Content (Join-Path $plugin 'hooks\hooks.json') -Raw | ConvertFrom-Json
    $orientation = @($hooks.hooks.SessionStart | ForEach-Object { $_.hooks } | Where-Object { $_.command -like '*session-connections*' })
    if ($orientation.Count -ne 1 -or $orientation[0].shell -ne 'powershell') { throw 'Connect orientation must run in native PowerShell without Node or Git Bash' }
    $driver = Join-Path $testRoot 'invoke.ps1'
    [IO.File]::WriteAllText($driver, $orientation[0].command, [Text.UTF8Encoding]::new($false))
    $savedPath = $env:PATH
    $savedPlugin = $env:CLAUDE_PLUGIN_ROOT
    $ps = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
    try {
        $env:PATH = Split-Path $ps -Parent
        $env:CLAUDE_PLUGIN_ROOT = $plugin
        $actual = & $ps -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $driver | ConvertFrom-Json
        if ($LASTEXITCODE -ne 0) { throw 'Hook failed without Node' }
        $expected = [IO.File]::ReadAllText((Join-Path $plugin 'knowledge\alege-conexiunea.md'), [Text.Encoding]::UTF8)
        if ($actual.hookSpecificOutput.hookEventName -ne 'SessionStart' -or $actual.hookSpecificOutput.additionalContext -cne $expected) { throw 'Orientation context was corrupted or missing' }
        Remove-Item -LiteralPath (Join-Path $plugin 'knowledge\alege-conexiunea.md')
        $missing = & $ps -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $driver | ConvertFrom-Json
        if ($LASTEXITCODE -ne 0 -or $missing.continue -ne $true) { throw 'Missing guide should not break session startup' }
        Write-Host 'PASS: packaged native hook, no Node/Git, UTF-8 and quoted path, missing guide.'
    } finally { $env:PATH = $savedPath; $env:CLAUDE_PLUGIN_ROOT = $savedPlugin }
} finally {
    $resolved = [IO.Path]::GetFullPath($testRoot)
    $tempRoot = [IO.Path]::GetFullPath($env:TEMP).TrimEnd('\') + '\'
    if (-not $resolved.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase) -or (Split-Path $resolved -Leaf) -notmatch '^symbai-orientation-test-[a-f0-9]{32}$') { throw 'Unexpected test directory; cleanup refused' }
    Remove-Item -LiteralPath $resolved -Recurse -Force
}

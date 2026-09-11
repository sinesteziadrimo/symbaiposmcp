# Integration regression: package committed sources even in a shared dirty tree.
# No Hub request, POS seed update, checkout, branch or worktree change.
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$testRoot = Join-Path $env:TEMP ('symbai-package-test-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $testRoot | Out-Null
function EntryBytes($entry) {
    $stream = $entry.Open()
    $buffer = New-Object IO.MemoryStream
    try { $stream.CopyTo($buffer); return ,$buffer.ToArray() } finally { $stream.Dispose(); $buffer.Dispose() }
}
try {
    $commit = & git -C $repo rev-parse HEAD
    if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve test source' }
    $sourceZip = Join-Path $testRoot 'source.zip'
    & git -C $repo archive --format=zip --output=$sourceZip $commit -- .claude-plugin/marketplace.json plugins
    if ($LASTEXITCODE -ne 0) { throw 'Cannot archive test source' }
    $output = Join-Path $testRoot 'package.zip'
    & powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File (Join-Path $repo 'build-package.ps1') -SourceRef $commit -Output $output
    if ($LASTEXITCODE -ne 0) { throw 'Pinned package build failed' }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $expected = [IO.Compression.ZipFile]::OpenRead($sourceZip)
    $actual = [IO.Compression.ZipFile]::OpenRead($output)
    try {
        $files = @($expected.Entries | Where-Object { -not $_.FullName.EndsWith('/') })
        if ($actual.Entries.Count -ne $files.Count) { throw 'Package includes missing or uncommitted files' }
        foreach ($entry in $files) {
            $built = $actual.GetEntry($entry.FullName)
            if (-not $built) { throw "Missing committed file: $($entry.FullName)" }
            if ($entry.FullName -eq 'plugins/symbai-core/hooks/hooks.json') {
                $hooks = [Text.Encoding]::UTF8.GetString((EntryBytes $built)) | ConvertFrom-Json
                foreach ($group in @($hooks.hooks.SessionStart)) {
                    foreach ($hook in @($group.hooks)) {
                        if ($hook.command -eq 'node "${CLAUDE_PLUGIN_ROOT}/scripts/self-heal-marketplace.mjs"') { throw 'Git-only updater survived Connect packaging' }
                    }
                }
                continue
            }
            if ([Convert]::ToBase64String((EntryBytes $entry)) -cne [Convert]::ToBase64String((EntryBytes $built))) {
                throw "Package differs from commit: $($entry.FullName)"
            }
        }
    } finally { $actual.Dispose(); $expected.Dispose() }
    $hash = (Get-FileHash -LiteralPath $output -Algorithm SHA256).Hash
    $invalidLog = Join-Path $testRoot 'invalid-ref.log'
    # Use the same output to prove a failed source resolution cannot replace it.
    $oldErrorAction = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        & powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File (Join-Path $repo 'build-package.ps1') -SourceRef '--invalid-reference' -Output $output *> $invalidLog
        $invalidExit = $LASTEXITCODE
    } finally { $ErrorActionPreference = $oldErrorAction }
    if ($invalidExit -eq 0) { throw 'Invalid source unexpectedly succeeded' }
    if ((Get-FileHash -LiteralPath $output -Algorithm SHA256).Hash -ne $hash) { throw 'Invalid source overwrote the previously built package' }
    Write-Host "PASS: $($files.Count) committed files match; hook transformation retained; invalid ref preserves artifact."
} finally {
    $resolved = [IO.Path]::GetFullPath($testRoot)
    $tempRoot = [IO.Path]::GetFullPath($env:TEMP).TrimEnd('\') + '\'
    if (-not $resolved.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase) -or (Split-Path $resolved -Leaf) -notmatch '^symbai-package-test-[a-f0-9]{32}$') {
        throw 'Unexpected test directory; cleanup refused'
    }
    Remove-Item -LiteralPath $resolved -Recurse -Force
}

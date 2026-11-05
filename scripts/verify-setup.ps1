# Doctor script for this Claude setup: checks runtimes, plugins, skills and MCP servers.
# Usage: ./scripts/verify-setup.ps1
$ErrorActionPreference = 'Continue'
$root = Split-Path $PSScriptRoot -Parent
$claudeHome = Join-Path $env:USERPROFILE '.claude'
$results = @()

function Add-Result($area, $name, $ok, $detail) {
  $script:results += [pscustomobject]@{ Area = $area; Check = $name; Status = $(if ($ok) { 'PASS' } else { 'FAIL' }); Detail = $detail }
}

# --- Runtimes ---
$nodeVer = (node -v) 2>$null
if ($nodeVer) {
  $v = [version]($nodeVer.TrimStart('v'))
  $nodeOk = ($v.Major -eq 20 -and $v.Minor -ge 19) -or ($v.Major -eq 22 -and $v.Minor -ge 12) -or $v.Major -ge 23
  Add-Result 'Runtime' 'Node >= 20.19 (needed by chrome-devtools-mcp)' $nodeOk $nodeVer
} else {
  Add-Result 'Runtime' 'Node installed' $false 'node not found on PATH'
}
$npxVer = (npx -v) 2>$null
Add-Result 'Runtime' 'npx available' ([bool]$npxVer) $npxVer
$git = (git --version) 2>$null
Add-Result 'Runtime' 'git available (plugin marketplaces)' ([bool]$git) $git
$chrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
Add-Result 'Runtime' 'Chrome installed (chrome-devtools-mcp)' ([bool]$chrome) $chrome

# --- Plugins ---
$installedFile = Join-Path $claudeHome 'plugins\installed_plugins.json'
$installed = @{}
if (Test-Path $installedFile) {
  (Get-Content $installedFile -Raw | ConvertFrom-Json).plugins.PSObject.Properties | ForEach-Object { $installed[$_.Name] = $_.Value[0] }
}
$wanted = @{}
foreach ($f in @((Join-Path $claudeHome 'settings.json'), (Join-Path $root '.claude\settings.json'), (Join-Path $root 'test-env\settings.template.json'))) {
  if (Test-Path $f) {
    $s = Get-Content $f -Raw | ConvertFrom-Json
    if ($s.enabledPlugins) { $s.enabledPlugins.PSObject.Properties | ForEach-Object { $wanted[$_.Name] = $true } }
  }
}
foreach ($p in $wanted.Keys) {
  $info = $installed[$p]
  $ok = $info -and (Test-Path $info.installPath)
  Add-Result 'Plugin' $p $ok $(if ($ok) { "v$($info.version)" } else { "not installed: run  claude plugin install $p" })
}

# --- Skills ---
$skillDirs = @()
foreach ($info in $installed.Values) {
  $sd = Join-Path $info.installPath 'skills'
  if (Test-Path $sd) { $skillDirs += Get-ChildItem $sd -Directory }
  if (Test-Path (Join-Path $info.installPath 'SKILL.md')) { $skillDirs += Get-Item $info.installPath }
}
foreach ($d in @((Join-Path $claudeHome 'skills'), (Join-Path $root '.claude\skills'))) {
  if (Test-Path $d) { $skillDirs += Get-ChildItem $d -Directory }
}
foreach ($d in $skillDirs) {
  $md = Join-Path $d.FullName 'SKILL.md'
  $ok = (Test-Path $md) -and ((Get-Content $md -Raw) -match '(?s)^---.*?name:.*?description:.*?---')
  Add-Result 'Skill' $d.Name $ok $(if ($ok) { 'frontmatter OK' } else { 'missing SKILL.md or name/description' })
}

# --- MCP servers ---
$servers = @{}
foreach ($info in $installed.Values) {
  $pj = Join-Path $info.installPath '.claude-plugin\plugin.json'
  if (Test-Path $pj) {
    $j = Get-Content $pj -Raw | ConvertFrom-Json
    if ($j.mcpServers) { $j.mcpServers.PSObject.Properties | ForEach-Object { $servers["plugin:$($j.name):$($_.Name)"] = $_.Value } }
  }
}
$projMcp = Join-Path $root '.mcp.json'
if (Test-Path $projMcp) {
  $j = Get-Content $projMcp -Raw | ConvertFrom-Json
  if ($j.mcpServers) { $j.mcpServers.PSObject.Properties | ForEach-Object { $servers["project:$($_.Name)"] = $_.Value } }
}
foreach ($name in $servers.Keys) {
  $cfg = $servers[$name]
  if ($cfg.url) { Add-Result 'MCP' $name $true "remote: $($cfg.url) (auth checked by Claude at startup)"; continue }
  $cmd = Get-Command $cfg.command -ErrorAction SilentlyContinue
  if (-not $cmd) { Add-Result 'MCP' $name $false "command '$($cfg.command)' not on PATH"; continue }
  # Send an MCP initialize request over stdio and wait for a reply.
  $pkg = $cfg.args | Where-Object { $_ -notmatch '^\$\{|^--prefix$' } | Select-Object -Last 1
  $init = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"verify-setup","version":"1"}}}'
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  # Go through cmd.exe so npx.cmd / .bat shims resolve the same way Claude launches them.
  $psi.FileName = 'cmd.exe'
  $psi.Arguments = "/c $($cfg.command) -y $pkg"
  $psi.RedirectStandardInput = $true; $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false; $psi.CreateNoWindow = $true
  $proc = [System.Diagnostics.Process]::Start($psi)
  $proc.StandardInput.WriteLine($init); $proc.StandardInput.Flush()
  $readTask = $proc.StandardOutput.ReadLineAsync()
  $ok = $readTask.Wait(90000) -and $readTask.Result -match '"result"'
  $detail = if ($ok) { 'initialize handshake OK' } else { ($proc.StandardError.ReadToEndAsync().Result -split "`n" | Select-Object -First 3) -join ' ' }
  if (-not $proc.HasExited) { $proc.Kill() }
  Add-Result 'MCP' $name $ok $detail
}
if ($servers.Count -eq 0) { Add-Result 'MCP' 'any configured' $false 'no MCP servers found' }

$results | Format-Table -AutoSize -Wrap
$fails = @($results | Where-Object Status -eq 'FAIL').Count
Write-Host "`n$($results.Count - $fails)/$($results.Count) checks passed."
exit $fails

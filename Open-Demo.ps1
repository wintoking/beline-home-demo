$ErrorActionPreference = 'Stop'
$demoRoot = $PSScriptRoot
$runtime = Get-ChildItem -LiteralPath 'D:\Codex\Tools\node' -Directory | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'node.exe') } | Select-Object -First 1
if (-not $runtime) { throw '未找到 D 盘 Node.js，请先检查开发环境。' }
$env:TEMP = 'D:\Codex\Temp'
$env:TMP = $env:TEMP
$previewReady = $false
try { $previewReady = (Invoke-WebRequest 'http://127.0.0.1:5180/' -UseBasicParsing -TimeoutSec 2).Content.Contains('必达公寓云') } catch {}
if (-not $previewReady) {
  $logDir = Join-Path $demoRoot '.local'
  New-Item -ItemType Directory -Force -Path $logDir | Out-Null
  Start-Process -FilePath (Join-Path $runtime.FullName 'node.exe') -ArgumentList @((Join-Path $demoRoot 'preview.mjs')) -WorkingDirectory $demoRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDir 'preview.log') -RedirectStandardError (Join-Path $logDir 'preview-error.log')
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    try { $previewReady = (Invoke-WebRequest 'http://127.0.0.1:5180/' -UseBasicParsing -TimeoutSec 1).Content.Contains('必达公寓云'); if ($previewReady) { break } } catch {}
    Start-Sleep -Milliseconds 200
  }
}
if (-not $previewReady) { throw '演示服务启动失败，请查看 demo\.local\preview-error.log，或检查 5180 端口。' }
Start-Process 'http://127.0.0.1:5180/'

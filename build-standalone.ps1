# Rebuilds museum-standalone.html from index.html + styles.css + script.js
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Read-Text($p) { return [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8) }

$html = Read-Text (Join-Path $dir "index.html")
$css  = Read-Text (Join-Path $dir "styles.css")
$js   = Read-Text (Join-Path $dir "script.js")

$linkTag = '<link rel="stylesheet" href="styles.css" />'
$scriptTag = '<script src="script.js"></script>'

if ($html.IndexOf($linkTag) -lt 0) { throw "stylesheet link not found in index.html" }
if ($html.IndexOf($scriptTag) -lt 0) { throw "script tag not found in index.html" }

$html = $html.Replace($linkTag, "<style>" + "`n" + $css + "`n" + "</style>")
$html = $html.Replace($scriptTag, "<script>" + "`n" + $js + "`n" + "</script>")

$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $dir "museum-standalone.html"), $html, $enc)

$bytes = (Get-Item (Join-Path $dir "museum-standalone.html")).Length
Write-Output "museum-standalone.html written: $bytes bytes"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$srcPath  = Join-Path $root 'public\images\Garjane-news-logo.png'
$destPath = Join-Path $root 'public\images\Garjane-news-logo.png'
$backup   = Join-Path $root 'public\images\Garjane-news-logo-original.png'
if (-not (Test-Path $backup)) { Copy-Item $srcPath $backup }

$size = 512
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

function New-RoundRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $p.AddArc($x, $y, $d, $d, 180, 90)
    $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

# Outer layer: rounded square with pink border (like the reference image)
$outerMargin = 6
$border = 14
$outerRect = New-RoundRect $outerMargin $outerMargin ($size - 2*$outerMargin) ($size - 2*$outerMargin) 110
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillPath($whiteBrush, $outerRect)
$pinkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 243, 166, 178), $border)
$g.DrawPath($pinkPen, $outerRect)

# Inner area: logo stretched to cover the layer exactly (clipped to rounded shape)
$inset = $outerMargin + [int]($border / 2) + 2
$iw = $size - 2 * $inset
$innerRect = New-RoundRect $inset $inset $iw $iw 96
$g.SetClip($innerRect)

$logo = [System.Drawing.Image]::FromFile($backup)
# Stretch to fill inner square completely (slight stretch since source is 128x152)
$g.DrawImage($logo, $inset, $inset, $iw, $iw)
$logo.Dispose()
$g.ResetClip()

$g.Dispose()
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$outerRect.Dispose(); $innerRect.Dispose(); $pinkPen.Dispose(); $whiteBrush.Dispose()
Write-Host "Saved restyled logo to $destPath (backup at $backup)"
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

# Outer layer: rounded square filled edge-to-edge with the logo, pink border drawn on top
$margin = 6
$border = 14
$w = $size - 2 * $margin
$outerRect = New-RoundRect $margin $margin $w $w 105

# Logo stretched to cover the FULL layer, edge to edge (clipped to rounded shape)
$logo = [System.Drawing.Image]::FromFile($backup)
$clip = New-RoundRect $margin $margin $w $w 105
$g.SetClip($clip)
$g.DrawImage($logo, $margin, $margin, $w, $w)
$logo.Dispose()
$g.ResetClip()
$clip.Dispose()

# Pink border ring on top, as the outer layer
$pinkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 243, 166, 178), $border)
$g.DrawPath($pinkPen, $outerRect)

$g.Dispose()
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$outerRect.Dispose(); $pinkPen.Dispose()
Write-Host "Saved restyled logo to $destPath (backup at $backup)"
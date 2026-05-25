$files = @(
    "src\app\(admin)\layout.tsx",
    "src\app\(admin)\ppid\page.tsx",
    "src\app\(admin)\site-settings\page.tsx",
    "src\app\(admin)\users\page.tsx",
    "src\app\(admin)\delete-requests\page.tsx",
    "src\app\(admin)\ekstrakurikuler\page.tsx",
    "src\app\(admin)\ekstrakurikuler\[id]\page.tsx",
    "src\app\(admin)\posts\page.tsx",
    "src\app\(admin)\posts\new\page.tsx",
    "src\app\(admin)\posts\[id]\page.tsx",
    "src\app\(admin)\ppid\[id]\page.tsx",
    "src\app\(admin)\slider\page.tsx",
    "src\app\(admin)\slider\[id]\page.tsx",
    "src\components\admin\ThemePicker.tsx",
    "src\components\ppid\PPIDSubPage.tsx"
)

foreach ($f in $files) {
    $path = Join-Path (Get-Location) $f
    if (-not (Test-Path $path)) { Write-Host "NOT FOUND: $f"; continue }
    
    $lines = Get-Content $path
    $newLines = @()
    $added = $false
    
    foreach ($line in $lines) {
        $newLines += $line
        if (-not $added -and $line -match "export default function") {
            $newLines += "  const supabase = getSupabaseBrowser()"
            $added = $true
        }
    }
    
    Set-Content $path $newLines
    Write-Host "Fixed: $f"
}
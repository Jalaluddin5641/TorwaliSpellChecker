Write-Host "=== TORWALI OFFICE ADD-IN PACKAGER ===" -ForegroundColor Cyan
Write-Host ""

# Create temporary folder
if (Test-Path "package_temp") { Remove-Item -Path "package_temp" -Recurse -Force }
New-Item -ItemType Directory -Path "package_temp" | Out-Null

# Copy all required files
Write-Host "Copying files..." -ForegroundColor Yellow
Copy-Item "manifest.xml" -Destination "package_temp\"
Copy-Item "taskpane.html" -Destination "package_temp\"
Copy-Item "taskpane.js" -Destination "package_temp\"
Copy-Item "commands.html" -Destination "package_temp\"
Copy-Item "commands.js" -Destination "package_temp\"
Copy-Item "wordlist.js" -Destination "package_temp\"
Copy-Item "wordlist-data.js" -Destination "package_temp\"

# Copy assets folder
if (Test-Path "assets") {
    Copy-Item "assets" -Destination "package_temp\" -Recurse
}

# Create ZIP from temp folder
Write-Host "Creating package..." -ForegroundColor Yellow
Set-Location "package_temp"
Compress-Archive -Path * -DestinationPath "..\TorwaliSpellChecker.zip" -Force
Set-Location ".."

# Rename to .officeaddin
Rename-Item "TorwaliSpellChecker.zip" "TorwaliSpellChecker.officeaddin"

# Cleanup
Remove-Item -Path "package_temp" -Recurse -Force

Write-Host ""
Write-Host "✅ Package created successfully!" -ForegroundColor Green
Write-Host "📦 File: TorwaliSpellChecker.officeaddin" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Installation methods:" -ForegroundColor Cyan
Write-Host "1. In Word: Insert -> Get Add-ins -> Upload My Add-in -> Browse"
Write-Host "2. Select the .officeaddin file"
Write-Host ""
Write-Host "💡 Tip: You can also double-click the .officeaddin file" -ForegroundColor Yellow

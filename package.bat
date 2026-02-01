@echo off
echo === TORWALI OFFICE ADD-IN PACKAGER ===
echo.

REM Create temporary folder
if exist "package_temp" rmdir /s /q "package_temp"
mkdir "package_temp"

REM Copy all required files
echo Copying files...
copy "manifest.xml" "package_temp\"
copy "taskpane.html" "package_temp\"
copy "taskpane.js" "package_temp\"
copy "wordlist.js" "package_temp\"
copy "wordlist-data.js" "package_temp\"
copy "commands.js" "package_temp\"

REM Create assets folder if needed
if not exist "assets" mkdir "assets"
if exist "assets" xcopy "assets" "package_temp\assets\" /E /I /Y

REM Create ZIP from temp folder
echo Creating package...
cd "package_temp"
powershell -Command "Compress-Archive -Path '*' -DestinationPath '..\TorwaliSpellChecker.zip' -Force"
cd ..

REM Rename to .officeaddin
ren "TorwaliSpellChecker.zip" "TorwaliSpellChecker.officeaddin"

REM Cleanup
rmdir /s /q "package_temp"

echo.
echo ✅ Package created successfully!
echo 📦 File: TorwaliSpellChecker.officeaddin
echo.
echo 📝 Installation methods:
echo 1. DOUBLE-CLICK the .officeaddin file (easiest!)
echo 2. In Word: Insert -> Get Add-ins -> Upload My Add-in -> Browse
echo 3. Select the .officeaddin file
echo.
echo ⚠ If double-click doesn't work:
echo   - Right-click file -> Open With -> Choose Microsoft Word
echo.

REM Open folder to show file
explorer .
pause
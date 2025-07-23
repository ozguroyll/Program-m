@echo off
echo ========================================
echo   Sistem Kontrol Araci
echo ========================================
echo.

echo Python kontrol ediliyor...
python --version
if errorlevel 1 (
    echo [HATA] Python bulunamadi!
    echo Indirme linki: https://www.python.org/downloads/
) else (
    echo [OK] Python bulundu
)
echo.

echo Node.js kontrol ediliyor...
node --version
if errorlevel 1 (
    echo [HATA] Node.js bulunamadi!
    echo Indirme linki: https://nodejs.org/
) else (
    echo [OK] Node.js bulundu
)
echo.

echo npm kontrol ediliyor...
npm --version
if errorlevel 1 (
    echo [HATA] npm bulunamadi!
) else (
    echo [OK] npm bulundu
)
echo.

echo Poetry kontrol ediliyor...
poetry --version
if errorlevel 1 (
    echo [HATA] Poetry bulunamadi!
    echo Kurulum komutu: PowerShell'de asagidaki komutu calistirin
    echo (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
) else (
    echo [OK] Poetry bulundu
)
echo.

echo Git kontrol ediliyor...
git --version
if errorlevel 1 (
    echo [UYARI] Git bulunamadi (opsiyonel)
    echo Indirme linki: https://git-scm.com/download/win
) else (
    echo [OK] Git bulundu
)
echo.

echo ========================================
echo   Port Kontrolleri
echo ========================================
echo.

echo Port 8000 kontrol ediliyor...
netstat -an | find ":8000" >nul
if errorlevel 1 (
    echo [OK] Port 8000 musait
) else (
    echo [UYARI] Port 8000 kullaniliyor
)

echo Port 5173 kontrol ediliyor...
netstat -an | find ":5173" >nul
if errorlevel 1 (
    echo [OK] Port 5173 musait
) else (
    echo [UYARI] Port 5173 kullaniliyor
)
echo.

echo Sistem kontrolu tamamlandi!
pause

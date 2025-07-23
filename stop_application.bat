@echo off
echo ========================================
echo   Hububat Stok Yonetim Sistemi
echo   Uygulama Durduruluyor...
echo ========================================
echo.

echo Backend sunucusu durduruluyor...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    echo Port 8000'deki islem sonlandiriliyor: %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo Frontend sunucusu durduruluyor...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    echo Port 5173'teki islem sonlandiriliyor: %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo Node.js islemleri durduruluyor...
taskkill /IM node.exe /F >nul 2>&1

echo Python islemleri durduruluyor...
taskkill /IM python.exe /F >nul 2>&1

echo.
echo Uygulama basariyla durduruldu!
echo.
pause

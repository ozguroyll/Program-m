@echo off
title Hububat Stok Yonetim Sistemi
echo ========================================
echo   Hububat Stok Yonetim Sistemi
echo   Uygulama Baslatiliyor...
echo ========================================
echo.

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

echo Backend sunucusu baslatiliyor...
cd backend
start "Backend Server" cmd /k "poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 2>&1 | tee ../logs/backend.log"

echo Backend baslatildi, frontend icin bekleniyor...
timeout /t 3 /nobreak >nul

cd ../frontend
echo Frontend sunucusu baslatiliyor...
start "Frontend Server" cmd /k "npm run dev 2>&1 | tee ../logs/frontend.log"

echo.
echo ========================================
echo   UYGULAMA BASLATILDI!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Tarayicinizda http://localhost:5173 adresine gidin
echo.
echo Uygulamayi kapatmak icin acilan terminal pencerelerini kapatin
echo.

REM Wait a bit then try to open browser
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo Tarayici acildi. Iyi calismalar!
pause

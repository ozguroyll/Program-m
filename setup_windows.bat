@echo off
echo ========================================
echo   Hububat Stok Yonetim Sistemi
echo   Windows Otomatik Kurulum
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Python bulunamadi!
    echo Lutfen Python'u yukleyin: https://www.python.org/downloads/
    echo Kurulum sirasinda "Add Python to PATH" secenegini isaretleyin
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Node.js bulunamadi!
    echo Lutfen Node.js yukleyin: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Poetry is installed
poetry --version >nul 2>&1
if errorlevel 1 (
    echo Poetry bulunamadi, yukleniyor...
    echo Poetry kurulumu icin PowerShell acilacak...
    powershell -Command "(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -"
    echo Poetry kuruldu. Lutfen sistemi yeniden baslatip tekrar deneyin.
    pause
    exit /b 1
)

echo Python, Node.js ve Poetry basariyla bulundu!
echo.

echo ========================================
echo   Backend Kurulumu Basliyor...
echo ========================================

cd backend
if not exist "pyproject.toml" (
    echo HATA: Backend klasoru bulunamadi!
    pause
    exit /b 1
)

echo Backend bagimliliklari yukleniyor...
poetry install
if errorlevel 1 (
    echo HATA: Backend bagimliliklari yuklenemedi!
    pause
    exit /b 1
)

echo Veritabani olusturuluyor...
poetry run alembic upgrade head
if errorlevel 1 (
    echo HATA: Veritabani olusturulamadi!
    pause
    exit /b 1
)

echo Ornek veriler yukleniyor...
poetry run python -c "from app.seed_data import seed_database; seed_database()"
if errorlevel 1 (
    echo HATA: Ornek veriler yuklenemedi!
    pause
    exit /b 1
)

cd ..

echo ========================================
echo   Frontend Kurulumu Basliyor...
echo ========================================

cd frontend
if not exist "package.json" (
    echo HATA: Frontend klasoru bulunamadi!
    pause
    exit /b 1
)

echo Frontend bagimliliklari yukleniyor...
npm install
if errorlevel 1 (
    echo HATA: Frontend bagimliliklari yuklenemedi!
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   KURULUM TAMAMLANDI!
echo ========================================
echo.
echo Uygulamayi baslatmak icin:
echo 1. start_application.bat dosyasina cift tiklayin
echo 2. Tarayicinizda http://localhost:5173 adresine gidin
echo.
echo Kurulum basarili! Uygulamayi kullanmaya hazirsiniz.
echo.
pause

# 🪟 Windows için Hububat Stok Yönetim Sistemi - Kurulum Rehberi

## 📋 Windows Sistem Gereksinimleri

- **Windows 10/11** (64-bit önerilen)
- **Python 3.8+** (Microsoft Store'dan veya python.org'dan)
- **Node.js 16+** (nodejs.org'dan)
- **Git** (git-scm.com'dan - opsiyonel)

## 🔧 Otomatik Kurulum (Önerilen)

### 1. Gerekli Yazılımları İndirin ve Kurun

#### Python Kurulumu:
1. [Python İndir](https://www.python.org/downloads/windows/)
2. Kurulum sırasında **"Add Python to PATH"** seçeneğini işaretleyin
3. **"pip"** seçeneğinin seçili olduğundan emin olun

#### Node.js Kurulumu:
1. [Node.js İndir](https://nodejs.org/en/download/)
2. LTS sürümünü seçin
3. Kurulum sırasında tüm varsayılan seçenekleri kabul edin

#### Poetry Kurulumu (Python paket yöneticisi):
1. PowerShell'i **Yönetici olarak** açın
2. Şu komutu çalıştırın:
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

### 2. Projeyi Başlatın

1. **setup_windows.bat** dosyasına çift tıklayın
2. Kurulum otomatik olarak tamamlanacak
3. **start_application.bat** dosyasına çift tıklayın
4. Tarayıcınızda http://localhost:5173 adresine gidin

## 🛠️ Manuel Kurulum

### 1. Proje Dosyalarını Açın
```cmd
cd Program-m
```

### 2. Backend Kurulumu
```cmd
cd backend
poetry install
poetry run alembic upgrade head
poetry run python -c "from app.seed_data import seed_database; seed_database()"
```

### 3. Frontend Kurulumu (Yeni Command Prompt)
```cmd
cd frontend
npm install
```

### 4. Uygulamayı Başlatın

#### Backend'i Başlatın:
```cmd
cd backend
poetry run uvicorn app.main:app --reload
```

#### Frontend'i Başlatın (Yeni Command Prompt):
```cmd
cd frontend
npm run dev
```

## 🚀 Hızlı Başlatma

Kurulum tamamlandıktan sonra:
1. **start_application.bat** dosyasına çift tıklayın
2. Tarayıcınızda http://localhost:5173 adresine gidin

## 🔧 Sorun Giderme

### Python Bulunamıyor Hatası
```cmd
# Python'un yüklendiğini kontrol edin
python --version

# PATH'e ekleyin (Sistem Özellikleri > Gelişmiş > Ortam Değişkenleri)
C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python3x\
C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python3x\Scripts\
```

### Node.js Bulunamıyor Hatası
```cmd
# Node.js'in yüklendiğini kontrol edin
node --version
npm --version

# PATH'e ekleyin
C:\Program Files\nodejs\
```

### Poetry Bulunamıyor Hatası
```cmd
# Poetry'nin yüklendiğini kontrol edin
poetry --version

# PATH'e ekleyin
%APPDATA%\Python\Scripts\
```

### Port Kullanımda Hatası
```cmd
# 8000 portunu kullanan işlemi bulun ve sonlandırın
netstat -ano | findstr :8000
taskkill /PID <PID_NUMARASI> /F

# 5173 portunu kullanan işlemi bulun ve sonlandırın
netstat -ano | findstr :5173
taskkill /PID <PID_NUMARASI> /F
```

## 📊 Sistem Özellikleri

### ✅ Ana Modüller
- **📊 Dashboard**: Gerçek zamanlı iş metrikleri
- **📦 Stok Yönetimi**: Giriş/çıkış, kalite analizi
- **💰 Cari Yönetimi**: Müşteri/tedarikçi hesapları
- **📈 Gelir/Gider**: Finansal takip ve analiz
- **📊 Kar/Zarar**: Karlılık analizi
- **⚙️ Tanımlamalar**: Ürün/firma tanımları

### 🏢 İş Akışı Özellikleri
- **Kızıltepe-Irak Ticareti**: TL alım, USD satış
- **Kalite Analizi**: Protein, hektolitre, rutubet, haşere
- **Depo Yönetimi**: ZAD 1, ZAD 2, yerinde teslimat
- **Masraf Takibi**: Hamal, kepçe, nakliye, gümrük
- **DAP Geliri**: %3 ek gelir hesaplaması
- **Otomatik Muhasebe**: Stok işlemlerinde otomatik kayıtlar

## 🔒 Güvenlik

- Tüm veriler yerel bilgisayarınızda saklanır
- İnternet bağlantısı sadece kurulum için gereklidir
- Verileriniz hiçbir dış sunucuya gönderilmez

## 📞 Destek

Sorun yaşarsanız:
1. **logs** klasöründeki hata dosyalarını kontrol edin
2. Command Prompt'ta hata mesajlarını okuyun
3. Gerekli yazılımların doğru kurulduğunu kontrol edin

## 🎉 Başarılı Kurulum

Sistem başarıyla kurulduğunda:
- Dashboard'da gerçek zamanlı metrikler görünecek
- Tüm modüller çalışır durumda olacak
- Örnek veriler yüklenmiş olacak

**Windows'ta hububat ticareti için hazır! 🌾**

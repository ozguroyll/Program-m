# 🚀 Hububat Ticareti Stok Yönetim Sistemi - Kurulum Rehberi

## 📋 Sistem Gereksinimleri

- **Python 3.8+** (Poetry ile paket yönetimi)
- **Node.js 16+** (npm ile paket yönetimi)
- **Git** (kod indirmek için)

## 🔧 Kurulum Adımları

### 1. Repository'yi İndirin
```bash
git clone https://github.com/ozguroyll/Program-m.git
cd Program-m
```

### 2. Backend Kurulumu
```bash
cd backend

# Poetry kurulumu (eğer yoksa)
curl -sSL https://install.python-poetry.org | python3 -

# Bağımlılıkları yükleyin
poetry install

# Veritabanını başlatın
poetry run alembic upgrade head

# Örnek verileri yükleyin
poetry run python -c "from app.seed_data import seed_database; seed_database()"

# Backend sunucusunu başlatın
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Kurulumu (Yeni Terminal)
```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Frontend sunucusunu başlatın
npm run dev
```

### 4. Sisteme Erişim
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Dokümantasyonu**: http://localhost:8000/docs

## 🎯 Sistem Özellikleri

### ✅ Ana Modüller
1. **📊 Dashboard**: Gerçek zamanlı iş metrikleri
2. **📦 Stok Yönetimi**: Giriş/çıkış, kalite analizi
3. **💰 Cari Yönetimi**: Müşteri/tedarikçi hesapları
4. **📈 Gelir/Gider**: Finansal takip ve analiz
5. **📊 Kar/Zarar**: Karlılık analizi
6. **⚙️ Tanımlamalar**: Ürün/firma tanımları

### 🏢 İş Akışı Özellikleri
- **Kızıltepe-Irak Ticareti**: TL alım, USD satış
- **Kalite Analizi**: Protein, hektolitre, rutubet, haşere
- **Depo Yönetimi**: ZAD 1, ZAD 2, yerinde teslimat
- **Masraf Takibi**: Hamal, kepçe, nakliye, gümrük
- **DAP Geliri**: %3 ek gelir hesaplaması
- **Otomatik Muhasebe**: Stok işlemlerinde otomatik kayıtlar

## 📊 Örnek Veriler

Sistem aşağıdaki örnek verilerle gelir:
- **3 Stok Kaydı**: Sert Buğday, Yumuşak Buğday, Mısır
- **2 Stok Çıkışı**: Müşteri satışları
- **5 Ürün Kategorisi**: Hububat ürünleri
- **Finansal Metrikler**: Gerçekçi iş verileri

## 🔧 Teknik Detaylar

### Backend
- **Framework**: FastAPI
- **Veritabanı**: SQLite (yerel)
- **ORM**: SQLAlchemy
- **Migration**: Alembic
- **API**: RESTful endpoints

### Frontend
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Hooks
- **API Client**: Fetch API

## 🚨 Sorun Giderme

### Backend Başlamıyor
```bash
# Poetry'nin doğru kurulduğunu kontrol edin
poetry --version

# Bağımlılıkları yeniden yükleyin
poetry install --no-cache
```

### Frontend Başlamıyor
```bash
# Node.js versiyonunu kontrol edin
node --version

# npm cache'i temizleyin
npm cache clean --force
npm install
```

### Veritabanı Sorunları
```bash
# Veritabanını sıfırlayın
rm backend/stock_management.db
poetry run alembic upgrade head
poetry run python -c "from app.seed_data import seed_database; seed_database()"
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Terminal çıktılarını kontrol edin
2. Log dosyalarını inceleyin
3. GitHub Issues'da sorun bildirin

## 🎉 Başarılı Kurulum

Sistem başarıyla kurulduğunda:
- Dashboard'da gerçek zamanlı metrikler görünecek
- Tüm modüller çalışır durumda olacak
- API endpoints'leri test edilebilir olacak

**Hububat ticareti işiniz için hazır! 🌾**

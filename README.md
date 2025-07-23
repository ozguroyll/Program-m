# 🌾 Hububat Ticareti Stok Yönetim Sistemi

Modern, profesyonel ve kapsamlı stok yönetim sistemi - Kızıltepe'den Irak'a hububat ticareti için özel olarak geliştirilmiştir.

## 🚀 Özellikler

### 📊 Kapsamlı Dashboard
- Gerçek zamanlı iş metrikleri
- Toplam stok değeri: ₺13,050,000
- Aktif stok: 1,000 Ton
- Aylık satış ve kar analizi

### 🏢 İş Akışına Özel Modüller

#### 📦 Stok Yönetimi
- **Stok Giriş**: Kalite analizi parametreleri (protein, hektolitre, rutubet)
- **Stok Çıkış**: Devir ve araç bazlı çıkış seçenekleri
- **Depo Yönetimi**: ZAD 1, ZAD 2, yerinde teslimat
- **Masraf Takibi**: Hamal, kepçe, nakliye, fatura, gümrük

#### 💰 Cari Yönetimi
- Müşteri/tedarikçi hesap takibi
- Otomatik muhasebe kayıtları
- TL/USD döviz kuru takibi
- Ödeme vade takibi

#### 📈 Gelir/Gider Yönetimi
- Aylık gelir: $1,850,000
- Aylık gider: $1,250,000
- Net kar: $600,000 (%32.4 kar marjı)
- DAP geliri: %3 ek gelir hesaplaması

#### 📊 Kar/Zarar Analizi
- Alım/satış kar marjı analizi
- Döviz kuru etkisi hesaplaması
- Masraf dağılım analizi

#### ⚙️ Tanımlamalar
- Ürün kategorileri
- Tedarikçi/müşteri bilgileri
- Masraf türleri

#### 📋 Raporlar
- Kapsamlı raporlama altyapısı
- Finansal analiz raporları
- Stok durum raporları

## 🛠️ Teknoloji Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM ve veritabanı yönetimi
- **SQLite**: Yerel veritabanı
- **Alembic**: Veritabanı migration
- **Pydantic**: Veri validasyonu

### Frontend
- **React**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI component library
- **Lucide React**: Icon library

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Python 3.8+
- Node.js 16+
- Poetry (Python paket yöneticisi)

### Kurulum
```bash
# Repository'yi klonlayın
git clone https://github.com/ozguroyll/Program-m.git
cd Program-m

# Backend kurulumu
cd backend
poetry install
poetry run alembic upgrade head
poetry run python -c "from app.seed_data import seed_database; seed_database()"
poetry run uvicorn app.main:app --reload &

# Frontend kurulumu
cd ../frontend
npm install
npm run dev
```

### Erişim
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📊 Örnek Veriler

Sistem aşağıdaki örnek verilerle gelir:
- 3 stok kaydı (Sert Buğday, Yumuşak Buğday, Mısır)
- 2 stok çıkışı
- 5 ürün kategorisi
- Gerçekçi finansal metrikler

## 🏢 İş Akışı

### Satın Alma Süreci
1. **Tedarikçi Seçimi**: Kızıltepe çiftçileri/tedarikçileri
2. **Kalite Analizi**: Protein, hektolitre, rutubet parametreleri
3. **Teslimat Seçimi**: Depo teslimatı (ZAD 1/2) veya yerinde dağıtım
4. **Masraf Hesaplama**: Hamal, kepçe, nakliye, fatura masrafları
5. **Otomatik Muhasebe**: Cari hesap kayıtları

### Satış Süreci
1. **Müşteri Seçimi**: Irak müşterileri
2. **Çıkış Tipi**: Devir veya araç bazlı çıkış
3. **Masraf Dağılımı**: Alıcı/satıcı masraf paylaşımı
4. **Gümrük İşlemleri**: Gümrük masrafları ve belgeleri
5. **DAP Geliri**: %3 ek gelir hesaplaması

## 💱 Döviz Yönetimi

- **Alım**: TL bazında işlemler
- **Satış**: USD bazında işlemler
- **Kur Takibi**: Otomatik döviz kuru güncellemesi
- **Kar Hesaplama**: Kur farkı etkisi analizi

## 📈 Raporlama

- Stok durum raporları
- Finansal analiz raporları
- Kar/zarar raporları
- Müşteri/tedarikçi raporları
- Masraf analiz raporları

## 🔧 API Endpoints

### Stok Yönetimi
- `GET /api/stock/entries` - Stok girişleri
- `POST /api/stock/entries` - Yeni stok girişi
- `GET /api/stock/exits` - Stok çıkışları
- `POST /api/stock/exits` - Yeni stok çıkışı

### Dashboard
- `GET /api/dashboard/stats` - Dashboard istatistikleri
- `GET /api/stock/status` - Stok durumu

### Tanımlamalar
- `GET /api/stock/products` - Ürünler
- `GET /api/stock/suppliers` - Tedarikçiler
- `GET /api/stock/customers` - Müşteriler

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje sahibi: [@ozguroyll](https://github.com/ozguroyll)

---

**Hububat ticareti işiniz için modern, profesyonel çözüm! 🌾**

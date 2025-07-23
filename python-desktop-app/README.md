# Stok Muhasebe Sistemi - Python Masaüstü Uygulaması

## Genel Bakış
Bu uygulama, React web uygulamasından dönüştürülmüş profesyonel bir Python masaüstü uygulamasıdır. PyQt6 ve SQLite kullanarak modern ve pratik bir stok muhasebe sistemi sunar.

## Özellikler

### İş Modülleri
- **🏠 Dashboard**: KPI metrikleri, hızlı işlemler, son aktiviteler
- **🔄 Talep Yönetimi**: Müşteri talepleri, tedarikçi teklifleri, otomatik fiyat analizi
- **📦 Stok Yönetimi**: Stok giriş/çıkış, araç takibi, otomatik muhasebe entegrasyonu
- **💰 Gelir/Gider Yönetimi**: Mali kayıtlar, kar-zarar analizi, raporlama
- **👥 Cari Tanımlama**: Müşteri/tedarikçi yönetimi, ürün tanımları
- **🤝 Cari İşlemler**: İşlem kayıtları, hesap ekstreleri, ödeme takibi
- **🏦 Banka Yönetimi**: Banka hesapları, işlem kayıtları, bakiye takibi

### Teknik Özellikler
- **PyQt6** ile modern GUI ve native görünüm
- **SQLite** veritabanı ile yerel veri depolama
- **MVC mimarisi** ile temiz kod yapısı
- **Türkçe dil desteği** ve UTF-8 kodlama
- **Profesyonel veri tabloları** (arama, filtreleme, sıralama, export)
- **Form validasyonu** ve hata yönetimi
- **Excel/CSV/PDF export** işlevselliği
- **Çok para birimi** desteği

## Sistem Gereksinimleri

### Minimum Gereksinimler
- **İşletim Sistemi**: Windows 10/11, macOS 10.14+, Linux (Ubuntu 18.04+)
- **Python**: 3.8 veya üzeri
- **RAM**: 4 GB (8 GB önerilen)
- **Disk Alanı**: 500 MB boş alan
- **Ekran Çözünürlüğü**: 1024x768 (1920x1080 önerilen)

### Önerilen Gereksinimler
- **İşletim Sistemi**: Windows 11, macOS 12+, Linux (Ubuntu 20.04+)
- **Python**: 3.10 veya üzeri
- **RAM**: 8 GB veya üzeri
- **Disk Alanı**: 1 GB boş alan
- **Ekran Çözünürlüğü**: 1920x1080 veya üzeri

## Kurulum Talimatları

### 1. Python Kurulumu
Eğer sisteminizde Python yüklü değilse:
- **Windows**: [python.org](https://python.org) adresinden Python 3.10+ indirin
- **macOS**: `brew install python3` veya python.org'dan indirin
- **Linux**: `sudo apt install python3 python3-pip` (Ubuntu/Debian)

### 2. Bağımlılıkları Yükleme
```bash
# Proje dizinine gidin
cd python-desktop-app

# Sanal ortam oluşturun (önerilen)
python -m venv venv

# Sanal ortamı aktifleştirin
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt
```

### 3. Uygulamayı Çalıştırma
```bash
# Ana dizinde
python src/main.py
```

## Kullanım Kılavuzu

### İlk Çalıştırma
1. Uygulama ilk çalıştırıldığında SQLite veritabanı otomatik oluşturulur
2. Örnek veriler yüklenir (test amaçlı)
3. Ana dashboard ekranı açılır

### Temel İşlemler
1. **Yeni Müşteri Ekleme**: Cari Tanımlama → Yeni Müşteri
2. **Stok Giriş**: Stok Yönetimi → Stok Giriş
3. **Talep Oluşturma**: Talep Yönetimi → Yeni Talep
4. **Gelir Kaydetme**: Gelir/Gider → Gelir Ekle

### Veri Export
- Tüm tablolarda sağ tık → Export seçenekleri
- Excel, CSV, PDF formatları desteklenir
- Filtrelenmiş veriler export edilebilir

## Dosya Yapısı
```
python-desktop-app/
├── src/
│   ├── main.py                     # Uygulama giriş noktası
│   ├── database/
│   │   ├── __init__.py
│   │   └── db_manager.py           # SQLite veritabanı yöneticisi
│   ├── ui/
│   │   ├── __init__.py
│   │   ├── main_window.py          # Ana uygulama penceresi
│   │   ├── components/
│   │   │   ├── __init__.py
│   │   │   ├── metric_card.py      # Dashboard KPI kartları
│   │   │   └── professional_table.py # Gelişmiş veri tablosu
│   │   └── modules/
│   │       ├── __init__.py
│   │       ├── dashboard.py        # Dashboard modülü
│   │       ├── talep_yonetimi.py   # Talep yönetimi
│   │       ├── stok_yonetimi.py    # Stok yönetimi
│   │       ├── gelir_gider_yonetimi.py # Gelir/gider
│   │       ├── cari_tanimlama.py   # Cari tanımlama
│   │       ├── cari_islemler.py    # Cari işlemler
│   │       └── banka_yonetimi.py   # Banka yönetimi
│   ├── business/
│   │   └── __init__.py
│   └── utils/
│       └── __init__.py
├── assets/                         # Uygulama varlıkları
├── database/                       # Veritabanı dosyaları
├── requirements.txt                # Python bağımlılıkları
└── README.md                       # Bu dosya
```

## Veritabanı Şeması

### Ana Tablolar
- **customers**: Müşteri bilgileri
- **suppliers**: Tedarikçi bilgileri
- **products**: Ürün tanımları
- **requests**: Müşteri talepleri
- **offers**: Tedarikçi teklifleri
- **stock_movements**: Stok hareketleri
- **income_expense**: Gelir/gider kayıtları
- **current_accounts**: Cari hesap tanımları
- **current_transactions**: Cari işlemler
- **bank_accounts**: Banka hesapları
- **bank_transactions**: Banka işlemleri

## Sorun Giderme

### Yaygın Sorunlar

#### 1. PyQt6 Kurulum Hatası
```bash
# Windows'ta Visual C++ gerekebilir
# Microsoft Visual C++ Redistributable indirin

# Linux'ta sistem paketleri gerekebilir
sudo apt install python3-pyqt6 python3-pyqt6-dev
```

#### 2. Veritabanı Hatası
```bash
# Veritabanı dosyasını silin ve yeniden oluşturun
rm database/stok_muhasebe.db
python src/main.py
```

#### 3. Encoding Hatası
```bash
# Sistem locale ayarlarını kontrol edin
export LANG=tr_TR.UTF-8
export LC_ALL=tr_TR.UTF-8
```

### Log Dosyaları
Uygulama hataları `logs/` dizininde saklanır.

## Geliştirici Bilgileri

### Teknoloji Stack
- **GUI Framework**: PyQt6
- **Veritabanı**: SQLite3
- **Veri İşleme**: pandas
- **Grafik**: matplotlib, seaborn
- **Export**: openpyxl, xlsxwriter, reportlab
- **Görsel**: Pillow

### Mimari Deseni
- **Model-View-Controller (MVC)**
- **Database Access Layer**
- **Business Logic Layer**
- **Presentation Layer**

## Lisans
Bu proje özel kullanım için geliştirilmiştir.

## İletişim
Teknik destek ve sorularınız için: ozguro.yl@gmail.com

---

**Not**: Bu uygulama React web uygulamasından dönüştürülmüş olup, tüm iş mantığı ve işlevsellik korunmuştur.

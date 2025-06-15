# DASHBOARD TASARIM ÖRNEKLERİ VE GÖRSEL MOCKUP'LAR

## 1. ANA DASHBOARD TASARIMI

### 1.1 Dashboard Layout Şeması
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    STOK YÖNETİM SİSTEMİ - ANA DASHBOARD                         │
│                           Özgür Yılmaz - Çok Şirketli Stok Takibi              │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🏠 Ana Sayfa] [📦 Stok Giriş] [📤 Stok Çıkış] [📊 Raporlar] [⚙️ Ayarlar]    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                KPI KARTLARI                                     │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │   TOPLAM STOK   │ │  GÜNLÜK HAREKET │ │ BEKLEYEN SEVKİYAT│ │  TOPLAM DEĞER   │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │   🏭 15.420 T   │ │   📈 847 T      │ │   🚛 12 Araç    │ │  💰 2.1M USD    │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │ ▲ %12 (Artış)   │ │ ▼ %5 (Azalış)   │ │ ⚠️ Beklemede    │ │ ▲ %8 (Artış)    │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│                          STOK DURUMU VE GRAFİKLER                              │
│ ┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│ │        DEPO BAZLI STOK DURUMU       │ │         AYLIK HAREKET GRAFİĞİ       │ │
│ │                                     │ │                                     │ │
│ │ 🏭 Mersin Antrepo                   │ │     📊 Giriş/Çıkış Trend Analizi   │ │
│ │    ├─ Mısır      : 3.200 T ████████ │ │                                     │ │
│ │    ├─ Buğday     : 2.800 T ███████  │ │        ▄▄▄                         │ │
│ │    └─ Soya K.    : 2.420 T ██████   │ │      ▄▄   ▄▄                       │ │
│ │                                     │ │    ▄▄       ▄▄                     │ │
│ │ 🏭 İstanbul Antrepo                 │ │  ▄▄           ▄▄                   │ │
│ │    ├─ Arpa       : 2.100 T █████    │ │▄▄               ▄▄                 │ │
│ │    ├─ Soya Yağı  : 1.900 T ████     │ │                                     │ │
│ │    └─ Mısır      : 1.200 T ███      │ │ Giriş: 🟢  Çıkış: 🔴  Net: 🟡      │ │
│ │                                     │ │                                     │ │
│ │ 🏭 Samsun Antrepo                   │ │                                     │ │
│ │    ├─ Buğday     : 1.800 T ████     │ │                                     │ │
│ │    └─ Arpa       : 1.000 T ██       │ │                                     │ │
│ └─────────────────────────────────────┘ └─────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│                            ORTAK BAZLI STOK DURUMU                             │
│ ┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│ │           ŞERZAT STOKLARI           │ │           AMANJ STOKLARI            │ │
│ │                                     │ │                                     │ │
│ │ 🤝 Zad Agro Ortaklığı               │ │ 🤝 Global Agro Ortaklığı            │ │
│ │                                     │ │                                     │ │
│ │ Toplam Değer: 1.2M USD             │ │ Toplam Değer: 900K USD             │ │
│ │ Ürün Çeşidi : 5                    │ │ Ürün Çeşidi : 4                    │ │
│ │ Toplam Ton  : 8.420                │ │ Toplam Ton  : 6.200                │ │
│ │                                     │ │                                     │ │
│ │ 📈 Bu Ay Giriş : 420 T             │ │ 📈 Bu Ay Giriş : 380 T             │ │
│ │ 📤 Bu Ay Çıkış : 380 T             │ │ 📤 Bu Ay Çıkış : 420 T             │ │
│ │ 💰 Net Kar     : +15K USD          │ │ 💰 Net Kar     : +12K USD          │ │
│ └─────────────────────────────────────┘ └─────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              SON HAREKETLER                                    │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ TARİH  │ TİP   │ ÜRÜN        │ MİKTAR │ ORTAK  │ DEPO      │ ARAÇ PLAKA    │ │
│ │────────│───────│─────────────│────────│────────│───────────│───────────────│ │
│ │ 15.06  │ Giriş │ Mısır       │ 25 T   │ Şerzat │ Mersin    │ 34 ABC 123    │ │
│ │ 15.06  │ Çıkış │ Buğday      │ 30 T   │ Amanj  │ İstanbul  │ 06 DEF 456    │ │
│ │ 14.06  │ Giriş │ Soya Küsp.  │ 20 T   │ Şerzat │ Samsun    │ 55 GHI 789    │ │
│ │ 14.06  │ Çıkış │ Arpa        │ 28 T   │ Amanj  │ Mersin    │ 01 JKL 012    │ │
│ │ 13.06  │ Giriş │ Soya Yağı   │ 15 T   │ Şerzat │ İstanbul  │ 35 MNO 345    │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2. STOK GİRİŞ FORMU TASARIMI

### 2.1 Ana Giriş Formu
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STOK GİRİŞ İŞLEMİ                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                TEMEL BİLGİLER                                  │
│                                                                                 │
│ Ürün Adı         : [Dropdown ▼] Mısır                                          │
│ Kalite Sınıfı    : [Text Box  ] A Kalite                                      │
│ Miktar (Ton)     : [Number    ] 25.5                                          │
│ Alış Fiyatı      : [Number    ] 250.00  [Dropdown ▼] USD                      │
│ Giriş Yeri       : [Dropdown ▼] Mersin Antrepo                                │
│ Tedarikçi        : [Text Box  ] ABC Tarım Ltd. Şti.                           │
│ Kim Adına        : [Radio ●] Şerzat  [Radio ○] Amanj                          │
│ Teslim Şekli     : [Dropdown ▼] CIF                                           │
│ Menşei           : [Text Box  ] Türkiye                                       │
│ Vade             : [Date     ] 30.07.2024                                     │
│ Ödeme Yapıldı    : [Checkbox ☑] Evet  Nereden: [Text] Ziraat Bankası         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                            ARAÇ BİLGİLERİ [☑] Araç ile Giriş                 │
│                                                                                 │
│ Araç Plaka No    : [Text Box  ] 34 ABC 123                                    │
│ Römork Tipi      : [Dropdown ▼] Damperli                                      │
│ Şoför Adı        : [Text Box  ] Mehmet Yılmaz                                 │
│ Şoför Telefonu   : [Text Box  ] 0532 123 4567                                │
│ Tonaj            : [Number    ] 30                                            │
│ Navlun Tutarı    : [Number    ] 1500.00  [Dropdown ▼] TL                     │
│ Kantar Fişi      : [File Button] [Dosya Seç...] kantar_fisi_001.pdf          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                  MASRAFLAR                                     │
│                                                                                 │
│ Gümrük Masrafı   : [Number    ] 500.00 TL                                     │
│ Antrepo Masrafı  : [Number    ] 200.00 TL                                     │
│ Gözetim Masrafı  : [Number    ] 150.00 TL                                     │
│ Analiz Masrafı   : [Number    ] 100.00 TL                                     │
│ Nakliye (Ton/TL) : [Number    ] 25.00 TL                                      │
│ Hamal (Ton/TL)   : [Number    ] 15.00 TL                                      │
│ Kepçe (Ton/TL)   : [Number    ] 10.00 TL                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                  EVRAKLAR                                      │
│                                                                                 │
│ Fatura           : [File Button] [Dosya Seç...] fatura_001.pdf                │
│ Analiz Raporu    : [File Button] [Dosya Seç...] analiz_001.pdf                │
│ Sertifika        : [File Button] [Dosya Seç...] sertifika_001.pdf             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│        [💾 Kaydet]    [🗑️ Temizle]    [❌ İptal]    [📋 Kopyala]              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 3. STOK ÇIKIŞ FORMU TASARIMI

### 3.1 Ana Çıkış Formu
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STOK ÇIKIŞ İŞLEMİ                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                TEMEL BİLGİLER                                  │
│                                                                                 │
│ Ürün Adı         : [Dropdown ▼] Buğday                                         │
│ Kalite           : [Text Box  ] A Kalite                                       │
│ Miktar (Ton)     : [Number    ] 30.0                                          │
│ Satış Fiyatı     : [Number    ] 280.00  [Dropdown ▼] USD                      │
│ Çıkış Yeri       : [Dropdown ▼] İstanbul Antrepo                              │
│ Satışı Yapan     : [Dropdown ▼] Global Agro                                   │
│ Kim Adına        : [Radio ●] Amanj  [Radio ○] Şerzat                          │
│ Müşteri Firma    : [Text Box  ] Khoshnaw Trading Co.                          │
│ Şehir            : [Text Box  ] Erbil                                          │
│ Cinsi            : [Dropdown ▼] İhracat                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                            ARAÇ BİLGİLERİ [☑] Araç ile Çıkış                 │
│                                                                                 │
│ Araç Plaka No    : [Text Box  ] 06 DEF 456                                    │
│ Römork Tipi      : [Dropdown ▼] Tenteli                                       │
│ Şoför Adı        : [Text Box  ] Ali Özkan                                     │
│ Şoför Telefonu   : [Text Box  ] 0533 987 6543                                │
│ Tonaj            : [Number    ] 32                                            │
│ Navlun Bedeli    : [Number    ] 2000.00  [Dropdown ▼] TL                     │
│ Kantar Fişi      : [File Button] [Dosya Seç...] kantar_cikis_001.pdf         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                  MASRAFLAR                                     │
│                                                                                 │
│ Gümrük Masrafı   : [Number    ] 300.00 TL                                     │
│ Antrepo Masrafı  : [Number    ] 150.00 TL                                     │
│ Gözetim Masrafı  : [Number    ] 100.00 TL                                     │
│ Nakliye (Ton/TL) : [Number    ] 20.00 TL                                      │
│ Hamal (Ton/TL)   : [Number    ] 12.00 TL                                      │
│ Komisyon (Ton/$) : [Number    ] 2.00 USD                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                  EVRAKLAR                                      │
│                                                                                 │
│ Satış Faturası   : [File Button] [Dosya Seç...] satis_fatura_001.pdf         │
│ Sevk İrsaliyesi  : [File Button] [Dosya Seç...] irsaliye_001.pdf             │
│ Gümrük Beyanı    : [File Button] [Dosya Seç...] gumruk_001.pdf               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│        [💾 Kaydet]    [🗑️ Temizle]    [❌ İptal]    [📋 Kopyala]              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 4. ÇOK DİLLİ RAPOR ÖRNEKLERİ

### 4.1 Türkçe Rapor Örneği
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            STOK DURUMU RAPORU                                  │
│                              15 Haziran 2024                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ DEPO ADI        │ ÜRÜN ADI      │ MİKTAR  │ BİRİM FİYAT │ TOPLAM DEĞER │ ORTAK │
│─────────────────│───────────────│─────────│─────────────│──────────────│───────│
│ Mersin Antrepo  │ Mısır         │ 3.200 T │ 250.00 USD  │ 800.000 USD  │ Şerzat│
│ Mersin Antrepo  │ Buğday        │ 2.800 T │ 280.00 USD  │ 784.000 USD  │ Şerzat│
│ İstanbul Antrepo│ Arpa          │ 2.100 T │ 220.00 USD  │ 462.000 USD  │ Amanj │
│ İstanbul Antrepo│ Soya Yağı     │ 1.900 T │ 850.00 USD  │ 1.615.000 USD│ Amanj │
│ Samsun Antrepo  │ Soya Küspesi  │ 1.800 T │ 380.00 USD  │ 684.000 USD  │ Şerzat│
├─────────────────────────────────────────────────────────────────────────────────┤
│ TOPLAM                          │11.800 T │             │ 4.345.000 USD│       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 İngilizce Rapor Örneği
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            STOCK STATUS REPORT                                 │
│                              June 15, 2024                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ WAREHOUSE       │ PRODUCT       │ QUANTITY│ UNIT PRICE  │ TOTAL VALUE  │PARTNER│
│─────────────────│───────────────│─────────│─────────────│──────────────│───────│
│ Mersin Warehouse│ Corn          │ 3,200 T │ 250.00 USD  │ 800,000 USD  │Sherzat│
│ Mersin Warehouse│ Wheat         │ 2,800 T │ 280.00 USD  │ 784,000 USD  │Sherzat│
│ Istanbul Warehs │ Barley        │ 2,100 T │ 220.00 USD  │ 462,000 USD  │ Amanj │
│ Istanbul Warehs │ Soybean Oil   │ 1,900 T │ 850.00 USD  │ 1,615,000 USD│ Amanj │
│ Samsun Warehouse│ Soybean Meal  │ 1,800 T │ 380.00 USD  │ 684,000 USD  │Sherzat│
├─────────────────────────────────────────────────────────────────────────────────┤
│ TOTAL                           │11,800 T │             │ 4,345,000 USD│       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Irak Arapçası Rapor Örneği
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              تقرير حالة المخزون                                │
│                              ١٥ حزيران ٢٠٢٤                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ المستودع        │ المنتج        │ الكمية   │ سعر الوحدة   │ القيمة الكلية │الشريك │
│─────────────────│───────────────│─────────│─────────────│──────────────│───────│
│ مستودع مرسين    │ الذرة         │ ٣٢٠٠ طن │ ٢٥٠ دولار   │ ٨٠٠٠٠٠ دولار │ شيرزات│
│ مستودع مرسين    │ القمح         │ ٢٨٠٠ طن │ ٢٨٠ دولار   │ ٧٨٤٠٠٠ دولار │ شيرزات│
│ مستودع اسطنبول  │ الشعير        │ ٢١٠٠ طن │ ٢٢٠ دولار   │ ٤٦٢٠٠٠ دولار │ أمانج │
│ مستودع اسطنبول  │ زيت الصويا     │ ١٩٠٠ طن │ ٨٥٠ دولار   │ ١٦١٥٠٠٠ دولار│ أمانج │
│ مستودع سامسون   │ كسبة الصويا    │ ١٨٠٠ طن │ ٣٨٠ دولار   │ ٦٨٤٠٠٠ دولار │ شيرزات│
├─────────────────────────────────────────────────────────────────────────────────┤
│ المجموع                         │١١٨٠٠ طن│             │ ٤٣٤٥٠٠٠ دولار│       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 5. EXCEL GRAFİK TASARIMLARI

### 5.1 KPI Kartları Excel Tasarımı
```
Excel Hücre Düzeni:
A1:C3 - Toplam Stok KPI
E1:G3 - Günlük Hareket KPI
I1:K3 - Bekleyen Sevkiyat KPI
M1:O3 - Toplam Değer KPI

Her KPI kartı için:
- Üst satır: Başlık (Bold, 14pt)
- Orta satır: Değer (Bold, 18pt, Mavi)
- Alt satır: Trend (10pt, Yeşil/Kırmızı)
- Kenarlık: Kalın çerçeve
- Arka plan: Açık gri gradient
```

### 5.2 Stok Durumu Tablosu
```
Excel Tablo Formatı:
A5:G20 - Ana stok tablosu
- Başlık satırı: Koyu mavi arka plan, beyaz yazı
- Alternatif satır renkleri: Açık mavi/beyaz
- Sayısal değerler: Sağa hizalı
- Para birimi formatı: #,##0.00 "USD"
- Koşullu biçimlendirme: Stok seviyesine göre renk
```

### 5.3 Grafik Tasarımları
```
Grafik 1: Depo Bazlı Stok Dağılımı (Pasta Grafik)
- Konum: A22:F35
- Renkler: Mavi tonları
- Veri etiketleri: Yüzde + değer

Grafik 2: Aylık Hareket Trendi (Çizgi Grafik)
- Konum: H22:N35
- Giriş: Yeşil çizgi
- Çıkış: Kırmızı çizgi
- Net: Mavi çizgi

Grafik 3: Ortak Bazlı Karşılaştırma (Sütun Grafik)
- Konum: A37:N50
- Şerzat: Mavi sütunlar
- Amanj: Turuncu sütunlar
```

## 6. FORM KONTROL ELEMENTLARı

### 6.1 Dropdown Listeleri
```
Ürün Listesi:
- Kaynak: Urunler!B:B
- Validation: List
- Error Alert: "Geçerli ürün seçiniz"

Para Birimi Listesi:
- Değerler: TL,USD,EUR
- Varsayılan: USD

Depo Listesi:
- Kaynak: Depolar!B:B
- Dinamik güncelleme
```

### 6.2 Veri Doğrulama Kuralları
```
Miktar Alanı:
- Tip: Decimal
- Minimum: 0.1
- Maksimum: 1000
- Hata Mesajı: "0.1 ile 1000 arasında değer giriniz"

Fiyat Alanı:
- Tip: Decimal
- Minimum: 0.01
- Format: Currency
- Hata Mesajı: "Geçerli fiyat giriniz"
```

## 7. RENK PALETİ VE TEMA

### 7.1 Ana Renk Şeması
```
Birincil Renkler:
- Ana Mavi: #1f4e79 (Başlıklar)
- Açık Mavi: #5b9bd5 (Vurgular)
- Koyu Gri: #404040 (Metin)
- Açık Gri: #f2f2f2 (Arka plan)

İkincil Renkler:
- Yeşil: #70ad47 (Pozitif değerler)
- Kırmızı: #c5504b (Negatif değerler)
- Turuncu: #ffc000 (Uyarılar)
- Mor: #7030a0 (Özel durumlar)
```

### 7.2 Tipografi
```
Başlıklar: Calibri Bold 14-16pt
Alt Başlıklar: Calibri Bold 12pt
Normal Metin: Calibri Regular 11pt
Sayısal Değerler: Calibri Bold 11pt
Küçük Notlar: Calibri Regular 9pt
```

## 8. RESPONSIVE TASARIM ÖZELLİKLERİ

### 8.1 Ekran Boyutu Uyumluluğu
```
Büyük Ekran (1920x1080):
- Dashboard: 3 sütun layout
- KPI kartları: 4'lü dizilim
- Grafikler: Yan yana

Orta Ekran (1366x768):
- Dashboard: 2 sütun layout
- KPI kartları: 2x2 dizilim
- Grafikler: Alt alta

Küçük Ekran (1024x768):
- Dashboard: 1 sütun layout
- KPI kartları: Dikey dizilim
- Grafikler: Tek sütun
```

### 8.2 Yazdırma Uyumluluğu
```
Sayfa Düzeni:
- Kağıt: A4 Yatay
- Kenar boşlukları: 2cm
- Başlık/altlık: Şirket logosu
- Sayfa numaraları: Alt ortada
- Tarih/saat: Sağ üst köşe
```

Bu tasarım örnekleri, Excel'in yerleşik özellikleri kullanılarak tamamen ücretsiz bir şekilde uygulanabilir ve profesyonel bir görünüm sağlar.

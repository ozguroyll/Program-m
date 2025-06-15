# EXCEL STOK YÖNETİM SİSTEMİ - KURULUM REHBERİ

## 🎯 SİSTEM GEREKSİNİMLERİ

### Minimum Gereksinimler:
- **Microsoft Excel 2016 veya üzeri** (Office 365, 2019, 2021 desteklenir)
- **Windows 10/11** veya **macOS 10.14+**
- **4 GB RAM** (8 GB önerilir)
- **500 MB boş disk alanı**
- **Makro desteği** (VBA etkin)

### Önemli Notlar:
- ✅ **Tamamen ücretsiz** - Ek lisans gerekmez
- ✅ **İnternet bağlantısı gerekmez** - Yerel çalışır
- ✅ **Ek yazılım gerekmez** - Sadece Excel yeterli
- ✅ **Kolay kurulum** - 5 dakikada hazır

## 📋 HIZLI KURULUM ADIMLARı

### Adım 1: Excel Dosyasını İndirin
1. `Stok_Yonetim_Sistemi.xlsm` dosyasını bilgisayarınıza kaydedin
2. Dosyaya sağ tıklayın → "Özellikler" → "Engeli Kaldır" (varsa)

### Adım 2: Makroları Etkinleştirin
1. Excel dosyasını açın
2. Üst kısımda "Güvenlik Uyarısı" çıkarsa → **"İçeriği Etkinleştir"** tıklayın
3. Dosya → Seçenekler → Güven Merkezi → Makro Ayarları → **"Tüm makroları etkinleştir"** seçin

### Adım 3: Sistemi Başlatın
1. **Alt + F11** tuşlarına basarak VBA editörünü açın
2. **F5** tuşuna basın veya **Çalıştır** → **SistemBaslat** seçin
3. "Sistem Hazır" mesajını bekleyin

### Adım 4: İlk Kullanım
1. **Dashboard** sekmesine gidin
2. **Stok Giriş** butonuna tıklayın
3. Test verisi girin ve sistemi deneyin

## 🏗️ DETAYLI KURULUM ADIMLARı

### 1. EXCEL DOSYASI OLUŞTURMA

#### Adım 1: Yeni Excel Dosyası
```
1. Excel'i açın
2. "Boş çalışma kitabı" seçin
3. Ctrl+S → "Stok_Yonetim_Sistemi.xlsm" olarak kaydedin
4. Dosya türü: "Excel Makro Etkin Çalışma Kitabı (*.xlsm)"
```

#### Adım 2: Sayfa Yapısını Oluşturun

**Ana Sayfalar (Görünür):**
1. **Dashboard** - Ana kontrol paneli
2. **Stok_Giris** - Stok giriş işlemleri
3. **Stok_Cikis** - Stok çıkış işlemleri  
4. **Stok_Durum** - Anlık stok durumu
5. **Raporlar** - Detaylı raporlar
6. **Ayarlar** - Sistem ayarları

**Veri Sayfaları (Gizli):**
7. **Sirketler** - Şirket tanımları
8. **Ortaklar** - Ortak bilgileri
9. **Urunler** - Ürün master data
10. **Depolar** - Depo/antrepo bilgileri
11. **Stok_Hareketleri** - Tüm stok hareketleri
12. **Dil_Cevirileri** - Çok dilli metinler

### 2. VERİ TABLOLARI OLUŞTURMA

#### Sirketler Sayfası:
```
A1: ID | B1: Sirket_Adi | C1: Tip | D1: Aktif
A2: 1  | B2: Yılmaz Transport | C2: Bağımsız | D2: EVET
A3: 2  | B3: Zad Agro | C3: Ortaklık | D3: EVET
A4: 3  | B4: Global Agro | C4: Ortaklık | D4: EVET
A5: 4  | B5: Yılmaz Agro | C5: Bağımsız | D5: EVET
```

#### Ortaklar Sayfası:
```
A1: ID | B1: Ortak_Adi | C1: Sirket_ID | D1: Aktif
A2: 1  | B2: Şerzat | C2: 2 | D2: EVET
A3: 2  | B3: Amanj | C3: 3 | D3: EVET
```

#### Urunler Sayfası:
```
A1: ID | B1: Urun_Adi | C1: Birim | D1: Min_Kalite | E1: Max_Kalite
A2: 1  | B2: Mısır | C2: Ton | D2: 0 | E2: 100
A3: 2  | B3: Buğday | C3: Ton | D3: 0 | E3: 100
A4: 3  | B4: Arpa | C4: Ton | D4: 0 | E4: 100
A5: 4  | B5: Soya Küspesi | C5: Ton | D5: 0 | E5: 100
A6: 5  | B6: Soya Yağı | C6: Ton | D6: 0 | E6: 100
```

#### Depolar Sayfası:
```
A1: ID | B1: Depo_Adi | C1: Sehir | D1: Kapasite | E1: Aktif
A2: 1  | B2: Mersin Antrepo | C2: Mersin | D2: 10000 | E2: EVET
A3: 2  | B3: İstanbul Antrepo | C3: İstanbul | D3: 8000 | E3: EVET
A4: 3  | B4: Samsun Antrepo | C4: Samsun | D4: 6000 | E4: EVET
```

#### Dil_Cevirileri Sayfası:
```
A1: Anahtar | B1: Turkce | C1: Ingilizce | D1: Arapca
A2: stok_durumu | B2: Stok Durumu | C2: Stock Status | D2: حالة المخزون
A3: urun_adi | B3: Ürün Adı | C3: Product Name | D3: اسم المنتج
A4: miktar | B4: Miktar | C4: Quantity | D4: الكمية
A5: birim_fiyat | B5: Birim Fiyat | C5: Unit Price | D5: سعر الوحدة
A6: toplam_deger | B6: Toplam Değer | C6: Total Value | D6: القيمة الإجمالية
A7: depo | B7: Depo | C7: Warehouse | D7: المستودع
A8: ortak | B8: Ortak | C8: Partner | D8: الشريك
```

### 3. STOK HAREKETLERİ TABLOSU

#### Stok_Hareketleri Sayfası:
```
A1: ID | B1: Tarih | C1: Tip | D1: Urun_ID | E1: Miktar | F1: Birim_Fiyat | 
G1: Para_Birimi | H1: Depo_ID | I1: Sirket_ID | J1: Ortak_ID | K1: Tedarikci |
L1: Musteri | M1: Arac_Plaka | N1: Sofor_Adi | O1: Sofor_Tel | P1: Navlun | 
Q1: Masraflar | R1: Komisyon | S1: Durum
```

### 4. DASHBOARD TASARIMI

#### Dashboard Sayfası Düzeni:

**A1:P1 - Başlık Alanı:**
```
A1: "STOK YÖNETİM SİSTEMİ - ANA DASHBOARD"
A2: "Özgür Yılmaz - Çok Şirketli Stok Takibi"
```

**A4:P8 - KPI Kartları:**
```
A4: "TOPLAM STOK (TON)"
C4: =IFERROR(SUMIF(StokHareketleri[Tip],"Giriş",StokHareketleri[Miktar])-SUMIF(StokHareketleri[Tip],"Çıkış",StokHareketleri[Miktar]),0)

E4: "GÜNLÜK HAREKET (TON)"
G4: =IFERROR(SUMIFS(StokHareketleri[Miktar],StokHareketleri[Tarih],TODAY()),0)

I4: "BEKLEYEN SEVKİYAT"
K4: =IFERROR(COUNTIFS(StokHareketleri[Durum],"Beklemede"),0)

M4: "TOPLAM DEĞER (USD)"
O4: =IFERROR(SUMPRODUCT(StokHareketleri[Miktar],StokHareketleri[Birim_Fiyat]),0)
```

**A10:P25 - Stok Durumu Tablosu:**
```
A10: "DEPO ADI" | B10: "ÜRÜN ADI" | C10: "MİKTAR" | D10: "BİRİM FİYAT" | E10: "TOPLAM DEĞER" | F10: "ORTAK"
```

**A27:P40 - Son Hareketler:**
```
A27: "TARİH" | B27: "TİP" | C27: "ÜRÜN" | D27: "MİKTAR" | E27: "ORTAK" | F27: "DEPO" | G27: "ARAÇ PLAKA"
```

## 🧪 SİSTEM TESTİ VE DOĞRULAMA

### Test Senaryoları:

#### 1. Stok Giriş Testi:
```
✅ Normal stok girişi
✅ Araç bilgileri ile giriş
✅ Kapasite aşımı kontrolü
✅ Veri doğrulama testleri
✅ Masraf hesaplama
```

#### 2. Stok Çıkış Testi:
```
✅ Normal stok çıkışı
✅ Stok yeterlilik kontrolü
✅ Kar/zarar hesaplama
✅ Komisyon hesaplama
✅ Müşteri bilgileri
```

#### 3. Rapor Testi:
```
✅ Türkçe rapor oluşturma
✅ İngilizce rapor oluşturma
✅ Arapça rapor oluşturma
✅ PDF export
✅ Excel export
```

## 🚀 İLK KULLANIM REHBERİ

### Sistem Başlatma:
```
1. Excel dosyasını açın
2. Makroları etkinleştirin
3. Alt+F11 → F5 → SistemBaslat çalıştırın
4. "Sistem Hazır" mesajını bekleyin
5. Dashboard sekmesine gidin
```

### İlk Stok Girişi:
```
1. "Stok Giriş" butonuna tıklayın
2. Ürün: Mısır seçin
3. Miktar: 100 girin
4. Fiyat: 250 girin
5. Para Birimi: USD seçin
6. Depo: Mersin Antrepo seçin
7. Ortak: Şerzat seçin
8. "Kaydet" butonuna tıklayın
```

Bu kurulum rehberi ile sisteminiz tamamen hazır ve çalışır durumda olacaktır.

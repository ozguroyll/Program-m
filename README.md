# Stok Muhasebe Lojistik Yönetim Sistemi

Bu proje, çok şirketli yapıda çalışan işletmeler için geliştirilmiş kapsamlı bir stok, muhasebe ve lojistik yönetim sistemidir.

## Özellikler

### Ana Modüller
- **Stok Yönetimi**: Çok müşterili stok takibi, giriş/çıkış işlemleri, depo yönetimi
- **Muhasebe Yönetimi**: Cari hesap yönetimi, mali işlemler, çok para birimli işlemler
- **Lojistik Yönetimi**: Araç filosu yönetimi, sefer takibi, şoför yönetimi
- **Finansal Panel**: Tüm finansal işlemlerin tek panelden yönetimi

### Teknik Özellikler
- WPF/C# ile geliştirilmiş Windows masaüstü uygulaması
- PostgreSQL veritabanı
- Entity Framework Core ORM
- MVVM mimarisi
- Türkçe arayüz
- Rol tabanlı erişim kontrolü

### Desteklenen Şirketler
- Yılmaz Transport
- Zad Agro
- Global Agro
- Yılmaz Agro

### Kullanıcı Rolleri
- Yönetici (Tam yetki)
- Muhasebe Müdürü (Finans ve muhasebe)
- Ön Muhasebe (Sınırlı muhasebe işlemleri)
- Lojistik Müdürü (Lojistik operasyonları)
- Dış Ticaret/Lojistik Operasyon (Operasyonel süreçler)

## Kurulum

### Gereksinimler
- Windows 10/11
- .NET 6.0 veya üzeri
- PostgreSQL 12 veya üzeri
- Visual Studio 2022 (önerilen)

### Veritabanı Kurulumu
1. PostgreSQL'i kurun ve çalıştırın
2. `StokMuhasebeLojistik` adında bir veritabanı oluşturun
3. `appsettings.json` dosyasındaki bağlantı dizesini güncelleyin

### Uygulama Kurulumu
1. Projeyi Visual Studio'da açın
2. NuGet paketlerini geri yükleyin
3. Projeyi derleyin ve çalıştırın

## Varsayılan Giriş Bilgileri

- **Kullanıcı Adı**: admin
- **Şifre**: admin123

Diğer test kullanıcıları:
- muhasebe / admin123
- lojistik / admin123
- onmuhasebe / admin123
- disticaret / admin123

## Kullanım

### Ana Sayfa
Sistem açıldığında dashboard ekranında şirketin genel durumu görüntülenir:
- Toplam stok kalemi sayısı
- Araç filosu bilgileri
- Aktif sefer sayısı
- Müşteri sayısı
- Finansal özet (TL, USD, EUR bakiyeleri)

### Stok Yönetimi
- Yeni stok kalemleri ekleme
- Stok giriş/çıkış işlemleri
- Müşteri bazlı stok takibi
- Çok para birimli fiyatlandırma

### Muhasebe Yönetimi
- Cari hesap tanımlama ve yönetimi
- Mali işlem kayıtları
- Çok para birimli işlemler
- Ödeme yöntemleri yönetimi

### Lojistik Yönetimi
- Araç filosu yönetimi
- Şoför tanımlama ve atama
- Sefer planlama ve takibi
- Sefer durumu güncelleme

### Finansal Panel
- Banka hesapları yönetimi
- Kasa hesapları yönetimi
- Finansal özet raporları
- Son işlemler takibi

## Geliştirme

### Proje Yapısı
```
StokMuhasebeLojistik/
├── Models/              # Veri modelleri
├── Services/            # İş mantığı servisleri
├── ViewModels/          # MVVM view modelleri
├── Views/               # WPF kullanıcı arayüzleri
├── Data/                # Veritabanı context ve seeder
├── Resources/           # Stil ve kaynak dosyaları
└── Converters/          # WPF value converter'ları
```

### Veritabanı Migrasyonları
Entity Framework Code First yaklaşımı kullanılmaktadır. Uygulama ilk çalıştırıldığında veritabanı otomatik olarak oluşturulur ve örnek veriler yüklenir.

## Lisans

Bu proje özel kullanım için geliştirilmiştir.

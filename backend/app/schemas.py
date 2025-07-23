from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class TedarikciBase(BaseModel):
    ad: str
    telefon: Optional[str] = None
    adres: Optional[str] = None
    vergi_no: Optional[str] = None

class TedarikciCreate(TedarikciBase):
    pass

class Tedarikci(TedarikciBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class MusteriBase(BaseModel):
    ad: str
    telefon: Optional[str] = None
    adres: Optional[str] = None
    ulke: Optional[str] = None
    vergi_no: Optional[str] = None

class MusteriCreate(MusteriBase):
    pass

class Musteri(MusteriBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UrunBase(BaseModel):
    ad: str
    kategori: Optional[str] = None
    birim: str = "Ton"

class UrunCreate(UrunBase):
    pass

class Urun(UrunBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class StokKaydiBase(BaseModel):
    urun_id: int
    tedarikci_id: int
    miktar: float
    birim_fiyat: float
    toplam_fiyat: float
    doviz_tipi: str = "TL"
    lokasyon: Optional[str] = None
    adres_adi: Optional[str] = None
    plaka: Optional[str] = None
    sofor_ad: Optional[str] = None
    sofor_telefon: Optional[str] = None
    protein: Optional[float] = None
    hektolitre: Optional[float] = None
    rutubet: Optional[float] = None
    hasere: Optional[float] = None
    embriyo: Optional[float] = None
    donme: Optional[float] = None
    yabanci_madde: Optional[float] = None
    kepce_ucreti: float = 0
    hamal_ucreti: float = 0
    nakliye_ucreti: float = 0
    fatura_ucreti: float = 0
    fatura_alici: str = "Alıcı"
    tarih: Optional[datetime] = None
    odeme_vadesi: Optional[datetime] = None
    aciklama: Optional[str] = None

class StokKaydiCreate(StokKaydiBase):
    pass

class StokKaydi(StokKaydiBase):
    id: int
    created_at: datetime
    urun: Optional[Urun] = None
    tedarikci: Optional[Tedarikci] = None
    
    class Config:
        from_attributes = True

class StokCikisBase(BaseModel):
    stok_kaydi_id: int
    musteri_id: int
    miktar: float
    birim_fiyat: float
    toplam_fiyat: float
    doviz_tipi: str = "USD"
    cikis_tipi: Optional[str] = None
    lokasyon: Optional[str] = None
    plaka: Optional[str] = None
    sofor_ad: Optional[str] = None
    sofor_telefon: Optional[str] = None
    kepce_ucreti: float = 0
    hamal_ucreti: float = 0
    nakliye_ucreti: float = 0
    fatura_ucreti: float = 0
    gumruk_ucreti: float = 0
    fatura_alici: str = "Satıcı"
    tarih: Optional[datetime] = None
    odeme_vadesi: Optional[datetime] = None
    aciklama: Optional[str] = None

class StokCikisCreate(StokCikisBase):
    pass

class StokCikis(StokCikisBase):
    id: int
    created_at: datetime
    musteri: Optional[Musteri] = None
    
    class Config:
        from_attributes = True

class CariKayitBase(BaseModel):
    cari_ad: str
    cari_tipi: Optional[str] = None
    islem_tipi: str
    tutar: float
    doviz_tipi: str = "TL"
    kur: float = 1.0
    referans_no: Optional[str] = None
    stok_referans_id: Optional[int] = None
    tarih: Optional[datetime] = None
    odeme_vadesi: Optional[datetime] = None
    aciklama: Optional[str] = None

class CariKayitCreate(CariKayitBase):
    pass

class CariKayit(CariKayitBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GelirKaydiBase(BaseModel):
    kategori: str
    alt_kategori: Optional[str] = None
    tutar: float
    doviz_tipi: str = "USD"
    kur: float = 1.0
    referans_no: Optional[str] = None
    tarih: Optional[datetime] = None
    aciklama: Optional[str] = None

class GelirKaydiCreate(GelirKaydiBase):
    pass

class GelirKaydi(GelirKaydiBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GiderKaydiBase(BaseModel):
    kategori: str
    alt_kategori: Optional[str] = None
    tutar: float
    doviz_tipi: str = "TL"
    kur: float = 1.0
    referans_no: Optional[str] = None
    tarih: Optional[datetime] = None
    aciklama: Optional[str] = None

class GiderKaydiCreate(GiderKaydiBase):
    pass

class GiderKaydi(GiderKaydiBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class KasaIslemBase(BaseModel):
    islem_tipi: str
    kategori: str
    tutar: float
    doviz_tipi: str = "TL"
    kur: float = 1.0
    cari_id: Optional[int] = None
    referans_no: Optional[str] = None
    tarih: Optional[datetime] = None
    aciklama: Optional[str] = None

class KasaIslemCreate(KasaIslemBase):
    pass

class KasaIslem(KasaIslemBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BankaIslemBase(BaseModel):
    banka_adi: str
    hesap_no: Optional[str] = None
    islem_tipi: str
    tutar: float
    doviz_tipi: str = "TL"
    kur: float = 1.0
    referans_no: Optional[str] = None
    tarih: Optional[datetime] = None
    aciklama: Optional[str] = None

class BankaIslemCreate(BankaIslemBase):
    pass

class BankaIslem(BankaIslemBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class DovizKuruBase(BaseModel):
    doviz_kodu: str
    alis_kuru: float
    satis_kuru: float
    tarih: Optional[datetime] = None
    kaynak: Optional[str] = None

class DovizKuruCreate(DovizKuruBase):
    pass

class DovizKuru(DovizKuruBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    toplam_stok_degeri: float
    bekleyen_odemeler: float
    aylik_satis: float
    kar_orani: float
    aktif_talepler: int
    kritik_stoklar: int

class StokDurumu(BaseModel):
    urun_adi: str
    toplam_miktar: float
    lokasyon: str
    durum: str  # Normal, Kritik, Düşük

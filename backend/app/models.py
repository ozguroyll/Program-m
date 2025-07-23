from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Tedarikci(Base):
    __tablename__ = "tedarikci"
    
    id = Column(Integer, primary_key=True, index=True)
    ad = Column(String(255), nullable=False)
    telefon = Column(String(20))
    adres = Column(Text)
    vergi_no = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    stok_kayitlari = relationship("StokKaydi", back_populates="tedarikci")

class Musteri(Base):
    __tablename__ = "musteri"
    
    id = Column(Integer, primary_key=True, index=True)
    ad = Column(String(255), nullable=False)
    telefon = Column(String(20))
    adres = Column(Text)
    ulke = Column(String(100))
    vergi_no = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    stok_cikislari = relationship("StokCikis", back_populates="musteri")

class Urun(Base):
    __tablename__ = "urun"
    
    id = Column(Integer, primary_key=True, index=True)
    ad = Column(String(255), nullable=False)
    kategori = Column(String(100))
    birim = Column(String(20), default="Ton")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    stok_kayitlari = relationship("StokKaydi", back_populates="urun")

class StokKaydi(Base):
    __tablename__ = "stok_kaydi"
    
    id = Column(Integer, primary_key=True, index=True)
    urun_id = Column(Integer, ForeignKey("urun.id"), nullable=False)
    tedarikci_id = Column(Integer, ForeignKey("tedarikci.id"), nullable=False)
    miktar = Column(Float, nullable=False)
    birim_fiyat = Column(Float, nullable=False)
    toplam_fiyat = Column(Float, nullable=False)
    doviz_tipi = Column(String(10), default="TL")
    lokasyon = Column(String(100))  # ZAD 1, ZAD 2, Yerinde Dağıtım
    adres_adi = Column(String(255))  # Yerinde dağıtım için
    plaka = Column(String(20))  # Araç bazlı giriş için
    sofor_ad = Column(String(100))
    sofor_telefon = Column(String(20))
    
    protein = Column(Float)
    hektolitre = Column(Float)
    rutubet = Column(Float)
    hasere = Column(Float)
    embriyo = Column(Float)
    donme = Column(Float)
    yabanci_madde = Column(Float)
    
    kepce_ucreti = Column(Float, default=0)
    hamal_ucreti = Column(Float, default=0)
    nakliye_ucreti = Column(Float, default=0)
    fatura_ucreti = Column(Float, default=0)
    fatura_alici = Column(String(20), default="Alıcı")  # Alıcı/Satıcı
    
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    odeme_vadesi = Column(DateTime(timezone=True))
    aciklama = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    urun = relationship("Urun", back_populates="stok_kayitlari")
    tedarikci = relationship("Tedarikci", back_populates="stok_kayitlari")

class StokCikis(Base):
    __tablename__ = "stok_cikis"
    
    id = Column(Integer, primary_key=True, index=True)
    stok_kaydi_id = Column(Integer, ForeignKey("stok_kaydi.id"), nullable=False)
    musteri_id = Column(Integer, ForeignKey("musteri.id"), nullable=False)
    miktar = Column(Float, nullable=False)
    birim_fiyat = Column(Float, nullable=False)
    toplam_fiyat = Column(Float, nullable=False)
    doviz_tipi = Column(String(10), default="USD")
    cikis_tipi = Column(String(20))  # Devir, Araç bazlı
    lokasyon = Column(String(100))
    plaka = Column(String(20))  # Araç bazlı çıkış için
    sofor_ad = Column(String(100))
    sofor_telefon = Column(String(20))
    
    kepce_ucreti = Column(Float, default=0)
    hamal_ucreti = Column(Float, default=0)
    nakliye_ucreti = Column(Float, default=0)
    fatura_ucreti = Column(Float, default=0)
    gumruk_ucreti = Column(Float, default=0)
    fatura_alici = Column(String(20), default="Satıcı")  # Alıcı/Satıcı
    
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    odeme_vadesi = Column(DateTime(timezone=True))
    aciklama = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    stok_kaydi = relationship("StokKaydi")
    musteri = relationship("Musteri", back_populates="stok_cikislari")

class CariKayit(Base):
    __tablename__ = "cari_kayit"
    
    id = Column(Integer, primary_key=True, index=True)
    cari_ad = Column(String(255), nullable=False)
    cari_tipi = Column(String(50))  # Müşteri, Tedarikçi, Gümrük, etc.
    islem_tipi = Column(String(20))  # Borç, Alacak
    tutar = Column(Float, nullable=False)
    doviz_tipi = Column(String(10), default="TL")
    kur = Column(Float, default=1.0)
    referans_no = Column(String(100))
    stok_referans_id = Column(Integer)  # StokKaydi veya StokCikis ID'si
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    odeme_vadesi = Column(DateTime(timezone=True))
    aciklama = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GelirKaydi(Base):
    __tablename__ = "gelir_kaydi"
    
    id = Column(Integer, primary_key=True, index=True)
    kategori = Column(String(100), nullable=False)
    alt_kategori = Column(String(100))
    tutar = Column(Float, nullable=False)
    doviz_tipi = Column(String(10), default="USD")
    kur = Column(Float, default=1.0)
    referans_no = Column(String(100))
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    aciklama = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GiderKaydi(Base):
    __tablename__ = "gider_kaydi"
    
    id = Column(Integer, primary_key=True, index=True)
    kategori = Column(String(100), nullable=False)
    alt_kategori = Column(String(100))
    tutar = Column(Float, nullable=False)
    doviz_tipi = Column(String(10), default="TL")
    kur = Column(Float, default=1.0)
    referans_no = Column(String(100))
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    aciklama = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class KasaIslem(Base):
    __tablename__ = "kasa_islem"
    
    id = Column(Integer, primary_key=True, index=True)
    islem_tipi = Column(String(20), nullable=False)  # Giriş, Çıkış
    kategori = Column(String(100), nullable=False)
    tutar = Column(Float, nullable=False)
    doviz_tipi = Column(String(10), default="TL")
    kur = Column(Float, default=1.0)
    cari_id = Column(Integer)
    referans_no = Column(String(100))
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    aciklama = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BankaIslem(Base):
    __tablename__ = "banka_islem"
    
    id = Column(Integer, primary_key=True, index=True)
    banka_adi = Column(String(255), nullable=False)
    hesap_no = Column(String(50))
    islem_tipi = Column(String(20), nullable=False)  # Giriş, Çıkış
    tutar = Column(Float, nullable=False)
    doviz_tipi = Column(String(10), default="TL")
    kur = Column(Float, default=1.0)
    referans_no = Column(String(100))
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    aciklama = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DovizKuru(Base):
    __tablename__ = "doviz_kuru"
    
    id = Column(Integer, primary_key=True, index=True)
    doviz_kodu = Column(String(10), nullable=False)
    alis_kuru = Column(Float, nullable=False)
    satis_kuru = Column(Float, nullable=False)
    tarih = Column(DateTime(timezone=True), server_default=func.now())
    kaynak = Column(String(50))  # TCMB, API, Manuel
    created_at = Column(DateTime(timezone=True), server_default=func.now())

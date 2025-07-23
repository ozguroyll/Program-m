from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from typing import List, Optional
from datetime import datetime, timedelta

from . import models, schemas

def get_tedarikci(db: Session, tedarikci_id: int):
    return db.query(models.Tedarikci).filter(models.Tedarikci.id == tedarikci_id).first()

def get_tedarikci_by_name(db: Session, name: str):
    return db.query(models.Tedarikci).filter(models.Tedarikci.ad == name).first()

def get_tedarikciler(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tedarikci).offset(skip).limit(limit).all()

def create_tedarikci(db: Session, tedarikci: schemas.TedarikciCreate):
    db_tedarikci = models.Tedarikci(**tedarikci.dict())
    db.add(db_tedarikci)
    db.commit()
    db.refresh(db_tedarikci)
    return db_tedarikci

def get_musteri(db: Session, musteri_id: int):
    return db.query(models.Musteri).filter(models.Musteri.id == musteri_id).first()

def get_musteriler(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Musteri).offset(skip).limit(limit).all()

def create_musteri(db: Session, musteri: schemas.MusteriCreate):
    db_musteri = models.Musteri(**musteri.dict())
    db.add(db_musteri)
    db.commit()
    db.refresh(db_musteri)
    return db_musteri

def get_urun(db: Session, urun_id: int):
    return db.query(models.Urun).filter(models.Urun.id == urun_id).first()

def get_urunler(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Urun).offset(skip).limit(limit).all()

def create_urun(db: Session, urun: schemas.UrunCreate):
    db_urun = models.Urun(**urun.dict())
    db.add(db_urun)
    db.commit()
    db.refresh(db_urun)
    return db_urun

def get_stok_kaydi(db: Session, stok_id: int):
    return db.query(models.StokKaydi).filter(models.StokKaydi.id == stok_id).first()

def get_stok_kayitlari(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.StokKaydi).options(
        joinedload(models.StokKaydi.urun),
        joinedload(models.StokKaydi.tedarikci)
    ).offset(skip).limit(limit).all()

def create_stok_kaydi(db: Session, stok: schemas.StokKaydiCreate):
    db_stok = models.StokKaydi(**stok.dict())
    db.add(db_stok)
    db.commit()
    db.refresh(db_stok)
    
    cari_kayit = models.CariKayit(
        cari_ad=db_stok.tedarikci.ad,
        cari_tipi="Tedarikçi",
        islem_tipi="Borç",
        tutar=db_stok.toplam_fiyat,
        doviz_tipi=db_stok.doviz_tipi,
        referans_no=f"STOK-{db_stok.id}",
        stok_referans_id=db_stok.id,
        tarih=db_stok.tarih,
        odeme_vadesi=db_stok.odeme_vadesi,
        aciklama=f"Stok girişi - {db_stok.urun.ad}"
    )
    db.add(cari_kayit)
    db.commit()
    
    return db_stok

def get_stok_cikis(db: Session, cikis_id: int):
    return db.query(models.StokCikis).filter(models.StokCikis.id == cikis_id).first()

def get_stok_cikislari(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.StokCikis).options(
        joinedload(models.StokCikis.musteri)
    ).offset(skip).limit(limit).all()

def create_stok_cikis(db: Session, cikis: schemas.StokCikisCreate):
    db_cikis = models.StokCikis(**cikis.dict())
    db.add(db_cikis)
    db.commit()
    db.refresh(db_cikis)
    
    cari_kayit = models.CariKayit(
        cari_ad=db_cikis.musteri.ad,
        cari_tipi="Müşteri",
        islem_tipi="Alacak",
        tutar=db_cikis.toplam_fiyat,
        doviz_tipi=db_cikis.doviz_tipi,
        referans_no=f"SATIS-{db_cikis.id}",
        stok_referans_id=db_cikis.id,
        tarih=db_cikis.tarih,
        odeme_vadesi=db_cikis.odeme_vadesi,
        aciklama=f"Stok satışı"
    )
    db.add(cari_kayit)
    db.commit()
    
    return db_cikis

def get_cari_kayit(db: Session, cari_id: int):
    return db.query(models.CariKayit).filter(models.CariKayit.id == cari_id).first()

def get_cari_kayitlari(db: Session, skip: int = 0, limit: int = 100, cari_ad: Optional[str] = None):
    query = db.query(models.CariKayit)
    if cari_ad:
        query = query.filter(models.CariKayit.cari_ad.contains(cari_ad))
    return query.offset(skip).limit(limit).all()

def create_cari_kayit(db: Session, cari: schemas.CariKayitCreate):
    db_cari = models.CariKayit(**cari.dict())
    db.add(db_cari)
    db.commit()
    db.refresh(db_cari)
    return db_cari

def get_cari_bakiye(db: Session, cari_ad: str):
    borc_toplam = db.query(func.sum(models.CariKayit.tutar)).filter(
        and_(models.CariKayit.cari_ad == cari_ad, models.CariKayit.islem_tipi == "Borç")
    ).scalar() or 0
    
    alacak_toplam = db.query(func.sum(models.CariKayit.tutar)).filter(
        and_(models.CariKayit.cari_ad == cari_ad, models.CariKayit.islem_tipi == "Alacak")
    ).scalar() or 0
    
    return {
        "cari_ad": cari_ad,
        "borc_toplam": borc_toplam,
        "alacak_toplam": alacak_toplam,
        "bakiye": alacak_toplam - borc_toplam
    }

def get_gelir_kayitlari(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.GelirKaydi).offset(skip).limit(limit).all()

def create_gelir_kaydi(db: Session, gelir: schemas.GelirKaydiCreate):
    db_gelir = models.GelirKaydi(**gelir.dict())
    db.add(db_gelir)
    db.commit()
    db.refresh(db_gelir)
    return db_gelir

def get_gider_kayitlari(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.GiderKaydi).offset(skip).limit(limit).all()

def create_gider_kaydi(db: Session, gider: schemas.GiderKaydiCreate):
    db_gider = models.GiderKaydi(**gider.dict())
    db.add(db_gider)
    db.commit()
    db.refresh(db_gider)
    return db_gider

def get_kasa_islemleri(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.KasaIslem).offset(skip).limit(limit).all()

def create_kasa_islem(db: Session, kasa: schemas.KasaIslemCreate):
    db_kasa = models.KasaIslem(**kasa.dict())
    db.add(db_kasa)
    db.commit()
    db.refresh(db_kasa)
    return db_kasa

def get_kasa_bakiye(db: Session, doviz_tipi: str = "TL"):
    giren = db.query(func.sum(models.KasaIslem.tutar)).filter(
        and_(models.KasaIslem.doviz_tipi == doviz_tipi, models.KasaIslem.islem_tipi == "Giriş")
    ).scalar() or 0
    
    cikan = db.query(func.sum(models.KasaIslem.tutar)).filter(
        and_(models.KasaIslem.doviz_tipi == doviz_tipi, models.KasaIslem.islem_tipi == "Çıkış")
    ).scalar() or 0
    
    return {
        "doviz_tipi": doviz_tipi,
        "giren": giren,
        "cikan": cikan,
        "bakiye": giren - cikan
    }

def get_banka_islemleri(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.BankaIslem).offset(skip).limit(limit).all()

def create_banka_islem(db: Session, banka: schemas.BankaIslemCreate):
    db_banka = models.BankaIslem(**banka.dict())
    db.add(db_banka)
    db.commit()
    db.refresh(db_banka)
    return db_banka

def get_doviz_kurları(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DovizKuru).order_by(models.DovizKuru.tarih.desc()).offset(skip).limit(limit).all()

def create_doviz_kuru(db: Session, kur: schemas.DovizKuruCreate):
    db_kur = models.DovizKuru(**kur.dict())
    db.add(db_kur)
    db.commit()
    db.refresh(db_kur)
    return db_kur

def get_guncel_kur(db: Session, doviz_kodu: str):
    return db.query(models.DovizKuru).filter(
        models.DovizKuru.doviz_kodu == doviz_kodu
    ).order_by(models.DovizKuru.tarih.desc()).first()

def get_dashboard_stats(db: Session):
    stok_degeri = db.query(func.sum(models.StokKaydi.toplam_fiyat)).scalar() or 0
    
    bekleyen_odemeler = db.query(func.sum(models.CariKayit.tutar)).filter(
        and_(
            models.CariKayit.islem_tipi == "Borç",
            models.CariKayit.odeme_vadesi > datetime.now()
        )
    ).scalar() or 0
    
    son_30_gun = datetime.now() - timedelta(days=30)
    aylik_satis = db.query(func.sum(models.StokCikis.toplam_fiyat)).filter(
        models.StokCikis.tarih >= son_30_gun
    ).scalar() or 0
    
    aktif_talepler = 5
    
    kritik_stoklar = 2
    
    return schemas.DashboardStats(
        toplam_stok_degeri=stok_degeri,
        bekleyen_odemeler=bekleyen_odemeler,
        aylik_satis=aylik_satis,
        kar_orani=15.5,
        aktif_talepler=aktif_talepler,
        kritik_stoklar=kritik_stoklar
    )

def get_stok_durumu(db: Session):
    stoklar = db.query(
        models.Urun.ad,
        func.sum(models.StokKaydi.miktar).label('toplam_miktar'),
        models.StokKaydi.lokasyon
    ).join(models.StokKaydi).group_by(
        models.Urun.ad, models.StokKaydi.lokasyon
    ).all()
    
    stok_durumu = []
    for stok in stoklar:
        durum = "Normal"
        if stok.toplam_miktar < 1000:
            durum = "Düşük"
        elif stok.toplam_miktar < 500:
            durum = "Kritik"
            
        stok_durumu.append(schemas.StokDurumu(
            urun_adi=stok.ad,
            toplam_miktar=stok.toplam_miktar,
            lokasyon=stok.lokasyon or "Belirtilmemiş",
            durum=durum
        ))
    
    return stok_durumu

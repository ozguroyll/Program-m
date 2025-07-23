from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from .database import SessionLocal
from . import models

def create_sample_data():
    db = SessionLocal()
    
    try:
        suppliers = [
            models.Tedarikci(ad="Halim Dölek", telefon="0532-123-4567", adres="Kızıltepe/Mardin", vergi_no="12345678901"),
            models.Tedarikci(ad="Mehmet Çiftçi", telefon="0533-234-5678", adres="Kızıltepe/Mardin", vergi_no="23456789012"),
            models.Tedarikci(ad="Ali Tarım", telefon="0534-345-6789", adres="Kızıltepe/Mardin", vergi_no="34567890123"),
        ]
        
        for supplier in suppliers:
            db.add(supplier)
        db.commit()
        
        customers = [
            models.Musteri(ad="Khoshnaw Trading", telefon="+964-750-123-4567", adres="Erbil, Iraq", ulke="Iraq", vergi_no="IRQ123456"),
            models.Musteri(ad="Global Agro", telefon="+964-751-234-5678", adres="Baghdad, Iraq", ulke="Iraq", vergi_no="IRQ234567"),
            models.Musteri(ad="Middle East Grain", telefon="+964-752-345-6789", adres="Sulaymaniyah, Iraq", ulke="Iraq", vergi_no="IRQ345678"),
        ]
        
        for customer in customers:
            db.add(customer)
        db.commit()
        
        products = [
            models.Urun(ad="Sert Buğday", kategori="Hububat", birim="Ton"),
            models.Urun(ad="Yumuşak Buğday", kategori="Hububat", birim="Ton"),
            models.Urun(ad="Mısır", kategori="Hububat", birim="Ton"),
            models.Urun(ad="Arpa", kategori="Hububat", birim="Ton"),
            models.Urun(ad="Soya Yağı", kategori="Yağ", birim="Ton"),
        ]
        
        for product in products:
            db.add(product)
        db.commit()
        
        stock_entries = [
            models.StokKaydi(
                urun_id=1, tedarikci_id=1, miktar=500, birim_fiyat=13500, toplam_fiyat=6750000,
                doviz_tipi="TL", lokasyon="ZAD 1", protein=12.5, hektolitre=78.2, rutubet=13.1,
                kepce_ucreti=25000, hamal_ucreti=15000, nakliye_ucreti=50000,
                tarih=datetime.now() - timedelta(days=10),
                odeme_vadesi=datetime.now() + timedelta(days=30),
                aciklama="Sert buğday alımı - Halim Dölek"
            ),
            models.StokKaydi(
                urun_id=2, tedarikci_id=2, miktar=300, birim_fiyat=13000, toplam_fiyat=3900000,
                doviz_tipi="TL", lokasyon="ZAD 2", protein=11.8, hektolitre=76.5, rutubet=12.8,
                kepce_ucreti=15000, hamal_ucreti=10000, nakliye_ucreti=30000,
                tarih=datetime.now() - timedelta(days=8),
                odeme_vadesi=datetime.now() + timedelta(days=25),
                aciklama="Yumuşak buğday alımı - Mehmet Çiftçi"
            ),
            models.StokKaydi(
                urun_id=3, tedarikci_id=3, miktar=200, birim_fiyat=12000, toplam_fiyat=2400000,
                doviz_tipi="TL", lokasyon="Yerinde Dağıtım", adres_adi="Ali Tarım Deposu",
                protein=9.2, hektolitre=72.1, rutubet=14.2,
                kepce_ucreti=10000, hamal_ucreti=8000, nakliye_ucreti=20000,
                tarih=datetime.now() - timedelta(days=5),
                odeme_vadesi=datetime.now() + timedelta(days=20),
                aciklama="Mısır alımı - Ali Tarım"
            ),
        ]
        
        for entry in stock_entries:
            db.add(entry)
        db.commit()
        
        stock_exits = [
            models.StokCikis(
                stok_kaydi_id=1, musteri_id=1, miktar=200, birim_fiyat=350, toplam_fiyat=70000,
                doviz_tipi="USD", cikis_tipi="Araç bazlı", lokasyon="ZAD 1",
                plaka="34 ABC 123", sofor_ad="Mehmet Şoför", sofor_telefon="0535-123-4567",
                kepce_ucreti=500, hamal_ucreti=300, nakliye_ucreti=1000, gumruk_ucreti=2000,
                tarih=datetime.now() - timedelta(days=3),
                odeme_vadesi=datetime.now() + timedelta(days=15),
                aciklama="Khoshnaw Trading satışı"
            ),
            models.StokCikis(
                stok_kaydi_id=2, musteri_id=2, miktar=150, birim_fiyat=340, toplam_fiyat=51000,
                doviz_tipi="USD", cikis_tipi="Devir", lokasyon="ZAD 2",
                kepce_ucreti=400, hamal_ucreti=250, nakliye_ucreti=800, gumruk_ucreti=1500,
                tarih=datetime.now() - timedelta(days=2),
                odeme_vadesi=datetime.now() + timedelta(days=10),
                aciklama="Global Agro satışı"
            ),
        ]
        
        for exit in stock_exits:
            db.add(exit)
        db.commit()
        
        exchange_rates = [
            models.DovizKuru(doviz_kodu="USD", alis_kuru=34.25, satis_kuru=34.35, kaynak="TCMB", tarih=datetime.now()),
            models.DovizKuru(doviz_kodu="EUR", alis_kuru=37.15, satis_kuru=37.25, kaynak="TCMB", tarih=datetime.now()),
            models.DovizKuru(doviz_kodu="GBP", alis_kuru=43.45, satis_kuru=43.55, kaynak="TCMB", tarih=datetime.now()),
        ]
        
        for rate in exchange_rates:
            db.add(rate)
        db.commit()
        
        cash_transactions = [
            models.KasaIslem(
                islem_tipi="Giriş", kategori="Fatura Tahsilatı", tutar=125000,
                doviz_tipi="TL", referans_no="FAT-2024-001",
                tarih=datetime.now() - timedelta(days=1),
                aciklama="Müşteri ödemesi"
            ),
            models.KasaIslem(
                islem_tipi="Çıkış", kategori="Genel Gider", tutar=8500,
                doviz_tipi="TL", referans_no="GID-2024-001",
                tarih=datetime.now(),
                aciklama="Ofis masrafları"
            ),
            models.KasaIslem(
                islem_tipi="Giriş", kategori="Döviz Girişi", tutar=26200,
                doviz_tipi="USD", referans_no="DOV-2024-001",
                tarih=datetime.now() - timedelta(days=2),
                aciklama="USD tahsilat"
            ),
        ]
        
        for transaction in cash_transactions:
            db.add(transaction)
        db.commit()
        
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()

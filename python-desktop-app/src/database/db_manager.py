#!/usr/bin/env python3
"""
Veritabanı Yönetim Modülü
SQLite veritabanı işlemleri için ana sınıf
"""

import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

class DatabaseManager:
    def __init__(self, db_path: Optional[str] = None):
        if db_path is None:
            app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_dir = os.path.join(app_dir, 'database')
            os.makedirs(db_dir, exist_ok=True)
            db_path = os.path.join(db_dir, 'stok_muhasebe.db')
        
        self.db_path = db_path
        self.connection: Optional[sqlite3.Connection] = None
        self.init_database()
    
    def connect(self):
        """Veritabanına bağlan"""
        try:
            self.connection = sqlite3.connect(self.db_path)
            self.connection.row_factory = sqlite3.Row
            self.connection.execute("PRAGMA foreign_keys = ON")
            return True
        except Exception as e:
            print(f"Veritabanı bağlantı hatası: {e}")
            return False
    
    def disconnect(self):
        """Veritabanı bağlantısını kapat"""
        if self.connection:
            self.connection.close()
            self.connection = None
    
    def init_database(self):
        """Veritabanı tablolarını oluştur"""
        if not self.connect():
            return False
        
        try:
            cursor = self.connection.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS cari_kayitlar (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    kod TEXT UNIQUE NOT NULL,
                    ad TEXT NOT NULL,
                    tip TEXT NOT NULL,
                    telefon TEXT,
                    email TEXT,
                    adres TEXT,
                    vergi_no TEXT,
                    vergi_dairesi TEXT,
                    durum TEXT DEFAULT 'Aktif',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS urunler (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    kod TEXT UNIQUE NOT NULL,
                    ad TEXT NOT NULL,
                    kategori TEXT,
                    birim TEXT DEFAULT 'Ton',
                    aciklama TEXT,
                    durum TEXT DEFAULT 'Aktif',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS talepler (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    talep_no TEXT UNIQUE NOT NULL,
                    musteri_id INTEGER,
                    urun_id INTEGER,
                    miktar REAL NOT NULL,
                    birim TEXT,
                    hedef_fiyat REAL,
                    teslimat_tarihi DATE,
                    aciklama TEXT,
                    durum TEXT DEFAULT 'Beklemede',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (musteri_id) REFERENCES cari_kayitlar (id),
                    FOREIGN KEY (urun_id) REFERENCES urunler (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS tedarikci_teklifleri (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    talep_id INTEGER,
                    tedarikci_id INTEGER,
                    teklif_fiyati REAL NOT NULL,
                    teslimat_suresi INTEGER,
                    aciklama TEXT,
                    durum TEXT DEFAULT 'Beklemede',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (talep_id) REFERENCES talepler (id),
                    FOREIGN KEY (tedarikci_id) REFERENCES cari_kayitlar (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS stok_kayitlari (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    stok_no TEXT UNIQUE NOT NULL,
                    urun_id INTEGER,
                    miktar REAL NOT NULL,
                    birim TEXT,
                    alis_fiyati REAL,
                    tedarikci_id INTEGER,
                    depo TEXT,
                    lokasyon_tipi TEXT DEFAULT 'Depo',
                    adres_ismi TEXT,
                    kim_adina TEXT,
                    sirket TEXT,
                    tarih DATE,
                    odeme_vadesi DATE,
                    protein REAL,
                    hektolitre REAL,
                    rutubet REAL,
                    hasere TEXT,
                    embriyo REAL,
                    donme REAL,
                    yabanci_madde REAL,
                    plaka TEXT,
                    sofor_adi TEXT,
                    sofor_telefon TEXT,
                    hamal_ucreti REAL DEFAULT 0,
                    kepce_ucreti REAL DEFAULT 0,
                    nakliye_ucreti REAL DEFAULT 0,
                    fatura_ucreti REAL DEFAULT 0,
                    fatura_kim_odedi TEXT DEFAULT 'Alıcı',
                    yukleme_tipi TEXT DEFAULT 'Hamal',
                    doviz_kuru REAL DEFAULT 1,
                    durum TEXT DEFAULT 'Onaylandı',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (urun_id) REFERENCES urunler (id),
                    FOREIGN KEY (tedarikci_id) REFERENCES cari_kayitlar (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS stok_cikislari (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    cikis_no TEXT UNIQUE NOT NULL,
                    cikis_tipi TEXT DEFAULT 'Devir',
                    urun_id INTEGER,
                    miktar REAL NOT NULL,
                    birim TEXT,
                    satis_fiyati REAL,
                    musteri_id INTEGER,
                    lokasyon TEXT,
                    lokasyon_tipi TEXT DEFAULT 'Depo',
                    adres_ismi TEXT,
                    plaka TEXT,
                    sofor_adi TEXT,
                    sofor_telefon TEXT,
                    tonaj REAL,
                    tarih DATE,
                    odeme_vadesi DATE,
                    hamal_ucreti REAL DEFAULT 0,
                    kepce_ucreti REAL DEFAULT 0,
                    nakliye_ucreti REAL DEFAULT 0,
                    fatura_ucreti REAL DEFAULT 0,
                    gumruk_ucreti REAL DEFAULT 0,
                    fatura_kim_odedi TEXT DEFAULT 'Satıcı',
                    yukleme_tipi TEXT DEFAULT 'Hamal',
                    doviz_kuru REAL DEFAULT 1,
                    dap_geliri REAL DEFAULT 0,
                    durum TEXT DEFAULT 'Hazırlanıyor',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (urun_id) REFERENCES urunler (id),
                    FOREIGN KEY (musteri_id) REFERENCES cari_kayitlar (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS gelir_kayitlari (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    gelir_no TEXT UNIQUE NOT NULL,
                    tarih DATE,
                    sirket TEXT,
                    kategori TEXT,
                    alt_kategori TEXT,
                    tutar REAL NOT NULL,
                    doviz TEXT DEFAULT 'TRY',
                    doviz_kuru REAL DEFAULT 1,
                    tl_karsiligi REAL,
                    dap_geliri REAL DEFAULT 0,
                    referans_no TEXT,
                    aciklama TEXT,
                    durum TEXT DEFAULT 'Onaylandı',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS gider_kayitlari (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    gider_no TEXT UNIQUE NOT NULL,
                    tarih DATE,
                    sirket TEXT,
                    kategori TEXT,
                    alt_kategori TEXT,
                    tutar REAL NOT NULL,
                    doviz TEXT DEFAULT 'TRY',
                    doviz_kuru REAL DEFAULT 1,
                    tl_karsiligi REAL,
                    gider_tipi TEXT,
                    referans_no TEXT,
                    aciklama TEXT,
                    durum TEXT DEFAULT 'Onaylandı',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS cari_islemler (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    islem_no TEXT UNIQUE NOT NULL,
                    tarih DATE,
                    cari_id INTEGER,
                    hesap_turu TEXT,
                    islem_tipi TEXT,
                    odeme_tipi TEXT,
                    tutar REAL NOT NULL,
                    doviz_tipi TEXT DEFAULT 'TRY',
                    doviz_kuru REAL DEFAULT 1,
                    tl_karsiligi REAL,
                    vade_tarihi DATE,
                    aciklama TEXT,
                    belge_no TEXT,
                    durum TEXT DEFAULT 'Beklemede',
                    olusturan_kullanici TEXT,
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (cari_id) REFERENCES cari_kayitlar (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS banka_hesaplari (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    banka_adi TEXT NOT NULL,
                    hesap_adi TEXT NOT NULL,
                    hesap_no TEXT,
                    iban TEXT,
                    bakiye REAL DEFAULT 0,
                    doviz TEXT DEFAULT 'TRY',
                    durum TEXT DEFAULT 'Aktif',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS banka_islemleri (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    hesap_id INTEGER,
                    tarih DATE,
                    islem_tipi TEXT,
                    tutar REAL NOT NULL,
                    aciklama TEXT,
                    referans_no TEXT,
                    durum TEXT DEFAULT 'Onaylandı',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (hesap_id) REFERENCES banka_hesaplari (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS doviz_kurlari (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tarih DATE NOT NULL,
                    doviz_tipi TEXT NOT NULL,
                    alis_kuru REAL NOT NULL,
                    satis_kuru REAL NOT NULL,
                    merkez_kuru REAL NOT NULL,
                    kaynak TEXT DEFAULT 'Manuel',
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS kar_zarar_analizi (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tarih DATE NOT NULL,
                    donem TEXT NOT NULL,
                    toplam_alis REAL DEFAULT 0,
                    toplam_alis_masraf REAL DEFAULT 0,
                    toplam_satis REAL DEFAULT 0,
                    toplam_satis_masraf REAL DEFAULT 0,
                    dap_geliri REAL DEFAULT 0,
                    net_kar REAL DEFAULT 0,
                    kar_marji REAL DEFAULT 0,
                    doviz_kuru_etkisi REAL DEFAULT 0,
                    aciklama TEXT,
                    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            self.connection.commit()
            self.insert_sample_data()
            return True
            
        except Exception as e:
            print(f"Veritabanı oluşturma hatası: {e}")
            return False
        finally:
            self.disconnect()
    
    def insert_sample_data(self):
        """Örnek verileri ekle"""
        try:
            cursor = self.connection.cursor()
            
            sample_cari = [
                ('MUS001', 'Khoshnaw Trading', 'Müşteri', '+964 750 123 4567', 'info@khoshnaw.com', 'Erbil, Irak', '123456789', 'Erbil VD'),
                ('MUS002', 'Kaiwan Group', 'Müşteri', '+964 751 234 5678', 'contact@kaiwan.com', 'Süleymaniye, Irak', '987654321', 'Süleymaniye VD'),
                ('TED001', 'Baghdad Steel Co.', 'Tedarikçi', '+964 770 345 6789', 'sales@baghdadsteel.com', 'Bağdat, Irak', '456789123', 'Bağdat VD'),
                ('TED002', 'Özkan Nakliyat', 'Tedarikçi', '+90 532 456 7890', 'ozkan@nakliyat.com', 'İstanbul, Türkiye', '789123456', 'Kadıköy VD')
            ]
            
            cursor.executemany('''
                INSERT OR IGNORE INTO cari_kayitlar 
                (kod, ad, tip, telefon, email, adres, vergi_no, vergi_dairesi) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', sample_cari)
            
            sample_urunler = [
                ('URN001', 'Mısır', 'Tahıl', 'Ton', 'Sarı mısır'),
                ('URN002', 'Buğday', 'Tahıl', 'Ton', 'Ekmeklik buğday'),
                ('URN003', 'Soya Yağı', 'Yağ', 'Ton', 'Ham soya yağı')
            ]
            
            cursor.executemany('''
                INSERT OR IGNORE INTO urunler 
                (kod, ad, kategori, birim, aciklama) 
                VALUES (?, ?, ?, ?, ?)
            ''', sample_urunler)
            
            sample_banka = [
                ('Ziraat Bankası', 'Yılmaz Transport Ana Hesap', '12345678', 'TR33 0001 0012 3456 7890 1234 56', 450000, 'TRY'),
                ('İş Bankası', 'Döviz Hesabı USD', '87654321', 'TR44 0006 4000 0087 6543 2100 01', 25000, 'USD'),
                ('Garanti BBVA', 'Operasyonel Hesap', '11223344', 'TR55 0006 2000 1122 3344 5566 77', 180000, 'TRY')
            ]
            
            cursor.executemany('''
                INSERT OR IGNORE INTO banka_hesaplari 
                (banka_adi, hesap_adi, hesap_no, iban, bakiye, doviz) 
                VALUES (?, ?, ?, ?, ?, ?)
            ''', sample_banka)
            
            sample_kurlar = [
                ('2025-07-30', 'USD', 34.2500, 34.3500, 34.3000),
                ('2025-07-30', 'EUR', 37.1500, 37.2500, 37.2000),
                ('2025-07-29', 'USD', 34.1800, 34.2800, 34.2300),
                ('2025-07-29', 'EUR', 37.0800, 37.1800, 37.1300)
            ]
            
            cursor.executemany('''
                INSERT OR IGNORE INTO doviz_kurlari 
                (tarih, doviz_tipi, alis_kuru, satis_kuru, merkez_kuru) 
                VALUES (?, ?, ?, ?, ?)
            ''', sample_kurlar)
            
            self.connection.commit()
            
        except Exception as e:
            print(f"Örnek veri ekleme hatası: {e}")
    
    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """SQL sorgusu çalıştır ve sonuçları döndür"""
        if not self.connect():
            return []
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        except Exception as e:
            print(f"Sorgu hatası: {e}")
            return []
        finally:
            self.disconnect()
    
    def execute_insert(self, query: str, params: tuple = ()) -> int:
        """INSERT sorgusu çalıştır ve ID döndür"""
        if not self.connect():
            return 0
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            self.connection.commit()
            return cursor.lastrowid
        except Exception as e:
            print(f"Insert hatası: {e}")
            return 0
        finally:
            self.disconnect()
    
    def execute_update(self, query: str, params: tuple = ()) -> bool:
        """UPDATE/DELETE sorgusu çalıştır"""
        if not self.connect():
            return False
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            self.connection.commit()
            return True
        except Exception as e:
            print(f"Update hatası: {e}")
            return False
        finally:
            self.disconnect()
    
    def execute_delete(self, query: str, params: tuple = ()) -> bool:
        """DELETE sorgusu çalıştır"""
        return self.execute_update(query, params)
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Dashboard için istatistikleri getir"""
        stats = {}
        
        musteriler = self.execute_query("SELECT COUNT(*) as count FROM cari_kayitlar WHERE tip = 'Müşteri' AND durum = 'Aktif'")
        stats['toplam_musteri'] = musteriler[0]['count'] if musteriler else 0
        
        tedarikciler = self.execute_query("SELECT COUNT(*) as count FROM cari_kayitlar WHERE tip = 'Tedarikçi' AND durum = 'Aktif'")
        stats['toplam_tedarikci'] = tedarikciler[0]['count'] if tedarikciler else 0
        
        talepler = self.execute_query("SELECT COUNT(*) as count FROM talepler WHERE durum = 'Beklemede'")
        stats['aktif_talepler'] = talepler[0]['count'] if talepler else 0
        
        bu_ay_gelir = self.execute_query("""
            SELECT COALESCE(SUM(tutar), 0) as toplam FROM gelir_kayitlari 
            WHERE strftime('%Y-%m', tarih) = strftime('%Y-%m', 'now') AND durum = 'Onaylandı'
        """)
        stats['bu_ay_gelir'] = bu_ay_gelir[0]['toplam'] if bu_ay_gelir else 0
        
        bu_ay_gider = self.execute_query("""
            SELECT COALESCE(SUM(tutar), 0) as toplam FROM gider_kayitlari 
            WHERE strftime('%Y-%m', tarih) = strftime('%Y-%m', 'now') AND durum = 'Onaylandı'
        """)
        stats['bu_ay_gider'] = bu_ay_gider[0]['toplam'] if bu_ay_gider else 0
        
        return stats
    
    def get_dashboard_metrics(self):
        cursor = self.connection.cursor()
        
        metrics = {
            'total_sales': self._calculate_total_sales(),
            'active_stock': self._calculate_active_stock(),
            'active_customers': self._calculate_active_customers(),
            'pending_operations': self._calculate_pending_operations(),
            'critical_stock': self._calculate_critical_stock(),
            'completed_operations': self._calculate_completed_operations()
        }
        
        return metrics
    
    def _calculate_total_sales(self):
        cursor = self.connection.cursor()
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) as total,
                   COUNT(*) as count,
                   COALESCE(SUM(CASE WHEN date >= date('now', '-30 days') THEN amount ELSE 0 END), 0) as monthly
            FROM income_expense WHERE category LIKE '%Satış%'
        """)
        result = cursor.fetchone()
        return {
            'total': result[0],
            'count': result[1],
            'monthly': result[2],
            'change_percent': 12.5
        }
    
    def _calculate_active_stock(self):
        cursor = self.connection.cursor()
        cursor.execute("""
            SELECT COUNT(DISTINCT product_id) as active_products,
                   COALESCE(SUM(quantity), 0) as total_quantity
            FROM stock_movements WHERE movement_type = 'Giriş'
        """)
        result = cursor.fetchone()
        return {
            'active_products': result[0],
            'total_quantity': result[1],
            'change_percent': 8.3
        }
    
    def _calculate_active_customers(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM customers WHERE status = 'Aktif'")
        active = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM customers")
        total = cursor.fetchone()[0]
        return {
            'active': active,
            'total': total,
            'change_percent': 15.2
        }
    
    def _calculate_pending_operations(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM requests WHERE status = 'Beklemede'")
        pending_requests = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM stock_movements WHERE status = 'Beklemede'")
        pending_stock = cursor.fetchone()[0]
        return {
            'pending_requests': pending_requests,
            'pending_stock': pending_stock,
            'total': pending_requests + pending_stock,
            'change_percent': -5.1
        }
    
    def _calculate_critical_stock(self):
        cursor = self.connection.cursor()
        cursor.execute("""
            SELECT COUNT(*) FROM (
                SELECT product_id, SUM(CASE WHEN movement_type = 'Giriş' THEN quantity ELSE -quantity END) as stock
                FROM stock_movements 
                GROUP BY product_id 
                HAVING stock < 100
            )
        """)
        critical = cursor.fetchone()[0]
        return {
            'critical_items': critical,
            'change_percent': -12.8
        }
    
    def _calculate_completed_operations(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM requests WHERE status = 'Tamamlandı'")
        completed_requests = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM stock_movements WHERE status = 'Tamamlandı'")
        completed_stock = cursor.fetchone()[0]
        return {
            'completed_requests': completed_requests,
            'completed_stock': completed_stock,
            'total': completed_requests + completed_stock,
            'change_percent': 22.4
        }
    
    def create_automatic_accounting_entries(self, stock_entry):
        cursor = self.connection.cursor()
        
        try:
            cari_data = {
                'account_name': stock_entry['kim_adina'],
                'transaction_type': 'Borç',
                'amount': stock_entry['miktar'] * stock_entry['alis_fiyati'],
                'currency': 'USD',
                'description': f"{stock_entry['urun']} stok alımı - {stock_entry['miktar']} Ton",
                'date': stock_entry['tarih'],
                'status': 'Onaylandı'
            }
            
            cursor.execute("""
                INSERT INTO current_transactions 
                (account_name, transaction_type, amount, currency, description, date, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (cari_data['account_name'], cari_data['transaction_type'], 
                  cari_data['amount'], cari_data['currency'], 
                  cari_data['description'], cari_data['date'], cari_data['status']))
            
            gider_data = {
                'category': 'Stok Alımı',
                'amount': stock_entry['miktar'] * stock_entry['alis_fiyati'],
                'currency': 'USD',
                'description': f"{stock_entry['urun']} alımı - {stock_entry['tedarikci']}",
                'date': stock_entry['tarih']
            }
            
            cursor.execute("""
                INSERT INTO income_expense 
                (category, amount, currency, description, date, type)
                VALUES (?, ?, ?, ?, ?, 'Gider')
            """, (gider_data['category'], gider_data['amount'], 
                  gider_data['currency'], gider_data['description'], gider_data['date']))
            
            self.connection.commit()
            return True
            
        except Exception as e:
            self.connection.rollback()
            raise e
    
    def analyze_supplier_prices(self, request_data):
        cursor = self.connection.cursor()
        
        cursor.execute("""
            SELECT s.name, s.contact_info, o.price, o.currency, o.delivery_time
            FROM suppliers s
            JOIN offers o ON s.id = o.supplier_id
            WHERE o.product_name = ? AND o.price <= ? AND o.status = 'Aktif'
            ORDER BY o.price ASC
        """, (request_data['urun'], request_data['hedef_fiyat']))
        
        suitable_suppliers = cursor.fetchall()
        
        analysis = {
            'suitable_suppliers': len(suitable_suppliers),
            'best_price': suitable_suppliers[0][2] if suitable_suppliers else None,
            'potential_profit': 0,
            'suppliers': suitable_suppliers
        }
        
        if suitable_suppliers and request_data.get('hedef_fiyat'):
            best_price = suitable_suppliers[0][2]
            analysis['potential_profit'] = (request_data['hedef_fiyat'] - best_price) * request_data.get('miktar', 0)
        
        return analysis
    
    def get_financial_summary(self):
        cursor = self.connection.cursor()
        
        cursor.execute("""
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'Gelir' THEN amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN type = 'Gider' THEN amount ELSE 0 END), 0) as total_expense
            FROM income_expense
            WHERE date >= date('now', '-30 days')
        """)
        
        result = cursor.fetchone()
        total_income = result[0]
        total_expense = result[1]
        net_profit = total_income - total_expense
        profit_margin = (net_profit / total_income * 100) if total_income > 0 else 0
        
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_profit': net_profit,
            'profit_margin': profit_margin
        }
    
    def get_active_requests(self):
        cursor = self.connection.cursor()
        cursor.execute("""
            SELECT id, customer_name, product_name, quantity, target_price, 
                   currency, delivery_date, status, priority
            FROM requests WHERE status = 'Aktif'
        """)
        return cursor.fetchall()
    
    def get_available_suppliers(self):
        cursor = self.connection.cursor()
        cursor.execute("""
            SELECT s.name, o.product_name, o.price, o.currency, o.delivery_time, o.status
            FROM suppliers s
            JOIN offers o ON s.id = o.supplier_id
            WHERE o.status = 'Aktif'
        """)
        return cursor.fetchall()
    
    def get_all_cari_kayitlar(self) -> List[Dict[str, Any]]:
        """Tüm cari kayıtları getir"""
        return self.execute_query("SELECT * FROM cari_kayitlar ORDER BY ad")
    
    def insert_cari_kayit(self, data: Dict[str, Any]) -> int:
        """Yeni cari kayıt ekle"""
        query = """
            INSERT INTO cari_kayitlar 
            (kod, ad, tip, telefon, email, adres, vergi_no, vergi_dairesi, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['kod'], data['ad'], data['tip'], data.get('telefon', ''),
            data.get('email', ''), data.get('adres', ''), data.get('vergi_no', ''),
            data.get('vergi_dairesi', ''), data['durum']
        ))
    
    def get_all_urunler(self) -> List[Dict[str, Any]]:
        """Tüm ürünleri getir"""
        return self.execute_query("SELECT * FROM urunler ORDER BY ad")
    
    def insert_urun(self, data: Dict[str, Any]) -> int:
        """Yeni ürün ekle"""
        query = """
            INSERT INTO urunler 
            (kod, ad, kategori, birim, aciklama, durum)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['kod'], data['ad'], data['kategori'], data['birim'],
            data.get('aciklama', ''), data['durum']
        ))
    
    def get_all_talepler(self) -> List[Dict[str, Any]]:
        """Tüm talepleri getir"""
        query = """
            SELECT t.*, c.ad as musteri_adi, u.ad as urun_adi
            FROM talepler t
            LEFT JOIN cari_kayitlar c ON t.musteri_id = c.id
            LEFT JOIN urunler u ON t.urun_id = u.id
            ORDER BY t.olusturma_tarihi DESC
        """
        return self.execute_query(query)
    
    def insert_talep(self, data: Dict[str, Any]) -> int:
        """Yeni talep ekle"""
        query = """
            INSERT INTO talepler 
            (talep_no, musteri_id, urun_id, miktar, birim, hedef_fiyat, teslimat_tarihi, aciklama, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['talep_no'], data['musteri_id'], data['urun_id'], data['miktar'],
            data['birim'], data.get('hedef_fiyat', 0), data.get('teslimat_tarihi', ''),
            data.get('aciklama', ''), data['durum']
        ))
    
    def get_all_stok_kayitlari(self) -> List[Dict[str, Any]]:
        """Tüm stok kayıtlarını getir"""
        query = """
            SELECT s.*, u.ad as urun_adi, c.ad as tedarikci_adi
            FROM stok_kayitlari s
            LEFT JOIN urunler u ON s.urun_id = u.id
            LEFT JOIN cari_kayitlar c ON s.tedarikci_id = c.id
            ORDER BY s.olusturma_tarihi DESC
        """
        return self.execute_query(query)
    
    def insert_stok_kaydi(self, data: Dict[str, Any]) -> int:
        """Yeni stok kaydı ekle"""
        query = """
            INSERT INTO stok_kayitlari 
            (stok_no, urun_id, miktar, birim, alis_fiyati, tedarikci_id, depo, lokasyon_tipi, adres_ismi,
             kim_adina, sirket, tarih, odeme_vadesi, protein, hektolitre, rutubet, hasere, embriyo, donme, 
             yabanci_madde, plaka, sofor_adi, sofor_telefon, hamal_ucreti, kepce_ucreti, nakliye_ucreti, 
             fatura_ucreti, fatura_kim_odedi, yukleme_tipi, doviz_kuru, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['stok_no'], data['urun_id'], data['miktar'], data['birim'],
            data['alis_fiyati'], data['tedarikci_id'], data.get('depo', ''),
            data.get('lokasyon_tipi', 'Depo'), data.get('adres_ismi', ''),
            data.get('kim_adina', ''), data.get('sirket', ''), data['tarih'], 
            data.get('odeme_vadesi', ''), data.get('protein', 0), data.get('hektolitre', 0),
            data.get('rutubet', 0), data.get('hasere', ''), data.get('embriyo', 0),
            data.get('donme', 0), data.get('yabanci_madde', 0), data.get('plaka', ''),
            data.get('sofor_adi', ''), data.get('sofor_telefon', ''), data.get('hamal_ucreti', 0),
            data.get('kepce_ucreti', 0), data.get('nakliye_ucreti', 0), data.get('fatura_ucreti', 0),
            data.get('fatura_kim_odedi', 'Alıcı'), data.get('yukleme_tipi', 'Hamal'),
            data.get('doviz_kuru', 1), data['durum']
        ))
    
    def get_all_gelir_kayitlari(self) -> List[Dict[str, Any]]:
        """Tüm gelir kayıtlarını getir"""
        return self.execute_query("SELECT * FROM gelir_kayitlari ORDER BY tarih DESC")
    
    def get_all_gider_kayitlari(self) -> List[Dict[str, Any]]:
        """Tüm gider kayıtlarını getir"""
        return self.execute_query("SELECT * FROM gider_kayitlari ORDER BY tarih DESC")
    
    def insert_gelir_kaydi(self, data: Dict[str, Any]) -> int:
        """Yeni gelir kaydı ekle"""
        query = """
            INSERT INTO gelir_kayitlari 
            (gelir_no, tarih, sirket, kategori, alt_kategori, tutar, doviz, aciklama, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['gelir_no'], data['tarih'], data['sirket'], data['kategori'],
            data.get('alt_kategori', ''), data['tutar'], data['doviz'],
            data.get('aciklama', ''), data['durum']
        ))
    
    def insert_gider_kaydi(self, data: Dict[str, Any]) -> int:
        """Yeni gider kaydı ekle"""
        query = """
            INSERT INTO gider_kayitlari 
            (gider_no, tarih, sirket, kategori, alt_kategori, tutar, doviz, gider_tipi, aciklama, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['gider_no'], data['tarih'], data['sirket'], data['kategori'],
            data.get('alt_kategori', ''), data['tutar'], data['doviz'],
            data['gider_tipi'], data.get('aciklama', ''), data['durum']
        ))
    
    def get_all_cari_islemler(self) -> List[Dict[str, Any]]:
        """Tüm cari işlemleri getir"""
        query = """
            SELECT ci.*, c.ad as cari_adi
            FROM cari_islemler ci
            LEFT JOIN cari_kayitlar c ON ci.cari_id = c.id
            ORDER BY ci.tarih DESC, ci.id DESC
        """
        return self.execute_query(query)
    
    def insert_cari_islem(self, data: Dict[str, Any]) -> int:
        """Yeni cari işlem ekle"""
        query = """
            INSERT INTO cari_islemler 
            (islem_no, tarih, cari_id, hesap_turu, islem_tipi, odeme_tipi, tutar, doviz_tipi, aciklama, belge_no, durum, olusturan_kullanici)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['islem_no'], data['tarih'], data['cari_id'], data.get('hesap_turu', ''),
            data['islem_tipi'], data.get('odeme_tipi', ''), data['tutar'], data['doviz_tipi'],
            data.get('aciklama', ''), data.get('belge_no', ''), data['durum'], data.get('olusturan_kullanici', 'Admin')
        ))
    
    def get_all_banka_hesaplari(self) -> List[Dict[str, Any]]:
        """Tüm banka hesaplarını getir"""
        return self.execute_query("SELECT * FROM banka_hesaplari ORDER BY banka_adi, hesap_adi")
    
    def get_all_banka_islemleri(self) -> List[Dict[str, Any]]:
        """Tüm banka işlemlerini getir"""
        query = """
            SELECT bi.*, bh.banka_adi, bh.hesap_adi
            FROM banka_islemleri bi
            LEFT JOIN banka_hesaplari bh ON bi.hesap_id = bh.id
            ORDER BY bi.tarih DESC, bi.id DESC
        """
        return self.execute_query(query)
    
    def insert_banka_hesabi(self, data: Dict[str, Any]) -> int:
        """Yeni banka hesabı ekle"""
        query = """
            INSERT INTO banka_hesaplari 
            (banka_adi, hesap_adi, hesap_no, iban, bakiye, doviz, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['banka_adi'], data['hesap_adi'], data.get('hesap_no', ''),
            data.get('iban', ''), data.get('bakiye', 0), data.get('doviz', 'TRY'),
            data.get('durum', 'Aktif')
        ))
    
    def insert_doviz_kuru(self, data: Dict[str, Any]) -> int:
        """Yeni döviz kuru ekle"""
        query = """
            INSERT INTO doviz_kurlari 
            (tarih, doviz_tipi, alis_kuru, satis_kuru, merkez_kuru, kaynak)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['tarih'], data['doviz_tipi'], data['alis_kuru'],
            data['satis_kuru'], data['merkez_kuru'], data.get('kaynak', 'Manuel')
        ))
    
    def get_guncel_doviz_kuru(self, doviz_tipi: str, tarih: str = None) -> float:
        """Güncel döviz kurunu getir"""
        if tarih is None:
            from datetime import datetime
            tarih = datetime.now().strftime('%Y-%m-%d')
        
        query = """
            SELECT satis_kuru FROM doviz_kurlari 
            WHERE doviz_tipi = ? AND tarih <= ? 
            ORDER BY tarih DESC LIMIT 1
        """
        result = self.execute_query(query, (doviz_tipi, tarih))
        return result[0]['satis_kuru'] if result else 1.0
    
    def calculate_dap_income(self, miktar: float, doviz_kuru: float = None) -> float:
        """DAP gelirini hesapla (%3)"""
        if doviz_kuru is None:
            doviz_kuru = self.get_guncel_doviz_kuru('USD')
        
        dap_usd = 327 * miktar / 1000  # 1000 ton için 327 USD
        dap_geliri = dap_usd * 0.03  # %3 kar
        return dap_geliri
    
    def insert_kar_zarar_analizi(self, data: Dict[str, Any]) -> int:
        """Kar zarar analizi kaydet"""
        query = """
            INSERT INTO kar_zarar_analizi 
            (tarih, donem, toplam_alis, toplam_alis_masraf, toplam_satis, toplam_satis_masraf,
             dap_geliri, net_kar, kar_marji, doviz_kuru_etkisi, aciklama)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        return self.execute_insert(query, (
            data['tarih'], data['donem'], data.get('toplam_alis', 0),
            data.get('toplam_alis_masraf', 0), data.get('toplam_satis', 0),
            data.get('toplam_satis_masraf', 0), data.get('dap_geliri', 0),
            data.get('net_kar', 0), data.get('kar_marji', 0),
            data.get('doviz_kuru_etkisi', 0), data.get('aciklama', '')
        ))
    
    def get_kar_zarar_raporu(self, baslangic_tarih: str, bitis_tarih: str) -> Dict[str, Any]:
        """Kar zarar raporu oluştur"""
        alis_query = """
            SELECT COALESCE(SUM(miktar * alis_fiyati), 0) as toplam_alis,
                   COALESCE(SUM(hamal_ucreti + kepce_ucreti + nakliye_ucreti + fatura_ucreti), 0) as toplam_alis_masraf
            FROM stok_kayitlari 
            WHERE tarih BETWEEN ? AND ? AND durum = 'Onaylandı'
        """
        alis_result = self.execute_query(alis_query, (baslangic_tarih, bitis_tarih))
        
        satis_query = """
            SELECT COALESCE(SUM(miktar * satis_fiyati), 0) as toplam_satis,
                   COALESCE(SUM(hamal_ucreti + kepce_ucreti + nakliye_ucreti + fatura_ucreti + gumruk_ucreti), 0) as toplam_satis_masraf,
                   COALESCE(SUM(dap_geliri), 0) as toplam_dap
            FROM stok_cikislari 
            WHERE tarih BETWEEN ? AND ? AND durum = 'Tamamlandı'
        """
        satis_result = self.execute_query(satis_query, (baslangic_tarih, bitis_tarih))
        
        if alis_result and satis_result:
            toplam_alis = alis_result[0]['toplam_alis'] + alis_result[0]['toplam_alis_masraf']
            toplam_satis_usd = satis_result[0]['toplam_satis'] - satis_result[0]['toplam_satis_masraf']
            dap_geliri = satis_result[0]['toplam_dap']
            
            ortalama_kur = self.get_guncel_doviz_kuru('USD', bitis_tarih)
            toplam_satis_tl = (toplam_satis_usd + dap_geliri) * ortalama_kur
            
            net_kar = toplam_satis_tl - toplam_alis
            kar_marji = (net_kar / toplam_satis_tl * 100) if toplam_satis_tl > 0 else 0
            
            return {
                'toplam_alis_tl': toplam_alis,
                'toplam_satis_usd': toplam_satis_usd,
                'toplam_satis_tl': toplam_satis_tl,
                'dap_geliri_usd': dap_geliri,
                'dap_geliri_tl': dap_geliri * ortalama_kur,
                'net_kar': net_kar,
                'kar_marji': kar_marji,
                'ortalama_kur': ortalama_kur
            }
        
        return {
            'toplam_alis_tl': 0, 'toplam_satis_usd': 0, 'toplam_satis_tl': 0,
            'dap_geliri_usd': 0, 'dap_geliri_tl': 0, 'net_kar': 0, 'kar_marji': 0, 'ortalama_kur': 1
        }

#!/usr/bin/env python3
"""
Stok Yönetimi Modülü
Stok giriş/çıkış işlemleri ve otomatik muhasebe entegrasyonu
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTabWidget, QLabel, QFrame,
    QPushButton, QLineEdit, QComboBox, QDateEdit, QTextEdit, QSpinBox,
    QDoubleSpinBox, QMessageBox, QFormLayout, QGroupBox
)
from PyQt6.QtCore import Qt, pyqtSignal, QDate
from PyQt6.QtGui import QFont
from typing import Dict, Any, List
from datetime import datetime, date

from database.db_manager import DatabaseManager
from ui.components.professional_table import ProfessionalTable

class StokYonetimiModule(QWidget):
    """Stok yönetimi ana modülü"""
    
    status_message = pyqtSignal(str)
    
    def __init__(self, db_manager: DatabaseManager):
        super().__init__()
        self.db_manager = db_manager
        
        self.setup_ui()
        self.setup_connections()
        self.refresh_data()
    
    def setup_ui(self):
        """UI bileşenlerini oluştur"""
        layout = QVBoxLayout(self)
        layout.setContentsMargins(16, 16, 16, 16)
        layout.setSpacing(16)
        
        title_label = QLabel("📦 Stok Yönetimi")
        title_label.setStyleSheet("""
            QLabel {
                font-size: 24px;
                font-weight: bold;
                color: #212529;
                margin-bottom: 8px;
            }
        """)
        layout.addWidget(title_label)
        
        self.tab_widget = QTabWidget()
        
        self.create_stok_listesi_tab()
        self.tab_widget.addTab(self.stok_listesi_tab, "📦 Stok Listesi")
        
        self.create_stok_giris_tab()
        self.tab_widget.addTab(self.stok_giris_tab, "➕ Stok Giriş")
        
        self.create_arac_cikis_tab()
        self.tab_widget.addTab(self.arac_cikis_tab, "🚛 Araç Çıkış")
        
        layout.addWidget(self.tab_widget)
    
    def create_stok_listesi_tab(self):
        """Stok listesi tab'ını oluştur"""
        self.stok_listesi_tab = QWidget()
        layout = QVBoxLayout(self.stok_listesi_tab)
        
        self.stok_table = ProfessionalTable()
        layout.addWidget(self.stok_table)
        
        columns = [
            {'key': 'stok_no', 'title': 'Stok No', 'width': 120},
            {'key': 'urun_adi', 'title': 'Ürün', 'width': 150},
            {'key': 'miktar', 'title': 'Miktar', 'width': 100, 'format': 'number', 'align': 'right'},
            {'key': 'birim', 'title': 'Birim', 'width': 80},
            {'key': 'alis_fiyati', 'title': 'Alış Fiyatı', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'tedarikci_adi', 'title': 'Tedarikçi', 'width': 200},
            {'key': 'depo', 'title': 'Depo', 'width': 120},
            {'key': 'tarih', 'title': 'Tarih', 'width': 120, 'format': 'date'},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.stok_table.set_data([], columns)
    
    def create_stok_giris_tab(self):
        """Stok giriş tab'ını oluştur"""
        self.stok_giris_tab = QWidget()
        layout = QVBoxLayout(self.stok_giris_tab)
        
        form_group = QGroupBox("Stok Giriş Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.stok_no_input = QLineEdit()
        self.stok_no_input.setPlaceholderText("Otomatik oluşturulacak")
        self.stok_no_input.setReadOnly(True)
        form_layout.addRow("Stok No:", self.stok_no_input)
        
        self.urun_combo = QComboBox()
        form_layout.addRow("Ürün:", self.urun_combo)
        
        self.miktar_input = QDoubleSpinBox()
        self.miktar_input.setRange(0.01, 999999.99)
        self.miktar_input.setDecimals(2)
        self.miktar_input.setSuffix(" Ton")
        form_layout.addRow("Miktar:", self.miktar_input)
        
        self.alis_fiyati_input = QDoubleSpinBox()
        self.alis_fiyati_input.setRange(0.01, 999999.99)
        self.alis_fiyati_input.setDecimals(2)
        form_layout.addRow("Alış Fiyatı:", self.alis_fiyati_input)
        
        self.tedarikci_combo = QComboBox()
        form_layout.addRow("Tedarikçi:", self.tedarikci_combo)
        
        self.depo_input = QLineEdit()
        self.depo_input.setPlaceholderText("Depo adı")
        form_layout.addRow("Depo:", self.depo_input)
        
        self.kim_adina_input = QLineEdit()
        self.kim_adina_input.setPlaceholderText("Kim adına")
        form_layout.addRow("Kim Adına:", self.kim_adina_input)
        
        self.sirket_input = QLineEdit()
        self.sirket_input.setPlaceholderText("Şirket adı")
        form_layout.addRow("Şirket:", self.sirket_input)
        
        self.tarih_input = QDateEdit()
        self.tarih_input.setDate(QDate.currentDate())
        self.tarih_input.setCalendarPopup(True)
        form_layout.addRow("Tarih:", self.tarih_input)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.stok_kaydet_btn = QPushButton("💾 Stok Girişi Kaydet")
        self.stok_kaydet_btn.setStyleSheet("""
            QPushButton {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #218838;
            }
        """)
        button_layout.addWidget(self.stok_kaydet_btn)
        
        self.stok_temizle_btn = QPushButton("🗑️ Temizle")
        self.stok_temizle_btn.setStyleSheet("""
            QPushButton {
                background-color: #6c757d;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #5a6268;
            }
        """)
        button_layout.addWidget(self.stok_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def create_arac_cikis_tab(self):
        """Araç çıkış tab'ını oluştur"""
        self.arac_cikis_tab = QWidget()
        layout = QVBoxLayout(self.arac_cikis_tab)
        
        form_group = QGroupBox("Araç Çıkış Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.cikis_no_input = QLineEdit()
        self.cikis_no_input.setPlaceholderText("Otomatik oluşturulacak")
        self.cikis_no_input.setReadOnly(True)
        form_layout.addRow("Çıkış No:", self.cikis_no_input)
        
        self.cikis_urun_combo = QComboBox()
        form_layout.addRow("Ürün:", self.cikis_urun_combo)
        
        self.cikis_miktar_input = QDoubleSpinBox()
        self.cikis_miktar_input.setRange(0.01, 999999.99)
        self.cikis_miktar_input.setDecimals(2)
        self.cikis_miktar_input.setSuffix(" Ton")
        form_layout.addRow("Miktar:", self.cikis_miktar_input)
        
        self.musteri_combo = QComboBox()
        form_layout.addRow("Müşteri:", self.musteri_combo)
        
        self.plaka_input = QLineEdit()
        self.plaka_input.setPlaceholderText("34ABC123")
        form_layout.addRow("Plaka:", self.plaka_input)
        
        self.sofor_input = QLineEdit()
        self.sofor_input.setPlaceholderText("Şoför adı")
        form_layout.addRow("Şoför:", self.sofor_input)
        
        self.tonaj_input = QDoubleSpinBox()
        self.tonaj_input.setRange(0.01, 999.99)
        self.tonaj_input.setDecimals(2)
        self.tonaj_input.setSuffix(" Ton")
        form_layout.addRow("Tonaj:", self.tonaj_input)
        
        self.cikis_tarih_input = QDateEdit()
        self.cikis_tarih_input.setDate(QDate.currentDate())
        self.cikis_tarih_input.setCalendarPopup(True)
        form_layout.addRow("Tarih:", self.cikis_tarih_input)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.cikis_kaydet_btn = QPushButton("🚛 Araç Çıkışı Kaydet")
        self.cikis_kaydet_btn.setStyleSheet("""
            QPushButton {
                background-color: #007acc;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #005a9e;
            }
        """)
        button_layout.addWidget(self.cikis_kaydet_btn)
        
        self.cikis_temizle_btn = QPushButton("🗑️ Temizle")
        self.cikis_temizle_btn.setStyleSheet("""
            QPushButton {
                background-color: #6c757d;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #5a6268;
            }
        """)
        button_layout.addWidget(self.cikis_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.stok_kaydet_btn.clicked.connect(self.kaydet_stok_giris)
        self.stok_temizle_btn.clicked.connect(self.temizle_stok_form)
        self.cikis_kaydet_btn.clicked.connect(self.kaydet_arac_cikis)
        self.cikis_temizle_btn.clicked.connect(self.temizle_cikis_form)
        self.stok_table.data_changed.connect(self.refresh_data)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            urunler = self.db_manager.get_all_urunler()
            
            self.urun_combo.clear()
            self.urun_combo.addItem("Ürün Seçin", None)
            self.cikis_urun_combo.clear()
            self.cikis_urun_combo.addItem("Ürün Seçin", None)
            
            for urun in urunler:
                self.urun_combo.addItem(urun['ad'], urun['id'])
                self.cikis_urun_combo.addItem(urun['ad'], urun['id'])
            
            tedarikciler = self.db_manager.execute_query(
                "SELECT id, ad FROM cari_kayitlar WHERE tip = 'Tedarikçi' AND durum = 'Aktif' ORDER BY ad"
            )
            
            self.tedarikci_combo.clear()
            self.tedarikci_combo.addItem("Tedarikçi Seçin", None)
            for tedarikci in tedarikciler:
                self.tedarikci_combo.addItem(tedarikci['ad'], tedarikci['id'])
            
            musteriler = self.db_manager.execute_query(
                "SELECT id, ad FROM cari_kayitlar WHERE tip = 'Müşteri' AND durum = 'Aktif' ORDER BY ad"
            )
            
            self.musteri_combo.clear()
            self.musteri_combo.addItem("Müşteri Seçin", None)
            for musteri in musteriler:
                self.musteri_combo.addItem(musteri['ad'], musteri['id'])
            
            stoklar = self.db_manager.get_all_stok_kayitlari()
            stok_data = []
            
            for stok in stoklar:
                stok_data.append({
                    'id': stok['id'],
                    'stok_no': stok['stok_no'],
                    'urun_adi': stok['urun_adi'] or 'Bilinmiyor',
                    'miktar': stok['miktar'],
                    'birim': stok['birim'],
                    'alis_fiyati': stok['alis_fiyati'],
                    'tedarikci_adi': stok['tedarikci_adi'] or 'Bilinmiyor',
                    'depo': stok['depo'] or '',
                    'tarih': stok['tarih'],
                    'durum': stok['durum']
                })
            
            self.stok_table.set_data(stok_data, self.stok_table.columns)
            
            self.generate_stok_no()
            self.generate_cikis_no()
            
            self.status_message.emit("Stok verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Veri yükleme hatası: {str(e)}")
    
    def generate_stok_no(self):
        """Yeni stok numarası oluştur"""
        try:
            last_stok = self.db_manager.execute_query(
                "SELECT stok_no FROM stok_kayitlari ORDER BY id DESC LIMIT 1"
            )
            
            if last_stok:
                last_no = last_stok[0]['stok_no']
                if last_no.startswith('STK'):
                    num = int(last_no[3:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_stok_no = f"STK{num:03d}"
            self.stok_no_input.setText(new_stok_no)
            
        except Exception as e:
            self.stok_no_input.setText("STK001")
    
    def generate_cikis_no(self):
        """Yeni çıkış numarası oluştur"""
        try:
            last_cikis = self.db_manager.execute_query(
                "SELECT cikis_no FROM stok_cikislari ORDER BY id DESC LIMIT 1"
            )
            
            if last_cikis:
                last_no = last_cikis[0]['cikis_no']
                if last_no.startswith('CIK'):
                    num = int(last_no[3:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_cikis_no = f"CIK{num:03d}"
            self.cikis_no_input.setText(new_cikis_no)
            
        except Exception as e:
            self.cikis_no_input.setText("CIK001")
    
    def kaydet_stok_giris(self):
        """Stok girişini kaydet"""
        try:
            urun_id = self.urun_combo.currentData()
            tedarikci_id = self.tedarikci_combo.currentData()
            
            if not urun_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen ürün seçin.")
                return
            
            if not tedarikci_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen tedarikçi seçin.")
                return
            
            if self.miktar_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir miktar girin.")
                return
            
            if self.alis_fiyati_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir alış fiyatı girin.")
                return
            
            stok_data = {
                'stok_no': self.stok_no_input.text(),
                'urun_id': urun_id,
                'miktar': self.miktar_input.value(),
                'birim': 'Ton',
                'alis_fiyati': self.alis_fiyati_input.value(),
                'tedarikci_id': tedarikci_id,
                'depo': self.depo_input.text(),
                'kim_adina': self.kim_adina_input.text(),
                'sirket': self.sirket_input.text(),
                'tarih': self.tarih_input.date().toString('yyyy-MM-dd'),
                'durum': 'Onaylandı'
            }
            
            stok_id = self.db_manager.insert_stok_kaydi(stok_data)
            
            if stok_id:
                self.create_automatic_accounting_entry(stok_data)
                
                QMessageBox.information(self, "Başarılı", "Stok girişi başarıyla kaydedildi ve otomatik muhasebe kayıtları oluşturuldu.")
                self.temizle_stok_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # Stok listesi tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Stok girişi kaydedilemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Stok giriş kaydetme hatası: {str(e)}")
    
    def create_automatic_accounting_entry(self, stok_data):
        """Otomatik muhasebe kaydı oluştur"""
        try:
            cari_islem_data = {
                'islem_no': f"CI-{stok_data['stok_no']}",
                'tarih': stok_data['tarih'],
                'cari_id': stok_data['tedarikci_id'],
                'hesap_turu': 'Genel Hesap',
                'islem_tipi': 'Tediye',
                'odeme_tipi': 'Havale',
                'tutar': stok_data['miktar'] * stok_data['alis_fiyati'],
                'doviz_tipi': 'TRY',
                'aciklama': f"Stok alımı - {stok_data['stok_no']}",
                'belge_no': stok_data['stok_no'],
                'durum': 'Beklemede',
                'olusturan_kullanici': 'Sistem'
            }
            
            self.db_manager.insert_cari_islem(cari_islem_data)
            
            gider_data = {
                'gider_no': f"GID-{stok_data['stok_no']}",
                'tarih': stok_data['tarih'],
                'sirket': stok_data.get('sirket', 'Yılmaz Transport'),
                'kategori': 'Stok Alımı',
                'alt_kategori': 'Ürün Alımı',
                'tutar': stok_data['miktar'] * stok_data['alis_fiyati'],
                'doviz': 'TRY',
                'gider_tipi': 'Şirket Gideri',
                'aciklama': f"Stok alımı - {stok_data['stok_no']}",
                'durum': 'Onaylandı'
            }
            
            self.db_manager.insert_gider_kaydi(gider_data)
            
        except Exception as e:
            print(f"Otomatik muhasebe kaydı hatası: {str(e)}")
    
    def kaydet_arac_cikis(self):
        """Araç çıkışını kaydet"""
        try:
            urun_id = self.cikis_urun_combo.currentData()
            musteri_id = self.musteri_combo.currentData()
            
            if not urun_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen ürün seçin.")
                return
            
            if not musteri_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen müşteri seçin.")
                return
            
            if self.cikis_miktar_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir miktar girin.")
                return
            
            if not self.plaka_input.text().strip():
                QMessageBox.warning(self, "Uyarı", "Lütfen plaka girin.")
                return
            
            cikis_data = {
                'cikis_no': self.cikis_no_input.text(),
                'urun_id': urun_id,
                'miktar': self.cikis_miktar_input.value(),
                'birim': 'Ton',
                'musteri_id': musteri_id,
                'plaka': self.plaka_input.text(),
                'sofor': self.sofor_input.text(),
                'tonaj': self.tonaj_input.value(),
                'tarih': self.cikis_tarih_input.date().toString('yyyy-MM-dd'),
                'durum': 'Hazırlanıyor'
            }
            
            query = """
                INSERT INTO stok_cikislari 
                (cikis_no, urun_id, miktar, birim, musteri_id, plaka, sofor, tonaj, tarih, durum)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            
            cikis_id = self.db_manager.execute_insert(query, (
                cikis_data['cikis_no'], cikis_data['urun_id'], cikis_data['miktar'],
                cikis_data['birim'], cikis_data['musteri_id'], cikis_data['plaka'],
                cikis_data['sofor'], cikis_data['tonaj'], cikis_data['tarih'],
                cikis_data['durum']
            ))
            
            if cikis_id:
                QMessageBox.information(self, "Başarılı", "Araç çıkışı başarıyla kaydedildi.")
                self.temizle_cikis_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # Stok listesi tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Araç çıkışı kaydedilemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Araç çıkış kaydetme hatası: {str(e)}")
    
    def temizle_stok_form(self):
        """Stok formunu temizle"""
        self.urun_combo.setCurrentIndex(0)
        self.miktar_input.setValue(0)
        self.alis_fiyati_input.setValue(0)
        self.tedarikci_combo.setCurrentIndex(0)
        self.depo_input.clear()
        self.kim_adina_input.clear()
        self.sirket_input.clear()
        self.tarih_input.setDate(QDate.currentDate())
        self.generate_stok_no()
    
    def temizle_cikis_form(self):
        """Çıkış formunu temizle"""
        self.cikis_urun_combo.setCurrentIndex(0)
        self.cikis_miktar_input.setValue(0)
        self.musteri_combo.setCurrentIndex(0)
        self.plaka_input.clear()
        self.sofor_input.clear()
        self.tonaj_input.setValue(0)
        self.cikis_tarih_input.setDate(QDate.currentDate())
        self.generate_cikis_no()
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

#!/usr/bin/env python3
"""
Cari Tanımlama Modülü
Müşteri ve tedarikçi tanımlama işlemleri
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

class CariTanimlamaModule(QWidget):
    """Cari tanımlama ana modülü"""
    
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
        
        title_label = QLabel("👥 Cari Tanımlama")
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
        
        self.create_cari_listesi_tab()
        self.tab_widget.addTab(self.cari_listesi_tab, "👥 Cari Listesi")
        
        self.create_yeni_cari_tab()
        self.tab_widget.addTab(self.yeni_cari_tab, "➕ Yeni Cari")
        
        self.create_urun_tanimlama_tab()
        self.tab_widget.addTab(self.urun_tanimlama_tab, "📦 Ürün Tanımlama")
        
        layout.addWidget(self.tab_widget)
    
    def create_cari_listesi_tab(self):
        """Cari listesi tab'ını oluştur"""
        self.cari_listesi_tab = QWidget()
        layout = QVBoxLayout(self.cari_listesi_tab)
        
        self.cari_table = ProfessionalTable()
        layout.addWidget(self.cari_table)
        
        columns = [
            {'key': 'kod', 'title': 'Cari Kodu', 'width': 120},
            {'key': 'ad', 'title': 'Cari Adı', 'width': 200},
            {'key': 'tip', 'title': 'Tip', 'width': 100, 'format': 'badge'},
            {'key': 'telefon', 'title': 'Telefon', 'width': 150},
            {'key': 'email', 'title': 'E-mail', 'width': 200},
            {'key': 'adres', 'title': 'Adres', 'width': 250},
            {'key': 'vergi_no', 'title': 'Vergi No', 'width': 120},
            {'key': 'vergi_dairesi', 'title': 'Vergi Dairesi', 'width': 150},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.cari_table.set_data([], columns)
    
    def create_yeni_cari_tab(self):
        """Yeni cari tab'ını oluştur"""
        self.yeni_cari_tab = QWidget()
        layout = QVBoxLayout(self.yeni_cari_tab)
        
        form_group = QGroupBox("Cari Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.cari_kod_input = QLineEdit()
        self.cari_kod_input.setPlaceholderText("Otomatik oluşturulacak")
        self.cari_kod_input.setReadOnly(True)
        form_layout.addRow("Cari Kodu:", self.cari_kod_input)
        
        self.cari_ad_input = QLineEdit()
        self.cari_ad_input.setPlaceholderText("Cari adı")
        form_layout.addRow("Cari Adı:", self.cari_ad_input)
        
        self.cari_tip_combo = QComboBox()
        self.cari_tip_combo.addItems(["Müşteri", "Tedarikçi", "Ortak"])
        form_layout.addRow("Tip:", self.cari_tip_combo)
        
        self.telefon_input = QLineEdit()
        self.telefon_input.setPlaceholderText("+90 532 123 4567")
        form_layout.addRow("Telefon:", self.telefon_input)
        
        self.email_input = QLineEdit()
        self.email_input.setPlaceholderText("email@domain.com")
        form_layout.addRow("E-mail:", self.email_input)
        
        self.adres_input = QTextEdit()
        self.adres_input.setMaximumHeight(80)
        self.adres_input.setPlaceholderText("Adres bilgileri")
        form_layout.addRow("Adres:", self.adres_input)
        
        self.vergi_no_input = QLineEdit()
        self.vergi_no_input.setPlaceholderText("1234567890")
        form_layout.addRow("Vergi No:", self.vergi_no_input)
        
        self.vergi_dairesi_input = QLineEdit()
        self.vergi_dairesi_input.setPlaceholderText("Vergi dairesi")
        form_layout.addRow("Vergi Dairesi:", self.vergi_dairesi_input)
        
        self.durum_combo = QComboBox()
        self.durum_combo.addItems(["Aktif", "Pasif"])
        form_layout.addRow("Durum:", self.durum_combo)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.cari_kaydet_btn = QPushButton("💾 Cari Kaydet")
        self.cari_kaydet_btn.setStyleSheet("""
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
        button_layout.addWidget(self.cari_kaydet_btn)
        
        self.cari_temizle_btn = QPushButton("🗑️ Temizle")
        self.cari_temizle_btn.setStyleSheet("""
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
        button_layout.addWidget(self.cari_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def create_urun_tanimlama_tab(self):
        """Ürün tanımlama tab'ını oluştur"""
        self.urun_tanimlama_tab = QWidget()
        layout = QVBoxLayout(self.urun_tanimlama_tab)
        
        urun_list_group = QGroupBox("Ürün Listesi")
        urun_list_layout = QVBoxLayout(urun_list_group)
        
        self.urun_table = ProfessionalTable()
        urun_list_layout.addWidget(self.urun_table)
        
        urun_columns = [
            {'key': 'kod', 'title': 'Ürün Kodu', 'width': 120},
            {'key': 'ad', 'title': 'Ürün Adı', 'width': 200},
            {'key': 'kategori', 'title': 'Kategori', 'width': 120},
            {'key': 'birim', 'title': 'Birim', 'width': 80},
            {'key': 'aciklama', 'title': 'Açıklama', 'width': 250},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.urun_table.set_data([], urun_columns)
        layout.addWidget(urun_list_group)
        
        urun_form_group = QGroupBox("Yeni Ürün Ekle")
        urun_form_layout = QFormLayout(urun_form_group)
        
        self.urun_kod_input = QLineEdit()
        self.urun_kod_input.setPlaceholderText("Otomatik oluşturulacak")
        self.urun_kod_input.setReadOnly(True)
        urun_form_layout.addRow("Ürün Kodu:", self.urun_kod_input)
        
        self.urun_ad_input = QLineEdit()
        self.urun_ad_input.setPlaceholderText("Ürün adı")
        urun_form_layout.addRow("Ürün Adı:", self.urun_ad_input)
        
        self.kategori_combo = QComboBox()
        self.kategori_combo.addItems(["Tahıl", "Yağ", "Bakliyat", "Diğer"])
        urun_form_layout.addRow("Kategori:", self.kategori_combo)
        
        self.birim_combo = QComboBox()
        self.birim_combo.addItems(["Ton", "Kg", "Litre", "Adet"])
        urun_form_layout.addRow("Birim:", self.birim_combo)
        
        self.urun_aciklama_input = QTextEdit()
        self.urun_aciklama_input.setMaximumHeight(60)
        self.urun_aciklama_input.setPlaceholderText("Ürün açıklaması")
        urun_form_layout.addRow("Açıklama:", self.urun_aciklama_input)
        
        urun_button_layout = QHBoxLayout()
        urun_button_layout.addStretch()
        
        self.urun_kaydet_btn = QPushButton("💾 Ürün Kaydet")
        self.urun_kaydet_btn.setStyleSheet("""
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
        urun_button_layout.addWidget(self.urun_kaydet_btn)
        
        self.urun_temizle_btn = QPushButton("🗑️ Temizle")
        self.urun_temizle_btn.setStyleSheet("""
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
        urun_button_layout.addWidget(self.urun_temizle_btn)
        
        urun_form_layout.addRow(urun_button_layout)
        layout.addWidget(urun_form_group)
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.cari_kaydet_btn.clicked.connect(self.kaydet_cari)
        self.cari_temizle_btn.clicked.connect(self.temizle_cari_form)
        self.urun_kaydet_btn.clicked.connect(self.kaydet_urun)
        self.urun_temizle_btn.clicked.connect(self.temizle_urun_form)
        self.cari_table.data_changed.connect(self.refresh_data)
        self.urun_table.data_changed.connect(self.refresh_data)
        self.cari_tip_combo.currentTextChanged.connect(self.on_cari_tip_changed)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            cariler = self.db_manager.get_all_cari_kayitlar()
            cari_data = []
            
            for cari in cariler:
                cari_data.append({
                    'id': cari['id'],
                    'kod': cari['kod'],
                    'ad': cari['ad'],
                    'tip': cari['tip'],
                    'telefon': cari['telefon'] or '',
                    'email': cari['email'] or '',
                    'adres': cari['adres'] or '',
                    'vergi_no': cari['vergi_no'] or '',
                    'vergi_dairesi': cari['vergi_dairesi'] or '',
                    'durum': cari['durum']
                })
            
            self.cari_table.set_data(cari_data, self.cari_table.columns)
            
            urunler = self.db_manager.get_all_urunler()
            urun_data = []
            
            for urun in urunler:
                urun_data.append({
                    'id': urun['id'],
                    'kod': urun['kod'],
                    'ad': urun['ad'],
                    'kategori': urun['kategori'],
                    'birim': urun['birim'],
                    'aciklama': urun['aciklama'] or '',
                    'durum': urun['durum']
                })
            
            self.urun_table.set_data(urun_data, self.urun_table.columns)
            
            self.generate_cari_kod()
            self.generate_urun_kod()
            
            self.status_message.emit("Cari ve ürün verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Veri yükleme hatası: {str(e)}")
    
    def generate_cari_kod(self):
        """Yeni cari kodu oluştur"""
        try:
            tip = self.cari_tip_combo.currentText()
            
            if tip == "Müşteri":
                prefix = "MUS"
            elif tip == "Tedarikçi":
                prefix = "TED"
            else:
                prefix = "ORT"
            
            last_cari = self.db_manager.execute_query(
                "SELECT kod FROM cari_kayitlar WHERE kod LIKE ? ORDER BY id DESC LIMIT 1",
                (f"{prefix}%",)
            )
            
            if last_cari:
                last_no = last_cari[0]['kod']
                if last_no.startswith(prefix):
                    num = int(last_no[3:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_cari_kod = f"{prefix}{num:03d}"
            self.cari_kod_input.setText(new_cari_kod)
            
        except Exception as e:
            self.cari_kod_input.setText("MUS001")
    
    def generate_urun_kod(self):
        """Yeni ürün kodu oluştur"""
        try:
            last_urun = self.db_manager.execute_query(
                "SELECT kod FROM urunler ORDER BY id DESC LIMIT 1"
            )
            
            if last_urun:
                last_no = last_urun[0]['kod']
                if last_no.startswith('URN'):
                    num = int(last_no[3:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_urun_kod = f"URN{num:03d}"
            self.urun_kod_input.setText(new_urun_kod)
            
        except Exception as e:
            self.urun_kod_input.setText("URN001")
    
    def on_cari_tip_changed(self):
        """Cari tip değiştiğinde"""
        self.generate_cari_kod()
    
    def kaydet_cari(self):
        """Cari kaydı kaydet"""
        try:
            if not self.cari_ad_input.text().strip():
                QMessageBox.warning(self, "Uyarı", "Lütfen cari adı girin.")
                return
            
            cari_data = {
                'kod': self.cari_kod_input.text(),
                'ad': self.cari_ad_input.text(),
                'tip': self.cari_tip_combo.currentText(),
                'telefon': self.telefon_input.text(),
                'email': self.email_input.text(),
                'adres': self.adres_input.toPlainText(),
                'vergi_no': self.vergi_no_input.text(),
                'vergi_dairesi': self.vergi_dairesi_input.text(),
                'durum': self.durum_combo.currentText()
            }
            
            cari_id = self.db_manager.insert_cari_kayit(cari_data)
            
            if cari_id:
                QMessageBox.information(self, "Başarılı", "Cari kaydı başarıyla eklendi.")
                self.temizle_cari_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # Cari listesi tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Cari kaydı eklenemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Cari kaydetme hatası: {str(e)}")
    
    def kaydet_urun(self):
        """Ürün kaydı kaydet"""
        try:
            if not self.urun_ad_input.text().strip():
                QMessageBox.warning(self, "Uyarı", "Lütfen ürün adı girin.")
                return
            
            urun_data = {
                'kod': self.urun_kod_input.text(),
                'ad': self.urun_ad_input.text(),
                'kategori': self.kategori_combo.currentText(),
                'birim': self.birim_combo.currentText(),
                'aciklama': self.urun_aciklama_input.toPlainText(),
                'durum': 'Aktif'
            }
            
            urun_id = self.db_manager.insert_urun(urun_data)
            
            if urun_id:
                QMessageBox.information(self, "Başarılı", "Ürün kaydı başarıyla eklendi.")
                self.temizle_urun_form()
                self.refresh_data()
            else:
                QMessageBox.critical(self, "Hata", "Ürün kaydı eklenemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Ürün kaydetme hatası: {str(e)}")
    
    def temizle_cari_form(self):
        """Cari formunu temizle"""
        self.cari_ad_input.clear()
        self.cari_tip_combo.setCurrentIndex(0)
        self.telefon_input.clear()
        self.email_input.clear()
        self.adres_input.clear()
        self.vergi_no_input.clear()
        self.vergi_dairesi_input.clear()
        self.durum_combo.setCurrentIndex(0)
        self.generate_cari_kod()
    
    def temizle_urun_form(self):
        """Ürün formunu temizle"""
        self.urun_ad_input.clear()
        self.kategori_combo.setCurrentIndex(0)
        self.birim_combo.setCurrentIndex(0)
        self.urun_aciklama_input.clear()
        self.generate_urun_kod()
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

#!/usr/bin/env python3
"""
Banka Yönetimi Modülü
Banka hesapları ve işlemleri yönetimi
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

class BankaYonetimiModule(QWidget):
    """Banka yönetimi ana modülü"""
    
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
        
        title_label = QLabel("🏦 Banka Yönetimi")
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
        
        self.create_banka_hesaplari_tab()
        self.tab_widget.addTab(self.banka_hesaplari_tab, "🏦 Banka Hesapları")
        
        self.create_banka_islemleri_tab()
        self.tab_widget.addTab(self.banka_islemleri_tab, "💳 Banka İşlemleri")
        
        self.create_yeni_hesap_tab()
        self.tab_widget.addTab(self.yeni_hesap_tab, "➕ Yeni Hesap")
        
        self.create_yeni_islem_tab()
        self.tab_widget.addTab(self.yeni_islem_tab, "➕ Yeni İşlem")
        
        layout.addWidget(self.tab_widget)
    
    def create_banka_hesaplari_tab(self):
        """Banka hesapları tab'ını oluştur"""
        self.banka_hesaplari_tab = QWidget()
        layout = QVBoxLayout(self.banka_hesaplari_tab)
        
        self.hesap_table = ProfessionalTable()
        layout.addWidget(self.hesap_table)
        
        columns = [
            {'key': 'banka_adi', 'title': 'Banka Adı', 'width': 150},
            {'key': 'hesap_adi', 'title': 'Hesap Adı', 'width': 200},
            {'key': 'hesap_no', 'title': 'Hesap No', 'width': 150},
            {'key': 'iban', 'title': 'IBAN', 'width': 250},
            {'key': 'bakiye', 'title': 'Bakiye', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'doviz', 'title': 'Döviz', 'width': 80},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.hesap_table.set_data([], columns)
    
    def create_banka_islemleri_tab(self):
        """Banka işlemleri tab'ını oluştur"""
        self.banka_islemleri_tab = QWidget()
        layout = QVBoxLayout(self.banka_islemleri_tab)
        
        self.islem_table = ProfessionalTable()
        layout.addWidget(self.islem_table)
        
        columns = [
            {'key': 'tarih', 'title': 'Tarih', 'width': 120, 'format': 'date'},
            {'key': 'banka_adi', 'title': 'Banka', 'width': 150},
            {'key': 'hesap_adi', 'title': 'Hesap', 'width': 200},
            {'key': 'islem_tipi', 'title': 'İşlem Tipi', 'width': 100, 'format': 'badge'},
            {'key': 'tutar', 'title': 'Tutar', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'aciklama', 'title': 'Açıklama', 'width': 250},
            {'key': 'referans_no', 'title': 'Referans No', 'width': 150},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.islem_table.set_data([], columns)
    
    def create_yeni_hesap_tab(self):
        """Yeni hesap tab'ını oluştur"""
        self.yeni_hesap_tab = QWidget()
        layout = QVBoxLayout(self.yeni_hesap_tab)
        
        form_group = QGroupBox("Banka Hesap Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.banka_adi_input = QLineEdit()
        self.banka_adi_input.setPlaceholderText("Banka adı")
        form_layout.addRow("Banka Adı:", self.banka_adi_input)
        
        self.hesap_adi_input = QLineEdit()
        self.hesap_adi_input.setPlaceholderText("Hesap adı")
        form_layout.addRow("Hesap Adı:", self.hesap_adi_input)
        
        self.hesap_no_input = QLineEdit()
        self.hesap_no_input.setPlaceholderText("1234567890")
        form_layout.addRow("Hesap No:", self.hesap_no_input)
        
        self.iban_input = QLineEdit()
        self.iban_input.setPlaceholderText("TR12 3456 7890 1234 5678 9012 34")
        form_layout.addRow("IBAN:", self.iban_input)
        
        self.bakiye_input = QDoubleSpinBox()
        self.bakiye_input.setRange(0, 99999999.99)
        self.bakiye_input.setDecimals(2)
        form_layout.addRow("Başlangıç Bakiye:", self.bakiye_input)
        
        self.hesap_doviz_combo = QComboBox()
        self.hesap_doviz_combo.addItems(["TRY", "USD", "EUR"])
        form_layout.addRow("Döviz:", self.hesap_doviz_combo)
        
        self.hesap_durum_combo = QComboBox()
        self.hesap_durum_combo.addItems(["Aktif", "Pasif"])
        form_layout.addRow("Durum:", self.hesap_durum_combo)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.hesap_kaydet_btn = QPushButton("💾 Hesap Kaydet")
        self.hesap_kaydet_btn.setStyleSheet("""
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
        button_layout.addWidget(self.hesap_kaydet_btn)
        
        self.hesap_temizle_btn = QPushButton("🗑️ Temizle")
        self.hesap_temizle_btn.setStyleSheet("""
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
        button_layout.addWidget(self.hesap_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def create_yeni_islem_tab(self):
        """Yeni işlem tab'ını oluştur"""
        self.yeni_islem_tab = QWidget()
        layout = QVBoxLayout(self.yeni_islem_tab)
        
        form_group = QGroupBox("Banka İşlem Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.hesap_secim_combo = QComboBox()
        form_layout.addRow("Hesap Seç:", self.hesap_secim_combo)
        
        self.islem_tarih_input = QDateEdit()
        self.islem_tarih_input.setDate(QDate.currentDate())
        self.islem_tarih_input.setCalendarPopup(True)
        form_layout.addRow("Tarih:", self.islem_tarih_input)
        
        self.islem_tipi_combo = QComboBox()
        self.islem_tipi_combo.addItems(["Gelen", "Giden", "Virman"])
        form_layout.addRow("İşlem Tipi:", self.islem_tipi_combo)
        
        self.islem_tutar_input = QDoubleSpinBox()
        self.islem_tutar_input.setRange(0.01, 9999999.99)
        self.islem_tutar_input.setDecimals(2)
        form_layout.addRow("Tutar:", self.islem_tutar_input)
        
        self.referans_no_input = QLineEdit()
        self.referans_no_input.setPlaceholderText("Referans numarası")
        form_layout.addRow("Referans No:", self.referans_no_input)
        
        self.islem_aciklama_input = QTextEdit()
        self.islem_aciklama_input.setMaximumHeight(100)
        form_layout.addRow("Açıklama:", self.islem_aciklama_input)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.islem_kaydet_btn = QPushButton("💾 İşlem Kaydet")
        self.islem_kaydet_btn.setStyleSheet("""
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
        button_layout.addWidget(self.islem_kaydet_btn)
        
        self.islem_temizle_btn = QPushButton("🗑️ Temizle")
        self.islem_temizle_btn.setStyleSheet("""
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
        button_layout.addWidget(self.islem_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.hesap_kaydet_btn.clicked.connect(self.kaydet_hesap)
        self.hesap_temizle_btn.clicked.connect(self.temizle_hesap_form)
        self.islem_kaydet_btn.clicked.connect(self.kaydet_islem)
        self.islem_temizle_btn.clicked.connect(self.temizle_islem_form)
        self.hesap_table.data_changed.connect(self.refresh_data)
        self.islem_table.data_changed.connect(self.refresh_data)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            hesaplar = self.db_manager.get_all_banka_hesaplari()
            hesap_data = []
            
            for hesap in hesaplar:
                hesap_data.append({
                    'id': hesap['id'],
                    'banka_adi': hesap['banka_adi'],
                    'hesap_adi': hesap['hesap_adi'],
                    'hesap_no': hesap['hesap_no'] or '',
                    'iban': hesap['iban'] or '',
                    'bakiye': hesap['bakiye'],
                    'doviz': hesap['doviz'],
                    'durum': hesap['durum']
                })
            
            self.hesap_table.set_data(hesap_data, self.hesap_table.columns)
            
            islemler = self.db_manager.get_all_banka_islemleri()
            islem_data = []
            
            for islem in islemler:
                islem_data.append({
                    'id': islem['id'],
                    'tarih': islem['tarih'],
                    'banka_adi': islem['banka_adi'] or 'Bilinmiyor',
                    'hesap_adi': islem['hesap_adi'] or 'Bilinmiyor',
                    'islem_tipi': islem['islem_tipi'],
                    'tutar': islem['tutar'],
                    'aciklama': islem['aciklama'] or '',
                    'referans_no': islem['referans_no'] or '',
                    'durum': islem['durum']
                })
            
            self.islem_table.set_data(islem_data, self.islem_table.columns)
            
            self.hesap_secim_combo.clear()
            self.hesap_secim_combo.addItem("Hesap Seçin", None)
            for hesap in hesaplar:
                display_text = f"{hesap['banka_adi']} - {hesap['hesap_adi']}"
                self.hesap_secim_combo.addItem(display_text, hesap['id'])
            
            self.status_message.emit("Banka verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Veri yükleme hatası: {str(e)}")
    
    def kaydet_hesap(self):
        """Banka hesabını kaydet"""
        try:
            if not self.banka_adi_input.text().strip():
                QMessageBox.warning(self, "Uyarı", "Lütfen banka adı girin.")
                return
            
            if not self.hesap_adi_input.text().strip():
                QMessageBox.warning(self, "Uyarı", "Lütfen hesap adı girin.")
                return
            
            hesap_data = {
                'banka_adi': self.banka_adi_input.text(),
                'hesap_adi': self.hesap_adi_input.text(),
                'hesap_no': self.hesap_no_input.text(),
                'iban': self.iban_input.text(),
                'bakiye': self.bakiye_input.value(),
                'doviz': self.hesap_doviz_combo.currentText(),
                'durum': self.hesap_durum_combo.currentText()
            }
            
            hesap_id = self.db_manager.insert_banka_hesabi(hesap_data)
            
            if hesap_id:
                QMessageBox.information(self, "Başarılı", "Banka hesabı başarıyla eklendi.")
                self.temizle_hesap_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # Hesaplar tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Banka hesabı eklenemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Hesap kaydetme hatası: {str(e)}")
    
    def kaydet_islem(self):
        """Banka işlemini kaydet"""
        try:
            hesap_id = self.hesap_secim_combo.currentData()
            
            if not hesap_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen hesap seçin.")
                return
            
            if self.islem_tutar_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir tutar girin.")
                return
            
            islem_data = {
                'hesap_id': hesap_id,
                'tarih': self.islem_tarih_input.date().toString('yyyy-MM-dd'),
                'islem_tipi': self.islem_tipi_combo.currentText(),
                'tutar': self.islem_tutar_input.value(),
                'aciklama': self.islem_aciklama_input.toPlainText(),
                'referans_no': self.referans_no_input.text(),
                'durum': 'Onaylandı'
            }
            
            query = """
                INSERT INTO banka_islemleri 
                (hesap_id, tarih, islem_tipi, tutar, aciklama, referans_no, durum)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            
            islem_id = self.db_manager.execute_insert(query, (
                islem_data['hesap_id'], islem_data['tarih'], islem_data['islem_tipi'],
                islem_data['tutar'], islem_data['aciklama'], islem_data['referans_no'],
                islem_data['durum']
            ))
            
            if islem_id:
                self.update_hesap_bakiye(hesap_id, islem_data['islem_tipi'], islem_data['tutar'])
                
                QMessageBox.information(self, "Başarılı", "Banka işlemi başarıyla kaydedildi.")
                self.temizle_islem_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(1)  # İşlemler tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Banka işlemi kaydedilemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"İşlem kaydetme hatası: {str(e)}")
    
    def update_hesap_bakiye(self, hesap_id: int, islem_tipi: str, tutar: float):
        """Hesap bakiyesini güncelle"""
        try:
            if islem_tipi == "Gelen":
                query = "UPDATE banka_hesaplari SET bakiye = bakiye + ? WHERE id = ?"
            elif islem_tipi == "Giden":
                query = "UPDATE banka_hesaplari SET bakiye = bakiye - ? WHERE id = ?"
            else:  # Virman
                query = "UPDATE banka_hesaplari SET bakiye = bakiye - ? WHERE id = ?"
            
            self.db_manager.execute_update(query, (tutar, hesap_id))
            
        except Exception as e:
            print(f"Bakiye güncelleme hatası: {str(e)}")
    
    def temizle_hesap_form(self):
        """Hesap formunu temizle"""
        self.banka_adi_input.clear()
        self.hesap_adi_input.clear()
        self.hesap_no_input.clear()
        self.iban_input.clear()
        self.bakiye_input.setValue(0)
        self.hesap_doviz_combo.setCurrentIndex(0)
        self.hesap_durum_combo.setCurrentIndex(0)
    
    def temizle_islem_form(self):
        """İşlem formunu temizle"""
        self.hesap_secim_combo.setCurrentIndex(0)
        self.islem_tarih_input.setDate(QDate.currentDate())
        self.islem_tipi_combo.setCurrentIndex(0)
        self.islem_tutar_input.setValue(0)
        self.referans_no_input.clear()
        self.islem_aciklama_input.clear()
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

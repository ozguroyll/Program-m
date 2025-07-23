#!/usr/bin/env python3
"""
Talep Yönetimi Modülü
Müşteri talepleri ve tedarikçi yönetimi
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

class TalepYonetimiModule(QWidget):
    """Talep yönetimi ana modülü"""
    
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
        
        title_label = QLabel("📋 Talep & Tedarik Merkezi")
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
        
        self.create_talep_listesi_tab()
        self.tab_widget.addTab(self.talep_listesi_tab, "📋 Talep Listesi")
        
        self.create_yeni_talep_tab()
        self.tab_widget.addTab(self.yeni_talep_tab, "➕ Yeni Talep")
        
        self.create_teklif_karsilastirma_tab()
        self.tab_widget.addTab(self.teklif_karsilastirma_tab, "⚖️ Teklif Karşılaştırma")
        
        layout.addWidget(self.tab_widget)
    
    def create_talep_listesi_tab(self):
        """Talep listesi tab'ını oluştur"""
        self.talep_listesi_tab = QWidget()
        layout = QVBoxLayout(self.talep_listesi_tab)
        
        self.talep_table = ProfessionalTable()
        layout.addWidget(self.talep_table)
        
        columns = [
            {'key': 'talep_no', 'title': 'Talep No', 'width': 120},
            {'key': 'musteri_adi', 'title': 'Müşteri', 'width': 200},
            {'key': 'urun_adi', 'title': 'Ürün', 'width': 150},
            {'key': 'miktar', 'title': 'Miktar', 'width': 100, 'format': 'number', 'align': 'right'},
            {'key': 'birim', 'title': 'Birim', 'width': 80},
            {'key': 'hedef_fiyat', 'title': 'Hedef Fiyat', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'doviz', 'title': 'Döviz', 'width': 80},
            {'key': 'teslimat_tarihi', 'title': 'Teslimat', 'width': 120, 'format': 'date'},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.talep_table.set_data([], columns)
    
    def create_yeni_talep_tab(self):
        """Yeni talep tab'ını oluştur"""
        self.yeni_talep_tab = QWidget()
        layout = QVBoxLayout(self.yeni_talep_tab)
        
        form_group = QGroupBox("Talep Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.talep_no_input = QLineEdit()
        self.talep_no_input.setPlaceholderText("Otomatik oluşturulacak")
        self.talep_no_input.setReadOnly(True)
        form_layout.addRow("Talep No:", self.talep_no_input)
        
        self.musteri_combo = QComboBox()
        form_layout.addRow("Müşteri:", self.musteri_combo)
        
        self.urun_combo = QComboBox()
        form_layout.addRow("Ürün:", self.urun_combo)
        
        self.miktar_input = QDoubleSpinBox()
        self.miktar_input.setRange(0.01, 999999.99)
        self.miktar_input.setDecimals(2)
        self.miktar_input.setSuffix(" Ton")
        form_layout.addRow("Miktar:", self.miktar_input)
        
        self.hedef_fiyat_input = QDoubleSpinBox()
        self.hedef_fiyat_input.setRange(0.01, 999999.99)
        self.hedef_fiyat_input.setDecimals(2)
        form_layout.addRow("Hedef Fiyat:", self.hedef_fiyat_input)
        
        self.doviz_combo = QComboBox()
        self.doviz_combo.addItems(["USD", "EUR", "TRY"])
        form_layout.addRow("Döviz:", self.doviz_combo)
        
        self.teslimat_tarihi_input = QDateEdit()
        self.teslimat_tarihi_input.setDate(QDate.currentDate().addDays(30))
        self.teslimat_tarihi_input.setCalendarPopup(True)
        form_layout.addRow("Teslimat Tarihi:", self.teslimat_tarihi_input)
        
        self.aciklama_input = QTextEdit()
        self.aciklama_input.setMaximumHeight(100)
        form_layout.addRow("Açıklama:", self.aciklama_input)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.kaydet_btn = QPushButton("💾 Kaydet")
        self.kaydet_btn.setStyleSheet("""
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
        button_layout.addWidget(self.kaydet_btn)
        
        self.temizle_btn = QPushButton("🗑️ Temizle")
        self.temizle_btn.setStyleSheet("""
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
        button_layout.addWidget(self.temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def create_teklif_karsilastirma_tab(self):
        """Teklif karşılaştırma tab'ını oluştur"""
        self.teklif_karsilastirma_tab = QWidget()
        layout = QVBoxLayout(self.teklif_karsilastirma_tab)
        
        talep_layout = QHBoxLayout()
        talep_layout.addWidget(QLabel("Talep Seç:"))
        
        self.talep_secim_combo = QComboBox()
        talep_layout.addWidget(self.talep_secim_combo)
        
        talep_layout.addStretch()
        layout.addLayout(talep_layout)
        
        self.teklif_table = ProfessionalTable()
        layout.addWidget(self.teklif_table)
        
        teklif_columns = [
            {'key': 'tedarikci_adi', 'title': 'Tedarikçi', 'width': 200},
            {'key': 'teklif_fiyati', 'title': 'Teklif Fiyatı', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'doviz', 'title': 'Döviz', 'width': 80},
            {'key': 'teslimat_suresi', 'title': 'Teslimat (Gün)', 'width': 120, 'align': 'center'},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'},
            {'key': 'teklif_tarihi', 'title': 'Teklif Tarihi', 'width': 120, 'format': 'date'}
        ]
        
        self.teklif_table.set_data([], teklif_columns)
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.kaydet_btn.clicked.connect(self.kaydet_talep)
        self.temizle_btn.clicked.connect(self.temizle_form)
        self.talep_table.data_changed.connect(self.refresh_data)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            musteriler = self.db_manager.execute_query(
                "SELECT id, ad FROM cari_kayitlar WHERE tip = 'Müşteri' AND durum = 'Aktif' ORDER BY ad"
            )
            
            self.musteri_combo.clear()
            self.musteri_combo.addItem("Müşteri Seçin", None)
            for musteri in musteriler:
                self.musteri_combo.addItem(musteri['ad'], musteri['id'])
            
            urunler = self.db_manager.get_all_urunler()
            
            self.urun_combo.clear()
            self.urun_combo.addItem("Ürün Seçin", None)
            for urun in urunler:
                self.urun_combo.addItem(urun['ad'], urun['id'])
            
            talepler = self.db_manager.get_all_talepler()
            talep_data = []
            
            for talep in talepler:
                talep_data.append({
                    'id': talep['id'],
                    'talep_no': talep['talep_no'],
                    'musteri_adi': talep['musteri_adi'] or 'Bilinmiyor',
                    'urun_adi': talep['urun_adi'] or 'Bilinmiyor',
                    'miktar': talep['miktar'],
                    'birim': talep['birim'],
                    'hedef_fiyat': talep['hedef_fiyat'] or 0,
                    'doviz': talep['doviz'],
                    'teslimat_tarihi': talep['teslimat_tarihi'],
                    'durum': talep['durum']
                })
            
            self.talep_table.set_data(talep_data, self.talep_table.columns)
            
            self.talep_secim_combo.clear()
            self.talep_secim_combo.addItem("Talep Seçin", None)
            for talep in talepler:
                display_text = f"{talep['talep_no']} - {talep['musteri_adi']} - {talep['urun_adi']}"
                self.talep_secim_combo.addItem(display_text, talep['id'])
            
            self.generate_talep_no()
            
            self.status_message.emit("Talep verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Veri yükleme hatası: {str(e)}")
    
    def generate_talep_no(self):
        """Yeni talep numarası oluştur"""
        try:
            last_talep = self.db_manager.execute_query(
                "SELECT talep_no FROM talepler ORDER BY id DESC LIMIT 1"
            )
            
            if last_talep:
                last_no = last_talep[0]['talep_no']
                if last_no.startswith('TAL'):
                    num = int(last_no[3:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_talep_no = f"TAL{num:03d}"
            self.talep_no_input.setText(new_talep_no)
            
        except Exception as e:
            self.talep_no_input.setText("TAL001")
    
    def kaydet_talep(self):
        """Talebi kaydet"""
        try:
            musteri_id = self.musteri_combo.currentData()
            urun_id = self.urun_combo.currentData()
            
            if not musteri_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen müşteri seçin.")
                return
            
            if not urun_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen ürün seçin.")
                return
            
            if self.miktar_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir miktar girin.")
                return
            
            talep_data = {
                'talep_no': self.talep_no_input.text(),
                'musteri_id': musteri_id,
                'urun_id': urun_id,
                'miktar': self.miktar_input.value(),
                'birim': 'Ton',
                'hedef_fiyat': self.hedef_fiyat_input.value() if self.hedef_fiyat_input.value() > 0 else None,
                'doviz': self.doviz_combo.currentText(),
                'teslimat_tarihi': self.teslimat_tarihi_input.date().toString('yyyy-MM-dd'),
                'aciklama': self.aciklama_input.toPlainText(),
                'durum': 'Aktif'
            }
            
            talep_id = self.db_manager.insert_talep(talep_data)
            
            if talep_id:
                QMessageBox.information(self, "Başarılı", "Talep başarıyla kaydedildi.")
                self.temizle_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # Talep listesi tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Talep kaydedilemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Talep kaydetme hatası: {str(e)}")
    
    def temizle_form(self):
        """Formu temizle"""
        self.musteri_combo.setCurrentIndex(0)
        self.urun_combo.setCurrentIndex(0)
        self.miktar_input.setValue(0)
        self.hedef_fiyat_input.setValue(0)
        self.doviz_combo.setCurrentIndex(0)
        self.teslimat_tarihi_input.setDate(QDate.currentDate().addDays(30))
        self.aciklama_input.clear()
        self.generate_talep_no()
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

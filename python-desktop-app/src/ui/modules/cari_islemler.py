#!/usr/bin/env python3
"""
Cari İşlemler Modülü
Müşteri ve tedarikçi işlemleri, hesap ekstreleri
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTabWidget, QLabel, QFrame,
    QPushButton, QLineEdit, QComboBox, QDateEdit, QTextEdit, QSpinBox,
    QDoubleSpinBox, QMessageBox, QFormLayout, QGroupBox, QListWidget,
    QListWidgetItem, QSplitter
)
from PyQt6.QtCore import Qt, pyqtSignal, QDate
from PyQt6.QtGui import QFont
from typing import Dict, Any, List
from datetime import datetime, date

from database.db_manager import DatabaseManager
from ui.components.professional_table import ProfessionalTable

class CariIslemlerModule(QWidget):
    """Cari işlemler ana modülü"""
    
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
        
        title_label = QLabel("💳 Cari İşlemler")
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
        
        self.create_islem_listesi_tab()
        self.tab_widget.addTab(self.islem_listesi_tab, "💳 İşlem Listesi")
        
        self.create_yeni_islem_tab()
        self.tab_widget.addTab(self.yeni_islem_tab, "➕ Yeni İşlem")
        
        self.create_cari_ekstre_tab()
        self.tab_widget.addTab(self.cari_ekstre_tab, "📋 Cari Ekstre")
        
        layout.addWidget(self.tab_widget)
    
    def create_islem_listesi_tab(self):
        """İşlem listesi tab'ını oluştur"""
        self.islem_listesi_tab = QWidget()
        layout = QVBoxLayout(self.islem_listesi_tab)
        
        self.islem_table = ProfessionalTable()
        layout.addWidget(self.islem_table)
        
        columns = [
            {'key': 'islem_no', 'title': 'İşlem No', 'width': 120},
            {'key': 'tarih', 'title': 'Tarih', 'width': 120, 'format': 'date'},
            {'key': 'cari_adi', 'title': 'Cari', 'width': 200},
            {'key': 'hesap_turu', 'title': 'Hesap Türü', 'width': 120},
            {'key': 'islem_tipi', 'title': 'İşlem Tipi', 'width': 100, 'format': 'badge'},
            {'key': 'odeme_tipi', 'title': 'Ödeme Tipi', 'width': 120},
            {'key': 'tutar', 'title': 'Tutar', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'doviz_tipi', 'title': 'Döviz', 'width': 80},
            {'key': 'aciklama', 'title': 'Açıklama', 'width': 200},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.islem_table.set_data([], columns)
    
    def create_yeni_islem_tab(self):
        """Yeni işlem tab'ını oluştur"""
        self.yeni_islem_tab = QWidget()
        layout = QVBoxLayout(self.yeni_islem_tab)
        
        form_group = QGroupBox("İşlem Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.islem_no_input = QLineEdit()
        self.islem_no_input.setPlaceholderText("Otomatik oluşturulacak")
        self.islem_no_input.setReadOnly(True)
        form_layout.addRow("İşlem No:", self.islem_no_input)
        
        self.islem_tarih_input = QDateEdit()
        self.islem_tarih_input.setDate(QDate.currentDate())
        self.islem_tarih_input.setCalendarPopup(True)
        form_layout.addRow("Tarih:", self.islem_tarih_input)
        
        self.cari_combo = QComboBox()
        form_layout.addRow("Cari:", self.cari_combo)
        
        self.hesap_turu_input = QLineEdit()
        self.hesap_turu_input.setPlaceholderText("Hesap türü")
        form_layout.addRow("Hesap Türü:", self.hesap_turu_input)
        
        self.islem_tipi_combo = QComboBox()
        self.islem_tipi_combo.addItems(["Tediye", "Tahsilat", "Virman"])
        form_layout.addRow("İşlem Tipi:", self.islem_tipi_combo)
        
        self.odeme_tipi_combo = QComboBox()
        self.odeme_tipi_combo.addItems([
            "Nakit", "Havale", "EFT", "Kredi Kartı", 
            "Çek", "Senet", "Diğer"
        ])
        form_layout.addRow("Ödeme Tipi:", self.odeme_tipi_combo)
        
        self.islem_tutar_input = QDoubleSpinBox()
        self.islem_tutar_input.setRange(0.01, 9999999.99)
        self.islem_tutar_input.setDecimals(2)
        form_layout.addRow("Tutar:", self.islem_tutar_input)
        
        self.doviz_tipi_combo = QComboBox()
        self.doviz_tipi_combo.addItems(["TRY", "USD", "EUR"])
        form_layout.addRow("Döviz Tipi:", self.doviz_tipi_combo)
        
        self.belge_no_input = QLineEdit()
        self.belge_no_input.setPlaceholderText("Belge numarası")
        form_layout.addRow("Belge No:", self.belge_no_input)
        
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
    
    def create_cari_ekstre_tab(self):
        """Cari ekstre tab'ını oluştur"""
        self.cari_ekstre_tab = QWidget()
        layout = QHBoxLayout(self.cari_ekstre_tab)
        
        left_panel = QFrame()
        left_panel.setFrameStyle(QFrame.Shape.StyledPanel)
        left_panel.setMaximumWidth(300)
        left_panel.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 8px;
            }
        """)
        
        left_layout = QVBoxLayout(left_panel)
        
        cari_title = QLabel("👥 Cari Listesi")
        cari_title.setStyleSheet("""
            QLabel {
                font-size: 14px;
                font-weight: bold;
                color: #495057;
                margin-bottom: 8px;
            }
        """)
        left_layout.addWidget(cari_title)
        
        self.cari_list = QListWidget()
        self.cari_list.setStyleSheet("""
            QListWidget {
                background-color: white;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 4px;
            }
            QListWidget::item {
                padding: 8px;
                border-bottom: 1px solid #f1f3f4;
            }
            QListWidget::item:hover {
                background-color: #f8f9fa;
            }
            QListWidget::item:selected {
                background-color: #007acc;
                color: white;
            }
        """)
        left_layout.addWidget(self.cari_list)
        
        layout.addWidget(left_panel)
        
        right_panel = QFrame()
        right_panel.setFrameStyle(QFrame.Shape.StyledPanel)
        right_panel.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 16px;
            }
        """)
        
        right_layout = QVBoxLayout(right_panel)
        
        ekstre_title = QLabel("📋 Cari Ekstre")
        ekstre_title.setStyleSheet("""
            QLabel {
                font-size: 16px;
                font-weight: bold;
                color: #495057;
                margin-bottom: 16px;
            }
        """)
        right_layout.addWidget(ekstre_title)
        
        self.ekstre_ozet_label = QLabel("Cari seçin...")
        self.ekstre_ozet_label.setStyleSheet("""
            QLabel {
                font-size: 14px;
                color: #495057;
                background-color: white;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 16px;
                margin-bottom: 16px;
            }
        """)
        right_layout.addWidget(self.ekstre_ozet_label)
        
        self.ekstre_table = ProfessionalTable()
        right_layout.addWidget(self.ekstre_table)
        
        ekstre_columns = [
            {'key': 'tarih', 'title': 'Tarih', 'width': 120, 'format': 'date'},
            {'key': 'islem_tipi', 'title': 'İşlem', 'width': 100, 'format': 'badge'},
            {'key': 'aciklama', 'title': 'Açıklama', 'width': 200},
            {'key': 'borc', 'title': 'Borç', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'alacak', 'title': 'Alacak', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'bakiye', 'title': 'Bakiye', 'width': 120, 'format': 'currency', 'align': 'right'}
        ]
        
        self.ekstre_table.set_data([], ekstre_columns)
        
        layout.addWidget(right_panel)
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.islem_kaydet_btn.clicked.connect(self.kaydet_islem)
        self.islem_temizle_btn.clicked.connect(self.temizle_islem_form)
        self.islem_table.data_changed.connect(self.refresh_data)
        self.cari_list.itemClicked.connect(self.on_cari_selected)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            cariler = self.db_manager.get_all_cari_kayitlar()
            
            self.cari_combo.clear()
            self.cari_combo.addItem("Cari Seçin", None)
            self.cari_list.clear()
            
            for cari in cariler:
                self.cari_combo.addItem(f"{cari['ad']} ({cari['tip']})", cari['id'])
                
                item = QListWidgetItem(f"{cari['ad']}\n{cari['tip']}")
                item.setData(Qt.ItemDataRole.UserRole, cari['id'])
                self.cari_list.addItem(item)
            
            islemler = self.db_manager.get_all_cari_islemler()
            islem_data = []
            
            for islem in islemler:
                islem_data.append({
                    'id': islem['id'],
                    'islem_no': islem['islem_no'],
                    'tarih': islem['tarih'],
                    'cari_adi': islem['cari_adi'] or 'Bilinmiyor',
                    'hesap_turu': islem['hesap_turu'] or '',
                    'islem_tipi': islem['islem_tipi'],
                    'odeme_tipi': islem['odeme_tipi'] or '',
                    'tutar': islem['tutar'],
                    'doviz_tipi': islem['doviz_tipi'],
                    'aciklama': islem['aciklama'] or '',
                    'durum': islem['durum']
                })
            
            self.islem_table.set_data(islem_data, self.islem_table.columns)
            
            self.generate_islem_no()
            
            self.status_message.emit("Cari işlem verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Veri yükleme hatası: {str(e)}")
    
    def generate_islem_no(self):
        """Yeni işlem numarası oluştur"""
        try:
            last_islem = self.db_manager.execute_query(
                "SELECT islem_no FROM cari_islemler ORDER BY id DESC LIMIT 1"
            )
            
            if last_islem:
                last_no = last_islem[0]['islem_no']
                if last_no.startswith('CI'):
                    num = int(last_no[2:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_islem_no = f"CI{num:03d}"
            self.islem_no_input.setText(new_islem_no)
            
        except Exception as e:
            self.islem_no_input.setText("CI001")
    
    def kaydet_islem(self):
        """İşlemi kaydet"""
        try:
            cari_id = self.cari_combo.currentData()
            
            if not cari_id:
                QMessageBox.warning(self, "Uyarı", "Lütfen cari seçin.")
                return
            
            if self.islem_tutar_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir tutar girin.")
                return
            
            islem_data = {
                'islem_no': self.islem_no_input.text(),
                'tarih': self.islem_tarih_input.date().toString('yyyy-MM-dd'),
                'cari_id': cari_id,
                'hesap_turu': self.hesap_turu_input.text(),
                'islem_tipi': self.islem_tipi_combo.currentText(),
                'odeme_tipi': self.odeme_tipi_combo.currentText(),
                'tutar': self.islem_tutar_input.value(),
                'doviz_tipi': self.doviz_tipi_combo.currentText(),
                'aciklama': self.islem_aciklama_input.toPlainText(),
                'belge_no': self.belge_no_input.text(),
                'durum': 'Beklemede',
                'olusturan_kullanici': 'Admin'
            }
            
            islem_id = self.db_manager.insert_cari_islem(islem_data)
            
            if islem_id:
                QMessageBox.information(self, "Başarılı", "Cari işlem başarıyla kaydedildi.")
                self.temizle_islem_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # İşlem listesi tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Cari işlem kaydedilemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"İşlem kaydetme hatası: {str(e)}")
    
    def on_cari_selected(self, item):
        """Cari seçildiğinde ekstre göster"""
        try:
            cari_id = item.data(Qt.ItemDataRole.UserRole)
            
            cari_info = self.db_manager.execute_query(
                "SELECT * FROM cari_kayitlar WHERE id = ?", (cari_id,)
            )
            
            if not cari_info:
                return
            
            cari = cari_info[0]
            
            islemler = self.db_manager.execute_query("""
                SELECT * FROM cari_islemler 
                WHERE cari_id = ? 
                ORDER BY tarih ASC, id ASC
            """, (cari_id,))
            
            toplam_borc = 0
            toplam_alacak = 0
            ekstre_data = []
            bakiye = 0
            
            for islem in islemler:
                if islem['islem_tipi'] == 'Tediye':
                    borc = islem['tutar']
                    alacak = 0
                    bakiye -= borc
                elif islem['islem_tipi'] == 'Tahsilat':
                    borc = 0
                    alacak = islem['tutar']
                    bakiye += alacak
                else:  # Virman
                    borc = islem['tutar']
                    alacak = 0
                    bakiye -= borc
                
                toplam_borc += borc
                toplam_alacak += alacak
                
                ekstre_data.append({
                    'tarih': islem['tarih'],
                    'islem_tipi': islem['islem_tipi'],
                    'aciklama': islem['aciklama'] or f"{islem['islem_tipi']} - {islem['islem_no']}",
                    'borc': borc if borc > 0 else '',
                    'alacak': alacak if alacak > 0 else '',
                    'bakiye': bakiye
                })
            
            self.ekstre_table.set_data(ekstre_data, self.ekstre_table.columns)
            
            net_bakiye = toplam_alacak - toplam_borc
            bakiye_durumu = "Alacaklı" if net_bakiye > 0 else "Borçlu" if net_bakiye < 0 else "Dengeli"
            
            ozet_metni = f"""
📋 {cari['ad']} - Cari Ekstre

👤 Cari Tipi: {cari['tip']}
📞 Telefon: {cari['telefon'] or 'Belirtilmemiş'}
📧 E-mail: {cari['email'] or 'Belirtilmemiş'}

💰 Toplam Borç: {toplam_borc:,.2f} {islemler[0]['doviz_tipi'] if islemler else 'TRY'}
💸 Toplam Alacak: {toplam_alacak:,.2f} {islemler[0]['doviz_tipi'] if islemler else 'TRY'}
📊 Net Bakiye: {abs(net_bakiye):,.2f} {islemler[0]['doviz_tipi'] if islemler else 'TRY'} ({bakiye_durumu})

📈 Toplam İşlem: {len(islemler)} adet
            """
            
            self.ekstre_ozet_label.setText(ozet_metni.strip())
            
        except Exception as e:
            self.ekstre_ozet_label.setText(f"Ekstre yüklenirken hata oluştu: {str(e)}")
    
    def temizle_islem_form(self):
        """İşlem formunu temizle"""
        self.islem_tarih_input.setDate(QDate.currentDate())
        self.cari_combo.setCurrentIndex(0)
        self.hesap_turu_input.clear()
        self.islem_tipi_combo.setCurrentIndex(0)
        self.odeme_tipi_combo.setCurrentIndex(0)
        self.islem_tutar_input.setValue(0)
        self.doviz_tipi_combo.setCurrentIndex(0)
        self.belge_no_input.clear()
        self.islem_aciklama_input.clear()
        self.generate_islem_no()
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

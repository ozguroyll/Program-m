#!/usr/bin/env python3
"""
Gelir/Gider Yönetimi Modülü
Mali kayıtlar ve kar-zarar analizi
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

class GelirGiderYonetimiModule(QWidget):
    """Gelir/Gider yönetimi ana modülü"""
    
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
        
        title_label = QLabel("💰 Gelir/Gider Yönetimi")
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
        
        self.create_gelir_kayitlari_tab()
        self.tab_widget.addTab(self.gelir_kayitlari_tab, "💰 Gelir Kayıtları")
        
        self.create_gider_kayitlari_tab()
        self.tab_widget.addTab(self.gider_kayitlari_tab, "💸 Gider Kayıtları")
        
        self.create_yeni_gelir_tab()
        self.tab_widget.addTab(self.yeni_gelir_tab, "➕ Yeni Gelir")
        
        self.create_yeni_gider_tab()
        self.tab_widget.addTab(self.yeni_gider_tab, "➕ Yeni Gider")
        
        self.create_mali_rapor_tab()
        self.tab_widget.addTab(self.mali_rapor_tab, "📊 Mali Rapor")
        
        layout.addWidget(self.tab_widget)
    
    def create_gelir_kayitlari_tab(self):
        """Gelir kayıtları tab'ını oluştur"""
        self.gelir_kayitlari_tab = QWidget()
        layout = QVBoxLayout(self.gelir_kayitlari_tab)
        
        self.gelir_table = ProfessionalTable()
        layout.addWidget(self.gelir_table)
        
        columns = [
            {'key': 'gelir_no', 'title': 'Gelir No', 'width': 120},
            {'key': 'tarih', 'title': 'Tarih', 'width': 120, 'format': 'date'},
            {'key': 'sirket', 'title': 'Şirket', 'width': 150},
            {'key': 'kategori', 'title': 'Kategori', 'width': 120},
            {'key': 'alt_kategori', 'title': 'Alt Kategori', 'width': 120},
            {'key': 'tutar', 'title': 'Tutar', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'doviz', 'title': 'Döviz', 'width': 80},
            {'key': 'aciklama', 'title': 'Açıklama', 'width': 200},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.gelir_table.set_data([], columns)
    
    def create_gider_kayitlari_tab(self):
        """Gider kayıtları tab'ını oluştur"""
        self.gider_kayitlari_tab = QWidget()
        layout = QVBoxLayout(self.gider_kayitlari_tab)
        
        self.gider_table = ProfessionalTable()
        layout.addWidget(self.gider_table)
        
        columns = [
            {'key': 'gider_no', 'title': 'Gider No', 'width': 120},
            {'key': 'tarih', 'title': 'Tarih', 'width': 120, 'format': 'date'},
            {'key': 'sirket', 'title': 'Şirket', 'width': 150},
            {'key': 'kategori', 'title': 'Kategori', 'width': 120},
            {'key': 'alt_kategori', 'title': 'Alt Kategori', 'width': 120},
            {'key': 'tutar', 'title': 'Tutar', 'width': 120, 'format': 'currency', 'align': 'right'},
            {'key': 'doviz', 'title': 'Döviz', 'width': 80},
            {'key': 'gider_tipi', 'title': 'Gider Tipi', 'width': 120},
            {'key': 'aciklama', 'title': 'Açıklama', 'width': 200},
            {'key': 'durum', 'title': 'Durum', 'width': 100, 'format': 'badge'}
        ]
        
        self.gider_table.set_data([], columns)
    
    def create_yeni_gelir_tab(self):
        """Yeni gelir tab'ını oluştur"""
        self.yeni_gelir_tab = QWidget()
        layout = QVBoxLayout(self.yeni_gelir_tab)
        
        form_group = QGroupBox("Gelir Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.gelir_no_input = QLineEdit()
        self.gelir_no_input.setPlaceholderText("Otomatik oluşturulacak")
        self.gelir_no_input.setReadOnly(True)
        form_layout.addRow("Gelir No:", self.gelir_no_input)
        
        self.gelir_tarih_input = QDateEdit()
        self.gelir_tarih_input.setDate(QDate.currentDate())
        self.gelir_tarih_input.setCalendarPopup(True)
        form_layout.addRow("Tarih:", self.gelir_tarih_input)
        
        self.gelir_sirket_input = QLineEdit()
        self.gelir_sirket_input.setText("Yılmaz Transport")
        form_layout.addRow("Şirket:", self.gelir_sirket_input)
        
        self.gelir_kategori_combo = QComboBox()
        self.gelir_kategori_combo.addItems([
            "Satış Geliri", "Hizmet Geliri", "Faiz Geliri", 
            "Kira Geliri", "Diğer Gelirler"
        ])
        form_layout.addRow("Kategori:", self.gelir_kategori_combo)
        
        self.gelir_alt_kategori_input = QLineEdit()
        self.gelir_alt_kategori_input.setPlaceholderText("Alt kategori (opsiyonel)")
        form_layout.addRow("Alt Kategori:", self.gelir_alt_kategori_input)
        
        self.gelir_tutar_input = QDoubleSpinBox()
        self.gelir_tutar_input.setRange(0.01, 9999999.99)
        self.gelir_tutar_input.setDecimals(2)
        form_layout.addRow("Tutar:", self.gelir_tutar_input)
        
        self.gelir_doviz_combo = QComboBox()
        self.gelir_doviz_combo.addItems(["TRY", "USD", "EUR"])
        form_layout.addRow("Döviz:", self.gelir_doviz_combo)
        
        self.gelir_aciklama_input = QTextEdit()
        self.gelir_aciklama_input.setMaximumHeight(100)
        form_layout.addRow("Açıklama:", self.gelir_aciklama_input)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.gelir_kaydet_btn = QPushButton("💾 Gelir Kaydet")
        self.gelir_kaydet_btn.setStyleSheet("""
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
        button_layout.addWidget(self.gelir_kaydet_btn)
        
        self.gelir_temizle_btn = QPushButton("🗑️ Temizle")
        self.gelir_temizle_btn.setStyleSheet("""
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
        button_layout.addWidget(self.gelir_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def create_yeni_gider_tab(self):
        """Yeni gider tab'ını oluştur"""
        self.yeni_gider_tab = QWidget()
        layout = QVBoxLayout(self.yeni_gider_tab)
        
        form_group = QGroupBox("Gider Bilgileri")
        form_layout = QFormLayout(form_group)
        
        self.gider_no_input = QLineEdit()
        self.gider_no_input.setPlaceholderText("Otomatik oluşturulacak")
        self.gider_no_input.setReadOnly(True)
        form_layout.addRow("Gider No:", self.gider_no_input)
        
        self.gider_tarih_input = QDateEdit()
        self.gider_tarih_input.setDate(QDate.currentDate())
        self.gider_tarih_input.setCalendarPopup(True)
        form_layout.addRow("Tarih:", self.gider_tarih_input)
        
        self.gider_sirket_input = QLineEdit()
        self.gider_sirket_input.setText("Yılmaz Transport")
        form_layout.addRow("Şirket:", self.gider_sirket_input)
        
        self.gider_kategori_combo = QComboBox()
        self.gider_kategori_combo.addItems([
            "Operasyonel Gider", "Personel Gideri", "Nakliye Gideri",
            "Yakıt Gideri", "Bakım Gideri", "Ofis Gideri", "Diğer Giderler"
        ])
        form_layout.addRow("Kategori:", self.gider_kategori_combo)
        
        self.gider_alt_kategori_input = QLineEdit()
        self.gider_alt_kategori_input.setPlaceholderText("Alt kategori (opsiyonel)")
        form_layout.addRow("Alt Kategori:", self.gider_alt_kategori_input)
        
        self.gider_tutar_input = QDoubleSpinBox()
        self.gider_tutar_input.setRange(0.01, 9999999.99)
        self.gider_tutar_input.setDecimals(2)
        form_layout.addRow("Tutar:", self.gider_tutar_input)
        
        self.gider_doviz_combo = QComboBox()
        self.gider_doviz_combo.addItems(["TRY", "USD", "EUR"])
        form_layout.addRow("Döviz:", self.gider_doviz_combo)
        
        self.gider_tipi_combo = QComboBox()
        self.gider_tipi_combo.addItems(["Şirket Gideri", "Müşteri Gideri"])
        form_layout.addRow("Gider Tipi:", self.gider_tipi_combo)
        
        self.gider_aciklama_input = QTextEdit()
        self.gider_aciklama_input.setMaximumHeight(100)
        form_layout.addRow("Açıklama:", self.gider_aciklama_input)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.gider_kaydet_btn = QPushButton("💾 Gider Kaydet")
        self.gider_kaydet_btn.setStyleSheet("""
            QPushButton {
                background-color: #dc3545;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #c82333;
            }
        """)
        button_layout.addWidget(self.gider_kaydet_btn)
        
        self.gider_temizle_btn = QPushButton("🗑️ Temizle")
        self.gider_temizle_btn.setStyleSheet("""
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
        button_layout.addWidget(self.gider_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def create_mali_rapor_tab(self):
        """Mali rapor tab'ını oluştur"""
        self.mali_rapor_tab = QWidget()
        layout = QVBoxLayout(self.mali_rapor_tab)
        
        rapor_title = QLabel("📊 Mali Durum Raporu")
        rapor_title.setStyleSheet("""
            QLabel {
                font-size: 18px;
                font-weight: bold;
                color: #495057;
                margin-bottom: 16px;
            }
        """)
        layout.addWidget(rapor_title)
        
        rapor_frame = QFrame()
        rapor_frame.setFrameStyle(QFrame.Shape.StyledPanel)
        rapor_frame.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 16px;
            }
        """)
        
        rapor_layout = QVBoxLayout(rapor_frame)
        
        self.rapor_ozet_label = QLabel("Rapor yükleniyor...")
        self.rapor_ozet_label.setStyleSheet("""
            QLabel {
                font-size: 14px;
                color: #495057;
                line-height: 1.5;
            }
        """)
        rapor_layout.addWidget(self.rapor_ozet_label)
        
        layout.addWidget(rapor_frame)
        layout.addStretch()
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.gelir_kaydet_btn.clicked.connect(self.kaydet_gelir)
        self.gelir_temizle_btn.clicked.connect(self.temizle_gelir_form)
        self.gider_kaydet_btn.clicked.connect(self.kaydet_gider)
        self.gider_temizle_btn.clicked.connect(self.temizle_gider_form)
        self.gelir_table.data_changed.connect(self.refresh_data)
        self.gider_table.data_changed.connect(self.refresh_data)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            gelirler = self.db_manager.get_all_gelir_kayitlari()
            gelir_data = []
            
            for gelir in gelirler:
                gelir_data.append({
                    'id': gelir['id'],
                    'gelir_no': gelir['gelir_no'],
                    'tarih': gelir['tarih'],
                    'sirket': gelir['sirket'],
                    'kategori': gelir['kategori'],
                    'alt_kategori': gelir['alt_kategori'] or '',
                    'tutar': gelir['tutar'],
                    'doviz': gelir['doviz'],
                    'aciklama': gelir['aciklama'] or '',
                    'durum': gelir['durum']
                })
            
            self.gelir_table.set_data(gelir_data, self.gelir_table.columns)
            
            giderler = self.db_manager.get_all_gider_kayitlari()
            gider_data = []
            
            for gider in giderler:
                gider_data.append({
                    'id': gider['id'],
                    'gider_no': gider['gider_no'],
                    'tarih': gider['tarih'],
                    'sirket': gider['sirket'],
                    'kategori': gider['kategori'],
                    'alt_kategori': gider['alt_kategori'] or '',
                    'tutar': gider['tutar'],
                    'doviz': gider['doviz'],
                    'gider_tipi': gider['gider_tipi'],
                    'aciklama': gider['aciklama'] or '',
                    'durum': gider['durum']
                })
            
            self.gider_table.set_data(gider_data, self.gider_table.columns)
            
            self.generate_gelir_no()
            self.generate_gider_no()
            
            self.update_mali_rapor()
            
            self.status_message.emit("Gelir/Gider verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Veri yükleme hatası: {str(e)}")
    
    def generate_gelir_no(self):
        """Yeni gelir numarası oluştur"""
        try:
            last_gelir = self.db_manager.execute_query(
                "SELECT gelir_no FROM gelir_kayitlari ORDER BY id DESC LIMIT 1"
            )
            
            if last_gelir:
                last_no = last_gelir[0]['gelir_no']
                if last_no.startswith('GEL'):
                    num = int(last_no[3:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_gelir_no = f"GEL{num:03d}"
            self.gelir_no_input.setText(new_gelir_no)
            
        except Exception as e:
            self.gelir_no_input.setText("GEL001")
    
    def generate_gider_no(self):
        """Yeni gider numarası oluştur"""
        try:
            last_gider = self.db_manager.execute_query(
                "SELECT gider_no FROM gider_kayitlari ORDER BY id DESC LIMIT 1"
            )
            
            if last_gider:
                last_no = last_gider[0]['gider_no']
                if last_no.startswith('GID'):
                    num = int(last_no[3:]) + 1
                else:
                    num = 1
            else:
                num = 1
            
            new_gider_no = f"GID{num:03d}"
            self.gider_no_input.setText(new_gider_no)
            
        except Exception as e:
            self.gider_no_input.setText("GID001")
    
    def kaydet_gelir(self):
        """Geliri kaydet"""
        try:
            if self.gelir_tutar_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir tutar girin.")
                return
            
            if not self.gelir_sirket_input.text().strip():
                QMessageBox.warning(self, "Uyarı", "Lütfen şirket adı girin.")
                return
            
            gelir_data = {
                'gelir_no': self.gelir_no_input.text(),
                'tarih': self.gelir_tarih_input.date().toString('yyyy-MM-dd'),
                'sirket': self.gelir_sirket_input.text(),
                'kategori': self.gelir_kategori_combo.currentText(),
                'alt_kategori': self.gelir_alt_kategori_input.text(),
                'tutar': self.gelir_tutar_input.value(),
                'doviz': self.gelir_doviz_combo.currentText(),
                'aciklama': self.gelir_aciklama_input.toPlainText(),
                'durum': 'Onaylandı'
            }
            
            gelir_id = self.db_manager.insert_gelir_kaydi(gelir_data)
            
            if gelir_id:
                QMessageBox.information(self, "Başarılı", "Gelir kaydı başarıyla eklendi.")
                self.temizle_gelir_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # Gelir kayıtları tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Gelir kaydı eklenemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Gelir kaydetme hatası: {str(e)}")
    
    def kaydet_gider(self):
        """Gideri kaydet"""
        try:
            if self.gider_tutar_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir tutar girin.")
                return
            
            if not self.gider_sirket_input.text().strip():
                QMessageBox.warning(self, "Uyarı", "Lütfen şirket adı girin.")
                return
            
            gider_data = {
                'gider_no': self.gider_no_input.text(),
                'tarih': self.gider_tarih_input.date().toString('yyyy-MM-dd'),
                'sirket': self.gider_sirket_input.text(),
                'kategori': self.gider_kategori_combo.currentText(),
                'alt_kategori': self.gider_alt_kategori_input.text(),
                'tutar': self.gider_tutar_input.value(),
                'doviz': self.gider_doviz_combo.currentText(),
                'gider_tipi': self.gider_tipi_combo.currentText(),
                'aciklama': self.gider_aciklama_input.toPlainText(),
                'durum': 'Onaylandı'
            }
            
            gider_id = self.db_manager.insert_gider_kaydi(gider_data)
            
            if gider_id:
                QMessageBox.information(self, "Başarılı", "Gider kaydı başarıyla eklendi.")
                self.temizle_gider_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(1)  # Gider kayıtları tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Gider kaydı eklenemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Gider kaydetme hatası: {str(e)}")
    
    def update_mali_rapor(self):
        """Mali raporu güncelle"""
        try:
            current_date = datetime.now()
            year = current_date.year
            month = current_date.month
            
            gelir_result = self.db_manager.execute_query("""
                SELECT COALESCE(SUM(tutar), 0) as toplam FROM gelir_kayitlari 
                WHERE strftime('%Y-%m', tarih) = ? AND durum = 'Onaylandı'
            """, (f"{year:04d}-{month:02d}",))
            toplam_gelir = gelir_result[0]['toplam'] if gelir_result else 0
            
            gider_result = self.db_manager.execute_query("""
                SELECT COALESCE(SUM(tutar), 0) as toplam FROM gider_kayitlari 
                WHERE strftime('%Y-%m', tarih) = ? AND durum = 'Onaylandı'
            """, (f"{year:04d}-{month:02d}",))
            toplam_gider = gider_result[0]['toplam'] if gider_result else 0
            
            kar_zarar = toplam_gelir - toplam_gider
            kar_marji = (kar_zarar / toplam_gelir * 100) if toplam_gelir > 0 else 0
            
            rapor_metni = f"""
📊 {month:02d}/{year} Mali Durum Raporu

💰 Toplam Gelir: {toplam_gelir:,.2f} ₺
💸 Toplam Gider: {toplam_gider:,.2f} ₺
📈 Kar/Zarar: {kar_zarar:,.2f} ₺
📊 Kar Marjı: {kar_marji:.1f}%

{"🟢 Pozitif" if kar_zarar >= 0 else "🔴 Negatif"} mali durum
            """
            
            self.rapor_ozet_label.setText(rapor_metni.strip())
            
        except Exception as e:
            self.rapor_ozet_label.setText(f"Rapor yüklenirken hata oluştu: {str(e)}")
    
    def temizle_gelir_form(self):
        """Gelir formunu temizle"""
        self.gelir_tarih_input.setDate(QDate.currentDate())
        self.gelir_sirket_input.setText("Yılmaz Transport")
        self.gelir_kategori_combo.setCurrentIndex(0)
        self.gelir_alt_kategori_input.clear()
        self.gelir_tutar_input.setValue(0)
        self.gelir_doviz_combo.setCurrentIndex(0)
        self.gelir_aciklama_input.clear()
        self.generate_gelir_no()
    
    def temizle_gider_form(self):
        """Gider formunu temizle"""
        self.gider_tarih_input.setDate(QDate.currentDate())
        self.gider_sirket_input.setText("Yılmaz Transport")
        self.gider_kategori_combo.setCurrentIndex(0)
        self.gider_alt_kategori_input.clear()
        self.gider_tutar_input.setValue(0)
        self.gider_doviz_combo.setCurrentIndex(0)
        self.gider_tipi_combo.setCurrentIndex(0)
        self.gider_aciklama_input.clear()
        self.generate_gider_no()
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

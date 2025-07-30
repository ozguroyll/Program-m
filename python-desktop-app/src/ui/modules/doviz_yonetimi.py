#!/usr/bin/env python3
"""
Döviz Yönetimi Modülü
Döviz kurları ve çoklu para birimi işlemleri
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

class DovizYonetimiModule(QWidget):
    """Döviz yönetimi ana modülü"""
    
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
        
        title_label = QLabel("💱 Döviz Yönetimi")
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
        
        self.create_kur_listesi_tab()
        self.tab_widget.addTab(self.kur_listesi_tab, "💱 Kur Listesi")
        
        self.create_kur_guncelle_tab()
        self.tab_widget.addTab(self.kur_guncelle_tab, "➕ Kur Güncelle")
        
        self.create_kar_zarar_tab()
        self.tab_widget.addTab(self.kar_zarar_tab, "📊 Kar/Zarar Analizi")
        
        layout.addWidget(self.tab_widget)
    
    def create_kur_listesi_tab(self):
        """Kur listesi tab'ını oluştur"""
        self.kur_listesi_tab = QWidget()
        layout = QVBoxLayout(self.kur_listesi_tab)
        
        ozet_frame = QFrame()
        ozet_frame.setFrameStyle(QFrame.Shape.StyledPanel)
        ozet_frame.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 16px;
            }
        """)
        
        ozet_layout = QHBoxLayout(ozet_frame)
        
        self.usd_label = QLabel("USD: Yükleniyor...")
        self.usd_label.setStyleSheet("font-size: 16px; font-weight: bold; color: #28a745;")
        ozet_layout.addWidget(self.usd_label)
        
        self.eur_label = QLabel("EUR: Yükleniyor...")
        self.eur_label.setStyleSheet("font-size: 16px; font-weight: bold; color: #007bff;")
        ozet_layout.addWidget(self.eur_label)
        
        ozet_layout.addStretch()
        
        layout.addWidget(ozet_frame)
        
        self.kur_table = ProfessionalTable()
        layout.addWidget(self.kur_table)
        
        columns = [
            {'key': 'tarih', 'title': 'Tarih', 'width': 120, 'format': 'date'},
            {'key': 'doviz_tipi', 'title': 'Döviz', 'width': 80},
            {'key': 'alis_kuru', 'title': 'Alış', 'width': 100, 'format': 'currency', 'align': 'right'},
            {'key': 'satis_kuru', 'title': 'Satış', 'width': 100, 'format': 'currency', 'align': 'right'},
            {'key': 'merkez_kuru', 'title': 'Merkez', 'width': 100, 'format': 'currency', 'align': 'right'},
            {'key': 'kaynak', 'title': 'Kaynak', 'width': 100}
        ]
        
        self.kur_table.set_data([], columns)
    
    def create_kur_guncelle_tab(self):
        """Kur güncelleme tab'ını oluştur"""
        self.kur_guncelle_tab = QWidget()
        layout = QVBoxLayout(self.kur_guncelle_tab)
        
        form_group = QGroupBox("Döviz Kuru Güncelleme")
        form_layout = QFormLayout(form_group)
        
        self.kur_tarih_input = QDateEdit()
        self.kur_tarih_input.setDate(QDate.currentDate())
        self.kur_tarih_input.setCalendarPopup(True)
        form_layout.addRow("Tarih:", self.kur_tarih_input)
        
        self.doviz_tipi_combo = QComboBox()
        self.doviz_tipi_combo.addItems(["USD", "EUR"])
        form_layout.addRow("Döviz Tipi:", self.doviz_tipi_combo)
        
        self.alis_kuru_input = QDoubleSpinBox()
        self.alis_kuru_input.setRange(0.01, 999.99)
        self.alis_kuru_input.setDecimals(4)
        self.alis_kuru_input.setSuffix(" TL")
        form_layout.addRow("Alış Kuru:", self.alis_kuru_input)
        
        self.satis_kuru_input = QDoubleSpinBox()
        self.satis_kuru_input.setRange(0.01, 999.99)
        self.satis_kuru_input.setDecimals(4)
        self.satis_kuru_input.setSuffix(" TL")
        form_layout.addRow("Satış Kuru:", self.satis_kuru_input)
        
        self.merkez_kuru_input = QDoubleSpinBox()
        self.merkez_kuru_input.setRange(0.01, 999.99)
        self.merkez_kuru_input.setDecimals(4)
        self.merkez_kuru_input.setSuffix(" TL")
        form_layout.addRow("Merkez Kuru:", self.merkez_kuru_input)
        
        self.kaynak_combo = QComboBox()
        self.kaynak_combo.addItems(["Manuel", "TCMB", "Banka", "Diğer"])
        form_layout.addRow("Kaynak:", self.kaynak_combo)
        
        layout.addWidget(form_group)
        
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        self.kur_kaydet_btn = QPushButton("💾 Kur Kaydet")
        self.kur_kaydet_btn.setStyleSheet("""
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
        button_layout.addWidget(self.kur_kaydet_btn)
        
        self.kur_temizle_btn = QPushButton("🗑️ Temizle")
        self.kur_temizle_btn.setStyleSheet("""
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
        button_layout.addWidget(self.kur_temizle_btn)
        
        layout.addLayout(button_layout)
        layout.addStretch()
    
    def create_kar_zarar_tab(self):
        """Kar zarar analizi tab'ını oluştur"""
        self.kar_zarar_tab = QWidget()
        layout = QVBoxLayout(self.kar_zarar_tab)
        
        tarih_group = QGroupBox("Analiz Dönemi")
        tarih_layout = QFormLayout(tarih_group)
        
        self.baslangic_tarih_input = QDateEdit()
        self.baslangic_tarih_input.setDate(QDate.currentDate().addDays(-30))
        self.baslangic_tarih_input.setCalendarPopup(True)
        tarih_layout.addRow("Başlangıç:", self.baslangic_tarih_input)
        
        self.bitis_tarih_input = QDateEdit()
        self.bitis_tarih_input.setDate(QDate.currentDate())
        self.bitis_tarih_input.setCalendarPopup(True)
        tarih_layout.addRow("Bitiş:", self.bitis_tarih_input)
        
        self.analiz_btn = QPushButton("📊 Analiz Yap")
        self.analiz_btn.setStyleSheet("""
            QPushButton {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #0056b3;
            }
        """)
        tarih_layout.addRow("", self.analiz_btn)
        
        layout.addWidget(tarih_group)
        
        sonuc_frame = QFrame()
        sonuc_frame.setFrameStyle(QFrame.Shape.StyledPanel)
        sonuc_frame.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 16px;
            }
        """)
        
        sonuc_layout = QVBoxLayout(sonuc_frame)
        
        self.kar_zarar_label = QLabel("Analiz sonuçları burada görünecek...")
        self.kar_zarar_label.setStyleSheet("""
            QLabel {
                font-size: 14px;
                color: #495057;
                line-height: 1.5;
            }
        """)
        sonuc_layout.addWidget(self.kar_zarar_label)
        
        layout.addWidget(sonuc_frame)
        layout.addStretch()
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.kur_kaydet_btn.clicked.connect(self.kaydet_kur)
        self.kur_temizle_btn.clicked.connect(self.temizle_kur_form)
        self.analiz_btn.clicked.connect(self.analiz_yap)
        self.kur_table.data_changed.connect(self.refresh_data)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            kurlar = self.db_manager.execute_query(
                "SELECT * FROM doviz_kurlari ORDER BY tarih DESC, doviz_tipi"
            )
            
            kur_data = []
            for kur in kurlar:
                kur_data.append({
                    'id': kur['id'],
                    'tarih': kur['tarih'],
                    'doviz_tipi': kur['doviz_tipi'],
                    'alis_kuru': kur['alis_kuru'],
                    'satis_kuru': kur['satis_kuru'],
                    'merkez_kuru': kur['merkez_kuru'],
                    'kaynak': kur['kaynak']
                })
            
            self.kur_table.set_data(kur_data, self.kur_table.columns)
            
            self.update_guncel_kurlar()
            
            self.status_message.emit("Döviz verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Veri yükleme hatası: {str(e)}")
    
    def update_guncel_kurlar(self):
        """Güncel kurları güncelle"""
        try:
            usd_kuru = self.db_manager.get_guncel_doviz_kuru('USD')
            eur_kuru = self.db_manager.get_guncel_doviz_kuru('EUR')
            
            self.usd_label.setText(f"USD: {usd_kuru:.4f} TL")
            self.eur_label.setText(f"EUR: {eur_kuru:.4f} TL")
            
        except Exception as e:
            self.usd_label.setText("USD: Hata")
            self.eur_label.setText("EUR: Hata")
    
    def kaydet_kur(self):
        """Döviz kurunu kaydet"""
        try:
            if self.alis_kuru_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir alış kuru girin.")
                return
            
            if self.satis_kuru_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir satış kuru girin.")
                return
            
            if self.merkez_kuru_input.value() <= 0:
                QMessageBox.warning(self, "Uyarı", "Lütfen geçerli bir merkez kuru girin.")
                return
            
            kur_data = {
                'tarih': self.kur_tarih_input.date().toString('yyyy-MM-dd'),
                'doviz_tipi': self.doviz_tipi_combo.currentText(),
                'alis_kuru': self.alis_kuru_input.value(),
                'satis_kuru': self.satis_kuru_input.value(),
                'merkez_kuru': self.merkez_kuru_input.value(),
                'kaynak': self.kaynak_combo.currentText()
            }
            
            kur_id = self.db_manager.insert_doviz_kuru(kur_data)
            
            if kur_id:
                QMessageBox.information(self, "Başarılı", "Döviz kuru başarıyla kaydedildi.")
                self.temizle_kur_form()
                self.refresh_data()
                self.tab_widget.setCurrentIndex(0)  # Kur listesi tab'ına geç
            else:
                QMessageBox.critical(self, "Hata", "Döviz kuru kaydedilemedi.")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Kur kaydetme hatası: {str(e)}")
    
    def temizle_kur_form(self):
        """Kur formunu temizle"""
        self.kur_tarih_input.setDate(QDate.currentDate())
        self.doviz_tipi_combo.setCurrentIndex(0)
        self.alis_kuru_input.setValue(0)
        self.satis_kuru_input.setValue(0)
        self.merkez_kuru_input.setValue(0)
        self.kaynak_combo.setCurrentIndex(0)
    
    def analiz_yap(self):
        """Kar zarar analizi yap"""
        try:
            baslangic = self.baslangic_tarih_input.date().toString('yyyy-MM-dd')
            bitis = self.bitis_tarih_input.date().toString('yyyy-MM-dd')
            
            rapor = self.db_manager.get_kar_zarar_raporu(baslangic, bitis)
            
            rapor_text = f"""
📊 KAR/ZARAR ANALİZİ ({baslangic} - {bitis})

💰 GELİRLER:
• Toplam Satış (USD): ${rapor['toplam_satis_usd']:,.2f}
• Toplam Satış (TL): ₺{rapor['toplam_satis_tl']:,.2f}
• DAP Geliri (USD): ${rapor['dap_geliri_usd']:,.2f}
• DAP Geliri (TL): ₺{rapor['dap_geliri_tl']:,.2f}

💸 GİDERLER:
• Toplam Alış (TL): ₺{rapor['toplam_alis_tl']:,.2f}

📈 KAR/ZARAR:
• Net Kar: ₺{rapor['net_kar']:,.2f}
• Kar Marjı: %{rapor['kar_marji']:.2f}
• Ortalama Kur: {rapor['ortalama_kur']:.4f} TL/USD

🔍 ÖZET:
{"✅ Karlı dönem" if rapor['net_kar'] > 0 else "❌ Zararlı dönem"}
Kar marjı {"yüksek" if rapor['kar_marji'] > 20 else "orta" if rapor['kar_marji'] > 10 else "düşük"}
            """
            
            self.kar_zarar_label.setText(rapor_text)
            self.status_message.emit("Kar/zarar analizi tamamlandı")
            
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Analiz hatası: {str(e)}")
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

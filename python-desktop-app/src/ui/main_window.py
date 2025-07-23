#!/usr/bin/env python3
"""
Ana Pencere - Stok Muhasebe Sistemi
PyQt6 tabanlı ana uygulama penceresi
"""

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QTabWidget,
    QMenuBar, QStatusBar, QToolBar, QLabel, QPushButton, QFrame,
    QSplitter, QMessageBox, QApplication
)
from PyQt6.QtCore import Qt, pyqtSignal, QTimer
from PyQt6.QtGui import QFont, QIcon, QPixmap, QAction
from typing import Dict, Any

from database.db_manager import DatabaseManager
from ui.modules.dashboard import DashboardModule
from ui.modules.talep_yonetimi import TalepYonetimiModule
from ui.modules.stok_yonetimi import StokYonetimiModule
from ui.modules.gelir_gider_yonetimi import GelirGiderYonetimiModule
from ui.modules.cari_tanimlama import CariTanimlamaModule
from ui.modules.cari_islemler import CariIslemlerModule
from ui.modules.banka_yonetimi import BankaYonetimiModule

class MainWindow(QMainWindow):
    """Ana uygulama penceresi"""
    
    def __init__(self, db_manager: DatabaseManager):
        super().__init__()
        self.db_manager = db_manager
        self.modules = {}
        
        self.setup_ui()
        self.setup_menu()
        self.setup_toolbar()
        self.setup_status_bar()
        self.setup_connections()
        
        self.load_initial_data()
    
    def setup_ui(self):
        """Ana UI bileşenlerini oluştur"""
        self.setWindowTitle("Stok Muhasebe Sistemi v1.0")
        self.setMinimumSize(1200, 800)
        self.resize(1400, 900)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(8, 8, 8, 8)
        main_layout.setSpacing(8)
        
        self.tab_widget = QTabWidget()
        self.tab_widget.setTabPosition(QTabWidget.TabPosition.North)
        self.tab_widget.setMovable(True)
        self.tab_widget.setTabsClosable(False)
        
        self.tab_widget.setStyleSheet("""
            QTabWidget::pane {
                border: 1px solid #c0c0c0;
                background-color: white;
            }
            QTabWidget::tab-bar {
                alignment: left;
            }
            QTabBar::tab {
                background-color: #f0f0f0;
                border: 1px solid #c0c0c0;
                border-bottom-color: #c0c0c0;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                min-width: 120px;
                padding: 8px 16px;
                margin-right: 2px;
            }
            QTabBar::tab:selected {
                background-color: white;
                border-bottom-color: white;
            }
            QTabBar::tab:hover {
                background-color: #e0e0e0;
            }
        """)
        
        main_layout.addWidget(self.tab_widget)
        
        self.create_modules()
    
    def create_modules(self):
        """İş modüllerini oluştur"""
        self.modules['dashboard'] = DashboardModule(self.db_manager)
        self.tab_widget.addTab(self.modules['dashboard'], "📊 Dashboard")
        
        self.modules['talep'] = TalepYonetimiModule(self.db_manager)
        self.tab_widget.addTab(self.modules['talep'], "📋 Talep & Tedarik")
        
        self.modules['stok'] = StokYonetimiModule(self.db_manager)
        self.tab_widget.addTab(self.modules['stok'], "📦 Stok Yönetimi")
        
        self.modules['gelir_gider'] = GelirGiderYonetimiModule(self.db_manager)
        self.tab_widget.addTab(self.modules['gelir_gider'], "💰 Gelir/Gider")
        
        self.modules['cari_tanimlama'] = CariTanimlamaModule(self.db_manager)
        self.tab_widget.addTab(self.modules['cari_tanimlama'], "👥 Cari Tanımlama")
        
        self.modules['cari_islemler'] = CariIslemlerModule(self.db_manager)
        self.tab_widget.addTab(self.modules['cari_islemler'], "💳 Cari İşlemler")
        
        self.modules['banka'] = BankaYonetimiModule(self.db_manager)
        self.tab_widget.addTab(self.modules['banka'], "🏦 Banka Yönetimi")
    
    def setup_menu(self):
        """Menü çubuğunu oluştur"""
        menubar = self.menuBar()
        
        file_menu = menubar.addMenu("&Dosya")
        
        new_action = QAction("&Yeni", self)
        new_action.setShortcut("Ctrl+N")
        new_action.triggered.connect(self.new_file)
        file_menu.addAction(new_action)
        
        file_menu.addSeparator()
        
        backup_action = QAction("&Yedekle", self)
        backup_action.triggered.connect(self.backup_database)
        file_menu.addAction(backup_action)
        
        restore_action = QAction("&Geri Yükle", self)
        restore_action.triggered.connect(self.restore_database)
        file_menu.addAction(restore_action)
        
        file_menu.addSeparator()
        
        exit_action = QAction("Ç&ıkış", self)
        exit_action.setShortcut("Ctrl+Q")
        exit_action.triggered.connect(self.close)
        file_menu.addAction(exit_action)
        
        edit_menu = menubar.addMenu("&Düzen")
        
        refresh_action = QAction("&Yenile", self)
        refresh_action.setShortcut("F5")
        refresh_action.triggered.connect(self.refresh_all)
        edit_menu.addAction(refresh_action)
        
        view_menu = menubar.addMenu("&Görünüm")
        
        fullscreen_action = QAction("&Tam Ekran", self)
        fullscreen_action.setShortcut("F11")
        fullscreen_action.setCheckable(True)
        fullscreen_action.triggered.connect(self.toggle_fullscreen)
        view_menu.addAction(fullscreen_action)
        
        help_menu = menubar.addMenu("&Yardım")
        
        about_action = QAction("&Hakkında", self)
        about_action.triggered.connect(self.show_about)
        help_menu.addAction(about_action)
    
    def setup_toolbar(self):
        """Araç çubuğunu oluştur"""
        toolbar = self.addToolBar("Ana Araç Çubuğu")
        toolbar.setMovable(False)
        
        refresh_btn = QPushButton("🔄 Yenile")
        refresh_btn.clicked.connect(self.refresh_all)
        toolbar.addWidget(refresh_btn)
        
        toolbar.addSeparator()
        
        new_request_btn = QPushButton("📋 Yeni Talep")
        new_request_btn.clicked.connect(lambda: self.switch_to_module('talep'))
        toolbar.addWidget(new_request_btn)
        
        new_stock_btn = QPushButton("📦 Stok Giriş")
        new_stock_btn.clicked.connect(lambda: self.switch_to_module('stok'))
        toolbar.addWidget(new_stock_btn)
        
        new_income_btn = QPushButton("💰 Gelir Ekle")
        new_income_btn.clicked.connect(lambda: self.switch_to_module('gelir_gider'))
        toolbar.addWidget(new_income_btn)
        
        toolbar.addSeparator()
        
        backup_btn = QPushButton("💾 Yedekle")
        backup_btn.clicked.connect(self.backup_database)
        toolbar.addWidget(backup_btn)
    
    def setup_status_bar(self):
        """Durum çubuğunu oluştur"""
        self.status_bar = self.statusBar()
        
        self.status_label = QLabel("Hazır")
        self.status_bar.addWidget(self.status_label)
        
        self.status_bar.addPermanentWidget(QLabel("|"))
        
        self.db_status_label = QLabel("Veritabanı: Bağlı")
        self.status_bar.addPermanentWidget(self.db_status_label)
        
        self.status_bar.addPermanentWidget(QLabel("|"))
        
        self.time_label = QLabel()
        self.status_bar.addPermanentWidget(self.time_label)
        
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_time)
        self.timer.start(1000)
        self.update_time()
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.tab_widget.currentChanged.connect(self.on_tab_changed)
        
        for module in self.modules.values():
            if hasattr(module, 'status_message'):
                module.status_message.connect(self.show_status_message)
    
    def load_initial_data(self):
        """Başlangıç verilerini yükle"""
        try:
            if 'dashboard' in self.modules:
                self.modules['dashboard'].refresh_data()
            
            self.show_status_message("Veriler yüklendi")
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Veri yükleme hatası: {str(e)}")
    
    def switch_to_module(self, module_name: str):
        """Belirtilen modüle geç"""
        module_indices = {
            'dashboard': 0,
            'talep': 1,
            'stok': 2,
            'gelir_gider': 3,
            'cari_tanimlama': 4,
            'cari_islemler': 5,
            'banka': 6
        }
        
        if module_name in module_indices:
            self.tab_widget.setCurrentIndex(module_indices[module_name])
    
    def on_tab_changed(self, index: int):
        """Tab değiştiğinde"""
        current_widget = self.tab_widget.widget(index)
        if hasattr(current_widget, 'on_activated'):
            current_widget.on_activated()
    
    def refresh_all(self):
        """Tüm modülleri yenile"""
        try:
            for module in self.modules.values():
                if hasattr(module, 'refresh_data'):
                    module.refresh_data()
            
            self.show_status_message("Tüm veriler yenilendi")
        except Exception as e:
            QMessageBox.critical(self, "Hata", f"Yenileme hatası: {str(e)}")
    
    def new_file(self):
        """Yeni dosya oluştur"""
        reply = QMessageBox.question(
            self, "Yeni Dosya", 
            "Yeni bir veritabanı oluşturmak istediğinizden emin misiniz?\nMevcut veriler kaybolacak!",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
        )
        
        if reply == QMessageBox.StandardButton.Yes:
            try:
                self.db_manager.init_database()
                self.refresh_all()
                self.show_status_message("Yeni veritabanı oluşturuldu")
            except Exception as e:
                QMessageBox.critical(self, "Hata", f"Yeni veritabanı oluşturma hatası: {str(e)}")
    
    def backup_database(self):
        """Veritabanını yedekle"""
        from PyQt6.QtWidgets import QFileDialog
        import shutil
        from datetime import datetime
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        default_name = f"stok_muhasebe_yedek_{timestamp}.db"
        
        filename, _ = QFileDialog.getSaveFileName(
            self, "Veritabanı Yedekle", default_name, "Database Files (*.db)"
        )
        
        if filename:
            try:
                shutil.copy2(self.db_manager.db_path, filename)
                QMessageBox.information(self, "Başarılı", f"Veritabanı yedeklendi:\n{filename}")
                self.show_status_message("Veritabanı yedeklendi")
            except Exception as e:
                QMessageBox.critical(self, "Hata", f"Yedekleme hatası: {str(e)}")
    
    def restore_database(self):
        """Veritabanını geri yükle"""
        from PyQt6.QtWidgets import QFileDialog
        import shutil
        
        filename, _ = QFileDialog.getOpenFileName(
            self, "Veritabanı Geri Yükle", "", "Database Files (*.db)"
        )
        
        if filename:
            reply = QMessageBox.question(
                self, "Geri Yükleme", 
                "Mevcut veritabanı değiştirilecek!\nDevam etmek istediğinizden emin misiniz?",
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
            )
            
            if reply == QMessageBox.StandardButton.Yes:
                try:
                    shutil.copy2(filename, self.db_manager.db_path)
                    self.refresh_all()
                    QMessageBox.information(self, "Başarılı", "Veritabanı geri yüklendi")
                    self.show_status_message("Veritabanı geri yüklendi")
                except Exception as e:
                    QMessageBox.critical(self, "Hata", f"Geri yükleme hatası: {str(e)}")
    
    def toggle_fullscreen(self):
        """Tam ekran modunu aç/kapat"""
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()
    
    def show_about(self):
        """Hakkında dialogunu göster"""
        QMessageBox.about(self, "Hakkında", 
            "Stok Muhasebe Sistemi v1.0\n\n"
            "Python PyQt6 tabanlı masaüstü uygulaması\n"
            "SQLite veritabanı ile yerel veri depolama\n\n"
            "Geliştirici: Özgür Yılmaz\n"
            "© 2025 Yılmaz Transport"
        )
    
    def show_status_message(self, message: str, timeout: int = 3000):
        """Durum çubuğunda mesaj göster"""
        self.status_label.setText(message)
        if timeout > 0:
            QTimer.singleShot(timeout, lambda: self.status_label.setText("Hazır"))
    
    def update_time(self):
        """Zamanı güncelle"""
        from datetime import datetime
        current_time = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        self.time_label.setText(current_time)
    
    def closeEvent(self, event):
        """Pencere kapatılırken"""
        reply = QMessageBox.question(
            self, "Çıkış", 
            "Uygulamadan çıkmak istediğinizden emin misiniz?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
        )
        
        if reply == QMessageBox.StandardButton.Yes:
            event.accept()
        else:
            event.ignore()

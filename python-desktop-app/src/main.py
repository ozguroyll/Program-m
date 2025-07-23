#!/usr/bin/env python3
"""
Stok Muhasebe Sistemi - Ana Uygulama
Windows Masaüstü Uygulaması - Python PyQt6
"""

import sys
import os
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QIcon, QFont

from database.db_manager import DatabaseManager
from ui.main_window import MainWindow

class StokMuhasebeApp:
    def __init__(self):
        self.app = QApplication(sys.argv)
        self.app.setApplicationName("Stok Muhasebe Sistemi")
        self.app.setApplicationVersion("1.0.0")
        self.app.setOrganizationName("Yılmaz Transport")
        
        font = QFont("Segoe UI", 10)
        self.app.setFont(font)
        
        self.db_manager = DatabaseManager()
        
        self.main_window = MainWindow(self.db_manager)
        
    def run(self):
        """Uygulamayı başlat"""
        self.main_window.show()
        return self.app.exec()

def main():
    """Ana fonksiyon"""
    try:
        app = StokMuhasebeApp()
        sys.exit(app.run())
    except Exception as e:
        print(f"Uygulama başlatma hatası: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

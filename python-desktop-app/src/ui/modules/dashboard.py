#!/usr/bin/env python3
"""
Dashboard Modülü
Ana gösterge paneli ve KPI metrikleri
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QLabel, QFrame,
    QPushButton, QScrollArea, QListWidget, QListWidgetItem
)
from PyQt6.QtCore import Qt, pyqtSignal, QTimer
from PyQt6.QtGui import QFont
from typing import Dict, Any, List
from datetime import datetime

from database.db_manager import DatabaseManager
from ui.components.metric_card import MetricCard, QuickActionCard

class DashboardModule(QWidget):
    """Dashboard ana modülü"""
    
    status_message = pyqtSignal(str)
    
    def __init__(self, db_manager: DatabaseManager):
        super().__init__()
        self.db_manager = db_manager
        self.metric_cards = {}
        self.quick_actions = {}
        
        self.setup_ui()
        self.setup_connections()
        self.refresh_data()
        
        self.refresh_timer = QTimer()
        self.refresh_timer.timeout.connect(self.refresh_data)
        self.refresh_timer.start(30000)  # 30 saniyede bir yenile
    
    def setup_ui(self):
        """UI bileşenlerini oluştur"""
        layout = QVBoxLayout(self)
        layout.setContentsMargins(16, 16, 16, 16)
        layout.setSpacing(16)
        
        title_label = QLabel("📊 Dashboard - Genel Bakış")
        title_label.setStyleSheet("""
            QLabel {
                font-size: 24px;
                font-weight: bold;
                color: #212529;
                margin-bottom: 8px;
            }
        """)
        layout.addWidget(title_label)
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        
        scroll_widget = QWidget()
        scroll_layout = QVBoxLayout(scroll_widget)
        scroll_layout.setSpacing(16)
        
        self.create_kpi_section(scroll_layout)
        
        self.create_quick_actions_section(scroll_layout)
        
        self.create_recent_activities_section(scroll_layout)
        
        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)
    
    def create_kpi_section(self, layout):
        """KPI kartları bölümünü oluştur"""
        kpi_frame = QFrame()
        kpi_frame.setFrameStyle(QFrame.Shape.StyledPanel)
        kpi_frame.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 16px;
            }
        """)
        
        kpi_layout = QVBoxLayout(kpi_frame)
        
        kpi_title = QLabel("📈 Anahtar Performans Göstergeleri")
        kpi_title.setStyleSheet("""
            QLabel {
                font-size: 16px;
                font-weight: bold;
                color: #495057;
                margin-bottom: 12px;
            }
        """)
        kpi_layout.addWidget(kpi_title)
        
        kpi_grid = QGridLayout()
        kpi_grid.setSpacing(12)
        
        self.metric_cards['musteri'] = MetricCard("Toplam Müşteri", "0", 0, "👥", "#007acc")
        self.metric_cards['tedarikci'] = MetricCard("Toplam Tedarikçi", "0", 0, "🏭", "#28a745")
        self.metric_cards['talepler'] = MetricCard("Aktif Talepler", "0", 0, "📋", "#ffc107")
        self.metric_cards['gelir'] = MetricCard("Bu Ay Gelir", "0 ₺", 0, "💰", "#17a2b8")
        self.metric_cards['gider'] = MetricCard("Bu Ay Gider", "0 ₺", 0, "💸", "#dc3545")
        self.metric_cards['kar'] = MetricCard("Bu Ay Kar", "0 ₺", 0, "📊", "#6f42c1")
        
        row, col = 0, 0
        for card in self.metric_cards.values():
            kpi_grid.addWidget(card, row, col)
            col += 1
            if col >= 3:
                col = 0
                row += 1
        
        kpi_layout.addLayout(kpi_grid)
        layout.addWidget(kpi_frame)
    
    def create_quick_actions_section(self, layout):
        """Hızlı işlemler bölümünü oluştur"""
        actions_frame = QFrame()
        actions_frame.setFrameStyle(QFrame.Shape.StyledPanel)
        actions_frame.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 16px;
            }
        """)
        
        actions_layout = QVBoxLayout(actions_frame)
        
        actions_title = QLabel("⚡ Hızlı İşlemler")
        actions_title.setStyleSheet("""
            QLabel {
                font-size: 16px;
                font-weight: bold;
                color: #495057;
                margin-bottom: 12px;
            }
        """)
        actions_layout.addWidget(actions_title)
        
        actions_grid = QGridLayout()
        actions_grid.setSpacing(12)
        
        self.quick_actions['new_request'] = QuickActionCard("Yeni Talep", "📋", "new_request")
        self.quick_actions['stock_entry'] = QuickActionCard("Stok Giriş", "📦", "stock_entry")
        self.quick_actions['vehicle_exit'] = QuickActionCard("Araç Çıkış", "🚛", "vehicle_exit")
        self.quick_actions['add_income'] = QuickActionCard("Gelir Ekle", "💰", "add_income")
        self.quick_actions['add_expense'] = QuickActionCard("Gider Ekle", "💸", "add_expense")
        self.quick_actions['generate_report'] = QuickActionCard("Rapor Al", "📊", "generate_report")
        
        row, col = 0, 0
        for action in self.quick_actions.values():
            actions_grid.addWidget(action, row, col)
            col += 1
            if col >= 6:
                col = 0
                row += 1
        
        actions_layout.addLayout(actions_grid)
        layout.addWidget(actions_frame)
    
    def create_recent_activities_section(self, layout):
        """Son aktiviteler bölümünü oluştur"""
        activities_frame = QFrame()
        activities_frame.setFrameStyle(QFrame.Shape.StyledPanel)
        activities_frame.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 16px;
            }
        """)
        
        activities_layout = QVBoxLayout(activities_frame)
        
        activities_title = QLabel("🕒 Son Aktiviteler")
        activities_title.setStyleSheet("""
            QLabel {
                font-size: 16px;
                font-weight: bold;
                color: #495057;
                margin-bottom: 12px;
            }
        """)
        activities_layout.addWidget(activities_title)
        
        self.activities_list = QListWidget()
        self.activities_list.setMaximumHeight(200)
        self.activities_list.setStyleSheet("""
            QListWidget {
                background-color: white;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 8px;
            }
            QListWidget::item {
                padding: 8px;
                border-bottom: 1px solid #f1f3f4;
            }
            QListWidget::item:hover {
                background-color: #f8f9fa;
            }
        """)
        activities_layout.addWidget(self.activities_list)
        
        layout.addWidget(activities_frame)
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        for action_name, card in self.quick_actions.items():
            card.clicked.connect(self.on_quick_action_clicked)
    
    def refresh_data(self):
        """Veriyi yenile"""
        try:
            stats = self.db_manager.get_dashboard_stats()
            
            self.metric_cards['musteri'].set_value(str(stats.get('toplam_musteri', 0)))
            self.metric_cards['tedarikci'].set_value(str(stats.get('toplam_tedarikci', 0)))
            self.metric_cards['talepler'].set_value(str(stats.get('aktif_talepler', 0)))
            
            gelir = stats.get('bu_ay_gelir', 0)
            self.metric_cards['gelir'].set_value(f"{gelir:,.0f} ₺")
            
            gider = stats.get('bu_ay_gider', 0)
            self.metric_cards['gider'].set_value(f"{gider:,.0f} ₺")
            
            kar = gelir - gider
            self.metric_cards['kar'].set_value(f"{kar:,.0f} ₺")
            
            self.update_recent_activities()
            
            self.status_message.emit("Dashboard verileri güncellendi")
            
        except Exception as e:
            self.status_message.emit(f"Dashboard güncelleme hatası: {str(e)}")
    
    def update_recent_activities(self):
        """Son aktiviteleri güncelle"""
        self.activities_list.clear()
        
        activities = [
            "📋 Yeni talep oluşturuldu - Khoshnaw Trading",
            "📦 Stok girişi yapıldı - 500 Ton Mısır",
            "💰 Gelir kaydı eklendi - 125,000 USD",
            "🚛 Araç çıkışı tamamlandı - Plaka: 34ABC123",
            "💸 Gider kaydı eklendi - Nakliye masrafı"
        ]
        
        for activity in activities:
            item = QListWidgetItem(activity)
            self.activities_list.addItem(item)
    
    def on_quick_action_clicked(self, action: str):
        """Hızlı işlem tıklandığında"""
        self.status_message.emit(f"Hızlı işlem: {action}")
    
    def on_activated(self):
        """Modül aktif olduğunda"""
        self.refresh_data()

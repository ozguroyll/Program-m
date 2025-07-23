#!/usr/bin/env python3
"""
Metrik Kartı Bileşeni
Dashboard için KPI gösterge kartları
"""

from PyQt6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QFrame
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QFont
from typing import Optional

class MetricCard(QFrame):
    """Metrik gösterge kartı"""
    
    clicked = pyqtSignal()
    
    def __init__(self, title: str = "", value: str = "", change: float = 0, 
                 icon: str = "", color: str = "#007acc", parent=None):
        super().__init__(parent)
        
        self.title = title
        self.value = value
        self.change = change
        self.icon = icon
        self.color = color
        
        self.setup_ui()
        self.setup_style()
    
    def setup_ui(self):
        """UI bileşenlerini oluştur"""
        self.setFixedSize(280, 120)
        self.setFrameStyle(QFrame.Shape.StyledPanel)
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(16, 12, 16, 12)
        layout.setSpacing(8)
        
        top_layout = QHBoxLayout()
        
        self.title_label = QLabel(self.title)
        self.title_label.setStyleSheet("color: #6c757d; font-size: 12px; font-weight: 500;")
        top_layout.addWidget(self.title_label)
        
        top_layout.addStretch()
        
        self.icon_label = QLabel(self.icon)
        self.icon_label.setStyleSheet(f"font-size: 20px; color: {self.color};")
        top_layout.addWidget(self.icon_label)
        
        layout.addLayout(top_layout)
        
        self.value_label = QLabel(self.value)
        self.value_label.setStyleSheet("color: #212529; font-size: 24px; font-weight: bold;")
        layout.addWidget(self.value_label)
        
        self.change_label = QLabel(self.format_change())
        self.update_change_style()
        layout.addWidget(self.change_label)
        
        layout.addStretch()
    
    def setup_style(self):
        """Stil ayarlarını yap"""
        self.setStyleSheet(f"""
            MetricCard {{
                background-color: white;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                border-left: 4px solid {self.color};
            }}
            MetricCard:hover {{
                border-color: {self.color};
            }}
        """)
    
    def format_change(self) -> str:
        """Değişim yüzdesini formatla"""
        if self.change == 0:
            return "📊 Değişim yok"
        elif self.change > 0:
            return f"📈 +{self.change:.1f}% artış"
        else:
            return f"📉 {self.change:.1f}% azalış"
    
    def update_change_style(self):
        """Değişim etiketinin stilini güncelle"""
        if self.change > 0:
            color = "#28a745"
        elif self.change < 0:
            color = "#dc3545"
        else:
            color = "#6c757d"
        
        self.change_label.setStyleSheet(f"color: {color}; font-size: 11px; font-weight: 500;")
    
    def set_title(self, title: str):
        """Başlığı ayarla"""
        self.title = title
        self.title_label.setText(title)
    
    def set_value(self, value: str):
        """Değeri ayarla"""
        self.value = value
        self.value_label.setText(value)
    
    def set_change(self, change: float):
        """Değişimi ayarla"""
        self.change = change
        self.change_label.setText(self.format_change())
        self.update_change_style()
    
    def mousePressEvent(self, event):
        """Fare tıklama olayı"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.clicked.emit()
        super().mousePressEvent(event)

class QuickActionCard(QFrame):
    """Hızlı işlem kartı"""
    
    clicked = pyqtSignal(str)
    
    def __init__(self, title: str = "", icon: str = "", action: str = "", parent=None):
        super().__init__(parent)
        
        self.title = title
        self.icon = icon
        self.action = action
        
        self.setup_ui()
        self.setup_style()
    
    def setup_ui(self):
        """UI bileşenlerini oluştur"""
        self.setFixedSize(140, 100)
        self.setFrameStyle(QFrame.Shape.StyledPanel)
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 12, 12, 12)
        layout.setSpacing(8)
        
        self.icon_label = QLabel(self.icon)
        self.icon_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.icon_label.setStyleSheet("font-size: 24px; color: #007acc;")
        layout.addWidget(self.icon_label)
        
        self.title_label = QLabel(self.title)
        self.title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.title_label.setWordWrap(True)
        self.title_label.setStyleSheet("color: #495057; font-size: 11px; font-weight: 500;")
        layout.addWidget(self.title_label)
    
    def setup_style(self):
        """Stil ayarlarını yap"""
        self.setStyleSheet("""
            QuickActionCard {
                background-color: white;
                border: 1px solid #e9ecef;
                border-radius: 6px;
            }
            QuickActionCard:hover {
                background-color: #f8f9fa;
                border-color: #007acc;
            }
        """)
    
    def mousePressEvent(self, event):
        """Fare tıklama olayı"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.clicked.emit(self.action)
        super().mousePressEvent(event)

#!/usr/bin/env python3
"""
Profesyonel Veri Tablosu Bileşeni
PyQt6 tabanlı gelişmiş tablo widget'ı
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTableWidget, QTableWidgetItem,
    QHeaderView, QLineEdit, QPushButton, QComboBox, QLabel, QFrame,
    QCheckBox, QMenu, QMessageBox, QFileDialog, QProgressBar
)
from PyQt6.QtCore import Qt, pyqtSignal, QTimer, QThread, pyqtSlot
from PyQt6.QtGui import QFont, QIcon, QPixmap, QPainter, QColor
from typing import List, Dict, Any, Optional, Callable
import pandas as pd
from datetime import datetime

class ExportThread(QThread):
    """Excel export için thread"""
    finished = pyqtSignal(str)
    error = pyqtSignal(str)
    
    def __init__(self, data: List[Dict], filename: str, format_type: str):
        super().__init__()
        self.data = data
        self.filename = filename
        self.format_type = format_type
    
    def run(self):
        try:
            df = pd.DataFrame(self.data)
            
            if self.format_type == 'excel':
                df.to_excel(self.filename, index=False, engine='openpyxl')
            elif self.format_type == 'csv':
                df.to_csv(self.filename, index=False, encoding='utf-8-sig')
            
            self.finished.emit(self.filename)
        except Exception as e:
            self.error.emit(str(e))

class ProfessionalTable(QWidget):
    """Profesyonel veri tablosu widget'ı"""
    
    row_selected = pyqtSignal(int, dict)
    row_double_clicked = pyqtSignal(int, dict)
    data_changed = pyqtSignal()
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.data = []
        self.filtered_data = []
        self.columns = []
        self.column_widths = {}
        self.search_columns = []
        self.export_thread = None
        
        self.setup_ui()
        self.setup_connections()
    
    def setup_ui(self):
        """UI bileşenlerini oluştur"""
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(8)
        
        self.create_toolbar()
        layout.addWidget(self.toolbar)
        
        self.table = QTableWidget()
        self.table.setAlternatingRowColors(True)
        self.table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QTableWidget.SelectionMode.SingleSelection)
        self.table.setSortingEnabled(True)
        self.table.verticalHeader().setVisible(False)
        
        self.table.setStyleSheet("""
            QTableWidget {
                gridline-color: #e0e0e0;
                background-color: white;
                alternate-background-color: #f8f9fa;
                selection-background-color: #007acc;
                selection-color: white;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            QTableWidget::item {
                padding: 8px;
                border: none;
            }
            QTableWidget::item:selected {
                background-color: #007acc;
                color: white;
            }
            QHeaderView::section {
                background-color: #f1f3f4;
                padding: 8px;
                border: none;
                border-right: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                font-weight: bold;
                color: #333;
            }
        """)
        
        layout.addWidget(self.table)
        
        self.create_status_bar()
        layout.addWidget(self.status_bar)
    
    def create_toolbar(self):
        """Araç çubuğunu oluştur"""
        self.toolbar = QFrame()
        self.toolbar.setFrameStyle(QFrame.Shape.StyledPanel)
        self.toolbar.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 4px;
            }
        """)
        
        layout = QHBoxLayout(self.toolbar)
        layout.setContentsMargins(8, 4, 8, 4)
        
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Ara...")
        self.search_input.setMaximumWidth(300)
        self.search_input.setStyleSheet("""
            QLineEdit {
                padding: 6px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
            }
            QLineEdit:focus {
                border-color: #007acc;
                outline: none;
            }
        """)
        layout.addWidget(QLabel("🔍"))
        layout.addWidget(self.search_input)
        
        layout.addStretch()
        
        self.filter_btn = QPushButton("🔽 Filtrele")
        self.filter_btn.setStyleSheet(self.get_button_style())
        layout.addWidget(self.filter_btn)
        
        self.export_btn = QPushButton("📊 Dışa Aktar")
        self.export_btn.setStyleSheet(self.get_button_style())
        layout.addWidget(self.export_btn)
        
        self.refresh_btn = QPushButton("🔄 Yenile")
        self.refresh_btn.setStyleSheet(self.get_button_style())
        layout.addWidget(self.refresh_btn)
        
        self.columns_btn = QPushButton("⚙️ Sütunlar")
        self.columns_btn.setStyleSheet(self.get_button_style())
        layout.addWidget(self.columns_btn)
    
    def create_status_bar(self):
        """Durum çubuğunu oluştur"""
        self.status_bar = QFrame()
        self.status_bar.setFrameStyle(QFrame.Shape.StyledPanel)
        self.status_bar.setMaximumHeight(30)
        self.status_bar.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
            }
        """)
        
        layout = QHBoxLayout(self.status_bar)
        layout.setContentsMargins(8, 4, 8, 4)
        
        self.status_label = QLabel("Hazır")
        self.status_label.setStyleSheet("color: #6c757d; font-size: 12px;")
        layout.addWidget(self.status_label)
        
        layout.addStretch()
        
        self.count_label = QLabel("0 kayıt")
        self.count_label.setStyleSheet("color: #6c757d; font-size: 12px; font-weight: bold;")
        layout.addWidget(self.count_label)
    
    def get_button_style(self) -> str:
        """Buton stili"""
        return """
            QPushButton {
                background-color: #007acc;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 12px;
            }
            QPushButton:hover {
                background-color: #005a9e;
            }
            QPushButton:pressed {
                background-color: #004578;
            }
            QPushButton:disabled {
                background-color: #6c757d;
            }
        """
    
    def setup_connections(self):
        """Sinyal bağlantılarını kur"""
        self.search_input.textChanged.connect(self.filter_data)
        self.export_btn.clicked.connect(self.show_export_menu)
        self.refresh_btn.clicked.connect(self.refresh_data)
        self.columns_btn.clicked.connect(self.show_column_menu)
        self.filter_btn.clicked.connect(self.show_filter_menu)
        
        self.table.itemSelectionChanged.connect(self.on_selection_changed)
        self.table.itemDoubleClicked.connect(self.on_double_click)
    
    def set_data(self, data: List[Dict[str, Any]], columns: List[Dict[str, Any]]):
        """Veri ve sütunları ayarla"""
        self.data = data
        self.columns = columns
        self.filtered_data = data.copy()
        
        self.search_columns = [col['key'] for col in columns if col.get('searchable', True)]
        
        self.update_table()
        self.update_status()
    
    def update_table(self):
        """Tabloyu güncelle"""
        if not self.filtered_data or not self.columns:
            self.table.setRowCount(0)
            self.table.setColumnCount(0)
            return
        
        self.table.setColumnCount(len(self.columns))
        
        headers = [col['title'] for col in self.columns]
        self.table.setHorizontalHeaderLabels(headers)
        
        self.table.setRowCount(len(self.filtered_data))
        
        for row_idx, row_data in enumerate(self.filtered_data):
            for col_idx, column in enumerate(self.columns):
                key = column['key']
                value = row_data.get(key, '')
                
                formatted_value = self.format_cell_value(value, column)
                
                item = QTableWidgetItem(str(formatted_value))
                item.setData(Qt.ItemDataRole.UserRole, row_data)
                
                if column.get('align') == 'center':
                    item.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
                elif column.get('align') == 'right':
                    item.setTextAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
                
                if 'color_map' in column and value in column['color_map']:
                    color = QColor(column['color_map'][value])
                    item.setBackground(color)
                
                self.table.setItem(row_idx, col_idx, item)
        
        self.adjust_column_widths()
    
    def format_cell_value(self, value: Any, column: Dict[str, Any]) -> str:
        """Hücre değerini formatla"""
        if value is None or value == '':
            return ''
        
        format_type = column.get('format', 'text')
        
        if format_type == 'currency':
            try:
                amount = float(value)
                currency = column.get('currency', 'TRY')
                if currency == 'TRY':
                    return f"{amount:,.2f} ₺"
                elif currency == 'USD':
                    return f"${amount:,.2f}"
                elif currency == 'EUR':
                    return f"€{amount:,.2f}"
                else:
                    return f"{amount:,.2f} {currency}"
            except (ValueError, TypeError):
                return str(value)
        
        elif format_type == 'number':
            try:
                num = float(value)
                decimals = column.get('decimals', 2)
                return f"{num:,.{decimals}f}"
            except (ValueError, TypeError):
                return str(value)
        
        elif format_type == 'date':
            if isinstance(value, str):
                try:
                    date_obj = datetime.strptime(value, '%Y-%m-%d')
                    return date_obj.strftime('%d.%m.%Y')
                except ValueError:
                    return value
            return str(value)
        
        elif format_type == 'badge':
            return str(value)
        
        return str(value)
    
    def adjust_column_widths(self):
        """Sütun genişliklerini ayarla"""
        header = self.table.horizontalHeader()
        
        for col_idx, column in enumerate(self.columns):
            width = column.get('width')
            if width:
                self.table.setColumnWidth(col_idx, width)
            elif column.get('auto_resize', True):
                header.setSectionResizeMode(col_idx, QHeaderView.ResizeMode.ResizeToContents)
        
        if self.columns:
            header.setSectionResizeMode(len(self.columns) - 1, QHeaderView.ResizeMode.Stretch)
    
    def filter_data(self):
        """Veriyi filtrele"""
        search_text = self.search_input.text().lower().strip()
        
        if not search_text:
            self.filtered_data = self.data.copy()
        else:
            self.filtered_data = []
            for row in self.data:
                for col_key in self.search_columns:
                    value = str(row.get(col_key, '')).lower()
                    if search_text in value:
                        self.filtered_data.append(row)
                        break
        
        self.update_table()
        self.update_status()
    
    def update_status(self):
        """Durum çubuğunu güncelle"""
        total_count = len(self.data)
        filtered_count = len(self.filtered_data)
        
        if total_count == filtered_count:
            self.count_label.setText(f"{total_count} kayıt")
        else:
            self.count_label.setText(f"{filtered_count} / {total_count} kayıt")
        
        if filtered_count == 0:
            self.status_label.setText("Kayıt bulunamadı")
        else:
            self.status_label.setText("Hazır")
    
    def show_export_menu(self):
        """Export menüsünü göster"""
        menu = QMenu(self)
        
        excel_action = menu.addAction("📊 Excel (.xlsx)")
        csv_action = menu.addAction("📄 CSV (.csv)")
        
        action = menu.exec(self.export_btn.mapToGlobal(self.export_btn.rect().bottomLeft()))
        
        if action == excel_action:
            self.export_data('excel')
        elif action == csv_action:
            self.export_data('csv')
    
    def export_data(self, format_type: str):
        """Veriyi dışa aktar"""
        if not self.filtered_data:
            QMessageBox.warning(self, "Uyarı", "Dışa aktarılacak veri bulunamadı.")
            return
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        if format_type == 'excel':
            filename, _ = QFileDialog.getSaveFileName(
                self, "Excel Dosyası Kaydet", 
                f"veri_export_{timestamp}.xlsx",
                "Excel Files (*.xlsx)"
            )
        else:
            filename, _ = QFileDialog.getSaveFileName(
                self, "CSV Dosyası Kaydet", 
                f"veri_export_{timestamp}.csv",
                "CSV Files (*.csv)"
            )
        
        if filename:
            self.export_thread = ExportThread(self.filtered_data, filename, format_type)
            self.export_thread.finished.connect(self.on_export_finished)
            self.export_thread.error.connect(self.on_export_error)
            self.export_thread.start()
            
            self.status_label.setText("Dışa aktarılıyor...")
            self.export_btn.setEnabled(False)
    
    def on_export_finished(self, filename: str):
        """Export tamamlandığında"""
        self.status_label.setText("Dışa aktarma tamamlandı")
        self.export_btn.setEnabled(True)
        QMessageBox.information(self, "Başarılı", f"Veriler başarıyla dışa aktarıldı:\n{filename}")
    
    def on_export_error(self, error: str):
        """Export hatasında"""
        self.status_label.setText("Dışa aktarma hatası")
        self.export_btn.setEnabled(True)
        QMessageBox.critical(self, "Hata", f"Dışa aktarma sırasında hata oluştu:\n{error}")
    
    def show_column_menu(self):
        """Sütun görünürlük menüsünü göster"""
        menu = QMenu(self)
        
        for col_idx, column in enumerate(self.columns):
            action = menu.addAction(column['title'])
            action.setCheckable(True)
            action.setChecked(not self.table.isColumnHidden(col_idx))
            action.setData(col_idx)
        
        action = menu.exec(self.columns_btn.mapToGlobal(self.columns_btn.rect().bottomLeft()))
        
        if action:
            col_idx = action.data()
            is_visible = action.isChecked()
            self.table.setColumnHidden(col_idx, not is_visible)
    
    def show_filter_menu(self):
        """Filtre menüsünü göster"""
        menu = QMenu(self)
        menu.addAction("Tümünü Göster").triggered.connect(self.clear_filters)
        menu.addSeparator()
        
        if any('durum' in str(row).lower() for row in self.data):
            status_menu = menu.addMenu("Durum")
            statuses = set()
            for row in self.data:
                for key, value in row.items():
                    if 'durum' in key.lower():
                        statuses.add(str(value))
            
            for status in sorted(statuses):
                action = status_menu.addAction(status)
                action.triggered.connect(lambda checked, s=status: self.filter_by_status(s))
        
        menu.exec(self.filter_btn.mapToGlobal(self.filter_btn.rect().bottomLeft()))
    
    def clear_filters(self):
        """Filtreleri temizle"""
        self.search_input.clear()
        self.filter_data()
    
    def filter_by_status(self, status: str):
        """Duruma göre filtrele"""
        self.filtered_data = []
        for row in self.data:
            for key, value in row.items():
                if 'durum' in key.lower() and str(value) == status:
                    self.filtered_data.append(row)
                    break
        
        self.update_table()
        self.update_status()
    
    def refresh_data(self):
        """Veriyi yenile"""
        self.data_changed.emit()
    
    def on_selection_changed(self):
        """Seçim değiştiğinde"""
        current_row = self.table.currentRow()
        if current_row >= 0 and current_row < len(self.filtered_data):
            row_data = self.filtered_data[current_row]
            self.row_selected.emit(current_row, row_data)
    
    def on_double_click(self, item):
        """Çift tıklamada"""
        row = item.row()
        if row >= 0 and row < len(self.filtered_data):
            row_data = self.filtered_data[row]
            self.row_double_clicked.emit(row, row_data)
    
    def get_selected_data(self) -> Optional[Dict[str, Any]]:
        """Seçili satırın verisini getir"""
        current_row = self.table.currentRow()
        if current_row >= 0 and current_row < len(self.filtered_data):
            return self.filtered_data[current_row]
        return None
    
    def select_row_by_id(self, id_value: Any, id_key: str = 'id'):
        """ID'ye göre satır seç"""
        for row_idx, row_data in enumerate(self.filtered_data):
            if row_data.get(id_key) == id_value:
                self.table.selectRow(row_idx)
                break

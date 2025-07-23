from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..styles import ProfessionalStyles
from .validation import ToastNotification
from .export_manager import ExportManager

class UltraProfessionalTable(QWidget):
    data_changed = pyqtSignal()
    row_selected = pyqtSignal(int, dict)
    row_double_clicked = pyqtSignal(int, dict)
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.data = []
        self.filtered_data = []
        self.columns = []
        self.search_columns = []
        self.setup_ui()
        self.setup_connections()
        self.apply_styles()
    
    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(20)
        layout.setContentsMargins(0, 0, 0, 0)
        
        self.metrics_widget = self.create_metrics_cards()
        layout.addWidget(self.metrics_widget)
        
        self.toolbar = self.create_toolbar()
        layout.addWidget(self.toolbar)
        
        self.table = QTableWidget()
        self.table.setAlternatingRowColors(True)
        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        self.table.setSortingEnabled(True)
        self.table.verticalHeader().setVisible(False)
        layout.addWidget(self.table)
        
        self.pagination = self.create_pagination()
        layout.addWidget(self.pagination)
        
        self.status_bar = self.create_status_bar()
        layout.addWidget(self.status_bar)
    
    def create_metrics_cards(self):
        metrics_frame = QFrame()
        metrics_layout = QHBoxLayout(metrics_frame)
        metrics_layout.setSpacing(15)
        
        self.total_card = self.create_metric_card("Toplam", "0", "#3b82f6", "📊")
        self.active_card = self.create_metric_card("Aktif", "0", "#10b981", "✅")
        self.pending_card = self.create_metric_card("Bekleyen", "0", "#f59e0b", "⏳")
        self.completed_card = self.create_metric_card("Tamamlanan", "0", "#8b5cf6", "🎯")
        
        metrics_layout.addWidget(self.total_card)
        metrics_layout.addWidget(self.active_card)
        metrics_layout.addWidget(self.pending_card)
        metrics_layout.addWidget(self.completed_card)
        metrics_layout.addStretch()
        
        return metrics_frame
    
    def create_metric_card(self, title, value, color, icon):
        card = QFrame()
        card.setFixedSize(180, 80)
        card.setStyleSheet(f"""
            QFrame {{
                background-color: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 12px;
            }}
            QFrame:hover {{
                border-color: {color};
                background-color: #fafbff;
            }}
        """)
        
        layout = QVBoxLayout(card)
        layout.setSpacing(4)
        layout.setContentsMargins(8, 8, 8, 8)
        
        header_layout = QHBoxLayout()
        
        title_label = QLabel(title)
        title_label.setStyleSheet("color: #6b7280; font-size: 11px; font-weight: 500;")
        
        icon_label = QLabel(icon)
        icon_label.setStyleSheet("font-size: 14px;")
        
        header_layout.addWidget(title_label)
        header_layout.addStretch()
        header_layout.addWidget(icon_label)
        
        value_label = QLabel(value)
        value_label.setStyleSheet(f"color: {color}; font-size: 18px; font-weight: bold;")
        value_label.setObjectName("value_label")
        
        layout.addLayout(header_layout)
        layout.addWidget(value_label)
        layout.addStretch()
        
        return card
    
    def create_toolbar(self):
        toolbar = QFrame()
        toolbar_layout = QHBoxLayout(toolbar)
        toolbar_layout.setSpacing(10)
        
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("🔍 Ara...")
        self.search_input.setStyleSheet(ProfessionalStyles.get_input_style())
        self.search_input.setMaximumWidth(300)
        
        self.filter_btn = QPushButton("🔽 Filtrele")
        self.filter_btn.setStyleSheet(ProfessionalStyles.get_secondary_button_style())
        
        self.columns_btn = QPushButton("📋 Sütunlar")
        self.columns_btn.setStyleSheet(ProfessionalStyles.get_secondary_button_style())
        
        self.export_btn = QPushButton("📤 Dışa Aktar")
        self.export_btn.setStyleSheet(ProfessionalStyles.get_secondary_button_style())
        
        self.refresh_btn = QPushButton("🔄 Yenile")
        self.refresh_btn.setStyleSheet(ProfessionalStyles.get_secondary_button_style())
        
        toolbar_layout.addWidget(self.search_input)
        toolbar_layout.addWidget(self.filter_btn)
        toolbar_layout.addWidget(self.columns_btn)
        toolbar_layout.addWidget(self.export_btn)
        toolbar_layout.addWidget(self.refresh_btn)
        toolbar_layout.addStretch()
        
        return toolbar
    
    def create_pagination(self):
        pagination_frame = QFrame()
        pagination_layout = QHBoxLayout(pagination_frame)
        
        self.prev_btn = QPushButton("◀ Önceki")
        self.prev_btn.setStyleSheet(ProfessionalStyles.get_secondary_button_style())
        
        self.page_label = QLabel("Sayfa 1 / 1")
        self.page_label.setStyleSheet("color: #6b7280; font-weight: 500;")
        
        self.next_btn = QPushButton("Sonraki ▶")
        self.next_btn.setStyleSheet(ProfessionalStyles.get_secondary_button_style())
        
        pagination_layout.addStretch()
        pagination_layout.addWidget(self.prev_btn)
        pagination_layout.addWidget(self.page_label)
        pagination_layout.addWidget(self.next_btn)
        pagination_layout.addStretch()
        
        return pagination_frame
    
    def create_status_bar(self):
        status_frame = QFrame()
        status_layout = QHBoxLayout(status_frame)
        
        self.count_label = QLabel("0 kayıt")
        self.count_label.setStyleSheet("color: #6b7280; font-size: 12px;")
        
        self.status_label = QLabel("Hazır")
        self.status_label.setStyleSheet("color: #10b981; font-size: 12px; font-weight: 500;")
        
        status_layout.addWidget(self.count_label)
        status_layout.addStretch()
        status_layout.addWidget(self.status_label)
        
        return status_frame
    
    def setup_connections(self):
        self.search_input.textChanged.connect(self.filter_data)
        self.export_btn.clicked.connect(self.show_export_menu)
        self.refresh_btn.clicked.connect(self.refresh_data)
        self.columns_btn.clicked.connect(self.show_column_menu)
        self.filter_btn.clicked.connect(self.show_filter_menu)
        
        self.table.itemSelectionChanged.connect(self.on_selection_changed)
        self.table.itemDoubleClicked.connect(self.on_double_click)
    
    def set_data(self, data: List, headers: List[str]):
        self.data = data
        self.filtered_data = data.copy()
        self.headers = headers
        
        self.update_table()
        self.update_metrics()
        self.update_status()
    
    def update_table(self):
        if not self.filtered_data or not self.headers:
            self.table.setRowCount(0)
            self.table.setColumnCount(0)
            return
        
        self.table.setColumnCount(len(self.headers))
        self.table.setHorizontalHeaderLabels(self.headers)
        self.table.setRowCount(len(self.filtered_data))
        
        for row_idx, row_data in enumerate(self.filtered_data):
            for col_idx, value in enumerate(row_data):
                item = QTableWidgetItem(str(value))
                
                if col_idx == 0:
                    item.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
                elif isinstance(value, (int, float)):
                    item.setTextAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
                
                self.table.setItem(row_idx, col_idx, item)
        
        self.table.resizeColumnsToContents()
    
    def update_metrics(self):
        total_count = len(self.data)
        
        active_count = sum(1 for row in self.data if 'Aktif' in str(row))
        pending_count = sum(1 for row in self.data if 'Beklemede' in str(row))
        completed_count = sum(1 for row in self.data if any(status in str(row) for status in ['Tamamlandı', 'Onaylandı']))
        
        self.total_card.findChild(QLabel, "value_label").setText(str(total_count))
        self.active_card.findChild(QLabel, "value_label").setText(str(active_count))
        self.pending_card.findChild(QLabel, "value_label").setText(str(pending_count))
        self.completed_card.findChild(QLabel, "value_label").setText(str(completed_count))
    
    def filter_data(self):
        search_text = self.search_input.text().lower().strip()
        
        if not search_text:
            self.filtered_data = self.data.copy()
        else:
            self.filtered_data = []
            for row in self.data:
                if any(search_text in str(cell).lower() for cell in row):
                    self.filtered_data.append(row)
        
        self.update_table()
        self.update_status()
    
    def update_status(self):
        total_count = len(self.data)
        filtered_count = len(self.filtered_data)
        
        if total_count == filtered_count:
            self.count_label.setText(f"{total_count} kayıt")
        else:
            self.count_label.setText(f"{filtered_count} / {total_count} kayıt")
        
        if filtered_count == 0:
            self.status_label.setText("Kayıt bulunamadı")
            self.status_label.setStyleSheet("color: #ef4444; font-size: 12px; font-weight: 500;")
        else:
            self.status_label.setText("Hazır")
            self.status_label.setStyleSheet("color: #10b981; font-size: 12px; font-weight: 500;")
    
    def show_export_menu(self):
        menu = QMenu(self)
        
        excel_action = menu.addAction("📊 Excel (.xlsx)")
        csv_action = menu.addAction("📄 CSV (.csv)")
        pdf_action = menu.addAction("📋 PDF (.pdf)")
        
        action = menu.exec(self.export_btn.mapToGlobal(self.export_btn.rect().bottomLeft()))
        
        if action == excel_action:
            self.export_data('excel')
        elif action == csv_action:
            self.export_data('csv')
        elif action == pdf_action:
            self.export_data('pdf')
    
    def export_data(self, format_type: str):
        if not self.filtered_data:
            ToastNotification.show_warning("Uyarı", "Dışa aktarılacak veri bulunamadı.")
            return
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"veri_export_{timestamp}"
        
        try:
            export_data = []
            for row in self.filtered_data:
                export_data.append(dict(zip(self.headers, row)))
            
            if format_type == 'excel':
                success, message = ExportManager.export_to_excel(export_data, filename, "Veri")
            elif format_type == 'csv':
                success, message = ExportManager.export_to_csv(export_data, filename)
            elif format_type == 'pdf':
                success, message = ExportManager.export_to_pdf(export_data, filename, "Veri Raporu")
            
            if success:
                ToastNotification.show_success("Başarılı", message)
            else:
                ToastNotification.show_error("Hata", message)
                
        except Exception as e:
            ToastNotification.show_error("Hata", f"Export hatası: {str(e)}")
    
    def show_column_menu(self):
        ToastNotification.show_info("Bilgi", "Sütun görünürlük özelliği yakında...")
    
    def show_filter_menu(self):
        ToastNotification.show_info("Bilgi", "Gelişmiş filtre özelliği yakında...")
    
    def refresh_data(self):
        self.data_changed.emit()
        ToastNotification.show_info("Bilgi", "Veriler yenileniyor...")
    
    def on_selection_changed(self):
        current_row = self.table.currentRow()
        if current_row >= 0 and current_row < len(self.filtered_data):
            row_data = dict(zip(self.headers, self.filtered_data[current_row]))
            self.row_selected.emit(current_row, row_data)
    
    def on_double_click(self, item):
        row = item.row()
        if row >= 0 and row < len(self.filtered_data):
            row_data = dict(zip(self.headers, self.filtered_data[row]))
            self.row_double_clicked.emit(row, row_data)
    
    def apply_styles(self):
        self.setStyleSheet(f"""
            {ProfessionalStyles.get_table_style()}
            
            QFrame {{
                background-color: #f8fafc;
            }}
        """)

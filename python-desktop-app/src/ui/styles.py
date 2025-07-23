from PyQt6.QtCore import Qt

class ProfessionalStyles:
    @staticmethod
    def get_main_window_style():
        return """
        QMainWindow {
            background-color: #f8fafc;
            color: #1f2937;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        QTabWidget::pane {
            border: 1px solid #e5e7eb;
            background-color: white;
            border-radius: 8px;
            margin-top: 2px;
        }
        
        QTabBar::tab {
            background-color: #f3f4f6;
            color: #6b7280;
            padding: 12px 24px;
            margin-right: 2px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            font-weight: 500;
            min-width: 120px;
        }
        
        QTabBar::tab:selected {
            background-color: white;
            color: #1f2937;
            border-bottom: 3px solid #3b82f6;
            font-weight: 600;
        }
        
        QTabBar::tab:hover {
            background-color: #e5e7eb;
            color: #374151;
        }
        """
    
    @staticmethod
    def get_metric_card_style():
        return """
        QFrame {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            margin: 8px;
            min-height: 120px;
        }
        
        QFrame:hover {
            border-color: #3b82f6;
            background-color: #fafbff;
        }
        
        QLabel {
            color: #1f2937;
        }
        """
    
    @staticmethod
    def get_button_styles():
        return """
        QPushButton {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            min-height: 20px;
        }
        
        QPushButton:hover {
            background-color: #2563eb;
        }
        
        QPushButton:pressed {
            background-color: #1d4ed8;
        }
        
        QPushButton:disabled {
            background-color: #9ca3af;
            color: #6b7280;
        }
        """
    
    @staticmethod
    def get_secondary_button_style():
        return """
        QPushButton {
            background-color: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
        }
        
        QPushButton:hover {
            background-color: #e5e7eb;
            border-color: #9ca3af;
        }
        
        QPushButton:pressed {
            background-color: #d1d5db;
        }
        """
    
    @staticmethod
    def get_input_style():
        return """
        QLineEdit, QTextEdit, QComboBox {
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 14px;
            background-color: white;
            color: #1f2937;
        }
        
        QLineEdit:focus, QTextEdit:focus, QComboBox:focus {
            border-color: #3b82f6;
            outline: none;
        }
        
        QLineEdit:hover, QTextEdit:hover, QComboBox:hover {
            border-color: #9ca3af;
        }
        """
    
    @staticmethod
    def get_table_style():
        return """
        QTableWidget {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            gridline-color: #f3f4f6;
            font-size: 14px;
        }
        
        QTableWidget::item {
            padding: 12px 8px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        QTableWidget::item:selected {
            background-color: #eff6ff;
            color: #1e40af;
        }
        
        QTableWidget::item:hover {
            background-color: #f8fafc;
        }
        
        QHeaderView::section {
            background-color: #f9fafb;
            color: #374151;
            padding: 12px 8px;
            border: none;
            border-bottom: 2px solid #e5e7eb;
            font-weight: 600;
            font-size: 13px;
        }
        """
    
    @staticmethod
    def get_card_style():
        return """
        QGroupBox {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            margin: 10px;
            font-weight: 600;
            font-size: 16px;
            color: #1f2937;
        }
        
        QGroupBox::title {
            subcontrol-origin: margin;
            left: 10px;
            padding: 0 10px 0 10px;
            color: #374151;
        }
        """
    
    @staticmethod
    def get_status_badge_style(status_type):
        styles = {
            'success': """
                QLabel {
                    background-color: #dcfce7;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                    border-radius: 12px;
                    padding: 4px 12px;
                    font-weight: 500;
                    font-size: 12px;
                }
            """,
            'warning': """
                QLabel {
                    background-color: #fef3c7;
                    color: #92400e;
                    border: 1px solid #fde68a;
                    border-radius: 12px;
                    padding: 4px 12px;
                    font-weight: 500;
                    font-size: 12px;
                }
            """,
            'error': """
                QLabel {
                    background-color: #fee2e2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                    border-radius: 12px;
                    padding: 4px 12px;
                    font-weight: 500;
                    font-size: 12px;
                }
            """,
            'info': """
                QLabel {
                    background-color: #dbeafe;
                    color: #1d4ed8;
                    border: 1px solid #bfdbfe;
                    border-radius: 12px;
                    padding: 4px 12px;
                    font-weight: 500;
                    font-size: 12px;
                }
            """
        }
        return styles.get(status_type, styles['info'])

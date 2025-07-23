from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *

class ValidationSystem:
    @staticmethod
    def validate_required_fields(form_data, required_fields):
        missing_fields = []
        for field in required_fields:
            if not form_data.get(field) or str(form_data[field]).strip() == '':
                missing_fields.append(field)
        
        if missing_fields:
            ToastNotification.show_error("Hata", 
                                       f"Lütfen zorunlu alanları doldurun: {', '.join(missing_fields)}")
            return False
        return True
    
    @staticmethod
    def validate_numeric_fields(form_data, numeric_fields):
        for field in numeric_fields:
            try:
                float(form_data.get(field, 0))
            except (ValueError, TypeError):
                ToastNotification.show_error("Hata", 
                                           f"{field} alanı geçerli bir sayı olmalıdır")
                return False
        return True
    
    @staticmethod
    def validate_email(email):
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if email and not re.match(pattern, email):
            ToastNotification.show_error("Hata", "Geçerli bir e-mail adresi girin")
            return False
        return True
    
    @staticmethod
    def validate_phone(phone):
        import re
        pattern = r'^[\+]?[0-9\s\-\(\)]{10,}$'
        if phone and not re.match(pattern, phone):
            ToastNotification.show_error("Hata", "Geçerli bir telefon numarası girin")
            return False
        return True

class ToastNotification(QWidget):
    def __init__(self, message, message_type="info", parent=None):
        super().__init__(parent)
        self.setWindowFlags(Qt.WindowType.FramelessWindowHint | Qt.WindowType.WindowStaysOnTopHint)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setup_ui(message, message_type)
        self.show_animation()
    
    def setup_ui(self, message, message_type):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 15, 20, 15)
        
        colors = {
            'success': ('#dcfce7', '#166534', '#22c55e'),
            'error': ('#fee2e2', '#dc2626', '#ef4444'),
            'warning': ('#fef3c7', '#92400e', '#f59e0b'),
            'info': ('#dbeafe', '#1d4ed8', '#3b82f6')
        }
        
        bg_color, text_color, border_color = colors.get(message_type, colors['info'])
        
        self.setStyleSheet(f"""
            QWidget {{
                background-color: {bg_color};
                color: {text_color};
                border: 2px solid {border_color};
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
            }}
        """)
        
        icon_label = QLabel()
        icons = {
            'success': '✓',
            'error': '✗',
            'warning': '⚠',
            'info': 'ℹ'
        }
        icon_label.setText(icons.get(message_type, 'ℹ'))
        icon_label.setStyleSheet(f"font-size: 16px; color: {border_color}; font-weight: bold;")
        
        message_label = QLabel(message)
        message_label.setWordWrap(True)
        
        layout.addWidget(icon_label)
        layout.addWidget(message_label)
        
        self.setFixedSize(350, 80)
        
        QTimer.singleShot(3000, self.hide_animation)
    
    def show_animation(self):
        screen = QApplication.primaryScreen().geometry()
        self.move(screen.width() - self.width() - 20, 20)
        
        self.effect = QGraphicsOpacityEffect()
        self.setGraphicsEffect(self.effect)
        
        self.animation = QPropertyAnimation(self.effect, b"opacity")
        self.animation.setDuration(300)
        self.animation.setStartValue(0)
        self.animation.setEndValue(1)
        self.animation.start()
        
        self.show()
    
    def hide_animation(self):
        self.animation = QPropertyAnimation(self.effect, b"opacity")
        self.animation.setDuration(300)
        self.animation.setStartValue(1)
        self.animation.setEndValue(0)
        self.animation.finished.connect(self.close)
        self.animation.start()
    
    @staticmethod
    def show_success(title, message):
        notification = ToastNotification(f"{title}: {message}", "success")
        return notification
    
    @staticmethod
    def show_error(title, message):
        notification = ToastNotification(f"{title}: {message}", "error")
        return notification
    
    @staticmethod
    def show_warning(title, message):
        notification = ToastNotification(f"{title}: {message}", "warning")
        return notification
    
    @staticmethod
    def show_info(title, message):
        notification = ToastNotification(f"{title}: {message}", "info")
        return notification

import pandas as pd
import xlsxwriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
import csv
import os
from datetime import datetime

class ExportManager:
    @staticmethod
    def export_to_excel(data, filename, sheet_name="Data", title="Rapor"):
        try:
            df = pd.DataFrame(data)
            
            if not filename.endswith('.xlsx'):
                filename += '.xlsx'
            
            with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
                df.to_excel(writer, sheet_name=sheet_name, index=False, startrow=3)
                
                workbook = writer.book
                worksheet = writer.sheets[sheet_name]
                
                title_format = workbook.add_format({
                    'bold': True,
                    'font_size': 16,
                    'align': 'center',
                    'valign': 'vcenter',
                    'fg_color': '#3b82f6',
                    'font_color': 'white'
                })
                
                header_format = workbook.add_format({
                    'bold': True,
                    'text_wrap': True,
                    'valign': 'top',
                    'fg_color': '#f3f4f6',
                    'font_color': '#374151',
                    'border': 1,
                    'border_color': '#d1d5db'
                })
                
                cell_format = workbook.add_format({
                    'border': 1,
                    'border_color': '#e5e7eb',
                    'align': 'left',
                    'valign': 'vcenter'
                })
                
                number_format = workbook.add_format({
                    'border': 1,
                    'border_color': '#e5e7eb',
                    'align': 'right',
                    'valign': 'vcenter',
                    'num_format': '#,##0.00'
                })
                
                worksheet.merge_range('A1:' + chr(65 + len(df.columns) - 1) + '1', title, title_format)
                
                date_str = datetime.now().strftime('%d/%m/%Y %H:%M')
                worksheet.write('A2', f'Oluşturulma Tarihi: {date_str}')
                
                for col_num, value in enumerate(df.columns.values):
                    worksheet.write(3, col_num, value, header_format)
                
                for row_num, row_data in enumerate(df.values):
                    for col_num, cell_value in enumerate(row_data):
                        if isinstance(cell_value, (int, float)):
                            worksheet.write(row_num + 4, col_num, cell_value, number_format)
                        else:
                            worksheet.write(row_num + 4, col_num, cell_value, cell_format)
                
                worksheet.autofit()
            
            return True, f"Excel dosyası başarıyla oluşturuldu: {filename}"
            
        except Exception as e:
            return False, f"Excel export hatası: {str(e)}"
    
    @staticmethod
    def export_to_pdf(data, filename, title="Rapor"):
        try:
            if not filename.endswith('.pdf'):
                filename += '.pdf'
            
            doc = SimpleDocTemplate(filename, pagesize=A4)
            elements = []
            styles = getSampleStyleSheet()
            
            title_style = styles['Title']
            title_style.alignment = 1
            title_para = Paragraph(title, title_style)
            elements.append(title_para)
            
            date_str = datetime.now().strftime('%d/%m/%Y %H:%M')
            date_para = Paragraph(f"Oluşturulma Tarihi: {date_str}", styles['Normal'])
            elements.append(date_para)
            elements.append(Paragraph("<br/><br/>", styles['Normal']))
            
            if data:
                df = pd.DataFrame(data)
                table_data = [df.columns.tolist()] + df.values.tolist()
                
                table = Table(table_data)
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 12),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 1), (-1, -1), 10),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
                ]))
                
                elements.append(table)
            
            doc.build(elements)
            return True, f"PDF dosyası başarıyla oluşturuldu: {filename}"
            
        except Exception as e:
            return False, f"PDF export hatası: {str(e)}"
    
    @staticmethod
    def export_to_csv(data, filename, title="Rapor"):
        try:
            if not filename.endswith('.csv'):
                filename += '.csv'
            
            df = pd.DataFrame(data)
            
            with open(filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
                csvfile.write(f"# {title}\n")
                csvfile.write(f"# Oluşturulma Tarihi: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
                csvfile.write("#\n")
                
                df.to_csv(csvfile, index=False)
            
            return True, f"CSV dosyası başarıyla oluşturuldu: {filename}"
            
        except Exception as e:
            return False, f"CSV export hatası: {str(e)}"
    
    @staticmethod
    def get_export_filename(base_name, format_type):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return f"{base_name}_{timestamp}.{format_type}"

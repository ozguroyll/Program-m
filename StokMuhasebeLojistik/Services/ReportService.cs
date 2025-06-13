using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Models;
using System.Text;

namespace StokMuhasebeLojistik.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> GenerateStockReportAsync(int companyId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var stockItems = await _context.StockItems
                .Where(si => si.CompanyId == companyId && si.IsActive)
                .Include(si => si.Customer)
                .ToListAsync();

            var report = new StringBuilder();
            report.AppendLine("STOK RAPORU");
            report.AppendLine($"Tarih: {DateTime.Now:dd.MM.yyyy HH:mm}");
            report.AppendLine(new string('-', 50));
            
            foreach (var item in stockItems)
            {
                report.AppendLine($"Ürün: {item.Name}");
                report.AppendLine($"Kod: {item.Code}");
                report.AppendLine($"Miktar: {item.Quantity} {item.Unit}");
                report.AppendLine($"Birim Fiyat: {item.UnitPrice:C} {item.Currency}");
                if (item.Customer != null)
                    report.AppendLine($"Müşteri: {item.Customer.Name}");
                report.AppendLine();
            }

            return Encoding.UTF8.GetBytes(report.ToString());
        }

        public async Task<byte[]> GenerateFinancialReportAsync(int companyId, DateTime startDate, DateTime endDate)
        {
            var transactions = await _context.FinancialTransactions
                .Where(ft => ft.CompanyId == companyId && 
                           ft.TransactionDate >= startDate && 
                           ft.TransactionDate <= endDate)
                .Include(ft => ft.CurrentAccount)
                .ToListAsync();

            var report = new StringBuilder();
            report.AppendLine("FİNANSAL RAPOR");
            report.AppendLine($"Dönem: {startDate:dd.MM.yyyy} - {endDate:dd.MM.yyyy}");
            report.AppendLine(new string('-', 50));

            var totalIncome = transactions.Where(t => t.Type == TransactionType.Tahsilat).Sum(t => t.Amount);
            var totalExpense = transactions.Where(t => t.Type == TransactionType.Odeme).Sum(t => t.Amount);

            report.AppendLine($"Toplam Gelir: {totalIncome:C}");
            report.AppendLine($"Toplam Gider: {totalExpense:C}");
            report.AppendLine($"Net: {totalIncome - totalExpense:C}");
            report.AppendLine();

            foreach (var transaction in transactions.OrderByDescending(t => t.TransactionDate))
            {
                report.AppendLine($"{transaction.TransactionDate:dd.MM.yyyy} - {transaction.Description}");
                report.AppendLine($"Tutar: {transaction.Amount:C} {transaction.Currency}");
                if (transaction.CurrentAccount != null)
                    report.AppendLine($"Cari: {transaction.CurrentAccount.Name}");
                report.AppendLine();
            }

            return Encoding.UTF8.GetBytes(report.ToString());
        }

        public async Task<byte[]> GenerateTripReportAsync(int companyId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Trips
                .Where(t => t.Vehicle.CompanyId == companyId);

            if (startDate.HasValue)
                query = query.Where(t => t.CreatedDate >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(t => t.CreatedDate <= endDate.Value);

            var trips = await query
                .Include(t => t.Customer)
                .Include(t => t.Vehicle)
                .Include(t => t.Driver)
                .ToListAsync();

            var report = new StringBuilder();
            report.AppendLine("SEFER RAPORU");
            if (startDate.HasValue && endDate.HasValue)
                report.AppendLine($"Dönem: {startDate:dd.MM.yyyy} - {endDate:dd.MM.yyyy}");
            report.AppendLine($"Tarih: {DateTime.Now:dd.MM.yyyy HH:mm}");
            report.AppendLine(new string('-', 50));

            foreach (var trip in trips.OrderByDescending(t => t.CreatedDate))
            {
                report.AppendLine($"Sefer No: {trip.TripNumber}");
                report.AppendLine($"Müşteri: {trip.Customer.Name}");
                report.AppendLine($"Araç: {trip.Vehicle.PlateNumber}");
                report.AppendLine($"Güzergah: {trip.Origin} → {trip.Destination}");
                report.AppendLine($"Durum: {trip.Status}");
                report.AppendLine($"Nakliye Bedeli: {trip.TransportPrice:C} {trip.Currency}");
                report.AppendLine();
            }

            return Encoding.UTF8.GetBytes(report.ToString());
        }

        public async Task<byte[]> GenerateCurrentAccountReportAsync(int companyId, int? currentAccountId = null)
        {
            var query = _context.CurrentAccounts
                .Where(ca => ca.CompanyId == companyId && ca.IsActive);

            if (currentAccountId.HasValue)
                query = query.Where(ca => ca.Id == currentAccountId.Value);

            var currentAccounts = await query.ToListAsync();

            var report = new StringBuilder();
            report.AppendLine("CARİ HESAP RAPORU");
            report.AppendLine($"Tarih: {DateTime.Now:dd.MM.yyyy HH:mm}");
            report.AppendLine(new string('-', 50));

            foreach (var account in currentAccounts)
            {
                report.AppendLine($"Cari: {account.Name}");
                report.AppendLine($"Kod: {account.Code}");
                report.AppendLine($"Tip: {account.Type}");
                report.AppendLine($"TL Bakiye: {account.BalanceTL:C}");
                report.AppendLine($"USD Bakiye: ${account.BalanceUSD:F2}");
                report.AppendLine($"EUR Bakiye: €{account.BalanceEUR:F2}");
                report.AppendLine();
            }

            return Encoding.UTF8.GetBytes(report.ToString());
        }

        public async Task<Dictionary<string, object>> GetDashboardDataAsync(int companyId)
        {
            var data = new Dictionary<string, object>();

            data["TotalStockItems"] = await _context.StockItems
                .CountAsync(si => si.CompanyId == companyId && si.IsActive);

            data["TotalVehicles"] = await _context.Vehicles
                .CountAsync(v => v.CompanyId == companyId && v.IsActive);

            data["ActiveTrips"] = await _context.Trips
                .CountAsync(t => t.Vehicle.CompanyId == companyId && 
                               t.Status != TripStatus.Tamamlandi && 
                               t.Status != TripStatus.Iptal);

            data["TotalCustomers"] = await _context.CurrentAccounts
                .CountAsync(ca => ca.CompanyId == companyId && 
                                ca.Type == CurrentAccountType.Musteri && 
                                ca.IsActive);

            var financialSummary = new Dictionary<string, decimal>();
            foreach (Currency currency in Enum.GetValues<Currency>())
            {
                var bankBalance = await _context.BankAccounts
                    .Where(ba => ba.CompanyId == companyId && ba.Currency == currency && ba.IsActive)
                    .SumAsync(ba => ba.Balance);

                var cashBalance = await _context.CashAccounts
                    .Where(ca => ca.CompanyId == companyId && ca.Currency == currency && ca.IsActive)
                    .SumAsync(ca => ca.Balance);

                financialSummary[currency.ToString()] = bankBalance + cashBalance;
            }
            data["FinancialSummary"] = financialSummary;

            return data;
        }
    }
}

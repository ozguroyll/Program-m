using StokMuhasebeLojistik.Models;
using System.Security.Cryptography;
using System.Text;

namespace StokMuhasebeLojistik.Data
{
    public static class DatabaseSeeder
    {
        public static void SeedData(ApplicationDbContext context)
        {
            if (context.Companies.Any())
                return;

            var companies = new[]
            {
                new Company { Name = "Yılmaz Transport", TaxNumber = "1234567890", Address = "Ankara", Phone = "0312 123 45 67", Email = "info@yilmaztransport.com" },
                new Company { Name = "Zad Agro", TaxNumber = "2345678901", Address = "Ankara", Phone = "0312 234 56 78", Email = "info@zadagro.com" },
                new Company { Name = "Global Agro", TaxNumber = "3456789012", Address = "Ankara", Phone = "0312 345 67 89", Email = "info@globalagro.com" },
                new Company { Name = "Yılmaz Agro", TaxNumber = "4567890123", Address = "Ankara", Phone = "0312 456 78 90", Email = "info@yilmazagro.com" }
            };

            context.Companies.AddRange(companies);
            context.SaveChanges();

            var passwordHash = HashPassword("admin123");
            var users = new[]
            {
                new User { Username = "admin", FullName = "Ahmet Yılmaz", Email = "ahmet@yilmaz.com", PasswordHash = passwordHash, Role = UserRole.Yonetici, CompanyId = companies[0].Id },
                new User { Username = "muhasebe", FullName = "Muhasebe Müdürü", Email = "muhasebe@yilmaz.com", PasswordHash = passwordHash, Role = UserRole.MuhasebeM uduru, CompanyId = companies[0].Id },
                new User { Username = "onmuhasebe", FullName = "Ön Muhasebe", Email = "onmuhasebe@yilmaz.com", PasswordHash = passwordHash, Role = UserRole.OnMuhasebe, CompanyId = companies[0].Id },
                new User { Username = "lojistik", FullName = "Lojistik Müdürü", Email = "lojistik@yilmaz.com", PasswordHash = passwordHash, Role = UserRole.LojistikMuduru, CompanyId = companies[0].Id },
                new User { Username = "disticaret", FullName = "Dış Ticaret Operasyon", Email = "disticaret@yilmaz.com", PasswordHash = passwordHash, Role = UserRole.DisTicaretLojistikOperasyon, CompanyId = companies[0].Id }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            var currentAccounts = new[]
            {
                new CurrentAccount { Name = "Khoshnaw Company", Code = "KHOSH001", Type = CurrentAccountType.Musteri, CompanyId = companies[1].Id },
                new CurrentAccount { Name = "ABC Fabrika", Code = "ABC001", Type = CurrentAccountType.Tedarikci, CompanyId = companies[0].Id },
                new CurrentAccount { Name = "XYZ Nakliyat", Code = "XYZ001", Type = CurrentAccountType.Nakliyeci, CompanyId = companies[0].Id },
                new CurrentAccount { Name = "Ziraat Bankası", Code = "ZIRAAT001", Type = CurrentAccountType.Banka, CompanyId = companies[0].Id }
            };

            context.CurrentAccounts.AddRange(currentAccounts);
            context.SaveChanges();

            var stockItems = new[]
            {
                new StockItem { Name = "Buğday", Code = "BUGDAY001", Unit = "Ton", Quantity = 1000, UnitPrice = 5000, Currency = Currency.TL, CompanyId = companies[1].Id, Type = StockType.Hububat },
                new StockItem { Name = "Mısır", Code = "MISIR001", Unit = "Ton", Quantity = 500, UnitPrice = 4500, Currency = Currency.TL, CompanyId = companies[2].Id, Type = StockType.Hububat },
                new StockItem { Name = "Soya Yağı", Code = "SOYA001", Unit = "Litre", Quantity = 2000, UnitPrice = 25, Currency = Currency.TL, CompanyId = companies[3].Id, Type = StockType.Yag }
            };

            context.StockItems.AddRange(stockItems);
            context.SaveChanges();

            var drivers = new[]
            {
                new Driver { FullName = "Mehmet Şoför", Phone = "0532 123 45 67", LicenseNumber = "E123456", MonthlySalary = 15000 },
                new Driver { FullName = "Ali Şoför", Phone = "0533 234 56 78", LicenseNumber = "E234567", MonthlySalary = 16000 }
            };

            context.Drivers.AddRange(drivers);
            context.SaveChanges();

            var vehicles = new[]
            {
                new Vehicle { PlateNumber = "06 ABC 123", Brand = "Mercedes", Model = "Actros", Year = 2020, Type = VehicleType.Cekici, Ownership = VehicleOwnership.SirketAracı, CompanyId = companies[0].Id, DriverId = drivers[0].Id },
                new Vehicle { PlateNumber = "06 DEF 456", Brand = "Volvo", Model = "FH", Year = 2019, Type = VehicleType.Cekici, Ownership = VehicleOwnership.SirketAracı, CompanyId = companies[0].Id, DriverId = drivers[1].Id }
            };

            context.Vehicles.AddRange(vehicles);
            context.SaveChanges();

            var bankAccounts = new[]
            {
                new BankAccount { BankName = "Ziraat Bankası", AccountNumber = "12345678", IBAN = "TR123456789012345678901234", Currency = Currency.TL, Balance = 100000, CompanyId = companies[0].Id },
                new BankAccount { BankName = "İş Bankası", AccountNumber = "87654321", IBAN = "TR987654321098765432109876", Currency = Currency.USD, Balance = 50000, CompanyId = companies[0].Id }
            };

            context.BankAccounts.AddRange(bankAccounts);
            context.SaveChanges();

            var cashAccounts = new[]
            {
                new CashAccount { Name = "TL Kasa", Currency = Currency.TL, Balance = 25000, CompanyId = companies[0].Id },
                new CashAccount { Name = "USD Kasa", Currency = Currency.USD, Balance = 10000, CompanyId = companies[0].Id },
                new CashAccount { Name = "EUR Kasa", Currency = Currency.EUR, Balance = 5000, CompanyId = companies[0].Id }
            };

            context.CashAccounts.AddRange(cashAccounts);
            context.SaveChanges();
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}

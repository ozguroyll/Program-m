using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Services;
using StokMuhasebeLojistik.ViewModels;
using System.Windows;
using System.IO;

namespace StokMuhasebeLojistik
{
    public partial class App : Application
    {
        private IHost? _host;

        protected override void OnStartup(StartupEventArgs e)
        {
            var builder = Host.CreateDefaultBuilder();
            
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.SetBasePath(Directory.GetCurrentDirectory());
                config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            });

            builder.ConfigureServices((context, services) =>
            {
                var connectionString = context.Configuration.GetConnectionString("DefaultConnection");
                
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(connectionString));

                services.AddScoped<IAuthenticationService, AuthenticationService>();
                services.AddScoped<ICompanyService, CompanyService>();
                services.AddScoped<ICurrentAccountService, CurrentAccountService>();
                services.AddScoped<IStockService, StockService>();
                services.AddScoped<IVehicleService, VehicleService>();
                services.AddScoped<ITripService, TripService>();
                services.AddScoped<IFinancialService, FinancialService>();
                services.AddScoped<IReportService, ReportService>();

                services.AddTransient<LoginViewModel>();
                services.AddTransient<MainViewModel>();
                services.AddTransient<StockViewModel>();
                services.AddTransient<AccountingViewModel>();
                services.AddTransient<LogisticsViewModel>();
                services.AddTransient<FinancialViewModel>();
            });

            _host = builder.Build();

            using (var scope = _host.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                context.Database.EnsureCreated();
                DatabaseSeeder.SeedData(context);
            }

            base.OnStartup(e);
        }

        protected override void OnExit(ExitEventArgs e)
        {
            _host?.Dispose();
            base.OnExit(e);
        }

        public static T GetService<T>() where T : class
        {
            return ((App)Current)._host!.Services.GetRequiredService<T>();
        }
    }
}

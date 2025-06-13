using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StokMuhasebeLojistik.Services;
using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.ViewModels
{
    public partial class MainViewModel : BaseViewModel
    {
        private readonly IAuthenticationService _authService;
        private readonly IReportService _reportService;

        [ObservableProperty]
        private User? _currentUser;

        [ObservableProperty]
        private Dictionary<string, object>? _dashboardData;

        [ObservableProperty]
        private string _selectedModule = "Dashboard";

        public MainViewModel(IAuthenticationService authService, IReportService reportService)
        {
            _authService = authService;
            _reportService = reportService;
            CurrentUser = _authService.CurrentUser;
            Title = "Stok Muhasebe Lojistik Yönetim Sistemi";
            
            LoadDashboardDataAsync();
        }

        [RelayCommand]
        private void SelectModule(string moduleName)
        {
            SelectedModule = moduleName;
        }

        [RelayCommand]
        private async Task LogoutAsync()
        {
            await _authService.LogoutAsync();
            
            var loginWindow = new Views.LoginWindow();
            loginWindow.Show();
            
            System.Windows.Application.Current.Windows
                .OfType<System.Windows.Window>()
                .FirstOrDefault(w => w.GetType().Name == "MainWindow")?.Close();
        }

        private async Task LoadDashboardDataAsync()
        {
            if (CurrentUser?.CompanyId != null)
            {
                try
                {
                    DashboardData = await _reportService.GetDashboardDataAsync(CurrentUser.CompanyId);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Dashboard yükleme hatası: {ex.Message}");
                }
            }
        }

        public bool CanAccessModule(string moduleName)
        {
            if (CurrentUser?.Role == UserRole.Yonetici)
                return true;

            return moduleName switch
            {
                "Stok" => CurrentUser?.Role == UserRole.DisTicaretLojistikOperasyon,
                "Muhasebe" => CurrentUser?.Role == UserRole.MuhasebeMuduru || CurrentUser?.Role == UserRole.OnMuhasebe,
                "Lojistik" => CurrentUser?.Role == UserRole.LojistikMuduru,
                "Finans" => CurrentUser?.Role == UserRole.MuhasebeMuduru,
                _ => true
            };
        }
    }
}

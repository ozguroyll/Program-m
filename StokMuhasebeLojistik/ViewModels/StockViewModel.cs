using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StokMuhasebeLojistik.Services;
using StokMuhasebeLojistik.Models;
using System.Collections.ObjectModel;

namespace StokMuhasebeLojistik.ViewModels
{
    public partial class StockViewModel : BaseViewModel
    {
        private readonly IStockService _stockService;
        private readonly ICurrentAccountService _currentAccountService;
        private readonly IAuthenticationService _authService;

        [ObservableProperty]
        private ObservableCollection<StockItem> _stockItems = new();

        [ObservableProperty]
        private ObservableCollection<CurrentAccount> _customers = new();

        [ObservableProperty]
        private StockItem? _selectedStockItem;

        [ObservableProperty]
        private StockItem _newStockItem = new();

        [ObservableProperty]
        private bool _isAddingStock;

        public StockViewModel(IStockService stockService, ICurrentAccountService currentAccountService, IAuthenticationService authService)
        {
            _stockService = stockService;
            _currentAccountService = currentAccountService;
            _authService = authService;
            Title = "Stok Yönetimi";
            
            LoadDataAsync();
        }

        [RelayCommand]
        private async Task LoadDataAsync()
        {
            if (_authService.CurrentUser?.CompanyId == null) return;

            IsBusy = true;
            try
            {
                var stockItems = await _stockService.GetAllStockItemsAsync(_authService.CurrentUser.CompanyId);
                StockItems.Clear();
                foreach (var item in stockItems)
                    StockItems.Add(item);

                var customers = await _currentAccountService.GetCurrentAccountsByTypeAsync(
                    _authService.CurrentUser.CompanyId, CurrentAccountType.Musteri);
                Customers.Clear();
                foreach (var customer in customers)
                    Customers.Add(customer);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Stok yükleme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void StartAddStock()
        {
            NewStockItem = new StockItem
            {
                CompanyId = _authService.CurrentUser!.CompanyId,
                CreatedDate = DateTime.Now
            };
            IsAddingStock = true;
        }

        [RelayCommand]
        private async Task SaveStockAsync()
        {
            if (string.IsNullOrWhiteSpace(NewStockItem.Name))
                return;

            IsBusy = true;
            try
            {
                var savedItem = await _stockService.CreateStockItemAsync(NewStockItem);
                StockItems.Add(savedItem);
                
                IsAddingStock = false;
                NewStockItem = new();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Stok kaydetme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void CancelAddStock()
        {
            IsAddingStock = false;
            NewStockItem = new();
        }

        [RelayCommand]
        private async Task DeleteStockAsync(StockItem stockItem)
        {
            if (stockItem == null) return;

            try
            {
                await _stockService.DeleteStockItemAsync(stockItem.Id);
                StockItems.Remove(stockItem);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Stok silme hatası: {ex.Message}");
            }
        }

        [RelayCommand]
        private async Task AddStockMovementAsync(StockItem stockItem)
        {
            if (stockItem == null || _authService.CurrentUser == null) return;

            var movement = new StockMovement
            {
                StockItemId = stockItem.Id,
                Type = StockMovementType.Giris,
                Quantity = 100,
                UnitPrice = stockItem.UnitPrice,
                Currency = stockItem.Currency,
                Description = "Manuel giriş",
                UserId = _authService.CurrentUser.Id,
                MovementDate = DateTime.Now
            };

            try
            {
                await _stockService.AddStockMovementAsync(movement);
                await LoadDataAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Stok hareketi ekleme hatası: {ex.Message}");
            }
        }
    }
}

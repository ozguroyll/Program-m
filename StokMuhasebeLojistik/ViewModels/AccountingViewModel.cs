using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StokMuhasebeLojistik.Services;
using StokMuhasebeLojistik.Models;
using System.Collections.ObjectModel;

namespace StokMuhasebeLojistik.ViewModels
{
    public partial class AccountingViewModel : BaseViewModel
    {
        private readonly ICurrentAccountService _currentAccountService;
        private readonly IFinancialService _financialService;
        private readonly IAuthenticationService _authService;

        [ObservableProperty]
        private ObservableCollection<CurrentAccount> _currentAccounts = new();

        [ObservableProperty]
        private ObservableCollection<FinancialTransaction> _transactions = new();

        [ObservableProperty]
        private CurrentAccount? _selectedCurrentAccount;

        [ObservableProperty]
        private CurrentAccount _newCurrentAccount = new();

        [ObservableProperty]
        private FinancialTransaction _newTransaction = new();

        [ObservableProperty]
        private bool _isAddingCurrentAccount;

        [ObservableProperty]
        private bool _isAddingTransaction;

        public AccountingViewModel(ICurrentAccountService currentAccountService, IFinancialService financialService, IAuthenticationService authService)
        {
            _currentAccountService = currentAccountService;
            _financialService = financialService;
            _authService = authService;
            Title = "Muhasebe Yönetimi";
            
            LoadDataAsync();
        }

        [RelayCommand]
        private async Task LoadDataAsync()
        {
            if (_authService.CurrentUser?.CompanyId == null) return;

            IsBusy = true;
            try
            {
                var currentAccounts = await _currentAccountService.GetAllCurrentAccountsAsync(_authService.CurrentUser.CompanyId);
                CurrentAccounts.Clear();
                foreach (var account in currentAccounts)
                    CurrentAccounts.Add(account);

                var transactions = await _financialService.GetAllTransactionsAsync(_authService.CurrentUser.CompanyId);
                Transactions.Clear();
                foreach (var transaction in transactions)
                    Transactions.Add(transaction);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Muhasebe yükleme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void StartAddCurrentAccount()
        {
            NewCurrentAccount = new CurrentAccount
            {
                CompanyId = _authService.CurrentUser!.CompanyId,
                CreatedDate = DateTime.Now
            };
            IsAddingCurrentAccount = true;
        }

        [RelayCommand]
        private async Task SaveCurrentAccountAsync()
        {
            if (string.IsNullOrWhiteSpace(NewCurrentAccount.Name))
                return;

            IsBusy = true;
            try
            {
                var savedAccount = await _currentAccountService.CreateCurrentAccountAsync(NewCurrentAccount);
                CurrentAccounts.Add(savedAccount);
                
                IsAddingCurrentAccount = false;
                NewCurrentAccount = new();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Cari hesap kaydetme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void CancelAddCurrentAccount()
        {
            IsAddingCurrentAccount = false;
            NewCurrentAccount = new();
        }

        [RelayCommand]
        private void StartAddTransaction()
        {
            NewTransaction = new FinancialTransaction
            {
                CompanyId = _authService.CurrentUser!.CompanyId,
                UserId = _authService.CurrentUser.Id,
                TransactionDate = DateTime.Now,
                CreatedDate = DateTime.Now
            };
            IsAddingTransaction = true;
        }

        [RelayCommand]
        private async Task SaveTransactionAsync()
        {
            if (NewTransaction.Amount <= 0)
                return;

            IsBusy = true;
            try
            {
                var savedTransaction = await _financialService.CreateTransactionAsync(NewTransaction);
                Transactions.Insert(0, savedTransaction);
                
                IsAddingTransaction = false;
                NewTransaction = new();
                
                await LoadDataAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"İşlem kaydetme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void CancelAddTransaction()
        {
            IsAddingTransaction = false;
            NewTransaction = new();
        }
    }
}

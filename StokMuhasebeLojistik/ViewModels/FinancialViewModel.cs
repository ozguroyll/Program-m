using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StokMuhasebeLojistik.Services;
using StokMuhasebeLojistik.Models;
using System.Collections.ObjectModel;

namespace StokMuhasebeLojistik.ViewModels
{
    public partial class FinancialViewModel : BaseViewModel
    {
        private readonly IFinancialService _financialService;
        private readonly ICurrentAccountService _currentAccountService;
        private readonly IAuthenticationService _authService;

        [ObservableProperty]
        private ObservableCollection<BankAccount> _bankAccounts = new();

        [ObservableProperty]
        private ObservableCollection<CashAccount> _cashAccounts = new();

        [ObservableProperty]
        private ObservableCollection<FinancialTransaction> _recentTransactions = new();

        [ObservableProperty]
        private Dictionary<Currency, decimal>? _financialSummary;

        [ObservableProperty]
        private BankAccount _newBankAccount = new();

        [ObservableProperty]
        private CashAccount _newCashAccount = new();

        [ObservableProperty]
        private bool _isAddingBankAccount;

        [ObservableProperty]
        private bool _isAddingCashAccount;

        public FinancialViewModel(IFinancialService financialService, ICurrentAccountService currentAccountService, IAuthenticationService authService)
        {
            _financialService = financialService;
            _currentAccountService = currentAccountService;
            _authService = authService;
            Title = "Finansal Yönetim Paneli";
            
            LoadDataAsync();
        }

        [RelayCommand]
        private async Task LoadDataAsync()
        {
            if (_authService.CurrentUser?.CompanyId == null) return;

            IsBusy = true;
            try
            {
                var bankAccounts = await _financialService.GetBankAccountsAsync(_authService.CurrentUser.CompanyId);
                BankAccounts.Clear();
                foreach (var account in bankAccounts)
                    BankAccounts.Add(account);

                var cashAccounts = await _financialService.GetCashAccountsAsync(_authService.CurrentUser.CompanyId);
                CashAccounts.Clear();
                foreach (var account in cashAccounts)
                    CashAccounts.Add(account);

                var transactions = await _financialService.GetAllTransactionsAsync(_authService.CurrentUser.CompanyId);
                RecentTransactions.Clear();
                foreach (var transaction in transactions.Take(10))
                    RecentTransactions.Add(transaction);

                FinancialSummary = await _financialService.GetFinancialSummaryAsync(_authService.CurrentUser.CompanyId);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Finansal veri yükleme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void StartAddBankAccount()
        {
            NewBankAccount = new BankAccount
            {
                CompanyId = _authService.CurrentUser!.CompanyId,
                CreatedDate = DateTime.Now
            };
            IsAddingBankAccount = true;
        }

        [RelayCommand]
        private async Task SaveBankAccountAsync()
        {
            if (string.IsNullOrWhiteSpace(NewBankAccount.BankName))
                return;

            IsBusy = true;
            try
            {
                var savedAccount = await _financialService.CreateBankAccountAsync(NewBankAccount);
                BankAccounts.Add(savedAccount);
                
                IsAddingBankAccount = false;
                NewBankAccount = new();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Banka hesabı kaydetme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void CancelAddBankAccount()
        {
            IsAddingBankAccount = false;
            NewBankAccount = new();
        }

        [RelayCommand]
        private void StartAddCashAccount()
        {
            NewCashAccount = new CashAccount
            {
                CompanyId = _authService.CurrentUser!.CompanyId,
                CreatedDate = DateTime.Now
            };
            IsAddingCashAccount = true;
        }

        [RelayCommand]
        private async Task SaveCashAccountAsync()
        {
            if (string.IsNullOrWhiteSpace(NewCashAccount.Name))
                return;

            IsBusy = true;
            try
            {
                var savedAccount = await _financialService.CreateCashAccountAsync(NewCashAccount);
                CashAccounts.Add(savedAccount);
                
                IsAddingCashAccount = false;
                NewCashAccount = new();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Kasa hesabı kaydetme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void CancelAddCashAccount()
        {
            IsAddingCashAccount = false;
            NewCashAccount = new();
        }
    }
}

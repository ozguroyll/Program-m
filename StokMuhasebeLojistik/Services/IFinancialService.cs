using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public interface IFinancialService
    {
        Task<IEnumerable<FinancialTransaction>> GetAllTransactionsAsync(int companyId);
        Task<FinancialTransaction> CreateTransactionAsync(FinancialTransaction transaction);
        Task<FinancialTransaction> UpdateTransactionAsync(FinancialTransaction transaction);
        Task<IEnumerable<BankAccount>> GetBankAccountsAsync(int companyId);
        Task<BankAccount> CreateBankAccountAsync(BankAccount bankAccount);
        Task<IEnumerable<CashAccount>> GetCashAccountsAsync(int companyId);
        Task<CashAccount> CreateCashAccountAsync(CashAccount cashAccount);
        Task<decimal> GetTotalBalanceAsync(int companyId, Currency currency);
        Task<Dictionary<Currency, decimal>> GetFinancialSummaryAsync(int companyId);
    }
}

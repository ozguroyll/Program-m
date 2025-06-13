using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public class FinancialService : IFinancialService
    {
        private readonly ApplicationDbContext _context;

        public FinancialService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FinancialTransaction>> GetAllTransactionsAsync(int companyId)
        {
            return await _context.FinancialTransactions
                .Where(ft => ft.CompanyId == companyId)
                .Include(ft => ft.CurrentAccount)
                .Include(ft => ft.User)
                .OrderByDescending(ft => ft.TransactionDate)
                .ToListAsync();
        }

        public async Task<FinancialTransaction> CreateTransactionAsync(FinancialTransaction transaction)
        {
            transaction.TransactionNumber = await GenerateTransactionNumberAsync();
            _context.FinancialTransactions.Add(transaction);
            
            if (transaction.CurrentAccountId.HasValue)
            {
                await UpdateCurrentAccountBalanceAsync(transaction);
            }
            
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<FinancialTransaction> UpdateTransactionAsync(FinancialTransaction transaction)
        {
            _context.FinancialTransactions.Update(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<IEnumerable<BankAccount>> GetBankAccountsAsync(int companyId)
        {
            return await _context.BankAccounts
                .Where(ba => ba.CompanyId == companyId && ba.IsActive)
                .ToListAsync();
        }

        public async Task<BankAccount> CreateBankAccountAsync(BankAccount bankAccount)
        {
            _context.BankAccounts.Add(bankAccount);
            await _context.SaveChangesAsync();
            return bankAccount;
        }

        public async Task<IEnumerable<CashAccount>> GetCashAccountsAsync(int companyId)
        {
            return await _context.CashAccounts
                .Where(ca => ca.CompanyId == companyId && ca.IsActive)
                .ToListAsync();
        }

        public async Task<CashAccount> CreateCashAccountAsync(CashAccount cashAccount)
        {
            _context.CashAccounts.Add(cashAccount);
            await _context.SaveChangesAsync();
            return cashAccount;
        }

        public async Task<decimal> GetTotalBalanceAsync(int companyId, Currency currency)
        {
            var bankBalance = await _context.BankAccounts
                .Where(ba => ba.CompanyId == companyId && ba.Currency == currency && ba.IsActive)
                .SumAsync(ba => ba.Balance);

            var cashBalance = await _context.CashAccounts
                .Where(ca => ca.CompanyId == companyId && ca.Currency == currency && ca.IsActive)
                .SumAsync(ca => ca.Balance);

            return bankBalance + cashBalance;
        }

        public async Task<Dictionary<Currency, decimal>> GetFinancialSummaryAsync(int companyId)
        {
            var summary = new Dictionary<Currency, decimal>();
            
            foreach (Currency currency in Enum.GetValues<Currency>())
            {
                summary[currency] = await GetTotalBalanceAsync(companyId, currency);
            }
            
            return summary;
        }

        private async Task<string> GenerateTransactionNumberAsync()
        {
            var today = DateTime.Today;
            var count = await _context.FinancialTransactions
                .Where(ft => ft.CreatedDate.Date == today)
                .CountAsync();
            
            return $"FT{today:yyyyMMdd}{(count + 1):D4}";
        }

        private async Task UpdateCurrentAccountBalanceAsync(FinancialTransaction transaction)
        {
            var currentAccount = await _context.CurrentAccounts.FindAsync(transaction.CurrentAccountId);
            if (currentAccount == null) return;

            var amount = transaction.Amount;
            if (transaction.Type == TransactionType.Odeme)
                amount = -amount;

            switch (transaction.Currency)
            {
                case Currency.TL:
                    currentAccount.BalanceTL += amount;
                    break;
                case Currency.USD:
                    currentAccount.BalanceUSD += amount;
                    break;
                case Currency.EUR:
                    currentAccount.BalanceEUR += amount;
                    break;
            }
        }
    }
}

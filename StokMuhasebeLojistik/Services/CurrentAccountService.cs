using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public class CurrentAccountService : ICurrentAccountService
    {
        private readonly ApplicationDbContext _context;

        public CurrentAccountService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CurrentAccount>> GetAllCurrentAccountsAsync(int companyId)
        {
            return await _context.CurrentAccounts
                .Where(ca => ca.CompanyId == companyId && ca.IsActive)
                .Include(ca => ca.Company)
                .ToListAsync();
        }

        public async Task<CurrentAccount?> GetCurrentAccountByIdAsync(int id)
        {
            return await _context.CurrentAccounts
                .Include(ca => ca.Company)
                .FirstOrDefaultAsync(ca => ca.Id == id);
        }

        public async Task<CurrentAccount> CreateCurrentAccountAsync(CurrentAccount currentAccount)
        {
            _context.CurrentAccounts.Add(currentAccount);
            await _context.SaveChangesAsync();
            return currentAccount;
        }

        public async Task<CurrentAccount> UpdateCurrentAccountAsync(CurrentAccount currentAccount)
        {
            _context.CurrentAccounts.Update(currentAccount);
            await _context.SaveChangesAsync();
            return currentAccount;
        }

        public async Task DeleteCurrentAccountAsync(int id)
        {
            var currentAccount = await _context.CurrentAccounts.FindAsync(id);
            if (currentAccount != null)
            {
                currentAccount.IsActive = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<CurrentAccount>> GetCurrentAccountsByTypeAsync(int companyId, CurrentAccountType type)
        {
            return await _context.CurrentAccounts
                .Where(ca => ca.CompanyId == companyId && ca.Type == type && ca.IsActive)
                .ToListAsync();
        }

        public async Task<decimal> GetCurrentAccountBalanceAsync(int currentAccountId, Currency currency)
        {
            var currentAccount = await _context.CurrentAccounts.FindAsync(currentAccountId);
            if (currentAccount == null) return 0;

            return currency switch
            {
                Currency.TL => currentAccount.BalanceTL,
                Currency.USD => currentAccount.BalanceUSD,
                Currency.EUR => currentAccount.BalanceEUR,
                _ => 0
            };
        }
    }
}

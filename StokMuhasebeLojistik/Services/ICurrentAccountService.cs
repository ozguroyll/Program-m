using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public interface ICurrentAccountService
    {
        Task<IEnumerable<CurrentAccount>> GetAllCurrentAccountsAsync(int companyId);
        Task<CurrentAccount?> GetCurrentAccountByIdAsync(int id);
        Task<CurrentAccount> CreateCurrentAccountAsync(CurrentAccount currentAccount);
        Task<CurrentAccount> UpdateCurrentAccountAsync(CurrentAccount currentAccount);
        Task DeleteCurrentAccountAsync(int id);
        Task<IEnumerable<CurrentAccount>> GetCurrentAccountsByTypeAsync(int companyId, CurrentAccountType type);
        Task<decimal> GetCurrentAccountBalanceAsync(int currentAccountId, Currency currency);
    }
}

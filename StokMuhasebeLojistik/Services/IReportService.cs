using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public interface IReportService
    {
        Task<byte[]> GenerateStockReportAsync(int companyId, DateTime? startDate = null, DateTime? endDate = null);
        Task<byte[]> GenerateFinancialReportAsync(int companyId, DateTime startDate, DateTime endDate);
        Task<byte[]> GenerateTripReportAsync(int companyId, DateTime? startDate = null, DateTime? endDate = null);
        Task<byte[]> GenerateCurrentAccountReportAsync(int companyId, int? currentAccountId = null);
        Task<Dictionary<string, object>> GetDashboardDataAsync(int companyId);
    }
}

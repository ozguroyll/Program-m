using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public interface IStockService
    {
        Task<IEnumerable<StockItem>> GetAllStockItemsAsync(int companyId);
        Task<StockItem?> GetStockItemByIdAsync(int id);
        Task<StockItem> CreateStockItemAsync(StockItem stockItem);
        Task<StockItem> UpdateStockItemAsync(StockItem stockItem);
        Task DeleteStockItemAsync(int id);
        Task<StockMovement> AddStockMovementAsync(StockMovement stockMovement);
        Task<IEnumerable<StockMovement>> GetStockMovementsAsync(int stockItemId);
        Task<IEnumerable<StockItem>> GetStockItemsByCustomerAsync(int customerId);
    }
}

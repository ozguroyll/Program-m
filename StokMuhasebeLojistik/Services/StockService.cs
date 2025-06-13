using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public class StockService : IStockService
    {
        private readonly ApplicationDbContext _context;

        public StockService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StockItem>> GetAllStockItemsAsync(int companyId)
        {
            return await _context.StockItems
                .Where(si => si.CompanyId == companyId && si.IsActive)
                .Include(si => si.Company)
                .Include(si => si.Customer)
                .ToListAsync();
        }

        public async Task<StockItem?> GetStockItemByIdAsync(int id)
        {
            return await _context.StockItems
                .Include(si => si.Company)
                .Include(si => si.Customer)
                .Include(si => si.StockMovements)
                .FirstOrDefaultAsync(si => si.Id == id);
        }

        public async Task<StockItem> CreateStockItemAsync(StockItem stockItem)
        {
            _context.StockItems.Add(stockItem);
            await _context.SaveChangesAsync();
            return stockItem;
        }

        public async Task<StockItem> UpdateStockItemAsync(StockItem stockItem)
        {
            _context.StockItems.Update(stockItem);
            await _context.SaveChangesAsync();
            return stockItem;
        }

        public async Task DeleteStockItemAsync(int id)
        {
            var stockItem = await _context.StockItems.FindAsync(id);
            if (stockItem != null)
            {
                stockItem.IsActive = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<StockMovement> AddStockMovementAsync(StockMovement stockMovement)
        {
            _context.StockMovements.Add(stockMovement);
            
            var stockItem = await _context.StockItems.FindAsync(stockMovement.StockItemId);
            if (stockItem != null)
            {
                if (stockMovement.Type == StockMovementType.Giris)
                    stockItem.Quantity += stockMovement.Quantity;
                else if (stockMovement.Type == StockMovementType.Cikis)
                    stockItem.Quantity -= stockMovement.Quantity;
            }
            
            await _context.SaveChangesAsync();
            return stockMovement;
        }

        public async Task<IEnumerable<StockMovement>> GetStockMovementsAsync(int stockItemId)
        {
            return await _context.StockMovements
                .Where(sm => sm.StockItemId == stockItemId)
                .Include(sm => sm.User)
                .OrderByDescending(sm => sm.MovementDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<StockItem>> GetStockItemsByCustomerAsync(int customerId)
        {
            return await _context.StockItems
                .Where(si => si.CustomerId == customerId && si.IsActive)
                .Include(si => si.Company)
                .ToListAsync();
        }
    }
}

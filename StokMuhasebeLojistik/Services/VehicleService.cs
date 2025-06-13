using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly ApplicationDbContext _context;

        public VehicleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vehicle>> GetAllVehiclesAsync(int companyId)
        {
            return await _context.Vehicles
                .Where(v => v.CompanyId == companyId && v.IsActive)
                .Include(v => v.Company)
                .Include(v => v.Driver)
                .ToListAsync();
        }

        public async Task<Vehicle?> GetVehicleByIdAsync(int id)
        {
            return await _context.Vehicles
                .Include(v => v.Company)
                .Include(v => v.Driver)
                .Include(v => v.VehicleExpenses)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vehicle> CreateVehicleAsync(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task<Vehicle> UpdateVehicleAsync(Vehicle vehicle)
        {
            _context.Vehicles.Update(vehicle);
            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task DeleteVehicleAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle != null)
            {
                vehicle.IsActive = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Driver>> GetAllDriversAsync()
        {
            return await _context.Drivers
                .Where(d => d.IsActive)
                .ToListAsync();
        }

        public async Task<Driver> CreateDriverAsync(Driver driver)
        {
            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
            return driver;
        }

        public async Task<Driver> UpdateDriverAsync(Driver driver)
        {
            _context.Drivers.Update(driver);
            await _context.SaveChangesAsync();
            return driver;
        }

        public async Task<VehicleExpense> AddVehicleExpenseAsync(VehicleExpense expense)
        {
            _context.VehicleExpenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<IEnumerable<VehicleExpense>> GetVehicleExpensesAsync(int vehicleId)
        {
            return await _context.VehicleExpenses
                .Where(ve => ve.VehicleId == vehicleId)
                .Include(ve => ve.User)
                .OrderByDescending(ve => ve.ExpenseDate)
                .ToListAsync();
        }
    }
}

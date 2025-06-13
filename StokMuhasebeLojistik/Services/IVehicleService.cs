using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public interface IVehicleService
    {
        Task<IEnumerable<Vehicle>> GetAllVehiclesAsync(int companyId);
        Task<Vehicle?> GetVehicleByIdAsync(int id);
        Task<Vehicle> CreateVehicleAsync(Vehicle vehicle);
        Task<Vehicle> UpdateVehicleAsync(Vehicle vehicle);
        Task DeleteVehicleAsync(int id);
        Task<IEnumerable<Driver>> GetAllDriversAsync();
        Task<Driver> CreateDriverAsync(Driver driver);
        Task<Driver> UpdateDriverAsync(Driver driver);
        Task<VehicleExpense> AddVehicleExpenseAsync(VehicleExpense expense);
        Task<IEnumerable<VehicleExpense>> GetVehicleExpensesAsync(int vehicleId);
    }
}

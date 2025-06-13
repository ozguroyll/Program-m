using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public interface ITripService
    {
        Task<IEnumerable<Trip>> GetAllTripsAsync(int companyId);
        Task<Trip?> GetTripByIdAsync(int id);
        Task<Trip> CreateTripAsync(Trip trip);
        Task<Trip> UpdateTripAsync(Trip trip);
        Task DeleteTripAsync(int id);
        Task<Trip> UpdateTripStatusAsync(int tripId, TripStatus status);
        Task<TripExpense> AddTripExpenseAsync(TripExpense expense);
        Task<IEnumerable<TripExpense>> GetTripExpensesAsync(int tripId);
        Task<string> GenerateTrackingUrlAsync(int tripId);
        Task<IEnumerable<Trip>> GetTripsByCustomerAsync(int customerId);
    }
}

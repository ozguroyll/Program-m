using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public class TripService : ITripService
    {
        private readonly ApplicationDbContext _context;

        public TripService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Trip>> GetAllTripsAsync(int companyId)
        {
            return await _context.Trips
                .Where(t => t.Vehicle.CompanyId == companyId)
                .Include(t => t.Customer)
                .Include(t => t.Vehicle)
                .Include(t => t.Driver)
                .Include(t => t.User)
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
        }

        public async Task<Trip?> GetTripByIdAsync(int id)
        {
            return await _context.Trips
                .Include(t => t.Customer)
                .Include(t => t.Vehicle)
                .Include(t => t.Driver)
                .Include(t => t.User)
                .Include(t => t.TripExpenses)
                .Include(t => t.TripDocuments)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Trip> CreateTripAsync(Trip trip)
        {
            trip.TripNumber = await GenerateTripNumberAsync();
            trip.TrackingUrl = await GenerateTrackingUrlAsync(0);
            
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            
            trip.TrackingUrl = await GenerateTrackingUrlAsync(trip.Id);
            await _context.SaveChangesAsync();
            
            return trip;
        }

        public async Task<Trip> UpdateTripAsync(Trip trip)
        {
            _context.Trips.Update(trip);
            await _context.SaveChangesAsync();
            return trip;
        }

        public async Task DeleteTripAsync(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip != null)
            {
                trip.Status = TripStatus.Iptal;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Trip> UpdateTripStatusAsync(int tripId, TripStatus status)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip != null)
            {
                trip.Status = status;
                
                if (status == TripStatus.Yuklendi && trip.ActualStartDate == null)
                    trip.ActualStartDate = DateTime.Now;
                else if (status == TripStatus.TeslimEdildi && trip.ActualArrivalDate == null)
                    trip.ActualArrivalDate = DateTime.Now;
                
                await _context.SaveChangesAsync();
            }
            return trip!;
        }

        public async Task<TripExpense> AddTripExpenseAsync(TripExpense expense)
        {
            _context.TripExpenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<IEnumerable<TripExpense>> GetTripExpensesAsync(int tripId)
        {
            return await _context.TripExpenses
                .Where(te => te.TripId == tripId)
                .Include(te => te.User)
                .OrderByDescending(te => te.ExpenseDate)
                .ToListAsync();
        }

        public async Task<string> GenerateTrackingUrlAsync(int tripId)
        {
            return $"https://tracking.yilmaztransport.com/trip/{tripId}";
        }

        public async Task<IEnumerable<Trip>> GetTripsByCustomerAsync(int customerId)
        {
            return await _context.Trips
                .Where(t => t.CustomerId == customerId)
                .Include(t => t.Vehicle)
                .Include(t => t.Driver)
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
        }

        private async Task<string> GenerateTripNumberAsync()
        {
            var today = DateTime.Today;
            var count = await _context.Trips
                .Where(t => t.CreatedDate.Date == today)
                .CountAsync();
            
            return $"SF{today:yyyyMMdd}{(count + 1):D3}";
        }
    }
}

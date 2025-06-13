using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StokMuhasebeLojistik.Services;
using StokMuhasebeLojistik.Models;
using System.Collections.ObjectModel;

namespace StokMuhasebeLojistik.ViewModels
{
    public partial class LogisticsViewModel : BaseViewModel
    {
        private readonly IVehicleService _vehicleService;
        private readonly ITripService _tripService;
        private readonly ICurrentAccountService _currentAccountService;
        private readonly IAuthenticationService _authService;

        [ObservableProperty]
        private ObservableCollection<Vehicle> _vehicles = new();

        [ObservableProperty]
        private ObservableCollection<Trip> _trips = new();

        [ObservableProperty]
        private ObservableCollection<Driver> _drivers = new();

        [ObservableProperty]
        private ObservableCollection<CurrentAccount> _customers = new();

        [ObservableProperty]
        private Vehicle? _selectedVehicle;

        [ObservableProperty]
        private Trip? _selectedTrip;

        [ObservableProperty]
        private Vehicle _newVehicle = new();

        [ObservableProperty]
        private Trip _newTrip = new();

        [ObservableProperty]
        private bool _isAddingVehicle;

        [ObservableProperty]
        private bool _isAddingTrip;

        public LogisticsViewModel(IVehicleService vehicleService, ITripService tripService, ICurrentAccountService currentAccountService, IAuthenticationService authService)
        {
            _vehicleService = vehicleService;
            _tripService = tripService;
            _currentAccountService = currentAccountService;
            _authService = authService;
            Title = "Lojistik Yönetimi";
            
            LoadDataAsync();
        }

        [RelayCommand]
        private async Task LoadDataAsync()
        {
            if (_authService.CurrentUser?.CompanyId == null) return;

            IsBusy = true;
            try
            {
                var vehicles = await _vehicleService.GetAllVehiclesAsync(_authService.CurrentUser.CompanyId);
                Vehicles.Clear();
                foreach (var vehicle in vehicles)
                    Vehicles.Add(vehicle);

                var trips = await _tripService.GetAllTripsAsync(_authService.CurrentUser.CompanyId);
                Trips.Clear();
                foreach (var trip in trips)
                    Trips.Add(trip);

                var drivers = await _vehicleService.GetAllDriversAsync();
                Drivers.Clear();
                foreach (var driver in drivers)
                    Drivers.Add(driver);

                var customers = await _currentAccountService.GetCurrentAccountsByTypeAsync(
                    _authService.CurrentUser.CompanyId, CurrentAccountType.Musteri);
                Customers.Clear();
                foreach (var customer in customers)
                    Customers.Add(customer);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Lojistik yükleme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void StartAddVehicle()
        {
            NewVehicle = new Vehicle
            {
                CompanyId = _authService.CurrentUser!.CompanyId,
                CreatedDate = DateTime.Now
            };
            IsAddingVehicle = true;
        }

        [RelayCommand]
        private async Task SaveVehicleAsync()
        {
            if (string.IsNullOrWhiteSpace(NewVehicle.PlateNumber))
                return;

            IsBusy = true;
            try
            {
                var savedVehicle = await _vehicleService.CreateVehicleAsync(NewVehicle);
                Vehicles.Add(savedVehicle);
                
                IsAddingVehicle = false;
                NewVehicle = new();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Araç kaydetme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void CancelAddVehicle()
        {
            IsAddingVehicle = false;
            NewVehicle = new();
        }

        [RelayCommand]
        private void StartAddTrip()
        {
            NewTrip = new Trip
            {
                UserId = _authService.CurrentUser!.Id,
                PlannedStartDate = DateTime.Now.AddDays(1),
                CreatedDate = DateTime.Now
            };
            IsAddingTrip = true;
        }

        [RelayCommand]
        private async Task SaveTripAsync()
        {
            if (NewTrip.CustomerId == 0 || NewTrip.VehicleId == 0)
                return;

            IsBusy = true;
            try
            {
                var savedTrip = await _tripService.CreateTripAsync(NewTrip);
                Trips.Insert(0, savedTrip);
                
                IsAddingTrip = false;
                NewTrip = new();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Sefer kaydetme hatası: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void CancelAddTrip()
        {
            IsAddingTrip = false;
            NewTrip = new();
        }

        [RelayCommand]
        private async Task UpdateTripStatusAsync(Trip trip)
        {
            if (trip == null) return;

            try
            {
                var nextStatus = GetNextStatus(trip.Status);
                await _tripService.UpdateTripStatusAsync(trip.Id, nextStatus);
                trip.Status = nextStatus;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Sefer durumu güncelleme hatası: {ex.Message}");
            }
        }

        private TripStatus GetNextStatus(TripStatus currentStatus)
        {
            return currentStatus switch
            {
                TripStatus.Planlandi => TripStatus.YuklemeBekliyor,
                TripStatus.YuklemeBekliyor => TripStatus.Yuklendi,
                TripStatus.Yuklendi => TripStatus.Yolda,
                TripStatus.Yolda => TripStatus.Sinirda,
                TripStatus.Sinirda => TripStatus.TeslimEdildi,
                TripStatus.TeslimEdildi => TripStatus.Tamamlandi,
                _ => currentStatus
            };
        }
    }
}

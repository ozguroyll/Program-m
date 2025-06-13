using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StokMuhasebeLojistik.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string PlateNumber { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Brand { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Model { get; set; } = string.Empty;
        
        public int Year { get; set; }
        
        public VehicleType Type { get; set; }
        
        public VehicleOwnership Ownership { get; set; }
        
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; } = null!;
        
        public int? DriverId { get; set; }
        public virtual Driver? Driver { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? MonthlyFixedCost { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? InsuranceCost { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
        public virtual ICollection<VehicleExpense> VehicleExpenses { get; set; } = new List<VehicleExpense>();
    }

    public class Driver
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string LicenseNumber { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal MonthlySalary { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? TripBonus { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }

    public class VehicleExpense
    {
        public int Id { get; set; }
        
        public int VehicleId { get; set; }
        public virtual Vehicle Vehicle { get; set; } = null!;
        
        public VehicleExpenseType Type { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        public Currency Currency { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        public DateTime ExpenseDate { get; set; } = DateTime.Now;
        
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }

    public enum VehicleType
    {
        Cekici = 1,
        Romork = 2,
        Kamyon = 3,
        Diger = 4
    }

    public enum VehicleOwnership
    {
        SirketAracı = 1,
        KiralikArac = 2,
        OrtakArac = 3
    }

    public enum VehicleExpenseType
    {
        Yakit = 1,
        Bakim = 2,
        Sigorta = 3,
        Vergi = 4,
        Onarim = 5,
        Diger = 6
    }
}

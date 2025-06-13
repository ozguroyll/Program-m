using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StokMuhasebeLojistik.Models
{
    public class Trip
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string TripNumber { get; set; } = string.Empty;
        
        public int CustomerId { get; set; }
        public virtual CurrentAccount Customer { get; set; } = null!;
        
        public int VehicleId { get; set; }
        public virtual Vehicle Vehicle { get; set; } = null!;
        
        public int? DriverId { get; set; }
        public virtual Driver? Driver { get; set; }
        
        [MaxLength(100)]
        public string Origin { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string Destination { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string ProductName { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,3)")]
        public decimal Quantity { get; set; }
        
        [MaxLength(20)]
        public string Unit { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TransportPrice { get; set; }
        
        public Currency Currency { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Commission { get; set; }
        
        public TripStatus Status { get; set; } = TripStatus.Planlandi;
        
        public DateTime PlannedStartDate { get; set; }
        
        public DateTime? ActualStartDate { get; set; }
        
        public DateTime? EstimatedArrivalDate { get; set; }
        
        public DateTime? ActualArrivalDate { get; set; }
        
        [MaxLength(500)]
        public string? Notes { get; set; }
        
        [MaxLength(100)]
        public string? TrackingUrl { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
        
        public virtual ICollection<TripExpense> TripExpenses { get; set; } = new List<TripExpense>();
        public virtual ICollection<TripDocument> TripDocuments { get; set; } = new List<TripDocument>();
    }

    public class TripExpense
    {
        public int Id { get; set; }
        
        public int TripId { get; set; }
        public virtual Trip Trip { get; set; } = null!;
        
        public TripExpenseType Type { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        public Currency Currency { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        public DateTime ExpenseDate { get; set; } = DateTime.Now;
        
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }

    public class TripDocument
    {
        public int Id { get; set; }
        
        public int TripId { get; set; }
        public virtual Trip Trip { get; set; } = null!;
        
        [Required]
        [MaxLength(100)]
        public string DocumentName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;
        
        public TripDocumentType Type { get; set; }
        
        public DateTime UploadDate { get; set; } = DateTime.Now;
        
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }

    public enum TripStatus
    {
        Planlandi = 1,
        YuklemeBekliyor = 2,
        Yuklendi = 3,
        Yolda = 4,
        Sinirda = 5,
        TeslimEdildi = 6,
        Tamamlandi = 7,
        Iptal = 8
    }

    public enum TripExpenseType
    {
        Yakit = 1,
        Gumruk = 2,
        Harcirah = 3,
        Bekleme = 4,
        Diger = 5
    }

    public enum TripDocumentType
    {
        CMR = 1,
        Fatura = 2,
        GumrukBelgesi = 3,
        TeslimBelgesi = 4,
        Diger = 5
    }
}

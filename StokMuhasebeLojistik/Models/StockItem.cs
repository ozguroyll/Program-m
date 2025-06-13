using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StokMuhasebeLojistik.Models
{
    public class StockItem
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Code { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Unit { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,3)")]
        public decimal Quantity { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        public Currency Currency { get; set; } = Currency.TL;
        
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; } = null!;
        
        public int? CustomerId { get; set; }
        public virtual CurrentAccount? Customer { get; set; }
        
        [MaxLength(100)]
        public string? WarehouseLocation { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        public StockType Type { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }

    public class StockMovement
    {
        public int Id { get; set; }
        
        public int StockItemId { get; set; }
        public virtual StockItem StockItem { get; set; } = null!;
        
        public StockMovementType Type { get; set; }
        
        [Column(TypeName = "decimal(18,3)")]
        public decimal Quantity { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        public Currency Currency { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(50)]
        public string? DocumentNumber { get; set; }
        
        public DateTime MovementDate { get; set; } = DateTime.Now;
        
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }

    public enum StockType
    {
        Hububat = 1,
        Yag = 2,
        Diger = 3
    }

    public enum StockMovementType
    {
        Giris = 1,
        Cikis = 2,
        Transfer = 3,
        Sayim = 4
    }

    public enum Currency
    {
        TL = 1,
        USD = 2,
        EUR = 3
    }
}

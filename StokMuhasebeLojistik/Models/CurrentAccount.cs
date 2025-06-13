using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StokMuhasebeLojistik.Models
{
    public class CurrentAccount
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Code { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string TaxNumber { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        
        public CurrentAccountType Type { get; set; }
        
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; } = null!;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal BalanceTL { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal BalanceUSD { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal BalanceEUR { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public virtual ICollection<FinancialTransaction> FinancialTransactions { get; set; } = new List<FinancialTransaction>();
        public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }

    public enum CurrentAccountType
    {
        Musteri = 1,
        Tedarikci = 2,
        Nakliyeci = 3,
        Banka = 4,
        Diger = 5
    }
}

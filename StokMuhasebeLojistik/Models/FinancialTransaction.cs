using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StokMuhasebeLojistik.Models
{
    public class FinancialTransaction
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string TransactionNumber { get; set; } = string.Empty;
        
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; } = null!;
        
        public int? CurrentAccountId { get; set; }
        public virtual CurrentAccount? CurrentAccount { get; set; }
        
        public TransactionType Type { get; set; }
        
        public PaymentMethod PaymentMethod { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        public Currency Currency { get; set; }
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal? ExchangeRate { get; set; }
        
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string? DocumentNumber { get; set; }
        
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        
        public DateTime? DueDate { get; set; }
        
        public TransactionStatus Status { get; set; } = TransactionStatus.Beklemede;
        
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }

    public class BankAccount
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string BankName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string AccountNumber { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string IBAN { get; set; } = string.Empty;
        
        public Currency Currency { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }
        
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; } = null!;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }

    public class CashAccount
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        
        public Currency Currency { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }
        
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; } = null!;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }

    public enum TransactionType
    {
        Tahsilat = 1,
        Odeme = 2,
        Virman = 3,
        KurFarki = 4
    }

    public enum PaymentMethod
    {
        Nakit = 1,
        Banka = 2,
        Cek = 3,
        Senet = 4,
        KrediKarti = 5,
        Swift = 6,
        DAP = 7,
        MalMukabili = 8,
        Virman = 9,
        TeminatMektubu = 10
    }

    public enum TransactionStatus
    {
        Beklemede = 1,
        Onaylandi = 2,
        Tamamlandi = 3,
        Iptal = 4
    }
}

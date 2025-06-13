using System.ComponentModel.DataAnnotations;

namespace StokMuhasebeLojistik.Models
{
    public class Company
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string TaxNumber { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<CurrentAccount> CurrentAccounts { get; set; } = new List<CurrentAccount>();
        public virtual ICollection<StockItem> StockItems { get; set; } = new List<StockItem>();
        public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public virtual ICollection<FinancialTransaction> FinancialTransactions { get; set; } = new List<FinancialTransaction>();
    }
}

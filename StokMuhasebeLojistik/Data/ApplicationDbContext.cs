using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CurrentAccount> CurrentAccounts { get; set; }
        public DbSet<StockItem> StockItems { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<VehicleExpense> VehicleExpenses { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<TripExpense> TripExpenses { get; set; }
        public DbSet<TripDocument> TripDocuments { get; set; }
        public DbSet<FinancialTransaction> FinancialTransactions { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<CashAccount> CashAccounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Company)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CurrentAccount>()
                .HasOne(ca => ca.Company)
                .WithMany(c => c.CurrentAccounts)
                .HasForeignKey(ca => ca.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StockItem>()
                .HasOne(si => si.Company)
                .WithMany(c => c.StockItems)
                .HasForeignKey(si => si.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StockItem>()
                .HasOne(si => si.Customer)
                .WithMany()
                .HasForeignKey(si => si.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<StockMovement>()
                .HasOne(sm => sm.StockItem)
                .WithMany(si => si.StockMovements)
                .HasForeignKey(sm => sm.StockItemId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Company)
                .WithMany(c => c.Vehicles)
                .HasForeignKey(v => v.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Driver)
                .WithMany(d => d.Vehicles)
                .HasForeignKey(v => v.DriverId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Customer)
                .WithMany(ca => ca.Trips)
                .HasForeignKey(t => t.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.Trips)
                .HasForeignKey(t => t.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Driver)
                .WithMany(d => d.Trips)
                .HasForeignKey(t => t.DriverId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FinancialTransaction>()
                .HasOne(ft => ft.Company)
                .WithMany(c => c.FinancialTransactions)
                .HasForeignKey(ft => ft.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FinancialTransaction>()
                .HasOne(ft => ft.CurrentAccount)
                .WithMany(ca => ca.FinancialTransactions)
                .HasForeignKey(ft => ft.CurrentAccountId)
                .OnDelete(DeleteBehavior.SetNull);

            base.OnModelCreating(modelBuilder);
        }
    }
}

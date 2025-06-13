using Microsoft.EntityFrameworkCore;
using StokMuhasebeLojistik.Data;
using StokMuhasebeLojistik.Models;
using System.Security.Cryptography;
using System.Text;

namespace StokMuhasebeLojistik.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly ApplicationDbContext _context;
        private User? _currentUser;

        public AuthenticationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public User? CurrentUser => _currentUser;
        public bool IsLoggedIn => _currentUser != null;

        public async Task<User?> LoginAsync(string username, string password)
        {
            var passwordHash = HashPassword(password);
            var user = await _context.Users
                .Include(u => u.Company)
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == passwordHash && u.IsActive);

            if (user != null)
            {
                _currentUser = user;
                user.LastLoginDate = DateTime.Now;
                await _context.SaveChangesAsync();
            }

            return user;
        }

        public async Task LogoutAsync()
        {
            _currentUser = null;
            await Task.CompletedTask;
        }

        public bool HasPermission(UserRole requiredRole)
        {
            if (!IsLoggedIn) return false;
            
            return _currentUser!.Role == UserRole.Yonetici || _currentUser.Role == requiredRole;
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}

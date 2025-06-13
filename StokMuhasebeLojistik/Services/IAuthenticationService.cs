using StokMuhasebeLojistik.Models;

namespace StokMuhasebeLojistik.Services
{
    public interface IAuthenticationService
    {
        Task<User?> LoginAsync(string username, string password);
        Task LogoutAsync();
        User? CurrentUser { get; }
        bool IsLoggedIn { get; }
        bool HasPermission(UserRole requiredRole);
    }
}

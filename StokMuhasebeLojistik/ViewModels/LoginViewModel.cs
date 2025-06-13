using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StokMuhasebeLojistik.Services;
using StokMuhasebeLojistik.Views;
using System.Windows;

namespace StokMuhasebeLojistik.ViewModels
{
    public partial class LoginViewModel : BaseViewModel
    {
        private readonly IAuthenticationService _authService;

        [ObservableProperty]
        private string _username = string.Empty;

        [ObservableProperty]
        private string _password = string.Empty;

        [ObservableProperty]
        private string _errorMessage = string.Empty;

        public LoginViewModel(IAuthenticationService authService)
        {
            _authService = authService;
            Title = "Giriş Yap";
        }

        [RelayCommand]
        private async Task LoginAsync()
        {
            if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
            {
                ErrorMessage = "Kullanıcı adı ve şifre gereklidir.";
                return;
            }

            IsBusy = true;
            ErrorMessage = string.Empty;

            try
            {
                var user = await _authService.LoginAsync(Username, Password);
                if (user != null)
                {
                    var mainWindow = new MainWindow();
                    mainWindow.Show();
                    
                    Application.Current.Windows.OfType<Window>().FirstOrDefault(w => w.IsActive)?.Close();
                }
                else
                {
                    ErrorMessage = "Geçersiz kullanıcı adı veya şifre.";
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Giriş hatası: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}

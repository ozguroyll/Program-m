using StokMuhasebeLojistik.ViewModels;
using System.Windows.Controls;

namespace StokMuhasebeLojistik.Views
{
    public partial class AccountingView : UserControl
    {
        public AccountingView()
        {
            InitializeComponent();
            DataContext = App.GetService<AccountingViewModel>();
        }
    }
}

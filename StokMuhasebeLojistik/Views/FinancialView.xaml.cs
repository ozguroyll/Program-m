using StokMuhasebeLojistik.ViewModels;
using System.Windows.Controls;

namespace StokMuhasebeLojistik.Views
{
    public partial class FinancialView : UserControl
    {
        public FinancialView()
        {
            InitializeComponent();
            DataContext = App.GetService<FinancialViewModel>();
        }
    }
}

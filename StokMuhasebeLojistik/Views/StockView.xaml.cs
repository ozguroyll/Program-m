using StokMuhasebeLojistik.ViewModels;
using System.Windows.Controls;

namespace StokMuhasebeLojistik.Views
{
    public partial class StockView : UserControl
    {
        public StockView()
        {
            InitializeComponent();
            DataContext = App.GetService<StockViewModel>();
        }
    }
}

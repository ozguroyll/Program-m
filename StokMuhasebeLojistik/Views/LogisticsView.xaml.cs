using StokMuhasebeLojistik.ViewModels;
using System.Windows.Controls;

namespace StokMuhasebeLojistik.Views
{
    public partial class LogisticsView : UserControl
    {
        public LogisticsView()
        {
            InitializeComponent();
            DataContext = App.GetService<LogisticsViewModel>();
        }
    }
}

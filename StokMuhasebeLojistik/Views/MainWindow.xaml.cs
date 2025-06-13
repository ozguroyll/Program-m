using StokMuhasebeLojistik.ViewModels;
using System.Windows;

namespace StokMuhasebeLojistik.Views
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = App.GetService<MainViewModel>();
        }
    }
}

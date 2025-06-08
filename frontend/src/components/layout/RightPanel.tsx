import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function RightPanel() {
  const notifications = [
    { id: 1, type: 'warning', title: 'Stok Uyarısı', message: 'Mısır stoğu kritik seviyede', time: '5 dk önce' },
    { id: 2, type: 'info', title: 'Yeni Talep', message: 'Khoshnaw firmasından buğday talebi', time: '15 dk önce' },
    { id: 3, type: 'success', title: 'Ödeme Alındı', message: 'Global Agro - 50,000 USD', time: '1 saat önce' }
  ];

  const stockAlerts = [
    { product: 'Mısır', quantity: '2,500 Ton', status: 'critical', location: 'Dönmezoğlu Antrepo' },
    { product: 'Buğday', quantity: '8,000 Ton', status: 'normal', location: 'İskenderun Limanı' },
    { product: 'Soya Yağı', quantity: '1,200 Ton', status: 'low', location: 'Mersin Antrepo' }
  ];

  const reminders = [
    { id: 1, title: 'Gümrük ödemesi', date: 'Bugün 16:00', priority: 'high' },
    { id: 2, title: 'Şerzat ile görüşme', date: 'Yarın 10:00', priority: 'medium' },
    { id: 3, title: 'Fatura takibi', date: '2 gün sonra', priority: 'low' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="h-full bg-background border-l p-4 space-y-4 overflow-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Bildirimler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                </div>
                <Badge variant={notification.type === 'warning' ? 'destructive' : 'default'} className="text-xs">
                  {notification.time}
                </Badge>
              </div>
              {notification.id < notifications.length && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Anlık Stok Durumu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stockAlerts.map((stock, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{stock.product}</p>
                  <p className="text-xs text-muted-foreground">{stock.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{stock.quantity}</p>
                  <Badge variant={getStatusColor(stock.status)} className="text-xs">
                    {stock.status === 'critical' ? 'Kritik' : 
                     stock.status === 'low' ? 'Düşük' : 'Normal'}
                  </Badge>
                </div>
              </div>
              {index < stockAlerts.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Hatırlatıcılar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{reminder.title}</p>
                  <p className="text-xs text-muted-foreground">{reminder.date}</p>
                </div>
                <Badge variant={getPriorityColor(reminder.priority)} className="text-xs">
                  {reminder.priority === 'high' ? 'Yüksek' : 
                   reminder.priority === 'medium' ? 'Orta' : 'Düşük'}
                </Badge>
              </div>
              {reminder.id < reminders.length && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Günlük Özet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Toplam Satış:</span>
            <span className="font-medium">$125,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Bekleyen Ödemeler:</span>
            <span className="font-medium">$45,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Aktif Talepler:</span>
            <span className="font-medium">12</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

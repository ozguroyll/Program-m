import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function BottomStatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusMessage, setStatusMessage] = useState('Sistem hazır');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const messages = [
      'Sistem hazır',
      'Veri senkronizasyonu tamamlandı',
      'Son güncelleme: 2 dakika önce',
      'Aktif kullanıcı: 3'
    ];
    
    const interval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setStatusMessage(randomMessage);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-8 border-t bg-muted/50 flex items-center justify-between px-4 text-xs text-muted-foreground">
      <div className="flex items-center space-x-4">
        <span>Stok Muhasebe Sistemi v1.0.0</span>
        <Separator orientation="vertical" className="h-4" />
        <Badge variant="outline" className="text-xs">
          {statusMessage}
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <span>Kullanıcı: Admin</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Şirket: Yılmaz Transport</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{currentTime.toLocaleString('tr-TR')}</span>
      </div>
    </footer>
  );
}

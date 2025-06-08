import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  Settings, 
  DollarSign, 
  Moon, 
  Sun,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react';
import ExchangeRateService, { ExchangeRate } from '@/services/exchangeRateService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopNavigation() {
  const [isDark, setIsDark] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Map<string, ExchangeRate>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const exchangeService = ExchangeRateService.getInstance();

  const loadExchangeRates = async () => {
    try {
      setIsRefreshing(true);
      const rates = await exchangeService.getRates();
      setExchangeRates(rates);
      setLastUpdate(exchangeService.getLastUpdateTime());
    } catch (error) {
      console.error('Döviz kurları yüklenemedi:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadExchangeRates();
    const interval = setInterval(loadExchangeRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfa
          </Button>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Arama..."
              className="w-64 pl-8"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4" />
            <span>Döviz:</span>
            {Array.from(exchangeRates.entries()).map(([currency, rate]) => (
              <Badge 
                key={currency} 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-muted" 
                title={`TCMB - Alış: ₺${rate.buyRate.toFixed(4)} | Satış: ₺${rate.sellRate.toFixed(4)}\nEfektif Alış: ₺${rate.banknoteByRate.toFixed(4)} | Efektif Satış: ₺${rate.banknoteSellRate.toFixed(4)}`}
              >
                {currency}: ₺{rate.buyRate.toFixed(2)}/₺{rate.sellRate.toFixed(2)}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={loadExchangeRates}
              disabled={isRefreshing}
              className="h-6 w-6 p-0 ml-2"
              title="TCMB Kurlarını Yenile"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            {lastUpdate && (
              <span className="text-xs text-muted-foreground ml-2">
                {lastUpdate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            Kısayollar
          </Button>
          
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Kullanıcı
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuItem>
                Tanımlamalar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

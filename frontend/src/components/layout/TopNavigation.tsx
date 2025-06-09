import { useState, useEffect, useCallback } from 'react';
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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const exchangeService = ExchangeRateService.getInstance();

  const loadExchangeRates = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const rates = await exchangeService.getRates();
      setExchangeRates(rates);
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  }, [exchangeService]);

  useEffect(() => {
    loadExchangeRates();
    const interval = setInterval(loadExchangeRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadExchangeRates]);

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
              <DropdownMenu key={currency}>
                <DropdownMenuTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      {currency}: ₺{rate.buyRate.toFixed(3)}
                      <span className={`text-xs ${rate.changePercent && rate.changePercent > 0 ? 'text-green-600' : rate.changePercent && rate.changePercent < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {exchangeService.getChangeIcon(rate.changePercent)}
                      </span>
                    </span>
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-80">
                  <DropdownMenuLabel className="text-center font-semibold">
                    {currency} - TCMB Kurları
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium text-green-700">Alış Kurları</div>
                        <div className="flex justify-between">
                          <span>Döviz Alış:</span>
                          <span className="font-mono">₺{rate.buyRate.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Efektif Alış:</span>
                          <span className="font-mono">₺{rate.banknoteByRate.toFixed(4)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-red-700">Satış Kurları</div>
                        <div className="flex justify-between">
                          <span>Döviz Satış:</span>
                          <span className="font-mono">₺{rate.sellRate.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Efektif Satış:</span>
                          <span className="font-mono">₺{rate.banknoteSellRate.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Günlük Değişim:</span>
                        <span className={`font-medium ${rate.changePercent && rate.changePercent > 0 ? 'text-green-600' : rate.changePercent && rate.changePercent < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {rate.changePercent ? `${rate.changePercent > 0 ? '+' : ''}${rate.changePercent.toFixed(2)}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Piyasa Durumu:</span>
                        <span className={`font-medium ${exchangeService.getMarketStatus() === 'open' ? 'text-green-600' : 'text-orange-600'}`}>
                          {exchangeService.getMarketStatus() === 'open' ? 'Açık' : exchangeService.getMarketStatus() === 'closed' ? 'Kapalı' : 'Hafta Sonu'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Son Güncelleme:</span>
                        <span>{new Date(rate.lastUpdated).toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <span className="text-xs text-muted-foreground ml-2">
              {exchangeService.getLastUpdateTime()}
            </span>
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

interface ExchangeRate {
  currency: string;
  buyRate: number;
  sellRate: number;
  banknoteByRate: number;
  banknoteSellRate: number;
  lastUpdated: string;
}

interface TCMBResponse {
  rates: ExchangeRate[];
  lastUpdated: string;
}

class ExchangeRateService {
  private static instance: ExchangeRateService;
  private rates: Map<string, ExchangeRate> = new Map();
  private lastFetch: Date | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService();
    }
    return ExchangeRateService.instance;
  }

  async fetchRates(): Promise<void> {
    try {
      const mockRates: ExchangeRate[] = [
        {
          currency: 'USD',
          buyRate: 39.0575,
          sellRate: 39.1279,
          banknoteByRate: 39.0302,
          banknoteSellRate: 39.1866,
          lastUpdated: new Date().toISOString()
        },
        {
          currency: 'EUR',
          buyRate: 44.4673,
          sellRate: 44.5474,
          banknoteByRate: 44.4362,
          banknoteSellRate: 44.6142,
          lastUpdated: new Date().toISOString()
        },
        {
          currency: 'GBP',
          buyRate: 52.7484,
          sellRate: 53.0234,
          banknoteByRate: 52.7114,
          banknoteSellRate: 53.1029,
          lastUpdated: new Date().toISOString()
        }
      ];

      this.rates.clear();
      mockRates.forEach(rate => {
        this.rates.set(rate.currency, rate);
      });
      
      this.lastFetch = new Date();
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      throw new Error('Döviz kurları alınamadı');
    }
  }

  async getRates(): Promise<Map<string, ExchangeRate>> {
    const now = new Date();
    const shouldRefresh = !this.lastFetch || 
      (now.getTime() - this.lastFetch.getTime()) > this.CACHE_DURATION;

    if (shouldRefresh || this.rates.size === 0) {
      await this.fetchRates();
    }

    return new Map(this.rates);
  }

  async getRate(currency: string): Promise<ExchangeRate | null> {
    const rates = await this.getRates();
    return rates.get(currency) || null;
  }

  async convertCurrency(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string,
    useSellingRate: boolean = false
  ): Promise<number> {
    if (fromCurrency === toCurrency) return amount;
    
    const rates = await this.getRates();
    
    let tryAmount = amount;
    if (fromCurrency !== 'TRY') {
      const fromRate = rates.get(fromCurrency);
      if (!fromRate) throw new Error(`${fromCurrency} kuru bulunamadı`);
      tryAmount = amount * (useSellingRate ? fromRate.sellRate : fromRate.buyRate);
    }

    if (toCurrency === 'TRY') {
      return tryAmount;
    }

    const toRate = rates.get(toCurrency);
    if (!toRate) throw new Error(`${toCurrency} kuru bulunamadı`);
    
    return tryAmount / (useSellingRate ? toRate.buyRate : toRate.sellRate);
  }

  formatCurrency(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency === 'TRY' ? 'TRY' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (currency === 'TRY') {
      return formatter.format(amount).replace('US$', '₺');
    } else if (currency === 'USD') {
      return '$' + amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    } else if (currency === 'EUR') {
      return '€' + amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    } else if (currency === 'GBP') {
      return '£' + amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    }

    return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ' + currency;
  }

  getLastUpdateTime(): Date | null {
    return this.lastFetch;
  }
}

export default ExchangeRateService;
export type { ExchangeRate, TCMBResponse };

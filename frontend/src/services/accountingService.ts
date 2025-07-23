import { apiService } from './api';

export interface CariKayit {
  id: number;
  cari_ad: string;
  cari_tipi?: string;
  islem_tipi: string;
  tutar: number;
  doviz_tipi: string;
  kur: number;
  referans_no?: string;
  stok_referans_id?: number;
  tarih?: string;
  odeme_vadesi?: string;
  aciklama?: string;
  created_at: string;
}

export interface GelirKaydi {
  id: number;
  kategori: string;
  alt_kategori?: string;
  tutar: number;
  doviz_tipi: string;
  kur: number;
  referans_no?: string;
  tarih?: string;
  aciklama?: string;
  created_at: string;
}

export interface GiderKaydi {
  id: number;
  kategori: string;
  alt_kategori?: string;
  tutar: number;
  doviz_tipi: string;
  kur: number;
  referans_no?: string;
  tarih?: string;
  aciklama?: string;
  created_at: string;
}

export interface CariKayitCreate {
  cari_ad: string;
  cari_tipi?: string;
  islem_tipi: string;
  tutar: number;
  doviz_tipi?: string;
  kur?: number;
  referans_no?: string;
  stok_referans_id?: number;
  tarih?: string;
  odeme_vadesi?: string;
  aciklama?: string;
}

export interface GelirKaydiCreate {
  kategori: string;
  alt_kategori?: string;
  tutar: number;
  doviz_tipi?: string;
  kur?: number;
  referans_no?: string;
  tarih?: string;
  aciklama?: string;
}

export interface GiderKaydiCreate {
  kategori: string;
  alt_kategori?: string;
  tutar: number;
  doviz_tipi?: string;
  kur?: number;
  referans_no?: string;
  tarih?: string;
  aciklama?: string;
}

class AccountingService {
  async getCurrentAccounts(cari_ad?: string): Promise<CariKayit[]> {
    const params = cari_ad ? `?cari_ad=${encodeURIComponent(cari_ad)}` : '';
    return apiService.get<CariKayit[]>(`/accounting/current-accounts${params}`);
  }

  async createCurrentAccountEntry(entry: CariKayitCreate): Promise<CariKayit> {
    return apiService.post<CariKayit>('/accounting/current-accounts', entry);
  }

  async getAccountBalance(cari_ad: string) {
    return apiService.get(`/accounting/current-accounts/balance/${encodeURIComponent(cari_ad)}`);
  }

  async getIncomeRecords(): Promise<GelirKaydi[]> {
    return apiService.get<GelirKaydi[]>('/accounting/income');
  }

  async createIncomeRecord(income: GelirKaydiCreate): Promise<GelirKaydi> {
    return apiService.post<GelirKaydi>('/accounting/income', income);
  }

  async getExpenseRecords(): Promise<GiderKaydi[]> {
    return apiService.get<GiderKaydi[]>('/accounting/expense');
  }

  async createExpenseRecord(expense: GiderKaydiCreate): Promise<GiderKaydi> {
    return apiService.post<GiderKaydi>('/accounting/expense', expense);
  }
}

export const accountingService = new AccountingService();

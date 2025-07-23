import { apiService } from './api';

export interface Urun {
  id: number;
  ad: string;
  kategori?: string;
  birim: string;
  created_at: string;
}

export interface Tedarikci {
  id: number;
  ad: string;
  telefon?: string;
  adres?: string;
  vergi_no?: string;
  created_at: string;
}

export interface Musteri {
  id: number;
  ad: string;
  telefon?: string;
  adres?: string;
  ulke?: string;
  vergi_no?: string;
  created_at: string;
}

export interface StokKaydi {
  id: number;
  urun_id: number;
  tedarikci_id: number;
  miktar: number;
  birim_fiyat: number;
  toplam_fiyat: number;
  doviz_tipi: string;
  lokasyon?: string;
  adres_adi?: string;
  plaka?: string;
  sofor_ad?: string;
  sofor_telefon?: string;
  protein?: number;
  hektolitre?: number;
  rutubet?: number;
  hasere?: number;
  embriyo?: number;
  donme?: number;
  yabanci_madde?: number;
  kepce_ucreti: number;
  hamal_ucreti: number;
  nakliye_ucreti: number;
  fatura_ucreti: number;
  fatura_alici: string;
  tarih?: string;
  odeme_vadesi?: string;
  aciklama?: string;
  created_at: string;
  urun?: Urun;
  tedarikci?: Tedarikci;
}

export interface StokCikis {
  id: number;
  stok_kaydi_id: number;
  musteri_id: number;
  miktar: number;
  birim_fiyat: number;
  toplam_fiyat: number;
  doviz_tipi: string;
  cikis_tipi?: string;
  lokasyon?: string;
  plaka?: string;
  sofor_ad?: string;
  sofor_telefon?: string;
  kepce_ucreti: number;
  hamal_ucreti: number;
  nakliye_ucreti: number;
  fatura_ucreti: number;
  gumruk_ucreti: number;
  fatura_alici: string;
  tarih?: string;
  odeme_vadesi?: string;
  aciklama?: string;
  created_at: string;
  musteri?: Musteri;
}

export interface StokDurumu {
  urun_adi: string;
  toplam_miktar: number;
  lokasyon: string;
  durum: string;
}

export interface UrunCreate {
  ad: string;
  kategori?: string;
  birim?: string;
}

export interface TedarikciCreate {
  ad: string;
  telefon?: string;
  adres?: string;
  vergi_no?: string;
}

export interface MusteriCreate {
  ad: string;
  telefon?: string;
  adres?: string;
  ulke?: string;
  vergi_no?: string;
}

export interface StokKaydiCreate {
  urun_id: number;
  tedarikci_id: number;
  miktar: number;
  birim_fiyat: number;
  toplam_fiyat: number;
  doviz_tipi?: string;
  lokasyon?: string;
  adres_adi?: string;
  plaka?: string;
  sofor_ad?: string;
  sofor_telefon?: string;
  protein?: number;
  hektolitre?: number;
  rutubet?: number;
  hasere?: number;
  embriyo?: number;
  donme?: number;
  yabanci_madde?: number;
  kepce_ucreti?: number;
  hamal_ucreti?: number;
  nakliye_ucreti?: number;
  fatura_ucreti?: number;
  fatura_alici?: string;
  tarih?: string;
  odeme_vadesi?: string;
  aciklama?: string;
}

export interface StokCikisCreate {
  stok_kaydi_id: number;
  musteri_id: number;
  miktar: number;
  birim_fiyat: number;
  toplam_fiyat: number;
  doviz_tipi?: string;
  cikis_tipi?: string;
  lokasyon?: string;
  plaka?: string;
  sofor_ad?: string;
  sofor_telefon?: string;
  kepce_ucreti?: number;
  hamal_ucreti?: number;
  nakliye_ucreti?: number;
  fatura_ucreti?: number;
  gumruk_ucreti?: number;
  fatura_alici?: string;
  tarih?: string;
  odeme_vadesi?: string;
  aciklama?: string;
}

class StockService {
  async getProducts(): Promise<Urun[]> {
    return apiService.get<Urun[]>('/stock/products');
  }

  async createProduct(product: UrunCreate): Promise<Urun> {
    return apiService.post<Urun>('/stock/products', product);
  }

  async getSuppliers(): Promise<Tedarikci[]> {
    return apiService.get<Tedarikci[]>('/stock/suppliers');
  }

  async createSupplier(supplier: TedarikciCreate): Promise<Tedarikci> {
    return apiService.post<Tedarikci>('/stock/suppliers', supplier);
  }

  async getCustomers(): Promise<Musteri[]> {
    return apiService.get<Musteri[]>('/stock/customers');
  }

  async createCustomer(customer: MusteriCreate): Promise<Musteri> {
    return apiService.post<Musteri>('/stock/customers', customer);
  }

  async getStockEntries(): Promise<StokKaydi[]> {
    return apiService.get<StokKaydi[]>('/stock/entries');
  }

  async createStockEntry(entry: StokKaydiCreate): Promise<StokKaydi> {
    return apiService.post<StokKaydi>('/stock/entries', entry);
  }

  async getStockExits(): Promise<StokCikis[]> {
    return apiService.get<StokCikis[]>('/stock/exits');
  }

  async createStockExit(exit: StokCikisCreate): Promise<StokCikis> {
    return apiService.post<StokCikis>('/stock/exits', exit);
  }

  async getStockStatus(): Promise<StokDurumu[]> {
    return apiService.get<StokDurumu[]>('/stock/status');
  }
}

export const stockService = new StockService();

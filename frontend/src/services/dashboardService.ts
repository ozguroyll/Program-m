import { apiService } from './api';

export interface DashboardStats {
  toplam_stok_degeri: number;
  bekleyen_odemeler: number;
  aylik_satis: number;
  kar_orani: number;
  aktif_talepler: number;
  kritik_stoklar: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    return apiService.get<DashboardStats>('/dashboard/stats');
  }

  async getStockStatus() {
    return apiService.get('/dashboard/stock-status');
  }
}

export const dashboardService = new DashboardService();

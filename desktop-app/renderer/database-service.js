class DatabaseService {
  static async getCariKayitlar() {
    if (window.electronAPI) {
      return await window.electronAPI.getCariKayitlar();
    }
    return [];
  }

  static async addCariKayit(data) {
    if (window.electronAPI) {
      return await window.electronAPI.addCariKayit(data);
    }
    return null;
  }

  static async getUrunler() {
    if (window.electronAPI) {
      return await window.electronAPI.getUrunler();
    }
    return [];
  }

  static async addUrun(data) {
    if (window.electronAPI) {
      return await window.electronAPI.addUrun(data);
    }
    return null;
  }

  static async getTalepler() {
    if (window.electronAPI) {
      return await window.electronAPI.getTalepler();
    }
    return [];
  }

  static async addTalep(data) {
    if (window.electronAPI) {
      return await window.electronAPI.addTalep(data);
    }
    return null;
  }

  static async getStokHareketleri() {
    if (window.electronAPI) {
      return await window.electronAPI.getStokHareketleri();
    }
    return [];
  }

  static async addStokHareketi(data) {
    if (window.electronAPI) {
      return await window.electronAPI.addStokHareketi(data);
    }
    return null;
  }

  static async getGelirGider() {
    if (window.electronAPI) {
      return await window.electronAPI.getGelirGider();
    }
    return [];
  }

  static async addGelirGider(data) {
    if (window.electronAPI) {
      return await window.electronAPI.addGelirGider(data);
    }
    return null;
  }

  static async getBankaHesaplari() {
    if (window.electronAPI) {
      return await window.electronAPI.getBankaHesaplari();
    }
    return [];
  }

  static async addBankaHesabi(data) {
    if (window.electronAPI) {
      return await window.electronAPI.addBankaHesabi(data);
    }
    return null;
  }

  static async getDashboardStats() {
    if (window.electronAPI) {
      const [cariKayitlar, urunler, talepler, gelirGider] = await Promise.all([
        this.getCariKayitlar(),
        this.getUrunler(),
        this.getTalepler(),
        this.getGelirGider()
      ]);

      const musteriler = cariKayitlar.filter(c => c.hesap_turu === 'Müşteri');
      const tedarikciler = cariKayitlar.filter(c => c.hesap_turu === 'Tedarikçi');
      const aktifTalepler = talepler.filter(t => t.durum === 'Beklemede');
      
      const aylikGelir = gelirGider
        .filter(g => g.islem_tipi === 'Gelir' && new Date(g.tarih).getMonth() === new Date().getMonth())
        .reduce((sum, g) => sum + g.tutar, 0);
      
      const aylikGider = gelirGider
        .filter(g => g.islem_tipi === 'Gider' && new Date(g.tarih).getMonth() === new Date().getMonth())
        .reduce((sum, g) => sum + g.tutar, 0);

      return {
        toplamMusteri: musteriler.length,
        toplamTedarikci: tedarikciler.length,
        aktifTalepSayisi: aktifTalepler.length,
        toplamStokDegeri: urunler.reduce((sum, u) => sum + (u.stok_miktari * u.alis_fiyati), 0),
        aylikGelir,
        aylikGider,
        karMarji: aylikGelir - aylikGider
      };
    }
    return {};
  }
}

window.DatabaseService = DatabaseService;

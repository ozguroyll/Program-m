const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  query: (sql, params) => ipcRenderer.invoke('db-query', sql, params),
  run: (sql, params) => ipcRenderer.invoke('db-run', sql, params),
  
  getCariKayitlar: () => ipcRenderer.invoke('db-query', 'SELECT * FROM cari_kayitlar ORDER BY cari_adi'),
  addCariKayit: (data) => ipcRenderer.invoke('db-run', 
    'INSERT INTO cari_kayitlar (cari_kodu, cari_adi, hesap_turu, telefon, email, adres, vergi_no, bakiye, para_birimi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [data.cari_kodu, data.cari_adi, data.hesap_turu, data.telefon, data.email, data.adres, data.vergi_no, data.bakiye, data.para_birimi]
  ),
  
  getUrunler: () => ipcRenderer.invoke('db-query', 'SELECT * FROM urunler ORDER BY urun_adi'),
  addUrun: (data) => ipcRenderer.invoke('db-run',
    'INSERT INTO urunler (urun_kodu, urun_adi, kategori, birim, stok_miktari, minimum_stok, alis_fiyati, satis_fiyati, para_birimi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [data.urun_kodu, data.urun_adi, data.kategori, data.birim, data.stok_miktari, data.minimum_stok, data.alis_fiyati, data.satis_fiyati, data.para_birimi]
  ),
  
  getTalepler: () => ipcRenderer.invoke('db-query', 'SELECT * FROM talepler ORDER BY olusturma_tarihi DESC'),
  addTalep: (data) => ipcRenderer.invoke('db-run',
    'INSERT INTO talepler (talep_no, musteri_id, urun_adi, miktar, birim, hedef_fiyat, para_birimi, aciklama) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data.talep_no, data.musteri_id, data.urun_adi, data.miktar, data.birim, data.hedef_fiyat, data.para_birimi, data.aciklama]
  ),
  
  getStokHareketleri: () => ipcRenderer.invoke('db-query', 'SELECT * FROM stok_hareketleri ORDER BY tarih DESC'),
  addStokHareketi: (data) => ipcRenderer.invoke('db-run',
    'INSERT INTO stok_hareketleri (urun_id, hareket_tipi, miktar, birim_fiyat, toplam_tutar, para_birimi, cari_id, belge_no, aciklama) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [data.urun_id, data.hareket_tipi, data.miktar, data.birim_fiyat, data.toplam_tutar, data.para_birimi, data.cari_id, data.belge_no, data.aciklama]
  ),
  
  getGelirGider: () => ipcRenderer.invoke('db-query', 'SELECT * FROM gelir_gider ORDER BY tarih DESC'),
  addGelirGider: (data) => ipcRenderer.invoke('db-run',
    'INSERT INTO gelir_gider (islem_tipi, kategori, tutar, para_birimi, cari_id, aciklama, belge_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.islem_tipi, data.kategori, data.tutar, data.para_birimi, data.cari_id, data.aciklama, data.belge_no]
  ),
  
  getBankaHesaplari: () => ipcRenderer.invoke('db-query', 'SELECT * FROM banka_hesaplari ORDER BY banka_adi'),
  addBankaHesabi: (data) => ipcRenderer.invoke('db-run',
    'INSERT INTO banka_hesaplari (banka_adi, hesap_adi, hesap_no, iban, para_birimi, bakiye, hesap_turu) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.banka_adi, data.hesap_adi, data.hesap_no, data.iban, data.para_birimi, data.bakiye, data.hesap_turu]
  )
});

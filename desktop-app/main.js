const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;

function createDatabase() {
  const dbPath = path.join(__dirname, 'database', 'stok_muhasebe.db');
  
  const fs = require('fs');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
      console.log('SQLite veritabanına bağlanıldı.');
      initializeTables();
    }
  });
}

function initializeTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS cari_kayitlar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cari_kodu TEXT UNIQUE NOT NULL,
      cari_adi TEXT NOT NULL,
      hesap_turu TEXT NOT NULL,
      telefon TEXT,
      email TEXT,
      adres TEXT,
      vergi_no TEXT,
      bakiye REAL DEFAULT 0,
      para_birimi TEXT DEFAULT 'TRY',
      durum TEXT DEFAULT 'Aktif',
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS urunler (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      urun_kodu TEXT UNIQUE NOT NULL,
      urun_adi TEXT NOT NULL,
      kategori TEXT,
      birim TEXT DEFAULT 'Adet',
      stok_miktari REAL DEFAULT 0,
      minimum_stok REAL DEFAULT 0,
      alis_fiyati REAL DEFAULT 0,
      satis_fiyati REAL DEFAULT 0,
      para_birimi TEXT DEFAULT 'TRY',
      durum TEXT DEFAULT 'Aktif',
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS talepler (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      talep_no TEXT UNIQUE NOT NULL,
      musteri_id INTEGER,
      urun_adi TEXT NOT NULL,
      miktar REAL NOT NULL,
      birim TEXT,
      hedef_fiyat REAL,
      para_birimi TEXT DEFAULT 'TRY',
      aciklama TEXT,
      durum TEXT DEFAULT 'Beklemede',
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (musteri_id) REFERENCES cari_kayitlar (id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS teklifler (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      talep_id INTEGER,
      tedarikci_id INTEGER,
      teklif_fiyati REAL NOT NULL,
      para_birimi TEXT DEFAULT 'TRY',
      teslimat_suresi INTEGER,
      aciklama TEXT,
      durum TEXT DEFAULT 'Beklemede',
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (talep_id) REFERENCES talepler (id),
      FOREIGN KEY (tedarikci_id) REFERENCES cari_kayitlar (id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS stok_hareketleri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      urun_id INTEGER,
      hareket_tipi TEXT NOT NULL,
      miktar REAL NOT NULL,
      birim_fiyat REAL,
      toplam_tutar REAL,
      para_birimi TEXT DEFAULT 'TRY',
      cari_id INTEGER,
      belge_no TEXT,
      aciklama TEXT,
      tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (urun_id) REFERENCES urunler (id),
      FOREIGN KEY (cari_id) REFERENCES cari_kayitlar (id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS gelir_gider (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      islem_tipi TEXT NOT NULL,
      kategori TEXT NOT NULL,
      tutar REAL NOT NULL,
      para_birimi TEXT DEFAULT 'TRY',
      cari_id INTEGER,
      aciklama TEXT,
      belge_no TEXT,
      tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cari_id) REFERENCES cari_kayitlar (id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS banka_hesaplari (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      banka_adi TEXT NOT NULL,
      hesap_adi TEXT NOT NULL,
      hesap_no TEXT NOT NULL,
      iban TEXT,
      para_birimi TEXT DEFAULT 'TRY',
      bakiye REAL DEFAULT 0,
      hesap_turu TEXT DEFAULT 'Vadesiz',
      durum TEXT DEFAULT 'Aktif',
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  tables.forEach((tableSQL) => {
    db.run(tableSQL, (err) => {
      if (err) {
        console.error('Tablo oluşturma hatası:', err.message);
      }
    });
  });

  insertSampleData();
}

function insertSampleData() {
  const sampleData = [
    `INSERT OR IGNORE INTO cari_kayitlar (cari_kodu, cari_adi, hesap_turu, telefon, email, bakiye) VALUES 
      ('MUS001', 'Khoshnaw Trading', 'Müşteri', '+964 750 123 4567', 'info@khoshnaw.com', 15000),
      ('MUS002', 'Kaiwan Group', 'Müşteri', '+964 751 234 5678', 'contact@kaiwan.com', 8500),
      ('TED001', 'Baghdad Steel Co.', 'Tedarikçi', '+964 770 345 6789', 'sales@baghdadsteel.com', -12000),
      ('TED002', 'Özkan Nakliyat', 'Tedarikçi', '+90 532 456 7890', 'ozkan@nakliyat.com', -5500)`,
    
    `INSERT OR IGNORE INTO urunler (urun_kodu, urun_adi, kategori, birim, stok_miktari, minimum_stok, alis_fiyati, satis_fiyati) VALUES 
      ('STK-001', 'Mısır', 'Tahıl', 'Ton', 2500, 500, 280, 320),
      ('STK-002', 'Buğday', 'Tahıl', 'Ton', 8000, 1000, 350, 400),
      ('STK-003', 'Soya Yağı', 'Yağ', 'Ton', 1200, 200, 1800, 2100)`,
    
    `INSERT OR IGNORE INTO banka_hesaplari (banka_adi, hesap_adi, hesap_no, iban, bakiye) VALUES 
      ('Ziraat Bankası', 'Yılmaz Transport Ana Hesap', '12345678', 'TR33 0001 0012 3456 7890 1234 56', 450000),
      ('İş Bankası', 'Döviz Hesabı USD', '87654321', 'TR44 0006 4000 0087 6543 2100 01', 25000),
      ('Garanti BBVA', 'Operasyonel Hesap', '11223344', 'TR55 0006 2000 1122 3344 5566 77', 180000)`
  ];

  sampleData.forEach((sql) => {
    db.run(sql, (err) => {
      if (err) {
        console.error('Örnek veri ekleme hatası:', err.message);
      }
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'renderer', 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Stok Muhasebe Sistemi'
  });

  if (process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Veritabanı kapatma hatası:', err.message);
        } else {
          console.log('Veritabanı bağlantısı kapatıldı.');
        }
      });
    }
    app.quit();
  }
});

ipcMain.handle('db-query', async (event, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('db-run', async (event, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
});

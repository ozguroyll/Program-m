import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UltraProfessionalTable } from '@/components/ui/ultra-professional-table';

import { Package, Truck, Building2, FileText, Plus, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ColumnDef } from '@tanstack/react-table';
import { stockService, StokKaydi as ApiStokKaydi, StokCikis as ApiStokCikis, Urun, Tedarikci, Musteri } from '../../services/stockService';
import { accountingService } from '../../services/accountingService';


export function StokYonetimi() {
  const [activeTab, setActiveTab] = useState('stok-listesi');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stokKayitlari, setStokKayitlari] = useState<ApiStokKaydi[]>([]);
  const [stokCikislari, setStokCikislari] = useState<ApiStokCikis[]>([]);
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [tedarikciler, setTedarikciler] = useState<Tedarikci[]>([]);
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  
  const [formData, setFormData] = useState({
    urun: '',
    miktar: '',
    alisFiyati: '',
    tedarikci: '',
    depo: '',
    kimAdina: '',
    sirket: '',
    teslimSekli: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stockEntries, stockExits, products, suppliers, customers] = await Promise.all([
          stockService.getStockEntries(),
          stockService.getStockExits(),
          stockService.getProducts(),
          stockService.getSuppliers(),
          stockService.getCustomers()
        ]);
        
        setStokKayitlari(stockEntries);
        setStokCikislari(stockExits);
        setUrunler(products);
        setTedarikciler(suppliers);
        setMusteriler(customers);
        setError(null);
      } catch (err) {
        setError('Veriler yüklenirken hata oluştu');
        console.error('Stock data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createAutomaticAccountingEntry = async (stokKaydi: ApiStokKaydi) => {
    try {
      const tedarikci = tedarikciler.find(t => t.id === stokKaydi.tedarikci_id);
      const urun = urunler.find(u => u.id === stokKaydi.urun_id);
      
      const cariIslemData = {
        cari_ad: tedarikci?.ad || 'Bilinmeyen Tedarikçi',
        cari_tipi: 'Tedarikçi',
        islem_tipi: 'Borç',
        tutar: stokKaydi.toplam_fiyat,
        doviz_tipi: stokKaydi.doviz_tipi || 'TL',
        kur: 1,
        referans_no: `STK-${stokKaydi.id}`,
        stok_referans_id: stokKaydi.id,
        aciklama: `${urun?.ad || 'Ürün'} stok alımı - ${stokKaydi.miktar} Ton`,
        tarih: stokKaydi.tarih,
        odeme_vadesi: stokKaydi.odeme_vadesi
      };

      const giderKaydiData = {
        kategori: 'Stok Alımı',
        alt_kategori: 'Ürün Alımı',
        tutar: stokKaydi.toplam_fiyat,
        doviz_tipi: stokKaydi.doviz_tipi || 'TL',
        kur: 1,
        referans_no: `STK-${stokKaydi.id}`,
        aciklama: `${urun?.ad || 'Ürün'} alımı - ${tedarikci?.ad || 'Tedarikçi'}`,
        tarih: stokKaydi.tarih
      };

      await Promise.all([
        accountingService.createCurrentAccountEntry(cariIslemData),
        accountingService.createExpenseRecord(giderKaydiData)
      ]);

      toast({
        title: "Muhasebe Entegrasyonu",
        description: `Cari işlem ve gider kaydı otomatik oluşturuldu`,
      });
    } catch (error) {
      console.error('Accounting entry error:', error);
      toast({
        title: "Muhasebe Hatası",
        description: "Otomatik muhasebe kayıtları oluşturulamadı",
        variant: "destructive",
      });
    }
  };

  const handleStokGirisi = async () => {
    if (!formData.urun || !formData.miktar || !formData.alisFiyati || !formData.tedarikci) {
      toast({
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedUrun = urunler.find(u => u.ad === formData.urun);
      const selectedTedarikci = tedarikciler.find(t => t.ad === formData.tedarikci);
      
      if (!selectedUrun || !selectedTedarikci) {
        toast({
          title: "Hata",
          description: "Seçilen ürün veya tedarikçi bulunamadı",
          variant: "destructive",
        });
        return;
      }

      const miktar = parseFloat(formData.miktar);
      const birimFiyat = parseFloat(formData.alisFiyati);
      const toplamFiyat = miktar * birimFiyat;

      const yeniStokKaydi = {
        urun_id: selectedUrun.id,
        tedarikci_id: selectedTedarikci.id,
        miktar,
        birim_fiyat: birimFiyat,
        toplam_fiyat: toplamFiyat,
        doviz_tipi: 'TL',
        lokasyon: formData.depo || 'ZAD 1',
        tarih: new Date().toISOString().split('T')[0],
        aciklama: `${formData.sirket} için ${selectedUrun.ad} alımı`
      };

      const createdStokKaydi = await stockService.createStockEntry(yeniStokKaydi);
      
      setStokKayitlari(prev => [...prev, createdStokKaydi]);
      
      await createAutomaticAccountingEntry(createdStokKaydi);

      toast({
        title: "Başarılı",
        description: "Stok girişi kaydedildi ve otomatik muhasebe kayıtları oluşturuldu",
      });

      setFormData({
        urun: '',
        miktar: '',
        alisFiyati: '',
        tedarikci: '',
        depo: '',
        kimAdina: '',
        sirket: '',
        teslimSekli: ''
      });
    } catch (error) {
      console.error('Stock entry error:', error);
      toast({
        title: "Hata",
        description: "Stok girişi kaydedilemedi",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }



  const stokGirisColumns: ColumnDef<ApiStokKaydi>[] = [
    {
      accessorKey: "id",
      header: "Stok Kodu",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium text-blue-600">STK-{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: "urun",
      header: "Ürün Adı",
      cell: ({ row }) => {
        const urun = urunler.find(u => u.id === row.original.urun_id);
        return (
          <div>
            <div className="font-medium">{urun?.ad || 'Bilinmeyen Ürün'}</div>
            <div className="text-sm text-gray-500">Kategori: {urun?.kategori || 'Hububat'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "miktar",
      header: "Miktar",
      cell: ({ row }) => {
        const urun = urunler.find(u => u.id === row.original.urun_id);
        return (
          <div className="text-right">
            <div className="font-semibold">
              {parseFloat(row.getValue('miktar')).toLocaleString('tr-TR')} {urun?.birim || 'Ton'}
            </div>
            <div className="text-xs text-gray-500">Min: 500 {urun?.birim || 'Ton'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "birim_fiyat",
      header: "Alış Fiyatı",
      cell: ({ row }) => {
        const currency = row.original.doviz_tipi === 'USD' ? '$' : '₺';
        return (
          <div className="text-right font-semibold text-green-600">
            {currency}{Number(row.getValue('birim_fiyat')).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
        );
      },
    },
    {
      accessorKey: "toplam_fiyat",
      header: "Toplam Değer",
      cell: ({ row }) => {
        const currency = row.original.doviz_tipi === 'USD' ? '$' : '₺';
        const toplam = row.original.toplam_fiyat;
        return (
          <div className="text-right">
            <div className="font-bold text-blue-600">
              {currency}{toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
            {row.original.doviz_tipi === 'USD' && (
              <div className="text-xs text-gray-500">
                ₺{(toplam * 32.5).toLocaleString('tr-TR')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "tedarikci",
      header: "Tedarikçi",
      cell: ({ row }) => {
        const tedarikci = tedarikciler.find(t => t.id === row.original.tedarikci_id);
        return (
          <div>
            <div className="font-medium">{tedarikci?.ad || 'Bilinmeyen Tedarikçi'}</div>
            <div className="text-xs text-gray-500">SUP-{tedarikci?.id || '000'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "depo",
      header: "Depo/Antrepo",
      cell: ({ row }) => (
        <div>
          <Badge variant="outline" className="mb-1">
            {row.getValue('depo')}
          </Badge>
          <div className="text-xs text-gray-500">Silo 1-A</div>
        </div>
      ),
    },
    {
      accessorKey: "kimAdina",
      header: "Kim Adına",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-medium">
          {row.getValue('kimAdina')}
        </Badge>
      ),
    },
    {
      accessorKey: "sirket",
      header: "Şirket",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('sirket')}</div>
      ),
    },
    {
      accessorKey: "tarih",
      header: "Tarih",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          {new Date(row.getValue('tarih')).toLocaleDateString('tr-TR')}
        </div>
      ),
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }) => {
        const durum = row.getValue('durum') as string;
        const variant = durum === 'Teslim Edildi' ? 'default' : durum === 'Yolda' ? 'secondary' : 'destructive';
        return <Badge variant={variant} className="text-xs">{durum}</Badge>;
      },
    },
  ];

  const stokCikisColumns: ColumnDef<ApiStokCikis>[] = [
    {
      accessorKey: "id",
      header: "Çıkış Kodu",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium text-red-600">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: "urun",
      header: "Ürün Adı",
      cell: ({ row }) => {
        const stokKaydi = stokKayitlari.find(s => s.id === row.original.stok_kaydi_id);
        const urun = stokKaydi ? urunler.find(u => u.id === stokKaydi.urun_id) : null;
        return (
          <div>
            <div className="font-medium">{urun?.ad || 'Bilinmeyen Ürün'}</div>
            <div className="text-sm text-gray-500">Kategori: {urun?.kategori || 'Hububat'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "miktar",
      header: "Miktar",
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-semibold text-red-600">
            -{parseFloat(String(row.getValue('miktar'))).toLocaleString('tr-TR')} Ton
          </div>
          <div className="text-xs text-gray-500">Çıkış miktarı</div>
        </div>
      ),
    },
    {
      accessorKey: "plaka",
      header: "Araç Plaka",
      cell: ({ row }) => (
        <div>
          <div className="font-mono text-sm font-medium">{row.getValue('plaka') || 'Belirtilmemiş'}</div>
          <div className="text-xs text-gray-500">Araç Bilgisi</div>
        </div>
      ),
    },
    {
      accessorKey: "sofor_ad",
      header: "Şoför",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('sofor_ad') || 'Belirtilmemiş'}</div>
      ),
    },
    {
      accessorKey: "musteri",
      header: "Müşteri",
      cell: ({ row }) => {
        const musteri = musteriler.find(m => m.id === row.original.musteri_id);
        return (
          <div>
            <div className="font-medium">{musteri?.ad || 'Bilinmeyen Müşteri'}</div>
            <div className="text-xs text-gray-500">MUS-{musteri?.id || '000'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "lokasyon",
      header: "Çıkış Deposu",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-medium">
          {row.getValue('lokasyon') || 'Belirtilmemiş'}
        </Badge>
      ),
    },
    {
      accessorKey: "cikis_tipi",
      header: "Çıkış Tipi",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('cikis_tipi') || 'Devir'}
        </Badge>
      ),
    },
    {
      accessorKey: "tarih",
      header: "Çıkış Tarihi",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          {new Date(row.getValue('tarih')).toLocaleDateString('tr-TR')}
        </div>
      ),
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }) => {
        const durum = row.getValue('durum') as string;
        const variant = durum === 'Teslim Edildi' ? 'default' : durum === 'Yolda' ? 'secondary' : 'destructive';
        return <Badge variant={variant} className="text-xs">{durum}</Badge>;
      },
    },
  ];

  const urunTanimlariColumns: ColumnDef<Urun>[] = [
    {
      accessorKey: "id",
      header: "Ürün Kodu",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium text-blue-600">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: "ad",
      header: "Ürün Adı",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('ad')}</div>
      ),
    },
    {
      accessorKey: "kategori",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('kategori')}
        </Badge>
      ),
    },
    {
      accessorKey: "birim",
      header: "Birim",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('birim')}</div>
      ),
    },
    {
      accessorKey: "aciklama",
      header: "Açıklama",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('aciklama')}</div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Stok Yönetimi</h2>
          <p className="text-muted-foreground">Ürün alım, satım ve depo yönetimi</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Yeni İşlem
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Stok Değeri</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,800,000</div>
            <p className="text-xs text-muted-foreground">Tüm depolar</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% geçen aya göre
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Sevkiyatlar</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stokCikislari.length}</div>
            <p className="text-xs text-muted-foreground">Yolda ve yükleniyor</p>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              -2 geçen haftaya göre
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritik Stok Seviyesi</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Ürün</div>
            <p className="text-xs text-muted-foreground">Minimum seviyede</p>
            <div className="flex items-center text-xs text-yellow-600 mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Dikkat gerekli
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Toplam Hareket</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,500 Ton</div>
            <p className="text-xs text-muted-foreground">Giriş + Çıkış</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% geçen aya göre
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="stok-listesi" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Stok Listesi
          </TabsTrigger>
          <TabsTrigger value="stok-giris" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Stok Giriş
          </TabsTrigger>
          <TabsTrigger value="stok-cikis" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Stok Çıkış
          </TabsTrigger>
          <TabsTrigger value="urun-tanimlari" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Ürün Tanımları
          </TabsTrigger>
          <TabsTrigger value="raporlar" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Raporlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stok-listesi" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Stok Kayıtları
              </CardTitle>
              <CardDescription>
                Tüm stok giriş ve çıkış işlemlerini görüntüleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <UltraProfessionalTable
                data={stokKayitlari}
                columns={stokGirisColumns}
                title="Stok Giriş Kayıtları"
                description="Ürün alım ve depo giriş işlemleri"
                searchPlaceholder="Ürün, tedarikçi veya stok kodu ile ara..."
                enableSearch
                enableFilters
                enableExport
                enableColumnVisibility
                enableRowSelection
                onAdd={() => setActiveTab('stok-giris')}
                onExport={(format) => {
                  alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                }}
                onRefresh={() => window.location.reload()}
                showMetrics
                metrics={{
                  total: stokKayitlari.length,
                  active: stokKayitlari.length,
                  pending: 0,
                  completed: stokKayitlari.length
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stok-giris" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Yeni Stok Girişi
              </CardTitle>
              <CardDescription>
                Ürün alımı ve depo giriş işlemlerini kaydedin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ürün Bilgileri</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ürün</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={formData.urun}
                        onChange={(e) => setFormData(prev => ({ ...prev, urun: e.target.value }))}
                      >
                        <option value="">Ürün seçin</option>
                        <option value="misir">Mısır</option>
                        <option value="bugday">Buğday</option>
                        <option value="soya-yagi">Soya Yağı</option>
                        <option value="aycekregi-yagi">Ayçiçreği Yağı</option>
                        <option value="arpa">Arpa</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Miktar (Ton)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          placeholder="0"
                          value={formData.miktar}
                          onChange={(e) => setFormData(prev => ({ ...prev, miktar: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Alış Fiyatı (USD/Ton)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          placeholder="0.00"
                          value={formData.alisFiyati}
                          onChange={(e) => setFormData(prev => ({ ...prev, alisFiyati: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tedarikçi ve Lokasyon</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tedarikçi</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={formData.tedarikci}
                        onChange={(e) => setFormData(prev => ({ ...prev, tedarikci: e.target.value }))}
                      >
                        <option value="">Tedarikçi seçin</option>
                        <option value="abc-tarim">ABC Tarım</option>
                        <option value="xyz-gida">XYZ Gıda</option>
                        <option value="donmezoğlu-antrepo">Dönmezoğlu Antrepo</option>
                        <option value="mersin-antrepo">Mersin Antrepo</option>
                        <option value="iskenderun-limani">İskenderun Limanı</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Depo/Antrepo</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={formData.depo}
                        onChange={(e) => setFormData(prev => ({ ...prev, depo: e.target.value }))}
                      >
                        <option value="">Depo seçin</option>
                        <option value="donmezoğlu">Dönmezoğlu Antrepo</option>
                        <option value="mersin">Mersin Antrepo</option>
                        <option value="iskenderun">İskenderun Limanı</option>
                        <option value="ankara">Ankara Depo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Şirket ve Ortaklık</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Kim Adına</label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={formData.kimAdina}
                          onChange={(e) => setFormData(prev => ({ ...prev, kimAdina: e.target.value }))}
                        >
                          <option value="">Ortak seçin</option>
                          <option value="serzat">Şerzat</option>
                          <option value="amanj">Amanj</option>
                          <option value="velit">Velit</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Şirket</label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={formData.sirket}
                          onChange={(e) => setFormData(prev => ({ ...prev, sirket: e.target.value }))}
                        >
                          <option value="">Şirket seçin</option>
                          <option value="zad-agro">Zad Agro</option>
                          <option value="global-agro">Global Agro</option>
                          <option value="yilmaz-transport">Yılmaz Transport</option>
                          <option value="yilmaz-tarim">Yılmaz Tarım</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Teslim Şekli</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={formData.teslimSekli}
                        onChange={(e) => setFormData(prev => ({ ...prev, teslimSekli: e.target.value }))}
                      >
                        <option value="">Teslim şekli seçin</option>
                        <option value="antrepo-teslim">Antrepo Teslim</option>
                        <option value="gemi-cif">Gemi (CIF) Üstü</option>
                        <option value="yurtdisi-alim">Yurtdışı Alım</option>
                        <option value="transit">Transit</option>
                        <option value="ithalat">İthalat</option>
                        <option value="ihracat">İhracat</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button onClick={handleStokGirisi} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Stok Girişi Kaydet
                  </Button>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Günlük Stok Durumu</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Mısır</p>
                          <p className="text-sm text-muted-foreground">Dönmezoğlu Antrepo</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">5,240 Ton</p>
                          <p className="text-xs text-muted-foreground">Normal Seviye</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium">Buğday</p>
                          <p className="text-sm text-muted-foreground">Mersin Antrepo</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-yellow-600">1,120 Ton</p>
                          <p className="text-xs text-muted-foreground">Düşük Seviye</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">Soya Yağı</p>
                          <p className="text-sm text-muted-foreground">İskenderun Limanı</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">340 Ton</p>
                          <p className="text-xs text-muted-foreground">Kritik Seviye</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stok-cikis" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Stok Çıkış Kayıtları
              </CardTitle>
              <CardDescription>
                Sevkiyat ve stok çıkış işlemlerini görüntüleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <UltraProfessionalTable
                data={stokCikislari}
                columns={stokCikisColumns}
                title="Stok Çıkış Kayıtları"
                description="Sevkiyat ve araç bazlı çıkış işlemleri"
                enableSearch
                enableFilters
                enableExport
                enableColumnVisibility
                enableRowSelection
                onAdd={() => alert('Yeni stok çıkış formu yakında eklenecek')}
                onExport={(format) => {
                  alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                }}
                onRefresh={() => window.location.reload()}
                showMetrics
                metrics={{
                  total: stokCikislari.length,
                  active: stokCikislari.length,
                  pending: 0,
                  completed: stokCikislari.length
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urun-tanimlari" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Ürün Tanımları
              </CardTitle>
              <CardDescription>
                Sistem ürün kataloğunu yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <UltraProfessionalTable
                data={urunler}
                columns={urunTanimlariColumns}
                title="Ürün Kataloğu"
                description="Tüm ürün tanımları ve kategorileri"
                enableSearch
                enableFilters
                enableExport
                enableColumnVisibility
                enableRowSelection
                onAdd={() => alert('Yeni ürün tanımlama formu yakında eklenecek')}
                onExport={(format) => {
                  alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                }}
                onRefresh={() => window.location.reload()}
                showMetrics
                metrics={{
                  total: urunler.length,
                  active: urunler.length,
                  pending: 0,
                  completed: urunler.length
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raporlar" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Stok Raporları
                </CardTitle>
                <CardDescription>
                  Detaylı stok analiz ve raporları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Stok Durum Raporu
                  </Button>
                  <Button className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Hareket Analizi
                  </Button>
                  <Button className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Değer Analizi
                  </Button>
                  <Button className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Envanter Sayım
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hızlı İstatistikler</CardTitle>
                <CardDescription>
                  Güncel stok durumu özeti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Toplam Ürün Çeşidi</span>
                    <span className="font-semibold">{urunler.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Aktif Stok Kayıtları</span>
                    <span className="font-semibold">{stokKayitlari.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bekleyen Sevkiyatlar</span>
                    <span className="font-semibold">{stokCikislari.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Toplam Stok Değeri</span>
                    <span className="font-semibold text-green-600">$2.8M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StokYonetimi;

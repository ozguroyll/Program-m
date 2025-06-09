import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UltraProfessionalTable } from '@/components/ui/ultra-professional-table';

import { Package, Truck, Building2, FileText, Plus, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ColumnDef } from '@tanstack/react-table';

interface StokKaydi {
  id: string;
  urun: string;
  miktar: number;
  birim: string;
  alisFiyati: number;
  tedarikci: string;
  depo: string;
  kimAdina: string;
  sirket: string;
  tarih: string;
  durum: string;
}

interface StokCikis {
  id: string;
  urun: string;
  miktar: number;
  aracPlaka: string;
  sofor: string;
  musteri: string;
  depo: string;
  romorkTipi: string;
  tarih: string;
  durum: string;
}

interface UrunTanimi {
  id: string;
  ad: string;
  kategori: string;
  birim: string;
  aciklama: string;
}

export function StokYonetimi() {
  const [activeTab, setActiveTab] = useState('stok-listesi');
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

  const createAutomaticAccountingEntry = (stokKaydi: StokKaydi) => {
    const cariIslemData = {
      id: `CI-${Date.now()}`,
      cariAdi: stokKaydi.kimAdina,
      islemTipi: 'Borç',
      tutar: stokKaydi.miktar * stokKaydi.alisFiyati,
      doviz: 'USD',
      aciklama: `${stokKaydi.urun} stok alımı - ${stokKaydi.miktar} ${stokKaydi.birim}`,
      tarih: new Date().toISOString().split('T')[0],
      durum: 'Onaylandı'
    };

    const giderKaydiData = {
      id: `GD-${Date.now()}`,
      kategori: 'Stok Alımı',
      tutar: stokKaydi.miktar * stokKaydi.alisFiyati,
      doviz: 'USD',
      aciklama: `${stokKaydi.urun} alımı - ${stokKaydi.tedarikci}`,
      tarih: new Date().toISOString().split('T')[0]
    };

    console.log('Cari İşlem Data:', cariIslemData);
    console.log('Gider Kaydı Data:', giderKaydiData);

    toast({
      title: "Muhasebe Entegrasyonu",
      description: `Cari işlem ve gider kaydı otomatik oluşturuldu`,
    });
  };

  const handleStokGirisi = () => {
    if (!formData.urun || !formData.miktar || !formData.alisFiyati || !formData.tedarikci || !formData.kimAdina || !formData.sirket) {
      toast({
        title: "Hata",
        description: "Lütfen zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    const yeniStokKaydi: StokKaydi = {
      id: `STK-${Date.now()}`,
      urun: formData.urun,
      miktar: parseFloat(formData.miktar),
      birim: 'Ton',
      alisFiyati: parseFloat(formData.alisFiyati),
      tedarikci: formData.tedarikci,
      depo: formData.depo || 'Belirlenmedi',
      kimAdina: formData.kimAdina,
      sirket: formData.sirket,
      tarih: new Date().toISOString().split('T')[0],
      durum: 'Onaylandı'
    };

    createAutomaticAccountingEntry(yeniStokKaydi);

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
  };

  const stokKayitlari: StokKaydi[] = [
    {
      id: "STK-001",
      urun: "Mısır",
      miktar: 5000,
      birim: "Ton",
      alisFiyati: 280,
      tedarikci: "ABC Tarım",
      depo: "Dönmezoğlu Antrepo",
      kimAdina: "Şerzat",
      sirket: "Zad Agro",
      tarih: "2024-01-15",
      durum: "Onaylandı"
    },
    {
      id: "STK-002",
      urun: "Buğday",
      miktar: 3200,
      birim: "Ton",
      alisFiyati: 320,
      tedarikci: "XYZ Gıda",
      depo: "Mersin Antrepo",
      kimAdina: "Amanj",
      sirket: "Global Agro",
      tarih: "2024-01-16",
      durum: "Beklemede"
    },
    {
      id: "STK-003",
      urun: "Soya Yağı",
      miktar: 800,
      birim: "Ton",
      alisFiyati: 1200,
      tedarikci: "Dönmezoğlu Antrepo",
      depo: "İskenderun Limanı",
      kimAdina: "Şerzat",
      sirket: "Zad Agro",
      tarih: "2024-01-17",
      durum: "Teslim Alındı"
    }
  ];

  const stokCikislari: StokCikis[] = [
    {
      id: "CKS-001",
      urun: "Mısır",
      miktar: 25,
      aracPlaka: "34 ABC 123",
      sofor: "Mehmet Yılmaz",
      musteri: "Khoshnaw",
      depo: "Dönmezoğlu Antrepo",
      romorkTipi: "Damperli",
      tarih: "2024-01-18",
      durum: "Yükleniyor"
    },
    {
      id: "CKS-002",
      urun: "Buğday",
      miktar: 30,
      aracPlaka: "06 XYZ 456",
      sofor: "Ali Demir",
      musteri: "Kaiwan",
      depo: "Mersin Antrepo",
      romorkTipi: "Sal Kasa",
      tarih: "2024-01-19",
      durum: "Yolda"
    }
  ];

  const urunTanimlari: UrunTanimi[] = [
    { id: "URN-001", ad: "Mısır", kategori: "Hububat", birim: "Ton", aciklama: "Sarı mısır, %14 nem" },
    { id: "URN-002", ad: "Buğday", kategori: "Hububat", birim: "Ton", aciklama: "Ekmeklik buğday, protein %12" },
    { id: "URN-003", ad: "Soya Yağı", kategori: "Yağ", birim: "Ton", aciklama: "Ham soya yağı" },
    { id: "URN-004", ad: "Ayçiçreği Yağı", kategori: "Yağ", birim: "Ton", aciklama: "Ham ayçiçreği yağı" },
    { id: "URN-005", ad: "Arpa", kategori: "Hububat", birim: "Ton", aciklama: "Yem arpası" }
  ];



  const stokGirisColumns: ColumnDef<StokKaydi>[] = [
    {
      accessorKey: "id",
      header: "Stok Kodu",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium text-blue-600">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: "urun",
      header: "Ürün Adı",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('urun')}</div>
          <div className="text-sm text-gray-500">Kategori: Hububat</div>
        </div>
      ),
    },
    {
      accessorKey: "miktar",
      header: "Miktar",
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-semibold">
            {parseFloat(row.getValue('miktar')).toLocaleString('tr-TR')} {row.original.birim}
          </div>
          <div className="text-xs text-gray-500">Min: 500 {row.original.birim}</div>
        </div>
      ),
    },
    {
      accessorKey: "alisFiyati",
      header: "Alış Fiyatı",
      cell: ({ row }) => (
        <div className="text-right font-semibold text-green-600">
          ${Number(row.getValue('alisFiyati')).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      accessorKey: "toplam",
      header: "Toplam Değer",
      cell: ({ row }) => {
        const toplam = parseFloat(String(row.original.miktar)) * parseFloat(String(row.original.alisFiyati));
        return (
          <div className="text-right">
            <div className="font-bold text-blue-600">
              ${toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">
              ₺{(toplam * 32.5).toLocaleString('tr-TR')}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tedarikci",
      header: "Tedarikçi",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('tedarikci')}</div>
          <div className="text-xs text-gray-500">SUP-001</div>
        </div>
      ),
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

  const stokCikisColumns: ColumnDef<StokCikis>[] = [
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
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('urun')}</div>
          <div className="text-sm text-gray-500">Kategori: Hububat</div>
        </div>
      ),
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
      accessorKey: "aracPlaka",
      header: "Araç Plaka",
      cell: ({ row }) => (
        <div>
          <div className="font-mono text-sm font-medium">{row.getValue('aracPlaka')}</div>
          <div className="text-xs text-gray-500">{row.original.romorkTipi}</div>
        </div>
      ),
    },
    {
      accessorKey: "sofor",
      header: "Şoför",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('sofor')}</div>
      ),
    },
    {
      accessorKey: "musteri",
      header: "Müşteri",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('musteri')}</div>
          <div className="text-xs text-gray-500">MUS-001</div>
        </div>
      ),
    },
    {
      accessorKey: "depo",
      header: "Çıkış Deposu",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-medium">
          {row.getValue('depo')}
        </Badge>
      ),
    },
    {
      accessorKey: "romorkTipi",
      header: "Römork Tipi",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('romorkTipi')}
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

  const urunTanimlariColumns: ColumnDef<UrunTanimi>[] = [
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
            <div className="text-2xl font-bold">{stokCikislari.filter(s => s.durum !== 'Teslim Edildi').length}</div>
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
                  active: stokKayitlari.filter(s => s.durum === 'Onaylandı').length,
                  pending: stokKayitlari.filter(s => s.durum === 'Beklemede').length,
                  completed: stokKayitlari.filter(s => s.durum === 'Tamamlandı').length
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
                  active: stokCikislari.filter(s => s.durum === 'Yolda').length,
                  pending: stokCikislari.filter(s => s.durum === 'Yükleniyor').length,
                  completed: stokCikislari.filter(s => s.durum === 'Teslim Edildi').length
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
                data={urunTanimlari}
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
                  total: urunTanimlari.length,
                  active: urunTanimlari.length,
                  pending: 0,
                  completed: urunTanimlari.length
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
                    <span className="font-semibold">{urunTanimlari.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Aktif Stok Kayıtları</span>
                    <span className="font-semibold">{stokKayitlari.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bekleyen Sevkiyatlar</span>
                    <span className="font-semibold">{stokCikislari.filter(s => s.durum !== 'Teslim Edildi').length}</span>
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

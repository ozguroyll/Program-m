import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { UltraProfessionalTable } from '@/components/ui/ultra-professional-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, TrendingUp, TrendingDown, Plus, Save, Download, DollarSign, FileText, BarChart3, PieChart } from 'lucide-react';
import { format } from 'date-fns';

interface GelirKaydi {
  id: string;
  tarih: string;
  kategori: string;
  altKategori: string;
  aciklama: string;
  tutar: number;
  doviz: string;
  sirket: string;
  cari: string;
  belgeNo: string;
  durum: 'Onaylandi' | 'Beklemede' | 'Iptal';
}

interface GiderKaydi {
  id: string;
  tarih: string;
  kategori: string;
  altKategori: string;
  aciklama: string;
  tutar: number;
  doviz: string;
  sirket: string;
  cari: string;
  belgeNo: string;
  durum: 'Onaylandi' | 'Beklemede' | 'Iptal';
}

export default function GelirGiderYonetimi() {
  const [activeTab, setActiveTab] = useState('gelir-kayit');
  const [selectedDate, setSelectedDate] = useState<Date>();

  const gelirKategorileri = [
    { kategori: 'Satış Gelirleri', altKategoriler: ['Mısır Satışı', 'Buğday Satışı', 'Soya Yağı Satışı', 'Küspe Satışı'] },
    { kategori: 'Komisyon Gelirleri', altKategoriler: ['Alış Komisyonu', 'Satış Komisyonu', 'Nakliye Komisyonu', 'Gümrük Komisyonu'] },
    { kategori: 'Kur Farkı Gelirleri', altKategoriler: ['USD Kur Farkı', 'EUR Kur Farkı', 'Diğer Döviz Farkları'] },
    { kategori: 'Diğer Gelirler', altKategoriler: ['Faiz Gelirleri', 'Kira Gelirleri', 'Çeşitli Gelirler'] }
  ];

  const giderKategorileri = [
    { kategori: 'Satış Maliyetleri', altKategoriler: ['Ürün Alış Maliyeti', 'Nakliye Giderleri', 'Gümrük Giderleri', 'Sigorta Giderleri'] },
    { kategori: 'Operasyonel Giderler', altKategoriler: ['Personel Giderleri', 'Ofis Giderleri', 'İletişim Giderleri', 'Seyahat Giderleri'] },
    { kategori: 'Mali Giderler', altKategoriler: ['Banka Komisyonları', 'Faiz Giderleri', 'Kur Farkı Giderleri'] },
    { kategori: 'Diğer Giderler', altKategoriler: ['Vergi ve Harçlar', 'Danışmanlık Giderleri', 'Çeşitli Giderler'] }
  ];

  const sirketler = ['Yılmaz Transport', 'Yılmaz Tarım', 'Zad Agro', 'Global Agro'];

  const gelirKayitlari: GelirKaydi[] = [
    {
      id: '1',
      tarih: '2025-06-08',
      kategori: 'Satış Gelirleri',
      altKategori: 'Mısır Satışı',
      aciklama: 'Khoshnaw Trading - 2000 Ton Mısır',
      tutar: 520000,
      doviz: 'USD',
      sirket: 'Zad Agro',
      cari: 'Khoshnaw Trading',
      belgeNo: 'SAT-2025-001',
      durum: 'Onaylandi'
    },
    {
      id: '2',
      tarih: '2025-06-07',
      kategori: 'Komisyon Gelirleri',
      altKategori: 'Satış Komisyonu',
      aciklama: 'Kaiwan Group komisyon',
      tutar: 15000,
      doviz: 'USD',
      sirket: 'Global Agro',
      cari: 'Kaiwan Group',
      belgeNo: 'KOM-2025-012',
      durum: 'Onaylandi'
    }
  ];

  const giderKayitlari: GiderKaydi[] = [
    {
      id: '1',
      tarih: '2025-06-08',
      kategori: 'Satış Maliyetleri',
      altKategori: 'Ürün Alış Maliyeti',
      aciklama: 'Cargill - 2000 Ton Mısır Alımı',
      tutar: 480000,
      doviz: 'USD',
      sirket: 'Zad Agro',
      cari: 'Cargill Turkey',
      belgeNo: 'ALI-2025-045',
      durum: 'Onaylandi'
    },
    {
      id: '2',
      tarih: '2025-06-07',
      kategori: 'Operasyonel Giderler',
      altKategori: 'Nakliye Giderleri',
      aciklama: 'Irak nakliye - 5 araç',
      tutar: 8500,
      doviz: 'USD',
      sirket: 'Yılmaz Transport',
      cari: 'Özkan Nakliyat',
      belgeNo: 'NAK-2025-089',
      durum: 'Onaylandi'
    }
  ];

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Onaylandi': return 'default';
      case 'Beklemede': return 'secondary';
      case 'Iptal': return 'destructive';
      default: return 'outline';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  const gelirColumns = [
    {
      accessorKey: "tarih",
      header: "Tarih",
      cell: ({ row }: any) => new Date(row.getValue("tarih")).toLocaleDateString('tr-TR')
    },
    {
      accessorKey: "altKategori",
      header: "Kategori",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue("altKategori")}</div>
          <div className="text-sm text-muted-foreground">{row.original.aciklama}</div>
        </div>
      )
    },
    {
      accessorKey: "tutar",
      header: "Tutar",
      cell: ({ row }: any) => (
        <span className="font-mono text-green-600 font-medium">
          {formatCurrency(row.getValue("tutar"), row.original.doviz)}
        </span>
      )
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }: any) => (
        <Badge variant={getDurumColor(row.getValue("durum"))}>
          {row.getValue("durum")}
        </Badge>
      )
    }
  ];

  const giderColumns = [
    {
      accessorKey: "tarih",
      header: "Tarih",
      cell: ({ row }: any) => new Date(row.getValue("tarih")).toLocaleDateString('tr-TR')
    },
    {
      accessorKey: "altKategori",
      header: "Kategori",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue("altKategori")}</div>
          <div className="text-sm text-muted-foreground">{row.original.aciklama}</div>
        </div>
      )
    },
    {
      accessorKey: "tutar",
      header: "Tutar",
      cell: ({ row }: any) => (
        <span className="font-mono text-red-600 font-medium">
          {formatCurrency(row.getValue("tutar"), row.original.doviz)}
        </span>
      )
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }: any) => (
        <Badge variant={getDurumColor(row.getValue("durum"))}>
          {row.getValue("durum")}
        </Badge>
      )
    }
  ];

  const toplamGelir = gelirKayitlari.reduce((sum, item) => sum + item.tutar, 0);
  const toplamGider = giderKayitlari.reduce((sum, item) => sum + item.tutar, 0);
  const netKar = toplamGelir - toplamGider;

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gelir/Gider Yönetimi</h2>
          <p className="text-muted-foreground">Gelir ve gider kayıtlarını yönetin ve analiz edin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapor Al
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kayıt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bu Ay Gelir</p>
              <p className="text-2xl font-bold text-green-600">$1,850,000</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% geçen aya göre
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bu Ay Gider</p>
              <p className="text-2xl font-bold text-orange-600">$1,250,000</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingDown className="w-3 h-3 mr-1" />
                +8% geçen aya göre
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Kar</p>
              <p className="text-2xl font-bold text-blue-600">$600,000</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <DollarSign className="w-3 h-3 mr-1" />
                +25% geçen aya göre
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kar Marjı</p>
              <p className="text-2xl font-bold text-green-600">32.4%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <PieChart className="w-3 h-3 mr-1" />
                +3.2% geçen aya göre
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gelir-kayit" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Gelir Kaydı
          </TabsTrigger>
          <TabsTrigger value="gider-kayit" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Gider Kaydı
          </TabsTrigger>
          <TabsTrigger value="islem-listesi" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            İşlem Listesi
          </TabsTrigger>
          <TabsTrigger value="raporlar" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Raporlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gelir-kayit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Gelir Kaydı Formu
              </CardTitle>
              <CardDescription>
                Yeni gelir kaydı oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gelir-tarih">Tarih *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-sirket">Şirket *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Şirket seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {sirketler.map((sirket) => (
                        <SelectItem key={sirket} value={sirket}>
                          {sirket}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-kategori">Kategori *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {gelirKategorileri.map((kat) => (
                        <SelectItem key={kat.kategori} value={kat.kategori}>
                          {kat.kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-alt-kategori">Alt Kategori *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Alt kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="misir-satisi">Mısır Satışı</SelectItem>
                      <SelectItem value="bugday-satisi">Buğday Satışı</SelectItem>
                      <SelectItem value="komisyon">Komisyon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-tutar">Tutar *</Label>
                  <Input id="gelir-tutar" type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-doviz">Döviz *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Döviz seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">TRY - Türk Lirası</SelectItem>
                      <SelectItem value="USD">USD - Amerikan Doları</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-cari">Cari *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Cari seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="khoshnaw">Khoshnaw Trading</SelectItem>
                      <SelectItem value="kaiwan">Kaiwan Group</SelectItem>
                      <SelectItem value="cargill">Cargill Turkey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-belge">Belge No</Label>
                  <Input id="gelir-belge" placeholder="Belge numarası" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelir-durum">Durum</Label>
                  <Select defaultValue="beklemede">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beklemede">Beklemede</SelectItem>
                      <SelectItem value="onaylandi">Onaylandı</SelectItem>
                      <SelectItem value="iptal">İptal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gelir-aciklama">Açıklama</Label>
                <Textarea 
                  id="gelir-aciklama" 
                  placeholder="Gelir kaydı açıklaması..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </Button>
                <Button variant="outline">
                  Temizle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gider-kayit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Gider Kaydı Formu
              </CardTitle>
              <CardDescription>
                Yeni gider kaydı oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gider-tarih">Tarih *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-sirket">Şirket *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Şirket seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {sirketler.map((sirket) => (
                        <SelectItem key={sirket} value={sirket}>
                          {sirket}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-kategori">Kategori *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {giderKategorileri.map((kat) => (
                        <SelectItem key={kat.kategori} value={kat.kategori}>
                          {kat.kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-alt-kategori">Alt Kategori *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Alt kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urun-alis">Ürün Alış Maliyeti</SelectItem>
                      <SelectItem value="nakliye">Nakliye Giderleri</SelectItem>
                      <SelectItem value="gumruk">Gümrük Giderleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-tutar">Tutar *</Label>
                  <Input id="gider-tutar" type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-doviz">Döviz *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Döviz seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">TRY - Türk Lirası</SelectItem>
                      <SelectItem value="USD">USD - Amerikan Doları</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-cari">Cari *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Cari seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cargill">Cargill Turkey</SelectItem>
                      <SelectItem value="ozkan">Özkan Nakliyat</SelectItem>
                      <SelectItem value="gumruk">Gümrük Müşavirliği</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-belge">Belge No</Label>
                  <Input id="gider-belge" placeholder="Belge numarası" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gider-durum">Durum</Label>
                  <Select defaultValue="beklemede">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beklemede">Beklemede</SelectItem>
                      <SelectItem value="onaylandi">Onaylandı</SelectItem>
                      <SelectItem value="iptal">İptal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gider-aciklama">Açıklama</Label>
                <Textarea 
                  id="gider-aciklama" 
                  placeholder="Gider kaydı açıklaması..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </Button>
                <Button variant="outline">
                  Temizle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="islem-listesi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Gelir Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UltraProfessionalTable
                  data={gelirKayitlari}
                  columns={gelirColumns}
                  title="Gelir Kayıtları"
                  description="Tüm gelir kayıtları ve analizi"
                  searchPlaceholder="Açıklama, kategori veya şirket ile ara..."
                  enableSearch
                  enableFilters
                  enableExport
                  enableColumnVisibility
                  enableRowSelection
                  onExport={(format) => {
                    alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                  }}
                  onRefresh={() => window.location.reload()}
                  showMetrics
                  metrics={{
                    total: gelirKayitlari.length,
                    active: gelirKayitlari.filter(g => g.durum === 'Onaylandi').length,
                    pending: gelirKayitlari.filter(g => g.durum === 'Beklemede').length,
                    completed: gelirKayitlari.filter(g => g.kategori === 'Satış Gelirleri').length
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Gider Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UltraProfessionalTable
                  data={giderKayitlari}
                  columns={giderColumns}
                  title="Gider Kayıtları"
                  description="Tüm gider kayıtları ve analizi"
                  searchPlaceholder="Açıklama, kategori veya şirket ile ara..."
                  enableSearch
                  enableFilters
                  enableExport
                  enableColumnVisibility
                  enableRowSelection
                  onExport={(format) => {
                    alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                  }}
                  onRefresh={() => window.location.reload()}
                  showMetrics
                  metrics={{
                    total: giderKayitlari.length,
                    active: giderKayitlari.filter(g => g.durum === 'Onaylandi').length,
                    pending: giderKayitlari.filter(g => g.durum === 'Beklemede').length,
                    completed: giderKayitlari.filter(g => g.kategori === 'Operasyonel Giderler').length
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="raporlar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(toplamGelir, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bu ay +12.5% artış
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Gider</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(toplamGider, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bu ay +8.2% artış
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Kar/Zarar</CardTitle>
                <DollarSign className={`h-4 w-4 ${netKar >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netKar >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netKar, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {netKar >= 0 ? 'Kar' : 'Zarar'} durumu
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Gelir Dağılımı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satış Gelirleri</span>
                    <span className="font-mono text-sm">$520,000 (97.2%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Komisyon Gelirleri</span>
                    <span className="font-mono text-sm">$15,000 (2.8%)</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Detaylı Rapor
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Gider Dağılımı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satış Maliyetleri</span>
                    <span className="font-mono text-sm">$480,000 (98.3%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Operasyonel Giderler</span>
                    <span className="font-mono text-sm">$8,500 (1.7%)</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Detaylı Rapor
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
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

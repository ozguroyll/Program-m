import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Plus, Save, Download, Eye, Printer, Calculator, Package, Trash2, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { UltraProfessionalTable } from '@/components/ui/ultra-professional-table';

interface FaturaKalemi {
  id: string;
  urunKodu: string;
  urunAdi: string;
  miktar: number;
  birim: string;
  birimFiyat: number;
  kdvOrani: number;
  tutar: number;
  kdvTutari: number;
  toplamTutar: number;
}

interface Fatura {
  id: string;
  faturaNo: string;
  faturatarihi: string;
  vadeTarihi: string;
  faturaType: 'Satis' | 'Alis';
  cariKodu: string;
  cariAdi: string;
  sirket: string;
  dovizTipi: 'TRY' | 'USD' | 'EUR';
  araToplam: number;
  kdvToplam: number;
  genelToplam: number;
  durum: 'Taslak' | 'Onaylandi' | 'Odendi' | 'Iptal';
  aciklama: string;
  kalemler: FaturaKalemi[];
  olusturanKullanici: string;
}

interface FaturaOzet {
  toplamSatisFatura: number;
  toplamAlisFatura: number;
  bekleyenOdemeler: number;
  buAyToplam: number;
  odenmemisFaturalar: number;
  vadesiGecenler: number;
}

export function FaturaYonetimi() {
  const [selectedDate, setSelectedDate] = useState<Date>();


  const faturaColumns = [
    {
      accessorKey: 'faturaNo',
      header: 'Fatura No',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue('faturaNo')}</div>
      ),
    },
    {
      accessorKey: 'faturatarihi',
      header: 'Tarih',
      cell: ({ row }: any) => (
        <div>{new Date(row.getValue('faturatarihi')).toLocaleDateString('tr-TR')}</div>
      ),
    },
    {
      accessorKey: 'cariAdi',
      header: 'Cari',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue('cariAdi')}</div>
      ),
    },
    {
      accessorKey: 'faturaType',
      header: 'Tip',
      cell: ({ row }: any) => {
        const tip = row.getValue('faturaType') as string;
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            tip === 'Satis' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {tip === 'Satis' ? 'Satış' : 'Alış'}
          </div>
        );
      },
    },
    {
      accessorKey: 'genelToplam',
      header: 'Tutar',
      cell: ({ row }: any) => (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue('genelToplam'), row.original.dovizTipi)}
        </div>
      ),
    },
    {
      accessorKey: 'durum',
      header: 'Durum',
      cell: ({ row }: any) => {
        const durum = row.getValue('durum') as string;
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDurumColor(durum)}`}>
            {durum}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'İşlemler',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title={`Fatura ${row.original.faturaNo} görüntüle`}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title={`Fatura ${row.original.faturaNo} indir`}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
  const [selectedCari, setSelectedCari] = useState('');
  const [faturaKalemleri, setFaturaKalemleri] = useState<FaturaKalemi[]>([]);

  const sirketler = [
    { kod: 'ZAD', ad: 'Zad Agro' },
    { kod: 'GLOBAL', ad: 'Global Agro' },
    { kod: 'YILMAZ_T', ad: 'Yılmaz Transport' },
    { kod: 'YILMAZ_A', ad: 'Yılmaz Tarım' }
  ];

  const cariListesi = [
    { kod: 'KHOSH001', ad: 'Khoshnaw Trading', tip: 'Müşteri' },
    { kod: 'KAIWAN001', ad: 'Kaiwan Group', tip: 'Müşteri' },
    { kod: 'SERZAT001', ad: 'Şerzat Bey', tip: 'Ortak' },
    { kod: 'AMANJ001', ad: 'Amanj Bey', tip: 'Ortak' },
    { kod: 'CARGILL001', ad: 'Cargill Turkey', tip: 'Tedarikçi' },
    { kod: 'ADM001', ad: 'ADM Turkey', tip: 'Tedarikçi' }
  ];

  const urunListesi = [
    { kod: 'MISIR001', ad: 'Mısır', birim: 'Ton', fiyat: 250 },
    { kod: 'BUGDAY001', ad: 'Buğday', birim: 'Ton', fiyat: 280 },
    { kod: 'ARPA001', ad: 'Arpa', birim: 'Ton', fiyat: 220 },
    { kod: 'SOYA_YAG001', ad: 'Soya Yağı', birim: 'Ton', fiyat: 850 },
    { kod: 'SOYA_KUSPE001', ad: 'Soya Küspesi', birim: 'Ton', fiyat: 420 }
  ];

  const faturalar: Fatura[] = [
    {
      id: 'FAT001',
      faturaNo: 'ZAD-2025-001',
      faturatarihi: '2025-06-08',
      vadeTarihi: '2025-06-23',
      faturaType: 'Satis',
      cariKodu: 'KHOSH001',
      cariAdi: 'Khoshnaw Trading',
      sirket: 'Zad Agro',
      dovizTipi: 'USD',
      araToplam: 125000,
      kdvToplam: 0,
      genelToplam: 125000,
      durum: 'Onaylandi',
      aciklama: '5000 ton mısır satışı',
      kalemler: [],
      olusturanKullanici: 'Admin'
    },
    {
      id: 'FAT002',
      faturaNo: 'GLOBAL-2025-001',
      faturatarihi: '2025-06-07',
      vadeTarihi: '2025-06-22',
      faturaType: 'Alis',
      cariKodu: 'CARGILL001',
      cariAdi: 'Cargill Turkey',
      sirket: 'Global Agro',
      dovizTipi: 'USD',
      araToplam: 87500,
      kdvToplam: 0,
      genelToplam: 87500,
      durum: 'Odendi',
      aciklama: '3500 ton buğday alımı',
      kalemler: [],
      olusturanKullanici: 'Admin'
    },
    {
      id: 'FAT003',
      faturaNo: 'ZAD-2025-002',
      faturatarihi: '2025-06-06',
      vadeTarihi: '2025-06-21',
      faturaType: 'Satis',
      cariKodu: 'KAIWAN001',
      cariAdi: 'Kaiwan Group',
      sirket: 'Zad Agro',
      dovizTipi: 'USD',
      araToplam: 68000,
      kdvToplam: 0,
      genelToplam: 68000,
      durum: 'Taslak',
      aciklama: '2000 ton soya yağı satışı',
      kalemler: [],
      olusturanKullanici: 'Admin'
    }
  ];

  const faturaOzet: FaturaOzet = {
    toplamSatisFatura: 193000,
    toplamAlisFatura: 87500,
    bekleyenOdemeler: 68000,
    buAyToplam: 280500,
    odenmemisFaturalar: 2,
    vadesiGecenler: 0
  };

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Onaylandi': return 'bg-green-100 text-green-800';
      case 'Odendi': return 'bg-blue-100 text-blue-800';
      case 'Taslak': return 'bg-gray-100 text-gray-800';
      case 'Iptal': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };



  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const yeniKalemEkle = () => {
    const yeniKalem: FaturaKalemi = {
      id: `KALEM${faturaKalemleri.length + 1}`,
      urunKodu: '',
      urunAdi: '',
      miktar: 0,
      birim: '',
      birimFiyat: 0,
      kdvOrani: 0,
      tutar: 0,
      kdvTutari: 0,
      toplamTutar: 0
    };
    setFaturaKalemleri([...faturaKalemleri, yeniKalem]);
  };

  const kalemSil = (id: string) => {
    setFaturaKalemleri(faturaKalemleri.filter(kalem => kalem.id !== id));
  };



  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fatura Yönetimi</h2>
          <p className="text-muted-foreground">Satış ve alış fatura işlemlerini yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Rapor Al
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Fatura
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="fatura-olustur" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Fatura Oluştur
          </TabsTrigger>
          <TabsTrigger value="fatura-listesi" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Fatura Listesi
          </TabsTrigger>
          <TabsTrigger value="fatura-takip" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Fatura Takip
          </TabsTrigger>
          <TabsTrigger value="raporlar" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Raporlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bu Ay Satış</p>
                  <p className="text-2xl font-bold text-green-600">$1,250,000</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Bu Ay Alış</p>
                  <p className="text-2xl font-bold text-blue-600">$850,000</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% geçen aya göre
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
                  <p className="text-sm font-medium text-muted-foreground">Bekleyen Faturalar</p>
                  <p className="text-2xl font-bold text-orange-600">12</p>
                  <p className="text-xs text-muted-foreground">Onay bekliyor</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ödenen Faturalar</p>
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    +5% geçen aya göre
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fatura-olustur" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Fatura Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Yeni satış veya alış faturası oluşturun
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fatura-no">Fatura No *</Label>
                        <Input id="fatura-no" placeholder="Otomatik oluşturulacak" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatura-tarihi">Fatura Tarihi *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: tr }) : "Tarih seçin"}
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
                        <Label htmlFor="vade-tarihi">Vade Tarihi</Label>
                        <Input id="vade-tarihi" type="date" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cari-secim">Cari *</Label>
                        <Select value={selectedCari} onValueChange={setSelectedCari}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cari seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {cariListesi.map((cari) => (
                              <SelectItem key={cari.kod} value={cari.kod}>
                                {cari.ad} - {cari.kod}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sirket">Şirket *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Şirket seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {sirketler.map((sirket) => (
                              <SelectItem key={sirket.kod} value={sirket.kod}>
                                {sirket.ad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fatura-tipi">Fatura Tipi *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tip seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="satis">Satış Faturası</SelectItem>
                            <SelectItem value="alis">Alış Faturası</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doviz">Döviz Tipi *</Label>
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
                        <Label htmlFor="durum">Durum</Label>
                        <Select defaultValue="taslak">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="taslak">Taslak</SelectItem>
                            <SelectItem value="onaylandi">Onaylandı</SelectItem>
                            <SelectItem value="iptal">İptal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aciklama">Açıklama</Label>
                      <Textarea 
                        id="aciklama" 
                        placeholder="Fatura açıklaması..."
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Fatura Kalemleri</CardTitle>
                    <Button onClick={yeniKalemEkle} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Kalem Ekle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faturaKalemleri.map((kalem) => (
                      <div key={kalem.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                        <div className="col-span-3">
                          <Label>Ürün</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Ürün seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {urunListesi.map((urun) => (
                                <SelectItem key={urun.kod} value={urun.kod}>
                                  {urun.ad}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>Miktar</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div className="col-span-1">
                          <Label>Birim</Label>
                          <Select defaultValue="Ton">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ton">Ton</SelectItem>
                              <SelectItem value="Kg">Kg</SelectItem>
                              <SelectItem value="Adet">Adet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>Birim Fiyat</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                        <div className="col-span-1">
                          <Label>KDV %</Label>
                          <Select defaultValue="18">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">%0</SelectItem>
                              <SelectItem value="8">%8</SelectItem>
                              <SelectItem value="18">%18</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>Toplam</Label>
                          <Input value="0.00" disabled />
                        </div>
                        <div className="col-span-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => kalemSil(kalem.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {faturaKalemleri.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Henüz kalem eklenmedi. "Kalem Ekle" butonuna tıklayarak başlayın.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fatura Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Ara Toplam:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KDV Toplam:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Genel Toplam:</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fatura Önizleme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Şirket:</strong> -</div>
                    <div><strong>Cari:</strong> {selectedCari ? cariListesi.find(c => c.kod === selectedCari)?.ad : '-'}</div>
                    <div><strong>Tarih:</strong> {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: tr }) : '-'}</div>
                    <div><strong>Kalem Sayısı:</strong> {faturaKalemleri.length}</div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button className="w-full bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Faturayı Kaydet
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Önizleme
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  PDF İndir
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fatura-olustur" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Fatura Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Yeni satış veya alış faturası oluşturun
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fatura-tipi">Fatura Tipi *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Fatura tipi seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="satis">Satış Faturası</SelectItem>
                            <SelectItem value="alis">Alış Faturası</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="sirket">Şirket *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Şirket seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {sirketler.map((sirket) => (
                              <SelectItem key={sirket.kod} value={sirket.kod}>
                                {sirket.ad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fatura-tarihi">Fatura Tarihi *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: tr }) : 'Tarih seçin'}
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
                      <div>
                        <Label htmlFor="vade-tarihi">Vade Tarihi</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Vade tarihi seçin
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cari-secim">Cari Seçimi *</Label>
                      <Select value={selectedCari} onValueChange={setSelectedCari}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cari seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {cariListesi.map((cari) => (
                            <SelectItem key={cari.kod} value={cari.kod}>
                              {cari.kod} - {cari.ad} ({cari.tip})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="doviz-tipi">Döviz Tipi *</Label>
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

                    <div>
                      <Label htmlFor="aciklama">Açıklama</Label>
                      <Textarea id="aciklama" placeholder="Fatura açıklaması..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Fatura Kalemleri
                    </CardTitle>
                    <Button onClick={yeniKalemEkle} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Kalem Ekle
                    </Button>
                  </div>
                  <CardDescription>
                    Faturaya dahil edilecek ürünleri ekleyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ürün</TableHead>
                        <TableHead>Miktar</TableHead>
                        <TableHead>Birim Fiyat</TableHead>
                        <TableHead>KDV %</TableHead>
                        <TableHead>Tutar</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faturaKalemleri.map((kalem) => (
                        <TableRow key={kalem.id}>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Ürün seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {urunListesi.map((urun) => (
                                  <SelectItem key={urun.kod} value={urun.kod}>
                                    {urun.ad}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0" className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0.00" className="w-32" />
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="0" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0%</SelectItem>
                                <SelectItem value="8">8%</SelectItem>
                                <SelectItem value="18">18%</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="font-medium">$0.00</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => kalemSil(kalem.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {faturaKalemleri.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            Henüz kalem eklenmedi. "Kalem Ekle" butonunu kullanarak ürün ekleyin.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fatura Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Ara Toplam:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KDV Toplam:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Genel Toplam:</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fatura Önizleme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Şirket:</strong> -</div>
                    <div><strong>Cari:</strong> {selectedCari ? cariListesi.find(c => c.kod === selectedCari)?.ad : '-'}</div>
                    <div><strong>Tarih:</strong> {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: tr }) : '-'}</div>
                    <div><strong>Kalem Sayısı:</strong> {faturaKalemleri.length}</div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button className="w-full bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Faturayı Kaydet
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Önizleme
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  PDF İndir
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fatura-listesi" className="flex-1">
          <UltraProfessionalTable
            data={faturalar}
            columns={faturaColumns}
            title="Fatura Kayıtları"
            description="Satış ve alış fatura listesi"
            searchPlaceholder="Fatura no, cari adı veya açıklama ile ara..."
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
              total: faturalar.length,
              active: faturalar.filter(f => f.durum === 'Onaylandi').length,
              pending: faturalar.filter(f => f.durum === 'Taslak').length,
              completed: faturalar.filter(f => f.durum === 'Odendi').length
            }}
          />
        </TabsContent>

        <TabsContent value="fatura-takip" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Fatura Takip
              </CardTitle>
              <CardDescription>
                Fatura durumlarını ve ödeme takibini yapın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-600">Ödenen Faturalar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$87,500</div>
                    <div className="text-sm text-muted-foreground">1 fatura</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-yellow-600">Bekleyen Ödemeler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$68,000</div>
                    <div className="text-sm text-muted-foreground">1 fatura</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-600">Vadesi Geçenler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$0</div>
                    <div className="text-sm text-muted-foreground">0 fatura</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raporlar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toplam Satış</CardTitle>
                <CardDescription>Bu ay toplam satış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(faturaOzet.toplamSatisFatura, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">2 fatura</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toplam Alış</CardTitle>
                <CardDescription>Bu ay toplam alış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(faturaOzet.toplamAlisFatura, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">1 fatura</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Kar</CardTitle>
                <CardDescription>Satış - Alış farkı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(faturaOzet.toplamSatisFatura - faturaOzet.toplamAlisFatura, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">Bu ay</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bekleyen Ödemeler</CardTitle>
                <CardDescription>Tahsil edilecek</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(faturaOzet.bekleyenOdemeler, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">{faturaOzet.odenmemisFaturalar} fatura</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fatura-takip" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Fatura Takip
              </CardTitle>
              <CardDescription>
                Fatura durumlarını ve ödeme takibini yapın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-600">Ödenen Faturalar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$87,500</div>
                    <div className="text-sm text-muted-foreground">1 fatura</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-yellow-600">Bekleyen Ödemeler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$68,000</div>
                    <div className="text-sm text-muted-foreground">1 fatura</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-600">Vadesi Geçenler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$0</div>
                    <div className="text-sm text-muted-foreground">0 fatura</div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fatura No</TableHead>
                    <TableHead>Cari</TableHead>
                    <TableHead>Fatura Tarihi</TableHead>
                    <TableHead>Vade Tarihi</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Kalan Gün</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faturalar.filter(f => f.durum !== 'Odendi').map((fatura) => {
                    const vadeTarihi = new Date(fatura.vadeTarihi);
                    const bugun = new Date();
                    const kalanGun = Math.ceil((vadeTarihi.getTime() - bugun.getTime()) / (1000 * 3600 * 24));
                    
                    return (
                      <TableRow key={fatura.id}>
                        <TableCell className="font-medium">{fatura.faturaNo}</TableCell>
                        <TableCell>{fatura.cariAdi}</TableCell>
                        <TableCell>{new Date(fatura.faturatarihi).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>{vadeTarihi.toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(fatura.genelToplam, fatura.dovizTipi)}
                        </TableCell>
                        <TableCell>
                          <span className={kalanGun < 0 ? 'text-red-600 font-medium' : kalanGun < 7 ? 'text-yellow-600 font-medium' : ''}>
                            {kalanGun < 0 ? `${Math.abs(kalanGun)} gün geçti` : `${kalanGun} gün`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDurumColor(fatura.durum)}>
                            {fatura.durum}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Detay
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calculator className="w-4 h-4 mr-1" />
                              Ödeme
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raporlar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toplam Satış</CardTitle>
                <CardDescription>Bu ay toplam satış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(faturaOzet.toplamSatisFatura, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">2 fatura</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toplam Alış</CardTitle>
                <CardDescription>Bu ay toplam alış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(faturaOzet.toplamAlisFatura, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">1 fatura</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Kar</CardTitle>
                <CardDescription>Satış - Alış farkı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(faturaOzet.toplamSatisFatura - faturaOzet.toplamAlisFatura, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">Bu ay</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bekleyen Ödemeler</CardTitle>
                <CardDescription>Tahsil edilecek</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(faturaOzet.bekleyenOdemeler, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">{faturaOzet.odenmemisFaturalar} fatura</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detaylı Raporlar</CardTitle>
              <CardDescription>Kapsamlı fatura analiz raporları oluşturun</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Aylık Fatura Raporu</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Calculator className="w-6 h-6 mb-2" />
                  <span>Cari Bazlı Rapor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Package className="w-6 h-6 mb-2" />
                  <span>Ürün Bazlı Rapor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Printer className="w-6 h-6 mb-2" />
                  <span>Vade Takip Raporu</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

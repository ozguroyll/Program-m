import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { UltraProfessionalTable } from '@/components/ui/ultra-professional-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard, Banknote, ArrowUpDown, Plus, Save, FileText, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ColumnDef } from '@tanstack/react-table';


interface CariIslem {
  id: string;
  tarih: string;
  cariKodu: string;
  cariAdi: string;
  hesapTuru: string;
  islemTipi: 'Tediye' | 'Tahsilat' | 'Virman';
  odemeTipi: string;
  tutar: number;
  dovizTipi: 'TRY' | 'USD' | 'EUR';
  aciklama: string;
  belgeNo: string;
  durum: 'Beklemede' | 'Onaylandi' | 'Iptal';
  olusturanKullanici: string;
}

interface CariEkstre {
  cariKodu: string;
  cariAdi: string;
  hesapTuru: string;
  toplamBorc: number;
  toplamAlacak: number;
  bakiye: number;
  dovizTipi: string;
  sonIslemTarihi: string;
}

export function CariIslemler() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState('islem-formu');
  const [selectedCari, setSelectedCari] = useState('');
  const [selectedHesapTuru, setSelectedHesapTuru] = useState('');

  // const odemeTipleri = {
  //   'Nakit': ['Nakit Ödeme'],
  //   'Banka': ['Havale', 'EFT', 'FAST', 'Kredi'],
  //   'Çek': ['Çek'],
  //   'Senet': ['Senet'],
  //   'Dap': ['Dap'],
  //   'Virman': ['Virman']
  // };

  const cariListesi = [
    { kod: 'KHOSH001', ad: 'Khoshnaw Trading', hesaplar: ['Genel Hesap', 'Mısır Hesabı'] },
    { kod: 'KAIWAN001', ad: 'Kaiwan Group', hesaplar: ['Genel Hesap', 'Buğday Hesabı'] },
    { kod: 'SERZAT001', ad: 'Şerzat Bey', hesaplar: ['Mısır Hesabı', 'Buğday Hesabı', 'Soya Yağı Hesabı', 'Komisyon Hesabı'] },
    { kod: 'AMANJ001', ad: 'Amanj Bey', hesaplar: ['Mısır Hesabı', 'Buğday Hesabı', 'Komisyon Hesabı'] },
    { kod: 'CARGILL001', ad: 'Cargill Turkey', hesaplar: ['Genel Hesap', 'Tedarik Hesabı'] }
  ];

  const cariIslemler: CariIslem[] = [
    {
      id: 'CI001',
      tarih: '2025-06-08',
      cariKodu: 'SERZAT001',
      cariAdi: 'Şerzat Bey',
      hesapTuru: 'Mısır Hesabı',
      islemTipi: 'Tahsilat',
      odemeTipi: 'Havale',
      tutar: 125000,
      dovizTipi: 'USD',
      aciklama: '5000 ton mısır satış tahsilatı',
      belgeNo: 'FAT-2025-001',
      durum: 'Onaylandi',
      olusturanKullanici: 'Admin'
    },
    {
      id: 'CI002',
      tarih: '2025-06-07',
      cariKodu: 'CARGILL001',
      cariAdi: 'Cargill Turkey',
      hesapTuru: 'Tedarik Hesabı',
      islemTipi: 'Tediye',
      odemeTipi: 'EFT',
      tutar: 87500,
      dovizTipi: 'USD',
      aciklama: '3500 ton buğday alım ödemesi',
      belgeNo: 'FAT-2025-002',
      durum: 'Onaylandi',
      olusturanKullanici: 'Admin'
    },
    {
      id: 'CI003',
      tarih: '2025-06-06',
      cariKodu: 'AMANJ001',
      cariAdi: 'Amanj Bey',
      hesapTuru: 'Komisyon Hesabı',
      islemTipi: 'Tediye',
      odemeTipi: 'Havale',
      tutar: 2500,
      dovizTipi: 'USD',
      aciklama: 'Aylık komisyon ödemesi',
      belgeNo: 'KOM-2025-001',
      durum: 'Beklemede',
      olusturanKullanici: 'Admin'
    }
  ];

  const cariEkstreler: CariEkstre[] = [
    {
      cariKodu: 'SERZAT001',
      cariAdi: 'Şerzat Bey',
      hesapTuru: 'Mısır Hesabı',
      toplamBorc: 250000,
      toplamAlacak: 375000,
      bakiye: 125000,
      dovizTipi: 'USD',
      sonIslemTarihi: '2025-06-08'
    },
    {
      cariKodu: 'SERZAT001',
      cariAdi: 'Şerzat Bey',
      hesapTuru: 'Buğday Hesabı',
      toplamBorc: 180000,
      toplamAlacak: 220000,
      bakiye: 40000,
      dovizTipi: 'USD',
      sonIslemTarihi: '2025-06-05'
    },
    {
      cariKodu: 'AMANJ001',
      cariAdi: 'Amanj Bey',
      hesapTuru: 'Mısır Hesabı',
      toplamBorc: 150000,
      toplamAlacak: 195000,
      bakiye: 45000,
      dovizTipi: 'USD',
      sonIslemTarihi: '2025-06-06'
    },
    {
      cariKodu: 'KHOSH001',
      cariAdi: 'Khoshnaw Trading',
      hesapTuru: 'Genel Hesap',
      toplamBorc: 320000,
      toplamAlacak: 285000,
      bakiye: -35000,
      dovizTipi: 'USD',
      sonIslemTarihi: '2025-06-04'
    }
  ];

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Onaylandi': return 'bg-green-100 text-green-800';
      case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
      case 'Iptal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIslemTipiColor = (tip: string) => {
    switch (tip) {
      case 'Tahsilat': return 'bg-green-100 text-green-800';
      case 'Tediye': return 'bg-red-100 text-red-800';
      case 'Virman': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBakiyeColor = (bakiye: number) => {
    return bakiye >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedCariHesaplar = () => {
    const cari = cariListesi.find(c => c.kod === selectedCari);
    return cari ? cari.hesaplar : [];
  };

  const cariIslemColumns: ColumnDef<CariIslem>[] = [
    {
      accessorKey: "tarih",
      header: "Tarih",
      cell: ({ row }) => {
        const tarih = row.getValue("tarih") as string
        return <div>{new Date(tarih).toLocaleDateString('tr-TR')}</div>
      },
    },
    {
      accessorKey: "cariAdi",
      header: "Cari",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("cariAdi")}</div>
          <div className="text-sm text-muted-foreground">{row.original.cariKodu}</div>
        </div>
      ),
    },
    {
      accessorKey: "hesapTuru",
      header: "Hesap Türü",
    },
    {
      accessorKey: "islemTipi",
      header: "İşlem Tipi",
      cell: ({ row }) => {
        const tip = row.getValue("islemTipi") as string
        return (
          <Badge className={getIslemTipiColor(tip)}>
            {tip}
          </Badge>
        )
      },
    },
    {
      accessorKey: "odemeTipi",
      header: "Ödeme Tipi",
    },
    {
      accessorKey: "tutar",
      header: "Tutar",
      cell: ({ row }) => {
        const tutar = parseFloat(row.getValue("tutar"))
        const doviz = row.original.dovizTipi
        const islemTipi = row.original.islemTipi
        const color = islemTipi === 'Tahsilat' ? 'text-green-600' : 'text-red-600'
        return <div className={`text-right font-medium ${color}`}>{formatCurrency(tutar, doviz)}</div>
      },
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }) => {
        const durum = row.getValue("durum") as string
        return (
          <Badge className={getDurumColor(durum)}>
            {durum}
          </Badge>
        )
      },
    },
    {
      accessorKey: "belgeNo",
      header: "Belge No",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("belgeNo")}</div>
      ),
    },
  ];

  const cariEkstreColumns: ColumnDef<CariEkstre>[] = [
    {
      accessorKey: "cariAdi",
      header: "Cari",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("cariAdi")}</div>
          <div className="text-sm text-muted-foreground">{row.original.cariKodu}</div>
        </div>
      ),
    },
    {
      accessorKey: "hesapTuru",
      header: "Hesap Türü",
    },
    {
      accessorKey: "toplamBorc",
      header: "Toplam Borç",
      cell: ({ row }) => {
        const borc = parseFloat(row.getValue("toplamBorc"))
        const doviz = row.original.dovizTipi
        return <div className="text-right font-medium text-red-600">{formatCurrency(borc, doviz)}</div>
      },
    },
    {
      accessorKey: "toplamAlacak",
      header: "Toplam Alacak",
      cell: ({ row }) => {
        const alacak = parseFloat(row.getValue("toplamAlacak"))
        const doviz = row.original.dovizTipi
        return <div className="text-right font-medium text-green-600">{formatCurrency(alacak, doviz)}</div>
      },
    },
    {
      accessorKey: "bakiye",
      header: "Bakiye",
      cell: ({ row }) => {
        const bakiye = parseFloat(row.getValue("bakiye"))
        const doviz = row.original.dovizTipi
        return (
          <div className={`text-right font-medium ${getBakiyeColor(bakiye)}`}>
            {formatCurrency(Math.abs(bakiye), doviz)}
            {bakiye < 0 && ' (Borçlu)'}
          </div>
        )
      },
    },
    {
      accessorKey: "sonIslemTarihi",
      header: "Son İşlem",
      cell: ({ row }) => {
        const tarih = row.getValue("sonIslemTarihi") as string
        return <div>{new Date(tarih).toLocaleDateString('tr-TR')}</div>
      },
    },
  ];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cari İşlemler</h2>
          <p className="text-muted-foreground">Tediye, tahsilat ve virman işlemlerini yönetin</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Yeni İşlem
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Günlük Tediye</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$90,000</div>
            <p className="text-xs text-muted-foreground">Bugün</p>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              -5% dün
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Günlük Tahsilat</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,000</div>
            <p className="text-xs text-muted-foreground">Bugün</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% dün
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Nakit Akışı</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$35,000</div>
            <p className="text-xs text-muted-foreground">Bugün</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% dün
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen İşlemler</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Onay bekliyor</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              -2 dün
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="islem-formu" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            İşlem Formu
          </TabsTrigger>
          <TabsTrigger value="islem-listesi" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            İşlem Listesi
          </TabsTrigger>
          <TabsTrigger value="cari-ekstreler" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Cari Ekstreler
          </TabsTrigger>
          <TabsTrigger value="raporlar" className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Raporlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="islem-formu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Yeni Cari İşlem
              </CardTitle>
              <CardDescription>
                Tediye, tahsilat veya virman işlemi gerçekleştirin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="islem-tarihi">İşlem Tarihi *</Label>
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
                      <Label htmlFor="islem-tipi">İşlem Tipi *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="İşlem tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tediye">Tediye</SelectItem>
                          <SelectItem value="tahsilat">Tahsilat</SelectItem>
                          <SelectItem value="virman">Virman</SelectItem>
                        </SelectContent>
                      </Select>
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
                            {cari.kod} - {cari.ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="hesap-turu">Hesap Türü *</Label>
                    <Select value={selectedHesapTuru} onValueChange={setSelectedHesapTuru}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hesap türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSelectedCariHesaplar().map((hesap) => (
                          <SelectItem key={hesap} value={hesap}>
                            {hesap}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="odeme-tipi">Ödeme Tipi *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Ödeme tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nakit">Nakit</SelectItem>
                          <SelectItem value="havale">Havale</SelectItem>
                          <SelectItem value="eft">EFT</SelectItem>
                          <SelectItem value="fast">FAST</SelectItem>
                          <SelectItem value="cek">Çek</SelectItem>
                          <SelectItem value="senet">Senet</SelectItem>
                          <SelectItem value="kredi">Kredi</SelectItem>
                          <SelectItem value="dap">Dap</SelectItem>
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
                  </div>

                  <div>
                    <Label htmlFor="tutar">Tutar *</Label>
                    <Input id="tutar" type="number" placeholder="0.00" step="0.01" />
                  </div>

                  <div>
                    <Label htmlFor="belge-no">Belge No</Label>
                    <Input id="belge-no" placeholder="FAT-2025-001" />
                  </div>

                  <div>
                    <Label htmlFor="aciklama">Açıklama</Label>
                    <Textarea id="aciklama" placeholder="İşlem açıklaması..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Ek Bilgiler</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Seçilen ödeme tipine göre ek bilgiler
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="banka-hesap">Banka Hesabı</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Banka hesabı seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ziraat">Ziraat Bankası - TR123456789</SelectItem>
                            <SelectItem value="garanti">Garanti BBVA - TR987654321</SelectItem>
                            <SelectItem value="isbank">İş Bankası - TR456789123</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="cek-no">Çek/Senet No</Label>
                        <Input id="cek-no" placeholder="Çek veya senet numarası" />
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

                      <div>
                        <Label htmlFor="virman-cari">Virman Carisi</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Virman için cari seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {cariListesi.map((cari) => (
                              <SelectItem key={cari.kod} value={cari.kod}>
                                {cari.kod} - {cari.ad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">İşlem Özeti</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Cari:</span>
                        <span className="font-medium">
                          {selectedCari ? cariListesi.find(c => c.kod === selectedCari)?.ad : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hesap Türü:</span>
                        <span className="font-medium">{selectedHesapTuru || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>İşlem Tipi:</span>
                        <span className="font-medium">-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tutar:</span>
                        <span className="font-medium">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                <Button className="bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Kaydet ve Yazdır
                </Button>
                <Button variant="outline">
                  Temizle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="islem-listesi" className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Cari İşlem Listesi
                  </CardTitle>
                  <CardDescription>
                    Tüm tediye, tahsilat ve virman işlemlerini görüntüleyin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <UltraProfessionalTable
                columns={cariIslemColumns}
                data={cariIslemler}
                title="Cari İşlem Listesi"
                description="Tüm cari işlemlerinizi görüntüleyin ve yönetin"
                searchKey="cariAdi"
                searchPlaceholder="Cari adı, belge no veya açıklama ile ara..."
                enableRowSelection={true}
                onExport={(format: string) => {
                  alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                }}
                onRefresh={() => window.location.reload()}
                onView={(_islem: any) => {
                  alert('İşlem detayları görüntüleme özelliği yakında eklenecek');
                }}
                onEdit={(_islem: any) => {
                  alert('İşlem düzenleme özelliği yakında eklenecek');
                }}
                onDelete={(_islem: any) => {
                  if (confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
                    alert('İşlem silme özelliği yakında eklenecek');
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cari-ekstreler" className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Cari Ekstreler
                  </CardTitle>
                  <CardDescription>
                    Carilerin alacak/verecek durumlarını görüntüleyin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <UltraProfessionalTable
                columns={cariEkstreColumns}
                data={cariEkstreler}
                title="Cari Ekstre Listesi"
                description="Cari hesap bakiyelerini ve hareketlerini görüntüleyin"
                searchKey="cariAdi"
                searchPlaceholder="Cari adı veya kodu ile ara..."
                enableRowSelection={true}
                onExport={(format: string) => {
                  alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                }}
                onRefresh={() => window.location.reload()}
                onView={(_ekstre: any) => {
                  alert('Ekstre detayları görüntüleme özelliği yakında eklenecek');
                }}
                onEdit={(_ekstre: any) => {
                  alert('Ekstre düzenleme özelliği yakında eklenecek');
                }}
                onDelete={(_ekstre: any) => {
                  if (confirm('Bu ekstreyi silmek istediğinizden emin misiniz?')) {
                    alert('Ekstre silme özelliği yakında eklenecek');
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raporlar" className="flex-1">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Tediye</CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">USD 90,000</div>
                  <p className="text-xs text-muted-foreground">Bugün</p>
                  <div className="flex items-center text-xs text-red-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    -5% dün
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Tahsilat</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">USD 125,000</div>
                  <p className="text-xs text-muted-foreground">Bugün</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% dün
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Nakit Akışı</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">USD 35,000</div>
                  <p className="text-xs text-muted-foreground">Bugün</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% dün
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">İşlem Sayısı</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Bugün</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3 dün
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bekleyen İşlemler</CardTitle>
                  <CardDescription>Onay bekleyen işlemler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded bg-yellow-50">
                      <span className="font-medium">Bekleyen Tediye</span>
                      <span className="font-bold text-yellow-700">USD 2,500</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-green-50">
                      <span className="font-medium">Bekleyen Tahsilat</span>
                      <span className="font-bold text-green-700">USD 0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="font-medium">Toplam Bekleyen</span>
                      <span className="font-bold">1 işlem</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Döviz Dağılımı</CardTitle>
                  <CardDescription>Para birimi bazında dağılım</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded bg-blue-50">
                      <span className="font-medium">USD İşlemler</span>
                      <span className="font-bold text-blue-700">USD 215,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-green-50">
                      <span className="font-medium">EUR İşlemler</span>
                      <span className="font-bold text-green-700">EUR 0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-red-50">
                      <span className="font-medium">TRY İşlemler</span>
                      <span className="font-bold text-red-700">₺ 0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ödeme Tipi Dağılımı</CardTitle>
                  <CardDescription>Ödeme yöntemleri</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="font-medium">Havale/EFT</span>
                      <span className="font-bold">USD 180,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="font-medium">Nakit</span>
                      <span className="font-bold">USD 25,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="font-medium">Çek/Senet</span>
                      <span className="font-bold">USD 10,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detaylı Raporlar</CardTitle>
                <CardDescription>Kapsamlı analiz raporları oluşturun</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <FileText className="w-8 h-8 mb-2 text-blue-600" />
                    <span className="font-medium">Aylık Rapor</span>
                    <span className="text-xs text-muted-foreground">Detaylı aylık analiz</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <DollarSign className="w-8 h-8 mb-2 text-green-600" />
                    <span className="font-medium">Cari Bazlı Rapor</span>
                    <span className="text-xs text-muted-foreground">Cari hesap analizi</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <ArrowUpDown className="w-8 h-8 mb-2 text-purple-600" />
                    <span className="font-medium">Nakit Akış Raporu</span>
                    <span className="text-xs text-muted-foreground">Nakit akış analizi</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col justify-center hover:shadow-md transition-shadow">
                    <Banknote className="w-8 h-8 mb-2 text-orange-600" />
                    <span className="font-medium">Ödeme Tipi Raporu</span>
                    <span className="text-xs text-muted-foreground">Ödeme yöntemi analizi</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

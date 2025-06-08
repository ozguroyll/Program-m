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
import { CalendarIcon, CreditCard, Banknote, ArrowUpDown, Plus, Search, Edit, Save, FileText, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

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

  return (
    <div className="h-full p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cari İşlemler</h2>
          <p className="text-muted-foreground">Tediye, tahsilat ve virman işlemlerini yönetin</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Yeni İşlem
        </Button>
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

        <TabsContent value="islem-listesi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Cari İşlem Listesi
              </CardTitle>
              <CardDescription>
                Tüm tediye, tahsilat ve virman işlemlerini görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Cari adı, belge no veya açıklama ara..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="İşlem tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="tediye">Tediye</SelectItem>
                    <SelectItem value="tahsilat">Tahsilat</SelectItem>
                    <SelectItem value="virman">Virman</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="onaylandi">Onaylandı</SelectItem>
                    <SelectItem value="beklemede">Beklemede</SelectItem>
                    <SelectItem value="iptal">İptal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Cari</TableHead>
                    <TableHead>Hesap Türü</TableHead>
                    <TableHead>İşlem Tipi</TableHead>
                    <TableHead>Ödeme Tipi</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cariIslemler.map((islem) => (
                    <TableRow key={islem.id}>
                      <TableCell>{new Date(islem.tarih).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{islem.cariAdi}</div>
                          <div className="text-sm text-muted-foreground">{islem.cariKodu}</div>
                        </div>
                      </TableCell>
                      <TableCell>{islem.hesapTuru}</TableCell>
                      <TableCell>
                        <Badge className={getIslemTipiColor(islem.islemTipi)}>
                          {islem.islemTipi}
                        </Badge>
                      </TableCell>
                      <TableCell>{islem.odemeTipi}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(islem.tutar, islem.dovizTipi)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getDurumColor(islem.durum)}>
                          {islem.durum}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Yazdır
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cari-ekstreler" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cari Ekstreler
              </CardTitle>
              <CardDescription>
                Carilerin alacak/verecek durumlarını görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Cari adı veya kodu ara..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Hesap türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Hesaplar</SelectItem>
                    <SelectItem value="misir">Mısır Hesabı</SelectItem>
                    <SelectItem value="bugday">Buğday Hesabı</SelectItem>
                    <SelectItem value="komisyon">Komisyon Hesabı</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Excel'e Aktar
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cari</TableHead>
                    <TableHead>Hesap Türü</TableHead>
                    <TableHead>Toplam Borç</TableHead>
                    <TableHead>Toplam Alacak</TableHead>
                    <TableHead>Bakiye</TableHead>
                    <TableHead>Son İşlem</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cariEkstreler.map((ekstre, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ekstre.cariAdi}</div>
                          <div className="text-sm text-muted-foreground">{ekstre.cariKodu}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ekstre.hesapTuru}</TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(ekstre.toplamBorc, ekstre.dovizTipi)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(ekstre.toplamAlacak, ekstre.dovizTipi)}
                      </TableCell>
                      <TableCell className={`font-medium ${getBakiyeColor(ekstre.bakiye)}`}>
                        {formatCurrency(Math.abs(ekstre.bakiye), ekstre.dovizTipi)}
                        {ekstre.bakiye < 0 && ' (Borçlu)'}
                      </TableCell>
                      <TableCell>{new Date(ekstre.sonIslemTarihi).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Detay
                          </Button>
                          <Button variant="outline" size="sm">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Ekstre
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raporlar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Günlük Özet</CardTitle>
                <CardDescription>Bugünkü işlem özeti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Toplam Tediye:</span>
                    <span className="font-medium text-red-600">$90,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam Tahsilat:</span>
                    <span className="font-medium text-green-600">$125,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Nakit Akışı:</span>
                    <span className="font-medium text-green-600">$35,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>İşlem Sayısı:</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bekleyen İşlemler</CardTitle>
                <CardDescription>Onay bekleyen işlemler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bekleyen Tediye:</span>
                    <span className="font-medium text-yellow-600">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bekleyen Tahsilat:</span>
                    <span className="font-medium text-yellow-600">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam Bekleyen:</span>
                    <span className="font-medium">1 işlem</span>
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
                  <div className="flex justify-between">
                    <span>USD İşlemler:</span>
                    <span className="font-medium">$215,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EUR İşlemler:</span>
                    <span className="font-medium">€0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TRY İşlemler:</span>
                    <span className="font-medium">₺0</span>
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
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Aylık Rapor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <DollarSign className="w-6 h-6 mb-2" />
                  <span>Cari Bazlı Rapor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <ArrowUpDown className="w-6 h-6 mb-2" />
                  <span>Nakit Akış Raporu</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Banknote className="w-6 h-6 mb-2" />
                  <span>Ödeme Tipi Raporu</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

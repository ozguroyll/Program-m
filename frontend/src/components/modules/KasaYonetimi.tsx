import React, { useState } from 'react';
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
import { CalendarIcon, Wallet, Plus, Search, Edit, Trash2, Save, Download, Eye, Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface KasaHareketi {
  id: string;
  tarih: string;
  islemTipi: 'Giris' | 'Cikis';
  tutar: number;
  dovizTipi: 'TRY' | 'USD' | 'EUR';
  aciklama: string;
  kategori: string;
  referansNo: string;
  cariKodu?: string;
  cariAdi?: string;
  kullanici: string;
  onayDurumu: 'Onaylandi' | 'Beklemede' | 'Iptal';
}

interface KasaBakiye {
  dovizTipi: 'TRY' | 'USD' | 'EUR';
  bakiye: number;
  gunlukGiris: number;
  gunlukCikis: number;
}

interface KasaOzet {
  toplamGiris: number;
  toplamCikis: number;
  netBakiye: number;
  islemSayisi: number;
  bugunIslemler: number;
  bekleyenOnaylar: number;
}

export function KasaYonetimi() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState('kasa-islem');
  const [selectedKategori, setSelectedKategori] = useState('');

  const kasaKategorileri = [
    { kod: 'FATURA_ODEME', ad: 'Fatura Ödemesi' },
    { kod: 'FATURA_TAHSILAT', ad: 'Fatura Tahsilatı' },
    { kod: 'NAKLIYE', ad: 'Nakliye Gideri' },
    { kod: 'GUMRUK', ad: 'Gümrük Gideri' },
    { kod: 'KOMISYON', ad: 'Komisyon Geliri' },
    { kod: 'GENEL_GIDER', ad: 'Genel Gider' },
    { kod: 'DIGER', ad: 'Diğer' }
  ];

  const cariListesi = [
    { kod: 'KHOSH001', ad: 'Khoshnaw Trading' },
    { kod: 'KAIWAN001', ad: 'Kaiwan Group' },
    { kod: 'SERZAT001', ad: 'Şerzat Bey' },
    { kod: 'AMANJ001', ad: 'Amanj Bey' },
    { kod: 'CARGILL001', ad: 'Cargill Turkey' },
    { kod: 'ADM001', ad: 'ADM Turkey' }
  ];

  const kasaHareketleri: KasaHareketi[] = [
    {
      id: 'KH001',
      tarih: '2025-06-08',
      islemTipi: 'Giris',
      tutar: 25000,
      dovizTipi: 'USD',
      aciklama: 'Khoshnaw Trading fatura tahsilatı',
      kategori: 'Fatura Tahsilatı',
      referansNo: 'ZAD-2025-001',
      cariKodu: 'KHOSH001',
      cariAdi: 'Khoshnaw Trading',
      kullanici: 'Admin',
      onayDurumu: 'Onaylandi'
    },
    {
      id: 'KH002',
      tarih: '2025-06-08',
      islemTipi: 'Cikis',
      tutar: 15000,
      dovizTipi: 'USD',
      aciklama: 'Cargill Turkey fatura ödemesi',
      kategori: 'Fatura Ödemesi',
      referansNo: 'GLOBAL-2025-001',
      cariKodu: 'CARGILL001',
      cariAdi: 'Cargill Turkey',
      kullanici: 'Admin',
      onayDurumu: 'Onaylandi'
    },
    {
      id: 'KH003',
      tarih: '2025-06-07',
      islemTipi: 'Cikis',
      tutar: 2500,
      dovizTipi: 'USD',
      aciklama: 'Nakliye gideri - Irak sevkiyatı',
      kategori: 'Nakliye Gideri',
      referansNo: 'NK-2025-015',
      kullanici: 'Admin',
      onayDurumu: 'Onaylandi'
    },
    {
      id: 'KH004',
      tarih: '2025-06-07',
      islemTipi: 'Giris',
      tutar: 1200,
      dovizTipi: 'USD',
      aciklama: 'Komisyon geliri - Şerzat Bey',
      kategori: 'Komisyon Geliri',
      referansNo: 'KOM-2025-008',
      cariKodu: 'SERZAT001',
      cariAdi: 'Şerzat Bey',
      kullanici: 'Admin',
      onayDurumu: 'Beklemede'
    },
    {
      id: 'KH005',
      tarih: '2025-06-06',
      islemTipi: 'Cikis',
      tutar: 850,
      dovizTipi: 'USD',
      aciklama: 'Gümrük gideri - Buğday ithalatı',
      kategori: 'Gümrük Gideri',
      referansNo: 'GM-2025-012',
      kullanici: 'Admin',
      onayDurumu: 'Onaylandi'
    }
  ];

  const kasaBakiyeleri: KasaBakiye[] = [
    {
      dovizTipi: 'TRY',
      bakiye: 125000,
      gunlukGiris: 15000,
      gunlukCikis: 8500
    },
    {
      dovizTipi: 'USD',
      bakiye: 8850,
      gunlukGiris: 26200,
      gunlukCikis: 18350
    },
    {
      dovizTipi: 'EUR',
      bakiye: 3200,
      gunlukGiris: 0,
      gunlukCikis: 500
    }
  ];

  const kasaOzet: KasaOzet = {
    toplamGiris: 26200,
    toplamCikis: 18350,
    netBakiye: 7850,
    islemSayisi: 5,
    bugunIslemler: 2,
    bekleyenOnaylar: 1
  };

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
      case 'Giris': return 'bg-green-100 text-green-800';
      case 'Cikis': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getBakiyeColor = (bakiye: number) => {
    if (bakiye > 0) return 'text-green-600';
    if (bakiye < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="h-full p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kasa Yönetimi</h2>
          <p className="text-muted-foreground">Nakit giriş ve çıkış işlemlerini yönetin</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Yeni İşlem
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kasa-islem" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Kasa İşlem
          </TabsTrigger>
          <TabsTrigger value="hareket-listesi" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Hareket Listesi
          </TabsTrigger>
          <TabsTrigger value="kasa-sayim" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Kasa Sayım
          </TabsTrigger>
          <TabsTrigger value="raporlar" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Raporlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kasa-islem" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Kasa İşlem Formu
                  </CardTitle>
                  <CardDescription>
                    Yeni nakit giriş veya çıkış işlemi kaydedin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="islem-tipi">İşlem Tipi *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="İşlem tipi seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="giris">Nakit Giriş</SelectItem>
                            <SelectItem value="cikis">Nakit Çıkış</SelectItem>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tutar">Tutar *</Label>
                        <Input 
                          id="tutar" 
                          type="number" 
                          placeholder="0.00" 
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tarih">İşlem Tarihi *</Label>
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
                    </div>

                    <div>
                      <Label htmlFor="kategori">Kategori *</Label>
                      <Select value={selectedKategori} onValueChange={setSelectedKategori}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {kasaKategorileri.map((kategori) => (
                            <SelectItem key={kategori.kod} value={kategori.kod}>
                              {kategori.ad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="cari-secim">Cari (Opsiyonel)</Label>
                      <Select>
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
                      <Label htmlFor="referans-no">Referans No</Label>
                      <Input id="referans-no" placeholder="Fatura no, belge no vb." />
                    </div>

                    <div>
                      <Label htmlFor="aciklama">Açıklama *</Label>
                      <Textarea id="aciklama" placeholder="İşlem açıklaması..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Günlük Kasa Durumu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kasaBakiyeleri.map((bakiye) => (
                      <div key={bakiye.dovizTipi} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{bakiye.dovizTipi}</span>
                          <span className={`font-bold ${getBakiyeColor(bakiye.bakiye)}`}>
                            {formatCurrency(bakiye.bakiye, bakiye.dovizTipi)}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Giriş:</span>
                            <span className="text-green-600">
                              +{formatCurrency(bakiye.gunlukGiris, bakiye.dovizTipi)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Çıkış:</span>
                            <span className="text-red-600">
                              -{formatCurrency(bakiye.gunlukCikis, bakiye.dovizTipi)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Fatura Tahsilatı
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Fatura Ödemesi
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Komisyon Girişi
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="w-4 h-4 mr-2" />
                      Genel Gider
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button className="w-full bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  İşlemi Kaydet
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Önizleme
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hareket-listesi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Kasa Hareket Listesi
              </CardTitle>
              <CardDescription>
                Tüm nakit giriş ve çıkış işlemlerini görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Açıklama, referans no veya cari ara..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="İşlem tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="giris">Giriş</SelectItem>
                    <SelectItem value="cikis">Çıkış</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Döviz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="TRY">TRY</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Cari</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kasaHareketleri.map((hareket) => (
                    <TableRow key={hareket.id}>
                      <TableCell>{new Date(hareket.tarih).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>
                        <Badge className={getIslemTipiColor(hareket.islemTipi)}>
                          {hareket.islemTipi === 'Giris' ? 'Giriş' : 'Çıkış'}
                        </Badge>
                      </TableCell>
                      <TableCell>{hareket.kategori}</TableCell>
                      <TableCell>
                        {hareket.cariAdi ? (
                          <div>
                            <div className="font-medium">{hareket.cariAdi}</div>
                            <div className="text-sm text-muted-foreground">{hareket.cariKodu}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className={hareket.islemTipi === 'Giris' ? 'text-green-600' : 'text-red-600'}>
                          {hareket.islemTipi === 'Giris' ? '+' : '-'}
                          {formatCurrency(hareket.tutar, hareket.dovizTipi)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDurumColor(hareket.onayDurumu)}>
                          {hareket.onayDurumu}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Detay
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
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

        <TabsContent value="kasa-sayim" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Kasa Sayım
              </CardTitle>
              <CardDescription>
                Fiziksel kasa sayımı yapın ve sistem bakiyesi ile karşılaştırın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sistem Bakiyesi</h3>
                  <div className="space-y-3">
                    {kasaBakiyeleri.map((bakiye) => (
                      <div key={bakiye.dovizTipi} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{bakiye.dovizTipi}</span>
                        <span className={`font-bold ${getBakiyeColor(bakiye.bakiye)}`}>
                          {formatCurrency(bakiye.bakiye, bakiye.dovizTipi)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Fiziksel Sayım</h3>
                  <div className="space-y-3">
                    {kasaBakiyeleri.map((bakiye) => (
                      <div key={`sayim-${bakiye.dovizTipi}`} className="space-y-2">
                        <Label htmlFor={`sayim-${bakiye.dovizTipi}`}>{bakiye.dovizTipi} Sayım</Label>
                        <Input 
                          id={`sayim-${bakiye.dovizTipi}`}
                          type="number" 
                          placeholder="0.00" 
                          step="0.01"
                          defaultValue={bakiye.bakiye}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Sayım Sonucu</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">TRY Fark:</span>
                    <div className="font-medium text-green-600">₺0.00</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">USD Fark:</span>
                    <div className="font-medium text-green-600">$0.00</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">EUR Fark:</span>
                    <div className="font-medium text-green-600">€0.00</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="sayim-aciklama">Sayım Açıklaması</Label>
                <Textarea 
                  id="sayim-aciklama" 
                  placeholder="Sayım notları ve açıklamaları..." 
                  className="mt-2"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Sayımı Kaydet
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Sayım Raporu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raporlar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toplam Giriş</CardTitle>
                <CardDescription>Bu ay toplam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(kasaOzet.toplamGiris, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {kasaOzet.islemSayisi} işlem
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toplam Çıkış</CardTitle>
                <CardDescription>Bu ay toplam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(kasaOzet.toplamCikis, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {kasaOzet.islemSayisi} işlem
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Hareket</CardTitle>
                <CardDescription>Giriş - Çıkış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getBakiyeColor(kasaOzet.netBakiye)}`}>
                  {formatCurrency(kasaOzet.netBakiye, 'USD')}
                </div>
                <div className="text-sm text-muted-foreground">Bu ay</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bekleyen Onaylar</CardTitle>
                <CardDescription>Onay bekleyen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {kasaOzet.bekleyenOnaylar}
                </div>
                <div className="text-sm text-muted-foreground">işlem</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detaylı Raporlar</CardTitle>
              <CardDescription>Kapsamlı kasa analiz raporları oluşturun</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Wallet className="w-6 h-6 mb-2" />
                  <span>Günlük Kasa Raporu</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span>Aylık Hareket Raporu</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <DollarSign className="w-6 h-6 mb-2" />
                  <span>Döviz Bazlı Rapor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Calculator className="w-6 h-6 mb-2" />
                  <span>Kategori Bazlı Rapor</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon, Package, Truck, Building2, FileText, Plus, Search, Filter } from 'lucide-react';

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
  durum: 'Beklemede' | 'Onaylandi' | 'Teslim Alindi';
  teslimSekli: string;
}

interface StokCikis {
  id: string;
  urun: string;
  miktar: number;
  aracPlaka: string;
  sofor: string;
  musteri: string;
  depo: string;
  tarih: string;
  durum: 'Yukleniyor' | 'Yolda' | 'Teslim Edildi';
  romorkTipi: string;
}

interface UrunTanimi {
  id: string;
  ad: string;
  kategori: string;
  birim: string;
  aciklama: string;
}

export function StokYonetimi() {
  const [activeTab, setActiveTab] = useState('stok-giris');

  const stokKayitlari: StokKaydi[] = [
    {
      id: 'STK001',
      urun: 'Mısır',
      miktar: 5000,
      birim: 'Ton',
      alisFiyati: 245,
      tedarikci: 'Cargill Turkey',
      depo: 'Dönmezoğlu Antrepo',
      kimAdina: 'Şerzat',
      sirket: 'Zad Agro',
      tarih: '2025-06-08',
      durum: 'Teslim Alindi',
      teslimSekli: 'Antrepo Teslim'
    },
    {
      id: 'STK002',
      urun: 'Buğday',
      miktar: 3000,
      birim: 'Ton',
      alisFiyati: 280,
      tedarikci: 'ADM Türkiye',
      depo: 'Mersin Antrepo',
      kimAdina: 'Amanj',
      sirket: 'Global Agro',
      tarih: '2025-06-07',
      durum: 'Onaylandi',
      teslimSekli: 'Gemi CIF'
    },
    {
      id: 'STK003',
      urun: 'Soya Yağı',
      miktar: 1500,
      birim: 'Ton',
      alisFiyati: 850,
      tedarikci: 'Bunge Turkey',
      depo: 'İskenderun Limanı',
      kimAdina: 'Şerzat',
      sirket: 'Zad Agro',
      tarih: '2025-06-06',
      durum: 'Beklemede',
      teslimSekli: 'Transit'
    }
  ];

  const stokCikislari: StokCikis[] = [
    {
      id: 'CKS001',
      urun: 'Mısır',
      miktar: 25,
      aracPlaka: '34 ABC 123',
      sofor: 'Mehmet Yılmaz',
      musteri: 'Khoshnaw Trading',
      depo: 'Dönmezoğlu Antrepo',
      tarih: '2025-06-08',
      durum: 'Teslim Edildi',
      romorkTipi: 'Damperli'
    },
    {
      id: 'CKS002',
      urun: 'Buğday',
      miktar: 28,
      aracPlaka: '06 XYZ 456',
      sofor: 'Ali Demir',
      musteri: 'Kaiwan Group',
      depo: 'Mersin Antrepo',
      tarih: '2025-06-08',
      durum: 'Yolda',
      romorkTipi: 'Sal Kasa'
    },
    {
      id: 'CKS003',
      urun: 'Soya Yağı',
      miktar: 22,
      aracPlaka: '31 DEF 789',
      sofor: 'Hasan Özkan',
      musteri: 'Baghdad Grain',
      depo: 'İskenderun Limanı',
      tarih: '2025-06-07',
      durum: 'Yukleniyor',
      romorkTipi: 'Tenteli'
    }
  ];

  const urunTanimlari: UrunTanimi[] = [
    { id: 'URN001', ad: 'Mısır', kategori: 'Hububat', birim: 'Ton', aciklama: 'Sarı mısır, %14 nem' },
    { id: 'URN002', ad: 'Buğday', kategori: 'Hububat', birim: 'Ton', aciklama: 'Ekmeklik buğday, protein %12' },
    { id: 'URN003', ad: 'Arpa', kategori: 'Hububat', birim: 'Ton', aciklama: 'Yem arpası' },
    { id: 'URN004', ad: 'Soya Yağı', kategori: 'Yağ', birim: 'Ton', aciklama: 'Ham soya yağı' },
    { id: 'URN005', ad: 'Soya Küspesi', kategori: 'Küspe', birim: 'Ton', aciklama: 'Protein %46' }
  ];

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
      case 'Onaylandi': return 'bg-blue-100 text-blue-800';
      case 'Teslim Alindi': return 'bg-green-100 text-green-800';
      case 'Yukleniyor': return 'bg-orange-100 text-orange-800';
      case 'Yolda': return 'bg-blue-100 text-blue-800';
      case 'Teslim Edildi': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Stok Yönetimi</h2>
          <p className="text-muted-foreground">Ürün alım, satım ve depo yönetimi</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Yeni İşlem
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stok-giris" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
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

        <TabsContent value="stok-giris" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Stok Giriş İşlemleri
              </CardTitle>
              <CardDescription>
                Ürün alımları ve depo girişlerini yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Ürün, tedarikçi veya depo ara..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stok Kodu</TableHead>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead>Alış Fiyatı</TableHead>
                    <TableHead>Tedarikçi</TableHead>
                    <TableHead>Depo</TableHead>
                    <TableHead>Kim Adına</TableHead>
                    <TableHead>Şirket</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stokKayitlari.map((kayit) => (
                    <TableRow key={kayit.id}>
                      <TableCell className="font-medium">{kayit.id}</TableCell>
                      <TableCell>{kayit.urun}</TableCell>
                      <TableCell>{kayit.miktar.toLocaleString()} {kayit.birim}</TableCell>
                      <TableCell>${kayit.alisFiyati}/{kayit.birim}</TableCell>
                      <TableCell>{kayit.tedarikci}</TableCell>
                      <TableCell>{kayit.depo}</TableCell>
                      <TableCell>{kayit.kimAdina}</TableCell>
                      <TableCell>{kayit.sirket}</TableCell>
                      <TableCell>
                        <Badge className={getDurumColor(kayit.durum)}>
                          {kayit.durum}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Düzenle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stok-cikis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Stok Çıkış İşlemleri
              </CardTitle>
              <CardDescription>
                Araç bazlı ürün sevkiyatlarını yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Plaka, şoför veya müşteri ara..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Çıkış Kodu</TableHead>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead>Araç Plaka</TableHead>
                    <TableHead>Şoför</TableHead>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>Depo</TableHead>
                    <TableHead>Römork Tipi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stokCikislari.map((cikis) => (
                    <TableRow key={cikis.id}>
                      <TableCell className="font-medium">{cikis.id}</TableCell>
                      <TableCell>{cikis.urun}</TableCell>
                      <TableCell>{cikis.miktar} Ton</TableCell>
                      <TableCell>{cikis.aracPlaka}</TableCell>
                      <TableCell>{cikis.sofor}</TableCell>
                      <TableCell>{cikis.musteri}</TableCell>
                      <TableCell>{cikis.depo}</TableCell>
                      <TableCell>{cikis.romorkTipi}</TableCell>
                      <TableCell>
                        <Badge className={getDurumColor(cikis.durum)}>
                          {cikis.durum}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Düzenle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urun-tanimlari" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Ürün Tanımları
              </CardTitle>
              <CardDescription>
                Sistem genelinde kullanılacak ürünleri tanımlayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Yeni Ürün Tanımla</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="urun-adi">Ürün Adı</Label>
                      <Input id="urun-adi" placeholder="Ürün adını girin" />
                    </div>
                    <div>
                      <Label htmlFor="kategori">Kategori</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hububat">Hububat</SelectItem>
                          <SelectItem value="yag">Yağ</SelectItem>
                          <SelectItem value="kuspe">Küspe</SelectItem>
                          <SelectItem value="kepek">Kepek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="birim">Birim</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Birim seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ton">Ton</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="litre">Litre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="aciklama">Açıklama</Label>
                      <Textarea id="aciklama" placeholder="Ürün açıklaması..." />
                    </div>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Ürün Ekle
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mevcut Ürünler</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {urunTanimlari.map((urun) => (
                      <Card key={urun.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{urun.ad}</h4>
                            <p className="text-sm text-muted-foreground">
                              {urun.kategori} • {urun.birim}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {urun.aciklama}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Düzenle
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raporlar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stok Durumu</CardTitle>
                <CardDescription>Anlık stok seviyeleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Toplam Stok</span>
                    <span className="font-bold">9,500 Ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mısır</span>
                    <span>4,975 Ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Buğday</span>
                    <span>2,972 Ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Soya Yağı</span>
                    <span>1,478 Ton</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Günlük Hareketler</CardTitle>
                <CardDescription>Bugünkü giriş/çıkışlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">Giriş</span>
                    <span className="font-bold text-green-600">+75 Ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Çıkış</span>
                    <span className="font-bold text-red-600">-75 Ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Net Değişim</span>
                    <span className="font-bold">0 Ton</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Şirket Bazlı</CardTitle>
                <CardDescription>Şirketlere göre dağılım</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Zad Agro</span>
                    <span className="font-bold">6,475 Ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Global Agro</span>
                    <span className="font-bold">2,972 Ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Yılmaz Transport</span>
                    <span className="font-bold">53 Ton</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detaylı Raporlar</CardTitle>
              <CardDescription>Excel ve PDF formatında raporlar oluşturun</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Stok Raporu
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Hareket Raporu
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Kar/Zarar Raporu
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Şirket Raporu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

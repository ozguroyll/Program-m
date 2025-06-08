import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  FileText, 
  Users, 
  TrendingUp,
  Calendar,
  Package,
  DollarSign
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function TalepYonetimi() {
  const [activeTab, setActiveTab] = useState('talepler');

  const talepler = [
    {
      id: 1,
      musteri: 'Khoshnaw Trading',
      urun: 'Mısır',
      miktar: '5,000 Ton',
      tarih: '2025-06-08',
      durum: 'Beklemede',
      oncelik: 'Yüksek'
    },
    {
      id: 2,
      musteri: 'Kaiwan Group',
      urun: 'Buğday',
      miktar: '3,000 Ton',
      tarih: '2025-06-07',
      durum: 'İnceleniyor',
      oncelik: 'Orta'
    },
    {
      id: 3,
      musteri: 'Baghdad Grain',
      urun: 'Soya Yağı',
      miktar: '1,500 Ton',
      tarih: '2025-06-06',
      durum: 'Teklif Verildi',
      oncelik: 'Düşük'
    }
  ];

  const tedarikciler = [
    {
      id: 1,
      firma: 'Cargill Turkey',
      urun: 'Mısır',
      miktar: '10,000 Ton',
      fiyat: '$245/Ton',
      depo: 'İskenderun Limanı',
      durum: 'Mevcut'
    },
    {
      id: 2,
      firma: 'ADM Türkiye',
      urun: 'Buğday',
      miktar: '8,000 Ton',
      fiyat: '$280/Ton',
      depo: 'Mersin Antrepo',
      durum: 'Mevcut'
    },
    {
      id: 3,
      firma: 'Bunge Turkey',
      urun: 'Soya Yağı',
      miktar: '2,000 Ton',
      fiyat: '$850/Ton',
      depo: 'Dönmezoğlu Antrepo',
      durum: 'Rezerve'
    }
  ];

  const fiyatAnalizleri = [
    {
      id: 1,
      urun: 'Mısır',
      alisF: '$245',
      nakliye: '$15',
      gumruk: '$8',
      diger: '$12',
      toplam: '$280',
      satisF: '$295',
      kar: '$15',
      karOrani: '5.4%'
    },
    {
      id: 2,
      urun: 'Buğday',
      alisF: '$280',
      nakliye: '$18',
      gumruk: '$10',
      diger: '$15',
      toplam: '$323',
      satisF: '$340',
      kar: '$17',
      karOrani: '5.3%'
    }
  ];

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Beklemede': return 'secondary';
      case 'İnceleniyor': return 'default';
      case 'Teklif Verildi': return 'outline';
      case 'Mevcut': return 'default';
      case 'Rezerve': return 'secondary';
      default: return 'outline';
    }
  };

  const getOncelikColor = (oncelik: string) => {
    switch (oncelik) {
      case 'Yüksek': return 'destructive';
      case 'Orta': return 'secondary';
      case 'Düşük': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Talep Yönetimi</h1>
          <p className="text-muted-foreground">
            Müşteri talepleri, tedarikçi bilgileri ve fiyat analiz yönetimi
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Talep
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="talepler" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Müşteri Talepleri
          </TabsTrigger>
          <TabsTrigger value="tedarikciler" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tedarikçi Bilgileri
          </TabsTrigger>
          <TabsTrigger value="fiyat-analiz" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Fiyat Analizi
          </TabsTrigger>
          <TabsTrigger value="notlar" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Notlar & Takip
          </TabsTrigger>
        </TabsList>

        <TabsContent value="talepler" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Müşteri Talepleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Talep ara..." className="pl-8" />
                </div>
                <Button variant="outline">Filtrele</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {talepler.map((talep) => (
                    <TableRow key={talep.id}>
                      <TableCell className="font-medium">{talep.musteri}</TableCell>
                      <TableCell>{talep.urun}</TableCell>
                      <TableCell>{talep.miktar}</TableCell>
                      <TableCell>{talep.tarih}</TableCell>
                      <TableCell>
                        <Badge variant={getDurumColor(talep.durum)}>
                          {talep.durum}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOncelikColor(talep.oncelik)}>
                          {talep.oncelik}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
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

        <TabsContent value="tedarikciler" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tedarikçi Stok Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Tedarikçi ara..." className="pl-8" />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Kayıt
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tedarikçi Firma</TableHead>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Depo/Lokasyon</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tedarikciler.map((tedarikci) => (
                    <TableRow key={tedarikci.id}>
                      <TableCell className="font-medium">{tedarikci.firma}</TableCell>
                      <TableCell>{tedarikci.urun}</TableCell>
                      <TableCell>{tedarikci.miktar}</TableCell>
                      <TableCell className="font-mono">{tedarikci.fiyat}</TableCell>
                      <TableCell>{tedarikci.depo}</TableCell>
                      <TableCell>
                        <Badge variant={getDurumColor(tedarikci.durum)}>
                          {tedarikci.durum}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Güncelle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fiyat-analiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Fiyat Teklif Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Analiz
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Alış Fiyatı</TableHead>
                    <TableHead>Nakliye</TableHead>
                    <TableHead>Gümrük</TableHead>
                    <TableHead>Diğer</TableHead>
                    <TableHead>Toplam Maliyet</TableHead>
                    <TableHead>Satış Fiyatı</TableHead>
                    <TableHead>Kar</TableHead>
                    <TableHead>Kar Oranı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiyatAnalizleri.map((analiz) => (
                    <TableRow key={analiz.id}>
                      <TableCell className="font-medium">{analiz.urun}</TableCell>
                      <TableCell className="font-mono">{analiz.alisF}</TableCell>
                      <TableCell className="font-mono">{analiz.nakliye}</TableCell>
                      <TableCell className="font-mono">{analiz.gumruk}</TableCell>
                      <TableCell className="font-mono">{analiz.diger}</TableCell>
                      <TableCell className="font-mono font-semibold">{analiz.toplam}</TableCell>
                      <TableCell className="font-mono">{analiz.satisF}</TableCell>
                      <TableCell className="font-mono text-green-600">{analiz.kar}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          {analiz.karOrani}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notlar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Günlük Notlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="not-tarihi">Tarih</Label>
                  <Input id="not-tarihi" type="date" />
                </div>
                <div>
                  <Label htmlFor="not-baslik">Başlık</Label>
                  <Input id="not-baslik" placeholder="Not başlığı..." />
                </div>
                <div>
                  <Label htmlFor="not-icerik">İçerik</Label>
                  <Textarea 
                    id="not-icerik" 
                    placeholder="Günlük operasyon notları, tedarikçi görüşmeleri, fiyat bilgileri..."
                    rows={6}
                  />
                </div>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Not Kaydet
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Hızlı Özet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-muted-foreground">Aktif Talepler</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-muted-foreground">Mevcut Tedarikçi</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">5</div>
                    <div className="text-sm text-muted-foreground">Bekleyen Analiz</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$2.5M</div>
                    <div className="text-sm text-muted-foreground">Toplam Değer</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Son Aktiviteler</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Khoshnaw - Mısır talebi</span>
                      <span className="text-muted-foreground">2 saat önce</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cargill fiyat güncelleme</span>
                      <span className="text-muted-foreground">4 saat önce</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yeni analiz tamamlandı</span>
                      <span className="text-muted-foreground">6 saat önce</span>
                    </div>
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

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UltraProfessionalTable } from '@/components/ui/ultra-professional-table';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  TrendingUp, 
  FileText, 
  Calendar
} from 'lucide-react';

interface Talep {
  id: string;
  musteri: string;
  urun: string;
  miktar: number;
  birim: string;
  hedefFiyat: number;
  doviz: string;
  durum: 'Aktif' | 'Beklemede' | 'Tamamlandı' | 'İptal';
  oncelik: 'Yüksek' | 'Orta' | 'Düşük';
  teslimatTarihi: string;
  olusturmaTarihi: string;
  sorumlu: string;
  notlar?: string;
  potansiyelKar?: number;
  karMarji: number;
}

interface Tedarikci {
  id: string;
  firma: string;
  urun: string;
  miktar: number;
  birim: string;
  fiyat: number;
  doviz: string;
  kalite: string;
  teslimatSuresi: string;
  depo: string;
  durum: 'Mevcut' | 'Bekleniyor' | 'Tükendi';
  sonGuncelleme: string;
  stokMiktari: number;
}

export function TalepYonetimi() {
  const [activeTab, setActiveTab] = useState('talepler');

  const talepler: Talep[] = [
    {
      id: 'TLP-001',
      musteri: 'Khoshnaw Trading',
      urun: 'Mısır',
      miktar: 5000,
      birim: 'Ton',
      hedefFiyat: 250,
      doviz: 'USD',
      durum: 'Aktif',
      oncelik: 'Yüksek',
      teslimatTarihi: '2025-06-15',
      olusturmaTarihi: '2025-06-08',
      sorumlu: 'Özgür Yılmaz',
      notlar: 'Protein oranı %14 minimum',
      potansiyelKar: 15000,
      karMarji: 4.7
    },
    {
      id: 'TLP-002',
      musteri: 'Kaiwan Group',
      urun: 'Buğday',
      miktar: 3000,
      birim: 'Ton',
      hedefFiyat: 280,
      doviz: 'USD',
      durum: 'Aktif',
      oncelik: 'Orta',
      teslimatTarihi: '2025-06-20',
      olusturmaTarihi: '2025-06-07',
      sorumlu: 'Şerzat',
      notlar: 'Hektolitre 78+ gerekli',
      potansiyelKar: 12000,
      karMarji: 4.3
    },
    {
      id: 'TLP-003',
      musteri: 'Baghdad Cereals',
      urun: 'Arpa',
      miktar: 2000,
      birim: 'Ton',
      hedefFiyat: 200,
      doviz: 'USD',
      durum: 'Tamamlandı',
      oncelik: 'Düşük',
      teslimatTarihi: '2025-06-10',
      olusturmaTarihi: '2025-06-05',
      sorumlu: 'Amanj',
      notlar: 'Başarıyla teslim edildi',
      potansiyelKar: 8000,
      karMarji: 4.0
    },
    {
      id: 'TLP-004',
      musteri: 'Erbil Food Industries',
      urun: 'Soya Yağı',
      miktar: 500,
      birim: 'Ton',
      hedefFiyat: 1200,
      doviz: 'USD',
      durum: 'Beklemede',
      oncelik: 'Yüksek',
      teslimatTarihi: '2025-06-25',
      olusturmaTarihi: '2025-06-08',
      sorumlu: 'Özgür Yılmaz',
      notlar: 'Rafine soya yağı, ambalajlı',
      potansiyelKar: 25000,
      karMarji: 5.6
    }
  ];

  const tedarikciler: Tedarikci[] = [
    {
      id: 'TDR-001',
      firma: 'Anadolu Tarım',
      urun: 'Mısır',
      miktar: 10000,
      birim: 'Ton',
      fiyat: 245,
      doviz: 'USD',
      kalite: 'A Kalite - Protein %14.2',
      teslimatSuresi: '7 gün',
      depo: 'Mersin Limanı',
      durum: 'Mevcut',
      sonGuncelleme: '2025-06-08 14:30',
      stokMiktari: 8000
    },
    {
      id: 'TDR-002',
      firma: 'Karadeniz Hububat',
      urun: 'Buğday',
      miktar: 15000,
      birim: 'Ton',
      fiyat: 275,
      doviz: 'USD',
      kalite: 'Premium - Hektolitre 79',
      teslimatSuresi: '5 gün',
      depo: 'Samsun Antrepo',
      durum: 'Mevcut',
      sonGuncelleme: '2025-06-08 16:15',
      stokMiktari: 12000
    },
    {
      id: 'TDR-003',
      firma: 'Güneydoğu Tarım',
      urun: 'Arpa',
      miktar: 8000,
      birim: 'Ton',
      fiyat: 195,
      doviz: 'USD',
      kalite: 'Standart - Hektolitre 65',
      teslimatSuresi: '10 gün',
      depo: 'Gaziantep Depo',
      durum: 'Mevcut',
      sonGuncelleme: '2025-06-08 12:45',
      stokMiktari: 6000
    },
    {
      id: 'TDR-004',
      firma: 'Ege Yağ Sanayi',
      urun: 'Soya Yağı',
      miktar: 2000,
      birim: 'Ton',
      fiyat: 1180,
      doviz: 'USD',
      kalite: 'Rafine - 18L Bidon',
      teslimatSuresi: '3 gün',
      depo: 'İzmir Fabrika',
      durum: 'Mevcut',
      sonGuncelleme: '2025-06-08 17:20',
      stokMiktari: 15000
    }
  ];

  const talepColumns: ColumnDef<Talep>[] = [
    {
      accessorKey: "id",
      header: "Talep No",
    },
    {
      accessorKey: "musteri",
      header: "Müşteri",
    },
    {
      accessorKey: "urun",
      header: "Ürün",
    },
    {
      accessorKey: "miktar",
      header: "Miktar",
      cell: ({ row }) => `${row.original.miktar.toLocaleString()} ${row.original.birim}`
    },
    {
      accessorKey: "hedefFiyat",
      header: "Hedef Fiyat",
      cell: ({ row }) => `${row.original.hedefFiyat} ${row.original.doviz}`
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }) => {
        const durum = row.original.durum;
        const variant = durum === 'Aktif' ? 'default' : 
                      durum === 'Tamamlandı' ? 'secondary' : 
                      durum === 'Beklemede' ? 'outline' : 'destructive';
        return <Badge variant={variant}>{durum}</Badge>;
      }
    },
    {
      accessorKey: "oncelik",
      header: "Öncelik",
      cell: ({ row }) => {
        const oncelik = row.original.oncelik;
        const variant = oncelik === 'Yüksek' ? 'destructive' : 
                       oncelik === 'Orta' ? 'default' : 'secondary';
        return <Badge variant={variant}>{oncelik}</Badge>;
      }
    },
    {
      accessorKey: "teslimatTarihi",
      header: "Teslimat Tarihi",
    },
    {
      accessorKey: "sorumlu",
      header: "Sorumlu",
    },
    {
      accessorKey: "potansiyelKar",
      header: "Potansiyel Kar",
      cell: ({ row }) => row.original.potansiyelKar ? `$${row.original.potansiyelKar.toLocaleString()}` : '-'
    }
  ];

  const tedarikciColumns: ColumnDef<Tedarikci>[] = [
    {
      accessorKey: "firma",
      header: "Tedarikçi",
    },
    {
      accessorKey: "urun",
      header: "Ürün",
    },
    {
      accessorKey: "miktar",
      header: "Miktar",
      cell: ({ row }) => `${row.original.miktar.toLocaleString()} ${row.original.birim}`
    },
    {
      accessorKey: "fiyat",
      header: "Fiyat",
      cell: ({ row }) => `${row.original.fiyat} ${row.original.doviz}`
    },
    {
      accessorKey: "kalite",
      header: "Kalite",
    },
    {
      accessorKey: "teslimatSuresi",
      header: "Teslimat Süresi",
    },
    {
      accessorKey: "depo",
      header: "Depo",
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }) => {
        const durum = row.original.durum;
        const variant = durum === 'Mevcut' ? 'default' : 
                       durum === 'Bekleniyor' ? 'outline' : 'destructive';
        return <Badge variant={variant}>{durum}</Badge>;
      }
    },
    {
      accessorKey: "stokMiktari",
      header: "Stok Miktarı",
      cell: ({ row }) => `${row.original.stokMiktari.toLocaleString()} ${row.original.birim}`
    },
    {
      accessorKey: "sonGuncelleme",
      header: "Son Güncelleme",
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Talep Yönetimi</h2>
          <p className="text-muted-foreground">
            Müşteri talepleri ve tedarikçi stok durumunu yönetin
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Talep
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Talepler</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{talepler.filter(t => t.durum === 'Aktif').length}</div>
            <p className="text-xs text-muted-foreground">Bu ay</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% geçen aya göre
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Potansiyel Kar</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${talepler.reduce((sum, t) => sum + (t.potansiyelKar || 0), 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Aktif talepler</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% geçen aya göre
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mevcut Tedarikçiler</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tedarikciler.filter(t => t.durum === 'Mevcut').length}</div>
            <p className="text-xs text-muted-foreground">Aktif stoklar</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Teslimat Süresi</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5 gün</div>
            <p className="text-xs text-muted-foreground">Tüm tedarikçiler</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              -2 gün geçen aya göre
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="talepler">Müşteri Talepleri</TabsTrigger>
          <TabsTrigger value="tedarikciler">Tedarikçi Stokları</TabsTrigger>
          <TabsTrigger value="analiz">Fiyat Analizi</TabsTrigger>
        </TabsList>

        <TabsContent value="talepler" className="flex-1 space-y-4">
          <UltraProfessionalTable
            data={talepler}
            columns={talepColumns}
            title="Müşteri Talepleri"
            description="Aktif ve bekleyen talepler"
            searchKey="musteri"
            searchPlaceholder="Müşteri, ürün veya talep ID ile ara..."
            onExport={(format: string) => {
              const fileName = `export_${new Date().toISOString().split('T')[0]}.${format}`;
              alert(`${format.toUpperCase()} formatında dışa aktarma: ${fileName}`);
            }}
            onRefresh={() => window.location.reload()}
            onView={(row: any) => alert(`Detaylar: ${row.id}`)}
            onEdit={(row: any) => alert(`Düzenle: ${row.id}`)}
            onDelete={(_row: any) => {
              if (confirm('Bu talebi silmek istediğinizden emin misiniz?')) {
                alert('Silme özelliği yakında eklenecek');
              }
            }}
          />
        </TabsContent>

        <TabsContent value="tedarikciler" className="flex-1 space-y-4">
          <UltraProfessionalTable
            data={tedarikciler}
            columns={tedarikciColumns}
            title="Tedarikçi Stok Durumu"
            description="Mevcut stoklar ve fiyat bilgileri"
            searchKey="firma"
            searchPlaceholder="Firma, ürün veya depo ile ara..."
            onExport={(format: string) => {
              const fileName = `export_${new Date().toISOString().split('T')[0]}.${format}`;
              alert(`${format.toUpperCase()} formatında dışa aktarma: ${fileName}`);
            }}
            onRefresh={() => window.location.reload()}
            onView={(row: any) => alert(`Detaylar: ${row.id}`)}
            onEdit={(row: any) => alert(`Düzenle: ${row.id}`)}
            onDelete={(_row: any) => {
              if (confirm('Bu tedarikçi kaydını silmek istediğinizden emin misiniz?')) {
                alert('Silme özelliği yakında eklenecek');
              }
            }}
          />
        </TabsContent>

        <TabsContent value="analiz" className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fiyat Teklif Analizi</CardTitle>
              <CardDescription>
                Müşteri talepleri ve tedarikçi fiyatları karşılaştırması
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {talepler.filter(t => t.durum === 'Aktif').map((talep) => {
                    const uygunTedarikciler = tedarikciler.filter(
                      t => t.urun === talep.urun && t.durum === 'Mevcut' && t.fiyat <= talep.hedefFiyat
                    );
                    
                    return (
                      <Card key={talep.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{talep.urun}</h4>
                            <Badge variant="outline">{talep.id}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {talep.musteri} - {talep.miktar.toLocaleString()} {talep.birim}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Hedef Fiyat:</span>
                              <span className="font-medium">{talep.hedefFiyat} {talep.doviz}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Uygun Tedarikçi:</span>
                              <span className={`font-medium ${uygunTedarikciler.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {uygunTedarikciler.length} adet
                              </span>
                            </div>
                            {talep.potansiyelKar && (
                              <div className="flex justify-between text-sm">
                                <span>Potansiyel Kar:</span>
                                <span className="font-medium text-green-600">
                                  ${talep.potansiyelKar.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

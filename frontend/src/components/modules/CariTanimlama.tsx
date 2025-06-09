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
import { Users, Building2, Plus, Trash2, Save, RotateCcw } from 'lucide-react';

interface CariKaydi {
  id: string;
  kod: string;
  ad: string;
  tip: string;
  telefon: string;
  email: string;
  adres: string;
  vergiNo: string;
  hesapSayisi: number;
  durum: 'Aktif' | 'Pasif';
  olusturmaTarihi: string;
}

interface HesapTuru {
  id: string;
  cariId: string;
  hesapAdi: string;
  aciklama: string;
  durum: 'Aktif' | 'Pasif';
}

export function CariTanimlama() {
  const [selectedCari, setSelectedCari] = useState<CariKaydi | null>(null);
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');
  const [activeTab, setActiveTab] = useState('cari-form');

  const cariTipleri = [
    'Müşteri',
    'Tedarikçi', 
    'Ortak',
    'Gümrükçü',
    'Nakliyeci',
    'Antrepo/Depo',
    'İlaçlama',
    'Hizmet',
    'Diğer'
  ];

  const cariListesi: CariKaydi[] = [
    {
      id: 'CRI001',
      kod: 'KHOSH001',
      ad: 'Khoshnaw Trading',
      tip: 'Müşteri',
      telefon: '+964 750 123 4567',
      email: 'info@khoshnaw.iq',
      adres: 'Erbil, Irak',
      vergiNo: 'IQ123456789',
      hesapSayisi: 3,
      durum: 'Aktif',
      olusturmaTarihi: '2025-01-15'
    },
    {
      id: 'CRI002',
      kod: 'KAIWAN001',
      ad: 'Kaiwan Group',
      tip: 'Müşteri',
      telefon: '+964 751 987 6543',
      email: 'contact@kaiwan.iq',
      adres: 'Baghdad, Irak',
      vergiNo: 'IQ987654321',
      hesapSayisi: 2,
      durum: 'Aktif',
      olusturmaTarihi: '2025-02-10'
    },
    {
      id: 'CRI003',
      kod: 'CARGILL001',
      ad: 'Cargill Turkey',
      tip: 'Tedarikçi',
      telefon: '+90 212 555 0123',
      email: 'turkey@cargill.com',
      adres: 'İstanbul, Türkiye',
      vergiNo: 'TR1234567890',
      hesapSayisi: 4,
      durum: 'Aktif',
      olusturmaTarihi: '2024-12-05'
    },
    {
      id: 'CRI004',
      kod: 'SERZAT001',
      ad: 'Şerzat Bey',
      tip: 'Ortak',
      telefon: '+964 750 111 2222',
      email: 'serzat@zad-agro.iq',
      adres: 'Erbil, Irak',
      vergiNo: 'IQ111222333',
      hesapSayisi: 5,
      durum: 'Aktif',
      olusturmaTarihi: '2024-11-01'
    },
    {
      id: 'CRI005',
      kod: 'AMANJ001',
      ad: 'Amanj Bey',
      tip: 'Ortak',
      telefon: '+964 751 333 4444',
      email: 'amanj@global-agro.iq',
      adres: 'Baghdad, Irak',
      vergiNo: 'IQ333444555',
      hesapSayisi: 4,
      durum: 'Aktif',
      olusturmaTarihi: '2024-11-01'
    }
  ];

  const hesapTurleri: HesapTuru[] = [
    { id: 'HSP001', cariId: 'CRI004', hesapAdi: 'Mısır Hesabı', aciklama: 'Şerzat Bey mısır alım/satım hesabı', durum: 'Aktif' },
    { id: 'HSP002', cariId: 'CRI004', hesapAdi: 'Buğday Hesabı', aciklama: 'Şerzat Bey buğday alım/satım hesabı', durum: 'Aktif' },
    { id: 'HSP003', cariId: 'CRI004', hesapAdi: 'Soya Yağı Hesabı', aciklama: 'Şerzat Bey soya yağı alım/satım hesabı', durum: 'Aktif' },
    { id: 'HSP004', cariId: 'CRI004', hesapAdi: 'Genel Giderler', aciklama: 'Şerzat Bey genel gider hesabı', durum: 'Aktif' },
    { id: 'HSP005', cariId: 'CRI004', hesapAdi: 'Komisyon Hesabı', aciklama: 'Şerzat Bey komisyon hesabı', durum: 'Aktif' },
    { id: 'HSP006', cariId: 'CRI005', hesapAdi: 'Mısır Hesabı', aciklama: 'Amanj Bey mısır alım/satım hesabı', durum: 'Aktif' },
    { id: 'HSP007', cariId: 'CRI005', hesapAdi: 'Buğday Hesabı', aciklama: 'Amanj Bey buğday alım/satım hesabı', durum: 'Aktif' },
    { id: 'HSP008', cariId: 'CRI005', hesapAdi: 'Genel Giderler', aciklama: 'Amanj Bey genel gider hesabı', durum: 'Aktif' },
    { id: 'HSP009', cariId: 'CRI005', hesapAdi: 'Komisyon Hesabı', aciklama: 'Amanj Bey komisyon hesabı', durum: 'Aktif' }
  ];

  const getDurumColor = (durum: string) => {
    return durum === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTipColor = (tip: string) => {
    switch (tip) {
      case 'Müşteri': return 'bg-blue-100 text-blue-800';
      case 'Tedarikçi': return 'bg-purple-100 text-purple-800';
      case 'Ortak': return 'bg-orange-100 text-orange-800';
      case 'Gümrükçü': return 'bg-yellow-100 text-yellow-800';
      case 'Nakliyeci': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cariColumns = [
    {
      accessorKey: "kod",
      header: "Cari Kodu",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("kod")}</div>
      ),
    },
    {
      accessorKey: "ad",
      header: "Cari Adı",
    },
    {
      accessorKey: "tip",
      header: "Tipi",
      cell: ({ row }: any) => (
        <Badge className={getTipColor(row.getValue("tip"))}>
          {row.getValue("tip")}
        </Badge>
      ),
    },
    {
      accessorKey: "telefon",
      header: "Telefon",
    },
    {
      accessorKey: "hesapSayisi",
      header: "Hesap Sayısı",
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }: any) => (
        <Badge className={getDurumColor(row.getValue("durum"))}>
          {row.getValue("durum")}
        </Badge>
      ),
    },
  ];

  const hesapColumns = [
    {
      accessorKey: "cariAdi",
      header: "Cari Adı",
      cell: ({ row }: any) => {
        const cari = cariListesi.find(c => c.id === row.original.cariId);
        return <div className="font-medium">{cari?.ad}</div>;
      },
    },
    {
      accessorKey: "hesapAdi",
      header: "Hesap Türü",
    },
    {
      accessorKey: "aciklama",
      header: "Açıklama",
    },
    {
      accessorKey: "durum",
      header: "Durum",
      cell: ({ row }: any) => (
        <Badge className={getDurumColor(row.getValue("durum"))}>
          {row.getValue("durum")}
        </Badge>
      ),
    },
  ];

  const handleCariSelect = (cari: CariKaydi) => {
    setSelectedCari(cari);
    setFormMode('edit');
    setActiveTab('cari-form');
  };

  const handleYeniCari = () => {
    setSelectedCari(null);
    setFormMode('new');
    setActiveTab('cari-form');
  };

  const getSelectedCariHesaplari = () => {
    if (!selectedCari) return [];
    return hesapTurleri.filter(hesap => hesap.cariId === selectedCari.id);
  };

  return (
    <div className="h-full p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cari Tanımlama</h2>
          <p className="text-muted-foreground">Müşteri, tedarikçi ve ortakları tanımlayın</p>
        </div>
        <Button onClick={handleYeniCari} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Cari
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cari-form" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Cari Tanımlama Formu
          </TabsTrigger>
          <TabsTrigger value="cari-listesi" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Cari Listesi
          </TabsTrigger>
          <TabsTrigger value="hesap-turleri" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Hesap Türleri
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cari-form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {formMode === 'new' ? 'Yeni Cari Tanımlama' : 'Cari Düzenleme'}
              </CardTitle>
              <CardDescription>
                {formMode === 'new' 
                  ? 'Yeni müşteri, tedarikçi veya ortak tanımlayın'
                  : `${selectedCari?.ad} bilgilerini düzenleyin`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cari-kod">Cari Kodu *</Label>
                      <Input 
                        id="cari-kod" 
                        placeholder="KHOSH001" 
                        defaultValue={selectedCari?.kod || ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cari-tip">Cari Tipi *</Label>
                      <Select defaultValue={selectedCari?.tip || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tip seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {cariTipleri.map((tip) => (
                            <SelectItem key={tip} value={tip}>{tip}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cari-ad">Cari Adı *</Label>
                    <Input 
                      id="cari-ad" 
                      placeholder="Khoshnaw Trading" 
                      defaultValue={selectedCari?.ad || ''}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefon">Telefon</Label>
                      <Input 
                        id="telefon" 
                        placeholder="+964 750 123 4567" 
                        defaultValue={selectedCari?.telefon || ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="info@khoshnaw.iq" 
                        defaultValue={selectedCari?.email || ''}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vergi-no">Vergi/Kimlik No</Label>
                    <Input 
                      id="vergi-no" 
                      placeholder="IQ123456789" 
                      defaultValue={selectedCari?.vergiNo || ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="adres">Adres</Label>
                    <Textarea 
                      id="adres" 
                      placeholder="Tam adres bilgisi..." 
                      defaultValue={selectedCari?.adres || ''}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Hesap Türleri</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bu cariye ait farklı hesap türlerini tanımlayın
                    </p>
                    
                    {selectedCari && getSelectedCariHesaplari().length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getSelectedCariHesaplari().map((hesap) => (
                          <Card key={hesap.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{hesap.hesapAdi}</h4>
                                <p className="text-sm text-muted-foreground">{hesap.aciklama}</p>
                              </div>
                              <Badge className={getDurumColor(hesap.durum)}>
                                {hesap.durum}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Henüz hesap türü tanımlanmamış</p>
                        <p className="text-sm">Cari kaydedildikten sonra hesap türleri eklenebilir</p>
                      </div>
                    )}

                    <div className="space-y-3 mt-4">
                      <div>
                        <Label htmlFor="hesap-adi">Yeni Hesap Türü</Label>
                        <Input id="hesap-adi" placeholder="Mısır Hesabı" />
                      </div>
                      <div>
                        <Label htmlFor="hesap-aciklama">Açıklama</Label>
                        <Input id="hesap-aciklama" placeholder="Mısır alım/satım hesabı" />
                      </div>
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Hesap Türü Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                <Button className="bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  {formMode === 'new' ? 'Kaydet' : 'Güncelle'}
                </Button>
                <Button variant="outline" onClick={handleYeniCari}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Yeni
                </Button>
                {selectedCari && (
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cari-listesi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Cari Listesi
              </CardTitle>
              <CardDescription>
                Tüm müşteri, tedarikçi ve ortakları görüntüleyin ve düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UltraProfessionalTable
                columns={cariColumns}
                data={cariListesi}
                title="Cari Kayıtları"
                description="Tüm müşteri, tedarikçi ve ortakları görüntüleyin"
                searchPlaceholder="Cari adı, kodu veya tipi ara..."
                enableSearch
                enableFilters
                enableExport
                enableColumnVisibility
                enableRowSelection
                onAdd={handleYeniCari}
                onEdit={(cari: any) => handleCariSelect(cari)}
                onDelete={(cari: any) => {
                  if (confirm(`${cari.ad} kaydını silmek istediğinizden emin misiniz?`)) {
                    alert('Silme özelliği yakında eklenecek');
                  }
                }}
                onExport={(format) => {
                  alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                }}
                onRefresh={() => window.location.reload()}
                showMetrics
                metrics={{
                  total: cariListesi.length,
                  active: cariListesi.filter(c => c.durum === 'Aktif').length,
                  pending: cariListesi.filter(c => c.durum === 'Pasif').length,
                  completed: cariListesi.filter(c => c.hesapSayisi > 0).length
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hesap-turleri" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Hesap Türleri Yönetimi
              </CardTitle>
              <CardDescription>
                Carilere ait hesap türlerini görüntüleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UltraProfessionalTable
                columns={hesapColumns}
                data={hesapTurleri}
                title="Hesap Türleri"
                description="Carilere ait hesap türlerini görüntüleyin ve yönetin"
                searchPlaceholder="Hesap adı veya cari ara..."
                enableSearch
                enableFilters
                enableExport
                enableColumnVisibility
                enableRowSelection
                onEdit={(hesap: any) => {
                  alert(`${hesap.hesapAdi} düzenleme özelliği yakında eklenecek`);
                }}
                onDelete={(hesap: any) => {
                  if (confirm(`${hesap.hesapAdi} hesabını silmek istediğinizden emin misiniz?`)) {
                    alert('Silme özelliği yakında eklenecek');
                  }
                }}
                onExport={(format) => {
                  alert(`${format} formatında dışa aktarma özelliği yakında eklenecek`);
                }}
                onRefresh={() => window.location.reload()}
                showMetrics
                metrics={{
                  total: hesapTurleri.length,
                  active: hesapTurleri.filter(h => h.durum === 'Aktif').length,
                  pending: hesapTurleri.filter(h => h.durum === 'Pasif').length,
                  completed: hesapTurleri.length
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

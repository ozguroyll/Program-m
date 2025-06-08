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
import { Users, Building2, Plus, Search, Edit, Trash2, Save, RotateCcw } from 'lucide-react';

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
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Cari adı, kodu veya tipi ara..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tip filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {cariTipleri.map((tip) => (
                      <SelectItem key={tip} value={tip}>{tip}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cari Kodu</TableHead>
                    <TableHead>Cari Adı</TableHead>
                    <TableHead>Tipi</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Hesap Sayısı</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cariListesi.map((cari) => (
                    <TableRow key={cari.id}>
                      <TableCell className="font-medium">{cari.kod}</TableCell>
                      <TableCell>{cari.ad}</TableCell>
                      <TableCell>
                        <Badge className={getTipColor(cari.tip)}>
                          {cari.tip}
                        </Badge>
                      </TableCell>
                      <TableCell>{cari.telefon}</TableCell>
                      <TableCell>{cari.hesapSayisi}</TableCell>
                      <TableCell>
                        <Badge className={getDurumColor(cari.durum)}>
                          {cari.durum}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCariSelect(cari)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
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
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Hesap adı veya cari ara..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Cari filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Cariler</SelectItem>
                    {cariListesi.map((cari) => (
                      <SelectItem key={cari.id} value={cari.id}>{cari.ad}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cari Adı</TableHead>
                    <TableHead>Hesap Türü</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hesapTurleri.map((hesap) => {
                    const cari = cariListesi.find(c => c.id === hesap.cariId);
                    return (
                      <TableRow key={hesap.id}>
                        <TableCell className="font-medium">{cari?.ad}</TableCell>
                        <TableCell>{hesap.hesapAdi}</TableCell>
                        <TableCell>{hesap.aciklama}</TableCell>
                        <TableCell>
                          <Badge className={getDurumColor(hesap.durum)}>
                            {hesap.durum}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

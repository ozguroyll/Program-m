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
import { CalendarIcon, Building2, Plus, Search, Edit, Trash2, Save, Download, Eye, CreditCard, ArrowUpDown, ArrowUp, ArrowDown, DollarSign, TrendingUp, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  currency: string;
  balance: number;
  accountType: string;
  company: string;
  status: string;
  openDate: string;
}

interface BankTransaction {
  id: string;
  date: string;
  accountId: string;
  accountName: string;
  transactionType: string;
  amount: number;
  currency: string;
  description: string;
  referenceNo: string;
  relatedParty: string;
  status: string;
  category: string;
}

export function BankaYonetimi() {
  const [activeTab, setActiveTab] = useState('hesap-tanimlama');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');

  const [bankAccounts] = useState<BankAccount[]>([
    {
      id: 'BA001',
      bankName: 'Ziraat Bankası',
      accountName: 'Yılmaz Transport Ana Hesap',
      accountNumber: '12345678',
      iban: 'TR33 0001 0012 3456 7890 1234 56',
      currency: 'TRY',
      balance: 2850000,
      accountType: 'Vadesiz',
      company: 'Yılmaz Transport',
      status: 'Aktif',
      openDate: '2023-01-15'
    },
    {
      id: 'BA002',
      bankName: 'İş Bankası',
      accountName: 'Global Agro USD Hesap',
      accountNumber: '87654321',
      iban: 'TR64 0006 4000 0087 6543 2100 01',
      currency: 'USD',
      balance: 125000,
      accountType: 'Vadesiz',
      company: 'Global Agro',
      status: 'Aktif',
      openDate: '2023-02-20'
    },
    {
      id: 'BA003',
      bankName: 'Garanti BBVA',
      accountName: 'Zad Agro EUR Hesap',
      accountNumber: '11223344',
      iban: 'TR98 0006 2000 1122 3344 5566 78',
      currency: 'EUR',
      balance: 85000,
      accountType: 'Vadeli',
      company: 'Zad Agro',
      status: 'Aktif',
      openDate: '2023-03-10'
    },
    {
      id: 'BA004',
      bankName: 'Akbank',
      accountName: 'Yılmaz Tarım TRY Hesap',
      accountNumber: '55667788',
      iban: 'TR12 0004 6000 5566 7788 9900 11',
      currency: 'TRY',
      balance: 1250000,
      accountType: 'Vadesiz',
      company: 'Yılmaz Tarım',
      status: 'Aktif',
      openDate: '2023-04-05'
    }
  ]);

  const [bankTransactions] = useState<BankTransaction[]>([
    {
      id: 'BT001',
      date: '2025-06-08',
      accountId: 'BA001',
      accountName: 'Yılmaz Transport Ana Hesap',
      transactionType: 'Gelen Havale',
      amount: 150000,
      currency: 'TRY',
      description: 'Khoshnaw Trading mısır ödemesi',
      referenceNo: 'HVL001',
      relatedParty: 'Khoshnaw Trading',
      status: 'Tamamlandı',
      category: 'Satış Tahsilatı'
    },
    {
      id: 'BT002',
      date: '2025-06-08',
      accountId: 'BA002',
      accountName: 'Global Agro USD Hesap',
      transactionType: 'Giden EFT',
      amount: -25000,
      currency: 'USD',
      description: 'Cargill Turkey buğday ödemesi',
      referenceNo: 'EFT002',
      relatedParty: 'Cargill Turkey',
      status: 'Tamamlandı',
      category: 'Alış Ödemesi'
    },
    {
      id: 'BT003',
      date: '2025-06-07',
      accountId: 'BA003',
      accountName: 'Zad Agro EUR Hesap',
      transactionType: 'FAST',
      amount: 12000,
      currency: 'EUR',
      description: 'Komisyon geliri',
      referenceNo: 'FST003',
      relatedParty: 'Şerzat Bey',
      status: 'Beklemede',
      category: 'Komisyon'
    },
    {
      id: 'BT004',
      date: '2025-06-07',
      accountId: 'BA004',
      accountName: 'Yılmaz Tarım TRY Hesap',
      transactionType: 'Çek Tahsilatı',
      amount: 75000,
      currency: 'TRY',
      description: 'Kaiwan Group çek tahsilatı',
      referenceNo: 'ÇEK004',
      relatedParty: 'Kaiwan Group',
      status: 'Tamamlandı',
      category: 'Satış Tahsilatı'
    },
    {
      id: 'BT005',
      date: '2025-06-06',
      accountId: 'BA001',
      accountName: 'Yılmaz Transport Ana Hesap',
      transactionType: 'Giden Havale',
      amount: -45000,
      currency: 'TRY',
      description: 'Nakliye gideri ödemesi',
      referenceNo: 'HVL005',
      relatedParty: 'Özkan Nakliyat',
      status: 'Tamamlandı',
      category: 'Operasyonel Gider'
    }
  ]);

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
        return <Badge variant="default" className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'Pasif':
        return <Badge variant="secondary">Pasif</Badge>;
      case 'Tamamlandı':
        return <Badge variant="default" className="bg-green-100 text-green-800">Tamamlandı</Badge>;
      case 'Beklemede':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Beklemede</Badge>;
      case 'İptal':
        return <Badge variant="destructive">İptal</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTransactionTypeBadge = (type: string) => {
    const isIncoming = ['Gelen Havale', 'FAST', 'Çek Tahsilatı', 'Senet Tahsilatı'].includes(type);
    return (
      <Badge variant={isIncoming ? "default" : "destructive"} 
             className={isIncoming ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {type}
      </Badge>
    );
  };

  const getTotalBalance = (currency: string) => {
    return bankAccounts
      .filter(account => account.currency === currency && account.status === 'Aktif')
      .reduce((total, account) => total + account.balance, 0);
  };

  const getTransactionSummary = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = bankTransactions.filter(t => t.date === today);
    
    const incoming = todayTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const outgoing = todayTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { incoming, outgoing, count: todayTransactions.length };
  };

  const summary = getTransactionSummary();

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Banka Yönetimi</h2>
          <p className="text-muted-foreground">Banka hesapları ve işlemlerini yönetin</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yeni İşlem
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hesap-tanimlama" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hesap Tanımlama
          </TabsTrigger>
          <TabsTrigger value="islem-listesi" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            İşlem Listesi
          </TabsTrigger>
          <TabsTrigger value="mutabakat" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Mutabakat
          </TabsTrigger>
          <TabsTrigger value="raporlar" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Raporlar
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-6">
          <TabsContent value="hesap-tanimlama" className="h-full space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Banka Hesabı Formu
                    </CardTitle>
                    <CardDescription>
                      Yeni banka hesabı tanımlayın veya mevcut hesabı düzenleyin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Banka Adı *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Banka seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ziraat">Ziraat Bankası</SelectItem>
                            <SelectItem value="isbank">İş Bankası</SelectItem>
                            <SelectItem value="garanti">Garanti BBVA</SelectItem>
                            <SelectItem value="akbank">Akbank</SelectItem>
                            <SelectItem value="yapi-kredi">Yapı Kredi</SelectItem>
                            <SelectItem value="halkbank">Halkbank</SelectItem>
                            <SelectItem value="vakifbank">VakıfBank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Şirket *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Şirket seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yilmaz-transport">Yılmaz Transport</SelectItem>
                            <SelectItem value="global-agro">Global Agro</SelectItem>
                            <SelectItem value="zad-agro">Zad Agro</SelectItem>
                            <SelectItem value="yilmaz-tarim">Yılmaz Tarım</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountName">Hesap Adı *</Label>
                      <Input placeholder="Hesap adını girin" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Hesap Numarası *</Label>
                        <Input placeholder="Hesap numarasını girin" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Para Birimi *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Para birimi seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TRY">TRY - Türk Lirası</SelectItem>
                            <SelectItem value="USD">USD - Amerikan Doları</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - İngiliz Sterlini</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN *</Label>
                      <Input placeholder="TR00 0000 0000 0000 0000 0000 00" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountType">Hesap Türü *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Hesap türü seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vadesiz">Vadesiz Mevduat</SelectItem>
                            <SelectItem value="vadeli">Vadeli Mevduat</SelectItem>
                            <SelectItem value="kredi">Kredi Hesabı</SelectItem>
                            <SelectItem value="teminat">Teminat Hesabı</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="openDate">Açılış Tarihi *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initialBalance">Başlangıç Bakiyesi</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea placeholder="Hesap hakkında notlar..." />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Kaydet
                      </Button>
                      <Button variant="outline">Temizle</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Toplam Bakiyeler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">TRY Toplam:</span>
                        <span className="font-bold text-green-700">
                          {formatCurrency(getTotalBalance('TRY'), 'TRY')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">USD Toplam:</span>
                        <span className="font-bold text-blue-700">
                          {formatCurrency(getTotalBalance('USD'), 'USD')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">EUR Toplam:</span>
                        <span className="font-bold text-purple-700">
                          {formatCurrency(getTotalBalance('EUR'), 'EUR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Günlük Özet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <ArrowUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <div className="text-sm text-muted-foreground">Gelen</div>
                        <div className="font-bold text-green-700">₺{summary.incoming.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <ArrowDown className="h-6 w-6 text-red-600 mx-auto mb-1" />
                        <div className="text-sm text-muted-foreground">Giden</div>
                        <div className="font-bold text-red-700">₺{summary.outgoing.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Toplam İşlem</div>
                      <div className="font-bold text-blue-700">{summary.count} işlem</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="islem-listesi" className="h-full space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Banka İşlem Listesi
                </CardTitle>
                <CardDescription>
                  Tüm banka giriş ve çıkış işlemlerini görüntüleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Açıklama, referans no veya cari ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="İşlem tipi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm İşlemler</SelectItem>
                      <SelectItem value="gelen-havale">Gelen Havale</SelectItem>
                      <SelectItem value="giden-havale">Giden Havale</SelectItem>
                      <SelectItem value="eft">EFT</SelectItem>
                      <SelectItem value="fast">FAST</SelectItem>
                      <SelectItem value="cek">Çek</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-32">
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

                <div className="rounded-md border">
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
                      {bankTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <div>
                              {getTransactionTypeBadge(transaction.transactionType)}
                              <div className="text-sm text-muted-foreground mt-1">
                                {transaction.accountName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>
                            <div>
                              {transaction.relatedParty}
                              <div className="text-sm text-muted-foreground">
                                {transaction.referenceNo}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={transaction.amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                              {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mutabakat" className="h-full space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hesap Ekstreleri</CardTitle>
                  <CardDescription>
                    Banka hesaplarının güncel durumu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{account.accountName}</h4>
                            <p className="text-sm text-muted-foreground">{account.bankName}</p>
                            <p className="text-sm text-muted-foreground">{account.iban}</p>
                          </div>
                          {getStatusBadge(account.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Bakiye:</span>
                          <span className="font-bold text-lg">
                            {formatCurrency(account.balance, account.currency)}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Ekstre
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Mutabakat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mutabakat Formu</CardTitle>
                  <CardDescription>
                    Banka ekstresi ile sistem bakiyesini karşılaştırın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hesap Seçin</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Hesap seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.accountName} - {account.bankName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Başlangıç Tarihi</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Bitiş Tarihi</Label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Banka Ekstresi Bakiyesi</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>

                  <div className="space-y-2">
                    <Label>Sistem Bakiyesi</Label>
                    <Input value="125.000,00" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Fark</Label>
                    <Input value="0.00" disabled className="text-green-600" />
                  </div>

                  <div className="space-y-2">
                    <Label>Mutabakat Notları</Label>
                    <Textarea placeholder="Mutabakat ile ilgili notlar..." />
                  </div>

                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Mutabakat Raporu Oluştur
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="raporlar" className="h-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Toplam Giriş</p>
                      <p className="text-2xl font-bold text-green-600">₺237.000,00</p>
                      <p className="text-xs text-muted-foreground">Bu ay toplam</p>
                    </div>
                    <ArrowUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Toplam Çıkış</p>
                      <p className="text-2xl font-bold text-red-600">₺70.000,00</p>
                      <p className="text-xs text-muted-foreground">Bu ay toplam</p>
                    </div>
                    <ArrowDown className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Net Hareket</p>
                      <p className="text-2xl font-bold text-blue-600">₺167.000,00</p>
                      <p className="text-xs text-muted-foreground">Bu ay net</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Aktif Hesap</p>
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-xs text-muted-foreground">hesap</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detaylı Raporlar</CardTitle>
                <CardDescription>
                  Kapsamlı banka analiz raporları oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Günlük Banka Raporu</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Aylık Hareket Raporu</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Döviz Bazlı Rapor</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <span className="text-sm">Hesap Bazlı Rapor</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ClipboardList, 
  Users, 
  CreditCard, 
  Building, 
  TrendingUp,
  FileText,
  Wallet
} from 'lucide-react';

interface LeftSidebarProps {
  onModuleSelect: (id: string, title: string, module: string) => void;
}

export function LeftSidebar({ onModuleSelect }: LeftSidebarProps) {
  const modules = {
    operasyon: {
      title: 'OPERASYON',
      items: [
        { id: 'talep-yonetimi', title: 'Talep Yönetimi', icon: ClipboardList },
        { id: 'stok-yonetimi', title: 'Stok Yönetimi', icon: Package }
      ]
    },
    muhasebe: {
      title: 'MUHASEBE',
      items: [
        { id: 'cari-tanimlama', title: 'Cari Tanımlama', icon: Users },
        { id: 'cari-islemler', title: 'Cari İşlemler', icon: CreditCard },
        { id: 'fatura-yonetimi', title: 'Fatura Yönetimi', icon: FileText },
        { id: 'kasa-yonetimi', title: 'Kasa Yönetimi', icon: Wallet },
        { id: 'banka-yonetimi', title: 'Banka Yönetimi', icon: Building },
        { id: 'gelir-gider-yonetimi', title: 'Gelir/Gider Yönetimi', icon: TrendingUp }
      ]
    }
  };

  return (
    <div className="h-full bg-sidebar border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">Modüller</h2>
        
        <Accordion type="multiple" defaultValue={['operasyon', 'muhasebe']} className="w-full">
          {Object.entries(modules).map(([key, section]) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-sm font-medium">
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pl-4">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start text-sm h-auto py-2 px-2"
                        onClick={() => onModuleSelect(item.id, item.title, item.id)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

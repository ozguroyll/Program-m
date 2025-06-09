import { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LeftSidebar } from './LeftSidebar';
import { RightPanel } from './RightPanel';
import { TopNavigation } from './TopNavigation';
import { BottomStatusBar } from './BottomStatusBar';
import { TalepYonetimi } from '../modules/TalepYonetimi';
import { StokYonetimi } from '../modules/StokYonetimi';
import { CariTanimlama } from '../modules/CariTanimlama';
import { CariIslemler } from '../modules/CariIslemler';
import { FaturaYonetimi } from '../modules/FaturaYonetimi';
import { KasaYonetimi } from '../modules/KasaYonetimi';
import BankaYonetimi from '../modules/BankaYonetimi';
import GelirGiderYonetimi from '../modules/GelirGiderYonetimi';
import { EnhancedDashboardMetrics, QuickActions, RecentActivities } from '../ui/enhanced-dashboard-metrics';

export function MainLayout() {
  const [leftPanelOpen] = useState(true);
  const [rightPanelOpen] = useState(true);
  const [openTabs, setOpenTabs] = useState<Array<{ id: string; title: string; module: string }>>([
    { id: 'dashboard', title: 'Ana Sayfa', module: 'dashboard' }
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const addTab = (id: string, title: string, module: string) => {
    if (!openTabs.find(tab => tab.id === id)) {
      setOpenTabs([...openTabs, { id, title, module }]);
    }
    setActiveTab(id);
  };

  const closeTab = (id: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== id);
    setOpenTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNavigation />
      
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {leftPanelOpen && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <LeftSidebar onModuleSelect={addTab} />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          
          <ResizablePanel defaultSize={rightPanelOpen ? 60 : 80}>
            <div className="h-full flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="border-b bg-muted/50 px-4 py-2">
                  <TabsList className="h-auto p-1">
                    {openTabs.map((tab) => (
                      <div key={tab.id} className="flex items-center">
                        <TabsTrigger value={tab.id} className="relative pr-8">
                          {tab.title}
                          {tab.id !== 'dashboard' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                              }}
                            >
                              ×
                            </Button>
                          )}
                        </TabsTrigger>
                      </div>
                    ))}
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-auto">
                  {openTabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="h-full m-0 p-0">
                      {tab.id === 'dashboard' ? (
                        <div className="h-full overflow-auto p-6 bg-gray-50">
                          <div className="max-w-7xl mx-auto space-y-6">
                            <div className="text-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Stok Muhasebe Sistemi
                              </h1>
                              <p className="text-lg text-gray-600">
                                Profesyonel çok-şirketli ticaret yönetim platformu
                              </p>
                            </div>
                            
                            <EnhancedDashboardMetrics />
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <QuickActions className="lg:col-span-1" />
                              <RecentActivities className="lg:col-span-2" />
                            </div>
                            
                            <div className="text-center text-sm text-gray-500 mt-8">
                              Sol menüden bir modül seçerek detaylı işlemlere başlayabilirsiniz
                            </div>
                          </div>
                        </div>
                      ) : tab.id === 'talep-yonetimi' ? (
                        <TalepYonetimi />
                      ) : tab.id === 'stok-yonetimi' ? (
                        <StokYonetimi />
                      ) : tab.id === 'cari-tanimlama' ? (
                        <CariTanimlama />
                      ) : tab.id === 'cari-islemler' ? (
                        <CariIslemler />
                      ) : tab.id === 'fatura-yonetimi' ? (
                        <FaturaYonetimi />
                      ) : tab.id === 'kasa-yonetimi' ? (
                        <KasaYonetimi />
                      ) : tab.id === 'banka-yonetimi' ? (
                        <BankaYonetimi />
                      ) : tab.id === 'gelir-gider-yonetimi' ? (
                        <GelirGiderYonetimi />
                      ) : (
                        <div className="h-full p-4">
                          <h3 className="text-lg font-semibold mb-4">{tab.title}</h3>
                          <p className="text-muted-foreground">
                            {tab.module} modülü içeriği burada görüntülenecek
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </ResizablePanel>
          
          {rightPanelOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <RightPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
      
      <BottomStatusBar />
    </div>
  );
}

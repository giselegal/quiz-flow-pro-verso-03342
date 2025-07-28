import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DirectionProvider } from '@radix-ui/react-direction';
import {
  FileText,
  Menu,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Eye,
  Plus,
  Upload,
  ArrowLeft,
  Home
} from 'lucide-react';
import { SchemaDrivenComponentsSidebar } from './sidebar/SchemaDrivenComponentsSidebar';
import { DynamicPropertiesPanel } from './panels/DynamicPropertiesPanel';
import DroppableCanvas from './dnd/DroppableCanvas';
import { allBlockDefinitions } from '../../config/blockDefinitions';
import { useLocation } from 'wouter';
import { schemaDrivenFunnelService } from '../../services/schemaDrivenFunnelService';

interface SchemaDrivenEditorSimpleProps {
  funnelId?: string;
  className?: string;
}

type DeviceView = 'mobile' | 'tablet' | 'desktop';

const SchemaDrivenEditorSimple: React.FC<SchemaDrivenEditorSimpleProps> = ({
  funnelId,
  className = ''
}) => {
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'components' | 'pages'>('components');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [funnel, setFunnel] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [, setLocation] = useLocation();

  // Inicializar funil com 21 etapas
  useEffect(() => {
    const initializeFunnel = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Inicializando funil com 21 etapas...');
        
        let currentFunnel;
        if (funnelId) {
          currentFunnel = await schemaDrivenFunnelService.loadFunnel(funnelId);
        }
        
        if (!currentFunnel) {
          console.log('📝 Criando novo funil com 21 etapas...');
          currentFunnel = await schemaDrivenFunnelService.createDefaultFunnel();
        }
        
        console.log('✅ Funil carregado:', currentFunnel);
        console.log(`📊 Total de páginas: ${currentFunnel.pages?.length || 0}`);
        
        setFunnel(currentFunnel);
        setPages(currentFunnel.pages || []);
        
        if (currentFunnel.pages && currentFunnel.pages.length > 0) {
          setCurrentPage(currentFunnel.pages[0]);
          console.log('📱 Página atual definida:', currentFunnel.pages[0]);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar funil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFunnel();
  }, [funnelId]);

  const handlePageSelect = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setCurrentPage(page);
      console.log('📄 Página selecionada:', page);
    }
  };

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
    setShowRightSidebar(true);
  };

  const handleBlockAdd = async (blockType: string) => {
    if (!currentPage) return;

    try {
      const newBlock = {
        id: `block_${Date.now()}`,
        type: blockType,
        properties: {},
        position: currentPage.blocks?.length || 0
      };

      const updatedPage = {
        ...currentPage,
        blocks: [...(currentPage.blocks || []), newBlock]
      };

      setCurrentPage(updatedPage);
      
      // Atualizar o array de páginas
      const updatedPages = pages.map(p => 
        p.id === currentPage.id ? updatedPage : p
      );
      setPages(updatedPages);

      console.log('➕ Bloco adicionado:', newBlock);
    } catch (error) {
      console.error('❌ Erro ao adicionar bloco:', error);
    }
  };

  const handleBlockDelete = (blockId: string) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      blocks: currentPage.blocks?.filter((b: any) => b.id !== blockId) || []
    };

    setCurrentPage(updatedPage);
    
    const updatedPages = pages.map(p => 
      p.id === currentPage.id ? updatedPage : p
    );
    setPages(updatedPages);

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleBlockDuplicate = (blockId: string) => {
    if (!currentPage) return;

    const blockToDuplicate = currentPage.blocks?.find((b: any) => b.id === blockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock = {
      ...blockToDuplicate,
      id: `block_${Date.now()}`,
    };

    const updatedPage = {
      ...currentPage,
      blocks: [...(currentPage.blocks || []), duplicatedBlock]
    };

    setCurrentPage(updatedPage);
    
    const updatedPages = pages.map(p => 
      p.id === currentPage.id ? updatedPage : p
    );
    setPages(updatedPages);
  };

  const handleBlockToggleVisibility = (blockId: string) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      blocks: currentPage.blocks?.map((block: any) => 
        block.id === blockId 
          ? { ...block, properties: { ...block.properties, hidden: !block.properties?.hidden } }
          : block
      ) || []
    };

    setCurrentPage(updatedPage);
    
    const updatedPages = pages.map(p => 
      p.id === currentPage.id ? updatedPage : p
    );
    setPages(updatedPages);
  };

  const handleSaveInline = (blockId: string, updates: any) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      blocks: currentPage.blocks?.map((block: any) => 
        block.id === blockId 
          ? { ...block, ...updates }
          : block
      ) || []
    };

    setCurrentPage(updatedPage);
    
    const updatedPages = pages.map(p => 
      p.id === currentPage.id ? updatedPage : p
    );
    setPages(updatedPages);
  };

  const handleSave = async () => {
    if (!funnel) return;

    try {
      setIsLoading(true);
      const updatedFunnel = {
        ...funnel,
        pages: pages
      };
      
      await schemaDrivenFunnelService.saveFunnel(updatedFunnel);
      console.log('💾 Funil salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar funil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deviceWidths = {
    mobile: 'max-w-sm',
    tablet: 'max-w-2xl',
    desktop: 'max-w-full'
  };

  const getSelectedBlock = () => {
    if (!selectedBlockId || !currentPage) return null;
    return currentPage.blocks?.find((b: any) => b.id === selectedBlockId) || null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
          <p className="text-[#8F7A6A]">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <DirectionProvider dir="ltr">
        <div className={`flex flex-col h-screen bg-gradient-to-br from-[#F5F1EB] to-[#E8DDD4] ${className}`}>
          {/* Header */}
          <header className="bg-white border-b border-[#E0D5C7] shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/')}
                  className="text-[#8F7A6A] hover:text-[#432818]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#B89B7A]" />
                  <span className="font-medium text-[#432818]">
                    Editor de Funil - {pages.length} Etapas
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Device View Selector */}
                <div className="flex items-center bg-[#F5F1EB] rounded-lg p-1">
                  <Button
                    variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDeviceView('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDeviceView('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDeviceView('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-[#B89B7A] hover:bg-[#aa6b5d]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            {showLeftSidebar && (
              <div className="w-80 bg-white border-r border-[#E0D5C7] shadow-sm">
                <SchemaDrivenComponentsSidebar
                  onComponentSelect={handleBlockAdd}
                  activeTab={activeTab}
                  onTabChange={(tab: string) => setActiveTab(tab as 'components' | 'pages')}
                  funnelPages={pages}
                  currentPageId={currentPage?.id}
                  setCurrentPage={handlePageSelect}
                />
              </div>
            )}

            {/* Canvas Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-auto">
                <div className={`mx-auto transition-all duration-300 ${deviceWidths[deviceView]}`}>
                  <div className="bg-white rounded-lg shadow-lg min-h-[600px]">
                    <DroppableCanvas
                      blocks={currentPage?.blocks || []}
                      selectedBlockId={selectedBlockId || undefined}
                      onBlockSelect={handleBlockSelect}
                      onBlockDelete={handleBlockDelete}
                      onBlockDuplicate={handleBlockDuplicate}
                      onBlockToggleVisibility={handleBlockToggleVisibility}
                      onSaveInline={handleSaveInline}
                      onAddBlock={handleBlockAdd}
                      setShowRightSidebar={setShowRightSidebar}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            {showRightSidebar && (
              <div className="w-80 bg-white border-l border-[#E0D5C7] shadow-sm">
                <DynamicPropertiesPanel
                  selectedBlock={getSelectedBlock()}
                  funnelConfig={{}}
                  onBlockPropertyChange={(key: string, value: any) => {
                    if (selectedBlockId) {
                      handleSaveInline(selectedBlockId, { properties: { [key]: value } });
                    }
                  }}
                  onNestedPropertyChange={(path: string, value: any) => {
                    if (selectedBlockId) {
                      const pathKeys = path.split('.');
                      const updates: any = {};
                      let current = updates;
                      for (let i = 0; i < pathKeys.length - 1; i++) {
                        current[pathKeys[i]] = {};
                        current = current[pathKeys[i]];
                      }
                      current[pathKeys[pathKeys.length - 1]] = value;
                      handleSaveInline(selectedBlockId, { properties: updates });
                    }
                  }}
                  onFunnelConfigChange={() => {}}
                />
              </div>
            )}
          </div>
        </div>
      </DirectionProvider>
    </DndProvider>
  );
};

export default SchemaDrivenEditorSimple;

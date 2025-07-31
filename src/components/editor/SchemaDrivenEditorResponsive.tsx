
import React, { useState, useEffect, useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, EyeOff, Smartphone, Tablet, Monitor, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { schemaDrivenFunnelService } from '@/services/schemaDrivenFunnelService';
import { StepsPanel } from './sidebar/StepsPanel';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { EditPreview } from './preview/EditPreview';
import PropertiesPanel from './properties/PropertiesPanel';
import { useEditor } from '@/hooks/useEditor';
import { useEditorPersistence } from '@/hooks/editor/useEditorPersistence';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { cn } from '@/lib/utils';

interface ViewportConfig {
  width: string;
  height: string;
  icon: React.ElementType;
  label: string;
}

const VIEWPORT_CONFIGS: Record<string, ViewportConfig> = {
  mobile: { width: '375px', height: '812px', icon: Smartphone, label: 'Mobile' },
  tablet: { width: '768px', height: '1024px', icon: Tablet, label: 'Tablet' },
  desktop: { width: '100%', height: '100%', icon: Monitor, label: 'Desktop' }
};

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
  initialBlocks?: any[];
  onSave?: (project: any) => void;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className = '',
  initialBlocks = [],
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'steps' | 'components'>('steps');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const { config, setConfig, addBlock, updateBlock, deleteBlock } = useEditor();
  const { saveFunnel, loadFunnel, isSaving, isLoading } = useEditorPersistence();

  // Auto-save com debounce
  const handleAutoSave = async (data: any) => {
    const preservedId = funnelId || data.id || `funnel_${Date.now()}`;
    
    const funnelData = {
      id: preservedId,
      name: data.title || 'Funil de 21 Etapas',
      description: data.description || 'Quiz personalizado de estilo com 21 etapas',
      isPublished: false,
      version: data.version || 1,
      settings: data.settings || {},
      pages: [{
        id: `page_${Date.now()}`,
        pageType: 'landing',
        pageOrder: 0,
        title: data.title || 'Página Principal',
        blocks: data.blocks || [],
        metadata: {}
      }]
    };
    
    await saveFunnel(funnelData);
  };

  const { forceSave } = useAutoSaveWithDebounce({
    data: config,
    onSave: handleAutoSave,
    delay: 1000,
    enabled: !!config?.blocks?.length,
    showToasts: false
  });

  // Carregar dados do funil se ID for fornecido
  useEffect(() => {
    const loadFunnelData = async () => {
      if (!funnelId) {
        if (initialBlocks?.length > 0) {
          setConfig({
            blocks: initialBlocks,
            title: 'Funil de 21 Etapas',
            description: 'Quiz personalizado de estilo'
          });
        }
        return;
      }
      
      try {
        console.log('🔍 Carregando funil:', funnelId);
        const schemaDrivenData = await schemaDrivenFunnelService.loadFunnel(funnelId);
        
        if (schemaDrivenData) {
          const firstPage = schemaDrivenData.pages[0];
          if (firstPage && firstPage.blocks) {
            setConfig({
              blocks: firstPage.blocks,
              title: firstPage.title || schemaDrivenData.name,
              description: schemaDrivenData.description
            });
            console.log('✅ Funil carregado com', firstPage.blocks.length, 'blocos');
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar funil:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar funil",
          variant: "destructive"
        });
      }
    };

    loadFunnelData();
  }, [funnelId, setConfig, initialBlocks]);

  // Função para popular uma etapa específica
  const handlePopulateStep = async (stepNumber: number) => {
    setIsLoadingStep(true);
    try {
      console.log(`🎯 Populando etapa ${stepNumber}`);
      
      const stepData = await schemaDrivenFunnelService.getStepTemplate(stepNumber);
      if (stepData && stepData.blocks) {
        // Limpar blocos existentes e adicionar os novos
        setConfig(prev => ({
          ...prev,
          blocks: stepData.blocks,
          title: stepData.title || `Etapa ${stepNumber}`
        }));
        
        toast({
          title: "Etapa carregada",
          description: `Etapa ${stepNumber} foi carregada com ${stepData.blocks.length} componentes`,
        });
      } else {
        toast({
          title: "Aviso",
          description: `Template da etapa ${stepNumber} não encontrado`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro ao popular etapa:', error);
      toast({
        title: "Erro",
        description: `Erro ao carregar etapa ${stepNumber}`,
        variant: "destructive"
      });
    } finally {
      setIsLoadingStep(false);
    }
  };

  const handleSave = async () => {
    try {
      await forceSave();
      toast({
        title: "Salvo",
        description: "Funil salvo com sucesso",
      });
      
      if (onSave && typeof onSave === 'function') {
        onSave({
          id: funnelId,
          blocks: config.blocks,
          title: config.title,
          description: config.description
        });
      }
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o funil",
        variant: "destructive"
      });
    }
  };

  const togglePreview = () => {
    setIsPreviewing(!isPreviewing);
    setSelectedComponentId(null);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setSelectedComponentId(null);
  };

  const handleAddComponent = (type: string) => {
    const newId = addBlock(type);
    setSelectedComponentId(newId);
  };

  const handleSelectComponent = (id: string | null) => {
    setSelectedComponentId(id);
  };

  const currentViewport = VIEWPORT_CONFIGS[viewport];

  return (
    <div className={cn("h-screen flex flex-col bg-[#FAF9F7]", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#432818]">
            Editor Visual de Funil
          </h1>
          <Badge variant="outline" className="text-[#432818] border-[#432818]">
            21 Etapas Completas
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Seletor de Viewport */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            {Object.entries(VIEWPORT_CONFIGS).map(([key, config]) => (
              <Button
                key={key}
                variant={viewport === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewport(key)}
                className="h-8 px-2"
              >
                <config.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={togglePreview}
            className="border-[#432818] text-[#432818] hover:bg-[#432818] hover:text-white"
          >
            {isPreviewing ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreviewing ? 'Editar' : 'Visualizar'}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#B89B7A] hover:bg-[#A08A73] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Painel Esquerdo */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full flex flex-col border-r border-gray-200">
              {/* Tabs para alternar entre etapas e componentes */}
              <div className="flex border-b">
                <button
                  onClick={() => setViewMode('steps')}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                    viewMode === 'steps' 
                      ? "bg-[#B89B7A] text-white" 
                      : "bg-gray-50 text-gray-600 hover:text-gray-800"
                  )}
                >
                  Etapas Quiz
                </button>
                <button
                  onClick={() => setViewMode('components')}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                    viewMode === 'components' 
                      ? "bg-[#B89B7A] text-white" 
                      : "bg-gray-50 text-gray-600 hover:text-gray-800"
                  )}
                >
                  Componentes
                </button>
              </div>

              {/* Conteúdo do painel */}
              {viewMode === 'steps' ? (
                <StepsPanel
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                  onPopulateStep={handlePopulateStep}
                  isLoading={isLoadingStep}
                />
              ) : (
                <ComponentsSidebar onComponentSelect={handleAddComponent} />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Painel Central - Preview */}
          <ResizablePanel defaultSize={55}>
            <div className="h-full bg-gray-100 relative overflow-auto">
              <div className="h-full flex items-center justify-center p-4">
                <div 
                  className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300"
                  style={{
                    width: currentViewport.width,
                    height: currentViewport.height,
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                >
                  <EditPreview
                    isPreviewing={isPreviewing}
                    onPreviewToggle={togglePreview}
                    selectedComponentId={selectedComponentId}
                    onSelectComponent={handleSelectComponent}
                    funnelMode={true}
                    currentStep={currentStep}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Painel Direito - Properties */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <PropertiesPanel
              selectedComponentId={selectedComponentId}
              onClose={() => setSelectedComponentId(null)}
              blocks={config.blocks || []}
              onUpdate={(id, content) => updateBlock(id, content)}
              onDelete={(id) => {
                deleteBlock(id);
                setSelectedComponentId(null);
              }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;

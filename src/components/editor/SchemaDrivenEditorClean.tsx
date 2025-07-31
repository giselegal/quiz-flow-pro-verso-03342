import React, { useState, useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Save, Monitor, Tablet, Smartphone, PlayCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSchemaEditor } from '../../hooks/useSchemaEditor';
import { UniversalBlockRenderer } from './blocks/UniversalBlockRenderer';
import { AdvancedPropertyPanel } from './AdvancedPropertyPanel';
import { ComponentsPanel } from './ComponentsPanel';
import { useToast } from '../../hooks/use-toast';

interface SchemaDrivenEditorCleanProps {
  funnelId?: string;
  className?: string;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

const AVAILABLE_BLOCKS = [
  // === COMPONENTES BÁSICOS ===
  { type: 'heading-inline', name: 'Título', icon: '📝', category: 'text' },
  { type: 'text-inline', name: 'Texto', icon: '📄', category: 'text' },
  { type: 'image-display-inline', name: 'Imagem', icon: '🖼️', category: 'media' },
  { type: 'button-inline', name: 'Botão', icon: '🔘', category: 'interactive' },
  { type: 'form-input', name: 'Campo de Entrada', icon: '📝', category: 'form' },

  // === COMPONENTES QUIZ ===
  { type: 'quiz-intro-header', name: 'Cabeçalho Quiz', icon: '��️', category: 'quiz' },
  { type: 'options-grid', name: 'Grade de Opções', icon: '⚏', category: 'quiz' },
  { type: 'quiz-progress', name: 'Progresso', icon: '📊', category: 'quiz' },

  // === COMPONENTES ESTRATÉGICOS ===
  { type: 'strategic-question-main', name: 'Questão Estratégica', icon: '🎯', category: 'strategic' },

  // === COMPONENTES DE RESULTADO ===
  { type: 'result-header-inline', name: 'Cabeçalho do Resultado', icon: '🎊', category: 'resultado' },
  { type: 'result-card-inline', name: 'Card de Resultado', icon: '🏆', category: 'resultado' },

  // === COMPONENTES DE OFERTA ===
  { type: 'quiz-offer-cta-inline', name: 'CTA de Oferta', icon: '💎', category: 'oferta' },
  { type: 'quiz-offer-pricing-inline', name: 'Preço da Oferta', icon: '💰', category: 'oferta' },
];

const SchemaDrivenEditorClean: React.FC<SchemaDrivenEditorCleanProps> = ({
  funnelId,
  className
}) => {
  // 🚀 HOOK UNIFICADO - UseSchemaEditor
  const {
    funnel,
    currentPage,
    selectedBlock,
    isLoading,
    isSaving,
    currentPageId,
    selectedBlockId,
    setCurrentPage,
    addBlock,
    updateBlock,
    deleteBlock,
    setSelectedBlock,
    saveFunnel
  } = useSchemaEditor(funnelId);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Detect mobile screen size
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Safe access to blocks with fallback
  const blocks = currentPage?.blocks || [];

  // Dados do funil atual para o painel de etapas
  const steps = funnel?.pages?.map((page, index) => ({
    id: page.id,
    name: page.title || `Etapa ${index + 1}`,
    order: index + 1,
    blocksCount: page.blocks?.length || 0,
    isActive: page.id === currentPageId,
    type: index === 0 ? 'intro' : index < 12 ? 'question' : index === 12 ? 'transition' : index < 20 ? 'strategic' : index === 19 ? 'result' : 'offer',
    description: page.title || `Etapa ${index + 1} do quiz`
  })) || [];

  const selectedStepId = currentPageId;

  const handleAddBlock = useCallback((blockType: string) => {
    addBlock({ type: blockType, properties: {} });
  }, [addBlock]);

  const handleSelectBlock = useCallback((blockId: string | null) => {
    setSelectedBlock(blockId);
  }, [setSelectedBlock]);

  const handleUpdateBlock = useCallback((blockId: string, properties: Record<string, any>) => {
    updateBlock(blockId, { properties });
  }, [updateBlock]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    deleteBlock(blockId);
    if (selectedBlockId === blockId) {
      setSelectedBlock(null);
    }
  }, [deleteBlock, selectedBlockId, setSelectedBlock]);

  const handleSelectStep = useCallback((stepId: string) => {
    setCurrentPage(stepId);
  }, [setCurrentPage]);

  const handleSave = useCallback(async () => {
    await saveFunnel(true);
  }, [saveFunnel]);

  const previewClasses = {
    desktop: 'w-full max-w-none',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto'
  };

  const selectedBlockData = blocks.find(block => block.id === selectedBlockId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Editor Quiz</h1>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              variant="default"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        {/* Mobile Steps Panel */}
        <div className="bg-white border-b border-gray-200 p-2">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {steps.map((step) => (
                <Button
                  key={step.id}
                  variant={step.id === selectedStepId ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelectStep(step.id)}
                  className="whitespace-nowrap"
                >
                  {step.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Mobile Canvas */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    "border border-gray-200 rounded-lg p-4",
                    selectedBlockId === block.id && "ring-2 ring-blue-500"
                  )}
                  onClick={() => handleSelectBlock(block.id)}
                >
                  <UniversalBlockRenderer
                    block={block}
                    isEditing={true}
                    onUpdate={(properties) => handleUpdateBlock(block.id, properties)}
                    onDelete={() => handleDeleteBlock(block.id)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Mobile Add Block Button */}
        <div className="bg-white border-t border-gray-200 p-4">
          <ComponentsPanel
            onAddBlock={handleAddBlock}
            availableBlocks={AVAILABLE_BLOCKS}
            compact={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-screen bg-gray-50", className)}>
      {/* Desktop/Tablet Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Editor Schema-Driven</h1>
            {funnel && (
              <span className="text-sm text-gray-600">
                {funnel.name} • {steps.length} etapas
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Preview Mode */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant={isPreviewing ? 'default' : 'outline'}
              onClick={() => setIsPreviewing(!isPreviewing)}
              size="sm"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              {isPreviewing ? 'Editar' : 'Visualizar'}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              variant="default"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-80px)]">
        
        {/* Steps Panel */}
        <ResizablePanel defaultSize={15} minSize={12} maxSize={25}>
          <div className="h-full bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Etapas do Quiz</h3>
              <p className="text-sm text-gray-600 mt-1">{steps.length} etapas</p>
            </div>
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="p-2 space-y-1">
                {steps.map((step) => (
                  <Button
                    key={step.id}
                    variant={step.id === selectedStepId ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleSelectStep(step.id)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{step.name}</span>
                      <span className="text-xs opacity-75">
                        {step.blocksCount} blocos
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Components Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-white border-r border-gray-200">
            <ComponentsPanel
              onAddBlock={handleAddBlock}
              availableBlocks={AVAILABLE_BLOCKS}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Canvas */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="h-full bg-gray-50">
            <ScrollArea className="h-full">
              <div className={cn("p-8", previewClasses[previewMode])}>
                <div className="bg-white rounded-lg shadow-sm min-h-[600px] p-6">
                  {blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-center">
                      <div>
                        <p className="text-gray-500 mb-4">
                          Nenhum bloco adicionado ainda
                        </p>
                        <p className="text-sm text-gray-400">
                          Adicione blocos usando o painel de componentes
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blocks.map((block) => (
                        <div
                          key={block.id}
                          className={cn(
                            "relative group",
                            !isPreviewing && "border border-transparent hover:border-gray-300 rounded-lg p-2",
                            selectedBlockId === block.id && !isPreviewing && "ring-2 ring-blue-500 border-blue-500"
                          )}
                          onClick={() => !isPreviewing && handleSelectBlock(block.id)}
                        >
                          <UniversalBlockRenderer
                            block={block}
                            isEditing={!isPreviewing}
                            onUpdate={(properties) => handleUpdateBlock(block.id, properties)}
                            onDelete={() => handleDeleteBlock(block.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Properties Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-white border-l border-gray-200">
            <AdvancedPropertyPanel
              selectedBlock={selectedBlockData}
              onUpdateBlock={handleUpdateBlock}
            />
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorClean;

import { Eye, Image, Layout, Mouse, Redo, Save, Type, Undo } from 'lucide-react';
import { useState } from 'react';
import { BlockType, PropertiesPanel } from '../components/editor/properties/PropertiesPanel';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';
import { Separator } from '../components/ui/separator';
import { useEditor } from '../contexts/EditorContext';

/**
 * 🏆 EDITOR PRINCIPAL: EditorFixedPageWithDragDrop
 * Localização: src/pages/editor-fixed.tsx
 *
 * Editor de 4 colunas com layout responsivo baseado em ResizablePanel
 * Funcionalidades principais:
 * - Layout de 4 colunas ajustáveis
 * - 21 etapas do funil
 * - Biblioteca de componentes
 * - Canvas de edição
 * - Painel de propriedades avançado (PropertiesPanel)
 * - Toolbar com ações principais
 */
const EditorFixedPageWithDragDrop = () => {
  // EditorContext para integração completa
  const { 
    selectedBlock, 
    selectedBlockId,
    setSelectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock 
  } = useEditor();

  // Estado local para UI
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState('desktop');
  const [showPreview, setShowPreview] = useState(false);

  // 21 ETAPAS DO FUNIL
  const funnelSteps = Array.from({ length: 21 }, (_, i) => ({
    id: i + 1,
    name: `Etapa ${i + 1}`,
    active: currentStep === i + 1,
    description: i === 0 ? 'Quiz Intro' : 
                i === 20 ? 'Resultado Final' : 
                i < 10 ? `Pergunta ${i}` : 
                `Qualificação ${i - 9}`
  }));

  // Componentes disponíveis
  const components = [
    { id: 'heading', name: 'Título', icon: Type, category: 'Texto' },
    { id: 'paragraph', name: 'Parágrafo', icon: Type, category: 'Texto' },
    { id: 'button', name: 'Botão', icon: Mouse, category: 'Interação' },
    { id: 'image', name: 'Imagem', icon: Image, category: 'Mídia' },
    { id: 'card', name: 'Card', icon: Layout, category: 'Layout' },
  ];

  // Componentes disponíveis para adicionar
  const handleAddComponent = async (type: string) => {
    try {
      const blockId = await addBlock(type as BlockType);
      if (blockId) {
        setSelectedBlockId(blockId);
      }
    } catch (error) {
      console.error('Erro ao adicionar componente:', error);
    }
  };

  // Handler para atualizar propriedades
  const handleUpdateBlock = (blockId: string, updates: Record<string, any>) => {
    updateBlock(blockId, updates);
  };

  // Handler para deletar bloco
  const handleDeleteBlock = (blockId: string) => {
    deleteBlock(blockId);
  };

  // Handler para seleção de etapa
  const handleStepChange = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="h-screen w-full bg-background">
      {/* 🎨 TOOLBAR SUPERIOR */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Editor Quiz Quest</h1>
          <Badge variant="outline">4 Colunas</Badge>
          <Badge variant="secondary">21 Etapas</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
          >
            Desktop
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tablet')}
          >
            Tablet
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
          >
            Mobile
          </Button>
          <Separator orientation="vertical" className="mx-2" />
          <Button variant="outline" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4" />
            {showPreview ? 'Editar' : 'Preview'}
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* 📐 LAYOUT DE 4 COLUNAS */}
      <div className="h-[calc(100vh-56px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* 📝 COLUNA 1: ETAPAS DO FUNIL (21) */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={25}>
            <div className="h-full border-r border-border p-4 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">Etapas do Funil</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {funnelSteps.length} etapas configuradas
                </p>
              </div>
              
              <div className="space-y-2">
                {funnelSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                      step.active 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card border-border hover:border-primary'
                    }`}
                    onClick={() => handleStepChange(step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{step.name}</span>
                      <Badge variant={step.active ? 'secondary' : 'outline'} className="text-xs">
                        {step.id}
                      </Badge>
                    </div>
                    {step.description && (
                      <p className="text-xs opacity-80 mt-1">{step.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* 🧩 COLUNA 2: BIBLIOTECA DE COMPONENTES */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-r border-border p-4 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">Componentes</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Arraste para o canvas
                </p>
              </div>

              <div className="space-y-3">
                {components.map(component => {
                  const IconComponent = component.icon;
                  return (
                    <div
                      key={component.id}
                      className="group p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary cursor-grab transition-all"
                      draggable
                      onClick={() => handleAddComponent(component.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-background border">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{component.name}</p>
                          <p className="text-xs text-muted-foreground">{component.category}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status de seleção */}
              <div className="mt-6 p-3 rounded-lg bg-muted">
                <h4 className="font-medium text-sm mb-2">Selecionado</h4>
                {selectedBlock ? (
                  <div>
                    <p className="text-sm">
                      Bloco: {selectedBlock.type || 'Sem tipo'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {selectedBlockId}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum componente selecionado
                  </p>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* 🎨 COLUNA 3: CANVAS DE EDIÇÃO */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <div className="h-full border-r border-border p-4 overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Canvas</h3>
                  <p className="text-xs text-muted-foreground">
                    Etapa {currentStep} de {funnelSteps.length}
                  </p>
                </div>
                <Badge variant="outline">{viewMode}</Badge>
              </div>

              {/* Canvas responsivo */}
              <div className={`mx-auto bg-white border rounded-lg shadow-sm transition-all ${
                viewMode === 'desktop' ? 'w-full' :
                viewMode === 'tablet' ? 'max-w-2xl' :
                'max-w-sm'
              }`}>
                <div className="p-6 min-h-[600px]">
                  <div className="text-center py-20 text-muted-foreground">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h4 className="font-medium mb-2">Canvas da Etapa {currentStep}</h4>
                    <p className="text-sm">
                      {funnelSteps.find(s => s.id === currentStep)?.description}
                    </p>
                    <div className="mt-4 text-xs">
                      Arraste componentes da biblioteca ou clique para adicionar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* ⚙️ COLUNA 4: PAINEL DE PROPRIEDADES AVANÇADO */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full p-4 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-semibold text-sm">Propriedades</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedBlock 
                    ? `Editando: ${selectedBlock.type || 'Bloco'}`
                    : 'Selecione um componente'
                  }
                </p>
              </div>

              {/* PAINEL DE PROPRIEDADES AVANÇADO */}
              {selectedBlock ? (
                <PropertiesPanel
                  block={selectedBlock}
                  onChange={(updates) => {
                    if (selectedBlockId) {
                      handleUpdateBlock(selectedBlockId, updates);
                    }
                  }}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="p-3 rounded-full bg-muted mx-auto w-fit mb-3">
                    <Mouse className="h-6 w-6" />
                  </div>
                  <p className="text-sm">Selecione um componente no canvas</p>
                  <p className="text-xs mt-1">
                    para editar suas propriedades
                  </p>
                </div>
              )}

              {/* Debug Info */}
              <div className="mt-6 p-3 rounded-lg bg-muted text-xs">
                <h4 className="font-medium mb-2">Debug</h4>
                <p>Etapa atual: {currentStep}</p>
                <p>Modo: {viewMode}</p>
                <p>Bloco selecionado: {selectedBlockId || 'Nenhum'}</p>
                <p>Preview: {showPreview ? 'Ativo' : 'Inativo'}</p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default EditorFixedPageWithDragDrop;

import React from 'react';
import { useFunnels } from '@/context/FunnelsContext';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Settings, Save, Component, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable-panels';
import { BlockType } from '@/types/editor';

// Componentes otimizados
import { useEditorState } from '@/hooks/useEditorState';
import { BlockLoadingStates } from '@/components/editor/LoadingStates';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import BlockRenderer from '@/components/editor/blocks/BlockRenderer';

/**
 * 🚀 EDITOR REFATORADO: Versão otimizada com hooks especializados
 *
 * Melhorias aplicadas:
 * ✅ Hooks especializados para performance
 * ✅ Componentes separados e reutilizáveis
 * ✅ Error boundaries para estabilidade
 * ✅ Loading states apropriados
 * ✅ Cache otimizado de templates
 */
const EditorFixed21Stages: React.FC = () => {
  const { steps } = useFunnels();

  // Hook centralizado para todo o estado do editor
  const {
    selectedStep,
    setSelectedStep,
    blocks,
    selectedBlock,
    selectBlock,
    updateBlock,
    deleteBlock,
    addBlock,
    getSelectedBlockData,
    isPreviewMode,
    togglePreviewMode,
    isDragOver,
    setIsDragOver,
    userResponses,
    setUserResponses,
    isLoading,
    error,
  } = useEditorState();

  // Helper para validar tipos de blocos
  const isValidBlockType = (type: string): type is BlockType => {
    const validTypes = [
      'text',
      'button',
      'image',
      'lead-form',
      'options-grid',
      'quiz-header',
      'result-display',
      'offer-cta',
    ];
    return validTypes.includes(type);
  };

  const currentStepNumber = parseInt(selectedStep.replace('step-', ''));
  const selectedBlockData = getSelectedBlockData();

  // Helper functions para drag & drop
  const getDefaultProperties = (componentType: string) => {
    const defaults: Record<string, any> = {
      text: { fontSize: '16px', color: '#000000' },
      button: { backgroundColor: '#B89B7A', color: '#ffffff' },
      image: { width: '100%', height: 'auto' },
      'lead-form': { required: true },
      'options-grid': { requiredSelections: 3, autoAdvance: false },
    };
    return defaults[componentType] || {};
  };

  const getDefaultContent = (componentType: string) => {
    const defaults: Record<string, any> = {
      text: { text: 'Novo texto' },
      button: { text: 'Clique aqui', url: '#' },
      image: { url: '', alt: 'Nova imagem' },
      'lead-form': { title: 'Digite seu nome', placeholder: 'Nome', buttonText: 'Continuar' },
      'options-grid': { title: 'Selecione suas opções', options: [] },
    };
    return defaults[componentType] || {};
  };

  const handleComponentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const componentType = e.dataTransfer.getData('component-type');
    if (componentType && isValidBlockType(componentType)) {
      addBlock({
        type: componentType as BlockType,
        properties: getDefaultProperties(componentType),
        content: getDefaultContent(componentType),
        order: blocks.length,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const currentStepInfo = steps.find(step => step.id === selectedStep);

  // Estados de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BlockLoadingStates.Template />
      </div>
    );
  }

  // Estados de erro
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <BlockLoadingStates.Error error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-background overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
          {/* Left Panel - Components Library */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full bg-muted/30 border-r">
              <div className="p-4 border-b">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <Component className="h-4 w-4" />
                  Componentes
                </h2>
              </div>
              <ComponentsLibrary />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Middle Panel - Steps Selector & Canvas */}
          <ResizablePanel defaultSize={50}>
            <div className="h-full flex flex-col">
              {/* Steps Selector */}
              <div className="border-b bg-background p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-lg font-semibold">Editor de Funil</h1>
                    <p className="text-sm text-muted-foreground">Etapa {currentStepNumber} de 21</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPreviewMode ? 'default' : 'outline'}
                      size="sm"
                      onClick={togglePreviewMode}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {isPreviewMode ? 'Sair do Preview' : 'Preview'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>

                <FunnelStagesPanel onStageSelect={setSelectedStep} />
              </div>

              {/* Canvas */}
              <div className="flex-1 overflow-auto">
                <div
                  className={cn(
                    'min-h-full p-6',
                    isDragOver && 'bg-primary/5 border-primary border-dashed border-2'
                  )}
                  onDrop={handleComponentDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-medium">{currentStepInfo?.name || 'Etapa'}</h2>
                        <p className="text-sm text-muted-foreground">
                          {currentStepInfo?.description || 'Configure os blocos desta etapa'}
                        </p>
                      </div>
                      <Badge variant="secondary">{blocks.length} blocos</Badge>
                    </div>

                    <div className="space-y-3">
                      {blocks.length > 0 ? (
                        blocks.map(block => (
                          <div
                            key={block.id}
                            className={cn(
                              'relative group border rounded-lg transition-colors',
                              selectedBlock === block.id
                                ? 'border-primary bg-primary/5'
                                : !isPreviewMode &&
                                    'hover:border-muted-foreground/30 hover:bg-muted/20'
                            )}
                            onClick={() => !isPreviewMode && selectBlock(block.id)}
                          >
                            {!isPreviewMode && selectedBlock === block.id && (
                              <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 p-0 bg-background hover:bg-muted"
                                  onClick={e => {
                                    e.stopPropagation();
                                    // handleDuplicate(block.id);
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 p-0 bg-background hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={e => {
                                    e.stopPropagation();
                                    deleteBlock(block.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}

                            <ErrorBoundary>
                              <BlockRenderer
                                block={{
                                  ...block,
                                  position: block.order,
                                  properties: block.properties || {},
                                }}
                                isPreviewMode={isPreviewMode}
                                stepNumber={currentStepNumber}
                                userResponses={userResponses}
                                setUserResponses={setUserResponses}
                              />
                            </ErrorBoundary>
                          </div>
                        ))
                      ) : (
                        <BlockLoadingStates.Empty
                          title="Nenhum bloco adicionado"
                          description="Arraste componentes da biblioteca à esquerda ou aguarde o template carregar"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Properties */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="h-full border-l">
              <div className="p-4 border-b">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Propriedades
                </h2>
              </div>
              <div className="p-4">
                <PropertiesPanel block={selectedBlockData} onUpdate={updateBlock} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ErrorBoundary>
  );
};

// Components Library Component
const ComponentsLibrary: React.FC = () => {
  const componentCategories = [
    {
      name: 'Formulários',
      components: [
        { id: 'lead-form', name: 'Formulário de Nome', icon: '📝' },
        { id: 'form-input', name: 'Campo de Entrada', icon: '⌨️' },
      ],
    },
    {
      name: 'Conteúdo',
      components: [
        { id: 'text', name: 'Texto', icon: '📄' },
        { id: 'quiz-header', name: 'Cabeçalho Quiz', icon: '🎯' },
        { id: 'options-grid', name: 'Grid de Opções', icon: '⭕' },
      ],
    },
    {
      name: 'Mídia',
      components: [
        { id: 'image', name: 'Imagem', icon: '🖼️' },
        { id: 'video', name: 'Vídeo', icon: '🎥' },
      ],
    },
    {
      name: 'Ações',
      components: [
        { id: 'button', name: 'Botão', icon: '🔘' },
        { id: 'result-display', name: 'Exibir Resultado', icon: '📊' },
        { id: 'offer-cta', name: 'Oferta CTA', icon: '💰' },
      ],
    },
  ];

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('component-type', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {componentCategories.map(category => (
          <div key={category.name}>
            <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              {category.name}
            </h3>
            <div className="space-y-2">
              {category.components.map(component => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={e => handleDragStart(e, component.id)}
                  className="flex items-center gap-3 p-2 rounded-md border bg-background cursor-grab hover:bg-muted/50 hover:border-muted-foreground/30 active:cursor-grabbing transition-colors"
                >
                  <span className="text-lg">{component.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{component.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorFixed21Stages;

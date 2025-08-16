import React from 'react';
import { useFunnels } from '@/context/FunnelsContext';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutGrid, 
  Eye, 
  Settings, 
  Save, 
  Play, 
  Component,
  MousePointer,
  Trash2,
  Copy,
  Move
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable-panels';

// Componentes otimizados
import { useEditorState } from '@/hooks/useEditorState';
import { BlockLoadingStates } from '@/components/editor/LoadingStates';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import BlockRenderer from '@/components/editor/blocks/BlockRenderer';

// Tipos otimizados - removendo interface duplicada pois já existe em @/types/editor

/**
 * 🚀 EDITOR REFATORADO: Versão otimizada com hooks especializados
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
    getSelectedBlockData,
    isPreviewMode,
    togglePreviewMode,
    isDragOver,
    setIsDragOver,
    userResponses,
    setUserResponses,
    isLoading,
    error
  } = useEditorState();

  const currentStepNumber = parseInt(selectedStep.replace('step-', ''));
  const selectedBlockData = getSelectedBlockData();

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
        <BlockLoadingStates.Error 
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }
        
      case 'image':
      case 'image-inline':
      case 'image-display-inline':
        baseBlock.content = {
          url: templateBlock.properties?.src || templateBlock.properties?.imageUrl || '',
          alt: templateBlock.properties?.alt || 'Imagem',
          caption: templateBlock.properties?.caption || ''
        };
        break;
        
      case 'result-display':
        baseBlock.content = {
          title: templateBlock.properties?.title || 'Seu Resultado',
          description: templateBlock.properties?.description || 'Resultado personalizado'
        };
        break;
        
      case 'offer-cta':
        baseBlock.content = {
          title: templateBlock.properties?.title || 'Oferta Especial',
          description: templateBlock.properties?.description || 'Não perca esta oportunidade',
          buttonText: templateBlock.properties?.buttonText || 'Aproveitar Oferta'
        };
        break;
        
      default:
        baseBlock.content = {
          text: templateBlock.properties?.content || templateBlock.properties?.text || 'Conteúdo padrão'
        };
        break;
    }

    return baseBlock;
  };

  // Load template when step changes
  useEffect(() => {
    const stepNumber = parseInt(selectedStep.replace('step-', ''));
    if (stepNumber && stepNumber >= 1 && stepNumber <= 21) {
      try {
        const template = getStepTemplate(stepNumber);
        const adaptedBlocks = template.map((block, index) => {
          const adaptedBlock = adaptBlockTemplate({
            ...block,
            id: block.id || `block-${stepNumber}-${index}`,
            position: index
          });
          return adaptedBlock;
        });
        
        setCurrentBlocks(adaptedBlocks);
        console.log(`📋 Carregando template adaptado da etapa ${stepNumber}:`, adaptedBlocks);
      } catch (error) {
        console.error(`❌ Erro ao carregar template da etapa ${stepNumber}:`, error);
        setCurrentBlocks([]);
      }
    }
  }, [selectedStep]);

  const handleStageSelect = useCallback((stageId: string) => {
    setSelectedStep(stageId);
    setSelectedBlock(null);
  }, []);

  const handleBlockSelect = useCallback((blockId: string) => {
    setSelectedBlock(selectedBlock === blockId ? null : blockId);
  }, [selectedBlock]);

  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<Block>) => {
    setCurrentBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    setCurrentBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlock(null);
  }, []);

  const handleComponentDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const componentType = e.dataTransfer.getData('component-type');
    if (componentType) {
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: componentType,
        properties: getDefaultProperties(componentType),
        content: getDefaultContent(componentType),
        position: currentBlocks.length
      };
      
      setCurrentBlocks(prev => [...prev, newBlock]);
    }
  }, [currentBlocks.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  const currentStepInfo = steps.find(step => step.id === selectedStep);
  const currentStepNumber = parseInt(selectedStep.replace('step-', ''));
  const selectedBlockData = currentBlocks.find(block => block.id === selectedBlock);

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="h-14 border-b bg-card flex items-center px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Editor de Funil - 21 Etapas</h1>
            <Badge variant="secondary">{currentFunnelId}</Badge>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">
              Etapa {currentStepNumber}/21
            </Badge>
            <Button 
              variant={isPreviewMode ? "default" : "ghost"} 
              size="sm"
              onClick={togglePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? "Editor" : "Preview"}
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            
            {/* Left Panel - Stages */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full p-4">
                <FunnelStagesPanel
                  onStageSelect={handleStageSelect}
                  className="h-full"
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Components Library */}
            {!isPreviewMode && (
              <>
                <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
                  <ComponentsLibrary />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}

            {/* Center Panel - Canvas */}
            <ResizablePanel defaultSize={isPreviewMode ? 60 : 45} minSize={30}>
              <Card className="h-full rounded-none border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    {isPreviewMode ? "Preview" : "Canvas"} - {currentStepInfo?.name || `Etapa ${currentStepNumber}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div 
                    className={cn(
                      "max-w-md mx-auto bg-white border border-border rounded-lg shadow-sm min-h-[600px] transition-all",
                      isDragOver && "border-primary border-2"
                    )}
                    onDrop={handleComponentDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="p-6 space-y-4">
                      {blocks.length > 0 ? (
                        blocks.map((block) => (
                          <div
                            key={block.id}
                            className={cn(
                              "relative group transition-all",
                              !isPreviewMode && "border-2 border-dashed border-transparent rounded-lg p-2",
                              !isPreviewMode && selectedBlock === block.id 
                                 ? "border-primary bg-primary/5" 
                                : !isPreviewMode && "hover:border-muted-foreground/30 hover:bg-muted/20"
                            )}
                            onClick={() => !isPreviewMode && selectBlock(block.id)}
                          >
                            {!isPreviewMode && (
                              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Move className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Duplicate block logic
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                     deleteBlock(block.id);
                                   }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                            <BlockRenderer 
                              block={block} 
                              isPreviewMode={isPreviewMode}
                              stepNumber={currentStepNumber}
                              userResponses={userResponses}
                              setUserResponses={setUserResponses}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Component className="w-8 h-8 mx-auto mb-2" />
                          <p>Arraste componentes aqui</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            {/* Right Panel - Properties */}
            {!isPreviewMode && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                  <PropertiesPanel
                    block={selectedBlockData}
                    onUpdate={updateBlock}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

// Components Library Component
const ComponentsLibrary: React.FC = () => {
  const componentCategories = [
    {
      name: "Formulários",
      components: [
        { id: 'lead-form', name: 'Formulário de Nome', icon: '📝' },
        { id: 'form-input', name: 'Campo de Entrada', icon: '⌨️' },
      ]
    },
    {
      name: "Quiz",
      components: [
        { id: 'quiz-header', name: 'Header do Quiz', icon: '📊' },
        { id: 'options-grid', name: 'Grade de Opções', icon: '⚏' },
        { id: 'quiz-question', name: 'Questão do Quiz', icon: '❓' },
      ]
    },
    {
      name: "Conteúdo",
      components: [
        { id: 'text', name: 'Texto', icon: '📝' },
        { id: 'image', name: 'Imagem', icon: '🖼️' },
        { id: 'button', name: 'Botão', icon: '🔘' },
        { id: 'spacer', name: 'Espaçador', icon: '📏' },
      ]
    },
    {
      name: "Resultado",
      components: [
        { id: 'result-display', name: 'Exibir Resultado', icon: '🎯' },
        { id: 'offer-cta', name: 'CTA de Oferta', icon: '💰' },
      ]
    }
  ];

  return (
    <Card className="h-full rounded-none border-0 border-r">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Component className="w-4 h-4" />
          Componentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4 p-4">
          {componentCategories.map(category => (
            <div key={category.name}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                {category.name}
              </h4>
              <div className="space-y-2">
                {category.components.map(component => (
                  <div
                    key={component.id}
                    className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors text-sm border"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('component-type', component.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{component.icon}</span>
                      <span>{component.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Properties Panel Component
const PropertiesPanel: React.FC<{
  selectedBlock: Block | undefined;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onDelete: (blockId: string) => void;
}> = ({ selectedBlock, onUpdate, onDelete }) => {
  if (!selectedBlock) {
    return (
      <Card className="h-full rounded-none border-0 border-l">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Propriedades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8 text-muted-foreground">
            <MousePointer className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Selecione um componente para editar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePropertyUpdate = (property: string, value: any) => {
    onUpdate(selectedBlock.id, {
      properties: {
        ...selectedBlock.properties,
        [property]: value
      }
    });
  };

  const handleContentUpdate = (property: string, value: any) => {
    onUpdate(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [property]: value
      }
    });
  };

  return (
    <Card className="h-full rounded-none border-0 border-l">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Propriedades
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4 overflow-y-auto">
        <div>
          <Label className="text-sm font-medium">Tipo do Bloco</Label>
          <div className="mt-1 p-2 bg-muted rounded text-sm">
            {selectedBlock.type}
          </div>
        </div>

        {/* Content Properties */}
        {renderContentProperties(selectedBlock, handleContentUpdate, handlePropertyUpdate)}

        {/* Style Properties */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm border-t pt-3">Estilo</h4>
          
          <div>
            <Label htmlFor="bg-color">Cor de Fundo</Label>
            <Input
              id="bg-color"
              type="color"
              value={selectedBlock.properties?.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropertyUpdate('backgroundColor', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="text-color">Cor do Texto</Label>
            <Input
              id="text-color"
              type="color"
              value={selectedBlock.properties?.textColor || '#000000'}
              onChange={(e) => handlePropertyUpdate('textColor', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="border-radius">Bordas Arredondadas</Label>
            <Input
              id="border-radius"
              type="range"
              min="0"
              max="20"
              value={selectedBlock.properties?.borderRadius || 0}
              onChange={(e) => handlePropertyUpdate('borderRadius', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-shadow"
              checked={selectedBlock.properties?.showShadow || false}
              onCheckedChange={(checked) => handlePropertyUpdate('showShadow', checked)}
            />
            <Label htmlFor="show-shadow">Mostrar Sombra</Label>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t">
          <Button size="sm" className="w-full">
            <Palette className="w-4 h-4 mr-2" />
            Mais Opções
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="w-full"
            onClick={() => onDelete(selectedBlock.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar Bloco
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Content-specific property renderers
function renderContentProperties(
  block: Block, 
  updateContent: (prop: string, value: any) => void,
  updateProperty: (prop: string, value: any) => void
) {
  const blockType = block.type;

  switch (blockType) {
    case 'text':
    case 'text-inline':
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor="text-content">Conteúdo do Texto</Label>
            <Textarea
              id="text-content"
              value={block.content?.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Digite o texto..."
              rows={4}
            />
          </div>
        </div>
      );
      
    case 'lead-form':
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor="form-title">Título do Formulário</Label>
            <Input
              id="form-title"
              value={block.content?.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>
          
          <div>
            <Label htmlFor="form-placeholder">Placeholder</Label>
            <Input
              id="form-placeholder"
              value={block.content?.placeholder || ''}
              onChange={(e) => updateContent('placeholder', e.target.value)}
              placeholder="Nome"
            />
          </div>
          
          <div>
            <Label htmlFor="button-text">Texto do Botão</Label>
            <Input
              id="button-text"
              value={block.content?.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              placeholder="Quero Descobrir meu Estilo Agora!"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-required"
              checked={block.properties?.required || true}
              onCheckedChange={(checked) => updateProperty('required', checked)}
            />
            <Label htmlFor="is-required">Campo Obrigatório</Label>
          </div>
        </div>
      );
      
    case 'options-grid':
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor="question-title">Título da Questão</Label>
            <Input
              id="question-title"
              value={block.content?.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              placeholder="QUAL O SEU TIPO DE ROUPA FAVORITA?"
            />
          </div>
          
          <div>
            <Label htmlFor="required-selections">Seleções Obrigatórias</Label>
            <Input
              id="required-selections"
              type="number"
              min="1"
              max="8"
              value={block.properties?.requiredSelections || 3}
              onChange={(e) => updateProperty('requiredSelections', parseInt(e.target.value))}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-advance"
              checked={block.properties?.autoAdvance || false}
              onCheckedChange={(checked) => updateProperty('autoAdvance', checked)}
            />
            <Label htmlFor="auto-advance">Avanço Automático</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="show-images"
              checked={block.properties?.showImages || false}
              onCheckedChange={(checked) => updateProperty('showImages', checked)}
            />
            <Label htmlFor="show-images">Mostrar Imagens</Label>
          </div>
        </div>
      );
      
    case 'button':
    case 'button-inline':
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor="button-text">Texto do Botão</Label>
            <Input
              id="button-text"
              value={block.content?.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Clique aqui"
            />
          </div>
          
          <div>
            <Label htmlFor="button-url">URL de Destino</Label>
            <Input
              id="button-url"
              value={block.content?.url || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              placeholder="https://exemplo.com"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-disabled"
              checked={block.properties?.disabled || false}
              onCheckedChange={(checked) => updateProperty('disabled', checked)}
            />
            <Label htmlFor="is-disabled">Desativado</Label>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="p-4 border border-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            Editor não implementado para: {blockType}
          </p>
        </div>
      );
  }
}

// Default properties and content generators
function getDefaultProperties(componentType: string): Record<string, any> {
  switch (componentType) {
    case 'lead-form':
      return {
        required: true,
        validationEnabled: true,
        showProgress: true,
        backgroundColor: '#ffffff',
        textColor: '#432818'
      };
    case 'options-grid':
      return {
        requiredSelections: 3,
        autoAdvance: true,
        showImages: true,
        columns: 2,
        showBorders: true,
        borderRadius: 8
      };
    case 'quiz-header':
      return {
        showLogo: true,
        showProgress: true,
        progressColor: '#B89B7A',
        backgroundColor: '#FAF9F7'
      };
    default:
      return {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        padding: '16px',
        borderRadius: 4
      };
  }
}

function getDefaultContent(componentType: string): Record<string, any> {
  switch (componentType) {
    case 'text':
    case 'text-inline':
      return { text: 'Novo texto' };
    case 'lead-form':
      return {
        title: 'Digite seu nome',
        placeholder: 'Nome',
        buttonText: 'Continuar',
        validationMessage: 'Por favor, digite seu nome para continuar'
      };
    case 'options-grid':
      return {
        title: 'Selecione suas opções favoritas',
        options: [
          { id: 'opt1', text: 'Opção 1', imageUrl: '', points: 1 },
          { id: 'opt2', text: 'Opção 2', imageUrl: '', points: 1 },
          { id: 'opt3', text: 'Opção 3', imageUrl: '', points: 1 },
          { id: 'opt4', text: 'Opção 4', imageUrl: '', points: 1 }
        ]
      };
    case 'button':
    case 'button-inline':
      return { text: 'Clique aqui', url: '#' };
    case 'image':
      return { url: '', alt: 'Imagem', caption: '' };
    default:
      return {};
  }
}

export default EditorFixed21Stages;
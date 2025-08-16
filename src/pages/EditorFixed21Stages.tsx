import React, { useState, useCallback, useEffect } from 'react';
import { useFunnels } from '@/context/FunnelsContext';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { getStepTemplate } from '@/config/stepTemplatesMapping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutGrid, 
  Eye, 
  Settings, 
  Save, 
  Play, 
  Palette,
  Component,
  MousePointer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable-panels';

const EditorFixed21Stages: React.FC = () => {
  const { steps, currentFunnelId } = useFunnels();
  const [selectedStep, setSelectedStep] = useState<string>('step-1');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [currentBlocks, setCurrentBlocks] = useState<any[]>([]);

  // Load template when step changes
  useEffect(() => {
    const stepNumber = parseInt(selectedStep.replace('step-', ''));
    if (stepNumber && stepNumber >= 1 && stepNumber <= 21) {
      const template = getStepTemplate(stepNumber);
      setCurrentBlocks(template);
      console.log(`📋 Carregando template da etapa ${stepNumber}:`, template);
    }
  }, [selectedStep]);

  const handleStageSelect = useCallback((stageId: string) => {
    setSelectedStep(stageId);
    setSelectedBlock(null);
  }, []);

  const handleBlockSelect = useCallback((blockId: string) => {
    setSelectedBlock(selectedBlock === blockId ? null : blockId);
  }, [selectedBlock]);

  const currentStepInfo = steps.find(step => step.id === selectedStep);
  const currentStepNumber = parseInt(selectedStep.replace('step-', ''));

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
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
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
            <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
              <Card className="h-full rounded-none border-0 border-r">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Component className="w-4 h-4" />
                    Componentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2 p-4">
                    {[
                      { id: 'text', name: 'Texto', icon: '📝' },
                      { id: 'image', name: 'Imagem', icon: '🖼️' },
                      { id: 'button', name: 'Botão', icon: '🔘' },
                      { id: 'form', name: 'Formulário', icon: '📋' },
                      { id: 'options-grid', name: 'Grade de Opções', icon: '⚏' },
                      { id: 'quiz-header', name: 'Header Quiz', icon: '📊' },
                    ].map(component => (
                      <div
                        key={component.id}
                        className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors text-sm"
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
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Center Panel - Canvas */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <Card className="h-full rounded-none border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    Canvas - {currentStepInfo?.name || `Etapa ${currentStepNumber}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="max-w-md mx-auto bg-white border border-border rounded-lg shadow-sm min-h-[600px]">
                    <div className="p-6 space-y-4">
                      {currentBlocks.length > 0 ? (
                        currentBlocks.map((block, index) => (
                          <div
                            key={block.id || index}
                            className={cn(
                              "border-2 border-dashed border-transparent rounded-lg p-4 transition-all cursor-pointer",
                              selectedBlock === (block.id || `block-${index}`) 
                                ? "border-primary bg-primary/5" 
                                : "hover:border-muted-foreground/30 hover:bg-muted/20"
                            )}
                            onClick={() => handleBlockSelect(block.id || `block-${index}`)}
                          >
                            <BlockRenderer block={block} />
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

            <ResizableHandle withHandle />

            {/* Right Panel - Properties */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <Card className="h-full rounded-none border-0 border-l">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Propriedades
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {selectedBlock ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Bloco Selecionado</h4>
                        <p className="text-sm text-muted-foreground">{selectedBlock}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Tipo</label>
                          <div className="mt-1 p-2 bg-muted rounded text-sm">
                            {currentBlocks.find(b => (b.id || `block-${currentBlocks.indexOf(b)}`) === selectedBlock)?.type || 'N/A'}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Posição</label>
                          <div className="mt-1 p-2 bg-muted rounded text-sm">
                            {currentBlocks.find(b => (b.id || `block-${currentBlocks.indexOf(b)}`) === selectedBlock)?.position || 0}
                          </div>
                        </div>
                        
                        {/* Add more property controls here */}
                        <Button size="sm" className="w-full">
                          <Palette className="w-4 h-4 mr-2" />
                          Editar Propriedades
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MousePointer className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Selecione um componente para editar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

// Block renderer component
const BlockRenderer: React.FC<{ block: any }> = ({ block }) => {
  const renderByType = (block: any) => {
    switch (block.type) {
      case 'text-inline':
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">text-inline</div>
            <div
              style={{
                fontSize: block.properties?.fontSize === 'text-2xl' ? '1.5rem' : '1rem',
                fontWeight: block.properties?.fontWeight || 'normal',
                textAlign: block.properties?.textAlign?.replace('text-', '') || 'left',
                color: block.properties?.color || 'inherit'
              }}
            >
              {block.properties?.content || 'Texto'}
            </div>
          </div>
        );
        
      case 'quiz-intro-header':
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">quiz-intro-header</div>
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
              <img 
                src={block.properties?.logoUrl} 
                alt={block.properties?.logoAlt}
                className="w-8 h-8 rounded"
              />
              <div className="flex-1 mx-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${block.properties?.progressValue || 0}%` }}
                  />
                </div>
              </div>
              <span className="text-xs">{block.properties?.progressValue || 0}%</span>
            </div>
          </div>
        );

      case 'options-grid':
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">options-grid</div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border rounded p-2 text-center text-sm hover:bg-muted/50">
                  Opção {i}
                </div>
              ))}
            </div>
          </div>
        );

      case 'button-inline':
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">button-inline</div>
            <Button 
              className="w-full"
              style={{
                backgroundColor: block.properties?.backgroundColor,
                color: block.properties?.textColor
              }}
            >
              {block.properties?.text || 'Botão'}
            </Button>
          </div>
        );

      case 'form-input':
      case 'lead-form':
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">{block.type}</div>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Nome" 
                className="w-full p-2 border rounded text-sm"
                readOnly
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-2 border rounded text-sm"
                readOnly
              />
              <Button className="w-full" size="sm">Enviar</Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">{block.type || 'unknown'}</div>
            <div className="p-3 bg-muted/30 rounded text-sm">
              Componente: {block.type || 'Desconhecido'}
            </div>
          </div>
        );
    }
  };

  return renderByType(block);
};

export default EditorFixed21Stages;
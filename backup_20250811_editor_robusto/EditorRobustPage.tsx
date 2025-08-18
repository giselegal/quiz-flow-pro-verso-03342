import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { IntelligentPropertiesPanel } from '@/components/editor/properties/IntelligentPropertiesPanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { Code, Download, Eye, Layers, Play, Save, Settings, Upload } from 'lucide-react';
import React from 'react';

// Importar templates das 21 etapas
import step01Template from '@/config/templates/step-01.json';
import step02Template from '@/config/templates/step-02.json';
import step03Template from '@/config/templates/step-03.json';
import step04Template from '@/config/templates/step-04.json';
import step05Template from '@/config/templates/step-05.json';
import step06Template from '@/config/templates/step-06.json';
import step07Template from '@/config/templates/step-07.json';
import step08Template from '@/config/templates/step-08.json';
import step09Template from '@/config/templates/step-09.json';
import step10Template from '@/config/templates/step-10.json';
import step11Template from '@/config/templates/step-11.json';
import step12Template from '@/config/templates/step-12.json';
import step13Template from '@/config/templates/step-13.json';
import step14Template from '@/config/templates/step-14.json';
import step15Template from '@/config/templates/step-15.json';
import step16Template from '@/config/templates/step-16.json';
import step17Template from '@/config/templates/step-17.json';
import step18Template from '@/config/templates/step-18.json';
import step19Template from '@/config/templates/step-19.json';
import step20Template from '@/config/templates/step-20.json';
import step21Template from '@/config/templates/step-21.json';

// Mapear templates das 21 etapas
const STEP_TEMPLATES = {
  1: step01Template,
  2: step02Template,
  3: step03Template,
  4: step04Template,
  5: step05Template,
  6: step06Template,
  7: step07Template,
  8: step08Template,
  9: step09Template,
  10: step10Template,
  11: step11Template,
  12: step12Template,
  13: step13Template,
  14: step14Template,
  15: step15Template,
  16: step16Template,
  17: step17Template,
  18: step18Template,
  19: step19Template,
  20: step20Template,
  21: step21Template,
} as const;

/**
 * Canvas Principal - Área de Drop e Renderização
 */
const CanvasDropZone: React.FC = () => {
  const {
    activeStageId,
    stages,
    selectedBlockId,
    blockActions: { getBlocksForStage, setSelectedBlockId },
  } = useEditor();

  const activeStage = stages.find(s => s.id === activeStageId);
  const stageBlocks = getBlocksForStage(activeStageId);

  // Obter template da etapa atual
  const getStageTemplate = () => {
    if (!activeStage) return null;
    return STEP_TEMPLATES[activeStage.order as keyof typeof STEP_TEMPLATES] || null;
  };

  const stageTemplate = getStageTemplate();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="flex items-center space-x-2">
              <Layers className="w-5 h-5" />
              <span>Canvas - Etapa {activeStage?.order || '?'}</span>
            </CardTitle>
            {activeStage && (
              <Badge variant="outline">{activeStage.name || `Etapa ${activeStage.order}`}</Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Config
            </Button>
          </div>
        </div>

        {stageTemplate && (
          <div className="text-sm text-muted-foreground">
            Template: {stageTemplate.metadata?.name || 'Sem nome'} • Tipo:{' '}
            {stageTemplate.metadata?.type || 'N/A'} • Blocos: {stageBlocks.length}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="min-h-[600px] p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/5">
            {stageBlocks.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
                  <p className="text-muted-foreground mb-4">
                    Arraste componentes da sidebar ou use um template para começar
                  </p>
                  {stageTemplate && (
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Carregar Template da Etapa {activeStage?.order}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {stageBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedBlockId === block.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedBlockId(block.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{block.type}</Badge>
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    </div>

                    {/* Renderização simplificada do bloco */}
                    <div className="text-sm">
                      <div className="font-medium">
                        {block.content?.title || block.properties?.title || 'Sem título'}
                      </div>
                      {(block.content?.subtitle || block.properties?.subtitle) && (
                        <div className="text-muted-foreground">
                          {block.content.subtitle || block.properties?.subtitle}
                        </div>
                      )}
                      {(block.content?.description || block.properties?.description) && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {block.content.description || block.properties?.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

/**
 * Componente Principal do Editor (Interno - usa useEditor)
 */
const EditorRobustContent: React.FC = () => {
  const {
    activeStageId,
    stages,
    blockActions: { updateBlock },
  } = useEditor();

  // Determinar tipo de etapa para propriedades inteligentes
  const getStepType = () => {
    const activeStage = stages.find(s => s.id === activeStageId);
    if (!activeStage) return 'question';

    const order = activeStage.order;
    if (order === 1) return 'intro';
    if (order >= 2 && order <= 14) return 'question';
    if (order === 15 || order === 19) return 'transition';
    if (order >= 17 && order <= 18) return 'result';
    if (order === 20) return 'lead';
    if (order === 21) return 'offer';

    return 'question';
  };

  const handleBlockUpdate = (blockId: string, updates: Record<string, any>) => {
    updateBlock(blockId, updates);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header do Editor */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-primary-foreground" />
              </div>
              <span>Editor Robusto - 21 Etapas</span>
            </h1>
            <Badge variant="outline" className="text-xs">
              v2.0 - JSON Templates + Componentes Modulares
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-2" />
              Testar Funil
            </Button>
          </div>
        </div>
      </div>

      {/* Layout Principal */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Panel Esquerdo - Etapas */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full p-4">
              <FunnelStagesPanel className="h-full" />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Panel Central - Sidebar + Canvas */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Sidebar Componentes */}
              <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                <div className="h-full border-r">
                  <EnhancedComponentsSidebar />
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Canvas Principal */}
              <ResizablePanel defaultSize={70}>
                <div className="h-full">
                  <CanvasDropZone />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          {/* Panel Direito - Propriedades */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full p-4">
              <IntelligentPropertiesPanel
                stepType={getStepType()}
                stepNumber={stages.find(s => s.id === activeStageId)?.order}
                onUpdate={handleBlockUpdate}
                onClose={() => {}}
                onPreview={() => {}}
                onReset={() => {}}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

/**
 * Página Principal do Editor Robusto (Wrapper com Provider)
 */
const EditorRobustPage: React.FC = () => {
  return (
    <EditorProvider>
      <EditorRobustContent />
    </EditorProvider>
  );
};

export default EditorRobustPage;

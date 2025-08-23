import { CollaborationStatus } from '@/components/editor/CollaborationStatus';
import { EditorAccessControl, UserPlanInfo } from '@/components/editor/EditorAccessControl';
import { EnhancedComponentsSidebar } from '@/components/editor/EnhancedComponentsSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { Download, Eye, History, Save, Settings, Share, Users } from 'lucide-react';
import React, { useState } from 'react';

interface EditorUnifiedProps {
  quizId?: string;
}

export const EditorUnified: React.FC<EditorUnifiedProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [canvasElements, setCanvasElements] = useState<any[]>([]);
  const [projectId] = useState('demo-project-1'); // Em produção, vem da URL/props

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active);
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log('Drag over:', event.over);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle different drop scenarios
    if (active.data.current?.type === 'sidebar-component') {
      // Component from sidebar to canvas
      if (over.id === 'canvas-droppable') {
        const newElement = {
          id: `${active.id}-${Date.now()}`,
          type: active.data.current.component.type,
          label: active.data.current.component.label,
          properties: { ...active.data.current.component.defaultProps },
        };
        setCanvasElements(prev => [...prev, newElement]);
      }
    }
  };

  const handleSave = () => {
    // Implementar salvamento automático
    console.log('Salvando projeto...', { projectId, elements: canvasElements });
  };

  const handleExport = () => {
    // Implementar exportação de HTML
    console.log('Exportando HTML...', { projectId, elements: canvasElements });
  };

  const handlePreview = () => {
    // Abrir preview em nova aba
    window.open(`/preview/${projectId}`, '_blank');
  };

  return (
    <EditorAccessControl feature="editor" requiredPlan="free">
      <div className="h-screen flex flex-col bg-background">
        {/* Header com Toolbar */}
        <div className="h-14 border-b bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Editor Visual</h1>
            <Badge variant="outline">Projeto Demo</Badge>
          </div>

          <div className="flex items-center gap-2">
            <UserPlanInfo />

            <div className="flex items-center gap-1 ml-4">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex bg-background">
            {/* Sidebar de Componentes - 20% */}
            <div className="w-1/5 min-w-[280px] max-w-[350px] border-r">
              <EnhancedComponentsSidebar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {/* Painel de Colaboração - 15% */}
            <div className="w-[15%] min-w-[200px] max-w-[250px] border-r bg-muted/20">
              <div className="p-4 h-full overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Colaboração</h3>
                  </div>
                  <CollaborationStatus projectId={projectId} />

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <History className="h-4 w-4" />
                      <h4 className="text-sm font-medium">Histórico</h4>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="p-2 bg-background rounded">
                        <div className="font-medium">Componente adicionado</div>
                        <div>há 2 minutos</div>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <div className="font-medium">Propriedades alteradas</div>
                        <div>há 5 minutos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Central - 45% */}
            <div className="flex-1 min-w-[400px]">
              <div className="h-full bg-background p-4">
                <div
                  id="canvas-droppable"
                  className="h-full border-2 border-dashed border-muted-foreground/20 rounded-lg relative overflow-visible"
                  style={{ minHeight: '600px' }}
                >
                  {canvasElements.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="text-muted-foreground">
                        <div className="text-lg font-medium mb-2">Canvas Vazio</div>
                        <div className="text-sm">
                          Arraste componentes da barra lateral para começar
                        </div>
                        <div className="text-xs mt-2">Elementos: {canvasElements.length}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {canvasElements.map((el, idx) => (
                        <div
                          key={idx}
                          className="p-4 border border-border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{el.label}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {el.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Painel de Propriedades - 20% */}
            <div className="w-1/5 min-w-[280px] max-w-[350px] border-l bg-muted/20">
              <div className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Propriedades</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-background rounded border">
                    <div className="text-sm font-medium mb-2">Elemento Selecionado</div>
                    <div className="text-xs text-muted-foreground">
                      Selecione um elemento no canvas para editar suas propriedades
                    </div>
                  </div>

                  <div className="p-3 bg-background rounded border">
                    <div className="text-sm font-medium mb-2">Configurações Gerais</div>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <div className="font-medium">Largura do Canvas</div>
                        <div className="text-muted-foreground">1200px</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Tema</div>
                        <div className="text-muted-foreground">Claro</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DndContext>
      </div>
    </EditorAccessControl>
  );
};

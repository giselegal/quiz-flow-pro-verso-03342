import { EnhancedComponentsSidebar } from '@/components/editor/EnhancedComponentsSidebar';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import React, { useState } from 'react';

interface EditorUnifiedProps {
  quizId?: string;
}

export const EditorUnified: React.FC<EditorUnifiedProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [canvasElements, setCanvasElements] = useState<any[]>([]);

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

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex bg-background">
        {/* Sidebar de Componentes - 20% */}
        <div className="w-1/5 min-w-[280px] max-w-[350px] border-r">
          <EnhancedComponentsSidebar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Painel de Etapas - 15% */}
        <div className="w-[15%] min-w-[200px] max-w-[250px] border-r bg-muted/20">
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Etapas do Quiz</h3>
          </div>
        </div>

        {/* Canvas Central - 45% */}
        <div className="flex-1 min-w-[400px]">
          <div className="h-full bg-background p-4">
            <div className="h-full border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-lg font-medium mb-2">EDITOR RENDERIZANDO</div>
                <div className="text-sm">Arraste componentes aqui</div>
                <div className="text-xs mt-2">Canvas Elements: {canvasElements.length}</div>
                {canvasElements.map((el, idx) => (
                  <div key={idx} className="text-xs border border-border p-2 m-1 rounded">
                    {el.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Propriedades - 20% */}
        <div className="w-1/5 min-w-[280px] max-w-[350px] border-l bg-muted/20">
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Propriedades</h3>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

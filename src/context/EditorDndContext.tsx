/**
 * 🎯 DND CONTEXT - SISTEMA MODERNO DE DRAG & DROP
 *
 * Contexto centralizado para gerenciar drag & drop no editor
 * Baseado em @dnd-kit para performance e acessibilidade
 */

import { Block } from '@/types/editor';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { createContext, useCallback, useContext, useState } from 'react';

// ========================================
// Types & Interfaces
// ========================================
interface DraggedItem {
  id: string;
  type: 'component' | 'block';
  data: any;
}

interface DndState {
  activeItem: DraggedItem | null;
  isDragging: boolean;
  dragOverZone: string | null;
}

interface DndContextType {
  state: DndState;
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: any;
}

// ========================================
// Context Creation
// ========================================
const EditorDndContext = createContext<DndContextType | null>(null);

// ========================================
// Hook para usar o contexto
// ========================================
export const useEditorDnd = () => {
  const context = useContext(EditorDndContext);
  if (!context) {
    throw new Error('useEditorDnd deve ser usado dentro de EditorDndProvider');
  }
  return context;
};

// ========================================
// Provider Props
// ========================================
interface EditorDndProviderProps {
  children: React.ReactNode;
  blocks: Block[];
  onBlocksReorder: (blocks: Block[]) => void;
  onBlockAdd: (componentType: string, position?: number) => void;
  onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
}

// ========================================
// Provider Component
// ========================================
export const EditorDndProvider: React.FC<EditorDndProviderProps> = ({
  children,
  blocks,
  onBlocksReorder,
  onBlockAdd,
  onBlockUpdate,
}) => {
  // ========================================
  // Estado do Drag & Drop
  // ========================================
  const [state, setState] = useState<DndState>({
    activeItem: null,
    isDragging: false,
    dragOverZone: null,
  });

  // ========================================
  // Sensores configurados para melhor UX
  // ========================================
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Previne drag acidental
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ========================================
  // Handlers de Drag Events
  // ========================================
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    
    // Determinar tipo do item sendo arrastado
    let draggedItem: DraggedItem;
    
    if (active.data.current?.type === 'sidebar-component') {
      draggedItem = {
        id: active.id as string,
        type: 'component',
        data: active.data.current,
      };
    } else {
      // Item do canvas (bloco existente)
      const block = blocks.find(b => b.id === active.id);
      draggedItem = {
        id: active.id as string,
        type: 'block',
        data: block,
      };
    }

    setState(prev => ({
      ...prev,
      activeItem: draggedItem,
      isDragging: true,
    }));

    // Analytics/Tracking
    console.log('🎯 Drag iniciado:', draggedItem);
  }, [blocks]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    
    setState(prev => ({
      ...prev,
      dragOverZone: over ? over.id as string : null,
    }));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    // Reset do estado
    setState(prev => ({
      ...prev,
      activeItem: null,
      isDragging: false,
      dragOverZone: null,
    }));

    if (!over) return;

    // Caso 1: Adição de novo componente da sidebar
    if (active.data.current?.type === 'sidebar-component') {
      const componentType = active.data.current.componentType;
      
      // Determinar posição baseada no drop zone
      if (over.data.current?.type === 'canvas-drop-zone') {
        const position = over.data.current.position;
        onBlockAdd(componentType, position);
      } else {
        // Adicionar no final se dropped no canvas geral
        onBlockAdd(componentType);
      }
      
      console.log('✅ Componente adicionado:', componentType);
      return;
    }

    // Caso 2: Reordenação de blocos existentes
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
        onBlocksReorder(reorderedBlocks);
        console.log('🔄 Blocos reordenados:', { oldIndex, newIndex });
      }
    }
  }, [blocks, onBlocksReorder, onBlockAdd]);

  // ========================================
  // Animação de drop customizada
  // ========================================
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  // ========================================
  // Render do Provider
  // ========================================
  const contextValue: DndContextType = {
    state,
    blocks,
    setBlocks: onBlocksReorder,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    sensors,
  };

  return (
    <EditorDndContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(block => block.id)} 
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
        
        {/* Overlay de drag visual */}
        <DragOverlay dropAnimation={dropAnimation}>
          {state.activeItem ? (
            <div className="drag-overlay bg-white shadow-lg border-2 border-brand-primary/50 rounded-lg p-4 opacity-90 transform rotate-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-brand-primary rounded-full animate-pulse" />
                <span className="font-medium text-sm">
                  {state.activeItem.type === 'component' 
                    ? `+ ${state.activeItem.data.componentType}` 
                    : `Movendo: ${state.activeItem.data?.type || 'Bloco'}`
                  }
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </EditorDndContext.Provider>
  );
};

export default EditorDndProvider;

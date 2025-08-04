import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  KeyboardSensor,
  TouchSensor,
  rectIntersection
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { createPortal } from 'react-dom';

// Tipo local para BlockData
interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
}

interface DndProviderProps {
  children: React.ReactNode;
  blocks: BlockData[];
  onBlocksReorder: (newBlocks: BlockData[]) => void;
  onBlockAdd: (blockType: string, position?: number) => void;
  onBlockSelect: (blockId: string) => void;
  selectedBlockId?: string;
  onBlockUpdate: (blockId: string, updates: Partial<BlockData>) => void;
}

export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  blocks,
  onBlocksReorder,
  onBlockAdd,
  onBlockSelect,
  selectedBlockId,
  onBlockUpdate
}) => {
  const [activeBlock, setActiveBlock] = React.useState<BlockData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    console.log('🟢 DragStart:', {
      id: active.id,
      type: active.data.current?.type,
      blockType: active.data.current?.blockType,
      data: active.data.current
    });
    
    // 🎯 Haptic feedback para dispositivos móveis
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Configurar activeBlock baseado no tipo
    if (active.data.current?.type === 'sidebar-component') {
      // Para componentes do sidebar, criar um objeto temporário
      setActiveBlock({
        id: active.id.toString(),
        type: active.data.current.blockType,
        properties: {}
      });
    } else {
      // Para blocos existentes, buscar no array
      const activeBlockData = blocks.find(block => block.id === active.id);
      setActiveBlock(activeBlockData || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    console.log('🟡 DragOver:', {
      activeId: active.id,
      overId: over.id,
      activeType: active.data.current?.type,
      overType: over.data.current?.type
    });

    // Se estamos arrastando de um sidebar (componente novo)
    if (active.data.current?.type === 'sidebar-component' && over.data.current?.type === 'canvas-drop-zone') {
      console.log('✅ Sidebar -> Canvas detectado durante DragOver');
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveBlock(null);

    if (!over) return;

    console.log('🔄 DragEnd:', { 
      active: active.id, 
      over: over.id,
      activeType: active.data.current?.type,
      overType: over.data.current?.type 
    });

    // Reordenar blocos existentes no canvas
    if (active.data.current?.type === 'canvas-block' && over.data.current?.type === 'canvas-block') {
      const activeIndex = blocks.findIndex(block => block.id === active.id);
      const overIndex = blocks.findIndex(block => block.id === over.id);

      console.log(`🔄 Reordenando: ${active.id} (${activeIndex}) -> ${over.id} (${overIndex})`);

      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        const newBlocks = arrayMove(blocks, activeIndex, overIndex);
        console.log('📦 Nova ordem dos blocos:', newBlocks.map(b => b.id));
        onBlocksReorder(newBlocks);
      }
      return;
    }

    // Adicionar novo bloco do sidebar
    if (active.data.current?.type === 'sidebar-component' && over.data.current?.type === 'canvas-drop-zone') {
      const blockType = active.data.current.blockType;
      const position = over.data.current.position || blocks.length;
      console.log('➕ Adicionando bloco:', blockType, 'na posição:', position);
      onBlockAdd(blockType, position);
      return;
    }

    // Debug: Log quando não há match
    console.log('⚠️ Nenhuma condição de drop atendida:', {
      activeType: active.data.current?.type,
      overType: over.data.current?.type,
      activeId: active.id,
      overId: over.id
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      
      {/* Drag Overlay aprimorado para preview premium */}
      {createPortal(
        <DragOverlay>
          {activeBlock ? (
            <div className="
              bg-white/95 backdrop-blur-md shadow-2xl rounded-xl 
              border-2 border-brand/60 ring-1 ring-brand/30
              transform rotate-2 scale-105 p-4
              animate-pulse transition-all duration-200
              min-w-[200px]
            ">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-brand rounded-sm"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800">
                    {activeBlock.type}
                  </div>
                  <div className="text-xs text-stone-500">
                    Arrastando componente...
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
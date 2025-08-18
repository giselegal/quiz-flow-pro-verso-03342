import React from 'react';
import { performanceMonitor } from '@/utils/development';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
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
  onBlockSelect: _onBlockSelect,
  selectedBlockId: _selectedBlockId,
  onBlockUpdate: _onBlockUpdate,
}) => {
  const [activeBlock, setActiveBlock] = React.useState<BlockData | null>(null);

  // Debug: Log de inicialização
  React.useEffect(() => {
    console.log('🚀 DndProvider montado! Blocks:', blocks.length);
  }, []);

  React.useEffect(() => {
    console.log(
      '📦 Blocks atualizados no DndProvider:',
      blocks.map(b => ({ id: b.id, type: b.type }))
    );
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Valor mínimo para ativação imediata
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 10, // Delay mínimo
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    performanceMonitor.startTiming('drag-operation');

    // Simples log para debug
    console.log('🟢 DragStart:', active.id, active.data.current);

    // Verificação básica
    if (!active.data.current) {
      console.error('❌ active.data.current está undefined!');
      return;
    }

    if (!active.data.current.type) {
      console.error('❌ active.data.current.type está undefined!');
      return;
    }

    console.log('✅ Dados válidos:', active.data.current.type, active.data.current.blockType);

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
        properties: {},
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

    // Log simples
    if (active.data.current?.type === 'sidebar-component') {
      console.log('🟡 DragOver sidebar->canvas');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveBlock(null);
    performanceMonitor.endTiming('drag-operation');

    console.log('🔄 DragEnd:', active.id, '->', over?.id);

    if (!over) {
      console.error('❌ Sem over target');
      return;
    }

    // Reordenar blocos existentes no canvas
    if (
      active.data.current?.type === 'canvas-block' &&
      over.data.current?.type === 'canvas-block'
    ) {
      const activeIndex = blocks.findIndex(block => block.id === active.id);
      const overIndex = blocks.findIndex(block => block.id === over.id);

      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        const newBlocks = arrayMove(blocks, activeIndex, overIndex);
        console.log('� Reordenando blocos');
        onBlocksReorder(newBlocks);
      }
      return;
    }

    // Adicionar novo bloco do sidebar
    if (
      active.data.current?.type === 'sidebar-component' &&
      (over.data.current?.type === 'canvas-drop-zone' ||
        over.id === 'canvas-drop-zone' ||
        over.id?.toString().startsWith('drop-zone-'))
    ) {
      const blockType = active.data.current.blockType;
      let position = blocks.length;

      if (over.id?.toString().startsWith('drop-zone-')) {
        const positionMatch = over.id.toString().match(/drop-zone-(\d+)/);
        if (positionMatch) {
          position = parseInt(positionMatch[1], 10);
        }
      }

      console.log('✅ Adicionando bloco:', blockType, 'posição:', position);

      if (typeof onBlockAdd === 'function') {
        onBlockAdd(blockType, position);
      } else {
        console.error('❌ onBlockAdd não é função');
      }
      return;
    }

    console.error('❌ Nenhuma condição atendida:', {
      activeType: active.data.current?.type,
      overType: over.data.current?.type,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter} // Mudando para closestCenter que é mais confiável
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Remover SortableContext temporariamente para testar se há conflito */}
      {children}

      {/* Drag Overlay aprimorado para preview premium */}
      {createPortal(
        <DragOverlay>
          {activeBlock ? (
            <div
              className="
              bg-white/95 backdrop-blur-md shadow-2xl rounded-xl 
              border-2 border-brand/60 ring-1 ring-brand/30
              transform rotate-2 scale-105 p-4
              animate-pulse transition-all duration-200
              min-w-[200px]
            "
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-brand rounded-sm"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800">{activeBlock.type}</div>
                  <div className="text-xs text-stone-500">Arrastando componente...</div>
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

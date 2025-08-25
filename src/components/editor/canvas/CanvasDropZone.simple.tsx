import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { SortableBlockWrapper } from './SortableBlockWrapper.simple';

// Componente para drop zone entre blocos
const InterBlockDropZone: React.FC<{
  position: number;
  isActive: boolean;
}> = ({ position, isActive }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${position}`,
    data: {
      type: 'canvas-drop-zone',
      accepts: ['sidebar-component', 'canvas-block'], // Aceita tanto componentes da sidebar quanto blocos do canvas
      position: position,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all duration-200 relative pointer-events-auto flex items-center justify-center',
        'h-8 min-h-[32px]', // Altura maior para facilitar drop
        isOver && 'h-20 bg-brand/10 border-2 border-dashed border-brand/40 rounded-lg',
        isActive && !isOver && 'h-4 bg-brand/20 rounded-full opacity-50'
      )}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-brand font-medium text-sm bg-white/90 px-3 py-2 rounded shadow-sm">
            Inserir aqui (posição {position})
          </p>
        </div>
      )}
      {/* Área invisível estendida para melhor hit detection */}
      <div className="absolute inset-x-0 -inset-y-4 pointer-events-none" />
    </div>
  );
};

interface CanvasDropZoneProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  className?: string;
}

export const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  className,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone-main', // ID único e bem definido
    data: {
      type: 'canvas-drop-zone',
      accepts: ['sidebar-component', 'canvas-block'],
      position: blocks.length, // Posição no final
      debug: 'main-canvas-zone', // Para debug
    },
  });

  // Usa useDndContext para obter active do contexto DnD
  const { active } = useDndContext();

  // Verifica se qualquer item arrastável válido está ativo
  const isDraggingAnyValidComponent = React.useMemo(() => {
    if (!active) return false;
    const t = active?.data.current?.type;
    const overId = active?.id ? String(active?.id) : '';
    return t === 'sidebar-component' || t === 'canvas-block' || overId.startsWith('sidebar-item-');
  }, [active]);

  // Debug do drop zone - SEMPRE ATIVO para investigação
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('🎯 CanvasDropZone: isOver =', isOver, 'active =', active?.id);
    if (active?.data.current?.type === 'sidebar-component') {
      // eslint-disable-next-line no-console
      console.log('📦 Arrastando componente da sidebar:', active?.data.current?.blockType);
    } else if (active?.data.current?.type === 'canvas-block') {
      // eslint-disable-next-line no-console
      console.log('🔄 Reordenando bloco do canvas:', active?.id);
    }
  }, [isOver, active]);

  // Usando isPreviewing como false por padrão (modo de edição)
  const isPreviewing = false;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[300px] transition-all duration-200 pointer-events-auto p-4',
        isOver && !isPreviewing && 'bg-brand/5 ring-2 ring-brand/20 ring-dashed',
        'border border-dashed border-gray-200 rounded-lg',
        // ✅ CLASSE CSS DE FORÇA BRUTA
        'dnd-droppable-zone',
        className
      )}
      data-over={isOver}
      data-preview={isPreviewing}
    >
      {blocks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500 text-lg mb-2">
            {isPreviewing
              ? 'Modo Preview - Nenhum componente nesta etapa'
              : 'Canvas vazio - Arraste componentes da sidebar para começar'}
          </p>
          {(isOver || isDraggingAnyValidComponent) && !isPreviewing && (
            <div className="mt-4 p-4 border-2 border-dashed border-brand/30 rounded-lg bg-brand/5">
              <p className="text-brand font-medium">Solte o componente aqui</p>
            </div>
          )}
        </div>
      ) : (
        <SortableContext
          items={blocks.map(block => String(block.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {/* Drop zone no início - agora aparece para QUALQUER item válido */}
            {isDraggingAnyValidComponent && <InterBlockDropZone position={0} isActive={true} />}

            {blocks.map((block, index) => (
              <React.Fragment key={String(block.id)}>
                <SortableBlockWrapper
                  block={block}
                  isSelected={!isPreviewing && selectedBlockId === block.id}
                  onSelect={() => !isPreviewing && onSelectBlock(block.id)}
                  onUpdate={updates => {
                    if (!isPreviewing) {
                      onUpdateBlock(block.id, updates);
                    }
                  }}
                  onDelete={() => {
                    if (!isPreviewing) {
                      onDeleteBlock(block.id);
                    }
                  }}
                />

                {/* Drop zone entre blocos - agora aparece para QUALQUER item válido */}
                {isDraggingAnyValidComponent && (
                  <InterBlockDropZone position={index + 1} isActive={true} />
                )}
              </React.Fragment>
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};

export default CanvasDropZone;

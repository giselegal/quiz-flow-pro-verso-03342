import { usePreview } from '@/contexts/PreviewContext';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { SortableBlockWrapper } from './SortableBlockWrapper';

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
        'h-3 transition-all duration-200 relative',
        isOver && 'h-12 bg-brand/10 border-2 border-dashed border-brand/40 rounded-lg',
        isActive && !isOver && 'h-1 bg-brand/20 rounded-full opacity-50'
      )}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-brand font-medium text-sm bg-white/80 px-2 py-1 rounded">
            Inserir aqui (posição {position})
          </p>
        </div>
      )}
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
  const { isPreviewing } = usePreview();
  const { setNodeRef, isOver, active } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas-drop-zone',
      accepts: ['sidebar-component', 'canvas-block'],
      position: blocks.length, // Posição no final
    },
  });

  // Verifica se qualquer item arrastável válido está ativo
  const isDraggingAnyValidComponent =
    active?.data.current?.type === 'sidebar-component' ||
    active?.data.current?.type === 'canvas-block';

  // Debug do drop zone
  React.useEffect(() => {
    console.log('🎯 CanvasDropZone: isOver =', isOver, 'active =', active?.id);
    if (active?.data.current?.type === 'sidebar-component') {
      console.log('📦 Arrastando componente da sidebar:', active?.data.current?.blockType);
    } else if (active?.data.current?.type === 'canvas-block') {
      console.log('🔄 Reordenando bloco do canvas:', active?.id);
    }
  }, [isOver, active]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'p-3 min-h-[400px] transition-all duration-200',
        isOver && !isPreviewing && 'bg-brand/5 ring-2 ring-brand/20 ring-dashed',
        className
      )}
    >
      {blocks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500 text-lg mb-2">
            {isPreviewing
              ? 'Modo Preview - Nenhum componente nesta etapa'
              : 'Canvas vazio - Arraste componentes da sidebar para começar'}
          </p>
          {isOver && !isPreviewing && (
            <div className="mt-4 p-4 border-2 border-dashed border-brand/30 rounded-lg bg-brand/5">
              <p className="text-brand font-medium">Solte o componente aqui</p>
            </div>
          )}
        </div>
      ) : (
        <SortableContext
          items={blocks.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0">
            {/* Drop zone no início - agora aparece para QUALQUER item válido */}
            {isDraggingAnyValidComponent && <InterBlockDropZone position={0} isActive={true} />}

            {blocks.map((block, index) => (
              <React.Fragment key={block.id}>
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

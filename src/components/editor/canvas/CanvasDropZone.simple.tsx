import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { SortableBlockWrapper } from './SortableBlockWrapper.simple';

// Componente para drop zone entre blocos (sempre presente para maximizar detecção)
const InterBlockDropZoneBase: React.FC<{
  position: number;
  isActive?: boolean;
}> = ({ position, isActive = true }) => {
  // Evitar recriar arrays/objetos a cada render (impede re-registro contínuo no dnd-kit)
  const accepts = React.useMemo(() => ['sidebar-component', 'canvas-block'], []);
  const data = React.useMemo(() => ({ type: 'dropzone', accepts, position }), [accepts, position]);

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${position}`,
    data,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all duration-150 relative pointer-events-auto flex items-center justify-center w-full',
        'z-10',
        // Sempre renderizado: manter hit area perceptível
        'min-h-[16px]',
        // Ao arrastar sobre: ampliar e dar feedback visual
        isOver && 'min-h-[56px] bg-brand/10 border-2 border-dashed border-brand/40 rounded-lg',
        // Quando ativo (há drag em andamento) mas não está over: indicar posição sutil
        isActive && !isOver && 'min-h-[40px] bg-brand/5 rounded-full'
      )}
      data-dnd-dropzone-type="inter-block"
      data-position={position}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-brand font-medium text-xs sm:text-sm bg-white/90 px-2 sm:px-3 py-1.5 rounded shadow-sm">
            Inserir aqui (posição {position})
          </p>
        </div>
      )}
    </div>
  );
};

const InterBlockDropZone = React.memo(InterBlockDropZoneBase);

interface CanvasDropZoneProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  className?: string;
  isPreviewing?: boolean;
}

const CanvasDropZoneBase: React.FC<CanvasDropZoneProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  className,
  isPreviewing: isPreviewingProp = false,
}) => {
  // Evitar recriar arrays/objetos a cada render (impede re-registro contínuo no dnd-kit)
  const rootAccepts = React.useMemo(() => ['sidebar-component', 'canvas-block'], []);
  const rootData = React.useMemo(
    () => ({
      type: 'dropzone',
      accepts: rootAccepts,
      position: blocks.length, // Posição no final
      debug: 'main-canvas-zone', // Para debug
    }),
    [rootAccepts, blocks.length]
  );

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone', // Padroniza id principal para facilitar validação
    data: rootData,
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

  // Debug do drop zone - somente quando explicitamente habilitado
  const isDebug = React.useCallback(() => {
    try {
      return (
        ((import.meta as any)?.env?.DEV ?? false) ||
        (typeof process !== 'undefined' && (process as any)?.env?.NODE_ENV === 'development') ||
        (typeof window !== 'undefined' && (window as any).__DND_DEBUG === true)
      );
    } catch {
      return false;
    }
  }, []);

  React.useEffect(() => {
    if (!isDebug()) return;
    // eslint-disable-next-line no-console
    console.log('🎯 CanvasDropZone: isOver =', isOver, 'active =', active?.id);
    if (active?.data.current?.type === 'sidebar-component') {
      // eslint-disable-next-line no-console
      console.log('📦 Arrastando componente da sidebar:', active?.data.current?.blockType);
    } else if (active?.data.current?.type === 'canvas-block') {
      // eslint-disable-next-line no-console
      console.log('🔄 Reordenando bloco do canvas:', active?.id);
    }
  }, [isOver, active, isDebug]);

  // Modo preview controlado por prop (default: false)
  const isPreviewing = !!isPreviewingProp;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[300px] transition-all duration-200 pointer-events-auto p-4 overflow-visible',
        // Evitar qualquer bloqueio de eventos no canvas
        'z-0',
        isOver && !isPreviewing && 'bg-brand/5 ring-2 ring-brand/20 ring-dashed',
        'border border-dashed border-gray-200 rounded-lg',
        // ✅ CLASSE CSS DE FORÇA BRUTA
        'dnd-droppable-zone',
        className
      )}
      data-over={isOver}
      data-preview={isPreviewing}
      data-id="canvas-drop-zone"
      data-dnd-dropzone-type="root"
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
          items={blocks.map(block => `dnd-block-${String(block.id)}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {/* Drop zone no início - sempre presente (ativa durante drag) */}
            <InterBlockDropZone position={0} isActive={isDraggingAnyValidComponent} />

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

                {/* Drop zone entre blocos - sempre presente (ativa durante drag) */}
                <InterBlockDropZone position={index + 1} isActive={isDraggingAnyValidComponent} />
              </React.Fragment>
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};

export const CanvasDropZone = React.memo(CanvasDropZoneBase);

export default CanvasDropZone;

import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { cn } from '../../../lib/utils';
import { generateUniqueId } from '@/utils/generateUniqueId';

interface CanvasDropZoneProps {
  children: React.ReactNode;
  isEmpty: boolean;
  className?: string;
  'data-testid'?: string;
  // Opcional: escopo/etapa para IDs únicos (evita colisões entre etapas)
  scopeId?: number | string;
}

const CanvasDropZoneBase: React.FC<CanvasDropZoneProps> = ({
  children,
  isEmpty,
  className,
  'data-testid': dataTestId,
  scopeId,
}) => {
  const droppableId = React.useMemo(
    () => generateUniqueId({ stepNumber: scopeId ?? 'default', type: 'dropzone' }),
    [scopeId]
  );

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: {
      type: 'dropzone',
      accepts: ['sidebar-component', 'canvas-block'],
      position: 0, // Position for insertion
      scopeId: scopeId ?? 'default',
    },
  });

  // 🔧 DEBUG: Log quando componente monta
  React.useEffect(() => {
    try {
      const g: any = typeof window !== 'undefined' ? (window as any) : undefined;
      const debugEnabled = g?.__DND_DEBUG === true;
      if (!debugEnabled) return;
      // Deduplica logs por id para evitar spam por re-render
      const key = `canvas-dropzone:${String(droppableId)}`;
      g.__DND_LOGS = g.__DND_LOGS || new Set<string>();
      if (g.__DND_LOGS.has(key)) return;
      g.__DND_LOGS.add(key);
      // eslint-disable-next-line no-console
      console.log('🎯 CanvasDropZone montado!', {
        id: droppableId,
        isEmpty,
        isOver,
      });
    } catch {
      // noop
    }
  }, [isEmpty, isOver, droppableId]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 p-6 transition-all duration-200',
        'overflow-visible', // 🚨 CORREÇÃO: Permitir eventos de drag
        // ✅ Garante que o root seja tratado como droppable principal nas correções globais
        'dnd-droppable-zone',
  isOver && 'bg-[#B89B7A]/10',
        className
      )}
      role="button"
      aria-roledescription="sortable"
      aria-describedby="DndDescribedBy-2"
      // ✅ Importante para aplicar correções CSS globais de DnD
      data-id={droppableId}
      data-scope-id={String(scopeId ?? 'default')}
      data-testid={dataTestId}
      style={{ minHeight: '600px' }} // 🚨 CORREÇÃO: Garantir área mínima
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={cn(
            'relative bg-white rounded-lg shadow-sm min-h-[600px]',
            isOver && 'ring-2 ring-[#B89B7A]/40'
          )}
        >
          {children}

          {/* Drop indicator overlay */}
          {isOver && (
            <div className="absolute inset-0 bg-[#B89B7A]/10 rounded-lg border-2 border-dashed border-[#B89B7A]/60 flex items-center justify-center z-40 pointer-events-none">
              <div className="bg-[#B89B7A] text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm">
                ✨ Solte aqui o componente
              </div>
            </div>
          )}

          {/* Empty state overlay */}
          {isEmpty && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center py-16 text-gray-500 max-w-md">
                <div className="text-3xl mb-4">📝</div>
                <div className="text-lg font-medium mb-2">Nenhum bloco configurado</div>
                <div className="text-sm mb-4">
                  Esta etapa ainda não possui componentes configurados
                </div>
                <div className="text-xs text-gray-400">
                  Arraste componentes da biblioteca para começar a editar
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CanvasDropZone = React.memo(CanvasDropZoneBase);
CanvasDropZone.displayName = 'CanvasDropZone';
export default CanvasDropZone;

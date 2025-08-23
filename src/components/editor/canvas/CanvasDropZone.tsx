import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { cn } from '../../../lib/utils';

interface CanvasDropZoneProps {
  children: React.ReactNode;
  isEmpty: boolean;
  className?: string;
  'data-testid'?: string;
  // Ref opcional para o container interno relativo (onde os overlays ficam absolutos)
  containerRef?: React.Ref<HTMLDivElement>;
}

const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({
  children,
  isEmpty,
  className,
  'data-testid': dataTestId,
  containerRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas',
      accepts: ['sidebar-component', 'canvas-element'],
    },
  });

  // 🔧 DEBUG: Log quando componente monta
  React.useEffect(() => {
    console.log('🎯 CanvasDropZone montado!', {
      id: 'canvas-drop-zone',
      isEmpty,
      isOver,
    });
  }, [isEmpty, isOver]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 p-6 transition-all duration-200',
        'overflow-visible', // 🚨 CORREÇÃO: Permitir eventos de drag
        isOver && 'bg-blue-50',
        className
      )}
      data-testid={dataTestId}
      style={{ minHeight: '600px' }} // 🚨 CORREÇÃO: Garantir área mínima
    >
      <div className="max-w-4xl mx-auto">
        <div
          ref={containerRef}
          className={cn(
            'relative bg-white rounded-lg shadow-sm min-h-[600px]',
            isOver && 'ring-2 ring-blue-300 ring-opacity-50'
          )}
        >
          {children}

          {/* Drop indicator overlay */}
          {isOver && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-20 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center z-40 pointer-events-none">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm">
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

export default CanvasDropZone;
export { CanvasDropZone };

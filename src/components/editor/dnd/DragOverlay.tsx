import { cn } from '@/lib/utils';
import React from 'react';

interface DragOverlayProps {
  isDragActive: boolean;
  dragType?: 'sidebar-component' | 'canvas-block';
  componentType?: string;
  isValidDrop?: boolean;
  children?: React.ReactNode;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({
  isDragActive,
  dragType,
  componentType,
  isValidDrop = true,
  children,
}) => {
  if (!isDragActive) return <>{children}</>;

  return (
    <div className="relative">
      {children}

      {/* Overlay de feedback visual */}
      <div
        className={cn(
          'absolute inset-0 z-50 flex items-center justify-center',
          'transition-all duration-200 ease-in-out',
          'border-2 border-dashed rounded-lg',
          isValidDrop ? 'border-green-400 bg-green-50/80' : 'border-red-400 bg-red-50/80'
        )}
      >
        <div
          className={cn(
            'px-4 py-2 rounded-md font-medium text-sm',
            'flex items-center gap-2',
            isValidDrop
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          )}
        >
          {isValidDrop ? (
            <>
              <span className="text-lg">✅</span>
              {dragType === 'sidebar-component' ? (
                <span>Solte para adicionar {componentType}</span>
              ) : (
                <span>Solte para reordenar</span>
              )}
            </>
          ) : (
            <>
              <span className="text-lg">❌</span>
              <span>Área de drop inválida</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface DropZoneIndicatorProps {
  isOver: boolean;
  canDrop: boolean;
  isEmpty?: boolean;
}

export const DropZoneIndicator: React.FC<DropZoneIndicatorProps> = ({
  isOver,
  canDrop,
  isEmpty = false,
}) => {
  if (!isOver && !isEmpty) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 rounded-lg border-2 border-dashed',
        'flex items-center justify-center',
        'transition-all duration-200',
        canDrop ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300 bg-gray-50/50',
        isEmpty && 'relative border-gray-300 bg-gray-50 min-h-[200px]'
      )}
    >
      {isEmpty ? (
        <div className="text-center text-gray-500">
          <div className="text-3xl mb-2">📦</div>
          <p className="text-sm font-medium">Arraste componentes aqui</p>
          <p className="text-xs text-gray-400 mt-1">Ou use o painel de componentes</p>
        </div>
      ) : isOver ? (
        <div
          className={cn(
            'px-3 py-2 rounded-md font-medium text-sm',
            canDrop ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          )}
        >
          {canDrop ? '✅ Solte aqui' : '❌ Drop inválido'}
        </div>
      ) : null}
    </div>
  );
};

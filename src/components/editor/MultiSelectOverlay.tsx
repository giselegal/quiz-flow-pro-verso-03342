import { cn } from '@/lib/utils';
import React from 'react';

interface MultiSelectOverlayProps {
  selectedBlocks: string[];
  blocks: any[];
  isSelecting: boolean;
  selectionMode: 'single' | 'multi';
  onBulkDelete?: () => void;
  onBulkDuplicate?: () => void;
  onBulkMove?: () => void;
  onDeselectAll?: () => void;
  className?: string;
}

export const MultiSelectOverlay: React.FC<MultiSelectOverlayProps> = ({
  selectedBlocks,
  blocks,
  isSelecting,
  onBulkDelete,
  onBulkDuplicate,
  onBulkMove,
  onDeselectAll,
  className,
}) => {
  if (!isSelecting || selectedBlocks.length === 0) return null;

  const selectedCount = selectedBlocks.length;
  const totalCount = blocks.length;
  const isAllSelected = selectedCount === totalCount;
  const isMultiSelected = selectedCount > 1;

  return (
    <>
      {/* Overlay de fundo com contador */}
      <div
        className={cn(
          'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
          'bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg',
          'flex items-center gap-3 transition-all duration-200',
          'animate-in slide-in-from-top-2',
          className
        )}
      >
        {/* Contador */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
            {selectedCount}
          </div>
          <span className="text-sm font-medium">
            {isAllSelected
              ? 'Todos os blocos selecionados'
              : `${selectedCount} de ${totalCount} blocos selecionados`}
          </span>
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-blue-400" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Duplicate */}
          {isMultiSelected && onBulkDuplicate && (
            <button
              onClick={onBulkDuplicate}
              title={`Duplicar ${selectedCount} blocos (Ctrl+D)`}
              className="p-1.5 rounded hover:bg-blue-500 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
          )}

          {/* Move */}
          {isMultiSelected && onBulkMove && (
            <button
              onClick={onBulkMove}
              title={`Mover ${selectedCount} blocos`}
              className="p-1.5 rounded hover:bg-blue-500 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 7l10 10M7 17L17 7" />
              </svg>
            </button>
          )}

          {/* Delete */}
          {onBulkDelete && (
            <button
              onClick={onBulkDelete}
              title={`Excluir ${selectedCount} blocos (Delete)`}
              className="p-1.5 rounded hover:bg-red-500 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          )}

          {/* Separator */}
          <div className="w-px h-4 bg-blue-400 mx-1" />

          {/* Deselect All */}
          {onDeselectAll && (
            <button
              onClick={onDeselectAll}
              title="Desselecionar todos (Esc)"
              className="p-1.5 rounded hover:bg-blue-500 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Indicador visual nos blocos selecionados via CSS global */}
      <style>{`
        [data-selected="true"] {
          position: relative;
        }
        
        [data-selected="true"]::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
          z-index: 10;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        [data-selected="true"]::after {
          content: '✓';
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          z-index: 11;
        }
        
        @keyframes pulse {
          0%, 100% {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
          }
          50% {
            border-color: #60a5fa;
            background: rgba(59, 130, 246, 0.2);
          }
        }
      `}</style>
    </>
  );
};

// 🎯 Componente para seleção por range (Shift+Click)
export const SelectionRangeIndicator: React.FC<{
  fromIndex: number;
  toIndex: number;
  isVisible: boolean;
}> = ({ fromIndex, toIndex, isVisible }) => {
  if (!isVisible || fromIndex === toIndex) return null;

  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  const rangeSize = end - start + 1;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-medium animate-in slide-in-from-top-1">
        📏 Selecionando {rangeSize} blocos em sequência
      </div>
    </div>
  );
};

// 🚀 Hook para integrar com SortableBlock
export const useMultiSelectIndicator = (isSelected: boolean) => {
  return {
    'data-selected': isSelected,
    className: cn(
      'transition-all duration-200',
      isSelected && 'relative z-20 transform scale-[1.02]'
    ),
  };
};

export default MultiSelectOverlay;

import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface SortableBlockProps {
  id: string;
  block: Block;
  isSelected: boolean;
  topOffset: number;
  height: number;
  onSelect: (id: string, event?: React.MouseEvent) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicate: () => void;
  onDelete: (id: string) => void;
  'data-testid'?: string;
}

export const SortableBlock: React.FC<SortableBlockProps> = ({
  id,
  block,
  isSelected,
  topOffset,
  height,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  'data-testid': dataTestId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    top: `${topOffset}px`,
    height: `${height}px`,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 70 : isSelected ? 60 : 50,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'absolute left-4 right-4 pointer-events-auto cursor-pointer transition-all duration-300',
        'rounded-lg border-2 border-dashed',
        isDragging && 'opacity-50 scale-105',
        isSelected
          ? 'border-blue-500 bg-blue-500 bg-opacity-10 shadow-lg'
          : 'border-transparent hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-5'
      )}
      onClick={e => {
        e.stopPropagation();
        onSelect(id, e);
      }}
      data-testid={dataTestId}
    >
      {/* Badge de identificação sempre visível no hover ou seleção */}
      <div
        className={cn(
          'absolute -top-10 left-0 text-xs px-3 py-1 rounded-t-lg font-medium shadow-lg transition-all duration-200',
          isSelected
            ? 'bg-blue-600 text-white opacity-100'
            : 'bg-gray-800 text-white opacity-0 group-hover:opacity-100'
        )}
        data-testid={`editor-block-title-${id}`}
      >
        {isSelected ? '✏️' : '🖱️'} {block.type}
        {isSelected && ` - ${id}`}
      </div>

      {/* Controles de ação (apenas quando selecionado) */}
      {isSelected && (
        <div className="absolute -top-10 right-0 flex gap-1">
          <button
            onClick={e => {
              e.stopPropagation();
              onMoveUp(id);
            }}
            className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700 transition-colors"
            title="Mover para cima"
          >
            ⬆️
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onMoveDown(id);
            }}
            className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700 transition-colors"
            title="Mover para baixo"
          >
            ⬇️
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="bg-green-600 text-white p-1 rounded text-xs hover:bg-green-700 transition-colors"
            title="Duplicar bloco"
          >
            📋
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700 transition-colors"
            title="Remover bloco"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Indicador de edição ativa */}
      {isSelected && (
        <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-tl-lg font-medium animate-pulse">
          Editando →
        </div>
      )}

      {/* Indicador de hover para blocos não selecionados */}
      {!isSelected && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="bg-gray-800 bg-opacity-90 text-white text-xs px-3 py-1 rounded-lg font-medium shadow-lg">
            🖱️ Clique para editar
          </div>
        </div>
      )}

      {/* Outline animado para o bloco selecionado */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse"></div>
      )}

      {/* Indicador de drag handle */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded text-xs cursor-grab active:cursor-grabbing">
          ⋮⋮
        </div>
      )}
    </div>
  );
};

import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, GripVertical, Trash2 } from 'lucide-react';
import React from 'react';

interface OptimizedSortableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

export const OptimizedSortableBlock: React.FC<OptimizedSortableBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `dnd-block-${block.id}`,
    data: {
      type: 'block',
      block,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : isSelected ? 50 : 1,
  };

  // Handlers otimizados
  const handleSelect = React.useCallback(() => {
    onSelect(block.id);
  }, [block.id, onSelect]);

  const handleDuplicate = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDuplicate(block.id);
    },
    [block.id, onDuplicate]
  );

  const handleDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(block.id);
    },
    [block.id, onDelete]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative mb-4 rounded-lg transition-all duration-200',
        'border-2 border-dashed',
        isDragging && 'opacity-50 scale-105 shadow-2xl',
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg'
          : 'border-transparent hover:border-primary/50 hover:bg-primary/5'
      )}
      onClick={handleSelect}
    >
      {/* Toolbar superior - visível apenas no hover ou seleção */}
      <div
        className={cn(
          'absolute -top-10 left-0 right-0 flex items-center justify-between',
          'bg-white border border-border rounded-md shadow-sm px-2 py-1',
          'transition-all duration-200',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        {/* Informações do bloco */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">{block.type}</span>
          <span className="text-xs text-muted-foreground">ID: {block.id.slice(-8)}</span>
        </div>

        {/* Ações do bloco */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleDuplicate}
            className={cn(
              'p-1 rounded hover:bg-secondary transition-colors',
              'text-muted-foreground hover:text-foreground'
            )}
            title="Duplicar bloco"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className={cn(
              'p-1 rounded hover:bg-destructive/10 transition-colors',
              'text-muted-foreground hover:text-destructive'
            )}
            title="Remover bloco"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 -bottom-1 -left-1 pointer-events-none">
          <div className="w-full h-full border-2 border-primary rounded-lg animate-pulse" />
        </div>
      )}

      {/* Conteúdo do bloco */}
      <div className="relative p-4">{children}</div>

      {/* Indicador de drag */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
            Movendo bloco...
          </div>
        </div>
      )}

      {/* Drop zone indicator para inserção */}
      <div
        className={cn(
          'absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full',
          'transition-all duration-200 scale-x-0 group-hover:scale-x-100'
        )}
      />
    </div>
  );
};

export default OptimizedSortableBlock;

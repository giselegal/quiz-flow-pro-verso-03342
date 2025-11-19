import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface SortableStepItemProps {
  id: string;
  title: string;
  isActive?: boolean;
  isSelected?: boolean;
  isCustomStep?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
  onDelete?: (stepId: string) => void;
  onDuplicate?: () => void | Promise<void>;
}

export const SortableStepItem: React.FC<SortableStepItemProps> = ({
  id,
  title,
  isActive,
  isSelected,
  isCustomStep,
  onClick,
  onSelect,
  onDelete,
  onDuplicate,
}) => {
  // Usar onSelect se fornecido, caso contrário usar onClick para compatibilidade
  const handleClick = onSelect || onClick;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determinar se o item está ativo (isActive ou isSelected)
  const active = isActive || isSelected;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 px-2 py-2 rounded-md transition-colors',
        active
          ? 'bg-blue-100 border-l-4 border-blue-600 text-blue-900'
          : 'hover:bg-gray-100 border-l-4 border-transparent',
        isDragging && 'opacity-50 cursor-grabbing'
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Step Title */}
      <button
        onClick={(e) => {
          console.log('🟢 [SortableStepItem] onClick chamado:', { id, title, hasHandler: !!handleClick });
          e.stopPropagation();
          handleClick?.();
        }}
        className="flex-1 text-left text-sm font-medium truncate"
        disabled={!handleClick}
      >
        {title}
      </button>

      {/* Actions Menu */}
      {onDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default SortableStepItem;

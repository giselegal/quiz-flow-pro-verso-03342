/**
 * 🎯 SORTABLE STEP ITEM
 * 
 * Item de step com suporte a drag and drop
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, MoreVertical, Trash2, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SortableStepItemProps {
  id: string;
  title: string;
  isSelected: boolean;
  isCustomStep: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function SortableStepItem({
  id,
  title,
  isSelected,
  isCustomStep,
  onSelect,
  onDelete,
  onDuplicate,
}: SortableStepItemProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'z-50' : ''}`}
    >
      <div className="flex items-center gap-1">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-accent rounded opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Reordenar etapa"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Step Button */}
        <button
          className={`flex-1 text-left px-2 py-1 rounded hover:bg-accent transition-colors ${isSelected ? 'bg-accent font-medium' : ''
            }`}
          onClick={onSelect}
          data-testid="step-navigator-item"
          data-step-id={id}
          data-step-order={id.match(/\d+/)?.[0] || '0'}
        >
          {title}
        </button>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar Etapa
            </DropdownMenuItem>

            {isCustomStep && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar Etapa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}

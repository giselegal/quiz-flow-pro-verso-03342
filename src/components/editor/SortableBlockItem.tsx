import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types/editor';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableBlockItemProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  children?: React.ReactNode;
}

const SortableBlockItem: React.FC<SortableBlockItemProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={`p-4 cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'
        }`}
        onClick={() => onSelect?.(block.id)}
      >
        <div className="flex items-center gap-2">
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium capitalize">{block.type}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(block.id);
                }}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {children && <div className="mt-2">{children}</div>}
      </Card>
    </div>
  );
};

export default SortableBlockItem;
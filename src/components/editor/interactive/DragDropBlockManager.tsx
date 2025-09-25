import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface DragDropBlockManagerProps {
  blocks: Block[];
  onReorder: (blocks: Block[]) => void;
  children: (block: Block) => React.ReactNode;
  disabled?: boolean;
}

interface SortableBlockProps {
  block: Block;
  children: React.ReactNode;
  isDragging?: boolean;
}

const SortableBlock: React.FC<SortableBlockProps> = ({ 
  block, 
  children, 
  isDragging = false 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        (isSortableDragging || isDragging) && 'opacity-50 z-50',
        'hover:bg-muted/20 rounded-lg transition-colors'
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute -left-8 top-1/2 -translate-y-1/2 z-40',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'cursor-grab active:cursor-grabbing',
          'p-1 rounded bg-background border border-border shadow-sm',
          'hover:bg-muted'
        )}
        title="Arrastar para reordenar"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Block Content */}
      <div className="pl-4">
        {children}
      </div>
    </div>
  );
};

export const DragDropBlockManager: React.FC<DragDropBlockManagerProps> = ({
  blocks,
  onReorder,
  children,
  disabled = false,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px of movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over?.id);
      
      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
      
      // Update the order property to match new positions
      const updatedBlocks = reorderedBlocks.map((block, index) => ({
        ...block,
        order: index + 1,
      }));
      
      onReorder(updatedBlocks);
    }

    setActiveId(null);
  };

  const activeBlock = blocks.find(block => block.id === activeId);

  if (disabled) {
    return (
      <div className="space-y-4">
        {blocks.map(block => (
          <div key={block.id}>
            {children(block)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4 pl-8 relative">
          {/* Drop Zone Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-border rounded opacity-30" />
          
          {blocks.map(block => (
            <SortableBlock 
              key={block.id} 
              block={block}
              isDragging={activeId === block.id}
            >
              {children(block)}
            </SortableBlock>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeBlock ? (
          <div className="bg-background border border-primary rounded-lg shadow-lg p-4 rotate-2">
            <div className="opacity-80">
              {children(activeBlock)}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
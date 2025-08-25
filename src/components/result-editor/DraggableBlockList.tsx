// @ts-nocheck
import React, { useState } from 'react';
import { Block } from '@/types/editor';
import { SortableBlock } from './SortableBlock';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { ResultPageBlock } from '@/types/quizResult';

interface DraggableBlockListProps {
  blocks: Block[];
  selectedBlockId: string | null;
  isPreviewing: boolean;
  onSelectBlock: (id: string) => void;
  onReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
  onDuplicateBlock?: (id: string) => void;
  onDeleteBlock?: (id: string) => void;
}

export const DraggableBlockList: React.FC<DraggableBlockListProps> = ({
  blocks,
  selectedBlockId,
  isPreviewing,
  onSelectBlock,
  onReorderBlocks,
  onDuplicateBlock,
  onDeleteBlock,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && String(active.id) !== String(over.id)) {
      const oldIndex = blocks.findIndex(block => String(block.id) === String(active.id));
      const newIndex = blocks.findIndex(block => String(block.id) === String(over.id));

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderBlocks(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
    <SortableContext items={blocks.map(block => String(block.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-4 p-4">
          {blocks.map(block => (
            <SortableBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              isPreviewing={isPreviewing}
              onSelect={() => onSelectBlock(block.id)}
              onDuplicate={onDuplicateBlock ? () => onDuplicateBlock(block.id) : undefined}
              onDelete={onDeleteBlock ? () => onDeleteBlock(block.id) : undefined}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

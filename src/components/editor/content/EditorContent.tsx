
import React from 'react';
import { Block } from '@/types/editor';
import { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

interface EditorContentProps {
  blocks: Block[];
  onDragEnd: (event: DragEndEvent) => void;
  onAddBlock: (type: string) => void;
  onUpdateBlock: (id: string, content: any) => void;
  onDeleteBlock: (id: string) => void;
  isPreviewing?: boolean;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  blocks,
  onDragEnd,
  onAddBlock,
  isPreviewing = false,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = blocks.map((item: Block) => item.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onDragEnd(event);
    }
  };

  const renderBlock = (item: Block) => {
    return (
      <div key={item.id} className="block-wrapper">
        <div className="block-content">
          {/* Block content would be rendered here */}
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Block: {item.type}</div>
            <div className="text-xs text-gray-400">ID: {item.id}</div>
          </div>
        </div>
      </div>
    );
  };

  if (isPreviewing) {
    return (
      <div className="preview-mode">
        {blocks.map((item) => renderBlock(item))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="editor-content space-y-4">
          {blocks.map((item) => renderBlock(item))}
          
          {blocks.length === 0 && (
            <div className="empty-state text-center py-8">
              <p className="text-gray-500 mb-4">No blocks yet. Add your first block!</p>
              <button
                onClick={() => onAddBlock('text')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Text Block
              </button>
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};

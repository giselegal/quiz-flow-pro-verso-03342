
import React from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { EditorBlock } from '@/types/editor';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { EditorContent } from './content/EditorContent';
import { useEditorHistory } from '@/hooks/editor/useEditorHistory';
import { useEditorActions } from '@/hooks/editor/useEditorActions';

interface PageEditorProps {
  blocks: EditorBlock[];
  onBlocksChange: (blocks: EditorBlock[]) => void;
  onPreviewToggle: () => void;
  isPreviewing: boolean;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  blocks,
  onBlocksChange,
  onPreviewToggle,
  isPreviewing
}) => {
  const { addToHistory, undo, redo, canUndo, canRedo } = useEditorHistory(blocks);
  const { handleAddBlock, handleUpdateBlock, handleDeleteBlock, handleSave } = useEditorActions(
    blocks,
    onBlocksChange,
    addToHistory
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIndex = blocks.findIndex(block => block.id === active.id);
      const overIndex = blocks.findIndex(block => block.id === over.id);
      
      const newBlocks = arrayMove(blocks, activeIndex, overIndex)
        .map((block, index) => ({ ...block, order: index }));
      
      onBlocksChange(newBlocks);
      addToHistory(newBlocks);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar 
        onUndo={undo}
        onRedo={redo}
        onTogglePreview={onPreviewToggle}
        onSave={handleSave}
        isPreviewing={isPreviewing}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="flex-1 overflow-auto p-4 bg-[#FAF9F7]">
        <EditorContent 
          blocks={blocks}
          onDragEnd={handleDragEnd}
          onAddBlock={handleAddBlock}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          isPreviewing={isPreviewing}
        />
      </div>
    </div>
  );
};

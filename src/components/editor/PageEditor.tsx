import { useEditorActions } from '@/hooks/editor/useEditorActions';
import { useEditorHistory } from '@/hooks/editor/useEditorHistory';
import { EditorBlock } from '@/types/editor';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { EditorContent } from './content/EditorContent';
import { EditorToolbar } from './toolbar/EditorToolbar';

interface PageEditorProps {
  blocks: EditorBlock[];
  onBlocksChange: (blocks: EditorBlock[]) => void;
  onPreviewToggle: () => void;
  isPreviewing: boolean;
}

export const PageEditor: React.FC<PageEditorProps> = ({ blocks, onBlocksChange, isPreviewing }) => {
  const { addToHistory } = useEditorHistory(blocks);
  const { handleAddBlock, handleUpdateBlock, handleDeleteBlock } = useEditorActions(
    blocks,
    onBlocksChange,
    addToHistory
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && String(active.id) !== String(over.id)) {
      const activeIndex = blocks.findIndex(block => String(block.id) === String(active.id));
      const overIndex = blocks.findIndex(block => String(block.id) === String(over.id));

      const newBlocks = arrayMove(blocks, activeIndex, overIndex).map((block, index) => ({
        ...block,
        order: index,
      }));

      onBlocksChange(newBlocks);
      addToHistory(newBlocks);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar />

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

import React, { memo, useCallback } from 'react';
import { Block } from '@/types/editor';
import { QuizRenderer } from '@/components/core/QuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlock: Block | null;
  currentStep: number;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  onDeleteBlock: (blockId: string) => void;
  isPreviewMode: boolean;
}

const EditorCanvas: React.FC<EditorCanvasProps> = memo(({
  blocks,
  selectedBlock,
  currentStep,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  isPreviewMode
}) => {
  // Otimizar seleção de blocos
  const handleBlockSelect = useCallback((id: string) => {
    onSelectBlock(id);
  }, [onSelectBlock]);

  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<Block>) => {
    onUpdateBlock(blockId, updates);
  }, [onUpdateBlock]);

  if (isPreviewMode) {
    return (
      <div className="h-full overflow-auto">
        <QuizRenderer
          mode="preview"
          currentStepOverride={currentStep}
          blocksOverride={blocks}
          previewEditable={false}
        />
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <CanvasDropZone
        blocks={blocks}
        selectedBlockId={selectedBlock?.id || null}
        onSelectBlock={handleBlockSelect}
        onUpdateBlock={handleBlockUpdate}
        onDeleteBlock={onDeleteBlock}
      />
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
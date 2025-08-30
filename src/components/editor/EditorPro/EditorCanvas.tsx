import React, { memo, useCallback } from 'react';
import { Block } from '@/types/editor';
import { QuizRenderer } from '@/components/core/QuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlock: Block | null;
  currentStep: number;
  onSelectBlock: (block: Block) => void;
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
  const { debounce } = useOptimizedScheduler();

  // Otimizar seleção de blocos com debounce
  const handleBlockSelect = useCallback((block: Block) => {
    onSelectBlock(block);
  }, [onSelectBlock]);

  // Otimizar atualizações de blocos com debounce
  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<Block>) => {
    onUpdateBlock(blockId, updates);
  }, [onUpdateBlock]);

  if (isPreviewMode) {
    return (
      <div className="h-full overflow-auto">
        <QuizRenderer 
          currentStep={currentStep}
          onStepComplete={() => {}}
          onQuizComplete={() => {}}
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
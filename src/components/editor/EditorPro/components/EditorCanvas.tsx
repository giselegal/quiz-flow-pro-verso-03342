import React, { memo, useCallback, useMemo } from 'react';
import { Block } from '@/types/editor';
import { QuizRenderer } from '@/components/core/QuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import { useStepSelection } from '@/hooks/useStepSelection';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { generateStableKey } from '@/utils/generateUniqueId';

/**
 * 🎨 CANVAS DO EDITOR OTIMIZADO
 * 
 * Componente isolado com contexto DnD próprio por etapa
 */

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlock: Block | null;
  currentStep: number;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (oldIndex: number, newIndex: number) => void;
  isPreviewMode: boolean;
  onStepChange?: (step: number) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = memo(({
  blocks,
  selectedBlock,
  currentStep,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  isPreviewMode,
  onStepChange
}) => {
  // Sistema de seleção otimizado
  const { handleBlockSelection } = useStepSelection({
    stepNumber: currentStep,
    onSelectBlock,
    debounceMs: 50
  });

  // Handlers do DnD otimizados
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active?.data?.current?.blockId) {
      handleBlockSelection(active.data.current.blockId);
    }
  }, [handleBlockSelection]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Encontrar índices para reordenação
    const activeIndex = blocks.findIndex(block =>
      `dnd-block-${currentStep}-${block.id}` === activeId
    );
    const overIndex = blocks.findIndex(block =>
      `dnd-block-${currentStep}-${block.id}` === overId
    );

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      onReorderBlocks(activeIndex, overIndex);
    }
  }, [blocks, currentStep, onReorderBlocks]);

  // Key estável para forçar remount ao trocar etapa
  const canvasKey = useMemo(() =>
    generateStableKey({
      stepNumber: currentStep,
      type: 'block'
    }),
    [currentStep]
  );

  if (isPreviewMode) {
    return (
      <div className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
        <div className="h-full w-full overflow-y-auto">
          <QuizRenderer
            mode="preview"
            currentStepOverride={currentStep}
            blocksOverride={blocks}
            previewEditable={false}
            onStepChange={onStepChange}
            className="preview-mode-canvas"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      key={canvasKey}
      className="flex-1 min-h-0 relative bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]"
    >
      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <StepDndProvider
          stepNumber={currentStep}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <CanvasDropZone
            blocks={blocks}
            selectedBlockId={selectedBlock?.id || null}
            onSelectBlock={handleBlockSelection}
            onUpdateBlock={onUpdateBlock}
            onDeleteBlock={onDeleteBlock}
            scopeId={currentStep}
          />
        </StepDndProvider>
      </div>
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
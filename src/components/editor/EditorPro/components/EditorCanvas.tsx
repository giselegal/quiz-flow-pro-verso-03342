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
}

const EditorCanvas: React.FC<EditorCanvasProps> = memo(({
  blocks,
  selectedBlock,
  currentStep,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  isPreviewMode
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
      <div className="flex-1 min-h-0 overflow-auto">
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
    <div 
      key={canvasKey}
      className="flex-1 min-h-0 relative overflow-auto editor-canvas"
    >
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
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
import React, { memo, useMemo } from 'react';
import { Block } from '@/types/editor';
import { QuizRenderer } from '@/components/core/QuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { SortableContext } from '@dnd-kit/sortable';
import { useStepSelection } from '@/hooks/useStepSelection';
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
  isPreviewMode,
  onStepChange
}) => {
  // Sistema de seleção otimizado
  const { handleBlockSelection } = useStepSelection({
    stepNumber: currentStep,
    onSelectBlock,
    debounceMs: 50
  });

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
        {/* ✅ CORREÇÃO: Remover StepDndProvider aninhado - usar apenas SortableContext */}
        <SortableContext items={blocks.map(block => `dnd-block-${currentStep}-${block.id}`)}>
          <CanvasDropZone
            blocks={blocks}
            selectedBlockId={selectedBlock?.id || null}
            onSelectBlock={handleBlockSelection}
            onUpdateBlock={onUpdateBlock}
            onDeleteBlock={onDeleteBlock}
            scopeId={currentStep}
          />
        </SortableContext>
      </div>
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
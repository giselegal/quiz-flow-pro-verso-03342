import React, { memo, useMemo } from 'react';
import { Block } from '@/types/editor';
import { QuizRenderer } from '@/components/core/QuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { SortableContext } from '@dnd-kit/sortable';
import { useStepSelection } from '@/hooks/useStepSelection';

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

const EditorCanvas: React.FC<EditorCanvasProps> = ({
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

  // Key estável que NÃO força remount desnecessário
  const canvasKey = useMemo(() => {
    // Usar uma chave estável baseada apenas no step, não regenerar constantemente
    return `editor-canvas-step-${currentStep}`;
  }, [currentStep]);

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
};

// 🚀 OTIMIZAÇÃO: Comparação inteligente para evitar re-renders desnecessários
const arePropsEqual = (prevProps: EditorCanvasProps, nextProps: EditorCanvasProps): boolean => {
  // Se mudou o step ou mode, re-render
  if (prevProps.currentStep !== nextProps.currentStep || prevProps.isPreviewMode !== nextProps.isPreviewMode) {
    return false;
  }

  // Se mudou o selectedBlock ID, re-render
  if (prevProps.selectedBlock?.id !== nextProps.selectedBlock?.id) {
    return false;
  }

  // Se mudou o número ou ordem de blocos, re-render
  if (prevProps.blocks.length !== nextProps.blocks.length) {
    return false;
  }

  // Comparação rápida de IDs dos blocos (sem comparar todo o content)
  for (let i = 0; i < prevProps.blocks.length; i++) {
    if (prevProps.blocks[i].id !== nextProps.blocks[i].id) {
      return false;
    }
  }

  return true; // Props são equivalentes, não re-render
};

EditorCanvas.displayName = 'EditorCanvas';

export default memo(EditorCanvas, arePropsEqual);
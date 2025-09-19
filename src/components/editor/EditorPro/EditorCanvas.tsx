import React, { memo, useCallback } from 'react';
import { Block } from '@/types/editor';
import ScalableQuizRenderer from '@/components/core/ScalableQuizRenderer';
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
      <div className="flex-1 min-h-0 overflow-auto">
        <ScalableQuizRenderer
          funnelId="quiz21StepsComplete"
          mode="preview"
          debugMode={true}
          className="editor-preview-mode"
          onStepChange={(step, data) => {
            console.log('📍 Editor preview step change:', step, data);
          }}
        />
      </div>
    );
  }

  // Força remount ao trocar de etapa para resetar contexto DnD e refs internas
  return (
    <div className="flex-1 min-h-0 relative overflow-auto" key={`editor-canvas-step-${currentStep}`}>
      <CanvasDropZone
        blocks={blocks}
        selectedBlockId={selectedBlock?.id || null}
        onSelectBlock={handleBlockSelect}
        onUpdateBlock={handleBlockUpdate}
        onDeleteBlock={onDeleteBlock}
        scopeId={currentStep}
      />
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
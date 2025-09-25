import React, { memo, useMemo } from 'react';
import { Block } from '@/types/editor';
import ScalableQuizRenderer from '@/components/core/ScalableQuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { useStepSelection } from '@/hooks/useStepSelection';
import { UnifiedPreviewEngine } from '@/components/editor/unified/UnifiedPreviewEngine'; // Import para experiência real

/**
 * 🎨 CANVAS DO EDITOR OTIMIZADO
 * 
 * Agora usa ScalableQuizRenderer para preview escalável!
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
  realExperienceMode?: boolean; // Nova prop para ativar QuizOrchestrator
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  selectedBlock,
  currentStep,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  isPreviewMode,
  onStepChange,
  realExperienceMode = false // Nova prop para ativar QuizOrchestrator
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
      <div className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate">
        <div className="h-full w-full overflow-y-auto relative z-0">
          <ScalableQuizRenderer
            funnelId="quiz21StepsComplete"
            mode="preview"
            debugMode={true}
            className="preview-mode-canvas w-full h-full"
            onStepChange={(step, data) => {
              if (onStepChange) onStepChange(step);
              console.log('📍 Preview step change:', step, data);
            }}
          />
        </div>
      </div>
    );
  }

  // 🎯 NOVA FUNCIONALIDADE: Experiência Real com QuizOrchestrator
  if (realExperienceMode) {
    console.log('🎯 [DEBUG] EditorCanvas renderizando em modo Real Experience');
    return (
      <div className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate">
        <div className="h-full w-full overflow-y-auto relative z-0">
          {/* Indicador visual de modo real ativo */}
          <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            🎯 MODO REAL ATIVO
          </div>
          
          <UnifiedPreviewEngine
            blocks={blocks}
            selectedBlockId={selectedBlock?.id}
            isPreviewing={false}
            viewportSize="desktop"
            onBlockSelect={onSelectBlock}
            onBlockUpdate={onUpdateBlock}
            onBlocksReordered={() => {}}
            funnelId="quiz21StepsComplete"
            currentStep={currentStep}
            enableInteractions={true}
            mode="editor"
            enableProductionMode={realExperienceMode} // 🎯 CORREÇÃO: Usar realExperienceMode diretamente
          />
        </div>
      </div>
    );
  }

  return (
    <div
      key={canvasKey}
      className="flex-1 min-h-0 relative bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate"
    >
      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* ✅ CORREÇÃO: Usar CanvasDropZone sem SortableContext aninhado */}
        <CanvasDropZone
          blocks={blocks}
          selectedBlockId={selectedBlock?.id || null}
          onSelectBlock={handleBlockSelection}
          onUpdateBlock={onUpdateBlock}
          onDeleteBlock={onDeleteBlock}
          scopeId={currentStep}
        />
      </div>
    </div>
  );
};

// 🚀 OTIMIZAÇÃO AVANÇADA: Comparação profunda para eliminar re-renders desnecessários
const arePropsEqual = (prevProps: EditorCanvasProps, nextProps: EditorCanvasProps): boolean => {
  // 1. Comparações rápidas primeiro (early returns)
  if (prevProps.currentStep !== nextProps.currentStep ||
    prevProps.isPreviewMode !== nextProps.isPreviewMode ||
    prevProps.realExperienceMode !== nextProps.realExperienceMode) {
    return false;
  }

  // 2. Comparar selectedBlock
  if (prevProps.selectedBlock?.id !== nextProps.selectedBlock?.id) {
    return false;
  }

  // 3. Comparar handlers (referência de função pode mudar)
  if (prevProps.onSelectBlock !== nextProps.onSelectBlock ||
    prevProps.onUpdateBlock !== nextProps.onUpdateBlock ||
    prevProps.onDeleteBlock !== nextProps.onDeleteBlock ||
    prevProps.onStepChange !== nextProps.onStepChange) {
    return false;
  }

  // 4. Comparação inteligente de blocos
  if (prevProps.blocks.length !== nextProps.blocks.length) {
    return false;
  }

  // 5. ✅ NOVA OTIMIZAÇÃO: Comparação profunda de conteúdo dos blocos
  for (let i = 0; i < prevProps.blocks.length; i++) {
    const prevBlock: Block = prevProps.blocks[i];
    const nextBlock: Block = nextProps.blocks[i];

    // Comparar ID, type e propriedades essenciais
    if (prevBlock.id !== nextBlock.id ||
      prevBlock.type !== nextBlock.type ||
      prevBlock.position !== nextBlock.position) {
      return false;
    }

    // ✅ Comparação shallow de propriedades críticas (sem deep comparison custosa)
    const prevBlockProps = prevBlock.properties || {};
    const nextBlockProps = nextBlock.properties || {};

    if (Object.keys(prevBlockProps).length !== Object.keys(nextBlockProps).length) {
      return false;
    }

    // Comparar apenas propriedades visuais que afetam renderização
    const visualProps = ['text', 'content', 'backgroundColor', 'textColor', 'fontSize', 'padding', 'margin', 'visible'];
    for (const prop of visualProps) {
      if (prevBlockProps[prop] !== nextBlockProps[prop]) {
        return false;
      }
    }

    // Comparação shallow de content
    const prevContent = prevBlock.content || {};
    const nextContent = nextBlock.content || {};

    if (JSON.stringify(prevContent) !== JSON.stringify(nextContent)) {
      return false;
    }
  }

  return true; // Props são realmente equivalentes, evitar re-render
};

EditorCanvas.displayName = 'EditorCanvas';

export default memo(EditorCanvas, arePropsEqual);
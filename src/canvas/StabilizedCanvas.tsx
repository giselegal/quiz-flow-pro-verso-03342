/**
 * 🎨 STABILIZED CANVAS - FASE 1: CANVAS STABILITY
 * 
 * Canvas estabilizado que resolve os problemas de:
 * - Conditional hooks
 * - Estado inconsistente
 * - Re-renders desnecessários
 * - Problemas de performance
 * 
 * ✅ Hooks estáveis sem condicionais
 * ✅ Memoização inteligente
 * ✅ Estado consistente
 * ✅ Performance otimizada
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { Block } from '@/types/editor';
import ScalableQuizRenderer from '@/components/core/ScalableQuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { useStepSelection } from '@/hooks/useStepSelection';

interface StabilizedCanvasProps {
  blocks: Block[];
  selectedBlock: Block | null;
  currentStep: number;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  onDeleteBlock: (blockId: string) => void;
  isPreviewMode: boolean;
  onStepChange?: (step: number) => void;
  className?: string;
}

/**
 * 🎨 STABILIZED CANVAS COMPONENT
 */
const StabilizedCanvas: React.FC<StabilizedCanvasProps> = ({
  blocks = [], // Default para evitar undefined
  selectedBlock,
  currentStep = 1, // Default
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  isPreviewMode = false, // Default
  onStepChange,
  className = ''
}) => {
  // 🔒 REFS ESTÁVEIS - Evitam re-criação desnecessária
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastStepRef = useRef<number>(currentStep);
  const renderCountRef = useRef<number>(0);

  // 📊 DEBUG TRACKING
  renderCountRef.current++;
  console.log(`🎨 StabilizedCanvas render #${renderCountRef.current}`, {
    currentStep,
    isPreviewMode,
    blocksCount: blocks.length,
    selectedBlockId: selectedBlock?.id
  });

  // 🎯 STABLE HOOKS - Sempre chamados, nunca condicionais
  const stepSelection = useStepSelection({
    stepNumber: currentStep,
    onSelectBlock,
    debounceMs: 50
  });

  // 🧠 MEMOIZED VALUES - Recalculados apenas quando necessário
  const canvasKey = useMemo(() => {
    return `stabilized-canvas-${currentStep}`;
  }, [currentStep]);

  const stabilizedBlocks = useMemo(() => {
    // Garantir que blocks é sempre um array válido
    if (!Array.isArray(blocks)) {
      console.warn('🚨 StabilizedCanvas: blocks não é um array válido', blocks);
      return [];
    }

    // Normalizar blocos para evitar problemas de renderização
    return blocks.map((block, index) => ({
      ...block,
      id: block.id || `block-${index}`,
      type: block.type || 'text',
      properties: block.properties || {},
      content: block.content || {},
      position: block.position || { x: 0, y: index * 100 }
    }));
  }, [blocks]);

  const selectedBlockId = useMemo(() => {
    return selectedBlock?.id || null;
  }, [selectedBlock?.id]);

  // 🔄 STABLE CALLBACKS - Evitam re-renders em cascata
  const handleBlockSelection = useCallback((blockId: string) => {
    console.log('🎯 StabilizedCanvas: Block selected:', blockId);
    stepSelection.handleBlockSelection(blockId);
  }, [stepSelection.handleBlockSelection]);

  const handleStepChange = useCallback((step: number, data?: any) => {
    console.log('📍 StabilizedCanvas: Step change:', step, data);
    if (onStepChange && step !== currentStep) {
      onStepChange(step);
    }
  }, [onStepChange, currentStep]);

  // ⚡ EFFECT PARA DETECÇÃO DE MUDANÇAS DE STEP
  useEffect(() => {
    if (lastStepRef.current !== currentStep) {
      console.log(`🔄 StabilizedCanvas: Step changed ${lastStepRef.current} → ${currentStep}`);
      lastStepRef.current = currentStep;
    }
  }, [currentStep]);

  // 🎨 PREVIEW MODE RENDERER
  const renderPreviewMode = useCallback(() => (
    <div className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate">
      <div className="h-full w-full overflow-y-auto relative z-0">
        <ScalableQuizRenderer
          funnelId="quiz21StepsComplete"
          mode="preview"
          debugMode={true}
          className="preview-mode-canvas w-full h-full"
          onStepChange={handleStepChange}
        />
      </div>
    </div>
  ), [handleStepChange]);

  // 🛠️ EDIT MODE RENDERER
  const renderEditMode = useCallback(() => (
    <div
      ref={canvasRef}
      key={canvasKey}
      className="flex-1 min-h-0 relative bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate"
    >
      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <CanvasDropZone
          blocks={stabilizedBlocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={handleBlockSelection}
          onUpdateBlock={onUpdateBlock}
          onDeleteBlock={onDeleteBlock}
          scopeId={currentStep}
        />
      </div>
    </div>
  ), [
    canvasKey,
    stabilizedBlocks,
    selectedBlockId,
    handleBlockSelection,
    onUpdateBlock,
    onDeleteBlock,
    currentStep
  ]);

  // 🎯 MAIN RENDER - Lógica simples e estável
  return (
    <div className={`stabilized-canvas-container ${className}`}>
      {isPreviewMode ? renderPreviewMode() : renderEditMode()}
    </div>
  );
};

/**
 * 🚀 OPTIMIZATION - Comparação inteligente para memo
 */
const arePropsEqual = (
  prevProps: StabilizedCanvasProps,
  nextProps: StabilizedCanvasProps
): boolean => {
  // 1. Comparações rápidas primeiro
  if (
    prevProps.currentStep !== nextProps.currentStep ||
    prevProps.isPreviewMode !== nextProps.isPreviewMode ||
    prevProps.className !== nextProps.className
  ) {
    return false;
  }

  // 2. Comparar selectedBlock
  if (prevProps.selectedBlock?.id !== nextProps.selectedBlock?.id) {
    return false;
  }

  // 3. Comparar blocks (shallow comparison para performance)
  if (prevProps.blocks.length !== nextProps.blocks.length) {
    return false;
  }

  // 4. Comparação inteligente de blocos (apenas propriedades críticas)
  for (let i = 0; i < prevProps.blocks.length; i++) {
    const prevBlock = prevProps.blocks[i];
    const nextBlock = nextProps.blocks[i];

    if (
      prevBlock.id !== nextBlock.id ||
      prevBlock.type !== nextBlock.type ||
      prevBlock.position !== nextBlock.position
    ) {
      return false;
    }

    // Comparar propriedades visuais críticas apenas
    const prevProps_block = prevBlock.properties || {};
    const nextProps_block = nextBlock.properties || {};
    
    const criticalProps = ['text', 'content', 'backgroundColor', 'visible'];
    for (const prop of criticalProps) {
      if (prevProps_block[prop] !== nextProps_block[prop]) {
        return false;
      }
    }
  }

  // 5. Comparar callbacks (referências podem mudar mas funcionalidade é a mesma)
  // Note: Não comparamos callbacks diretamente para evitar re-renders desnecessários
  // A estabilidade é garantida pelos useCallback no componente pai

  return true; // Props são equivalentes
};

StabilizedCanvas.displayName = 'StabilizedCanvas';

export default memo(StabilizedCanvas, arePropsEqual);
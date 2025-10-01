import React, { memo, useMemo, useRef } from 'react';
import { Block } from '@/types/editor';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { isEditorCoreV2Enabled } from '@/utils/editorFeatureFlags';
import { useCoreStepDiff } from '@/context/useCoreStepDiff';
import { globalBlockElementCache } from '@/utils/BlockElementCache';
import { useStepSelection } from '@/hooks/useStepSelection';
import { UnifiedPreviewEngine } from '@/components/editor/unified/UnifiedPreviewEngine'; // Import para experiência real

/**
 * 🎨 CANVAS DO EDITOR OTIMIZADO
 * 
 * Agora usa UnifiedPreviewEngine para preview em tempo real!
 */

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlock: Block | null;
  currentStep: number;
  funnelId?: string; // ID do funil sendo editado
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
  funnelId,
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
    // 🎯 PREVIEW EM TEMPO REAL - Usar UnifiedPreviewEngine com dados dinâmicos
    return (
      <div data-testid="preview-container" className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate">
        <div className="h-full w-full overflow-y-auto relative z-0">
          {/* 🚀 PREVIEW EM TEMPO REAL - Reflete mudanças instantaneamente */}
          <UnifiedPreviewEngine
            blocks={blocks}
            selectedBlockId={selectedBlock?.id}
            isPreviewing={true}
            viewportSize="desktop"
            onBlockSelect={onSelectBlock}
            onBlockUpdate={onUpdateBlock}
            onBlocksReordered={() => { }}
            funnelId={funnelId || 'quiz21StepsComplete'}
            currentStep={currentStep}
            enableInteractions={false} // Preview mode - sem interações
            mode="preview"
            enableProductionMode={false}
            realTimeUpdate={true} // 🎯 NOVA PROP: Habilita atualização em tempo real
            debugInfo={{
              showDebugPanel: false, // 🎯 DEBUG DESABILITADO
              stepData: false,
              blockInfo: false,
              templateInfo: false
            }}
          />
        </div>
      </div>
    );
  }

  // 🎯 NOVA FUNCIONALIDADE: Experiência Real com QuizOrchestrator
  if (realExperienceMode) {
    const realFunnelId = funnelId || 'quiz21StepsComplete';
    console.log(`🎯 [DEBUG] EditorCanvas renderizando em modo Real Experience [${realFunnelId}]`);

    return (
      <div className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate">
        <div className="h-full w-full overflow-y-auto relative z-0">
          {/* Indicador visual de modo real ativo com funil */}
          <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            🎯 REAL: {realFunnelId}
          </div>

          <UnifiedPreviewEngine
            blocks={blocks}
            selectedBlockId={selectedBlock?.id}
            isPreviewing={false}
            viewportSize="desktop"
            onBlockSelect={onSelectBlock}
            onBlockUpdate={onUpdateBlock}
            onBlocksReordered={() => { }}
            funnelId={realFunnelId}
            currentStep={currentStep}
            enableInteractions={true}
            mode="editor"
            enableProductionMode={realExperienceMode} // 🎯 CORREÇÃO: Usar realExperienceMode diretamente
          />
        </div>
      </div>
    );
  }

  const coreV2 = isEditorCoreV2Enabled();
  const diff = coreV2 ? useCoreStepDiff(currentStep) : null;
  const renderVersionRef = useRef(0);

  const effectiveBlocks = useMemo(() => {
    if (!coreV2 || !diff) return blocks;
    // Invalidar cache dos removidos ou atualizados
    if (diff.removed.length || diff.updated.length) {
      globalBlockElementCache.bulkInvalidate([
        ...diff.removed.map(b => b.id),
        ...diff.updated.map(u => u.after.id)
      ]);
    }
    // Apenas retornar blocks atuais; criação de elementos fica para CanvasDropZone que já cria dinamicamente
    return blocks;
  }, [blocks, coreV2, diff]);

  if (coreV2 && diff && (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true') {
    // Log de estatísticas de cache
    const stats = globalBlockElementCache.stats();
    console.log('[EditorCanvas][Cache]', {
      step: currentStep,
      cacheSize: stats.size,
      versions: stats.versions.slice(0, 5),
      diff: {
        added: diff.added.length,
        removed: diff.removed.length,
        updated: diff.updated.length,
        stable: diff.stable.length
      }
    });
  }

  return (
      <div
        key={canvasKey}
        data-testid="canvas-editor"
        className="flex-1 min-h-0 relative bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate"
      >
        <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <CanvasDropZone
            blocks={effectiveBlocks}
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
    prevProps.realExperienceMode !== nextProps.realExperienceMode ||
    prevProps.funnelId !== nextProps.funnelId) { // Incluir funnelId na comparação
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
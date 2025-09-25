/**
 * 🎯 UNIFIED PREVIEW ENGINE - Arquitetura Consolidada
 * Unifica os diferentes engines de preview em um só componente
 * Substitui PreviewEngine, StandardPreviewEngine e ProductionPreviewEngine
 */

import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Block } from '@/types/editor';

interface UnifiedPreviewEngineProps {
  blocks: Block[];
  selectedBlockId?: string | null;
  isPreviewing?: boolean;
  viewportSize?: 'mobile' | 'tablet' | 'desktop';
  primaryStyle?: StyleResult;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: any) => void;
  onBlocksReordered?: (blocks: Block[]) => void;
  funnelId?: string;
  currentStep?: number;
  enableInteractions?: boolean;
  mode?: 'editor' | 'production' | 'preview';
  enableProductionMode?: boolean;
}

export type { UnifiedPreviewEngineProps };

/**
 * Unified Preview Engine - Agora usa InteractivePreviewEngine com QuizOrchestrator
 * Experiência real do usuário final no canvas do editor
 */
export const UnifiedPreviewEngine: React.FC<UnifiedPreviewEngineProps> = ({
  blocks = [],
  selectedBlockId,
  isPreviewing = false,
  viewportSize = 'desktop',
  primaryStyle,
  onBlockSelect,
  onBlockUpdate,
  onBlocksReordered,
  funnelId = 'quiz21StepsComplete',
  currentStep = 1,
  enableInteractions = true,
  mode = 'preview',
  enableProductionMode = false,
}) => {
  // Import dinâmico do InteractivePreviewEngine
  const InteractivePreviewEngine = React.lazy(() => 
    import('./InteractivePreviewEngine').then(mod => ({ default: mod.InteractivePreviewEngine }))
  );

  // Determinar o modo final (usando a variável mode)
  const finalMode = enableProductionMode ? 'production' : (mode === 'production' ? 'production' : (isPreviewing ? 'preview' : 'editor'));

  // Habilitar experiência real quando em modo preview ou production
  const enableRealExperience = finalMode === 'preview' || finalMode === 'production';

  return (
    <div className="unified-preview-engine">
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-3 text-stone-600">Carregando preview engine com QuizOrchestrator...</span>
        </div>
      }>
        <InteractivePreviewEngine
          blocks={blocks}
          selectedBlockId={selectedBlockId || undefined}
          isPreviewing={isPreviewing}
          viewportSize={viewportSize}
          primaryStyle={primaryStyle}
          onBlockSelect={onBlockSelect}
          onBlockUpdate={onBlockUpdate}
          onBlocksReordered={onBlocksReordered}
          funnelId={funnelId}
          currentStep={currentStep}
          enableInteractions={enableInteractions}
          mode={finalMode}
          enableRealExperience={enableRealExperience}
          className="w-full"
        />
      </React.Suspense>
    </div>
  );
};

export default UnifiedPreviewEngine;
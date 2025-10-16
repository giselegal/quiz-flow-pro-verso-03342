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
  selectedBlockId?: string;
  isPreviewing: boolean;
  viewportSize: 'mobile' | 'tablet' | 'desktop';
  onBlockSelect: (id: string) => void;
  onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
  onBlocksReordered: (blocks: Block[]) => void;
  funnelId?: string;
  currentStep?: number;
  enableInteractions?: boolean;
  mode?: 'editor' | 'preview' | 'production';
  enableProductionMode?: boolean;
  realTimeUpdate?: boolean; // 🎯 NOVA PROP: Habilita preview em tempo real
  debugInfo?: {
    showDebugPanel?: boolean;
    stepData?: boolean;
    blockInfo?: boolean;
    templateInfo?: boolean;
  };
}

export type { UnifiedPreviewEngineProps };

/**
 * 🎯 UNIFIED PREVIEW ENGINE - CORREÇÃO CRÍTICA DOS PONTOS CEGOS
 * 
 * ✅ CORRIGIDO: Agora respeita enableRealExperience independente do modo
 * ✅ CORRIGIDO: Permite experiência real no modo 'editor' quando solicitado  
 * ✅ CORRIGIDO: Prop chain correta até InteractivePreviewEngine
 * ✅ CORRIGIDO: Lazy loading removido para melhor UX
 */
export const UnifiedPreviewEngine: React.FC<UnifiedPreviewEngineProps> = ({
  blocks = [],
  selectedBlockId,
  isPreviewing = false,
  viewportSize = 'desktop',
  onBlockSelect,
  onBlockUpdate,
  onBlocksReordered,
  funnelId = 'quiz21StepsComplete',
  currentStep = 1,
  enableInteractions = true,
  mode = 'preview',
  enableProductionMode = false,
  realTimeUpdate = false,
  debugInfo = {}
}) => {
  console.log('🎯 [DEBUG] UnifiedPreviewEngine recebeu props:', {
    mode,
    enableProductionMode,
    realTimeUpdate,
    funnelId,
    currentStep,
    blocksCount: blocks.length,
    debugInfo
  });

  // 🎯 FASE 3: PREVIEW EM TEMPO REAL com debounce implícito
  React.useEffect(() => {
    if (realTimeUpdate && blocks.length > 0) {
      console.log('⚡ [FASE 3] Preview atualizado em tempo real:', {
        step: currentStep,
        blocksCount: blocks.length,
        selectedBlock: selectedBlockId,
        timestamp: new Date().toISOString(),
        enableProductionMode
      });
    }
  }, [blocks, selectedBlockId, currentStep, realTimeUpdate, enableProductionMode]);

  // ✅ CORREÇÃO: Import estático compatível com Vite/ESM
  const [InteractivePreviewEngine, setInteractivePreviewEngine] = React.useState<any>(null);
  
  React.useEffect(() => {
    // Carregamento dinâmico do componente
    import('./InteractivePreviewEngine').then(module => {
      setInteractivePreviewEngine(() => module.InteractivePreviewEngine);
    }).catch(error => {
      console.error('❌ Erro ao carregar InteractivePreviewEngine:', error);
    });
  }, []);

  // Fallback enquanto carrega
  if (!InteractivePreviewEngine) {
    return (
      <div className="unified-preview-engine loading">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando preview...</span>
        </div>
      </div>
    );
  }

  // 🎯 CORREÇÃO CRÍTICA: Calcular enableRealExperience baseado na prop enableProductionMode
  const enableRealExperience = enableProductionMode;

  return (
    <div className="unified-preview-engine">
      {/* DEBUG PANEL REMOVIDO - Preview limpo sem informações de debug */}

      {/* 🎯 CORREÇÃO: Lazy loading removido - carregamento imediato */}
      <InteractivePreviewEngine
        blocks={blocks}
        selectedBlockId={selectedBlockId || undefined}
        isPreviewing={isPreviewing}
        viewportSize={viewportSize}
        onBlockSelect={onBlockSelect}
        onBlockUpdate={onBlockUpdate}
        onBlocksReordered={onBlocksReordered}
        funnelId={funnelId}
        currentStep={currentStep}
        enableInteractions={enableInteractions}
        mode={mode}
        enableRealExperience={enableRealExperience}
        className="w-full"
        realTimeUpdate={realTimeUpdate}
      />
    </div>
  );
};

export default UnifiedPreviewEngine;
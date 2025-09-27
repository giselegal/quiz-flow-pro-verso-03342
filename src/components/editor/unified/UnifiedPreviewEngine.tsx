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

  // 🎯 PREVIEW EM TEMPO REAL - Effect para reagir a mudanças nos blocos
  React.useEffect(() => {
    if (realTimeUpdate && blocks.length > 0) {
      console.log('⚡ Preview atualizado em tempo real - Blocos alterados:', {
        step: currentStep,
        blocksCount: blocks.length,
        selectedBlock: selectedBlockId,
        timestamp: new Date().toISOString()
      });
    }
  }, [blocks, selectedBlockId, currentStep, realTimeUpdate]);

  // Import direto (lazy loading removido para melhor UX)
  const { InteractivePreviewEngine } = require('./InteractivePreviewEngine');

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
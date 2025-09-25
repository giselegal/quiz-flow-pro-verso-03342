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
  console.log('🎯 [DEBUG] UnifiedPreviewEngine recebeu props:', {
    mode,
    enableProductionMode,
    funnelId,
    currentStep,
    blocksCount: blocks.length
  });

  // Import direto (lazy loading removido para melhor UX)
  const { InteractivePreviewEngine } = require('./InteractivePreviewEngine');

  // 🎯 CORREÇÃO CRÍTICA: Calcular enableRealExperience baseado na prop enableProductionMode
  const enableRealExperience = enableProductionMode;
  
  console.log('🎯 [DEBUG] UnifiedPreviewEngine calculou enableRealExperience:', enableRealExperience);

  return (
    <div className="unified-preview-engine">
      {/* 🎯 CORREÇÃO: Lazy loading removido - carregamento imediato */}
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
        mode={mode}
        enableRealExperience={enableRealExperience}
        className="w-full"
      />
    </div>
  );
};

export default UnifiedPreviewEngine;
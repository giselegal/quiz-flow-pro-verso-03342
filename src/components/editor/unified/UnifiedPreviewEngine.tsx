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

  console.log('🎯 [DEBUG] UnifiedPreviewEngine calculou enableRealExperience:', enableRealExperience);

  return (
    <div className="unified-preview-engine">
      {/* 🎯 DEBUG PANEL - Apenas em modo preview com realTimeUpdate */}
      {mode === 'preview' && realTimeUpdate && debugInfo.showDebugPanel && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 mb-4 rounded-lg text-xs">
          <div className="font-semibold text-yellow-800 mb-2">
            🔧 Preview Real-Time - Sistema Dinâmico ON
          </div>
          <div className="grid grid-cols-2 gap-2 text-yellow-700">
            <div><strong>Funil Original:</strong> {funnelId}</div>
            <div><strong>Step:</strong> {currentStep}</div>
            <div><strong>Blocos Carregados:</strong> {blocks.length > 0 ? '✅' : '❌'}</div>
            <div><strong>Seleção Ativa:</strong> {selectedBlockId ? '✅' : '❌'}</div>
            <div><strong>Update em Tempo Real:</strong> {realTimeUpdate ? '✅' : '❌'}</div>
            <div><strong>Modo:</strong> {mode}</div>
          </div>
          {debugInfo.blockInfo && blocks.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-yellow-800 font-medium">
                Blocos Atuais ({blocks.length})
              </summary>
              <div className="mt-1 p-2 bg-yellow-100 rounded text-yellow-900 max-h-32 overflow-auto">
                {blocks.map((block, index) => (
                  <div key={block.id} className="text-xs">
                    {index + 1}. {block.type} - {block.id} {selectedBlockId === block.id ? '🎯' : ''}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

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
/**
 * 🎯 STEP 20 UNIFIED RENDERER - CORREÇÃO CRÍTICA PARA /EDITOR
 * 
 * OBJETIVO: Unificar a renderização da Etapa 20 no contexto do editor
 * - Consolida CaktoQuizResult, Step20Result e Step20EditorFallback
 * - Detecção inteligente de blocos result-related
 * - Cache otimizado para performance
 * - Logs específicos para debug do editor
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { Block } from '@/types/editor';
import Step20Result from '@/components/steps/Step20Result';
import { Step20EditorFallback } from '@/components/editor/fallback/Step20EditorFallback';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { logger } from '@/utils/debugLogger';

interface Step20UnifiedRendererProps {
  blocks?: Block[];
  selectedBlockId?: string | null;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onBlockDelete?: (blockId: string) => void;
  isPreview?: boolean;
  className?: string;
}

/**
 * 🎯 RENDERIZADOR UNIFICADO DA ETAPA 20
 * 
 * Fluxo de decisão:
 * 1. Verificar se há blocos result-related válidos
 * 2. Verificar se o cálculo do resultado está disponível
 * 3. Decidir entre renderização normal ou fallback
 * 4. Aplicar otimizações de performance
 */
export const Step20UnifiedRenderer: React.FC<Step20UnifiedRendererProps> = ({
  blocks = [],
  selectedBlockId,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  isPreview = false,
  className = '',
}) => {
  const { primaryStyle, isLoading, error } = useQuizResult();
  const [renderStrategy, setRenderStrategy] = useState<'blocks' | 'fallback' | 'step20-direct'>('blocks');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Cache para evitar re-análises desnecessárias
  const blocksAnalysis = useMemo(() => {
    const resultBlocks = blocks.filter(block => 
      block.type === 'result-header-inline' || 
      (block.type as string) === 'quiz-result' ||
      (block.type as string) === 'cakto-quiz-result' ||
      block.id?.includes('result') ||
      block.properties?.category === 'result'
    );

    const hasValidResultBlocks = resultBlocks.length > 0;
    const totalBlocks = blocks.length;
    
    logger.debug('🔍 [Step20UnifiedRenderer] Análise de blocos:', {
      totalBlocks,
      resultBlocks: resultBlocks.length,
      resultBlockTypes: resultBlocks.map(b => b.type),
      resultBlockIds: resultBlocks.map(b => b.id),
      hasValidResultBlocks
    });

    return {
      resultBlocks,
      hasValidResultBlocks,
      totalBlocks,
      isEmpty: totalBlocks === 0
    };
  }, [blocks]);

  // Análise da estratégia de renderização
  const determineRenderStrategy = useCallback(() => {
    const { hasValidResultBlocks, isEmpty } = blocksAnalysis;
    const hasValidResult = Boolean(primaryStyle) && !error;
    const isStillLoading = isLoading;

    logger.info('🎯 [Step20UnifiedRenderer] Determinando estratégia:', {
      hasValidResultBlocks,
      hasValidResult,
      isStillLoading,
      isEmpty,
      blocksCount: blocks.length,
      primaryStyle: primaryStyle?.style || 'nenhum',
      error: error ? 'presente' : 'ausente'
    });

    // Estratégia 1: Renderização direta Step20Result (melhor UX)
    if (hasValidResult && !isStillLoading) {
      logger.info('✅ [Step20UnifiedRenderer] Estratégia: Step20Result direto');
      return 'step20-direct';
    }

    // Estratégia 2: Renderização normal de blocos (se houver blocos válidos)
    if (hasValidResultBlocks && !isEmpty) {
      logger.info('✅ [Step20UnifiedRenderer] Estratégia: Blocos normais');
      return 'blocks';
    }

    // Estratégia 3: Fallback robusto
    logger.warn('⚠️ [Step20UnifiedRenderer] Estratégia: Fallback ativo');
    return 'fallback';
  }, [blocksAnalysis, primaryStyle, error, isLoading, blocks.length]);

  // Efeito para atualizar estratégia
  useEffect(() => {
    const strategy = determineRenderStrategy();
    setRenderStrategy(strategy);
    setAnalysisComplete(true);
  }, [determineRenderStrategy]);

  // Loading state durante análise
  if (!analysisComplete) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Analisando estratégia de renderização...</p>
        </div>
      </div>
    );
  }

  // Renderização baseada na estratégia determinada
  switch (renderStrategy) {
    case 'step20-direct':
      logger.info('🎨 [Step20UnifiedRenderer] Renderizando Step20Result direto');
      return (
        <div className={`step20-unified-direct ${className}`}>
          {/* Badge de debug em desenvolvimento */}
          {import.meta.env.DEV && (
            <div className="bg-green-100 border border-green-300 rounded p-2 mb-4 text-xs">
              🎯 Step20UnifiedRenderer: Renderização direta (resultado calculado)
            </div>
          )}
          <Step20Result isPreview={isPreview} />
        </div>
      );

    case 'blocks':
      logger.info('🧩 [Step20UnifiedRenderer] Renderizando blocos normais');
      return (
        <div className={`step20-unified-blocks ${className}`}>
          {/* Badge de debug em desenvolvimento */}
          {import.meta.env.DEV && (
            <div className="bg-blue-100 border border-blue-300 rounded p-2 mb-4 text-xs">
              🧩 Step20UnifiedRenderer: Renderização de blocos ({blocksAnalysis.resultBlocks.length} blocos result)
            </div>
          )}
          
          <div className="space-y-4">
            {blocks.map(block => (
              <UniversalBlockRenderer
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onClick={() => onBlockSelect?.(block.id)}
                onPropertyChange={onBlockUpdate ? (key, value) => onBlockUpdate(block.id, { properties: { ...block.properties, [key]: value } }) : undefined}
                mode={isPreview ? 'preview' : 'editor'}
              />
            ))}
          </div>
        </div>
      );

    case 'fallback':
    default:
      logger.warn('🛡️ [Step20UnifiedRenderer] Ativando fallback');
      return (
        <div className={`step20-unified-fallback ${className}`}>
          {/* Badge de debug em desenvolvimento */}
          {import.meta.env.DEV && (
            <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-4 text-xs">
              🛡️ Step20UnifiedRenderer: Modo fallback ativo
            </div>
          )}
          
          <Step20EditorFallback
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onBlockSelect}
            onUpdateBlock={onBlockUpdate}
            onDeleteBlock={onBlockDelete}
          />
        </div>
      );
  }
};

export default Step20UnifiedRenderer;
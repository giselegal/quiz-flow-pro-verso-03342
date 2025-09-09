// @ts-nocheck
import React from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import Step20UnifiedRenderer from '@/components/editor/Step20UnifiedRenderer';
import { logger } from '@/utils/debugLogger';

/**
 * 🎯 CAKTO QUIZ RESULT - RENDERIZADOR UNIFICADO
 * 
 * CORREÇÃO CRÍTICA FASE 2:
 * - Agora usa Step20UnifiedRenderer para melhor detecção
 * - Sistema inteligente de fallback
 * - Performance otimizada
 * - Logs específicos para debug do editor
 */

interface CaktoQuizResultProps {
  className?: string;
  isPreview?: boolean;
  blocks?: any[];
  selectedBlockId?: string | null;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: any) => void;
  onBlockDelete?: (blockId: string) => void;
}

const CaktoQuizResult: React.FC<CaktoQuizResultProps> = ({
  blocks = [],
  isPreview = false,
  ...props
}) => {
  const { primaryStyle, isLoading, error } = useQuizResult();

  // Log específico para debugging no editor
  React.useEffect(() => {
    logger.info('🎯 [CaktoQuizResult] Estado no editor:', {
      hasResult: Boolean(primaryStyle),
      isLoading,
      error: error ? 'presente' : 'ausente',
      blocksCount: blocks.length,
      isPreview,
      context: 'editor'
    });
  }, [primaryStyle, isLoading, error, blocks.length, isPreview]);

  // Usar o renderizador unificado para melhor controle
  return (
    <Step20UnifiedRenderer
      blocks={blocks}
      isPreview={isPreview}
      {...props}
    />
  );
};

export default CaktoQuizResult;
/**
 * 🎯 TK-CANVAS-02: PREVIEW BLOCK
 * 
 * Componente especializado APENAS para modo preview (readonly).
 * - NUNCA mostra controles de edição
 * - Props readonly
 * - Conectado com PreviewProvider (sessionData)
 * - Representa fidelidade 100% com produção
 * - Funciona FORA de EditorProvider
 */

import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/enhancedBlockRegistry';
import { useLogger } from '@/utils/logger/SmartLogger';
import { shallowEqual, MemoizationMetrics } from '@/utils/performance/memoization';

export interface PreviewBlockProps {
  block: Block;
  sessionData?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hook para resolver componente de bloco
 */
const useBlockComponent = (blockType: string): React.ComponentType<any> | null => {
  const logger = useLogger('PreviewBlock');

  return useMemo(() => {
    const component = getEnhancedBlockComponent(blockType);
    
    if (!component) {
      logger.warn(`Componente não encontrado para tipo: ${blockType}`);
    }
    
    return component as React.ComponentType<any> | null;
  }, [blockType, logger]);
};

/**
 * 🎯 PREVIEW BLOCK COMPONENT
 * Componente focado 100% em preview readonly
 */
export const PreviewBlock: React.FC<PreviewBlockProps> = memo(({
  block,
  sessionData,
  className,
  style,
}) => {
  const logger = useLogger('PreviewBlock');
  const BlockComponent = useBlockComponent(block.type);

  // Log de render e métricas (apenas em dev)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      MemoizationMetrics.recordRender('PreviewBlock');
      logger.render(`PreviewBlock[${block.type}]`, {
        blockId: block.id,
        hasComponent: !!BlockComponent,
        hasSessionData: !!sessionData
      });
    }
  }, [block.type, block.id, BlockComponent, sessionData, logger]);

  if (!BlockComponent) {
    return (
      <div
        className={cn(
          "p-4 border border-gray-200 bg-gray-50 rounded",
          className
        )}
        style={style}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <div className="text-sm text-gray-600">
          Componente não disponível: {block.type}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'preview-block',
        className
      )}
      style={style}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* 🎯 RENDERIZAÇÃO READONLY - Sem handlers de edição */}
      <BlockComponent
        block={block}
        readonly={true}
        sessionData={sessionData}
        isPreviewing={true}
      />
    </div>
  );
}, (prev, next) => {
  // 🎯 TK-CANVAS-07: Memoização agressiva otimizada
  // Preview muda menos, então podemos ser mais agressivos
  
  // IDs diferentes = sempre re-render
  if (prev.block.id !== next.block.id) return false;
  if (prev.block.type !== next.block.type) return false;
  
  // Usar shallow comparison (mais rápido que JSON.stringify)
  const contentEqual = shallowEqual(prev.block.content, next.block.content);
  const sessionEqual = shallowEqual(prev.sessionData, next.sessionData);
  
  const areEqual = contentEqual && sessionEqual;
  
  if (areEqual && process.env.NODE_ENV === 'development') {
    MemoizationMetrics.recordMemoHit('PreviewBlock');
  }
  
  return areEqual;
});

PreviewBlock.displayName = 'PreviewBlock';

export default PreviewBlock;

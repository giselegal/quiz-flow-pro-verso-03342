import React, { Suspense } from 'react';
import { getOptimizedBlockComponent } from '@/utils/optimizedRegistry';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { ProductionBlockBoundary, SimpleBlockFallback } from '../editor/blocks/ProductionBlockBoundary';

export interface ConsolidatedBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * CONSOLIDATED BLOCK RENDERER - Sistema Unificado de Renderização de Blocos
 * ✅ Usa o ENHANCED_BLOCK_REGISTRY único
 * ✅ Suporte completo a Container Properties
 * ✅ Performance otimizada com lazy loading
 * ✅ Sistema de fallback robusto
 * ✅ Margens universais com Tailwind
 */

// Sistema universal de margens Tailwind
const getMarginClass = (
  value: number | string,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  if (!numValue || isNaN(numValue) || numValue === 0) return '';
  
  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';
  
  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-12`; // Máximo
  }
  
  // Margens positivas
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 128) return `${prefix}-32`;
  return `${prefix}-40`; // Máximo suportado
};

const ConsolidatedBlockRenderer: React.FC<ConsolidatedBlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
}) => {
  // Buscar componente no registry consolidado
  const Component = getOptimizedBlockComponent(block.type);

  // Processar propriedades de container usando o hook
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    block.properties
  );

  // Fallback para componentes não encontrados
  if (!Component) {
    return (
      <SimpleBlockFallback
        blockType={block.type}
        blockId={block.id}
        message={`Componente '${block.type}' não encontrado no registry consolidado`}
      />
    );
  }

  try {
    return (
      <ProductionBlockBoundary blockType={block.type} blockId={block.id}>
        <div
          className={cn(
            'consolidated-block-wrapper transition-all duration-200',
            containerClasses,
            // Sistema universal de margens
            getMarginClass(block.properties?.marginTop ?? 0, 'top'),
            getMarginClass(block.properties?.marginBottom ?? 0, 'bottom'),
            getMarginClass(block.properties?.marginLeft ?? 0, 'left'),
            getMarginClass(block.properties?.marginRight ?? 0, 'right'),
            isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          )}
          onClick={onClick}
          style={inlineStyles}
          data-block-type={block.type}
          data-block-id={block.id}
        >
          <Suspense 
            fallback={
              <div className="animate-pulse bg-muted h-16 rounded-md flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Carregando {block.type}...</span>
              </div>
            }
          >
            <Component
              block={block}
              properties={processedProperties}
              isSelected={isSelected}
              onClick={onClick}
              onPropertyChange={onPropertyChange}
              {...processedProperties}
            />
          </Suspense>
        </div>
      </ProductionBlockBoundary>
    );
  } catch (error) {
    console.error(`🚨 Erro crítico ao renderizar bloco ${block.type}:`, error);
    
    return (
      <SimpleBlockFallback
        blockType={block.type}
        blockId={block.id}
        message={error instanceof Error ? error.message : 'Erro de renderização crítico'}
      />
    );
  }
};

export default ConsolidatedBlockRenderer;
import React from 'react';
import { getOptimizedBlockComponent } from '@/utils/optimizedRegistry';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { ProductionBlockBoundary, SimpleBlockFallback } from './ProductionBlockBoundary';

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * UNIVERSAL BLOCK RENDERER - VERSÃO COM SUPORTE A CONTAINER PROPERTIES
 * ✅ Usa o novo ENHANCED_BLOCK_REGISTRY
 * ✅ Compatível com DynamicStepTemplate
 * ✅ Processa propriedades de container usando useContainerProperties hook
 * ✅ Sem dependências quebradas
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
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
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
}) => {
  // ✅ Buscar componente otimizado com cache
  const Component = getOptimizedBlockComponent(block.type);

  // Processar propriedades de container usando o hook
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    block.properties
  );

  // Log para debug das propriedades de container (apenas em desenvolvimento)
  if (
    process.env.NODE_ENV === 'development' &&
    (block.properties?.containerWidth || block.properties?.containerPosition)
  ) {
    console.log(`🎯 Container properties for ${block.id}:`, {
      blockType: block.type,
      originalProperties: block.properties,
      processedProperties,
      generatedClasses: containerClasses,
    });
  }

  if (!Component) {
    // Fallback mais robusto para componentes não encontrados
    return (
      <SimpleBlockFallback
        blockType={block.type}
        blockId={block.id}
        message={`Componente '${block.type}' não foi encontrado no registry`}
      />
    );
  }

  try {
    return (
      <ProductionBlockBoundary blockType={block.type} blockId={block.id}>
        <div
          className={cn(
            'block-wrapper transition-all duration-200',
            containerClasses,
            // Margens universais com controles deslizantes
            getMarginClass(block.properties?.marginTop ?? 0, 'top'),
            getMarginClass(block.properties?.marginBottom ?? 0, 'bottom'),
            getMarginClass(block.properties?.marginLeft ?? 0, 'left'),
            getMarginClass(block.properties?.marginRight ?? 0, 'right'),
            isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2'
          )}
          onClick={onClick}
          style={inlineStyles}
        >
          <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-16 rounded" />}>
            <Component
              block={block}
              properties={processedProperties}
              isSelected={isSelected}
              onClick={onClick}
              onPropertyChange={onPropertyChange}
              {...processedProperties}
            />
          </React.Suspense>
        </div>
      </ProductionBlockBoundary>
    );
  } catch (error) {
    console.error(`Erro crítico ao renderizar bloco ${block.type}:`, error);

    return (
      <SimpleBlockFallback
        blockType={block.type}
        blockId={block.id}
        message={error instanceof Error ? error.message : 'Erro de renderização crítico'}
      />
    );
  }
};

export default UniversalBlockRenderer;

import React from 'react';
import { ENHANCED_BLOCK_REGISTRY } from '@/components/editor/blocks/enhancedBlockRegistry';
import VisualBlockFallback from '@/components/core/renderers/VisualBlockFallback';

/**
 * Registry otimizado para busca rápida de componentes
 */

/**
 * Buscar componente otimizado no registry
 */
export const getOptimizedBlockComponent = (type: string): React.ComponentType<any> => {
  // Buscar no registry principal
  const component = ENHANCED_BLOCK_REGISTRY[type as keyof typeof ENHANCED_BLOCK_REGISTRY];

  if (component) {
    console.log(`✅ Componente encontrado: ${type}`);
    return component;
  }

  // Log para debug
  console.warn(`⚠️ Componente não encontrado: ${type}`);
  console.log('Componentes disponíveis:', Object.keys(ENHANCED_BLOCK_REGISTRY));

  // Retornar fallback visual melhorado
  const FallbackComponent: React.ComponentType<any> = ({ block }) => {
    return React.createElement(VisualBlockFallback, {
      blockType: type,
      blockId: block?.id || 'unknown',
      block: block,
      message: `Componente '${type}' não foi encontrado no registry`,
      showDetails: true,
    });
  };

  return FallbackComponent;
};

/**
 * Verificar se componente existe
 */
export const hasOptimizedBlockComponent = (type: string): boolean => {
  return type in ENHANCED_BLOCK_REGISTRY;
};

/**
 * Listar todos os componentes disponíveis
 */
export const getAvailableOptimizedComponents = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

/**
 * Estatísticas do registry otimizado
 */
export const getOptimizedRegistryStats = () => {
  const totalComponents = Object.keys(ENHANCED_BLOCK_REGISTRY).length;

  return {
    totalComponents,
    components: Object.keys(ENHANCED_BLOCK_REGISTRY),
    hasFallback: true,
  };
};

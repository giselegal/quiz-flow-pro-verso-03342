/**
 * OPTIMIZED REGISTRY WRAPPER - Wrapper otimizado para o Enhanced Block Registry
 * ✅ Cache de componentes para melhor performance
 * ✅ Logs controlados
 * ✅ Fallback inteligente
 */

import React from 'react';
import { perfLogger } from '@/utils/performanceLogger';
import { getBlockComponent as originalGetBlockComponent } from '@/config/enhancedBlockRegistry';

// Cache de componentes para evitar re-lookups
const componentCache = new Map<string, React.ComponentType<any>>();
const failureCache = new Set<string>();

/**
 * Wrapper otimizado do getBlockComponent com cache e logs controlados
 */
// Fallback component for missing types
const FallbackComponent: React.ComponentType<any> = () => 
  React.createElement('div', 
    { className: "p-4 border border-dashed border-gray-300 rounded text-center text-gray-500" },
    'Component not found'
  );

export const getOptimizedBlockComponent = (type: string): React.ComponentType<any> => {
  if (!type) {
    perfLogger.warn('Block type not provided, using fallback');
    return FallbackComponent;
  }

  // Cache hit - melhor performance
  if (componentCache.has(type)) {
    return componentCache.get(type)!;
  }

  // Se já sabemos que falha, não tenta novamente
  if (failureCache.has(type)) {
    perfLogger.debug(`Using cached failure for type: ${type}`);
    return FallbackComponent;
  }

  perfLogger.startMeasure(`get-component-${type}`);
  
  try {
    const component = originalGetBlockComponent(type);
    
    if (!component) {
      failureCache.add(type);
      perfLogger.endMeasure(`get-component-${type}`);
      return FallbackComponent;
    }
    
    // Cache o resultado para próximas chamadas
    componentCache.set(type, component);
    
    perfLogger.endMeasure(`get-component-${type}`);
    perfLogger.debug(`Component cached: ${type}`);
    
    return component;
  } catch (error) {
    perfLogger.error(`Failed to get component for type: ${type}`, error);
    
    // Cache a falha para evitar tentativas repetidas
    failureCache.add(type);
    
    perfLogger.endMeasure(`get-component-${type}`);
    
    return FallbackComponent;
  }
};

/**
 * Limpa o cache de componentes (útil em desenvolvimento)
 */
export const clearComponentCache = () => {
  componentCache.clear();
  failureCache.clear();
  perfLogger.info('Component cache cleared');
};

/**
 * Estatísticas do cache para debugging
 */
export const getCacheStats = () => {
  return {
    cached: componentCache.size,
    failures: failureCache.size,
    hitRate: componentCache.size / (componentCache.size + failureCache.size) || 0
  };
};

// Exportar o getBlockComponent otimizado como padrão
export { getOptimizedBlockComponent as getBlockComponent };

export default getOptimizedBlockComponent;
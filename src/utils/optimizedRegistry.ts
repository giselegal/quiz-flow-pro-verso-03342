/**
 * OPTIMIZED REGISTRY WRAPPER - Wrapper otimizado para o Enhanced Block Registry
 * ✅ Cache de componentes para melhor performance
 * ✅ Logs controlados
 * ✅ Fallback inteligente
 */

import { perfLogger } from '@/utils/performanceLogger';
import { getBlockComponent as originalGetBlockComponent } from '@/config/enhancedBlockRegistry';
import React from 'react';

// Fallback component para casos de erro
const FallbackComponent: React.FC<any> = ({ type, ...props }) => {
  return React.createElement('div', { 
    className: "p-4 border-2 border-dashed border-gray-300 rounded bg-gray-50" 
  }, [
    React.createElement('h4', { 
      key: 'title',
      className: "font-medium text-gray-600 mb-2" 
    }, `Componente não encontrado: ${type || 'unknown'}`),
    React.createElement('pre', { 
      key: 'props',
      className: "text-xs text-gray-500 overflow-auto" 
    }, JSON.stringify(props, null, 2))
  ]);
};

// Cache de componentes para evitar re-lookups
const componentCache = new Map<string, React.ComponentType<any>>();
const failureCache = new Set<string>();

/**
 * Wrapper otimizado do getBlockComponent com cache e logs controlados
 */
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
      // Cache a falha e retorna fallback
      failureCache.add(type);
      perfLogger.endMeasure(`get-component-${type}`);
      perfLogger.debug(`Component not found, using fallback: ${type}`);
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
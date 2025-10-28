/**
 * 🔄 UNIFIED BLOCK REGISTRY ADAPTER
 * 
 * Adapter de compatibilidade para código legacy que ainda usa:
 * - getEnhancedBlockComponent() do EnhancedBlockRegistry
 * - ENHANCED_BLOCK_REGISTRY constante
 * - AVAILABLE_COMPONENTS array
 * 
 * Permite migração gradual sem quebrar código existente.
 */

import { ComponentType } from 'react';
import { blockRegistry } from './UnifiedBlockRegistry';

/**
 * Adapter para getEnhancedBlockComponent
 * Mantém compatibilidade com código legacy
 */
export function getEnhancedBlockComponent(type: string): ComponentType<any> | null {
  return blockRegistry.getComponent(type);
}

/**
 * Adapter para ENHANCED_BLOCK_REGISTRY
 * Retorna um Proxy que intercepta acessos e delega ao UnifiedBlockRegistry
 */
export const ENHANCED_BLOCK_REGISTRY = new Proxy({} as Record<string, ComponentType<any>>, {
  get(target, prop: string) {
    // Interceptar acesso e buscar no registry unificado
    return blockRegistry.getComponent(prop);
  },
  
  has(target, prop: string) {
    return blockRegistry.has(prop);
  },
  
  ownKeys() {
    // Retornar todas as chaves disponíveis
    return blockRegistry.getAllTypes();
  },
  
  getOwnPropertyDescriptor(target, prop: string) {
    if (blockRegistry.has(prop)) {
      return {
        enumerable: true,
        configurable: true,
        writable: false,
      };
    }
    return undefined;
  },
});

/**
 * Adapter para AVAILABLE_COMPONENTS
 * Gera lista de componentes disponíveis dinamicamente
 */
export const AVAILABLE_COMPONENTS = (() => {
  const allTypes = blockRegistry.getAllTypes();
  
  // Categorização de componentes
  const categorizeComponent = (type: string): string => {
    if (type.startsWith('quiz-')) return 'quiz';
    if (type.startsWith('question-')) return 'quiz';
    if (type.startsWith('result-')) return 'result';
    if (type.startsWith('offer-')) return 'offer';
    if (type.startsWith('transition-')) return 'quiz';
    if (type.includes('button') || type.includes('cta')) return 'interactive';
    if (type.includes('form') || type.includes('input')) return 'forms';
    if (type.includes('text') || type.includes('heading')) return 'content';
    if (type.includes('image') || type.includes('photo')) return 'content';
    if (type.includes('container') || type.includes('section')) return 'layout';
    return 'visual';
  };
  
  // Gerar label amigável
  const generateLabel = (type: string): string => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Gerar descrição
  const generateDescription = (type: string): string => {
    const category = categorizeComponent(type);
    return `${generateLabel(type)} - ${category}`;
  };
  
  // Mapear para formato AVAILABLE_COMPONENTS
  return allTypes.map(type => ({
    type,
    label: generateLabel(type),
    category: categorizeComponent(type),
    description: generateDescription(type),
  }));
})();

/**
 * Re-exports para compatibilidade total
 */
export const getBlockComponent = getEnhancedBlockComponent;
export const getAllBlockTypes = () => blockRegistry.getAllTypes();
export const blockTypeExists = (type: string) => blockRegistry.has(type);

/**
 * Função de estatísticas para debug
 */
export const getRegistryStats = () => blockRegistry.getStats();

/**
 * Debug helper
 */
export const debugRegistry = () => blockRegistry.debug();

export default {
  getEnhancedBlockComponent,
  ENHANCED_BLOCK_REGISTRY,
  AVAILABLE_COMPONENTS,
  getBlockComponent,
  getAllBlockTypes,
  blockTypeExists,
  getRegistryStats,
  debugRegistry,
};

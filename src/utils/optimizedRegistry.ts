import React from 'react';
import { ENHANCED_BLOCK_REGISTRY } from '@/config/enhancedBlockRegistry';

/**
 * Registry otimizado para busca rápida de componentes
 */

// Fallback component para tipos não encontrados
const FallbackComponent: React.FC<any> = ({ block }) => {
  return React.createElement('div', {
    className: 'p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center'
  }, [
    React.createElement('p', { 
      key: 'message',
      className: 'text-gray-600 font-medium' 
    }, `Componente não encontrado: ${block?.type || 'unknown'}`),
    React.createElement('p', { 
      key: 'instruction',
      className: 'text-xs text-gray-500 mt-1' 
    }, 'Verifique se o componente está registrado')
  ]);
};

/**
 * Buscar componente otimizado no registry
 */
export const getOptimizedBlockComponent = (type: string): React.ComponentType<any> => {
  // Buscar no registry principal
  const component = ENHANCED_BLOCK_REGISTRY[type];
  
  if (component) {
    console.log(`✅ Componente encontrado: ${type}`);
    return component;
  }
  
  // Log para debug
  console.warn(`⚠️ Componente não encontrado: ${type}`);
  console.log('Componentes disponíveis:', Object.keys(ENHANCED_BLOCK_REGISTRY));
  
  // Retornar fallback
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
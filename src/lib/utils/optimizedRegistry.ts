/**
 * 🎯 OPTIMIZED REGISTRY - VERSÃO 3.0 UNIFICADA
 * 
 * ✅ MIGRADO: Agora delega para UnifiedBlockRegistry
 * ✅ Mantém API de compatibilidade para código legado
 * ✅ Remove 200+ linhas de código duplicado
 */

import React from 'react';
import { blockRegistry, getRegistryStats, type BlockType } from '@/core/registry/UnifiedBlockRegistry';
import VisualBlockFallback from '@/components/core/renderers/VisualBlockFallback';

// Cache simples para manter identidade estável por tipo
const COMPONENT_CACHE: Map<string, React.ComponentType<any>> = new Map();

/**
 * Cria um fallback visual quando componente não é encontrado
 */
const createFallback = (type: string): React.ComponentType<any> => {
  const Fallback: React.ComponentType<any> = ({ block }) => {
    return React.createElement(VisualBlockFallback, {
      blockType: type,
      blockId: block?.id || 'unknown',
      block,
    });
  };
  Fallback.displayName = `Fallback(${type})`;
  return Fallback;
};

/**
 * 🧠 Buscar componente otimizado com cache
 */
export const getOptimizedBlockComponent = (type: string): React.ComponentType<any> => {
  // 1. Retorna do cache se já resolvido
  const cached = COMPONENT_CACHE.get(type);
  if (cached) {
    return cached;
  }

  // 2. Buscar no UnifiedBlockRegistry
  const component = blockRegistry.getComponent(type);
  
  if (component) {
    COMPONENT_CACHE.set(type, component);
    return component;
  }

  // 3. Fallback visual se não encontrado
  const fallback = createFallback(type);
  COMPONENT_CACHE.set(type, fallback);
  return fallback;
};

/**
 * ✅ Verificar se componente existe
 */
export const hasOptimizedBlockComponent = (type: string): boolean => {
  return blockRegistry.has(type);
};

/**
 * 📋 Listar todos os componentes disponíveis
 */
export const getAvailableOptimizedComponents = (): string[] => {
  return blockRegistry.getAllTypes();
};

/**
 * 🔧 Normalizar propriedades de bloco (compatibilidade legada)
 */
export const normalizeBlockProps = (block: any) => {
  // UnifiedBlockRegistry já normaliza internamente
  return block;
};

/**
 * 📊 Estatísticas do registry otimizado
 */
export const getOptimizedRegistryStats = () => {
  return {
    ...getRegistryStats(),
    cache: {
      size: COMPONENT_CACHE.size,
      types: Array.from(COMPONENT_CACHE.keys()),
    },
  };
};

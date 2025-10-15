/**
 * 🔥 FASE 2: Enhanced Block Registry - UNIFIED STUB
 * Temporary implementation até componentes serem mapeados
 * TODO: Mapear componentes reais em src/components/editor/blocks/
 */

import { ComponentType } from 'react';

/**
 * 📋 REGISTRY STUB - Será preenchido após mapear componentes reais
 */
export const ENHANCED_BLOCK_REGISTRY: Record<string, ComponentType<any>> = {};

/**
 * 📊 AVAILABLE COMPONENTS - Lista vazia temporária
 */
export const AVAILABLE_COMPONENTS: Array<{
  type: string;
  component: ComponentType<any>;
  displayName: string;
  label?: string;
  category?: string;
}> = [];

/**
 * 🔍 GET ENHANCED BLOCK COMPONENT
 * Busca componente no registry com fallback inteligente
 */
export function getEnhancedBlockComponent(type: string): ComponentType<any> | null {
  if (!type) {
    console.warn('getEnhancedBlockComponent: tipo vazio');
    return null;
  }

  // Busca direta
  if (ENHANCED_BLOCK_REGISTRY[type]) {
    return ENHANCED_BLOCK_REGISTRY[type];
  }

  // Normalizar tipo (remover sufixos, lowercase)
  const normalizedType = type.toLowerCase().replace(/block$/, '').trim();
  if (ENHANCED_BLOCK_REGISTRY[normalizedType]) {
    return ENHANCED_BLOCK_REGISTRY[normalizedType];
  }

  // Tentar com sufixo -inline
  const inlineType = `${normalizedType}-inline`;
  if (ENHANCED_BLOCK_REGISTRY[inlineType]) {
    return ENHANCED_BLOCK_REGISTRY[inlineType];
  }

  console.warn(`Componente não encontrado no registry: ${type}`);
  return null;
}

/**
 * 🔧 NORMALIZE BLOCK PROPERTIES
 * Normaliza propriedades de blocos para formato consistente
 */
export function normalizeBlockProperties(props: any): any {
  if (!props) return {};

  // Garantir estrutura básica
  return {
    id: props.id || props.blockId || '',
    type: props.type || props.blockType || 'text-inline',
    content: props.content || props.data || {},
    settings: props.settings || {},
    style: props.style || {},
    ...props
  };
}

/**
 * 📈 GET REGISTRY STATS
 * Retorna estatísticas do registry
 */
export function getRegistryStats() {
  const uniqueComponents = new Set(Object.values(ENHANCED_BLOCK_REGISTRY));
  
  return {
    total: Object.keys(ENHANCED_BLOCK_REGISTRY).length,
    unique: uniqueComponents.size,
    aliases: Object.keys(ENHANCED_BLOCK_REGISTRY).length - uniqueComponents.size,
    components: Array.from(uniqueComponents).map((c: any) => c.name || 'Anonymous')
  };
}

// Default export
export default ENHANCED_BLOCK_REGISTRY;

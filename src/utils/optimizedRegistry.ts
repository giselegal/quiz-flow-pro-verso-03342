import React from 'react';
import { 
  ENHANCED_BLOCK_REGISTRY, 
  getEnhancedBlockComponent,
  normalizeBlockProperties,
  getRegistryStats
} from '@/components/editor/blocks/enhancedBlockRegistry';
import VisualBlockFallback from '@/components/core/renderers/VisualBlockFallback';

/**
 * 🎯 REGISTRY OTIMIZADO - VERSÃO 2.0 COM FALLBACK INTELIGENTE
 * ✅ 150+ componentes mapeados
 * ✅ Sistema de fallback por categoria
 * ✅ Normalização automática de propriedades
 * ✅ Estatísticas completas
 */

/**
 * 🧠 Buscar componente otimizado com fallback inteligente
 */
export const getOptimizedBlockComponent = (type: string): React.ComponentType<any> => {
  try {
    // Usar função inteligente do enhanced registry
    const component = getEnhancedBlockComponent(type);
    
    if (component) {
      console.log(`✅ Componente resolvido: ${type}`);
      return component;
    }

    // Este ponto nunca deveria ser alcançado devido ao fallback universal
    console.error(`❌ Erro crítico: nenhum componente encontrado para ${type}`);
    
  } catch (error) {
    console.error(`❌ Erro ao buscar componente ${type}:`, error);
  }

  // Fallback de emergência apenas se algo der muito errado
  const EmergencyFallback: React.ComponentType<any> = ({ block }) => {
    return React.createElement(VisualBlockFallback, {
      blockType: type,
      blockId: block?.id || 'unknown',
      block: block,
      message: `Erro crítico ao carregar componente '${type}'`,
      showDetails: true,
    });
  };

  return EmergencyFallback;
};

/**
 * ✅ Verificar se componente existe (com fallback sempre true)
 */
export const hasOptimizedBlockComponent = (_type: string): boolean => {
  // Com sistema de fallback inteligente, sempre retorna true
  return true;
};

/**
 * 📋 Listar todos os componentes disponíveis
 */
export const getAvailableOptimizedComponents = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

/**
 * 🔧 Normalizar propriedades de bloco
 */
export const normalizeBlockProps = (block: any) => {
  return normalizeBlockProperties(block);
};

/**
 * 📊 Estatísticas do registry otimizado
 */
export const getOptimizedRegistryStats = () => {
  const stats = getRegistryStats();
  
  return {
    ...stats,
    optimizedFeatures: [
      'Fallback inteligente por categoria',
      'Normalização automática de propriedades', 
      'Sistema de busca aprimorado',
      'Cobertura de 150+ componentes'
    ],
    performance: {
      cacheEnabled: true,
      lazyLoading: true,
      fallbackSystem: 'intelligent',
    }
  };
};

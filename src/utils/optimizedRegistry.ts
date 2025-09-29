import React from 'react';
import ENHANCED_BLOCK_REGISTRY, { getEnhancedBlockComponent, normalizeBlockProperties, getRegistryStats } from '@/components/editor/blocks/enhancedBlockRegistry';
import VisualBlockFallback from '@/components/core/renderers/VisualBlockFallback';

// Importações diretas para fallbacks críticos
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';

// Mapa de fallbacks diretos para componentes críticos
const DIRECT_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  'quiz-intro-header': QuizIntroHeaderBlock,
  'text': TextInlineBlock,
  'text-inline': TextInlineBlock,
  'image': ImageInlineBlock,
  'image-inline': ImageInlineBlock,
  'button': ButtonInlineBlock,
  'button-inline': ButtonInlineBlock,
};

// 🧪 DEBUG: Teste imediato do registry na importação
let registryInitialized = false;
const initializeRegistry = () => {
  if (registryInitialized) return true;

  try {
    // Forçar a inicialização tentando acessar uma chave específica
    const testComponent = ENHANCED_BLOCK_REGISTRY['quiz-intro-header'];
    if (testComponent) {
      registryInitialized = true;
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Registry inicializado com sucesso');
      }
      return true;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Erro ao inicializar registry:', error);
    }
  }

  return false;
};

if (process.env.NODE_ENV === 'development') {
  console.log('🔬 INICIALIZANDO optimizedRegistry.ts');

  // Verificação com timeout para garantir que a inicialização está completa
  setTimeout(() => {
    const initialized = initializeRegistry();
    console.log('📊 Registry inicializado após timeout:', initialized);
    console.log('📊 Registry keys após timeout:', Object.keys(ENHANCED_BLOCK_REGISTRY).slice(0, 10));

    // Teste direto dos tipos problemáticos
    const testTypes = ['quiz-intro-header', 'text', 'image'];
    testTypes.forEach(type => {
      const hasKey = type in ENHANCED_BLOCK_REGISTRY;
      console.log(`🔍 Registry tem "${type}": ${hasKey}`);
    });
  }, 100);
}/**
 * 🎯 REGISTRY OTIMIZADO - VERSÃO 2.0 COM FALLBACK INTELIGENTE
 * ✅ 150+ componentes mapeados
 * ✅ Sistema de fallback por categoria
 * ✅ Normalização automática de propriedades
 * ✅ Estatísticas completas
 */

/**
 * 🧠 Buscar componente otimizado com fallback inteligente
 */
// Cache simples para manter identidade estável por tipo
const COMPONENT_CACHE: Map<string, React.ComponentType<any>> = new Map();

/**
 * Cria um fallback de emergência quando o registry não está disponível
 */
const createEmergencyFallback = (type: string): React.ComponentType<any> => {
  const EmergencyFallback: React.ComponentType<any> = ({ block }) => {
    return React.createElement(VisualBlockFallback, {
      blockType: type,
      blockId: block?.id || 'unknown',
      block: block
    });
  };
  EmergencyFallback.displayName = `EmergencyFallback(${type})`;
  return EmergencyFallback;
};

/**
 * Fallback baseado em padrões de nome do tipo
 */
const getPatternFallback = (type: string): React.ComponentType<any> => {
  console.log(`🎯 [ROBUST] Tentando fallback por padrão para "${type}"`);

  // Fallbacks por padrão de tipo
  if (type.includes('text') || type.includes('title') || type.includes('paragraph')) {
    console.log(`✅ [ROBUST] Fallback de texto para "${type}"`);
    COMPONENT_CACHE.set(type, TextInlineBlock);
    return TextInlineBlock;
  }

  if (type.includes('image') || type.includes('img') || type.includes('photo')) {
    console.log(`✅ [ROBUST] Fallback de imagem para "${type}"`);
    COMPONENT_CACHE.set(type, ImageInlineBlock);
    return ImageInlineBlock;
  }

  if (type.includes('button') || type.includes('btn') || type.includes('cta')) {
    console.log(`✅ [ROBUST] Fallback de botão para "${type}"`);
    COMPONENT_CACHE.set(type, ButtonInlineBlock);
    return ButtonInlineBlock;
  }

  if (type.includes('header') || type.includes('intro') || type.includes('quiz')) {
    console.log(`✅ [ROBUST] Fallback de header para "${type}"`);
    COMPONENT_CACHE.set(type, QuizIntroHeaderBlock);
    return QuizIntroHeaderBlock;
  }

  // Fallback visual final
  console.warn(`⚠️ [ROBUST] Usando fallback visual para "${type}"`);
  return createEmergencyFallback(type);
};

export const getOptimizedBlockComponent = (type: string): React.ComponentType<any> => {
  console.log(`🔍 [ROBUST] getOptimizedBlockComponent chamado para: "${type}"`);

  // 1. Retorna do cache se já resolvido
  const cached = COMPONENT_CACHE.get(type);
  if (cached) {
    console.log(`✅ [ROBUST] Cache hit para "${type}"`);
    return cached;
  }

  // 2. Tentar fallback direto PRIMEIRO para componentes críticos
  if (DIRECT_COMPONENT_MAP[type]) {
    console.log(`✅ [ROBUST] Fallback direto para "${type}"`);
    const component = DIRECT_COMPONENT_MAP[type];
    COMPONENT_CACHE.set(type, component);
    return component;
  }

  try {
    // 3. Verificar se o registry está inicializado
    if (!initializeRegistry()) {
      console.warn(`⚠️ [ROBUST] Registry não inicializado para "${type}", usando fallback por padrão`);
      return getPatternFallback(type);
    }

    // 4. Tentar função do enhanced registry
    const component = getEnhancedBlockComponent(type); console.log(`🎯 getEnhancedBlockComponent retornou para "${type}":`, component ? component.name || component : 'undefined/null');

    if (component) {
      console.log(`✅ Componente válido encontrado para "${type}", adicionando ao cache`);
      // Armazenar no cache para identidade estável entre renders
      COMPONENT_CACHE.set(type, component as unknown as React.ComponentType<any>);
      return component as unknown as React.ComponentType<any>;
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

  // Também cacheia o fallback para não recriar função
  COMPONENT_CACHE.set(type, EmergencyFallback);
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
    usage: {
      cacheSize: COMPONENT_CACHE.size,
      registryInitialized,
      cachedTypes: Array.from(COMPONENT_CACHE.keys()),
    },
  };
};

// 🚀 WARM-UP: Pré-carregar componentes críticos no carregamento da página
const warmUpCriticalComponents = () => {
  const criticalTypes = ['quiz-intro-header', 'text', 'image', 'button'];

  criticalTypes.forEach(type => {
    try {
      getOptimizedBlockComponent(type);
    } catch (error) {
      console.warn(`⚠️ Falha no warm-up do componente "${type}":`, error);
    }
  });
};

// Executar warm-up após inicialização
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(warmUpCriticalComponents, 200);
}

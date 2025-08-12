/**
 * SISTEMA UNIFICADO DE MAPEAMENTO DE BLOCOS - Pós Limpeza 2025
 *
 * Integra EnhancedBlockRegistry como sistema principal
 * Mantém apenas componentes validados e funcionais
 */

import { ComponentType } from 'react';
import {
  getBlockComponent as getEnhancedComponent,
  getBlockDefinition,
  getAllBlockTypes,
} from './enhancedBlockRegistry';

// Blocos básicos consolidados (mais completos)
import HeaderBlock from '../components/editor/blocks/HeaderBlock';
import TextBlock from '../components/editor/blocks/TextBlock';
import ImageBlock from '../components/editor/blocks/ImageBlock';
import RichTextBlock from '../components/editor/blocks/RichTextBlock';

// Blocos de quiz (validados)
import QuizResultCalculatedBlock from '../components/editor/blocks/QuizResultCalculatedBlock';

// SISTEMA UNIFICADO - Prioriza EnhancedBlockRegistry + Fallbacks validados
export const UNIFIED_BLOCK_MAP: Record<string, ComponentType<any>> = {
  // Blocos básicos (versões mais completas)
  header: HeaderBlock,
  heading: HeaderBlock,
  text: TextBlock,
  image: ImageBlock,
  'rich-text': RichTextBlock,

  // Blocos de quiz e resultado (funcionais)
  'quiz-result-calculated': QuizResultCalculatedBlock,
  QuizResultCalculatedBlock: QuizResultCalculatedBlock,
};

// FUNÇÃO PRINCIPAL - Busca primeiro no Enhanced Registry, depois no Unified Map
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  // 1. Tentar Enhanced Registry primeiro (sistema principal)
  const enhancedComponent = getEnhancedComponent(blockType);
  if (enhancedComponent) {
    return enhancedComponent;
  }

  // 2. Fallback para componentes validados
  return UNIFIED_BLOCK_MAP[blockType];
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return !!getBlockComponent(blockType);
};

// Re-export do sistema Enhanced para compatibilidade
export { getBlockDefinition, getAllBlockTypes };

// Mantém compatibilidade com código legado
export const EDITOR_BLOCKS_MAP = UNIFIED_BLOCK_MAP;

export default UNIFIED_BLOCK_MAP;

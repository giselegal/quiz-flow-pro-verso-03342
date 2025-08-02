
/**
 * Mapeamento dos blocos do editor para seus respectivos componentes
 * 
 * Este arquivo mapeia os tipos de bloco para os componentes React que os renderizam.
 * Atualizado para incluir os novos componentes de funil reutilizáveis.
 */

import { ComponentType } from 'react';

// Blocos de quiz e resultado
import QuizResultCalculatedBlock from '../components/editor/blocks/QuizResultCalculatedBlock';

export const EDITOR_BLOCKS_MAP: Record<string, ComponentType<any>> = {
  // Blocos de quiz e resultado
  'quiz-result-calculated': QuizResultCalculatedBlock,
  'QuizResultCalculatedBlock': QuizResultCalculatedBlock,
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return blockType in EDITOR_BLOCKS_MAP;
};

// Helper para obter o componente de um tipo
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  return EDITOR_BLOCKS_MAP[blockType];
};

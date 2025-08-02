
/**
 * Mapeamento dos blocos do editor para seus respectivos componentes
 * 
 * Este arquivo mapeia os tipos de bloco para os componentes React que os renderizam.
 * Limpo e funcional - apenas componentes existentes.
 */

import { ComponentType } from 'react';

// Blocos básicos do editor (confirmados como existentes)
import HeaderBlock from '@/components/blocks/HeaderBlock';
import TextBlock from '@/components/blocks/TextBlock';
import ImageBlock from '@/components/blocks/ImageBlock';
import ButtonBlock from '@/components/blocks/ButtonBlock';
import SpacerBlock from '@/components/blocks/SpacerBlock';
import RichTextBlock from '@/components/blocks/RichTextBlock';

// Blocos de quiz e resultado (confirmados como existentes)
import QuizResultCalculatedBlock from '@/components/editor/blocks/QuizResultCalculatedBlock';

export const EDITOR_BLOCKS_MAP: Record<string, ComponentType<any>> = {
  // Blocos básicos
  'header': HeaderBlock,
  'text': TextBlock,
  'image': ImageBlock,
  'button': ButtonBlock,
  'spacer': SpacerBlock,
  'rich-text': RichTextBlock,
  
  // Blocos de quiz e resultado - ETAPAS 1-21 COMPLETAS
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

export default EDITOR_BLOCKS_MAP;

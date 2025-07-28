/**
 * Mapeamento dos blocos do editor para seus respectivos componentes
 * 
 * Este arquivo mapeia os tipos de bloco para os componentes React que os renderizam.
 * Atualizado para incluir os novos componentes de funil reutilizáveis.
 */

import { ComponentType } from 'react';

// Blocos básicos do editor
import HeaderBlock from '@/components/editor/blocks/HeaderBlock';
import TextBlock from '@/components/editor/blocks/TextBlock';
import ImageBlock from '@/components/editor/blocks/ImageBlock';
import ButtonBlock from '@/components/editor/blocks/ButtonBlock';
import SpacerBlock from '@/components/editor/blocks/SpacerBlock';
import RichTextBlock from '@/components/editor/blocks/RichTextBlock';

// Blocos de quiz e resultado
import QuizStepBlock from '@/components/editor/blocks/QuizStepBlock';
import QuizStartPageBlock from '@/components/editor/blocks/QuizStartPageBlock';
import QuizQuestionBlock from '@/components/editor/blocks/QuizQuestionBlock';
import QuizQuestionBlockConfigurable from '@/components/editor/blocks/QuizQuestionBlockConfigurable';
import QuizResultCalculatedBlock from '../components/editor/blocks/QuizResultCalculatedBlock';

export const EDITOR_BLOCKS_MAP: Record<string, ComponentType<any>> = {
  // Blocos básicos
  'header': HeaderBlock,
  'text': TextBlock,
  'image': ImageBlock,
  'button': ButtonBlock,
  'spacer': SpacerBlock,
  'rich-text': RichTextBlock,
  
  // Blocos de quiz e resultado
  'quiz-step': QuizStepBlock,
  'quiz-start-page': QuizStartPageBlock,
  'QuizStartPageBlock': QuizStartPageBlock,
  'quiz-question': QuizQuestionBlock,
  'QuizQuestionBlock': QuizQuestionBlock,
  'quiz-question-configurable': QuizQuestionBlockConfigurable,
  'QuizQuestionBlockConfigurable': QuizQuestionBlockConfigurable,
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

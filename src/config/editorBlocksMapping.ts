/**
 * Mapeamento dos blocos do editor para seus respectivos componentes
 * 
 * Este arquivo mapeia os tipos de bloco para os componentes React que os renderizam.
 * Atualizado para incluir os novos componentes de funil reutilizáveis.
 */

import { ComponentType } from 'react';

// Blocos básicos do editor
import HeaderBlock from "@/types/blocks"
import TextBlock from "@/types/blocks"
import ImageBlock from "@/types/blocks"
import ButtonBlock from "@/types/blocks"
import SpacerBlock from "@/types/blocks"
import RichTextBlock from "@/types/blocks"

// Blocos de quiz e resultado
import QuizStepBlock from "@/types/blocks"
import QuizStartPageBlock from "@/types/blocks"
import QuizQuestionBlock from "@/types/blocks"
import QuizQuestionBlockConfigurable from "@/types/blocks"
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

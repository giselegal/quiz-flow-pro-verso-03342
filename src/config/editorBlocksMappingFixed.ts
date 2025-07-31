/**
 * Mapeamento dos blocos do editor para seus respectivos componentes
 * 
 * Este arquivo mapeia os tipos de bloco para os componentes React que os renderizam.
 * Limpo e funcional - apenas componentes existentes.
 */

import { ComponentType } from 'react';

// Blocos básicos do editor (confirmados como existentes)
import HeaderBlock from "@/types/blocks"
import TextBlock from "@/types/blocks"
import ImageBlock from "@/types/blocks"
import ButtonBlock from "@/types/blocks"
import SpacerBlock from "@/types/blocks"
import RichTextBlock from "@/types/blocks"

// Blocos de quiz e resultado (confirmados como existentes)
import QuizStartPageBlock from "@/types/blocks"
import QuizQuestionBlock from "@/types/blocks"
import QuizQuestionBlockConfigurable from "@/types/blocks"
import QuizResultCalculatedBlock from "@/types/blocks"
import QuizStepBlock from "@/types/blocks"
import QuestionMultipleBlock from "@/types/blocks"
import StrategicQuestionBlock from "@/types/blocks"
import QuizTransitionBlock from "@/types/blocks"

// Blocos de resultado e oferta (confirmados como existentes)
import ModernResultPageBlock from "@/types/blocks"
import QuizOfferPageBlock from "@/types/blocks"
import ResultHeaderBlock from "@/types/blocks"

// Blocos de seções (confirmados como existentes)
import FAQSectionBlock from "@/types/blocks"
import TestimonialsBlock from "@/types/blocks"
import GuaranteeBlock from "@/types/blocks"
import VideoPlayerBlock from "@/types/blocks"

export const EDITOR_BLOCKS_MAP: Record<string, ComponentType<any>> = {
  // Blocos básicos
  'header': HeaderBlock,
  'text': TextBlock,
  'image': ImageBlock,
  'button': ButtonBlock,
  'spacer': SpacerBlock,
  'rich-text': RichTextBlock,
  
  // Blocos de quiz e resultado - ETAPAS 1-21 COMPLETAS
  'quiz-step': QuizStepBlock,
  'quiz-start-page': QuizStartPageBlock,
  'QuizStartPageBlock': QuizStartPageBlock,
  
  // Questões principais (Etapas 2-11)
  'quiz-question': QuizQuestionBlock,
  'QuizQuestionBlock': QuizQuestionBlock,
  'quiz-question-configurable': QuizQuestionBlockConfigurable,
  'QuizQuestionBlockConfigurable': QuizQuestionBlockConfigurable,
  
  // Questões múltiplas e estratégicas (Etapas 13-18)
  'question-multiple': QuestionMultipleBlock,
  'QuestionMultipleBlock': QuestionMultipleBlock,
  'strategic-question': StrategicQuestionBlock,
  'StrategicQuestionBlock': StrategicQuestionBlock,
  
  // Transições (Etapas 12, 19)
  'quiz-transition': QuizTransitionBlock,
  'QuizTransitionBlock': QuizTransitionBlock,
  
  // Resultado (Etapa 20)
  'quiz-result-calculated': QuizResultCalculatedBlock,
  'QuizResultCalculatedBlock': QuizResultCalculatedBlock,
  'modern-result-page': ModernResultPageBlock,
  'ModernResultPageBlock': ModernResultPageBlock,
  'result-header': ResultHeaderBlock,
  
  // Oferta (Etapa 21)
  'quiz-offer-page': QuizOfferPageBlock,
  'QuizOfferPageBlock': QuizOfferPageBlock,
  
  // Blocos de suporte
  'faq-section': FAQSectionBlock,
  'testimonials': TestimonialsBlock,
  'guarantee': GuaranteeBlock,
  'video-player': VideoPlayerBlock,
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return blockType in EDITOR_BLOCKS_MAP;
};

// Helper para obter o componente de um tipo
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  return EDITOR_BLOCKS_MAP[blockType];
};

// Lista das 21 etapas do funil completo
export const FUNNEL_STEPS = {
  1: 'quiz-start-page',          // Etapa 1: Introdução e coleta de nome
  2: 'quiz-question',            // Etapa 2: Questão 1
  3: 'quiz-question',            // Etapa 3: Questão 2
  4: 'quiz-question',            // Etapa 4: Questão 3
  5: 'quiz-question',            // Etapa 5: Questão 4
  6: 'quiz-question',            // Etapa 6: Questão 5
  7: 'quiz-question',            // Etapa 7: Questão 6
  8: 'quiz-question',            // Etapa 8: Questão 7
  9: 'quiz-question',            // Etapa 9: Questão 8
  10: 'quiz-question',           // Etapa 10: Questão 9
  11: 'quiz-question',           // Etapa 11: Questão 10
  12: 'quiz-transition',         // Etapa 12: Transição (calculando)
  13: 'strategic-question',      // Etapa 13: Questão estratégica 1
  14: 'strategic-question',      // Etapa 14: Questão estratégica 2
  15: 'strategic-question',      // Etapa 15: Questão estratégica 3
  16: 'strategic-question',      // Etapa 16: Questão estratégica 4
  17: 'strategic-question',      // Etapa 17: Questão estratégica 5
  18: 'strategic-question',      // Etapa 18: Questão estratégica 6
  19: 'quiz-transition',         // Etapa 19: Transição final
  20: 'quiz-result-calculated',  // Etapa 20: Resultado personalizado
  21: 'quiz-offer-page'          // Etapa 21: Página de oferta
};

export default EDITOR_BLOCKS_MAP;

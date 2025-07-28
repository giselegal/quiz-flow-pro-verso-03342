/**
 * Mapeamento dos blocos do editor - APENAS COMPONENTES EXISTENTES
 * 
 * Este arquivo mapeia apenas os componentes que foram confirmados como existentes
 * na pasta /src/components/editor/blocks/
 */

import { ComponentType } from 'react';

// Componentes que realmente existem (verificados)
import QuizQuestionBlock from '../components/editor/blocks/QuizQuestionBlock';
import QuizQuestionBlockConfigurable from '../components/editor/blocks/QuizQuestionBlockConfigurable';
import QuizQuestionBlockFixed from '../components/editor/blocks/QuizQuestionBlockFixed';
import QuizQuestionPageBlock from '../components/editor/blocks/QuizQuestionPageBlock';
import QuizResultCalculatedBlock from '../components/editor/blocks/QuizResultCalculatedBlock';
import QuizStartPageBlock from '../components/editor/blocks/QuizStartPageBlock';
import QuizOfferPageBlock from '../components/editor/blocks/QuizOfferPageBlock';
import ModernResultPageBlock from '../components/editor/blocks/ModernResultPageBlock';
import QuestionMultipleBlock from '../components/editor/blocks/QuestionMultipleBlock';
import StrategicQuestionBlock from '../components/editor/blocks/StrategicQuestionBlock';
import QuizTransitionBlock from '../components/editor/blocks/QuizTransitionBlock';
import HeaderBlock from '../components/editor/blocks/HeaderBlock';
import TextBlock from '../components/editor/blocks/TextBlock';
import ImageBlock from '../components/editor/blocks/ImageBlock';
import ButtonBlock from '../components/editor/blocks/ButtonBlock';
import SpacerBlock from '../components/editor/blocks/SpacerBlock';
import RichTextBlock from '../components/editor/blocks/RichTextBlock';
import FAQSectionBlock from '../components/editor/blocks/FAQSectionBlock';
import TestimonialsBlock from '../components/editor/blocks/TestimonialsBlock';
import GuaranteeBlock from '../components/editor/blocks/GuaranteeBlock';

// Componentes INLINE reais das 21 etapas
import QuizIntroHeaderBlock from '../components/editor/blocks/QuizIntroHeaderBlock';
import TextInlineBlock from '../components/editor/blocks/TextInlineBlock';
import HeadingInlineBlock from '../components/editor/blocks/HeadingInlineBlock';
import ImageDisplayInlineBlock from '../components/editor/blocks/ImageDisplayInlineBlock';
import FormInputBlock from '../components/editor/blocks/FormInputBlock';
import ButtonInlineBlock from '../components/editor/blocks/ButtonInlineBlock';
import OptionsGridBlock from '../components/editor/blocks/OptionsGridBlock';
import ProgressInlineBlock from '../components/editor/blocks/ProgressInlineBlock';

// Componentes INLINE de resultado (etapa 20)
import ResultHeaderInlineBlock from '../components/editor/blocks/ResultHeaderInlineBlock';
import ResultCardInlineBlock from '../components/editor/blocks/ResultCardInlineBlock';
import StyleCardInlineBlock from '../components/editor/blocks/StyleCardInlineBlock';

export const EDITOR_BLOCKS_MAP: Record<string, ComponentType<any>> = {
  // Blocos básicos
  'header': HeaderBlock,
  'text': TextBlock,
  'image': ImageBlock,
  'button': ButtonBlock,
  'spacer': SpacerBlock,
  'rich-text': RichTextBlock,
  
  // ✅ COMPONENTES INLINE REAIS DAS 21 ETAPAS
  'quiz-intro-header': QuizIntroHeaderBlock,
  'text-inline': TextInlineBlock,
  'heading-inline': HeadingInlineBlock,
  'image-display-inline': ImageDisplayInlineBlock,
  'form-input': FormInputBlock,
  'button-inline': ButtonInlineBlock,
  'options-grid': OptionsGridBlock,
  'progress-inline': ProgressInlineBlock,
  
  // ✅ COMPONENTES INLINE DE RESULTADO (ETAPA 20)
  'result-header-inline': ResultHeaderInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'style-card-inline': StyleCardInlineBlock,
  
  // ✅ ETAPAS DO FUNIL COMPLETO (1-21) - COMPONENTES INDIVIDUALIZADOS
  
  // Etapa 1: Introdução
  'quiz-start-page': QuizStartPageBlock,
  'QuizStartPageBlock': QuizStartPageBlock,
  
  // Etapas 2-11: Questões principais  
  'quiz-question-page': QuizQuestionPageBlock,
  'QuizQuestionPageBlock': QuizQuestionPageBlock,
  'quiz-question': QuizQuestionBlockFixed,
  'QuizQuestionBlock': QuizQuestionBlockFixed,
  'quiz-question-configurable': QuizQuestionBlockConfigurable,
  'QuizQuestionBlockConfigurable': QuizQuestionBlockConfigurable,
  
  // Etapa 12: Transição
  'quiz-transition': QuizTransitionBlock,
  'QuizTransitionBlock': QuizTransitionBlock,
  
  // Etapas 13-18: Questões estratégicas
  'question-multiple': QuestionMultipleBlock,
  'QuestionMultipleBlock': QuestionMultipleBlock,
  'strategic-question': StrategicQuestionBlock,
  'StrategicQuestionBlock': StrategicQuestionBlock,
  
  // Etapa 19: Transição final (reutiliza o mesmo componente)
  
  // Etapa 20: Resultado
  'quiz-result-calculated': QuizResultCalculatedBlock,
  'QuizResultCalculatedBlock': QuizResultCalculatedBlock,
  'modern-result-page': ModernResultPageBlock,
  'ModernResultPageBlock': ModernResultPageBlock,
  
  // Etapa 21: Oferta
  'quiz-offer-page': QuizOfferPageBlock,
  'QuizOfferPageBlock': QuizOfferPageBlock,
  
  // Blocos de suporte
  'faq-section': FAQSectionBlock,
  'testimonials': TestimonialsBlock,
  'guarantee': GuaranteeBlock,
};

// ✅ MAPEAMENTO DAS 21 ETAPAS COMPLETAS
export const FUNNEL_STEPS_MAPPING = {
  1: 'quiz-start-page',          // ✅ Etapa 1: Introdução
  2: 'quiz-question-configurable', // ✅ Etapa 2: Questão 1
  3: 'quiz-question-configurable', // ✅ Etapa 3: Questão 2
  4: 'quiz-question-configurable', // ✅ Etapa 4: Questão 3
  5: 'quiz-question-configurable', // ✅ Etapa 5: Questão 4
  6: 'quiz-question-configurable', // ✅ Etapa 6: Questão 5
  7: 'quiz-question-configurable', // ✅ Etapa 7: Questão 6
  8: 'quiz-question-configurable', // ✅ Etapa 8: Questão 7
  9: 'quiz-question-configurable', // ✅ Etapa 9: Questão 8
  10: 'quiz-question-configurable', // ✅ Etapa 10: Questão 9
  11: 'quiz-question-configurable', // ✅ Etapa 11: Questão 10
  12: 'quiz-transition',         // ✅ Etapa 12: Transição
  13: 'strategic-question',      // ✅ Etapa 13: Questão estratégica 1
  14: 'strategic-question',      // ✅ Etapa 14: Questão estratégica 2
  15: 'strategic-question',      // ✅ Etapa 15: Questão estratégica 3
  16: 'strategic-question',      // ✅ Etapa 16: Questão estratégica 4
  17: 'strategic-question',      // ✅ Etapa 17: Questão estratégica 5
  18: 'strategic-question',      // ✅ Etapa 18: Questão estratégica 6
  19: 'quiz-transition',         // ✅ Etapa 19: Transição final
  20: 'quiz-result-calculated',  // ✅ Etapa 20: Resultado
  21: 'quiz-offer-page'          // ✅ Etapa 21: Oferta
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return blockType in EDITOR_BLOCKS_MAP;
};

// Helper para obter o componente de um tipo
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  const component = EDITOR_BLOCKS_MAP[blockType];
  console.log(`🔍 getBlockComponent('${blockType}'):`, component ? '✅ Found' : '❌ Not found');
  if (!component) {
    console.log('📋 Available block types:', Object.keys(EDITOR_BLOCKS_MAP));
  }
  return component;
};

// Helper para obter o tipo de bloco de uma etapa específica
export const getBlockTypeForStep = (stepNumber: number): string | undefined => {
  return FUNNEL_STEPS_MAPPING[stepNumber as keyof typeof FUNNEL_STEPS_MAPPING];
};

// Helper para verificar se todas as etapas estão mapeadas
export const validateAllStepsMapping = (): boolean => {
  for (let step = 1; step <= 21; step++) {
    const blockType = getBlockTypeForStep(step);
    if (!blockType || !hasBlockComponent(blockType)) {
      console.error(`❌ Etapa ${step} não tem componente válido mapeado`);
      return false;
    }
  }
  console.log('✅ Todas as 21 etapas estão corretamente mapeadas!');
  return true;
};

export default EDITOR_BLOCKS_MAP;

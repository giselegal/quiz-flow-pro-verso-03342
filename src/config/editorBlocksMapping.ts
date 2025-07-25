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
import QuestionMultipleBlock from '@/components/editor/blocks/QuestionMultipleBlock';
import StrategicQuestionBlock from '@/components/editor/blocks/StrategicQuestionBlock';
import QuizTransitionBlock from '@/components/editor/blocks/QuizTransitionBlock';
import ResultPageBlock from '@/components/editor/blocks/ResultPageBlock';
import QuizOfferPageBlock from '@/components/editor/blocks/QuizOfferPageBlock';
import ResultHeaderBlock from '@/components/editor/blocks/ResultHeaderBlock';
import QuizResultCalculatedBlock from '../components/editor/blocks/QuizResultCalculatedBlock';

// Blocos de seções
import FAQSectionBlock from '@/components/editor/blocks/FAQSectionBlock';
import TestimonialsBlock from '@/components/editor/blocks/TestimonialsBlock';
import GuaranteeBlock from '@/components/editor/blocks/GuaranteeBlock';
import VideoPlayerBlock from '@/components/editor/blocks/VideoPlayerBlock';

// Componentes de funil reutilizáveis
import FunnelStepBlock from '@/components/funnel-blocks/editor/FunnelStepBlock';
import {
  FunnelIntroStep,
  NameCollectStep,
  QuizIntroStep,
  QuestionMultipleStep as FunnelQuestionMultipleStep,
  QuizTransitionStep,
  ProcessingStep,
  ResultIntroStep,
  ResultDetailsStep,
  ResultGuideStep,
  OfferTransitionStep,
  OfferPageStep
} from '@/components/funnel-blocks';

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
  'question-multiple': QuestionMultipleBlock,
  'QuestionMultipleBlock': QuestionMultipleBlock,
  'strategic-question': StrategicQuestionBlock,
  'StrategicQuestionBlock': StrategicQuestionBlock,
  'quiz-transition': QuizTransitionBlock,
  'QuizTransitionBlock': QuizTransitionBlock,
  'result-page': ResultPageBlock,
  'ResultPageBlock': ResultPageBlock,
  'quiz-result-calculated': QuizResultCalculatedBlock,
  'QuizResultCalculatedBlock': QuizResultCalculatedBlock,
  'quiz-offer-page': QuizOfferPageBlock,
  'QuizOfferPageBlock': QuizOfferPageBlock,
  'result-header': ResultHeaderBlock,
  'faq-section': FAQSectionBlock,
  'testimonials': TestimonialsBlock,
  'guarantee': GuaranteeBlock,
  'video-player': VideoPlayerBlock,
  
  // Novos blocos de funil reutilizáveis
  'funnel-step': FunnelStepBlock,
  'funnel-intro': FunnelIntroStep,
  'funnel-name-collect': NameCollectStep,
  'funnel-quiz-intro': QuizIntroStep,
  'funnel-question': FunnelQuestionMultipleStep,
  'funnel-transition': QuizTransitionStep,
  'funnel-processing': ProcessingStep,
  'funnel-result-intro': ResultIntroStep,
  'funnel-result-details': ResultDetailsStep,
  'funnel-result-guide': ResultGuideStep,
  'funnel-offer-transition': OfferTransitionStep,
  'funnel-offer-page': OfferPageStep
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return blockType in EDITOR_BLOCKS_MAP;
};

// Helper para obter o componente de um tipo
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  return EDITOR_BLOCKS_MAP[blockType];
};

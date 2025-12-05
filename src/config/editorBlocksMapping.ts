/**
 * SISTEMA UNIFICADO DE MAPEAMENTO DE BLOCOS - Pós Limpeza 2025
 *
 * Integra blocos validados e funcionais
 * Mantém apenas componentes essenciais
 */

import { ComponentType } from 'react';
// import { getEnhancedBlockComponent as getEnhancedComponent } from '@/components/editor/blocks/EnhancedBlockRegistry'; // Deprecated

// Import the new LeadFormBlock for direct mapping
import LeadFormBlock from '../components/editor/blocks/LeadFormBlock';

// Blocos básicos consolidados
import HeaderBlock from '../components/editor/blocks/HeaderBlock';
import TextBlock from '../components/editor/blocks/TextBlock';
import ImageBlock from '../components/editor/blocks/ImageBlock';
import RichTextBlock from '../components/editor/blocks/RichTextBlock';

// Blocos de quiz (validados)
import QuizResultCalculatedBlock from '../components/editor/blocks/QuizResultCalculatedBlock';

// Blocos atômicos do template v4
import IntroLogoHeaderBlock from '../components/editor/blocks/atomic/IntroLogoHeaderBlock';
import IntroDescriptionBlock from '../components/editor/blocks/atomic/IntroDescriptionBlock';
import CTAButtonBlock from '../components/editor/blocks/atomic/CTAButtonBlock';
import QuestionProgressBlock from '../components/editor/blocks/atomic/QuestionProgressBlock';
import QuestionTitleBlock from '../components/editor/blocks/atomic/QuestionTitleBlock';
import OptionsGridBlock from '../components/editor/blocks/atomic/OptionsGridBlock';
import TransitionTitleBlock from '../components/editor/blocks/atomic/TransitionTitleBlock';
import TransitionTextBlock from '../components/editor/blocks/atomic/TransitionTextBlock';
import ResultHeaderBlock from '../components/editor/blocks/atomic/ResultHeaderBlock';
import ResultDescriptionBlock from '../components/editor/blocks/atomic/ResultDescriptionBlock';
import ResultImageBlock from '../components/editor/blocks/atomic/ResultImageBlock';
import ResultShareBlock from '../components/editor/blocks/atomic/ResultShareBlock';
import ResultDisplayBlock from '../components/blocks/inline/ResultDisplayBlock';
import OfferHeroBlock from '../components/editor/blocks/atomic/OfferHeroBlock';
import UrgencyTimerInlineBlock from '../components/editor/blocks/UrgencyTimerInlineBlock';
import BenefitsListBlock from '../components/editor/blocks/BenefitsListBlock';
import GuaranteeBlock from '../components/editor/blocks/GuaranteeBlock';

// SISTEMA UNIFICADO - Mapeamento completo de blocos do template v4
export const UNIFIED_BLOCK_MAP: Record<string, ComponentType<any>> = {
  // Blocos básicos
  header: HeaderBlock,
  heading: HeaderBlock,
  text: TextBlock,
  image: ImageBlock,
  'rich-text': RichTextBlock,

  // Form Components
  'lead-form': LeadFormBlock,

  // Quiz result
  'quiz-result-calculated': QuizResultCalculatedBlock,

  // INTRO BLOCKS (Step 1)
  'intro-logo-header': IntroLogoHeaderBlock,
  'intro-description': IntroDescriptionBlock,
  'intro-button': CTAButtonBlock,

  // QUESTION BLOCKS (Steps 2-18)
  'question-progress': QuestionProgressBlock,
  'question-title': QuestionTitleBlock,
  'options-grid': OptionsGridBlock,

  // TRANSITION BLOCKS (Step 19)
  'transition-title': TransitionTitleBlock,
  'transition-text': TransitionTextBlock,
  'urgency-timer': UrgencyTimerInlineBlock,

  // RESULT BLOCKS (Step 20)
  'result-header': ResultHeaderBlock,
  'result-description': ResultDescriptionBlock,
  'result-image': ResultImageBlock,
  'result-share': ResultShareBlock,
  'result-display': ResultDisplayBlock,

  // OFFER BLOCKS (Step 21)
  'offer-hero': OfferHeroBlock,
  'benefits-list': BenefitsListBlock,
  'cta-button': CTAButtonBlock,
  'guarantee': GuaranteeBlock,
};

// FUNÇÃO PRINCIPAL - Busca no Unified Map
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  // 1. Enhanced Registry foi deprecado - usando apenas Unified Map
  // const enhancedComponent = getEnhancedComponent(blockType); // Deprecated
  
  // 2. Fallback para componentes validados
  return UNIFIED_BLOCK_MAP[blockType];
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return !!getBlockComponent(blockType);
};

// Re-export do sistema Enhanced para compatibilidade
// export { getBlockDefinition, getAllBlockTypes };

// Mantém compatibilidade com código legado
export const EDITOR_BLOCKS_MAP = UNIFIED_BLOCK_MAP;

export default UNIFIED_BLOCK_MAP;

/**
 * Exports dos Blocos do Editor - Apenas Componentes Funcionais
 * 
 * Este arquivo exporta apenas os blocos que foram confirmados como existentes
 * e funcionais no sistema de editor visual.
 * 
 * ATUALIZADO: Janeiro 2025 - Limpeza de duplicidades e exports quebrados
 */

// Blocos básicos modernos (confirmados como funcionais)
export { default as HeaderBlock } from './HeaderBlock';
export { default as TextBlock } from './TextBlock';
export { ImageBlock } from './ImageBlock';
export { default as ButtonBlock } from './ButtonBlock';
export { SpacerBlock } from './SpacerBlock';

// Blocos de conteúdo avançado (confirmados como funcionais)
export { RichTextBlock } from './RichTextBlock';
export { QuizStepBlock } from './QuizStepBlock';
export { InlineEditableText } from './InlineEditableText';

// Blocos específicos do Quiz (confirmados como funcionais)
export { default as QuizStartPageBlock } from './QuizStartPageBlock';
export { default as QuizQuestionBlock } from './QuizQuestionBlock';
export { default as ResultPageBlock } from './ResultPageBlock';
export { default as QuizOfferPageBlock } from './QuizOfferPageBlock';
export { default as QuestionMultipleBlock } from './QuestionMultipleBlock';
export { default as StrategicQuestionBlock } from './StrategicQuestionBlock';
export { default as QuizTransitionBlock } from './QuizTransitionBlock';

// Novos componentes específicos de páginas (Etapas 20 e 21)
export { default as ModernResultPageBlock } from './ModernResultPageBlock';

// Blocos de resultado e oferta (confirmados como funcionais)
export { default as ResultHeaderBlock } from './ResultHeaderBlock';
export { default as ResultDescriptionBlock } from './ResultDescriptionBlock';
export { default as ProductOfferBlock } from './ProductOfferBlock';
export { default as UrgencyTimerBlock } from './UrgencyTimerBlock';
export { default as FAQSectionBlock } from './FAQSectionBlock';
export { default as TestimonialsBlock } from './TestimonialsBlock';
export { default as GuaranteeBlock } from './GuaranteeBlock';
export { VideoPlayerBlock } from './VideoPlayerBlock';

// Sales Components
export { default as ProductCarouselBlock } from './ProductCarouselBlock';
export { default as BeforeAfterBlock } from './BeforeAfterBlock';
export { default as TwoColumnsBlock } from './TwoColumnsBlock';
export { default as ProsConsBlock } from './ProsConsBlock';
export { default as DynamicPricingBlock } from './DynamicPricingBlock';
export { default as ValueAnchoringBlock } from './ValueAnchoringBlock';

// Renderizador universal (principal)
export { UniversalBlockRenderer } from './UniversalBlockRenderer';

// Tipos relacionados aos blocos
export type { BlockRendererProps } from './UniversalBlockRenderer';

// Re-export do tipo BlockData se necessário
export interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
  order?: number;
  visible?: boolean;
}

// Log para debug
console.log('[BlocksIndex] Exports carregados - componentes modernos apenas');
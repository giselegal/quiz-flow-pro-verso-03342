
// Export de todos os componentes inline disponíveis
// Este arquivo resolve o problema de importação no UniversalBlockRenderer

// Componentes básicos
export { default as TextInlineBlock } from './TextInlineBlock';
export { default as ImageDisplayInlineBlock } from './ImageDisplayInlineBlock';
export { default as BadgeInlineBlock } from './BadgeInlineBlock';
export { default as ProgressInlineBlock } from './ProgressInlineBlock';
export { default as StatInlineBlock } from './StatInlineBlock';
export { default as CountdownInlineBlock } from './CountdownInlineBlock';
export { default as SpacerInlineBlock } from './SpacerInlineBlock';

// Componente Button (correção do export)
export { default as ButtonInlineBlock } from '../ButtonInlineBlock';

// Componentes de cards
export { default as PricingCardInlineBlock } from './PricingCardInlineBlock';
export { default as TestimonialCardInlineBlock } from './TestimonialCardInlineBlock';
export { default as StyleCardInlineBlock } from './StyleCardInlineBlock';
export { default as ResultCardInlineBlock } from './ResultCardInlineBlock';

// Componentes de resultado
export { default as ResultHeaderInlineBlock } from './ResultHeaderInlineBlock';
export { default as StepHeaderInlineBlock } from './StepHeaderInlineBlock';
export { default as SecondaryStylesInlineBlock } from './SecondaryStylesInlineBlock';
export { default as StyleCharacteristicsInlineBlock } from './StyleCharacteristicsInlineBlock';

// Componentes de quiz
export { default as QuizIntroHeaderBlock } from './QuizIntroHeaderBlock';
export { default as LoadingAnimationBlock } from './LoadingAnimationBlock';
export { default as QuizPersonalInfoInlineBlock } from './QuizPersonalInfoInlineBlock';
export { default as QuizResultInlineBlock } from './QuizResultInlineBlock';

// Componentes que existem mas podem estar vazios
export { default as CharacteristicsListInlineBlock } from './CharacteristicsListInlineBlock';
export { default as TestimonialsInlineBlock } from './TestimonialsInlineBlock';
export { default as BeforeAfterInlineBlock } from './BeforeAfterInlineBlock';
export { default as BonusListInlineBlock } from './BonusListInlineBlock';
export { default as QuizOfferPricingInlineBlock } from './QuizOfferPricingInlineBlock';
export { default as QuizOfferCTAInlineBlock } from './QuizOfferCTAInlineBlock';

// Componentes das 21 etapas do funil que existem
export { default as QuizStartPageInlineBlock } from './QuizStartPageInlineBlock';
export { default as QuizQuestionInlineBlock } from './QuizQuestionInlineBlock';

// Re-exportar tipos necessários
export type { BlockComponentProps } from '../../../../types/blocks';

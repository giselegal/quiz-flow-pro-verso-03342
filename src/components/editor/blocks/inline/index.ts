// Componentes Inline Modulares - Filosofia Horizontal
// MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE

// ===== COMPONENTES BÁSICOS =====
export { default as TextInlineBlock } from './TextInlineBlock';
export { default as HeadingInlineBlock } from '../HeadingInlineBlock';
export { default as ButtonInlineBlock } from '../ButtonInlineBlock';
export { default as ImageDisplayInlineBlock } from './ImageDisplayInlineBlock';
export { default as BadgeInlineBlock } from './BadgeInlineBlock';
export { default as ProgressInlineBlock } from './ProgressInlineBlock';
export { default as StatInlineBlock } from './StatInlineBlock';
export { default as CountdownInlineBlock } from './CountdownInlineBlock';

// ===== COMPONENTES DE ESTILO E DESIGN =====
export { default as StyleCardInlineBlock } from './StyleCardInlineBlock';
export { default as ResultCardInlineBlock } from './ResultCardInlineBlock';
export { default as PricingCardInlineBlock } from './PricingCardInlineBlock';
export { default as TestimonialCardInlineBlock } from './TestimonialCardInlineBlock';

// ===== COMPONENTES ADICIONAIS =====
// Nota: Os seguintes componentes existem mas estão vazios (sem export default):
// - CharacteristicsListInlineBlock.tsx
// - SecondaryStylesInlineBlock.tsx  
// - StyleCharacteristicsInlineBlock.tsx

// ===== COMPONENTES DE RESULTADO (ETAPA 20) =====
export { default as ResultHeaderInlineBlock } from './ResultHeaderInlineBlock';
export { default as TestimonialsInlineBlock } from './TestimonialsInlineBlock';
export { default as BeforeAfterInlineBlock } from './BeforeAfterInlineBlock';
export { default as StepHeaderInlineBlock } from './StepHeaderInlineBlock';

// ===== COMPONENTES DE OFERTA (ETAPA 21) =====
export { default as QuizOfferPricingInlineBlock } from './QuizOfferPricingInlineBlock';
export { default as QuizOfferCTAInlineBlock } from './QuizOfferCTAInlineBlock';
export { default as BonusListInlineBlock } from './BonusListInlineBlock';

// ===== COMPONENTES ESPECIALIZADOS QUIZ =====
export { default as QuizIntroHeaderBlock } from './QuizIntroHeaderBlock';
export { default as LoadingAnimationBlock } from './LoadingAnimationBlock';

// ===== COMPONENTES DAS 21 ETAPAS DO FUNIL =====

// Etapa 1: Início
export { default as QuizStartPageInlineBlock } from './QuizStartPageInlineBlock';

// Etapa 2: Informações Pessoais  
export { default as QuizPersonalInfoInlineBlock } from './QuizPersonalInfoInlineBlock';

// Etapa 3: Experiência
export { default as QuizExperienceInlineBlock } from './QuizExperienceInlineBlock';

// Etapas 4-13: Questões do Quiz
export { default as QuizQuestionInlineBlock } from './QuizQuestionInlineBlock';

// Etapas 14-19: Questões Estratégicas
export { default as QuizProgressInlineBlock } from './QuizProgressInlineBlock';
export { default as QuizTransitionInlineBlock } from './QuizTransitionInlineBlock';
export { default as QuizLoadingInlineBlock } from './QuizLoadingInlineBlock';

// Etapa 20: Resultado Completo
export { default as QuizResultInlineBlock } from './QuizResultInlineBlock';
export { default as QuizAnalysisInlineBlock } from './QuizAnalysisInlineBlock';
export { default as QuizCategoryInlineBlock } from './QuizCategoryInlineBlock';
export { default as QuizRecommendationInlineBlock } from './QuizRecommendationInlineBlock';
export { default as QuizMetricsInlineBlock } from './QuizMetricsInlineBlock';
export { default as QuizComparisonInlineBlock } from './QuizComparisonInlineBlock';

// Recursos Avançados do Quiz
export { default as QuizCertificateInlineBlock } from './QuizCertificateInlineBlock';
export { default as QuizLeaderboardInlineBlock } from './QuizLeaderboardInlineBlock';
export { default as QuizBadgesInlineBlock } from './QuizBadgesInlineBlock';
export { default as QuizEvolutionInlineBlock } from './QuizEvolutionInlineBlock';
export { default as QuizNetworkingInlineBlock } from './QuizNetworkingInlineBlock';

// Planos e Desenvolvimento
export { default as QuizActionPlanInlineBlock } from './QuizActionPlanInlineBlock';
export { default as QuizDevelopmentPlanInlineBlock } from './QuizDevelopmentPlanInlineBlock';
export { default as QuizGoalsDashboardInlineBlock } from './QuizGoalsDashboardInlineBlock';

// Etapa 21: Resultado Final e Oferta
export { default as QuizFinalResultsInlineBlock } from './QuizFinalResultsInlineBlock';

// ===== COMPONENTES ADICIONAIS =====
export { default as CharacteristicsListInlineBlock } from './CharacteristicsListInlineBlock';
export { default as SecondaryStylesInlineBlock } from './SecondaryStylesInlineBlock';
export { default as StyleCharacteristicsInlineBlock } from './StyleCharacteristicsInlineBlock';

// Tipos base
export type { BlockComponentProps } from '../../../../types/blocks';


// 🚀 COMPONENTES INLINE COMPLETOS - Quiz Quest Challenge Verse
// MODULAR | REUTILIZÁVEL | RESPONSIVO | LAZY-LOADED | SCHEMA-DRIVEN

import { lazy } from 'react';

// ===== 🔧 COMPONENTES BÁSICOS (sempre carregados) =====
export { default as TextInlineBlock } from './TextInlineBlock';
export { default as HeadingInlineBlock } from './HeadingInlineBlock';
export { default as ButtonInlineBlock } from './ButtonInlineBlock';
export { default as ImageDisplayInlineBlock } from './ImageDisplayInlineBlock';
export { default as BadgeInlineBlock } from './BadgeInlineBlock';
export { default as ProgressInlineBlock } from './ProgressInlineBlock';
export { default as StatInlineBlock } from './StatInlineBlock';
export { default as CountdownInlineBlock } from './CountdownInlineBlock';

// ===== 🎨 COMPONENTES DE ESTILO E DESIGN (lazy-loaded) =====
export const StyleCardInlineBlock = lazy(() => import('./StyleCardInlineBlock'));
export const ResultCardInlineBlock = lazy(() => import('./ResultCardInlineBlock'));
export const PricingCardInlineBlock = lazy(() => import('./PricingCardInlineBlock'));
export const TestimonialCardInlineBlock = lazy(() => import('./TestimonialCardInlineBlock'));

// ===== 🏆 COMPONENTES DE RESULTADO - ETAPA 20 (lazy-loaded) =====
export const ResultHeaderInlineBlock = lazy(() => import('./ResultHeaderInlineBlock'));
export const TestimonialsInlineBlock = lazy(() => import('./TestimonialsInlineBlock'));
export const BeforeAfterInlineBlock = lazy(() => import('./BeforeAfterInlineBlock'));
export const StepHeaderInlineBlock = lazy(() => import('./StepHeaderInlineBlock'));

// ===== 💰 COMPONENTES DE OFERTA - ETAPA 21 (lazy-loaded) =====
export const QuizOfferPricingInlineBlock = lazy(() => import('./QuizOfferPricingInlineBlock'));
export const QuizOfferCTAInlineBlock = lazy(() => import('./QuizOfferCTAInlineBlock'));
export const BonusListInlineBlock = lazy(() => import('./BonusListInlineBlock'));

// ===== 🚀 COMPONENTES ESPECIALIZADOS QUIZ (lazy-loaded) =====
export const QuizIntroHeaderBlock = lazy(() => import('./QuizIntroHeaderBlock'));
export const LoadingAnimationBlock = lazy(() => import('./LoadingAnimationBlock'));

// ===== 🎯 COMPONENTES DAS 21 ETAPAS DO FUNIL (lazy-loaded) =====
export const QuizStartPageInlineBlock = lazy(() => import('./QuizStartPageInlineBlock'));        // Etapa 1
export const QuizPersonalInfoInlineBlock = lazy(() => import('./QuizPersonalInfoInlineBlock'));  // Etapa 2
export const QuizExperienceInlineBlock = lazy(() => import('./QuizExperienceInlineBlock'));      // Etapa 3
export const QuizQuestionInlineBlock = lazy(() => import('./QuizQuestionInlineBlock'));          // Etapas 4-13
export const QuizProgressInlineBlock = lazy(() => import('./QuizProgressInlineBlock'));
export const QuizTransitionInlineBlock = lazy(() => import('./QuizTransitionInlineBlock'));
export const QuizLoadingInlineBlock = lazy(() => import('./QuizLoadingInlineBlock'));
export const QuizResultInlineBlock = lazy(() => import('./QuizResultInlineBlock'));
export const QuizAnalysisInlineBlock = lazy(() => import('./QuizAnalysisInlineBlock'));
export const QuizCategoryInlineBlock = lazy(() => import('./QuizCategoryInlineBlock'));
export const QuizRecommendationInlineBlock = lazy(() => import('./QuizRecommendationInlineBlock'));
export const QuizMetricsInlineBlock = lazy(() => import('./QuizMetricsInlineBlock'));
export const QuizComparisonInlineBlock = lazy(() => import('./QuizComparisonInlineBlock'));
export const QuizCertificateInlineBlock = lazy(() => import('./QuizCertificateInlineBlock'));
export const QuizLeaderboardInlineBlock = lazy(() => import('./QuizLeaderboardInlineBlock'));
export const QuizBadgesInlineBlock = lazy(() => import('./QuizBadgesInlineBlock'));
export const QuizEvolutionInlineBlock = lazy(() => import('./QuizEvolutionInlineBlock'));
export const QuizNetworkingInlineBlock = lazy(() => import('./QuizNetworkingInlineBlock'));
export const QuizActionPlanInlineBlock = lazy(() => import('./QuizActionPlanInlineBlock'));
export const QuizDevelopmentPlanInlineBlock = lazy(() => import('./QuizDevelopmentPlanInlineBlock'));
export const QuizGoalsDashboardInlineBlock = lazy(() => import('./QuizGoalsDashboardInlineBlock'));
export const QuizFinalResultsInlineBlock = lazy(() => import('./QuizFinalResultsInlineBlock'));

// ===== MAPEAMENTO COMPLETO PARA COMPATIBILIDADE =====
import TextInlineBlockComponent from './TextInlineBlock';
import HeadingInlineBlockComponent from './HeadingInlineBlock';
import ButtonInlineBlockComponent from './ButtonInlineBlock';
import ImageDisplayInlineBlockComponent from './ImageDisplayInlineBlock';
import BadgeInlineBlockComponent from './BadgeInlineBlock';
import ProgressInlineBlockComponent from './ProgressInlineBlock';
import StatInlineBlockComponent from './StatInlineBlock';
import CountdownInlineBlockComponent from './CountdownInlineBlock';

export const INLINE_COMPONENTS_MAP = {
  // 🔧 COMPONENTES BÁSICOS (sempre carregados)
  'text-inline': TextInlineBlockComponent,
  'heading-inline': HeadingInlineBlockComponent,
  'button-inline': ButtonInlineBlockComponent,
  'image-display-inline': ImageDisplayInlineBlockComponent,
  'badge-inline': BadgeInlineBlockComponent,
  'progress-inline': ProgressInlineBlockComponent,
  'stat-inline': StatInlineBlockComponent,
  'countdown-inline': CountdownInlineBlockComponent,
  
  // 🎨 COMPONENTES DE ESTILO E DESIGN
  'style-card-inline': StyleCardInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'pricing-card-inline': PricingCardInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  
  // 🏆 COMPONENTES DE RESULTADO - ETAPA 20
  'result-header-inline': ResultHeaderInlineBlock,
  'testimonials-inline': TestimonialsInlineBlock,
  'before-after-inline': BeforeAfterInlineBlock,
  'step-header-inline': StepHeaderInlineBlock,
  
  // 💰 COMPONENTES DE OFERTA - ETAPA 21
  'quiz-offer-pricing-inline': QuizOfferPricingInlineBlock,
  'quiz-offer-cta-inline': QuizOfferCTAInlineBlock,
  'bonus-list-inline': BonusListInlineBlock,
  
  // 🚀 COMPONENTES ESPECIALIZADOS QUIZ
  'quiz-intro-header': QuizIntroHeaderBlock,
  'loading-animation': LoadingAnimationBlock,
  
  // 🎯 COMPONENTES DAS 21 ETAPAS DO FUNIL
  'quiz-start-page-inline': QuizStartPageInlineBlock,           // Etapa 1
  'quiz-personal-info-inline': QuizPersonalInfoInlineBlock,     // Etapa 2
  'quiz-experience-inline': QuizExperienceInlineBlock,          // Etapa 3
  'quiz-question-inline': QuizQuestionInlineBlock,              // Etapas 4-13
  'quiz-progress-inline': QuizProgressInlineBlock,
  'quiz-transition-inline': QuizTransitionInlineBlock,
  'quiz-loading-inline': QuizLoadingInlineBlock,
  'quiz-result-inline': QuizResultInlineBlock,
  'quiz-analysis-inline': QuizAnalysisInlineBlock,
  'quiz-category-inline': QuizCategoryInlineBlock,
  'quiz-recommendation-inline': QuizRecommendationInlineBlock,
  'quiz-metrics-inline': QuizMetricsInlineBlock,
  'quiz-comparison-inline': QuizComparisonInlineBlock,
  'quiz-certificate-inline': QuizCertificateInlineBlock,
  'quiz-leaderboard-inline': QuizLeaderboardInlineBlock,
  'quiz-badges-inline': QuizBadgesInlineBlock,
  'quiz-evolution-inline': QuizEvolutionInlineBlock,
  'quiz-networking-inline': QuizNetworkingInlineBlock,
  'quiz-action-plan-inline': QuizActionPlanInlineBlock,
  'quiz-development-plan-inline': QuizDevelopmentPlanInlineBlock,
  'quiz-goals-dashboard-inline': QuizGoalsDashboardInlineBlock,
  'quiz-final-results-inline': QuizFinalResultsInlineBlock,
};

// ===== LISTA DE TODOS OS COMPONENTES DISPONÍVEIS =====
export const AVAILABLE_INLINE_COMPONENTS = Object.keys(INLINE_COMPONENTS_MAP);

// ===== EXPORT DEFAULT PARA COMPATIBILIDADE =====
export default INLINE_COMPONENTS_MAP;


// Componentes Inline Modulares - Lazy Loading Otimizado
// MODULAR | REUTILIZÁVEL | RESPONSIVO | LAZY-LOADED

import { lazy } from 'react';

// ===== COMPONENTES BÁSICOS (sempre carregados) =====
export { default as TextInlineBlock } from './TextInlineBlock';

// Import other basic components with fallback paths
const HeadingInlineBlock = lazy(() => import('./HeadingInlineBlock').catch(() => import('../HeadingInlineBlock')));
const ButtonInlineBlock = lazy(() => import('./ButtonInlineBlock').catch(() => import('../ButtonInlineBlock')));
const BadgeInlineBlock = lazy(() => import('./BadgeInlineBlock'));

export { HeadingInlineBlock, ButtonInlineBlock, BadgeInlineBlock };

// ===== COMPONENTES LAZY-LOADED (carregados sob demanda) =====

// Componentes de Imagem e Mídia
export const ImageDisplayInlineBlock = lazy(() => import('./ImageDisplayInlineBlock'));
export const ProgressInlineBlock = lazy(() => import('./ProgressInlineBlock'));
export const StatInlineBlock = lazy(() => import('./StatInlineBlock'));
export const CountdownInlineBlock = lazy(() => import('./CountdownInlineBlock'));

// Componentes de Estilo e Design (pesados)
export const StyleCardInlineBlock = lazy(() => import('./StyleCardInlineBlock'));
export const ResultCardInlineBlock = lazy(() => import('./ResultCardInlineBlock'));
export const PricingCardInlineBlock = lazy(() => import('./PricingCardInlineBlock'));
export const TestimonialCardInlineBlock = lazy(() => import('./TestimonialCardInlineBlock'));

// Componentes de Resultado (Etapa 20)
export const ResultHeaderInlineBlock = lazy(() => import('./ResultHeaderInlineBlock'));
export const TestimonialsInlineBlock = lazy(() => import('./TestimonialsInlineBlock'));
export const BeforeAfterInlineBlock = lazy(() => import('./BeforeAfterInlineBlock'));
export const StepHeaderInlineBlock = lazy(() => import('./StepHeaderInlineBlock'));

// Componentes de Oferta (Etapa 21)
export const QuizOfferPricingInlineBlock = lazy(() => import('./QuizOfferPricingInlineBlock'));
export const QuizOfferCTAInlineBlock = lazy(() => import('./QuizOfferCTAInlineBlock'));
export const BonusListInlineBlock = lazy(() => import('./BonusListInlineBlock'));

// Componentes Especializados Quiz
export const QuizIntroHeaderBlock = lazy(() => import('./QuizIntroHeaderBlock'));
export const LoadingAnimationBlock = lazy(() => import('./LoadingAnimationBlock'));

// ===== COMPONENTES DAS 21 ETAPAS DO FUNIL (LAZY-LOADED) =====

// Etapa 1: Início
export const QuizStartPageInlineBlock = lazy(() => import('./QuizStartPageInlineBlock'));

// Etapa 2: Informações Pessoais  
export const QuizPersonalInfoInlineBlock = lazy(() => import('./QuizPersonalInfoInlineBlock'));

// Etapa 3: Experiência
export const QuizExperienceInlineBlock = lazy(() => import('./QuizExperienceInlineBlock'));

// Etapa 4: Certificado
export const QuizCertificateInlineBlock = lazy(() => import('./QuizCertificateInlineBlock'));

// Etapa 5: Leaderboard
export const QuizLeaderboardInlineBlock = lazy(() => import('./QuizLeaderboardInlineBlock'));

// Etapa 6: Carregamento
export const QuizLoadingInlineBlock = lazy(() => import('./QuizLoadingInlineBlock'));

// Etapa 7: Questão
export const QuizQuestionInlineBlock = lazy(() => import('./QuizQuestionInlineBlock'));

// Etapa 8: Resultado
export const QuizResultInlineBlock = lazy(() => import('./QuizResultInlineBlock'));

// Etapa 9: Transição
export const QuizTransitionInlineBlock = lazy(() => import('./QuizTransitionInlineBlock'));

// Etapa 10: Progresso
export const QuizProgressInlineBlock = lazy(() => import('./QuizProgressInlineBlock'));

// ===== MAPEAMENTO PARA COMPATIBILIDADE =====
// Import TextInlineBlock to avoid the undefined error
import TextInlineBlockComponent from './TextInlineBlock';

export const INLINE_COMPONENTS_MAP = {
  // Componentes básicos (sempre carregados)
  'text-inline': TextInlineBlockComponent,
  'heading-inline': HeadingInlineBlock,
  'button-inline': ButtonInlineBlock,
  'badge-inline': BadgeInlineBlock,
  
  // Componentes lazy-loaded
  'image-display-inline': ImageDisplayInlineBlock,
  'progress-inline': ProgressInlineBlock,
  'stat-inline': StatInlineBlock,
  'countdown-inline': CountdownInlineBlock,
  'style-card-inline': StyleCardInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'pricing-card-inline': PricingCardInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  
  // Componentes de resultado
  'result-header-inline': ResultHeaderInlineBlock,
  'testimonials-inline': TestimonialsInlineBlock,
  'before-after-inline': BeforeAfterInlineBlock,
  'step-header-inline': StepHeaderInlineBlock,
  
  // Componentes de oferta
  'quiz-offer-pricing-inline': QuizOfferPricingInlineBlock,
  'quiz-offer-cta-inline': QuizOfferCTAInlineBlock,
  'bonus-list-inline': BonusListInlineBlock,
  
  // Componentes especializados
  'quiz-intro-header': QuizIntroHeaderBlock,
  'loading-animation': LoadingAnimationBlock,
  
  // 21 etapas do funil
  'quiz-start-page-inline': QuizStartPageInlineBlock,
  'quiz-personal-info-inline': QuizPersonalInfoInlineBlock,
  'quiz-experience-inline': QuizExperienceInlineBlock,
  'quiz-certificate-inline': QuizCertificateInlineBlock,
  'quiz-leaderboard-inline': QuizLeaderboardInlineBlock,
  'quiz-loading-inline': QuizLoadingInlineBlock,
  'quiz-question-inline': QuizQuestionInlineBlock,
  'quiz-result-inline': QuizResultInlineBlock,
  'quiz-transition-inline': QuizTransitionInlineBlock,
  'quiz-progress-inline': QuizProgressInlineBlock,
};

// ===== LISTA DE TODOS OS COMPONENTES DISPONÍVEIS =====
export const AVAILABLE_INLINE_COMPONENTS = Object.keys(INLINE_COMPONENTS_MAP);

// ===== EXPORT DEFAULT PARA COMPATIBILIDADE =====
export default INLINE_COMPONENTS_MAP;

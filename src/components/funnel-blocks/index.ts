/**
 * Componentes reutilizáveis para funis
 *
 * Este módulo exporta todos os componentes necessários para construir
 * um funil completo com 21 etapas, incluindo componentes de etapa,
 * componentes compartilhados, editor e hooks.
 */

// Etapas do funil (Steps)
export { default as FunnelIntroStep } from './steps/FunnelIntroStep';
export { default as NameCollectStep } from './steps/NameCollectStep';
export { default as QuizIntroStep } from './steps/QuizIntroStep';
export { default as QuestionMultipleStep } from './steps/QuestionMultipleStep';
export { default as ProcessingStep } from './steps/ProcessingStep';
export { default as OfferTransitionStep } from './steps/OfferTransitionStep';
export { default as OfferPageStep } from './steps/OfferPageStep';

// Componentes compartilhados (Shared)
export { default as FunnelProgressBar } from './shared/FunnelProgressBar';
export { default as QuizOption } from './shared/QuizOption';
export { default as CountdownTimer } from './shared/CountdownTimer';
export { default as ResultCard } from './shared/ResultCard';
export { StyleGuideViewer } from './shared/StyleGuideViewer';
export { default as OfferCard } from './shared/OfferCard';

// Editor components
export { default as FunnelConfigProvider, useFunnelConfig } from './editor/FunnelConfigProvider';

// Hooks
export { useFunnelNavigation } from './hooks/useFunnelNavigation';

// Tipos
export * from '@/types/funnel';

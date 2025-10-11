/**
 * 🎯 QUIZ COMPONENTS - Barrel Exports
 * 
 * Ponto único de exportação para todos os componentes relacionados a Quiz.
 * Organizado por categoria para facilitar imports.
 * 
 * @example
 * // Importação facilitada:
 * import { QuizApp, QuizNavigation, IntroStep } from '@/components/quiz';
 * 
 * // Ao invés de:
 * import QuizApp from '@/components/quiz/QuizApp';
 * import QuizNavigation from '@/components/quiz/QuizNavigation';
 * import IntroStep from '@/components/quiz/IntroStep';
 */

// ========================================
// COMPONENTES PRINCIPAIS
// ========================================

/**
 * Componente principal do Quiz
 * Renderiza o quiz completo com navegação e gerenciamento de estado
 */
export { default as QuizApp } from './QuizApp';
export { default as QuizAppConnected } from './QuizAppConnected';
export { default as QuizAppDirect } from './QuizAppDirect';

/**
 * Provider de contexto para Quiz com 21 steps
 */
export { default as Quiz21StepsProvider } from './Quiz21StepsProvider';

/**
 * Navegação do Quiz
 */
export { default as QuizNavigation } from './QuizNavigation';
export { default as Quiz21StepsNavigation } from './Quiz21StepsNavigation';

/**
 * Container e Wrapper
 */
export { default as QuizContainer } from './QuizContainer';
export { default as QuizRunnerShell } from './QuizRunnerShell';
export { default as ConnectedTemplateWrapper } from './ConnectedTemplateWrapper';

// ========================================
// STEPS (ETAPAS DO QUIZ)
// ========================================

/**
 * Step 1: Introdução
 */
export { default as IntroStep } from './IntroStep';
export { default as IntroStepNew } from './IntroStepNew';
export { default as IntroStepSimple } from './IntroStepSimple';
export { default as IntroStepFixed } from './IntroStepFixed';

/**
 * Step 2+: Perguntas
 */
export { default as QuestionStep } from './QuestionStep';
export { default as QuestionComponent } from './QuestionComponent';
export { default as StrategicQuestionStep } from './StrategicQuestionStep';

/**
 * Steps de Transição
 */
export { default as TransitionStep } from './TransitionStep';
export { default as MainTransition } from './MainTransition';

/**
 * Step Final: Resultado
 */
export { default as ResultStep } from './ResultStep';

/**
 * Step de Oferta
 */
export { default as OfferStep } from './OfferStep';

// ========================================
// COMPONENTES DE UI
// ========================================

/**
 * Opções de resposta
 */
export { default as QuizOption } from './QuizOption';
export { default as QuizOptionImage } from './QuizOptionImage';

/**
 * Navegação e Progresso
 */
export { default as QuizProgress } from './QuizProgress';
export { default as QuizHeader } from './QuizHeader';

/**
 * Conteúdo e Perguntas
 */
export { default as QuizContent } from './QuizContent';
export { default as QuizContentWithTracking } from './QuizContentWithTracking';
export { default as QuizQuestion } from './QuizQuestion';

/**
 * Formulários
 */
export { default as AnimatedNameForm } from './AnimatedNameForm';

/**
 * Acessibilidade
 */
export { default as AccessibilityTip } from './AccessibilityTip';

// ========================================
// COMPONENTES DE SISTEMA
// ========================================

/**
 * Loading e Estados
 */
export { default as QuizLoadingScreen } from './QuizLoadingScreen';
export { default as LoadingManager } from './LoadingManager';

/**
 * Error Handling
 */
export { default as QuizErrorBoundary } from './QuizErrorBoundary';

/**
 * Preview e Visualização
 */
export { default as QuizPreview } from './QuizPreview';
export { default as QuizOptimizedRenderer } from './QuizOptimizedRenderer';

/**
 * Backend Integration
 */
export { default as QuizBackendStatus } from './QuizBackendStatus';

/**
 * Validação e Métricas
 */
export { default as QuizResultValidator } from './QuizResultValidator';
export { default as QuizResultMetrics } from './QuizResultMetrics';

/**
 * Data Viewer
 */
export { default as QuizDataViewer } from './QuizDataViewer';

/**
 * Resultados
 */
export { default as QuizResults } from './QuizResults';

// ========================================
// SUB-MÓDULOS
// ========================================

/**
 * Builder Components
 * @see src/components/quiz/builder/
 */
export * from './builder';

/**
 * Editor Components
 * @see src/components/quiz/editor/
 */
export * from './editor';

/**
 * Offer Components
 * @see src/components/quiz/offer/
 */
export * from './offer';

/**
 * Result Pages
 * @see src/components/quiz/result-pages/
 */
export * from './result-pages';

/**
 * Quiz UI Components
 * @see src/components/quiz/components/
 */
export * from './components';

// ========================================
// IMPLEMENTAÇÕES ESPECÍFICAS
// ========================================

/**
 * Cakto Quiz (implementação específica)
 */
export { default as CaktoQuizImplementation } from './CaktoQuizImplementation';
export { default as CaktoQuizQuestion } from './CaktoQuizQuestion';
export { default as CaktoQuizResult } from './CaktoQuizResult';

/**
 * Step 20 Fallback
 */
export { default as Step20FallbackTemplate } from './Step20FallbackTemplate';

/**
 * Step 2 Direct
 */
export { default as Step2Direct } from './Step2Direct';

/**
 * Strategic Questions
 */
export { default as StrategicQuestions } from './StrategicQuestions';

// ========================================
// TIPOS E INTERFACES
// ========================================

/**
 * Re-export de tipos comuns
 * (adicionar conforme necessário)
 */

// TODO: Adicionar types quando consolidados
// export type { QuizStep, QuizQuestion, QuizAnswer } from './types';

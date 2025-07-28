/**
 * Componentes de Quiz Reutilizáveis - ETAPAS 1-19 DO FUNIL COMPLETO
 * 
 * Blocos 100% editáveis para uso no editor visual /editor
 * Cada componente é totalmente configurável via props e pode ser usado
 * independentemente ou integrado com o DynamicBlockRenderer.
 * 
 * COBERTURA COMPLETA:
 * - Etapa 1: Introdução e coleta de nome ✅
 * - Etapas 2-11: 10 questões normais do quiz ✅
 * - Etapa 12: Transição 1 (calculando resultado) ✅
 * - Etapas 13-18: 6 questões estratégicas ✅
 * - Etapa 19: Transição 2 (preparando resultado) ✅
 */

// Blocos principais do quiz (implementados)
export { default as QuizQuestionBlock } from './QuizQuestionBlock';
export { default as QuizProgressBlock } from './QuizProgressBlock';
export { default as QuizNavigationBlock } from './QuizNavigationBlock';
export { default as QuizTransitionBlock } from './QuizTransitionBlock';

// Blocos específicos para etapas especiais (implementados)
export { default as QuizIntroBlock } from './QuizIntroBlock';
export { default as StartButtonBlock } from './StartButtonBlock';
export { default as QuizBenefitsBlock } from './QuizBenefitsBlock';
export { default as StrategicQuestionBlock } from './StrategicQuestionBlock';
export { default as LoadingTransitionBlock } from './LoadingTransitionBlock';

// Re-export types para facilitar importação
export type { QuizQuestionBlockProps, QuestionOption } from './QuizQuestionBlock';
export type { QuizProgressBlockProps } from './QuizProgressBlock';
export type { QuizNavigationBlockProps } from './QuizNavigationBlock';
export type { QuizTransitionBlockProps } from './QuizTransitionBlock';

// Types dos blocos específicos
export type { QuizIntroBlockProps } from './QuizIntroBlock';
export type { StartButtonBlockProps } from './StartButtonBlock';
export type { QuizBenefitsBlockProps, BenefitItem } from './QuizBenefitsBlock';
export type { StrategicQuestionBlockProps } from './StrategicQuestionBlock';
export type { LoadingTransitionBlockProps } from './LoadingTransitionBlock';

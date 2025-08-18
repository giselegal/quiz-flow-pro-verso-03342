/**
 * 🎯 TIPOS E INTERFACES DO SISTEMA INTERATIVO DE QUIZ
 *
 * Definições TypeScript para todo o sistema de quiz interativo
 */

// Importar tipos do editor principal
import type { Block } from '../../../types/editor';

/**
 * Estado global do quiz
 */
export interface QuizState {
  currentStep: number;
  totalSteps: number;
  answers: Record<string, QuizAnswer>;
  scores: Record<string, number>;
  isComplete: boolean;
  startTime: Date;
  completionTime?: Date;
  userName?: string;
  sessionId: string;
}

/**
 * Resposta individual do quiz
 */
export interface QuizAnswer {
  blockId: string;
  blockType: string;
  value: any;
  timestamp: Date;
  isValid: boolean;
  category?: string;
  points?: number;
}

/**
 * Estado de validação de campos
 */
export interface QuizValidation {
  isValid: boolean;
  errors: Record<string, string>;
  hasInteracted: Record<string, boolean>;
  requiredFields: string[];
}

/**
 * Configuração de uma etapa do quiz
 */
export interface QuizStep {
  id: string;
  title?: string;
  description?: string;
  blocks: Block[];
  validation?: {
    required: boolean;
    customRules?: ValidationRule[];
  };
  scoring?: {
    category: string;
    pointsMapping: Record<string, number>;
  };
}

/**
 * Configuração geral do quiz
 */
export interface QuizConfig {
  id: string;
  title: string;
  description?: string;
  steps: QuizStep[];
  settings: {
    autoSave: boolean;
    showProgress: boolean;
    allowBack: boolean;
    requireValidation: boolean;
    showDebugInfo: boolean;
    timeLimit?: number;
  };
  scoring: {
    categories: string[];
    resultCalculation: 'highest' | 'weighted' | 'percentage';
    resultMappings: QuizResultMapping[];
  };
}

/**
 * Mapeamento de resultados
 */
export interface QuizResultMapping {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  minScore: number;
  maxScore?: number;
  characteristics: string[];
  recommendations: string[];
  color: string;
  icon: string;
}

/**
 * Resultado final do quiz
 */
export interface QuizResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  score: number;
  percentage: number;
  characteristics: string[];
  recommendations: string[];
  color: string;
  icon: string;
  isPrimary?: boolean;
}

/**
 * Regra de validação customizada
 */
export interface ValidationRule {
  field: string;
  rule: 'required' | 'email' | 'phone' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

/**
 * Props do canvas interativo principal
 */
export interface InteractiveQuizCanvasProps {
  blocks: Block[];
  config?: Partial<QuizConfig>;
  userName?: string;
  onComplete?: (results: QuizResult[]) => void;
  onProgress?: (state: QuizState) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Props do renderizador de blocos
 */
export interface InteractiveBlockRendererProps {
  block: Block;
  value?: any;
  onChange: (value: any) => void;
  onValidation: (isValid: boolean) => void;
  isInteracted: boolean;
  onInteraction: () => void;
  className?: string;
}

/**
 * Props da navegação
 */
export interface QuizNavigationProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  validationState: QuizValidation;
  onStepClick?: (step: number) => void;
  showStepNumbers?: boolean;
  showProgressText?: boolean;
  className?: string;
}

/**
 * Props das ações
 */
export interface QuizActionsProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isFormValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onRestart?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  showSaveButton?: boolean;
  showShareButton?: boolean;
  isLoading?: boolean;
  customNextText?: string;
  customPrevText?: string;
}

/**
 * Props do cabeçalho
 */
export interface QuizHeaderProps {
  userName: string;
  currentStep: number;
  totalSteps: number;
  scores?: Record<string, number>;
}

/**
 * Props das mensagens de validação
 */
export interface ValidationMessagesProps {
  validationState: Record<string, boolean>;
  hasInteractedWith: Record<string, boolean>;
  blockTypes: Record<string, string>;
  className?: string;
}

/**
 * Props dos resultados
 */
export interface QuizResultsProps {
  results: QuizResult[];
  primaryResult: QuizResult;
  userName?: string;
  onShare?: (result: QuizResult) => void;
  onDownload?: (result: QuizResult) => void;
  onRestart?: () => void;
  showDetailedBreakdown?: boolean;
}

/**
 * Eventos do sistema de quiz
 */
export interface QuizEvents {
  onStepChange: (step: number) => void;
  onAnswerChange: (blockId: string, answer: QuizAnswer) => void;
  onValidationChange: (validation: QuizValidation) => void;
  onComplete: (results: QuizResult[]) => void;
  onRestart: () => void;
  onSave: (state: QuizState) => void;
  onLoad: (state: QuizState) => void;
}

/**
 * Contexto do quiz
 */
export interface QuizContextValue {
  state: QuizState;
  validation: QuizValidation;
  config: QuizConfig;
  actions: {
    setAnswer: (blockId: string, value: any) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    restart: () => void;
    complete: () => void;
  };
  results?: QuizResult[];
}

/**
 * Tipos de blocos suportados no modo interativo
 */
export type InteractiveBlockType =
  | 'quiz-question-inline'
  | 'input-field'
  | 'headline'
  | 'text'
  | 'image'
  | 'spacer'
  | 'button';

/**
 * Tipos de entrada de dados
 */
export type InputType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'range'
  | 'date';

/**
 * Estados de validação
 */
export type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

/**
 * Modos de exibição
 */
export type DisplayMode = 'step-by-step' | 'single-page' | 'accordion';

/**
 * Temas visuais
 */
export type QuizTheme = 'default' | 'minimal' | 'modern' | 'colorful' | 'corporate';

/**
 * Utilitários de tipo
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

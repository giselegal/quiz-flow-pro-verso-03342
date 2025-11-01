/**
 * Tipos canônicos para o Quiz de 21 etapas
 * Extraídos do antigo src/data/quizSteps.ts (DEPRECATED) para evitar dependência de arquivo legado.
 */

export interface QuizOptionV3 {
  id: string;
  text: string;
  image?: string;
}

export interface OfferContentV3 {
  title: string;
  description: string;
  buttonText: string;
  testimonial: {
    quote: string;
    author: string;
  };
}

export interface QuizStepV3 {
  id?: string; // ex.: 'step-02'
  type:
    | 'intro'
    | 'question'
    | 'strategic-question'
    | 'transition'
    | 'transition-result'
    | 'result'
    | 'offer';
  title?: string;
  questionNumber?: string;
  questionText?: string;
  formQuestion?: string;
  placeholder?: string;
  buttonText?: string;
  text?: string;
  image?: string;
  requiredSelections?: number;
  options?: QuizOptionV3[];
  nextStep?: string;
  offerMap?: Record<string, OfferContentV3>;
  // Propriedades opcionais para transição
  showContinueButton?: boolean;
  continueButtonText?: string;
  duration?: number; // ms
}

export type StepsRecordV3 = Record<string, QuizStepV3>;
/**
 * 🎯 QUIZ TYPES - Type Safety para Quiz Components
 */

export interface QuizOption {
  id: string;
  label: string;
  value: string;
  text?: string; // Legacy compatibility
  styleCategory?: string; // Legacy compatibility
  imageUrl?: string; // Legacy compatibility
  style?: string; // Legacy compatibility - for quiz data
  isCorrect?: boolean;
  weight?: number;
}

export interface QuizResponse {
  questionId: string;
  selectedOptions: string[];
  textResponse?: string;
  timestamp: string;
}

export interface UserResponse {
  questionId: string;
  answer: string | string[];
  timestamp: string;
}

// Legacy compatibility
export interface QuizAnswer {
  questionId: string;
  selectedOptions: string[];
  value: string | string[];
  timestamp: string;
  optionId?: string; // Legacy compatibility
  weight?: number; // Legacy compatibility
  weights?: Record<string, number>; // Legacy compatibility
}

export interface QuizStage {
  id: string;
  title: string;
  description?: string;
  order: number;
  isCompleted: boolean;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'single-choice' | 'text' | 'rating' | 'normal' | 'name-input' | 'both' | 'image';
  title: string;
  text?: string; // Legacy compatibility
  question?: string; // Legacy compatibility
  description?: string;
  required: boolean;
  options?: QuizOption[];
  multiSelect?: number;
  order?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// Define StyleType as union of style string literals
export type StyleType = 
  | 'natural' 
  | 'classico' 
  | 'contemporâneo' 
  | 'elegante' 
  | 'romântico' 
  | 'sexy' 
  | 'dramático' 
  | 'criativo';

export interface StyleResult {
  id: string;
  name: string;
  description: string;
  type: StyleType;
  score: number;
  characteristics: string[];
  recommendations: string[];
  colors: string[];
  images: string[];
  imageUrl?: string; // Legacy compatibility
  guideImageUrl?: string; // Legacy compatibility
  keywords?: string[]; // Legacy compatibility
  // Legacy compatibility
  category?: string;
  percentage?: number;
  style?: string;
  points?: number;
  rank?: number;
}

// Legacy compatibility export
export interface Style extends StyleResult {}
export type StyleTypeCompat = string;
export type QuizComponentStyle = string;

export interface QuizResult {
  id: string;
  userId?: string;
  responses: Record<string, any>;
  score: number;
  maxScore: number;
  completedAt: string;
  styleResult?: StyleResult;
  // Legacy compatibility
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  totalQuestions?: number;
  userData?: any;
  predominantStyle?: StyleResult;
  complementaryStyles?: StyleResult[];
  styleScores?: Record<string, number>;
}

export interface QuizFunnel {
  id: string;
  name: string;
  description?: string;
  questions: QuizQuestion[];
  results: StyleResult[];
}

// QuizStep interface for editor components
export interface QuizStep {
  id: string;
  type: string;
  title: string;
  description?: string;
  // Campos legados usados por componentes existentes (compatibilidade)
  text?: string;
  image?: string;
  formQuestion?: string;
  placeholder?: string;
  buttonText?: string;
  questionText?: string;
  offerMap?: Record<string, OfferContentV3>;
  options?: Array<QuizOptionV3 | QuizOption>;
  // Campos de resultado/fluxo
  resultKey?: string;
  answers?: QuizOption[];
  components?: any[];
}

// Block type can be either string or object
export type BlockType = string | {
  id: string;
  name: string;
  category: string;
  component: string;
  props?: Record<string, any>;
};

// Export ComputedResult for backward compatibility
export interface ComputedResult extends QuizResult {}
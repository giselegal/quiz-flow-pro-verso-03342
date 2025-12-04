/**
 * 🎯 CANONICAL QUIZ TYPE DEFINITION
 * 
 * Fonte única de verdade para tipos de Quiz em todo o projeto.
 * 
 * @canonical
 */

import type { Block } from './block';

// =============================================================================
// QUIZ OPTION
// =============================================================================

export interface QuizOption {
  id: string;
  text: string;
  label?: string;
  value?: string;
  imageUrl?: string;
  image?: string; // Legacy
  category?: string;
  styleCategory?: string;
  style?: string;
  points?: number;
  weight?: number;
  isCorrect?: boolean;
}

// =============================================================================
// QUIZ STEP TYPES
// =============================================================================

export type QuizStepType =
  | 'intro'
  | 'question'
  | 'strategic-question'
  | 'transition'
  | 'transition-result'
  | 'result'
  | 'offer'
  | 'name-input'
  | 'form';

// =============================================================================
// QUIZ STEP
// =============================================================================

export interface QuizStep {
  id: string;
  type: QuizStepType;
  order?: number;
  title?: string;
  description?: string;
  
  // Question fields
  questionNumber?: string;
  questionText?: string;
  question?: string;
  
  // Form fields
  formQuestion?: string;
  placeholder?: string;
  
  // Content fields
  text?: string;
  image?: string;
  buttonText?: string;
  
  // Options
  options?: QuizOption[];
  requiredSelections?: number;
  multiSelect?: number;
  
  // Navigation
  nextStep?: string;
  
  // Transition
  showContinueButton?: boolean;
  continueButtonText?: string;
  duration?: number;
  
  // Result
  resultKey?: string;
  offerMap?: Record<string, OfferContent>;
  
  // Blocks (for v4 format)
  blocks?: Block[];
  components?: unknown[];
}

// =============================================================================
// QUIZ QUESTION
// =============================================================================

export type QuizQuestionType =
  | 'multiple-choice'
  | 'single-choice'
  | 'text'
  | 'rating'
  | 'normal'
  | 'name-input'
  | 'both'
  | 'image';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  title: string;
  text?: string;
  question?: string;
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

// =============================================================================
// QUIZ RESPONSE / ANSWER
// =============================================================================

export interface QuizResponse {
  questionId: string;
  selectedOptions: string[];
  textResponse?: string;
  timestamp: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  selectedOptions?: string[];
  textResponse?: string;
  timestamp: string;
  timeSpent?: number;
  isCorrect?: boolean;
  confidence?: number;
  weight?: number;
  
  // Legacy
  optionId?: string;
  weights?: Record<string, number>;
  normalizedOptions?: Array<{
    id: string;
    label: string;
    value: string;
    score: { category: string; points: number };
  }>;
}

/** @deprecated Use QuizAnswer */
export type UserResponse = QuizAnswer;

/** @deprecated Use QuizAnswer */
export type Answer = QuizAnswer;

/** @deprecated Use QuizAnswer */
export type UserAnswer = QuizAnswer;

// =============================================================================
// QUIZ STAGE
// =============================================================================

export interface QuizStage {
  id: string;
  title: string;
  description?: string;
  order: number;
  isCompleted: boolean;
  questions: QuizQuestion[];
}

// =============================================================================
// STYLE RESULT
// =============================================================================

export type StyleType =
  | 'natural'
  | 'classico'
  | 'contemporâneo'
  | 'elegante'
  | 'romântico'
  | 'sexy'
  | 'dramático'
  | 'criativo'
  | string;

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
  imageUrl?: string;
  guideImageUrl?: string;
  keywords?: string[];
  category?: string;
  percentage?: number;
  style?: string;
  points?: number;
  rank?: number;
}

/** @deprecated Use StyleResult */
export type Style = StyleResult;

// =============================================================================
// QUIZ RESULT
// =============================================================================

export interface QuizResult {
  id: string;
  userId?: string;
  responses: Record<string, unknown>;
  score: number;
  maxScore: number;
  completedAt: string;
  styleResult?: StyleResult;
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  totalQuestions?: number;
  userData?: unknown;
  predominantStyle?: StyleResult;
  complementaryStyles?: StyleResult[];
  styleScores?: Record<string, number>;
}

/** @deprecated Use QuizResult */
export type ComputedResult = QuizResult;

// =============================================================================
// OFFER CONTENT
// =============================================================================

export interface OfferContent {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl?: string;
  price?: string | number;
  originalPrice?: string | number;
  testimonial?: {
    quote: string;
    author: string;
    image?: string;
  };
  benefits?: string[];
  guarantee?: string;
}

// =============================================================================
// QUIZ DEFINITION
// =============================================================================

export interface QuizDefinition {
  id: string;
  title: string;
  description?: string;
  type: 'personality' | 'assessment' | 'survey' | 'custom';
  isActive: boolean;
  settings?: QuizSettings;
  steps: QuizStep[];
  questions?: QuizQuestion[];
  outcomes?: QuizOutcome[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizSettings {
  showProgress?: boolean;
  showBackButton?: boolean;
  allowSkip?: boolean;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  timeLimit?: number;
  passingScore?: number;
}

export interface QuizOutcome {
  id: string;
  key: string;
  title: string;
  description?: string;
  minScore?: number;
  maxScore?: number;
  content?: OfferContent;
  imageUrl?: string;
}

// =============================================================================
// QUIZ SESSION
// =============================================================================

export interface QuizSession {
  id: string;
  quizId?: string;
  funnelId?: string;
  userId?: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  currentStep: number;
  totalSteps: number;
  score?: number;
  maxScore?: number;
  responses: QuizAnswer[];
  result?: QuizResult;
  startedAt: string;
  completedAt?: string;
  lastActivity: string;
  metadata?: Record<string, unknown>;
  deviceInfo?: Record<string, unknown>;
}

// =============================================================================
// QUIZ FUNNEL
// =============================================================================

export interface QuizFunnel {
  id: string;
  name: string;
  description?: string;
  questions: QuizQuestion[];
  results: StyleResult[];
  steps?: QuizStep[];
}

// =============================================================================
// LEGACY V3 TYPES (for backward compatibility)
// =============================================================================

/** @deprecated Use QuizOption */
export interface QuizOptionV3 {
  id: string;
  text: string;
  image?: string;
}

/** @deprecated Use OfferContent */
export interface OfferContentV3 {
  title: string;
  description: string;
  buttonText: string;
  testimonial: {
    quote: string;
    author: string;
  };
}

/** @deprecated Use QuizStep */
export interface QuizStepV3 {
  id?: string;
  type: QuizStepType;
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
  showContinueButton?: boolean;
  continueButtonText?: string;
  duration?: number;
}

/** @deprecated Use Record<string, QuizStep> */
export type StepsRecordV3 = Record<string, QuizStepV3>;

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isQuizStep(value: unknown): value is QuizStep {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'type' in value
  );
}

export function isQuizOption(value: unknown): value is QuizOption {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'text' in value
  );
}

export function isQuizResult(value: unknown): value is QuizResult {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'score' in value
  );
}

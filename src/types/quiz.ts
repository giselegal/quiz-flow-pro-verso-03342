/**
 * 🎯 QUIZ TYPES - Type Safety para Quiz Components
 */

export interface QuizOption {
  id: string;
  label: string;
  value: string;
  text?: string; // Legacy compatibility
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
  type: 'multiple-choice' | 'single-choice' | 'text' | 'rating' | 'normal';
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
  // Legacy compatibility
  category?: string;
  percentage?: number;
  style?: string;
}

export interface StyleType {
  id: string;
  name: string;
  category: string;
  description: string;
}

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
}

export interface QuizFunnel {
  id: string;
  name: string;
  description?: string;
  questions: QuizQuestion[];
  results: StyleResult[];
}

export interface BlockType {
  id: string;
  name: string;
  category: string;
  component: string;
  props?: Record<string, any>;
}
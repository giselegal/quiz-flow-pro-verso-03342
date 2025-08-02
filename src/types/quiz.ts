
export type StyleType = 
  | 'classico'
  | 'romantico'
  | 'dramatico'
  | 'natural'
  | 'criativo'
  | 'elegante'
  | 'sensual'
  | 'contemporaneo';

export interface Style {
  id: StyleType;
  name: string;
  description: string;
  imageUrl: string;
  guideImageUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  keywords: string[];
}

export interface QuizOption {
  id: string;
  text: string;
  style: StyleType;
  imageUrl?: string;
  weight?: number;
  styleCategory?: string;
  points?: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  style?: QuizComponentStyle;
  // Additional properties for editor compatibility
  title?: string;
  question?: string;
  order?: number;
  type?: string;
  multiSelect?: number;
}

export interface QuizComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  paddingY?: string;
  paddingX?: string;
  borderRadius?: string;
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface UserResponse {
  questionId: string;
  optionId: string;
  timestamp?: Date;
}

export interface StyleResult {
  category: string;
  score: number;
  percentage: number;
  style: string;
  points: number;
  rank: number;
}

export interface QuizResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  totalQuestions: number;
  completedAt: Date;
  scores: Record<string, number>;
}

export interface QuizFunnel {
  id: string;
  name: string;
  description: string;
  questions: QuizQuestion[];
  style?: QuizComponentStyle;
  settings?: {
    showProgressBar?: boolean;
    autoAdvance?: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  userName?: string;
  displayName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type StyleType =
  | 'natural'
  | 'classico'
  | 'contemporâneo'
  | 'elegante'
  | 'romântico'
  | 'sexy'
  | 'dramático'
  | 'criativo';

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
  style?: StyleType;
  imageUrl?: string;
  weight?: number;
  styleCategory?: string;
  points?: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  text: string;
  question?: string; // Make optional for backward compatibility
  options: QuizOption[];
  style?: QuizComponentStyle;
  // Additional properties for editor compatibility
  title?: string;
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
  optionId?: string;
  selectedOptions?: string[];
  timestamp?: Date;
}

// QuizResponse interface for compatibility
export interface QuizResponse {
  questionId: string;
  selectedOptions: string[];
  timestamp: Date;
}

export interface StyleScore {
  style: StyleType;
  points: number;
  percentage: number;
  rank: number;
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
  // Additional properties for compatibility
  predominantStyle?: string;
  complementaryStyles?: string[];
  styleScores?: Record<string, number>;
  participantName?: string;
  // ✅ NOVO: Dados personalizados do usuário
  userData?: {
    name?: string;
    completionTime?: Date;
    strategicAnswersCount?: number;
  };
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

// Add BlockType export
export type BlockType =
  | 'headline'
  | 'text'
  | 'image'
  | 'button'
  | 'heading'
  | 'paragraph'
  | 'spacer';

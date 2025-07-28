// Tipos para o sistema de quiz e cálculo de estilos CaktoQuiz

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

export interface QuizQuestion {
  id: string;
  order: number;
  question: string;
  title?: string; // Adicionado para compatibilidade
  type: 'normal' | 'strategic' | 'text' | 'both' | 'image'; // Expandido para compatibilidade
  options: QuizOption[];
  imageUrl?: string;
  multiSelect?: number;
}

export interface QuizOption {
  id: string;
  text: string;
  style?: StyleType;
  styleCategory?: string; // Adicionado para compatibilidade
  imageUrl?: string;
  weight?: number;
  value?: string;
  category?: string;
  points?: number; // Adicionado para compatibilidade
}

export interface QuizResponse {
  questionId: string;
  selectedOptionIds: string[]; // Array para múltiplas seleções
  selectedOptionId?: string; // Para compatibilidade com código antigo
  selectedStyles?: StyleType[]; // Estilos das opções selecionadas
  selectedStyle?: StyleType; // Para compatibilidade com código antigo
  timestamp: Date;
}

export interface UserResponse {
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

export interface QuizResult {
  id: string;
  participantName: string;
  responses: QuizResponse[];
  styleScores: StyleScore[];
  predominantStyle: StyleType;
  primaryStyle?: StyleType; // Para compatibilidade
  complementaryStyles: StyleType[];
  secondaryStyles?: StyleType[]; // Para compatibilidade
  totalNormalQuestions: number;
  calculatedAt: Date;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

// Alias para compatibilidade
export interface StyleResult extends StyleScore {
  category: string;
  score: number;
  description?: string;
  imageUrl?: string;
  guideImageUrl?: string;
}

export interface QuizSession {
  id: string;
  participantName?: string;
  currentQuestionIndex: number;
  responses: QuizResponse[];
  startedAt: Date;
  completedAt?: Date;
  result?: QuizResult;
}

// Engine de cálculo
export interface StyleCalculationEngine {
  calculateStyleScores(responses: QuizResponse[]): StyleScore[];
  determineResult(responses: QuizResponse[], participantName: string): QuizResult;
  getStyleRanking(styleScores: StyleScore[]): StyleScore[];
}

export interface QuizComponentData {
  id: string;
  type: string;
  content: any;
  position: number;
  data?: any;
}

export type BlockType =
  | "hero"
  | "image"
  | "text"
  | "video"
  | "button"
  | "divider"
  | "spacer"
  | "code"
  | "list"
  | "table"
  | "form"
  | "social"
  | "map"
  | "raw-html"
  | "raw-js"
  | "transformation"
  | "pricing"
  | "testimonials"
  | "guarantee"
  | "faq"
  | "bonus"
  | "scarcity-timer"
  | "dynamic-content"
  | "integrations"
  | "legal"
  | "custom-code"
  | "heading"
  | "paragraph";

// Tipo para BlockData que estava sendo importado incorretamente
export interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
  order?: number;
  visible?: boolean;
}

// Versioning
export interface QuizVersion {
  id: string;
  version: number;
  createdAt: string;
  changes: string[];
  data: any;
}

// Interfaces para funil
export interface QuizFunnel {
  id: string;
  name: string;
  description?: string;
  theme?: any;
  config?: any;
  questions?: QuizQuestion[];
  results?: any[];
  intro?: any;
  offer?: any;
  pages: any[];
  isPublished: boolean;
  version: number;
  createdAt?: string;
  updatedAt?: string;
}

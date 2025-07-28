export interface Quiz {
  id: string;
  created_at?: string;
  title: string;
  description?: string;
  user_id?: string;
}

export interface QuizQuestion {
  id: string;
  created_at?: string;
  quiz_id?: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: string[];
  points?: number;
  time_limit?: number;
  required?: boolean;
  explanation?: string;
  hint?: string;
  media_url?: string;
  media_type?: string;
  tags?: string[];
  order_index?: number;
}

export interface UserResponse {
  questionId: string;
  answerIds: string[];
  optionIds?: string[];
}

export type StyleResult = 'elegante' | 'romantico' | 'criativo' | 'dramatico' | 'natural' | 'sexy' | 'classico' | 'moderno';

export interface ResultPageConfig {
  styleType: string;
  headerSection: {
    title: string;
    subtitle: string;
    image?: string;
  };
  primaryStyleSection: {
    title: string;
    description: string;
    image?: string;
  };
  secondaryStylesSection?: {
    title: string;
    styles: {
      name: string;
      description: string;
      image?: string;
    }[];
  };
  offerSection?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image?: string;
  };
}

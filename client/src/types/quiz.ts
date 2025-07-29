
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  title: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'single_choice' | 'rating';
  options: QuestionOption[];
  required: boolean;
  hint?: string;
  tags: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: string | null;
  time_limit: number | null;
  is_public: boolean | null;
  is_published: boolean | null;
  is_template: boolean;
  thumbnail_url: string | null;
  tags: string[];
  view_count: number;
  average_score: number;
  completion_count?: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

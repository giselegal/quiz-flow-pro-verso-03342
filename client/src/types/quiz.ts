
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
  is_template: boolean | null;
  thumbnail_url: string | null;
  tags: string[];
  view_count: number;
  completion_count: number;
  average_score: number | null;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

export interface Question {
  id: string;
  title: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'single_choice' | 'rating';
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  required: boolean;
  hint?: string;
  tags: string[];
}

export interface QuizFormData {
  title: string;
  description?: string;
  category: string;
  difficulty?: string;
  time_limit?: number;
  is_public?: boolean;
}

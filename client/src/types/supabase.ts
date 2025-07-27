
export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: string | null;
  time_limit: number | null;
  is_public: boolean;
  is_published: boolean;
  is_template: boolean;
  thumbnail_url: string | null;
  tags: string[];
  view_count: number;
  completion_rate: number;
  average_score: number;
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  points: number | null;
  time_limit: number | null;
  required: boolean | null;
  explanation: string | null;
  hint: string | null;
  media_url: string | null;
  media_type: string | null;
  tags: string[];
  order_index: number;
  created_at: string;
}

export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
}

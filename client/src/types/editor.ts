
export interface EditableContent {
  text?: string;
  src?: string;
  alt?: string;
  backgroundColor?: string;
  textColor?: string;
  height?: string | number;
  question?: string;
  options?: Array<{
    text: string;
    isCorrect?: boolean;
  }>;
  author?: string;
  [key: string]: any;
}

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: EditableContent;
  order: number;
}

export interface Block extends EditorBlock {}

export type BlockType = 
  | 'header'
  | 'text'
  | 'image'
  | 'button'
  | 'spacer'
  | 'quiz-question'
  | 'testimonial';

export interface EditorConfig {
  blocks: EditorBlock[];
  globalStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    fontSize?: string;
  };
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  required: boolean;
  hint?: string;
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
  created_at: string;
  updated_at: string;
  questions: QuizQuestion[];
}

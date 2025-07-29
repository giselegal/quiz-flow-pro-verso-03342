
export interface EditableContent {
  text?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
  question?: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  type?: 'text' | 'multiple_choice' | 'single_choice' | 'rating';
  required?: boolean;
  hint?: string;
  tags?: string[];
}

export interface EditorBlock {
  id: string;
  type: string;
  content: EditableContent;
  order: number;
}

export interface EditorConfig {
  blocks: EditorBlock[];
  settings: {
    title: string;
    description: string;
    theme: string;
  };
}

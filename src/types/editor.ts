export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
  properties?: Record<string, any>;
  order?: number;
}

export interface EditorBlock extends Block {
  type: BlockType;
  content: EditableContent;
}

export type BlockType = 
  | 'header'
  | 'headline'
  | 'text'
  | 'image'
  | 'button'
  | 'cta'
  | 'spacer'
  | 'video'
  | 'two-column'
  | 'options-grid'
  | 'quiz-question'
  | 'quiz-question-configurable'
  | 'quiz-start-page'
  | 'quiz-question-page'
  | 'quiz-result-calculated'
  | 'benefits'
  | 'testimonials'
  | 'pricing'
  | 'guarantee'
  | 'products'
  | 'hero-section'
  | 'bonus-carousel'
  | 'style-result'
  | 'secondary-styles';

export interface EditableContent {
  title?: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
  src?: string;
  alt?: string;
  buttonText?: string;
  buttonUrl?: string;
  href?: string;
  variant?: string;
  level?: number;
  videoUrl?: string;
  autoplay?: boolean;
  height?: string;
  items?: string[];
  leftContent?: string;
  rightContent?: string;
  columns?: number;
  price?: string;
  originalPrice?: string;
  period?: string;
  style?: Record<string, any>;
  [key: string]: any;
}

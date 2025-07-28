
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
  | 'quiz-result-calculated'
  | 'benefits'
  | 'testimonials'
  | 'pricing'
  | 'guarantee'
  | 'products'
  | 'hero-section'
  | 'bonus-carousel'
  | 'style-result'
  | 'secondary-styles'
  | 'input'
  | 'progress'
  | 'title'
  | 'subtitle'
  | 'paragraph'
  | 'email'
  | 'phone'
  | 'options'
  | 'logo'
  | 'testimonial'
  | 'price'
  | 'countdown'
  | 'bonus'
  | 'faq'
  | 'social-proof';

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
  height?: string | number;
  width?: string | number;
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

export interface PropertySchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'checkbox' | 'image' | 'array' | 'range' | 'boolean' | 'url' | 'icon-select' | 'array-of-objects';
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  description?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  nestedPath?: string;
  itemSchema?: PropertySchema[];
  validation?: {
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
  };
  min?: number;
  max?: number;
  step?: number;
}

export interface EditorConfig {
  blocks: EditorBlock[];
  title?: string;
  description?: string;
  settings?: any;
}

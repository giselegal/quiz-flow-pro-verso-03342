
export interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
  properties: any;
}

export type BlockType = 
  | 'text-inline'
  | 'heading-inline' 
  | 'image-display-inline'
  | 'button-inline'
  | 'options-grid'
  | 'quiz-question-inline'
  | 'form-input-inline'
  | 'spacer-inline'
  | 'divider-inline'
  | 'video-inline'
  | 'audio-inline'
  | 'countdown-inline'
  | 'progress-bar-inline'
  | 'social-share-inline'
  | 'testimonial-inline'
  | 'faq-inline'
  | 'pricing-table-inline'
  | 'contact-form-inline'
  | 'newsletter-signup-inline'
  | 'code-block-inline'
  | 'text'
  | 'headline' 
  | 'image'
  | 'benefits'
  | 'testimonials'
  | 'pricing'
  | 'guarantee'
  | 'cta'
  | 'header'
  | 'paragraph'
  | 'button'
  | 'spacer'
  | 'divider';

// Add back EditorBlock as alias for Block for backward compatibility
export type EditorBlock = Block;

// Add back missing interfaces
export interface EditableContent {
  text?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  alignment?: 'left' | 'center' | 'right';
  padding?: number;
  margin?: number;
  borderRadius?: number;
  [key: string]: any;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  defaultProps: any;
  properties: PropertySchema[];
}

export interface PropertySchema {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'richtext';
  default?: any;
  defaultValue?: any;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
}

export interface EditorConfig {
  blocks: Block[];
  title: string;
  description: string;
  globalStyles?: any;
}

// Content type interfaces
export interface PricingContent extends EditableContent {
  price?: string;
  originalPrice?: string;
  features?: string[];
  buttonText?: string;
  buttonUrl?: string;
}

export interface TestimonialContent extends EditableContent {
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  image?: string;
}

// Type guards
export const isPricingBlock = (block: Block): block is Block & { content: PricingContent } => {
  return block.type === 'pricing' || block.type === 'pricing-table-inline';
};

export const isTestimonialBlock = (block: Block): block is Block & { content: TestimonialContent } => {
  return block.type === 'testimonials' || block.type === 'testimonial-inline';
};

// Stage interface
export interface FunnelStage {
  id: string;
  name: string;
  type: string;
  order: number;
  blocks: Block[];
  metadata?: {
    description?: string;
    isActive?: boolean;
    blocksCount?: number;
  };
  description?: string;
}

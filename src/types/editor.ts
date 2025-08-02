
import { LucideIcon } from 'lucide-react';

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'array';
  default: any;
  label: string;
  description?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
  properties: Record<string, PropertySchema>;
  label: string;
  defaultProps: Record<string, any>;
  tags?: string[];
}

export type BlockType = 
  | 'headline' 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'spacer' 
  | 'text-inline' 
  | 'image-display-inline' 
  | 'badge-inline' 
  | 'progress-inline' 
  | 'stat-inline' 
  | 'countdown-inline' 
  | 'spacer-inline'
  | 'heading-inline'
  | 'benefits'
  | 'testimonials'
  | 'pricing'
  | 'guarantee'
  | 'cta'
  | 'header'
  | 'hero'
  | 'benefitsList'
  | 'testimonial'
  | 'styleResult'
  | 'secondaryStylesTitle'
  | 'offerHero'
  | 'carousel'
  | 'testimonialsSection'
  | 'style-result'
  | 'secondary-styles'
  | 'hero-section'
  | 'products'
  | 'video'
  | 'two-column'
  | 'icon'
  | 'faq'
  | 'quiz-start-page-inline'
  | 'pricing-card-inline'
  | 'testimonial-card-inline'
  | 'result-header-inline'
  | 'step-header-inline'
  | 'loading-animation'
  | 'quiz-offer-cta-inline';

export interface EditableContent {
  title?: string;
  text?: string;
  url?: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fontSize?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  subtitle?: string;
  style?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  type?: string;
  buttonColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  action?: string;
  logo?: string;
  logoAlt?: string;
  logoWidth?: string;
  logoHeight?: string;
  backgroundColor?: string;
  color?: string;
  padding?: string;
  margin?: string;
  textAlign?: string;
  fontWeight?: string;
  fontFamily?: string;
  boxShadow?: string;
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  customImage?: string;
  items?: string[];
  [key: string]: any; // Add index signature for dynamic properties
}

export interface Block {
  id: string;
  type: BlockType;
  content: EditableContent;
  order: number;
  properties?: Record<string, any>; // Add properties field
}

// Export EditorBlock as alias for Block for backward compatibility
export type EditorBlock = Block;

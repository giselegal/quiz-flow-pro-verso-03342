import { LucideIcon } from "lucide-react";

export enum PropertyType {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  BOOLEAN = "boolean",
  COLOR = "color",
  SELECT = "select",
  RANGE = "range",
  IMAGE = "image",
  OPTION_SCORE = "option_score",
  OPTION_CATEGORY = "option_category",
}

export interface PropertyDefinition {
  id: string;
  type: PropertyType;
  label: string;
  description?: string;
  category?: "basic" | "style" | "advanced" | "quiz";
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
}

export interface PropertySchema {
  type: "string" | "number" | "boolean" | "select" | "textarea" | "array" | "color" | "range";

  default: any;

  label: string;

  description?: string;

  category?: "general" | "layout" | "styling" | "content" | "behavior" | "validation" | "advanced";

  required?: boolean;

  placeholder?: string;

  options?: Array<{ value: string; label: string }>;

  min?: number;

  max?: number;

  step?: number;

  rows?: number;
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

  defaultContent?: Record<string, any>;

  tags?: string[];
}

export type BlockType =
  | "headline"
  | "text"
  | "image"
  | "button"
  | "spacer"
  | "text-inline"
  | "image-display-inline"
  | "badge-inline"
  | "progress-inline"
  | "stat-inline"
  | "countdown-inline"
  | "spacer-inline"
  | "heading-inline"
  | "button-inline"
  | "benefits"
  | "testimonials"
  | "pricing"
  | "guarantee"
  | "cta"
  | "header"
  | "hero"
  | "benefitsList"
  | "testimonial"
  | "styleResult"
  | "secondaryStylesTitle"
  | "offerHero"
  | "carousel"
  | "testimonialsSection"
  | "style-result"
  | "secondary-styles"
  | "hero-section"
  | "products"
  | "video"
  | "two-column"
  | "icon"
  | "faq"
  | "quiz-start-page-inline"
  | "pricing-card-inline"
  | "testimonial-card-inline"
  | "result-header-inline"
  | "step-header-inline"
  | "loading-animation"
  | "quiz-offer-cta-inline"
  | "style-card-inline"
  | "result-card-inline"
  | "quiz-question-inline"
  | "quiz-result-inline"
  | "custom-code"
  | "decorative-bar-inline"
  | "form-input"
  | "legal-notice-inline"
  | "animation-block"
  | "options-grid"
  | "quiz-intro-header";

export interface FAQItem {
  id: string;

  question: string;

  answer: string;
}

export interface EditableContent {
  title?: string;

  text?: string;

  url?: string;

  alt?: string;

  width?: string;

  height?: string;

  borderRadius?: string;

  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";

  fontSize?: string;

  alignment?: "left" | "center" | "right" | "justify";

  maxWidth?: number;

  subtitle?: string;

  style?: Record<string, any>;

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

  items?: string[] | FAQItem[];

  faqItems?: FAQItem[];

  regularPrice?: string;

  salePrice?: string;

  ctaUrl?: string;

  heroImage?: string;

  heroImageAlt?: string;

  quote?: string;

  quoteAuthor?: string;

  letterSpacing?: string;

  lineHeight?: string;

  display?: string;

  flexDirection?: string;

  justifyContent?: string;

  alignItems?: string;

  gap?: string;

  useIcons?: boolean;

  icon?: string;

  iconColor?: string;

  options?: Array<{ id: string; text: string; imageUrl?: string }>;

  [key: string]: any;
}

export interface Block {
  id: string;

  type: BlockType;

  content: EditableContent;

  order: number;

  properties?: Record<string, any>;
}

export type EditorBlock = Block;

export interface FunnelStage {
  id: string;

  name: string;

  order: number;

  type: "intro" | "question" | "transition" | "processing" | "result" | "lead" | "offer" | "final";

  description?: string;

  isActive?: boolean;

  metadata?: {
    blocksCount?: number;

    lastModified?: Date;

    isCustom?: boolean;

    templateBlocks?: any[]; // ✅ Adicionar suporte a blocos de template
  };
}

export interface EditorConfig {
  blocks: EditorBlock[];

  globalStyles: Record<string, any>;

  theme?: string;
}

/**
 * 🎯 CONFIGURAÇÃO DO EDITOR OTIMIZADO
 */
export interface OptimizedEditorConfig extends EditorConfig {
  version: string;
  optimizationLevel: "basic" | "advanced" | "performance";
  inlineComponents: string[];
  performanceSettings: {
    enableAutoSave: boolean;
    enableKeyboardShortcuts: boolean;
    enablePerformanceOptimization: boolean;
    mobileOptimizations: boolean;
  };
  quizSettings: {
    totalSteps: number;
    calculationWeights: Record<string, number>;
    resultMappings: Record<string, any>;
  };
}

/**
 * 🎯 ESTADO DO SISTEMA OTIMIZADO
 */
export interface OptimizedSystemState {
  isInitialized: boolean;
  hasInlineSupport: boolean;
  performanceOptimized: boolean;
  hooksIntegrated: boolean;
  componentsLoaded: number;
  lastOptimizedAt: Date;
}

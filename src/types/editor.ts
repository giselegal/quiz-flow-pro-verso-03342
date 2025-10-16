
import { LucideIcon } from 'lucide-react';

// Import PropertyType and PropertySchema for internal use
import { PropertySchema, PropertyType } from './propertySchema';

// Re-export the unified PropertySchema as the primary interface
export type {
  PropertyCategory,
  PropertyCategoryOrString,
  PropertySchema,
  PropertyType,
  UnifiedProperty,
} from './propertySchema';

// Remove the duplicate PropertyType enum - use the one from propertySchema.ts

export interface PropertyDefinition {
  id: string;
  type: PropertyType;
  label: string;
  description?: string;
  category?: 'basic' | 'style' | 'advanced' | 'quiz';
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
}

// Keep the legacy interface for backwards compatibility with explicit naming
export interface LegacyPropertySchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'array' | 'color' | 'range';
  default: any;
  label: string;
  description?: string;
  category?: 'general' | 'layout' | 'styling' | 'content' | 'behavior' | 'validation' | 'advanced';
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
  // Tipos gerais de blocos
  | 'headline'
  | 'text'
  | 'image'
  | 'button'
  | 'spacer'

  // Blocos inline
  | 'text-inline'
  | 'image-inline'
  | 'image-display-inline'
  | 'badge-inline'
  | 'progress-inline'
  | 'stat-inline'
  | 'countdown-inline'
  | 'urgency-timer-inline'
  | 'before-after-inline'
  | 'mentor-section-inline'

  // Blocos de quiz e formulário - NOVOS TIPOS ADICIONADOS
  | 'multiple-choice'
  | 'single-choice'
  | 'text-input'
  | 'info-card'
  | 'result-card'
  | 'offer-card'
  | 'spacer-inline'
  | 'heading-inline'
  | 'button-inline'
  | 'input-field'
  | 'form-input'
  | 'legal-notice-inline'

  // Blocos de quiz
  | 'quiz-intro-header'
  | 'quiz-navigation'
  | 'quiz-header'
  | 'quiz-start-page-inline'
  | 'quiz-question-inline'
  | 'quiz-result-inline'
  | 'quiz-offer-cta-inline'
  | 'step-header-inline'
  | 'step01-intro'

  // Blocos de resultado e estilo
  | 'style-result'
  | 'style-card-inline'
  | 'result-card-inline'
  | 'result-display'
  | 'result-header-inline'
  | 'secondary-styles'
  | 'secondaryStylesTitle'

  // Blocos de layout
  | 'two-column'
  | 'form-container'
  | 'lead-form'
  | 'options-grid'
  | 'hero-section'
  | 'hero'
  | 'header'
  | 'carousel'
  | 'container'
  | 'grid'
  | 'divider'
  | 'decorative-bar'
  | 'decorative-bar-inline'
  | 'connected-template-wrapper'

  // Blocos de acessibilidade
  | 'accessibility-skip-link'
  | 'animation-block'
  | 'loading-animation'

  // Blocos de conteúdo
  | 'benefits'
  | 'benefitsList'
  | 'testimonials'
  | 'testimonial'
  | 'testimonial-card-inline'
  | 'testimonials-carousel-inline'
  | 'testimonialsSection'
  | 'bonus'
  | 'secure-purchase'
  | 'value-anchoring'
  | 'pricing'
  | 'pricing-card-inline'
  | 'guarantee'
  | 'cta'
  | 'offer-cta'
  | 'offerHero'
  | 'products'
  | 'video'
  | 'icon'
  | 'faq'
  | 'custom-code'
  | 'legal-notice'

  // Step 20 Modular Components (NEW)
  | 'cakto-quiz-result'
  | 'step20-result-header'
  | 'step20-style-reveal'
  | 'step20-user-greeting'
  | 'step20-compatibility'
  | 'step20-secondary-styles'
  | 'step20-personalized-offer'
  | 'step20-complete-template'
  | 'price-display'

  // AI Integration Components (NEW)
  | 'fashion-ai-generator'

  // Quiz App Components (NEW)
  | 'quiz-intro-step'
  | 'quiz-question-step'
  | 'quiz-transition-step'
  | 'quiz-result-step'
  | 'quiz-offer-step'

  // Funnel Block Components (NEW)
  | 'funnel-intro-step'
  | 'name-collect-step'
  | 'question-multiple-step'
  | 'processing-step'
  | 'offer-page-step';

export interface FAQItem {
  id: string;

  question: string;

  answer: string;
}

// ===== INTERFACES ESPECÍFICAS POR TIPO DE BLOCO =====

export interface HeadlineContent extends EditableContent {
  title: string;
  subtitle?: string;
  fontSize?: string; // Changed from number to string
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6; // H1-H6
  marginTop?: number;
  marginBottom?: number;
}

export interface TextContent extends EditableContent {
  text: string;
  textType?: 'paragraph' | 'lead' | 'small' | 'caption';
  fontSize?: string; // Changed from number to string
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  backgroundColor?: string;
  isMarkdown?: boolean;
  maxLength?: number;
  placeholder?: string;
}

export interface TestimonialContent extends EditableContent {
  quote: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  rating?: number;
  company?: string;
  showQuotes?: boolean;
  layout?: 'card' | 'minimal' | 'detailed';
  backgroundColor?: string;
  textColor?: string;
}

export interface PricingContent extends EditableContent {
  title: string;
  price: string | number;
  currency?: string;
  period?: 'month' | 'year' | 'one-time' | 'custom';
  customPeriod?: string;
  features: string[];
  ctaText?: string;
  ctaUrl?: string;
  isPopular?: boolean;
  popularLabel?: string;
  description?: string;
  priceColor?: string;
  ctaColor?: string;
}

export interface VideoContent extends EditableContent {
  videoUrl: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'custom';
  width?: string; // Changed from number to string
  height?: string; // Changed from number to string
  caption?: string;
}

export interface BenefitsContent extends EditableContent {
  title?: string;
  benefits: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  layout?: 'list' | 'grid' | 'cards';
  showIcons?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface FAQContent extends EditableContent {
  title?: string;
  faqs: FAQItem[];
  allowMultipleOpen?: boolean;
  showSearch?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

export interface CTAContent extends EditableContent {
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  buttonTarget?: '_self' | '_blank' | '_parent' | '_top';
  buttonStyle?: 'primary' | 'secondary' | 'outline' | 'ghost';
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageContent extends EditableContent {
  url: string;
  alt: string;
  caption?: string;
  width?: string; // Changed from number to string
  height?: string; // Changed from number to string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string; // Changed from number to string
  showCaption?: boolean;
  lightbox?: boolean;
  link?: string;
  linkTarget?: '_self' | '_blank';
}

// ===== UNIÃO DE TODOS OS TIPOS DE CONTENT =====

export type BlockContent =
  | EditableContent // Para tipos não especificados ainda
  | HeadlineContent
  | TextContent

  | TestimonialContent
  | PricingContent
  | VideoContent
  | BenefitsContent
  | FAQContent
  | CTAContent
  | ImageContent;

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

  options?: Array<{ id: string; text: string; imageUrl?: string; value?: string }>;

  [key: string]: any;
}

// ===== INTERFACE BLOCK COM TIPAGEM CONDICIONAL =====

export interface BaseBlock {
  id: string;
  order: number;
  properties?: Record<string, any>;
}

// Interface Block específica por tipo
export interface Block extends BaseBlock {
  type: BlockType;
  content: BlockContent;

  // Step association (para flat structure)
  stepId?: string;

  // Validation properties
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
    isValid?: boolean;
    errors?: string[];
    warnings?: string[];
  };
  position?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  // Add missing properties
  style?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Interfaces especializadas para tipos específicos
export interface HeadlineBlock extends BaseBlock {
  type: 'headline';
  content: HeadlineContent;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: TextContent;
}

export interface TestimonialBlock extends BaseBlock {
  type: 'testimonial' | 'testimonials' | 'testimonial-card-inline' | 'testimonials-carousel-inline' | 'testimonialsSection';
  content: TestimonialContent;
}

export interface PricingBlock extends BaseBlock {
  type: 'pricing' | 'pricing-card-inline';
  content: PricingContent;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  content: VideoContent;
}

export interface BenefitsBlock extends BaseBlock {
  type: 'benefits' | 'benefitsList';
  content: BenefitsContent;
}

export interface FAQBlock extends BaseBlock {
  type: 'faq';
  content: FAQContent;
}

export interface CTABlock extends BaseBlock {
  type: 'cta' | 'offerHero' | 'quiz-offer-cta-inline';
  content: CTAContent;
}

export interface ImageBlock extends BaseBlock {
  type: 'image' | 'image-inline' | 'image-display-inline';
  content: ImageContent;
}

// União de todos os tipos de blocos específicos
export type TypedBlock =
  | HeadlineBlock
  | TextBlock
  | TestimonialBlock
  | PricingBlock
  | VideoBlock
  | BenefitsBlock
  | FAQBlock
  | CTABlock
  | ImageBlock
  | Block; // Fallback para tipos não especificados

// Remove duplicate Block interface - keeping the first one with BlockContent

export type EditorBlock = Block;

// ===== UTILITÁRIOS DE TIPAGEM =====

// Type Guards para verificar tipos específicos de blocos
export const isHeadlineBlock = (block: Block): block is HeadlineBlock => {
  return block.type === 'headline';
};

export const isTextBlock = (block: Block): block is TextBlock => {
  return block.type === 'text';
};

export const isTestimonialBlock = (block: Block): block is TestimonialBlock => {
  return ['testimonial', 'testimonials', 'testimonial-card-inline', 'testimonials-carousel-inline', 'testimonialsSection'].includes(
    block.type
  );
};

export const isPricingBlock = (block: Block): block is PricingBlock => {
  return ['pricing', 'pricing-card-inline'].includes(block.type);
};

export const isVideoBlock = (block: Block): block is VideoBlock => {
  return block.type === 'video';
};

export const isBenefitsBlock = (block: Block): block is BenefitsBlock => {
  return ['benefits', 'benefitsList'].includes(block.type);
};

export const isFAQBlock = (block: Block): block is FAQBlock => {
  return block.type === 'faq';
};

export const isCTABlock = (block: Block): block is CTABlock => {
  return ['cta', 'offerHero', 'quiz-offer-cta-inline'].includes(block.type);
};

export const isImageBlock = (block: Block): block is ImageBlock => {
  return ['image', 'image-inline', 'image-display-inline'].includes(block.type);
};

// Função para obter o tipo de content baseado no tipo do bloco
export const getContentType = (blockType: BlockType): string => {
  if (blockType === 'headline') return 'HeadlineContent';
  if (blockType === 'text') return 'TextContent';
  if (
    ['testimonial', 'testimonials', 'testimonial-card-inline', 'testimonials-carousel-inline', 'testimonialsSection'].includes(
      blockType
    )
  )
    return 'TestimonialContent';
  if (['pricing', 'pricing-card-inline'].includes(blockType)) return 'PricingContent';
  if (blockType === 'video') return 'VideoContent';
  if (['benefits', 'benefitsList'].includes(blockType)) return 'BenefitsContent';
  if (blockType === 'faq') return 'FAQContent';
  if (['cta', 'offerHero', 'quiz-offer-cta-inline'].includes(blockType)) return 'CTAContent';
  if (['image', 'image-inline', 'image-display-inline'].includes(blockType)) return 'ImageContent';
  return 'EditableContent';
};

// Remove duplicate EditorBlock declaration

export interface FunnelStage {
  id: string;

  name: string;

  order: number;

  type: 'intro' | 'question' | 'transition' | 'processing' | 'result' | 'lead' | 'offer' | 'final';

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
  // Layout configuration
  layout?: {
    sidebar?: {
      width?: number;
      collapsible?: boolean;
    };
    canvas?: {
      width?: string;
      maxWidth?: number;
    };
    properties?: {
      width?: number;
      collapsible?: boolean;
    };
  };

  // Block configuration
  blocks?:
  | EditorBlock[]
  | {
    maxPerPage?: number;
    defaultSpacing?: number;
    gridColumns?: number;
  };

  // Editor features
  features?: {
    autoSave?: boolean;
    undoRedo?: boolean;
    preview?: boolean;
    dragAndDrop?: boolean;
    validation?: boolean;
  };

  // Validation rules
  validation?: {
    debounceMs?: number;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    showErrorsImmediately?: boolean;
  };

  // Theme configuration
  theme?:
  | {
    colorScheme?: string;
    radius?: string;
    spacing?: string;
  }
  | string;

  // Performance settings
  performance?: {
    lazyLoadBlocks?: boolean;
    renderThrottle?: number;
    maxBlocksBeforePagination?: number;
  };

  globalStyles?: Record<string, any>;
}

/**
 * 🎯 CONFIGURAÇÃO DO EDITOR OTIMIZADO
 */
export interface OptimizedEditorConfig extends EditorConfig {
  version: string;
  optimizationLevel: 'basic' | 'advanced' | 'performance';
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

/**
 * 🎯 INTERFACES DE VALIDAÇÃO
 */
export interface ValidationProps {
  type: string;
  properties: Record<string, any>;
}

export interface ValidationResult {
  success: boolean;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export interface BlockValidation {
  schema?: unknown;
  rules?: ValidationRule[];
  customValidation?: (value: unknown) => boolean;
}

export interface ValidationRule {
  type: string;
  value?: unknown;
  message: string;
}

// ============================================================================
// 🎯 JSON TEMPLATES - FASE 2 ADDITIONS
// ============================================================================

/**
 * Tipos de blocos específicos para templates JSON
 * Adicionados para suportar todos os blocos dos templates quiz-estilo-step-*.json
 */
export type JsonBlockType =
  // Offer blocks (Step 21)
  | 'offer-header'
  | 'offer-hero-section'
  | 'offer-problem-section'
  | 'offer-solution-section'
  | 'offer-product-showcase'
  | 'offer-guarantee-section'
  | 'offer-faq-section'

  // Loading/Animation blocks
  | 'spinner'

  // Data/Selection blocks
  | 'category-points'
  | 'input'
  | 'selection'

  // Quiz flow blocks
  | 'strategic'
  | 'transition'
  | 'intro'
  | 'question'
  | 'result'
  | 'offer'

  // Utility
  | 'none';

/**
 * Tipo combinado: BlockType + JsonBlockType
 */
export type UnifiedBlockType = BlockType | JsonBlockType;

/**
 * Helper para verificar se um tipo é um bloco JSON
 */
export function isJsonBlockType(type: string): type is JsonBlockType {
  const jsonBlockTypes: JsonBlockType[] = [
    'offer-header',
    'offer-hero-section',
    'offer-problem-section',
    'offer-solution-section',
    'offer-product-showcase',
    'offer-guarantee-section',
    'offer-faq-section',
    'spinner',
    'category-points',
    'input',
    'selection',
    'strategic',
    'transition',
    'intro',
    'question',
    'result',
    'offer',
    'none',
  ];

  return jsonBlockTypes.includes(type as JsonBlockType);
}

/**
 * Helper para verificar se um tipo é um bloco de Quiz
 */
export function isQuizBlockType(type: string): boolean {
  return type.startsWith('quiz-') ||
    ['question', 'intro', 'result', 'strategic', 'transition'].includes(type);
}

/**
 * Helper para verificar se um tipo é um bloco de Offer
 */
export function isOfferBlockType(type: string): boolean {
  return type.startsWith('offer-') || type === 'offer';
}

/**
 * Helper para verificar se um tipo é inline
 */
export function isInlineBlockType(type: string): boolean {
  return type.endsWith('-inline');
}

/**
 * Helper para obter categoria de bloco baseado no tipo
 */
export function getBlockCategory(type: string): 'quiz' | 'offer' | 'layout' | 'content' | 'form' | 'media' | 'unknown' {
  if (isQuizBlockType(type)) return 'quiz';
  if (isOfferBlockType(type)) return 'offer';

  if (['text', 'headline', 'button'].includes(type) || type.includes('text') || type.includes('button')) {
    return 'content';
  }

  if (type.includes('form') || type.includes('input') || type === 'lead-form') {
    return 'form';
  }

  if (type.includes('image') || type.includes('video') || type === 'media') {
    return 'media';
  }

  if (type.includes('container') || type.includes('grid') || type.includes('column')) {
    return 'layout';
  }

  return 'unknown';
}

/**
 * Helper para validar tipo de bloco
 */
export function isValidBlockType(type: string): type is UnifiedBlockType {
  // Verificar se é BlockType nativo ou JsonBlockType
  return typeof type === 'string' && type.length > 0;
}

/**
 * Metadata para blocos JSON
 */
export interface JsonBlockMetadata {
  templateVersion: string;
  category: string;
  tags?: string[];
  isDeprecated?: boolean;
  replacedBy?: string;
}

/**
 * Interface para bloco com metadata JSON
 */
export interface JsonBlock extends Block {
  metadata?: JsonBlockMetadata;
  source?: 'json' | 'typescript' | 'editor';
}

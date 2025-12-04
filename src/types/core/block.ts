/**
 * 🎯 CANONICAL BLOCK TYPE DEFINITION
 * 
 * Fonte única de verdade para tipos de Block em todo o projeto.
 * Este arquivo consolida todas as definições anteriores de Block.
 * 
 * @canonical
 */

import { z } from 'zod';

// =============================================================================
// BLOCK TYPE UNION (all supported block types)
// =============================================================================

export type BlockType =
  // Core blocks
  | 'headline'
  | 'text'
  | 'text-paragraph'
  | 'image'
  | 'button'
  | 'spacer'
  | 'divider'
  
  // Inline blocks
  | 'text-inline'
  | 'image-inline'
  | 'badge-inline'
  | 'progress-inline'
  | 'countdown-inline'
  | 'button-inline'
  | 'heading-inline'
  | 'spacer-inline'
  
  // Quiz blocks
  | 'multiple-choice'
  | 'single-choice'
  | 'text-input'
  | 'form-input'
  | 'quiz-intro-header'
  | 'quiz-navigation'
  | 'quiz-header'
  
  // Intro blocks
  | 'intro-form'
  | 'intro-logo'
  | 'intro-title'
  | 'intro-image'
  | 'intro-description'
  
  // Question blocks
  | 'question-progress'
  | 'question-number'
  | 'question-text'
  | 'question-title'
  | 'question-instructions'
  | 'question-navigation'
  | 'question-hero'
  
  // Transition blocks
  | 'transition-title'
  | 'transition-subtitle'
  | 'transition-loader'
  | 'transition-text'
  | 'transition-progress'
  | 'transition-message'
  | 'transition-image'
  | 'transition-hero'
  
  // Result blocks
  | 'result-card'
  | 'result-header'
  | 'result-image'
  | 'result-description'
  | 'result-cta-primary'
  | 'result-cta-secondary'
  | 'result-progress-bars'
  | 'result-characteristics'
  | 'result-share'
  | 'style-result'
  | 'secondary-styles'
  
  // Offer blocks
  | 'offer-card'
  | 'offer-cta'
  | 'offer-hero'
  | 'pricing'
  | 'price-display'
  
  // Content blocks
  | 'benefits'
  | 'testimonials'
  | 'testimonial'
  | 'guarantee'
  | 'faq'
  | 'video'
  | 'hero'
  | 'header'
  | 'carousel'
  
  // Layout blocks
  | 'container'
  | 'grid'
  | 'two-column'
  | 'form-container'
  | 'options-grid'
  
  // Utility blocks
  | 'custom-code'
  | 'legal-notice'
  | 'decorative-bar'
  | 'loading-animation'
  
  // Generic fallback
  | string;

// =============================================================================
// BLOCK CONTENT INTERFACE
// =============================================================================

export interface BlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  question?: string;
  text?: string;
  placeholder?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
  url?: string;
  alt?: string;
  options?: BlockOption[];
  [key: string]: unknown;
}

// =============================================================================
// BLOCK OPTION INTERFACE
// =============================================================================

export interface BlockOption {
  id: string;
  text: string;
  label?: string;
  value?: string;
  imageUrl?: string;
  category?: string;
  points?: number;
  isCorrect?: boolean;
  weight?: number;
}

// =============================================================================
// BLOCK PROPERTIES INTERFACE
// =============================================================================

export interface BlockProperties {
  // Layout
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string | number;
  margin?: string | number;
  borderRadius?: string | number;
  boxShadow?: string;
  
  // Typography
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  
  // Quiz-specific
  showImages?: boolean;
  columns?: number;
  requiredSelections?: number;
  maxSelections?: number;
  minSelections?: number;
  multipleSelection?: boolean;
  autoAdvanceOnComplete?: boolean;
  autoAdvanceDelay?: number;
  questionId?: string;
  
  // Validation
  enableButtonOnlyWhenValid?: boolean;
  showValidationFeedback?: boolean;
  validationMessage?: string;
  
  // Animation
  animation?: string;
  animationDuration?: string | number;
  
  // Generic
  [key: string]: unknown;
}

// =============================================================================
// BLOCK VALIDATION META
// =============================================================================

export interface BlockValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: unknown) => boolean | string;
  isValid?: boolean;
  errors?: string[];
  warnings?: string[];
}

// =============================================================================
// BLOCK POSITION META
// =============================================================================

export interface BlockPosition {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

// =============================================================================
// CANONICAL BLOCK INTERFACE
// =============================================================================

export interface Block {
  /** Unique identifier */
  id: string;
  
  /** Block type */
  type: BlockType;
  
  /** Order in the step */
  order: number;
  
  /** Block content */
  content: BlockContent;
  
  /** Block properties/styling */
  properties?: BlockProperties;
  
  /** Props (alias for properties, legacy compatibility) */
  props?: Record<string, unknown>;
  
  /** Validation metadata */
  validation?: BlockValidation;
  
  /** Position metadata */
  position?: BlockPosition;
  
  /** Nested children blocks */
  children?: Block[];
  
  /** Parent block ID (for nested blocks) */
  parentId?: string;
  
  /** Style overrides */
  style?: Record<string, unknown>;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  
  /** Ephemeral flag (non-persistent) */
  ephemeral?: boolean;
}

// =============================================================================
// BLOCK COMPONENT PROPS
// =============================================================================

export interface BlockComponentProps<T = unknown> {
  block: Block;
  isEditing?: boolean;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
  onSelect?: () => void;
  customProps?: T;
}

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

export const BlockContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  question: z.string().optional(),
  text: z.string().optional(),
  placeholder: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  url: z.string().optional(),
  alt: z.string().optional(),
  options: z.array(z.any()).optional(),
}).passthrough();

export const BlockPropertiesSchema = z.object({
  backgroundColor: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  padding: z.union([z.string(), z.number()]).optional(),
  margin: z.union([z.string(), z.number()]).optional(),
  borderRadius: z.union([z.string(), z.number()]).optional(),
  fontSize: z.union([z.string(), z.number()]).optional(),
  fontWeight: z.union([z.string(), z.number()]).optional(),
  color: z.string().optional(),
}).passthrough();

export const BlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number(),
  content: BlockContentSchema,
  properties: BlockPropertiesSchema.optional(),
  props: z.record(z.unknown()).optional(),
  validation: z.object({
    required: z.boolean().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    isValid: z.boolean().optional(),
    errors: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
  }).optional(),
  position: z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  children: z.array(z.any()).optional(), // Use z.any() to avoid circular reference
  parentId: z.string().optional(),
  style: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
  ephemeral: z.boolean().optional(),
});

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isBlock(value: unknown): value is Block {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'type' in value &&
    typeof (value as Block).id === 'string' &&
    typeof (value as Block).type === 'string'
  );
}

export function isBlockArray(value: unknown): value is Block[] {
  return Array.isArray(value) && value.every(isBlock);
}

// =============================================================================
// NORMALIZERS
// =============================================================================

export function normalizeBlock(raw: unknown, index: number = 0): Block {
  const obj = raw as Record<string, unknown>;
  return {
    id: (obj?.id as string) ?? `block-${Date.now()}-${index}`,
    type: (obj?.type as string) ?? 'unknown',
    order: (obj?.order as number) ?? index,
    content: (obj?.content as BlockContent) ?? {},
    properties: obj?.properties as BlockProperties,
    props: obj?.props as Record<string, unknown>,
    validation: obj?.validation as BlockValidation,
    position: obj?.position as BlockPosition,
    children: obj?.children as Block[],
    parentId: obj?.parentId as string,
    style: obj?.style as Record<string, unknown>,
    metadata: obj?.metadata as Record<string, unknown>,
    ephemeral: obj?.ephemeral as boolean,
  };
}

export function createBlock(type: BlockType, overrides: Partial<Block> = {}): Block {
  return {
    id: `block-${Date.now()}`,
    type,
    order: 0,
    content: {},
    ...overrides,
  };
}

// =============================================================================
// LEGACY COMPATIBILITY ALIASES
// =============================================================================

/** @deprecated Use Block instead */
export type CanonicalBlock = Block;

/** @deprecated Use BlockComponentProps instead */
export type BlockProps = BlockComponentProps;

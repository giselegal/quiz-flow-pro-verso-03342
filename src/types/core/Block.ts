/**
 * Canonical Block Type Definition
 * Fonte única para interface de bloco em todo o projeto.
 * Unifica variações anteriores (quizCore, editor, hooks) e adiciona propriedades opcionais
 * usadas em contextos específicos (validação, posição, estilo, metadata, hierarquia).
 */

export interface BlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  question?: string;
  text?: string;
  placeholder?: string;
  buttonText?: string;
  options?: any[]; // Uso amplo; manter flexível. TODO: tipar com Option quando consolidado.
  imageUrl?: string;
  alt?: string;
  [key: string]: any;
}

export interface BlockProperties {
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  boxShadow?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  showImages?: boolean;
  columns?: number;
  requiredSelections?: number;
  maxSelections?: number;
  minSelections?: number;
  multipleSelection?: boolean;
  autoAdvanceOnComplete?: boolean;
  autoAdvanceDelay?: number;
  questionId?: string;
  enableButtonOnlyWhenValid?: boolean;
  showValidationFeedback?: boolean;
  validationMessage?: string;
  progressMessage?: string;
  showSelectionCount?: boolean;
  selectionStyle?: 'border' | 'background' | 'shadow';
  selectedColor?: string;
  hoverColor?: string;
  gridGap?: number;
  responsiveColumns?: boolean;
  animation?: string;
  animationDuration?: string;
  scoreValues?: Record<string, number>;
  [key: string]: any;
}

export interface BlockValidationMeta {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: any) => boolean | string;
  isValid?: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface BlockPositionMeta {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface BlockMeta {
  style?: Record<string, any>;
  metadata?: Record<string, any>;
  parentId?: string; // Para blocos aninhados
  ephemeral?: boolean; // Indica bloco não persistente
}

export type BlockType = string; // Mantém flexível; restrições específicas podem ser aplicadas em schemas.

export interface Block extends BlockMeta {
  id: string;
  type: BlockType;
  order: number;
  content: BlockContent;
  properties: BlockProperties;
  validation?: BlockValidationMeta;
  position?: BlockPositionMeta;
}

// Type guard simples
export function isBlock(value: any): value is Block {
  return !!value && typeof value === 'object' && 'id' in value && 'type' in value && 'order' in value;
}

// Normalizador mínimo (placeholder para futura consolidação de origem múltipla)
export function normalizeBlock(raw: any, index: number = 0): Block {
  return {
    id: raw.id ?? `auto-${index}`,
    type: raw.type ?? 'unknown',
    order: raw.order ?? index,
    content: raw.content ?? {},
    properties: raw.properties ?? {},
    validation: raw.validation,
    position: raw.position,
    parentId: raw.parentId,
    ephemeral: raw.ephemeral,
    style: raw.style,
    metadata: raw.metadata,
  };
}

export type CanonicalBlock = Block;

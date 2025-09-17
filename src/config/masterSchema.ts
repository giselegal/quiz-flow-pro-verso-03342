/**
 * 🎯 MASTER SCHEMA - SINGLE SOURCE OF TRUTH
 * 
 * Este arquivo unifica os 4 sistemas fragmentados de schema:
 * - src/config/blockDefinitions.ts (879 linhas)
 * - src/config/blockPropertySchemas.ts (1464 linhas)
 * - src/schemas/blockSchemas.ts (Zod validation)
 * - src/types/editor.ts (600+ linhas)
 * 
 * Benefícios da consolidação:
 * ✅ Single source of truth
 * ✅ Consistent type safety
 * ✅ Unified validation
 * ✅ Simplified maintenance
 * ✅ Better developer experience
 * ✅ Performance optimization
 */

import React from 'react';
import { z } from 'zod';
import { LucideIcon } from 'lucide-react';
import {
  AlignLeft,
  Heading,
  Image,
  Minus,
  Square,
  Type,
  HelpCircle,
  FileText,
  Tag,
  Layout,
  Gift,
  Shield,
} from 'lucide-react';

// Import key components for initial implementation
import HeadingInlineBlock from '@/components/editor/blocks/HeadingInlineBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import SpacerInlineBlock from '@/components/editor/blocks/SpacerInlineBlock';
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';

// =============================================================================
// CORE INTERFACES
// =============================================================================

/**
 * Unified property types enum
 */
export enum UnifiedPropertyType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  RANGE = 'range',
  COLOR = 'color',
  SELECT = 'select',
  SWITCH = 'switch',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  URL = 'url',
  UPLOAD = 'upload',
  IMAGE = 'image',
  RICH_TEXT = 'rich_text',
  JSON = 'json',
  DATE = 'date',
  EMAIL = 'email',
  PHONE = 'phone'
}

/**
 * Property categories for UI organization
 */
export enum PropertyCategory {
  CONTENT = 'content',
  STYLE = 'style',
  LAYOUT = 'layout',
  BEHAVIOR = 'behavior',
  ADVANCED = 'advanced',
  ANIMATION = 'animation',
  ACCESSIBILITY = 'accessibility',
  SEO = 'seo',
  TRANSFORM = 'transform'
}

/**
 * Block categories for component organization
 */
export enum BlockCategory {
  TEXT = 'text',
  MEDIA = 'media',
  FORM = 'form',
  LAYOUT = 'layout',
  QUIZ = 'quiz',
  RESULT = 'result',
  INTERACTION = 'interaction',
  NAVIGATION = 'navigation',
  ADVANCED = 'advanced'
}

/**
 * Master property schema interface
 */
export interface MasterPropertySchema {
  key: string;
  label: string;
  type: UnifiedPropertyType;
  category: PropertyCategory;

  // Validation & Constraints
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: RegExp;
  options?: Array<{ value: any; label: string; description?: string }>;

  // UI Configuration
  description?: string;
  placeholder?: string;
  tooltip?: string;
  group?: string;
  hidden?: boolean;
  disabled?: boolean;

  // Conditional Logic
  dependsOn?: string[];
  showWhen?: string; // Simple expression like "alignment === 'center'"
  hideWhen?: string;

  // Default & Examples
  defaultValue: any;
  examples?: any[];

  // Validation Schema (Zod)
  validation?: z.ZodSchema;
}

/**
 * Master block definition interface
 */
export interface MasterBlockDefinition {
  // Meta Information
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: BlockCategory;

  // React Component
  component: React.ComponentType<any>;
  previewComponent?: React.ComponentType<any>;

  // Schema Unificado
  properties: MasterPropertySchema[];
  defaultProperties: Record<string, any>;

  // Validation (Zod schema for the entire block)
  validationSchema: z.ZodSchema;

  // Metadata
  priority: number;
  isDeprecated?: boolean;
  replaceWith?: string;
  version?: string;

  // UI Metadata
  label?: string; // For backwards compatibility
  tags?: string[];
  searchTerms?: string[];

  // Advanced Configuration
  allowedParents?: string[]; // Block types that can contain this block
  allowedChildren?: string[]; // Block types this block can contain
  maxInstances?: number; // Max instances per funnel

  // Performance
  lazy?: boolean; // Whether to lazy load this component
  preload?: boolean; // Whether to preload this component
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Common validation schemas for reuse
 */
export const commonValidationSchemas = {
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  url: z.string().url('URL inválida').or(z.literal('')),
  email: z.string().email('Email inválido').or(z.literal('')),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato #RRGGBB'),
  positiveNumber: z.number().min(0, 'Deve ser um número positivo'),
  textAlign: z.enum(['left', 'center', 'right', 'justify']),
  fontSize: z.number().min(8, 'Tamanho mínimo: 8px').max(72, 'Tamanho máximo: 72px'),
};

// =============================================================================
// UNIVERSAL PROPERTIES
// =============================================================================

/**
 * Universal properties that apply to all blocks
 */
export const universalProperties: MasterPropertySchema[] = [
  {
    key: 'id',
    label: 'ID',
    type: UnifiedPropertyType.TEXT,
    category: PropertyCategory.ADVANCED,
    required: true,
    defaultValue: '',
    description: 'Identificador único do bloco',
    hidden: true // Hidden in UI but required internally
  },
  {
    key: 'className',
    label: 'Classe CSS',
    type: UnifiedPropertyType.TEXT,
    category: PropertyCategory.ADVANCED,
    defaultValue: '',
    description: 'Classes CSS customizadas',
    placeholder: 'ex: my-custom-class'
  },
  {
    key: 'scale',
    label: 'Escala (%)',
    type: UnifiedPropertyType.RANGE,
    category: PropertyCategory.TRANSFORM,
    min: 10,
    max: 300,
    step: 1,
    defaultValue: 100,
    description: 'Tamanho uniforme do bloco. 100% = tamanho natural.',
    validation: z.number().min(10).max(300)
  },
  {
    key: 'marginTop',
    label: 'Margem Superior',
    type: UnifiedPropertyType.RANGE,
    category: PropertyCategory.LAYOUT,
    min: 0,
    max: 100,
    step: 2,
    defaultValue: 0,
    description: 'Espaçamento superior em pixels'
  },
  {
    key: 'marginBottom',
    label: 'Margem Inferior',
    type: UnifiedPropertyType.RANGE,
    category: PropertyCategory.LAYOUT,
    min: 0,
    max: 100,
    step: 2,
    defaultValue: 0,
    description: 'Espaçamento inferior em pixels'
  },
  {
    key: 'hidden',
    label: 'Oculto',
    type: UnifiedPropertyType.SWITCH,
    category: PropertyCategory.BEHAVIOR,
    defaultValue: false,
    description: 'Ocultar este bloco na renderização'
  },
  {
    key: 'locked',
    label: 'Bloqueado',
    type: UnifiedPropertyType.SWITCH,
    category: PropertyCategory.BEHAVIOR,
    defaultValue: false,
    description: 'Impedir edição deste bloco'
  }
];

// =============================================================================
// MASTER BLOCK REGISTRY
// =============================================================================

/**
 * Main registry for all block definitions
 * This will replace all fragmented registries
 */
export const MASTER_BLOCK_REGISTRY: Record<string, MasterBlockDefinition> = {
  // =============================================================================
  // TEXT BLOCKS
  // =============================================================================

  'heading': {
    type: 'heading',
    name: 'Título',
    description: 'Título principal com diferentes níveis (H1-H6)',
    icon: Heading,
    category: BlockCategory.TEXT,
    component: HeadingInlineBlock,
    priority: 10,

    properties: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: UnifiedPropertyType.TEXT,
        category: PropertyCategory.CONTENT,
        required: true,
        defaultValue: 'Título Principal',
        placeholder: 'Digite o título...',
        description: 'Texto do título',
        validation: commonValidationSchemas.title
      },
      {
        key: 'level',
        label: 'Nível do Título',
        type: UnifiedPropertyType.SELECT,
        category: PropertyCategory.CONTENT,
        defaultValue: 'h2',
        options: [
          { value: 'h1', label: 'Título 1 (H1)' },
          { value: 'h2', label: 'Título 2 (H2)' },
          { value: 'h3', label: 'Título 3 (H3)' },
          { value: 'h4', label: 'Título 4 (H4)' },
          { value: 'h5', label: 'Título 5 (H5)' },
          { value: 'h6', label: 'Título 6 (H6)' },
        ],
        validation: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: UnifiedPropertyType.SELECT,
        category: PropertyCategory.STYLE,
        defaultValue: 'left',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
        ],
        validation: commonValidationSchemas.textAlign
      }
    ],

    defaultProperties: {
      content: 'Título Principal',
      level: 'h2',
      textAlign: 'left',
    },

    validationSchema: z.object({
      content: commonValidationSchemas.title,
      level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
      textAlign: commonValidationSchemas.textAlign
    }),

    tags: ['título', 'heading', 'h1', 'h2', 'h3'],
    searchTerms: ['título', 'cabeçalho', 'heading']
  },

  'text-inline': {
    type: 'text-inline',
    name: 'Texto',
    description: 'Componente de texto com propriedades editáveis completas',
    icon: Type,
    category: BlockCategory.TEXT,
    component: TextInlineBlock,
    priority: 10,

    properties: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: UnifiedPropertyType.TEXTAREA,
        category: PropertyCategory.CONTENT,
        required: true,
        defaultValue: 'Digite seu texto aqui...',
        placeholder: 'Digite o texto...',
        description: 'Texto do componente (suporte HTML)',
        validation: commonValidationSchemas.content
      },
      {
        key: 'fontSize',
        label: 'Tamanho da Fonte',
        type: UnifiedPropertyType.SELECT,
        category: PropertyCategory.STYLE,
        defaultValue: 'text-base',
        options: [
          { value: 'text-xs', label: 'Extra Pequeno' },
          { value: 'text-sm', label: 'Pequeno' },
          { value: 'text-base', label: 'Normal' },
          { value: 'text-lg', label: 'Grande' },
          { value: 'text-xl', label: 'Extra Grande' },
          { value: 'text-2xl', label: 'Muito Grande' },
        ],
        validation: z.enum(['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'])
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: UnifiedPropertyType.SELECT,
        category: PropertyCategory.STYLE,
        defaultValue: 'left',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
          { value: 'justify', label: 'Justificado' },
        ],
        validation: commonValidationSchemas.textAlign
      }
    ],

    defaultProperties: {
      content: 'Digite seu texto aqui...',
      fontSize: 'text-base',
      textAlign: 'left',
    },

    validationSchema: z.object({
      content: commonValidationSchemas.content,
      fontSize: z.enum(['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']),
      textAlign: commonValidationSchemas.textAlign
    }),

    tags: ['texto', 'paragraph', 'content'],
    searchTerms: ['texto', 'parágrafo', 'conteúdo']
  },

  // =============================================================================
  // LAYOUT BLOCKS
  // =============================================================================

  'spacer': {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Espaço em branco vertical para organização de layout',
    icon: Minus,
    category: BlockCategory.LAYOUT,
    component: SpacerInlineBlock,
    priority: 8,

    properties: [
      {
        key: 'height',
        label: 'Altura (px)',
        type: UnifiedPropertyType.RANGE,
        category: PropertyCategory.LAYOUT,
        defaultValue: 40,
        min: 10,
        max: 200,
        step: 5,
        description: 'Altura do espaçamento em pixels',
        validation: z.number().min(10).max(200)
      }
    ],

    defaultProperties: {
      height: 40,
    },

    validationSchema: z.object({
      height: z.number().min(10).max(200)
    }),

    tags: ['espaço', 'spacing', 'layout'],
    searchTerms: ['espaçador', 'espaço', 'margem']
  },

  // =============================================================================
  // QUIZ BLOCKS
  // =============================================================================

  'quiz-intro-header': {
    type: 'quiz-intro-header',
    name: 'Cabeçalho do Quiz',
    description: 'Cabeçalho introdutório para início do quiz',
    icon: HelpCircle,
    category: BlockCategory.QUIZ,
    component: QuizIntroHeaderBlock,
    priority: 9,

    properties: [
      {
        key: 'title',
        label: 'Título',
        type: UnifiedPropertyType.TEXT,
        category: PropertyCategory.CONTENT,
        required: true,
        defaultValue: 'Bem-vindo ao Quiz',
        placeholder: 'Digite o título do quiz...',
        description: 'Título principal do quiz',
        validation: commonValidationSchemas.title
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: UnifiedPropertyType.TEXT,
        category: PropertyCategory.CONTENT,
        defaultValue: 'Descubra qual é o melhor para você',
        placeholder: 'Digite o subtítulo...',
        description: 'Subtítulo explicativo',
        validation: z.string().optional()
      }
    ],

    defaultProperties: {
      title: 'Bem-vindo ao Quiz',
      subtitle: 'Descubra qual é o melhor para você',
    },

    validationSchema: z.object({
      title: commonValidationSchemas.title,
      subtitle: z.string().optional()
    }),

    tags: ['quiz', 'header', 'intro'],
    searchTerms: ['quiz', 'cabeçalho', 'introdução']
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get block definition by type
 */
export function getMasterBlockDefinition(type: string): MasterBlockDefinition | undefined {
  return MASTER_BLOCK_REGISTRY[type];
}

/**
 * Get all properties for a block (universal + specific)
 */
export function getAllPropertiesForBlock(type: string): MasterPropertySchema[] {
  const blockDef = getMasterBlockDefinition(type);
  if (!blockDef) return universalProperties;

  return [...universalProperties, ...blockDef.properties];
}

/**
 * Get properties by category
 */
export function getPropertiesByCategory(
  type: string,
  category: PropertyCategory
): MasterPropertySchema[] {
  const allProperties = getAllPropertiesForBlock(type);
  return allProperties.filter(prop => prop.category === category);
}

/**
 * Validate block data against its schema
 */
export function validateBlockData(type: string, data: any): { success: boolean; errors?: string[] } {
  const blockDef = getMasterBlockDefinition(type);
  if (!blockDef) {
    return { success: false, errors: ['Block type not found'] };
  }

  try {
    blockDef.validationSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Get blocks by category
 */
export function getBlocksByCategory(category: BlockCategory): MasterBlockDefinition[] {
  return Object.values(MASTER_BLOCK_REGISTRY).filter(block => block.category === category);
}

/**
 * Search blocks by name, description, or tags
 */
export function searchBlocks(query: string): MasterBlockDefinition[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(MASTER_BLOCK_REGISTRY).filter(block =>
    block.name.toLowerCase().includes(lowercaseQuery) ||
    block.description.toLowerCase().includes(lowercaseQuery) ||
    block.searchTerms?.some(term => term.toLowerCase().includes(lowercaseQuery)) ||
    block.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get block default properties with universal properties
 */
export function getBlockDefaultProperties(type: string): Record<string, any> {
  const blockDef = getMasterBlockDefinition(type);
  const universalDefaults = universalProperties.reduce((acc, prop) => ({
    ...acc,
    [prop.key]: prop.defaultValue
  }), {});

  if (!blockDef) return universalDefaults;

  return {
    ...universalDefaults,
    ...blockDef.defaultProperties
  };
}

// =============================================================================
// MIGRATION HELPERS
// =============================================================================

/**
 * Convert legacy block definition to master schema
 */
export function convertLegacyBlockDefinition(legacyDef: any): MasterBlockDefinition {
  // Implementation will be added in migration phase
  throw new Error('Migration helper not implemented yet');
}

/**
 * Convert legacy property schema to master property
 */
export function convertLegacyPropertySchema(legacyProp: any): MasterPropertySchema {
  // Implementation will be added in migration phase
  throw new Error('Migration helper not implemented yet');
}

export default MASTER_BLOCK_REGISTRY;
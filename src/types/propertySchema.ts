/**
 * 🎯 UNIFIED PROPERTY SCHEMA
 *
 * Consolidated PropertySchema interface that unifies all fragmented implementations:
 * - src/types/editor.ts
 * - src/components/editor/blocks/EnhancedBlockRegistry.tsx
 * - src/config/blockDefinitionsOptimized.ts
 * - src/hooks/useUnifiedProperties.ts
 *
 * This creates a single source of truth for property definitions across the system.
 */

/**
 * 🎯 Property Types - Core enumeration
 */
export enum PropertyType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  RANGE = 'range',
  COLOR = 'color',
  SELECT = 'select',
  SWITCH = 'switch',
  ARRAY = 'array',
  OBJECT = 'object',
  UPLOAD = 'upload',
  URL = 'url',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  JSON = 'json',
  RICH_TEXT = 'rich_text',
  MARKDOWN = 'markdown',
  CODE = 'code',
  EMAIL = 'email',
  PHONE = 'phone',
}

/**
 * 🏷️ Property Categories
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
}

export type PropertyCategoryOrString = PropertyCategory | string;

/**
 * 🔧 Unified Property Interface (for runtime property instances)
 */
export interface UnifiedProperty {
  key: string;
  value: any;
  type: PropertyType;
  label: string;
  category: PropertyCategoryOrString;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  validation?: (value: any) => boolean | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: Array<{ value: any; label: string; disabled?: boolean }>;
  dependencies?: string[];
  conditional?: {
    key: string;
    value: any;
  };
}

/**
 * 🔄 UNIFIED PROPERTY SCHEMA
 * Consolidates all PropertySchema variants into a single, comprehensive interface
 */
export interface PropertySchema {
  // Core identification
  key: string;
  type: PropertyType;
  label: string;

  // Metadata
  description?: string;
  category?: PropertyCategoryOrString;
  required?: boolean;
  placeholder?: string;

  // Value configuration
  defaultValue?: any;

  // Validation - support both object and function forms
  validation?:
    | {
        min?: number;
        max?: number;
        pattern?: string;
      }
    | ((value: any) => boolean | string);

  // Range/Number specific
  min?: number;
  max?: number;
  step?: number;
  unit?: string;

  // Select specific
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;

  // Textarea specific
  rows?: number;

  // Array specific
  itemSchema?: PropertySchema[];
  maxItems?: number;
  minItems?: number;

  // Advanced features
  nestedPath?: string;
  tooltip?: string;
  dependencies?: string[];
  conditional?: {
    key: string;
    value: any;
  };
}

/**
 * 🔄 BACKWARDS COMPATIBILITY TYPES
 * Maintain compatibility with existing code
 */

// Legacy PropertySchema from editor.ts
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

// Enhanced Block Registry PropertySchema
export interface EnhancedPropertySchema {
  key: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'boolean'
    | 'select'
    | 'color'
    | 'image'
    | 'array'
    | 'object'
    | 'rich-text';
  label: string;
  description?: string;
  required?: boolean;
  tooltip?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Block Definitions Optimized PropertySchema
export interface OptimizedPropertySchema {
  key: string;
  label: string;
  type:
    | 'text-input'
    | 'textarea'
    | 'number-input'
    | 'boolean-switch'
    | 'color-picker'
    | 'select'
    | 'image-url'
    | 'video-url'
    | 'array-editor'
    | 'json-editor';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: any;
  rows?: number;
  min?: number;
  max?: number;
  description?: string;
  nestedPath?: string;
  itemSchema?: OptimizedPropertySchema[];
}

/**
 * 🔄 CONVERSION UTILITIES
 * Utilities to convert between legacy formats and the unified PropertySchema
 */

/**
 * Convert Legacy PropertySchema to Unified PropertySchema
 */
export function legacyToUnified(legacy: LegacyPropertySchema, key: string): PropertySchema {
  // Map legacy types to PropertyType enum
  const typeMap: Record<string, PropertyType> = {
    string: PropertyType.TEXT,
    number: PropertyType.NUMBER,
    boolean: PropertyType.SWITCH,
    select: PropertyType.SELECT,
    textarea: PropertyType.TEXTAREA,
    array: PropertyType.ARRAY,
    color: PropertyType.COLOR,
    range: PropertyType.RANGE,
  };

  return {
    key,
    type: typeMap[legacy.type] || PropertyType.TEXT,
    label: legacy.label,
    description: legacy.description,
    category: legacy.category,
    required: legacy.required,
    placeholder: legacy.placeholder,
    defaultValue: legacy.default,
    options: legacy.options,
    min: legacy.min,
    max: legacy.max,
    step: legacy.step,
    rows: legacy.rows,
  };
}

/**
 * Convert Enhanced PropertySchema to Unified PropertySchema
 */
export function enhancedToUnified(enhanced: EnhancedPropertySchema): PropertySchema {
  // Map enhanced types to PropertyType enum
  const typeMap: Record<string, PropertyType> = {
    text: PropertyType.TEXT,
    textarea: PropertyType.TEXTAREA,
    number: PropertyType.NUMBER,
    boolean: PropertyType.SWITCH,
    select: PropertyType.SELECT,
    color: PropertyType.COLOR,
    image: PropertyType.UPLOAD,
    array: PropertyType.ARRAY,
    object: PropertyType.JSON,
    'rich-text': PropertyType.RICH_TEXT,
  };

  return {
    key: enhanced.key,
    type: typeMap[enhanced.type] || PropertyType.TEXT,
    label: enhanced.label,
    description: enhanced.description,
    required: enhanced.required,
    tooltip: enhanced.tooltip,
    options: enhanced.options,
    defaultValue: enhanced.defaultValue,
    validation: enhanced.validation,
  };
}

/**
 * Convert Optimized PropertySchema to Unified PropertySchema
 */
export function optimizedToUnified(optimized: OptimizedPropertySchema): PropertySchema {
  // Map optimized types to PropertyType enum
  const typeMap: Record<string, PropertyType> = {
    'text-input': PropertyType.TEXT,
    textarea: PropertyType.TEXTAREA,
    'number-input': PropertyType.NUMBER,
    'boolean-switch': PropertyType.SWITCH,
    'color-picker': PropertyType.COLOR,
    select: PropertyType.SELECT,
    'image-url': PropertyType.URL,
    'video-url': PropertyType.URL,
    'array-editor': PropertyType.ARRAY,
    'json-editor': PropertyType.JSON,
  };

  return {
    key: optimized.key,
    label: optimized.label,
    type: typeMap[optimized.type] || PropertyType.TEXT,
    placeholder: optimized.placeholder,
    options: optimized.options?.map(opt => ({ value: opt.value, label: opt.label })),
    defaultValue: optimized.defaultValue,
    rows: optimized.rows,
    min: optimized.min,
    max: optimized.max,
    description: optimized.description,
    nestedPath: optimized.nestedPath,
    itemSchema: optimized.itemSchema?.map(optimizedToUnified),
  };
}

/**
 * Convert UnifiedProperty to PropertySchema for compatibility
 */
export function unifiedPropertyToSchema(property: UnifiedProperty): PropertySchema {
  return {
    key: property.key,
    type: property.type,
    label: property.label,
    description: property.description,
    category: property.category,
    required: property.required,
    placeholder: property.placeholder,
    defaultValue: property.defaultValue,
    validation: property.validation,
    min: property.min,
    max: property.max,
    step: property.step,
    unit: property.unit,
    options: property.options,
    dependencies: property.dependencies,
    conditional: property.conditional,
  };
}

/**
 * Convert PropertySchema to UnifiedProperty
 */
export function schemaToUnifiedProperty(schema: PropertySchema): UnifiedProperty {
  return {
    key: schema.key,
    value: schema.defaultValue,
    type: schema.type,
    label: schema.label,
    category: schema.category || PropertyCategory.CONTENT,
    description: schema.description,
    placeholder: schema.placeholder,
    required: schema.required,
    defaultValue: schema.defaultValue,
    validation: typeof schema.validation === 'function' ? schema.validation : undefined,
    min: schema.min,
    max: schema.max,
    step: schema.step,
    unit: schema.unit,
    options: schema.options,
    dependencies: schema.dependencies,
    conditional: schema.conditional,
  };
}

// Re-export PropertySchema as default export for primary usage
export default PropertySchema;

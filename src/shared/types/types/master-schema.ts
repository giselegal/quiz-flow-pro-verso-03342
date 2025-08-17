/**
 * MASTER UNIFIED SCHEMA
 *
 * This is the single source of truth for all schemas in the application.
 * Consolidates multiple fragmented schema definitions into one unified system.
 *
 * Design Principles:
 * - Single source of truth
 * - Zod-first validation with TypeScript inference
 * - Backward compatibility with legacy schemas
 * - Performance optimized
 */

import { z } from 'zod';

// =============================================================================
// BASE TYPES AND ENUMS
// =============================================================================

export const PropertyTypeEnum = z.enum([
  'text',
  'textarea',
  'number',
  'range',
  'color',
  'select',
  'switch',
  'boolean',
  'array',
  'object',
  'upload',
  'url',
  'date',
  'time',
  'datetime',
  'json',
  'rich_text',
  'markdown',
  'code',
  'email',
  'phone',
  'image',
  'video',
]);

export const PropertyCategoryEnum = z.enum([
  'content',
  'style',
  'layout',
  'behavior',
  'advanced',
  'animation',
  'accessibility',
  'seo',
]);

export const BlockTypeEnum = z.enum([
  'text',
  'heading',
  'button',
  'image',
  'video',
  'form',
  'divider',
  'spacer',
  'quiz-question',
  'quiz-result',
  'lead-form',
  'pricing',
  'testimonial',
  'faq',
  'countdown',
  'progress',
  'custom',
]);

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

export const ValidationRuleSchema = z.object({
  type: z.enum(['required', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'custom']),
  value: z.any().optional(),
  message: z.string(),
  validator: z.function().optional(),
});

export const PropertyValidationSchema = z.union([
  z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    required: z.boolean().optional(),
    custom: z.function().optional(),
  }),
  z.array(ValidationRuleSchema),
  z.function(),
]);

// =============================================================================
// CORE PROPERTY SCHEMA
// =============================================================================

export const UnifiedPropertySchema = z.object({
  key: z.string().min(1),
  type: PropertyTypeEnum,
  label: z.string().min(1),
  description: z.string().optional(),
  category: PropertyCategoryEnum.optional().default('content'),
  defaultValue: z.any(),
  value: z.any().optional(),

  // Validation
  validation: PropertyValidationSchema.optional(),
  required: z.boolean().optional().default(false),

  // UI Configuration
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.any(),
      })
    )
    .optional(),

  // Conditional Display
  condition: z
    .object({
      dependsOn: z.string(),
      value: z.any(),
      operator: z
        .enum(['equals', 'not-equals', 'contains', 'not-contains', 'greater', 'less'])
        .optional()
        .default('equals'),
    })
    .optional(),

  // Advanced
  readonly: z.boolean().optional().default(false),
  hidden: z.boolean().optional().default(false),
  order: z.number().optional().default(0),

  // Metadata
  version: z.string().optional().default('1.0'),
  lastModified: z.date().optional(),
});

// =============================================================================
// BLOCK SCHEMA
// =============================================================================

export const UnifiedBlockSchema = z.object({
  id: z.string(),
  type: BlockTypeEnum,
  name: z.string().optional(),

  // Properties
  properties: z.record(z.string(), z.any()).default({}),
  propertyDefinitions: z.array(UnifiedPropertySchema).optional(),

  // Hierarchy
  parentId: z.string().optional(),
  children: z.array(z.string()).optional().default([]),
  order: z.number().default(0),

  // Styling
  className: z.string().optional(),
  style: z.record(z.string(), z.any()).optional(),

  // Behavior
  events: z.record(z.string(), z.any()).optional().default({}),

  // Metadata
  locked: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  version: z.string().optional().default('1.0'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// =============================================================================
// STAGE/PAGE SCHEMA
// =============================================================================

export const UnifiedStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),

  // Blocks
  blocks: z.array(UnifiedBlockSchema).default([]),
  blockOrder: z.array(z.string()).optional().default([]),

  // Configuration
  settings: z.record(z.string(), z.any()).optional().default({}),
  theme: z.string().optional(),

  // Navigation
  nextStageId: z.string().optional(),
  prevStageId: z.string().optional(),

  // Metadata
  order: z.number().default(0),
  active: z.boolean().optional().default(true),
  version: z.string().optional().default('1.0'),
});

// =============================================================================
// FUNNEL/QUIZ SCHEMA
// =============================================================================

export const UnifiedFunnelSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),

  // Structure
  stages: z.array(UnifiedStageSchema).default([]),
  activeStageId: z.string().optional(),

  // Configuration
  settings: z
    .object({
      theme: z.string().optional(),
      analytics: z
        .object({
          enabled: z.boolean().default(true),
          trackingId: z.string().optional(),
        })
        .optional(),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional()
    .default({}),

  // Publishing
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.date().optional(),

  // Metadata
  authorId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  version: z.string().optional().default('1.0'),
});

// =============================================================================
// EXPORTED TYPES (Inferred from Zod schemas)
// =============================================================================

export type PropertyType = z.infer<typeof PropertyTypeEnum>;
export type PropertyCategory = z.infer<typeof PropertyCategoryEnum>;
export type BlockType = z.infer<typeof BlockTypeEnum>;
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;
export type PropertyValidation = z.infer<typeof PropertyValidationSchema>;
export type UnifiedProperty = z.infer<typeof UnifiedPropertySchema>;
export type UnifiedBlock = z.infer<typeof UnifiedBlockSchema>;
export type UnifiedStage = z.infer<typeof UnifiedStageSchema>;
export type UnifiedFunnel = z.infer<typeof UnifiedFunnelSchema>;

// =============================================================================
// MIGRATION UTILITIES
// =============================================================================

export class SchemaMigration {
  /**
   * Convert legacy property schema to unified format
   */
  static legacyToUnified(legacy: any): UnifiedProperty {
    try {
      const unified: UnifiedProperty = {
        key: legacy.key || legacy.name || 'unknown',
        type: legacy.type || 'text',
        label: legacy.label || legacy.title || legacy.key || 'Unknown',
        defaultValue: legacy.defaultValue ?? legacy.default ?? '',
        category: legacy.category || 'content',
        version: '1.0',
        hidden: false,
        order: 0,
        required: false,
        readonly: false,
      };

      // Add optional fields if they exist
      if (legacy.description) unified.description = legacy.description;
      if (legacy.placeholder) unified.placeholder = legacy.placeholder;
      if (legacy.helpText) unified.helpText = legacy.helpText;
      if (legacy.options) unified.options = legacy.options;
      if (legacy.validation) unified.validation = legacy.validation;
      if (legacy.required !== undefined) unified.required = legacy.required;

      return UnifiedPropertySchema.parse(unified);
    } catch (error) {
      console.error('Schema migration failed for legacy property:', legacy, error);
      // Fallback to minimal valid property
      return {
        key: 'migration_error',
        type: 'text',
        label: 'Migration Error',
        defaultValue: '',
        category: 'content',
        version: '1.0',
        hidden: false,
        order: 0,
        required: false,
        readonly: false,
      };
    }
  }

  /**
   * Validate migration without throwing
   */
  static validateMigration(original: any, converted: UnifiedProperty): boolean {
    try {
      const isValid = UnifiedPropertySchema.safeParse(converted).success;
      const preservedKey = original.key === converted.key || original.name === converted.key;
      const preservedType = original.type === converted.type;

      return isValid && preservedKey && preservedType;
    } catch {
      return false;
    }
  }

  /**
   * Batch migrate array of legacy properties
   */
  static batchMigrate(legacyProperties: any[]): UnifiedProperty[] {
    return legacyProperties.map(legacy => this.legacyToUnified(legacy));
  }
}

// =============================================================================
// VALIDATION SERVICE
// =============================================================================

export class ValidationService {
  static validateWithRecovery<T>(
    data: unknown,
    schema: z.ZodSchema<T>,
    options: {
      source: string;
      fallback?: T;
      logErrors?: boolean;
    }
  ): { success: true; data: T } | { success: false; error: string; fallback?: T } {
    try {
      const result = schema.safeParse(data);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const error = `Validation failed in ${options.source}: ${result.error.message}`;
        if (options.logErrors) {
          console.error(error, { data, errors: result.error.errors });
        }
        return {
          success: false,
          error,
          fallback: options.fallback,
        };
      }
    } catch (error) {
      const errorMessage = `Validation exception in ${options.source}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      if (options.logErrors) {
        console.error(errorMessage, { data, error });
      }
      return {
        success: false,
        error: errorMessage,
        fallback: options.fallback,
      };
    }
  }

  static createFallbackProperty(key: string): UnifiedProperty {
    return {
      key,
      type: 'text',
      label: key.charAt(0).toUpperCase() + key.slice(1),
      defaultValue: '',
      category: 'content',
      version: '1.0',
      hidden: false,
      order: 0,
      required: false,
      readonly: false,
    };
  }

  static createFallbackBlock(id: string, type: BlockType = 'text'): UnifiedBlock {
    return {
      id,
      type,
      properties: {},
      children: [],
      order: 0,
      events: {},
      version: '1.0',
      visible: true,
      locked: false,
    };
  }
}

/**
 * SCHEMA VALIDATION SYSTEM
 * 
 * Comprehensive validation schemas that ensure alignment between frontend types
 * and Supabase database schema, providing runtime type safety and validation.
 * 
 * Features:
 * - Runtime validation with Zod
 * - Supabase schema alignment
 * - Error handling with detailed messages
 * - Transform functions for data normalization
 * - Type guards for safe type checking
 */

import { z } from 'zod';

// =============================================================================
// BASE VALIDATORS
// =============================================================================

// UUID validation
const uuidSchema = z.string().uuid('Invalid UUID format');

// JSON validation that allows any JSON value  
const jsonSchema = z.union([
  z.null(),
  z.boolean(),
  z.number(),
  z.string(),
  z.array(z.any()),
  z.record(z.any())
]).refine(
  (val) => {
    try {
      if (typeof val === 'string') {
        JSON.parse(val);
      }
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Invalid JSON format' }
);

// Timestamp validation
const timestampSchema = z.string().datetime('Invalid timestamp format');

// =============================================================================
// COMPONENT SCHEMAS
// =============================================================================

// Component Type Schema (aligned with component_types table)
export const ComponentTypeSchema = z.object({
  id: uuidSchema,
  type_key: z.string().min(1, 'Type key is required'),
  display_name: z.string().min(1, 'Display name is required'),
  description: z.string().nullable(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().nullable(),
  component_path: z.string().min(1, 'Component path is required'),
  icon: z.string().nullable(),
  preview_image_url: z.string().url().nullable().or(z.literal('')),
  default_properties: jsonSchema.default({}),
  validation_schema: jsonSchema.default({}),
  custom_styling: jsonSchema.nullable(),
  is_system: z.boolean().nullable().default(false),
  is_active: z.boolean().nullable().default(true),
  version: z.number().int().min(1).nullable().default(1),
  usage_count: z.number().int().min(0).nullable().default(0),
  last_used_at: timestampSchema.nullable(),
  created_at: timestampSchema.nullable(),
  updated_at: timestampSchema.nullable(),
  created_by: uuidSchema.nullable(),
});

// Component Instance Schema (aligned with component_instances table)
export const ComponentInstanceSchema = z.object({
  id: uuidSchema,
  instance_key: z.string().min(1, 'Instance key is required'),
  component_type_key: z.string().min(1, 'Component type key is required'),
  funnel_id: uuidSchema,
  step_number: z.number().int().min(1, 'Step number must be positive'),
  order_index: z.number().int().min(0, 'Order index must be non-negative'),
  properties: jsonSchema.default({}),
  custom_styling: jsonSchema.nullable(),
  stage_id: z.string().nullable(),
  is_active: z.boolean().nullable().default(true),
  is_locked: z.boolean().nullable().default(false),
  is_template: z.boolean().nullable().default(false),
  created_at: timestampSchema.nullable(),
  updated_at: timestampSchema.nullable(),
  created_by: uuidSchema.nullable(),
});

// Insert schemas (for creating new records)
export const InsertComponentTypeSchema = ComponentTypeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial({
  description: true,
  subcategory: true,
  icon: true,
  preview_image_url: true,
  custom_styling: true,
  is_system: true,
  is_active: true,
  version: true,
  usage_count: true,
  last_used_at: true,
  created_by: true,
});

export const InsertComponentInstanceSchema = ComponentInstanceSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial({
  custom_styling: true,
  stage_id: true,
  is_active: true,
  is_locked: true,
  is_template: true,
  created_by: true,
});

// Update schemas (for updating existing records)
export const UpdateComponentTypeSchema = ComponentTypeSchema.partial().omit({
  id: true,
  created_at: true,
});

export const UpdateComponentInstanceSchema = ComponentInstanceSchema.partial().omit({
  id: true,
  created_at: true,
});

// =============================================================================
// FUNNEL SCHEMAS
// =============================================================================

// Funnel Schema (aligned with funnels table)
export const FunnelSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1, 'Funnel name is required').max(255, 'Name too long'),
  description: z.string().nullable(),
  author_id: uuidSchema,
  is_published: z.boolean().default(false),
  theme: z.string().nullable(),
  template_id: z.string().nullable(),
  tags: z.array(z.string()).default([]),
  settings: jsonSchema.default({}),
  created_at: timestampSchema.nullable(),
  updated_at: timestampSchema.nullable(),
});

// Funnel Page Schema (aligned with funnel_pages table)
export const FunnelPageSchema = z.object({
  id: uuidSchema,
  funnel_id: uuidSchema,
  title: z.string().max(255, 'Title too long').nullable(),
  blocks: z.array(z.unknown()).min(0, 'Blocks must be an array'),
  metadata: jsonSchema.nullable(),
  created_at: timestampSchema.nullable(),
  updated_at: timestampSchema.nullable(),
});

// Insert and Update schemas for Funnels
export const InsertFunnelSchema = FunnelSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial({
  description: true,
  is_published: true,
  theme: true,
  template_id: true,
  tags: true,
  settings: true,
});

export const UpdateFunnelSchema = FunnelSchema.partial().omit({
  id: true,
  created_at: true,
});

export const InsertFunnelPageSchema = FunnelPageSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial({
  title: true,
  metadata: true,
});

export const UpdateFunnelPageSchema = FunnelPageSchema.partial().omit({
  id: true,
  created_at: true,
});

// =============================================================================
// QUIZ SCHEMAS
// =============================================================================

// Quiz User Schema (aligned with quiz_users table)
export const QuizUserSchema = z.object({
  id: uuidSchema,
  session_id: z.string().min(1, 'Session ID is required'),
  name: z.string().nullable(),
  email: z.string().email('Invalid email format').nullable(),
  phone: z.string().nullable(),
  utm_source: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_campaign: z.string().nullable(),
  referrer: z.string().nullable(),
  user_agent: z.string().nullable(),
  ip_address: z.string().ip().nullable(),
  started_at: timestampSchema.nullable(),
  completed_at: timestampSchema.nullable(),
  last_step: z.number().int().min(1).default(1),
  is_active: z.boolean().default(true),
  conversion_status: z.enum(['lead', 'qualified', 'customer']).default('lead'),
  created_at: timestampSchema.nullable(),
  updated_at: timestampSchema.nullable(),
});

// Quiz Step Response Schema (aligned with quiz_step_responses table)
export const QuizStepResponseSchema = z.object({
  id: uuidSchema,
  session_id: z.string().min(1, 'Session ID is required'),
  step_number: z.number().int().min(1, 'Step number must be positive'),
  response_data: jsonSchema,
  response_time_ms: z.number().int().min(0).nullable(),
  component_id: z.string().nullable(),
  component_type: z.string().nullable(),
  responded_at: timestampSchema.nullable(),
});

// Insert schemas for Quiz entities
export const InsertQuizUserSchema = QuizUserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial({
  name: true,
  email: true,
  phone: true,
  utm_source: true,
  utm_medium: true,
  utm_campaign: true,
  referrer: true,
  user_agent: true,
  ip_address: true,
  started_at: true,
  completed_at: true,
  last_step: true,
  is_active: true,
  conversion_status: true,
});

export const InsertQuizStepResponseSchema = QuizStepResponseSchema.omit({
  id: true,
  responded_at: true,
}).partial({
  response_time_ms: true,
  component_id: true,
  component_type: true,
});

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Safe validation function that returns detailed error information
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): {
  success: boolean;
  data?: T;
  error?: string;
  details?: z.ZodError;
} {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      const errorMessage = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      
      console.error(
        `❌ [Schema Validation] ${context || 'Unknown'}:`,
        errorMessage,
        result.error.errors
      );
      
      return {
        success: false,
        error: errorMessage,
        details: result.error,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    console.error(`❌ [Schema Validation] Unexpected error in ${context}:`, error);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validates component instance data before Supabase operations
 */
export function validateComponentInstance(data: unknown): {
  success: boolean;
  data?: z.infer<typeof ComponentInstanceSchema>;
  error?: string;
} {
  return validateSchema(ComponentInstanceSchema, data, 'Component Instance');
}

/**
 * Validates component instance insert data
 */
export function validateComponentInstanceInsert(data: unknown): {
  success: boolean;
  data?: z.infer<typeof InsertComponentInstanceSchema>;
  error?: string;
} {
  return validateSchema(InsertComponentInstanceSchema, data, 'Component Instance Insert');
}

/**
 * Validates component instance update data
 */
export function validateComponentInstanceUpdate(data: unknown): {
  success: boolean;
  data?: z.infer<typeof UpdateComponentInstanceSchema>;
  error?: string;
} {
  return validateSchema(UpdateComponentInstanceSchema, data, 'Component Instance Update');
}

/**
 * Validates funnel data
 */
export function validateFunnel(data: unknown): {
  success: boolean;
  data?: z.infer<typeof FunnelSchema>;
  error?: string;
} {
  return validateSchema(FunnelSchema, data, 'Funnel');
}

/**
 * Validates quiz user data
 */
export function validateQuizUser(data: unknown): {
  success: boolean;
  data?: z.infer<typeof QuizUserSchema>;
  error?: string;
} {
  return validateSchema(QuizUserSchema, data, 'Quiz User');
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard for ComponentInstance
 */
export function isComponentInstance(data: unknown): data is z.infer<typeof ComponentInstanceSchema> {
  return ComponentInstanceSchema.safeParse(data).success;
}

/**
 * Type guard for ComponentType
 */
export function isComponentType(data: unknown): data is z.infer<typeof ComponentTypeSchema> {
  return ComponentTypeSchema.safeParse(data).success;
}

/**
 * Type guard for Funnel
 */
export function isFunnel(data: unknown): data is z.infer<typeof FunnelSchema> {
  return FunnelSchema.safeParse(data).success;
}

/**
 * Type guard for QuizUser
 */
export function isQuizUser(data: unknown): data is z.infer<typeof QuizUserSchema> {
  return QuizUserSchema.safeParse(data).success;
}

// =============================================================================
// DATA TRANSFORM FUNCTIONS
// =============================================================================

/**
 * Transforms raw Supabase data to ensure consistency
 */
export function transformSupabaseData<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T | null {
  const validation = validateSchema(schema, data);
  return validation.success ? validation.data! : null;
}

/**
 * Normalizes component instance data for consistency
 */
export function normalizeComponentInstance(
  data: unknown
): z.infer<typeof ComponentInstanceSchema> | null {
  return transformSupabaseData(data, ComponentInstanceSchema);
}

/**
 * Normalizes component properties ensuring they're valid JSON
 */
export function normalizeComponentProperties(properties: unknown): Record<string, any> {
  if (!properties) return {};
  
  if (typeof properties === 'string') {
    try {
      return JSON.parse(properties);
    } catch {
      return {};
    }
  }
  
  if (typeof properties === 'object' && properties !== null) {
    return properties as Record<string, any>;
  }
  
  return {};
}

// =============================================================================
// BATCH VALIDATION
// =============================================================================

/**
 * Validates an array of data against a schema
 */
export function validateBatch<T>(
  schema: z.ZodSchema<T>,
  dataArray: unknown[],
  context?: string
): {
  success: boolean;
  validData: T[];
  errors: Array<{ index: number; error: string }>;
} {
  const validData: T[] = [];
  const errors: Array<{ index: number; error: string }> = [];
  
  dataArray.forEach((item, index) => {
    const validation = validateSchema(schema, item, `${context} [${index}]`);
    
    if (validation.success && validation.data) {
      validData.push(validation.data);
    } else {
      errors.push({
        index,
        error: validation.error || 'Unknown validation error',
      });
    }
  });
  
  return {
    success: errors.length === 0,
    validData,
    errors,
  };
}

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type ComponentType = z.infer<typeof ComponentTypeSchema>;
export type ComponentInstance = z.infer<typeof ComponentInstanceSchema>;
export type InsertComponentType = z.infer<typeof InsertComponentTypeSchema>;
export type InsertComponentInstance = z.infer<typeof InsertComponentInstanceSchema>;
export type UpdateComponentType = z.infer<typeof UpdateComponentTypeSchema>;
export type UpdateComponentInstance = z.infer<typeof UpdateComponentInstanceSchema>;

export type Funnel = z.infer<typeof FunnelSchema>;
export type FunnelPage = z.infer<typeof FunnelPageSchema>;
export type InsertFunnel = z.infer<typeof InsertFunnelSchema>;
export type UpdateFunnel = z.infer<typeof UpdateFunnelSchema>;

export type QuizUser = z.infer<typeof QuizUserSchema>;
export type QuizStepResponse = z.infer<typeof QuizStepResponseSchema>;
export type InsertQuizUser = z.infer<typeof InsertQuizUserSchema>;
export type InsertQuizStepResponse = z.infer<typeof InsertQuizStepResponseSchema>;

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

export const VALIDATION_CONSTANTS = {
  MAX_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_STEP_NUMBER: 1,
  MAX_STEP_NUMBER: 50,
  MIN_ORDER_INDEX: 0,
  MAX_ORDER_INDEX: 1000,
} as const;
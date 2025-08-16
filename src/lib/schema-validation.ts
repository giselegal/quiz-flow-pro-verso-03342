
import { z } from 'zod';

// Base schemas for validation
const ComponentInstanceSchema = z.object({
  id: z.string(),
  component_type_key: z.string(),
  created_at: z.string().nullable(),
  created_by: z.string().nullable(),
  custom_styling: z.any(),
  funnel_id: z.string(),
  instance_key: z.string(),
  is_active: z.boolean().nullable(),
  is_locked: z.boolean().nullable(),
  is_template: z.boolean().nullable(),
  order_index: z.number(),
  properties: z.any(),
  stage_id: z.string().nullable(),
  step_number: z.number(),
  updated_at: z.string().nullable(),
});

const ComponentInstanceCreateSchema = z.object({
  component_type_key: z.string(),
  funnel_id: z.string(),
  instance_key: z.string(),
  order_index: z.number(),
  properties: z.any(),
  step_number: z.number(),
  created_by: z.string().nullable().optional(),
  custom_styling: z.any().optional(),
  is_active: z.boolean().nullable().optional(),
  is_locked: z.boolean().nullable().optional(),
  is_template: z.boolean().nullable().optional(),
  stage_id: z.string().nullable().optional(),
});

const FunnelSchema = z.object({
  id: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  is_published: z.boolean(),
  settings: z.any(),
  author_id: z.string(),
  theme: z.string().nullable(),
  template_id: z.string().nullable(),
  tags: z.array(z.string()),
});

const QuizUserSchema = z.object({
  id: z.string(),
  created_at: z.string().nullable(),
  is_active: z.boolean(),
  updated_at: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  session_id: z.string(),
  completed_at: z.string().nullable(),
  started_at: z.string().nullable(),
  utm_source: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_campaign: z.string().nullable(),
  utm_content: z.string().nullable(),
  utm_term: z.string().nullable(),
  conversion_status: z.enum(['lead', 'qualified', 'customer']),
});

// Type definitions
export type ComponentInstance = z.infer<typeof ComponentInstanceSchema>;
export type ComponentInstanceCreate = z.infer<typeof ComponentInstanceCreateSchema>;
export type Funnel = z.infer<typeof FunnelSchema>;
export type QuizUser = z.infer<typeof QuizUserSchema>;

// Validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: z.ZodError;
}

// Validation functions
export const validateComponentInstance = (data: unknown): ValidationResult<ComponentInstance> => {
  try {
    const result = ComponentInstanceSchema.parse(data);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dados do componente inválidos',
        details: error,
      };
    }
    return {
      success: false,
      error: 'Erro de validação desconhecido',
    };
  }
};

export const validateComponentInstanceCreate = (data: unknown): ValidationResult<ComponentInstanceCreate> => {
  try {
    const result = ComponentInstanceCreateSchema.parse(data);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dados de criação do componente inválidos',
        details: error,
      };
    }
    return {
      success: false,
      error: 'Erro de validação desconhecido',
    };
  }
};

export const validateFunnel = (data: unknown): ValidationResult<Funnel> => {
  try {
    // Ensure required fields have default values
    const normalizedData = {
      ...data as any,
      is_published: (data as any)?.is_published ?? false,
      settings: (data as any)?.settings ?? {},
      tags: (data as any)?.tags ?? [],
    };

    const result = FunnelSchema.parse(normalizedData);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dados do funil inválidos',
        details: error,
      };
    }
    return {
      success: false,
      error: 'Erro de validação desconhecido',
    };
  }
};

export const validateQuizUser = (data: unknown): ValidationResult<QuizUser> => {
  try {
    // Ensure required fields have default values
    const normalizedData = {
      ...data as any,
      is_active: (data as any)?.is_active ?? true,
      conversion_status: (data as any)?.conversion_status ?? 'lead',
    };

    const result = QuizUserSchema.parse(normalizedData);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dados do usuário inválidos',
        details: error,
      };
    }
    return {
      success: false,
      error: 'Erro de validação desconhecido',
    };
  }
};

// Helper functions for common validation tasks
export const isValidComponentType = (type: string): boolean => {
  const validTypes = [
    'text-inline',
    'button-inline',
    'image-display',
    'heading-component',
    'paragraph-inline',
    'spacer-component',
    'options-grid',
    'progress-bar',
  ];
  return validTypes.includes(type);
};

export const sanitizeComponentData = (data: any): any => {
  return {
    ...data,
    properties: data.properties || {},
    custom_styling: data.custom_styling || {},
    order_index: data.order_index ?? 0,
  };
};

export const validateAndSanitizeComponent = (data: unknown): ValidationResult<ComponentInstance> => {
  const sanitized = sanitizeComponentData(data);
  return validateComponentInstance(sanitized);
};

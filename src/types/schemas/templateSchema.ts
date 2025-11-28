/**
 * Zod Validation Schemas for Templates v3.1
 * 
 * Provides type-safe validation for template JSON structures:
 * - Block schema with type-specific configurations
 * - Step schema with metadata
 * - Template schema with full validation
 * - Validation utilities and error formatting
 * 
 * @module schemas/templateSchema
 */

import { z } from 'zod';
// Substitui dependência externa por formatter interno para evitar erro de subpath './v4'
function formatZodError(err: z.ZodError): string {
  const issues = err.issues || err.errors || [] as any[];
  const first = issues[0];
  const path = Array.isArray(first?.path) ? first.path.join('.') : '';
  const message = first?.message || 'Erro de validação Zod';
  return path ? `${path}: ${message}` : message;
}

/**
 * Base block schema - all blocks must have id and type
 */
export const blockBaseSchema = z.object({
  id: z.string().min(1, 'Block ID é obrigatório'),
  type: z.string().min(1, 'Block type é obrigatório'),
  order: z.number().int().nonnegative().optional(),
  // Accepts string | null | undefined to suport hierarchical blocks sem parent
  parentId: z.string().nullable().optional(),
});

/**
 * Block configuration schema
 * Allows any additional properties for flexibility
 */
export const blockConfigSchema = z.record(z.unknown()).optional();

/**
 * Full block schema with config
 */
export const blockSchema = blockBaseSchema.extend({
  config: blockConfigSchema,
  properties: blockConfigSchema,
  content: blockConfigSchema,
}).passthrough(); // Allow additional properties for backward compatibility

/**
 * Step metadata schema
 */
export const stepMetadataSchema = z
  .object({
    id: z.string().min(1, 'Step metadata.id é obrigatório'),
    name: z.string().min(1, 'Step metadata.name é obrigatório'),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    order: z.number().int().positive().optional(),
  })
  // Mantém campos adicionais como scoring, version e flags específicas
  .passthrough();

/**
 * Step schema (v3.1+ format with blocks array)
 * Suporta v3.0, v3.1, v3.2
 */
export const stepV31Schema = z
  .object({
    templateVersion: z.enum(['3.0', '3.1', '3.2']).optional(),
    metadata: stepMetadataSchema,
    blocks: z.array(blockSchema).min(1, 'Step deve conter pelo menos um bloco'),
  })
  .passthrough();

/**
 * Step schema (simple format with blocks array directly)
 */
export const stepSimpleSchema = z.array(blockSchema).min(1, 'Step deve conter pelo menos um bloco');

/**
 * Step schema - accepts either v3.1 or simple format
 */
export const stepSchema = z.union([stepV31Schema, stepSimpleSchema]);

/**
 * Template metadata schema
 */
export const templateMetadataSchema = z.object({
  id: z.string().min(1, 'Template metadata.id é obrigatório'),
  name: z.string().min(1, 'Template metadata.name é obrigatório'),
  description: z.string().optional(),
  version: z.string().default('3.1'),
  totalSteps: z.number().int().positive().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Full template schema (v3.1 format)
 */
export const templateSchema = z.object({
  metadata: templateMetadataSchema,
  steps: z.record(z.string(), stepSchema).refine(
    (steps) => Object.keys(steps).length > 0,
    'Template deve conter pelo menos uma step'
  ),
});

/**
 * Step file schema for public/templates/funnels/{template}/steps/step-XX.json
 */
export const stepFileSchema = stepV31Schema
  .extend({
    stepId: z.string().regex(/^step-\d{2}$/, 'stepId deve seguir padrão step-XX'),
    stepNumber: z.number().int().positive(),
    type: z.string().min(1, 'type é obrigatório'),
    nextStep: z.string().nullable().optional(),
    templateVersion: z.enum(['3.1', '3.2']),
    metadata: stepMetadataSchema.extend({
      templateId: z.string().optional(),
      version: z.string().min(1, 'metadata.version é obrigatório'),
    }),
  })
  .superRefine((value, ctx) => {
    const hasVersionMismatch = value.metadata?.version && !value.metadata.version.startsWith(value.templateVersion);
    if (hasVersionMismatch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `metadata.version (${value.metadata?.version}) deve começar com templateVersion (${value.templateVersion})`,
        path: ['metadata', 'version'],
      });
    }
  });

/**
 * Manifest schema for master.v3.json entries
 */
export const templateManifestStepSchema = z
  .object({
    id: z.string().regex(/^step-\d{2}$/, 'id deve seguir padrão step-XX'),
    name: z.string().min(1, 'name é obrigatório'),
    type: z.string().min(1, 'type é obrigatório'),
    order: z.number().int().positive(),
    file: z.string().regex(/\.\/steps\/step-\d{2}\.json$/, 'file deve apontar para ./steps/step-XX.json'),
  })
  .passthrough();

export const templateManifestSchema = z
  .object({
    templateVersion: z.enum(['3.1', '3.2']),
    templateId: z.string().min(1, 'templateId é obrigatório'),
    name: z.string().min(1, 'name é obrigatório'),
    description: z.string().optional(),
    metadata: z
      .object({
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        author: z.string().optional(),
        version: z.string().min(1, 'metadata.version é obrigatório'),
        totalSteps: z.number().int().positive().optional(),
        _notes: z.string().optional(),
      })
      .passthrough(),
    steps: z.array(templateManifestStepSchema).min(1, 'Manifesto deve listar ao menos um step'),
  })
  .passthrough();

/**
 * Type inference from schemas
 */
export type BlockBase = z.infer<typeof blockBaseSchema>;
export type Block = z.infer<typeof blockSchema>;
export type StepMetadata = z.infer<typeof stepMetadataSchema>;
export type StepV31 = z.infer<typeof stepV31Schema>;
export type StepSimple = z.infer<typeof stepSimpleSchema>;
export type Step = z.infer<typeof stepSchema>;
export type StepFile = z.infer<typeof stepFileSchema>;
export type TemplateMetadata = z.infer<typeof templateMetadataSchema>;
export type Template = z.infer<typeof templateSchema>;
export type TemplateManifest = z.infer<typeof templateManifestSchema>;

/**
 * Validation result with detailed errors
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[];
}

/**
 * Validate template JSON with detailed error messages
 * 
 * @param data - Unknown data to validate
 * @returns Validation result with parsed data or errors
 * 
 * @example
 * ```ts
 * const result = validateTemplate(jsonData);
 * if (result.success) {
 *   console.log('Valid template:', result.data);
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateTemplate(data: unknown): ValidationResult<Template> {
  try {
    const parsed = templateSchema.parse(data);
    
    const warnings: string[] = [];
    
    // Check for optional but recommended fields
    if (!parsed.metadata.version) {
      warnings.push('metadata.version não especificada (recomendado: "3.1")');
    }
    
    if (!parsed.metadata.totalSteps) {
      warnings.push('metadata.totalSteps não especificada');
    }
    
    // Check if totalSteps matches actual steps count
    if (parsed.metadata.totalSteps) {
      const actualSteps = Object.keys(parsed.steps).length;
      if (parsed.metadata.totalSteps !== actualSteps) {
        warnings.push(
          `metadata.totalSteps (${parsed.metadata.totalSteps}) não corresponde ao número de steps (${actualSteps})`
        );
      }
    }
    
    return {
      success: true,
      data: parsed,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrorMessage = formatZodError(error);
      const errors = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      
      return {
        success: false,
        errors: [validationErrorMessage, ...errors],
      };
    }
    
    return {
      success: false,
      errors: [`Erro de validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
    };
  }
}

/**
 * Validate a v3.1/v3.2 step file (public/templates/funnels/.../steps)
 */
export function validateStepFile(data: unknown): ValidationResult<StepFile> {
  try {
    const parsed = stepFileSchema.parse(data);

    const warnings: string[] = [];

    if (parsed.templateVersion && parsed.metadata?.version) {
      const versionMismatch = !parsed.metadata.version.startsWith(parsed.templateVersion);
      if (versionMismatch) {
        warnings.push(
          `templateVersion (${parsed.templateVersion}) difere do metadata.version (${parsed.metadata.version})`
        );
      }
    }

    return { success: true, data: parsed, warnings: warnings.length ? warnings : undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrorMessage = formatZodError(error);
      const errors = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });

      return { success: false, errors: [validationErrorMessage, ...errors] };
    }

    return { success: false, errors: [`Erro de validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`] };
  }
}

/**
 * Validate the master manifest JSON (master.v3.json)
 */
export function validateTemplateManifest(data: unknown): ValidationResult<TemplateManifest> {
  try {
    const parsed = templateManifestSchema.parse(data);

    const warnings: string[] = [];

    if (parsed.metadata.totalSteps && parsed.metadata.totalSteps !== parsed.steps.length) {
      warnings.push(
        `metadata.totalSteps (${parsed.metadata.totalSteps}) não corresponde ao número de steps (${parsed.steps.length})`
      );
    }

    return { success: true, data: parsed, warnings: warnings.length ? warnings : undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrorMessage = formatZodError(error);
      const errors = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });

      return { success: false, errors: [validationErrorMessage, ...errors] };
    }

    return { success: false, errors: [`Erro de validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`] };
  }
}

/**
 * Validate a single step
 * 
 * @param data - Unknown data to validate
 * @returns Validation result with parsed step or errors
 */
export function validateStep(data: unknown): ValidationResult<Step> {
  try {
    const parsed = stepSchema.parse(data);
    
    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrorMessage = formatZodError(error);
      const errors = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      
      return {
        success: false,
        errors: [validationErrorMessage, ...errors],
      };
    }
    
    return {
      success: false,
      errors: [`Erro de validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
    };
  }
}

/**
 * Validate a single block
 * 
 * @param data - Unknown data to validate
 * @returns Validation result with parsed block or errors
 */
export function validateBlock(data: unknown): ValidationResult<Block> {
  try {
    const parsed = blockSchema.parse(data);
    
    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrorMessage = formatZodError(error);
      const errors = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      
      return {
        success: false,
        errors: [validationErrorMessage, ...errors],
      };
    }
    
    return {
      success: false,
      errors: [`Erro de validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
    };
  }
}

/**
 * Safe parse - returns null on error instead of throwing
 * 
 * @param data - Unknown data to validate
 * @returns Parsed template or null
 */
export function safeParseTemplate(data: unknown): Template | null {
  const result = templateSchema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Type guard - check if data is a valid template
 * 
 * @param data - Unknown data to check
 * @returns True if data is a valid template
 */
export function isValidTemplate(data: unknown): data is Template {
  return templateSchema.safeParse(data).success;
}

/**
 * Normalize template - fill in missing optional fields with defaults
 * 
 * @param template - Template to normalize
 * @returns Normalized template with all optional fields filled
 */
export function normalizeTemplate(template: Template): Template {
  return {
    ...template,
    metadata: {
      ...template.metadata,
      version: template.metadata.version || '3.1',
      totalSteps: template.metadata.totalSteps || Object.keys(template.steps).length,
      tags: template.metadata.tags || [],
    },
  };
}

export default {
  blockSchema,
  stepSchema,
  stepFileSchema,
  templateManifestSchema,
  templateSchema,
  validateTemplate,
  validateStep,
  validateStepFile,
  validateTemplateManifest,
  validateBlock,
  safeParseTemplate,
  isValidTemplate,
  normalizeTemplate,
};

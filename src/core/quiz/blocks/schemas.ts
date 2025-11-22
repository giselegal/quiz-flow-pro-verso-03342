/**
 * 🔒 BLOCK VALIDATION SCHEMAS - Wave 2
 * 
 * Schemas Zod para validação de blocos.
 * Garantem integridade e type-safety em runtime.
 * 
 * @version 1.0.0
 * @wave 2
 */

import { z } from 'zod';

/**
 * Schema para PropertyTypeEnum
 */
export const PropertyTypeSchema = z.enum([
  'text',
  'textarea',
  'number',
  'boolean',
  'color',
  'url',
  'select',
  'multiselect',
  'range',
  'json',
  'array',
  'object',
]);

/**
 * Schema para BlockCategoryEnum
 */
export const BlockCategorySchema = z.enum([
  'intro',
  'question',
  'transition',
  'result',
  'offer',
  'form',
  'media',
  'content',
  'layout',
  'custom',
]);

/**
 * Schema para BlockPropertyDefinition
 */
export const BlockPropertyDefinitionSchema = z.object({
  key: z.string().min(1),
  type: PropertyTypeSchema,
  label: z.string().min(1),
  description: z.string().optional(),
  defaultValue: z.any().optional(),
  required: z.boolean().optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      options: z
        .array(
          z.object({
            value: z.any(),
            label: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
  category: z
    .enum(['content', 'style', 'behavior', 'advanced'])
    .optional(),
  showIf: z
    .object({
      property: z.string(),
      value: z.any(),
    })
    .optional(),
});

/**
 * Schema para BlockDefinition
 */
export const BlockDefinitionSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  category: BlockCategorySchema,
  icon: z.string().optional(),
  properties: z.array(BlockPropertyDefinitionSchema),
  defaultProperties: z.record(z.any()),
  tags: z.array(z.string()).optional(),
  experimental: z.boolean().optional(),
  minVersion: z.string().optional(),
});

/**
 * Schema para BlockInstance
 */
export const BlockInstanceSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    properties: z.record(z.any()),
    order: z.number().int().positive(),
    metadata: z
      .object({
        label: z.string().optional(),
        notes: z.string().optional(),
        locked: z.boolean().optional(),
      })
      .optional(),
    children: z.array(BlockInstanceSchema).optional(),
  })
);

/**
 * Schema para BlockRenderConfig
 */
export const BlockRenderConfigSchema = z.object({
  instanceId: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.any()),
  context: z
    .object({
      isEditing: z.boolean().optional(),
      isSelected: z.boolean().optional(),
      runtimeData: z.record(z.any()).optional(),
    })
    .optional(),
});

/**
 * Schema para BlockValidationResult
 */
export const BlockValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(
    z.object({
      property: z.string(),
      message: z.string(),
      code: z.string(),
    })
  ),
});

/**
 * Validar BlockDefinition
 */
export function validateBlockDefinition(data: unknown) {
  return BlockDefinitionSchema.safeParse(data);
}

/**
 * Validar BlockInstance
 */
export function validateBlockInstance(data: unknown) {
  return BlockInstanceSchema.safeParse(data);
}

/**
 * Validar propriedades de um bloco contra sua definição
 */
export function validateBlockProperties(
  properties: Record<string, any>,
  definition: z.infer<typeof BlockDefinitionSchema>
): { valid: boolean; errors: Array<{ property: string; message: string }> } {
  const errors: Array<{ property: string; message: string }> = [];

  definition.properties.forEach((propDef) => {
    const value = properties[propDef.key];

    // Verificar se campo obrigatório está presente
    if (propDef.required && (value === undefined || value === null)) {
      errors.push({
        property: propDef.key,
        message: `${propDef.label} é obrigatório`,
      });
      return;
    }

    // Validação por tipo
    if (value !== undefined && value !== null) {
      switch (propDef.type) {
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push({
              property: propDef.key,
              message: `${propDef.label} deve ser um número`,
            });
          } else if (propDef.validation) {
            if (
              propDef.validation.min !== undefined &&
              value < propDef.validation.min
            ) {
              errors.push({
                property: propDef.key,
                message: `${propDef.label} deve ser >= ${propDef.validation.min}`,
              });
            }
            if (
              propDef.validation.max !== undefined &&
              value > propDef.validation.max
            ) {
              errors.push({
                property: propDef.key,
                message: `${propDef.label} deve ser <= ${propDef.validation.max}`,
              });
            }
          }
          break;

        case 'text':
        case 'textarea':
          if (typeof value !== 'string') {
            errors.push({
              property: propDef.key,
              message: `${propDef.label} deve ser texto`,
            });
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push({
              property: propDef.key,
              message: `${propDef.label} deve ser verdadeiro ou falso`,
            });
          }
          break;

        case 'url':
          if (typeof value !== 'string') {
            errors.push({
              property: propDef.key,
              message: `${propDef.label} deve ser uma URL`,
            });
          } else {
            try {
              new URL(value);
            } catch {
              // Permitir URLs relativas
              if (!value.startsWith('/') && !value.startsWith('./')) {
                errors.push({
                  property: propDef.key,
                  message: `${propDef.label} deve ser uma URL válida`,
                });
              }
            }
          }
          break;

        case 'array':
          if (!Array.isArray(value)) {
            errors.push({
              property: propDef.key,
              message: `${propDef.label} deve ser uma lista`,
            });
          }
          break;

        case 'object':
          if (typeof value !== 'object' || value === null) {
            errors.push({
              property: propDef.key,
              message: `${propDef.label} deve ser um objeto`,
            });
          }
          break;

        case 'select':
          if (propDef.validation?.options) {
            const validValues = propDef.validation.options.map((o) => o.value);
            if (!validValues.includes(value)) {
              errors.push({
                property: propDef.key,
                message: `${propDef.label} deve ser uma das opções válidas`,
              });
            }
          }
          break;
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Type guards com validação Zod
 */
export function isBlockDefinition(data: unknown): data is z.infer<typeof BlockDefinitionSchema> {
  return BlockDefinitionSchema.safeParse(data).success;
}

export function isBlockInstance(data: unknown): data is z.infer<typeof BlockInstanceSchema> {
  return BlockInstanceSchema.safeParse(data).success;
}

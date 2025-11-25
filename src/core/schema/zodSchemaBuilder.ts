import { z, type ZodTypeAny } from 'zod';
import type { BlockTypeSchema, PropertySchema } from './SchemaInterpreter';
import { appLogger } from '@/lib/utils/appLogger';

const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const buildStringSchema = (property: PropertySchema) => {
  let schema = z.string();

  if (property.validation?.pattern) {
    try {
      const regex = new RegExp(property.validation.pattern);
      schema = schema.regex(regex, 'Valor fora do padrão esperado');
    } catch (error) {
      appLogger.warn('[zodSchemaBuilder] Regex inválida em property schema', {
        data: [{ property: property.label || 'field', pattern: property.validation?.pattern, error }],
      });
    }
  }

  if (property.options && property.options.length > 0) {
    const allowedValues = property.options.map((option) => option.value);
    schema = schema.refine((value) => value === undefined || allowedValues.includes(value), {
      message: 'Valor não listado nas opções permitidas',
    });
  }

  if (property.validation?.enum?.length) {
    const allowedValues = property.validation.enum;
    schema = schema.refine((value) => value === undefined || allowedValues.includes(value), {
      message: `Valor deve ser um dos: ${allowedValues.join(', ')}`,
    });
  }

  return schema;
};

const buildNumberSchema = (property: PropertySchema) => {
  let schema = z.number({ invalid_type_error: 'Use apenas números' });

  if (property.validation?.min !== undefined) {
    schema = schema.min(property.validation.min, `Valor mínimo: ${property.validation.min}`);
  }

  if (property.validation?.max !== undefined) {
    schema = schema.max(property.validation.max, `Valor máximo: ${property.validation.max}`);
  }

  return schema;
};

const buildBooleanSchema = () => z.boolean();

const buildJsonSchema = () => z.any();

const buildColorSchema = () => z
  .string()
  .regex(HEX_COLOR_REGEX, 'Use cores no formato hexadecimal, ex: #FFAA00');

const buildSelectSchema = (property: PropertySchema) => {
  if (property.options?.length) {
    const allowedValues = property.options.map((option) => option.value);
    return z
      .any()
      .refine((value) => value === undefined || allowedValues.includes(value), {
        message: 'Valor não listado nas opções permitidas',
      });
  }

  return z.string();
};

const applyRequired = (schema: ZodTypeAny, property: PropertySchema): ZodTypeAny => {
  if (property.required) {
    return schema;
  }

  if (property.default !== undefined) {
    return schema.optional().default(property.default);
  }

  return schema.optional();
};

const buildSchemaForProperty = (property: PropertySchema): ZodTypeAny => {
  let schema: ZodTypeAny;

  switch (property.type) {
    case 'string':
      schema = buildStringSchema(property);
      break;
    case 'number':
      schema = buildNumberSchema(property);
      break;
    case 'boolean':
      schema = buildBooleanSchema();
      break;
    case 'color':
      schema = buildColorSchema();
      break;
    case 'image':
      schema = z.string().url('Informe uma URL válida');
      break;
    case 'select':
      schema = buildSelectSchema(property);
      break;
    case 'json':
      schema = buildJsonSchema();
      break;
    default:
      schema = buildJsonSchema();
      break;
  }

  return applyRequired(schema, property);
};

export const buildZodSchemaFromBlockSchema = (blockSchema: BlockTypeSchema) => {
  const shape: Record<string, ZodTypeAny> = {};

  Object.entries(blockSchema.properties).forEach(([key, property]) => {
    shape[key] = buildSchemaForProperty(property);
  });

  return z.object(shape);
};

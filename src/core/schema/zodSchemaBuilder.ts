import { z, type ZodTypeAny, type ZodLiteral } from 'zod';
import type { BlockTypeSchema, PropertySchema } from './SchemaInterpreter';
import { appLogger } from '@/lib/utils/appLogger';

const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

type ExtendedValidation = PropertySchema['validation'] & {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
};

const getValidation = (property: PropertySchema): ExtendedValidation | undefined => {
  if (!property.validation) {
    return undefined;
  }

  return property.validation as ExtendedValidation;
};

const getDefaultValue = (property: PropertySchema) => {
  if (property.default !== undefined) {
    return property.default;
  }

  if ((property as any).defaultValue !== undefined) {
    return (property as any).defaultValue;
  }

  return undefined;
};

const isRequired = (property: PropertySchema, validation?: ExtendedValidation) =>
  property.required ?? validation?.required ?? false;

const buildLiteralUnion = (values: Array<string | number | boolean>): ZodTypeAny | null => {
  if (!values.length) {
    return null;
  }

  const [first, ...rest] = values;
  let schema: ZodTypeAny = z.literal(first) as ZodLiteral<any>;

  rest.forEach((value) => {
    schema = schema.or(z.literal(value));
  });

  return schema;
};

const extractAllowedValues = (property: PropertySchema, validation?: ExtendedValidation) => {
  if (property.options?.length) {
    return property.options.map((option: any) => (option?.value ?? option)) as any[];
  }

  if (validation?.enum?.length) {
    return validation.enum;
  }

  return undefined;
};

const applyOptionality = (schema: ZodTypeAny, property: PropertySchema, validation?: ExtendedValidation) => {
  const defaultValue = getDefaultValue(property);
  if (isRequired(property, validation)) {
    return defaultValue !== undefined ? schema.default(defaultValue) : schema;
  }

  const optionalSchema = schema.optional();
  return defaultValue !== undefined ? optionalSchema.default(defaultValue) : optionalSchema;
};

const applyCustomValidation = (schema: ZodTypeAny, validation?: ExtendedValidation) => {
  if (!validation?.custom) {
    return schema;
  }

  return schema.superRefine((value, ctx) => {
    const result = validation.custom!(value);
    if (result === true || result === undefined) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: typeof result === 'string' ? result : 'Valor inválido',
    });
  });
};

const buildStringSchema = (property: PropertySchema, validation?: ExtendedValidation): ZodTypeAny => {
  let schema = z.string();

  if (validation?.minLength !== undefined) {
    schema = schema.min(validation.minLength, `Mínimo de ${validation.minLength} caracteres`);
  }

  if (validation?.maxLength !== undefined) {
    schema = schema.max(validation.maxLength, `Máximo de ${validation.maxLength} caracteres`);
  }

  if (validation?.pattern) {
    try {
      const regex = new RegExp(validation.pattern);
      schema = schema.regex(regex, 'Valor fora do padrão esperado');
    } catch (error) {
      appLogger.warn('[zodSchemaBuilder] Regex inválida em property schema', {
        data: [{ property: property.label || 'field', pattern: validation.pattern, error }],
      });
    }
  }

  const allowedValues = extractAllowedValues(property, validation);
  if (allowedValues?.length) {
    const primitives = allowedValues.filter((value) => ['string', 'number', 'boolean'].includes(typeof value)) as Array<string | number | boolean>;
    if (primitives.length === allowedValues.length) {
      const literalUnion = buildLiteralUnion(primitives);
      if (literalUnion) {
        return literalUnion;
      }
    }

    return schema.refine((value) => value === undefined || allowedValues.includes(value), {
      message: 'Valor não listado nas opções permitidas',
    });
  }

  return schema;
};

const buildNumberSchema = (property: PropertySchema, validation?: ExtendedValidation) => {
  let schema = z.number({ invalid_type_error: 'Use apenas números' });

  if (validation?.min !== undefined) {
    schema = schema.min(validation.min, `Valor mínimo: ${validation.min}`);
  }

  if (validation?.max !== undefined) {
    schema = schema.max(validation.max, `Valor máximo: ${validation.max}`);
  }

  return schema;
};

const buildBooleanSchema = () => z.boolean();

const buildColorSchema = () => z
  .string()
  .regex(HEX_COLOR_REGEX, 'Use cores no formato hexadecimal, ex: #FFAA00');

const buildUrlSchema = () => z
  .string()
  .refine((value) => {
    if (value === undefined || value === null || value === '') {
      return true;
    }
    if (typeof value !== 'string') {
      return false;
    }
    if (value.startsWith('/') || value.startsWith('./')) {
      return true;
    }
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, 'Informe uma URL válida');

const buildSelectSchema = (property: PropertySchema, validation?: ExtendedValidation) => {
  const allowedValues = extractAllowedValues(property, validation);
  if (!allowedValues?.length) {
    return z.string();
  }

  const primitives = allowedValues.filter((value) => ['string', 'number', 'boolean'].includes(typeof value)) as Array<string | number | boolean>;
  if (primitives.length === allowedValues.length) {
    return buildLiteralUnion(primitives) ?? z.string();
  }

  return z
    .any()
    .refine((value) => value === undefined || allowedValues.includes(value), {
      message: 'Valor não listado nas opções permitidas',
    });
};

const getArrayLengthConstraints = (validation?: ExtendedValidation) => ({
  min: validation?.minItems ?? validation?.minLength,
  max: validation?.maxItems ?? validation?.maxLength,
});

const buildArraySchema = (property: PropertySchema, validation?: ExtendedValidation) => {
  let elementSchema: ZodTypeAny = z.any();
  const allowedValues = extractAllowedValues(property, validation);

  if (allowedValues?.length) {
    const primitives = allowedValues.filter((value) => ['string', 'number', 'boolean'].includes(typeof value)) as Array<string | number | boolean>;
    if (primitives.length === allowedValues.length) {
      elementSchema = buildLiteralUnion(primitives) ?? elementSchema;
    }
  }

  let schema = z.array(elementSchema);
  const { min, max } = getArrayLengthConstraints(validation);

  if (typeof min === 'number') {
    schema = schema.min(min, `Informe pelo menos ${min} itens`);
  }

  if (typeof max === 'number') {
    schema = schema.max(max, `Máximo de ${max} itens`);
  }

  return schema;
};

const buildObjectSchema = () => z.record(z.any());

const isArrayLike = (property: PropertySchema, validation?: ExtendedValidation) => {
  const propertyType = (property.type as string) || 'string';
  if (propertyType === 'array') {
    return true;
  }

  if (property.control === 'options-list') {
    return true;
  }

  const defaultValue = getDefaultValue(property);
  if (Array.isArray(defaultValue)) {
    return true;
  }

  return (
    validation?.minItems !== undefined ||
    validation?.maxItems !== undefined ||
    validation?.minLength !== undefined ||
    validation?.maxLength !== undefined
  );
};

const isObjectLike = (property: PropertySchema) => {
  const propertyType = (property.type as string) || 'string';
  if (propertyType === 'object') {
    return true;
  }

  const defaultValue = getDefaultValue(property);
  return !!defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue);
};

const buildJsonSchema = (property: PropertySchema, validation?: ExtendedValidation) => {
  if (isArrayLike(property, validation)) {
    return buildArraySchema(property, validation);
  }

  if (isObjectLike(property)) {
    return buildObjectSchema();
  }

  return z.union([z.array(z.any()), z.record(z.any())]);
};

const buildSchemaForProperty = (property: PropertySchema): ZodTypeAny => {
  const validation = getValidation(property);
  const propertyType = (property.type as string) || 'string';
  const control = property.control;

  let schema: ZodTypeAny;

  if (control === 'options-list') {
    schema = buildArraySchema(property, validation);
  } else {
    switch (propertyType) {
      case 'number':
        schema = buildNumberSchema(property, validation);
        break;
      case 'boolean':
        schema = buildBooleanSchema();
        break;
      case 'color':
        schema = buildColorSchema();
        break;
      case 'image':
        schema = buildUrlSchema();
        break;
      case 'select':
        schema = buildSelectSchema(property, validation);
        break;
      case 'json':
        schema = buildJsonSchema(property, validation);
        break;
      case 'array':
        schema = buildArraySchema(property, validation);
        break;
      case 'object':
        schema = buildObjectSchema();
        break;
      default:
        if (control === 'color-picker') {
          schema = buildColorSchema();
        } else if (control === 'image-upload') {
          schema = buildUrlSchema();
        } else if (control === 'dropdown') {
          schema = buildSelectSchema(property, validation);
        } else if (control === 'json-editor') {
          schema = buildJsonSchema(property, validation);
        } else if (control === 'toggle') {
          schema = buildBooleanSchema();
        } else {
          schema = buildStringSchema(property, validation);
        }
        break;
    }
  }

  const withCustomValidation = applyCustomValidation(schema, validation);
  return applyOptionality(withCustomValidation, property, validation);
};

export const buildZodSchemaFromBlockSchema = (blockSchema: BlockTypeSchema) => {
  const shape: Record<string, ZodTypeAny> = {};

  Object.entries(blockSchema.properties).forEach(([key, property]) => {
    shape[key] = buildSchemaForProperty(property);
  });

  return z.object(shape).passthrough();
};

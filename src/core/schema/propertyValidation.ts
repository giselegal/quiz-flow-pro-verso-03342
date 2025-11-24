/**
 * 🎯 PROPERTY VALIDATION - Nocode Panel Draft Validation
 * 
 * Provides coercion and validation functions for property values
 * based on PropertySchema definitions. This is used in the draft
 * editing model to validate values before committing to the global state.
 */

import { PropertySchema } from './SchemaInterpreter';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Supported property control types for the nocode panel
 */
export type PropertyControlType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'toggle'
  | 'color-picker'
  | 'dropdown'
  | 'options-list'
  | 'image-upload'
  | 'json-editor';

/**
 * Result of property validation
 */
export interface PropertyValidationResult {
  /** The coerced/validated value */
  value: any;
  /** Error message if validation failed */
  error?: string;
  /** Whether the value is valid */
  isValid: boolean;
}

/**
 * Result of validating all draft properties
 */
export interface DraftValidationResult {
  /** Whether all properties are valid */
  isValid: boolean;
  /** Map of property key to error message */
  errors: Record<string, string>;
  /** Map of property key to validated values */
  values: Record<string, any>;
}

/**
 * Coerces a value to the expected type based on schema definition
 */
function coerceToType(schema: PropertySchema, rawValue: any): any {
  if (rawValue === undefined || rawValue === null) {
    return rawValue;
  }

  switch (schema.type) {
    case 'number': {
      if (typeof rawValue === 'number') return rawValue;
      const parsed = Number(rawValue);
      return isNaN(parsed) ? rawValue : parsed;
    }
    case 'boolean': {
      if (typeof rawValue === 'boolean') return rawValue;
      if (rawValue === 'true' || rawValue === 1) return true;
      if (rawValue === 'false' || rawValue === 0) return false;
      return Boolean(rawValue);
    }
    case 'string': {
      if (typeof rawValue === 'string') return rawValue;
      return String(rawValue);
    }
    default:
      return rawValue;
  }
}

/**
 * Validates a value against min/max constraints
 */
function validateMinMax(
  value: number,
  validation: PropertySchema['validation']
): string | undefined {
  if (!validation) return undefined;

  if (validation.min !== undefined && value < validation.min) {
    return `O valor deve ser no mínimo ${validation.min}`;
  }
  if (validation.max !== undefined && value > validation.max) {
    return `O valor deve ser no máximo ${validation.max}`;
  }
  return undefined;
}

/**
 * Validates a value against a regex pattern
 */
function validatePattern(
  value: string,
  validation: PropertySchema['validation']
): string | undefined {
  if (!validation?.pattern) return undefined;

  try {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      return 'O valor não corresponde ao padrão esperado';
    }
  } catch (e) {
    // Invalid regex pattern in schema
    appLogger.warn('[propertyValidation] Invalid regex pattern in schema:', {
      data: [validation.pattern]
    });
  }
  return undefined;
}

/**
 * Validates a value against enum options
 */
function validateEnum(
  value: any,
  validation: PropertySchema['validation']
): string | undefined {
  if (!validation?.enum || validation.enum.length === 0) return undefined;

  if (!validation.enum.includes(value)) {
    return `O valor deve ser um dos: ${validation.enum.join(', ')}`;
  }
  return undefined;
}

/**
 * Main validation function that coerces and validates a property value
 * based on the PropertySchema definition.
 * 
 * @param schema - The property schema definition
 * @param rawValue - The raw value to validate
 * @returns Validation result with coerced value and optional error
 */
export function coerceAndValidateProperty(
  schema: PropertySchema,
  rawValue: any
): PropertyValidationResult {
  // 1. Handle undefined/null with required check
  if (rawValue === undefined || rawValue === null) {
    if (schema.required) {
      return {
        value: rawValue,
        error: 'Este campo é obrigatório',
        isValid: false
      };
    }
    return { value: rawValue, isValid: true };
  }

  // 2. Coerce to expected type
  const coercedValue = coerceToType(schema, rawValue);

  // 3. Check required for empty strings
  if (schema.required && coercedValue === '') {
    return {
      value: coercedValue,
      error: 'Este campo é obrigatório',
      isValid: false
    };
  }

  // 4. Type-specific validation
  if (schema.type === 'number' && typeof coercedValue === 'number') {
    const minMaxError = validateMinMax(coercedValue, schema.validation);
    if (minMaxError) {
      return {
        value: coercedValue,
        error: minMaxError,
        isValid: false
      };
    }
  }

  if (schema.type === 'string' && typeof coercedValue === 'string') {
    const patternError = validatePattern(coercedValue, schema.validation);
    if (patternError) {
      return {
        value: coercedValue,
        error: patternError,
        isValid: false
      };
    }
  }

  // 5. Enum validation (for dropdowns)
  const enumError = validateEnum(coercedValue, schema.validation);
  if (enumError) {
    return {
      value: coercedValue,
      error: enumError,
      isValid: false
    };
  }

  // 6. Custom validation if provided
  if (schema.validation?.custom) {
    const customResult = schema.validation.custom(coercedValue);
    if (customResult !== true) {
      return {
        value: coercedValue,
        error: typeof customResult === 'string' ? customResult : 'Valor inválido',
        isValid: false
      };
    }
  }

  return { value: coercedValue, isValid: true };
}

/**
 * Gets the initial value for a property, correctly handling falsy values.
 * Uses schema.default only when value is undefined or null.
 * 
 * IMPORTANT: This function correctly preserves falsy values like 0, false, ''
 * instead of replacing them with defaults.
 * 
 * @param schema - The property schema definition
 * @param value - The current value (may be undefined/null)
 * @returns The initial value to use
 */
export function getInitialValueFromSchema(
  schema: PropertySchema,
  value: any
): any {
  // Only use default when value is undefined or null
  // This preserves falsy values like 0, false, ''
  if (value === undefined || value === null) {
    return schema.default;
  }
  return value;
}

/**
 * Validates an entire draft object against schemas
 * 
 * @param schemas - Map of property key to PropertySchema
 * @param draft - The draft object to validate
 * @returns Validation result with all errors and validated values
 */
export function validateDraft(
  schemas: Record<string, PropertySchema>,
  draft: Record<string, any>
): DraftValidationResult {
  const errors: Record<string, string> = {};
  const values: Record<string, any> = {};
  let isValid = true;

  for (const [key, schema] of Object.entries(schemas)) {
    const result = coerceAndValidateProperty(schema, draft[key]);
    values[key] = result.value;
    
    if (!result.isValid && result.error) {
      errors[key] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors, values };
}

/**
 * Attempts to parse a JSON string safely
 * 
 * @param text - The JSON string to parse
 * @returns Parsed object and optional error message
 */
export function safeParseJson(text: string): {
  value: any;
  error?: string;
  isValid: boolean;
} {
  if (!text || text.trim() === '') {
    return { value: {}, isValid: true };
  }

  try {
    const parsed = JSON.parse(text);
    return { value: parsed, isValid: true };
  } catch (e) {
    return {
      value: undefined,
      error: 'JSON inválido: verifique a sintaxe',
      isValid: false
    };
  }
}

/**
 * Normalizes a control type string to a valid PropertyControlType
 * with type-safe mapping and fallback handling.
 * 
 * @param control - The control type string from schema
 * @param elementType - Optional element type for logging
 * @param propertyKey - Optional property key for logging
 * @returns Normalized PropertyControlType
 */
export function normalizeControlType(
  control: string | undefined,
  elementType?: string,
  propertyKey?: string
): PropertyControlType {
  if (!control) return 'text';

  const mapping: Record<string, PropertyControlType> = {
    // Direct mappings
    'text': 'text',
    'textarea': 'textarea',
    'number': 'number',
    'range': 'range',
    'toggle': 'toggle',
    'color-picker': 'color-picker',
    'dropdown': 'dropdown',
    'options-list': 'options-list',
    'image-upload': 'image-upload',
    'json-editor': 'json-editor',
    // Legacy/alternative mappings from blockPropertySchemas
    'select': 'dropdown',
    'color': 'color-picker',
    'boolean': 'toggle',
    'json': 'json-editor',
  };

  const normalized = mapping[control.toLowerCase()];
  
  if (!normalized) {
    // Log warning for unknown control type
    appLogger.warn('[normalizeControlType] Tipo de controle desconhecido:', {
      data: [{
        control,
        elementType,
        propertyKey,
        fallbackTo: 'text'
      }]
    });
    return 'text';
  }

  return normalized;
}

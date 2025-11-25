/**
 * 🎯 JSON Schema Validator for Quiz Templates
 *
 * Runtime validation using AJV with JSON Schema Draft 2020-12
 * Provides centralized schema validation for templates and components.
 *
 * @version 1.0.0
 * @module lib/validation/jsonSchemaValidator
 */

import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { appLogger } from '@/lib/utils/appLogger';

// Import schemas
import templateSchema from '../../../schemas/template.schema.json';
import componentSchema from '../../../schemas/component.schema.json';
import stageSchema from '../../../schemas/stage.schema.json';
import logicSchema from '../../../schemas/logic.schema.json';
import outcomeSchema from '../../../schemas/outcome.schema.json';
import quizTemplateV4Schema from '../../../schemas/quiz-template-v4.schema.json';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors?: ErrorObject[] | null;
  errorMessages?: string[];
}

/**
 * Schema types available for validation
 */
export type SchemaType =
  | 'template'
  | 'component'
  | 'stage'
  | 'logic'
  | 'outcome'
  | 'quiz-template-v4';

/**
 * AJV instance configured for Draft 2020-12
 */
const ajv = new Ajv2020({
  allErrors: true,
  strict: false, // Allow additional properties in schemas
  validateFormats: true,
  verbose: true,
});

// Add format validators (email, uri, date-time, etc.)
addFormats(ajv);

// Register all schemas with their $id
try {
  ajv.addSchema(templateSchema, '/schemas/template.schema.json');
  ajv.addSchema(componentSchema, '/schemas/component.schema.json');
  ajv.addSchema(stageSchema, '/schemas/stage.schema.json');
  ajv.addSchema(logicSchema, '/schemas/logic.schema.json');
  ajv.addSchema(outcomeSchema, '/schemas/outcome.schema.json');
  ajv.addSchema(quizTemplateV4Schema, '/schemas/quiz-template-v4.schema.json');
  appLogger.info('[JsonSchemaValidator] Schemas registered successfully');
} catch (error) {
  appLogger.error('[JsonSchemaValidator] Failed to register schemas:', { data: [error] });
}

/**
 * Schema ID mapping for easy access
 */
const schemaIdMap: Record<SchemaType, string> = {
  template: '/schemas/template.schema.json',
  component: '/schemas/component.schema.json',
  stage: '/schemas/stage.schema.json',
  logic: '/schemas/logic.schema.json',
  outcome: '/schemas/outcome.schema.json',
  'quiz-template-v4': '/schemas/quiz-template-v4.schema.json',
};

/**
 * Get compiled validator for a schema type
 */
function getValidator(schemaType: SchemaType): ValidateFunction | undefined {
  const schemaId = schemaIdMap[schemaType];
  return ajv.getSchema(schemaId);
}

/**
 * Format validation errors into human-readable messages
 */
function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];

  return errors.map((error) => {
    const path = error.instancePath || '/';
    const message = error.message || 'Unknown error';
    const params = error.params ? JSON.stringify(error.params) : '';

    return `${path}: ${message}${params ? ` (${params})` : ''}`;
  });
}

/**
 * Validate data against a specific schema type
 *
 * @param schemaType - The type of schema to validate against
 * @param data - The data to validate
 * @returns ValidationResult with valid flag and errors if any
 */
export function validate(schemaType: SchemaType, data: unknown): ValidationResult {
  const validator = getValidator(schemaType);

  if (!validator) {
    appLogger.warn(`[JsonSchemaValidator] Schema not found: ${schemaType}`);
    return {
      valid: false,
      errors: null,
      errorMessages: [`Schema not found: ${schemaType}`],
    };
  }

  const valid = validator(data);

  if (!valid) {
    return {
      valid: false,
      errors: validator.errors,
      errorMessages: formatErrors(validator.errors),
    };
  }

  return { valid: true };
}

/**
 * Validate a quiz template (uses template schema)
 */
export function validateTemplate(data: unknown): ValidationResult {
  return validate('template', data);
}

/**
 * Validate a quiz template v4 (comprehensive validation)
 */
export function validateTemplateV4(data: unknown): ValidationResult {
  return validate('quiz-template-v4', data);
}

/**
 * Validate a component/block
 */
export function validateComponent(data: unknown): ValidationResult {
  return validate('component', data);
}

/**
 * Validate a stage/step
 */
export function validateStage(data: unknown): ValidationResult {
  return validate('stage', data);
}

/**
 * Validate logic configuration
 */
export function validateLogic(data: unknown): ValidationResult {
  return validate('logic', data);
}

/**
 * Validate an outcome/result
 */
export function validateOutcome(data: unknown): ValidationResult {
  return validate('outcome', data);
}

/**
 * Batch validate multiple items
 */
export function validateBatch(
  schemaType: SchemaType,
  items: unknown[]
): { index: number; result: ValidationResult }[] {
  return items.map((item, index) => ({
    index,
    result: validate(schemaType, item),
  }));
}

/**
 * Check if a template has a valid $schema reference
 */
export function hasSchemaReference(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.$schema !== 'string' || obj.$schema.length === 0) return false;
  
  // Validate that $schema is a recognizable path
  const validSchemaPatterns = [
    /^\/schemas\//,
    /^https?:\/\/json-schema\.org\//,
    /\.schema\.json$/
  ];
  return validSchemaPatterns.some(pattern => pattern.test(obj.$schema as string));
}

/**
 * Get schema information for a given type
 */
export function getSchemaInfo(schemaType: SchemaType): {
  id: string;
  title: string;
  version: string;
} | null {
  const schemaId = schemaIdMap[schemaType];
  const validator = ajv.getSchema(schemaId);
  
  if (!validator || !validator.schema) return null;
  
  const schema = validator.schema;
  if (typeof schema !== 'object' || schema === null) return null;

  return {
    id: (typeof schema.$id === 'string' ? schema.$id : schemaId),
    title: (typeof schema.title === 'string' ? schema.title : schemaType),
    version: 'draft/2020-12',
  };
}

// Export AJV instance for advanced usage
export { ajv };

/**
 * 🎯 UNIFIED BLOCK VALIDATOR - Fase 2 Consolidação
 * 
 * Sistema único de validação que substitui:
 * ❌ validateBlockData (blockSchemas.ts - Zod)
 * ❌ validateElement (SchemaComponentAdapter.ts - Schema-driven)
 * ❌ validateBlockData (masterSchema.ts - Manual)
 * 
 * ✅ Usa SchemaInterpreter como fonte única de verdade
 * ✅ Validação consistente em toda aplicação
 * ✅ Performance otimizada com cache
 */

import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import type { Block } from '@/types/editor';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Valida um bloco completo usando schema
 */
export function validateBlock(block: Block): ValidationResult {
  const schema = schemaInterpreter.getBlockSchema(block.type);
  
  if (!schema) {
    return {
      valid: false,
      errors: [{
        field: 'type',
        message: `Schema não encontrado para tipo: ${block.type}`,
        code: 'SCHEMA_NOT_FOUND'
      }]
    };
  }

  const errors: ValidationError[] = [];
  
  // Validar cada propriedade definida no schema
  Object.entries(schema.properties).forEach(([key, propSchema]) => {
    const value = block.properties?.[key] ?? block.content?.[key];
    
    // Validação de required
    if (propSchema.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: key,
        message: `Campo obrigatório: ${propSchema.label || key}`,
        code: 'REQUIRED'
      });
      return;
    }

    // Skip se não obrigatório e vazio
    if (value === undefined || value === null) {
      return;
    }

    // Validação por tipo de controle
    const errorMsg = validateByControlType(key, value, propSchema);
    if (errorMsg) {
      errors.push({
        field: key,
        message: errorMsg,
        code: 'INVALID_VALUE'
      });
    }

    // Validação customizada (validation object no schema)
    if (propSchema.validation) {
      const customError = validateCustomRules(key, value, propSchema.validation);
      if (customError) {
        errors.push({
          field: key,
          message: customError,
          code: 'VALIDATION_FAILED'
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida valor baseado no tipo de controle
 */
function validateByControlType(key: string, value: any, propSchema: any): string | null {
  const control = propSchema.control;

  switch (control) {
    case 'text':
    case 'textarea':
    case 'rich-text':
      if (typeof value !== 'string') {
        return `${key} deve ser texto`;
      }
      if (propSchema.validation?.minLength && value.length < propSchema.validation.minLength) {
        return `${key} deve ter no mínimo ${propSchema.validation.minLength} caracteres`;
      }
      if (propSchema.validation?.maxLength && value.length > propSchema.validation.maxLength) {
        return `${key} deve ter no máximo ${propSchema.validation.maxLength} caracteres`;
      }
      break;

    case 'number':
    case 'range':
      if (typeof value !== 'number') {
        return `${key} deve ser número`;
      }
      if (propSchema.validation?.min !== undefined && value < propSchema.validation.min) {
        return `${key} deve ser no mínimo ${propSchema.validation.min}`;
      }
      if (propSchema.validation?.max !== undefined && value > propSchema.validation.max) {
        return `${key} deve ser no máximo ${propSchema.validation.max}`;
      }
      break;

    case 'toggle':
      if (typeof value !== 'boolean') {
        return `${key} deve ser verdadeiro ou falso`;
      }
      break;

    case 'dropdown':
      if (propSchema.options && !propSchema.options.includes(value)) {
        return `${key} deve ser uma das opções: ${propSchema.options.join(', ')}`;
      }
      break;

    case 'color-picker':
      if (typeof value !== 'string' || !value.match(/^#[0-9A-Fa-f]{6}$/)) {
        return `${key} deve ser uma cor válida (ex: #FF0000)`;
      }
      break;

    case 'image-upload':
      if (typeof value !== 'string' || !value.match(/^(https?:\/\/|\/)/)) {
        return `${key} deve ser uma URL válida`;
      }
      break;

    case 'options-list':
      if (!Array.isArray(value)) {
        return `${key} deve ser uma lista`;
      }
      if (propSchema.validation?.minItems && value.length < propSchema.validation.minItems) {
        return `${key} deve ter no mínimo ${propSchema.validation.minItems} itens`;
      }
      if (propSchema.validation?.maxItems && value.length > propSchema.validation.maxItems) {
        return `${key} deve ter no máximo ${propSchema.validation.maxItems} itens`;
      }
      break;

    case 'json-editor':
      try {
        if (typeof value === 'string') {
          JSON.parse(value);
        } else if (typeof value !== 'object') {
          return `${key} deve ser JSON válido`;
        }
      } catch {
        return `${key} deve ser JSON válido`;
      }
      break;
  }

  return null;
}

/**
 * Valida regras customizadas definidas no schema
 */
function validateCustomRules(key: string, value: any, validation: any): string | null {
  // Pattern regex
  if (validation.pattern) {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(String(value))) {
      return validation.patternMessage || `${key} não corresponde ao formato esperado`;
    }
  }

  // Custom validator function (se fornecido)
  if (typeof validation.custom === 'function') {
    const result = validation.custom(value);
    if (result !== true) {
      return typeof result === 'string' ? result : `${key} inválido`;
    }
  }

  return null;
}

/**
 * Validação rápida (apenas required fields)
 */
export function quickValidateBlock(block: Block): boolean {
  const schema = schemaInterpreter.getBlockSchema(block.type);
  if (!schema) return false;

  return Object.entries(schema.properties).every(([key, propSchema]) => {
    if (!propSchema.required) return true;
    const value = block.properties?.[key] ?? block.content?.[key];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Validação assíncrona (para uploads, API calls, etc)
 */
export async function validateBlockAsync(block: Block): Promise<ValidationResult> {
  // Por enquanto, apenas wrapper síncrono
  // Pode ser expandido para validações assíncronas no futuro
  return validateBlock(block);
}

/**
 * Valida apenas um campo específico
 */
export function validateField(
  blockType: string,
  fieldName: string,
  value: any
): ValidationError | null {
  const schema = schemaInterpreter.getBlockSchema(blockType);
  if (!schema) return null;

  const propSchema = schema.properties[fieldName];
  if (!propSchema) return null;

  // Required
  if (propSchema.required && (value === undefined || value === null || value === '')) {
    return {
      field: fieldName,
      message: `Campo obrigatório: ${propSchema.label || fieldName}`,
      code: 'REQUIRED'
    };
  }

  // Type validation
  const errorMsg = validateByControlType(fieldName, value, propSchema);
  if (errorMsg) {
    return {
      field: fieldName,
      message: errorMsg,
      code: 'INVALID_VALUE'
    };
  }

  // Custom validation
  if (propSchema.validation) {
    const customError = validateCustomRules(fieldName, value, propSchema.validation);
    if (customError) {
      return {
        field: fieldName,
        message: customError,
        code: 'VALIDATION_FAILED'
      };
    }
  }

  return null;
}

export default {
  validateBlock,
  quickValidateBlock,
  validateBlockAsync,
  validateField,
};

/**
 * 🎣 BLOCK VALIDATION HOOKS
 * 
 * Hooks React para validação de blocos e propriedades.
 * Fornece validação em tempo real para o editor.
 * 
 * @version 1.0.0
 * @status PRODUCTION
 */

import { useMemo, useCallback } from 'react';
import { BlockRegistry } from '../blocks/registry';
import type { BlockDefinition, BlockPropertyDefinition } from '../blocks/types';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Resultado de validação
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Opções de validação
 */
export interface ValidationOptions {
  strict?: boolean;
  checkRequired?: boolean;
  validateTypes?: boolean;
}

/**
 * Hook para validar um bloco completo
 */
export function useBlockValidation(blockType: string, options: ValidationOptions = {}) {
  const definition = useMemo(() => {
    return BlockRegistry.getDefinition(blockType);
  }, [blockType]);

  const validate = useCallback((blockData: any): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Verifica se o tipo existe
    if (!definition) {
      errors.push(`Tipo de bloco desconhecido: ${blockType}`);
      return { valid: false, errors, warnings };
    }

    // Validações básicas
    if (!blockData) {
      errors.push('Dados do bloco não fornecidos');
      return { valid: false, errors, warnings };
    }

    if (!blockData.id) {
      errors.push('Bloco sem ID');
    }

    if (!blockData.type) {
      errors.push('Bloco sem tipo');
    }

    // Valida propriedades se definição tem schema
    if (definition.properties && options.checkRequired !== false) {
      Object.entries(definition.properties).forEach(([key, propDef]) => {
        const propDefinition = propDef as BlockPropertyDefinition;
        const value = blockData.properties?.[key];

        // Verifica propriedades obrigatórias
        if (propDefinition.required && (value === undefined || value === null || value === '')) {
          errors.push(`Propriedade obrigatória ausente: ${key}`);
        }

        // Valida tipo se valor existe
        if (value !== undefined && value !== null && options.validateTypes !== false) {
          const typeValid = validatePropertyType(value, propDefinition.type);
          if (!typeValid) {
            errors.push(`Tipo inválido para ${key}: esperado ${propDefinition.type}`);
          }
        }
      });
    }

    // Validações específicas do tipo
    if (blockType === 'question' && !blockData.properties?.questionText) {
      warnings.push('Questão sem texto');
    }

    if (blockType === 'image' && !blockData.properties?.src) {
      warnings.push('Imagem sem URL');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }, [blockType, definition, options]);

  return {
    validate,
    definition,
    isValidType: !!definition
  };
}

/**
 * Hook para validar propriedades específicas de um bloco
 */
export function useBlockPropertiesValidation(blockType: string) {
  const definition = useMemo(() => {
    return BlockRegistry.getDefinition(blockType);
  }, [blockType]);

  const validateProperty = useCallback((key: string, value: any): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!definition) {
      errors.push(`Tipo de bloco desconhecido: ${blockType}`);
      return { valid: false, errors, warnings };
    }

    const propDefinition = definition.properties?.[key] as BlockPropertyDefinition | undefined;

    if (!propDefinition) {
      warnings.push(`Propriedade não definida no schema: ${key}`);
      return { valid: true, errors, warnings };
    }

    // Valida obrigatoriedade
    if (propDefinition.required && (value === undefined || value === null || value === '')) {
      errors.push(`Propriedade ${key} é obrigatória`);
    }

    // Valida tipo
    if (value !== undefined && value !== null) {
      const typeValid = validatePropertyType(value, propDefinition.type);
      if (!typeValid) {
        errors.push(`Tipo inválido para ${key}: esperado ${propDefinition.type}, recebido ${typeof value}`);
      }
    }

    // Valida valor mínimo/máximo para números
    if (propDefinition.type === 'number' && typeof value === 'number') {
      if (propDefinition.min !== undefined && value < propDefinition.min) {
        errors.push(`Valor de ${key} abaixo do mínimo (${propDefinition.min})`);
      }
      if (propDefinition.max !== undefined && value > propDefinition.max) {
        errors.push(`Valor de ${key} acima do máximo (${propDefinition.max})`);
      }
    }

    // Valida comprimento para strings
    if (propDefinition.type === 'string' && typeof value === 'string') {
      if (propDefinition.minLength !== undefined && value.length < propDefinition.minLength) {
        errors.push(`Texto de ${key} muito curto (mínimo: ${propDefinition.minLength})`);
      }
      if (propDefinition.maxLength !== undefined && value.length > propDefinition.maxLength) {
        errors.push(`Texto de ${key} muito longo (máximo: ${propDefinition.maxLength})`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }, [blockType, definition]);

  const validateAllProperties = useCallback((properties: Record<string, any>): ValidationResult => {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    Object.entries(properties).forEach(([key, value]) => {
      const result = validateProperty(key, value);
      if (result.errors.length > 0) {
        allErrors.push(...result.errors);
      }
      if (result.warnings && result.warnings.length > 0) {
        allWarnings.push(...result.warnings);
      }
    });

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings.length > 0 ? allWarnings : undefined
    };
  }, [validateProperty]);

  return {
    validateProperty,
    validateAllProperties,
    definition
  };
}

/**
 * Valida se um valor corresponde ao tipo esperado
 */
function validatePropertyType(value: any, expectedType: string): boolean {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string';
    
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    
    case 'boolean':
      return typeof value === 'boolean';
    
    case 'array':
      return Array.isArray(value);
    
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    
    case 'color':
      return typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value);
    
    case 'url':
      return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
    
    case 'image':
      return typeof value === 'string' && (
        value.startsWith('http://') || 
        value.startsWith('https://') || 
        value.startsWith('data:image/')
      );
    
    default:
      appLogger.warn(`Tipo de propriedade desconhecido: ${expectedType}`);
      return true; // Assume válido para tipos desconhecidos
  }
}

/**
 * Hook para validação em lote de múltiplos blocos
 */
export function useBatchBlockValidation() {
  const validateBlocks = useCallback((blocks: any[]): Record<string, ValidationResult> => {
    const results: Record<string, ValidationResult> = {};

    blocks.forEach(block => {
      if (!block.id || !block.type) {
        results[block.id || 'unknown'] = {
          valid: false,
          errors: ['Bloco sem ID ou tipo']
        };
        return;
      }

      const definition = BlockRegistry.getDefinition(block.type);
      if (!definition) {
        results[block.id] = {
          valid: false,
          errors: [`Tipo desconhecido: ${block.type}`]
        };
        return;
      }

      // Usa validação básica
      const errors: string[] = [];
      if (!block.properties) {
        errors.push('Bloco sem propriedades');
      }

      results[block.id] = {
        valid: errors.length === 0,
        errors
      };
    });

    return results;
  }, []);

  return { validateBlocks };
}

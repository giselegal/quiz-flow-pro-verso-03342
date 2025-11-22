/**
 * 🎣 BLOCK VALIDATION HOOK - Wave 2
 * 
 * Hook para validação de blocos em tempo real no editor.
 * 
 * @version 1.0.0
 * @wave 2
 */

import { useMemo } from 'react';
import type { BlockInstance } from '../blocks/types';
import { validateBlockInstance, validateBlockProperties } from '../blocks/schemas';
import { useBlockDefinition } from './useBlockDefinition';

/**
 * Resultado da validação
 */
export interface BlockValidationHookResult {
  isValid: boolean;
  errors: Array<{ property: string; message: string }>;
  hasErrors: boolean;
}

/**
 * Hook para validar uma instância de bloco
 */
export function useBlockValidation(instance: BlockInstance | null): BlockValidationHookResult {
  const definition = useBlockDefinition(instance?.type || '');

  return useMemo(() => {
    if (!instance) {
      return {
        isValid: false,
        errors: [{ property: 'instance', message: 'Instância de bloco não fornecida' }],
        hasErrors: true,
      };
    }

    // Validar schema básico
    const schemaValidation = validateBlockInstance(instance);
    if (!schemaValidation.success) {
      const errors = schemaValidation.error.errors.map((err) => ({
        property: err.path.join('.'),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
        hasErrors: true,
      };
    }

    // Validar propriedades contra definição
    if (definition) {
      const propsValidation = validateBlockProperties(instance.properties, definition);
      return {
        isValid: propsValidation.valid,
        errors: propsValidation.errors,
        hasErrors: !propsValidation.valid,
      };
    }

    // Sem definição, considerar válido (bloco customizado)
    return {
      isValid: true,
      errors: [],
      hasErrors: false,
    };
  }, [instance, definition]);
}

/**
 * Hook para validar apenas propriedades de um bloco
 */
export function useBlockPropertiesValidation(
  properties: Record<string, any>,
  blockType: string
): BlockValidationHookResult {
  const definition = useBlockDefinition(blockType);

  return useMemo(() => {
    if (!definition) {
      return {
        isValid: true,
        errors: [],
        hasErrors: false,
      };
    }

    const validation = validateBlockProperties(properties, definition);
    return {
      isValid: validation.valid,
      errors: validation.errors,
      hasErrors: !validation.valid,
    };
  }, [properties, definition]);
}

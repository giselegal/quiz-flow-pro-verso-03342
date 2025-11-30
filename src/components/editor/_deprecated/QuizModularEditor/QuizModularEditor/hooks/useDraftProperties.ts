/**
 * 🎯 USE DRAFT PROPERTIES HOOK
 * 
 * Manages draft state for the properties panel, implementing the 
 * "edit draft, apply on commit" pattern. The draft is validated
 * in real-time but only committed to global state when valid.
 * 
 * This hook addresses the issue where nocode editing was directly
 * modifying the official JSON, causing potential state corruption.
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { BlockTypeSchema } from '@/core/schema/SchemaInterpreter';
import {
  coerceAndValidateProperty,
  validateDraft,
  getInitialValueFromSchema,
  safeParseJson,
  PropertyValidationResult,
} from '@/core/schema/propertyValidation';
import { appLogger } from '@/lib/utils/appLogger';
import type { ZodTypeAny } from 'zod';

export interface UseDraftPropertiesOptions {
  /** The block schema for validation */
  schema: BlockTypeSchema | null;
  /** Optional schema derivado em Zod para validações compostas */
  zodSchema?: ZodTypeAny | null;
  /** Initial properties from the block */
  initialProperties: Record<string, any>;
  /** Callback when draft is committed */
  onCommit: (properties: Record<string, any>) => void;
  /** Auto-commit on blur when valid (optional, default false) */
  autoCommitOnBlur?: boolean;
}

export interface UseDraftPropertiesResult {
  /** Current draft properties */
  draft: Record<string, any>;
  /** Field-level errors */
  errors: Record<string, string>;
  /** Whether draft has changes from initial */
  isDirty: boolean;
  /** Whether all fields are valid */
  isValid: boolean;
  /** Whether validation is in progress */
  isValidating: boolean;
  /** Update a single field in the draft */
  updateField: (key: string, value: any) => PropertyValidationResult;
  /** Update JSON field with text buffer */
  updateJsonField: (key: string, textValue: string) => { error?: string; isValid: boolean };
  /** Commit draft to global state */
  commitDraft: () => boolean;
  /** Cancel and revert to initial properties */
  cancelDraft: () => void;
  /** Reset draft with new initial properties */
  resetDraft: (newProperties: Record<string, any>) => void;
  /** Get JSON text buffer for a field */
  getJsonBuffer: (key: string) => string;
  /** Get enhanced error message with suggestions */
  getErrorWithSuggestion: (key: string) => { error: string; suggestion?: string } | null;
}

/**
 * Hook for managing draft properties with validation
 */
export function useDraftProperties({
  schema,
  zodSchema = null,
  initialProperties,
  onCommit,
  autoCommitOnBlur = false
}: UseDraftPropertiesOptions): UseDraftPropertiesResult {
  // Initialize draft with schema defaults applied
  const getInitialDraft = useCallback(() => {
    if (!schema) return { ...initialProperties };

    const draft: Record<string, any> = {};
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      draft[key] = getInitialValueFromSchema(propSchema, initialProperties[key]);
    }
    return draft;
  }, [schema, initialProperties]);

  const [draft, setDraft] = useState<Record<string, any>>(() => getInitialDraft());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [zodErrors, setZodErrors] = useState<Record<string, string>>({});
  const [jsonBuffers, setJsonBuffers] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  // Track the initial properties for dirty detection
  const initialRef = useRef<Record<string, any>>(initialProperties);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Compute isDirty
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initialRef.current), [draft]);
  const errors = useMemo(() => ({ ...zodErrors, ...fieldErrors }), [zodErrors, fieldErrors]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  /**
   * Get error with helpful suggestion
   */
  const getErrorWithSuggestion = useCallback((key: string): { error: string; suggestion?: string } | null => {
    const error = errors[key];
    if (!error) return null;

    let suggestion: string | undefined;

    // Gerar sugestões baseadas no tipo de erro
    if (error.includes('obrigatório') || error.includes('required')) {
      suggestion = 'Este campo não pode ficar vazio';
    } else if (error.includes('número') || error.includes('number')) {
      suggestion = 'Digite apenas números (ex: 123)';
    } else if (error.includes('URL') || error.includes('url')) {
      suggestion = 'Digite uma URL válida (ex: https://exemplo.com)';
    } else if (error.includes('email')) {
      suggestion = 'Digite um email válido (ex: usuario@exemplo.com)';
    } else if (error.includes('JSON')) {
      suggestion = 'Verifique se o JSON está bem formatado. Use aspas duplas.';
    } else if (error.includes('mínimo') || error.includes('minimum')) {
      suggestion = 'O valor deve ser maior';
    } else if (error.includes('máximo') || error.includes('maximum')) {
      suggestion = 'O valor deve ser menor';
    }

    return { error, suggestion };
  }, [errors]);

  const runZodValidation = useCallback((nextDraft: Record<string, any>, immediate = false): boolean => {
    if (!zodSchema) {
      setZodErrors({});
      setIsValidating(false);
      return true;
    }

    // Limpar timeout anterior
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    const validate = () => {
      const result = zodSchema.safeParse(nextDraft);
      if (result.success) {
        setZodErrors({});
        setIsValidating(false);
        return true;
      }

      const mappedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = err.path?.[0];
        if (typeof key === 'string') {
          mappedErrors[key] = err.message;
        }
      });

      setZodErrors(mappedErrors);
      setIsValidating(false);
      return false;
    };

    if (immediate) {
      return validate();
    }

    // Debounce de 300ms para validações durante digitação
    setIsValidating(true);
    validationTimeoutRef.current = setTimeout(() => {
      validate();
    }, 300);

    return true; // Retorna true temporariamente durante debounce
  }, [zodSchema]);

  // Reset draft when initial properties change (e.g., block selection changes)
  useEffect(() => {
    const newDraft = getInitialDraft();
    setDraft(newDraft);
    setFieldErrors({});
    setZodErrors({});
    setJsonBuffers({});
    setIsValidating(false);
    initialRef.current = initialProperties;
    runZodValidation(newDraft, true); // validação imediata no reset
    
    appLogger.info('[useDraftProperties] Draft reset due to initialProperties change', {
      data: [{ keys: Object.keys(newDraft) }]
    });

    // Cleanup
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [initialProperties, getInitialDraft, runZodValidation]);

  /**
   * Update a single field in the draft with validation
   */
  const updateField = useCallback((key: string, value: any): PropertyValidationResult => {
    const propSchema = schema?.properties[key];
    const result = propSchema
      ? coerceAndValidateProperty(propSchema, value)
      : { value, isValid: true };

    setDraft(prev => {
      const nextDraft = { ...prev, [key]: result.value };
      runZodValidation(nextDraft);
      return nextDraft;
    });

    setFieldErrors(prev => {
      if (result.error) {
        return { ...prev, [key]: result.error };
      }
      if (!(key in prev)) {
        return prev;
      }
      const { [key]: _, ...rest } = prev;
      return rest;
    });

    appLogger.info('[useDraftProperties] Field updated:', {
      data: [{
        key,
        rawValue: value,
        coercedValue: result.value,
        isValid: result.isValid,
        error: result.error
      }]
    });

    return result;
  }, [schema, runZodValidation]);

  /**
   * Update a JSON field with a text buffer
   * Parses JSON and stores the text buffer for the editor
   */
  const updateJsonField = useCallback((key: string, textValue: string): { error?: string; isValid: boolean } => {
    // Always update the text buffer
    setJsonBuffers(prev => ({ ...prev, [key]: textValue }));

    // Try to parse
    const { value, error, isValid } = safeParseJson(textValue);

    if (isValid) {
      setDraft(prev => {
        const nextDraft = { ...prev, [key]: value };
        runZodValidation(nextDraft);
        return nextDraft;
      });
      setFieldErrors(prev => {
        if (!(key in prev)) {
          return prev;
        }
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setFieldErrors(prev => ({ ...prev, [key]: error || 'JSON inválido' }));
    }

    return { error, isValid };
  }, [runZodValidation]);

  /**
   * Get the JSON text buffer for a field
   */
  const getJsonBuffer = useCallback((key: string): string => {
    if (jsonBuffers[key] !== undefined) {
      return jsonBuffers[key];
    }
    // Initialize from draft value
    const value = draft[key];
    if (value === undefined || value === null) {
      return '{}';
    }
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value, null, 2);
  }, [jsonBuffers, draft]);

  /**
   * Commit the draft to global state
   * Returns true if successful, false if validation failed
   */
  const commitDraft = useCallback((): boolean => {
    // Validate all fields
    if (!schema) {
      const zodOk = runZodValidation(draft);
      if (!zodOk) {
        appLogger.warn('[useDraftProperties] Commit bloqueado - erros Zod (no schema)');
        return false;
      }
      onCommit(draft);
      initialRef.current = { ...draft };
      appLogger.info('[useDraftProperties] Draft committed (no schema)');
      return true;
    }

    const validation = validateDraft(schema.properties, draft);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      appLogger.warn('[useDraftProperties] Commit blocked - validation errors:', {
        data: [validation.errors]
      });
      return false;
    }

    const zodIsValid = runZodValidation(validation.values);
    if (!zodIsValid) {
      appLogger.warn('[useDraftProperties] Commit bloqueado - erros Zod');
      return false;
    }

    onCommit(validation.values);
    initialRef.current = { ...validation.values };
    setFieldErrors({});
    
    appLogger.info('[useDraftProperties] Draft committed successfully');
    return true;
  }, [schema, draft, onCommit, runZodValidation]);

  /**
   * Cancel editing and revert to initial properties
   */
  const cancelDraft = useCallback(() => {
    setDraft({ ...initialRef.current });
    setFieldErrors({});
    setJsonBuffers({});
    runZodValidation(initialRef.current);
    
    appLogger.info('[useDraftProperties] Draft cancelled, reverted to initial');
  }, [runZodValidation]);

  /**
   * Reset draft with new initial properties
   */
  const resetDraft = useCallback((newProperties: Record<string, any>) => {
    initialRef.current = newProperties;
    const newDraft = getInitialDraft();
    setDraft(newDraft);
    setFieldErrors({});
    setJsonBuffers({});
    runZodValidation(newDraft);
    
    appLogger.info('[useDraftProperties] Draft reset with new properties');
  }, [getInitialDraft, runZodValidation]);

  return {
    draft,
    errors,
    isDirty,
    isValid,
    isValidating,
    updateField,
    updateJsonField,
    commitDraft,
    cancelDraft,
    resetDraft,
    getJsonBuffer,
    getErrorWithSuggestion
  };
}

export default useDraftProperties;

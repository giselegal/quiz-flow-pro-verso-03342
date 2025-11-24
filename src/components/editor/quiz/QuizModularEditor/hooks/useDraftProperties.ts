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
import { PropertySchema, BlockTypeSchema } from '@/core/schema/SchemaInterpreter';
import {
  coerceAndValidateProperty,
  validateDraft,
  getInitialValueFromSchema,
  safeParseJson,
  PropertyValidationResult,
  DraftValidationResult
} from '@/core/schema/propertyValidation';
import { appLogger } from '@/lib/utils/appLogger';

export interface UseDraftPropertiesOptions {
  /** The block schema for validation */
  schema: BlockTypeSchema | null;
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
}

/**
 * Hook for managing draft properties with validation
 */
export function useDraftProperties({
  schema,
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

  const [draft, setDraft] = useState<Record<string, any>>(getInitialDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [jsonBuffers, setJsonBuffers] = useState<Record<string, string>>({});
  
  // Track the initial properties for dirty detection
  const initialRef = useRef<Record<string, any>>(initialProperties);

  // Compute isDirty
  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(initialRef.current);
  }, [draft]);

  // Compute isValid
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Reset draft when initial properties change (e.g., block selection changes)
  useEffect(() => {
    const newDraft = getInitialDraft();
    setDraft(newDraft);
    setErrors({});
    setJsonBuffers({});
    initialRef.current = initialProperties;
    
    appLogger.info('[useDraftProperties] Draft reset due to initialProperties change', {
      data: [{ keys: Object.keys(newDraft) }]
    });
  }, [initialProperties, getInitialDraft]);

  /**
   * Update a single field in the draft with validation
   */
  const updateField = useCallback((key: string, value: any): PropertyValidationResult => {
    const propSchema = schema?.properties[key];
    
    // If no schema, just store the value
    if (!propSchema) {
      setDraft(prev => ({ ...prev, [key]: value }));
      return { value, isValid: true };
    }

    // Validate and coerce
    const result = coerceAndValidateProperty(propSchema, value);

    // Update draft with coerced value
    setDraft(prev => ({ ...prev, [key]: result.value }));

    // Update errors
    setErrors(prev => {
      if (result.error) {
        return { ...prev, [key]: result.error };
      } else {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
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
  }, [schema]);

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
      // Update draft with parsed value
      setDraft(prev => ({ ...prev, [key]: value }));
      // Clear error
      setErrors(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    } else {
      // Set error but don't update draft value
      setErrors(prev => ({ ...prev, [key]: error || 'JSON inválido' }));
    }

    return { error, isValid };
  }, []);

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
      onCommit(draft);
      initialRef.current = { ...draft };
      appLogger.info('[useDraftProperties] Draft committed (no schema)');
      return true;
    }

    const validation = validateDraft(schema.properties, draft);

    if (!validation.isValid) {
      setErrors(validation.errors);
      appLogger.warn('[useDraftProperties] Commit blocked - validation errors:', {
        data: [validation.errors]
      });
      return false;
    }

    // Commit validated values
    onCommit(validation.values);
    initialRef.current = { ...validation.values };
    setErrors({});
    
    appLogger.info('[useDraftProperties] Draft committed successfully');
    return true;
  }, [schema, draft, onCommit]);

  /**
   * Cancel editing and revert to initial properties
   */
  const cancelDraft = useCallback(() => {
    setDraft({ ...initialRef.current });
    setErrors({});
    setJsonBuffers({});
    
    appLogger.info('[useDraftProperties] Draft cancelled, reverted to initial');
  }, []);

  /**
   * Reset draft with new initial properties
   */
  const resetDraft = useCallback((newProperties: Record<string, any>) => {
    initialRef.current = newProperties;
    const newDraft = getInitialDraft();
    setDraft(newDraft);
    setErrors({});
    setJsonBuffers({});
    
    appLogger.info('[useDraftProperties] Draft reset with new properties');
  }, [getInitialDraft]);

  return {
    draft,
    errors,
    isDirty,
    isValid,
    updateField,
    updateJsonField,
    commitDraft,
    cancelDraft,
    resetDraft,
    getJsonBuffer
  };
}

export default useDraftProperties;

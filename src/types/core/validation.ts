/**
 * 🎯 CANONICAL VALIDATION TYPES
 * 
 * Tipos para validação de dados.
 * 
 * @canonical
 */

import { z } from 'zod';

// =============================================================================
// VALIDATION RESULT
// =============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metadata?: ValidationMetadata;
}

export interface ValidationError {
  code: string;
  message: string;
  path?: string[];
  field?: string;
  value?: unknown;
  expected?: string;
  received?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  path?: string[];
  field?: string;
  suggestion?: string;
}

export interface ValidationMetadata {
  validatedAt: string;
  duration: number;
  validatorVersion: string;
}

// =============================================================================
// VALIDATION RULE
// =============================================================================

export interface ValidationRule<T = unknown> {
  id: string;
  type: 'required' | 'format' | 'range' | 'length' | 'pattern' | 'custom';
  message: string;
  validate: (value: T) => boolean;
  severity?: 'error' | 'warning' | 'info';
}

export interface ValidationRuleSet<T = unknown> {
  rules: ValidationRule<T>[];
  stopOnFirstError?: boolean;
}

// =============================================================================
// FIELD VALIDATION
// =============================================================================

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string | RegExp;
  format?: 'email' | 'url' | 'phone' | 'date' | 'time' | 'datetime';
  custom?: (value: unknown) => boolean | string;
}

export interface FieldValidationResult {
  field: string;
  isValid: boolean;
  errors: string[];
  value?: unknown;
}

// =============================================================================
// FORM VALIDATION
// =============================================================================

export interface FormValidation {
  fields: Record<string, FieldValidation>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
}

export interface FormValidationResult {
  isValid: boolean;
  fields: Record<string, FieldValidationResult>;
  errors: ValidationError[];
}

// =============================================================================
// SCHEMA VALIDATION
// =============================================================================

export type ZodSchema<T> = z.ZodType<T>;

export interface SchemaValidationOptions {
  strict?: boolean;
  partial?: boolean;
  stripUnknown?: boolean;
}

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  error?: z.ZodError;
  issues?: z.ZodIssue[];
}

// =============================================================================
// VALIDATION CONTEXT
// =============================================================================

export interface ValidationContext {
  mode: 'create' | 'update' | 'delete';
  userId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function createValidationResult(
  isValid: boolean,
  errors: ValidationError[] = [],
  warnings: ValidationWarning[] = []
): ValidationResult {
  return {
    isValid,
    errors,
    warnings,
    metadata: {
      validatedAt: new Date().toISOString(),
      duration: 0,
      validatorVersion: '1.0.0',
    },
  };
}

export function createValidationError(
  code: string,
  message: string,
  options?: Partial<ValidationError>
): ValidationError {
  return {
    code,
    message,
    ...options,
  };
}

export function mergeValidationResults(
  results: ValidationResult[]
): ValidationResult {
  return {
    isValid: results.every(r => r.isValid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings),
  };
}

// =============================================================================
// COMMON VALIDATORS
// =============================================================================

export const validators = {
  required: (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  minLength: (min: number) => (value: string): boolean => {
    return value.length >= min;
  },
  
  maxLength: (max: number) => (value: string): boolean => {
    return value.length <= max;
  },
  
  min: (min: number) => (value: number): boolean => {
    return value >= min;
  },
  
  max: (max: number) => (value: number): boolean => {
    return value <= max;
  },
  
  pattern: (regex: RegExp) => (value: string): boolean => {
    return regex.test(value);
  },
};

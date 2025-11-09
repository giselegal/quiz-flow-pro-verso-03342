/**
 * 🛡️ usePropertyValidation - Hook para validação de propriedades com Zod
 * 
 * G26: Validação de campos com React Hook Form + Zod
 * G11: Validação runtime antes de salvar
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export interface PropertyConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'image' | 'url';
  description?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    url?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
  };
  category: 'content' | 'style' | 'behavior' | 'advanced';
}

/**
 * Gera schema Zod dinamicamente baseado na configuração de propriedades
 */
export function generatePropertySchema(properties: PropertyConfig[]): z.ZodObject<any> {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  properties.forEach(prop => {
    let fieldSchema: z.ZodTypeAny;

    // Base type
    switch (prop.type) {
      case 'number':
        fieldSchema = z.number({
          invalid_type_error: `${prop.label} deve ser um número`,
        });

        if (prop.validation?.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(
            prop.validation.min,
            `${prop.label} deve ser no mínimo ${prop.validation.min}`
          );
        }

        if (prop.validation?.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(
            prop.validation.max,
            `${prop.label} deve ser no máximo ${prop.validation.max}`
          );
        }
        break;

      case 'url':
        fieldSchema = z.string().url({
          message: `${prop.label} deve ser uma URL válida (ex: https://exemplo.com)`,
        });
        break;

      case 'boolean':
        fieldSchema = z.boolean();
        break;

      case 'select':
        if (prop.options && prop.options.length > 0) {
          const validValues = prop.options.map(opt => opt.value);
          fieldSchema = z.enum(validValues as [string, ...string[]], {
            invalid_type_error: `${prop.label} deve ser uma das opções válidas`,
          });
        } else {
          fieldSchema = z.string();
        }
        break;

      case 'color':
        // Validar hex colors (#RGB ou #RRGGBB)
        fieldSchema = z.string().regex(
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          `${prop.label} deve ser uma cor hexadecimal válida (ex: #FF5733)`
        );
        break;

      case 'text':
      case 'textarea':
      case 'image':
      default:
        fieldSchema = z.string();

        // URL validation if specified
        if (prop.validation?.url) {
          fieldSchema = (fieldSchema as z.ZodString).url({
            message: `${prop.label} deve ser uma URL válida`,
          });
        }

        // Email validation if specified
        if (prop.validation?.email) {
          fieldSchema = (fieldSchema as z.ZodString).email({
            message: `${prop.label} deve ser um email válido`,
          });
        }

        // Pattern validation
        if (prop.validation?.pattern) {
          fieldSchema = (fieldSchema as z.ZodString).regex(
            new RegExp(prop.validation.pattern),
            `${prop.label} não corresponde ao formato esperado`
          );
        }

        // Length validations
        if (prop.validation?.minLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            prop.validation.minLength,
            `${prop.label} deve ter no mínimo ${prop.validation.minLength} caracteres`
          );
        }

        if (prop.validation?.maxLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).max(
            prop.validation.maxLength,
            `${prop.label} deve ter no máximo ${prop.validation.maxLength} caracteres`
          );
        }
        break;
    }

    // Required validation
    if (prop.validation?.required) {
      // Schema já é required por padrão, mas adiciona mensagem customizada
      if (prop.type === 'text' || prop.type === 'textarea') {
        fieldSchema = (fieldSchema as z.ZodString).min(1, `${prop.label} é obrigatório`);
      }
    } else {
      // Make optional if not required
      fieldSchema = fieldSchema.optional();
    }

    schemaShape[prop.key] = fieldSchema;
  });

  return z.object(schemaShape);
}

/**
 * Hook para validação de propriedades com React Hook Form + Zod
 * 
 * @example
 * const { form, validateAndSave } = usePropertyValidation(properties, initialValues);
 * 
 * // Em um form:
 * <form onSubmit={form.handleSubmit(validateAndSave)}>
 *   <input {...form.register('content.text')} />
 *   {form.formState.errors['content.text'] && <span>Erro</span>}
 * </form>
 */
export function usePropertyValidation<T extends Record<string, any>>(
  properties: PropertyConfig[],
  initialValues: T,
  onSave: (validatedData: T) => void | Promise<void>
): {
  form: UseFormReturn<T>;
  validateAndSave: (data: T) => Promise<void>;
  isValid: boolean;
  errors: Record<string, string>;
} {
  const schema = generatePropertySchema(properties);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange', // Validate on every change for instant feedback
  });

  const validateAndSave = async (data: T) => {
    try {
      // G11: Runtime validation with Zod
      const validated = schema.parse(data) as T;
      await onSave(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form errors from Zod validation
        error.errors.forEach(err => {
          const path = err.path.join('.');
          form.setError(path as any, {
            type: 'manual',
            message: err.message,
          });
        });
      }
      throw error;
    }
  };

  // Extract errors in simple format
  const errors: Record<string, string> = {};
  Object.entries(form.formState.errors).forEach(([key, error]) => {
    if (error && 'message' in error) {
      errors[key] = error.message as string;
    }
  });

  return {
    form,
    validateAndSave,
    isValid: form.formState.isValid,
    errors,
  };
}

/**
 * Validação runtime standalone (sem form)
 * Útil para validar dados antes de salvar no banco
 * 
 * @example
 * const result = validateBlockData(properties, blockData);
 * if (result.success) {
 *   await saveToDatabase(result.data);
 * } else {
 *   console.error('Erros:', result.errors);
 * }
 */
export function validateBlockData<T extends Record<string, any>>(
  properties: PropertyConfig[],
  data: T
): { success: true; data: T } | { success: false; errors: Array<{ path: string; message: string }> } {
  const schema = generatePropertySchema(properties);

  try {
    const validated = schema.parse(data) as T;
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    throw error;
  }
}

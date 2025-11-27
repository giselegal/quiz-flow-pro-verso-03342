/**
 * ✅ VALIDATION PROVIDER - LEGACY REDIRECT
 * 
 * ⚠️ DEPRECATED: Este arquivo foi movido para /src/core/contexts/validation/
 * 
 * @deprecated Use import { ValidationProvider, useValidation } from '@/core/contexts/validation'
 */

import { appLogger } from '@/lib/utils/appLogger';

// Re-export do core
export { ValidationProvider, useValidation, validators } from '@/core/contexts/validation';
export type { ValidatorFunction, ValidationRule, FieldValidation, ValidationState, ValidationContextValue } from '@/core/contexts/validation';

// Warning em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  appLogger.warn(
    '⚠️ DEPRECATED: ValidationProvider de @/contexts/validation/\n' +
    'Migre para: @/core/contexts/validation'
  );
}

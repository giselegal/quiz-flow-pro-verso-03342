/**
 * 🚨 DEPRECATED - FUNNEL ERROR SYSTEM MIGRATION
 * 
 * ⚠️ ATENÇÃO: Este sistema de erros está DEPRECIADO!
 * 
 * 🔄 MIGRAÇÃO OBRIGATÓRIA:
 * - ❌ FunnelError → ✅ StandardizedError 
 * - ❌ FunnelErrorFactory → ✅ ErrorManager + create*Error functions
 * - ❌ FunnelErrorHandler → ✅ errorManager.handleError()
 * - ❌ FunnelErrorCodes → ✅ ErrorCodes (utils/errorHandling.ts)
 * 
 * 📖 GUIA DE MIGRAÇÃO:
 * 
 * ANTES:
 * ```typescript
 * import { FunnelError } from '@/core/errors/FunnelError';
 * throw new FunnelError(FunnelErrorCodes.INVALID_ID, 'ID inválido');
 * ```
 * 
 * DEPOIS:
 * ```typescript
 * import { createValidationError } from '@/utils/errorHandling';
 * throw createValidationError('INVALID_FUNNEL_ID', 'ID inválido');
 * ```
 * 
 * 🔗 COMPATIBILIDADE TEMPORÁRIA:
 * Este arquivo mantém compatibilidade básica durante a migração.
 * REMOVER após todas as referências serem migradas!
 */

import {
    StandardizedError,
    createValidationError,
    createStorageError,
    createFunnelError as createFunnelErrorUtil,
    createAPIError,
    ErrorCodes
} from '@/utils/errorHandling';

// ============================================================================
// COMPATIBILITY LAYER - Mapear códigos antigos para novos
// ============================================================================

const legacyToNewErrorCodeMap: Record<string, keyof typeof ErrorCodes> = {
    // Validation errors
    'INVALID_ID': 'INVALID_FUNNEL_ID',
    'INVALID_STEP': 'INVALID_STEP_NUMBER',
    'SCHEMA_ERROR': 'SCHEMA_VALIDATION_FAILED',
    'MISSING_FIELD': 'MISSING_REQUIRED_FIELD',
    'INVALID_TYPE': 'INVALID_FIELD_TYPE',
    'INVALID_VALUE': 'INVALID_FIELD_VALUE',

    // Storage errors  
    'STORAGE_ERROR': 'STORAGE_NOT_AVAILABLE',
    'QUOTA_ERROR': 'STORAGE_QUOTA_EXCEEDED',
    'CORRUPTION': 'DATA_CORRUPTION_DETECTED',
    'MIGRATION_ERROR': 'MIGRATION_FAILED',
    'BACKUP_ERROR': 'BACKUP_FAILED',
    'SYNC_ERROR': 'SYNC_FAILED',

    // API errors
    'NETWORK': 'NETWORK_ERROR',
    'UNAUTHORIZED': 'UNAUTHORIZED',
    'FORBIDDEN': 'FORBIDDEN',
    'NOT_FOUND': 'NOT_FOUND',
    'RATE_LIMIT': 'RATE_LIMITED',
    'SERVER_ERROR': 'SERVER_ERROR',
    'TIMEOUT': 'TIMEOUT',

    // Funnel specific
    'FUNNEL_NOT_FOUND': 'FUNNEL_NOT_FOUND',
    'FUNNEL_CREATE_FAILED': 'FUNNEL_CREATION_FAILED',
    'FUNNEL_UPDATE_FAILED': 'FUNNEL_UPDATE_FAILED',
    'FUNNEL_DELETE_FAILED': 'FUNNEL_DELETE_FAILED',
    'CIRCULAR_REF': 'CIRCULAR_REFERENCE'
};

// ============================================================================
// DEPRECATED FUNNEL ERROR CLASS - Para compatibilidade temporária
// ============================================================================

/**
 * @deprecated Use StandardizedError from utils/errorHandling.ts instead
 */
export class FunnelError extends Error {
    public readonly code: string;
    public readonly context: any;
    public readonly canRecover: boolean;
    public readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

    constructor(code: string, message: string, context: any = {}) {
        super(message);

        console.warn(`🚨 DEPRECATED: FunnelError is deprecated. Use StandardizedError instead.`);
        console.warn(`📖 Migration guide: Replace FunnelError with createValidationError, createStorageError, etc.`);

        this.name = 'FunnelError';
        this.code = code;
        this.context = context;
        this.canRecover = true; // Default para compatibilidade
        this.severity = 'MEDIUM'; // Default para compatibilidade

        // Capturar stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FunnelError);
        }
    }

    /**
     * @deprecated Use createValidationError() instead
     */
    static createValidation(code: string, message: string, context: any = {}): FunnelError {
        console.warn('🚨 DEPRECATED: FunnelError.createValidation() is deprecated. Use createValidationError() instead.');
        return new FunnelError(code, message, context);
    }

    /**
     * @deprecated Use createStorageError() instead  
     */
    static createStorage(code: string, message: string, context: any = {}): FunnelError {
        console.warn('🚨 DEPRECATED: FunnelError.createStorage() is deprecated. Use createStorageError() instead.');
        return new FunnelError(code, message, context);
    }

    /**
     * @deprecated Use createFunnelError() instead
     */
    static createFunnel(code: string, message: string, context: any = {}): FunnelError {
        console.warn('🚨 DEPRECATED: FunnelError.createFunnel() is deprecated. Use createFunnelError() instead.');
        return new FunnelError(code, message, context);
    }

    /**
     * Converte FunnelError legado para StandardizedError
     */
    toStandardizedError(): StandardizedError {
        const newErrorCode = legacyToNewErrorCodeMap[this.code] || 'UNEXPECTED_ERROR';

        // Determinar função de criação baseada no código
        if (newErrorCode.startsWith('VALIDATION_') || newErrorCode.includes('INVALID_') || newErrorCode.includes('MISSING_')) {
            return createValidationError(newErrorCode, this.message, this.context);
        } else if (newErrorCode.startsWith('STORAGE_') || newErrorCode.includes('MIGRATION_') || newErrorCode.includes('BACKUP_')) {
            return createStorageError(newErrorCode, this.message, this.context);
        } else if (newErrorCode.startsWith('FUNNEL_') || newErrorCode.includes('CIRCULAR_')) {
            return createFunnelErrorUtil(newErrorCode, this.message, this.context);
        } else if (newErrorCode.startsWith('API_') || newErrorCode.includes('NETWORK_') || newErrorCode.includes('UNAUTHORIZED')) {
            return createAPIError(newErrorCode, this.message, this.context);
        } else {
            return createValidationError('UNEXPECTED_ERROR', this.message, this.context);
        }
    }
}

// ============================================================================
// DEPRECATED FACTORY FUNCTIONS
// ============================================================================

/**
 * @deprecated Use createValidationError() from utils/errorHandling.ts instead
 */
export function createFunnelError(code: string, message: string, context: any = {}): FunnelError {
    console.warn('🚨 DEPRECATED: createFunnelError() is deprecated. Import createValidationError, createStorageError etc. from utils/errorHandling.ts instead.');
    return new FunnelError(code, message, context);
}

/**
 * @deprecated Use errorManager.handleError() from utils/errorHandling.ts instead
 */
export function handleFunnelError(error: Error | FunnelError): void {
    console.warn('🚨 DEPRECATED: handleFunnelError() is deprecated. Use errorManager.handleError() instead.');

    if (error instanceof FunnelError) {
        const standardized = error.toStandardizedError();
        console.error('Converted legacy FunnelError:', standardized);
    } else {
        console.error('Legacy error handling:', error);
    }
}

// ============================================================================
// MIGRATION HELPER FUNCTIONS
// ============================================================================

/**
 * Helper para converter erros legados em batch
 */
export function migrateLegacyErrors(errors: (Error | FunnelError)[]): StandardizedError[] {
    return errors.map(error => {
        if (error instanceof FunnelError) {
            return error.toStandardizedError();
        } else {
            return createValidationError('UNEXPECTED_ERROR', error.message, { additionalData: { originalError: error } });
        }
    });
}

/**
 * Helper para detectar uso de APIs depreciadas
 */
export function detectDeprecatedUsage(): void {
    console.warn(`
🚨 SISTEMA DE ERROS DEPRECIADO DETECTADO!

📋 CHECKLIST DE MIGRAÇÃO:
□ Substituir 'FunnelError' por 'StandardizedError' 
□ Substituir 'createFunnelError()' por 'create*Error()' functions
□ Substituir 'handleFunnelError()' por 'errorManager.handleError()'
□ Atualizar imports: '@/core/errors/*' → '@/utils/errorHandling'
□ Atualizar códigos de erro usando ErrorCodes enum
□ Testar recovery strategies com nova arquitetura

🔗 DOCUMENTAÇÃO: Ver utils/errorHandling.ts para exemplos completos
    `);
}

// Log warning when this deprecated module is imported
console.warn('🚨 DEPRECATED MODULE: core/errors/FunnelError.ts is deprecated. Migrate to utils/errorHandling.ts');
detectDeprecatedUsage();
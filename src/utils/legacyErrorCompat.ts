/**
 * 🔄 COMPATIBILIDADE - Adaptador para Sistema Legacy de Erros
 * 
 * Mantém compatibilidade com código existente enquanto migra para novo sistema
 */

import { createStorageError, createValidationError, errorManager } from './errorHandling';

// ============================================================================
// ADAPTADORES LEGACY
// ============================================================================

export class FunnelError extends Error {
    public code: string;
    public context?: any;

    constructor(code: string, message?: string, context?: any) {
        super(message || `Funnel error: ${code}`);
        this.name = 'FunnelError';
        this.code = code;
        this.context = context;
    }
}

export const FunnelErrorCode = {
    STORAGE_FULL: 'STORAGE_FULL',
    NOT_FOUND: 'NOT_FOUND',
    INVALID_DATA: 'INVALID_DATA'
} as const;

export const FunnelErrorFactory = {
    storageError: (operation: string, message: string) => {
        const error = createStorageError('STORAGE_NOT_AVAILABLE', message, { operation });
        return new FunnelError(error.code, error.message, { operation });
    },

    notFound: (id: string) => {
        const error = createStorageError('STORAGE_NOT_AVAILABLE', `Funnel ${id} not found`, { funnelId: id });
        return new FunnelError('FUNNEL_NOT_FOUND', error.message, { funnelId: id });
    },

    validationError: (message: string) => {
        const error = createValidationError('SCHEMA_VALIDATION_FAILED', message);
        return new FunnelError(error.code, error.message);
    }
};

export const handleFunnelError = async (error: FunnelError, context?: any) => {
    // Converter para sistema novo e processar
    try {
        // Criar erro compatível com sistema novo baseado no tipo de FunnelError
        let newError;

        if (error.code === 'FUNNEL_NOT_FOUND') {
            newError = createStorageError('STORAGE_NOT_AVAILABLE', error.message, {
                ...error.context,
                ...context
            });
        } else if (error.code.includes('STORAGE')) {
            newError = createStorageError('STORAGE_NOT_AVAILABLE', error.message, {
                ...error.context,
                ...context
            });
        } else {
            newError = createValidationError('SCHEMA_VALIDATION_FAILED', error.message, {
                ...error.context,
                ...context
            });
        }

        errorManager.handleError(newError);
    } catch (handlingError) {
        console.error('Failed to handle FunnelError:', handlingError);
        // Fallback: log original error
        console.error('Original FunnelError:', error.message, error.context);
    }
};
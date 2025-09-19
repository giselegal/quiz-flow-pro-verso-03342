/**
 * 🔥 SISTEMA PADRONIZADO DE ERROR HANDLING
 * 
 * Sistema robusto de erros tipados para todo o aplicativo:
 * - Códigos específicos para cada tipo de erro
 * - Stack traces informativos
 * - Logging estruturado
 * - Recovery automático quando possível
 */

// ============================================================================
// TIPOS DE ERRO
// ============================================================================

export enum ErrorCategory {
    VALIDATION = 'VALIDATION',
    STORAGE = 'STORAGE',
    API = 'API',
    AUTH = 'AUTH',
    FUNNEL = 'FUNNEL',
    COMPONENT = 'COMPONENT',
    SCHEMA = 'SCHEMA',
    SYSTEM = 'SYSTEM'
}

export enum ErrorSeverity {
    LOW = 'LOW',           // Warning, não bloqueia
    MEDIUM = 'MEDIUM',     // Error, mas tem fallback
    HIGH = 'HIGH',         // Error crítico, bloqueia operação
    CRITICAL = 'CRITICAL'  // Error que quebra o sistema
}

export interface ErrorContext {
    userId?: string;
    funnelId?: string;
    stepNumber?: number;
    componentType?: string;
    operation?: string;
    timestamp: number;
    userAgent?: string;
    url?: string;
    additionalData?: Record<string, any>;
}

export interface StandardError {
    code: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    message: string;
    technicalMessage?: string;
    context: ErrorContext;
    stack?: string;
    canRecover: boolean;
    recoveryActions?: string[];
}

// ============================================================================
// CÓDIGOS DE ERRO ESPECÍFICOS
// ============================================================================

export const ErrorCodes = {
    // Validation Errors
    INVALID_FUNNEL_ID: 'VALIDATION_001',
    INVALID_STEP_NUMBER: 'VALIDATION_002',
    INVALID_INSTANCE_KEY: 'VALIDATION_003',
    SCHEMA_VALIDATION_FAILED: 'VALIDATION_004',
    MISSING_REQUIRED_FIELD: 'VALIDATION_005',
    INVALID_FIELD_TYPE: 'VALIDATION_006',
    INVALID_FIELD_VALUE: 'VALIDATION_007',

    // Storage Errors
    STORAGE_NOT_AVAILABLE: 'STORAGE_001',
    STORAGE_QUOTA_EXCEEDED: 'STORAGE_002',
    DATA_CORRUPTION_DETECTED: 'STORAGE_003',
    MIGRATION_FAILED: 'STORAGE_004',
    BACKUP_FAILED: 'STORAGE_005',
    SYNC_FAILED: 'STORAGE_006',

    // API Errors
    NETWORK_ERROR: 'API_001',
    UNAUTHORIZED: 'API_002',
    FORBIDDEN: 'API_003',
    NOT_FOUND: 'API_004',
    RATE_LIMITED: 'API_005',
    SERVER_ERROR: 'API_006',
    TIMEOUT: 'API_007',

    // Auth Errors
    AUTH_REQUIRED: 'AUTH_001',
    AUTH_INVALID: 'AUTH_002',
    AUTH_EXPIRED: 'AUTH_003',
    PERMISSIONS_INSUFFICIENT: 'AUTH_004',

    // Funnel Errors
    FUNNEL_NOT_FOUND: 'FUNNEL_001',
    FUNNEL_CREATION_FAILED: 'FUNNEL_002',
    FUNNEL_UPDATE_FAILED: 'FUNNEL_003',
    FUNNEL_DELETE_FAILED: 'FUNNEL_004',
    FUNNEL_PUBLISH_FAILED: 'FUNNEL_005',
    CIRCULAR_REFERENCE: 'FUNNEL_006',

    // Component Errors
    COMPONENT_NOT_FOUND: 'COMPONENT_001',
    COMPONENT_CREATION_FAILED: 'COMPONENT_002',
    COMPONENT_UPDATE_FAILED: 'COMPONENT_003',
    COMPONENT_DELETE_FAILED: 'COMPONENT_004',
    INVALID_COMPONENT_TYPE: 'COMPONENT_005',
    DUPLICATE_INSTANCE_KEY: 'COMPONENT_006',

    // Schema Errors
    SCHEMA_VERSION_MISMATCH: 'SCHEMA_001',
    UNKNOWN_SCHEMA_FORMAT: 'SCHEMA_002',
    SCHEMA_UPGRADE_FAILED: 'SCHEMA_003',

    // System Errors
    SYSTEM_INITIALIZATION_FAILED: 'SYSTEM_001',
    FEATURE_NOT_AVAILABLE: 'SYSTEM_002',
    RESOURCE_EXHAUSTED: 'SYSTEM_003',
    UNEXPECTED_ERROR: 'SYSTEM_004'
} as const;

// ============================================================================
// FACTORY DE ERROS
// ============================================================================

export class StandardizedError extends Error implements StandardError {
    public readonly code: string;
    public readonly category: ErrorCategory;
    public readonly severity: ErrorSeverity;
    public readonly technicalMessage?: string;
    public readonly context: ErrorContext;
    public readonly canRecover: boolean;
    public readonly recoveryActions?: string[];

    constructor(
        code: string,
        message: string,
        options: {
            category: ErrorCategory;
            severity: ErrorSeverity;
            technicalMessage?: string;
            context?: Partial<ErrorContext>;
            canRecover?: boolean;
            recoveryActions?: string[];
            cause?: Error;
        }
    ) {
        super(message);
        this.name = 'StandardizedError';
        this.code = code;
        this.category = options.category;
        this.severity = options.severity;
        this.technicalMessage = options.technicalMessage;
        this.canRecover = options.canRecover ?? false;
        this.recoveryActions = options.recoveryActions;

        this.context = {
            timestamp: Date.now(),
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            ...options.context
        };

        if (options.cause) {
            this.stack = `${this.stack}\nCaused by: ${options.cause.stack}`;
        }
    }

    toJSON() {
        return {
            code: this.code,
            category: this.category,
            severity: this.severity,
            message: this.message,
            technicalMessage: this.technicalMessage,
            context: this.context,
            canRecover: this.canRecover,
            recoveryActions: this.recoveryActions,
            stack: this.stack
        };
    }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

export const createValidationError = (
    code: keyof typeof ErrorCodes,
    message: string,
    context?: Partial<ErrorContext>
) => new StandardizedError(ErrorCodes[code], message, {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.MEDIUM,
    context,
    canRecover: true,
    recoveryActions: ['Correct the invalid data', 'Use default values']
});

export const createStorageError = (
    code: keyof typeof ErrorCodes,
    message: string,
    context?: Partial<ErrorContext>
) => new StandardizedError(ErrorCodes[code], message, {
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.HIGH,
    context,
    canRecover: true,
    recoveryActions: ['Try again', 'Use fallback storage', 'Clear storage']
});

export const createAPIError = (
    code: keyof typeof ErrorCodes,
    message: string,
    context?: Partial<ErrorContext>
) => new StandardizedError(ErrorCodes[code], message, {
    category: ErrorCategory.API,
    severity: ErrorSeverity.HIGH,
    context,
    canRecover: true,
    recoveryActions: ['Retry request', 'Check connection', 'Use cached data']
});

export const createFunnelError = (
    code: keyof typeof ErrorCodes,
    message: string,
    context?: Partial<ErrorContext>
) => new StandardizedError(ErrorCodes[code], message, {
    category: ErrorCategory.FUNNEL,
    severity: ErrorSeverity.MEDIUM,
    context,
    canRecover: true,
    recoveryActions: ['Reload funnel', 'Use default template', 'Reset to last saved']
});

export const createSystemError = (
    code: keyof typeof ErrorCodes,
    message: string,
    context?: Partial<ErrorContext>
) => new StandardizedError(ErrorCodes[code], message, {
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.CRITICAL,
    context,
    canRecover: false,
    recoveryActions: ['Reload page', 'Clear cache', 'Contact support']
});

// ============================================================================
// ERROR HANDLER
// ============================================================================

export interface ErrorHandler {
    onError: (error: StandardizedError) => void;
    onRecovery?: (error: StandardizedError, action: string) => void;
}

class ErrorManager {
    private handlers: ErrorHandler[] = [];
    private errorLog: StandardizedError[] = [];
    private maxLogSize = 100;

    addHandler(handler: ErrorHandler) {
        this.handlers.push(handler);
    }

    removeHandler(handler: ErrorHandler) {
        const index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
    }

    handleError(error: Error | StandardizedError, context?: Partial<ErrorContext>) {
        let standardError: StandardizedError;

        if (error instanceof StandardizedError) {
            standardError = error;
        } else {
            // Converter erro genérico para StandardizedError
            standardError = new StandardizedError(
                ErrorCodes.UNEXPECTED_ERROR,
                error.message || 'An unexpected error occurred',
                {
                    category: ErrorCategory.SYSTEM,
                    severity: ErrorSeverity.MEDIUM,
                    technicalMessage: error.stack,
                    context,
                    canRecover: true,
                    cause: error
                }
            );
        }

        // Adicionar ao log
        this.errorLog.push(standardError);
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }

        // Notificar handlers
        this.handlers.forEach(handler => {
            try {
                handler.onError(standardError);
            } catch (handlerError) {
                console.error('Error in error handler:', handlerError);
            }
        });

        // Log estruturado
        this.logError(standardError);
    }

    private logError(error: StandardizedError) {
        const logMethod = error.severity === ErrorSeverity.CRITICAL ? 'error' :
            error.severity === ErrorSeverity.HIGH ? 'error' :
                error.severity === ErrorSeverity.MEDIUM ? 'warn' : 'info';

        console[logMethod](`[${error.code}] ${error.category}: ${error.message}`, {
            technicalMessage: error.technicalMessage,
            context: error.context,
            canRecover: error.canRecover,
            recoveryActions: error.recoveryActions
        });
    }

    getErrorLog(): StandardizedError[] {
        return [...this.errorLog];
    }

    clearErrorLog() {
        this.errorLog = [];
    }

    async attemptRecovery(error: StandardizedError, actionIndex: number = 0): Promise<boolean> {
        if (!error.canRecover || !error.recoveryActions || actionIndex >= error.recoveryActions.length) {
            return false;
        }

        const action = error.recoveryActions[actionIndex];

        try {
            // Aqui você implementaria as ações de recovery específicas
            console.info(`Attempting recovery: ${action}`);

            // Notificar handlers sobre a tentativa de recovery
            this.handlers.forEach(handler => {
                handler.onRecovery?.(error, action);
            });

            return true;
        } catch (recoveryError) {
            console.error(`Recovery action "${action}" failed:`, recoveryError);

            // Tentar próxima ação de recovery
            return this.attemptRecovery(error, actionIndex + 1);
        }
    }
}

// ============================================================================
// INSTÂNCIA GLOBAL
// ============================================================================

export const errorManager = new ErrorManager();

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Wrapper para funções que podem gerar erros
 */
export const withErrorHandling = <T extends (...args: any[]) => any>(
    fn: T,
    context?: Partial<ErrorContext>
): T => {
    return ((...args: any[]) => {
        try {
            const result = fn(...args);

            // Se retorna Promise, capturar erros assíncronos
            if (result && typeof result.then === 'function') {
                return result.catch((error: Error) => {
                    errorManager.handleError(error, context);
                    throw error;
                });
            }

            return result;
        } catch (error) {
            errorManager.handleError(error as Error, context);
            throw error;
        }
    }) as T;
};

/**
 * Hook para React components
 */
export const useErrorHandler = () => {
    return {
        handleError: (error: Error | StandardizedError, context?: Partial<ErrorContext>) => {
            errorManager.handleError(error, context);
        },
        createError: {
            validation: createValidationError,
            storage: createStorageError,
            api: createAPIError,
            funnel: createFunnelError,
            system: createSystemError
        }
    };
};
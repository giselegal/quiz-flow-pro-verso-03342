/**
 * 🎨 COMPONENTES UI INTELIGENTES PARA EXIBIÇÃO DE ERROS
 * 
 * Sistema completo de UI para erros de funil com:
 * - Componentes React reutilizáveis
 * - UX inteligente baseada no tipo de erro
 * - Ações de recovery integradas
 * - Feedback visual e animações
 * - Acessibilidade completa
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FunnelError } from './FunnelError';
import { FunnelErrorCode, ErrorSeverity, RecoveryStrategy } from './FunnelErrorCodes';
import { globalFunnelRecovery } from './FunnelErrorRecovery';
import { globalFunnelErrorHandler } from './FunnelErrorHandler';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

/**
 * Props base para componentes de erro
 */
export interface FunnelErrorUIProps {
    error: FunnelError;
    onDismiss?: () => void;
    onRetry?: () => void;
    onRecover?: (strategy: RecoveryStrategy) => void;
    className?: string;
    showDetails?: boolean;
    autoRecovery?: boolean;
}

/**
 * Configuração de tema para componentes de erro
 */
export interface ErrorTheme {
    colors: {
        info: string;
        warning: string;
        error: string;
        critical: string;
        background: string;
        text: string;
        border: string;
    };
    borderRadius: string;
    boxShadow: string;
    animation: {
        duration: string;
        easing: string;
    };
}

/**
 * Estado do toast de erro
 */
export interface ErrorToastState {
    id: string;
    error: FunnelError;
    visible: boolean;
    progress: number;
    autoHideTimer?: NodeJS.Timeout;
}

// ============================================================================
// TEMA PADRÃO
// ============================================================================

const defaultTheme: ErrorTheme = {
    colors: {
        info: '#3B82F6',      // blue-500
        warning: '#F59E0B',   // amber-500
        error: '#EF4444',     // red-500
        critical: '#DC2626',  // red-600
        background: '#FFFFFF',
        text: '#1F2937',      // gray-800
        border: '#E5E7EB'     // gray-200
    },
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    animation: {
        duration: '0.3s',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// ============================================================================
// ÍCONES DE ERRO
// ============================================================================

const ErrorIcons = {
    [ErrorSeverity.INFO]: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    ),

    [ErrorSeverity.WARNING]: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
    ),

    [ErrorSeverity.ERROR]: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
    ),

    [ErrorSeverity.CRITICAL]: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
    )
};

// ============================================================================
// COMPONENTE PRINCIPAL DE ERRO
// ============================================================================

/**
 * Componente principal para exibir erros com UI inteligente
 */
export const FunnelErrorDisplay: React.FC<FunnelErrorUIProps> = ({
    error,
    onDismiss,
    onRetry,
    onRecover,
    className = '',
    showDetails = false,
    autoRecovery = true
}) => {
    const [isExpanded, setIsExpanded] = useState(showDetails);
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoveryProgress, setRecoveryProgress] = useState(0);

    // Determinar cor baseada na severidade
    const severityColor = useMemo(() => {
        switch (error.metadata.severity) {
            case ErrorSeverity.INFO: return defaultTheme.colors.info;
            case ErrorSeverity.WARNING: return defaultTheme.colors.warning;
            case ErrorSeverity.ERROR: return defaultTheme.colors.error;
            case ErrorSeverity.CRITICAL: return defaultTheme.colors.critical;
            default: return defaultTheme.colors.error;
        }
    }, [error.metadata.severity]);

    // Ícone baseado na severidade
    const IconComponent = ErrorIcons[error.metadata.severity];

    // Executar recovery automático
    const handleAutoRecovery = useCallback(async () => {
        if (!autoRecovery || !globalFunnelRecovery.canRecover(error)) return;

        setIsRecovering(true);
        setRecoveryProgress(0);

        try {
            // Simular progresso
            const progressInterval = setInterval(() => {
                setRecoveryProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const result = await globalFunnelRecovery.executeRecovery({
                error,
                attemptNumber: error.retryCount + 1,
                previousAttempts: []
            });

            clearInterval(progressInterval);
            setRecoveryProgress(100);

            if (result.success) {
                setTimeout(() => {
                    onRecover?.(result.strategy);
                }, 500);
            } else {
                setTimeout(() => {
                    setIsRecovering(false);
                    setRecoveryProgress(0);
                }, 1000);
            }

        } catch (recoveryError) {
            setIsRecovering(false);
            setRecoveryProgress(0);
            console.error('Auto recovery failed:', recoveryError);
        }
    }, [autoRecovery, error, onRecover]);

    // Auto recovery ao montar
    useEffect(() => {
        if (autoRecovery && error.canAutoRecover()) {
            const timer = setTimeout(handleAutoRecovery, 1000);
            return () => clearTimeout(timer);
        }
    }, [handleAutoRecovery, autoRecovery, error]);

    return (
        <div
            className={`funnel-error-display ${className}`}
            style={{
                backgroundColor: defaultTheme.colors.background,
                border: `1px solid ${severityColor}`,
                borderRadius: defaultTheme.borderRadius,
                boxShadow: defaultTheme.boxShadow,
                padding: '16px',
                margin: '8px 0'
            }}
            role="alert"
            aria-live="assertive"
        >
            {/* Header */}
            <div className="flex items-start space-x-3">
                <div
                    className="flex-shrink-0"
                    style={{ color: severityColor }}
                >
                    <IconComponent />
                </div>

                <div className="flex-1 min-w-0">
                    <h3
                        className="text-sm font-medium"
                        style={{ color: defaultTheme.colors.text }}
                    >
                        {error.message}
                    </h3>

                    {error.metadata.category && (
                        <p className="text-xs text-gray-500 mt-1">
                            {error.code} • {error.metadata.category}
                        </p>
                    )}
                </div>

                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Fechar erro"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Progress bar para recovery */}
            {isRecovering && (
                <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Tentando recuperar automaticamente...</span>
                        <span>{recoveryProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="h-2 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${recoveryProgress}%`,
                                backgroundColor: severityColor
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Ações do usuário */}
            {!isRecovering && error.recoveryInfo.userActions.length > 0 && (
                <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                        {error.recoveryInfo.userActions.slice(0, 2).map((action, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (action.toLowerCase().includes('tentar') && onRetry) {
                                        onRetry();
                                    } else if (onRecover) {
                                        onRecover(error.recoveryInfo.strategy);
                                    }
                                }}
                                className="px-3 py-1 text-xs font-medium rounded border transition-colors"
                                style={{
                                    borderColor: severityColor,
                                    color: severityColor,
                                    backgroundColor: 'transparent'
                                }}
                            >
                                {action}
                            </button>
                        ))}

                        {error.recoveryInfo.userActions.length > 2 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                {isExpanded ? 'Menos opções' : `+${error.recoveryInfo.userActions.length - 2} opções`}
                            </button>
                        )}
                    </div>

                    {/* Ações expandidas */}
                    {isExpanded && error.recoveryInfo.userActions.length > 2 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {error.recoveryInfo.userActions.slice(2).map((action, index) => (
                                    <button
                                        key={index + 2}
                                        onClick={() => onRecover?.(error.recoveryInfo.strategy)}
                                        className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-left"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Detalhes técnicos (expandível) */}
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <details className="group">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                            Detalhes técnicos
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-700 overflow-auto">
                            <div><strong>Código:</strong> {error.code}</div>
                            <div><strong>ID:</strong> {error.metadata.errorId}</div>
                            <div><strong>Ocorrido em:</strong> {error.occurredAt.toLocaleString()}</div>
                            <div><strong>Tentativas:</strong> {error.retryCount}</div>
                            {error.context.funnelId && (
                                <div><strong>Funil:</strong> {error.context.funnelId}</div>
                            )}
                            {error.context.operation && (
                                <div><strong>Operação:</strong> {error.context.operation}</div>
                            )}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// COMPONENTE DE TOAST DE ERRO
// ============================================================================

/**
 * Toast não-intrusivo para erros menos críticos
 */
export const FunnelErrorToast: React.FC<FunnelErrorUIProps & {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    autoHide?: boolean;
    autoHideDelay?: number;
}> = ({
    error,
    onDismiss,
    onRetry,
    className = '',
    position = 'top-right',
    autoHide = true,
    autoHideDelay = 5000
}) => {
        const [isVisible, setIsVisible] = useState(true);
        const [progress, setProgress] = useState(100);

        // Auto-hide com progress
        useEffect(() => {
            if (!autoHide) return;

            let startTime = Date.now();
            let animationFrame: number;

            const updateProgress = () => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / autoHideDelay) * 100);

                setProgress(remaining);

                if (remaining > 0) {
                    animationFrame = requestAnimationFrame(updateProgress);
                } else {
                    handleDismiss();
                }
            };

            animationFrame = requestAnimationFrame(updateProgress);

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        }, [autoHide, autoHideDelay]);

        const handleDismiss = useCallback(() => {
            setIsVisible(false);
            setTimeout(() => {
                onDismiss?.();
            }, 300); // Aguardar animação de saída
        }, [onDismiss]);

        const positionClasses = {
            'top-right': 'top-4 right-4',
            'top-left': 'top-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'bottom-left': 'bottom-4 left-4'
        };

        const severityColor = useMemo(() => {
            switch (error.metadata.severity) {
                case ErrorSeverity.INFO: return defaultTheme.colors.info;
                case ErrorSeverity.WARNING: return defaultTheme.colors.warning;
                case ErrorSeverity.ERROR: return defaultTheme.colors.error;
                case ErrorSeverity.CRITICAL: return defaultTheme.colors.critical;
                default: return defaultTheme.colors.error;
            }
        }, [error.metadata.severity]);

        const IconComponent = ErrorIcons[error.metadata.severity];

        if (!isVisible) return null;

        return (
            <div
                className={`funnel-error-toast fixed z-50 transition-all duration-300 ${positionClasses[position]} ${className}`}
                style={{
                    backgroundColor: defaultTheme.colors.background,
                    border: `1px solid ${severityColor}`,
                    borderRadius: defaultTheme.borderRadius,
                    boxShadow: defaultTheme.boxShadow,
                    minWidth: '300px',
                    maxWidth: '400px',
                    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                    opacity: isVisible ? 1 : 0
                }}
                role="alert"
                aria-live="polite"
            >
                <div className="p-4">
                    <div className="flex items-start space-x-3">
                        <div
                            className="flex-shrink-0"
                            style={{ color: severityColor }}
                        >
                            <IconComponent />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                                {error.message}
                            </h4>

                            {error.recoveryInfo.userActions.length > 0 && (
                                <div className="mt-2 flex space-x-2">
                                    {onRetry && (
                                        <button
                                            onClick={onRetry}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Tentar novamente
                                        </button>
                                    )}

                                    <button
                                        onClick={handleDismiss}
                                        className="text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Dispensar
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Fechar"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                {autoHide && (
                    <div
                        className="h-1 transition-all duration-100 ease-linear"
                        style={{
                            backgroundColor: severityColor,
                            width: `${progress}%`
                        }}
                    />
                )}
            </div>
        );
    };

// ============================================================================
// BOUNDARY PARA CAPTURAR ERROS REACT
// ============================================================================

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    funnelError: FunnelError | null;
}

export class FunnelErrorBoundary extends React.Component<
    React.PropsWithChildren<{
        fallback?: React.ComponentType<{ error: FunnelError }>;
        onError?: (error: FunnelError) => void;
    }>,
    ErrorBoundaryState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            funnelError: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Converter erro React para FunnelError
        const funnelError = new FunnelError(
            FunnelErrorCode.INTERNAL_ERROR,
            error.message,
            {
                component: 'ErrorBoundary',
                operation: 'render'
            },
            error
        );

        return {
            hasError: true,
            error,
            funnelError
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log erro usando o handler global
        globalFunnelErrorHandler.handleError(this.state.funnelError!, {
            componentStack: errorInfo.componentStack
        });

        // Notificar callback
        if (this.state.funnelError) {
            this.props.onError?.(this.state.funnelError);
        }
    }

    render() {
        if (this.state.hasError && this.state.funnelError) {
            const FallbackComponent = this.props.fallback || FunnelErrorDisplay;

            return (
                <FallbackComponent
                    error={this.state.funnelError}
                    onRetry={() => {
                        this.setState({
                            hasError: false,
                            error: null,
                            funnelError: null
                        });
                    }}
                />
            );
        }

        return this.props.children;
    }
}

// ============================================================================
// HOOK PARA GERENCIAR TOASTS DE ERRO
// ============================================================================

export const useErrorToasts = () => {
    const [toasts, setToasts] = useState<ErrorToastState[]>([]);

    const addToast = useCallback((error: FunnelError) => {
        const id = `toast_${error.metadata.errorId}_${Date.now()}`;

        const newToast: ErrorToastState = {
            id,
            error,
            visible: true,
            progress: 100
        };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove após 5 segundos se for INFO ou WARNING
        if (error.metadata.severity === ErrorSeverity.INFO ||
            error.metadata.severity === ErrorSeverity.WARNING) {

            const autoHideTimer = setTimeout(() => {
                removeToast(id);
            }, 5000);

            newToast.autoHideTimer = autoHideTimer;
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => {
            const toast = prev.find(t => t.id === id);
            if (toast?.autoHideTimer) {
                clearTimeout(toast.autoHideTimer);
            }
            return prev.filter(t => t.id !== id);
        });
    }, []);

    const clearAll = useCallback(() => {
        setToasts(prev => {
            prev.forEach(toast => {
                if (toast.autoHideTimer) {
                    clearTimeout(toast.autoHideTimer);
                }
            });
            return [];
        });
    }, []);

    // Cleanup na desmontagem
    useEffect(() => {
        return () => {
            toasts.forEach(toast => {
                if (toast.autoHideTimer) {
                    clearTimeout(toast.autoHideTimer);
                }
            });
        };
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        clearAll
    };
};

// ============================================================================
// CONTAINER DE TOASTS
// ============================================================================

export const FunnelErrorToastContainer: React.FC<{
    toasts: ErrorToastState[];
    onRemove: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}> = ({ toasts, onRemove, position = 'top-right' }) => {
    if (toasts.length === 0) return null;

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4'
    };

    return (
        <div
            className={`fixed z-50 space-y-2 ${positionClasses[position]}`}
            style={{ maxWidth: '400px' }}
        >
            {toasts.map(toast => (
                <FunnelErrorToast
                    key={toast.id}
                    error={toast.error}
                    onDismiss={() => onRemove(toast.id)}
                    position={position}
                    autoHide={false} // Controlado pelo hook
                />
            ))}
        </div>
    );
};

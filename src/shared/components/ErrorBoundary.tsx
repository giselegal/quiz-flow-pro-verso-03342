/**
 * 🛡️ ERROR BOUNDARY - Componente de Recuperação de Erros
 * 
 * Componente que captura erros React e exibe UI de fallback.
 * Previne que crashes em componentes derrubem a aplicação inteira.
 * 
 * FEATURES:
 * - Captura erros de renderização
 * - UI de fallback customizável
 * - Logging de erros
 * - Botão de reset/reload
 * - Integração com sistemas de monitoramento
 * 
 * @example
 * ```typescript
 * import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
 * 
 * <ErrorBoundary
 *   fallback={<ErrorPage />}
 *   onError={(error, errorInfo) => {
 *     logger.error('Component crashed', { error, errorInfo });
 *   }}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export interface ErrorBoundaryProps {
    /** Conteúdo a ser renderizado */
    children: ReactNode;

    /** UI de fallback quando erro acontece */
    fallback?: ReactNode;

    /** Callback quando erro é capturado */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;

    /** Se deve mostrar botão de reset */
    showResetButton?: boolean;

    /** Callback customizado de reset */
    onReset?: () => void;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Componente de fallback padrão
 */
function DefaultErrorFallback({
    error,
    errorInfo,
    onReset
}: {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    onReset?: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="max-w-lg w-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <div>
                            <CardTitle>Algo deu errado</CardTitle>
                            <CardDescription>
                                Ocorreu um erro inesperado na aplicação
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-red-900 mb-1">
                                Erro:
                            </p>
                            <p className="text-sm text-red-700 font-mono">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {process.env.NODE_ENV === 'development' && errorInfo && (
                        <details className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <summary className="text-sm font-medium text-gray-900 cursor-pointer">
                                Stack Trace (Dev Only)
                            </summary>
                            <pre className="mt-2 text-xs text-gray-700 overflow-auto max-h-64">
                                {errorInfo.componentStack}
                            </pre>
                        </details>
                    )}

                    <p className="text-sm text-gray-600">
                        Este erro foi registrado e será investigado pela equipe de desenvolvimento.
                    </p>
                </CardContent>

                <CardFooter className="flex gap-2">
                    <Button
                        onClick={() => {
                            if (onReset) {
                                onReset();
                            } else {
                                window.location.reload();
                            }
                        }}
                        className="flex-1"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Recarregar Página
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                        className="flex-1"
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Voltar ao Início
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

/**
 * Componente Error Boundary principal
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log do erro
        appLogger.error('🔴 Error Boundary capturou erro:', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });

        // Atualizar estado
        this.setState({
            error,
            errorInfo,
        });

        // Callback customizado
        this.props.onError?.(error, errorInfo);

        // Enviar para serviço de monitoramento (se configurado)
        if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, {
                contexts: {
                    react: {
                        componentStack: errorInfo.componentStack,
                    },
                },
            });
        }
    }

    handleReset = (): void => {
        if (this.props.onReset) {
            this.props.onReset();
        }

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Usar fallback customizado se fornecido
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Usar fallback padrão
            return (
                <DefaultErrorFallback
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    onReset={this.props.showResetButton !== false ? this.handleReset : undefined}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * HOC para adicionar Error Boundary a um componente
 */
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
    return function WithErrorBoundary(props: P) {
        return (
            <ErrorBoundary {...errorBoundaryProps}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}

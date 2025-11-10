/**
 * 🛡️ SENTRY ERROR BOUNDARY - G47 FIX
 * 
 * Error Boundary React integrado com Sentry para captura de erros de renderização.
 * 
 * FEATURES:
 * ✅ Captura erros de renderização React
 * ✅ Envia automaticamente para Sentry
 * ✅ Fallback UI user-friendly
 * ✅ Botão de retry
 * ✅ Botão de report (feedback do usuário)
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCcw, MessageSquare } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    showDialog?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    eventId: string | null;
}

/**
 * Error Boundary com integração Sentry
 */
class SentryErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            eventId: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Capturar erro no Sentry
        Sentry.withScope((scope) => {
            scope.setExtras({
                componentStack: errorInfo.componentStack,
                errorBoundary: true,
            });

            const eventId = Sentry.captureException(error);

            this.setState({
                errorInfo,
                eventId,
            });
        });

        // Log no console para desenvolvimento
        appLogger.error('Error Boundary capturou erro:', { data: [error, errorInfo] });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            eventId: null,
        });
    };

    handleReportFeedback = (): void => {
        const { eventId } = this.state;
        if (eventId) {
            Sentry.showReportDialog({ eventId });
        }
    };

    render(): ReactNode {
        const { hasError, error } = this.state;
        const { children, fallback, showDialog = true } = this.props;

        if (hasError) {
            // Se fornecido fallback customizado, usar
            if (fallback) {
                return fallback;
            }

            // Fallback UI padrão
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                        {/* Ícone de erro */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>

                        {/* Título */}
                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Algo deu errado
                        </h1>

                        {/* Descrição */}
                        <p className="text-gray-600 text-center mb-6">
                            Detectamos um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
                        </p>

                        {/* Detalhes do erro (apenas em desenvolvimento) */}
                        {import.meta.env.MODE === 'development' && error && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 overflow-auto max-h-40">
                                <p className="text-xs font-mono text-red-600 break-words">
                                    {error.toString()}
                                </p>
                            </div>
                        )}

                        {/* Ações */}
                        <div className="flex flex-col gap-3">
                            {/* Botão de retry */}
                            <button
                                onClick={this.handleReset}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Tentar Novamente
                            </button>

                            {/* Botão de feedback (apenas se Sentry habilitado) */}
                            {showDialog && this.state.eventId && (
                                <button
                                    onClick={this.handleReportFeedback}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Reportar Problema
                                </button>
                            )}

                            {/* Voltar para home */}
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                            >
                                Voltar para Página Inicial
                            </button>
                        </div>

                        {/* ID do evento (para suporte) */}
                        {this.state.eventId && (
                            <p className="text-xs text-gray-400 text-center mt-6">
                                ID do Erro: {this.state.eventId}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return children;
    }
}

export default SentryErrorBoundary;

/**
 * HOC para adicionar Error Boundary a qualquer componente
 */
export function withSentryErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    options?: {
        fallback?: ReactNode;
        showDialog?: boolean;
    }
): React.ComponentType<P> {
    const WrappedComponent: React.FC<P> = (props) => (
        <SentryErrorBoundary {...options}>
            <Component {...props} />
        </SentryErrorBoundary>
    );

    WrappedComponent.displayName = `withSentryErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
}

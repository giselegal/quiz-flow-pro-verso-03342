import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    routeName?: string;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * 🛡️ Error Boundary para Rotas
 * 
 * Captura erros específicos de roteamento e problemas de DOM,
 * especialmente nas rotas do quiz e editor.
 */
export class RouteErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Atualiza o state para mostrar a UI de erro
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('RouteErrorBoundary capturou um erro:', {
            error,
            errorInfo,
            route: this.props.routeName,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });

        // Atualizar state com informações do erro
        this.setState({
            error,
            errorInfo
        });

        // Aqui você pode enviar o erro para um serviço de monitoramento
        // como Sentry, LogRocket, etc.
    }

    handleRefresh = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // UI de erro customizada
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Ops! Algo deu errado
                        </h2>

                        <p className="text-gray-600 mb-2">
                            {this.props.routeName
                                ? `Erro na rota: ${this.props.routeName}`
                                : 'Ocorreu um erro inesperado'
                            }
                        </p>

                        <p className="text-sm text-gray-500 mb-6">
                            Nosso time foi notificado e está trabalhando na correção.
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={this.handleRetry}
                                className="w-full"
                                variant="default"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Tentar Novamente
                            </Button>

                            <Button
                                onClick={this.handleRefresh}
                                className="w-full"
                                variant="outline"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Recarregar Página
                            </Button>

                            <Button
                                onClick={this.handleGoHome}
                                className="w-full"
                                variant="ghost"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Voltar ao Início
                            </Button>
                        </div>

                        {/* Detalhes técnicos (apenas em desenvolvimento) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    Detalhes Técnicos
                                </summary>
                                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
                                    <strong>Erro:</strong> {this.state.error.message}
                                    <br />
                                    <strong>Stack:</strong>
                                    <pre className="mt-1 whitespace-pre-wrap">
                                        {this.state.error.stack}
                                    </pre>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * 🎯 Error Boundary específico para o Quiz
 */
export const QuizErrorBoundary = ({ children }: { children: ReactNode }) => (
    <RouteErrorBoundary
        routeName="Quiz Estilo Pessoal"
        fallback={
            <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#ede4d3] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-[#5b4135] mb-4">
                        Oops! Quiz temporariamente indisponível
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Estamos trabalhando para resolver esse problema.
                        Tente novamente em alguns minutos.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-[#deac6d] hover:bg-[#c49548]"
                    >
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        }
    >
        {children}
    </RouteErrorBoundary>
);

/**
 * 🔧 Error Boundary específico para o Editor
 */
export const EditorErrorBoundary = ({ children }: { children: ReactNode }) => (
    <RouteErrorBoundary
        routeName="Editor"
        fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🛠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Editor temporariamente indisponível
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Ocorreu um problema no carregamento do editor.
                        Seus dados foram preservados.
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            Recarregar Editor
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="w-full"
                        >
                            Voltar ao Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        }
    >
        {children}
    </RouteErrorBoundary>
);
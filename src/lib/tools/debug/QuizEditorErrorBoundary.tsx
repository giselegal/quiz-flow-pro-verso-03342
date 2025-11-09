import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class QuizEditorErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('🚨 QuizFunnelEditor Error:', error);
        console.error('🚨 Error Info:', errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-red-800 mb-4">❌ Erro no QuizFunnelEditor</h2>

                    <div className="mb-4">
                        <h3 className="font-medium text-red-700 mb-2">Erro:</h3>
                        <pre className="text-sm text-red-700 bg-red-100 p-3 rounded overflow-auto max-h-32">
                            {this.state.error?.toString()}
                        </pre>
                    </div>

                    {this.state.errorInfo && (
                        <div className="mb-4">
                            <h3 className="font-medium text-red-700 mb-2">Stack de Componentes:</h3>
                            <pre className="text-xs text-red-600 bg-red-100 p-3 rounded overflow-auto max-h-48">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </div>
                    )}

                    <div className="mb-4">
                        <h3 className="font-medium text-red-700 mb-2">Stack Trace:</h3>
                        <pre className="text-xs text-red-600 bg-red-100 p-3 rounded overflow-auto max-h-48">
                            {this.state.error?.stack}
                        </pre>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Tentar novamente
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Recarregar página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default QuizEditorErrorBoundary;
import React, { Component, ReactNode } from 'react';

interface EditorErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface EditorErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class EditorErrorBoundary extends Component<
  EditorErrorBoundaryProps,
  EditorErrorBoundaryState
> {
  constructor(props: EditorErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): EditorErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Editor Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Editor</h2>
                <p className="text-gray-600 mb-4">
                  Ocorreu um erro inesperado no editor. Isso pode ser causado por um problema de
                  contexto.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-700 font-medium">
                    {this.state.error?.message || 'Erro desconhecido'}
                  </p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔄 Recarregar Página
                  </button>
                  <button
                    onClick={() => (window.location.href = '/')}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    🏠 Voltar ao Início
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Se o problema persistir, tente:</p>
                  <ul className="text-left mt-2">
                    <li>• Ctrl+Shift+R (hard refresh)</li>
                    <li>• Limpar cache do navegador</li>
                    <li>• Usar modo incógnito</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

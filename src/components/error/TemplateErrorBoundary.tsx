import React from 'react';

interface TemplateErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface TemplateErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

export class TemplateErrorBoundary extends React.Component<TemplateErrorBoundaryProps, TemplateErrorBoundaryState> {
  constructor(props: TemplateErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): TemplateErrorBoundaryState {
    console.error('🚨 TemplateErrorBoundary capturou erro:', error);
    if (typeof window !== 'undefined') {
      (window as any).__LAST_TEMPLATE_ERROR__ = {
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
      };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Erro detalhado no Template:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} />;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] bg-background">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Erro no Template
            </h2>
            <p className="text-muted-foreground mb-6">
              Ocorreu um erro ao carregar o template. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TemplateErrorBoundary;
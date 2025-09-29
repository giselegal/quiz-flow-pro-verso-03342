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
    console.error('📍 Stack do erro:', error.stack);
    console.error('💡 Nome do erro:', error.name);
    console.error('📝 Mensagem do erro:', error.message);

    // 🔍 DEBUG ADICIONAL: Verificar contexto específico
    console.error('🎯 URL atual:', window.location.href);
    console.error('🎯 Query params:', new URLSearchParams(window.location.search).toString());
    console.error('🎯 Timestamp:', new Date().toISOString());

    if (typeof window !== 'undefined') {
      (window as any).__LAST_TEMPLATE_ERROR__ = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: Date.now(),
        toString: error.toString()
      };
      console.error('🔍 Erro salvo em window.__LAST_TEMPLATE_ERROR__');

      // 🚨 ALERTA VISUAL NO CONSOLE
      console.error('%c🚨 ERRO CAPTURADO PELO TEMPLATE ERROR BOUNDARY', 'color: red; font-size: 20px; font-weight: bold;');
      console.error('%c📋 Para debug: window.__LAST_TEMPLATE_ERROR__', 'color: orange; font-size: 14px;');
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
      // 🚨 DEBUG TEMPORÁRIO: Mostrar erro mas permitir render de children
      console.log('🚨 [DEBUG] TemplateErrorBoundary detectou erro, mas forçando render...');

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} />;
      }

      // 🔧 DEBUG: Em vez de mostrar erro, tentar renderizar children
      try {
        return (
          <div>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong className="font-bold">⚠️ Aviso:</strong>
              <span className="block sm:inline"> Erro capturado: {this.state.error?.message}</span>
            </div>
            {this.props.children}
          </div>
        );
      } catch (renderError) {
        console.error('🚨 Erro durante render forçado:', renderError);
        // Fallback final
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
    }

    return this.props.children;
  }
}

export default TemplateErrorBoundary;
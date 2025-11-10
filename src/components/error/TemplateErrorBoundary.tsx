import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';

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
    appLogger.error('🚨 TemplateErrorBoundary capturou erro:', { data: [error] });
    appLogger.error('📍 Stack do erro:', { data: [error.stack] });
    appLogger.error('💡 Nome do erro:', { data: [error.name] });
    appLogger.error('📝 Mensagem do erro:', { data: [error.message] });

    // 🔍 DEBUG ADICIONAL: Verificar contexto específico
    appLogger.error('🎯 URL atual:', { data: [window.location.href] });
    appLogger.error('🎯 Query params:', { data: [new URLSearchParams(window.location.search).toString()] });
    appLogger.error('🎯 Timestamp:', { data: [new Date().toISOString()] });

    if (typeof window !== 'undefined') {
      (window as any).__LAST_TEMPLATE_ERROR__ = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: Date.now(),
        toString: error.toString(),
      };
      appLogger.error('🔍 Erro salvo em window.__LAST_TEMPLATE_ERROR__');

      // 🚨 ALERTA VISUAL NO CONSOLE
      appLogger.error('%c🚨 ERRO CAPTURADO PELO TEMPLATE ERROR BOUNDARY', { data: ['color: red; font-size: 20px; font-weight: bold;'] });
      appLogger.error('%c📋 Para debug: window.__LAST_TEMPLATE_ERROR__', { data: ['color: orange; font-size: 14px;'] });
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    appLogger.error('🚨 Erro detalhado no Template:', { data: [{
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
          }] });
  }

  render() {
    if (this.state.hasError) {
      // 🚨 DEBUG TEMPORÁRIO: Mostrar erro mas permitir render de children
      appLogger.info('🚨 [DEBUG] TemplateErrorBoundary detectou erro, mas forçando render...');

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
        appLogger.error('🚨 Erro durante render forçado:', { data: [renderError] });
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
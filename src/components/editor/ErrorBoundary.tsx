/**
 * 🛡️ ERROR BOUNDARY - Captura e recuperação de erros
 * 
 * Boundary otimizado para capturar erros runtime do editor
 * com sistema de retry automático e fallback graceful.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Editor Error Boundary captured:', error, errorInfo);
    
    // Log do erro para debugging
    this.logError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Callback personalizado
    this.props.onError?.(error, errorInfo);

    // Auto-retry para erros recuperáveis
    this.scheduleAutoRetry(error);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      location: window.location.href,
      userAgent: navigator.userAgent,
      retryCount: this.state.retryCount,
    };

    // Salvar no localStorage para debugging
    try {
      const existingLogs = JSON.parse(localStorage.getItem('editor-error-logs') || '[]');
      existingLogs.push(errorLog);
      // Manter apenas os últimos 10 logs
      const recentLogs = existingLogs.slice(-10);
      localStorage.setItem('editor-error-logs', JSON.stringify(recentLogs));
    } catch (e) {
      console.warn('Failed to save error log:', e);
    }
  };

  private scheduleAutoRetry = (error: Error) => {
    // Auto-retry apenas para erros conhecidos e recuperáveis
    const recoverableErrors = [
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk',
      'Network Error',
      'Failed to fetch'
    ];

    const isRecoverable = recoverableErrors.some(pattern => 
      error.message.includes(pattern) || error.name.includes(pattern)
    );

    if (isRecoverable && this.state.retryCount < this.maxRetries) {
      const retryDelay = Math.min(1000 * Math.pow(2, this.state.retryCount), 5000);
      
      console.log(`🔄 Auto-retry scheduled in ${retryDelay}ms (attempt ${this.state.retryCount + 1})`);
      
      this.retryTimeout = setTimeout(() => {
        this.handleRetry();
      }, retryDelay);
    }
  };

  private handleRetry = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  private handleManualRetry = () => {
    this.handleRetry();
  };

  private handleReload = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // Usar componente customizado se fornecido
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            retry={this.handleManualRetry}
          />
        );
      }

      // UI padrão de erro
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-background border border-border rounded-lg p-6 text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Algo deu errado no editor
              </h2>
              <p className="text-sm text-muted-foreground">
                {this.state.error?.message || 'Erro inesperado no sistema'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button 
                onClick={this.handleManualRetry}
                size="sm"
                disabled={this.state.retryCount >= this.maxRetries}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
              
              <Button 
                onClick={this.handleReload}
                variant="outline"
                size="sm"
              >
                Recarregar página
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left text-xs bg-muted p-3 rounded text-muted-foreground">
                <summary className="cursor-pointer flex items-center gap-2 mb-2">
                  <Bug className="h-3 w-3" />
                  Detalhes do erro (dev)
                </summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}

            <p className="text-xs text-muted-foreground">
              Tentativas: {this.state.retryCount}/{this.maxRetries}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export alias for backward compatibility
export const EditorErrorBoundary = ErrorBoundary;

export default ErrorBoundary;
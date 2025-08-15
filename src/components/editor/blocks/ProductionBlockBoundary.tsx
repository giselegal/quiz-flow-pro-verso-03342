import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  blockType?: string;
  blockId?: string;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

/**
 * 🛡️ PRODUCTION BLOCK BOUNDARY
 *
 * Error boundary especializado para componentes do editor
 * - Captura erros de renderização de blocos individuais
 * - Permite retry automático
 * - Fornece fallback visual consistente
 * - Registra erros para monitoramento
 */
export class ProductionBlockBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
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
    this.setState({
      error,
      errorInfo,
    });

    // Registrar erro para monitoramento
    this.logError(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      timestamp: new Date().toISOString(),
      blockType: this.props.blockType,
      blockId: this.props.blockId,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
    };

    // Log para console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Block Error Caught');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Block Details:', {
        type: this.props.blockType,
        id: this.props.blockId,
      });
      console.groupEnd();
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar com serviço de monitoramento (Sentry, LogRocket, etc.)
      window.gtag?.('event', 'block_error', {
        event_category: 'editor',
        event_label: this.props.blockType || 'unknown',
        value: this.state.retryCount,
      });
    }

    // Armazenar em localStorage para debug
    try {
      const existingErrors = JSON.parse(localStorage.getItem('editor_errors') || '[]');
      existingErrors.push(errorData);

      // Manter apenas os últimos 10 erros
      if (existingErrors.length > 10) {
        existingErrors.shift();
      }

      localStorage.setItem('editor_errors', JSON.stringify(existingErrors));
    } catch (storageError) {
      console.warn('Não foi possível salvar erro no localStorage:', storageError);
    }
  };

  private handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
      }));

      // Retry com delay progressivo
      const delay = Math.pow(2, this.state.retryCount) * 1000; // 1s, 2s, 4s
      this.retryTimeout = setTimeout(() => {
        // Forçar re-render após delay
        this.forceUpdate();
      }, delay);
    }
  };

  private handleReportBug = () => {
    const subject = encodeURIComponent(
      `Bug Report: ${this.props.blockType || 'Unknown'} Block Error`
    );
    const body = encodeURIComponent(`
Block Type: ${this.props.blockType || 'Unknown'}
Block ID: ${this.props.blockId || 'Unknown'}
Error: ${this.state.error?.message || 'Unknown error'}
Stack: ${this.state.error?.stack || 'No stack trace'}
Retry Count: ${this.state.retryCount}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Please describe what you were doing when this error occurred:
[Your description here]
    `);

    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`, '_blank');
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // Se foi fornecido um fallback personalizado
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Fallback padrão com informações do erro
      return (
        <div
          className={cn(
            'relative border-2 border-red-200 bg-red-50 rounded-lg p-4',
            'min-h-[120px] flex flex-col items-center justify-center',
            'text-red-700'
          )}
        >
          {/* Ícone de erro */}
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          {/* Mensagem de erro */}
          <div className="text-center mb-4">
            <h3 className="font-medium text-sm mb-1">
              Erro no Componente {this.props.blockType || 'Desconhecido'}
            </h3>
            <p className="text-xs text-red-600">
              {this.state.error?.message || 'Erro de renderização'}
            </p>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            {this.state.retryCount < 3 && (
              <button
                onClick={this.handleRetry}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 text-xs',
                  'bg-red-100 hover:bg-red-200 rounded-md',
                  'transition-colors duration-200'
                )}
              >
                <RefreshCw className="w-3 h-3" />
                Tentar Novamente ({3 - this.state.retryCount} restantes)
              </button>
            )}

            <button
              onClick={this.handleReportBug}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 text-xs',
                'bg-gray-100 hover:bg-gray-200 rounded-md',
                'transition-colors duration-200'
              )}
            >
              <Bug className="w-3 h-3" />
              Reportar Bug
            </button>
          </div>

          {/* Debug info (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 w-full">
              <summary className="text-xs font-mono cursor-pointer text-red-500">
                Stack Trace (dev only)
              </summary>
              <pre className="text-xs mt-2 p-2 bg-red-100 rounded overflow-auto max-h-32">
                {this.state.error.stack}
              </pre>
            </details>
          )}

          {/* ID do bloco para debug */}
          {this.props.blockId && (
            <div className="absolute top-1 right-1 text-xs text-red-400 font-mono">
              {this.props.blockId.slice(-8)}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 🎯 FALLBACK SIMPLES PARA COMPONENTES PROBLEMÁTICOS
 *
 * Usado quando um componente específico tem problemas conhecidos
 */
export const SimpleBlockFallback: React.FC<{
  blockType: string;
  blockId?: string;
  message?: string;
}> = ({ blockType, blockId, message }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
    <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
      <AlertTriangle className="w-4 h-4 text-gray-400" />
    </div>
    <p className="text-sm font-medium">{blockType}</p>
    <p className="text-xs mt-1">{message || 'Componente temporariamente indisponível'}</p>
    {blockId && <p className="text-xs text-gray-400 mt-2 font-mono">ID: {blockId.slice(-8)}</p>}
  </div>
);

export default ProductionBlockBoundary;

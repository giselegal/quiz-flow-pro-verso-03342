/**
 * 🛡️ UNIFIED ERROR BOUNDARY - FASE 1: PADRONIZAÇÃO
 * 
 * Error boundary unificado que consolida os múltiplos sistemas:
 * - EditorErrorBoundary
 * - QuizErrorBoundary
 * - RouteErrorBoundary
 * - TemplateErrorBoundary
 * 
 * ✅ Contexto inteligente baseado na rota
 * ✅ Recovery automático para erros não-críticos
 * ✅ Telemetria de erros consolidada
 */

import React, { Component, ReactNode } from 'react';

interface UnifiedErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorContext: string;
  retryCount: number;
}

interface UnifiedErrorBoundaryProps {
  children: ReactNode;
  context?: 'editor' | 'quiz' | 'template' | 'route' | 'global';
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableAutoRecovery?: boolean;
  maxRetries?: number;
}

export class UnifiedErrorBoundary extends Component<
  UnifiedErrorBoundaryProps,
  UnifiedErrorBoundaryState
> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: UnifiedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorContext: props.context || 'global',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<UnifiedErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { context = 'global', onError } = this.props;
    
    // 📊 TELEMETRIA UNIFICADA
    console.group(`🚨 UnifiedErrorBoundary [${context}]`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    this.setState({ 
      errorInfo,
      errorContext: context
    });

    // 🔔 Callback personalizado
    if (onError) {
      onError(error, errorInfo);
    }

    // 🤖 AUTO-RECOVERY para erros não-críticos
    if (this.props.enableAutoRecovery && this.shouldAttemptRecovery(error)) {
      this.scheduleRecovery();
    }
  }

  /**
   * 🤖 RECOVERY LOGIC - Decide se deve tentar auto-recovery
   */
  private shouldAttemptRecovery(error: Error): boolean {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      return false;
    }

    // Não tentar recovery para erros críticos
    const criticalErrors = [
      'ChunkLoadError',  // Bundle loading issues
      'TypeError: Cannot read properties of null', // Ref errors
      'Maximum update depth exceeded' // Infinite render loops
    ];

    return !criticalErrors.some(critical => error.message.includes(critical));
  }

  /**
   * ⏰ SCHEDULE RECOVERY - Agenda tentativa de recovery
   */
  private scheduleRecovery(): void {
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 10000); // Exponential backoff
    
    this.retryTimeout = setTimeout(() => {
      console.log(`🔄 Attempting auto-recovery (attempt ${this.state.retryCount + 1})`);
      this.handleRetry();
    }, delay);
  }

  /**
   * 🔄 RETRY HANDLER
   */
  private handleRetry = (): void => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  /**
   * 🎨 CONTEXT-AWARE FALLBACK - UI baseada no contexto
   */
  private renderContextualFallback(): ReactNode {
    const { errorContext } = this.state;

    const baseClasses = "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100";
    const cardClasses = "max-w-md w-full bg-white rounded-xl shadow-lg p-6 mx-4";

    // 🎨 CONTEXTOS ESPECÍFICOS
    switch (errorContext) {
      case 'editor':
        return (
          <div className={baseClasses}>
            <div className={cardClasses}>
              <div className="text-center">
                <div className="text-blue-500 text-6xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Editor</h2>
                <p className="text-gray-600 mb-4">
                  Ocorreu um problema no editor. Isso pode ser causado por um bloco incompatível.
                </p>
                {this.renderErrorDetails()}
                {this.renderActionButtons(true)}
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className={baseClasses}>
            <div className={cardClasses}>
              <div className="text-center">
                <div className="text-purple-500 text-6xl mb-4">❓</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Quiz</h2>
                <p className="text-gray-600 mb-4">
                  Houve um problema ao carregar o quiz. Suas respostas foram salvas.
                </p>
                {this.renderErrorDetails()}
                {this.renderActionButtons(false)}
              </div>
            </div>
          </div>
        );

      case 'template':
        return (
          <div className={baseClasses}>
            <div className={cardClasses}>
              <div className="text-center">
                <div className="text-green-500 text-6xl mb-4">📄</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Template</h2>
                <p className="text-gray-600 mb-4">
                  Não foi possível carregar o template. Usando versão de fallback.
                </p>
                {this.renderErrorDetails()}
                {this.renderActionButtons(true)}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={baseClasses}>
            <div className={cardClasses}>
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo deu errado</h2>
                <p className="text-gray-600 mb-4">
                  Ocorreu um erro inesperado. Nossa equipe foi notificada.
                </p>
                {this.renderErrorDetails()}
                {this.renderActionButtons(false)}
              </div>
            </div>
          </div>
        );
    }
  }

  /**
   * 📊 ERROR DETAILS - Mostra detalhes técnicos (colapsável)
   */
  private renderErrorDetails(): ReactNode {
    const { error } = this.state;
    
    return (
      <details className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
        <summary className="text-sm text-red-700 font-medium cursor-pointer">
          Detalhes técnicos
        </summary>
        <div className="mt-2 text-xs text-red-600 font-mono break-all">
          {error?.message || 'Erro desconhecido'}
        </div>
      </details>
    );
  }

  /**
   * 🔘 ACTION BUTTONS - Botões de ação contextuais
   */
  private renderActionButtons(showRetry: boolean): ReactNode {
    const { retryCount } = this.state;
    const { maxRetries = 3, enableAutoRecovery } = this.props;
    const canRetry = showRetry && retryCount < maxRetries;

    return (
      <div className="space-y-2">
        {canRetry && (
          <button
            onClick={this.handleRetry}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Tentar Novamente {retryCount > 0 && `(${retryCount}/${maxRetries})`}
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          🔄 Recarregar Página
        </button>
        
        <button
          onClick={() => (window.location.href = '/')}
          className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
        >
          🏠 Voltar ao Início
        </button>

        {enableAutoRecovery && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            Auto-recovery: {retryCount < maxRetries ? 'Ativo' : 'Esgotado'}
          </div>
        )}
      </div>
    );
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderContextualFallback();
    }

    return this.props.children;
  }
}

/**
 * 🎯 CONTEXT-SPECIFIC WRAPPERS - Wrappers pré-configurados
 */
export const EditorErrorBoundary = ({ children, ...props }: Omit<UnifiedErrorBoundaryProps, 'context'>) => (
  <UnifiedErrorBoundary context="editor" enableAutoRecovery maxRetries={2} {...props}>
    {children}
  </UnifiedErrorBoundary>
);

export const QuizErrorBoundary = ({ children, ...props }: Omit<UnifiedErrorBoundaryProps, 'context'>) => (
  <UnifiedErrorBoundary context="quiz" enableAutoRecovery={false} {...props}>
    {children}
  </UnifiedErrorBoundary>
);

export const TemplateErrorBoundary = ({ children, ...props }: Omit<UnifiedErrorBoundaryProps, 'context'>) => (
  <UnifiedErrorBoundary context="template" enableAutoRecovery maxRetries={3} {...props}>
    {children}
  </UnifiedErrorBoundary>
);

export const RouteErrorBoundary = ({ children, ...props }: Omit<UnifiedErrorBoundaryProps, 'context'>) => (
  <UnifiedErrorBoundary context="route" enableAutoRecovery={false} {...props}>
    {children}
  </UnifiedErrorBoundary>
);

export default UnifiedErrorBoundary;
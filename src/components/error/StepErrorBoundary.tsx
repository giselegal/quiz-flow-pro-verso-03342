/**
 * 🛡️ STEP ERROR BOUNDARY - Erro isolado por step
 * 
 * Previne que um erro em um step específico trave o editor inteiro.
 * Permite que o usuário:
 * - Continue editando outros steps
 * - Recarregue apenas o step problemático
 * - Mantenha seu progresso
 * 
 * ANTES: Erro em step-05 → Editor inteiro trava ❌
 * DEPOIS: Erro em step-05 → Apenas step-05 mostra erro, resto funciona ✅
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, SkipForward, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appLogger } from '@/lib/utils/appLogger';

interface StepErrorBoundaryProps {
  children: ReactNode;
  stepKey: string;
  stepNumber?: number;
  onReset?: () => void;
  onSkip?: () => void;
  fallbackComponent?: React.ComponentType<StepErrorFallbackProps>;
}

interface StepErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

export interface StepErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  stepKey: string;
  stepNumber?: number;
  errorCount: number;
  onReset: () => void;
  onSkip?: () => void;
}

/**
 * Fallback padrão para erros de step
 */
function DefaultStepErrorFallback({
  error,
  errorInfo,
  stepKey,
  stepNumber,
  errorCount,
  onReset,
  onSkip,
}: StepErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        {/* Ícone e título */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Erro no Step {stepNumber || stepKey}
            </h3>
            <p className="text-sm text-muted-foreground">
              {errorCount > 1 && `Este erro ocorreu ${errorCount} vezes. `}
              O resto do editor continua funcionando normalmente.
            </p>
          </div>
        </div>

        {/* Mensagem de erro */}
        <div className="mb-4 p-3 bg-background rounded border">
          <p className="text-sm font-mono text-destructive">
            {error.message || 'Erro desconhecido'}
          </p>
        </div>

        {/* Detalhes técnicos (colapsável) */}
        {errorInfo && (
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <FileWarning className="h-4 w-4" />
              {showDetails ? 'Ocultar' : 'Mostrar'} detalhes técnicos
            </button>
            
            {showDetails && (
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32 border">
                <code>{errorInfo.componentStack}</code>
              </pre>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onReset}
            variant="default"
            className="flex items-center gap-2 flex-1"
          >
            <RefreshCw className="h-4 w-4" />
            Recarregar Step
          </Button>

          {onSkip && (
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex items-center gap-2 flex-1"
            >
              <SkipForward className="h-4 w-4" />
              Ir para Próximo Step
            </Button>
          )}
        </div>

        {/* Dicas */}
        <div className="mt-4 p-3 bg-muted/50 rounded text-xs text-muted-foreground">
          <p className="font-medium mb-1">💡 Dicas:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Seu progresso nos outros steps está salvo</li>
            <li>Tente recarregar este step para resolver o problema</li>
            <li>Se o erro persistir, pule para o próximo step</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Boundary para steps individuais
 */
export class StepErrorBoundary extends Component<
  StepErrorBoundaryProps,
  StepErrorBoundaryState
> {
  constructor(props: StepErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<StepErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log do erro
    appLogger.error(
      `[StepErrorBoundary] Erro capturado no step ${this.props.stepKey}:`,
      error,
      { data: [{ errorInfo, stepKey: this.props.stepKey }] }
    );

    // Atualizar estado com informações do erro
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Notificar Sentry/Analytics (se configurado)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          component: 'StepErrorBoundary',
          stepKey: this.props.stepKey,
          stepNumber: this.props.stepNumber,
        },
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleReset = () => {
    // Resetar estado do error boundary
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      // Manter errorCount para tracking
    });

    // Callback customizado
    if (this.props.onReset) {
      this.props.onReset();
    }

    appLogger.info(`[StepErrorBoundary] Step ${this.props.stepKey} resetado`);
  };

  handleSkip = () => {
    // Resetar erro
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Callback para pular step
    if (this.props.onSkip) {
      this.props.onSkip();
    }

    appLogger.info(`[StepErrorBoundary] Step ${this.props.stepKey} pulado`);
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallbackComponent || DefaultStepErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          stepKey={this.props.stepKey}
          stepNumber={this.props.stepNumber}
          errorCount={this.state.errorCount}
          onReset={this.handleReset}
          onSkip={this.props.onSkip ? this.handleSkip : undefined}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar StepErrorBoundary de forma mais fácil
 */
export function useStepErrorBoundary(stepKey: string) {
  const [errorCount, setErrorCount] = React.useState(0);

  const onReset = React.useCallback(() => {
    setErrorCount(prev => prev + 1);
  }, []);

  return { errorCount, onReset };
}

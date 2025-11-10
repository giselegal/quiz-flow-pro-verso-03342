/**
 * 🛡️ COLUMN ERROR BOUNDARY - Erro isolado por coluna do editor
 * 
 * Previne que um erro em uma coluna (Canvas, Properties, etc) trave outras colunas.
 * Permite que o usuário:
 * - Continue usando outras colunas
 * - Recarregue apenas a coluna problemática
 * - Mantenha workflow ativo
 * 
 * ANTES: Erro no PropertyPanel → Editor inteiro inutilizável ❌
 * DEPOIS: Erro no PropertyPanel → Canvas e Navigator continuam funcionando ✅
 */

import React, { Component, ReactNode } from 'react';
import { Layout, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appLogger } from '@/lib/utils/appLogger';

type ColumnType = 'navigator' | 'library' | 'canvas' | 'properties';

interface ColumnErrorBoundaryProps {
  children: ReactNode;
  columnType: ColumnType;
  columnLabel?: string;
  onReset?: () => void;
  fallbackComponent?: React.ComponentType<ColumnErrorFallbackProps>;
}

interface ColumnErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ColumnErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  columnType: ColumnType;
  columnLabel?: string;
  onReset: () => void;
}

/**
 * Labels amigáveis para cada coluna
 */
const COLUMN_LABELS: Record<ColumnType, string> = {
  navigator: 'Navegador de Steps',
  library: 'Biblioteca de Componentes',
  canvas: 'Canvas de Edição',
  properties: 'Painel de Propriedades',
};

/**
 * Fallback para erros de coluna
 */
function DefaultColumnErrorFallback({
  error,
  columnType,
  columnLabel,
  onReset,
}: ColumnErrorFallbackProps) {
  const label = columnLabel || COLUMN_LABELS[columnType];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 bg-muted/30">
      <div className="max-w-sm text-center">
        {/* Ícone */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <Layout className="h-8 w-8 text-destructive" />
        </div>

        {/* Título */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Erro na Coluna
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          {label}
        </p>

        {/* Mensagem de erro */}
        <div className="my-4 p-3 bg-background border border-destructive/20 rounded text-left">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-muted-foreground">
              {error.message || 'Erro desconhecido'}
            </p>
          </div>
        </div>

        {/* Botão de reset */}
        <Button
          onClick={onReset}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Recarregar Coluna
        </Button>

        {/* Mensagem de suporte */}
        <p className="text-xs text-muted-foreground mt-4">
          As outras colunas continuam funcionando normalmente
        </p>
      </div>
    </div>
  );
}

/**
 * Error Boundary para colunas do editor
 */
export class ColumnErrorBoundary extends Component<
  ColumnErrorBoundaryProps,
  ColumnErrorBoundaryState
> {
  constructor(props: ColumnErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ColumnErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const columnLabel = this.props.columnLabel || COLUMN_LABELS[this.props.columnType];

    appLogger.error(
      `[ColumnErrorBoundary] Erro na coluna ${columnLabel}:`,
      error,
      { data: [{ errorInfo, columnType: this.props.columnType }] }
    );

    this.setState({ errorInfo });

    // Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          component: 'ColumnErrorBoundary',
          columnType: this.props.columnType,
          columnLabel,
        },
        level: 'error',
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }

    appLogger.info(
      `[ColumnErrorBoundary] Coluna ${this.props.columnType} resetada`
    );
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallbackComponent || DefaultColumnErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          columnType={this.props.columnType}
          columnLabel={this.props.columnLabel}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * HOC para adicionar ColumnErrorBoundary facilmente
 */
export function withColumnErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  columnType: ColumnType,
  columnLabel?: string
) {
  return function WrappedWithColumnError(props: P) {
    return (
      <ColumnErrorBoundary columnType={columnType} columnLabel={columnLabel}>
        <Component {...props} />
      </ColumnErrorBoundary>
    );
  };
}

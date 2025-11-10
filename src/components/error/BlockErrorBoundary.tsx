/**
 * 🛡️ BLOCK ERROR BOUNDARY - Erro isolado por bloco
 * 
 * Previne que um erro em um bloco específico trave o step inteiro.
 * Permite que o usuário:
 * - Continue editando outros blocos no mesmo step
 * - Remova o bloco problemático
 * - Substitua por outro bloco
 * 
 * ANTES: Erro em bloco de imagem → Step inteiro trava ❌
 * DEPOIS: Erro em bloco de imagem → Apenas bloco mostra erro, resto funciona ✅
 */

import React, { Component, ReactNode } from 'react';
import { AlertCircle, Trash2, RefreshCw, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appLogger } from '@/lib/utils/appLogger';

interface BlockErrorBoundaryProps {
  children: ReactNode;
  blockId: string;
  blockType?: string;
  onRemove?: () => void;
  onReset?: () => void;
  onDuplicate?: () => void;
  fallbackComponent?: React.ComponentType<BlockErrorFallbackProps>;
}

interface BlockErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface BlockErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  blockId: string;
  blockType?: string;
  onRemove?: () => void;
  onReset: () => void;
  onDuplicate?: () => void;
}

/**
 * Fallback minimalista para erros de bloco
 */
function DefaultBlockErrorFallback({
  error,
  blockId,
  blockType,
  onRemove,
  onReset,
  onDuplicate,
}: BlockErrorFallbackProps) {
  return (
    <div className="relative border-2 border-dashed border-destructive/50 rounded-lg p-4 bg-destructive/5 my-2">
      {/* Badge de tipo de bloco */}
      {blockType && (
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded">
            {blockType}
          </span>
        </div>
      )}

      {/* Ícone e mensagem */}
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-1">
            Erro ao renderizar bloco
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate mb-3">
            {error.message || 'Erro desconhecido'}
          </p>

          {/* Ações compactas */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onReset}
              size="sm"
              variant="outline"
              className="h-7 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Recarregar
            </Button>

            {onRemove && (
              <Button
                onClick={onRemove}
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remover
              </Button>
            )}

            {onDuplicate && (
              <Button
                onClick={onDuplicate}
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Duplicar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ID do bloco (debug) */}
      <div className="mt-2 text-[10px] text-muted-foreground/60 font-mono">
        ID: {blockId.substring(0, 8)}...
      </div>
    </div>
  );
}

/**
 * Error Boundary para blocos individuais
 */
export class BlockErrorBoundary extends Component<
  BlockErrorBoundaryProps,
  BlockErrorBoundaryState
> {
  constructor(props: BlockErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<BlockErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log compacto
    appLogger.error(
      `[BlockErrorBoundary] Erro no bloco ${this.props.blockId} (${this.props.blockType}):`,
      error
    );

    this.setState({ errorInfo });

    // Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          component: 'BlockErrorBoundary',
          blockId: this.props.blockId,
          blockType: this.props.blockType,
        },
        level: 'warning', // Menos crítico que erro de step
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

    appLogger.info(`[BlockErrorBoundary] Bloco ${this.props.blockId} resetado`);
  };

  handleRemove = () => {
    if (this.props.onRemove) {
      this.props.onRemove();
      appLogger.info(`[BlockErrorBoundary] Bloco ${this.props.blockId} removido`);
    }
  };

  handleDuplicate = () => {
    // Resetar erro antes de duplicar
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onDuplicate) {
      this.props.onDuplicate();
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallbackComponent || DefaultBlockErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          blockId={this.props.blockId}
          blockType={this.props.blockType}
          onRemove={this.props.onRemove}
          onReset={this.handleReset}
          onDuplicate={this.props.onDuplicate ? this.handleDuplicate : undefined}
        />
      );
    }

    return this.props.children;
  }
}

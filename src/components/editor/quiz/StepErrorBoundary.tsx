/**
 * 🛡️ STEP ERROR BOUNDARY - FASE 3
 * 
 * Error boundary robusto para steps que:
 * - Captura erros de renderização
 * - Fornece UI de recuperação
 * - Permite reset sem recarregar página
 * - Exibe detalhes em dev mode
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  stepId: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class StepErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`❌ Step ${this.props.stepId} crashed:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
          <div className="bg-card p-8 rounded-lg shadow-lg max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Erro ao Carregar Step</h2>
            <p className="text-muted-foreground mb-6">
              Ocorreu um erro ao renderizar este step. Tente recarregar ou entre em contato com suporte.
            </p>
            <div className="space-y-2">
              <Button onClick={this.handleReset} className="w-full">
                Tentar Novamente
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Recarregar Página
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left text-sm">
                <summary className="cursor-pointer text-muted-foreground">
                  Detalhes do Erro (Dev Mode)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default StepErrorBoundary;

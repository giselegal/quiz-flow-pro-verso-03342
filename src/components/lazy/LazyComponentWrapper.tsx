import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { appLogger } from '@/lib/utils/appLogger';

export interface LazyComponentWrapperProps {
  fallback?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
}

// Fallback genérico para componentes lazy
export const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground">Carregando componente...</p>
    </div>
  </div>
);

// Error Boundary para componentes lazy
export class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    appLogger.error('[LazyComponent] Error loading component:', { data: [error, errorInfo] });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <p className="text-destructive">Erro ao carregar componente</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Exporta apenas componentes; utilitários movidos para arquivos dedicados

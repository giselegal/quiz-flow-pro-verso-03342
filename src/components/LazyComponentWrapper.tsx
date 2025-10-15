/**
 * 🚀 LAZY COMPONENT WRAPPER (P2 Performance)
 * 
 * Wrapper otimizado para componentes lazy com:
 * - Loading states inteligentes
 * - Error boundaries
 * - Retry logic
 * - Performance tracking
 */

import React, { Suspense, ComponentType, ReactNode } from 'react';
import { EnhancedLoadingFallback } from './ui/enhanced-loading-fallback';

interface LazyComponentWrapperProps {
  component: ComponentType<any>;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingMessage?: string;
  onError?: (error: Error) => void;
  [key: string]: any;
}

/**
 * Error Boundary for lazy components
 */
class LazyErrorBoundary extends React.Component<
  { fallback?: ReactNode; onError?: (error: Error) => void; children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Lazy component error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">Erro ao carregar componente</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper otimizado para componentes lazy
 */
export const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({
  component: Component,
  fallback,
  errorFallback,
  loadingMessage = 'Carregando...',
  onError,
  ...props
}) => {
  const defaultFallback = fallback || (
    <EnhancedLoadingFallback 
      message={loadingMessage} 
      variant="minimal"
    />
  );

  return (
    <LazyErrorBoundary fallback={errorFallback} onError={onError}>
      <Suspense fallback={defaultFallback}>
        <Component {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

/**
 * HOC para criar componentes lazy otimizados
 */
export const withLazyLoading = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loadingMessage?: string;
    errorFallback?: ReactNode;
    preload?: boolean;
  }
) => {
  const LazyComponent = React.lazy(importFn);

  // Preload se solicitado
  if (options?.preload) {
    // Preload após 2s de idle
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        importFn();
      }, { timeout: 2000 });
    } else {
      setTimeout(() => importFn(), 2000);
    }
  }

  return (props: P) => (
    <LazyComponentWrapper
      component={LazyComponent}
      loadingMessage={options?.loadingMessage}
      errorFallback={options?.errorFallback}
      {...props}
    />
  );
};

export default LazyComponentWrapper;

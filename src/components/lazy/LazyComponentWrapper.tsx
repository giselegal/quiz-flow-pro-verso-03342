import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface LazyComponentWrapperProps {
  fallback?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
}

// Fallback genérico para componentes lazy
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground">Carregando componente...</p>
    </div>
  </div>
);

// Error Boundary para componentes lazy
class LazyErrorBoundary extends React.Component<
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
    console.error('[LazyComponent] Error loading component:', error, errorInfo);
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

// Factory para criar componentes lazy otimizados
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentWrapperProps = {}
) => {
  const LazyComponent = lazy(importFn);

  const LazyWrapper = (props: React.ComponentProps<T>) => (
    <LazyErrorBoundary fallback={options.error}>
      <Suspense fallback={options.fallback || <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );

  return LazyWrapper;
};

// Hook para lazy loading com intersection observer
export const useLazyLoad = (threshold = 0.1) => {
  const { createIntersectionObserver } = usePerformanceOptimization();
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = createIntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [createIntersectionObserver, threshold]);

  return { ref, isVisible };
};

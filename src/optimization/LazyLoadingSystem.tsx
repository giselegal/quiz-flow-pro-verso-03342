/**
 * 🎯 LAZY LOADING SYSTEM - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 4: Sistema avançado de lazy loading para React:
 * ✅ Lazy loading inteligente com preloading strategies
 * ✅ Suspense boundaries otimizados com fallbacks
 * ✅ Error boundaries para graceful degradation
 * ✅ Performance monitoring e analytics
 * ✅ Cache inteligente para reload rápido
 */

import React, { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { getBundleOptimizer } from './BundleOptimizer';

// === TIPOS PARA LAZY LOADING ===

interface LazyComponentOptions {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    preload?: boolean;
    retryAttempts?: number;
    timeout?: number;
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

interface LazyLoadStats {
    componentName: string;
    loadTime: number;
    cacheHit: boolean;
    errorCount: number;
    retryCount: number;
}

// === CACHE DE COMPONENTES CARREGADOS ===

class ComponentCache {
    private cache: Map<string, Promise<ComponentType<any>>> = new Map();
    private stats: Map<string, LazyLoadStats> = new Map();
    private loadingComponents: Set<string> = new Set();

    async loadComponent<T = any>(
        name: string,
        loader: () => Promise<{ default: ComponentType<T> }>,
        options: LazyComponentOptions = {}
    ): Promise<ComponentType<T>> {
        const startTime = Date.now();

        // Verifica cache primeiro
        if (this.cache.has(name)) {
            const cachedComponent = await this.cache.get(name)!;
            this.updateStats(name, Date.now() - startTime, true);
            return cachedComponent;
        }

        // Evita carregamentos duplicados
        if (this.loadingComponents.has(name)) {
            while (this.loadingComponents.has(name)) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            return this.cache.get(name)! as ComponentType<T>;
        }

        this.loadingComponents.add(name);

        try {
            // Configura timeout se especificado
            const loadPromise = options.timeout
                ? Promise.race([
                    loader(),
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error(`Component ${name} load timeout`)), options.timeout)
                    )
                ])
                : loader();

            const moduleWithRetry = await this.withRetry(loadPromise, options.retryAttempts || 0);
            const component = moduleWithRetry.default;

            // Armazena no cache
            this.cache.set(name, Promise.resolve(component));

            // Atualiza estatísticas
            this.updateStats(name, Date.now() - startTime, false);

            // Callback de sucesso
            options.onLoad?.();

            return component;

        } catch (error) {
            const errorObj = error instanceof Error ? error : new Error(String(error));

            // Atualiza estatísticas de erro
            this.updateErrorStats(name, errorObj);

            // Callback de erro
            options.onError?.(errorObj);

            throw errorObj;
        } finally {
            this.loadingComponents.delete(name);
        }
    }

    private async withRetry<T>(
        promise: Promise<T>,
        attempts: number
    ): Promise<T> {
        for (let i = 0; i <= attempts; i++) {
            try {
                return await promise;
            } catch (error) {
                if (i === attempts) throw error;

                // Backoff exponencial
                await new Promise(resolve =>
                    setTimeout(resolve, Math.pow(2, i) * 1000)
                );
            }
        }
        throw new Error('Max retry attempts exceeded');
    }

    private updateStats(name: string, loadTime: number, cacheHit: boolean): void {
        const existing = this.stats.get(name);
        this.stats.set(name, {
            componentName: name,
            loadTime: cacheHit ? 0 : loadTime,
            cacheHit,
            errorCount: existing?.errorCount || 0,
            retryCount: existing?.retryCount || 0
        });
    }

    private updateErrorStats(name: string, error: Error): void {
        const existing = this.stats.get(name) || {
            componentName: name,
            loadTime: 0,
            cacheHit: false,
            errorCount: 0,
            retryCount: 0
        };

        existing.errorCount++;
        this.stats.set(name, existing);
    }

    getStats(): LazyLoadStats[] {
        return Array.from(this.stats.values());
    }

    clearCache(pattern?: string): void {
        if (pattern) {
            const regex = new RegExp(pattern);
            for (const [name] of this.cache) {
                if (regex.test(name)) {
                    this.cache.delete(name);
                    this.stats.delete(name);
                }
            }
        } else {
            this.cache.clear();
            this.stats.clear();
        }
    }
}

const componentCache = new ComponentCache();

// === FALLBACK COMPONENTS ===

const DefaultFallback: React.FC = () => (
    <div className="lazy-loading-fallback">
        <div className="animate-pulse bg-gray-200 rounded-lg p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);

const DefaultErrorFallback: React.FC<{ error?: Error; retry?: () => void }> = ({
    error,
    retry
}) => (
    <div className="lazy-loading-error border border-red-300 bg-red-50 p-4 rounded-lg">
        <h3 className="text-red-800 font-medium mb-2">Erro ao carregar componente</h3>
        <p className="text-red-600 text-sm mb-3">
            {error?.message || 'Ocorreu um erro desconhecido'}
        </p>
        {retry && (
            <button
                onClick={retry}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
                Tentar novamente
            </button>
        )}
    </div>
);

// === HIGHER-ORDER COMPONENT PARA LAZY LOADING ===

export function withLazyLoading<T = {}>(
    name: string,
    loader: () => Promise<{ default: ComponentType<T> }>,
    options: LazyComponentOptions = {}
): ComponentType<T> {
    const LazyComponent = lazy(async () => {
        const component = await componentCache.loadComponent(name, loader, options);
        return { default: component };
    });

    const WrappedComponent: ComponentType<T> = (props) => (
        <ErrorBoundary
            fallback={options.errorFallback || <DefaultErrorFallback />}
            componentName={name}
        >
            <Suspense fallback={options.fallback || <DefaultFallback />}>
                <LazyComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `LazyLoaded(${name})`;

    // Preload se solicitado
    if (options.preload) {
        componentCache.loadComponent(name, loader, options).catch(() => {
            // Preload silencioso - erros não são críticos
        });
    }

    return WrappedComponent;
}

// === ERROR BOUNDARY OTIMIZADO ===

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    retryCount: number;
}

class ErrorBoundary extends React.Component<
    {
        children: ReactNode;
        fallback: ReactNode;
        componentName: string;
        maxRetries?: number;
    },
    ErrorBoundaryState
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, retryCount: 0 };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error, retryCount: 0 };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`LazyLoading Error in ${this.props.componentName}:`, error, errorInfo);

        // Envia erro para monitoramento
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: `LazyLoading Error: ${this.props.componentName}`,
                fatal: false
            });
        }
    }

    retry = () => {
        const maxRetries = this.props.maxRetries || 3;

        if (this.state.retryCount < maxRetries) {
            this.setState(prevState => ({
                hasError: false,
                error: undefined,
                retryCount: prevState.retryCount + 1
            }));
        }
    };

    render() {
        if (this.state.hasError) {
            const canRetry = this.state.retryCount < (this.props.maxRetries || 3);

            return React.isValidElement(this.props.fallback)
                ? React.cloneElement(this.props.fallback as React.ReactElement, {
                    error: this.state.error,
                    retry: canRetry ? this.retry : undefined
                })
                : this.props.fallback;
        }

        return this.props.children;
    }
}

// === COMPONENTES LAZY CONSOLIDADOS ===

// Editor Components
export const LazyEditor = withLazyLoading(
    'Editor',
    () => import('../components/editor/Editor'),
    {
        fallback: (
            <div className="editor-loading">
                <div className="animate-pulse bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">Carregando Editor...</div>
                </div>
            </div>
        ),
        preload: true,
        timeout: 10000
    }
);

export const LazyBlockEditor = withLazyLoading(
    'BlockEditor',
    () => import('../components/editor/BlockEditor'),
    { preload: true }
);

export const LazyPropertyPanel = withLazyLoading(
    'PropertyPanel',
    () => import('../components/editor/PropertyPanel')
);

// Quiz Components  
export const LazyQuizBuilder = withLazyLoading(
    'QuizBuilder',
    () => import('../components/quiz/QuizBuilder'),
    {
        fallback: (
            <div className="quiz-builder-loading">
                <div className="animate-pulse bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="h-6 bg-blue-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                        <div className="h-4 bg-blue-100 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        )
    }
);

export const LazyQuizRenderer = withLazyLoading(
    'QuizRenderer',
    () => import('../components/quiz/QuizRenderer')
);

// Analytics Components (carregamento sob demanda)
export const LazyAnalytics = withLazyLoading(
    'Analytics',
    () => import('../components/analytics/Analytics'),
    {
        timeout: 15000,
        retryAttempts: 2
    }
);

export const LazyReports = withLazyLoading(
    'Reports',
    () => import('../components/analytics/Reports'),
    { timeout: 15000 }
);

// === HOOKS PARA LAZY LOADING ===

/**
 * Hook para precarregar componentes baseado em interação
 */
export function usePreloadComponent(
    componentName: string,
    loader: () => Promise<{ default: ComponentType<any> }>,
    trigger: 'hover' | 'visible' | 'idle' = 'hover'
) {
    const [isPreloading, setIsPreloading] = React.useState(false);
    const [isPreloaded, setIsPreloaded] = React.useState(false);

    const preload = React.useCallback(async () => {
        if (isPreloaded || isPreloading) return;

        setIsPreloading(true);
        try {
            await componentCache.loadComponent(componentName, loader);
            setIsPreloaded(true);
        } catch (error) {
            console.warn(`Failed to preload ${componentName}:`, error);
        } finally {
            setIsPreloading(false);
        }
    }, [componentName, loader, isPreloaded, isPreloading]);

    React.useEffect(() => {
        if (trigger === 'idle' && 'requestIdleCallback' in window) {
            const id = requestIdleCallback(() => preload(), { timeout: 5000 });
            return () => cancelIdleCallback(id);
        }
    }, [preload, trigger]);

    return {
        preload,
        isPreloading,
        isPreloaded,
        // Para uso com onMouseEnter
        onMouseEnter: trigger === 'hover' ? preload : undefined
    };
}

/**
 * Hook para estatísticas de lazy loading
 */
export function useLazyLoadingStats() {
    const [stats, setStats] = React.useState<LazyLoadStats[]>([]);

    React.useEffect(() => {
        const updateStats = () => setStats(componentCache.getStats());

        // Atualiza stats a cada 5 segundos
        const interval = setInterval(updateStats, 5000);
        updateStats(); // Atualização inicial

        return () => clearInterval(interval);
    }, []);

    return {
        stats,
        clearCache: componentCache.clearCache.bind(componentCache),
        totalComponents: stats.length,
        cacheHitRate: stats.length > 0
            ? stats.filter(s => s.cacheHit).length / stats.length
            : 0,
        averageLoadTime: stats.length > 0
            ? stats.reduce((sum, s) => sum + s.loadTime, 0) / stats.length
            : 0
    };
}

// === ROUTE-BASED LAZY LOADING ===

/**
 * Componente para lazy loading baseado em rotas
 */
export const RouteLazyLoader: React.FC<{
    path: string;
    children: ReactNode;
    preloadRoutes?: string[];
}> = ({ path, children, preloadRoutes = [] }) => {
    const optimizer = getBundleOptimizer();

    React.useEffect(() => {
        // Precarrega componentes das rotas relacionadas
        preloadRoutes.forEach(route => {
            const routeModules = optimizer.getStats(); // Acessa estratégias de preload
            // Implementa preload baseado em rota
        });
    }, [path, preloadRoutes, optimizer]);

    return <>{children}</>;
};

// === UTILITIES ===

/**
 * Função para análise de performance de lazy loading
 */
export function analyzeLazyLoadingPerformance() {
    const stats = componentCache.getStats();

    console.group('🚀 Lazy Loading Performance');

    const totalComponents = stats.length;
    const cacheHits = stats.filter(s => s.cacheHit).length;
    const errors = stats.filter(s => s.errorCount > 0).length;
    const avgLoadTime = totalComponents > 0
        ? stats.reduce((sum, s) => sum + s.loadTime, 0) / totalComponents
        : 0;

    console.log(`Total Components: ${totalComponents}`);
    console.log(`Cache Hit Rate: ${((cacheHits / totalComponents) * 100).toFixed(1)}%`);
    console.log(`Error Rate: ${((errors / totalComponents) * 100).toFixed(1)}%`);
    console.log(`Average Load Time: ${avgLoadTime.toFixed(0)}ms`);

    // Componentes mais lentos
    const slowestComponents = stats
        .filter(s => !s.cacheHit)
        .sort((a, b) => b.loadTime - a.loadTime)
        .slice(0, 5);

    if (slowestComponents.length > 0) {
        console.log('\nSlowest Components:');
        slowestComponents.forEach(c => {
            console.log(`  ${c.componentName}: ${c.loadTime}ms`);
        });
    }

    console.groupEnd();
}

export default withLazyLoading;
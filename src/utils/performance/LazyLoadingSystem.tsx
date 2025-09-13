// @ts-nocheck
/**
 * 🚀 LAZY LOADING OPTIMIZATION SYSTEM
 * 
 * Sistema inteligente de lazy loading para componentes pesados do editor
 * com preloading, cache e fallbacks otimizados
 */

import React, { Suspense, useEffect, useRef, useState, ComponentType, LazyExoticComponent } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Tipos para configuração do lazy loading
interface LazyComponentConfig {
    chunkName?: string;
    preload?: boolean;
    preloadDelay?: number;
    fallback?: React.ComponentType;
    timeout?: number;
    retryAttempts?: number;
    criticalPath?: boolean;
}

interface LazyLoadingOptions {
    loadingComponent?: React.ComponentType;
    errorComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: Error) => void;
}

// Cache global para componentes carregados
const componentCache = new Map<string, LazyExoticComponent<any>>();
const preloadCache = new Map<string, Promise<any>>();

// Classe para gerenciar lazy loading inteligente
class LazyLoadingManager {
    private static instance: LazyLoadingManager;
    private intersectionObserver?: IntersectionObserver;
    private preloadQueue: Set<string> = new Set();
    private loadingStates = new Map<string, boolean>();

    static getInstance(): LazyLoadingManager {
        if (!LazyLoadingManager.instance) {
            LazyLoadingManager.instance = new LazyLoadingManager();
        }
        return LazyLoadingManager.instance;
    }

    constructor() {
        // Setup do Intersection Observer para preloading inteligente
        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const componentPath = entry.target.getAttribute('data-lazy-component');
                            if (componentPath && !this.loadingStates.get(componentPath)) {
                                this.preloadComponent(componentPath);
                            }
                        }
                    });
                },
                { rootMargin: '50px' } // Preload 50px antes de aparecer
            );
        }
    }

    observeForPreloading(element: Element, componentPath: string) {
        if (this.intersectionObserver) {
            element.setAttribute('data-lazy-component', componentPath);
            this.intersectionObserver.observe(element);
        }
    }

    unobserve(element: Element) {
        if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(element);
        }
    }

    async preloadComponent(componentPath: string): Promise<void> {
        if (preloadCache.has(componentPath) || this.loadingStates.get(componentPath)) {
            return preloadCache.get(componentPath);
        }

        this.loadingStates.set(componentPath, true);

        try {
            console.log(`🔄 Preloading component: ${componentPath}`);
            const preloadPromise = this.importComponent(componentPath);
            preloadCache.set(componentPath, preloadPromise);
            await preloadPromise;
            console.log(`✅ Preloaded component: ${componentPath}`);
        } catch (error) {
            console.error(`❌ Failed to preload component: ${componentPath}`, error);
            preloadCache.delete(componentPath);
        } finally {
            this.loadingStates.set(componentPath, false);
        }
    }

    private async importComponent(componentPath: string): Promise<any> {
        // Mapeamento dinâmico de imports baseado no path
        switch (componentPath) {
            case '@/components/editor/EnhancedComponentsSidebar':
                return import('@/components/editor/EnhancedComponentsSidebar');
            case '@/components/editor/ReusableComponentsPanel':
                return import('@/components/editor/ReusableComponentsPanel');
            case '@/components/editor/CombinedComponentsPanel':
                return import('@/components/editor/CombinedComponentsPanel');
            case '@/components/editor/PageEditorCanvas':
                return import('@/components/editor/PageEditorCanvas');
            case '@/components/editor/interactive/InteractiveQuizCanvas':
                return import('@/components/editor/interactive/InteractiveQuizCanvas');
            case '@/legacy/editor/EditorPro':
                return import('@/legacy/editor/EditorPro');
            case '@/components/editor/SchemaDrivenEditorResponsive':
                return import('@/components/editor/SchemaDrivenEditorResponsive');
            default:
                throw new Error(`Unknown component path: ${componentPath}`);
        }
    }

    createLazyComponent<P = {}>(
        componentPath: string,
        config: LazyComponentConfig = {}
    ): LazyExoticComponent<ComponentType<P>> {
        const cacheKey = `${componentPath}_${config.chunkName || 'default'}`;

        if (componentCache.has(cacheKey)) {
            return componentCache.get(cacheKey)!;
        }

        const lazyComponent = React.lazy(async () => {
            const maxRetries = config.retryAttempts || 3;
            let attempt = 0;

            while (attempt < maxRetries) {
                try {
                    console.log(`📦 Loading component: ${componentPath} (attempt ${attempt + 1})`);
                    const startTime = performance.now();

                    // Timeout protection
                    const importPromise = this.importComponent(componentPath);
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Import timeout')), config.timeout || 10000);
                    });

                    const module = await Promise.race([importPromise, timeoutPromise]);
                    const loadTime = performance.now() - startTime;

                    console.log(`✅ Loaded component: ${componentPath} in ${loadTime.toFixed(2)}ms`);

                    // Performance warning
                    if (loadTime > 1000) {
                        console.warn(`🐌 Slow component load: ${componentPath} took ${loadTime.toFixed(2)}ms`);
                    }

                    return {
                        default: module.default || module[Object.keys(module)[0]]
                    };
                } catch (error) {
                    attempt++;
                    console.error(`❌ Failed to load component: ${componentPath} (attempt ${attempt})`, error);

                    if (attempt >= maxRetries) {
                        throw new Error(`Failed to load component after ${maxRetries} attempts: ${error}`);
                    }

                    // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }

            throw new Error('Max retries exceeded');
        });

        componentCache.set(cacheKey, lazyComponent);
        return lazyComponent;
    }

    // Preload crítico para componentes essenciais
    async preloadCriticalComponents(): Promise<void> {
        const criticalComponents = [
            '@/components/editor/EnhancedComponentsSidebar',
            '@/components/editor/PageEditorCanvas',
            '@/components/editor/UniversalBlockRenderer'
        ];

        console.log('🚀 Preloading critical components...');
        const preloadPromises = criticalComponents.map(path =>
            this.preloadComponent(path).catch(err =>
                console.error(`Failed to preload critical component: ${path}`, err)
            )
        );

        await Promise.allSettled(preloadPromises);
        console.log('✅ Critical components preloaded');
    }

    // Preload baseado em rotas
    async preloadForRoute(route: string): Promise<void> {
        const routeComponents: Record<string, string[]> = {
            '/editor': [
                '@/components/editor/EnhancedComponentsSidebar',
                '@/components/editor/PageEditorCanvas',
                '@/components/editor/CombinedComponentsPanel'
            ],
            '/editor-interactive': [
                '@/components/editor/interactive/InteractiveQuizCanvas',
                '@/components/editor/ReusableComponentsPanel'
            ]
        };

        const componentsToPreload = routeComponents[route] || [];
        if (componentsToPreload.length > 0) {
            console.log(`🛣️ Preloading components for route: ${route}`);
            await Promise.allSettled(
                componentsToPreload.map(path => this.preloadComponent(path))
            );
        }
    }
}

// Singleton instance
export const lazyLoadingManager = LazyLoadingManager.getInstance();

// Hook para usar lazy loading com performance otimizada
export const useLazyComponent = <P = {}>(
    componentPath: string,
    config: LazyComponentConfig & LazyLoadingOptions = {}
) => {
    const [error, setError] = useState<Error | null>(null);
    const retryCountRef = useRef(0);

    const LazyComponent = lazyLoadingManager.createLazyComponent<P>(componentPath, config);

    // Preload automático se configurado
    useEffect(() => {
        if (config.preload) {
            const delay = config.preloadDelay || 0;
            const timer = setTimeout(() => {
                lazyLoadingManager.preloadComponent(componentPath);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [componentPath, config.preload, config.preloadDelay]);

    const retry = () => {
        setError(null);
        retryCountRef.current++;
        // Force re-creation of lazy component
        const cacheKey = `${componentPath}_${config.chunkName || 'default'}`;
        componentCache.delete(cacheKey);
        window.location.reload(); // Last resort for retry
    };

    const LoadingComponent = config.loadingComponent || (() => (
        <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="md" />
            <span className="ml-2 text-sm text-gray-600">Carregando componente...</span>
        </div>
    ));

    const ErrorComponent = config.errorComponent || (({ error, retry }) => (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar Componente</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
                Falha ao carregar: {error.message}
            </p>
            <button
                onClick={retry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Tentar Novamente
            </button>
        </div>
    ));

    const WrappedComponent: React.FC<P> = (props) => (
        <Suspense fallback={<LoadingComponent />}>
            <LazyComponent {...props} />
        </Suspense>
    );

    return {
        Component: error ? () => <ErrorComponent error={error} retry={retry} /> : WrappedComponent,
        error,
        retry
    };
};

// Hook para preloading inteligente baseado em viewport
export const useViewportPreloading = (
    componentPath: string,
    threshold = 0.1
) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        lazyLoadingManager.observeForPreloading(element, componentPath);

        return () => {
            if (element) {
                lazyLoadingManager.unobserve(element);
            }
        };
    }, [componentPath]);

    return elementRef;
};

// Componente HOC para lazy loading automático
export const LazyWrapper = <P extends object>({
    componentPath,
    fallback,
    children,
    ...config
}: {
    componentPath: string;
    fallback?: React.ComponentType;
    children?: React.ReactNode;
} & LazyComponentConfig) => {
    const { Component, error } = useLazyComponent(componentPath, {
        ...config,
        loadingComponent: fallback
    });

    return (
        <div data-lazy-wrapper={componentPath}>
            <Component />
            {children}
        </div>
    );
};

// Presets para componentes específicos do editor
export const EditorLazyComponents = {
    // Componentes críticos - preload imediato
    EnhancedComponentsSidebar: lazyLoadingManager.createLazyComponent(
        '@/components/editor/EnhancedComponentsSidebar',
        { preload: true, criticalPath: true }
    ),

    PageEditorCanvas: lazyLoadingManager.createLazyComponent(
        '@/components/editor/PageEditorCanvas',
        { preload: true, criticalPath: true }
    ),

    // Componentes secundários - lazy load sob demanda
    ReusableComponentsPanel: lazyLoadingManager.createLazyComponent(
        '@/components/editor/ReusableComponentsPanel',
        { preloadDelay: 2000 }
    ),

    CombinedComponentsPanel: lazyLoadingManager.createLazyComponent(
        '@/components/editor/CombinedComponentsPanel',
        { preloadDelay: 1000 }
    ),

    // Componentes pesados - lazy load com timeout otimizado  
    InteractiveQuizCanvas: lazyLoadingManager.createLazyComponent(
        '@/components/editor/interactive/InteractiveQuizCanvas',
        { timeout: 15000, retryAttempts: 5 }
    ),

    EditorPro: lazyLoadingManager.createLazyComponent(
        '@/legacy/editor/EditorPro',
        { timeout: 20000, retryAttempts: 3 }
    )
};

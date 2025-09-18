/**
 * 🎯 OPTIMIZATION INDEX - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 4: Sistema unificado de otimização de bundle:
 * ✅ BundleOptimizer - Code splitting inteligente e preloading
 * ✅ LazyLoadingSystem - Lazy loading avançado para React
 * ✅ TreeShakingAnalyzer - Análise de dead code e side effects
 * ✅ Performance monitoring integrado
 * ✅ Meta: Redução 692KB→150KB (-78%)
 */

export {
    BundleOptimizer,
    getBundleOptimizer,
    lazyServices,
    lazyHooks,
    lazyComponents,
    bundleConfig,
    treeShakingConfig,
    loadOptimizedServices
} from './BundleOptimizer';

export {
    withLazyLoading,
    LazyEditor,
    LazyBlockEditor,
    LazyPropertyPanel,
    LazyQuizBuilder,
    LazyQuizRenderer,
    LazyAnalytics,
    LazyReports,
    usePreloadComponent,
    useLazyLoadingStats,
    RouteLazyLoader,
    analyzeLazyLoadingPerformance
} from './LazyLoadingSystem';

export {
    TreeShakingAnalyzer,
    analyzeProjectTreeShaking,
    generateOptimizationReport,
    monitorBundleSize,
    TreeShakingAnalyzerPlugin,
    type TreeShakingReport,
    type OptimizationRecommendation
} from './TreeShakingAnalyzer';

// === SISTEMA UNIFICADO DE OTIMIZAÇÃO ===

interface OptimizationConfig {
    enableLazyLoading: boolean;
    enableCodeSplitting: boolean;
    enableTreeShaking: boolean;
    enablePreloading: boolean;
    enableMonitoring: boolean;
    bundleSizeTarget: number; // em KB
    performanceThresholds: {
        loadTime: number;
        cacheHitRate: number;
        bundleSize: number;
    };
}

interface OptimizationMetrics {
    bundleSize: {
        current: number;
        target: number;
        savings: number;
        percentage: number;
    };
    lazyLoading: {
        componentsLoaded: number;
        cacheHitRate: number;
        averageLoadTime: number;
    };
    treeShaking: {
        unusedModules: number;
        unusedExports: number;
        potentialSavings: number;
    };
    performance: {
        lighthouse: number;
        fcp: number; // First Contentful Paint
        lcp: number; // Largest Contentful Paint
        cls: number; // Cumulative Layout Shift
    };
}

export class UnifiedOptimizationSystem {
    private config: OptimizationConfig;
    private bundleOptimizer: BundleOptimizer;
    private treeShakingAnalyzer: TreeShakingAnalyzer;
    private metricsInterval: NodeJS.Timeout | null = null;
    private performanceObserver: PerformanceObserver | null = null;

    constructor(config?: Partial<OptimizationConfig>) {
        this.config = {
            enableLazyLoading: true,
            enableCodeSplitting: true,
            enableTreeShaking: true,
            enablePreloading: true,
            enableMonitoring: true,
            bundleSizeTarget: 150, // 150KB target
            performanceThresholds: {
                loadTime: 2000, // 2s
                cacheHitRate: 0.8, // 80%
                bundleSize: 150 * 1024 // 150KB
            },
            ...config
        };

        this.bundleOptimizer = getBundleOptimizer();
        this.treeShakingAnalyzer = new TreeShakingAnalyzer();

        this.initializeOptimizations();
    }

    /**
     * Inicializa todas as otimizações
     */
    private initializeOptimizations(): void {
        if (this.config.enableMonitoring) {
            this.startPerformanceMonitoring();
        }

        if (this.config.enableTreeShaking && process.env.NODE_ENV === 'development') {
            this.scheduleTreeShakingAnalysis();
        }

        // Configura alertas de performance
        this.setupPerformanceAlerts();
    }

    /**
     * Inicia monitoramento de performance
     */
    private startPerformanceMonitoring(): void {
        // Monitora métricas a cada 30 segundos
        this.metricsInterval = setInterval(() => {
            this.collectMetrics();
        }, 30000);

        // Performance Observer para Core Web Vitals
        if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
            this.performanceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.handlePerformanceEntry(entry);
                }
            });

            this.performanceObserver.observe({
                entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift']
            });
        }
    }

    /**
     * Agenda análise de tree shaking
     */
    private scheduleTreeShakingAnalysis(): void {
        // Análise inicial após 5 segundos
        setTimeout(async () => {
            try {
                const report = await analyzeProjectTreeShaking();
                this.handleTreeShakingReport(report);
            } catch (error) {
                console.warn('Tree shaking analysis failed:', error);
            }
        }, 5000);

        // Análise periódica a cada 5 minutos em dev
        if (process.env.NODE_ENV === 'development') {
            setInterval(async () => {
                try {
                    const report = await analyzeProjectTreeShaking();
                    this.handleTreeShakingReport(report);
                } catch (error) {
                    console.warn('Periodic tree shaking analysis failed:', error);
                }
            }, 5 * 60 * 1000);
        }
    }

    /**
     * Coleta métricas de otimização
     */
    private async collectMetrics(): Promise<OptimizationMetrics> {
        const bundleStats = this.bundleOptimizer.getBundleStats();
        const lazyStats = useLazyLoadingStats();

        // Estima tamanho atual do bundle
        const currentBundleSize = this.estimateCurrentBundleSize();
        const targetSize = this.config.bundleSizeTarget * 1024;
        const savings = Math.max(0, currentBundleSize - targetSize);

        const metrics: OptimizationMetrics = {
            bundleSize: {
                current: currentBundleSize,
                target: targetSize,
                savings,
                percentage: (savings / currentBundleSize) * 100
            },
            lazyLoading: {
                componentsLoaded: bundleStats.loadedModules,
                cacheHitRate: lazyStats.cacheHitRate,
                averageLoadTime: lazyStats.averageLoadTime
            },
            treeShaking: {
                unusedModules: 0, // Será preenchido pela análise
                unusedExports: 0,
                potentialSavings: 0
            },
            performance: {
                lighthouse: 0, // Seria obtido via Lighthouse API
                fcp: this.getPerformanceMetric('first-contentful-paint'),
                lcp: this.getPerformanceMetric('largest-contentful-paint'),
                cls: this.getCumulativeLayoutShift()
            }
        };

        return metrics;
    }

    /**
     * Estima tamanho atual do bundle
     */
    private estimateCurrentBundleSize(): number {
        if (typeof window === 'undefined') return 0;

        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

        // Estimativa básica baseada no número e tamanho das URLs
        const jsSize = scripts.reduce((total, script: any) => {
            if (script.src.includes('/assets/')) {
                return total + (script.src.length * 100); // Estimativa
            }
            return total;
        }, 0);

        const cssSize = styles.reduce((total, style: any) => {
            if (style.href.includes('/assets/')) {
                return total + (style.href.length * 50); // Estimativa
            }
            return total;
        }, 0);

        return jsSize + cssSize;
    }

    /**
     * Obtém métrica de performance específica
     */
    private getPerformanceMetric(type: string): number {
        if (typeof window === 'undefined') return 0;

        const entries = performance.getEntriesByType('paint');
        const entry = entries.find((entry: any) => entry.name === type);
        return entry ? entry.startTime : 0;
    }

    /**
     * Calcula Cumulative Layout Shift
     */
    private getCumulativeLayoutShift(): number {
        if (typeof window === 'undefined') return 0;

        const entries = performance.getEntriesByType('layout-shift') as any[];
        return entries.reduce((cls, entry) => {
            if (!entry.hadRecentInput) {
                return cls + entry.value;
            }
            return cls;
        }, 0);
    }

    /**
     * Manipula entrada de performance
     */
    private handlePerformanceEntry(entry: PerformanceEntry): void {
        switch (entry.entryType) {
            case 'navigation':
                const navEntry = entry as PerformanceNavigationTiming;
                const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;

                if (loadTime > this.config.performanceThresholds.loadTime) {
                    console.warn(`⚠️ Slow page load detected: ${loadTime.toFixed(0)}ms`);
                }
                break;

            case 'largest-contentful-paint':
                const lcpEntry = entry as any;
                if (lcpEntry.startTime > 2500) { // LCP threshold
                    console.warn(`⚠️ Poor LCP detected: ${lcpEntry.startTime.toFixed(0)}ms`);
                }
                break;
        }
    }

    /**
     * Manipula relatório de tree shaking
     */
    private handleTreeShakingReport(report: TreeShakingReport): void {
        if (report.unusedCode.totalSavings > 10240) { // > 10KB
            console.warn(`🌳 Tree shaking opportunity: ${(report.unusedCode.totalSavings / 1024).toFixed(1)}KB could be saved`);

            // Mostra top 3 recomendações
            report.recommendations.slice(0, 3).forEach(rec => {
                console.log(`💡 ${rec.description} (${(rec.estimatedSavings / 1024).toFixed(1)}KB)`);
            });
        }
    }

    /**
     * Configura alertas de performance
     */
    private setupPerformanceAlerts(): void {
        // Monitora bundle size em tempo real
        const stopMonitoring = monitorBundleSize();

        // Para o monitoramento quando o componente for desmontado
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', stopMonitoring);
        }
    }

    /**
     * Obtém métricas atuais
     */
    async getMetrics(): Promise<OptimizationMetrics> {
        return this.collectMetrics();
    }

    /**
     * Executa otimização completa
     */
    async optimize(): Promise<{
        success: boolean;
        metrics: OptimizationMetrics;
        recommendations: string[];
    }> {
        console.log('🚀 Running complete optimization analysis...');

        const metrics = await this.collectMetrics();
        const recommendations: string[] = [];

        // Analisa bundle size
        if (metrics.bundleSize.current > metrics.bundleSize.target) {
            recommendations.push(`Reduce bundle size by ${(metrics.bundleSize.savings / 1024).toFixed(1)}KB`);
        }

        // Analisa lazy loading
        if (metrics.lazyLoading.cacheHitRate < this.config.performanceThresholds.cacheHitRate) {
            recommendations.push('Improve lazy loading cache hit rate');
        }

        // Analisa performance
        if (metrics.performance.lcp > 2500) {
            recommendations.push('Optimize Largest Contentful Paint (LCP)');
        }

        if (metrics.performance.cls > 0.1) {
            recommendations.push('Reduce Cumulative Layout Shift (CLS)');
        }

        // Executa tree shaking analysis se habilitado
        if (this.config.enableTreeShaking) {
            try {
                const treeShakingReport = await analyzeProjectTreeShaking();
                metrics.treeShaking.unusedModules = treeShakingReport.unusedCode.modules.length;
                metrics.treeShaking.unusedExports = treeShakingReport.unusedCode.exports.length;
                metrics.treeShaking.potentialSavings = treeShakingReport.unusedCode.totalSavings;

                if (treeShakingReport.unusedCode.totalSavings > 5120) { // > 5KB
                    recommendations.push(`Remove unused code to save ${(treeShakingReport.unusedCode.totalSavings / 1024).toFixed(1)}KB`);
                }
            } catch (error) {
                console.warn('Tree shaking analysis failed:', error);
            }
        }

        const success = recommendations.length === 0 ||
            metrics.bundleSize.current <= metrics.bundleSize.target;

        return { success, metrics, recommendations };
    }

    /**
     * Gera relatório de otimização
     */
    async generateReport(): Promise<void> {
        const { success, metrics, recommendations } = await this.optimize();

        console.group('📊 Optimization Report');
        console.log(`Status: ${success ? '✅ Optimized' : '⚠️  Needs Optimization'}`);

        console.group('Bundle Size');
        console.log(`Current: ${(metrics.bundleSize.current / 1024).toFixed(1)}KB`);
        console.log(`Target: ${(metrics.bundleSize.target / 1024).toFixed(1)}KB`);
        console.log(`Progress: ${metrics.bundleSize.percentage.toFixed(1)}% reduction`);
        console.groupEnd();

        console.group('Lazy Loading');
        console.log(`Components loaded: ${metrics.lazyLoading.componentsLoaded}`);
        console.log(`Cache hit rate: ${(metrics.lazyLoading.cacheHitRate * 100).toFixed(1)}%`);
        console.log(`Average load time: ${metrics.lazyLoading.averageLoadTime.toFixed(0)}ms`);
        console.groupEnd();

        console.group('Tree Shaking');
        console.log(`Unused modules: ${metrics.treeShaking.unusedModules}`);
        console.log(`Unused exports: ${metrics.treeShaking.unusedExports}`);
        console.log(`Potential savings: ${(metrics.treeShaking.potentialSavings / 1024).toFixed(1)}KB`);
        console.groupEnd();

        console.group('Performance');
        console.log(`FCP: ${metrics.performance.fcp.toFixed(0)}ms`);
        console.log(`LCP: ${metrics.performance.lcp.toFixed(0)}ms`);
        console.log(`CLS: ${metrics.performance.cls.toFixed(3)}`);
        console.groupEnd();

        if (recommendations.length > 0) {
            console.group('Recommendations');
            recommendations.forEach(rec => console.log(`💡 ${rec}`));
            console.groupEnd();
        }

        console.groupEnd();
    }

    /**
     * Limpa recursos
     */
    cleanup(): void {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }

        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }

        this.bundleOptimizer.cleanup();
    }
}

// === INSTÂNCIA SINGLETON ===

let optimizationSystemInstance: UnifiedOptimizationSystem | null = null;

export const getOptimizationSystem = (config?: Partial<OptimizationConfig>): UnifiedOptimizationSystem => {
    if (!optimizationSystemInstance) {
        optimizationSystemInstance = new UnifiedOptimizationSystem(config);
    }
    return optimizationSystemInstance;
};

// === HOOK PARA REACT ===

/**
 * Hook para usar o sistema de otimização no React
 */
export function useOptimization() {
    const [metrics, setMetrics] = React.useState<OptimizationMetrics | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const system = getOptimizationSystem();

        const updateMetrics = async () => {
            try {
                const currentMetrics = await system.getMetrics();
                setMetrics(currentMetrics);
            } catch (error) {
                console.error('Failed to collect optimization metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        updateMetrics();

        // Atualiza métricas a cada minuto
        const interval = setInterval(updateMetrics, 60000);

        return () => {
            clearInterval(interval);
            system.cleanup();
        };
    }, []);

    return {
        metrics,
        loading,
        optimize: () => getOptimizationSystem().optimize(),
        generateReport: () => getOptimizationSystem().generateReport()
    };
}

// === UTILITÁRIOS DE SETUP ===

/**
 * Configura otimizações para desenvolvimento
 */
export function setupDevelopmentOptimizations() {
    return getOptimizationSystem({
        enableLazyLoading: true,
        enableCodeSplitting: false, // Desabilitado em dev para debug
        enableTreeShaking: true,
        enablePreloading: false, // Menos agressivo em dev
        enableMonitoring: true,
        bundleSizeTarget: 500 // Mais relaxado em dev
    });
}

/**
 * Configura otimizações para produção
 */
export function setupProductionOptimizations() {
    return getOptimizationSystem({
        enableLazyLoading: true,
        enableCodeSplitting: true,
        enableTreeShaking: true,
        enablePreloading: true,
        enableMonitoring: true,
        bundleSizeTarget: 150 // Meta agressiva para produção
    });
}

export { UnifiedOptimizationSystem, type OptimizationConfig, type OptimizationMetrics };
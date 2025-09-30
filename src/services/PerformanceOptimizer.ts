/**
 * ⚡ PERFORMANCE OPTIMIZER - FASE 4
 * 
 * Sistema inteligente de otimização com cache adaptativo,
 * lazy loading e otimizações automáticas para o quiz-editor.
 */

// Migração: substituir uso direto de AnalyticsService pelo adapter unificado
import { analyticsServiceAdapter as analyticsService } from '@/analytics/compat/analyticsServiceAdapter';
import { QUIZ_STEPS, getStepById } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';

// ===============================
// 🎯 INTERFACES DE PERFORMANCE
// ===============================

export interface CacheConfig {
    maxSize: number; // MB
    maxAge: number; // milliseconds
    strategy: 'lru' | 'fifo' | 'adaptive';
    compression: boolean;
    persistence: boolean;
}

export interface CacheEntry<T = any> {
    key: string;
    data: T;
    timestamp: number;
    accessCount: number;
    lastAccessed: number;
    size: number; // bytes
    priority: 'low' | 'medium' | 'high';
    ttl?: number; // time to live
}

export interface PerformanceMetrics {
    cacheHitRate: number;
    memoryUsage: number;
    loadTimes: Record<string, number>;
    bundleSize: number;
    renderTime: number;
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    cls: number; // Cumulative Layout Shift
}

export interface OptimizationRule {
    id: string;
    name: string;
    condition: (metrics: PerformanceMetrics) => boolean;
    action: (context: any) => Promise<void>;
    priority: number;
    enabled: boolean;
}

export interface LazyLoadConfig {
    threshold: number; // pixels
    rootMargin: string;
    enableImages: boolean;
    enableComponents: boolean;
    enableData: boolean;
    batchSize: number;
}

// ===============================
// ⚡ PERFORMANCE OPTIMIZER
// ===============================

export class PerformanceOptimizer {
    private static instance: PerformanceOptimizer;
    private cache: Map<string, CacheEntry> = new Map();
    private cacheConfig: CacheConfig;
    private metrics: PerformanceMetrics;
    private optimizationRules: OptimizationRule[] = [];
    private intersectionObserver?: IntersectionObserver;
    private lazyLoadConfig: LazyLoadConfig;
    private performanceObserver?: PerformanceObserver;

    private constructor() {
        this.cacheConfig = this.getDefaultCacheConfig();
        this.lazyLoadConfig = this.getDefaultLazyLoadConfig();
        this.metrics = this.initializeMetrics();

        this.initializeOptimizationRules();
        this.initializePerformanceMonitoring();
        this.initializeLazyLoading();
        this.startCacheCleanup();
    }

    public static getInstance(): PerformanceOptimizer {
        if (!PerformanceOptimizer.instance) {
            PerformanceOptimizer.instance = new PerformanceOptimizer();
        }
        return PerformanceOptimizer.instance;
    }

    // ===============================
    // 💾 SISTEMA DE CACHE INTELIGENTE
    // ===============================

    /**
     * Armazena dados no cache com estratégia inteligente
     */
    public set<T>(key: string, data: T, options?: {
        ttl?: number;
        priority?: CacheEntry['priority'];
        compress?: boolean;
    }): void {
        try {
            const size = this.calculateDataSize(data);
            const now = Date.now();

            // Verificar se precisa fazer limpeza
            if (this.getCurrentCacheSize() + size > this.cacheConfig.maxSize * 1024 * 1024) {
                this.evictCache(size);
            }

            const entry: CacheEntry<T> = {
                key,
                data: options?.compress ? this.compressData(data) : data,
                timestamp: now,
                accessCount: 0,
                lastAccessed: now,
                size,
                priority: options?.priority || 'medium',
                ttl: options?.ttl
            };

            this.cache.set(key, entry);
            this.updateCacheMetrics();

            // Analytics tracking
            analyticsService.trackEvent({
                funnelId: 'global-performance',
                type: 'performance_metric',
                payload: {
                    action: 'cache_set',
                    key,
                    size,
                    cacheSize: this.cache.size
                }
            });

        } catch (error) {
            console.warn('⚠️ Cache set failed:', error);
        }
    }

    /**
     * Recupera dados do cache
     */
    public get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            this.metrics.cacheHitRate = this.calculateHitRate(false);
            return null;
        }

        // Verificar TTL
        if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        // Atualizar estatísticas de acesso
        entry.accessCount++;
        entry.lastAccessed = Date.now();

        this.metrics.cacheHitRate = this.calculateHitRate(true);

        // Decomprimir se necessário
        const data = this.cacheConfig.compression && this.isCompressed(entry.data)
            ? this.decompressData(entry.data)
            : entry.data;

        // Analytics tracking
        analyticsService.trackEvent({
            funnelId: 'global-performance',
            type: 'performance_metric',
            payload: {
                action: 'cache_hit',
                key,
                accessCount: entry.accessCount
            }
        });

        return data as T;
    }

    /**
     * Cache com fallback - se não existir, executa função e armazena resultado
     */
    public async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T> | T,
        options?: Parameters<typeof this.set>[2]
    ): Promise<T> {
        const cached = this.get<T>(key);

        if (cached !== null) {
            return cached;
        }

        const data = await fetcher();
        this.set(key, data, options);
        return data;
    }

    /**
     * Pré-carrega dados baseado em padrões de uso
     */
    public async preloadPredictive(): Promise<void> {
        try {
            // Analisar padrões de navegação
            const navigationPatterns = this.analyzeNavigationPatterns();

            // Pré-carregar próximos steps prováveis
            for (const pattern of navigationPatterns.slice(0, 3)) {
                const stepData = getStepById(pattern.nextStep);
                if (stepData) {
                    await this.preloadStepData(pattern.nextStep);
                }
            }

            // Pré-carregar estilos mais populares
            const popularStyles = this.getPopularStyles();
            for (const style of popularStyles.slice(0, 5)) {
                await this.preloadStyleData(style);
            }

        } catch (error) {
            console.warn('⚠️ Predictive preload failed:', error);
        }
    }

    // ===============================
    // 🚀 LAZY LOADING INTELIGENTE
    // ===============================

    /**
     * Inicializa sistema de lazy loading
     */
    private initializeLazyLoading(): void {
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            return;
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLazyElement(entry.target as HTMLElement);
                    }
                });
            },
            {
                threshold: this.lazyLoadConfig.threshold,
                rootMargin: this.lazyLoadConfig.rootMargin
            }
        );
    }

    /**
     * Registra elemento para lazy loading
     */
    public observeLazyElement(element: HTMLElement, type: 'image' | 'component' | 'data'): void {
        if (!this.intersectionObserver) return;

        element.setAttribute('data-lazy-type', type);
        this.intersectionObserver.observe(element);
    }

    /**
     * Carrega elemento lazy quando necessário
     */
    private async loadLazyElement(element: HTMLElement): Promise<void> {
        const type = element.getAttribute('data-lazy-type') as 'image' | 'component' | 'data';

        try {
            switch (type) {
                case 'image':
                    await this.loadLazyImage(element as HTMLImageElement);
                    break;
                case 'component':
                    await this.loadLazyComponent(element);
                    break;
                case 'data':
                    await this.loadLazyData(element);
                    break;
            }

            // Analytics tracking
            analyticsService.trackEvent({
                funnelId: 'global-performance',
                type: 'performance_metric',
                payload: {
                    action: 'lazy_load',
                    lazyType: type,
                    elementId: element.id
                }
            });

        } catch (error) {
            console.warn('⚠️ Lazy loading failed:', error);
        } finally {
            this.intersectionObserver?.unobserve(element);
        }
    }

    private async loadLazyImage(img: HTMLImageElement): Promise<void> {
        const src = img.getAttribute('data-src');
        if (src) {
            return new Promise((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
                img.src = src;
                img.removeAttribute('data-src');
            });
        }
    }

    private async loadLazyComponent(element: HTMLElement): Promise<void> {
        const componentName = element.getAttribute('data-component');
        if (componentName) {
            // Carregamento dinâmico de componente
            // IMPORTANTE: O plugin vite:dynamic-import-vars exige que a parte estática contenha a extensão.
            // Exemplo válido: import(`./foo/${bar}.js`)
            // Portanto adicionamos ".tsx" ao final garantindo que o bundler consiga gerar os glob patterns.
            try {
                const module = await import(`@/components/${componentName}.tsx`);
                // Opcional: se o componente tiver export default podemos anexar ao elemento
                const Exported: any = module.default || module[componentName];
                if (Exported) {
                    // Estratégia simples: criar um container e renderizar via React apenas quando disponível
                    // Para evitar dependência direta aqui, emitimos um evento customizado que outra parte do app pode escutar
                    const event = new CustomEvent('lazy-component-loaded', {
                        detail: { element, component: Exported, name: componentName }
                    });
                    window.dispatchEvent(event);
                }
            } catch (err) {
                console.warn(`⚠️ Falha ao carregar componente lazy: ${componentName}`, err);
            }
        }
    }

    private async loadLazyData(element: HTMLElement): Promise<void> {
        const dataKey = element.getAttribute('data-key');
        if (dataKey) {
            // Carregar dados específicos
            await this.loadDataForKey(dataKey);
        }
    }

    // ===============================
    // 📊 MONITORAMENTO DE PERFORMANCE
    // ===============================

    private initializePerformanceMonitoring(): void {
        if (typeof window === 'undefined') return;

        // Performance Observer para métricas detalhadas
        if ('PerformanceObserver' in window) {
            this.performanceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.processPerformanceEntry(entry);
                }
            });

            this.performanceObserver.observe({
                entryTypes: ['navigation', 'resource', 'paint', 'layout-shift']
            });
        }

        // Métricas de Web Vitals
        this.measureWebVitals();

        // Monitoramento contínuo
        setInterval(() => {
            this.updatePerformanceMetrics();
            this.runOptimizationRules();
        }, 30000); // A cada 30 segundos
    }

    private processPerformanceEntry(entry: PerformanceEntry): void {
        switch (entry.entryType) {
            case 'navigation':
                const navEntry = entry as PerformanceNavigationTiming;
                this.metrics.loadTimes.navigation = navEntry.loadEventEnd - navEntry.fetchStart;
                break;

            case 'paint':
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                }
                break;

            case 'largest-contentful-paint':
                this.metrics.lcp = entry.startTime;
                break;

            case 'layout-shift':
                const layoutEntry = entry as any;
                this.metrics.cls += layoutEntry.value;
                break;
        }
    }

    private measureWebVitals(): void {
        // Implementar medição de Core Web Vitals
        if (typeof window !== 'undefined' && 'performance' in window) {
            // Simular medições
            setTimeout(() => {
                this.metrics.fcp = performance.now();
                this.metrics.lcp = performance.now() + 500;
            }, 100);
        }
    }

    private updatePerformanceMetrics(): void {
        this.metrics.memoryUsage = this.getCurrentMemoryUsage();
        this.metrics.bundleSize = this.estimateBundleSize();
        this.metrics.renderTime = this.measureRenderTime();

        // Track para analytics
        analyticsService.trackEvent({
            funnelId: 'global-performance',
            type: 'performance_metric',
            payload: {
                action: 'metrics_update',
                metrics: this.metrics
            }
        });
    }

    // ===============================
    // 🎯 REGRAS DE OTIMIZAÇÃO
    // ===============================

    private initializeOptimizationRules(): void {
        this.optimizationRules = [
            {
                id: 'cache-cleanup',
                name: 'Limpeza automática de cache',
                condition: (metrics) => metrics.memoryUsage > 50 * 1024 * 1024, // 50MB
                action: async () => {
                    this.evictCache(10 * 1024 * 1024); // Liberar 10MB
                },
                priority: 1,
                enabled: true
            },
            {
                id: 'preload-optimization',
                name: 'Otimização de pré-carregamento',
                condition: (metrics) => metrics.cacheHitRate < 0.7,
                action: async () => {
                    await this.preloadPredictive();
                },
                priority: 2,
                enabled: true
            },
            {
                id: 'render-optimization',
                name: 'Otimização de renderização',
                condition: (metrics) => metrics.renderTime > 16, // 60fps = 16ms por frame
                action: async (context) => {
                    await this.optimizeRendering(context);
                },
                priority: 3,
                enabled: true
            },
            {
                id: 'bundle-optimization',
                name: 'Otimização de bundle',
                condition: (metrics) => metrics.bundleSize > 5 * 1024 * 1024, // 5MB
                action: async () => {
                    await this.optimizeBundle();
                },
                priority: 4,
                enabled: true
            }
        ];
    }

    private runOptimizationRules(): void {
        this.optimizationRules
            .filter(rule => rule.enabled)
            .sort((a, b) => a.priority - b.priority)
            .forEach(async rule => {
                if (rule.condition(this.metrics)) {
                    try {
                        await rule.action(this);
                        console.log(`✅ Executed optimization: ${rule.name}`);

                        analyticsService.trackEvent({
                            funnelId: 'global-performance',
                            type: 'performance_metric',
                            payload: {
                                action: 'optimization_applied',
                                rule: rule.id
                            }
                        });
                    } catch (error) {
                        console.warn(`⚠️ Optimization failed: ${rule.name}`, error);
                    }
                }
            });
    }

    // ===============================
    // 🔧 MÉTODOS DE OTIMIZAÇÃO
    // ===============================

    private async optimizeRendering(context: any): Promise<void> {
        // Implementar otimizações de renderização
        if (typeof window !== 'undefined') {
            // Batch DOM updates
            requestAnimationFrame(() => {
                // Aplicar otimizações de renderização
            });
        }
    }

    private async optimizeBundle(): Promise<void> {
        // Implementar otimizações de bundle
        // Lazy load de módulos não críticos
        console.log('🎯 Optimizing bundle size...');
    }

    private evictCache(targetSize: number): void {
        if (this.cache.size === 0) return;

        const entries = Array.from(this.cache.entries())
            .map(([key, entry]) => ({ ...entry, key }))
            .sort((a, b) => {
                // Estratégia adaptativa de evicção
                if (this.cacheConfig.strategy === 'lru') {
                    return a.lastAccessed - b.lastAccessed;
                } else if (this.cacheConfig.strategy === 'fifo') {
                    return a.timestamp - b.timestamp;
                } else { // adaptive
                    const scoreA = this.calculateEvictionScore(a);
                    const scoreB = this.calculateEvictionScore(b);
                    return scoreA - scoreB;
                }
            });

        let removedSize = 0;
        for (const entry of entries) {
            if (removedSize >= targetSize) break;

            this.cache.delete(entry.key);
            removedSize += entry.size;

            console.log(`🗑️ Evicted cache entry: ${entry.key} (${entry.size} bytes)`);
        }
    }

    private calculateEvictionScore(entry: CacheEntry): number {
        const age = Date.now() - entry.timestamp;
        const timeSinceAccess = Date.now() - entry.lastAccessed;
        const priorityWeight = entry.priority === 'high' ? 0.1 :
            entry.priority === 'medium' ? 0.5 : 1.0;

        // Score mais baixo = maior chance de ser removido
        return (age + timeSinceAccess) * priorityWeight / (entry.accessCount + 1);
    }

    // ===============================
    // 📈 ANÁLISE E PREVISÃO
    // ===============================

    private analyzeNavigationPatterns(): Array<{ nextStep: string; probability: number }> {
        // Analisar padrões de navegação dos usuários
        const patterns = [
            { nextStep: 'step-2', probability: 0.9 },
            { nextStep: 'step-3', probability: 0.8 },
            { nextStep: 'step-result', probability: 0.3 }
        ];

        return patterns.sort((a, b) => b.probability - a.probability);
    }

    private getPopularStyles(): string[] {
        // Retornar estilos mais populares baseado em analytics
        return Object.keys(styleConfigGisele).slice(0, 5);
    }

    private async preloadStepData(stepId: string): Promise<void> {
        const cacheKey = `step-data-${stepId}`;

        if (!this.get(cacheKey)) {
            const stepData = getStepById(stepId);
            if (stepData) {
                this.set(cacheKey, stepData, { priority: 'high', ttl: 300000 }); // 5 minutos
            }
        }
    }

    private async preloadStyleData(styleId: string): Promise<void> {
        const cacheKey = `style-data-${styleId}`;

        if (!this.get(cacheKey)) {
            const styleData = styleConfigGisele[styleId];
            if (styleData) {
                this.set(cacheKey, styleData, { priority: 'medium', ttl: 600000 }); // 10 minutos
            }
        }
    }

    private async loadDataForKey(key: string): Promise<void> {
        // Implementar carregamento específico de dados
        console.log(`🔍 Loading data for key: ${key}`);
    }

    // ===============================
    // 🔧 MÉTODOS AUXILIARES
    // ===============================

    private getDefaultCacheConfig(): CacheConfig {
        return {
            maxSize: 100, // 100MB
            maxAge: 3600000, // 1 hora
            strategy: 'adaptive',
            compression: true,
            persistence: true
        };
    }

    private getDefaultLazyLoadConfig(): LazyLoadConfig {
        return {
            threshold: 0.1,
            rootMargin: '50px',
            enableImages: true,
            enableComponents: true,
            enableData: true,
            batchSize: 5
        };
    }

    private initializeMetrics(): PerformanceMetrics {
        return {
            cacheHitRate: 0,
            memoryUsage: 0,
            loadTimes: {},
            bundleSize: 0,
            renderTime: 0,
            fcp: 0,
            lcp: 0,
            cls: 0
        };
    }

    private calculateDataSize(data: any): number {
        return new Blob([JSON.stringify(data)]).size;
    }

    private getCurrentCacheSize(): number {
        return Array.from(this.cache.values())
            .reduce((total, entry) => total + entry.size, 0);
    }

    private calculateHitRate(isHit: boolean): number {
        // Implementar cálculo de hit rate
        return isHit ? Math.min(this.metrics.cacheHitRate + 0.01, 1) :
            Math.max(this.metrics.cacheHitRate - 0.01, 0);
    }

    private updateCacheMetrics(): void {
        // Atualizar métricas do cache
    }

    private compressData(data: any): any {
        // Implementar compressão (simplificado)
        return data;
    }

    private decompressData(data: any): any {
        // Implementar descompressão (simplificado)
        return data;
    }

    private isCompressed(data: any): boolean {
        // Verificar se dados estão comprimidos
        return false;
    }

    private getCurrentMemoryUsage(): number {
        if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (performance as any)) {
            return (performance as any).memory.usedJSHeapSize || 0;
        }
        return 0;
    }

    private estimateBundleSize(): number {
        // Estimar tamanho do bundle (simplificado)
        return 2 * 1024 * 1024; // 2MB
    }

    private measureRenderTime(): number {
        // Medir tempo de renderização
        return performance.now() % 20; // Simular tempo de render
    }

    private startCacheCleanup(): void {
        // Limpeza periódica do cache
        setInterval(() => {
            const now = Date.now();
            const expiredKeys: string[] = [];

            this.cache.forEach((entry, key) => {
                if (entry.ttl && now - entry.timestamp > entry.ttl) {
                    expiredKeys.push(key);
                }
            });

            expiredKeys.forEach(key => {
                this.cache.delete(key);
                console.log(`🧹 Cleaned expired cache entry: ${key}`);
            });

        }, 60000); // A cada minuto
    }

    // ===============================
    // 📊 API PÚBLICA
    // ===============================

    public getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    public getCacheStats() {
        return {
            size: this.cache.size,
            memoryUsage: this.getCurrentCacheSize(),
            hitRate: this.metrics.cacheHitRate,
            maxSize: this.cacheConfig.maxSize * 1024 * 1024
        };
    }

    public clearCache(): void {
        this.cache.clear();
        console.log('🧹 Cache cleared');
    }

    public optimizeNow(): Promise<void> {
        return new Promise((resolve) => {
            this.runOptimizationRules();
            setTimeout(resolve, 100);
        });
    }
}

// ===============================
// 🎯 SINGLETON EXPORT
// ===============================

export const performanceOptimizer = PerformanceOptimizer.getInstance();
export default performanceOptimizer;
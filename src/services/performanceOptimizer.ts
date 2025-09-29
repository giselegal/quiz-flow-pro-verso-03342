/**
 * 🚀 SISTEMA DE OTIMIZAÇÃO DE PERFORMANCE
 * Performance Optimizer para Sistema de Funis Escalável
 * 
 * Implementa lazy loading, caching e paginação para grandes volumes
 * Parte da Fase 2: Otimização de Performance
 */

import { HybridFunnelData } from './improvedFunnelSystem';
import { UnifiedTemplate } from '../config/unifiedTemplatesRegistry';

// ==========================================
// 🎯 TIPOS E INTERFACES
// ==========================================

export interface CacheConfig {
    maxSize: number;           // Máximo de itens no cache
    ttl: number;              // Time to live (ms)
    strategy: 'lru' | 'lfu';  // Least Recently Used / Least Frequently Used
}

export interface PaginationConfig {
    pageSize: number;
    maxPages: number;
    preloadNextPage: boolean;
}

export interface LazyLoadConfig {
    threshold: number;        // Pixels antes de carregar
    batchSize: number;       // Quantos itens carregar por vez
    debounceMs: number;      // Delay para debounce
}

export interface PerformanceMetrics {
    loadTime: number;
    cacheHitRate: number;
    memoryUsage: number;
    itemsLoaded: number;
    timestamp: Date;
}

// ==========================================
// 🚀 CACHE MANAGER AVANÇADO
// ==========================================

export class AdvancedCacheManager {
    private cache = new Map<string, CacheItem>();
    private accessCount = new Map<string, number>();
    private config: CacheConfig;

    constructor(config: CacheConfig) {
        this.config = config;
    }

    set<T>(key: string, value: T, customTtl?: number): void {
        const ttl = customTtl || this.config.ttl;
        const expiresAt = Date.now() + ttl;

        // Se o cache estiver cheio, remover item baseado na estratégia
        if (this.cache.size >= this.config.maxSize) {
            this.evictItem();
        }

        this.cache.set(key, {
            value,
            expiresAt,
            accessedAt: Date.now(),
            createdAt: Date.now()
        });

        this.accessCount.set(key, 0);
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        // Verificar expiração
        if (Date.now() > item.expiresAt) {
            this.delete(key);
            return null;
        }

        // Atualizar estatísticas de acesso
        item.accessedAt = Date.now();
        const currentCount = this.accessCount.get(key) || 0;
        this.accessCount.set(key, currentCount + 1);

        return item.value as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
        this.accessCount.delete(key);
    }

    private evictItem(): void {
        if (this.config.strategy === 'lru') {
            this.evictLRU();
        } else {
            this.evictLFU();
        }
    }

    private evictLRU(): void {
        let oldestKey = '';
        let oldestTime = Infinity;

        for (const [key, item] of this.cache.entries()) {
            if (item.accessedAt < oldestTime) {
                oldestTime = item.accessedAt;
                oldestKey = key;
            }
        }

        if (oldestKey) this.delete(oldestKey);
    }

    private evictLFU(): void {
        let leastFrequentKey = '';
        let minCount = Infinity;

        for (const [key, count] of this.accessCount.entries()) {
            if (count < minCount) {
                minCount = count;
                leastFrequentKey = key;
            }
        }

        if (leastFrequentKey) this.delete(leastFrequentKey);
    }

    // 📊 Métricas do cache
    getMetrics(): CacheMetrics {
        const totalRequests = Array.from(this.accessCount.values())
            .reduce((sum, count) => sum + count, 0);

        return {
            size: this.cache.size,
            maxSize: this.config.maxSize,
            hitRate: totalRequests > 0 ? (this.cache.size / totalRequests) : 0,
            memoryUsage: this.estimateMemoryUsage(),
            oldestItem: this.getOldestItemAge(),
        };
    }

    private estimateMemoryUsage(): number {
        // Estimativa simples do uso de memória
        return this.cache.size * 1024; // 1KB por item (estimativa)
    }

    private getOldestItemAge(): number {
        let oldest = 0;
        for (const item of this.cache.values()) {
            const age = Date.now() - item.createdAt;
            oldest = Math.max(oldest, age);
        }
        return oldest;
    }
}

interface CacheItem {
    value: any;
    expiresAt: number;
    accessedAt: number;
    createdAt: number;
}

interface CacheMetrics {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
    oldestItem: number;
}

// ==========================================
// 🚀 LAZY LOADER INTELIGENTE
// ==========================================

export class IntelligentLazyLoader {
    private config: LazyLoadConfig;
    private loadedItems = new Set<string>();
    private loadingPromises = new Map<string, Promise<any>>();
    private observer?: IntersectionObserver;

    constructor(config: LazyLoadConfig) {
        this.config = config;
        this.initIntersectionObserver();
    }

    private initIntersectionObserver(): void {
        if (typeof window === 'undefined') return;

        this.observer = new IntersectionObserver(
            this.debounce(this.handleIntersection.bind(this), this.config.debounceMs),
            {
                rootMargin: `${this.config.threshold}px`,
                threshold: 0.1
            }
        );
    }

    async lazyLoad<T>(
        itemId: string,
        element: Element,
        loadFunction: () => Promise<T>
    ): Promise<T | null> {
        // Se já foi carregado, retorna null
        if (this.loadedItems.has(itemId)) {
            return null;
        }

        // Se já está carregando, retorna a promise existente
        if (this.loadingPromises.has(itemId)) {
            return this.loadingPromises.get(itemId)!;
        }

        // Observar o elemento
        if (this.observer) {
            this.observer.observe(element);
        }

        // Criar promise de carregamento
        const loadPromise = this.executeLoad(itemId, loadFunction);
        this.loadingPromises.set(itemId, loadPromise);

        return loadPromise;
    }

    private async executeLoad<T>(
        itemId: string,
        loadFunction: () => Promise<T>
    ): Promise<T> {
        try {
            const result = await loadFunction();
            this.loadedItems.add(itemId);
            this.loadingPromises.delete(itemId);
            return result;
        } catch (error) {
            this.loadingPromises.delete(itemId);
            throw error;
        }
    }

    private handleIntersection(entries: IntersectionObserverEntry[]): void {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Elemento está visível, pode triggerar carregamento
                const itemId = entry.target.getAttribute('data-item-id');
                if (itemId && !this.loadedItems.has(itemId)) {
                    // Lógica de carregamento será implementada pelo consumer
                    entry.target.dispatchEvent(new CustomEvent('lazyLoad', {
                        detail: { itemId }
                    }));
                }
            }
        });
    }

    private debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Limpar observador
    destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.loadingPromises.clear();
        this.loadedItems.clear();
    }
}

// ==========================================
// 🚀 PAGINADOR INTELIGENTE
// ==========================================

export class SmartPaginator<T> {
    private config: PaginationConfig;
    private cache: AdvancedCacheManager;
    private currentPage = 0;
    private totalItems = 0;
    private isLoading = false;

    constructor(config: PaginationConfig, cacheConfig: CacheConfig) {
        this.config = config;
        this.cache = new AdvancedCacheManager(cacheConfig);
    }

    async loadPage(
        pageNumber: number,
        fetchFunction: (page: number, size: number) => Promise<PaginatedResult<T>>
    ): Promise<PaginatedResult<T>> {
        const cacheKey = `page_${pageNumber}_${this.config.pageSize}`;

        // Tentar obter do cache primeiro
        const cached = this.cache.get<PaginatedResult<T>>(cacheKey);
        if (cached) {
            return cached;
        }

        // Se não estiver no cache, buscar
        if (this.isLoading) {
            throw new Error('Já existe uma operação de carregamento em andamento');
        }

        try {
            this.isLoading = true;
            const result = await fetchFunction(pageNumber, this.config.pageSize);

            // Armazenar no cache
            this.cache.set(cacheKey, result);

            // Atualizar estado
            this.currentPage = pageNumber;
            this.totalItems = result.total;

            // Pré-carregar próxima página se configurado
            if (this.config.preloadNextPage && pageNumber < result.totalPages - 1) {
                this.preloadNextPage(pageNumber + 1, fetchFunction);
            }

            return result;
        } finally {
            this.isLoading = false;
        }
    }

    private async preloadNextPage(
        nextPage: number,
        fetchFunction: (page: number, size: number) => Promise<PaginatedResult<T>>
    ): Promise<void> {
        const cacheKey = `page_${nextPage}_${this.config.pageSize}`;

        // Se já está no cache, não precisa pré-carregar
        if (this.cache.get(cacheKey)) return;

        try {
            const result = await fetchFunction(nextPage, this.config.pageSize);
            this.cache.set(cacheKey, result, this.config.maxPages * 60000); // TTL estendido para preload
        } catch (error) {
            console.warn(`Falha no pré-carregamento da página ${nextPage}:`, error);
        }
    }

    // Navegação inteligente
    async nextPage(
        fetchFunction: (page: number, size: number) => Promise<PaginatedResult<T>>
    ): Promise<PaginatedResult<T> | null> {
        if (!this.hasNextPage()) return null;
        return this.loadPage(this.currentPage + 1, fetchFunction);
    }

    async previousPage(
        fetchFunction: (page: number, size: number) => Promise<PaginatedResult<T>>
    ): Promise<PaginatedResult<T> | null> {
        if (!this.hasPreviousPage()) return null;
        return this.loadPage(this.currentPage - 1, fetchFunction);
    }

    hasNextPage(): boolean {
        const totalPages = Math.ceil(this.totalItems / this.config.pageSize);
        return this.currentPage < totalPages - 1;
    }

    hasPreviousPage(): boolean {
        return this.currentPage > 0;
    }

    // Métricas e status
    getStatus(): PaginationStatus {
        const totalPages = Math.ceil(this.totalItems / this.config.pageSize);
        return {
            currentPage: this.currentPage,
            totalPages,
            totalItems: this.totalItems,
            pageSize: this.config.pageSize,
            hasNext: this.hasNextPage(),
            hasPrevious: this.hasPreviousPage(),
            isLoading: this.isLoading,
            cacheMetrics: this.cache.getMetrics()
        };
    }
}

export interface PaginatedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaginationStatus {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isLoading: boolean;
    cacheMetrics: CacheMetrics;
}

// ==========================================
// 🚀 MONITOR DE PERFORMANCE
// ==========================================

export class PerformanceMonitor {
    private metrics: PerformanceMetrics[] = [];
    private readonly maxMetrics = 1000;

    startTiming(operation: string): PerformanceTimer {
        return new PerformanceTimer(operation, this);
    }

    recordMetric(metric: PerformanceMetrics): void {
        this.metrics.push(metric);

        // Manter apenas as métricas mais recentes
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }
    }

    getAverageLoadTime(minutes = 10): number {
        const cutoff = Date.now() - (minutes * 60 * 1000);
        const recentMetrics = this.metrics.filter(m => m.timestamp.getTime() > cutoff);

        if (recentMetrics.length === 0) return 0;

        const total = recentMetrics.reduce((sum, metric) => sum + metric.loadTime, 0);
        return total / recentMetrics.length;
    }

    getCacheHitRate(minutes = 10): number {
        const cutoff = Date.now() - (minutes * 60 * 1000);
        const recentMetrics = this.metrics.filter(m => m.timestamp.getTime() > cutoff);

        if (recentMetrics.length === 0) return 0;

        const total = recentMetrics.reduce((sum, metric) => sum + metric.cacheHitRate, 0);
        return total / recentMetrics.length;
    }

    getPerformanceReport(): PerformanceReport {
        const recent = this.getRecentMetrics(10);

        return {
            averageLoadTime: this.getAverageLoadTime(10),
            cacheHitRate: this.getCacheHitRate(10),
            totalRequests: recent.length,
            memoryUsage: recent.reduce((sum, m) => sum + m.memoryUsage, 0) / recent.length,
            timestamp: new Date()
        };
    }

    private getRecentMetrics(minutes: number): PerformanceMetrics[] {
        const cutoff = Date.now() - (minutes * 60 * 1000);
        return this.metrics.filter(m => m.timestamp.getTime() > cutoff);
    }
}

export class PerformanceTimer {
    private startTime: number;
    private operation: string;
    private monitor: PerformanceMonitor;

    constructor(operation: string, monitor: PerformanceMonitor) {
        this.operation = operation;
        this.monitor = monitor;
        this.startTime = performance.now();
    }

    end(additionalData: Partial<PerformanceMetrics> = {}): void {
        const endTime = performance.now();
        const loadTime = endTime - this.startTime;

        const metric: PerformanceMetrics = {
            loadTime,
            cacheHitRate: 0,
            memoryUsage: 0,
            itemsLoaded: 0,
            timestamp: new Date(),
            ...additionalData
        };

        this.monitor.recordMetric(metric);
    }
}

export interface PerformanceReport {
    averageLoadTime: number;
    cacheHitRate: number;
    totalRequests: number;
    memoryUsage: number;
    timestamp: Date;
}

// ==========================================
// 🚀 OTIMIZADOR PRINCIPAL
// ==========================================

export class FunnelPerformanceOptimizer {
    private cacheManager: AdvancedCacheManager;
    private lazyLoader: IntelligentLazyLoader;
    private paginator: SmartPaginator<HybridFunnelData>;
    private templatePaginator: SmartPaginator<UnifiedTemplate>;
    private performanceMonitor: PerformanceMonitor;

    constructor(
        cacheConfig: CacheConfig,
        lazyConfig: LazyLoadConfig,
        paginationConfig: PaginationConfig
    ) {
        this.cacheManager = new AdvancedCacheManager(cacheConfig);
        this.lazyLoader = new IntelligentLazyLoader(lazyConfig);
        this.paginator = new SmartPaginator<HybridFunnelData>(paginationConfig, cacheConfig);
        this.templatePaginator = new SmartPaginator<UnifiedTemplate>(paginationConfig, cacheConfig);
        this.performanceMonitor = new PerformanceMonitor();
    }

    // 🎯 API Principal para Funis
    async loadFunnelsPage(
        page: number,
        filters?: FunnelFilters
    ): Promise<PaginatedResult<HybridFunnelData>> {
        const timer = this.performanceMonitor.startTiming('loadFunnelsPage');

        try {
            const result = await this.paginator.loadPage(page, async (p, size) => {
                // Aqui seria a implementação real de busca
                // Por ora, retornamos mock data
                return this.mockFunnelFetch(p, size, filters);
            });

            timer.end({
                itemsLoaded: result.items.length,
                cacheHitRate: this.cacheManager.getMetrics().hitRate
            });

            return result;
        } catch (error) {
            timer.end();
            throw error;
        }
    }

    // 🎯 API Principal para Templates
    async loadTemplatesPage(
        page: number,
        category?: string
    ): Promise<PaginatedResult<UnifiedTemplate>> {
        const timer = this.performanceMonitor.startTiming('loadTemplatesPage');

        try {
            const result = await this.templatePaginator.loadPage(page, async (p, size) => {
                return this.mockTemplateFetch(p, size, category);
            });

            timer.end({
                itemsLoaded: result.items.length,
                cacheHitRate: this.cacheManager.getMetrics().hitRate
            });

            return result;
        } catch (error) {
            timer.end();
            throw error;
        }
    }

    // Mock functions (substituir por implementações reais)
    private async mockFunnelFetch(
        page: number,
        size: number,
        filters?: FunnelFilters
    ): Promise<PaginatedResult<HybridFunnelData>> {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 100));

        const total = 1000; // Mock total
        const totalPages = Math.ceil(total / size);

        return {
            items: [], // Mock items
            page,
            pageSize: size,
            total,
            totalPages,
            hasNext: page < totalPages - 1,
            hasPrevious: page > 0
        };
    }

    private async mockTemplateFetch(
        page: number,
        size: number,
        category?: string
    ): Promise<PaginatedResult<UnifiedTemplate>> {
        await new Promise(resolve => setTimeout(resolve, 80));

        const total = 500;
        const totalPages = Math.ceil(total / size);

        return {
            items: [],
            page,
            pageSize: size,
            total,
            totalPages,
            hasNext: page < totalPages - 1,
            hasPrevious: page > 0
        };
    }

    // 📊 Métricas e Relatórios
    getPerformanceReport(): PerformanceReport {
        return this.performanceMonitor.getPerformanceReport();
    }

    getCacheStatus(): CacheMetrics {
        return this.cacheManager.getMetrics();
    }

    // 🧹 Limpeza
    cleanup(): void {
        this.lazyLoader.destroy();
    }
}

interface FunnelFilters {
    organizationId?: string;
    category?: string;
    isActive?: boolean;
    tags?: string[];
}

// ==========================================
// 🚀 CONFIGURAÇÕES PADRÃO
// ==========================================

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
    maxSize: 1000,
    ttl: 5 * 60 * 1000, // 5 minutos
    strategy: 'lru'
};

export const DEFAULT_LAZY_CONFIG: LazyLoadConfig = {
    threshold: 200,
    batchSize: 20,
    debounceMs: 100
};

export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
    pageSize: 50,
    maxPages: 20,
    preloadNextPage: true
};

// 🚀 Instância global otimizada
export const globalOptimizer = new FunnelPerformanceOptimizer(
    DEFAULT_CACHE_CONFIG,
    DEFAULT_LAZY_CONFIG,
    DEFAULT_PAGINATION_CONFIG
);
/**
 * 📊 Performance Monitor for ModernQuizEditor
 * 
 * ✅ AUDIT: Provides profiling utilities for measuring:
 * - JSON loading times
 * - Component render times
 * - State update latencies
 * - API call durations
 * 
 * @version 1.0.0
 */

export interface PerformanceMetric {
    name: string;
    duration: number;
    timestamp: number;
    category: 'load' | 'render' | 'api' | 'state';
    metadata?: Record<string, any>;
}

export interface PerformanceStats {
    totalMetrics: number;
    avgLoadTime: number;
    avgRenderTime: number;
    avgApiTime: number;
    avgStateTime: number;
    slowestOperation: PerformanceMetric | null;
    recentMetrics: PerformanceMetric[];
}

class PerformanceMonitor {
    private metrics: PerformanceMetric[] = [];
    private readonly maxMetrics = 100; // Keep last 100 metrics
    private readonly enabled = import.meta.env.DEV;

    /**
     * Start a performance measurement
     */
    startMeasure(name: string): () => void {
        if (!this.enabled) return () => {};
        
        const startTime = performance.now();
        
        return () => {
            const duration = performance.now() - startTime;
            this.recordMetric(name, duration);
        };
    }

    /**
     * Record a performance metric
     */
    recordMetric(
        name: string, 
        duration: number, 
        category: PerformanceMetric['category'] = 'load',
        metadata?: Record<string, any>
    ): void {
        if (!this.enabled) return;

        const metric: PerformanceMetric = {
            name,
            duration,
            timestamp: Date.now(),
            category,
            metadata,
        };

        this.metrics.push(metric);

        // Trim old metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        // Log slow operations (> 100ms)
        if (duration > 100) {
            console.warn(`⚠️ [Performance] Slow operation: ${name} took ${duration.toFixed(2)}ms`, metadata);
        }
    }

    /**
     * Measure an async function
     */
    async measureAsync<T>(
        name: string, 
        fn: () => Promise<T>,
        category: PerformanceMetric['category'] = 'load'
    ): Promise<T> {
        if (!this.enabled) return fn();

        const startTime = performance.now();
        try {
            const result = await fn();
            const duration = performance.now() - startTime;
            this.recordMetric(name, duration, category);
            return result;
        } catch (error) {
            const duration = performance.now() - startTime;
            this.recordMetric(`${name} (error)`, duration, category, { error: String(error) });
            throw error;
        }
    }

    /**
     * Get performance statistics
     */
    getStats(): PerformanceStats {
        const byCategory = {
            load: this.metrics.filter(m => m.category === 'load'),
            render: this.metrics.filter(m => m.category === 'render'),
            api: this.metrics.filter(m => m.category === 'api'),
            state: this.metrics.filter(m => m.category === 'state'),
        };

        const avgOf = (arr: PerformanceMetric[]) => 
            arr.length > 0 ? arr.reduce((a, b) => a + b.duration, 0) / arr.length : 0;

        const slowest = this.metrics.length > 0 
            ? this.metrics.reduce((a, b) => a.duration > b.duration ? a : b)
            : null;

        return {
            totalMetrics: this.metrics.length,
            avgLoadTime: avgOf(byCategory.load),
            avgRenderTime: avgOf(byCategory.render),
            avgApiTime: avgOf(byCategory.api),
            avgStateTime: avgOf(byCategory.state),
            slowestOperation: slowest,
            recentMetrics: this.metrics.slice(-10),
        };
    }

    /**
     * Log performance summary to console
     */
    logSummary(): void {
        if (!this.enabled) return;

        const stats = this.getStats();
        console.group('📊 [Performance Summary]');
        console.log(`Total metrics: ${stats.totalMetrics}`);
        console.log(`Avg load time: ${stats.avgLoadTime.toFixed(2)}ms`);
        console.log(`Avg render time: ${stats.avgRenderTime.toFixed(2)}ms`);
        console.log(`Avg API time: ${stats.avgApiTime.toFixed(2)}ms`);
        console.log(`Avg state time: ${stats.avgStateTime.toFixed(2)}ms`);
        if (stats.slowestOperation) {
            console.log(`Slowest: ${stats.slowestOperation.name} (${stats.slowestOperation.duration.toFixed(2)}ms)`);
        }
        console.groupEnd();
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics = [];
    }

    /**
     * Get all metrics for export
     */
    getMetrics(): PerformanceMetric[] {
        return [...this.metrics];
    }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for measuring component render performance
 */
export function useRenderMetrics(componentName: string): void {
    if (!import.meta.env.DEV) return;

    const startTime = performance.now();
    
    // Use useEffect to measure after render
    React.useEffect(() => {
        const duration = performance.now() - startTime;
        performanceMonitor.recordMetric(`render:${componentName}`, duration, 'render');
    });
}

// Import React for the hook
import React from 'react';

export default performanceMonitor;

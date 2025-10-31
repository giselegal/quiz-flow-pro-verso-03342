/**
 * 🎯 PERFORMANCE PROFILER - Utilitário para medição de performance
 * 
 * Ferramentas para medir tempo de renderização, re-renders e operações críticas.
 * Usado para validar impacto das otimizações React (memo, useMemo, useCallback).
 */

import { appLogger } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  category: 'render' | 'operation' | 'api' | 'cache';
}

class PerformanceProfiler {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled: boolean = false;
  private renderCounts: Map<string, number> = new Map();

  constructor() {
    // Ativar apenas em desenvolvimento
    this.enabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_PROFILING === 'true';
  }

  /**
   * Inicia medição de performance
   */
  start(name: string, category: 'render' | 'operation' | 'api' | 'cache' = 'operation'): void {
    if (!this.enabled) return;

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      category,
    };

    this.metrics.set(name, metric);
    
    if (category === 'render') {
      const count = this.renderCounts.get(name) || 0;
      this.renderCounts.set(name, count + 1);
    }
  }

  /**
   * Finaliza medição e registra resultado
   */
  end(name: string): number | null {
    if (!this.enabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      appLogger.warn(`⚠️ Profiler: Métrica "${name}" não foi iniciada`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log apenas se duração for significativa (> 10ms)
    if (metric.duration > 10) {
      const emoji = this.getCategoryEmoji(metric.category);
      appLogger.debug(
        `${emoji} [Profiler] ${name}: ${metric.duration.toFixed(2)}ms`,
        { category: metric.category, duration: metric.duration }
      );
    }

    return metric.duration;
  }

  /**
   * Mede execução de função síncrona
   */
  measure<T>(name: string, fn: () => T, category: 'render' | 'operation' | 'api' | 'cache' = 'operation'): T {
    this.start(name, category);
    try {
      return fn();
    } finally {
      this.end(name);
    }
  }

  /**
   * Mede execução de função assíncrona
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    category: 'render' | 'operation' | 'api' | 'cache' = 'operation'
  ): Promise<T> {
    this.start(name, category);
    try {
      return await fn();
    } finally {
      this.end(name);
    }
  }

  /**
   * Registra render de componente
   */
  trackRender(componentName: string, props?: Record<string, any>): void {
    if (!this.enabled) return;

    const count = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, count + 1);

    // Log apenas a cada 10 renders para evitar spam
    if (count > 0 && count % 10 === 0) {
      appLogger.debug(`🔄 [Render] ${componentName}: ${count} renders`, { props });
    }
  }

  /**
   * Obtém contagem de renders de um componente
   */
  getRenderCount(componentName: string): number {
    return this.renderCounts.get(componentName) || 0;
  }

  /**
   * Obtém todas as métricas coletadas
   */
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  /**
   * Obtém métricas por categoria
   */
  getMetricsByCategory(category: 'render' | 'operation' | 'api' | 'cache'): PerformanceMetric[] {
    return this.getAllMetrics().filter(m => m.category === category);
  }

  /**
   * Gera relatório de performance
   */
  generateReport(): string {
    if (!this.enabled) return 'Profiler desabilitado';

    const metrics = this.getAllMetrics();
    const byCategory = {
      render: this.getMetricsByCategory('render'),
      operation: this.getMetricsByCategory('operation'),
      api: this.getMetricsByCategory('api'),
      cache: this.getMetricsByCategory('cache'),
    };

    let report = '📊 Performance Report\n';
    report += '='.repeat(50) + '\n\n';

    // Renders
    report += '🔄 Renders:\n';
    for (const [name, count] of this.renderCounts.entries()) {
      report += `  - ${name}: ${count} renders\n`;
    }
    report += '\n';

    // Métricas por categoria
    for (const [category, items] of Object.entries(byCategory)) {
      if (items.length === 0) continue;

      const emoji = this.getCategoryEmoji(category as any);
      const total = items.reduce((sum, m) => sum + (m.duration || 0), 0);
      const avg = total / items.length;

      report += `${emoji} ${category.toUpperCase()}:\n`;
      report += `  Total: ${total.toFixed(2)}ms | Avg: ${avg.toFixed(2)}ms | Count: ${items.length}\n`;
      
      // Top 5 mais lentas
      const slowest = items.sort((a, b) => (b.duration || 0) - (a.duration || 0)).slice(0, 5);
      slowest.forEach(m => {
        report += `    - ${m.name}: ${m.duration?.toFixed(2)}ms\n`;
      });
      report += '\n';
    }

    return report;
  }

  /**
   * Limpa todas as métricas
   */
  clear(): void {
    this.metrics.clear();
    this.renderCounts.clear();
  }

  /**
   * Reseta contagem de renders
   */
  resetRenderCounts(): void {
    this.renderCounts.clear();
  }

  /**
   * Ativa/desativa profiler
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private getCategoryEmoji(category: 'render' | 'operation' | 'api' | 'cache'): string {
    const emojis = {
      render: '🔄',
      operation: '⚙️',
      api: '🌐',
      cache: '💾',
    };
    return emojis[category] || '📊';
  }
}

// Singleton instance
export const performanceProfiler = new PerformanceProfiler();

/**
 * Hook React para tracking de renders
 */
export function useRenderTracking(componentName: string, props?: Record<string, any>) {
  if (import.meta.env.DEV) {
    performanceProfiler.trackRender(componentName, props);
  }
}

/**
 * HOC para tracking de renders
 */
export function withRenderTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const name = componentName || Component.displayName || Component.name || 'Component';
  
  return (props: P) => {
    performanceProfiler.trackRender(name, props as any);
    return <Component {...props} />;
  };
}

// Exportar para uso em console/debugging
if (typeof window !== 'undefined') {
  (window as any).__performanceProfiler = performanceProfiler;
}

export default performanceProfiler;

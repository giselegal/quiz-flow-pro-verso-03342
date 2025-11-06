/**
 * 📊 EDITOR METRICS - FASE 3.3
 * 
 * Sistema de logging estruturado e métricas de performance
 * para monitoramento do editor
 */

interface MetricEntry {
  timestamp: number;
  stepId?: string;
  duration?: number;
  type: 'load' | 'cache-hit' | 'cache-miss' | 'error' | 'render';
  metadata?: Record<string, any>;
}

class EditorMetrics {
  private metrics: MetricEntry[] = [];
  private readonly MAX_ENTRIES = 1000;

  /**
   * Rastrear tempo de carregamento de step
   */
  trackLoadTime(stepId: string, durationMs: number, metadata?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      stepId,
      duration: durationMs,
      type: 'load',
      metadata,
    });

    if (import.meta.env.DEV) {
      console.log(`📊 [Metrics] Step ${stepId} loaded in ${durationMs.toFixed(0)}ms`, metadata);
    }
  }

  /**
   * Rastrear cache hit
   */
  trackCacheHit(key: string) {
    this.addMetric({
      timestamp: Date.now(),
      type: 'cache-hit',
      metadata: { key },
    });
  }

  /**
   * Rastrear cache miss
   */
  trackCacheMiss(key: string) {
    this.addMetric({
      timestamp: Date.now(),
      type: 'cache-miss',
      metadata: { key },
    });
  }

  /**
   * Rastrear erro
   */
  trackError(error: Error, context?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      type: 'error',
      metadata: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });

    console.error('❌ [Metrics] Error tracked:', error, context);
  }

  /**
   * Rastrear tempo de render
   */
  trackRender(component: string, durationMs: number, metadata?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      duration: durationMs,
      type: 'render',
      metadata: { component, ...metadata },
    });
  }

  /**
   * Rastrear props changes (SPRINT 1)
   */
  trackPropsChange(component: string, changedKeys: string[]) {
    if (import.meta.env.DEV) {
      console.debug(`🔄 [EditorMetrics] Props changed in "${component}":`, changedKeys);
    }
  }

  /**
   * Rastrear component unmount (SPRINT 1)
   */
  trackComponentUnmount(component: string, metadata?: Record<string, any>) {
    if (import.meta.env.DEV) {
      console.debug(`👋 [EditorMetrics] Component unmounted: "${component}"`, metadata);
    }
  }

  /**
   * Adicionar métrica
   */
  private addMetric(metric: MetricEntry) {
    this.metrics.push(metric);

    // Limitar tamanho do array
    if (this.metrics.length > this.MAX_ENTRIES) {
      this.metrics.shift();
    }
  }

  /**
   * Obter relatório de performance
   */
  getReport() {
    const now = Date.now();
    const last5Min = this.metrics.filter(m => now - m.timestamp < 5 * 60 * 1000);

    const loads = last5Min.filter(m => m.type === 'load');
    const cacheHits = last5Min.filter(m => m.type === 'cache-hit').length;
    const cacheMisses = last5Min.filter(m => m.type === 'cache-miss').length;
    const errors = last5Min.filter(m => m.type === 'error').length;
    const renders = last5Min.filter(m => m.type === 'render');

    const avgLoadTime = loads.length > 0
      ? loads.reduce((sum, m) => sum + (m.duration || 0), 0) / loads.length
      : 0;

    const avgRenderTime = renders.length > 0
      ? renders.reduce((sum, m) => sum + (m.duration || 0), 0) / renders.length
      : 0;

    const cacheHitRate = (cacheHits + cacheMisses) > 0
      ? (cacheHits / (cacheHits + cacheMisses)) * 100
      : 0;

    return {
      period: 'Last 5 minutes',
      summary: {
        totalLoads: loads.length,
        avgLoadTimeMs: avgLoadTime,
        cacheHitRate: `${cacheHitRate.toFixed(1)}%`,
        cacheHits,
        cacheMisses,
        totalRenders: renders.length,
        avgRenderTimeMs: avgRenderTime,
        errors,
      },
      slowestLoads: loads
        .sort((a, b) => (b.duration || 0) - (a.duration || 0))
        .slice(0, 5)
        .map(m => ({
          stepId: m.stepId,
          duration: `${(m.duration || 0).toFixed(0)}ms`,
          source: m.metadata?.source,
        })),
      recentErrors: last5Min
        .filter(m => m.type === 'error')
        .slice(-3)
        .map(m => ({
          message: m.metadata?.message,
          timestamp: new Date(m.timestamp).toISOString(),
        })),
    };
  }

  /**
   * Limpar métricas antigas
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Exportar métricas (para debug)
   */
  export() {
    return {
      metrics: this.metrics,
      report: this.getReport(),
    };
  }
}

export const editorMetrics = new EditorMetrics();

// Expor globalmente para debugging
if (typeof window !== 'undefined') {
  (window as any).editorMetrics = editorMetrics;
}

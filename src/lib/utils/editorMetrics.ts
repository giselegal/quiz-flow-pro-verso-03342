import { appLogger } from '@/lib/utils/appLogger';
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
  type: 
    | 'load' 
    | 'cache-hit' 
    | 'cache-miss' 
    | 'error' 
    | 'render'
    | 'block-action'    // FASE 5: add/edit/delete/reorder
    | 'navigation'      // FASE 5: step changes
    | 'save'            // FASE 5: save operations
    | 'undo-redo'       // FASE 5: undo/redo actions
    | 'user-interaction'; // FASE 5: clicks, inputs
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
      appLogger.info(`📊 [Metrics] Step ${stepId} loaded in ${durationMs.toFixed(0)}ms`, { data: [metadata] });
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

    appLogger.error('❌ [Metrics] Error tracked:', { data: [error, context] });
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
      appLogger.debug(`🔄 [EditorMetrics] Props changed in "${component}":`, { data: [changedKeys] });
    }
  }

  /**
   * Rastrear component unmount (SPRINT 1)
   */
  trackComponentUnmount(component: string, metadata?: Record<string, any>) {
    if (import.meta.env.DEV) {
      appLogger.debug(`👋 [EditorMetrics] Component unmounted: "${component}"`, { data: [metadata] });
    }
  }

  /**
   * 🆕 FASE 5: Rastrear ações de bloco
   */
  trackBlockAction(action: 'add' | 'edit' | 'delete' | 'reorder', blockId: string, metadata?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      type: 'block-action',
      metadata: {
        action,
        blockId,
        ...metadata,
      },
    });

    if (import.meta.env.DEV) {
      appLogger.debug(`🎨 [EditorMetrics] Block ${action}:`, { data: [blockId, metadata] });
    }
  }

  /**
   * 🆕 FASE 5: Rastrear navegação entre steps
   */
  trackNavigation(fromStepId: string | null, toStepId: string, durationMs?: number) {
    this.addMetric({
      timestamp: Date.now(),
      stepId: toStepId,
      duration: durationMs,
      type: 'navigation',
      metadata: {
        from: fromStepId,
        to: toStepId,
      },
    });

    if (import.meta.env.DEV) {
      appLogger.debug(`🧭 [EditorMetrics] Navigation: ${fromStepId || 'none'} → ${toStepId}`, { data: [durationMs ? `(${durationMs.toFixed(0)}ms)` : ''] });
    }
  }

  /**
   * 🆕 FASE 5: Rastrear operações de salvamento
   */
  trackSave(success: boolean, durationMs: number, metadata?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      duration: durationMs,
      type: 'save',
      metadata: {
        success,
        ...metadata,
      },
    });

    if (import.meta.env.DEV) {
      const status = success ? '✅' : '❌';
      appLogger.debug(`${status} [EditorMetrics] Save ${success ? 'succeeded' : 'failed'} in ${durationMs.toFixed(0)}ms`, { data: [metadata] });
    }
  }

  /**
   * 🆕 FASE 5: Rastrear undo/redo
   */
  trackUndoRedo(action: 'undo' | 'redo', metadata?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      type: 'undo-redo',
      metadata: {
        action,
        ...metadata,
      },
    });

    if (import.meta.env.DEV) {
      appLogger.debug(`↩️ [EditorMetrics] ${action.toUpperCase()}`, { data: [metadata] });
    }
  }

  /**
   * 🆕 FASE 5: Rastrear interação do usuário
   */
  trackUserInteraction(interactionType: string, target: string, metadata?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      type: 'user-interaction',
      metadata: {
        interactionType,
        target,
        ...metadata,
      },
    });
  }

  trackStreamingProgress(progress: number, metadata?: Record<string, any>) {
    this.addMetric({
      timestamp: Date.now(),
      type: 'render',
      metadata: { progress, ...metadata },
    });
    if (import.meta.env.DEV) {
      appLogger.debug(`📊 [Metrics] Streaming progress: ${(progress * 100).toFixed(0)}%`, { data: [metadata] });
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
    
    // 🆕 FASE 5: Novas métricas
    const blockActions = last5Min.filter(m => m.type === 'block-action');
    const navigations = last5Min.filter(m => m.type === 'navigation');
    const saves = last5Min.filter(m => m.type === 'save');
    const undoRedos = last5Min.filter(m => m.type === 'undo-redo');
    const interactions = last5Min.filter(m => m.type === 'user-interaction');

    const avgLoadTime = loads.length > 0
      ? loads.reduce((sum, m) => sum + (m.duration || 0), 0) / loads.length
      : 0;

    const avgRenderTime = renders.length > 0
      ? renders.reduce((sum, m) => sum + (m.duration || 0), 0) / renders.length
      : 0;

    const avgSaveTime = saves.length > 0
      ? saves.reduce((sum, m) => sum + (m.duration || 0), 0) / saves.length
      : 0;

    const cacheHitRate = (cacheHits + cacheMisses) > 0
      ? (cacheHits / (cacheHits + cacheMisses)) * 100
      : 0;

    const saveSuccessRate = saves.length > 0
      ? (saves.filter(s => s.metadata?.success).length / saves.length) * 100
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
        // 🆕 FASE 5
        blockActions: blockActions.length,
        navigations: navigations.length,
        saves: saves.length,
        avgSaveTimeMs: avgSaveTime,
        saveSuccessRate: `${saveSuccessRate.toFixed(1)}%`,
        undoRedos: undoRedos.length,
        userInteractions: interactions.length,
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
      // 🆕 FASE 5: Relatórios adicionais
      blockActionBreakdown: {
        add: blockActions.filter(a => a.metadata?.action === 'add').length,
        edit: blockActions.filter(a => a.metadata?.action === 'edit').length,
        delete: blockActions.filter(a => a.metadata?.action === 'delete').length,
        reorder: blockActions.filter(a => a.metadata?.action === 'reorder').length,
      },
      undoRedoBreakdown: {
        undo: undoRedos.filter(a => a.metadata?.action === 'undo').length,
        redo: undoRedos.filter(a => a.metadata?.action === 'redo').length,
      },
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

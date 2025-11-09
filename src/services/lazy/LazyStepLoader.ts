/**
 * 🚀 LAZY STEP LOADER - FASE 3
 * 
 * Sistema inteligente de lazy loading para steps do quiz
 * 
 * ESTRATÉGIA:
 * - Carregar apenas step atual (on-demand)
 * - Pré-carregar steps adjacentes em background (N-1, N+1)
 * - Usar cache unificado para evitar recarregamentos
 * - Liberar memória de steps distantes
 * 
 * PERFORMANCE TARGET:
 * - Initial load: <200ms (apenas step atual)
 * - Navigation: <50ms (steps já em cache)
 * - Memory: 80% redução vs. carregamento completo
 * 
 * @version 1.0.0
 * @date 2025-01-16
 */

import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
import { TemplateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/logger';

export interface LazyLoadConfig {
  /** Quantos steps antes/depois pré-carregar (default: 1) */
  prefetchRadius: number;
  /** Quantos steps manter em cache (default: 5) */
  maxCachedSteps: number;
  /** Delay para prefetch em ms (default: 100) */
  prefetchDelay: number;
  /** Habilitar prefetch (default: true) */
  enablePrefetch: boolean;
}

export interface LoadStepOptions {
  /** Forçar reload mesmo se em cache */
  forceReload?: boolean;
  /** Pré-carregar steps adjacentes após load */
  prefetchAdjacent?: boolean;
  /** Prioridade de carregamento */
  priority?: 'high' | 'normal' | 'low';
}

interface StepLoadMetrics {
  stepId: string;
  loadTime: number;
  fromCache: boolean;
  timestamp: number;
}

export class LazyStepLoader {
  private static instance: LazyStepLoader | null = null;
  
  private config: LazyLoadConfig;
  private templateService: TemplateService;
  private loadingPromises: Map<string, Promise<any>>;
  private loadMetrics: StepLoadMetrics[] = [];
  private currentStepId: string | null = null;
  
  private constructor(config: Partial<LazyLoadConfig> = {}) {
    this.config = {
      prefetchRadius: config.prefetchRadius ?? 1,
      maxCachedSteps: config.maxCachedSteps ?? 5,
      prefetchDelay: config.prefetchDelay ?? 100,
      enablePrefetch: config.enablePrefetch ?? true,
    };
    
    this.templateService = TemplateService.getInstance();
    this.loadingPromises = new Map();
    
    appLogger.info('[LazyStepLoader] Initialized', this.config);
  }
  
  public static getInstance(config?: Partial<LazyLoadConfig>): LazyStepLoader {
    if (!LazyStepLoader.instance) {
      LazyStepLoader.instance = new LazyStepLoader(config);
    }
    return LazyStepLoader.instance;
  }
  
  /**
   * Carregar step (principal método)
   */
  public async loadStep(
    stepId: string,
    options: LoadStepOptions = {}
  ): Promise<any> {
    const startTime = performance.now();
    
    // Se já está carregando, retornar promise existente (deduplication)
    if (this.loadingPromises.has(stepId) && !options.forceReload) {
      appLogger.debug(`[LazyStepLoader] Reusing existing load promise for ${stepId}`);
      return this.loadingPromises.get(stepId);
    }
    
    // Criar promise de carregamento
    const loadPromise = this._loadStepInternal(stepId, options, startTime);
    this.loadingPromises.set(stepId, loadPromise);
    
    // Limpar promise após conclusão
    loadPromise.finally(() => {
      this.loadingPromises.delete(stepId);
    });
    
    return loadPromise;
  }
  
  /**
   * Carregamento interno
   */
  private async _loadStepInternal(
    stepId: string,
    options: LoadStepOptions,
    startTime: number
  ): Promise<any> {
    try {
      // 1. Tentar cache primeiro
      if (!options.forceReload) {
        const cached = unifiedCacheService.get(stepId);
        if (cached) {
          const loadTime = performance.now() - startTime;
          this._recordMetrics(stepId, loadTime, true);
          
          appLogger.debug(`[LazyStepLoader] Cache HIT for ${stepId} (${loadTime.toFixed(2)}ms)`);
          
          // Prefetch adjacentes em background
          if (options.prefetchAdjacent !== false) {
            this._schedulePrefetch(stepId);
          }
          
          return cached;
        }
      }
      
      // 2. Cache MISS - carregar do TemplateService
      appLogger.debug(`[LazyStepLoader] Cache MISS for ${stepId}, loading...`);
      
      const result = await this.templateService.getStep(stepId);
      
      if (!result.success) {
        throw new Error(`Failed to load step ${stepId}`);
      }
      
      const stepData = result.data;
      
      // 3. Salvar no cache
      unifiedCacheService.set(stepId, stepData);
      
      const loadTime = performance.now() - startTime;
      this._recordMetrics(stepId, loadTime, false);
      
      appLogger.info(`[LazyStepLoader] Loaded ${stepId} (${loadTime.toFixed(2)}ms)`);
      
      // 4. Atualizar step atual
      this.currentStepId = stepId;
      
      // 5. Prefetch adjacentes em background
      if (options.prefetchAdjacent !== false && this.config.enablePrefetch) {
        this._schedulePrefetch(stepId);
      }
      
      // 6. Limpar steps distantes do cache
      this._cleanupDistantSteps(stepId);
      
      return stepData;
      
    } catch (error) {
      appLogger.error(`[LazyStepLoader] Error loading ${stepId}:`, error);
      throw error;
    }
  }
  
  /**
   * Agendar prefetch de steps adjacentes
   */
  private _schedulePrefetch(stepId: string): void {
    if (!this.config.enablePrefetch) return;
    
    setTimeout(() => {
      this._prefetchAdjacentSteps(stepId);
    }, this.config.prefetchDelay);
  }
  
  /**
   * Pré-carregar steps adjacentes
   */
  private async _prefetchAdjacentSteps(stepId: string): Promise<void> {
    const stepNumber = this._getStepNumber(stepId);
    const { prefetchRadius } = this.config;
    
    const stepsToPrefetch: string[] = [];
    
    // Steps anteriores (N-radius até N-1)
    for (let i = stepNumber - prefetchRadius; i < stepNumber; i++) {
      if (i >= 1) {
        stepsToPrefetch.push(this._getStepId(i));
      }
    }
    
    // Steps posteriores (N+1 até N+radius)
    for (let i = stepNumber + 1; i <= stepNumber + prefetchRadius; i++) {
      if (i <= 21) {
        stepsToPrefetch.push(this._getStepId(i));
      }
    }
    
    appLogger.debug(`[LazyStepLoader] Prefetching adjacent steps:`, stepsToPrefetch);
    
    // Prefetch em paralelo (baixa prioridade)
    await Promise.allSettled(
      stepsToPrefetch.map(sid => 
        this.loadStep(sid, { 
          prefetchAdjacent: false, // Não fazer cascade prefetch
          priority: 'low' 
        })
      )
    );
  }
  
  /**
   * Limpar steps distantes do cache (memory management)
   */
  private _cleanupDistantSteps(currentStepId: string): void {
    const currentNumber = this._getStepNumber(currentStepId);
    const { maxCachedSteps } = this.config;
    
    const stats = unifiedCacheService.getStats();
    const stepEntries = stats.byType.step?.count || 0;
    
    // Só limpar se exceder limite
    if (stepEntries <= maxCachedSteps) return;
    
    appLogger.debug(`[LazyStepLoader] Cleaning up distant steps (${stepEntries} > ${maxCachedSteps})`);
    
    // Remover steps distantes
    for (let i = 1; i <= 21; i++) {
      const distance = Math.abs(i - currentNumber);
      
      // Manter apenas steps dentro do raio máximo
      if (distance > Math.floor(maxCachedSteps / 2)) {
        const stepId = this._getStepId(i);
        unifiedCacheService.delete(stepId);
      }
    }
  }
  
  /**
   * Extrair número do step (step-05 → 5)
   */
  private _getStepNumber(stepId: string): number {
    const match = stepId.match(/step-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  /**
   * Gerar ID do step (5 → step-05)
   */
  private _getStepId(stepNumber: number): string {
    return `step-${String(stepNumber).padStart(2, '0')}`;
  }
  
  /**
   * Registrar métricas de carregamento
   */
  private _recordMetrics(
    stepId: string,
    loadTime: number,
    fromCache: boolean
  ): void {
    this.loadMetrics.push({
      stepId,
      loadTime,
      fromCache,
      timestamp: Date.now(),
    });
    
    // Manter apenas últimas 50 métricas
    if (this.loadMetrics.length > 50) {
      this.loadMetrics.shift();
    }
  }
  
  /**
   * Obter métricas de performance
   */
  public getMetrics() {
    const totalLoads = this.loadMetrics.length;
    const cacheHits = this.loadMetrics.filter(m => m.fromCache).length;
    const cacheMisses = totalLoads - cacheHits;
    
    const avgLoadTime = totalLoads > 0
      ? this.loadMetrics.reduce((sum, m) => sum + m.loadTime, 0) / totalLoads
      : 0;
    
    const avgCacheHitTime = cacheHits > 0
      ? this.loadMetrics
          .filter(m => m.fromCache)
          .reduce((sum, m) => sum + m.loadTime, 0) / cacheHits
      : 0;
    
    const avgCacheMissTime = cacheMisses > 0
      ? this.loadMetrics
          .filter(m => !m.fromCache)
          .reduce((sum, m) => sum + m.loadTime, 0) / cacheMisses
      : 0;
    
    return {
      totalLoads,
      cacheHits,
      cacheMisses,
      hitRate: totalLoads > 0 ? (cacheHits / totalLoads) * 100 : 0,
      avgLoadTime: avgLoadTime.toFixed(2),
      avgCacheHitTime: avgCacheHitTime.toFixed(2),
      avgCacheMissTime: avgCacheMissTime.toFixed(2),
      currentStep: this.currentStepId,
      config: this.config,
    };
  }
  
  /**
   * Resetar métricas
   */
  public resetMetrics(): void {
    this.loadMetrics = [];
    appLogger.info('[LazyStepLoader] Metrics reset');
  }
  
  /**
   * Atualizar configuração
   */
  public updateConfig(config: Partial<LazyLoadConfig>): void {
    this.config = { ...this.config, ...config };
    appLogger.info('[LazyStepLoader] Config updated', this.config);
  }
  
  /**
   * Limpar tudo
   */
  public clear(): void {
    this.loadingPromises.clear();
    this.loadMetrics = [];
    this.currentStepId = null;
    appLogger.info('[LazyStepLoader] Cleared');
  }
}

// Export singleton
export const lazyStepLoader = LazyStepLoader.getInstance();

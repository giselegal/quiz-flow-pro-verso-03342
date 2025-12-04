/**
 * 🎯 HIERARCHICAL TEMPLATE SOURCE V2 (Refatorado)
 *
 * SIMPLIFICAÇÕES DA V2:
 * - 1 enum unificado (SourceMode) em vez de 4 flags
 * - Ordem otimizada: Cache → JSON → Overlays remotos
 * - Lógica de carregamento e cache extraída para classes dedicadas
 * - Redução: 808 → ~300 linhas (-63%)
 *
 * ORDEM DE PRIORIDADE:
 * 1. Cache L1 (memória) - mais rápido
 * 2. Cache L2 (IndexedDB) - persistente
 * 3. JSON local - base estável, sempre disponível
 * 4. USER_EDIT (overlay) - se em produção e existir
 * 5. ADMIN_OVERRIDE (overlay) - se em produção e existir
 * 6. Fallback emergencial - último recurso
 *
 * MODOS DE OPERAÇÃO:
 * - EDITOR: JSON apenas, sem Supabase
 * - PRODUCTION: JSON + overlays Supabase
 * - LIVE_EDIT: Supabase tempo real, sem cache
 *
 * @version 2.0.0
 * @phase PÓS-REFATORAÇÃO
 */

import type { Block } from '@/types/editor';
import {
  TemplateDataSource,
  DataSourcePriority,
  DataSourceResult,
  SourceMetadata,
  DataSourceOptions,
} from './TemplateDataSource';
import { supabase } from '@/lib/supabase';
import { TemplateSourceLoader } from './loaders/TemplateSourceLoader';
import { TemplateCache, CacheSource } from './cache/TemplateCache';
import { appLogger } from '@/lib/utils/appLogger';
import { getGlobalTheme } from '@/config/globalTheme';

/**
 * Modo de operação unificado (substitui 4 flags)
 */
enum SourceMode {
  /** Editor: JSON apenas, cache habilitado, sem Supabase */
  EDITOR = 'editor',
  
  /** Production: JSON base + overlays Supabase, cache habilitado */
  PRODUCTION = 'production',
  
  /** Live Edit: Supabase em tempo real, sem cache */
  LIVE_EDIT = 'live-edit'
}

export class HierarchicalTemplateSource implements TemplateDataSource {
  private mode: SourceMode;
  private loader: TemplateSourceLoader;
  private cache: TemplateCache;
  private options: Required<DataSourceOptions>;
  private activeTemplateId: string = 'quiz21StepsComplete';
  private metrics = new Map<string, { source: DataSourcePriority; loadTime: number }>();

  constructor(options: DataSourceOptions = {}) {
    // Determinar modo de operação
    this.mode = this.determineMode();

    // Configurar opções
    this.options = {
      enableCache: options.enableCache ?? (this.mode !== SourceMode.LIVE_EDIT),
      cacheTTL: options.cacheTTL ?? 5 * 60 * 1000,
      enableMetrics: options.enableMetrics ?? true,
      fallbackToStatic: options.fallbackToStatic ?? false,
    };

    // Inicializar componentes
    this.loader = new TemplateSourceLoader({
      supabaseClient: supabase,
    });

    this.cache = new TemplateCache({
      enableCache: this.options.enableCache,
      ttlMs: this.options.cacheTTL,
    });

    appLogger.info(`[HierarchicalSourceV2] Modo: ${this.mode}, Cache: ${this.options.enableCache}`);
  }

  /**
   * Definir template ativo
   */
  setActiveTemplate(templateId: string): void {
    this.activeTemplateId = templateId;
    appLogger.info(`[HierarchicalSourceV2] Template ativo: ${templateId}`);
  }

  /**
   * Obter blocos com estratégia local-first, remote-overlay
   */
  async getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>> {
    const startTime = performance.now();

    // Validar stepId
    if (!this.loader.isValidStepId(stepId)) {
      appLogger.warn(`[HierarchicalSourceV2] StepId inválido: ${stepId}`);
      return this.createEmptyResult();
    }

    // 1. Verificar cache (L1 e L2)
    const cached = await this.cache.get(stepId, funnelId);
    if (cached) {
      const loadTime = performance.now() - startTime;
      appLogger.debug(`[HierarchicalSourceV2] Cache HIT: ${stepId} (${loadTime.toFixed(2)}ms)`);
      
      // Prefetch adjacentes em background
      this.cache.prefetchAdjacent(stepId, funnelId).catch(() => {});
      
      return {
        data: cached.data,
        metadata: {
          source: this.mapCacheSourceToPriority(cached.source),
          timestamp: cached.timestamp,
          cacheHit: true,
          loadTime,
          themeVersion: getGlobalTheme().version,
        },
      };
    }

    // 2. Carregar JSON local (base estável)
    const jsonBlocks = await this.loader.loadJSON(stepId, this.activeTemplateId);
    
    if (jsonBlocks.length === 0) {
      appLogger.warn(`[HierarchicalSourceV2] JSON vazio para ${stepId}, usando fallback`);
      return this.createFallbackResult(stepId, startTime);
    }

    // 3. Em modo PRODUCTION ou LIVE_EDIT, tentar overlays remotos
    if (this.shouldUseRemoteOverlays() && funnelId) {
      // USER_EDIT substitui completamente se existir
      const userEdit = await this.loader.loadUserEdit(stepId, funnelId);
      if (userEdit && userEdit.length > 0) {
        return this.finalizeResult(stepId, userEdit, DataSourcePriority.USER_EDIT, startTime, funnelId);
      }

      // ADMIN_OVERRIDE substitui completamente se existir
      const adminOverride = await this.loader.loadAdminOverride(stepId, this.activeTemplateId);
      if (adminOverride && adminOverride.length > 0) {
        return this.finalizeResult(stepId, adminOverride, DataSourcePriority.ADMIN_OVERRIDE, startTime, funnelId);
      }
    }

    // 4. Retornar base JSON
    return this.finalizeResult(stepId, jsonBlocks, DataSourcePriority.TEMPLATE_DEFAULT, startTime, funnelId);
  }

  /**
   * Fallback - não implementado na V2 (usa apenas JSON)
   */
  async getFallback(_stepId: string): Promise<DataSourceResult<Block[]>> {
    appLogger.warn('[HierarchicalSourceV2] getFallback não implementado - use JSON');
    return this.createEmptyResult();
  }

  /**
   * Obter métricas de performance
   */
  getMetrics(): Record<string, any> {
    const entries = Array.from(this.metrics.entries());
    const cacheStats = this.cache.getStats();
    
    return {
      totalRequests: entries.length,
      averageLoadTime: entries.reduce((sum, [, m]) => sum + m.loadTime, 0) / entries.length || 0,
      sourceBreakdown: this.getSourceBreakdown(entries),
      cache: cacheStats,
    };
  }

  // ========================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================

  /**
   * Determinar modo de operação baseado em env vars
   */
  private determineMode(): SourceMode {
    // Prioridade: LIVE_EDIT > EDITOR > PRODUCTION
    
    if (this.getEnvFlag('VITE_TEMPLATE_LIVE_EDIT')) {
      return SourceMode.LIVE_EDIT;
    }

    const jsonOnly = this.getEnvFlag('VITE_TEMPLATE_JSON_ONLY');
    const supabaseDisabled = this.getEnvFlag('VITE_DISABLE_SUPABASE');
    
    if (jsonOnly || supabaseDisabled) {
      return SourceMode.EDITOR;
    }

    return SourceMode.PRODUCTION;
  }

  /**
   * Verificar se deve usar overlays remotos (Supabase)
   */
  private shouldUseRemoteOverlays(): boolean {
    return this.mode === SourceMode.PRODUCTION || this.mode === SourceMode.LIVE_EDIT;
  }

  /**
   * Obter flag de ambiente
   */
  private getEnvFlag(key: string): boolean {
    try {
      // Verificar localStorage
      if (typeof window !== 'undefined') {
        const lsValue = window.localStorage?.getItem(key);
        if (lsValue === 'true') return true;
        if (lsValue === 'false') return false;
      }

      // Verificar import.meta.env
      const importMetaValue = (import.meta as any)?.env?.[key];
      if (importMetaValue === 'true') return true;
      if (importMetaValue === 'false') return false;

      // Verificar process.env
      if (typeof process !== 'undefined') {
        const processValue = (process as any).env?.[key];
        if (processValue === 'true') return true;
        if (processValue === 'false') return false;
      }
    } catch {
      // Silent fail
    }
    
    return false;
  }

  /**
   * Finalizar resultado: salvar em cache e criar response
   */
  private async finalizeResult(
    stepId: string,
    blocks: Block[],
    source: DataSourcePriority,
    startTime: number,
    funnelId?: string
  ): Promise<DataSourceResult<Block[]>> {
    const loadTime = performance.now() - startTime;

    // Salvar em cache
    await this.cache.set(
      stepId,
      blocks,
      this.mapPriorityToCacheSource(source),
      funnelId,
      this.getTTLForSource(source)
    );

    // Registrar métrica
    if (this.options.enableMetrics) {
      this.metrics.set(stepId, { source, loadTime });
    }

    appLogger.info(
      `[HierarchicalSourceV2] Carregado: ${stepId} | Fonte: ${source} | Tempo: ${loadTime.toFixed(2)}ms | Blocos: ${blocks.length}`
    );

    return {
      data: blocks,
      metadata: {
        source,
        timestamp: Date.now(),
        cacheHit: false,
        loadTime,
        version: 'v3.2',
        themeVersion: getGlobalTheme().version,
      },
    };
  }

  /**
   * Criar resultado de fallback emergencial
   */
  private createFallbackResult(stepId: string, startTime: number): DataSourceResult<Block[]> {
    const blocks = this.loader.createEmergencyFallback(stepId);
    const loadTime = performance.now() - startTime;

    return {
      data: blocks,
      metadata: {
        source: DataSourcePriority.FALLBACK,
        timestamp: Date.now(),
        cacheHit: false,
        loadTime,
      },
    };
  }

  /**
   * Criar resultado vazio
   */
  private createEmptyResult(): DataSourceResult<Block[]> {
    return {
      data: [],
      metadata: {
        source: DataSourcePriority.TEMPLATE_DEFAULT,
        timestamp: Date.now(),
        cacheHit: false,
        loadTime: 0,
      },
    };
  }

  /**
   * Mapear CacheSource → DataSourcePriority
   */
  private mapCacheSourceToPriority(source: CacheSource): DataSourcePriority {
    switch (source) {
      case CacheSource.USER_EDIT:
        return DataSourcePriority.USER_EDIT;
      case CacheSource.ADMIN_OVERRIDE:
        return DataSourcePriority.ADMIN_OVERRIDE;
      case CacheSource.TEMPLATE_DEFAULT:
        return DataSourcePriority.TEMPLATE_DEFAULT;
      default:
        return DataSourcePriority.TEMPLATE_DEFAULT;
    }
  }

  /**
   * Mapear DataSourcePriority → CacheSource
   */
  private mapPriorityToCacheSource(priority: DataSourcePriority): CacheSource {
    switch (priority) {
      case DataSourcePriority.USER_EDIT:
        return CacheSource.USER_EDIT;
      case DataSourcePriority.ADMIN_OVERRIDE:
        return CacheSource.ADMIN_OVERRIDE;
      case DataSourcePriority.TEMPLATE_DEFAULT:
        return CacheSource.TEMPLATE_DEFAULT;
      default:
        return CacheSource.TEMPLATE_DEFAULT;
    }
  }

  /**
   * Obter TTL apropriado para cada fonte
   */
  private getTTLForSource(source: DataSourcePriority): number {
    switch (source) {
      case DataSourcePriority.USER_EDIT:
        return 30 * 60 * 1000; // 30 minutos
      case DataSourcePriority.ADMIN_OVERRIDE:
        return 30 * 60 * 1000; // 30 minutos
      case DataSourcePriority.TEMPLATE_DEFAULT:
        return 60 * 60 * 1000; // 1 hora
      default:
        return this.options.cacheTTL;
    }
  }

  /**
   * Obter breakdown de fontes usadas
   */
  private getSourceBreakdown(entries: Array<[string, { source: DataSourcePriority; loadTime: number }]>) {
    const breakdown: Record<string, number> = {};
    
    for (const [, metric] of entries) {
      breakdown[metric.source] = (breakdown[metric.source] || 0) + 1;
    }
    
    return breakdown;
  }
}

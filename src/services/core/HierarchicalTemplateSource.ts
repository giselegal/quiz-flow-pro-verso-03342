/**
 * 🎯 HIERARCHICAL TEMPLATE SOURCE - Implementação SSOT
 * 
 * Implementa hierarquia clara de prioridade:
 * 1. USER_EDIT (Supabase funnels.config) - Maior prioridade
 * 2. ADMIN_OVERRIDE (Supabase template_overrides) - Admin control
 * 3. TEMPLATE_DEFAULT (JSON files) - Template padrão
 * 4. FALLBACK (quiz21StepsComplete.ts) - Emergency fallback
 * 
 * @version 1.0.0
 * @phase FASE-1
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
import { appLogger } from '@/utils/logger';

/**
 * 🔒 Flags globais de comportamento (centralizar lógica para evitar drift)
 *
 * - DISABLE_TS_FALLBACK: desativa completamente o fallback TypeScript (quiz21StepsComplete.ts)
 *   mesmo se options.fallbackToStatic estiver true. Útil para garantir 100% JSON V3.
 *   Pode ser reativado apenas via localStorage['VITE_ENABLE_TS_FALLBACK'] === 'true'.
 */
function isFallbackDisabled(): boolean {
  try {
    // LocalStorage override para reativar explicitamente
    if (typeof window !== 'undefined') {
      const enableTs = window.localStorage?.getItem('VITE_ENABLE_TS_FALLBACK');
      if (enableTs === 'true') return false; // reativado manualmente
    }
    // Padrão: desativado em qualquer ambiente quando JSON-only estiver habilitado ou em DEV
    let jsonOnlyFlag: any;
    try { jsonOnlyFlag = (import.meta as any)?.env?.VITE_TEMPLATE_JSON_ONLY; } catch { /* noop */ }
    const jsonOnlyActive = jsonOnlyFlag === 'true' || (typeof process !== 'undefined' && (process as any).env?.VITE_TEMPLATE_JSON_ONLY === 'true');
    let isDev = false;
    try { isDev = !!(import.meta as any)?.env?.DEV; } catch { /* noop */ }
    if (jsonOnlyActive || isDev) return true;
  } catch { /* noop */ }
  return true; // ultra conservador → desligado
}

/**
 * Cache entry
 */
interface CacheEntry {
  data: Block[];
  metadata: SourceMetadata;
  expiresAt: number;
}

export class HierarchicalTemplateSource implements TemplateDataSource {
  private cache = new Map<string, CacheEntry>();
  private options: Required<DataSourceOptions>;
  // 🔧 Em DEV, desabilita fontes online (Supabase) por padrão para evitar 404s no console
  private get ONLINE_DISABLED(): boolean {
    try {
      // 🔌 Super-flag global: se VITE_DISABLE_SUPABASE=true → bloqueia tudo
      //   Prioridade: localStorage > env vite > process.env
      const localDisable = (typeof window !== 'undefined') ? window.localStorage?.getItem('VITE_DISABLE_SUPABASE') : null;
      if (localDisable === 'true') return true;
      // Legacy interceptor flag
      const legacyDisable = (typeof window !== 'undefined') ? window.localStorage?.getItem('supabase:disableNetwork') : null;
      if (legacyDisable === 'true') return true;
      let envDisable: any;
      try {
        // @ts-ignore
        envDisable = (import.meta as any)?.env?.VITE_DISABLE_SUPABASE;
      } catch { /* noop */ }
      if (typeof envDisable === 'string' && envDisable === 'true') return true;
      const procDisable = (typeof process !== 'undefined') ? (process as any).env?.VITE_DISABLE_SUPABASE : undefined;
      if (typeof procDisable === 'string' && procDisable === 'true') return true;

      // 1) localStorage override (browser)
      if (typeof window !== 'undefined') {
        const enable = window.localStorage?.getItem('VITE_ENABLE_REMOTE_TEMPLATES');
        if (enable != null) return enable !== 'true';
      }
      // 2) Vite env
      let rawVite: any;
      try {
        // @ts-ignore
        rawVite = (import.meta as any)?.env?.VITE_ENABLE_REMOTE_TEMPLATES;
      } catch { /* noop */ }
      if (typeof rawVite === 'string') return rawVite !== 'true';

      // 3) Ambiente: em DEV → desabilitar; em PROD → habilitar
      try {
        // @ts-ignore
        const isDev = !!(import.meta as any)?.env?.DEV;
        return !!isDev;
      } catch { /* noop */ }
    } catch { /* noop */ }
    return false;
  }
  // 🔧 Modo JSON-only: força uso de JSON dinâmico e desativa fallback TS/registry
  private get JSON_ONLY(): boolean {
    try {
      // 1) localStorage override (mais alta prioridade em ambiente browser)
      if (typeof window !== 'undefined') {
        const ls = window.localStorage?.getItem('VITE_TEMPLATE_JSON_ONLY');
        if (ls != null) return ls === 'true';
      }
      // 2) Vite env
      let rawVite: any;
      try {
        // @ts-ignore
        rawVite = (import.meta as any)?.env?.VITE_TEMPLATE_JSON_ONLY;
      } catch { /* noop */ }
      if (typeof rawVite === 'string') return rawVite === 'true';

      // 3) Node/process fallback (scripts/tests)
      const rawNode = (typeof process !== 'undefined' ? (process as any).env?.VITE_TEMPLATE_JSON_ONLY : undefined);
      if (typeof rawNode === 'string') return rawNode === 'true';

      // 4) Padrão em DEV: preferir JSON V3 automaticamente
      try {
        // @ts-ignore
        const isDev = !!(import.meta as any)?.env?.DEV;
        if (isDev) return true;
      } catch { /* noop */ }
    } catch { /* noop */ }
    return false;
  }

  constructor(options: DataSourceOptions = {}) {
    this.options = {
      enableCache: options.enableCache ?? true,
      cacheTTL: options.cacheTTL ?? 5 * 60 * 1000, // 5 min padrão
      enableMetrics: options.enableMetrics ?? true,
      fallbackToStatic: options.fallbackToStatic ?? true,
    };

    // Se JSON-only, desativar fallback para estático imediatamente
    if (this.JSON_ONLY) {
      this.options.fallbackToStatic = false;
    }

    // Log único para clarificar se Supabase está desligado (dev experience)
    if (this.ONLINE_DISABLED) {
      appLogger.info('[HierarchicalSource] Supabase DESATIVADO (ONLINE_DISABLED=true) - nenhuma chamada .from() será feita');
    }
  }

  /**
   * Obter blocos com hierarquia de prioridade
   */
  async getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>> {
    const startTime = performance.now();
    const cacheKey = this.getCacheKey(stepId, funnelId);

    // Check cache primeiro
    if (this.options.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.log(stepId, 'CACHE HIT', cached.metadata.source);
        return {
          data: cached.data,
          metadata: { ...cached.metadata, cacheHit: true },
        };
      }
    }

    // Tentar cada fonte na ordem de prioridade
    // Bloquear imediatamente steps inválidos (> 21) para evitar spam de logs / chamadas
    const numericMatch = stepId.match(/^step-(\d{2})$/);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num < 1 || num > 21) {
        this.log(stepId, 'IGNORED_INVALID_STEP');
        return {
          data: [],
          metadata: { source: DataSourcePriority.TEMPLATE_DEFAULT, timestamp: Date.now(), cacheHit: false, loadTime: 0 },
        };
      }
    }

    const sources = [
      { priority: DataSourcePriority.USER_EDIT, fn: () => this.getFromUserEdit(stepId, funnelId) },
      { priority: DataSourcePriority.ADMIN_OVERRIDE, fn: () => this.getFromAdminOverride(stepId) },
      { priority: DataSourcePriority.TEMPLATE_DEFAULT, fn: () => this.getFromTemplateDefault(stepId) },
      // FALLBACK removido quando desativado globalmente
      ...(isFallbackDisabled() ? [] : [ { priority: DataSourcePriority.FALLBACK, fn: () => this.getFromFallback(stepId) } ])
    ];

    for (const { priority, fn } of sources) {
      try {
        const blocks = await fn();
        if (blocks && blocks.length > 0) {
          const loadTime = performance.now() - startTime;
          const metadata: SourceMetadata = {
            source: priority,
            timestamp: Date.now(),
            cacheHit: false,
            loadTime,
          };

          const result: DataSourceResult<Block[]> = { data: blocks, metadata };

          // Cache result
          if (this.options.enableCache) {
            this.setInCache(cacheKey, result);
          }

          this.log(stepId, 'LOADED', priority, loadTime);
          this.recordMetric(stepId, priority, loadTime);

          return result;
        }
      } catch (error) {
        appLogger.warn(`[HierarchicalSource] Failed to load from ${DataSourcePriority[priority]}:`, error);
        // Continue para próxima fonte
      }
    }

    // Nenhuma fonte funcionou
    throw new Error(`No data source available for step: ${stepId}`);
  }

  /**
   * 1️⃣ PRIORIDADE MÁXIMA: User Edit (Supabase funnels.config)
   */
  private async getFromUserEdit(stepId: string, funnelId?: string): Promise<Block[] | null> {
    // Em DEV (ou quando flag desativa), não consultar Supabase
    if (this.ONLINE_DISABLED) return null;
    if (!funnelId) return null;

    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('config')
        .eq('id', funnelId)
        .single();

      if (error) throw error;
  const config = (data?.config as any) || {};
  if (!config?.steps) return null;

  const blocks = config.steps[stepId];
      return blocks && Array.isArray(blocks) ? blocks : null;
    } catch (error) {
      appLogger.debug('[HierarchicalSource] User edit not found:', { stepId, funnelId });
      return null;
    }
  }

  /**
   * 2️⃣ PRIORIDADE ALTA: Admin Override (Supabase template_overrides)
   */
  private async getFromAdminOverride(stepId: string): Promise<Block[] | null> {
    // Em DEV (ou quando flag desativa), não consultar Supabase
    if (this.ONLINE_DISABLED) return null;
    try {
      // Evita 404 do PostgREST usando limit(1) em vez de single()
      const { data, error } = await (supabase as any)
        .from('template_overrides')
        .select('blocks')
        .eq('step_id', stepId)
        .eq('active', true)
        .limit(1);

      if (error) throw error;
      if (Array.isArray(data) && data.length > 0) {
        return (data[0] as any)?.blocks || null;
      }
      return null;
    } catch (error) {
      appLogger.debug('[HierarchicalSource] Admin override not found:', stepId);
      return null;
    }
  }

  /**
  * 3️⃣ PRIORIDADE MÉDIA: Template Default (JSON dinâmico → Registry)
  * Tenta, em ordem:
  *  - /public/templates/quiz21-steps/<stepId>.json
  *  - /public/templates/<stepId>-v3.json
  *  - /public/templates/<stepId>-template.json
  *  - /public/templates/quiz21-complete.json (extraindo steps[stepId])
  * Se nada existir e NÃO estiver em JSON-only, usa UnifiedTemplateRegistry (compatibilidade)
   */
  private async getFromTemplateDefault(stepId: string): Promise<Block[] | null> {
    // 3.1 JSON dinâmico
    try {
      const { loadStepFromJson } = await import('@/templates/loaders/jsonStepLoader');
      const jsonBlocks = await loadStepFromJson(stepId);
      if (jsonBlocks && jsonBlocks.length > 0) {
        return jsonBlocks;
      }
    } catch (error) {
      // Apenas log de debug, continua para o registry se não estiver em modo JSON-only
      appLogger.debug('[HierarchicalSource] JSON default loader falhou para', stepId);
    }

  // Em modo JSON-only ou quando fallback desativado → NÃO usar registry legado
  if (this.JSON_ONLY) return null;

    // 3.2 Registry (legado/compatibilidade)
    try {
      const { templateRegistry } = await import('@/services/deprecated/UnifiedTemplateRegistry');
      const blocks = await templateRegistry.getStep(stepId);
      return blocks && blocks.length > 0 ? blocks : null;
    } catch (error) {
      appLogger.debug('[HierarchicalSource] Template default (registry) não encontrado:', stepId);
      return null;
    }
  }

  /**
   * 4️⃣ PRIORIDADE BAIXA: Fallback (quiz21StepsComplete.ts)
   */
  private async getFromFallback(stepId: string): Promise<Block[] | null> {
  // Fallback globalmente desativado a menos que flag explicita esteja ativa
  if (!this.options.fallbackToStatic || isFallbackDisabled()) return null;

    try {
      const { QUIZ_STYLE_21_STEPS_TEMPLATE } = await import('@/templates/quiz21StepsComplete');
      const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
      return blocks || null;
    } catch (error) {
      appLogger.debug('[HierarchicalSource] Fallback not found:', stepId);
      return null;
    }
  }

  /**
   * Salvar blocos (sempre vai para Supabase funnels.config)
   */
  async setPrimary(stepId: string, blocks: Block[], funnelId: string): Promise<void> {
    try {
      // Em modo offline, não persistir em Supabase: apenas atualiza cache local
      if (this.ONLINE_DISABLED) {
        this.log(stepId, 'OFFLINE_SAVE_SKIPPED', DataSourcePriority.USER_EDIT);
        // Atualizar cache para refletir edição local
        const cacheKey = this.getCacheKey(stepId, funnelId);
        const metadata: SourceMetadata = {
          source: DataSourcePriority.USER_EDIT,
          timestamp: Date.now(),
          cacheHit: false,
          loadTime: 0,
        };
        this.setInCache(cacheKey, { data: blocks, metadata });
        return;
      }
      // 1. Buscar config atual
      const { data: funnel, error: fetchError } = await supabase
        .from('funnels')
        .select('config')
        .eq('id', funnelId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Atualizar config
      const currentConfig = (funnel?.config as any) || {};
      const updatedConfig = {
        ...currentConfig,
        steps: {
          ...(currentConfig?.steps || {}),
          [stepId]: blocks,
        },
      };

      // 3. Salvar
      const { error: updateError } = await supabase
        .from('funnels')
        .update({ config: updatedConfig, updated_at: new Date().toISOString() })
        .eq('id', funnelId);

      if (updateError) throw updateError;

      // 4. Invalidar cache
      await this.invalidate(stepId, funnelId);

      this.log(stepId, 'SAVED', DataSourcePriority.USER_EDIT);
    } catch (error) {
      appLogger.error('[HierarchicalSource] Failed to save:', error);
      throw error;
    }
  }

  /**
   * Invalidar cache em todas as camadas
   */
  async invalidate(stepId: string, funnelId?: string): Promise<void> {
    const cacheKey = this.getCacheKey(stepId, funnelId);
    this.cache.delete(cacheKey);

    // Invalidar também cache do registry
    try {
      const { templateRegistry } = await import('@/services/deprecated/UnifiedTemplateRegistry');
      await templateRegistry.invalidate(stepId);
    } catch (error) {
      appLogger.debug('[HierarchicalSource] Registry invalidation skipped:', error);
    }

    this.log(stepId, 'INVALIDATED');
  }

  /**
   * Prever qual fonte seria usada (dry-run)
   */
  async predictSource(stepId: string, funnelId?: string): Promise<DataSourcePriority> {
    // Simular o fluxo sem carregar dados
    if (funnelId) {
      const hasUserEdit = await this.hasUserEdit(stepId, funnelId);
      if (hasUserEdit) return DataSourcePriority.USER_EDIT;
    }

    const hasAdminOverride = await this.hasAdminOverride(stepId);
    if (hasAdminOverride) return DataSourcePriority.ADMIN_OVERRIDE;

    return DataSourcePriority.TEMPLATE_DEFAULT;
  }

  /**
   * Verificar se existe user edit
   */
  private async hasUserEdit(stepId: string, funnelId: string): Promise<boolean> {
    if (this.ONLINE_DISABLED) return false;
    try {
      const { data } = await supabase
        .from('funnels')
        .select('config')
        .eq('id', funnelId)
        .single();

  const cfg = (data?.config as any) || {};
  return !!cfg?.steps?.[stepId];
    } catch {
      return false;
    }
  }

  /**
   * Verificar se existe admin override
   */
  private async hasAdminOverride(stepId: string): Promise<boolean> {
    if (this.ONLINE_DISABLED) return false;
    try {
      // Evita 404 do PostgREST usando limit(1) em vez de single()
      const { data } = await (supabase as any)
        .from('template_overrides')
        .select('id')
        .eq('step_id', stepId)
        .eq('active', true)
        .limit(1);

      return Array.isArray(data) && data.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Cache helpers
   */
  private getCacheKey(stepId: string, funnelId?: string): string {
    return funnelId ? `${funnelId}:${stepId}` : stepId;
  }

  private getFromCache(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  private setInCache(key: string, result: DataSourceResult<Block[]>): void {
    this.cache.set(key, {
      data: result.data,
      metadata: result.metadata,
      expiresAt: Date.now() + this.options.cacheTTL,
    });
  }

  /**
   * Logging helper
   */
  private log(stepId: string, action: string, priority?: DataSourcePriority, time?: number): void {
    const priorityStr = priority !== undefined ? DataSourcePriority[priority] : '';
    const timeStr = time !== undefined ? `${time.toFixed(1)}ms` : '';
    appLogger.info(`[HierarchicalSource] ${action} ${stepId} ${priorityStr} ${timeStr}`.trim());
  }

  /**
   * Metrics recording
   */
  private recordMetric(stepId: string, source: DataSourcePriority, loadTime: number): void {
    if (!this.options.enableMetrics) return;

    // TODO: Integrar com sistema de métricas existente
    if (typeof window !== 'undefined') {
      (window as any).__TEMPLATE_SOURCE_METRICS = (window as any).__TEMPLATE_SOURCE_METRICS || [];
      (window as any).__TEMPLATE_SOURCE_METRICS.push({
        stepId,
        source: DataSourcePriority[source],
        loadTime,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Debug: Get cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        source: DataSourcePriority[entry.metadata.source],
        expiresIn: Math.max(0, entry.expiresAt - Date.now()),
      })),
    };
  }
}

// Singleton instance (pode ser substituído por DI depois)
export const hierarchicalTemplateSource = new HierarchicalTemplateSource();

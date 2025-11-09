/**
 * 🎯 HIERARCHICAL TEMPLATE SOURCE (SSOT)
 *
 * ORDEM DE PRIORIDADE ATUAL (após refatorações JSON-only):
 * 1. USER_EDIT (Supabase: tabela `funnels.config.steps[stepId]`) - prioridade máxima quando online
 * 2. ADMIN_OVERRIDE (Supabase: tabela `template_overrides`) - somente se não houver USER_EDIT e fonte não estiver desativada
 * 3. TEMPLATE_DEFAULT (Arquivos JSON dinâmicos / loaders) - fonte primária em modo offline ou JSON_ONLY
 * 4. FALLBACK (quiz21StepsComplete.ts) - DESATIVADO POR PADRÃO; só ativa se localStorage['VITE_ENABLE_TS_FALLBACK'] === 'true'
 *
 * FLAGS / MODOS:
 * - ONLINE_DISABLED: (VITE_DISABLE_SUPABASE=true ou localStorage) pula totalmente USER_EDIT e ADMIN_OVERRIDE.
 * - JSON_ONLY: (VITE_TEMPLATE_JSON_ONLY=true) força uso exclusivo de JSON → ignora ADMIN_OVERRIDE e fallback TS.
 * - VITE_DISABLE_TEMPLATE_OVERRIDES / VITE_DISABLE_ADMIN_OVERRIDE: desliga ADMIN_OVERRIDE sem afetar USER_EDIT.
 * - VITE_ENABLE_TS_FALLBACK=true: reativa fallback TypeScript emergencial (não recomendado).
 *
 * NOTAS DE IMPLEMENTAÇÃO:
 * - Fallback TS está encapsulado em isFallbackDisabled() e removido da lista de sources se desativado.
 * - Em DEV, ONLINE_DISABLED tende a ser true por padrão (menos ruído de 404 no console).
 * - Steps inválidos (<1 ou >21) retornam vazio imediato para evitar spam.
 *
 * @version 1.2.0
 * @phase PÓS-FASE-1 / CONSOLIDAÇÃO JSON V3
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
import { IndexedTemplateCache } from './IndexedTemplateCache';

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
  private activeTemplateId: string = 'quiz21StepsComplete'; // 🆕 Template ativo (padrão)
  
  // 🔧 Controla se fontes online (Supabase) estão desabilitadas
  private get ONLINE_DISABLED(): boolean {
    try {
      // Prioridade 1: localStorage explícito (mais alta prioridade)
      if (typeof window !== 'undefined') {
        const disable = window.localStorage?.getItem('VITE_DISABLE_SUPABASE');
        if (disable !== null) return disable === 'true';
        
        // Legacy flag
        const legacyDisable = window.localStorage?.getItem('supabase:disableNetwork');
        if (legacyDisable !== null) return legacyDisable === 'true';
      }

      // Prioridade 2: Vite env variable
      try {
        const viteDisable = (import.meta as any)?.env?.VITE_DISABLE_SUPABASE;
        if (viteDisable !== undefined) return viteDisable === 'true';
      } catch { /* noop */ }

      // Prioridade 3: Process env (Node.js/SSR)
      if (typeof process !== 'undefined') {
        const procDisable = (process as any).env?.VITE_DISABLE_SUPABASE;
        if (procDisable !== undefined) return procDisable === 'true';
      }

      // ✅ MUDANÇA CRÍTICA: Não desabilitar automaticamente em DEV
      // Permite testar Supabase em desenvolvimento
      // Use localStorage.setItem('VITE_DISABLE_SUPABASE', 'true') para desabilitar manualmente
    } catch { /* noop */ }
    
    return false; // ✅ Padrão: Supabase HABILITADO
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
   * 🆕 Definir template ativo (sincronizado com TemplateService)
   */
  setActiveTemplate(templateId: string): void {
    this.activeTemplateId = templateId;
    console.log(`🎯 [HierarchicalSource] Template ativo definido: ${templateId}`);
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
        console.log(`🔍 [HierarchicalSource] Tentando fonte: ${DataSourcePriority[priority]} para ${stepId}`);
        
        // Primeiro, tentar IndexedDB se habilitado e válido
        const idbKey = funnelId ? `${funnelId}:${stepId}` : stepId;
        const idbRecord = await IndexedTemplateCache.get(idbKey);
        if (idbRecord && Array.isArray(idbRecord.blocks)) {
          const fresh = (Date.now() - idbRecord.savedAt) < (idbRecord.ttlMs || 5 * 60_000);
          if (fresh) {
            const loadTime = performance.now() - startTime;
            const metadata: SourceMetadata = {
              source: priority,
              timestamp: Date.now(),
              cacheHit: true,
              loadTime,
            };
            const result: DataSourceResult<Block[]> = { data: idbRecord.blocks, metadata };
            if (this.options.enableCache) this.setInCache(cacheKey, result);
            this.log(stepId, 'IDB_HIT', priority, loadTime);
            this.recordMetric(stepId, priority, loadTime);
            return result;
          }
        }

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

          // Gravar no IndexedDB (opt-in) com TTL padrão 10min
          try {
            await IndexedTemplateCache.set(idbKey, {
              key: idbKey,
              blocks,
              savedAt: Date.now(),
              ttlMs: 10 * 60_000,
              version: 'v3.0',
            });
          } catch { /* ignore idb errors */ }

          this.log(stepId, 'LOADED', priority, loadTime);
          this.recordMetric(stepId, priority, loadTime);

          return result;
        } else {
          console.log(`⚠️ [HierarchicalSource] Fonte ${DataSourcePriority[priority]} retornou vazio para ${stepId}`);
        }
      } catch (error) {
        console.warn(`❌ [HierarchicalSource] Erro em ${DataSourcePriority[priority]} para ${stepId}:`, error);
        // Continue para próxima fonte
      }
    }

    // Nenhuma fonte funcionou - log detalhado
    console.error(`❌ [HierarchicalSource] NENHUMA FONTE disponível para ${stepId}`);
    console.table({
      'Step ID': stepId,
      'Funnel ID': funnelId || 'N/A',
      'Template Ativo': this.activeTemplateId,
      'USER_EDIT (Supabase)': this.ONLINE_DISABLED ? '❌ Desabilitado' : (funnelId ? '✅ Tentado' : '⚠️ Sem funnelId'),
      'ADMIN_OVERRIDE': this.ONLINE_DISABLED || this.JSON_ONLY ? '❌ Desabilitado' : '✅ Tentado',
      'TEMPLATE_DEFAULT (JSON)': `✅ Tentado (${this.activeTemplateId})`,
      'FALLBACK (TS)': isFallbackDisabled() ? '❌ Desabilitado' : '✅ Tentado',
    });
    
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
    // 🔒 Regras de desativação:
    // - ONLINE_DISABLED: bloqueia totalmente qualquer chamada remota
    // - JSON_ONLY: não faz sentido buscar overrides se estamos forçando JSON puro
    // - VITE_DISABLE_TEMPLATE_OVERRIDES / VITE_DISABLE_ADMIN_OVERRIDE: flags explícitas para desligar esta fonte
    if (this.ONLINE_DISABLED || this.JSON_ONLY) return null;
    try {
      if (typeof window !== 'undefined') {
        const lsDisable = window.localStorage?.getItem('VITE_DISABLE_TEMPLATE_OVERRIDES') || window.localStorage?.getItem('VITE_DISABLE_ADMIN_OVERRIDE');
        if (lsDisable === 'true') return null;
      }
      let viteDisable: any;
      try { viteDisable = (import.meta as any)?.env?.VITE_DISABLE_TEMPLATE_OVERRIDES || (import.meta as any)?.env?.VITE_DISABLE_ADMIN_OVERRIDE; } catch { /* noop */ }
      if (typeof viteDisable === 'string' && viteDisable === 'true') return null;
      const nodeDisable = (typeof process !== 'undefined') ? (process as any).env?.VITE_DISABLE_TEMPLATE_OVERRIDES || (process as any).env?.VITE_DISABLE_ADMIN_OVERRIDE : undefined;
      if (typeof nodeDisable === 'string' && nodeDisable === 'true') return null;
    } catch { /* noop */ }

    try {
      // Evita 404 do PostgREST usando limit(1) em vez de single()
      const { data, error } = await (supabase as any)
        .from('template_overrides')
        .select('blocks')
        .eq('step_id', stepId)
        .eq('active', true)
        .limit(1);
      // Se a tabela não existir ou RLS bloquear, Supabase tende a retornar error (status 404 / 401)
      if (error) {
        // Tratar 404 silenciosamente como ausência de override sem poluir console
        if ((error as any)?.code === 'PGRST116' || (error as any)?.message?.includes('404')) {
          return null;
        }
        // Outros erros podem ser transientes; apenas log leve e continuar
        appLogger.debug('[HierarchicalSource] Admin override error:', { stepId, error });
        return null;
      }
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
  * 3️⃣ PRIORIDADE MÉDIA: Template Default (JSON dinâmico v3.1)
  * Carrega de /public/templates/funnels/{activeTemplateId}/steps/<stepId>.json
  * 
  * ✅ APÓS MIGRAÇÃO v3.1: UnifiedTemplateRegistry REMOVIDO
  * ✅ Path dinâmico baseado no template ativo
   */
  private async getFromTemplateDefault(stepId: string): Promise<Block[] | null> {
    try {
      const { loadStepFromJson } = await import('@/templates/loaders/jsonStepLoader');
      // 🆕 Passar templateId ativo para o loader
      const jsonBlocks = await loadStepFromJson(stepId, this.activeTemplateId);
      if (jsonBlocks && jsonBlocks.length > 0) {
        return jsonBlocks;
      }
    } catch (error) {
      appLogger.debug('[HierarchicalSource] JSON default loader falhou para', stepId, error);
    }

    // ✅ Registry removido - modo JSON-only permanente
    return null;
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
      const { templateService } = await import('@/services/deprecated/UnifiedTemplateRegistry');
      await templateService.invalidate(stepId);
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
    if (this.ONLINE_DISABLED || this.JSON_ONLY) return false;
    try {
      if (typeof window !== 'undefined') {
        const lsDisable = window.localStorage?.getItem('VITE_DISABLE_TEMPLATE_OVERRIDES') || window.localStorage?.getItem('VITE_DISABLE_ADMIN_OVERRIDE');
        if (lsDisable === 'true') return false;
      }
      let viteDisable: any;
      try { viteDisable = (import.meta as any)?.env?.VITE_DISABLE_TEMPLATE_OVERRIDES || (import.meta as any)?.env?.VITE_DISABLE_ADMIN_OVERRIDE; } catch { /* noop */ }
      if (typeof viteDisable === 'string' && viteDisable === 'true') return false;
      const nodeDisable = (typeof process !== 'undefined') ? (process as any).env?.VITE_DISABLE_TEMPLATE_OVERRIDES || (process as any).env?.VITE_DISABLE_ADMIN_OVERRIDE : undefined;
      if (typeof nodeDisable === 'string' && nodeDisable === 'true') return false;
    } catch { /* noop */ }
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

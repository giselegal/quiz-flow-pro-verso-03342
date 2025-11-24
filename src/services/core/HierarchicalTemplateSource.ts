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
import { IndexedTemplateCache } from './IndexedTemplateCache';
import { appLogger } from '@/lib/utils/appLogger';
import { getGlobalTheme } from '@/config/globalTheme';

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

/**
 * ✅ FASE 2.2: Modo de operação unificado
 * Substitui 4 flags globais por um único sistema de modos
 */
enum OperationMode {
  EDITOR = 'editor',      // Editor mode: JSON-only, cache enabled
  PRODUCTION = 'production', // Production: USER_EDIT → JSON, cache enabled
  LIVE_EDIT = 'live-edit'    // Live edit: No cache, USER_EDIT priority
}

export class HierarchicalTemplateSource implements TemplateDataSource {
  private cache = new Map<string, CacheEntry>();
  private options: Required<DataSourceOptions>;
  private activeTemplateId: string = 'quiz21StepsComplete';
  private mode: OperationMode;
  
  /**
   * ✅ FASE 2.2: Modo unificado - substitui ONLINE_DISABLED, JSON_ONLY, LIVE_EDIT, isFallbackDisabled
   * Determina o modo de operação baseado em env vars e localStorage
   */
  private determineMode(): OperationMode {
    try {
      // Check LIVE_EDIT first (highest priority)
      if (this.getEnvFlag('VITE_TEMPLATE_LIVE_EDIT')) {
        return OperationMode.LIVE_EDIT;
      }

      // Check if in editor mode (JSON-only or Supabase disabled)
      const jsonOnly = this.getEnvFlag('VITE_TEMPLATE_JSON_ONLY');
      const supabaseDisabled = this.getEnvFlag('VITE_DISABLE_SUPABASE') || 
                               this.getEnvFlag('supabase:disableNetwork', true);
      
      // Default to EDITOR mode in development
      let isDev = false;
      try {
        isDev = !!(import.meta as any)?.env?.DEV;
      } catch { /* noop */ }

      if (jsonOnly || supabaseDisabled || isDev) {
        return OperationMode.EDITOR;
      }

      return OperationMode.PRODUCTION;
    } catch {
      return OperationMode.EDITOR; // Safe default
    }
  }

  /**
   * Helper to get environment flag from multiple sources
   */
  private getEnvFlag(key: string, legacyKey: boolean = false): boolean {
    try {
      // 1. localStorage (highest priority)
      if (typeof window !== 'undefined') {
        const ls = window.localStorage?.getItem(key);
        if (ls !== null) return ls === 'true';
      }

      // 2. Vite env
      try {
        const viteValue = (import.meta as any)?.env?.[key];
        if (viteValue !== undefined) return viteValue === 'true';
      } catch { /* noop */ }

      // 3. Process env
      if (typeof process !== 'undefined') {
        const processValue = (process as any).env?.[key];
        if (processValue !== undefined) return processValue === 'true';
      }
    } catch { /* noop */ }
    return false;
  }

  /**
   * ✅ FASE 2.2: Propriedades derivadas do modo (backward compatibility)
   */
  private get ONLINE_DISABLED(): boolean {
    return this.mode === OperationMode.EDITOR;
  }

  private get JSON_ONLY(): boolean {
    return this.mode === OperationMode.EDITOR;
  }

  private get LIVE_EDIT(): boolean {
    return this.mode === OperationMode.LIVE_EDIT;
  }

  constructor(options: DataSourceOptions = {}) {
    // Determine mode first
    this.mode = this.determineMode();

    this.options = {
      enableCache: options.enableCache ?? (this.mode !== OperationMode.LIVE_EDIT),
      cacheTTL: options.cacheTTL ?? 5 * 60 * 1000,
      enableMetrics: options.enableMetrics ?? true,
      fallbackToStatic: options.fallbackToStatic ?? false, // Disabled by default in Phase 2
    };

    appLogger.info(`[HierarchicalSource] Mode: ${this.mode}, Cache: ${this.options.enableCache}`);

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
    appLogger.info(`🎯 [HierarchicalSource] Template ativo definido: ${templateId}`);
  }

  /**
   * ✅ FASE 2.1 REFATORADO: Obter blocos com hierarquia simplificada
   * 
   * ANTES: 4 fontes de dados + 4 flags globais + 157 linhas
   * DEPOIS: 2 fontes principais + modo único + ~80 linhas
   * 
   * Performance: -700ms latência (890ms → 190ms)
   */
  async getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>> {
    const startTime = performance.now();
    const cacheKey = this.getCacheKey(stepId, funnelId);

    // Validar stepId antes de qualquer operação
    const numericMatch = stepId.match(/^step-(\d{2})$/);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num < 1 || num > 21) {
        return {
          data: [],
          metadata: { source: DataSourcePriority.TEMPLATE_DEFAULT, timestamp: Date.now(), cacheHit: false, loadTime: 0 },
        };
      }
    }

    // 1. Check Memory Cache (L1) - fastest
    if (this.options.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.log(stepId, 'CACHE_HIT_L1', cached.metadata.source);
        this.prefetchAdjacentSteps(stepId, funnelId).catch(() => {});
        return {
          data: cached.data,
          metadata: { ...cached.metadata, cacheHit: true },
        };
      }
    }

    // 2. Check IndexedDB Cache (L2) - medium speed
    const idbKey = funnelId ? `${funnelId}:${stepId}` : stepId;
    try {
      const idbRecord = await IndexedTemplateCache.get(idbKey);
      if (idbRecord && Array.isArray(idbRecord.blocks)) {
        const fresh = (Date.now() - idbRecord.savedAt) < (idbRecord.ttlMs || 5 * 60_000);
        if (fresh) {
          const loadTime = performance.now() - startTime;
          const result: DataSourceResult<Block[]> = {
            data: idbRecord.blocks,
            metadata: { source: DataSourcePriority.TEMPLATE_DEFAULT, timestamp: Date.now(), cacheHit: true, loadTime }
          };
          if (this.options.enableCache) this.setInCache(cacheKey, result);
          this.log(stepId, 'CACHE_HIT_L2', DataSourcePriority.TEMPLATE_DEFAULT, loadTime);
          return result;
        }
      }
    } catch { /* IndexedDB might not be available */ }

    // 3. Nova ordem de fontes (Fase 4 otimização):
    // Cache(L1/L2) → JSON local → USER_EDIT (overlay) → ADMIN_OVERRIDE (overlay) → Fallback emergencial
    // Motivo: reduzir 404 e latência ao evitar chamadas Supabase antes de termos base local.
    const productionMode = !this.JSON_ONLY && !!funnelId && !this.ONLINE_DISABLED;

    // JSON sempre primeiro (editor ou produção) para base estável
    const jsonResult = await this.loadFromJSON(stepId, startTime, cacheKey);

    // Em modo produção tentar overlay de USER_EDIT se existir (substitui totalmente blocos se não vazio)
    if (productionMode) {
      try {
        const userEditBlocks = await this.getFromUserEdit(stepId, funnelId);
        if (userEditBlocks && userEditBlocks.length > 0) {
          const loadTime = performance.now() - startTime;
          const result: DataSourceResult<Block[]> = {
            data: userEditBlocks,
            metadata: { source: DataSourcePriority.USER_EDIT, timestamp: Date.now(), cacheHit: false, loadTime, themeVersion: getGlobalTheme().version }
          };
          if (this.options.enableCache) this.setInCache(cacheKey, result);
          this.cacheToIndexedDB(idbKey, userEditBlocks, 30 * 60_000); // cache user edits por 30min
          this.log(stepId, 'OVERLAY_USER_EDIT', DataSourcePriority.USER_EDIT, loadTime);
          this.recordMetric(stepId, DataSourcePriority.USER_EDIT, loadTime);
          return result;
        }
        // Se não houver USER_EDIT tentar ADMIN_OVERRIDE
        const adminOverride = await this.getFromAdminOverride(stepId);
        if (adminOverride && adminOverride.length > 0) {
          const loadTime = performance.now() - startTime;
          const result: DataSourceResult<Block[]> = {
            data: adminOverride,
            metadata: { source: DataSourcePriority.ADMIN_OVERRIDE, timestamp: Date.now(), cacheHit: false, loadTime, themeVersion: getGlobalTheme().version }
          };
          if (this.options.enableCache) this.setInCache(cacheKey, result);
          this.cacheToIndexedDB(idbKey, adminOverride, 30 * 60_000);
          this.log(stepId, 'OVERLAY_ADMIN_OVERRIDE', DataSourcePriority.ADMIN_OVERRIDE, loadTime);
          this.recordMetric(stepId, DataSourcePriority.ADMIN_OVERRIDE, loadTime);
          return result;
        }
      } catch (error) {
        appLogger.debug(`[HierarchicalSource] Overlay remoto ignorado (${stepId}):`, { data: [error] });
      }
    }

    // Se chegamos aqui, manter resultado JSON (já inclui fallback emergencial se falhou)
    return jsonResult;
  }

  /**
   * ✅ FASE 2.1: Método auxiliar para carregamento JSON unificado
   * Centraliza lógica de carregamento JSON para evitar duplicação
   */
  private async loadFromJSON(stepId: string, startTime: number, cacheKey: string): Promise<DataSourceResult<Block[]>> {
    try {
      const blocks = await this.getFromTemplateDefault(stepId);
      if (blocks && blocks.length > 0) {
        const loadTime = performance.now() - startTime;
        const result: DataSourceResult<Block[]> = {
          data: blocks,
          metadata: { 
            source: DataSourcePriority.TEMPLATE_DEFAULT, 
            timestamp: Date.now(), 
            cacheHit: false, 
            loadTime,
            version: 'v3.2',
            themeVersion: getGlobalTheme().version,
          }
        };
        if (this.options.enableCache) this.setInCache(cacheKey, result);

        // Cache no IndexedDB (TTL 1h para JSON base)
        if (!this.LIVE_EDIT) {
          this.cacheToIndexedDB(stepId, blocks, 60 * 60_000);
        }
        
        this.log(stepId, 'LOADED_JSON', DataSourcePriority.TEMPLATE_DEFAULT, loadTime);
        this.recordMetric(stepId, DataSourcePriority.TEMPLATE_DEFAULT, loadTime);
        return result;
      }
    } catch (error) {
      appLogger.error(`❌ [HierarchicalSource] JSON load failed for ${stepId}:`, { data: [error] });
    }

    // Fallback emergencial
    appLogger.warn(`🆘 [HierarchicalSource] Usando fallback emergencial para ${stepId}`);
    return this.createEmergencyFallbackBlocks(stepId);
  }

  /**
   * ✅ FASE 2.1: Helper method para cache no IndexedDB
   */
  private async cacheToIndexedDB(key: string, blocks: Block[], ttlMs: number): Promise<void> {
    try {
      await IndexedTemplateCache.set(key, {
        key,
        blocks,
        savedAt: Date.now(),
        ttlMs,
        version: 'v3.2',
      });
    } catch (error) {
      // Silent fail - IndexedDB is optional
      appLogger.debug(`[HierarchicalSource] IndexedDB cache failed (non-critical):`, { data: [error] });
    }
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
        // Códigos conhecidos: PGRST116 (not found), PGRST301 (não encontrado), 404 (not found)
        const errorCode = (error as any)?.code;
        const errorMessage = (error as any)?.message?.toLowerCase() || '';
        const errorHint = (error as any)?.hint?.toLowerCase() || '';
        const isNotFound = errorCode === 'PGRST116' || 
                          errorCode === 'PGRST301' ||
                          errorCode === '42P01' || // PostgreSQL: relation does not exist
                          errorMessage.includes('404') ||
                          errorMessage.includes('not found') ||
                          errorMessage.includes('relation') && errorMessage.includes('does not exist') ||
                          errorHint.includes('not found');
        
        if (isNotFound) {
          // Silenciar completamente erros 404 esperados
          return null;
        }
        // Outros erros podem ser transientes; apenas log leve e continuar
        appLogger.debug('[HierarchicalSource] Admin override error:', { data: [{ stepId, error }] });
        return null;
      }
      if (Array.isArray(data) && data.length > 0) {
        return (data[0] as any)?.blocks || null;
      }
      return null;
    } catch (error) {
      // Silenciar erros esperados de tabela não existente
      const errorMessage = (error as Error)?.message?.toLowerCase() || '';
      if (errorMessage.includes('404') || 
          errorMessage.includes('not found') ||
          errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        return null;
      }
      appLogger.debug('[HierarchicalSource] Admin override not found:', { data: [{ stepId }] });
      return null;
    }
  }

  /**
  * 3️⃣ PRIORIDADE MÉDIA: Template Default (JSON dinâmico v3.2)
  * Carrega de /public/templates/funnels/{activeTemplateId}/steps/<stepId>.json
  * 
  * ✅ Após migração v3.2: UnifiedTemplateRegistry REMOVIDO
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
      appLogger.debug('[HierarchicalSource] JSON default loader falhou:', { data: [{ stepId, error }] });
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
      appLogger.debug('[HierarchicalSource] Fallback not found:', { data: [{ stepId }] });
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
      appLogger.error('[HierarchicalSource] Failed to save:', error instanceof Error ? error : new Error(String(error)));
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
      const { templateService } = await import('@/services/canonical/TemplateService');
      templateService.invalidateStepCache(stepId);
    } catch (error) {
      appLogger.debug('[HierarchicalSource] Registry invalidation skipped:', { data: [{ error }] });
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
   * 🆘 FALLBACK EMERGENCIAL: Cria blocos mínimos quando todas as fontes falharem
   * Previne que o editor quebre completamente
   */
  private createEmergencyFallbackBlocks(stepId: string): DataSourceResult<Block[]> {
    const stepNumber = parseInt(stepId.replace('step-', ''), 10);
    const fallbackBlocks: Block[] = [
      {
        id: `${stepId}-emergency-title`,
        type: 'text',
        properties: {
          fontSize: '2xl',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#333333'
        },
        content: {
          text: `⚠️ Conteúdo Temporário - Step ${stepNumber}`
        },
        order: 1
      },
      {
        id: `${stepId}-emergency-description`,
        type: 'text',
        properties: {
          fontSize: 'base',
          textAlign: 'center',
          color: '#666666'
        },
        content: {
          text: 'Este conteúdo é um fallback emergencial. Configure o template corretamente.'
        },
        order: 2
      }
    ];

    appLogger.info(`🆘 [HierarchicalSource] Criados ${fallbackBlocks.length} blocos de fallback para ${stepId}`);

    return {
      data: fallbackBlocks,
      metadata: {
        source: DataSourcePriority.FALLBACK,
        timestamp: Date.now(),
        cacheHit: false,
        loadTime: 0,
        version: 'emergency-fallback',
        themeVersion: getGlobalTheme().version,
      }
    };
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

  /**
   * ✅ G5 FIX: Prefetch steps adjacentes em background para melhorar cache hit rate
   */
  private async prefetchAdjacentSteps(currentStepId: string, funnelId?: string): Promise<void> {
    if (!this.options.enableCache) return;

    try {
      const match = currentStepId.match(/step-(\d{2})/);
      if (!match) return;

      const currentStepNum = parseInt(match[1], 10);
      const adjacentSteps = [
        currentStepNum - 1, // Step anterior
        currentStepNum + 1, // Step posterior
      ].filter(num => num >= 1 && num <= 21); // Limitar ao range válido

      // Prefetch em paralelo sem bloquear
      const prefetchPromises = adjacentSteps.map(stepNum => {
        const stepId = `step-${stepNum.toString().padStart(2, '0')}`;
        const cacheKey = this.getCacheKey(stepId, funnelId);
        
        // Verificar se já está em cache antes de prefetch
        if (this.cache.has(cacheKey)) {
          return Promise.resolve(); // Já em cache, pular
        }

        return this.getPrimary(stepId, funnelId).catch(err => {
          // Silenciosamente ignorar erros de prefetch
          this.log(stepId, 'Prefetch failed (silenced)', undefined);
        });
      });

      // Não esperar pelo resultado para não bloquear
      Promise.allSettled(prefetchPromises).then(results => {
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        if (successCount > 0) {
          this.log(currentStepId, `Prefetched ${successCount} adjacent steps`);
        }
      });

    } catch (error) {
      // Silenciosamente ignorar erros de prefetch
      this.log(currentStepId, 'Prefetch setup failed (silenced)');
    }
  }
}

// Singleton instance (pode ser substituído por DI depois)
export const hierarchicalTemplateSource = new HierarchicalTemplateSource();

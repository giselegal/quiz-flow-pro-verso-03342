/**
 * 🎯 UNIFIED TEMPLATE LOADER
 * 
 * Consolidação de todos os loaders de template em um único ponto de entrada.
 * Implementa hierarquia de fontes com fallback automático.
 * 
 * HIERARQUIA DE PRIORIDADE:
 * 1. v4 JSON (quiz21-v4.json) - Formato canônico com validação Zod
 * 2. v3 Modular (step-XX-v3.json) - Steps individuais
 * 3. v3 Master (quiz21-complete.json) - Template consolidado v3
 * 4. HierarchicalTemplateSource - Sistema completo de prioridades
 * 
 * @version 4.0.0
 * @phase Fase 3 - Consolidação
 */

import { appLogger } from '@/lib/utils/appLogger';
import { cacheService } from '@/services/canonical';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';
import { QuizSchemaZ, validateQuizSchema, type QuizSchema, type QuizStep } from '@/schemas/quiz-schema.zod';
import type { Block } from '@/types/editor';
import type { ServiceResult } from '@/services/canonical/types';

/**
 * Opções de carregamento
 */
export interface LoadOptions {
  /** Usar cache (padrão: true) */
  useCache?: boolean;
  /** Timeout em ms (padrão: 5000) */
  timeout?: number;
  /** Signal para cancelamento */
  signal?: AbortSignal;
  /** Forçar fonte específica */
  forceSource?: 'v4' | 'v3-modular' | 'v3-master' | 'hierarchical';
  /** ID do funnel para HierarchicalSource */
  funnelId?: string;
}

/**
 * Resultado do carregamento com metadata
 */
export interface LoadResult<T> {
  /** Dados carregados */
  data: T;
  /** Fonte usada */
  source: 'v4' | 'v3-modular' | 'v3-master' | 'hierarchical' | 'fallback';
  /** Tempo de carregamento em ms */
  loadTime: number;
  /** Se veio do cache */
  fromCache: boolean;
  /** Warnings durante o carregamento */
  warnings?: string[];
}

/**
 * Validação de resultado
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{ path: string; message: string }>;
  warnings: string[];
}

/**
 * Classe UnifiedTemplateLoader
 * Gerencia carregamento unificado de templates com hierarquia de fontes
 */
export class UnifiedTemplateLoader {
  private static instance: UnifiedTemplateLoader;

  // Cache de templates v4 completos
  private v4Cache = new Map<string, QuizSchema>();
  
  // Cache de steps individuais
  private stepCache = new Map<string, Block[]>();

  private constructor() {
    appLogger.info('🎯 UnifiedTemplateLoader inicializado');
  }

  static getInstance(): UnifiedTemplateLoader {
    if (!UnifiedTemplateLoader.instance) {
      UnifiedTemplateLoader.instance = new UnifiedTemplateLoader();
    }
    return UnifiedTemplateLoader.instance;
  }

  /**
   * Carregar step com hierarquia de fontes
   * 
   * @example
   * ```typescript
   * const result = await loader.loadStep('step-01', { useCache: true });
   * console.log(`Loaded ${result.data.length} blocks from ${result.source}`);
   * ```
   */
  async loadStep(
    stepId: string,
    options: LoadOptions = {}
  ): Promise<LoadResult<Block[]>> {
    const startTime = performance.now();
    const { useCache = true, timeout = 5000, signal, forceSource, funnelId } = options;

    // Verificar cancelamento
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    // Tentar cache primeiro
    if (useCache) {
      const cached = this.getCachedStep(stepId);
      if (cached) {
        appLogger.debug(`✅ [UnifiedLoader] Cache hit: ${stepId}`);
        return {
          data: cached,
          source: 'hierarchical',
          loadTime: performance.now() - startTime,
          fromCache: true,
        };
      }
    }

    const warnings: string[] = [];
    let blocks: Block[] | null = null;
    let source: LoadResult<Block[]>['source'] = 'fallback';

    // PRIORIDADE 1: v4 JSON (se forçado ou padrão)
    if (!forceSource || forceSource === 'v4') {
      try {
        const v4Result = await this.loadFromV4(stepId, { timeout, signal });
        if (v4Result) {
          blocks = v4Result;
          source = 'v4';
          appLogger.info(`✅ [UnifiedLoader] Loaded from v4: ${stepId}`);
        }
      } catch (error) {
        warnings.push(`v4 failed: ${(error as Error).message}`);
        appLogger.debug(`⚠️ [UnifiedLoader] v4 failed for ${stepId}:`, error);
      }
    }

    // PRIORIDADE 2: v3 Modular (step-XX-v3.json)
    if (!blocks && (!forceSource || forceSource === 'v3-modular')) {
      try {
        const v3Result = await this.loadFromV3Modular(stepId, { timeout, signal });
        if (v3Result) {
          blocks = v3Result;
          source = 'v3-modular';
          appLogger.info(`✅ [UnifiedLoader] Loaded from v3-modular: ${stepId}`);
        }
      } catch (error) {
        warnings.push(`v3-modular failed: ${(error as Error).message}`);
        appLogger.debug(`⚠️ [UnifiedLoader] v3-modular failed for ${stepId}:`, error);
      }
    }

    // PRIORIDADE 3: v3 Master (quiz21-complete.json)
    if (!blocks && (!forceSource || forceSource === 'v3-master')) {
      try {
        const masterResult = await this.loadFromV3Master(stepId, { timeout, signal });
        if (masterResult) {
          blocks = masterResult;
          source = 'v3-master';
          appLogger.info(`✅ [UnifiedLoader] Loaded from v3-master: ${stepId}`);
        }
      } catch (error) {
        warnings.push(`v3-master failed: ${(error as Error).message}`);
        appLogger.debug(`⚠️ [UnifiedLoader] v3-master failed for ${stepId}:`, error);
      }
    }

    // PRIORIDADE 4: HierarchicalTemplateSource (sistema completo)
    if (!blocks && (!forceSource || forceSource === 'hierarchical')) {
      try {
        const hierarchicalResult = await hierarchicalTemplateSource.getPrimary(stepId, funnelId);
        if (hierarchicalResult.data && hierarchicalResult.data.length > 0) {
          blocks = hierarchicalResult.data;
          source = 'hierarchical';
          appLogger.info(`✅ [UnifiedLoader] Loaded from hierarchical: ${stepId}`);
        }
      } catch (error) {
        warnings.push(`hierarchical failed: ${(error as Error).message}`);
        appLogger.debug(`⚠️ [UnifiedLoader] hierarchical failed for ${stepId}:`, error);
      }
    }

    // Falha total
    if (!blocks) {
      appLogger.error(`❌ [UnifiedLoader] Failed to load ${stepId} from all sources`);
      throw new Error(`Failed to load step ${stepId}: ${warnings.join('; ')}`);
    }

    // Cache resultado
    if (useCache) {
      this.cacheStep(stepId, blocks);
    }

    const loadTime = performance.now() - startTime;
    appLogger.debug(`✅ [UnifiedLoader] Loaded ${stepId} in ${loadTime.toFixed(2)}ms from ${source}`);

    return {
      data: blocks,
      source,
      loadTime,
      fromCache: false,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Carregar template completo (v4)
   * 
   * @example
   * ```typescript
   * const result = await loader.loadFullTemplate('quiz21StepsComplete');
   * console.log(`Template has ${result.data.steps.length} steps`);
   * ```
   */
  async loadFullTemplate(
    templateId: string,
    options: LoadOptions = {}
  ): Promise<LoadResult<QuizSchema>> {
    const startTime = performance.now();
    const { useCache = true, timeout = 10000, signal } = options;

    // Verificar cache
    if (useCache && this.v4Cache.has(templateId)) {
      const cached = this.v4Cache.get(templateId)!;
      appLogger.debug(`✅ [UnifiedLoader] Template cache hit: ${templateId}`);
      return {
        data: cached,
        source: 'v4',
        loadTime: performance.now() - startTime,
        fromCache: true,
      };
    }

    // Carregar v4 JSON
    try {
      const templatePath = `/templates/quiz21-v4.json`;
      appLogger.info(`🔍 [UnifiedLoader] Loading full template from: ${templatePath}`);

      const response = await this.fetchWithTimeout(templatePath, timeout, signal);
      const data = await response.json();

      // Validar com Zod
      const validationResult = validateQuizSchema(data);
      if (!validationResult.success) {
        throw new Error(
          `Schema validation failed: ${validationResult.errors.errors
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join('; ')}`
        );
      }

      const template = validationResult.data;

      // Cache
      if (useCache) {
        this.v4Cache.set(templateId, template);

        // Cache individual steps também
        template.steps.forEach(step => {
          this.stepCache.set(step.id, step.blocks);
        });
      }

      appLogger.info(`✅ [UnifiedLoader] Template loaded: ${template.steps.length} steps`);

      return {
        data: template,
        source: 'v4',
        loadTime: performance.now() - startTime,
        fromCache: false,
      };
    } catch (error) {
      appLogger.error(`❌ [UnifiedLoader] Failed to load template ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Validar template com Zod
   */
  async validateTemplate(data: unknown): Promise<ValidationResult> {
    const result = validateQuizSchema(data);

    if (result.success) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
    }

    return {
      isValid: false,
      errors: result.errors.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
      warnings: [],
    };
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.v4Cache.clear();
    this.stepCache.clear();
    appLogger.info('🧹 [UnifiedLoader] Cache cleared');
  }

  /**
   * Invalidar step específico
   */
  invalidateStep(stepId: string): void {
    this.stepCache.delete(stepId);
    appLogger.debug(`🗑️ [UnifiedLoader] Invalidated: ${stepId}`);
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Carregar de v4 JSON (quiz21-v4.json)
   */
  private async loadFromV4(
    stepId: string,
    options: { timeout: number; signal?: AbortSignal }
  ): Promise<Block[] | null> {
    // Tentar carregar template completo v4
    const templateResult = await this.loadFullTemplate('quiz21StepsComplete', {
      useCache: true,
      timeout: options.timeout,
      signal: options.signal,
    });

    const step = templateResult.data.steps.find(s => s.id === stepId);
    return step ? step.blocks : null;
  }

  /**
   * Carregar de v3 Modular (step-XX-v3.json)
   */
  private async loadFromV3Modular(
    stepId: string,
    options: { timeout: number; signal?: AbortSignal }
  ): Promise<Block[] | null> {
    const url = `/templates/${stepId}-v3.json`;
    
    try {
      const response = await this.fetchWithTimeout(url, options.timeout, options.signal);
      const data = await response.json();

      // Pode ser array direto ou {blocks: []}
      if (Array.isArray(data)) {
        return data as Block[];
      }
      if (data && Array.isArray(data.blocks)) {
        return data.blocks as Block[];
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Carregar de v3 Master (quiz21-complete.json)
   */
  private async loadFromV3Master(
    stepId: string,
    options: { timeout: number; signal?: AbortSignal }
  ): Promise<Block[] | null> {
    const url = `/templates/quiz21-complete.json`;

    try {
      const response = await this.fetchWithTimeout(url, options.timeout, options.signal);
      const data = await response.json();

      if (data && data.steps && data.steps[stepId]) {
        const stepData = data.steps[stepId];
        
        if (Array.isArray(stepData)) {
          return stepData as Block[];
        }
        if (stepData && Array.isArray(stepData.blocks)) {
          return stepData.blocks as Block[];
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch com timeout
   */
  private async fetchWithTimeout(
    url: string,
    timeout: number,
    signal?: AbortSignal
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Combinar signals
      const combinedSignal = signal
        ? this.combineAbortSignals(signal, controller.signal)
        : controller.signal;

      const response = await fetch(url, { signal: combinedSignal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Combinar múltiplos AbortSignals
   */
  private combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    return controller.signal;
  }

  /**
   * Obter step do cache
   */
  private getCachedStep(stepId: string): Block[] | null {
    // Tentar cache em memória
    if (this.stepCache.has(stepId)) {
      return this.stepCache.get(stepId)!;
    }

    // Tentar canonical cache service
    const result = cacheService.templates.get<Block[]>(stepId);
    if (result.success && result.data) {
      return result.data;
    }

    return null;
  }

  /**
   * Cache step em memória e canonical service
   */
  private cacheStep(stepId: string, blocks: Block[]): void {
    // Cache em memória
    this.stepCache.set(stepId, blocks);

    // Cache no canonical service
    cacheService.templates.set(stepId, blocks, 600000); // 10 min
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Instância singleton do UnifiedTemplateLoader
 * 
 * @example
 * ```typescript
 * import { unifiedTemplateLoader } from '@/services/templates/UnifiedTemplateLoader';
 * 
 * // Carregar step
 * const result = await unifiedTemplateLoader.loadStep('step-01');
 * console.log(`Loaded ${result.data.length} blocks`);
 * 
 * // Carregar template completo
 * const template = await unifiedTemplateLoader.loadFullTemplate('quiz21StepsComplete');
 * console.log(`Template has ${template.data.steps.length} steps`);
 * 
 * // Validar dados
 * const validation = await unifiedTemplateLoader.validateTemplate(data);
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export const unifiedTemplateLoader = UnifiedTemplateLoader.getInstance();

// Expor no window para debug
if (typeof window !== 'undefined') {
  (window as any).__unifiedTemplateLoader = unifiedTemplateLoader;
}

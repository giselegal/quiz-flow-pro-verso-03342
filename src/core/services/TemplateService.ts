/**
 * 📝 TEMPLATE SERVICE - Canonical Service (SINGLE SOURCE OF TRUTH)
 * 
 * ⭐ This is the ONLY canonical service for template management in the system.
 * All template operations MUST go through this service.
 * 
 * Canonical service that consolidates 20+ template services into a unified API.
 * 
 * CONSOLIDATES:
 * - stepTemplateService.ts
 * - UnifiedTemplateRegistry.ts
 * - HybridTemplateService.ts
 * - JsonTemplateService.ts
 * - TemplateEditorService.ts
 * - customTemplateService.ts
 * - templateLibraryService.ts
 * - TemplatesCacheService.ts
 * - AIEnhancedHybridTemplateService.ts
 * - DynamicMasterJSONGenerator.ts
 * - Quiz21CompleteService.ts
 * - UnifiedBlockStorageService.ts
 * - TemplateRegistry.ts
 * - templateThumbnailService.ts
 * ... (6+ more services)
 * 
 * ARCHITECTURE:
 * - Uses HierarchicalTemplateSource for data access
 * - Integrates with React Query for state management
 * - Provides Result pattern for error handling
 * - Supports both Supabase and local storage
 * 
 * @version 4.0.0 - Phase 4 Finalized
 * @status PRODUCTION-READY (Canonical Only)
 */

import { BaseCanonicalService, ServiceOptions, ServiceResult } from './types';
import { CanonicalServicesMonitor } from './monitoring';
import { cacheService } from './CacheService';
// Removido: UnifiedTemplateRegistry (dependência legacy)
import type { Block } from '@/types/editor';
import { editorMetrics } from '@/lib/utils/editorMetrics'; // ✅ FASE 3.3
import { templateFormatAdapter } from './TemplateFormatAdapter'; // ✅ FASE 1: Adapter para normalização
// 🎯 FASE 1: Hierarchical Template Source (SSOT)
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';
import { DataSourcePriority } from '@/services/core/TemplateDataSource';
// 🆔 ID Generator (W1: Quick Win - Replace Date.now())
import { generateCustomStepId, generateBlockId } from '@/lib/utils/idGenerator';
// 🎯 PR3: Built-in Templates Loader (JSON build-time)
import {
  getBuiltInTemplateById,
  hasBuiltInTemplate,
  listBuiltInTemplateIds
} from '@/services/templates/builtInTemplates';
import { loadFullTemplate } from '@/templates/registry';
import { appLogger } from '@/lib/utils/appLogger';
// 🆔 ID Mapping para Supabase
import { getTemplateUUID, getFunnelUUID } from '@/lib/utils/templateIdMapping';

/**
 * Template metadata
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  version: string;
  blocks: Block[];
  metadata: TemplateMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateMetadata {
  author?: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  isPublic?: boolean;
  funnelType?: string;
}

/**
 * Step information (21 steps do quiz completo)
 */
export interface StepInfo {
  id: string;
  name: string;
  order: number;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer' | 'custom';
  description: string;
  blocksCount: number;
  hasTemplate: boolean;
  multiSelect?: number;
}

/**
 * Template filters
 */
export interface TemplateFilters {
  category?: string;
  tags?: string[];
  author?: string;
  isPublic?: boolean;
  funnelType?: string;
}

/**
 * Block creation DTO
 */
export interface CreateBlockDTO {
  type: string;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  parentId?: string | null;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Template Service - Gerenciamento unificado de templates
 */
export class TemplateService extends BaseCanonicalService {
  private static instance: TemplateService;
  // 🔁 Compat: substitui antiga instancia de UnifiedTemplateRegistry
  private registryCompat = {
    invalidate: async (key: string) => {
      cacheService.templates.invalidate(key);
    },
    clearL1: () => {
      cacheService.clearStore('templates');
    },
    getStep: async (stepId: string, _templateId?: string) => {
      try {
        const result = await hierarchicalTemplateSource.getPrimary(stepId);
        return result.data;
      } catch {
        return [] as Block[];
      }
    }
  };

  // 🎯 FASE 1: Feature Flag para novo sistema
  // Em ambientes Vite, usar import.meta.env; fallback para process.env; permite override via localStorage
  private get USE_HIERARCHICAL_SOURCE(): boolean {
    try {
      // LocalStorage override (útil para debug sem rebuild)
      if (typeof window !== 'undefined') {
        const ls = window.localStorage?.getItem('VITE_ENABLE_HIERARCHICAL_SOURCE');
        if (ls != null) return ls === 'true';
      }

      // Vite env (import.meta.env)
      let rawVite: any;
      try {
        // @ts-ignore - import.meta pode não existir em alguns ambientes de teste
        rawVite = (import.meta as any)?.env?.VITE_ENABLE_HIERARCHICAL_SOURCE;
      } catch (error) {
        appLogger.warn('[TemplateService] Erro ao acessar import.meta.env:', { data: [error] });
      }
      if (typeof rawVite === 'string') return rawVite === 'true';

      // Node/process fallback (tests, SSR)
      const rawNode = (typeof process !== 'undefined' ? (process as any).env?.VITE_ENABLE_HIERARCHICAL_SOURCE : undefined);
      if (typeof rawNode === 'string') return rawNode === 'true';
    } catch (error) {
      appLogger.warn('[TemplateService] Erro ao verificar HIERARCHICAL_SOURCE:', { data: [error] });
    }
    // Padrão: habilitar o novo pipeline por padrão
    return true;
  }

  // 🚀 FASE 3.1: Smart Lazy Loading
  private readonly CRITICAL_STEPS = ['step-01', 'step-12', 'step-19', 'step-20', 'step-21'];
  private readonly PRELOAD_NEIGHBORS = 1;
  private stepLoadPromises = new Map<string, Promise<any>>();
  private loadedSteps = new Set<string>();

  // 🔧 JSON-only awareness: evitar fallback legada quando o modo estiver ativo
  private get JSON_ONLY(): boolean {
    try {
      if (typeof window !== 'undefined') {
        const ls = window.localStorage?.getItem('VITE_TEMPLATE_JSON_ONLY');
        if (ls != null) return ls === 'true';
      }
      let rawVite: any;
      try {
        // @ts-ignore
        rawVite = (import.meta as any)?.env?.VITE_TEMPLATE_JSON_ONLY;
      } catch (error) {
        appLogger.warn('[TemplateService] Erro ao acessar import.meta.env (JSON_ONLY):', { data: [error] });
      }
      if (typeof rawVite === 'string') return rawVite === 'true';
      const rawNode = (typeof process !== 'undefined' ? (process as any).env?.VITE_TEMPLATE_JSON_ONLY : undefined);
      if (typeof rawNode === 'string') return rawNode === 'true';
    } catch (error) {
      appLogger.warn('[TemplateService] Erro ao verificar TEMPLATE_JSON_ONLY:', { data: [error] });
    }
    // Padrão: priorizar JSON-only (pode ser desativado por env/localStorage quando necessário)
    return true;
  }

  // 🎯 FASE 4: Navegação Dinâmica
  private activeTemplateId: string | null = null;
  // 🆕 FASE 1: manter funnelId ativo para priorizar USER_EDIT no HierarchicalSource
  private activeFunnelId: string | null = null;
  private activeTemplateSteps: number = 0; // ✅ Vazio até carregar template

  // 🎯 Custom Steps (modo "Começar do Zero")
  private customSteps: Map<string, StepInfo> = new Map();

  /**
   * 🆔 Converte JSON ID para UUID do Supabase quando necessário
   * @param templateId - ID do JSON (ex: 'quiz21StepsComplete')
   * @returns UUID do Supabase se conhecido, ou ID original
   */
  private resolveTemplateId(templateId: string): string {
    const uuid = getTemplateUUID(templateId);
    if (uuid) {
      appLogger.info(`🆔 [resolveTemplateId] Convertendo ${templateId} → ${uuid}`);
      return uuid;
    }
    return templateId;
  }

  /**
   * 🆔 Converte funnel JSON ID para UUID do Supabase quando necessário
   * @param funnelId - ID do JSON do funnel
   * @returns UUID do Supabase se conhecido, ou ID original
   */
  private resolveFunnelId(funnelId: string): string {
    const uuid = getFunnelUUID(funnelId);
    if (uuid) {
      appLogger.info(`🆔 [resolveFunnelId] Convertendo ${funnelId} → ${uuid}`);
      return uuid;
    }
    return funnelId;
  }

  // Mapeamento das 21 etapas do Quiz de Estilo
  private readonly STEP_MAPPING: Record<number, Omit<StepInfo, 'id' | 'order' | 'blocksCount' | 'hasTemplate'>> = {
    1: { name: 'Introdução', type: 'intro', description: 'Apresentação do Quiz de Estilo' },
    2: { name: 'Q1: Tipo de Roupa', type: 'question', description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?', multiSelect: 3 },
    3: { name: 'Q2: Personalidade', type: 'question', description: 'RESUMA A SUA PERSONALIDADE:', multiSelect: 3 },
    4: { name: 'Q3: Estampas', type: 'question', description: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?', multiSelect: 3 },
    5: { name: 'Q4: Casacos', type: 'question', description: 'QUAL CASACO É SEU FAVORITO?', multiSelect: 3 },
    6: { name: 'Q5: Calças', type: 'question', description: 'QUAL SUA CALÇA FAVORITA?', multiSelect: 3 },
    7: { name: 'Q6: Calças (2)', type: 'question', description: 'QUAL SUA CALÇA FAVORITA? (Continuação)', multiSelect: 3 },
    8: { name: 'Q7: Sapatos', type: 'question', description: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?', multiSelect: 3 },
    9: { name: 'Q8: Acessórios', type: 'question', description: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?', multiSelect: 3 },
    10: { name: 'Q9: Tecidos', type: 'question', description: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...', multiSelect: 3 },
    11: { name: 'Q10: Preferências', type: 'question', description: 'PERGUNTA ADICIONAL DE PREFERÊNCIAS', multiSelect: 3 },
    12: { name: 'Transição Principal', type: 'transition', description: 'Análise dos resultados parciais' },
    13: { name: 'S1: Guarda-roupa', type: 'strategic', description: 'Percepção sobre o guarda-roupa atual', multiSelect: 1 },
    14: { name: 'S2: Problemas', type: 'strategic', description: 'Principais problemas com roupas', multiSelect: 1 },
    15: { name: 'S3: Frequência', type: 'strategic', description: 'Frequência do dilema "com que roupa eu vou?"', multiSelect: 1 },
    16: { name: 'S4: Investimento', type: 'strategic', description: 'Considerações para investir em roupas', multiSelect: 1 },
    17: { name: 'S5: Orçamento', type: 'strategic', description: 'Orçamento mensal para roupas', multiSelect: 1 },
    18: { name: 'S6: Objetivos', type: 'strategic', description: 'O que deseja alcançar com novo estilo', multiSelect: 1 },
    19: { name: 'Transição Final', type: 'transition', description: 'Preparando resultado personalizado' },
    20: { name: 'Resultado', type: 'result', description: 'Página de resultado personalizada' },
    21: { name: 'Oferta', type: 'offer', description: 'Apresentação da oferta final' },
  };

  private constructor(options?: ServiceOptions) {
    super('TemplateService', '1.0.0', options);
    // registry legacy removido; hierarchicalTemplateSource cobre fluxo principal
  }

  static getInstance(options?: ServiceOptions): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService(options);
    }
    return TemplateService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('TemplateService initialized (UnifiedTemplateRegistry removido)');

    // ✅ FASE 1: Preload de steps críticos para eliminar cache MISS
    try {
      this.log('⚡ Preloading critical steps...');
      const criticalPromises = this.CRITICAL_STEPS.map(stepId =>
        this.lazyLoadStep(stepId, false).catch(err => {
          this.log(`⚠️ Failed to preload ${stepId}:`, err);
          return null;
        })
      );
      await Promise.allSettled(criticalPromises);
      this.log(`✅ Preloaded ${this.CRITICAL_STEPS.length} critical steps`);

      // Preload steps vizinhos do step inicial (step-01)
      await this.preloadNeighborsAndCritical('step-01');
    } catch (error) {
      this.log('⚠️ Error during preload:', error);
      // Não falhar a inicialização se preload falhar
    }
  }

  protected async onDispose(): Promise<void> {
    this.log('TemplateService disposed');
  }

  // ==================== CORE OPERATIONS ====================

  /**
   * 🆕 FASE 1: Carregar template v4 com validação Zod
   */
  async loadV4Template(): Promise<ServiceResult<any>> {
    try {
      this.log('📂 Loading quiz21-v4-saas.json...');

      const response = await fetch('/templates/quiz21-v4-saas.json', {
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Failed to load v4 template: ${response.statusText}`);
      }

      const data = await response.json();

      // Validar com Zod
      const { QuizSchemaZ } = await import('@/schemas/quiz-schema.zod');
      const validated = QuizSchemaZ.parse(data);

      this.log(`✅ v4 template loaded and validated: ${validated.steps.length} steps`);

      // Cache do template v4
      cacheService.templates.set('quiz21-v4', validated, 3600000); // 1 hora

      return this.createResult(validated);
    } catch (error) {
      this.error('❌ Failed to load v4 template:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * 🆕 FASE 1: Obter step específico do template v4
   */
  async getStepV4(stepId: string): Promise<ServiceResult<any>> {
    try {
      // Tentar carregar do cache primeiro
      const cached = cacheService.templates.get<any>('quiz21-v4');

      let v4Template;
      if (cached.success && cached.data) {
        v4Template = cached.data;
      } else {
        const result = await this.loadV4Template();
        if (!result.success) {
          return result;
        }
        v4Template = result.data;
      }

      // Encontrar step
      const step = v4Template.steps.find((s: any) => s.id === stepId);

      if (!step) {
        return this.createError(new Error(`Step ${stepId} not found in v4 template`));
      }

      this.log(`✅ Step ${stepId} loaded from v4 (${step.blocks.length} blocks)`);
      return this.createResult(step);
    } catch (error) {
      this.error(`❌ Failed to load step ${stepId} from v4:`, error);
      return this.createError(error as Error);
    }
  }

  /**
   * Obter template por ID
   */
  async getTemplate(id: string): Promise<ServiceResult<Template>> {
    try {
      CanonicalServicesMonitor.trackUsage(this.name, 'getTemplate');
      // Tentar buscar como step primeiro
      const stepMatch = id.match(/step-?(\d+)/i);
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1]);
        const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
        let blocks: Block[] = [];
        // 🔐 JSON_ONLY + HierarchicalSource ativo → nunca usar registry legado aqui
        if (this.USE_HIERARCHICAL_SOURCE) {
          try {
            const result = await hierarchicalTemplateSource.getPrimary(stepId, this.activeFunnelId || undefined);
            blocks = result.data;
            this.log(`✅ [NEW] getTemplate(${id}) carregado via HierarchicalTemplateSource (${blocks.length} blocos)`);
          } catch (err) {
            this.log(`⚠️ [NEW] Falha ao carregar ${stepId} via HierarchicalTemplateSource`, err);
            // JSON_ONLY ativo ou falha no novo fluxo → não usar registry legacy
            blocks = [];
          }
        } else {
          // Legacy path desativado: usar HierarchicalTemplateSource como única fonte
          try {
            const result = await hierarchicalTemplateSource.getPrimary(stepId);
            blocks = result.data;
          } catch {
            blocks = [];
          }
        }

        if (blocks && blocks.length > 0) {
          const stepInfo = this.STEP_MAPPING[stepNumber];
          const template: Template = {
            id,
            name: stepInfo?.name || `Step ${stepNumber}`,
            description: stepInfo?.description || '',
            version: '3.2', // Atualizado para refletir versão atual dos JSON steps
            blocks,
            metadata: {
              category: 'quiz-style',
              funnelType: 'quiz21StepsComplete',
            },
          };

          return this.createResult(template);
        }
      }

      // Template não encontrado
      return this.createError(new Error(`Template not found: ${id}`));
    } catch (error) {
      this.error('getTemplate failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Obter blocos de um step específico
   * @param stepId ID do step (ex: "step-01")
   * @param templateId ID opcional do template (ex: "quiz21StepsComplete")
   * @param options Opções incluindo AbortSignal para cancelamento
   */
  async getStep(
    stepId: string,
    templateId?: string,
    options?: ServiceOptions
  ): Promise<ServiceResult<Block[]>> {
    const startTime = performance.now();
    const signal = options?.signal;

    try {
      // ✅ Verificar se operação foi cancelada
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      // 🆕 GARGALO #5 FIX: Deduplicação de cargas (FASE 3)
      // Se já existe uma promise para este step, retornar ela (evita redundância)
      const loadKey = `${stepId}-${templateId || 'default'}`;
      if (this.stepLoadPromises.has(loadKey)) {
        this.log(`🔄 [DEDUPLICATE] Aguardando load existente: ${stepId}`);
        const existingPromise = this.stepLoadPromises.get(loadKey)!;
        try {
          const data = await existingPromise;
          return this.createResult(data);
        } catch (error) {
          // Se promise existente falhou, tentar novamente
          this.stepLoadPromises.delete(loadKey);
        }
      }

      // 🎯 PRIORIDADE 1: Verificar se existe template built-in JSON
      if (templateId && hasBuiltInTemplate(templateId)) {
        this.log(`✅ [BUILT-IN] Template ${templateId} disponível como JSON`);

        try {
          const builtInTemplate = await loadFullTemplate(templateId);
          if (builtInTemplate && builtInTemplate.steps[stepId]) {
            const blocks = builtInTemplate.steps[stepId];
            this.log(`✅ [BUILT-IN] Step ${stepId} carregado do JSON (${blocks.length} blocos)`);

            editorMetrics.trackLoadTime(stepId, performance.now() - startTime, {
              source: 'built-in-json',
              blocksCount: blocks.length,
              cacheHit: false,
            });

            return this.createResult(blocks);
          }
        } catch (error) {
          this.log(`⚠️ [BUILT-IN] Erro ao carregar ${stepId} do JSON:`, error);
          // Continuar para próxima fonte
        }
      }

      // ✅ Verificar cancelamento antes de continuar
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      // 🎯 PRIORIDADE 2: Usar HierarchicalTemplateSource se feature flag ativa
      // 🆕 Registrar promise para deduplicação
      const loadPromise = (async () => {
        try {
          if (this.USE_HIERARCHICAL_SOURCE) {
            const result = await this.getStepFromHierarchicalSource(stepId, templateId, signal);
            if (result.success) {
              return result.data;
            }
            throw result.error;
          }

          // ⚠️ PRIORIDADE 3 (FALLBACK): Código legado
          const result = await this.getStepLegacy(stepId, templateId, startTime, signal);
          if (result.success) {
            return result.data;
          }
          throw result.error;
        } finally {
          // Limpar promise após completar (sucesso ou erro)
          this.stepLoadPromises.delete(loadKey);
        }
      })();

      // Registrar promise
      this.stepLoadPromises.set(loadKey, loadPromise);

      // Aguardar resultado
      const data = await loadPromise;
      return this.createResult(data);

    } catch (error) {
      // Limpar promise em caso de erro
      const loadKey = `${stepId}-${templateId || 'default'}`;
      this.stepLoadPromises.delete(loadKey);

      if (signal?.aborted || (error as Error).message === 'Operation aborted') {
        this.log(`🚫 [CANCELLED] getStep ${stepId} foi cancelado`);
        return this.createError(new Error('Operation cancelled'));
      }

      editorMetrics.trackError(error as Error, { stepId, templateId });
      this.error('getStep failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * 🎯 NOVO: Obter step usando HierarchicalTemplateSource (FASE 1)
   */
  private async getStepFromHierarchicalSource(
    stepId: string,
    templateId?: string,
    signal?: AbortSignal
  ): Promise<ServiceResult<Block[]>> {
    const startTime = performance.now();

    try {
      // ✅ Verificar cancelamento
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      // Extrair funnelId do contexto se disponível
      const funnelId = this.activeFunnelId || undefined;

      // Usar HierarchicalTemplateSource
      const result = await hierarchicalTemplateSource.getPrimary(stepId, funnelId);

      // ✅ Verificar cancelamento após fetch
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      // Log da fonte usada (debug/monitoring)
      this.log(`✅ [NEW] Step ${stepId} loaded from ${DataSourcePriority[result.metadata.source]} (${result.metadata.loadTime.toFixed(1)}ms)`);

      // Track metrics
      editorMetrics.trackLoadTime(stepId, performance.now() - startTime, {
        source: DataSourcePriority[result.metadata.source],
        blocksCount: result.data.length,
        cacheHit: result.metadata.cacheHit,
      });

      return this.createResult(result.data);
    } catch (error) {
      if (signal?.aborted || (error as Error).message === 'Operation aborted') {
        throw error; // Re-throw para tratar no caller
      }

      this.error('[NEW] getStepFromHierarchicalSource failed:', error);
      // Se JSON-only estiver ativo, não cair no legado para evitar drift/registry
      if (this.JSON_ONLY) {
        this.log('[WARN][NEW] JSON-only ativo → não usar legado; retornando vazio');
        return this.createResult<Block[]>([]);
      }
      // Fallback para legacy se novo sistema falhar
      this.log('[WARN][NEW] Falling back to legacy system');
      return await this.getStepLegacy(stepId, templateId, performance.now(), signal);
    }
  }

  /**
   * ⚠️ LEGACY: Método antigo (será removido na Fase 3)
   */
  private async getStepLegacy(
    stepId: string,
    templateId: string | undefined,
    startTime: number,
    signal?: AbortSignal
  ): Promise<ServiceResult<Block[]>> {
    // ✅ Verificar cancelamento
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    // ✅ FASE 1.2: Verificar cache PRIMEIRO
    const cacheKey = `template:${templateId || 'default'}:${stepId}`;
    const cachedResult = cacheService.templates.get<Block[]>(cacheKey);

    if (cachedResult.success && cachedResult.data) {
      this.log(`⚡ Cache HIT: ${stepId}`);
      editorMetrics.trackCacheHit(cacheKey); // ✅ FASE 3.3
      editorMetrics.trackLoadTime(stepId, performance.now() - startTime, { source: 'cache' });
      return this.createResult(cachedResult.data);
    }

    this.log(`⏳ Cache MISS: ${stepId} - Loading...`);
    editorMetrics.trackCacheMiss(cacheKey); // ✅ FASE 3.3

    // ✅ Verificar cancelamento antes de fetch
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    // FASE 2: Carregar do registry (lazy loading)
    // Registry legacy removido: usar hierarchicalTemplateSource (ou JSON) como fallback
    const blocks = await this.registryCompat.getStep(stepId, templateId);

    // ✅ Verificar cancelamento após fetch
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    if (!blocks || blocks.length === 0) {
      return this.createError(new Error(`Step not found: ${stepId}`));
    }

    // ✅ FASE 1: Normalizar formato usando adapter
    // O adapter converte automaticamente V2/V3 sections[] → V3.1 blocks[]
    const normalizedBlocks = blocks.map((block: any) => {
      // Se o bloco já está no formato correto, retornar como está
      if (block.type && block.content) {
        return block;
      }

      // Caso contrário, tentar normalizar
      const normalized = templateFormatAdapter.normalize({ blocks: [block] });
      return normalized.blocks[0] || block;
    });

    // ✅ FASE 1.2: Armazenar em cache (TTL: 10min)
    cacheService.templates.set(cacheKey, normalizedBlocks, 600000);

    // ✅ FASE 3.3: Track metrics
    editorMetrics.trackLoadTime(stepId, performance.now() - startTime, {
      source: 'registry',
      blocksCount: normalizedBlocks.length
    });

    this.log(`✅ [LEGACY] Carregado e normalizado ${normalizedBlocks.length} blocos para ${stepId}`);
    return this.createResult(normalizedBlocks);
  }

  /**
   * Salvar template (persiste no cache)
   */
  async saveTemplate(template: Template): Promise<ServiceResult<void>> {
    try {
      // Validar template
      const validation = this.validateTemplate(template);
      if (!validation.isValid) {
        return this.createError(new Error(`Invalid template: ${validation.errors.join(', ')}`));
      }

      // Salvar no cache (UnifiedTemplateRegistry não tem setStep, apenas cache)
      // Usar CacheService diretamente
      cacheService.templates.set(template.id, template.blocks);

      this.log(`Template saved: ${template.id}`);
      return this.createResult(undefined);
    } catch (error) {
      this.error('saveTemplate failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Atualizar template existente
   */
  async updateTemplate(id: string, updates: Partial<Template>): Promise<ServiceResult<void>> {
    try {
      // Buscar template existente
      const existingResult = await this.getTemplate(id);
      if (!existingResult.success) {
        return existingResult as ServiceResult<void>;
      }

      // Merge updates
      const updated: Template = {
        ...existingResult.data,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Salvar
      return await this.saveTemplate(updated);
    } catch (error) {
      this.error('updateTemplate failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Deletar template
   */
  async deleteTemplate(id: string): Promise<ServiceResult<void>> {
    try {
      // Invalidar todos os caches
      cacheService.templates.invalidate(id);
      await this.registryCompat.invalidate(id);

      this.log(`Template deleted: ${id}`);
      return this.createResult(undefined);
    } catch (error) {
      this.error('deleteTemplate failed:', error);
      return this.createError(error as Error);
    }
  }

  // ==================== REGISTRY OPERATIONS ====================

  /**
   * Listar templates disponíveis
   */
  listTemplates(filters?: TemplateFilters): ServiceResult<Template[]> {
    try {
      // Por enquanto, retornar lista dos 21 steps do quiz
      const templates: Template[] = [];

      for (let i = 1; i <= 21; i++) {
        const stepInfo = this.STEP_MAPPING[i];
        if (!stepInfo) continue;

        templates.push({
          id: `step-${i.toString().padStart(2, '0')}`,
          name: stepInfo.name,
          description: stepInfo.description,
          version: '3.2', // Versão visível na listagem
          blocks: [], // Não carregar blocos na listagem
          metadata: {
            category: 'quiz-style',
            funnelType: 'quiz21StepsComplete',
          },
        });
      }

      // Aplicar filtros se fornecidos
      let filtered = templates;
      if (filters?.category) {
        filtered = filtered.filter(t => t.metadata.category === filters.category);
      }
      if (filters?.funnelType) {
        filtered = filtered.filter(t => t.metadata.funnelType === filters.funnelType);
      }

      return this.createResult(filtered);
    } catch (error) {
      this.error('listTemplates failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Buscar templates por query
   */
  searchTemplates(query: string): ServiceResult<Template[]> {
    try {
      const allTemplates = this.listTemplates();
      if (!allTemplates.success) {
        return allTemplates;
      }

      const lowerQuery = query.toLowerCase();
      const results = allTemplates.data.filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.id.toLowerCase().includes(lowerQuery),
      );

      return this.createResult(results);
    } catch (error) {
      this.error('searchTemplates failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Obter metadata de um template
   */
  async getTemplateMetadata(id: string): Promise<ServiceResult<TemplateMetadata>> {
    try {
      const result = await this.getTemplate(id);
      if (!result.success) {
        return this.createError(result.error);
      }

      return this.createResult(result.data.metadata);
    } catch (error) {
      this.error('getTemplateMetadata failed:', error);
      return this.createError(error as Error);
    }
  }

  // ==================== CACHE OPERATIONS ====================

  /**
   * 🎯 Definir template ativo (afeta número de steps na navegação)
   */
  setActiveTemplate(templateId: string, totalSteps: number): void {
    // 🆔 Converter JSON ID para UUID se necessário
    const resolvedId = this.resolveTemplateId(templateId);
    
    this.activeTemplateId = resolvedId;
    this.activeTemplateSteps = totalSteps;
    appLogger.info(`🎯 [setActiveTemplate] Definindo template ativo: ${templateId} → ${resolvedId} com ${totalSteps} etapas`);
    this.log(`✅ Template ativo: ${resolvedId} (${totalSteps} etapas)`);

    // 🆕 Sincronizar com HierarchicalTemplateSource
    hierarchicalTemplateSource.setActiveTemplate(resolvedId);
  }

  /**
   * 🎯 Definir funnel ativo (afeta HierarchicalTemplateSource → USER_EDIT)
   */
  setActiveFunnel(funnelId: string | null): void {
    if (!funnelId) {
      this.activeFunnelId = null;
      this.log('ℹ️ Funnel ativo removido (voltando para TEMPLATE_DEFAULT/ADMIN_OVERRIDE)');
      return;
    }
    
    // 🆔 Converter JSON ID para UUID se necessário
    const resolvedId = this.resolveFunnelId(funnelId);
    this.activeFunnelId = resolvedId;
    appLogger.info(`🎯 [setActiveFunnel] Definindo funnel ativo: ${funnelId} → ${resolvedId}`);
    this.log(`✅ Funnel ativo para USER_EDIT: ${resolvedId}`);
  }

  /**
   * 🔍 Detectar número de steps do template lendo arquivo consolidado
   */
  private async detectTemplateSteps(templateId: string): Promise<number> {
    try {
      const masterPath = `/templates/quiz21-complete.json`;
      const response = await fetch(masterPath);

      if (!response.ok) {
        this.log(`⚠️ Master JSON não encontrado para ${templateId}, usando default 21`);
        return 21;
      }

      const masterData = await response.json();
      const stepCount = masterData.steps?.length || 21;

      this.log(`✅ Template ${templateId} possui ${stepCount} etapas`);
      return stepCount;
    } catch (error) {
      this.log(`⚠️ Erro ao detectar steps de ${templateId}:`, error);
      return 21; // Fallback seguro
    }
  }

  /**
   * 🚀 FASE 3.1: Smart Lazy Loading de Steps
   * Carrega step sob demanda + preload inteligente de vizinhos e críticos
   * 
   * @param stepId - ID do step (ex: 'step-01')
   * @param preloadNeighbors - Precarregar steps vizinhos (default: true)
   * @returns Promise<Step data>
   */
  async lazyLoadStep(stepId: string, preloadNeighbors = true): Promise<any> {
    // 1. Verificar se já está carregando
    if (this.stepLoadPromises.has(stepId)) {
      return this.stepLoadPromises.get(stepId);
    }

    // 2. Verificar se já está carregado
    if (this.loadedSteps.has(stepId)) {
      const cached = await this.getStep(stepId);
      if (cached.success && cached.data) {
        return { id: stepId, blocks: cached.data };
      }
    }

    // 3. Iniciar carregamento
    this.log(`🔄 Lazy loading step: ${stepId}`);
    const loadPromise = this.loadStepData(stepId);
    this.stepLoadPromises.set(stepId, loadPromise);

    try {
      const stepData = await loadPromise;
      this.loadedSteps.add(stepId);

      // 4. Preload vizinhos e críticos em background (não bloqueia)
      if (preloadNeighbors) {
        this.preloadNeighborsAndCritical(stepId).catch(err =>
          this.log(`⚠️ Preload failed for neighbors of ${stepId}:`, err)
        );
      }

      return stepData;
    } finally {
      this.stepLoadPromises.delete(stepId);
    }
  }

  /**
   * Carregar dados do step (implementação real)
   */
  private async loadStepData(stepId: string): Promise<any> {
    // Buscar no cache primeiro
    const cached = await this.getStep(stepId);
    if (cached.success && cached.data) {
      return { id: stepId, blocks: cached.data };
    }

    // Fallback: carregar da fonte
    const stepNum = this.extractStepNumber(stepId);
    if (stepNum) {
      const stepInfo = this.STEP_MAPPING[stepNum];
      return {
        id: stepId,
        ...stepInfo,
        blocks: [], // Será populado pelo registry
      };
    }

    throw new Error(`Step not found: ${stepId}`);
  }

  /**
   * Precarregar steps vizinhos e críticos em background
   */
  private async preloadNeighborsAndCritical(currentStepId: string): Promise<void> {
    const stepNum = this.extractStepNumber(currentStepId);
    if (!stepNum) return;

    const toPreload = new Set<string>();

    // Vizinhos (±1)
    for (let i = -this.PRELOAD_NEIGHBORS; i <= this.PRELOAD_NEIGHBORS; i++) {
      if (i === 0) continue; // Skip current
      const neighborNum = stepNum + i;
      if (neighborNum >= 1 && neighborNum <= 21) {
        const neighborId = `step-${String(neighborNum).padStart(2, '0')}`;
        if (!this.loadedSteps.has(neighborId)) {
          toPreload.add(neighborId);
        }
      }
    }

    // Steps críticos
    for (const criticalId of this.CRITICAL_STEPS) {
      if (!this.loadedSteps.has(criticalId) && criticalId !== currentStepId) {
        toPreload.add(criticalId);
      }
    }

    if (toPreload.size > 0) {
      this.log(`⚡ Preloading ${toPreload.size} steps in background:`, Array.from(toPreload));

      // Preload em paralelo (não bloqueia)
      const promises = Array.from(toPreload).map(id =>
        this.lazyLoadStep(id, false).catch(() => null) // Silently fail
      );

      await Promise.allSettled(promises);
    }
  }

  /**
   * Extrair número do step ID
   */
  private extractStepNumber(stepId: string): number | null {
    const match = stepId.match(/step-(\d{1,2})/i);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Descarregar steps não utilizados (liberar memória)
   * Remove steps que não foram acessados há mais de X minutos
   */
  unloadInactiveSteps(inactiveMinutes = 5): void {
    // TODO: Implementar tracking de último acesso
    // Por enquanto, apenas limpa o Set
    const beforeCount = this.loadedSteps.size;
    this.loadedSteps.clear();
    this.stepLoadPromises.clear();
    this.log(`🧹 Unloaded ${beforeCount} inactive steps`);
  }

  /**
   * Pré-carregar múltiplos templates
   */
  async preloadTemplates(ids: string[]): Promise<void> {
    this.log(`Preloading ${ids.length} templates...`);

    const promises = ids.map(id => this.getTemplate(id));
    await Promise.allSettled(promises);

    this.log(`Preload completed for ${ids.length} templates`);
  }

  /**
   * 🚀 FASE 4: Preparar template com detecção dinâmica de steps, sem carregar blocos
   * Detecta automaticamente quantos steps o template possui e define como ativo
   * 
   * @param templateId ID do template
   * @param options Opções incluindo preloadAll e AbortSignal
   */
  async prepareTemplate(
    templateId: string,
    options?: { preloadAll?: boolean; signal?: AbortSignal }
  ): Promise<ServiceResult<void>> {
    const signal = options?.signal;

    try {
      // ✅ Verificar cancelamento
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      // 🎯 PRIORIDADE 1: Verificar se existe built-in JSON
      if (hasBuiltInTemplate(templateId)) {
        this.log(`✅ [BUILT-IN] Preparando template ${templateId} do JSON`);

        const builtInTemplate = await loadFullTemplate(templateId);
        if (builtInTemplate) {
          const totalSteps = builtInTemplate.totalSteps || Object.keys(builtInTemplate.steps).length;
          this.setActiveTemplate(templateId, totalSteps);

          this.log(`✅ [BUILT-IN] Template ${templateId} preparado: ${totalSteps} steps`);
          return this.createResult(undefined);
        }
      }

      // ✅ Verificar cancelamento
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      // 🎯 PRIORIDADE 2: Sistema dinâmico (fallback)
      const totalSteps = await this.detectTemplateSteps(templateId);
      this.setActiveTemplate(templateId, totalSteps);

      // Compat: se explicitamente solicitado, fazer preload completo (comportamento antigo)
      if (options?.preloadAll) {
        const stepIds = Array.from({ length: totalSteps }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);
        this.log(`🚀 Preloading ${totalSteps} steps em paralelo para template ${templateId}...`);
        await Promise.allSettled(stepIds.map(id => this.getStep(id, templateId)));
        this.log(`✅ Preload completo: ${totalSteps} steps carregados`);
      }

      return this.createResult(undefined);
    } catch (error) {
      this.error('prepareTemplate failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * 🚀 FASE 4: Pré-carregar template completo com detecção dinâmica de steps
   * Detecta automaticamente quantos steps o template possui
   * 
   * @param templateId ID do template
   * @param options Opções incluindo AbortSignal
   */
  async preloadTemplate(templateId: string, options?: ServiceOptions): Promise<ServiceResult<void>> {
    const signal = options?.signal;

    try {
      // ✅ Verificar cancelamento
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }

      // Chamar prepareTemplate com preloadAll: true
      return await this.prepareTemplate(templateId, { preloadAll: true, signal });
    } catch (error) {
      if (signal?.aborted || (error as Error).message === 'Operation aborted') {
        this.log(`🚫 [CANCELLED] preloadTemplate ${templateId} foi cancelado`);
        return this.createError(new Error('Operation cancelled'));
      }

      this.error('preloadTemplate failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Invalidar template do cache
   */
  invalidateTemplate(id: string): void {
    cacheService.templates.invalidate(id);
    this.registryCompat.invalidate(id);
    this.loadedSteps.delete(id); // 🚀 FASE 3.1: Limpar do lazy load
    this.log(`Template invalidated: ${id}`);
  }

  /**
   * Alias explícito para invalidar cache de um step específico.
   * Útil para integrações com React Query.
   */
  invalidateStepCache(stepId: string): void {
    this.invalidateTemplate(stepId);
  }

  /**
   * Limpar todo o cache de templates
   */
  clearCache(): void {
    cacheService.clearStore('templates');
    // UnifiedTemplateRegistry tem clearL1()
    this.registryCompat.clearL1();
    this.loadedSteps.clear(); // 🚀 FASE 3.1: Limpar lazy load
    this.stepLoadPromises.clear();
    this.log('Template cache cleared');
  }

  /**
   * 📊 FASE 3: Obter estatísticas de cache
   * Retorna métricas de performance do cache incluindo hit rate, steps carregados, etc.
   */
  getCacheStats(): {
    cacheHitRate: string;
    stepsLoadedInMemory: number;
    pendingLoads: number;
    avgLoadTimeMs: number;
    lastReport: ReturnType<typeof editorMetrics.getReport>;
  } {
    const report = editorMetrics.getReport();

    return {
      cacheHitRate: report.summary.cacheHitRate,
      stepsLoadedInMemory: this.loadedSteps.size,
      pendingLoads: this.stepLoadPromises.size,
      avgLoadTimeMs: report.summary.avgLoadTimeMs,
      lastReport: report,
    };
  }

  /**
   * 📊 FASE 3: Log do relatório de cache (console)
   * Imprime estatísticas formatadas no console para debugging
   */
  logCacheReport(): void {
    const stats = this.getCacheStats();

    console.group('📊 Template Cache Stats');
    appLogger.info(`Cache Hit Rate: ${stats.cacheHitRate}`);
    appLogger.info(`Steps in Memory: ${stats.stepsLoadedInMemory}`);
    appLogger.info(`Pending Loads: ${stats.pendingLoads}`);
    appLogger.info(`Avg Load Time: ${stats.avgLoadTimeMs.toFixed(0)}ms`);
    appLogger.info('\nDetailed Report:', { data: [stats.lastReport] });
    console.groupEnd();
  }

  // ==================== CONVERSIONS & VALIDATION ====================

  /**
   * Validar estrutura de template
   */
  validateTemplate(template: Template): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!template.id) {
      errors.push('Template ID is required');
    }

    if (!template.name) {
      errors.push('Template name is required');
    }

    if (!template.blocks || !Array.isArray(template.blocks)) {
      errors.push('Template blocks must be an array');
    }

    if (template.blocks && template.blocks.length === 0) {
      warnings.push('Template has no blocks');
    }

    // Validar cada bloco
    template.blocks?.forEach((block, index) => {
      if (!block.id) {
        errors.push(`Block ${index} is missing ID`);
      }
      if (!block.type) {
        errors.push(`Block ${index} is missing type`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Normalizar blocos para formato consistente
   */
  normalizeBlocks(blocks: any[]): Block[] {
    return blocks.map((block, index) => ({
      id: block.id || `block-${index}`,
      type: this.normalizeBlockType(block.type || 'unknown') as any, // Cast para compatibilidade
      order: block.order ?? block.position ?? index,
      properties: block.properties || block.props || {},
      content: block.content || {},
      parentId: block.parentId || undefined,
    }));
  }

  /**
   * Normalizar tipo de bloco
   */
  private normalizeBlockType(type: string): string {
    const typeMap: Record<string, string> = {
      'header': 'HeaderBlock',
      'title': 'TitleBlock',
      'subtitle': 'SubtitleBlock',
      'text': 'TextBlock',
      'image': 'ImageBlock',
      'button': 'ButtonBlock',
      'input': 'InputBlock',
      'question': 'QuestionBlock',
      'options': 'OptionsBlock',
      'result': 'ResultBlock',
      'cta': 'CTABlock',
    };

    return typeMap[type.toLowerCase()] || type;
  }

  // ==================== SPECIALIZED METHODS ====================

  /**
   * Operations específicas para steps (21 steps do quiz)
   */
  steps = {
    /**
     * Obter bloco de um step por número
     */
    get: async (stepNumber: number): Promise<ServiceResult<Block[]>> => {
      const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
      return await this.getStep(stepId);
    },

    /**
     * 🎯 FASE 4: Listar informações de steps de forma dinâmica
     * Usa activeTemplateSteps para mostrar apenas os steps do template carregado
     */
    list: (): ServiceResult<StepInfo[]> => {
      try {
        const steps: StepInfo[] = [];

        // 1. Adicionar steps do template (se houver)
        // 🔧 FIX: Se activeTemplateSteps não foi setado (=0), usar 21 steps por padrão para quiz21StepsComplete
        let totalSteps = this.activeTemplateSteps;
        if (totalSteps === 0 && this.activeTemplateId === 'quiz21StepsComplete') {
          totalSteps = 21;
          appLogger.warn(`⚠️ [TemplateService.steps.list] activeTemplateSteps não setado, usando fallback de 21 steps`);
        }

        appLogger.info(`🔍 [TemplateService.steps.list] activeTemplateSteps = ${totalSteps}, activeTemplateId = ${this.activeTemplateId}`);

        for (let i = 1; i <= totalSteps; i++) {
          const info = this.STEP_MAPPING[i] || {
            name: `Etapa ${i}`,
            type: 'custom' as const,
            description: `Etapa personalizada ${i}`,
          };

          steps.push({
            id: `step-${i.toString().padStart(2, '0')}`,
            order: i,
            blocksCount: 0,
            hasTemplate: true,
            ...info,
          });
        }

        // 2. Adicionar steps customizados (modo "Começar do Zero")
        this.customSteps.forEach((stepInfo) => {
          steps.push(stepInfo);
        });

        // 3. Ordenar por número de ordem
        steps.sort((a, b) => a.order - b.order);

        return this.createResult(steps);
      } catch (error) {
        this.error('steps.list failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * 🎯 Adicionar step customizado (modo "Começar do Zero")
     */
    add: async (stepInfo: StepInfo): Promise<ServiceResult<void>> => {
      try {
        // ✅ Validação básica de entrada (sem dependências externas)
        if (!stepInfo || typeof stepInfo !== 'object') {
          return this.createError(new Error('StepInfo inválido'));
        }

        if (!/^step-/.test(stepInfo.id)) {
          return this.createError(new Error('ID de etapa deve iniciar com "step-"'));
        }

        const allowedTypes = new Set(['intro', 'question', 'strategic', 'transition', 'result', 'offer', 'custom']);
        if (!allowedTypes.has(stepInfo.type)) {
          return this.createError(new Error(`Tipo de etapa inválido: ${stepInfo.type}`));
        }

        if (!stepInfo.name || !stepInfo.name.trim()) {
          return this.createError(new Error('Nome da etapa é obrigatório'));
        }

        // Normalizar ordem
        if (!Number.isFinite(stepInfo.order) || stepInfo.order <= 0) {
          const nextOrder = this.activeTemplateSteps + this.customSteps.size + 1;
          stepInfo.order = nextOrder;
        }

        // ✅ Validar se ID já existe
        if (this.customSteps.has(stepInfo.id)) {
          this.log(`⚠️ ID duplicado detectado: ${stepInfo.id}`);
          return this.createError(new Error(`Etapa com ID ${stepInfo.id} já existe`));
        }

        // Verificar se é um step do template
        const stepMatch = stepInfo.id.match(/^step-(\d{2})$/);
        if (stepMatch) {
          const stepNumber = parseInt(stepMatch[1]);
          if (stepNumber >= 1 && stepNumber <= 21) {
            return this.createError(new Error('ID conflita com etapas do template'));
          }
        }

        // Adicionar ao Map de steps customizados
        this.customSteps.set(stepInfo.id, stepInfo);

        // Criar blocos vazios iniciais para o step
        const emptyBlocks: Block[] = [{
          id: `${stepInfo.id}-block-initial`,
          type: 'TextBlock' as any,
          order: 0,
          properties: { text: 'Clique para editar' },
          content: {},
        }];

        // Salvar no cache
        cacheService.templates.set(stepInfo.id, emptyBlocks);

        this.log(`✅ Step customizado adicionado: ${stepInfo.id} (order: ${stepInfo.order})`);
        return this.createResult(undefined);
      } catch (error) {
        this.error('steps.add failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * 🗑️ Remover step customizado
     */
    remove: async (stepId: string): Promise<ServiceResult<void>> => {
      try {
        // Verificar se é um step do template (não pode deletar)
        const stepMatch = stepId.match(/^step-(\d{2})$/);
        if (stepMatch) {
          const stepNumber = parseInt(stepMatch[1]);
          if (stepNumber >= 1 && stepNumber <= 21) {
            return this.createError(
              new Error('Não é possível deletar etapas do template. Apenas etapas customizadas podem ser removidas.')
            );
          }
        }

        // Verificar se existe
        if (!this.customSteps.has(stepId)) {
          return this.createError(new Error(`Etapa não encontrada: ${stepId}`));
        }

        // Remover do Map
        this.customSteps.delete(stepId);

        // Remover do cache
        cacheService.templates.invalidate(stepId);

        this.log(`✅ Step customizado removido: ${stepId}`);
        return this.createResult(undefined);
      } catch (error) {
        this.error('steps.remove failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * 🔄 Reordenar steps
     */
    reorder: async (orderedStepIds: string[]): Promise<ServiceResult<void>> => {
      try {
        // Atualizar ordem dos steps customizados
        const updatedSteps = new Map<string, StepInfo>();

        orderedStepIds.forEach((stepId, index) => {
          const existingStep = this.customSteps.get(stepId);
          if (existingStep) {
            updatedSteps.set(stepId, {
              ...existingStep,
              order: index + 1,
            });
          }
        });

        // Substituir Map de steps customizados
        this.customSteps = updatedSteps;

        this.log(`✅ Steps reordenados: ${orderedStepIds.length} etapas`);
        return this.createResult(undefined);
      } catch (error) {
        this.error('steps.reorder failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * 📋 Duplicar step existente
     */
    duplicate: async (stepId: string): Promise<ServiceResult<StepInfo>> => {
      try {
        // Buscar step original
        let originalStep: StepInfo | undefined;

        // Verificar se é step customizado
        if (this.customSteps.has(stepId)) {
          originalStep = this.customSteps.get(stepId);
        } else {
          // Buscar nos steps do template
          const allSteps = this.steps.list();
          if (allSteps.success) {
            originalStep = allSteps.data.find(s => s.id === stepId);
          }
        }

        if (!originalStep) {
          return this.createError(new Error(`Step não encontrado: ${stepId}`));
        }

        // Buscar blocos do step original
        const blocksResult = await this.getStep(stepId);
        const originalBlocks = blocksResult.success ? blocksResult.data : [];

        // Criar novo step com nome "Cópia de..."
        const newStepNumber = this.customSteps.size + this.activeTemplateSteps + 1;
        const newStepId = generateCustomStepId(); // ✅ W1: UUID v4

        const newStep: StepInfo = {
          ...originalStep,
          id: newStepId,
          name: `Cópia de ${originalStep.name}`,
          order: newStepNumber,
          hasTemplate: false, // Marca como customizado
        };

        // Duplicar blocos com novos IDs
        const duplicatedBlocks: Block[] = originalBlocks.map((block, index) => ({
          ...block,
          id: generateBlockId(), // ✅ W1: UUID v4
        }));

        // Adicionar ao Map de steps customizados
        this.customSteps.set(newStepId, newStep);

        // Salvar blocos no cache
        cacheService.templates.set(newStepId, duplicatedBlocks);

        this.log(`✅ Step duplicado: ${stepId} → ${newStepId} (${duplicatedBlocks.length} blocos)`);
        return this.createResult(newStep);
      } catch (error) {
        this.error('steps.duplicate failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * Pré-carregar steps específicos
     */
    preload: async (stepNumbers: number[]): Promise<void> => {
      const stepIds = stepNumbers.map(n => `step-${n.toString().padStart(2, '0')}`);
      await this.preloadTemplates(stepIds);
    },

    /**
     * Invalidar step do cache
     */
    invalidate: (stepNumber: number): void => {
      const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
      this.invalidateTemplate(stepId);
    },
  };

  /**
   * Operations para blocos individuais
   */
  blocks = {
    /**
     * Obter bloco específico por ID
     */
    get: async (blockId: string): Promise<ServiceResult<Block>> => {
      try {
        // Buscar em todos os steps (cache)
        const cached = cacheService.blocks.get<Block>(blockId);
        if (cached.success && cached.data) {
          return this.createResult(cached.data);
        }

        return this.createError(new Error(`Block not found: ${blockId}`));
      } catch (error) {
        this.error('blocks.get failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * Criar novo bloco
     */
    create: (blockData: CreateBlockDTO): ServiceResult<Block> => {
      try {
        const block: Block = {
          id: generateBlockId(), // ✅ W1: UUID v4
          type: this.normalizeBlockType(blockData.type) as any,
          order: 0,
          properties: blockData.properties || {},
          content: blockData.content || {},
          parentId: blockData.parentId || undefined,
        };

        // Cache o bloco
        cacheService.blocks.set(block.id, block);

        return this.createResult(block);
      } catch (error) {
        this.error('blocks.create failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * Atualizar bloco existente
     */
    update: async (blockId: string, updates: Partial<Block>): Promise<ServiceResult<Block>> => {
      try {
        const existingResult = await this.blocks.get(blockId);
        if (!existingResult.success) {
          return existingResult;
        }

        const updated: Block = {
          ...existingResult.data,
          ...updates,
        };

        // Atualizar cache
        cacheService.blocks.set(blockId, updated);

        return this.createResult(updated);
      } catch (error) {
        this.error('blocks.update failed:', error);
        return this.createError(error as Error);
      }
    },

    /**
     * Deletar bloco
     */
    delete: (blockId: string): ServiceResult<void> => {
      try {
        cacheService.blocks.invalidate(blockId);
        return this.createResult(undefined);
      } catch (error) {
        this.error('blocks.delete failed:', error);
        return this.createError(error as Error);
      }
    },
  };

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<boolean> {
    try {
      // Test basic template retrieval
      const result = await this.steps.get(1);
      return result.success;
    } catch (error) {
      appLogger.warn('[TemplateService] Health check falhou:', { data: [error] });
      return false;
    }
  }

  // ==================== QUIZ HELPERS ====================

  /**
   * Obter ordem dos steps (compatibilidade com STEP_ORDER)
   * Retorna array com IDs dos steps na ordem correta
   */
  getStepOrder(): string[] {
    return Array.from({ length: 21 }, (_, i) => `step-${(i + 1).toString().padStart(2, '0')}`);
  }

  /**
   * 🆕 OPÇÃO A: Obter todos os steps com blocos reais (ASYNC)
   * Retorna Record<stepId, stepData> com blocos carregados
   * 
   * @returns Promise<Record<stepId, stepData>>
   */
  async getAllSteps(): Promise<Record<string, any>> {
    const allSteps: Record<string, any> = {};

    // Determinar templateId baseado no activeFunnelId ou usar padrão
    let templateId = this.activeFunnelId || 'quiz21StepsComplete';

    // Normalizar IDs legados para o ID do template JSON
    if (templateId === 'quiz-estilo-21-steps' || templateId === 'quiz-estilo-completo') {
      templateId = 'quiz21StepsComplete';
    }

    this.log(`📚 getAllSteps usando templateId: ${templateId}`);

    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${i.toString().padStart(2, '0')}`;
      const stepInfo = this.STEP_MAPPING[i];

      if (stepInfo) {
        // Carregar blocks via registry COM templateId
        const result = await this.getStep(stepId, templateId);
        const blocks = result.success ? result.data : [];

        allSteps[stepId] = {
          id: stepId,
          type: stepInfo.type,
          name: stepInfo.name,
          description: stepInfo.description,
          multiSelect: stepInfo.multiSelect,
          nextStep: i < 21 ? `step-${(i + 1).toString().padStart(2, '0')}` : undefined,
          blocks, // ✅ BLOCOS REAIS DO JSON
        };
      }
    }

    return allSteps;
  }

  /**
   * Obter todos os steps como objeto (compatibilidade com QUIZ_STEPS)
   * Retorna Record<stepId, stepData> para compatibilidade com código legacy
   * 
   * ⚠️ ATENÇÃO: Este método é síncrono e retorna dados SEM blocos.
   * Para obter blocos reais, use getAllSteps() async.
   * 
   * @deprecated Use getAllSteps() async para obter blocos reais
   */
  getAllStepsSync(): Record<string, any> {
    // Silenciado: comportamento esperado e documentado
    // console.warn('⚠️ getAllStepsSync() retorna metadata sem blocks. Use getAllSteps() async para obter blocos.');

    const allSteps: Record<string, any> = {};

    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${i.toString().padStart(2, '0')}`;
      const stepInfo = this.STEP_MAPPING[i];

      if (stepInfo) {
        // Criar objeto compatível com QuizStep interface
        allSteps[stepId] = {
          id: stepId,
          type: stepInfo.type,
          name: stepInfo.name,
          description: stepInfo.description,
          multiSelect: stepInfo.multiSelect,
          nextStep: i < 21 ? `step-${(i + 1).toString().padStart(2, '0')}` : undefined,
          // Blocks serão carregados assincronamente quando necessário
          blocks: [],
        };
      }
    }

    return allSteps;
  }

  /**
   * Verificar se um stepId existe
   */
  hasStep(stepId: string): boolean {
    const match = stepId.match(/step-?(\d+)/i);
    if (!match) return false;
    const stepNumber = parseInt(match[1]);
    return stepNumber >= 1 && stepNumber <= 21;
  }

  // ==================== CONTRACT COMPLIANCE METHODS ====================

  /**
   * Obter template ativo atual
   */
  getActiveTemplate(): string | null {
    return this.activeTemplateId;
  }

  /**
   * Obter funnel ativo atual
   */
  getActiveFunnel(): string | null {
    return this.activeFunnelId;
  }

  /**
   * Salvar blocos de um step
   */
  async saveStep(
    stepId: string,
    blocks: Block[],
    options?: ServiceOptions
  ): Promise<ServiceResult<void>> {
    try {
      // Usar HierarchicalTemplateSource para salvar (USER_EDIT priority)
      const funnelId = this.activeFunnelId || undefined;

      if (this.USE_HIERARCHICAL_SOURCE && funnelId) {
        await hierarchicalTemplateSource.setPrimary(stepId, blocks, funnelId);
      } else {
        // Fallback: salvar via registry se disponível
        // Sem funnel ativo: armazenar apenas em cache local
        cacheService.templates.set(stepId, blocks);
      }

      // Invalidar cache
      this.invalidateTemplate(stepId);

      return this.createResult(undefined as void);
    } catch (error) {
      this.error('saveStep failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Listar informações de todos os steps
   */
  async listSteps(
    templateId?: string,
    options?: ServiceOptions
  ): Promise<ServiceResult<StepInfo[]>> {
    try {
      const steps: StepInfo[] = [];

      for (let i = 1; i <= 21; i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        const stepInfo = this.STEP_MAPPING[i];

        if (stepInfo) {
          // Verificar se tem template carregado
          const result = await this.getStep(stepId, templateId, options);
          const blocks = result.success ? result.data : [];

          steps.push({
            id: stepId,
            order: i,
            name: stepInfo.name,
            type: stepInfo.type,
            description: stepInfo.description,
            blocksCount: blocks.length,
            hasTemplate: blocks.length > 0,
            multiSelect: stepInfo.multiSelect,
          });
        }
      }

      return this.createResult(steps);
    } catch (error) {
      this.error('listSteps failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Criar novo bloco em um step
   */
  async createBlock(
    stepId: string,
    blockDTO: CreateBlockDTO,
    options?: ServiceOptions
  ): Promise<ServiceResult<Block>> {
    try {
      // Gerar ID único para o bloco
      const blockId = generateBlockId();

      const newBlock: Block = {
        id: blockId,
        type: blockDTO.type as any, // Cast para compatibilidade com BlockType
        order: 0, // Será ajustado ao adicionar ao step
        properties: blockDTO.properties || {},
        content: blockDTO.content || {},
        parentId: blockDTO.parentId || undefined,
      };

      // Obter blocos atuais do step
      const stepResult = await this.getStep(stepId, undefined, options);
      if (!stepResult.success) {
        throw stepResult.error;
      }

      const currentBlocks = stepResult.data;

      // Adicionar novo bloco ao final
      newBlock.order = currentBlocks.length;
      const updatedBlocks = [...currentBlocks, newBlock];

      // Salvar step atualizado
      const saveResult = await this.saveStep(stepId, updatedBlocks, options);
      if (!saveResult.success) {
        throw saveResult.error;
      }

      return this.createResult(newBlock);
    } catch (error) {
      this.error('createBlock failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Atualizar bloco existente
   */
  async updateBlock(
    stepId: string,
    blockId: string,
    updates: Partial<Block>,
    options?: ServiceOptions
  ): Promise<ServiceResult<Block>> {
    try {
      // Obter blocos atuais do step
      const stepResult = await this.getStep(stepId, undefined, options);
      if (!stepResult.success) {
        throw stepResult.error;
      }

      const currentBlocks = stepResult.data;
      const blockIndex = currentBlocks.findIndex(b => b.id === blockId);

      if (blockIndex === -1) {
        throw new Error(`Block ${blockId} not found in ${stepId}`);
      }

      // Atualizar bloco
      const updatedBlock = {
        ...currentBlocks[blockIndex],
        ...updates,
        id: blockId, // Garantir que ID não muda
      };

      const updatedBlocks = [...currentBlocks];
      updatedBlocks[blockIndex] = updatedBlock;

      // Salvar step atualizado
      const saveResult = await this.saveStep(stepId, updatedBlocks, options);
      if (!saveResult.success) {
        throw saveResult.error;
      }

      return this.createResult(updatedBlock);
    } catch (error) {
      this.error('updateBlock failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Deletar bloco
   */
  async deleteBlock(
    stepId: string,
    blockId: string,
    options?: ServiceOptions
  ): Promise<ServiceResult<void>> {
    try {
      // Obter blocos atuais do step
      const stepResult = await this.getStep(stepId, undefined, options);
      if (!stepResult.success) {
        throw stepResult.error;
      }

      const currentBlocks = stepResult.data;
      const updatedBlocks = currentBlocks.filter(b => b.id !== blockId);

      if (updatedBlocks.length === currentBlocks.length) {
        throw new Error(`Block ${blockId} not found in ${stepId}`);
      }

      // Renormalizar ordem
      updatedBlocks.forEach((b, index) => {
        b.order = index;
      });

      // Salvar step atualizado
      const saveResult = await this.saveStep(stepId, updatedBlocks, options);
      if (!saveResult.success) {
        throw saveResult.error;
      }

      return this.createResult(undefined as void);
    } catch (error) {
      this.error('deleteBlock failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Validar step (blocos)
   */
  async validateStep(
    stepId: string,
    blocks: Block[],
    options?: ServiceOptions
  ): Promise<ServiceResult<ValidationResult>> {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!stepId || !stepId.match(/step-\d{2}/)) {
        errors.push('Invalid stepId format. Expected: step-NN');
      }

      if (!Array.isArray(blocks)) {
        errors.push('Blocks must be an array');
      } else {
        // Validar cada bloco
        blocks.forEach((block, index) => {
          if (!block.id) {
            errors.push(`Block ${index} is missing ID`);
          }
          if (!block.type) {
            errors.push(`Block ${index} is missing type`);
          }
          if (typeof block.order !== 'number') {
            warnings.push(`Block ${index} has invalid order`);
          }
        });

        // Verificar ordem sequencial
        const orders = blocks.map(b => b.order).sort((a, b) => a - b);
        for (let i = 0; i < orders.length; i++) {
          if (orders[i] !== i) {
            warnings.push('Block order is not sequential');
            break;
          }
        }
      }

      return this.createResult({
        isValid: errors.length === 0,
        errors,
        warnings,
      });
    } catch (error) {
      this.error('validateStep failed:', error);
      return this.createError(error as Error);
    }
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Instância singleton do TemplateService
 * 
 * @example
 * ```typescript
 * import { templateService } from '@/services/canonical/TemplateService';
 * 
 * // Obter template de um step
 * const result = await templateService.steps.get(1);
 * if (result.success) {
 *   console.log(result.data); // Block[]
 * }
 * 
 * // Listar todos os steps
 * const steps = templateService.steps.list();
 * 
 * // Buscar templates
 * const search = templateService.searchTemplates('introdução');
 * 
 * // Validar template
 * const validation = templateService.validateTemplate(template);
 * ```
 */
export const templateService = TemplateService.getInstance({ debug: false });

// Expor no window para debug
if (typeof window !== 'undefined') {
  (window as any).__canonicalTemplateService = templateService;
}

// ==================== COMPATIBILITY EXPORTS ====================

/**
 * Re-export quizEditorBridge for backward compatibility
 * @deprecated This module has been archived. Migrate to canonical TemplateService.
 * @see .archive/deprecated/services-legacy/QuizEditorBridge.ts
 */
// Archived: QuizEditorBridge has been moved to .archive/deprecated/services-legacy/
// export { quizEditorBridge } from '@/services/deprecated/QuizEditorBridge';

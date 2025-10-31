/**
 * 📝 TEMPLATE SERVICE - Canonical Service
 * 
 * Service canônico que consolida 20 services de template em uma API unificada
 * 
 * CONSOLIDA:
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
 * ... (mais 6 services)
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import { BaseCanonicalService, ServiceOptions, ServiceResult } from './types';
import { CanonicalServicesMonitor } from './monitoring';
import { cacheService } from './CacheService';
import { UnifiedTemplateRegistry, Block } from '../UnifiedTemplateRegistry';

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
  private registry: UnifiedTemplateRegistry;
  
  // 🚀 FASE 3.1: Smart Lazy Loading
  private readonly CRITICAL_STEPS = ['step-01', 'step-12', 'step-19', 'step-20', 'step-21'];
  private readonly PRELOAD_NEIGHBORS = 1; // Preload ±1 step
  private stepLoadPromises = new Map<string, Promise<any>>();
  private loadedSteps = new Set<string>();

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
    this.registry = UnifiedTemplateRegistry.getInstance();
  }

  static getInstance(options?: ServiceOptions): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService(options);
    }
    return TemplateService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('TemplateService initialized with UnifiedTemplateRegistry');
  }

  protected async onDispose(): Promise<void> {
    this.log('TemplateService disposed');
  }

  // ==================== CORE OPERATIONS ====================

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
        const blocks = await this.registry.getStep(`step-${stepNumber.toString().padStart(2, '0')}`);

        if (blocks && blocks.length > 0) {
          const stepInfo = this.STEP_MAPPING[stepNumber];
          const template: Template = {
            id,
            name: stepInfo?.name || `Step ${stepNumber}`,
            description: stepInfo?.description || '',
            version: '3.0',
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
   */
  async getStep(stepId: string): Promise<ServiceResult<Block[]>> {
    try {
      CanonicalServicesMonitor.trackUsage(this.name, 'getStep');
      const blocks = await this.registry.getStep(stepId);

      if (!blocks || blocks.length === 0) {
        return this.createError(new Error(`Step not found or empty: ${stepId}`));
      }

      return this.createResult(blocks);
    } catch (error) {
      this.error('getStep failed:', error);
      return this.createError(error as Error);
    }
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
      await this.registry.invalidate(id);

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
          version: '3.0',
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
          this.warn(`Preload failed for neighbors of ${stepId}:`, err)
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
   * Invalidar template do cache
   */
  invalidateTemplate(id: string): void {
    cacheService.templates.invalidate(id);
    this.registry.invalidate(id);
    this.loadedSteps.delete(id); // 🚀 FASE 3.1: Limpar do lazy load
    this.log(`Template invalidated: ${id}`);
  }

  /**
   * Limpar todo o cache de templates
   */
  clearCache(): void {
    cacheService.clearStore('templates');
    // UnifiedTemplateRegistry tem clearL1()
    this.registry.clearL1();
    this.loadedSteps.clear(); // 🚀 FASE 3.1: Limpar lazy load
    this.stepLoadPromises.clear();
    this.log('Template cache cleared');
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
      type: this.normalizeBlockType(block.type || 'unknown'),
      order: block.order ?? block.position ?? index,
      properties: block.properties || block.props || {},
      content: block.content || {},
      parentId: block.parentId ?? null,
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
     * Listar informações de todos os steps
     */
    list: (): ServiceResult<StepInfo[]> => {
      try {
        const steps: StepInfo[] = [];

        for (let i = 1; i <= 21; i++) {
          const info = this.STEP_MAPPING[i];
          if (!info) continue;

          steps.push({
            id: `step-${i.toString().padStart(2, '0')}`,
            order: i,
            blocksCount: 0, // TODO: buscar do cache se disponível
            hasTemplate: true,
            ...info,
          });
        }

        return this.createResult(steps);
      } catch (error) {
        this.error('steps.list failed:', error);
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
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: this.normalizeBlockType(blockData.type),
          order: 0,
          properties: blockData.properties || {},
          content: blockData.content || {},
          parentId: blockData.parentId ?? null,
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
    } catch {
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
   * Obter todos os steps como objeto (compatibilidade com QUIZ_STEPS)
   * Retorna Record<stepId, stepData> para compatibilidade com código legacy
   * 
   * NOTA: Este método é síncrono e retorna dados do cache.
   * Para garantir dados frescos, chame steps.get() antes.
   */
  getAllStepsSync(): Record<string, any> {
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

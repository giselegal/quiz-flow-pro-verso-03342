/**
 * 📋 TEMPLATE SERVICE CONTRACT - Interface TypeScript Canônica
 * 
 * Contrato formal para TemplateService, garantindo:
 * - Type safety completo
 * - API consistente entre client/backend
 * - Suporte a AbortSignal
 * - Result<T> pattern para error handling
 * - Documentação clara de comportamentos
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import type { ServiceResult, ServiceOptions } from './types';
import type { Block } from '@/types/editor';

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Template metadata
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  isPublic?: boolean;
  funnelType?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Template completo (todos os steps)
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

/**
 * Step metadata (informações de uma etapa)
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
 * Filtros para busca de templates
 */
export interface TemplateFilters {
  category?: string;
  tags?: string[];
  author?: string;
  isPublic?: boolean;
  funnelType?: string;
  searchTerm?: string;
}

/**
 * DTO para criação de blocos
 */
export interface CreateBlockDTO {
  type: string;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  parentId?: string | null;
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Options específicas para operações de template
 */
export interface TemplateOperationOptions extends ServiceOptions {
  /**
   * ID do funil ativo (usado para priorizar USER_EDIT no HierarchicalSource)
   */
  funnelId?: string;

  /**
   * Forçar reload ignorando cache
   */
  forceReload?: boolean;

  /**
   * Incluir metadados extras na resposta
   */
  includeMetadata?: boolean;
}

// ============================================================================
// INTERFACE CONTRACT
// ============================================================================

/**
 * Contrato formal do TemplateService
 * 
 * Todos os métodos devem:
 * - Retornar ServiceResult<T> para error handling consistente
 * - Aceitar AbortSignal via options para cancelamento
 * - Documentar comportamento esperado e edge cases
 * - Garantir type safety completo
 */
export interface ITemplateService {
  // ==========================================================================
  // TEMPLATE OPERATIONS
  // ==========================================================================

  /**
   * Obter template completo por ID
   * 
   * @param id - ID do template
   * @param options - Opções de operação (signal, funnelId, forceReload)
   * @returns ServiceResult com Template completo ou erro
   * 
   * @example
   * const result = await service.getTemplate('quiz21StepsComplete', { signal });
   * if (result.success) {
   *   console.log(result.data.blocks.length);
   * }
   */
  getTemplate(
    id: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Template>>;

  /**
   * Salvar template completo
   * 
   * @param template - Template a ser salvo
   * @param options - Opções de operação
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  saveTemplate(
    template: Template,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;

  /**
   * Atualizar template existente (merge parcial)
   * 
   * @param id - ID do template a atualizar
   * @param updates - Atualizações parciais
   * @param options - Opções de operação
   * @returns ServiceResult<Template> com template atualizado
   */
  updateTemplate(
    id: string,
    updates: Partial<Template>,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Template>>;

  /**
   * Deletar template
   * 
   * @param id - ID do template a deletar
   * @param options - Opções de operação
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  deleteTemplate(
    id: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;

  /**
   * Listar templates disponíveis
   * 
   * @param filters - Filtros de busca
   * @param options - Opções de operação
   * @returns ServiceResult com array de TemplateMetadata
   */
  listTemplates(
    filters?: TemplateFilters,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<TemplateMetadata[]>>;

  // ==========================================================================
  // STEP OPERATIONS
  // ==========================================================================

  /**
   * Obter blocos de um step específico
   * 
   * Ordem de prioridade (HierarchicalSource):
   * 1. USER_EDIT (edições do usuário via funnelId)
   * 2. BASE_TEMPLATE (template base JSON)
   * 3. FUNNEL_STORAGE (fallback)
   * 4. SUPABASE (fallback remoto)
   * 
   * @param stepId - ID do step (ex: 'step-01')
   * @param templateId - ID do template (opcional)
   * @param options - Opções de operação (signal, funnelId obrigatório para USER_EDIT)
   * @returns ServiceResult com array de Block[]
   * 
   * @example
   * const result = await service.getStep('step-01', 'quiz21', { 
   *   funnelId: 'funnel-123',
   *   signal 
   * });
   */
  getStep(
    stepId: string,
    templateId?: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Block[]>>;

  /**
   * Salvar blocos de um step
   * 
   * @param stepId - ID do step
   * @param blocks - Array de blocos a salvar
   * @param options - Opções de operação (funnelId recomendado)
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  saveStep(
    stepId: string,
    blocks: Block[],
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;

  /**
   * Listar informações de todos os steps de um template
   * 
   * @param templateId - ID do template (opcional, usa ativo se omitido)
   * @param options - Opções de operação
   * @returns ServiceResult com array de StepInfo
   */
  listSteps(
    templateId?: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<StepInfo[]>>;

  // ==========================================================================
  // BLOCK OPERATIONS
  // ==========================================================================

  /**
   * Criar novo bloco em um step
   * 
   * @param stepId - ID do step
   * @param blockDTO - DTO com dados do bloco
   * @param options - Opções de operação
   * @returns ServiceResult com Block criado (incluindo ID gerado)
   */
  createBlock(
    stepId: string,
    blockDTO: CreateBlockDTO,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Block>>;

  /**
   * Atualizar bloco existente
   * 
   * @param stepId - ID do step
   * @param blockId - ID do bloco
   * @param updates - Atualizações parciais
   * @param options - Opções de operação
   * @returns ServiceResult<Block> com bloco atualizado
   */
  updateBlock(
    stepId: string,
    blockId: string,
    updates: Partial<Block>,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Block>>;

  /**
   * Deletar bloco
   * 
   * @param stepId - ID do step
   * @param blockId - ID do bloco
   * @param options - Opções de operação
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  deleteBlock(
    stepId: string,
    blockId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  /**
   * Validar estrutura de um template
   * 
   * @param template - Template a validar
   * @param options - Opções de operação
   * @returns ServiceResult com ValidationResult
   */
  validateTemplate(
    template: Template,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<ValidationResult>>;

  /**
   * Validar estrutura de um step
   * 
   * @param stepId - ID do step
   * @param blocks - Array de blocos a validar
   * @param options - Opções de operação
   * @returns ServiceResult com ValidationResult
   */
  validateStep(
    stepId: string,
    blocks: Block[],
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<ValidationResult>>;

  // ==========================================================================
  // CACHE & STATE MANAGEMENT
  // ==========================================================================

  /**
   * Invalidar cache de um template específico
   * 
   * @param templateId - ID do template a invalidar (ou 'all' para tudo)
   * @param options - Opções de operação
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  invalidateCache(
    templateId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;

  /**
   * Definir template ativo para navegação
   * 
   * @param templateId - ID do template ativo (ou null para limpar)
   * @param totalSteps - Total de steps do template
   * @returns void
   */
  setActiveTemplate(
    templateId: string | null,
    totalSteps?: number
  ): void;

  /**
   * Definir funnel ativo (prioriza USER_EDIT no HierarchicalSource)
   * 
   * @param funnelId - ID do funnel ativo (ou null para limpar)
   * @returns void
   */
  setActiveFunnel(
    funnelId: string | null
  ): void;

  /**
   * Obter template ativo atual
   * 
   * @returns ID do template ativo ou null
   */
  getActiveTemplate(): string | null;

  /**
   * Obter funnel ativo atual
   * 
   * @returns ID do funnel ativo ou null
   */
  getActiveFunnel(): string | null;

  // ==========================================================================
  // PERFORMANCE & OPTIMIZATION
  // ==========================================================================

  /**
   * Preparar template (preload crítico + metadados)
   * 
   * @param templateId - ID do template a preparar
   * @param options - Opções de operação
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  prepareTemplate(
    templateId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;

  /**
   * Preload completo de template (todos os steps)
   * 
   * @param templateId - ID do template a carregar
   * @param options - Opções de operação
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  preloadTemplate(
    templateId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;

  /**
   * Preload de steps vizinhos (navegação rápida)
   * 
   * @param currentStepId - ID do step atual
   * @param neighborCount - Quantidade de vizinhos (padrão: 1)
   * @param options - Opções de operação
   * @returns ServiceResult<void> indicando sucesso ou erro
   */
  preloadNeighbors(
    currentStepId: string,
    neighborCount?: number,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>>;
}

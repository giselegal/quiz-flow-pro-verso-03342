/**
 * 🔌 TEMPLATE SERVICE ADAPTER
 * 
 * Adapter que faz a implementação atual do TemplateService
 * conformar ao contrato ITemplateService.
 * 
 * Benefícios:
 * - Garante type safety completo
 * - Facilita testes (mock do contrato)
 * - Permite migração gradual
 * - Backward compatibility garantida
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import type { 
  ITemplateService,
  Template,
  TemplateMetadata,
  StepInfo,
  TemplateFilters,
  CreateBlockDTO,
  ValidationResult,
  TemplateOperationOptions,
} from './ITemplateService';
import type { ServiceResult } from './types';
import type { Block } from '@/types/editor';
import { TemplateService } from './TemplateService';

/**
 * Adapter que envolve TemplateService e garante conformidade com ITemplateService
 */
export class TemplateServiceAdapter implements ITemplateService {
  private service: TemplateService;

  constructor(service?: TemplateService) {
    this.service = service ?? TemplateService.getInstance();
  }

  // ==========================================================================
  // TEMPLATE OPERATIONS
  // ==========================================================================

  async getTemplate(
    id: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Template>> {
    try {
      // TemplateService.getTemplate não aceita options (apenas id)
      const result = await this.service.getTemplate(id);
      
      // Converter tipos do TemplateService para ITemplateService
      if (result.success) {
        return {
          success: true,
          data: this.normalizeTemplate(result.data),
        };
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async saveTemplate(
    template: Template,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      // TemplateService.saveTemplate não aceita options
      return await this.service.saveTemplate(template as any);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async updateTemplate(
    id: string,
    updates: Partial<Template>,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Template>> {
    try {
      // TemplateService.updateTemplate retorna void, precisamos buscar template atualizado
      const updateResult = await this.service.updateTemplate(id, updates as any);
      
      if (!updateResult.success) {
        return updateResult as ServiceResult<Template>;
      }
      
      // Buscar template atualizado
      const getResult = await this.service.getTemplate(id);
      
      if (getResult.success) {
        return {
          success: true,
          data: this.normalizeTemplate(getResult.data),
        };
      }
      
      return getResult;
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async deleteTemplate(
    id: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      // TemplateService.deleteTemplate não aceita options
      return await this.service.deleteTemplate(id);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async listTemplates(
    filters?: TemplateFilters,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<TemplateMetadata[]>> {
    try {
      // TemplateService.listTemplates não aceita options e retorna ServiceResult<Template[]>
      const result = this.service.listTemplates(filters);
      
      if (result.success) {
        // Converter Template[] para TemplateMetadata[]
        return {
          success: true,
          data: result.data.map(t => this.normalizeTemplate(t).metadata),
        };
      }
      
      return result as ServiceResult<TemplateMetadata[]>;
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // ==========================================================================
  // STEP OPERATIONS
  // ==========================================================================

  async getStep(
    stepId: string,
    templateId?: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Block[]>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.getStep(stepId, templateId, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async saveStep(
    stepId: string,
    blocks: Block[],
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.saveStep(stepId, blocks, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async listSteps(
    templateId?: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<StepInfo[]>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.listSteps(templateId, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // ==========================================================================
  // BLOCK OPERATIONS
  // ==========================================================================

  async createBlock(
    stepId: string,
    blockDTO: CreateBlockDTO,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Block>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.createBlock(stepId, blockDTO, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async updateBlock(
    stepId: string,
    blockId: string,
    updates: Partial<Block>,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<Block>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.updateBlock(stepId, blockId, updates, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async deleteBlock(
    stepId: string,
    blockId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.deleteBlock(stepId, blockId, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  async validateTemplate(
    template: Template,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<ValidationResult>> {
    try {
      // TemplateService.validateTemplate é síncrono e retorna ValidationResult diretamente
      const validationResult = this.service.validateTemplate(template as any);
      
      return {
        success: true,
        data: validationResult,
      };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async validateStep(
    stepId: string,
    blocks: Block[],
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<ValidationResult>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.validateStep(stepId, blocks, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // ==========================================================================
  // CACHE & STATE MANAGEMENT
  // ==========================================================================

  async invalidateCache(
    templateId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      // TemplateService tem invalidateTemplate (singular)
      if (templateId === 'all') {
        // Invalidar todos os templates conhecidos
        const templatesResult = this.service.listTemplates({});
        if (templatesResult.success) {
          for (const t of templatesResult.data) {
            this.service.invalidateTemplate?.(t.id);
          }
        }
      } else {
        this.service.invalidateTemplate?.(templateId);
      }
      
      return { success: true, data: undefined as void };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  setActiveTemplate(templateId: string | null, totalSteps?: number): void {
    if (templateId !== null) {
      this.service.setActiveTemplate?.(templateId, totalSteps ?? 21);
    }
  }

  setActiveFunnel(funnelId: string | null): void {
    this.service.setActiveFunnel?.(funnelId);
  }

  getActiveTemplate(): string | null {
    return this.service.getActiveTemplate?.() ?? null;
  }

  getActiveFunnel(): string | null {
    return this.service.getActiveFunnel?.() ?? null;
  }

  // ==========================================================================
  // PERFORMANCE & OPTIMIZATION
  // ==========================================================================

  async prepareTemplate(
    templateId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.prepareTemplate(templateId, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async preloadTemplate(
    templateId: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.preloadTemplate(templateId, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async preloadNeighbors(
    currentStepId: string,
    neighborCount: number = 1,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      // TemplateService tem preloadNeighborsAndCritical (privado, apenas 1 arg)
      // Implementar preload manual de vizinhos
      const match = currentStepId.match(/step-(\d+)/);
      if (!match) {
        throw new Error('Invalid stepId format');
      }
      
      const currentStep = parseInt(match[1], 10);
      const promises: Promise<any>[] = [];
      
      for (let i = -neighborCount; i <= neighborCount; i++) {
        if (i === 0) continue;
        const neighborStep = currentStep + i;
        if (neighborStep < 1 || neighborStep > 21) continue;
        
        const neighborStepId = `step-${String(neighborStep).padStart(2, '0')}`;
        promises.push(
          this.service.getStep(neighborStepId, undefined, options).catch(() => null)
        );
      }
      
      await Promise.allSettled(promises);
      return { success: true, data: undefined as void };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  /**
   * Mapear TemplateOperationOptions para ServiceOptions do TemplateService
   */
  private mapOptions(options?: TemplateOperationOptions): any {
    if (!options) return undefined;

    // TemplateService espera ServiceOptions + campos extras
    return {
      signal: options.signal,
      timeout: options.timeout,
      debug: options.debug,
      retry: options.retry,
      // Campos específicos de template
      funnelId: options.funnelId,
      forceReload: options.forceReload,
      includeMetadata: options.includeMetadata,
    };
  }

  /**
   * Normalizar Template do TemplateService para ITemplateService
   */
  private normalizeTemplate(template: any): Template {
    return {
      id: template.id,
      name: template.name,
      description: template.description || '',
      version: template.version || '1.0',
      blocks: template.blocks || [],
      metadata: {
        id: template.metadata?.id || template.id,
        name: template.metadata?.name || template.name,
        description: template.metadata?.description || template.description || '',
        version: template.metadata?.version || template.version || '1.0',
        author: template.metadata?.author,
        category: template.metadata?.category,
        tags: template.metadata?.tags || [],
        thumbnail: template.metadata?.thumbnail,
        isPublic: template.metadata?.isPublic,
        funnelType: template.metadata?.funnelType,
        createdAt: template.createdAt || template.metadata?.createdAt,
        updatedAt: template.updatedAt || template.metadata?.updatedAt,
      },
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}

/**
 * Factory para criar adapter do TemplateService
 */
export function createTemplateServiceAdapter(service?: TemplateService): ITemplateService {
  return new TemplateServiceAdapter(service);
}

/**
 * Instância singleton do adapter (usa TemplateService.getInstance())
 */
export const templateServiceAdapter = createTemplateServiceAdapter();

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
      // Mapear options para formato do service
      const serviceOptions = this.mapOptions(options);
      return await this.service.getTemplate(id, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async saveTemplate(
    template: Template,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.saveTemplate(template, serviceOptions);
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
      const serviceOptions = this.mapOptions(options);
      return await this.service.updateTemplate(id, updates, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async deleteTemplate(
    id: string,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<void>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.deleteTemplate(id, serviceOptions);
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async listTemplates(
    filters?: TemplateFilters,
    options?: TemplateOperationOptions
  ): Promise<ServiceResult<TemplateMetadata[]>> {
    try {
      const serviceOptions = this.mapOptions(options);
      return await this.service.listTemplates(filters, serviceOptions);
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
      const serviceOptions = this.mapOptions(options);
      return await this.service.validateTemplate(template, serviceOptions);
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
      const serviceOptions = this.mapOptions(options);
      
      // TemplateService tem invalidateTemplate (singular)
      if (templateId === 'all') {
        // Invalidar todos os templates conhecidos
        const templatesResult = await this.service.listTemplates({}, serviceOptions);
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
    this.service.setActiveTemplate?.(templateId, totalSteps);
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
      const serviceOptions = this.mapOptions(options);
      // TemplateService tem preloadNeighborsAndCritical
      await this.service.preloadNeighborsAndCritical?.(currentStepId, neighborCount);
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

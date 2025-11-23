import { templateService } from '@/services/canonical/TemplateService';
import { BaseUnifiedService } from './UnifiedServiceManager';

/**
 * ConsolidatedTemplateService
 * Wrapper fino em torno do `templateService` canônico,
 * apenas para manter compatibilidade com imports existentes
 * em `QuizDataService`, `TemplateLoader` e `ServiceRegistry`.
 */

export class ConsolidatedTemplateService extends BaseUnifiedService {
  constructor() {
    super({
      name: 'ConsolidatedTemplateService',
      priority: 1,
      cacheTTL: 5 * 60 * 1000,
      retryAttempts: 2,
      timeout: 15_000,
    });
  }

  getName(): string {
    return 'ConsolidatedTemplateService';
  }

  async healthCheck(): Promise<boolean> {
    // Se o TemplateService canônico estiver pronto, consideramos saudável
    try {
      const result = await templateService.getTemplate('step-01');
      return result.success === true;
    } catch {
      return false;
    }
  }

  async getTemplate(id: string): Promise<any> {
    return this.executeWithMetrics(async () => {
      const result = await templateService.getTemplate(id);
      if (!result.success) throw result.error;
      return result.data;
    }, 'getTemplate');
  }

  async getStepBlocks(stepKey: string): Promise<any[]> {
    return this.executeWithMetrics(async () => {
      const result = await templateService.getStep(stepKey);
      if (!result.success) return [];
      return (result.data as any[]) ?? [];
    }, 'getStepBlocks');
  }

  async preloadCriticalTemplates(): Promise<void> {
    await this.executeWithMetrics(async () => {
      if (typeof (templateService as any).preloadCriticalTemplates === 'function') {
        await (templateService as any).preloadCriticalTemplates();
      }
    }, 'preloadCriticalTemplates');
  }

  getCacheStats(): any {
    if (typeof (templateService as any).getCacheStats === 'function') {
      return (templateService as any).getCacheStats();
    }
    return {};
  }
}

export const consolidatedTemplateService = new ConsolidatedTemplateService();

export default consolidatedTemplateService;

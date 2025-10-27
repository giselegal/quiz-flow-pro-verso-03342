/**
 * 📋 UNIFIED TEMPLATE SERVICE (LEGADO) — Wrapper deprecatado para TemplateService canônico
 */

import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/services/UnifiedTemplateRegistry';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

export class UnifiedTemplateService {
  private static instance: UnifiedTemplateService;
  private static warned = false;

  private constructor() {}

  private static warnOnce() {
    if (!this.warned) {
      this.warned = true;
      console.warn('\n⚠️ DEPRECATED: UnifiedTemplateService está descontinuado.\nUse: import { templateService } from \'@/services/canonical/TemplateService\'\nSerá removido em: v2.0.0\n');
    }
  }

  static getInstance(): UnifiedTemplateService {
    if (!this.instance) {
      this.instance = new UnifiedTemplateService();
    }
    return this.instance;
  }

  getStepTemplate(stepId: string, _funnelId?: string): any {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'getStepTemplate');
    // Retorna bloco(s) do step
    // Nota: templateService.getStep retorna ServiceResult<Block[]>; aqui retornamos diretamente o array de blocos
    // Chamadores legados esperam qualquer[]
    // Como getStep é assíncrono, simplificamos para versão sync retornando vazio e recomendamos migração.
    console.warn('getStepTemplate é síncrono no legado; para dados reais, migre para templateService.getStep');
    return [];
  }

  getAllSteps(): Record<string, any> {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'getAllSteps');
    console.warn('getAllSteps legado: utilize templateService.steps.list + getStep');
    return {};
  }

  getTemplate(templateName: string): Record<string, any> | null {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'getTemplate');
    if (templateName === 'quiz21StepsComplete') {
      console.warn('Use templateService.steps.list() e getStep()');
      return {};
    }
    return null;
  }

  async loadStepBlocks(stepId: string, _funnelId?: string): Promise<Block[]> {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'loadStepBlocks');
    try {
      const result = await templateService.getStep(stepId);
      if (!result.success) {
        console.warn(`[UnifiedTemplateService] getStep falhou para ${stepId}:`, (result as any).error);
        return [];
      }
      if (Array.isArray(result.data)) {
        return result.data as Block[];
      }
      return [];
    } catch (error) {
      console.error(`[UnifiedTemplateService] Erro ao carregar step ${stepId}:`, error);
      return [];
    }
  }

  publishStep(_stepId: string): boolean {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'publishStep');
    return true;
  }

  unpublishStep(_stepId: string): boolean {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'unpublishStep');
    return true;
  }

  preloadCommonSteps(): void {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'preloadCommonSteps');
  }

  invalidateCache(stepId?: string): void {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'invalidateCache');
    if (stepId) templateService.invalidateTemplate(stepId);
    else templateService.clearCache();
  }

  clearCache(): void {
    UnifiedTemplateService.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'clearCache');
    templateService.clearCache();
  }
}

export const unifiedTemplateService = UnifiedTemplateService.getInstance();

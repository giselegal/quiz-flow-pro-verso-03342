import { unifiedTemplateService } from '../services/UnifiedTemplateService';
import type { Block } from '../types/editor';
import { StorageService } from '@/services/core/StorageService';

/**
 * 🎯 TEMPLATE MANAGER - FASE 2 CONSOLIDADO
 * 
 * Agora usa UnifiedTemplateService internamente
 * Mantém API backward compatible
 */
export class TemplateManager {
  private static cache = new Map<string, Block[]>();
  private static PUBLISH_PREFIX = 'quiz_published_blocks_';

  static async loadStepBlocks(stepId: string, funnelId?: string): Promise<Block[]> {
    return await unifiedTemplateService.loadStepBlocks(stepId, funnelId);
  }

  static publishStep(stepId: string, blocks: Block[]): void {
    unifiedTemplateService.publishStep(stepId, blocks);
  }

  static unpublishStep(stepId: string): void {
    unifiedTemplateService.unpublishStep(stepId);
  }

  static async preloadCommonTemplates(): Promise<void> {
    return unifiedTemplateService.preloadCommonSteps();
  }

  static async reloadTemplate(stepId: string, funnelId?: string): Promise<Block[]> {
    const cacheKey = funnelId ? `${stepId}:${funnelId}` : stepId;
    unifiedTemplateService.invalidateCache(cacheKey);
    return unifiedTemplateService.loadStepBlocks(stepId, funnelId);
  }

  static getAvailableTemplates(maxSteps: number = 21): string[] {
    return Array.from({ length: maxSteps }, (_, i) => `step-${i + 1}`);
  }

  static hasTemplate(stepId: string, maxSteps: number = 21): boolean {
    const stepNumber = parseInt(stepId.replace('step-', ''));
    return stepNumber >= 1 && stepNumber <= maxSteps;
  }

  static clearCache(): void {
    unifiedTemplateService.invalidateCache();
  }
}
// @ts-nocheck
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

  static async loadStepBlocks(stepId: string): Promise<Block[]> {
    return await unifiedTemplateService.loadStepBlocks(stepId);
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

  static async reloadTemplate(stepId: string): Promise<Block[]> {
    unifiedTemplateService.invalidateCache(stepId);
    return unifiedTemplateService.loadStepBlocks(stepId);
  }

  static getAvailableTemplates(): string[] {
    return Array.from({ length: 21 }, (_, i) => `step-${i + 1}`);
  }

  static hasTemplate(stepId: string): boolean {
    const stepNumber = parseInt(stepId.replace('step-', ''));
    return stepNumber >= 1 && stepNumber <= 21;
  }

  static clearCache(): void {
    unifiedTemplateService.invalidateCache();
  }
}
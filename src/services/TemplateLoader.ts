/**
 * 🔄 TEMPLATE LOADER - FACADE DE COMPATIBILIDADE
 * @deprecated Use `templateService` de '@/services' ao invés deste arquivo
 * 
 * Este arquivo foi convertido para facade que delega ao templateService canônico.
 * Mantido apenas para compatibilidade com imports existentes.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { loadFunnelTemplate, clearTemplateCache } from '@/services/TemplateLoader';
 * 
 * // ✅ DEPOIS  
 * import { templateService, cacheService } from '@/services';
 * const template = await templateService.getTemplate('quiz21StepsComplete');
 * cacheService.clearStore('templates');
 * ```
 */

import { templateService, cacheService } from '@/services';
import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

// ============================================================================
// TIPOS LEGADOS (Mantidos para compatibilidade)
// ============================================================================

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  steps: FunnelStep[];
  metadata?: Record<string, any>;
}

export interface FunnelStep {
  key: string;
  label: string;
  type: 'intro' | 'question' | 'transition' | 'result' | 'offer';
  blocks: Block[];
  metadata?: {
    duration?: number;
    skipable?: boolean;
    [key: string]: any;
  };
}

// ============================================================================
// FUNÇÕES LEGADAS (Delegam para templateService)
// ============================================================================

/**
 * @deprecated Use `templateService.getTemplate(templateId)` ou `templateService.loadV4Template()`
 */
export async function loadFunnelTemplate(templateId: string): Promise<FunnelTemplate> {
  appLogger.warn('[DEPRECATED] loadFunnelTemplate() → use templateService.getTemplate()');
  
  try {
    // Tentar carregar via templateService
    const result = await templateService.loadV4Template();
    
    if (result.success && result.data) {
      const v4Data = result.data;
      
      // Converter formato v4 para FunnelTemplate legado
      const template: FunnelTemplate = {
        id: templateId,
        name: v4Data.name || templateId,
        description: v4Data.description || '',
        version: v4Data.version || '4.0.0',
        author: v4Data.metadata?.author,
        steps: v4Data.steps.map((step: any, index: number) => ({
          key: step.id || `step-${String(index + 1).padStart(2, '0')}`,
          label: step.name || `Step ${index + 1}`,
          type: step.type || 'question',
          blocks: step.blocks || [],
          metadata: step.metadata || {},
        })),
        metadata: v4Data.metadata || {},
      };
      
      return template;
    }
    
    throw new Error(`Template '${templateId}' não encontrado`);
  } catch (error) {
    appLogger.error(`[TemplateLoader] Erro ao carregar template ${templateId}:`, error);
    throw error;
  }
}

/**
 * @deprecated Use `cacheService.clearStore('templates')`
 */
export function clearTemplateCache(): void {
  appLogger.warn('[DEPRECATED] clearTemplateCache() → use cacheService.clearStore("templates")');
  cacheService.clearStore('templates');
  templateService.clearCache();
}

/**
 * @deprecated Lista templates disponíveis
 */
export async function listAvailableTemplates(): Promise<string[]> {
  appLogger.warn('[DEPRECATED] listAvailableTemplates() → use templateService.getAllSteps()');
  return ['quiz21StepsComplete'];
}

/**
 * @deprecated Use `templateService.getStep(stepKey)`
 */
export function getStepBlocks(template: FunnelTemplate, stepKey: string): Block[] {
  const step = template.steps.find(s => s.key === stepKey);
  return step?.blocks || [];
}

/**
 * @deprecated
 */
export function getStepKeys(template: FunnelTemplate): string[] {
  return template.steps.map(s => s.key);
}

/**
 * @deprecated
 */
export function validateTemplate(template: any): template is FunnelTemplate {
  if (!template || typeof template !== 'object') return false;
  if (typeof template.id !== 'string') return false;
  if (typeof template.name !== 'string') return false;
  if (!Array.isArray(template.steps)) return false;
  return true;
}

/**
 * @deprecated
 */
export async function preloadTemplate(_templateId: string): Promise<void> {
  appLogger.warn('[DEPRECATED] preloadTemplate()');
  // No-op - preload handled internally by templateService
}

/**
 * @deprecated
 */
export function mergeTemplateBlocks(
  template: FunnelTemplate,
  stepKey: string,
  customBlocks: Partial<Block>[]
): FunnelTemplate {
  const step = template.steps.find(s => s.key === stepKey);
  if (!step) return template;

  const mergedBlocks = step.blocks.map(block => {
    const custom = customBlocks.find(c => c.id === block.id);
    return custom ? { ...block, ...custom } : block;
  });

  return {
    ...template,
    steps: template.steps.map(s =>
      s.key === stepKey ? { ...s, blocks: mergedBlocks } : s
    ),
  };
}

/**
 * @deprecated
 */
export function convertToLegacyFormat(template: FunnelTemplate): Record<string, Block[]> {
  return template.steps.reduce((acc, step) => {
    acc[step.key] = step.blocks;
    return acc;
  }, {} as Record<string, Block[]>);
}

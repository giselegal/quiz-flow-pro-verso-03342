/**
 * 🔄 EDITOR TEMPLATE LOADER - FACADE DE COMPATIBILIDADE
 * @deprecated Use `templateService` de '@/services' ao invés deste arquivo
 * 
 * Este arquivo foi convertido para facade que delega ao templateService canônico.
 * Mantido apenas para compatibilidade com imports existentes.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { TemplateLoader } from '@/services/editor/TemplateLoader';
 * const loader = TemplateLoader.getInstance();
 * const result = await loader.loadStep('step-01');
 * 
 * // ✅ DEPOIS
 * import { templateService } from '@/services';
 * const result = await templateService.getStep('step-01');
 * ```
 */

import { templateService, cacheService } from '@/services';
import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

// ============================================================================
// TIPOS LEGADOS (Mantidos para compatibilidade)
// ============================================================================

export type TemplateSource =
  | 'normalized-json'
  | 'modular-json'
  | 'individual-json'
  | 'master-json'
  | 'consolidated'
  | 'supabase'
  | 'ts-template';

export interface LoadedTemplate {
  blocks: Block[];
  source: TemplateSource;
}

// ============================================================================
// CLASSE LEGADA (Delega para templateService)
// ============================================================================

/**
 * @deprecated Use `templateService` ao invés desta classe
 */
export class TemplateLoader {
  private static instance: TemplateLoader | null = null;

  /**
   * @deprecated Use `templateService` diretamente
   */
  static getInstance(): TemplateLoader {
    if (!TemplateLoader.instance) {
      TemplateLoader.instance = new TemplateLoader();
    }
    return TemplateLoader.instance;
  }

  /**
   * @deprecated
   */
  static resetInstance(): void {
    TemplateLoader.instance = null;
  }

  /**
   * @deprecated Use `templateService.getStep(stepId)`
   */
  async loadStep(step: number | string): Promise<LoadedTemplate> {
    appLogger.warn('[DEPRECATED] TemplateLoader.loadStep() → use templateService.getStep()');
    
    const normalizedKey = this.normalizeStepKey(step);
    
    try {
      const result = await templateService.getStep(normalizedKey);
      
      if (result.success && result.data) {
        return {
          blocks: result.data,
          source: 'consolidated',
        };
      }
      
      // Fallback para array vazio
      return { blocks: [], source: 'ts-template' };
    } catch (error) {
      appLogger.error(`[TemplateLoader] Erro ao carregar ${normalizedKey}:`, error);
      return { blocks: [], source: 'ts-template' };
    }
  }

  /**
   * @deprecated Use `templateService.loadV4Template()`
   */
  async loadMasterTemplate(): Promise<Record<string, Block[]> | null> {
    appLogger.warn('[DEPRECATED] TemplateLoader.loadMasterTemplate() → use templateService.loadV4Template()');
    
    try {
      const result = await templateService.loadV4Template();
      
      if (result.success && result.data) {
        const stepsMap: Record<string, Block[]> = {};
        
        result.data.steps.forEach((step: any) => {
          stepsMap[step.id] = step.blocks || [];
        });
        
        return stepsMap;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * @deprecated
   */
  async preloadSteps(_stepNumbers: number[]): Promise<void> {
    appLogger.warn('[DEPRECATED] TemplateLoader.preloadSteps()');
    // No-op - preload handled internally by templateService
  }

  /**
   * @deprecated Use `cacheService.clearStore('templates')`
   */
  clearCache(): void {
    appLogger.warn('[DEPRECATED] TemplateLoader.clearCache() → use cacheService.clearStore("templates")');
    cacheService.clearStore('templates');
    templateService.clearCache();
  }

  /**
   * @deprecated
   */
  getMetrics(): { 
    cacheHitRate: string | number;
    cacheHits: number; 
    cacheMisses: number; 
    avgLoadTime: string | number;
    totalLoads: number;
    prefetchCount: number; 
  } {
    return {
      cacheHitRate: '0%',
      cacheHits: 0,
      cacheMisses: 0,
      avgLoadTime: '0ms',
      totalLoads: 0,
      prefetchCount: 0,
    };
  }

  /**
   * @deprecated
   */
  resetMetrics(): void {
    // No-op
  }

  /**
   * Normalizar chave do step
   */
  private normalizeStepKey(step: number | string): string {
    if (typeof step === 'number') {
      return `step-${String(step).padStart(2, '0')}`;
    }
    
    // Se já está no formato correto
    if (/^step-\d{2}$/.test(step)) {
      return step;
    }
    
    // Extrair número
    const match = step.match(/\d+/);
    if (match) {
      return `step-${String(parseInt(match[0])).padStart(2, '0')}`;
    }
    
    return step;
  }
}

// ============================================================================
// EXPORT DEFAULT (Compatibilidade)
// ============================================================================

export default TemplateLoader;

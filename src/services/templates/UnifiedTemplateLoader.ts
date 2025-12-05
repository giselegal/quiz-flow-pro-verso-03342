/**
 * 🔄 UNIFIED TEMPLATE LOADER - FACADE DE COMPATIBILIDADE
 * @deprecated Use `templateService` de '@/services' ao invés deste arquivo
 * 
 * Este arquivo foi convertido para facade que delega ao templateService canônico.
 * Mantido apenas para compatibilidade com imports existentes.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { UnifiedTemplateLoader } from '@/services/templates/UnifiedTemplateLoader';
 * const loader = UnifiedTemplateLoader.getInstance();
 * const result = await loader.loadStep('step-01');
 * 
 * // ✅ DEPOIS
 * import { templateService } from '@/services';
 * const result = await templateService.getStep('step-01');
 * ```
 */

import { templateService, cacheService } from '@/services';
import { appLogger } from '@/lib/utils/appLogger';
import { validateQuizSchema, type QuizSchema } from '@/schemas/quiz-schema.zod';
import type { Block } from '@/types/editor';

// ============================================================================
// TIPOS LEGADOS (Mantidos para compatibilidade)
// ============================================================================

export interface LoadOptions {
  useCache?: boolean;
  timeout?: number;
  signal?: AbortSignal;
  forceSource?: 'v4' | 'v3-modular' | 'v3-master' | 'hierarchical';
  funnelId?: string;
}

export interface LoadResult<T> {
  data: T;
  source: 'v4' | 'v3-modular' | 'v3-master' | 'hierarchical' | 'fallback';
  loadTime: number;
  fromCache: boolean;
  warnings?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{ path: string; message: string }>;
  warnings: string[];
}

// ============================================================================
// CLASSE LEGADA (Delega para templateService)
// ============================================================================

/**
 * @deprecated Use `templateService` ao invés desta classe
 */
export class UnifiedTemplateLoader {
  private static instance: UnifiedTemplateLoader;

  private constructor() {
    appLogger.warn('[DEPRECATED] UnifiedTemplateLoader → use templateService');
  }

  /**
   * @deprecated Use `templateService` diretamente
   */
  static getInstance(): UnifiedTemplateLoader {
    if (!UnifiedTemplateLoader.instance) {
      UnifiedTemplateLoader.instance = new UnifiedTemplateLoader();
    }
    return UnifiedTemplateLoader.instance;
  }

  /**
   * @deprecated Use `templateService.getStep(stepId)`
   */
  async loadStep(
    stepId: string,
    options: LoadOptions = {}
  ): Promise<LoadResult<Block[]>> {
    const startTime = performance.now();
    
    appLogger.warn('[DEPRECATED] UnifiedTemplateLoader.loadStep() → use templateService.getStep()');

    try {
      const result = await templateService.getStep(stepId, options.funnelId, {
        signal: options.signal,
      });

      const loadTime = performance.now() - startTime;

      if (result.success && result.data) {
        return {
          data: result.data,
          source: 'v4',
          loadTime,
          fromCache: false,
        };
      }

      throw new Error(result.error?.message || 'Failed to load step');
    } catch (error) {
      const loadTime = performance.now() - startTime;
      
      return {
        data: [],
        source: 'fallback',
        loadTime,
        fromCache: false,
        warnings: [(error as Error).message],
      };
    }
  }

  /**
   * @deprecated Use `templateService.loadV4Template()`
   */
  async loadFullTemplate(
    templateId: string,
    options: LoadOptions = {}
  ): Promise<LoadResult<QuizSchema>> {
    const startTime = performance.now();
    
    appLogger.warn('[DEPRECATED] UnifiedTemplateLoader.loadFullTemplate() → use templateService.loadV4Template()');

    try {
      const result = await templateService.loadV4Template();
      const loadTime = performance.now() - startTime;

      if (result.success && result.data) {
        return {
          data: result.data as QuizSchema,
          source: 'v4',
          loadTime,
          fromCache: false,
        };
      }

      throw new Error(result.error?.message || 'Failed to load template');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @deprecated Use `validateQuizSchema()` diretamente
   */
  async validateTemplate(data: unknown): Promise<ValidationResult> {
    const result = validateQuizSchema(data);

    if (result.success) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
    }

    return {
      isValid: false,
      errors: result.errors.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
      warnings: [],
    };
  }

  /**
   * @deprecated Use `cacheService.clearStore('templates')`
   */
  clearCache(): void {
    appLogger.warn('[DEPRECATED] UnifiedTemplateLoader.clearCache() → use cacheService.clearStore("templates")');
    cacheService.clearStore('templates');
    templateService.clearCache();
  }

  /**
   * @deprecated Use `cacheService.templates.invalidate(stepId)`
   */
  invalidateStep(stepId: string): void {
    cacheService.templates.invalidate(`template:${stepId}`);
  }
}

// ============================================================================
// SINGLETON EXPORT (Compatibilidade)
// ============================================================================

/** @deprecated Use `templateService` */
export const unifiedTemplateLoader = UnifiedTemplateLoader.getInstance();

export default UnifiedTemplateLoader;

/**
 * 🎯 TEMPLATE LOADER - Singleton com cache e deduplicação de Promises
 *
 * Responsável por carregar blocos de templates (steps) de forma otimizada,
 * evitando waterfall de requisições e reaproveitando resultados em memória.
 */

import type { BlockComponent } from '@/components/editor/quiz/types';
import type { Block } from '@/types/editor';
import { TemplateManager } from '@/utils/TemplateManager';
import {
  QUIZ_STYLE_21_STEPS_TEMPLATE,
  getStepTemplate as getStaticStepTemplate,
} from '@/templates/quiz21StepsComplete';
import {
  blocksToBlockComponents,
  convertTemplateToBlocks,
} from '@/utils/templateConverter';

interface TemplateLoaderOptions {
  funnelId?: string;
  forceReload?: boolean;
  strategy?: 'manager-first' | 'static-only';
}

interface TemplateLoaderResult {
  blocks: BlockComponent[];
  source: 'cache' | 'manager' | 'static' | 'fallback';
  fetchedAt: number;
}

type InternalLoaderOptions = {
  funnelId?: string;
  forceReload: boolean;
  strategy: 'manager-first' | 'static-only';
};

const DEFAULT_OPTIONS: InternalLoaderOptions = {
  forceReload: false,
  strategy: 'manager-first',
};

export class TemplateLoader {
  private static instance: TemplateLoader | null = null;

  private cache = new Map<string, TemplateLoaderResult>();
  private inFlight = new Map<string, Promise<TemplateLoaderResult>>();

  private constructor() {}

  static getInstance(): TemplateLoader {
    if (!TemplateLoader.instance) {
      TemplateLoader.instance = new TemplateLoader();
    }
    return TemplateLoader.instance;
  }

  async getTemplate(stepId: string, options: TemplateLoaderOptions = {}): Promise<TemplateLoaderResult> {
    const merged: InternalLoaderOptions = {
      funnelId: options.funnelId,
      forceReload: options.forceReload ?? DEFAULT_OPTIONS.forceReload,
      strategy: options.strategy ?? DEFAULT_OPTIONS.strategy,
    };

    const cacheKey = this.buildCacheKey(stepId, merged.funnelId);

    if (!merged.forceReload) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const inProgress = this.inFlight.get(cacheKey);
      if (inProgress) {
        return inProgress;
      }
    } else {
      this.cache.delete(cacheKey);
    }

  const loadPromise = this.loadTemplate(stepId, merged);
    this.inFlight.set(cacheKey, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(cacheKey, result);
      return result;
    } finally {
      this.inFlight.delete(cacheKey);
    }
  }

  getTemplateSync(stepId: string, options: TemplateLoaderOptions = {}): TemplateLoaderResult | null {
    const cacheKey = this.buildCacheKey(stepId, options.funnelId);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Tentar recuperar de template estático (não bloqueia) e armazenar
    const staticBlocks = this.loadFromStatic(stepId);
    if (staticBlocks) {
      const result: TemplateLoaderResult = {
        blocks: staticBlocks,
        source: 'static',
        fetchedAt: Date.now(),
      };
      this.cache.set(cacheKey, result);
      return result;
    }

    return null;
  }

  async preload(stepIds: string[], options: TemplateLoaderOptions = {}): Promise<void> {
    await Promise.all(stepIds.map(stepId => this.getTemplate(stepId, options)));
  }

  clearCache(stepId?: string, funnelId?: string): void {
    if (!stepId) {
      this.cache.clear();
      this.inFlight.clear();
      return;
    }

    const cacheKey = this.buildCacheKey(stepId, funnelId);
    this.cache.delete(cacheKey);
    this.inFlight.delete(cacheKey);
  }

  private buildCacheKey(stepId: string, funnelId?: string): string {
    return funnelId ? `${stepId}::${funnelId}` : stepId;
  }

  private async loadTemplate(stepId: string, options: InternalLoaderOptions): Promise<TemplateLoaderResult> {
    const start = Date.now();

    if (options.strategy === 'manager-first') {
      const managerBlocks = await this.loadFromManager(stepId, options.funnelId);
      if (managerBlocks) {
        return {
          blocks: managerBlocks,
          source: 'manager',
          fetchedAt: start,
        };
      }
    }

    if (options.strategy !== 'manager-first' && options.strategy !== 'static-only') {
      console.warn(`⚠️ TemplateLoader: estratégia desconhecida "${options.strategy}". Usando fallback estático.`);
    }

    const staticBlocks = this.loadFromStatic(stepId);
    if (staticBlocks) {
      return {
        blocks: staticBlocks,
        source: 'static',
        fetchedAt: start,
      };
    }

    return this.createFallback(stepId, start);
  }

  private async loadFromManager(stepId: string, funnelId?: string): Promise<BlockComponent[] | null> {
    try {
      const blocks = await TemplateManager.loadStepBlocks(stepId, funnelId);
      if (Array.isArray(blocks) && blocks.length > 0) {
        const components = blocksToBlockComponents(blocks as Block[]);
        return components;
      }
      return null;
    } catch (error) {
      console.warn(`⚠️ TemplateLoader: falha ao carregar via TemplateManager (${stepId}).`, error);
      return null;
    }
  }

  private loadFromStatic(stepId: string): BlockComponent[] | null {
    const staticTemplate = getStaticStepTemplate(stepId) ?? QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
    if (!staticTemplate) {
      return null;
    }

    return convertTemplateToBlocks(staticTemplate) || [];
  }

  private createFallback(stepId: string, fetchedAt: number): TemplateLoaderResult {
    console.warn(`⚠️ TemplateLoader: usando fallback vazio para ${stepId}`);
    return {
      blocks: [],
      source: 'fallback',
      fetchedAt,
    };
  }
}

export const templateLoader = TemplateLoader.getInstance();
export type { TemplateLoaderResult, TemplateLoaderOptions };

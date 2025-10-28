/**
 * UNIFIED TEMPLATE SERVICE - Phase 1.2
 * 
 * Fonte única de verdade para templates com hierarquia de carregamento e cache TTL.
 * 
 * HIERARQUIA DE FONTES:
 * 1. TypeScript - Fonte primária
 * 2. JSON Master - Fallback validado
 * 3. JSON Individual - Fallback granular
 * 
 * CACHE:
 * - TTL configurável (5 minutos)
 * - Invalidação inteligente
 * - Prefetch para steps críticos
 */

import { getStepTemplate } from '@/templates/imports';
import { TemplateRegistry } from '@/services/TemplateRegistry';
import { UnifiedTemplateRegistry, Block } from '@/services/UnifiedTemplateRegistry';

interface CachedTemplate {
  blocks: Block[];
  source: 'ts' | 'json-master' | 'json-individual' | 'registry';
  timestamp: number;
  ttl: number;
}

interface TemplateSource {
  name: string;
  priority: number;
  loader: (stepId: string) => Promise<Block[] | null>;
}

export class UnifiedTemplateService {
  private static instance: UnifiedTemplateService;
  
  private cache = new Map<string, CachedTemplate>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos
  
  private templateRegistry: TemplateRegistry;
  private unifiedRegistry: UnifiedTemplateRegistry;
  
  private masterJSON: any = null;
  private masterJSONPromise: Promise<any> | null = null;
  
  private stats = {
    hits: 0,
    misses: 0,
    tsLoads: 0,
    jsonMasterLoads: 0,
    jsonIndividualLoads: 0,
    registryLoads: 0,
  };

  private constructor() {
    this.templateRegistry = TemplateRegistry.getInstance();
    this.unifiedRegistry = UnifiedTemplateRegistry.getInstance();
  }

  static getInstance(): UnifiedTemplateService {
    if (!this.instance) {
      this.instance = new UnifiedTemplateService();
    }
    return this.instance;
  }

  async loadTemplate(stepId: string, options?: { skipCache?: boolean; ttl?: number }): Promise<Block[]> {
    const normalizedId = this.normalizeStepId(stepId);
    
    if (!options?.skipCache) {
      const cached = this.getFromCache(normalizedId);
      if (cached) {
        this.stats.hits++;
        return cached.blocks;
      }
    }
    
    this.stats.misses++;

    const sources: TemplateSource[] = [
      { name: 'TypeScript', priority: 1, loader: async (id) => this.loadFromTypeScript(id) },
      { name: 'JSON Master', priority: 2, loader: async (id) => this.loadFromJSONMaster(id) },
      { name: 'JSON Individual', priority: 3, loader: async (id) => this.loadFromJSONIndividual(id) },
      { name: 'Registry Fallback', priority: 4, loader: async (id) => this.loadFromRegistry(id) },
    ];

    for (const source of sources) {
      try {
        const blocks = await source.loader(normalizedId);
        if (blocks && blocks.length > 0) {
          this.setCache(normalizedId, {
            blocks,
            source: this.mapSourceName(source.name),
            timestamp: Date.now(),
            ttl: options?.ttl || this.defaultTTL,
          });
          
          console.log(`✅ [UnifiedTemplateService] \${normalizedId} loaded from \${source.name}`);
          return blocks;
        }
      } catch (error) {
        console.warn(`⚠️ [UnifiedTemplateService] Failed to load \${normalizedId} from \${source.name}:`, error);
      }
    }

    throw new Error(`Template not found: \${normalizedId}`);
  }

  private async loadFromTypeScript(stepId: string): Promise<Block[] | null> {
    try {
      const result = getStepTemplate(stepId);
      
      if (result.source === 'ts' && result.step) {
        this.stats.tsLoads++;
        const blocks = this.ensureBlocks(result.step);
        return blocks;
      }
      
      return null;
    } catch (error) {
      console.warn(`[UnifiedTemplateService] TS load failed for \${stepId}:`, error);
      return null;
    }
  }

  private async loadFromJSONMaster(stepId: string): Promise<Block[] | null> {
    try {
      if (!this.masterJSON) {
        if (!this.masterJSONPromise) {
          this.masterJSONPromise = this.fetchMasterJSON();
        }
        this.masterJSON = await this.masterJSONPromise;
      }

      if (!this.masterJSON?.steps?.[stepId]) {
        return null;
      }

      this.stats.jsonMasterLoads++;
      const stepData = this.masterJSON.steps[stepId];
      const blocks = this.ensureBlocks(stepData);
      return blocks;
    } catch (error) {
      console.warn(`[UnifiedTemplateService] JSON Master load failed for \${stepId}:`, error);
      return null;
    }
  }

  private async loadFromJSONIndividual(stepId: string): Promise<Block[] | null> {
    try {
      const paths = [
        `/templates/blocks/\${stepId}.json`,
        `/templates/funnels/quiz21StepsComplete/steps/\${stepId}.json`,
      ];

      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const data = await response.json();
            this.stats.jsonIndividualLoads++;
            const blocks = this.ensureBlocks(data);
            return blocks;
          }
        } catch {
          // Tentar próximo path
        }
      }

      return null;
    } catch (error) {
      console.warn(`[UnifiedTemplateService] JSON Individual load failed for \${stepId}:`, error);
      return null;
    }
  }

  private async loadFromRegistry(stepId: string): Promise<Block[] | null> {
    try {
      const blocks = await this.unifiedRegistry.getStep(stepId);
      if (blocks && blocks.length > 0) {
        this.stats.registryLoads++;
        return blocks;
      }
      return null;
    } catch (error) {
      console.warn(`[UnifiedTemplateService] Registry load failed for \${stepId}:`, error);
      return null;
    }
  }

  private async fetchMasterJSON(): Promise<any> {
    const response = await fetch('/templates/quiz21-complete.json', {
      cache: 'force-cache',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch master JSON: \${response.status}`);
    }
    
    return response.json();
  }

  private ensureBlocks(data: any): Block[] {
    if (Array.isArray(data)) {
      return data as Block[];
    }

    if (data.sections) {
      const blocks: Block[] = [];
      data.sections?.forEach((section: any, index: number) => {
        blocks.push({
          id: section.id || `section-\${index}`,
          type: section.type,
          order: index,
          properties: section.properties || {},
          content: section.content || {},
          parentId: null,
        });
      });
      return blocks;
    }

    if (data.blocks) {
      return data.blocks;
    }

    return [];
  }

  private normalizeStepId(stepId: string): string {
    const match = stepId.match(/step-?(\d+)/i);
    if (match) {
      const num = parseInt(match[1]);
      return `step-\${num.toString().padStart(2, '0')}`;
    }
    return stepId;
  }

  private getFromCache(stepId: string): CachedTemplate | null {
    const cached = this.cache.get(stepId);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(stepId);
      return null;
    }

    return cached;
  }

  private setCache(stepId: string, cached: CachedTemplate): void {
    this.cache.set(stepId, cached);
  }

  private mapSourceName(name: string): CachedTemplate['source'] {
    const map: Record<string, CachedTemplate['source']> = {
      'TypeScript': 'ts',
      'JSON Master': 'json-master',
      'JSON Individual': 'json-individual',
      'Registry Fallback': 'registry',
    };
    return map[name] || 'registry';
  }

  async loadStepBlocks(stepId: string, _funnelId?: string): Promise<Block[]> {
    return this.loadTemplate(stepId);
  }

  invalidateCache(stepId?: string): void {
    if (stepId) {
      const normalized = this.normalizeStepId(stepId);
      this.cache.delete(normalized);
      console.log(`🔄 Cache invalidated: \${normalized}`);
    } else {
      this.cache.clear();
      this.masterJSON = null;
      this.masterJSONPromise = null;
      console.log('🔄 All cache cleared');
    }
  }

  clearCache(): void {
    this.invalidateCache();
  }

  async preloadCommonSteps(stepIds: string[] = ['step-01', 'step-02', 'step-03']): Promise<void> {
    const promises = stepIds.map(id => 
      this.loadTemplate(id).catch(error => 
        console.warn(`Failed to preload ${id}:`, error)
      )
    );
    await Promise.all(promises);
    console.log(`✅ Preloaded ${stepIds.length} steps`);
  }

  /**
   * Obtém template completo (compatibilidade legada)
   */
  async getTemplate(templateId: string): Promise<any> {
    const blocks = await this.loadTemplate(templateId);
    return {
      id: templateId,
      blocks,
      metadata: {},
    };
  }

  /**
   * Obtém step template (compatibilidade legada)
   */
  getStepTemplate(stepId: string, _funnelId?: string): any {
    const result = getStepTemplate(stepId);
    return result.step || {};
  }

  /**
   * Obtém todos os steps (compatibilidade legada)
   */
  getAllSteps(): Record<string, any> {
    const result = getStepTemplate('step-01');
    return result.step || {};
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%',
      cacheSize: this.cache.size,
    };
  }

  setDefaultTTL(ms: number): void {
    this.defaultTTL = ms;
  }
}

export const unifiedTemplateService = UnifiedTemplateService.getInstance();

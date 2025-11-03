/**
 * 🎯 UNIFIED TEMPLATE REGISTRY - SPRINT 1 SIMPLIFICADO
 * 
 * Sistema simplificado com L1 cache único
 * ✅ Normalização automática de blocos
 * ✅ 1 fetch por step (sem fallbacks redundantes)
 * ✅ properties ↔ content sempre sincronizados
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { normalizeBlocks } from '@/utils/blockNormalization';
import { normalizeBlockTypes } from '@/utils/blockNormalizer';
import type { Block } from '@/types/editor';

// Expor utilitário de cache no console (dev only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('@/utils/clearRegistryCache').catch(() => {/* ignore */});
}

interface TemplateDBSchema extends DBSchema {
  'templates': {
    key: string;
    value: {
      stepId: string;
      blocks: Block[];
      timestamp: number;
      version: string;
    };
  };
  'metadata': {
    key: string;
    value: {
      key: string;
      value: any;
    };
  };
}

interface CacheStats {
  l1Size: number;
  l2Size: number;
  hitRate: number;
  memoryUsage: number;
  totalHits: number;
  totalMisses: number;
}

export class UnifiedTemplateRegistry {
  private static instance: UnifiedTemplateRegistry;
  
  // L1: Memory Cache (Map) - mais rápido
  private l1Cache = new Map<string, Block[]>();
  
  // L2: IndexedDB - persistente
  private l2Cache: IDBPDatabase<TemplateDBSchema> | null = null;
  private l2InitPromise: Promise<void> | null = null;
  
  // L3: Build-time embedded templates (carregado lazy)
  private l3Embedded: Record<string, Block[]> | null = null;
  
  // Métricas
  private stats = {
    l1Hits: 0,
    l2Hits: 0,
    l3Hits: 0,
    misses: 0,
    loads: 0,
  };
  
  // Flags de depuração/controladas por query params
  private debugFlags = {
    disableL1: false,
    disableL2: false,
    disableL3: false,
    forceServer: false,
  } as const;
  
  // Bump na versão para invalidar L1/L2 quando alteramos estratégia de carregamento
  // 🔄 ATUALIZADO: v1.0.2 - Adicionado sistema de aliases e normalização de tipos
  private readonly CACHE_VERSION = '1.0.2';
  private readonly DB_NAME = 'quiz-templates-cache';
  private readonly DB_VERSION = 1;
  private readonly L2_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

  private constructor() {
    this.initializeL2();
    this.initializeDebugFlags();
    this.checkCacheVersion();
  }

  /**
   * Verificar versão do cache e limpar L1 se mudou
   */
  private checkCacheVersion(): void {
    try {
      const storedVersion = localStorage.getItem('registry-cache-version');
      if (storedVersion !== this.CACHE_VERSION) {
        console.warn(`🔄 Cache version mismatch (${storedVersion} → ${this.CACHE_VERSION}), clearing L1...`);
        this.clearL1();
        localStorage.setItem('registry-cache-version', this.CACHE_VERSION);
        console.log('✅ L1 Cache limpo e versão atualizada');
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Ler query params para controlar estratégia de cache (útil para testes)
   * ?nocache=1 → ignora L1/L2/L3 e carrega do servidor
   * ?forceServer=1 → ignora L3 e tenta servidor antes
   * ?noL2=1 → ignora IndexedDB
   * ?noL3=1 → ignora embedded
   */
  private initializeDebugFlags(): void {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        const noCache = params.get('nocache') === '1';
        const forceServer = params.get('forceServer') === '1';
        const noL2 = params.get('noL2') === '1';
        const noL3 = params.get('noL3') === '1';
        (this as any).debugFlags = {
          disableL1: noCache,
          disableL2: noCache || noL2,
          disableL3: noCache || noL3,
          forceServer: noCache || forceServer,
        };
        if (noCache || forceServer || noL2 || noL3) {
          console.warn('🛠️ Registry debug flags:', (this as any).debugFlags);
        }
      }
    } catch {
      // ignore
    }
  }

  static getInstance(): UnifiedTemplateRegistry {
    if (!UnifiedTemplateRegistry.instance) {
      UnifiedTemplateRegistry.instance = new UnifiedTemplateRegistry();
    }
    return UnifiedTemplateRegistry.instance;
  }

  /**
   * Inicializar IndexedDB (L2)
   */
  private async initializeL2(): Promise<void> {
    if (this.l2InitPromise) return this.l2InitPromise;
    
    this.l2InitPromise = (async () => {
      try {
        this.l2Cache = await openDB<TemplateDBSchema>(this.DB_NAME, this.DB_VERSION, {
          upgrade(db) {
            // Store para templates
            if (!db.objectStoreNames.contains('templates')) {
              db.createObjectStore('templates', { keyPath: 'stepId' });
            }
            // Store para metadata
            if (!db.objectStoreNames.contains('metadata')) {
              db.createObjectStore('metadata', { keyPath: 'key' });
            }
          },
        });
        
        console.log('✅ L2 Cache (IndexedDB) inicializado');
        
        // Verificar versão do cache
        const version = await this.getMetadata('cache-version');
        if (version !== this.CACHE_VERSION) {
          console.log('🔄 Cache version mismatch, clearing L2...');
          await this.clearL2();
          await this.setMetadata('cache-version', this.CACHE_VERSION);
        }
      } catch (error) {
        console.warn('⚠️ Falha ao inicializar L2 Cache:', error);
        this.l2Cache = null;
      }
    })();
    
    return this.l2InitPromise;
  }

   /**
    * Carregar step SIMPLIFICADO - L1 cache + 1 fetch consolidado
    */
   async getStep(stepId: string, templateId?: string): Promise<Block[]> {
     const cacheKey = stepId;
     console.time(`[Registry] getStep(${stepId})`);
     this.stats.loads++;
     
     // L1: Memory Cache
     const l1Result = this.l1Cache.get(stepId);
     if (l1Result) {
       this.stats.l1Hits++;
       console.log(`⚡ L1 HIT: ${stepId} (${l1Result.length} blocos)`);
       console.timeEnd(`[Registry] getStep(${stepId})`);
       return l1Result;
     }
     
     // MISS: Carregar do servidor (1 tentativa apenas)
     this.stats.misses++;
     console.warn(`❌ MISS: ${stepId} - carregando do servidor...`);
     const serverResult = await this.loadFromServerSimplified(stepId, templateId);
     
      if (serverResult) {
        // ✅ NORMALIZAR: aliases + properties/content sync
        const withAliases = normalizeBlockTypes(serverResult);
        const normalized = normalizeBlocks(withAliases);
        this.l1Cache.set(stepId, normalized);
        console.log(`✅ Carregado e normalizado: ${stepId} (${normalized.length} blocos)`);
        console.timeEnd(`[Registry] getStep(${stepId})`);
        return normalized;
      }
     
     console.timeEnd(`[Registry] getStep(${stepId})`);
     return [];
   }

  /**
   * Carregar do L3 (build-time embedded)
   */
  private async loadFromL3(stepId: string): Promise<Block[] | null> {
    if (!this.l3Embedded) {
      try {
        // Lazy load do módulo embedded (gerado em build time)
  const module = await import('@templates/embedded');
        // Usar named export para evitar problemas de inicialização circular
        const embeddedData = module.embedded || module.default || {};
        // Normalizar blocks: position → order se necessário
        const normalized: Record<string, Block[]> = {};
        for (const [key, blocks] of Object.entries(embeddedData)) {
          normalized[key] = blocks.map((block: any) => ({
            id: block.id,
            type: block.type,
            order: block.order ?? block.position ?? 0,
            properties: block.properties || {},
            content: block.content || {},
            parentId: block.parentId || null,
          }));
        }
        this.l3Embedded = normalized;
        console.log('📦 L3 Embedded templates carregados');
      } catch (error) {
        console.warn('⚠️ L3 não disponível (executar build-time script):', error);
        this.l3Embedded = {};
      }
    }
    
    return this.l3Embedded?.[stepId] || null;
  }

  /**
   * Carregar do servidor - OPÇÃO A: Direto dos JSONs locais
   */
  private async loadFromServerSimplified(stepId: string, templateId?: string): Promise<Block[] | null> {
    try {
      console.log(`🌐 Carregando ${stepId} diretamente dos templates JSON locais`);
      
      // Extrair número do step
      const stepNumber = stepId.match(/\d+/)?.[0];
      if (!stepNumber) {
        console.error(`❌ Step ID inválido: ${stepId}`);
        return null;
      }
      
      // Import dinâmico do JSON local de src/config/templates/
      const stepTemplate = await import(`@/config/templates/step-${stepNumber.padStart(2, '0')}.json`);
      
      if (stepTemplate.default?.blocks && Array.isArray(stepTemplate.default.blocks)) {
        console.log(`✅ Step ${stepId} carregado com ${stepTemplate.default.blocks.length} blocos`);
        return stepTemplate.default.blocks as Block[];
      }
      
      console.error(`❌ Step ${stepId} não tem blocks válidos`);
      return null;
    } catch (error) {
      console.error(`❌ Erro ao carregar ${stepId}:`, error);
      return null;
    }
  }

  /**
   * Converter sections[] → Block[] (conversão única)
   */
  private convertSectionsToBlocks(sections: any[], stepId: string): Block[] {
    return sections.map((section, index) => ({
      id: section.id || `${stepId}-block-${index}`,
      type: this.normalizeBlockType(section.type) as any, // Cast para compatibilidade
      order: section.order ?? index,
      properties: section.properties || section.props || {},
      content: section.content || {},
      parentId: section.parentId || undefined,
    }));
  }

  /**
   * Normalizar tipo de bloco
   */
  private normalizeBlockType(type: string): string {
    // Delegando para função central
    const typeMap: Record<string, string> = {
      'header': 'heading',
      'title': 'heading',
      'paragraph': 'text',
      'quiz-question': 'quiz-options',
      'question': 'quiz-options',
      'cta': 'button',
      'call-to-action': 'button',
    };
    
    return typeMap[type] || type;
  }

  /**
   * Salvar no L2 (IndexedDB)
   */
  private async saveToL2(stepId: string, blocks: Block[]): Promise<void> {
    if (!this.l2Cache) return;
    
    try {
      await this.l2Cache.put('templates', {
        stepId: stepId,
        blocks,
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
      });
      console.log(`💾 L2 SAVE: ${stepId}`);
    } catch (error) {
      console.warn('⚠️ L2 write error:', error);
    }
  }

  /**
   * Verificar se entrada L2 é válida (TTL)
   */
  private isL2Valid(timestamp: number): boolean {
    return (Date.now() - timestamp) < this.L2_TTL;
  }

  /**
   * Invalidar cache de um step
   */
  async invalidate(stepId: string): Promise<void> {
    this.l1Cache.delete(stepId);
    
    if (this.l2Cache) {
      try {
        await this.l2Cache.delete('templates', stepId);
        console.log(`🗑️ Invalidado: ${stepId}`);
      } catch (error) {
        console.warn('⚠️ L2 delete error:', error);
      }
    }
  }

  /**
   * Limpar L1
   */
  clearL1(): void {
    this.l1Cache.clear();
    console.log('🗑️ L1 Cache limpo');
  }

  /**
   * Limpar L2
   */
  async clearL2(): Promise<void> {
    if (!this.l2Cache) return;
    
    try {
      await this.l2Cache.clear('templates');
      console.log('🗑️ L2 Cache limpo');
    } catch (error) {
      console.warn('⚠️ L2 clear error:', error);
    }
  }

  /**
   * Limpar todos os caches
   */
  async clearAll(): Promise<void> {
    this.clearL1();
    await this.clearL2();
    console.log('🗑️ Todos os caches limpos');
  }

  /**
   * Pré-carregar múltiplos steps
   */
  async preload(stepIds: string[]): Promise<void> {
    console.log(`🚀 Pré-carregando ${stepIds.length} steps...`);
    await Promise.all(stepIds.map(id => this.getStep(id)));
  }

  /**
   * Obter estatísticas
   */
  async getStats(): Promise<CacheStats> {
    const totalRequests = this.stats.loads;
    const totalHits = this.stats.l1Hits + this.stats.l2Hits + this.stats.l3Hits;
    
    let l2Size = 0;
    if (this.l2Cache) {
      try {
        const keys = await this.l2Cache.getAllKeys('templates');
        l2Size = keys.length;
      } catch {
        l2Size = 0;
      }
    }
    
    const memoryUsage = this.estimateMemoryUsage();
    
    return {
      l1Size: this.l1Cache.size,
      l2Size,
      hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      memoryUsage,
      totalHits,
      totalMisses: this.stats.misses,
    };
  }

  /**
   * Estimar uso de memória
   */
  private estimateMemoryUsage(): number {
    let size = 0;
    for (const blocks of this.l1Cache.values()) {
      size += JSON.stringify(blocks).length;
    }
    return size;
  }

  /**
   * Metadata helpers (L2)
   */
  private async getMetadata(key: string): Promise<any> {
    if (!this.l2Cache) return null;
    
    try {
      const entry = await this.l2Cache.get('metadata', key);
      return entry?.value || null;
    } catch {
      return null;
    }
  }

  private async setMetadata(key: string, value: any): Promise<void> {
    if (!this.l2Cache) return;
    
    try {
      await this.l2Cache.put('metadata', { key, value });
    } catch (error) {
      console.warn('⚠️ Metadata write error:', error);
    }
  }

  /**
   * Debug: Log detalhado
   */
  async logDebugInfo(): Promise<void> {
    const stats = await this.getStats();
    console.group('📊 UnifiedTemplateRegistry Stats');
    console.log('L1 (Memory):', stats.l1Size, 'entries');
    console.log('L2 (IndexedDB):', stats.l2Size, 'entries');
    console.log('Hit Rate:', `${stats.hitRate.toFixed(1)}%`);
    console.log('Memory Usage:', `${(stats.memoryUsage / 1024).toFixed(1)} KB`);
    console.log('Breakdown:', {
      l1Hits: this.stats.l1Hits,
      l2Hits: this.stats.l2Hits,
      l3Hits: this.stats.l3Hits,
      misses: this.stats.misses,
      totalLoads: this.stats.loads,
    });
    console.groupEnd();
  }
}

// Singleton export
export const templateRegistry = UnifiedTemplateRegistry.getInstance();

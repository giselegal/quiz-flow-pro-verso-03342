/**/**/**

 * 📋 UNIFIED TEMPLATE SERVICE - Phase 1.2

 *  * 📋 UNIFIED TEMPLATE SERVICE - Phase 1.2 * 📋 UNIFIED TEMPLATE SERVICE (LEGADO) — Wrapper deprecatado para TemplateService canônico

 * Fonte única de verdade para templates com hierarquia de carregamento e cache TTL.

 *  *  */

 * HIERARQUIA DE FONTES:

 * 1. TypeScript (src/templates/*.ts) - Fonte primária, type-safe * Fonte única de verdade para templates com hierarquia de carregamento e cache TTL.

 * 2. JSON Master (public/templates/quiz21-complete.json) - Fallback validado

 * 3. JSON Individual (public/templates/blocks/*.json) - Fallback granular * import { templateService } from '@/services/canonical/TemplateService';

 * 

 * CACHE: * HIERARQUIA DE FONTES:import type { Block } from '@/services/UnifiedTemplateRegistry';

 * - TTL configurável (padrão: 5 minutos)

 * - Invalidação inteligente (por step ou completo) * 1. TypeScript (src/templates/*.ts) - Fonte primária, type-safeimport { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

 * - Prefetch para steps críticos

 *  * 2. JSON Master (public/templates/quiz21-complete.json) - Fallback validado

 * CONVERSÕES:

 * - Consolida em getBlockConfig() do blockConfigMerger * 3. JSON Individual (public/templates/blocks/*.json) - Fallback granularexport class UnifiedTemplateService {

 * - Remove conversões redundantes sections→blocks

 *  *   private static instance: UnifiedTemplateService;

 * @version 2.0.0

 * @status PRODUCTION * CACHE:  private static warned = false;

 */

 * - TTL configurável (padrão: 5 minutos)

import { getStepTemplate } from '@/templates/imports';

import { TemplateRegistry } from '@/services/TemplateRegistry'; * - Invalidação inteligente (por step ou completo)  private constructor() {}

import { UnifiedTemplateRegistry, Block } from '@/services/UnifiedTemplateRegistry';

 * - Prefetch para steps críticos

interface CachedTemplate {

  blocks: Block[]; *   private static warnOnce() {

  source: 'ts' | 'json-master' | 'json-individual' | 'registry';

  timestamp: number; * CONVERSÕES:    if (!this.warned) {

  ttl: number;

} * - Consolida em getBlockConfig() do blockConfigMerger      this.warned = true;



interface TemplateSource { * - Remove conversões redundantes sections→blocks      console.warn('\n⚠️ DEPRECATED: UnifiedTemplateService está descontinuado.\nUse: import { templateService } from \'@/services/canonical/TemplateService\'\nSerá removido em: v2.0.0\n');

  name: string;

  priority: number; *     }

  loader: (stepId: string) => Promise<Block[] | null>;

} * @version 2.0.0  }



export class UnifiedTemplateService { * @status PRODUCTION

  private static instance: UnifiedTemplateService;

   */  static getInstance(): UnifiedTemplateService {

  // Cache com TTL

  private cache = new Map<string, CachedTemplate>();    if (!this.instance) {

  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  import { getStepTemplate } from '@/templates/imports';      this.instance = new UnifiedTemplateService();

  // Referências aos serviços

  private templateRegistry: TemplateRegistry;import { TemplateRegistry } from '@/services/TemplateRegistry';    }

  private unifiedRegistry: UnifiedTemplateRegistry;

  import { UnifiedTemplateRegistry, Block } from '@/services/UnifiedTemplateRegistry';    return this.instance;

  // Master JSON em memória (carregado sob demanda)

  private masterJSON: any = null;  }

  private masterJSONPromise: Promise<any> | null = null;

  interface CachedTemplate {

  // Métricas

  private stats = {  blocks: Block[];  getStepTemplate(stepId: string, _funnelId?: string): any {

    hits: 0,

    misses: 0,  source: 'ts' | 'json-master' | 'json-individual' | 'registry';    UnifiedTemplateService.warnOnce();

    tsLoads: 0,

    jsonMasterLoads: 0,  timestamp: number;    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'getStepTemplate');

    jsonIndividualLoads: 0,

    registryLoads: 0,  ttl: number;    // Retorna bloco(s) do step

  };

}    // Nota: templateService.getStep retorna ServiceResult<Block[]>; aqui retornamos diretamente o array de blocos

  private constructor() {

    this.templateRegistry = TemplateRegistry.getInstance();    // Chamadores legados esperam qualquer[]

    this.unifiedRegistry = UnifiedTemplateRegistry.getInstance();

  }interface TemplateSource {    // Como getStep é assíncrono, simplificamos para versão sync retornando vazio e recomendamos migração.



  static getInstance(): UnifiedTemplateService {  name: string;    console.warn('getStepTemplate é síncrono no legado; para dados reais, migre para templateService.getStep');

    if (!this.instance) {

      this.instance = new UnifiedTemplateService();  priority: number;    return [];

    }

    return this.instance;  loader: (stepId: string) => Promise<Block[] | null>;  }

  }

}

  /**

   * Carrega template seguindo hierarquia: TS → JSON Master → JSON Individual  getAllSteps(): Record<string, any> {

   */

  async loadTemplate(stepId: string, options?: { skipCache?: boolean; ttl?: number }): Promise<Block[]> {export class UnifiedTemplateService {    UnifiedTemplateService.warnOnce();

    const normalizedId = this.normalizeStepId(stepId);

      private static instance: UnifiedTemplateService;    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'getAllSteps');

    // 1. Verificar cache

    if (!options?.skipCache) {      console.warn('getAllSteps legado: utilize templateService.steps.list + getStep');

      const cached = this.getFromCache(normalizedId);

      if (cached) {  // Cache com TTL    return {};

        this.stats.hits++;

        return cached.blocks;  private cache = new Map<string, CachedTemplate>();  }

      }

    }  private defaultTTL = 5 * 60 * 1000; // 5 minutos

    

    this.stats.misses++;    getTemplate(templateName: string): Record<string, any> | null {



    // 2. Tentar carregar da hierarquia de fontes  // Referências aos serviços    UnifiedTemplateService.warnOnce();

    const sources: TemplateSource[] = [

      {  private templateRegistry: TemplateRegistry;    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'getTemplate');

        name: 'TypeScript',

        priority: 1,  private unifiedRegistry: UnifiedTemplateRegistry;    if (templateName === 'quiz21StepsComplete') {

        loader: async (id) => this.loadFromTypeScript(id),

      },        console.warn('Use templateService.steps.list() e getStep()');

      {

        name: 'JSON Master',  // Master JSON em memória (carregado sob demanda)      return {};

        priority: 2,

        loader: async (id) => this.loadFromJSONMaster(id),  private masterJSON: any = null;    }

      },

      {  private masterJSONPromise: Promise<any> | null = null;    return null;

        name: 'JSON Individual',

        priority: 3,    }

        loader: async (id) => this.loadFromJSONIndividual(id),

      },  // Métricas

      {

        name: 'Registry Fallback',  private stats = {  async loadStepBlocks(stepId: string, _funnelId?: string): Promise<Block[]> {

        priority: 4,

        loader: async (id) => this.loadFromRegistry(id),    hits: 0,    UnifiedTemplateService.warnOnce();

      },

    ];    misses: 0,    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'loadStepBlocks');



    for (const source of sources) {    tsLoads: 0,    try {

      try {

        const blocks = await source.loader(normalizedId);    jsonMasterLoads: 0,      const result = await templateService.getStep(stepId);

        if (blocks && blocks.length > 0) {

          // Cache resultado    jsonIndividualLoads: 0,      if (!result.success) {

          this.setCache(normalizedId, {

            blocks,    registryLoads: 0,        console.warn(`[UnifiedTemplateService] getStep falhou para ${stepId}:`, (result as any).error);

            source: this.mapSourceName(source.name),

            timestamp: Date.now(),  };        return [];

            ttl: options?.ttl || this.defaultTTL,

          });      }

          

          console.log(`✅ [UnifiedTemplateService] ${normalizedId} loaded from ${source.name}`);  private constructor() {      if (Array.isArray(result.data)) {

          return blocks;

        }    this.templateRegistry = TemplateRegistry.getInstance();        return result.data as Block[];

      } catch (error) {

        console.warn(`⚠️ [UnifiedTemplateService] Failed to load ${normalizedId} from ${source.name}:`, error);    this.unifiedRegistry = UnifiedTemplateRegistry.getInstance();      }

      }

    }  }      return [];



    throw new Error(`Template not found: ${normalizedId}`);    } catch (error) {

  }

  static getInstance(): UnifiedTemplateService {      console.error(`[UnifiedTemplateService] Erro ao carregar step ${stepId}:`, error);

  /**

   * Carrega de TypeScript (fonte primária)    if (!this.instance) {      return [];

   */

  private async loadFromTypeScript(stepId: string): Promise<Block[] | null> {      this.instance = new UnifiedTemplateService();    }

    try {

      const result = getStepTemplate(stepId);    }  }

      

      if (result.source === 'ts' && result.step) {    return this.instance;

        this.stats.tsLoads++;

        // result.step pode ser sections ou blocks  }  publishStep(_stepId: string): boolean {

        const blocks = this.ensureBlocks(result.step);

        return blocks;    UnifiedTemplateService.warnOnce();

      }

        /**    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'publishStep');

      return null;

    } catch (error) {   * Carrega template seguindo hierarquia: TS → JSON Master → JSON Individual    return true;

      console.warn(`[UnifiedTemplateService] TS load failed for ${stepId}:`, error);

      return null;   */  }

    }

  }  async loadTemplate(stepId: string, options?: { skipCache?: boolean; ttl?: number }): Promise<Block[]> {



  /**    const normalizedId = this.normalizeStepId(stepId);  unpublishStep(_stepId: string): boolean {

   * Carrega de JSON Master (fallback validado)

   */        UnifiedTemplateService.warnOnce();

  private async loadFromJSONMaster(stepId: string): Promise<Block[] | null> {

    try {    // 1. Verificar cache    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'unpublishStep');

      // Carregar master JSON se ainda não foi carregado

      if (!this.masterJSON) {    if (!options?.skipCache) {    return true;

        if (!this.masterJSONPromise) {

          this.masterJSONPromise = this.fetchMasterJSON();      const cached = this.getFromCache(normalizedId);  }

        }

        this.masterJSON = await this.masterJSONPromise;      if (cached) {

      }

        this.stats.hits++;  preloadCommonSteps(): void {

      if (!this.masterJSON?.steps?.[stepId]) {

        return null;        return cached.blocks;    UnifiedTemplateService.warnOnce();

      }

      }    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'preloadCommonSteps');

      this.stats.jsonMasterLoads++;

      const stepData = this.masterJSON.steps[stepId];    }  }

      const blocks = this.ensureBlocks(stepData);

      return blocks;    

    } catch (error) {

      console.warn(`[UnifiedTemplateService] JSON Master load failed for ${stepId}:`, error);    this.stats.misses++;  invalidateCache(stepId?: string): void {

      return null;

    }    UnifiedTemplateService.warnOnce();

  }

    // 2. Tentar carregar da hierarquia de fontes    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'invalidateCache');

  /**

   * Carrega de JSON Individual (fallback granular)    const sources: TemplateSource[] = [    if (stepId) templateService.invalidateTemplate(stepId);

   */

  private async loadFromJSONIndividual(stepId: string): Promise<Block[] | null> {      {    else templateService.clearCache();

    try {

      const paths = [        name: 'TypeScript',  }

        `/templates/blocks/${stepId}.json`,

        `/templates/funnels/quiz21StepsComplete/steps/${stepId}.json`,        priority: 1,

      ];

        loader: async (id) => this.loadFromTypeScript(id),  clearCache(): void {

      for (const path of paths) {

        try {      },    UnifiedTemplateService.warnOnce();

          const response = await fetch(path);

          if (response.ok) {      {    CanonicalServicesMonitor.trackLegacyBridge('UnifiedTemplateService', 'clearCache');

            const data = await response.json();

            this.stats.jsonIndividualLoads++;        name: 'JSON Master',    templateService.clearCache();

            const blocks = this.ensureBlocks(data);

            return blocks;        priority: 2,  }

          }

        } catch {        loader: async (id) => this.loadFromJSONMaster(id),}

          // Tentar próximo path

        }      },

      }

      {export const unifiedTemplateService = UnifiedTemplateService.getInstance();

      return null;

    } catch (error) {        name: 'JSON Individual',

      console.warn(`[UnifiedTemplateService] JSON Individual load failed for ${stepId}:`, error);        priority: 3,

      return null;        loader: async (id) => this.loadFromJSONIndividual(id),

    }      },

  }      {

        name: 'Registry Fallback',

  /**        priority: 4,

   * Carrega do Registry (fallback final)        loader: async (id) => this.loadFromRegistry(id),

   */      },

  private async loadFromRegistry(stepId: string): Promise<Block[] | null> {    ];

    try {

      const blocks = await this.unifiedRegistry.getStep(stepId);    for (const source of sources) {

      if (blocks && blocks.length > 0) {      try {

        this.stats.registryLoads++;        const blocks = await source.loader(normalizedId);

        return blocks;        if (blocks && blocks.length > 0) {

      }          // Cache resultado

      return null;          this.setCache(normalizedId, {

    } catch (error) {            blocks,

      console.warn(`[UnifiedTemplateService] Registry load failed for ${stepId}:`, error);            source: this.mapSourceName(source.name),

      return null;            timestamp: Date.now(),

    }            ttl: options?.ttl || this.defaultTTL,

  }          });

          

  /**          console.log(`✅ [UnifiedTemplateService] ${normalizedId} loaded from ${source.name}`);

   * Busca master JSON do servidor          return blocks;

   */        }

  private async fetchMasterJSON(): Promise<any> {      } catch (error) {

    const response = await fetch('/templates/quiz21-complete.json', {        console.warn(`⚠️ [UnifiedTemplateService] Failed to load ${normalizedId} from ${source.name}:`, error);

      cache: 'force-cache',      }

    });    }

    

    if (!response.ok) {    throw new Error(`Template not found: ${normalizedId}`);

      throw new Error(`Failed to fetch master JSON: ${response.status}`);  }

    }

      /**

    return response.json();   * Carrega de TypeScript (fonte primária)

  }   */

  private async loadFromTypeScript(stepId: string): Promise<Block[] | null> {

  /**    try {

   * Converte sections para blocks se necessário (usando UnifiedTemplateRegistry)      const result = getStepTemplate(stepId);

   */      

  private ensureBlocks(data: any): Block[] {      if (result.source === 'ts' && result.step) {

    // Se já é array de blocks, retorna        this.stats.tsLoads++;

    if (Array.isArray(data)) {        // result.step pode ser sections ou blocks

      return data as Block[];        const blocks = this.ensureBlocks(result.step);

    }        return blocks;

      }

    // Se tem sections, converte via UnifiedTemplateRegistry      

    if (data.sections) {      return null;

      // Usar método interno do UnifiedTemplateRegistry se disponível    } catch (error) {

      // Por enquanto, vamos extrair blocks manualmente      console.warn(`[UnifiedTemplateService] TS load failed for ${stepId}:`, error);

      const blocks: Block[] = [];      return null;

      data.sections?.forEach((section: any, index: number) => {    }

        blocks.push({  }

          id: section.id || `section-${index}`,

          type: section.type,  /**

          order: index,   * Carrega de JSON Master (fallback validado)

          properties: section.properties || {},   */

          content: section.content || {},  private async loadFromJSONMaster(stepId: string): Promise<Block[] | null> {

          parentId: null,    try {

        });      // Carregar master JSON se ainda não foi carregado

      });      if (!this.masterJSON) {

      return blocks;        if (!this.masterJSONPromise) {

    }          this.masterJSONPromise = this.fetchMasterJSON();

        }

    // Se tem blocks diretamente        this.masterJSON = await this.masterJSONPromise;

    if (data.blocks) {      }

      return data.blocks;

    }      if (!this.masterJSON?.steps?.[stepId]) {

        return null;

    return [];      }

  }

      this.stats.jsonMasterLoads++;

  /**      const stepData = this.masterJSON.steps[stepId];

   * Normaliza ID do step (step-01, step-1, etc)      const blocks = this.ensureBlocks(stepData);

   */      return blocks;

  private normalizeStepId(stepId: string): string {    } catch (error) {

    const match = stepId.match(/step-?(\d+)/i);      console.warn(`[UnifiedTemplateService] JSON Master load failed for ${stepId}:`, error);

    if (match) {      return null;

      const num = parseInt(match[1]);    }

      return `step-${num.toString().padStart(2, '0')}`;  }

    }

    return stepId;  /**

  }   * Carrega de JSON Individual (fallback granular)

   */

  /**  private async loadFromJSONIndividual(stepId: string): Promise<Block[] | null> {

   * Obtém do cache verificando TTL    try {

   */      const paths = [

  private getFromCache(stepId: string): CachedTemplate | null {        `/templates/blocks/${stepId}.json`,

    const cached = this.cache.get(stepId);        `/templates/funnels/quiz21StepsComplete/steps/${stepId}.json`,

    if (!cached) return null;      ];



    const now = Date.now();      for (const path of paths) {

    if (now - cached.timestamp > cached.ttl) {        try {

      // Cache expirado          const response = await fetch(path);

      this.cache.delete(stepId);          if (response.ok) {

      return null;            const data = await response.json();

    }            this.stats.jsonIndividualLoads++;

            const blocks = this.ensureBlocks(data);

    return cached;            return blocks;

  }          }

        } catch {

  /**          // Tentar próximo path

   * Salva no cache        }

   */      }

  private setCache(stepId: string, cached: CachedTemplate): void {

    this.cache.set(stepId, cached);      return null;

  }    } catch (error) {

      console.warn(`[UnifiedTemplateService] JSON Individual load failed for ${stepId}:`, error);

  /**      return null;

   * Mapeia nome de fonte para tipo    }

   */  }

  private mapSourceName(name: string): CachedTemplate['source'] {

    const map: Record<string, CachedTemplate['source']> = {  /**

      'TypeScript': 'ts',   * Carrega do Registry (fallback final)

      'JSON Master': 'json-master',   */

      'JSON Individual': 'json-individual',  private async loadFromRegistry(stepId: string): Promise<Block[] | null> {

      'Registry Fallback': 'registry',    try {

    };      const blocks = await this.unifiedRegistry.getStep(stepId);

    return map[name] || 'registry';      if (blocks && blocks.length > 0) {

  }        this.stats.registryLoads++;

        return blocks;

  // ==================== PUBLIC API ====================      }

      return null;

  /**    } catch (error) {

   * API legada - mantida para compatibilidade      console.warn(`[UnifiedTemplateService] Registry load failed for ${stepId}:`, error);

   */      return null;

  async loadStepBlocks(stepId: string, _funnelId?: string): Promise<Block[]> {    }

    return this.loadTemplate(stepId);  }

  }

  /**

  /**   * Busca master JSON do servidor

   * Invalida cache de um step específico ou todos   */

   */  private async fetchMasterJSON(): Promise<any> {

  invalidateCache(stepId?: string): void {    const response = await fetch('/templates/quiz21-complete.json', {

    if (stepId) {      cache: 'force-cache',

      const normalized = this.normalizeStepId(stepId);    });

      this.cache.delete(normalized);    

      console.log(`🔄 Cache invalidated: ${normalized}`);    if (!response.ok) {

    } else {      throw new Error(`Failed to fetch master JSON: ${response.status}`);

      this.cache.clear();    }

      this.masterJSON = null;    

      this.masterJSONPromise = null;    return response.json();

      console.log('🔄 All cache cleared');  }

    }

  }  /**

   * Converte sections para blocks se necessário (usando UnifiedTemplateRegistry)

  /**   */

   * Limpa cache completamente  private ensureBlocks(data: any): Block[] {

   */    // Se já é array de blocks, retorna

  clearCache(): void {    if (Array.isArray(data)) {

    this.invalidateCache();      return data as Block[];

  }    }



  /**    // Se tem sections, converte via UnifiedTemplateRegistry

   * Prefetch de steps críticos    if (data.sections) {

   */      // Usar método interno do UnifiedTemplateRegistry se disponível

  async preloadCommonSteps(stepIds: string[] = ['step-01', 'step-02', 'step-03']): Promise<void> {      // Por enquanto, vamos extrair blocks manualmente

    const promises = stepIds.map(id =>       const blocks: Block[] = [];

      this.loadTemplate(id).catch(error =>       data.sections?.forEach((section: any, index: number) => {

        console.warn(`Failed to preload ${id}:`, error)        blocks.push({

      )          id: section.id || `section-${index}`,

    );          type: section.type,

    await Promise.all(promises);          order: index,

    console.log(`✅ Preloaded ${stepIds.length} steps`);          properties: section.properties || {},

  }          content: section.content || {},

          parentId: null,

  /**        });

   * Retorna estatísticas de uso      });

   */      return blocks;

  getStats() {    }

    const total = this.stats.hits + this.stats.misses;

    return {    // Se tem blocks diretamente

      ...this.stats,    if (data.blocks) {

      hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%',      return data.blocks;

      cacheSize: this.cache.size,    }

    };

  }    return [];

  }

  /**

   * Configura TTL padrão  /**

   */   * Normaliza ID do step (step-01, step-1, etc)

  setDefaultTTL(ms: number): void {   */

    this.defaultTTL = ms;  private normalizeStepId(stepId: string): string {

  }    const match = stepId.match(/step-?(\d+)/i);

}    if (match) {

      const num = parseInt(match[1]);

// Export singleton instance      return `step-${num.toString().padStart(2, '0')}`;

export const unifiedTemplateService = UnifiedTemplateService.getInstance();    }

    return stepId;
  }

  /**
   * Obtém do cache verificando TTL
   */
  private getFromCache(stepId: string): CachedTemplate | null {
    const cached = this.cache.get(stepId);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      // Cache expirado
      this.cache.delete(stepId);
      return null;
    }

    return cached;
  }

  /**
   * Salva no cache
   */
  private setCache(stepId: string, cached: CachedTemplate): void {
    this.cache.set(stepId, cached);
  }

  /**
   * Mapeia nome de fonte para tipo
   */
  private mapSourceName(name: string): CachedTemplate['source'] {
    const map: Record<string, CachedTemplate['source']> = {
      'TypeScript': 'ts',
      'JSON Master': 'json-master',
      'JSON Individual': 'json-individual',
      'Registry Fallback': 'registry',
    };
    return map[name] || 'registry';
  }

  // ==================== PUBLIC API ====================

  /**
   * API legada - mantida para compatibilidade
   */
  async loadStepBlocks(stepId: string, _funnelId?: string): Promise<Block[]> {
    return this.loadTemplate(stepId);
  }

  /**
   * Invalida cache de um step específico ou todos
   */
  invalidateCache(stepId?: string): void {
    if (stepId) {
      const normalized = this.normalizeStepId(stepId);
      this.cache.delete(normalized);
      console.log(`🔄 Cache invalidated: ${normalized}`);
    } else {
      this.cache.clear();
      this.masterJSON = null;
      this.masterJSONPromise = null;
      console.log('🔄 All cache cleared');
    }
  }

  /**
   * Limpa cache completamente
   */
  clearCache(): void {
    this.invalidateCache();
  }

  /**
   * Prefetch de steps críticos
   */
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
   * Retorna estatísticas de uso
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%',
      cacheSize: this.cache.size,
    };
  }

  /**
   * Configura TTL padrão
   */
  setDefaultTTL(ms: number): void {
    this.defaultTTL = ms;
  }
}

// Export singleton instance
export const unifiedTemplateService = UnifiedTemplateService.getInstance();

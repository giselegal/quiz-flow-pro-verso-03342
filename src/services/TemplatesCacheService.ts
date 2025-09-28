/**
 * 🗄️ TEMPLATES CACHE SERVICE - SISTEMA UNIFICADO DE CACHE
 * 
 * Gerencia cache inteligente de templates sob demanda para otimizar
 * o carregamento e reduzir latência no editor de etapas.
 * 
 * FUNCIONALIDADES:
 * ✅ Cache em memória com TTL configurável
 * ✅ Preload inteligente de etapas adjacentes
 * ✅ Invalidação automática
 * ✅ Fallbacks robustos
 * ✅ Métricas de performance
 */

import { Block } from '@/types/editor';
import { TemplateManager } from '@/utils/TemplateManager';

// Tipos
interface CacheEntry {
  stepKey: string;
  funnelId: string;
  blocks: Block[];
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalEntries: number;
  memoryUsage: number;
  averageAccessTime: number;
}

interface CacheConfig {
  maxEntries: number;
  ttlMs: number;
  preloadAdjacent: boolean;
  enableMetrics: boolean;
  maxMemoryMb: number;
}

/**
 * 🚀 SERVICE PRINCIPAL
 */
export class TemplatesCacheService {
  private cache = new Map<string, CacheEntry>();
  private loadingPromises = new Map<string, Promise<Block[]>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    totalEntries: 0,
    memoryUsage: 0,
    averageAccessTime: 0,
  };

  private config: CacheConfig = {
    maxEntries: 100,
    ttlMs: 5 * 60 * 1000, // 5 minutos
    preloadAdjacent: true,
    enableMetrics: true,
    maxMemoryMb: 50,
  };

  constructor(customConfig?: Partial<CacheConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }

    // Limpeza automática a cada 2 minutos
    setInterval(() => this.cleanup(), 2 * 60 * 1000);
  }

  /**
   * 🎯 MÉTODO PRINCIPAL: Carregar template com cache
   */
  async getStepTemplate(stepNumber: number, funnelId: string = 'default'): Promise<Block[]> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(stepNumber, funnelId);

    try {
      // 1. Verificar cache primeiro
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.updateStats('hit', startTime);
        
        // Preload etapas adjacentes se habilitado
        if (this.config.preloadAdjacent) {
          this.preloadAdjacentSteps(stepNumber, funnelId);
        }
        
        return cached;
      }

      // 2. Verificar se já está carregando
      const existingPromise = this.loadingPromises.get(cacheKey);
      if (existingPromise) {
        console.log(`⏳ Aguardando carregamento em progresso para ${cacheKey}`);
        return await existingPromise;
      }

      // 3. Carregar template e cachear
      const loadPromise = this.loadStepTemplate(stepNumber, funnelId);
      this.loadingPromises.set(cacheKey, loadPromise);

      try {
        const blocks = await loadPromise;
        this.setCache(cacheKey, stepNumber, funnelId, blocks);
        this.updateStats('miss', startTime);
        return blocks;
      } finally {
        this.loadingPromises.delete(cacheKey);
      }

    } catch (error) {
      console.error(`❌ Erro ao carregar template para step ${stepNumber}:`, error);
      this.updateStats('miss', startTime);
      
      // Fallback: retornar bloco básico
      return this.createFallbackBlocks(stepNumber);
    }
  }

  /**
   * 🔄 PRELOAD: Carregar etapas adjacentes
   */
  private async preloadAdjacentSteps(currentStep: number, funnelId: string): Promise<void> {
    const adjacentSteps = [
      Math.max(1, currentStep - 1),
      Math.min(21, currentStep + 1),
    ].filter(step => step !== currentStep);

    for (const step of adjacentSteps) {
      const cacheKey = this.getCacheKey(step, funnelId);
      if (!this.cache.has(cacheKey) && !this.loadingPromises.has(cacheKey)) {
        // Preload sem await para não bloquear
        this.getStepTemplate(step, funnelId).catch(error => {
          console.warn(`⚠️ Preload falhou para step ${step}:`, error);
        });
      }
    }
  }

  /**
   * 📥 CARREGAR TEMPLATE: Método interno para loading
   */
  private async loadStepTemplate(stepNumber: number, funnelId: string): Promise<Block[]> {
    console.log(`🔄 Carregando template para step ${stepNumber}, funnel ${funnelId}`);

    try {
      // Tentar TemplateManager primeiro
      const stepId = `step-${stepNumber}`;
      const templateBlocks = await TemplateManager.loadStepBlocks(stepId, funnelId);
      
      if (templateBlocks && Array.isArray(templateBlocks) && templateBlocks.length > 0) {
        console.log(`✅ Template carregado via TemplateManager: ${templateBlocks.length} blocos`);
        return this.normalizeBlocks(templateBlocks, stepNumber);
      }

      // Fallback: template padrão dinâmico
      console.log(`⚠️ Template não encontrado, criando fallback para step ${stepNumber}`);
      return this.createDefaultTemplate(stepNumber);

    } catch (error) {
      console.error(`❌ Erro ao carregar via TemplateManager:`, error);
      return this.createFallbackBlocks(stepNumber);
    }
  }

  /**
   * 🔄 NORMALIZAR BLOCOS: Garantir formato consistente
   */
  private normalizeBlocks(blocks: any[], stepNumber: number): Block[] {
    return blocks.map((block, index) => ({
      id: block.id || `step-${stepNumber}-block-${index}`,
      type: block.type || 'text',
      order: block.order ?? index,
      content: block.content || {},
      properties: {
        ...block.properties,
        stageId: `step-${stepNumber}`,
      },
      styles: block.styles || {},
      metadata: {
        ...block.metadata,
        cached: true,
        cacheTimestamp: Date.now(),
      },
    }));
  }

  /**
   * 🏗️ TEMPLATE PADRÃO: Criar template dinâmico por etapa
   */
  private createDefaultTemplate(stepNumber: number): Block[] {
    const templates: Record<number, Block[]> = {
      1: [{
        id: `step-${stepNumber}-form`,
        type: 'form-input',
        order: 0,
        content: {
          title: 'Qual é o seu nome?',
          placeholder: 'Digite seu nome aqui...',
          required: true,
        },
        properties: {
          stageId: `step-${stepNumber}`,
          fieldType: 'text',
          validation: { required: true, minLength: 2 },
        },
      }],
      
      // Etapas 2-20: Questões de quiz
      ...Object.fromEntries(
        Array.from({ length: 19 }, (_, i) => [i + 2, [{
          id: `step-${i + 2}-question`,
          type: 'quiz-question-inline',
          order: 0,
          content: {
            title: `Questão ${i + 1}`,
            question: `Esta é a questão ${i + 1} do quiz.`,
          },
          properties: {
            stageId: `step-${i + 2}`,
            options: [
              { id: 'opt-1', text: 'Opção A', score: 10, category: 'style-1' },
              { id: 'opt-2', text: 'Opção B', score: 15, category: 'style-2' },
              { id: 'opt-3', text: 'Opção C', score: 20, category: 'style-3' },
            ],
            multipleSelection: false,
            required: true,
          },
        }]])
      ),

      21: [{
        id: `step-21-result`,
        type: 'quiz-result-inline',
        order: 0,
        content: {
          title: 'Seu Resultado!',
          description: 'Baseado nas suas respostas...',
        },
        properties: {
          stageId: 'step-21',
          showPersonalizedResult: true,
          enableExport: true,
        },
      }],
    };

    return templates[stepNumber] || this.createFallbackBlocks(stepNumber);
  }

  /**
   * 🛡️ FALLBACK: Bloco básico para casos de erro
   */
  private createFallbackBlocks(stepNumber: number): Block[] {
    return [{
      id: `fallback-step-${stepNumber}`,
      type: 'heading-inline',
      order: 0,
      content: {
        title: `Etapa ${stepNumber}`,
        subtitle: 'Carregando conteúdo...',
      },
      properties: {
        stageId: `step-${stepNumber}`,
        fallback: true,
      },
      metadata: {
        isFallback: true,
        timestamp: Date.now(),
      },
    }];
  }

  /**
   * 💾 CACHE MANAGEMENT
   */
  private getCacheKey(stepNumber: number, funnelId: string): string {
    return `${funnelId}::step-${stepNumber}`;
  }

  private getFromCache(cacheKey: string): Block[] | null {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;

    // Verificar TTL
    if (Date.now() - entry.timestamp > this.config.ttlMs) {
      this.cache.delete(cacheKey);
      return null;
    }

    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    return entry.blocks;
  }

  private setCache(cacheKey: string, stepNumber: number, funnelId: string, blocks: Block[]): void {
    // Verificar limites antes de adicionar
    if (this.cache.size >= this.config.maxEntries) {
      this.evictLeastRecentlyUsed();
    }

    const entry: CacheEntry = {
      stepKey: `step-${stepNumber}`,
      funnelId,
      blocks,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
    };

    this.cache.set(cacheKey, entry);
    console.log(`💾 Template cached: ${cacheKey} (${blocks.length} blocos)`);
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`🗑️ Cache evicted LRU: ${oldestKey}`);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttlMs) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`🧹 Cache cleanup: ${removed} entradas expiradas removidas`);
    }

    this.updateMemoryStats();
  }

  private updateStats(type: 'hit' | 'miss', startTime: number): void {
    if (!this.config.enableMetrics) return;

    const duration = Date.now() - startTime;
    
    if (type === 'hit') {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }

    this.stats.totalEntries = this.cache.size;
    this.stats.averageAccessTime = (this.stats.averageAccessTime + duration) / 2;
  }

  private updateMemoryStats(): void {
    // Estimativa simples de uso de memória
    let size = 0;
    for (const entry of this.cache.values()) {
      size += JSON.stringify(entry).length;
    }
    this.stats.memoryUsage = size / (1024 * 1024); // MB
  }

  /**
   * 📊 MÉTODOS PÚBLICOS DE UTILIDADE
   */
  public getStats(): CacheStats {
    this.updateMemoryStats();
    return { ...this.stats };
  }

  public getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  public invalidateStep(stepNumber: number, funnelId: string = 'default'): void {
    const cacheKey = this.getCacheKey(stepNumber, funnelId);
    this.cache.delete(cacheKey);
    console.log(`🗑️ Cache invalidated: ${cacheKey}`);
  }

  public invalidateAll(): void {
    this.cache.clear();
    this.loadingPromises.clear();
    console.log('🗑️ Cache completamente limpo');
  }

  public preloadSteps(steps: number[], funnelId: string = 'default'): Promise<void[]> {
    return Promise.all(
      steps.map(async step => {
        try {
          await this.getStepTemplate(step, funnelId);
        } catch (error) {
          console.warn(`⚠️ Preload falhou para step ${step}:`, error);
        }
      })
    );
  }

  /**
   * 🔧 CONFIGURAÇÃO DINÂMICA
   */
  public updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Cache config atualizada:', this.config);
  }

  /**
   * 🚀 MÉTODOS ADICIONAIS PARA INTEGRAÇÃO
   */
  public preloadFunnel(funnelId: string): Promise<void> {
    return this.preloadSteps([1, 2, 3, 4, 5], funnelId).then(() => {});
  }

  public invalidateFunnel(funnelId: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(funnelId)
    );
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🗑️ Cache invalidado para funil ${funnelId}`);
  }

  public clearFunnel(funnelId: string): void {
    this.invalidateFunnel(funnelId);
  }

  public refreshCache(): void {
    this.invalidateAll();
    console.log('🔄 Cache refreshado');
  }

  public clearCache(): void {
    this.invalidateAll();
  }
}

// Instância singleton
export const templatesCacheService = new TemplatesCacheService({
  maxEntries: 50,
  ttlMs: 10 * 60 * 1000, // 10 minutos
  preloadAdjacent: true,
  enableMetrics: true,
  maxMemoryMb: 25,
});

// Export do tipo para uso em outros arquivos
export type { CacheConfig, CacheStats };

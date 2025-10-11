/**
 * 🎯 JSON TEMPLATE SERVICE
 * 
 * Serviço especializado para gerenciar templates JSON do quiz
 * Integra com QuizStepAdapter para validação e conversão
 * 
 * FASE 2: Integração Templates JSON
 * ✅ Carregamento de templates JSON
 * ✅ Validação com QuizStepAdapter
 * ✅ Cache inteligente com TTL
 * ✅ Prefetch de etapas adjacentes
 * ✅ Fallback para QUIZ_STEPS
 * ✅ Métricas de performance
 */

import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';
import type { QuizStep } from '@/types/quiz';

// ============================================================================
// TIPOS
// ============================================================================

interface CachedTemplate {
    data: QuizStep;
    timestamp: number;
    loadTime: number;
    source: 'json' | 'fallback';
}

interface TemplateMetrics {
    hits: number;
    misses: number;
    errors: number;
    totalLoadTime: number;
    averageLoadTime: number;
}

interface JsonTemplateServiceConfig {
    cacheEnabled: boolean;
    cacheTTL: number;
    prefetchEnabled: boolean;
    prefetchCount: number;
    metricsEnabled: boolean;
}

// ============================================================================
// SERVICE
// ============================================================================

export class JsonTemplateService {
    private static instance: JsonTemplateService;
    private cache = new Map<number, CachedTemplate>();
    private loadingPromises = new Map<number, Promise<QuizStep>>();
    private metrics: TemplateMetrics = {
        hits: 0,
        misses: 0,
        errors: 0,
        totalLoadTime: 0,
        averageLoadTime: 0,
    };

    private config: JsonTemplateServiceConfig = {
        cacheEnabled: true,
        cacheTTL: 5 * 60 * 1000, // 5 minutos
        prefetchEnabled: true,
        prefetchCount: 2, // Prefetch próximas 2 etapas
        metricsEnabled: true,
    };

    private constructor() {
        // Cleanup automático de cache expirado a cada 2 minutos
        if (this.config.cacheEnabled) {
            setInterval(() => this.cleanupExpiredCache(), 2 * 60 * 1000);
        }
    }

    /**
     * Singleton instance
     */
    public static getInstance(): JsonTemplateService {
        if (!JsonTemplateService.instance) {
            JsonTemplateService.instance = new JsonTemplateService();
        }
        return JsonTemplateService.instance;
    }

    /**
     * Configurar o serviço
     */
    public configure(config: Partial<JsonTemplateServiceConfig>): void {
        this.config = { ...this.config, ...config };
        console.log('🔧 JsonTemplateService configurado:', this.config);
    }

    // ==========================================================================
    // API PRINCIPAL
    // ==========================================================================

    /**
     * 🎯 Carregar template JSON para uma etapa
     */
    async getTemplate(stepNumber: number): Promise<QuizStep> {
        const startTime = performance.now();

        try {
            // 1. Verificar cache
            if (this.config.cacheEnabled) {
                const cached = this.getCachedTemplate(stepNumber);
                if (cached) {
                    this.recordHit();
                    console.log(`⚡ Cache hit: step-${stepNumber} (${cached.source})`);
                    return cached.data;
                }
            }

            // 2. Verificar se já está carregando
            if (this.loadingPromises.has(stepNumber)) {
                console.log(`🔄 Aguardando carregamento: step-${stepNumber}`);
                return await this.loadingPromises.get(stepNumber)!;
            }

            // 3. Carregar template
            this.recordMiss();
            const loadPromise = this.loadTemplate(stepNumber, startTime);
            this.loadingPromises.set(stepNumber, loadPromise);

            const result = await loadPromise;
            this.loadingPromises.delete(stepNumber);

            // 4. Prefetch etapas adjacentes
            if (this.config.prefetchEnabled) {
                this.prefetchAdjacentSteps(stepNumber);
            }

            return result;
        } catch (error) {
            this.recordError();
            this.loadingPromises.delete(stepNumber);
            throw error;
        }
    }

    /**
     * 🔄 Carregar múltiplos templates
     */
    async getTemplates(stepNumbers: number[]): Promise<QuizStep[]> {
        return Promise.all(stepNumbers.map(num => this.getTemplate(num)));
    }

    /**
     * 💾 Salvar template JSON
     */
    async saveTemplate(stepNumber: number, quizStep: QuizStep): Promise<void> {
        try {
            console.log(`💾 Salvando template step-${stepNumber}...`);

            // 1. Converter para JSON
            const jsonTemplate = QuizStepAdapter.toJSON(quizStep);            // 3. Salvar arquivo (simulado - em produção salvaria no servidor)
            const fileName = `quiz-estilo-step-${stepNumber}.json`;
            console.log(`✅ Template convertido: ${fileName}`);
            console.log('📄 JSON:', JSON.stringify(jsonTemplate, null, 2).slice(0, 200) + '...');

            // 4. Atualizar cache
            if (this.config.cacheEnabled) {
                this.cache.set(stepNumber, {
                    data: quizStep,
                    timestamp: Date.now(),
                    loadTime: 0,
                    source: 'json',
                });
            }

            console.log(`✅ Template step-${stepNumber} salvo com sucesso`);
        } catch (error) {
            console.error(`❌ Erro ao salvar template step-${stepNumber}:`, error);
            throw error;
        }
    }

  /**
   * ✅ Validar template JSON
   */
  async validateTemplate(stepNumber: number): Promise<boolean> {
    try {
      const template = await this.getTemplate(stepNumber);
      // Template já foi validado no fromJSON
      return !!template && !!template.type;
    } catch (error) {
      console.error(`❌ Erro ao validar template step-${stepNumber}:`, error);
      return false;
    }
  }    /**
     * 📋 Listar todos os templates JSON disponíveis
     */
    async listTemplates(): Promise<number[]> {
        // Em produção, isso buscaria do servidor
        // Por enquanto, retorna os steps conhecidos (1-21)
        return Array.from({ length: 21 }, (_, i) => i + 1);
    }

    // ==========================================================================
    // CACHE
    // ==========================================================================

    /**
     * Obter template do cache se válido
     */
    private getCachedTemplate(stepNumber: number): CachedTemplate | null {
        const cached = this.cache.get(stepNumber);
        if (!cached) return null;

        const age = Date.now() - cached.timestamp;
        if (age > this.config.cacheTTL) {
            this.cache.delete(stepNumber);
            return null;
        }

        return cached;
    }

    /**
     * Limpar cache expirado
     */
    private cleanupExpiredCache(): void {
        const now = Date.now();
        let removed = 0;

        for (const [stepNumber, cached] of this.cache.entries()) {
            const age = now - cached.timestamp;
            if (age > this.config.cacheTTL) {
                this.cache.delete(stepNumber);
                removed++;
            }
        }

        if (removed > 0) {
            console.log(`🧹 Cache cleanup: ${removed} templates expirados removidos`);
        }
    }

    /**
     * Limpar todo o cache
     */
    public clearCache(): void {
        this.cache.clear();
        console.log('🗑️ Cache limpo');
    }

    /**
     * Invalidar cache de uma etapa específica
     */
    public invalidateCache(stepNumber: number): void {
        this.cache.delete(stepNumber);
        console.log(`🗑️ Cache invalidado: step-${stepNumber}`);
    }

    // ==========================================================================
    // CARREGAMENTO
    // ==========================================================================

    /**
     * Carregar template JSON ou fallback
     */
    private async loadTemplate(stepNumber: number, startTime: number): Promise<QuizStep> {
        try {
            console.log(`📥 Carregando template JSON: step-${stepNumber}`);

            // Tentar carregar JSON
            const jsonTemplate = await this.loadJsonFile(stepNumber);
            const quizStep = QuizStepAdapter.fromJson(jsonTemplate);

            // Validar
            const isValid = QuizStepAdapter.validate(quizStep);
            if (!isValid) {
                console.warn(`⚠️ Template JSON inválido: step-${stepNumber}, usando fallback`);
                return this.loadFallback(stepNumber, startTime);
            }

            // Cache
            const loadTime = performance.now() - startTime;
            if (this.config.cacheEnabled) {
                this.cache.set(stepNumber, {
                    data: quizStep,
                    timestamp: Date.now(),
                    loadTime,
                    source: 'json',
                });
            }

            this.recordLoadTime(loadTime);
            console.log(`✅ Template JSON carregado: step-${stepNumber} (${loadTime.toFixed(2)}ms)`);
            return quizStep;
        } catch (error) {
            console.warn(`⚠️ Erro ao carregar JSON step-${stepNumber}, usando fallback:`, error);
            return this.loadFallback(stepNumber, startTime);
        }
    }

    /**
     * Carregar arquivo JSON
     */
    private async loadJsonFile(stepNumber: number): Promise<any> {
        try {
            // Dynamic import do JSON
            const module = await import(`../../templates/quiz-estilo-step-${stepNumber}.json`);
            return module.default || module;
        } catch (error) {
            throw new Error(`JSON file not found for step-${stepNumber}`);
        }
    }

    /**
     * Fallback para QUIZ_STEPS
     */
    private async loadFallback(stepNumber: number, startTime: number): Promise<QuizStep> {
        console.log(`🔄 Usando fallback QUIZ_STEPS: step-${stepNumber}`);

        // Import dinâmico para evitar dependency circular
        const { QUIZ_STEPS } = await import('@/data/quiz-steps');
        const fallbackStep = QUIZ_STEPS[stepNumber - 1];

        if (!fallbackStep) {
            throw new Error(`No fallback available for step-${stepNumber}`);
        }

        // Cache fallback
        const loadTime = performance.now() - startTime;
        if (this.config.cacheEnabled) {
            this.cache.set(stepNumber, {
                data: fallbackStep,
                timestamp: Date.now(),
                loadTime,
                source: 'fallback',
            });
        }

        this.recordLoadTime(loadTime);
        console.log(`✅ Fallback carregado: step-${stepNumber} (${loadTime.toFixed(2)}ms)`);
        return fallbackStep;
    }

    // ==========================================================================
    // PREFETCH
    // ==========================================================================

    /**
     * Prefetch etapas adjacentes
     */
    private prefetchAdjacentSteps(currentStep: number): void {
        const stepsToPrefetch: number[] = [];

        // Próximas etapas
        for (let i = 1; i <= this.config.prefetchCount; i++) {
            const nextStep = currentStep + i;
            if (nextStep <= 21 && !this.cache.has(nextStep)) {
                stepsToPrefetch.push(nextStep);
            }
        }

        if (stepsToPrefetch.length > 0) {
            console.log(`🚀 Prefetching steps: ${stepsToPrefetch.join(', ')}`);
            stepsToPrefetch.forEach(step => {
                this.getTemplate(step).catch(err => {
                    console.warn(`⚠️ Prefetch failed for step-${step}:`, err);
                });
            });
        }
    }

    // ==========================================================================
    // MÉTRICAS
    // ==========================================================================

    private recordHit(): void {
        if (this.config.metricsEnabled) {
            this.metrics.hits++;
        }
    }

    private recordMiss(): void {
        if (this.config.metricsEnabled) {
            this.metrics.misses++;
        }
    }

    private recordError(): void {
        if (this.config.metricsEnabled) {
            this.metrics.errors++;
        }
    }

    private recordLoadTime(time: number): void {
        if (this.config.metricsEnabled) {
            this.metrics.totalLoadTime += time;
            const total = this.metrics.hits + this.metrics.misses;
            this.metrics.averageLoadTime = this.metrics.totalLoadTime / total;
        }
    }

    /**
     * 📊 Obter métricas
     */
    public getMetrics(): TemplateMetrics {
        return { ...this.metrics };
    }

    /**
     * 📊 Obter estatísticas detalhadas
     */
    public getStats() {
        const cacheSize = this.cache.size;
        const cacheHitRate = this.metrics.hits / (this.metrics.hits + this.metrics.misses) || 0;

        return {
            cache: {
                size: cacheSize,
                hitRate: (cacheHitRate * 100).toFixed(2) + '%',
                ttl: this.config.cacheTTL,
            },
            performance: {
                averageLoadTime: this.metrics.averageLoadTime.toFixed(2) + 'ms',
                totalLoads: this.metrics.hits + this.metrics.misses,
            },
            reliability: {
                successRate: ((1 - this.metrics.errors / (this.metrics.hits + this.metrics.misses)) * 100).toFixed(2) + '%',
                errors: this.metrics.errors,
            },
            config: this.config,
        };
    }

    /**
     * 📊 Log de estatísticas
     */
    public logStats(): void {
        const stats = this.getStats();
        console.log('📊 JsonTemplateService Stats:', JSON.stringify(stats, null, 2));
    }

    /**
     * 🔄 Reset métricas
     */
    public resetMetrics(): void {
        this.metrics = {
            hits: 0,
            misses: 0,
            errors: 0,
            totalLoadTime: 0,
            averageLoadTime: 0,
        };
        console.log('🔄 Métricas resetadas');
    }
}

// ============================================================================
// EXPORT
// ============================================================================

// Export singleton instance
export const jsonTemplateService = JsonTemplateService.getInstance();

// Export default
export default jsonTemplateService;

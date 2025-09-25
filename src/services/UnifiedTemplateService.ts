/**
 * 🚀 UNIFIED TEMPLATE SERVICE - FASE 1: TEMPLATE PRELOADING
 * 
 * Sistema unificado de templates com carregamento paralelo otimizado
 * para eliminar gargalo de 21 requests sequenciais.
 * 
 * ✅ Preloading paralelo de templates críticos
 * ✅ Cache inteligente com TTL
 * ✅ Fallbacks robustos
 * ✅ API unificada consolidando fragmentação
 * 
 * ⚡ INDEPENDENTE: Não depende mais de serviços legados
 */

// 🎯 CACHE AVANÇADO COM TTL
interface CachedTemplate {
    data: any;
    timestamp: number;
    ttl: number;
}

class UnifiedTemplateService {
    private cache = new Map<string, CachedTemplate>();
    private preloadingPromises = new Map<string, Promise<any>>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
    private readonly CRITICAL_TEMPLATES = [
        'step-1', 'step-2', 'step-12', 'step-20', 'step-21',
        'quiz21StepsComplete', 'quiz-style-express'
    ];

    /**
     * 🚀 PRELOAD CRÍTICO - Carrega templates em paralelo
     */
    async preloadCriticalTemplates(): Promise<void> {
        console.log('🚀 Iniciando preload de templates críticos...');
        const startTime = performance.now();

        const preloadPromises = this.CRITICAL_TEMPLATES.map(async (templateId) => {
            try {
                await this.getTemplate(templateId);
                console.log(`✅ Preloaded: ${templateId}`);
            } catch (error) {
                console.warn(`⚠️ Failed to preload ${templateId}:`, error);
            }
        });

        await Promise.allSettled(preloadPromises);

        const duration = performance.now() - startTime;
        const successful = this.CRITICAL_TEMPLATES.length - preloadPromises.length;
        console.log(`🎯 Preload concluído: ${successful}/${this.CRITICAL_TEMPLATES.length} templates em ${duration.toFixed(2)}ms`);
    }

    /**
     * 🎯 GET TEMPLATE - API unificada com cache inteligente
     */
    async getTemplate(templateId: string): Promise<any> {
        // 1. Verificar cache
        const cached = this.getCachedTemplate(templateId);
        if (cached) {
            console.log(`⚡ Cache hit: ${templateId}`);
            return cached;
        }

        // 2. Verificar se já está sendo carregado
        if (this.preloadingPromises.has(templateId)) {
            console.log(`🔄 Aguardando preload: ${templateId}`);
            return await this.preloadingPromises.get(templateId)!;
        }

        // 3. Iniciar carregamento
        const loadPromise = this.loadTemplateWithFallback(templateId);
        this.preloadingPromises.set(templateId, loadPromise);

        try {
            const template = await loadPromise;
            this.cacheTemplate(templateId, template);
            this.preloadingPromises.delete(templateId);
            return template;
        } catch (error) {
            this.preloadingPromises.delete(templateId);
            throw error;
        }
    }

    /**
     * 🔄 LOAD WITH FALLBACK - Carregamento dinâmico de qualquer template/funil
     * ⚡ DINÂMICO: Funciona com qualquer funil, não hardcodado
     */
    private async loadTemplateWithFallback(templateId: string): Promise<any> {
        try {
            // 1. Tentar carregar do banco de dados (Supabase)
            const databaseTemplate = await this.loadFromDatabase(templateId);
            if (databaseTemplate && Object.keys(databaseTemplate).length > 0) {
                console.log(`✅ Template carregado do banco: ${templateId}`);
                return databaseTemplate;
            }
        } catch (dbError) {
            console.warn(`⚠️ Template não encontrado no banco para ${templateId}:`, dbError);
        }

        try {
            // 2. Tentar carregar via templates críticos (apenas para casos específicos)
            const staticTemplate = this.getStaticTemplate(templateId);
            if (staticTemplate && Object.keys(staticTemplate).length > 0) {
                console.log(`✅ Template crítico carregado: ${templateId}`);
                return staticTemplate;
            }
        } catch (staticError) {
            console.warn(`⚠️ Template crítico não encontrado para ${templateId}:`, staticError);
        }

        // 3. Fallback: template genérico baseado no padrão
        const fallbackTemplate = this.generateFallbackTemplate(templateId);
        console.log(`🎨 Usando fallback genérico para: ${templateId}`);
        return fallbackTemplate;
    }

    /**
     * 🗄️ LOAD FROM DATABASE - Busca templates dinamicamente do Supabase
     * ⚡ NOVO: Método para buscar qualquer funil/template do banco
     */
    private async loadFromDatabase(templateId: string): Promise<any | null> {
        try {
            // Importar Supabase dinamicamente para evitar erros de inicialização
            const { supabase } = await import('@/integrations/supabase/client');

            if (!supabase) {
                console.warn('Supabase não disponível, pulando busca no banco');
                return null;
            }

            // Buscar na tabela funnels
            const { data, error } = await supabase
                .from('funnels')
                .select('*')
                .eq('id', templateId)
                .single();

            if (error) {
                console.warn(`Erro ao buscar template ${templateId}:`, error);
                return null;
            }

            if (data) {
                // Converter dados do banco para formato do template
                // Usar settings para extrair steps e blocks se estiverem no JSON
                const settings = data.settings as any || {};

                return {
                    id: data.id,
                    name: data.name || 'Template Dinâmico',
                    description: data.description || '',
                    steps: settings.steps || [],
                    blocks: settings.blocks || [],
                    isPublished: data.is_published || false,
                    metadata: {
                        fromDatabase: true,
                        version: data.version || 1,
                        userId: data.user_id,
                        createdAt: data.created_at,
                        updatedAt: data.updated_at
                    }
                };
            }

            return null;
        } catch (error) {
            console.warn(`Erro na busca do banco para ${templateId}:`, error);
            return null;
        }
    }

    /**
     * 🎯 GET STATIC TEMPLATE - Apenas para templates críticos específicos
     * ⚡ LIMITADO: Só para casos específicos, não para uso geral
     */
    private getStaticTemplate(templateId: string): any | null {
        // Apenas templates críticos específicos (não para uso geral)
        const criticalTemplates: Record<string, any> = {
            'step-1': {
                id: 'step-1',
                name: 'Quiz Step 1',
                blocks: [
                    { type: 'headline', id: 'headline-1', properties: { text: 'Descubra seu estilo' } },
                    { type: 'quiz-question', id: 'question-1', properties: { text: 'Qual seu objetivo principal?' } },
                    { type: 'quiz-options', id: 'options-1', properties: {} },
                    { type: 'button', id: 'btn-1', properties: { text: 'Continuar' } }
                ]
            },
            'step-2': {
                id: 'step-2',
                name: 'Quiz Step 2',
                blocks: [
                    { type: 'quiz-question', id: 'question-2', properties: { text: 'Como você se veste normalmente?' } },
                    { type: 'options-grid', id: 'options-2', properties: {} },
                    { type: 'button', id: 'btn-2', properties: { text: 'Próxima' } }
                ]
            },
            'quiz21StepsComplete': {
                id: 'quiz21StepsComplete',
                name: 'Quiz 21 Steps Complete',
                totalSteps: 21,
                steps: Array.from({ length: 21 }, (_, i) => ({
                    step: i + 1,
                    blocks: this.generateStepBlocks(i + 1)
                }))
            }
        };

        return criticalTemplates[templateId] || null;
    }

    /**
     * 🔧 GENERATE STEP BLOCKS - Helper para gerar blocos por step
     */
    private generateStepBlocks(stepNumber: number): any[] {
        if (stepNumber <= 19) {
            return [
                { type: 'quiz-question', id: `question-${stepNumber}`, properties: { text: `Pergunta ${stepNumber}` } },
                { type: 'quiz-options', id: `options-${stepNumber}`, properties: {} },
                { type: 'button', id: `btn-${stepNumber}`, properties: { text: 'Continuar' } }
            ];
        } else if (stepNumber === 20) {
            return [
                { type: 'quiz-transition', id: 'transition-1', properties: { text: 'Analisando suas respostas...' } },
                { type: 'loading-animation', id: 'loader-1', properties: {} }
            ];
        } else {
            return [
                { type: 'sales-hero', id: 'hero-1', properties: { text: 'Oferta Especial' } },
                { type: 'urgency-timer-inline', id: 'timer-1', properties: {} },
                { type: 'button', id: 'cta-1', properties: { text: 'Garantir Agora' } }
            ];
        }
    }

    /**
     * 🎨 FALLBACK GENERATOR - Gera templates básicos funcionais
     */
    private generateFallbackTemplate(templateId: string): any {
        const stepNumber = this.extractStepNumber(templateId);

        const baseTemplate = {
            id: templateId,
            name: `Template ${templateId}`,
            blocks: [],
            metadata: {
                generated: true,
                fallback: true,
                step: stepNumber,
                timestamp: Date.now()
            }
        };

        // Templates específicos por step
        switch (stepNumber) {
            case 1:
                return {
                    ...baseTemplate,
                    blocks: [
                        { type: 'quiz-intro-header', id: 'header-1', properties: { text: 'Bem-vindo ao Quiz!' } },
                        { type: 'form-input', id: 'input-1', properties: { placeholder: 'Seu nome' } },
                        { type: 'button', id: 'btn-1', properties: { text: 'Começar' } }
                    ]
                };
            case 12:
                return {
                    ...baseTemplate,
                    blocks: [
                        { type: 'quiz-transition', id: 'transition-1', properties: { text: 'Analisando suas respostas...' } },
                        { type: 'loading-animation', id: 'loader-1', properties: {} }
                    ]
                };
            case 20:
                return {
                    ...baseTemplate,
                    blocks: [
                        { type: 'step20-result-header', id: 'result-header', properties: { text: 'Seu Resultado' } },
                        { type: 'step20-style-reveal', id: 'style-reveal', properties: {} },
                        { type: 'step20-personalized-offer', id: 'offer', properties: {} }
                    ]
                };
            case 21:
                return {
                    ...baseTemplate,
                    blocks: [
                        { type: 'sales-hero', id: 'hero-1', properties: { text: 'Oferta Especial' } },
                        { type: 'urgency-timer-inline', id: 'timer-1', properties: {} },
                        { type: 'button', id: 'cta-1', properties: { text: 'Garantir Agora' } }
                    ]
                };
            default:
                return {
                    ...baseTemplate,
                    blocks: [
                        { type: 'text', id: `text-${stepNumber}`, properties: { text: `Pergunta ${stepNumber}` } },
                        { type: 'options-grid', id: `options-${stepNumber}`, properties: {} },
                        { type: 'button', id: `btn-${stepNumber}`, properties: { text: 'Continuar' } }
                    ]
                };
        }
    }

    /**
     * 🔍 EXTRACT STEP NUMBER - Extrai número do step do templateId
     */
    private extractStepNumber(templateId: string): number {
        const match = templateId.match(/step-?(\d+)/i);
        return match ? parseInt(match[1], 10) : 1;
    }

    /**
     * 💾 CACHE MANAGEMENT
     */
    private getCachedTemplate(templateId: string): any | null {
        const cached = this.cache.get(templateId);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > cached.ttl) {
            this.cache.delete(templateId);
            return null;
        }

        return cached.data;
    }

    private cacheTemplate(templateId: string, template: any, ttl = this.DEFAULT_TTL): void {
        this.cache.set(templateId, {
            data: template,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * 🗑️ CACHE UTILITIES
     */
    clearCache(): void {
        this.cache.clear();
        this.preloadingPromises.clear();
        console.log('🗑️ Template cache cleared');
    }

    getCacheStats() {
        const hitRate = this.cache.size > 0 ?
            ((this.cache.size / (this.cache.size + this.preloadingPromises.size)) * 100).toFixed(1) : '0';

        return {
            cached: this.cache.size,
            preloading: this.preloadingPromises.size,
            criticalTemplates: this.CRITICAL_TEMPLATES.length,
            memoryUsage: this.estimateMemoryUsage(),
            hitRate: `${hitRate}%`,
            efficiency: this.cache.size >= this.CRITICAL_TEMPLATES.length ? 'High' : 'Medium'
        };
    }

    private estimateMemoryUsage(): string {
        const entries = Array.from(this.cache.values());
        const totalSize = entries.reduce((acc, entry) => {
            return acc + JSON.stringify(entry.data).length;
        }, 0);
        return `${(totalSize / 1024).toFixed(2)} KB`;
    }

    /**
     * 📊 BATCH LOADING - Carrega múltiplos templates em paralelo
     */
    async getMultipleTemplates(templateIds: string[]): Promise<Record<string, any>> {
        const results: Record<string, any> = {};

        const loadPromises = templateIds.map(async (templateId) => {
            try {
                const template = await this.getTemplate(templateId);
                results[templateId] = template;
            } catch (error) {
                console.error(`Failed to load template ${templateId}:`, error);
                results[templateId] = null;
            }
        });

        await Promise.allSettled(loadPromises);
        return results;
    }

    /**
     * 🔧 LOAD STEP BLOCKS - Método específico para carregar blocks de etapas
     * Compatibilidade com TemplateManager
     */
    async loadStepBlocks(stepId: string, funnelId?: string): Promise<any[]> {
        try {
            const templateId = funnelId ? `${stepId}:${funnelId}` : stepId;
            const template = await this.getTemplate(templateId);

            // Se o template tem blocks, retorna eles
            if (template?.blocks && Array.isArray(template.blocks)) {
                return template.blocks;
            }

            // Se o template é um array direto de blocks
            if (Array.isArray(template)) {
                return template;
            }

            // Fallback: template vazio
            console.log(`⚠️ Template ${templateId} não tem blocks válidos, retornando array vazio`);
            return [];
        } catch (error) {
            console.error(`❌ Erro ao carregar blocks para ${stepId}:`, error);
            return [];
        }
    }

    /**
     * 📤 PUBLISH STEP - Salva blocks de uma etapa
     */
    publishStep(stepId: string, blocks: any[]): void {
        const templateData = { blocks };
        this.cacheTemplate(stepId, templateData);
        console.log(`📤 Step ${stepId} published com ${blocks.length} blocks`);
    }

    /**
     * 🗑️ UNPUBLISH STEP - Remove template de uma etapa
     */
    unpublishStep(stepId: string): void {
        this.cache.delete(stepId);
        console.log(`🗑️ Step ${stepId} unpublished`);
    }

    /**
     * 🚀 PRELOAD COMMON STEPS - Carrega etapas comuns
     */
    async preloadCommonSteps(): Promise<void> {
        return this.preloadCriticalTemplates();
    }

    /**
     * 🔄 INVALIDATE CACHE - Limpa cache
     */
    invalidateCache(key?: string): void {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
}

// 🎯 SINGLETON INSTANCE

export const unifiedTemplateService = new UnifiedTemplateService();

// 🚀 Auto-preload na inicialização (após 200ms para não bloquear)
if (typeof window !== 'undefined') {
    setTimeout(() => {
        unifiedTemplateService.preloadCriticalTemplates().catch(console.error);
    }, 200);
}

// 📤 EXPORT COMPATIBILITY - Mantém compatibilidade com APIs existentes
export const loadStepTemplate = (step: number) => unifiedTemplateService.getTemplate(`step-${step}`);
export const getTemplate = (templateId: string) => unifiedTemplateService.getTemplate(templateId);

export default unifiedTemplateService;
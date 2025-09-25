/**
 * 🚀 UNIFIED TEMPLATE SERVICE - CORREÇÃO CRÍTICA
 * 
 * PRIORIZA DADOS REAIS do QUIZ_STYLE_21_STEPS_TEMPLATE sobre fallbacks genéricos
 * Resolve problema de funil carregando dados "fixos" ao invés de dados reais
 * 
 * ✅ Template real PRIMEIRO
 * ✅ Cache inteligente 
 * ✅ Fallbacks apenas quando necessário
 * ✅ API unificada
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
     * 🔄 LOAD WITH FALLBACK - PRIORIZA TEMPLATES REAIS
     * ⚡ CORREÇÃO CRÍTICA: Template real PRIMEIRO, banco depois, fallback por último
     */
    private async loadTemplateWithFallback(templateId: string): Promise<any> {
        try {
            // 🎯 PRIORIDADE 1: Template real PRIMEIRO (CORREÇÃO CRÍTICA)
            const staticTemplate = await this.getStaticTemplate(templateId);
            if (staticTemplate && Object.keys(staticTemplate).length > 0) {
                console.log(`🏆 Template REAL carregado com PRIORIDADE: ${templateId}`);
                return staticTemplate;
            }
        } catch (staticError) {
            console.warn(`⚠️ Template real não encontrado para ${templateId}:`, staticError);
        }

        try {
            // 🎯 PRIORIDADE 2: Banco de dados (apenas se template real não existir)
            const databaseTemplate = await this.loadFromDatabase(templateId);
            if (databaseTemplate && Object.keys(databaseTemplate).length > 0) {
                console.log(`✅ Template carregado do banco: ${templateId}`);
                return databaseTemplate;
            }
        } catch (dbError) {
            console.warn(`⚠️ Template não encontrado no banco para ${templateId}:`, dbError);
        }

        // 🎯 PRIORIDADE 3: Fallback genérico (APENAS se nada mais funcionar)
        console.warn(`⚠️ USANDO FALLBACK para ${templateId} - dados podem estar incorretos!`);
        const fallbackTemplate = this.generateFallbackTemplate(templateId);
        return fallbackTemplate;
    }

    /**
     * 🗄️ LOAD FROM DATABASE - Busca templates dinamicamente do Supabase
     */
    private async loadFromDatabase(templateId: string): Promise<any | null> {
        try {
            const { supabase } = await import('@/integrations/supabase/client');

            if (!supabase) {
                console.warn('Supabase não disponível, pulando busca no banco');
                return null;
            }

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
     * 🎯 GET STATIC TEMPLATE - PRIORIZA TEMPLATE REAL COMPLETO
     * ⚡ CORREÇÃO CRÍTICA: Usa dados REAIS do QUIZ_STYLE_21_STEPS_TEMPLATE
     */
    private async getStaticTemplate(templateId: string): Promise<any | null> {
        try {
            // 🎯 PRIORIDADE 1: Template completo real (quiz21StepsComplete)
            if (templateId === 'quiz21StepsComplete' || templateId.startsWith('step-')) {
                console.log(`🎯 Carregando template REAL: ${templateId}`);
                
                // Importar template real completo
                const { QUIZ_STYLE_21_STEPS_TEMPLATE } = await import('@/templates/quiz21StepsComplete');
                
                if (templateId === 'quiz21StepsComplete') {
                    // Retornar estrutura completa do template real
                    return {
                        id: 'quiz21StepsComplete',
                        name: 'Quiz 21 Steps Complete (REAL)',
                        totalSteps: 21,
                        steps: QUIZ_STYLE_21_STEPS_TEMPLATE,
                        metadata: {
                            source: 'QUIZ_STYLE_21_STEPS_TEMPLATE',
                            isReal: true,
                            loadedAt: new Date().toISOString()
                        }
                    };
                }
                
                // Para steps individuais, extrair do template real
                const stepBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[templateId];
                if (stepBlocks && Array.isArray(stepBlocks)) {
                    console.log(`✅ Template REAL carregado: ${templateId} com ${stepBlocks.length} blocos`);
                    return {
                        id: templateId,
                        name: `Step ${templateId} (REAL)`,
                        blocks: stepBlocks,
                        metadata: {
                            source: 'QUIZ_STYLE_21_STEPS_TEMPLATE',
                            isReal: true,
                            loadedAt: new Date().toISOString()
                        }
                    };
                } else {
                    // Se não há template real, usar blocos gerados dinamicamente
                    const generatedBlocks = this.generateStepBlocks(parseInt(templateId.replace('step-', '')));
                    return {
                        id: templateId,
                        name: `Template ${templateId} (Generated)`,
                        blocks: generatedBlocks,
                        metadata: {
                            source: 'generateStepBlocks',
                            isGenerated: true,
                            loadedAt: new Date().toISOString()
                        }
                    };
                }
            }

            // 🎯 PRIORIDADE 2: Templates da biblioteca
            const { templateLibraryService } = await import('@/services/templateLibraryService');
            const libraryTemplate = templateLibraryService.getById(templateId);
            
            if (libraryTemplate) {
                console.log(`✅ Template da biblioteca carregado: ${templateId}`);
                return {
                    ...libraryTemplate,
                    metadata: {
                        ...libraryTemplate.metadata,
                        source: 'templateLibraryService',
                        isReal: true,
                        loadedAt: new Date().toISOString()
                    }
                };
            }

            console.warn(`⚠️ Template real não encontrado: ${templateId}`);
            return null;

        } catch (error) {
            console.error(`❌ Erro ao carregar template real ${templateId}:`, error);
            return null;
        }
    }

    /**
     * 🔧 GENERATE STEP BLOCKS - Helper para gerar blocos por step (usado em fallbacks)
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
     * 🔧 LOAD STEP BLOCKS - CORREÇÃO CRÍTICA: Usa template real PRIMEIRO
     * Compatibilidade com TemplateManager
     */
    async loadStepBlocks(stepId: string, funnelId?: string): Promise<any[]> {
        try {
            // 🎯 CORREÇÃO CRÍTICA: Forçar uso do template real para steps
            if (stepId.startsWith('step-') || funnelId === 'quiz21StepsComplete') {
                console.log(`🎯 Forçando carregamento de template REAL para: ${stepId}`);
                
                try {
                    const { QUIZ_STYLE_21_STEPS_TEMPLATE } = await import('@/templates/quiz21StepsComplete');
                    const realBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
                    
                    if (realBlocks && Array.isArray(realBlocks)) {
                        console.log(`🏆 TEMPLATE REAL carregado: ${stepId} com ${realBlocks.length} blocos`);
                        return realBlocks;
                    }
                } catch (importError) {
                    console.error(`❌ Erro ao importar template real: ${stepId}`, importError);
                }
            }

            // Fallback para o sistema antigo apenas se template real falhar
            const templateId = funnelId ? `${stepId}:${funnelId}` : stepId;
            const template = await this.getTemplate(templateId);

            // Se o template tem blocks, retorna eles
            if (template?.blocks && Array.isArray(template.blocks)) {
                console.log(`✅ Template blocks carregados: ${templateId} com ${template.blocks.length} blocos`);
                return template.blocks;
            }

            // Se o template é um array direto de blocks
            if (Array.isArray(template)) {
                console.log(`✅ Template array carregado: ${templateId} com ${template.length} blocos`);
                return template;
            }

            // Se template tem steps.stepId (estrutura de funil completo)
            if (template?.steps && template.steps[stepId]) {
                console.log(`✅ Template de funil carregado: ${stepId}`);
                return template.steps[stepId];
            }

            // Fallback: array vazio
            console.warn(`⚠️ NENHUM BLOCO encontrado para ${stepId}, retornando array vazio`);
            return [];
        } catch (error) {
            console.error(`❌ Erro CRÍTICO ao carregar blocks para ${stepId}:`, error);
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
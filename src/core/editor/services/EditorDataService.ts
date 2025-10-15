/**
 * 🔗 EditorDataService - Conecta Templates com Arquivos JSON
 * 
 * Serviço responsável por conectar os IDs dos templates do registry
 * com os arquivos JSON reais das etapas (step-01-template.json, etc.)
 */

import { FunnelStep } from '@/types/quiz-schema';

export type TemplateSource = 'template' | 'saved' | 'file';

export interface LoadOptions {
    templateId?: string;
    stepNumber?: number;
    source?: TemplateSource;
}

/**
 * Mapeamento de IDs de templates para arquivos JSON das etapas
 */
const TEMPLATE_TO_STEPS_MAPPING: Record<string, number[]> = {
    'quiz21StepsComplete': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    'com-que-roupa-eu-vou': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    'personal-branding-quiz': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    'lead-magnet-fashion': [1, 2, 3, 4, 5],
    'quiz-tipo-corpo': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    'consultoria-imagem-premium': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    'capsule-wardrobe-guide': [1, 2, 3, 4, 5, 6, 7, 8],
    'masterclass-combinacoes': [1, 2, 3, 4, 5, 6],
    'quiz-cores-perfeitas': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'shopping-inteligente': [1, 2, 3, 4, 5, 6, 7],
};

/**
 * EditorDataService - Singleton para gerenciamento de dados
 */
class EditorDataService {
    private static instance: EditorDataService;
    private cache = new Map<string, any>();
    private eventListeners: Array<(event: string, data: any) => void> = [];

    private constructor() { }

    static getInstance(): EditorDataService {
        if (!EditorDataService.instance) {
            EditorDataService.instance = new EditorDataService();
        }
        return EditorDataService.instance;
    }

    /**
     * Carrega schema de template baseado no ID
     */
    async loadSchemaFromTemplate(templateId: string, stepNumber?: number): Promise<FunnelStep[] | null> {
        const cacheKey = `${templateId}-${stepNumber || 'all'}`;

        if (this.cache.has(cacheKey)) {
            console.log(`📋 [EditorDataService] Cache hit para ${cacheKey}`);
            return this.cache.get(cacheKey);
        }

        try {
            const steps = TEMPLATE_TO_STEPS_MAPPING[templateId];
            if (!steps) {
                console.warn(`⚠️ Template ID '${templateId}' não encontrado no mapeamento`);
                return null;
            }

            const stepsToLoad = stepNumber ? [stepNumber] : steps;
            const loadedSteps: FunnelStep[] = [];

            for (const stepNum of stepsToLoad) {
                const stepData = await this.loadStepJson(stepNum);
                if (stepData) {
                    loadedSteps.push(stepData);
                }
            }

            // Cache do resultado
            this.cache.set(cacheKey, loadedSteps);

            // Notificar ouvintes
            this.emit('schema-loaded', { templateId, stepNumber, steps: loadedSteps });

            console.log(`✅ [EditorDataService] Schema carregado: ${templateId} com ${loadedSteps.length} etapas`);
            return loadedSteps;

        } catch (error) {
            console.error(`❌ [EditorDataService] Erro ao carregar schema:`, error);
            return null;
        }
    }

    /**
     * Carrega JSON de uma etapa específica
     */
    private async loadStepJson(stepNumber: number): Promise<FunnelStep | null> {
        try {
            const stepId = String(stepNumber).padStart(2, '0');
            const templatePath = `/templates/step-${stepId}-v3.json`;

            const response = await fetch(templatePath);
            if (!response.ok) {
                console.warn(`⚠️ Template step-${stepId}-v3 não encontrado`);
                return null;
            }

            const jsonData = await response.json();

            // Converter formato do JSON para FunnelStep
            const step: FunnelStep = {
                id: String(stepNumber),
                name: jsonData.metadata?.name || `Etapa ${stepNumber}`,
                description: jsonData.metadata?.description || '',
                order: stepNumber,
                type: this.inferStepType(jsonData),
                settings: {
                    showProgress: true,
                    progressStyle: 'bar' as const,
                    showBackButton: stepNumber > 1,
                    showNextButton: true,
                    allowSkip: false,
                    trackTimeOnStep: false,
                    trackInteractions: false,
                    customEvents: []
                },
                blocks: jsonData.blocks || [],
                navigation: {
                    nextStep: stepNumber < 21 ? String(stepNumber + 1) : undefined,
                    prevStep: stepNumber > 1 ? String(stepNumber - 1) : undefined,
                    conditions: [],
                    actions: []
                },
                validation: jsonData.validation || {
                    required: true,
                    rules: []
                }
            };

            return step;

        } catch (error) {
            console.error(`❌ Erro ao carregar step ${stepNumber}:`, error);
            return null;
        }
    }

    /**
     * Infere o tipo da etapa baseado no conteúdo JSON
     */
    private inferStepType(jsonData: any): 'intro' | 'lead-capture' | 'quiz-question' | 'strategic-question' | 'transition' | 'result' | 'offer' | 'thank-you' | 'custom' {
        if (!jsonData.blocks) return 'custom';

        const blockTypes = jsonData.blocks.map((block: any) => block.type);

        if (blockTypes.includes('quiz-question')) return 'quiz-question';
        if (blockTypes.includes('form-input')) return 'lead-capture';
        if (blockTypes.includes('result-display')) return 'result';
        if (blockTypes.includes('offer-card')) return 'offer';
        if (blockTypes.includes('thank-you')) return 'thank-you';

        return 'custom';
    }

    /**
     * Atualiza dados do schema
     */
    async updateSchema(templateId: string, stepNumber: number, updates: Partial<FunnelStep>): Promise<boolean> {
        try {
            const cacheKey = `${templateId}-${stepNumber}`;
            const currentSteps = await this.loadSchemaFromTemplate(templateId, stepNumber);

            if (currentSteps && currentSteps.length > 0) {
                const updatedStep = { ...currentSteps[0], ...updates };

                // Atualizar cache
                this.cache.set(cacheKey, [updatedStep]);

                // Salvar no localStorage como backup
                localStorage.setItem(`editor-${cacheKey}`, JSON.stringify([updatedStep]));

                // Notificar mudanças
                this.emit('schema-updated', { templateId, stepNumber, updates });

                console.log(`✅ [EditorDataService] Schema atualizado: ${templateId} step ${stepNumber}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`❌ [EditorDataService] Erro ao atualizar schema:`, error);
            return false;
        }
    }

    /**
     * Salva dados em múltiplos destinos
     */
    async saveToMultipleDestinations(templateId: string, data: any): Promise<void> {
        const promises = [
            this.saveToLocalStorage(templateId, data),
            this.saveToSupabase(templateId, data).catch(() => console.log('Supabase não disponível')),
        ];

        await Promise.allSettled(promises);
        this.emit('multi-save-completed', { templateId, data });
    }

    private async saveToLocalStorage(templateId: string, data: any): Promise<void> {
        localStorage.setItem(`editor-template-${templateId}`, JSON.stringify(data));
        console.log(`💾 Salvo no localStorage: ${templateId}`);
    }

    private async saveToSupabase(templateId: string, _data: any): Promise<void> {
        // TODO: Implementar salvamento no Supabase quando disponível
        console.log(`🔗 Supabase save simulado para: ${templateId}`);
    }

    /**
     * Sistema de eventos
     */
    on(event: string, listener: (data: any) => void): void {
        this.eventListeners.push((e, data) => {
            if (e === event) listener(data);
        });
    }

    private emit(event: string, data: any): void {
        this.eventListeners.forEach(listener => listener(event, data));
    }

    /**
     * Lista templates disponíveis
     */
    getAvailableTemplates(): string[] {
        return Object.keys(TEMPLATE_TO_STEPS_MAPPING);
    }

    /**
     * Obtém quantidade de etapas de um template
     */
    getTemplateStepCount(templateId: string): number {
        return TEMPLATE_TO_STEPS_MAPPING[templateId]?.length || 0;
    }

    /**
     * Limpa cache
     */
    clearCache(): void {
        this.cache.clear();
        console.log('🗑️ Cache do EditorDataService limpo');
    }
}

// Exportar instância singleton
export const editorDataService = EditorDataService.getInstance();
export default editorDataService;

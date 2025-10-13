/**
 * ⚠️ ARCHIVED - Sprint 3 (Low Usage)
 * 
 * Uso detectado: 2 referências
 * Data: 2025-10-12
 * 
 * Este arquivo foi arquivado por ter baixo uso.
 * Se precisar, pode ser restaurado de src/services/archived/
 */

/**
 * 🚀 SCALABLE HYBRID TEMPLATE SERVICE - MULTI-FUNNEL
 * 
 * Sistema escalável que funciona com qualquer funil:
 * - quiz21StepsComplete
 * - lead-magnet-fashion  
 * - personal-branding-quiz
 * - com-que-roupa-eu-vou
 * - Qualquer funil futuro!
 */

export interface ScalableStepConfig {
    metadata: {
        name: string;
        description: string;
        type: string;
        category: string;
        funnelId: string;
        stepNumber: number;
    };
    behavior: {
        autoAdvance: boolean;
        autoAdvanceDelay: number;
        showProgress: boolean;
        allowBack: boolean;
        skipValidation?: boolean;
    };
    validation: {
        type: 'input' | 'selection' | 'none';
        required: boolean;
        requiredSelections?: number;
        maxSelections?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        message: string;
    };
    ui: {
        theme?: string;
        layout?: 'single' | 'grid' | 'list';
        animation?: string;
        customCSS?: string;
    };
    analytics: {
        trackEvents: boolean;
        eventName?: string;
        customProperties?: Record<string, any>;
    };
    blocks?: any[];
}

export interface FunnelMasterConfig {
    templateVersion: string;
    metadata: {
        id: string;
        name: string;
        description: string;
        stepCount: number;
        category: string;
    };
    globalConfig: {
        navigation: {
            autoAdvanceSteps: number[];
            manualAdvanceSteps: number[];
            defaultAutoAdvanceDelay: number;
        };
        validation: {
            globalRules: Record<string, any>;
            strictMode: boolean;
        };
        ui: {
            theme: string;
            primaryColor: string;
            secondaryColor: string;
        };
        analytics: {
            enabled: boolean;
            provider: 'gtag' | 'mixpanel' | 'custom';
            trackingId?: string;
        };
    };
    stepDefaults: Partial<ScalableStepConfig>;
}

class ScalableHybridTemplateService {
    private static funnelConfigs = new Map<string, FunnelMasterConfig>();
    private static stepOverrides = new Map<string, any>();
    private static loadingPromises = new Map<string, Promise<any>>();

    /**
     * 🎯 MÉTODO PRINCIPAL - Suporta qualquer funil
     */
    static async getStepConfig(
        funnelId: string,
        stepNumber: number
    ): Promise<ScalableStepConfig> {
        try {
            // 1. Carregar configuração do funil se necessário
            await this.ensureFunnelLoaded(funnelId);

            // 2. Obter configuração master do funil
            const funnelConfig = this.funnelConfigs.get(funnelId);
            if (!funnelConfig) {
                throw new Error(`Funil ${funnelId} não encontrado`);
            }

            // 3. Tentar carregar override específico
            const override = await this.loadStepOverride(funnelId, stepNumber);

            // 4. Aplicar regras globais baseadas no funil
            const globalRules = this.getGlobalRules(funnelId, stepNumber);

            // 5. Mergear: defaults < global < master < override
            const finalConfig: ScalableStepConfig = {
                metadata: {
                    name: `Step ${stepNumber}`,
                    description: `Etapa ${stepNumber} do ${funnelConfig.metadata.name}`,
                    type: this.inferStepType(funnelId, stepNumber),
                    category: funnelConfig.metadata.category,
                    funnelId,
                    stepNumber,
                    ...funnelConfig.stepDefaults?.metadata,
                    ...override?.metadata,
                },
                behavior: {
                    ...this.getDefaultBehavior(),
                    ...globalRules.behavior,
                    ...funnelConfig.stepDefaults?.behavior,
                    ...override?.behavior,
                },
                validation: {
                    ...this.getDefaultValidation(),
                    ...globalRules.validation,
                    ...funnelConfig.stepDefaults?.validation,
                    ...override?.validation,
                },
                ui: {
                    theme: funnelConfig.globalConfig.ui.theme,
                    layout: 'single',
                    ...funnelConfig.stepDefaults?.ui,
                    ...override?.ui,
                },
                analytics: {
                    trackEvents: funnelConfig.globalConfig.analytics.enabled,
                    eventName: `${funnelId}_step_${stepNumber}_viewed`,
                    ...funnelConfig.stepDefaults?.analytics,
                    ...override?.analytics,
                },
                blocks: override?.blocks || [],
            };

            console.log(`✅ ScalableHybrid: ${funnelId} Step ${stepNumber} configurado`, {
                hasOverride: !!override,
                autoAdvance: finalConfig.behavior.autoAdvance,
                theme: finalConfig.ui.theme,
            });

            return finalConfig;

        } catch (error) {
            console.error(`❌ Erro ao carregar ${funnelId} step ${stepNumber}:`, error);
            return this.getFallbackConfig(funnelId, stepNumber);
        }
    }

    /**
     * 🔄 Garantir que configuração do funil está carregada
     */
    private static async ensureFunnelLoaded(funnelId: string): Promise<void> {
        if (this.funnelConfigs.has(funnelId)) {
            return; // Já carregado
        }

        // Evitar múltiplas requisições simultâneas
        const loadingKey = `funnel-${funnelId}`;
        if (this.loadingPromises.has(loadingKey)) {
            await this.loadingPromises.get(loadingKey);
            return;
        }

        const loadingPromise = this.loadFunnelConfig(funnelId);
        this.loadingPromises.set(loadingKey, loadingPromise);

        try {
            await loadingPromise;
        } finally {
            this.loadingPromises.delete(loadingKey);
        }
    }

    /**
     * 📁 Carregar configuração master do funil
     */
    private static async loadFunnelConfig(funnelId: string): Promise<void> {
        try {
            const masterPath = `/templates/funnels/${funnelId}/master.json`;
            console.log(`🔍 Carregando configuração: ${masterPath}`);

            const response = await fetch(masterPath);
            if (response.ok) {
                const config: FunnelMasterConfig = await response.json();
                this.funnelConfigs.set(funnelId, config);
                console.log(`✅ Configuração ${funnelId} carregada`);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn(`⚠️ Falha ao carregar ${funnelId}, usando fallback:`, error);
            // Criar configuração fallback
            const fallbackConfig = this.createFallbackFunnelConfig(funnelId);
            this.funnelConfigs.set(funnelId, fallbackConfig);
        }
    }

    /**
     * 📄 Carregar override específico de um step
     */
    private static async loadStepOverride(
        funnelId: string,
        stepNumber: number
    ): Promise<any | null> {
        try {
            const cacheKey = `${funnelId}-step-${stepNumber}`;
            if (this.stepOverrides.has(cacheKey)) {
                return this.stepOverrides.get(cacheKey);
            }

            const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
            const overridePath = `/templates/funnels/${funnelId}/steps/${stepId}.json`;

            const response = await fetch(overridePath);
            if (response.ok) {
                const override = await response.json();
                this.stepOverrides.set(cacheKey, override);
                return override;
            }

            return null; // Não tem override, usar configurações padrão
        } catch (error) {
            console.warn(`⚠️ Falha ao carregar override ${funnelId} step ${stepNumber}:`, error);
            return null;
        }
    }

    /**
     * 🌍 Regras globais baseadas no funil e tipo de step
     */
    private static getGlobalRules(
        funnelId: string,
        stepNumber: number
    ): { behavior: Partial<ScalableStepConfig['behavior']>; validation: Partial<ScalableStepConfig['validation']> } {

        // Regras específicas para quiz21StepsComplete
        if (funnelId === 'quiz21StepsComplete') {
            if (stepNumber === 1) {
                return {
                    behavior: { autoAdvance: false, allowBack: false },
                    validation: { type: 'input', required: true, minLength: 2 }
                };
            }

            if (stepNumber >= 2 && stepNumber <= 11) {
                return {
                    behavior: { autoAdvance: true, autoAdvanceDelay: 1500 },
                    validation: { type: 'selection', requiredSelections: 3, maxSelections: 3 }
                };
            }

            if (stepNumber >= 13 && stepNumber <= 18) {
                return {
                    behavior: { autoAdvance: false },
                    validation: { type: 'selection', requiredSelections: 1, maxSelections: 1 }
                };
            }
        }

        // Regras para lead-magnet-fashion (5 etapas)
        if (funnelId === 'lead-magnet-fashion') {
            if (stepNumber === 1) {
                return {
                    behavior: { autoAdvance: false, showProgress: false },
                    validation: { type: 'input', required: true, minLength: 2 }
                };
            }

            if (stepNumber >= 2 && stepNumber <= 4) {
                return {
                    behavior: { autoAdvance: true, autoAdvanceDelay: 1000 },
                    validation: { type: 'selection', requiredSelections: 1 }
                };
            }

            if (stepNumber === 5) {
                return {
                    behavior: { autoAdvance: false, allowBack: false },
                    validation: { type: 'input', required: true }
                };
            }
        }

        // Regras genéricas para funnels desconhecidos
        return {
            behavior: { autoAdvance: false, showProgress: true, allowBack: true },
            validation: { type: 'none', required: false, message: '' }
        };
    }

    /**
     * 🎭 Inferir tipo do step baseado no funil e posição
     */
    private static inferStepType(funnelId: string, stepNumber: number): string {
        const funnelConfig = this.funnelConfigs.get(funnelId);
        const totalSteps = funnelConfig?.metadata.stepCount || 21;

        if (stepNumber === 1) return 'intro';
        if (stepNumber === totalSteps) return 'final';
        if (stepNumber === totalSteps - 1) return 'result';

        if (funnelId === 'quiz21StepsComplete') {
            if (stepNumber >= 2 && stepNumber <= 11) return 'question';
            if (stepNumber === 12 || stepNumber === 19) return 'transition';
            if (stepNumber >= 13 && stepNumber <= 18) return 'strategic';
            if (stepNumber === 20) return 'result';
            if (stepNumber === 21) return 'offer';
        }

        return 'content';
    }

    /**
     * 🔧 Configurações padrão
     */
    private static getDefaultBehavior(): ScalableStepConfig['behavior'] {
        return {
            autoAdvance: false,
            autoAdvanceDelay: 1500,
            showProgress: true,
            allowBack: true,
        };
    }

    private static getDefaultValidation(): ScalableStepConfig['validation'] {
        return {
            type: 'none',
            required: false,
            message: '',
        };
    }

    /**
     * 🚨 Configuração fallback para funil desconhecido
     */
    private static createFallbackFunnelConfig(funnelId: string): FunnelMasterConfig {
        return {
            templateVersion: '1.0',
            metadata: {
                id: funnelId,
                name: `Funil ${funnelId}`,
                description: 'Configuração fallback gerada automaticamente',
                stepCount: 21, // Assumir 21 por padrão
                category: 'unknown',
            },
            globalConfig: {
                navigation: {
                    autoAdvanceSteps: [],
                    manualAdvanceSteps: [],
                    defaultAutoAdvanceDelay: 1500,
                },
                validation: {
                    globalRules: {},
                    strictMode: false,
                },
                ui: {
                    theme: 'default',
                    primaryColor: '#3B82F6',
                    secondaryColor: '#6B7280',
                },
                analytics: {
                    enabled: true,
                    provider: 'gtag',
                },
            },
            stepDefaults: {
                behavior: this.getDefaultBehavior(),
                validation: this.getDefaultValidation(),
            },
        };
    }

    /**
     * 🚨 Fallback para step individual
     */
    private static getFallbackConfig(funnelId: string, stepNumber: number): ScalableStepConfig {
        return {
            metadata: {
                name: `Fallback Step ${stepNumber}`,
                description: `Configuração fallback para ${funnelId} step ${stepNumber}`,
                type: 'content',
                category: 'fallback',
                funnelId,
                stepNumber,
            },
            behavior: this.getDefaultBehavior(),
            validation: this.getDefaultValidation(),
            ui: {
                theme: 'default',
                layout: 'single',
            },
            analytics: {
                trackEvents: false,
            },
            blocks: [],
        };
    }

    /**
     * 💾 Salvar override para qualquer funil
     */
    static async saveStepOverride(
        funnelId: string,
        stepNumber: number,
        changes: Partial<ScalableStepConfig>
    ): Promise<void> {
        const cacheKey = `${funnelId}-step-${stepNumber}`;
        const overrideData = {
            templateVersion: '2.0',
            funnelId,
            stepNumber,
            timestamp: new Date().toISOString(),
            ...changes,
        };

        // Atualizar cache
        this.stepOverrides.set(cacheKey, overrideData);

        console.log(`💾 Override salvo para ${funnelId} step ${stepNumber}:`, changes);

        // Em produção, salvaria no backend
        // await fetch(`/api/funnels/${funnelId}/steps/${stepNumber}/override`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(overrideData)
        // });
    }

    /**
     * 📊 Obter estatísticas de um funil
     */
    static async getFunnelStats(funnelId: string): Promise<any> {
        await this.ensureFunnelLoaded(funnelId);
        const config = this.funnelConfigs.get(funnelId);

        return {
            funnelId,
            name: config?.metadata.name,
            stepCount: config?.metadata.stepCount,
            autoAdvanceSteps: config?.globalConfig.navigation.autoAdvanceSteps.length || 0,
            theme: config?.globalConfig.ui.theme,
            analyticsEnabled: config?.globalConfig.analytics.enabled,
            overridesCount: Array.from(this.stepOverrides.keys())
                .filter(key => key.startsWith(`${funnelId}-`)).length,
        };
    }

    /**
     * 🔄 Limpar cache específico ou geral
     */
    static clearCache(funnelId?: string): void {
        if (funnelId) {
            this.funnelConfigs.delete(funnelId);
            Array.from(this.stepOverrides.keys())
                .filter(key => key.startsWith(`${funnelId}-`))
                .forEach(key => this.stepOverrides.delete(key));
            console.log(`🔄 Cache limpo para ${funnelId}`);
        } else {
            this.funnelConfigs.clear();
            this.stepOverrides.clear();
            this.loadingPromises.clear();
            console.log('🔄 Cache global limpo');
        }
    }

    /**
     * 📝 Listar todos os funis carregados
     */
    static getLoadedFunnels(): string[] {
        return Array.from(this.funnelConfigs.keys());
    }

    /**
     * 🔍 Debug: Obter estado interno
     */
    static getDebugInfo() {
        return {
            loadedFunnels: this.getLoadedFunnels(),
            overriddenSteps: Array.from(this.stepOverrides.keys()),
            loadingPromises: Array.from(this.loadingPromises.keys()),
        };
    }
}

export default ScalableHybridTemplateService;
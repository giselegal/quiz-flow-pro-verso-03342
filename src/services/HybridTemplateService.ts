/**
 * 🎯 HYBRID TEMPLATE SERVICE - FONTE DE VERDADE UNIFICADA
 * 
 * Hierarquia de prioridade:
 * 1. Override JSON específico (step-XX-template.json)
 * 2. Master JSON (quiz21-complete.json)
 * 3. TypeScript fallback (quiz21StepsComplete.ts)
 */

export interface StepBehaviorConfig {
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showProgress: boolean;
    allowBack: boolean;
}

export interface StepValidationConfig {
    type: 'input' | 'selection' | 'none';
    required: boolean;
    requiredSelections?: number;
    maxSelections?: number;
    minLength?: number;
    message: string;
}

export interface StepTemplate {
    metadata: {
        name: string;
        description: string;
        type: string;
        category: string;
    };
    behavior: StepBehaviorConfig;
    validation: StepValidationConfig;
    blocks?: any[];
}

export interface MasterTemplate {
    templateVersion: string;
    metadata: any;
    globalConfig: {
        navigation: {
            autoAdvanceSteps: number[];
            manualAdvanceSteps: number[];
            autoAdvanceDelay: number;
        };
        validation: {
            rules: Record<string, any>;
        };
    };
    steps: Record<string, StepTemplate>;
}

class HybridTemplateService {
    private static masterTemplate: MasterTemplate | null = null;
    private static overrideCache = new Map<string, any>();

    /**
     * 🏆 MÉTODO PRINCIPAL - Obter configuração de uma etapa
     */
    static async getStepConfig(stepNumber: number): Promise<StepTemplate> {
        try {
            const stepId = `step-${stepNumber}`;

            // 1. Tentar carregar override específico
            const override = await this.loadStepOverride(stepId);

            // 2. Carregar master template se necessário
            if (!this.masterTemplate) {
                await this.loadMasterTemplate();
            }

            // 3. Obter configuração base do master
            const masterStep = this.masterTemplate?.steps[stepId];

            // 4. Aplicar regras globais baseadas no número da etapa
            const globalRules = this.getGlobalRules(stepNumber);

            // 5. Mergear tudo: global < master < override
            const finalConfig: StepTemplate = {
                metadata: {
                    name: `Step ${stepNumber}`,
                    description: `Etapa ${stepNumber}`,
                    type: this.inferStepType(stepNumber),
                    category: 'quiz',
                    ...masterStep?.metadata,
                    ...override?.metadata,
                },
                behavior: {
                    ...globalRules.behavior,
                    ...masterStep?.behavior,
                    ...override?.behavior,
                },
                validation: {
                    ...globalRules.validation,
                    ...masterStep?.validation,
                    ...override?.validation,
                },
                blocks: override?.blocks || masterStep?.blocks || [],
            };

            console.log(`✅ HybridTemplateService: Step ${stepNumber} configurado`, {
                hasOverride: !!override,
                hasMaster: !!masterStep,
                autoAdvance: finalConfig.behavior.autoAdvance,
                requiredSelections: finalConfig.validation.requiredSelections,
            });

            return finalConfig;

        } catch (error) {
            console.error(`❌ HybridTemplateService: Erro ao carregar step ${stepNumber}:`, error);
            return this.getFallbackConfig(stepNumber);
        }
    }

    /**
     * Carrega arquivo master JSON
     */
    private static async loadMasterTemplate(): Promise<void> {
        try {
            const response = await fetch('/templates/quiz21-complete.json');
            if (response.ok) {
                this.masterTemplate = await response.json();
                console.log('✅ Master template carregado:', this.masterTemplate?.metadata.id);
            }
        } catch (error) {
            console.warn('⚠️ Falha ao carregar master template:', error);
        }
    }

    /**
     * Carrega override específico de uma etapa
     */
    private static async loadStepOverride(stepId: string): Promise<any | null> {
        try {
            // Verificar cache primeiro
            if (this.overrideCache.has(stepId)) {
                return this.overrideCache.get(stepId);
            }

            const response = await fetch(`/templates/${stepId}-template.json`);
            if (response.ok) {
                const override = await response.json();
                this.overrideCache.set(stepId, override);
                console.log(`✅ Override carregado para ${stepId}`);
                return override;
            }
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Aplica regras globais baseadas no número da etapa
     */
    private static getGlobalRules(stepNumber: number): { behavior: StepBehaviorConfig; validation: StepValidationConfig } {
        // Regras baseadas nas especificações do usuário
        if (stepNumber === 1) {
            return {
                behavior: {
                    autoAdvance: false,
                    autoAdvanceDelay: 0,
                    showProgress: false,
                    allowBack: false,
                },
                validation: {
                    type: 'input',
                    required: true,
                    minLength: 2,
                    message: 'Digite seu nome para continuar',
                },
            };
        }

        if (stepNumber >= 2 && stepNumber <= 11) {
            return {
                behavior: {
                    autoAdvance: true, // ✅ AUTO-AVANÇO HABILITADO
                    autoAdvanceDelay: 1500,
                    showProgress: true,
                    allowBack: true,
                },
                validation: {
                    type: 'selection',
                    required: true,
                    requiredSelections: 3,
                    maxSelections: 3,
                    message: 'Selecione 3 opções para continuar',
                },
            };
        }

        if (stepNumber >= 13 && stepNumber <= 18) {
            return {
                behavior: {
                    autoAdvance: false, // ✅ SEM AUTO-AVANÇO
                    autoAdvanceDelay: 0,
                    showProgress: true,
                    allowBack: true,
                },
                validation: {
                    type: 'selection',
                    required: true,
                    requiredSelections: 1,
                    maxSelections: 1,
                    message: 'Selecione uma opção para continuar',
                },
            };
        }

        // Outras etapas (transições, resultado, oferta)
        return {
            behavior: {
                autoAdvance: false,
                autoAdvanceDelay: 0,
                showProgress: true,
                allowBack: stepNumber < 21,
            },
            validation: {
                type: 'none',
                required: false,
                message: '',
            },
        };
    }

    /**
     * Inferir tipo da etapa baseado no número
     */
    private static inferStepType(stepNumber: number): string {
        if (stepNumber === 1) return 'intro';
        if (stepNumber >= 2 && stepNumber <= 11) return 'question';
        if (stepNumber === 12 || stepNumber === 19) return 'transition';
        if (stepNumber >= 13 && stepNumber <= 18) return 'strategic';
        if (stepNumber === 20) return 'result';
        if (stepNumber === 21) return 'offer';
        return 'other';
    }

    /**
     * Configuração fallback quando tudo falha
     */
    private static getFallbackConfig(stepNumber: number): StepTemplate {
        const globalRules = this.getGlobalRules(stepNumber);
        return {
            metadata: {
                name: `Fallback Step ${stepNumber}`,
                description: `Configuração fallback para etapa ${stepNumber}`,
                type: this.inferStepType(stepNumber),
                category: 'fallback',
            },
            behavior: globalRules.behavior,
            validation: globalRules.validation,
            blocks: [],
        };
    }

    /**
     * 💾 Salvar override para uma etapa (interface NoCode)
     */
    static async saveStepOverride(stepNumber: number, changes: Partial<StepTemplate>): Promise<void> {
        const stepId = `step-${stepNumber}`;

        // Preparar dados para salvar
        const overrideData = {
            templateVersion: '2.0',
            stepId,
            timestamp: new Date().toISOString(),
            overrides: changes,
        };

        // Atualizar cache
        this.overrideCache.set(stepId, overrideData);

        console.log(`💾 Override salvo para ${stepId}:`, changes);

        // Em produção, aqui salvaria no backend
        // await fetch(`/api/templates/${stepId}/override`, { method: 'POST', body: JSON.stringify(overrideData) });
    }

    /**
     * 🔄 Limpar cache
     */
    static clearCache(): void {
        this.masterTemplate = null;
        this.overrideCache.clear();
        console.log('🔄 Cache limpo');
    }
}

export default HybridTemplateService;
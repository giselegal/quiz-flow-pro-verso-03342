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
    type: 'input' | 'selection' | 'none' | 'transition';
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
    templateId?: string;
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
     * � MÉTODO PRINCIPAL: getTemplate
     * Hierarquia de prioridade de templates
     */
    static async getTemplate(templateId: string): Promise<any | null> {
        try {
            // 1. Carregar master template se necessário
            if (!this.masterTemplate) {
                await this.loadMasterTemplate();
            }

            // 2. Verificar se é um template específico
            if (templateId === 'quiz21StepsComplete') {
                // Fallback para template TypeScript
                try {
                    // Usar import centralizado para evitar warning do Vite
                    const { getQuiz21StepsTemplate } = await import('@/templates/imports');
                    const QUIZ_STYLE_21_STEPS_TEMPLATE = getQuiz21StepsTemplate();
                    return QUIZ_STYLE_21_STEPS_TEMPLATE;
                } catch (error) {
                    console.error('❌ Erro ao carregar quiz21StepsComplete:', error);
                }
            }

            // 3. Tentar carregar do master template
            if (this.masterTemplate && this.masterTemplate.steps && this.masterTemplate.steps[templateId]) {
                return this.masterTemplate.steps[templateId];
            }

            // 4. Tentar carregar override específico
            const override = await this.loadStepOverride(templateId);
            if (override) {
                return override;
            }

            console.warn(`⚠️ Template não encontrado: ${templateId}`);
            return null;

        } catch (error) {
            console.error(`❌ Erro ao carregar template ${templateId}:`, error);
            return null;
        }
    }

    /**
     * �🏆 MÉTODO PRINCIPAL - Obter configuração de uma etapa
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
     * Carrega arquivo master JSON consolidado (v3.0)
     */
    private static async loadMasterTemplate(): Promise<void> {
        try {
            console.log('🔄 Carregando master JSON v3.0...');

            const response = await fetch('/templates/quiz21-complete.json');

            if (response.ok) {
                const data = await response.json();

                // Validar estrutura v3.0 completa
                const isValid = this.validateMasterTemplate(data);

                if (isValid) {
                    this.masterTemplate = data;
                    console.log('✅ Master JSON v3.0 carregado com sucesso:', {
                        version: data.templateVersion,
                        steps: Object.keys(data.steps || {}).length,
                        consolidated: data.metadata?.consolidated,
                        size: `${(JSON.stringify(data).length / 1024).toFixed(2)} KB`
                    });
                    return;
                } else {
                    console.warn('⚠️ Master JSON inválido, usando fallback TypeScript');
                }
            } else {
                console.warn(`⚠️ Erro ${response.status} ao carregar master JSON`);
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar master JSON:', error);
        }

        // Fallback para TypeScript se JSON falhar ou for inválido
        console.log('📦 Usando fallback TypeScript...');
        try {
            const { getQuiz21StepsTemplate } = await import('@/templates/imports');
            const tsTemplate = getQuiz21StepsTemplate();

            this.masterTemplate = {
                templateVersion: "3.0",
                templateId: "quiz21StepsComplete",
                metadata: {
                    source: "typescript-fallback",
                    loadedAt: new Date().toISOString()
                },
                steps: tsTemplate,
                globalConfig: {
                    navigation: {
                        autoAdvanceSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18],
                        manualAdvanceSteps: [12, 19, 20, 21],
                        autoAdvanceDelay: 1000
                    },
                    validation: {
                        rules: {}
                    }
                }
            };

            console.log('✅ TypeScript fallback carregado');
        } catch (fallbackError) {
            console.error('❌ ERRO CRÍTICO: Falha no fallback TypeScript:', fallbackError);
            throw new Error('Não foi possível carregar nenhum template');
        }
    }

    /**
     * Valida estrutura do master template v3.0
     */
    private static validateMasterTemplate(data: any): boolean {
        if (!data) {
            console.warn('❌ Master template vazio');
            return false;
        }

        // Validar campos obrigatórios
        if (data.templateVersion !== "3.0") {
            console.warn('❌ Versão incorreta:', data.templateVersion);
            return false;
        }

        if (!data.steps || typeof data.steps !== 'object') {
            console.warn('❌ Campo "steps" ausente ou inválido');
            return false;
        }

        // Validar que tem os 21 steps
        const stepCount = Object.keys(data.steps).length;
        if (stepCount !== 21) {
            console.warn(`❌ Número incorreto de steps: ${stepCount}/21`);
            return false;
        }

        // Validar que steps têm seções
        let stepsWithSections = 0;
        for (const stepId in data.steps) {
            const step = data.steps[stepId];
            if (step.sections && Array.isArray(step.sections)) {
                stepsWithSections++;
            }
        }

        if (stepsWithSections < 21) {
            console.warn(`⚠️ Apenas ${stepsWithSections}/21 steps têm seções`);
            // Não retorna false, pois pode ser intencional para alguns steps
        }

        console.log(`✅ Validação master template: ${stepsWithSections}/21 steps com seções`);
        return true;
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

            // Normalizar stepId para formato correto (step-01, step-02, etc.)
            const normalizedStepId = this.normalizeStepId(stepId);
            const templatePath = `/templates/${normalizedStepId}-v3.json`;

            console.log(`🔍 HybridTemplateService: Tentando carregar template: ${templatePath}`);

            const response = await fetch(templatePath);
            if (response.ok) {
                const override = await response.json();
                this.overrideCache.set(stepId, override);
                console.log(`✅ Override carregado para ${stepId}`);
                return override;
            }

            // Se 404, usar template padrão ao invés de falhar
            if (response.status === 404) {
                console.log(`⚠️ Template ${templatePath} não encontrado (404), usando template padrão`);
                const defaultTemplate = this.createDefaultTemplate(normalizedStepId);
                this.overrideCache.set(stepId, defaultTemplate);
                return defaultTemplate;
            }

            console.warn(`⚠️ Erro ${response.status} ao carregar template ${templatePath}`);
            return null;
        } catch (error) {
            console.warn(`⚠️ Falha ao carregar override para ${stepId}:`, error);
            // Em caso de erro de rede, usar template padrão
            const normalizedStepId = this.normalizeStepId(stepId);
            const defaultTemplate = this.createDefaultTemplate(normalizedStepId);
            this.overrideCache.set(stepId, defaultTemplate);
            return defaultTemplate;
        }
    }

    /**
     * Normaliza stepId para formato consistente (step-01, step-02, etc.)
     */
    private static normalizeStepId(stepId: string): string {
        // Se já está no formato step-XX, retornar como está
        if (stepId.match(/^step-\d{2}$/)) {
            return stepId;
        }

        // Se é apenas um número, converter para step-XX
        const stepNumber = parseInt(stepId.replace(/\D/g, ''), 10);
        if (!isNaN(stepNumber)) {
            return `step-${stepNumber.toString().padStart(2, '0')}`;
        }

        // Fallback para casos não esperados
        return stepId;
    }

    /**
     * Cria um template padrão quando o arquivo não é encontrado
     */
    private static createDefaultTemplate(stepId: string): any {
        return {
            id: stepId,
            name: `Template padrão - ${stepId}`,
            description: `Template padrão gerado para ${stepId}`,
            blocks: [],
            settings: {
                behavior: {
                    autoAdvance: false,
                    showProgress: true,
                    allowBack: true
                },
                validation: {
                    required: false,
                    minSelections: 0,
                    maxSelections: 1
                }
            },
            meta: {
                isDefaultTemplate: true,
                generated: true,
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * Aplica regras globais baseadas no número da etapa
     */
    private static getGlobalRules(stepNumber: number): { behavior: StepBehaviorConfig; validation: StepValidationConfig } {
        // 🎯 ESPECIFICAÇÃO ATUALIZADA DO FLUXO DE SELEÇÕES:
        // Etapa 1: Input nome (manual)
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

        // Etapas 2-11: 3 seleções obrigatórias + auto-avanço após 3ª seleção
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

        // Etapas 12 e 19: Páginas de transição - botão "Continuar" ativo (manual)
        if (stepNumber === 12 || stepNumber === 19) {
            return {
                behavior: {
                    autoAdvance: false, // ✅ MANUAL - usuário clica "Continuar"
                    autoAdvanceDelay: 0,
                    showProgress: true,
                    allowBack: true,
                },
                validation: {
                    type: 'transition', // ✅ NOVO: tipo especial para transições
                    required: false, // ✅ Não requer validação - botão sempre ativo
                    message: 'Clique em "Continuar" para prosseguir',
                },
            };
        }

        // Etapas 13-18: 1 opção obrigatória + botão "Avançar" manual após seleção
        if (stepNumber >= 13 && stepNumber <= 18) {
            return {
                behavior: {
                    autoAdvance: false, // ✅ MANUAL - usuário clica "Avançar"
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

        // Outras etapas (20, 21, etc.)
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
     * Retorna o master template completo
     */
    static async getMasterTemplate(): Promise<MasterTemplate | null> {
        if (!this.masterTemplate) {
            await this.loadMasterTemplate();
        }
        return this.masterTemplate;
    }

    /**
     * 🔄 Limpar cache do master template e overrides
     */
    static clearCache(): void {
        this.masterTemplate = null;
        this.overrideCache.clear();
        console.log('�️ Cache do HybridTemplateService limpo');
    }

    /**
     * �🔄 Recarrega o master template do servidor
     */
    static async reload(): Promise<void> {
        console.log('🔄 Recarregando master template...');
        this.clearCache();
        await this.loadMasterTemplate();
        console.log('✅ Master template recarregado');
    }

    /**
     * 🔍 Expor configuração global (navegação/validação) do master template
     * Necessário para integração em `loadFunnelConfig` (FunnelTypesRegistry)
     * Mantido estático porque o service é utilizado como referência de classe (não instância)
     */
    static getGlobalConfig(): MasterTemplate['globalConfig'] | { navigation: any; validation: any } {
        if (!this.masterTemplate) {
            // Fallback seguro quando master ainda não foi carregado (ex: chamada antecipada)
            return {
                navigation: {
                    autoAdvanceSteps: [],
                    manualAdvanceSteps: [],
                    autoAdvanceDelay: 0
                },
                validation: {
                    rules: {}
                }
            };
        }
        return this.masterTemplate.globalConfig || {
            navigation: {
                autoAdvanceSteps: [],
                manualAdvanceSteps: [],
                autoAdvanceDelay: 0
            },
            validation: { rules: {} }
        };
    }
}

export default HybridTemplateService;
/**
 * ⚠️ ARCHIVED - Sprint 3 (Low Usage)
 * 
 * Uso detectado: 0 referências
 * Data: 2025-10-12
 * 
 * Este arquivo foi arquivado por ter baixo uso.
 * Se precisar, pode ser restaurado de src/services/archived/
 */

/**
 * 🎯 HYBRID TEMPLATE SERVICE - VERSÃO OTIMIZADA
 * 
 * Melhorias implementadas:
 * 1. ✅ Corrigido formato consistente do createDefaultTemplate
 * 2. ✅ Removido método legacy getTemplate
 * 3. ✅ Melhor tipagem para blocks
 * 4. ✅ Validação mais robusta
 * 5. ✅ Logs mais informativos
 */

export interface Block {
    id?: string;
    type: string;
    properties: Record<string, any>;
}

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
    blocks: Block[];
}

export interface MasterTemplate {
    templateVersion: string;
    metadata: {
        id: string;
        name: string;
        description: string;
    };
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

class OptimizedHybridTemplateService {
    private static masterTemplate: MasterTemplate | null = null;
    private static overrideCache = new Map<string, StepTemplate>();
    private static loadingPromises = new Map<string, Promise<any>>();

    /**
     * 🏆 MÉTODO PRINCIPAL - Obter configuração de uma etapa
     */
    static async getStepConfig(stepNumber: number): Promise<StepTemplate> {
        try {
            const stepId = `step-${stepNumber}`;

            // Verificar se já está carregando para evitar requests duplicados
            if (this.loadingPromises.has(stepId)) {
                return await this.loadingPromises.get(stepId);
            }

            const loadingPromise = this.loadStepConfigInternal(stepNumber);
            this.loadingPromises.set(stepId, loadingPromise);

            try {
                const result = await loadingPromise;
                return result;
            } finally {
                this.loadingPromises.delete(stepId);
            }

        } catch (error) {
            console.error(`❌ HybridTemplateService: Erro ao carregar step ${stepNumber}:`, error);
            return this.getFallbackConfig(stepNumber);
        }
    }

    /**
     * 🔧 Carregamento interno com cache otimizado
     */
    private static async loadStepConfigInternal(stepNumber: number): Promise<StepTemplate> {
        const stepId = `step-${stepNumber}`;

        // 1. Verificar cache primeiro
        if (this.overrideCache.has(stepId)) {
            console.log(`📦 Cache hit para ${stepId}`);
            return this.overrideCache.get(stepId)!;
        }

        // 2. Tentar carregar override específico
        const override = await this.loadStepOverride(stepId);

        // 3. Carregar master template se necessário
        if (!this.masterTemplate) {
            await this.loadMasterTemplate();
        }

        // 4. Obter configuração base do master
        const masterStep = this.masterTemplate?.steps[stepId];

        // 5. Aplicar regras globais baseadas no número da etapa
        const globalRules = this.getGlobalRules(stepNumber);

        // 6. Mergear tudo: global < master < override
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
            blocks: this.mergeBlocks(
                masterStep?.blocks || [],
                override?.blocks || []
            ),
        };

        // 7. Cache resultado
        this.overrideCache.set(stepId, finalConfig);

        console.log(`✅ HybridTemplateService: Step ${stepNumber} configurado`, {
            hasOverride: !!override,
            hasMaster: !!masterStep,
            autoAdvance: finalConfig.behavior.autoAdvance,
            requiredSelections: finalConfig.validation.requiredSelections,
            blocksCount: finalConfig.blocks.length,
        });

        return finalConfig;
    }

    /**
     * 📦 Merge inteligente de blocks
     */
    private static mergeBlocks(masterBlocks: Block[], overrideBlocks: Block[]): Block[] {
        if (overrideBlocks.length > 0) {
            console.log(`🔄 Usando blocks do override (${overrideBlocks.length} blocos)`);
            return overrideBlocks;
        }

        if (masterBlocks.length > 0) {
            console.log(`📄 Usando blocks do master template (${masterBlocks.length} blocos)`);
            return masterBlocks;
        }

        console.log(`⚠️ Nenhum block encontrado, usando array vazio`);
        return [];
    }

    /**
     * 📄 Carrega arquivo master JSON
     */
    private static async loadMasterTemplate(): Promise<void> {
        try {
            const response = await fetch('/templates/quiz21-complete.json');
            if (response.ok) {
                const data = await response.json();

                // Validação básica do master template
                if (!data.templateVersion || !data.steps) {
                    throw new Error('Master template inválido: estrutura incorreta');
                }

                this.masterTemplate = data;
                console.log(`✅ Master template carregado: ${this.masterTemplate?.metadata?.id} (v${this.masterTemplate?.templateVersion})`);
            } else {
                console.warn(`⚠️ Master template não encontrado (${response.status})`);
            }
        } catch (error) {
            console.warn('⚠️ Falha ao carregar master template:', error);
        }
    }

    /**
     * 🎯 Carrega override específico de uma etapa
     */
    private static async loadStepOverride(stepId: string): Promise<StepTemplate | null> {
        try {
            const normalizedStepId = this.normalizeStepId(stepId);
            const templatePath = `/templates/${normalizedStepId}-template.json`;

            console.log(`🔍 HybridTemplateService: Tentando carregar template: ${templatePath}`);

            const response = await fetch(templatePath);
            if (response.ok) {
                const override = await response.json();

                // Validar estrutura do override
                if (!this.isValidStepTemplate(override)) {
                    console.warn(`⚠️ Override inválido para ${stepId}, usando padrão`);
                    return this.createDefaultTemplate(normalizedStepId);
                }

                console.log(`✅ Override carregado para ${stepId}`);
                return override;
            }

            // Se 404, usar template padrão
            if (response.status === 404) {
                console.log(`⚠️ Template ${templatePath} não encontrado (404), criando padrão`);
                return this.createDefaultTemplate(normalizedStepId);
            }

            console.warn(`⚠️ Erro ${response.status} ao carregar template ${templatePath}`);
            return null;

        } catch (error) {
            console.warn(`⚠️ Falha ao carregar override para ${stepId}:`, error);
            const normalizedStepId = this.normalizeStepId(stepId);
            return this.createDefaultTemplate(normalizedStepId);
        }
    }

    /**
     * ✅ Validação de estrutura do StepTemplate
     */
    private static isValidStepTemplate(template: any): boolean {
        return !!(
            template &&
            template.metadata &&
            template.behavior &&
            template.validation &&
            Array.isArray(template.blocks)
        );
    }

    /**
     * 🔧 Normaliza stepId para formato consistente
     */
    private static normalizeStepId(stepId: string): string {
        if (stepId.match(/^step-\d{2}$/)) {
            return stepId;
        }

        const stepNumber = parseInt(stepId.replace(/\D/g, ''), 10);
        if (!isNaN(stepNumber)) {
            return `step-${stepNumber.toString().padStart(2, '0')}`;
        }

        return stepId;
    }

    /**
     * ✅ CORRIGIDO: Template padrão com formato StepTemplate consistente
     */
    private static createDefaultTemplate(stepId: string): StepTemplate {
        const stepNumber = parseInt(stepId.replace(/\D/g, ''), 10) || 1;
        const globalRules = this.getGlobalRules(stepNumber);

        return {
            metadata: {
                name: `Template padrão - ${stepId}`,
                description: `Template padrão gerado para ${stepId}`,
                type: this.inferStepType(stepNumber),
                category: 'quiz',
            },
            behavior: globalRules.behavior,
            validation: globalRules.validation,
            blocks: [],
        };
    }

    /**
     * 🎯 Aplica regras globais baseadas no número da etapa
     */
    private static getGlobalRules(stepNumber: number): { behavior: StepBehaviorConfig; validation: StepValidationConfig } {
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
                    autoAdvance: true,
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
                    autoAdvance: false,
                    autoAdvanceDelay: 0,
                    showProgress: true,
                    allowBack: true,
                },
                validation: {
                    type: 'transition',
                    required: false,
                    message: 'Clique em "Continuar" para prosseguir',
                },
            };
        }

        // Etapas 13-18: 1 opção obrigatória + botão "Avançar" manual após seleção
        if (stepNumber >= 13 && stepNumber <= 18) {
            return {
                behavior: {
                    autoAdvance: false,
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
     * 🔍 Inferir tipo da etapa baseado no número
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
     * 🛡️ Configuração fallback quando tudo falha
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

        // Invalidar cache
        this.overrideCache.delete(stepId);

        console.log(`💾 Override salvo para ${stepId}:`, changes);

        // Em produção, salvaria no backend
        // await fetch(`/api/templates/${stepId}/override`, { method: 'POST', body: JSON.stringify(changes) });
    }

    /**
     * 🔄 Limpar cache
     */
    static clearCache(): void {
        this.masterTemplate = null;
        this.overrideCache.clear();
        this.loadingPromises.clear();
        console.log('🔄 Cache limpo');
    }

    /**
     * 📊 Status do cache para debugging
     */
    static getCacheStatus(): {
        masterLoaded: boolean;
        overrideCount: number;
        loadingCount: number;
    } {
        return {
            masterLoaded: !!this.masterTemplate,
            overrideCount: this.overrideCache.size,
            loadingCount: this.loadingPromises.size,
        };
    }
}

export default OptimizedHybridTemplateService;
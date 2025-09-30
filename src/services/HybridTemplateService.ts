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

import { QUIZ_ESTILO_TEMPLATE_ID, isQuizEstiloId } from '@/domain/quiz/quiz-estilo-ids';

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
            if (isQuizEstiloId(templateId)) {
                // Published-first loader
                try {
                    const { loadQuizEstiloCanonical } = await import('@/domain/quiz/quizEstiloPublishedFirstLoader');
                    const loaded = await loadQuizEstiloCanonical();
                    if (loaded) {
                        return {
                            id: QUIZ_ESTILO_TEMPLATE_ID,
                            name: 'Quiz Estilo 21 Steps (Hybrid Published-First)',
                            steps: loaded.stepBlocks,
                            questions: loaded.questions,
                            styles: loaded.styles,
                            scoringMatrix: loaded.scoringMatrix,
                            metadata: {
                                source: `hybrid:quiz-estilo:${loaded.source}`,
                                loadedAt: new Date().toISOString(),
                                strategy: 'published-first'
                            }
                        };
                    }
                } catch (e) {
                    console.warn('⚠️ Falha ao carregar published-first quiz-estilo, tentando caminhos legados', e);
                }

                // Caminhos legados (overrides + master JSON) removidos - agora fallback direto para TS

                // Final TS fallback legacy
                const { getQuiz21StepsTemplate } = await import('@/templates/imports');
                const QUIZ_STYLE_21_STEPS_TEMPLATE = getQuiz21StepsTemplate();
                return {
                    id: QUIZ_ESTILO_TEMPLATE_ID,
                    name: 'Quiz Estilo 21 Steps (TS Legacy Fallback)',
                    steps: QUIZ_STYLE_21_STEPS_TEMPLATE,
                    metadata: {
                        source: 'QUIZ_STYLE_21_STEPS_TEMPLATE',
                        loadedAt: new Date().toISOString(),
                        strategy: 'legacy-ts-fallback'
                    }
                };
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

            // Normalizar stepId para formato correto (step-01, step-02, etc.)
            const normalizedStepId = this.normalizeStepId(stepId);
            const templatePath = `/templates/${normalizedStepId}-template.json`;

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
     * 🔄 Limpar cache
     */
    static clearCache(): void {
        this.masterTemplate = null;
        this.overrideCache.clear();
        console.log('🔄 Cache limpo');
    }
}

export default HybridTemplateService;
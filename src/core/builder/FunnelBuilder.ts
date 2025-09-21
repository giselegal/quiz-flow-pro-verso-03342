/**
 * 🏗️ FUNNEL BUILDER - Sistema de construção avançado para funis completos
 * 
 * Builder Pattern para criação de funis inteiros com múltiplas etapas,
 * lógica de fluxo, e otimizações automáticas.
 */

import { v4 as uuidv4 } from 'uuid';
import { ComponentBuilder, ComponentConfig, BuilderContext, type ValidationResult } from './ComponentBuilder';

// ✨ TIPOS DO FUNNEL BUILDER
export interface FunnelStep {
    id: string;
    name: string;
    components: ComponentConfig[];
    transitions: StepTransition[];
    metadata: StepMetadata;
}

export interface StepTransition {
    id: string;
    targetStepId: string | 'END';
    condition?: TransitionCondition;
    weight?: number; // Para A/B testing
    label?: string;
}

export interface TransitionCondition {
    type: 'always' | 'answer' | 'score' | 'custom';
    field?: string;
    operator?: 'equals' | 'contains' | 'greater' | 'less';
    value?: any;
    customFunction?: string;
}

export interface StepMetadata {
    order: number;
    isRequired: boolean;
    estimatedTime?: number; // em segundos
    conversionGoal?: string;
    tags?: string[];
}

export interface FunnelConfig {
    id: string;
    name: string;
    description?: string;
    steps: FunnelStep[];
    settings: FunnelSettings;
    analytics: FunnelAnalytics;
    metadata: FunnelMetadata;
}

export interface FunnelSettings {
    theme: string;
    allowBackward: boolean;
    saveProgress: boolean;
    showProgress: boolean;
    progressStyle: 'bar' | 'dots' | 'numbers';
    autoAdvance: boolean;
    timeouts: {
        stepTimeout?: number;
        totalTimeout?: number;
    };
}

export interface FunnelAnalytics {
    trackingEnabled: boolean;
    events: string[];
    goals: AnalyticsGoal[];
}

export interface AnalyticsGoal {
    id: string;
    name: string;
    type: 'completion' | 'conversion' | 'engagement';
    triggerCondition: any;
}

export interface FunnelMetadata {
    createdAt: string;
    updatedAt: string;
    version: string;
    author?: string;
    category?: string;
    tags?: string[];
}

// ✨ TEMPLATES DE FUNIS
export const FUNNEL_TEMPLATES = {
    'lead-qualification': {
        name: 'Qualificação de Lead',
        description: 'Funil para qualificação básica de leads',
        steps: [
            {
                name: 'Boas-vindas',
                components: ['hero-section']
            },
            {
                name: 'Perfil básico',
                components: ['simple-question', 'simple-question']
            },
            {
                name: 'Interesses',
                components: ['multiple-choice']
            },
            {
                name: 'Captura de dados',
                components: ['full-lead-capture']
            },
            {
                name: 'Obrigado',
                components: ['hero-section']
            }
        ]
    },

    'product-quiz': {
        name: 'Quiz de Produto',
        description: 'Quiz para recomendação de produtos',
        steps: [
            {
                name: 'Introdução',
                components: ['hero-section']
            },
            {
                name: 'Necessidades',
                components: ['simple-question', 'simple-question', 'simple-question']
            },
            {
                name: 'Preferências',
                components: ['multiple-choice', 'simple-question']
            },
            {
                name: 'Dados para envio',
                components: ['email-capture']
            },
            {
                name: 'Resultados',
                components: ['info-card', 'hero-section']
            }
        ]
    },

    'customer-satisfaction': {
        name: 'Pesquisa de Satisfação',
        description: 'Pesquisa completa de satisfação do cliente',
        steps: [
            {
                name: 'Introdução',
                components: ['hero-section']
            },
            {
                name: 'Avaliação geral',
                components: ['simple-question']
            },
            {
                name: 'Detalhes da experiência',
                components: ['multiple-choice', 'text-input']
            },
            {
                name: 'Sugestões',
                components: ['text-input']
            },
            {
                name: 'Finalização',
                components: ['hero-section']
            }
        ]
    },

    // 🎯 QUIZ 21 ETAPAS COMPLETO - MODELO DISPONÍVEL, DUPLICÁVEL E PERSONALIZÁVEL
    'quiz21StepsComplete': {
        name: 'Quiz de Estilo Pessoal - 21 Etapas',
        description: 'Template completo para descoberta do estilo pessoal com 21 etapas: coleta de nome, 10 questões pontuadas, questões estratégicas, resultado e oferta',
        steps: [
            {
                name: 'Coleta do Nome',
                components: ['quiz-intro-header', 'name-input-section']
            },
            {
                name: 'Questão 1 - Ocasiões Sociais',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 2 - Estilo Trabalho',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 3 - Cores Favoritas',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 4 - Peças Essenciais',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 5 - Inspiração',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 6 - Acessórios',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 7 - Estação do Ano',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 8 - Estilo Fim de Semana',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 9 - Padrões e Texturas',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Questão 10 - Estilo de Vida',
                components: ['quiz-question-header', 'multiple-choice-quiz']
            },
            {
                name: 'Transição - Questões Estratégicas',
                components: ['transition-section', 'progress-indicator']
            },
            {
                name: 'Estratégica 1 - Investimento',
                components: ['quiz-question-header', 'single-choice-strategic']
            },
            {
                name: 'Estratégica 2 - Urgência',
                components: ['quiz-question-header', 'single-choice-strategic']
            },
            {
                name: 'Estratégica 3 - Desafios',
                components: ['quiz-question-header', 'single-choice-strategic']
            },
            {
                name: 'Estratégica 4 - Sonho',
                components: ['quiz-question-header', 'single-choice-strategic']
            },
            {
                name: 'Estratégica 5 - Prioridade',
                components: ['quiz-question-header', 'single-choice-strategic']
            },
            {
                name: 'Estratégica 6 - Confiança',
                components: ['quiz-question-header', 'single-choice-strategic']
            },
            {
                name: 'Transição - Preparando Resultado',
                components: ['loading-section', 'result-preparation']
            },
            {
                name: 'Página de Resultado',
                components: ['result-header', 'style-analysis', 'recommendations', 'cta-section']
            },
            {
                name: 'Página de Oferta',
                components: ['offer-header', 'offer-benefits', 'pricing-section', 'testimonials', 'guarantee', 'checkout-form']
            }
        ]
    }
} as const;

/**
 * 🏗️ FUNNEL BUILDER CLASS
 */
export class FunnelBuilder {
    private config: FunnelConfig;
    private currentStepOrder = 0;

    constructor(name: string) {
        this.config = {
            id: uuidv4(),
            name,
            description: '',
            steps: [],
            settings: {
                theme: 'default',
                allowBackward: true,
                saveProgress: true,
                showProgress: true,
                progressStyle: 'bar',
                autoAdvance: false,
                timeouts: {}
            },
            analytics: {
                trackingEnabled: true,
                events: ['step_start', 'step_complete', 'funnel_complete'],
                goals: []
            },
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: '1.0.0'
            }
        };
    }

    // ✨ CONFIGURAÇÃO GERAL DO FUNIL

    /**
     * Define descrição do funil
     */
    withDescription(description: string): FunnelBuilder {
        this.config.description = description;
        return this;
    }

    /**
     * Configura tema visual
     */
    withTheme(theme: string): FunnelBuilder {
        this.config.settings.theme = theme;
        return this;
    }

    /**
     * Configura comportamentos gerais
     */
    withSettings(settings: Partial<FunnelSettings>): FunnelBuilder {
        this.config.settings = { ...this.config.settings, ...settings };
        return this;
    }

    /**
     * Configura analytics
     */
    withAnalytics(analytics: Partial<FunnelAnalytics>): FunnelBuilder {
        this.config.analytics = { ...this.config.analytics, ...analytics };
        return this;
    }

    /**
     * Adiciona metadados
     */
    withMetadata(metadata: Partial<FunnelMetadata>): FunnelBuilder {
        this.config.metadata = { ...this.config.metadata, ...metadata };
        return this;
    }

    // ✨ CONSTRUÇÃO DE ETAPAS

    /**
     * Adiciona uma nova etapa
     */
    addStep(name: string): StepBuilder {
        const step: FunnelStep = {
            id: uuidv4(),
            name,
            components: [],
            transitions: [],
            metadata: {
                order: this.currentStepOrder++,
                isRequired: true
            }
        };

        this.config.steps.push(step);
        return new StepBuilder(step, this);
    }

    /**
     * Adiciona múltiplas etapas de uma vez
     */
    addSteps(stepNames: string[]): FunnelBuilder {
        stepNames.forEach(name => {
            this.addStep(name).complete();
        });
        return this;
    }

    // ✨ TEMPLATES

    /**
     * Aplica um template de funil
     */
    fromTemplate(templateName: keyof typeof FUNNEL_TEMPLATES): FunnelBuilder {
        const template = FUNNEL_TEMPLATES[templateName];

        this.config.name = template.name;
        this.config.description = template.description;

        // Criar etapas do template
        template.steps.forEach((stepTemplate) => {
            const stepBuilder = this.addStep(stepTemplate.name);

            // Adicionar componentes da etapa
            stepTemplate.components.forEach(componentTemplate => {
                stepBuilder.addComponentFromTemplate(componentTemplate as any);
            });

            stepBuilder.complete();
        });

        return this;
    }

    // ✨ FLUXO E TRANSIÇÕES

    /**
     * Conecta etapas automaticamente em sequência
     */
    autoConnect(): FunnelBuilder {
        for (let i = 0; i < this.config.steps.length - 1; i++) {
            const currentStep = this.config.steps[i];
            const nextStep = this.config.steps[i + 1];

            currentStep.transitions.push({
                id: uuidv4(),
                targetStepId: nextStep.id,
                condition: { type: 'always' },
                label: 'Próximo'
            });
        }

        // Última etapa vai para END
        if (this.config.steps.length > 0) {
            const lastStep = this.config.steps[this.config.steps.length - 1];
            lastStep.transitions.push({
                id: uuidv4(),
                targetStepId: 'END',
                condition: { type: 'always' },
                label: 'Finalizar'
            });
        }

        return this;
    }

    /**
     * Adiciona transição condicional entre etapas
     */
    addConditionalFlow(
        fromStepName: string,
        toStepName: string,
        condition: TransitionCondition
    ): FunnelBuilder {
        const fromStep = this.config.steps.find(s => s.name === fromStepName);
        const toStep = this.config.steps.find(s => s.name === toStepName);

        if (fromStep && toStep) {
            fromStep.transitions.push({
                id: uuidv4(),
                targetStepId: toStep.id,
                condition,
                label: `Se ${condition.field} ${condition.operator} ${condition.value}`
            });
        }

        return this;
    }

    // ✨ OTIMIZAÇÕES

    /**
     * Otimiza o funil automaticamente
     */
    optimize(): FunnelBuilder {
        // Otimização 1: Remover etapas vazias
        this.config.steps = this.config.steps.filter(step => step.components.length > 0);

        // Otimização 2: Reordenar etapas por importância
        this.config.steps.forEach((step, index) => {
            step.metadata.order = index;
        });

        // Otimização 3: Configurar timeouts baseados no conteúdo
        this.config.steps.forEach(step => {
            const estimatedTime = this.calculateStepTime(step);
            step.metadata.estimatedTime = estimatedTime;
        });

        // Otimização 4: Adicionar analytics automático
        if (!this.config.analytics.goals.length) {
            this.config.analytics.goals.push({
                id: uuidv4(),
                name: 'Completion Rate',
                type: 'completion',
                triggerCondition: { type: 'funnel_complete' }
            });
        }

        return this;
    }

    /**
     * Calcula tempo estimado para uma etapa
     */
    private calculateStepTime(step: FunnelStep): number {
        let totalTime = 0;

        step.components.forEach(component => {
            switch (component.type) {
                case 'quiz-question':
                    totalTime += 15; // 15 segundos por pergunta
                    break;
                case 'text-input':
                    totalTime += 30; // 30 segundos para texto
                    break;
                case 'lead-capture':
                    totalTime += 45; // 45 segundos para captura
                    break;
                case 'hero':
                    totalTime += 10; // 10 segundos para leitura
                    break;
                default:
                    totalTime += 5;
            }
        });

        return totalTime;
    }

    // ✨ VALIDAÇÃO

    /**
     * Valida a configuração do funil
     */
    validate(): ValidationResult {
        const errors: any[] = [];
        const warnings: any[] = [];

        // Validar etapas
        if (this.config.steps.length === 0) {
            errors.push({
                field: 'steps',
                message: 'Funil deve ter pelo menos uma etapa',
                severity: 'error'
            });
        }

        // Validar fluxo
        const hasOrphanSteps = this.config.steps.some(step =>
            step.transitions.length === 0 && step !== this.config.steps[this.config.steps.length - 1]
        );

        if (hasOrphanSteps) {
            warnings.push({
                field: 'flow',
                message: 'Algumas etapas não têm transições definidas',
                suggestion: 'Use autoConnect() ou defina transições manualmente'
            });
        }

        // Validar componentes em cada etapa
        this.config.steps.forEach(step => {
            if (step.components.length === 0) {
                warnings.push({
                    field: `step_${step.id}`,
                    message: `Etapa '${step.name}' está vazia`,
                    suggestion: 'Adicione pelo menos um componente'
                });
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    // ✨ CONSTRUÇÃO FINAL

    /**
     * Constrói o funil final
     */
    build(): FunnelConfig {
        this.config.metadata.updatedAt = new Date().toISOString();
        return { ...this.config };
    }

    /**
     * Constrói apenas se a validação passar
     */
    buildSafe(): FunnelConfig | null {
        const validation = this.validate();
        return validation.isValid ? this.build() : null;
    }
}

/**
 * 🏗️ STEP BUILDER CLASS
 * 
 * Builder específico para construção de etapas individuais
 */
export class StepBuilder {
    constructor(
        private step: FunnelStep,
        private funnelBuilder: FunnelBuilder
    ) { }

    /**
     * Adiciona componente à etapa
     */
    addComponent(componentBuilder: ComponentBuilder): StepBuilder {
        const result = componentBuilder.build();
        if (result.validation.isValid) {
            this.step.components.push(result.component);
        }
        return this;
    }

    /**
     * Adiciona componente usando factory
     */
    addComponentFromTemplate(templateName: string): StepBuilder {
        const context: BuilderContext = {
            stepId: this.step.id,
            isTemplate: true
        };

        // Usar ComponentBuilder para criar o componente
        const builder = new ComponentBuilder(templateName, context);
        return this.addComponent(builder);
    }

    /**
     * Adiciona múltiplos componentes
     */
    addComponents(builders: ComponentBuilder[]): StepBuilder {
        builders.forEach(builder => this.addComponent(builder));
        return this;
    }

    /**
     * Configura metadados da etapa
     */
    withMetadata(metadata: Partial<StepMetadata>): StepBuilder {
        this.step.metadata = { ...this.step.metadata, ...metadata };
        return this;
    }

    /**
     * Marca etapa como obrigatória
     */
    required(isRequired = true): StepBuilder {
        this.step.metadata.isRequired = isRequired;
        return this;
    }

    /**
     * Define tempo estimado
     */
    withEstimatedTime(seconds: number): StepBuilder {
        this.step.metadata.estimatedTime = seconds;
        return this;
    }

    /**
     * Adiciona tags
     */
    withTags(tags: string[]): StepBuilder {
        this.step.metadata.tags = [...(this.step.metadata.tags || []), ...tags];
        return this;
    }

    /**
     * Adiciona transição para próxima etapa
     */
    transitionTo(targetStepName: string, condition?: TransitionCondition): StepBuilder {
        this.step.transitions.push({
            id: uuidv4(),
            targetStepId: targetStepName, // Será resolvido depois
            condition: condition || { type: 'always' },
            label: condition ? 'Condicional' : 'Próximo'
        });
        return this;
    }

    /**
     * Finaliza construção da etapa e retorna ao funnel builder
     */
    complete(): FunnelBuilder {
        return this.funnelBuilder;
    }
}

// ✨ FACTORY FUNCTIONS

/**
 * Cria um novo builder de funil
 */
export function createFunnel(name: string): FunnelBuilder {
    return new FunnelBuilder(name);
}

/**
 * Cria um funil a partir de template
 */
export function createFunnelFromTemplate(
    templateName: keyof typeof FUNNEL_TEMPLATES
): FunnelBuilder {
    const template = FUNNEL_TEMPLATES[templateName];
    return new FunnelBuilder(template.name).fromTemplate(templateName);
}

/**
 * Cria um funil otimizado automaticamente
 */
export function createOptimizedFunnel(name: string): FunnelBuilder {
    return new FunnelBuilder(name).optimize();
}

export default FunnelBuilder;

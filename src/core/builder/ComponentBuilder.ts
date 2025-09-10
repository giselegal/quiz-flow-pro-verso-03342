/**
 * 🏗️ COMPONENT BUILDER - Sistema de construção avançado para componentes
 * 
 * Builder Pattern moderno para criação fluente e tipada de componentes do quiz/funil
 * com validação automática, inferência de tipos e suporte a templates.
 */

import { v4 as uuidv4 } from 'uuid';
import { blocksRegistry, type PropSchema } from '@/core/blocks/registry';

// ✨ TIPOS BASE DO BUILDER
export interface ComponentConfig {
    id?: string;
    type: string;
    position?: { x: number; y: number };
    properties?: Record<string, any>;
    content?: Record<string, any>;
    style?: Record<string, any>;
    validation?: Record<string, any>;
    metadata?: Record<string, any>;
}

export interface BuilderContext {
    stepId?: string;
    canvasId?: string;
    parentId?: string;
    isTemplate?: boolean;
    theme?: string;
}

// ✨ RESULTADO DA CONSTRUÇÃO
export interface BuildResult {
    component: ComponentConfig;
    validation: ValidationResult;
    suggestions: string[];
    optimizations: string[];
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationWarning {
    field: string;
    message: string;
    suggestion?: string;
}

// ✨ TEMPLATES PREDEFINIDOS
export const COMPONENT_TEMPLATES = {
    // Quiz Components
    'simple-question': {
        type: 'quiz-question',
        properties: {
            questionType: 'single-choice',
            required: true,
            showProgress: true
        },
        content: {
            question: 'Qual sua resposta?',
            options: ['Opção A', 'Opção B', 'Opção C']
        }
    },

    'multiple-choice': {
        type: 'quiz-question',
        properties: {
            questionType: 'multiple-choice',
            required: true,
            minSelections: 1,
            maxSelections: 3
        },
        content: {
            question: 'Selecione todas as opções que se aplicam:',
            options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4']
        }
    },

    'text-input': {
        type: 'text-input',
        properties: {
            inputType: 'text',
            required: true,
            maxLength: 200
        },
        content: {
            label: 'Digite sua resposta:',
            placeholder: 'Sua resposta aqui...'
        }
    },

    // Lead Capture
    'email-capture': {
        type: 'lead-capture',
        properties: {
            fields: ['email'],
            required: true,
            validateEmail: true
        },
        content: {
            title: 'Receba seus resultados',
            subtitle: 'Digite seu email para continuar',
            buttonText: 'Continuar'
        }
    },

    'full-lead-capture': {
        type: 'lead-capture',
        properties: {
            fields: ['name', 'email', 'phone'],
            required: true,
            validateEmail: true,
            validatePhone: true
        },
        content: {
            title: 'Complete seu cadastro',
            subtitle: 'Precisamos de algumas informações',
            buttonText: 'Finalizar'
        }
    },

    // Content Blocks
    'hero-section': {
        type: 'hero',
        properties: {
            alignment: 'center',
            backgroundType: 'gradient',
            showButton: true
        },
        content: {
            title: 'Título Principal',
            subtitle: 'Subtítulo explicativo',
            buttonText: 'Começar',
            backgroundImage: ''
        }
    },

    'info-card': {
        type: 'info-card',
        properties: {
            layout: 'vertical',
            showIcon: true,
            elevation: 'medium'
        },
        content: {
            title: 'Informação Importante',
            description: 'Descrição detalhada da informação',
            icon: '💡'
        }
    }
} as const;

/**
 * 🏗️ COMPONENT BUILDER CLASS
 * 
 * Builder principal com métodos fluentes para construção de componentes
 */
export class ComponentBuilder {
    private config: ComponentConfig;
    private context: BuilderContext;
    private errors: ValidationError[] = [];
    private warnings: ValidationWarning[] = [];

    constructor(type: string, context: BuilderContext = {}) {
        this.config = {
            id: uuidv4(),
            type,
            position: { x: 0, y: 0 },
            properties: {},
            content: {},
            style: {},
            validation: {},
            metadata: {}
        };
        this.context = context;
    }

    // ✨ MÉTODOS DE CONFIGURAÇÃO FLUENTES

    /**
     * Define ID customizado do componente
     */
    withId(id: string): ComponentBuilder {
        this.config.id = id;
        return this;
    }

    /**
     * Define posição no canvas
     */
    atPosition(x: number, y: number): ComponentBuilder {
        this.config.position = { x, y };
        return this;
    }

    /**
     * Adiciona propriedades de configuração
     */
    withProperties(properties: Record<string, any>): ComponentBuilder {
        this.config.properties = { ...this.config.properties, ...properties };
        return this;
    }

    /**
     * Adiciona uma propriedade específica
     */
    withProperty(key: string, value: any): ComponentBuilder {
        if (!this.config.properties) this.config.properties = {};
        this.config.properties[key] = value;
        return this;
    }

    /**
     * Define conteúdo do componente
     */
    withContent(content: Record<string, any>): ComponentBuilder {
        this.config.content = { ...this.config.content, ...content };
        return this;
    }

    /**
     * Adiciona um campo de conteúdo específico
     */
    withContentField(key: string, value: any): ComponentBuilder {
        if (!this.config.content) this.config.content = {};
        this.config.content[key] = value;
        return this;
    }

    /**
     * Define estilos customizados
     */
    withStyle(style: Record<string, any>): ComponentBuilder {
        this.config.style = { ...this.config.style, ...style };
        return this;
    }

    /**
     * Define regras de validação
     */
    withValidation(validation: Record<string, any>): ComponentBuilder {
        this.config.validation = { ...this.config.validation, ...validation };
        return this;
    }

    /**
     * Adiciona metadados
     */
    withMetadata(metadata: Record<string, any>): ComponentBuilder {
        this.config.metadata = { ...this.config.metadata, ...metadata };
        return this;
    }

    // ✨ MÉTODOS DE TEMPLATE

    /**
     * Aplica um template predefinido
     */
    fromTemplate(templateName: keyof typeof COMPONENT_TEMPLATES): ComponentBuilder {
        const template = COMPONENT_TEMPLATES[templateName];
        if (!template) {
            this.errors.push({
                field: 'template',
                message: `Template '${templateName}' não encontrado`,
                severity: 'error'
            });
            return this;
        }

        this.config.type = template.type;
        this.config.properties = { ...this.config.properties, ...template.properties };
        this.config.content = { ...this.config.content, ...template.content };

        return this;
    }

    // ✨ MÉTODOS DE VALIDAÇÃO

    /**
     * Valida a configuração atual
     */
    private validateConfiguration(): ValidationResult {
        const errors: ValidationError[] = [...this.errors];
        const warnings: ValidationWarning[] = [...this.warnings];

        // Verificar se o tipo existe no registry
        const blockDefinition = blocksRegistry[this.config.type];
        if (!blockDefinition) {
            errors.push({
                field: 'type',
                message: `Tipo de componente '${this.config.type}' não encontrado no registry`,
                severity: 'error'
            });
        }

        // Validar propriedades obrigatórias
        if (blockDefinition?.propsSchema) {
            blockDefinition.propsSchema.forEach((schema: PropSchema) => {
                if (schema.required) {
                    const value = this.config.properties?.[schema.key];
                    if (value === undefined || value === null || value === '') {
                        errors.push({
                            field: schema.key,
                            message: `Propriedade obrigatória '${schema.label || schema.key}' não foi definida`,
                            severity: 'error'
                        });
                    }
                }

                // Validar tipos
                if (this.config.properties?.[schema.key] !== undefined) {
                    const value = this.config.properties[schema.key];
                    const isValidType = this.validateFieldType(value, schema);
                    if (!isValidType) {
                        errors.push({
                            field: schema.key,
                            message: `Valor inválido para '${schema.label || schema.key}'. Esperado: ${schema.kind}`,
                            severity: 'error'
                        });
                    }
                }

                // Validações específicas por tipo
                this.validateSpecificRules(schema, warnings);
            });
        }

        // Validar conteúdo
        this.validateContent(warnings);

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Valida tipo de campo
     */
    private validateFieldType(value: any, schema: PropSchema): boolean {
        switch (schema.kind) {
            case 'text':
            case 'textarea':
            case 'url':
            case 'color':
                return typeof value === 'string';
            case 'number':
            case 'range':
                return typeof value === 'number' && !isNaN(value);
            case 'switch':
                return typeof value === 'boolean';
            case 'select':
                return schema.options?.some(opt => opt.value === value);
            case 'array':
                return Array.isArray(value);
            case 'image':
                return typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:'));
            default:
                return true;
        }
    }

    /**
     * Validações específicas por regras
     */
    private validateSpecificRules(schema: PropSchema, warnings: ValidationWarning[]): void {
        const value = this.config.properties?.[schema.key];

        // Validar min/max para números
        if ((schema.kind === 'number' || schema.kind === 'range') && typeof value === 'number') {
            if (schema.min !== undefined && value < schema.min) {
                warnings.push({
                    field: schema.key,
                    message: `Valor ${value} é menor que o mínimo permitido (${schema.min})`,
                    suggestion: `Use um valor >= ${schema.min}`
                });
            }
            if (schema.max !== undefined && value > schema.max) {
                warnings.push({
                    field: schema.key,
                    message: `Valor ${value} é maior que o máximo permitido (${schema.max})`,
                    suggestion: `Use um valor <= ${schema.max}`
                });
            }
        }

        // Validar array não vazio
        if (schema.kind === 'array' && Array.isArray(value) && value.length === 0) {
            warnings.push({
                field: schema.key,
                message: `Array '${schema.label || schema.key}' está vazio`,
                suggestion: 'Adicione pelo menos um item'
            });
        }
    }

    /**
     * Valida conteúdo do componente
     */
    private validateContent(warnings: ValidationWarning[]): void {
        // Validações específicas por tipo de componente
        switch (this.config.type) {
            case 'quiz-question':
                if (!this.config.content?.question) {
                    warnings.push({
                        field: 'question',
                        message: 'Pergunta não foi definida',
                        suggestion: 'Adicione uma pergunta para o componente'
                    });
                }
                if (!this.config.content?.options || this.config.content.options.length < 2) {
                    warnings.push({
                        field: 'options',
                        message: 'Pelo menos 2 opções são recomendadas',
                        suggestion: 'Adicione mais opções de resposta'
                    });
                }
                break;

            case 'lead-capture':
                if (!this.config.content?.title) {
                    warnings.push({
                        field: 'title',
                        message: 'Título não foi definido',
                        suggestion: 'Adicione um título chamativo para captura de leads'
                    });
                }
                break;

            case 'hero':
                if (!this.config.content?.title) {
                    warnings.push({
                        field: 'title',
                        message: 'Título principal não foi definido',
                        suggestion: 'Adicione um título impactante para a seção hero'
                    });
                }
                break;
        }
    }

    // ✨ MÉTODOS DE OTIMIZAÇÃO

    /**
     * Gera sugestões de otimização
     */
    private generateOptimizations(): string[] {
        const optimizations: string[] = [];

        // Otimizações de conteúdo
        if (this.config.content?.title && this.config.content.title.length > 60) {
            optimizations.push('Considere encurtar o título para melhor legibilidade');
        }

        if (this.config.content?.description && this.config.content.description.length < 20) {
            optimizations.push('Adicione mais detalhes à descrição para maior engajamento');
        }

        // Otimizações de acessibilidade
        if (this.config.type === 'image' && !this.config.properties?.alt) {
            optimizations.push('Adicione texto alternativo (alt) para acessibilidade');
        }

        // Otimizações de UX
        if (this.config.type === 'quiz-question' && (!this.config.properties?.showProgress)) {
            optimizations.push('Considere mostrar progresso para melhor UX');
        }

        return optimizations;
    }

    /**
     * Gera sugestões baseadas no contexto
     */
    private generateSuggestions(): string[] {
        const suggestions: string[] = [];

        // Sugestões baseadas no tipo
        switch (this.config.type) {
            case 'quiz-question':
                suggestions.push('💡 Adicione feedback para respostas incorretas');
                suggestions.push('🎯 Configure pontuação para gamificação');
                break;

            case 'lead-capture':
                suggestions.push('🔒 Adicione texto sobre privacidade para aumentar conversão');
                suggestions.push('🎁 Ofereça um incentivo (desconto, ebook) para captura');
                break;

            case 'hero':
                suggestions.push('🖼️ Use imagem de alta qualidade como background');
                suggestions.push('🚀 Adicione call-to-action claro e chamativo');
                break;
        }

        // Sugestões baseadas no contexto
        if (this.context.isTemplate) {
            suggestions.push('📋 Personalize o template para seu caso específico');
        }

        if (this.context.theme) {
            suggestions.push(`🎨 Ajuste cores para combinar com o tema '${this.context.theme}'`);
        }

        return suggestions;
    }

    // ✨ MÉTODO DE CONSTRUÇÃO FINAL

    /**
     * Constrói o componente final com validação
     */
    build(): BuildResult {
        const validation = this.validateConfiguration();
        const suggestions = this.generateSuggestions();
        const optimizations = this.generateOptimizations();

        // Adicionar metadados de construção
        this.config.metadata = {
            ...this.config.metadata,
            builtAt: new Date().toISOString(),
            builderVersion: '1.0.0',
            context: this.context
        };

        return {
            component: this.config,
            validation,
            suggestions,
            optimizations
        };
    }

    /**
     * Constrói apenas se a validação passar
     */
    buildSafe(): ComponentConfig | null {
        const result = this.build();
        return result.validation.isValid ? result.component : null;
    }

    /**
     * Retorna apenas erros de validação
     */
    validate(): ValidationResult {
        return this.validateConfiguration();
    }
}

// ✨ FACTORY FUNCTIONS PARA FACILITAR USO

/**
 * Cria um builder para componente de quiz
 */
export function createQuizQuestion(context?: BuilderContext): ComponentBuilder {
    return new ComponentBuilder('quiz-question', context);
}

/**
 * Cria um builder para captura de lead
 */
export function createLeadCapture(context?: BuilderContext): ComponentBuilder {
    return new ComponentBuilder('lead-capture', context);
}

/**
 * Cria um builder para seção hero
 */
export function createHero(context?: BuilderContext): ComponentBuilder {
    return new ComponentBuilder('hero', context);
}

/**
 * Cria um builder genérico
 */
export function createComponent(type: string, context?: BuilderContext): ComponentBuilder {
    return new ComponentBuilder(type, context);
}

/**
 * Cria um componente a partir de template
 */
export function fromTemplate(
    templateName: keyof typeof COMPONENT_TEMPLATES,
    context?: BuilderContext
): ComponentBuilder {
    const template = COMPONENT_TEMPLATES[templateName];
    return new ComponentBuilder(template.type, context).fromTemplate(templateName);
}

// ✨ VALIDADOR STANDALONE

/**
 * Valida um componente já existente
 */
export function validateComponent(component: ComponentConfig): ValidationResult {
    const builder = new ComponentBuilder(component.type)
        .withProperties(component.properties || {})
        .withContent(component.content || {});

    return builder.validate();
}

export default ComponentBuilder;

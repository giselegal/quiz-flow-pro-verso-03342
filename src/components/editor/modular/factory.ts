/**
 * 🏭 FACTORY DE COMPONENTES MODULARES
 * 
 * Sistema para criar, duplicar e gerenciar componentes modulares.
 * Centraliza a lógica de criação e fornece defaults inteligentes.
 */

import {
    ComponentType,
    ModularComponent,
    ComponentFactory,
    StepTemplate,
    ModularStep
} from './types';

// 🎲 Gerador de IDs únicos
const generateId = (): string => {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 🏗️ Defaults para cada tipo de componente
const getDefaultComponentProps = (type: ComponentType, order: number = 0): ModularComponent => {
    const baseProps = {
        id: generateId(),
        order,
        visible: true,
        className: '',
        style: {}
    };

    switch (type) {
        case 'title':
            return {
                ...baseProps,
                type: 'title',
                text: 'Título da Seção',
                level: 'h2',
                align: 'center',
                color: '#1f2937',
                fontSize: '24px'
            };

        case 'text':
            return {
                ...baseProps,
                type: 'text',
                content: 'Texto explicativo que pode conter <strong>formatação HTML</strong>.',
                align: 'left',
                color: '#374151',
                fontSize: '16px',
                fontWeight: 'normal'
            };

        case 'input':
            return {
                ...baseProps,
                type: 'input',
                label: 'Campo de entrada',
                placeholder: 'Digite sua resposta aqui...',
                inputType: 'text',
                required: false,
                maxLength: 255
            };

        case 'button':
            return {
                ...baseProps,
                type: 'button',
                text: 'Continuar',
                variant: 'primary',
                size: 'md',
                disabled: false,
                action: 'next'
            };

        case 'image':
            return {
                ...baseProps,
                type: 'image',
                src: 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Imagem',
                alt: 'Imagem ilustrativa',
                width: 400,
                height: 200,
                fit: 'cover',
                rounded: true,
                shadow: true
            };

        case 'options':
            return {
                ...baseProps,
                type: 'options',
                title: 'Escolha uma opção:',
                options: [
                    { id: generateId(), text: 'Opção 1', value: 'opt1', selected: false },
                    { id: generateId(), text: 'Opção 2', value: 'opt2', selected: false },
                    { id: generateId(), text: 'Opção 3', value: 'opt3', selected: false }
                ],
                selectionType: 'single',
                minSelections: 1,
                maxSelections: 1,
                layout: 'list',
                columnsPerRow: 1
            };

        case 'spacer':
            return {
                ...baseProps,
                type: 'spacer',
                height: 32,
                backgroundColor: 'transparent'
            };

        case 'divider':
            return {
                ...baseProps,
                type: 'divider',
                thickness: 1,
                color: '#e5e7eb',
                borderStyle: 'solid',
                margin: 16
            };

        case 'help-text':
            return {
                ...baseProps,
                type: 'help-text',
                content: 'Texto de ajuda para orientar o usuário.',
                variant: 'info',
                icon: 'ℹ️',
                collapsible: false
            };

        case 'progress-bar':
            return {
                ...baseProps,
                type: 'progress-bar',
                currentStep: 1,
                totalSteps: 5,
                showPercentage: true,
                showStepText: true,
                color: '#3b82f6',
                backgroundColor: '#e5e7eb'
            };

        default:
            throw new Error(`Tipo de componente não suportado: ${type}`);
    }
};

// 🏭 Implementação da Factory
export const componentFactory: ComponentFactory = {
    create: (type: ComponentType, overrides?: Partial<ModularComponent>): ModularComponent => {
        const defaultComponent = getDefaultComponentProps(type, overrides?.order || 0);
        return { ...defaultComponent, ...overrides } as ModularComponent;
    },

    duplicate: (component: ModularComponent): ModularComponent => {
        const duplicated = { ...component };
        duplicated.id = generateId();
        duplicated.order = component.order + 1;

        // Para componentes com opções, duplicar as opções também
        if (duplicated.type === 'options') {
            duplicated.options = duplicated.options.map(option => ({
                ...option,
                id: generateId()
            }));
        }

        return duplicated;
    },

    getDefaultProps: (type: ComponentType): ModularComponent => {
        return getDefaultComponentProps(type);
    }
};

// 📋 Templates pré-definidos de etapas
export const STEP_TEMPLATES: StepTemplate[] = [
    {
        id: 'intro-template',
        name: 'Introdução',
        description: 'Etapa de boas-vindas com título, texto e botão',
        type: 'intro',
        preview: '🚀',
        components: [
            {
                type: 'title',
                text: 'Bem-vindo ao Quiz!',
                level: 'h1',
                align: 'center',
                color: '#1f2937',
                fontSize: '32px',
                order: 0,
                visible: true
            },
            {
                type: 'text',
                content: 'Descubra mais sobre você respondendo algumas perguntas simples.',
                align: 'center',
                color: '#6b7280',
                fontSize: '18px',
                fontWeight: 'normal',
                order: 1,
                visible: true
            },
            {
                type: 'spacer',
                height: 32,
                backgroundColor: 'transparent',
                order: 2,
                visible: true
            },
            {
                type: 'button',
                text: 'Começar Quiz',
                variant: 'primary',
                size: 'lg',
                disabled: false,
                action: 'next',
                order: 3,
                visible: true
            }
        ]
    },

    {
        id: 'question-template',
        name: 'Pergunta',
        description: 'Etapa de pergunta com título, opções e botão',
        type: 'question',
        preview: '❓',
        components: [
            {
                type: 'progress-bar',
                currentStep: 1,
                totalSteps: 5,
                showPercentage: true,
                showStepText: true,
                color: '#3b82f6',
                backgroundColor: '#e5e7eb',
                order: 0,
                visible: true
            },
            {
                type: 'spacer',
                height: 24,
                backgroundColor: 'transparent',
                order: 1,
                visible: true
            },
            {
                type: 'title',
                text: 'Qual é a sua preferência?',
                level: 'h2',
                align: 'center',
                color: '#1f2937',
                fontSize: '24px',
                order: 2,
                visible: true
            },
            {
                type: 'options',
                title: 'Escolha uma opção:',
                options: [
                    { id: 'temp_1', text: 'Opção A', value: 'a', selected: false },
                    { id: 'temp_2', text: 'Opção B', value: 'b', selected: false },
                    { id: 'temp_3', text: 'Opção C', value: 'c', selected: false }
                ],
                selectionType: 'single',
                minSelections: 1,
                maxSelections: 1,
                layout: 'list',
                columnsPerRow: 1,
                order: 3,
                visible: true
            },
            {
                type: 'spacer',
                height: 24,
                backgroundColor: 'transparent',
                order: 4,
                visible: true
            },
            {
                type: 'button',
                text: 'Próxima',
                variant: 'primary',
                size: 'md',
                disabled: false,
                action: 'next',
                order: 5,
                visible: true
            }
        ]
    },

    {
        id: 'input-template',
        name: 'Captura de Dados',
        description: 'Etapa para capturar informações do usuário',
        type: 'question',
        preview: '📝',
        components: [
            {
                type: 'title',
                text: 'Conte-nos mais sobre você',
                level: 'h2',
                align: 'center',
                color: '#1f2937',
                fontSize: '24px',
                order: 0,
                visible: true
            },
            {
                type: 'text',
                content: 'Suas informações nos ajudam a personalizar a experiência.',
                align: 'center',
                color: '#6b7280',
                fontSize: '16px',
                fontWeight: 'normal',
                order: 1,
                visible: true
            },
            {
                type: 'spacer',
                height: 24,
                backgroundColor: 'transparent',
                order: 2,
                visible: true
            },
            {
                type: 'input',
                label: 'Seu nome',
                placeholder: 'Digite seu nome completo',
                inputType: 'text',
                required: true,
                maxLength: 100,
                order: 3,
                visible: true
            },
            {
                type: 'spacer',
                height: 16,
                backgroundColor: 'transparent',
                order: 4,
                visible: true
            },
            {
                type: 'input',
                label: 'Seu email',
                placeholder: 'seu@email.com',
                inputType: 'email',
                required: true,
                maxLength: 255,
                order: 5,
                visible: true
            },
            {
                type: 'spacer',
                height: 24,
                backgroundColor: 'transparent',
                order: 6,
                visible: true
            },
            {
                type: 'button',
                text: 'Continuar',
                variant: 'primary',
                size: 'md',
                disabled: false,
                action: 'next',
                order: 7,
                visible: true
            }
        ]
    },

    {
        id: 'result-template',
        name: 'Resultado',
        description: 'Etapa de resultado com título, imagem e texto',
        type: 'result',
        preview: '🎉',
        components: [
            {
                type: 'title',
                text: 'Parabéns! Seu resultado está pronto',
                level: 'h1',
                align: 'center',
                color: '#059669',
                fontSize: '28px',
                order: 0,
                visible: true
            },
            {
                type: 'spacer',
                height: 24,
                backgroundColor: 'transparent',
                order: 1,
                visible: true
            },
            {
                type: 'image',
                src: 'https://via.placeholder.com/300x200/059669/ffffff?text=Resultado',
                alt: 'Imagem do resultado',
                width: 300,
                height: 200,
                fit: 'cover',
                rounded: true,
                shadow: true,
                order: 2,
                visible: true
            },
            {
                type: 'spacer',
                height: 24,
                backgroundColor: 'transparent',
                order: 3,
                visible: true
            },
            {
                type: 'text',
                content: 'Baseado nas suas respostas, identificamos seu perfil. Continue lendo para descobrir mais detalhes sobre você.',
                align: 'center',
                color: '#374151',
                fontSize: '18px',
                fontWeight: 'normal',
                order: 4,
                visible: true
            },
            {
                type: 'spacer',
                height: 32,
                backgroundColor: 'transparent',
                order: 5,
                visible: true
            },
            {
                type: 'button',
                text: 'Ver Detalhes',
                variant: 'primary',
                size: 'lg',
                disabled: false,
                action: 'next',
                order: 6,
                visible: true
            }
        ]
    }
];

// 🚀 Factory de etapas completas
export const createStepFromTemplate = (templateId: string, overrides?: Partial<ModularStep>): ModularStep => {
    const template = STEP_TEMPLATES.find(t => t.id === templateId);

    if (!template) {
        throw new Error(`Template não encontrado: ${templateId}`);
    }

    const components = template.components.map((comp, index) => ({
        ...comp,
        id: generateId(),
        order: index
    })) as ModularComponent[];

    return {
        id: generateId(),
        name: template.name,
        type: template.type,
        components,
        settings: {
            backgroundColor: '#ffffff',
            padding: 24,
            minHeight: 400,
            maxWidth: 600,
            centerContent: true
        },
        validation: {
            required: template.type === 'question'
        },
        ...overrides
    };
};

// 🔧 Utilitários adicionais
export const reorderComponents = (components: ModularComponent[], fromIndex: number, toIndex: number): ModularComponent[] => {
    const result = [...components];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    // Reordenar os índices
    return result.map((comp, index) => ({
        ...comp,
        order: index
    }));
};

export const validateStep = (step: ModularStep): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar se tem pelo menos um componente
    if (step.components.length === 0) {
        errors.push('A etapa deve ter pelo menos um componente');
    }

    // Validar componentes obrigatórios para perguntas
    if (step.type === 'question') {
        const hasOptions = step.components.some(c => c.type === 'options');
        const hasButton = step.components.some(c => c.type === 'button');

        if (!hasOptions) {
            errors.push('Perguntas devem ter pelo menos um componente de opções');
        }

        if (!hasButton) {
            errors.push('Perguntas devem ter um botão para continuar');
        }
    }

    // Validar componentes duplicados (mesmo ID)
    const ids = step.components.map(c => c.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
        errors.push(`IDs duplicados encontrados: ${duplicateIds.join(', ')}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
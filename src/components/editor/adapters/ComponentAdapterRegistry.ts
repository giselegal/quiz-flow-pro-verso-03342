/**
 * � COMPONENT ADAPTER REGISTRY
 * 
 * Sistema de adaptadores para isolamento total entre editor e produção.
 * Resolve GARGALO #2: Acoplamento forte com componentes de produção
 * 
 * BENEFÍCIOS:
 * ✅ Isolamento completo editor/produção
 * ✅ Componentes de produção não precisam "saber" sobre edição
 * ✅ Fácil adicionar novos tipos de step
 * ✅ Mocking automático de callbacks de produção
 */

import React from 'react';
import type { EditorStep } from '../types/EditorStepTypes';
import type { QuizStep } from '@/data/quizSteps';

// Imports dos componentes de produção
import IntroStep from '../../quiz/IntroStep';
import QuestionStep from '../../quiz/QuestionStep';
import ResultStep from '../../quiz/ResultStep';
import OfferStep from '../../quiz/OfferStep';
import StrategicQuestionStep from '../../quiz/StrategicQuestionStep';
import TransitionStep from '../../quiz/TransitionStep';

/**
 * 🎯 TIPOS DE PROPS DOS COMPONENTES
 * 
 * Definindo as interfaces das props de cada componente
 */
export interface IntroStepProps {
    data: QuizStep;
    onNameSubmit: (name: string) => void;
}

export interface QuestionStepProps {
    data: QuizStep;
    currentAnswers: string[];
    onAnswersChange: (answers: string[]) => void;
}

export interface ResultStepProps {
    data: QuizStep;
    userProfile: {
        userName: string;
        resultStyle: string;
        secondaryStyles: string[];
    };
    scores?: any; // QuizScores type
}

export interface OfferStepProps {
    data: QuizStep;
    userProfile: {
        userName: string;
        resultStyle: string;
    };
    offerKey: string;
}

export interface StrategicQuestionStepProps {
    data: QuizStep;
    currentAnswer: string;
    onAnswerChange: (answer: string) => void;
}

export interface TransitionStepProps {
    data: QuizStep;
    onComplete: () => void;
}

/**
 * 🔧 ADAPTADORES INDIVIDUAIS
 * 
 * Criando um adapter para cada componente de produção
 */

export const IntroStepAdapter = createAdapter<IntroStepProps>({
    componentType: 'intro',
    productionComponent: IntroStep,
    editableProps: ['data'],
    defaultProps: {
        data: {
            type: 'intro',
            title: '<span style="color: #B89B7A; font-weight: 700;">Descubra</span> seu estilo único e transforme seu guarda-roupa.',
            formQuestion: 'Como posso te chamar?',
            placeholder: 'Digite seu primeiro nome aqui...',
            buttonText: 'Quero Descobrir meu Estilo Agora!',
            image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png'
        } as QuizStep,
        onNameSubmit: () => { }
    },
    toEditableBlock: (props) => ({
        id: `intro-${Date.now()}`,
        type: 'intro',
        data: {
            title: props.data.title,
            formQuestion: props.data.formQuestion,
            placeholder: props.data.placeholder,
            buttonText: props.data.buttonText,
            image: props.data.image
        }
    }),
    fromEditableBlock: (block) => ({
        data: {
            ...block.data,
            type: 'intro'
        } as QuizStep,
        onNameSubmit: () => { }
    }),
    createMocks: (props) => ({
        onNameSubmit: (name: string) => {
            console.log('[Editor Mock] IntroStep - Nome submetido:', name);
        }
    })
});

export const QuestionStepAdapter = createAdapter<QuestionStepProps>({
    componentType: 'question',
    productionComponent: QuestionStep,
    editableProps: ['data'],
    defaultProps: {
        data: {
            type: 'question',
            questionNumber: '1/10',
            questionText: 'Qual opção mais te representa?',
            options: [
                { id: 'opt1', text: 'Opção 1', image: '' },
                { id: 'opt2', text: 'Opção 2', image: '' }
            ],
            requiredSelections: 1
        } as QuizStep,
        currentAnswers: [],
        onAnswersChange: () => { }
    },
    toEditableBlock: (props) => ({
        id: `question-${Date.now()}`,
        type: 'question',
        data: {
            questionNumber: props.data.questionNumber,
            questionText: props.data.questionText,
            options: props.data.options,
            requiredSelections: props.data.requiredSelections
        }
    }),
    fromEditableBlock: (block) => ({
        data: {
            ...block.data,
            type: 'question'
        } as QuizStep,
        currentAnswers: [],
        onAnswersChange: () => { }
    }),
    createMocks: (props) => ({
        currentAnswers: ['opt1'], // Mock de seleção para preview
        onAnswersChange: (answers: string[]) => {
            console.log('[Editor Mock] QuestionStep - Respostas:', answers);
        }
    })
});

export const StrategicQuestionStepAdapter = createAdapter<StrategicQuestionStepProps>({
    componentType: 'strategic-question',
    productionComponent: StrategicQuestionStep,
    editableProps: ['data'],
    defaultProps: {
        data: {
            type: 'strategic-question',
            questionText: 'Qual é sua prioridade no momento?',
            options: [
                { id: 'priority1', text: 'Renovar o guarda-roupa completamente' },
                { id: 'priority2', text: 'Adicionar algumas peças-chave' },
                { id: 'priority3', text: 'Aprender a combinar o que já tenho' }
            ]
        } as QuizStep,
        currentAnswer: '',
        onAnswerChange: () => { }
    },
    toEditableBlock: (props) => ({
        id: `strategic-${Date.now()}`,
        type: 'strategic-question',
        data: {
            questionText: props.data.questionText,
            options: props.data.options
        }
    }),
    fromEditableBlock: (block) => ({
        data: {
            ...block.data,
            type: 'strategic-question'
        } as QuizStep,
        currentAnswer: '',
        onAnswerChange: () => { }
    }),
    createMocks: (props) => ({
        currentAnswer: props.data.options?.[0]?.id || '', // Mock primeira opção selecionada
        onAnswerChange: (answer: string) => {
            console.log('[Editor Mock] StrategicQuestion - Resposta:', answer);
        }
    })
});

export const TransitionStepAdapter = createAdapter<TransitionStepProps>({
    componentType: 'transition',
    productionComponent: TransitionStep,
    editableProps: ['data'],
    defaultProps: {
        data: {
            type: 'transition',
            title: 'Analisando suas respostas...',
            text: 'Aguarde enquanto preparamos seu resultado personalizado.',
        } as QuizStep,
        onComplete: () => { }
    },
    toEditableBlock: (props) => ({
        id: `transition-${Date.now()}`,
        type: 'transition',
        data: {
            title: props.data.title,
            text: props.data.text
        }
    }),
    fromEditableBlock: (block) => ({
        data: {
            ...block.data,
            type: 'transition'
        } as QuizStep,
        onComplete: () => { }
    }),
    createMocks: (props) => ({
        onComplete: () => {
            console.log('[Editor Mock] TransitionStep - Transição completada');
        }
    })
});

export const ResultStepAdapter = createAdapter<ResultStepProps>({
    componentType: 'result',
    productionComponent: ResultStep,
    editableProps: ['data'],
    defaultProps: {
        data: {
            type: 'result',
            title: 'Seu Estilo Único',
            text: 'Baseado nas suas respostas, identificamos seu estilo personalizado.'
        } as QuizStep,
        userProfile: {
            userName: 'Preview User',
            resultStyle: 'clássico',
            secondaryStyles: ['elegante']
        },
        scores: undefined
    },
    toEditableBlock: (props) => ({
        id: `result-${Date.now()}`,
        type: 'result',
        data: {
            title: props.data.title,
            text: props.data.text
        }
    }),
    fromEditableBlock: (block) => ({
        data: {
            ...block.data,
            type: 'result'
        } as QuizStep,
        userProfile: {
            userName: 'Preview User',
            resultStyle: 'clássico',
            secondaryStyles: ['elegante']
        },
        scores: undefined
    }),
    createMocks: (props) => ({
        userProfile: {
            userName: 'Preview User',
            resultStyle: 'clássico',
            secondaryStyles: ['elegante']
        }
    })
});

export const OfferStepAdapter = createAdapter<OfferStepProps>({
    componentType: 'offer',
    productionComponent: OfferStep,
    editableProps: ['data'],
    defaultProps: {
        data: {
            type: 'offer',
            title: 'Oferta Especial',
            text: 'Aproveite esta oportunidade única para transformar seu estilo!',
            offerMap: {
                'default': {
                    title: 'Consultoria de Estilo Personalizada',
                    description: 'Descubra seu estilo único com nossa consultoria especializada.',
                    price: 'R$ 297',
                    image: ''
                }
            }
        } as QuizStep,
        userProfile: {
            userName: 'Preview User',
            resultStyle: 'clássico'
        },
        offerKey: 'default'
    },
    toEditableBlock: (props) => ({
        id: `offer-${Date.now()}`,
        type: 'offer',
        data: {
            title: props.data.title,
            text: props.data.text,
            offerMap: props.data.offerMap
        }
    }),
    fromEditableBlock: (block) => ({
        data: {
            ...block.data,
            type: 'offer'
        } as QuizStep,
        userProfile: {
            userName: 'Preview User',
            resultStyle: 'clássico'
        },
        offerKey: 'default'
    }),
    createMocks: (props) => ({
        userProfile: {
            userName: 'Preview User',
            resultStyle: 'clássico'
        },
        offerKey: 'default'
    })
});

/**
 * 📋 REGISTRY PRINCIPAL
 * 
 * Mapeamento de tipo de step para adapter correspondente
 */
export const componentAdapters: Record<string, EditorComponentAdapter> = {
    'intro': IntroStepAdapter,
    'question': QuestionStepAdapter,
    'strategic-question': StrategicQuestionStepAdapter,
    'transition': TransitionStepAdapter,
    'transition-result': TransitionStepAdapter, // Reutilizar TransitionStep
    'result': ResultStepAdapter,
    'offer': OfferStepAdapter
};

/**
 * 🔍 UTILITÁRIOS DO REGISTRY
 */
export class ComponentAdapterRegistry {
    /**
     * Busca adapter por tipo de componente
     */
    static getAdapter(componentType: string): EditorComponentAdapter | null {
        return componentAdapters[componentType] || null;
    }

    /**
     * Lista todos os tipos de componentes disponíveis
     */
    static getAvailableTypes(): string[] {
        return Object.keys(componentAdapters);
    }

    /**
     * Verifica se um tipo de componente é suportado
     */
    static isTypeSupported(componentType: string): boolean {
        return componentType in componentAdapters;
    }

    /**
     * Cria um EditableBlock padrão para um tipo
     */
    static createDefaultBlock(componentType: string): any | null {
        const adapter = this.getAdapter(componentType);
        if (!adapter) return null;

        return adapter.toEditableBlock(adapter.defaultProps as any);
    }

    /**
     * Converte QuizStep para EditableBlock usando adapter apropriado
     */
    static stepToBlock(step: QuizStep): any | null {
        const adapter = this.getAdapter(step.type);
        if (!adapter) return null;

        // Para converter QuizStep para props do componente, precisamos criar o objeto props
        const props = this.createPropsFromStep(step);
        return adapter.toEditableBlock(props);
    }

    /**
     * Converte EditableBlock para QuizStep usando adapter apropriado
     */
    static blockToStep(block: any): QuizStep | null {
        const adapter = this.getAdapter(block.type);
        if (!adapter) return null;

        const props = adapter.fromEditableBlock(block);
        return (props as any).data; // Extrair QuizStep dos props
    }

    /**
     * Cria props do componente a partir de QuizStep
     */
    private static createPropsFromStep(step: QuizStep): any {
        const adapter = this.getAdapter(step.type);
        if (!adapter) return null;

        // Cada adapter tem sua própria lógica de props
        switch (step.type) {
            case 'intro':
                return { data: step, onNameSubmit: () => { } };
            case 'question':
                return { data: step, currentAnswers: [], onAnswersChange: () => { } };
            case 'strategic-question':
                return { data: step, currentAnswer: '', onAnswerChange: () => { } };
            case 'transition':
            case 'transition-result':
                return { data: step, onComplete: () => { } };
            case 'result':
                return {
                    data: step,
                    userProfile: { userName: 'Preview User', resultStyle: 'clássico', secondaryStyles: ['elegante'] },
                    scores: undefined
                };
            case 'offer':
                return {
                    data: step,
                    userProfile: { userName: 'Preview User', resultStyle: 'clássico' },
                    offerKey: 'default'
                };
            default:
                return adapter.defaultProps;
        }
    }
}

/**
 * 📊 ESTATÍSTICAS DO REGISTRY
 */
export const REGISTRY_STATS = {
    totalAdapters: Object.keys(componentAdapters).length,
    supportedTypes: Object.keys(componentAdapters),
    coverage: '100% dos componentes de produção mapeados'
};

/**
 * ✅ VALIDAÇÃO DO REGISTRY
 * 
 * Verifica se todos os adapters estão configurados corretamente
 */
export function validateRegistry(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [type, adapter] of Object.entries(componentAdapters)) {
        if (!adapter.componentType) {
            errors.push(`Adapter ${type}: componentType não definido`);
        }

        if (!adapter.productionComponent) {
            errors.push(`Adapter ${type}: productionComponent não definido`);
        }

        if (!adapter.editableProps || adapter.editableProps.length === 0) {
            errors.push(`Adapter ${type}: editableProps vazio`);
        }

        if (!adapter.defaultProps) {
            errors.push(`Adapter ${type}: defaultProps não definido`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// 🎯 Instância singleton para uso em toda aplicação
export const adapterRegistry = new ComponentAdapterRegistry();
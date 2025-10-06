/**
 * 🎯 ADAPTADORES DE PRODUÇÃO PARA STEPREGISTRY - FASE 3
 * 
 * Este arquivo converte os componentes de produção existentes
 * (IntroStep, QuestionStep, etc.) para o formato do StepRegistry.
 * 
 * MIGRAÇÃO GRADUAL:
 * 1. Manter componentes originais funcionando
 * 2. Criar adaptadores compatíveis com BaseStepProps
 * 3. Registrar no stepRegistry
 * 4. Permitir uso via UnifiedStepRenderer
 */

import React from 'react';
import { BaseStepProps, StepComponent, StepConfig } from './StepTypes';
import { stepRegistry } from './StepRegistry';
import { normalizeStepId } from '@/utils/quizStepIds';

// Import dos componentes de produção originais
import OriginalIntroStep from '@/components/quiz/IntroStep';
import OriginalQuestionStep from '@/components/quiz/QuestionStep';
import OriginalStrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import OriginalTransitionStep from '@/components/quiz/TransitionStep';
import OriginalResultStep from '@/components/quiz/ResultStep';
import OriginalOfferStep from '@/components/quiz/OfferStep';

/**
 * 🏠 INTRO STEP ADAPTER
 * Converte IntroStep original para BaseStepProps
 */
const IntroStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        stepNumber,
        isActive,
        isEditable,
        onNext,
        onPrevious,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    // Converter props do StepRegistry para props originais do IntroStep
    const adaptedProps = {
        data: {
            id: stepId,
            type: 'intro' as const,
            title: data.title || 'Descobra seu Estilo Pessoal',
            descriptionTop: data.descriptionTop || 'Um quiz personalizado para identificar seu estilo único.',
            descriptionBottom: data.descriptionBottom || 'Responda com sinceridade para ter um resultado preciso.',
            nameInputLabel: data.nameInputLabel || 'Como você gostaria de ser chamada?',
            nameInputPlaceholder: data.nameInputPlaceholder || 'Digite seu nome',
            buttonText: data.buttonText || 'Começar Quiz',
            showLogo: data.showLogo !== false,
            logoUrl: data.logoUrl || '',
            imageIntro: data.imageIntro || '',
            ...data
        },
        onNameSubmit: (name: string) => {
            const trimmed = (name || '').trim();
            if (!trimmed) {
                console.warn('[quiz:intro] Tentativa de avançar sem nome válido');
                return;
            }
            console.log('[quiz:intro] userName capturado =', trimmed, '→ avançando');
            onSave({ userName: trimmed });
            onNext();
        },
        // Props adicionais do UnifiedStepRenderer
        ...otherProps
    };

    return <OriginalIntroStep {...adaptedProps} />;
};

/**
 * ❓ QUESTION STEP ADAPTER
 * Converte QuestionStep original para BaseStepProps
 */
const QuestionStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        stepNumber,
        isActive,
        isEditable,
        onNext,
        onPrevious,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    const adaptedProps = {
        data: {
            id: stepId,
            type: 'question' as const,
            number: stepNumber,
            title: data.title || `Pergunta ${stepNumber}`,
            question: data.question || 'Qual destas opções mais combina com você?',
            options: data.options || [
                { id: 'option-1', text: 'Opção 1', style: 'classic' },
                { id: 'option-2', text: 'Opção 2', style: 'casual' },
                { id: 'option-3', text: 'Opção 3', style: 'elegante' }
            ],
            imageQuestion: data.imageQuestion || '',
            ...data
        },
        currentAnswers: quizState?.answers?.[stepId] || [],
        onAnswersChange: (answers: string[]) => {
            onSave({ [stepId]: answers });
            // Auto-advance após resposta
            if (answers.length > 0) {
                setTimeout(onNext, 500);
            }
        },
        ...otherProps
    };

    return <OriginalQuestionStep {...adaptedProps} />;
};

/**
 * 🎯 STRATEGIC QUESTION STEP ADAPTER
 * Converte StrategicQuestionStep para BaseStepProps
 */
const StrategicQuestionStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        stepNumber,
        isActive,
        isEditable,
        onNext,
        onPrevious,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    const adaptedProps = {
        data: {
            id: stepId,
            type: 'strategic-question' as const, // Unificar com restante do sistema
            number: stepNumber,
            title: data.title || `Pergunta Estratégica ${stepNumber}`,
            question: data.question || 'Qual seu principal objetivo?',
            options: data.options || [
                { id: 'strategic-1', text: 'Objetivo 1', offerKey: 'offer1' },
                { id: 'strategic-2', text: 'Objetivo 2', offerKey: 'offer2' }
            ],
            ...data
        },
        onAnswerChange: (answerId: string) => {
            // Persistir resposta estratégica
            onSave({ [stepId]: answerId });
            // Avançar imediatamente
            onNext();
        },
        ...otherProps
    };

    return <OriginalStrategicQuestionStep {...adaptedProps} />;
};

/**
 * ⏳ TRANSITION STEP ADAPTER
 */
const TransitionStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        stepNumber,
        isActive,
        isEditable,
        onNext,
        onPrevious,
        onSave,
        data = {},
        ...otherProps
    } = props as any;

    const adaptedProps = {
        data: {
            id: stepId,
            type: 'transition' as const,
            title: data.title || 'Analisando suas respostas...',
            message: data.message || 'Estamos processando suas preferências para criar um resultado personalizado.',
            duration: data.duration || 3000,
            ...data
        },
        onComplete: onNext,
        ...otherProps
    };

    return <OriginalTransitionStep {...adaptedProps} />;
};

/**
 * 🏆 RESULT STEP ADAPTER
 */
const ResultStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        stepNumber,
        isActive,
        isEditable,
        onNext,
        onPrevious,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    const adaptedProps = {
        data: {
            id: stepId,
            type: 'result' as const,
            title: data.title || 'Seu Resultado',
            ...data
        },
        userName: quizState?.userName || 'Usuário',
        resultStyle: quizState?.resultStyle || 'classic',
        secondaryStyles: quizState?.secondaryStyles || [],
        onNext,
        onCalculate: () => {
            // Lógica de cálculo pode ser chamada via onSave
            onSave({ resultCalculated: true });
        },
        ...otherProps
    };

    return <OriginalResultStep {...adaptedProps} />;
};

/**
 * 🎁 OFFER STEP ADAPTER
 */
const OfferStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        stepNumber,
        isActive,
        isEditable,
        onNext,
        onPrevious,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    const adaptedProps = {
        data: {
            id: stepId,
            type: 'offer' as const,
            title: data.title || 'Oferta Especial',
            ...data
        },
        userName: quizState?.userName || 'Usuário',
        resultStyle: quizState?.resultStyle || 'classic',
        strategicAnswers: quizState?.strategicAnswers || {},
        ...otherProps
    };

    return <OriginalOfferStep {...adaptedProps} />;
};

/**
 * 🏭 CONFIGURAÇÕES DOS STEPS PARA REGISTRO
 */
const createStepConfig = (overrides: Partial<StepConfig> = {}): StepConfig => ({
    allowNavigation: {
        next: true,
        previous: true,
        ...overrides.allowNavigation
    },
    validation: {
        required: false,
        rules: [],
        ...overrides.validation
    },
    metadata: {
        category: 'question',
        ...overrides.metadata
    },
    ...overrides
});/**
 * 📋 DEFINIÇÕES DOS STEPS DE PRODUÇÃO
 */
export const PRODUCTION_STEPS: StepComponent[] = [
    {
        id: 'step-01',
        name: 'Introdução',
        component: IntroStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: true, previous: false },
            validation: { required: true, rules: [{ field: 'userName', required: true }] },
            metadata: { category: 'intro' }
        })
    },

    // Steps de perguntas (2-11)
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `step-${String(i + 2).padStart(2, '0')}`,
        name: `Pergunta ${i + 1}`,
        component: QuestionStepAdapter,
        config: createStepConfig({
            metadata: { category: 'question' }
        })
    })),

    // Pergunta estratégica (12)
    {
        id: 'step-12',
        name: 'Pergunta Estratégica',
        component: StrategicQuestionStepAdapter,
        config: createStepConfig({
            validation: { required: true },
            metadata: { category: 'strategic' }
        })
    },

    // Transição (13)
    {
        id: 'step-13',
        name: 'Processando Resultado',
        component: TransitionStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: false }, // Auto-navigation
            metadata: { category: 'transition' }
        })
    },

    // Resultado (14)
    {
        id: 'step-14',
        name: 'Seu Resultado',
        component: ResultStepAdapter,
        config: createStepConfig({
            metadata: { category: 'result' }
        })
    },

    // Oferta (15)
    {
        id: 'step-15',
        name: 'Oferta Personalizada',
        component: OfferStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: true }, // Final step
            metadata: { category: 'offer' }
        })
    }
];

/**
 * 🚀 FUNÇÃO DE REGISTRO DOS STEPS DE PRODUÇÃO
 * 
 * Registra todos os steps de produção no stepRegistry
 */
export const registerProductionSteps = () => {
    console.log('🎯 Registrando steps de produção no StepRegistry...');

    PRODUCTION_STEPS.forEach(step => {
        stepRegistry.register(step);
        // Alias legacy (sem zero) para compatibilidade temporária
        const legacyId = step.id.replace('step-0', 'step-');
        if (legacyId !== step.id) {
            try {
                stepRegistry.register({ ...step, id: legacyId });
                if (process.env.NODE_ENV === 'development') {
                    console.log(`↪️ Alias registrado: ${legacyId} → ${step.id}`);
                }
            } catch (e) {
                // Ignorar se já existir
            }
        }
    });

    console.log(`✅ ${PRODUCTION_STEPS.length} steps de produção registrados com sucesso!`);

    if (process.env.NODE_ENV === 'development') {
        stepRegistry.debug();
    }
};

// Auto-registro em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    registerProductionSteps();
}

export {
    IntroStepAdapter,
    QuestionStepAdapter,
    StrategicQuestionStepAdapter,
    TransitionStepAdapter,
    ResultStepAdapter,
    OfferStepAdapter
};
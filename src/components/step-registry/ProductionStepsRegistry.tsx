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

    // Usar os campos reais vindos de quizSteps (questionText, questionNumber, requiredSelections)
    const requiredSelections = Number(data.requiredSelections) || 1;
    const adaptedProps = {
        data: {
            id: stepId,
            type: 'question' as const,
            questionText: data.questionText,
            questionNumber: data.questionNumber,
            options: data.options || [],
            requiredSelections,
            ...data
        },
        currentAnswers: quizState?.answers?.[stepId] || quizState?.answers?.[stepId.replace('step-0', 'step-')] || [],
        onAnswersChange: (answers: string[]) => {
            onSave({ [stepId]: answers });
            if (answers.length === requiredSelections) {
                setTimeout(() => onNext(), 350);
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

    // Priorizar questionText real vindo de QUIZ_STEPS (data.questionText)
    const questionText = (data as any).questionText || (data as any).question || (data as any).title || 'Qual seu principal objetivo?';
    const adaptedProps = {
        data: {
            id: stepId,
            type: 'strategic-question' as const,
            questionText,
            options: data.options || [],
            ...data
        },
        currentAnswer: quizState?.answers?.[stepId]?.[0] || quizState?.answers?.[stepId.replace('step-0', 'step-')]?.[0] || '',
        onAnswerChange: (answerId: string) => {
            onSave({ [stepId]: [answerId] });
        },
        ...otherProps
    };

    // Wrapper para injetar botão de avanço manual após seleção
    return (
        <div className="flex flex-col gap-6">
            <OriginalStrategicQuestionStep {...adaptedProps} />
            <div className="flex justify-center">
                <button
                    disabled={!quizState?.answers?.[stepId]}
                    onClick={() => onNext()}
                    className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md ${quizState?.answers?.[stepId]
                        ? 'bg-[#deac6d] text-white hover:brightness-105'
                        : 'bg-[#e6ddd4] text-[#8a7663] cursor-not-allowed opacity-60'
                        }`}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
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
            type: data.type === 'transition-result' ? 'transition-result' : 'transition',
            title: data.title || 'Analisando suas respostas...',
            text: data.text,
            message: data.message || 'Estamos processando suas preferências para criar um resultado personalizado.',
            duration: data.duration || 3000,
            showContinueButton: data.showContinueButton,
            continueButtonText: data.continueButtonText || 'Continuar',
            ...data
        },
        onComplete: onNext,
        ...otherProps
    };

    return (
        <div className="flex flex-col items-center">
            <OriginalTransitionStep {...adaptedProps} />
            {adaptedProps.data.showContinueButton && (
                <button
                    onClick={() => onNext?.()}
                    className="mt-6 px-8 py-3 rounded-full bg-[#deac6d] text-white font-semibold shadow hover:brightness-110 transition-colors"
                >
                    {adaptedProps.data.continueButtonText}
                </button>
            )}
        </div>
    );
};

/**
 * 🏆 RESULT STEP ADAPTER
 * ✨ INTEGRADO COM StyleResultCard (Fase 6.6)
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

    // Importar StyleResultCard dinamicamente para evitar dependência circular
    const StyleResultCard = React.lazy(() =>
        import('@/components/editor/quiz/components/StyleResultCard').then(m => ({
            default: m.StyleResultCard
        }))
    );

    // Props para o novo componente
    const cardProps = {
        resultStyle: quizState?.resultStyle || 'classico',
        userName: quizState?.userName || 'Usuário',
        secondaryStyles: quizState?.secondaryStyles || [],
        scores: quizState?.scores,
        mode: 'result' as const,
        onNext,
        className: 'w-full'
    };

    return (
        <React.Suspense fallback={<div className="flex items-center justify-center p-12">Carregando resultado...</div>}>
            <StyleResultCard {...cardProps} />
        </React.Suspense>
    );
};

/**
 * 🎁 OFFER STEP ADAPTER
 * ✨ INTEGRADO COM OfferMap (Fase 6.6)
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

    // Importar OfferMap dinamicamente
    const OfferMap = React.lazy(() => 
        import('@/components/editor/quiz/components/OfferMap').then(m => ({ 
            default: m.OfferMap 
        }))
    );

    // Derivar offerKey da resposta estratégica da pergunta 18
    const strategicAnswers = quizState?.strategicAnswers || {};
    const answer = strategicAnswers['Qual desses resultados você mais gostaria de alcançar?'];
    
    // Mapear resposta para chave da oferta (OfferKey type)
    const answerToKey: Record<string, 'Montar looks com mais facilidade e confiança' | 'Usar o que já tenho e me sentir estilosa' | 'Comprar com mais consciência e sem culpa' | 'Ser admirada pela imagem que transmito'> = {
        'montar-looks-facilidade': 'Montar looks com mais facilidade e confiança',
        'usar-que-tenho': 'Usar o que já tenho e me sentir estilosa',
        'comprar-consciencia': 'Comprar com mais consciência e sem culpa',
        'ser-admirada': 'Ser admirada pela imagem que transmito'
    };
    const offerKey = answerToKey[answer] || 'Montar looks com mais facilidade e confiança' as const;    // Props para OfferMap
    const offerMapProps = {
        content: {
            offerMap: data.offerMap || {}
        },
        mode: 'preview' as const,
        userName: quizState?.userName || 'Usuário',
        selectedOfferKey: offerKey,
        onNext,
        className: 'w-full'
    };

    return (
        <React.Suspense fallback={<div className="flex items-center justify-center p-12">Carregando oferta...</div>}>
            <OfferMap {...offerMapProps} />
        </React.Suspense>
    );
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
    // Introdução (1)
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
    // Perguntas principais (2–11)
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `step-${String(i + 2).padStart(2, '0')}`,
        name: `Pergunta ${i + 1}`,
        component: QuestionStepAdapter,
        config: createStepConfig({ metadata: { category: 'question' } })
    })),
    // Transição pós-perguntas (12)
    {
        id: 'step-12',
        name: 'Transição Estratégica',
        component: TransitionStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: false },
            metadata: { category: 'transition' }
        })
    },
    // Perguntas estratégicas (13–18)
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `step-${String(i + 13).padStart(2, '0')}`,
        name: `Pergunta Estratégica ${i + 1}`,
        component: StrategicQuestionStepAdapter,
        config: createStepConfig({
            validation: { required: true },
            metadata: { category: 'strategic' }
        })
    })),
    // Transição para resultado (19)
    {
        id: 'step-19',
        name: 'Transição Resultado',
        component: TransitionStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: false },
            // Usamos 'transition' como categoria padrão; o componente identifica 'transition-result' pelo tipo real no data source original
            metadata: { category: 'transition' }
        })
    },
    // Resultado (20)
    {
        id: 'step-20',
        name: 'Seu Resultado',
        component: ResultStepAdapter,
        config: createStepConfig({ metadata: { category: 'result' } })
    },
    // Oferta (21)
    {
        id: 'step-21',
        name: 'Oferta Personalizada',
        component: OfferStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: true },
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
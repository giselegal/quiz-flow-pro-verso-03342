
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
// Debug helper será carregado sob demanda para evitar import estático duplicado
import { normalizeStepId } from '@/lib/utils/quizStepIds';

// Import dos componentes de produção originais
import OriginalIntroStep from '@/components/quiz/IntroStep';
import OriginalQuestionStep from '@/components/quiz/QuestionStep';
import OriginalStrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import OriginalTransitionStep from '@/components/quiz/TransitionStep';
import OriginalResultStep from '@/components/quiz/ResultStep';
import OriginalOfferStep from '@/components/quiz/OfferStep';
import { appLogger } from '@/lib/utils/appLogger';

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
            ...data,
        },
        onNameSubmit: (name: string) => {
            const trimmed = (name || '').trim();
            if (!trimmed) {
                appLogger.warn('[quiz:intro] Tentativa de avançar sem nome válido');
                return;
            }
            appLogger.info('[quiz:intro] userName capturado =', { data: [trimmed, '→ avançando'] });
            onSave({ userName: trimmed });
            onNext();
        },
        // Props adicionais do UnifiedStepRenderer
        ...otherProps,
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
        isEditable,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    // Carregar blocos do template v3 para este step
    const [templateBlocks, setTemplateBlocks] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { loadTemplate: loadTemplateFunc } = await import('@/templates/imports');
                const result = await loadTemplateFunc(stepId);
                // Preferir override de registry (result.step) quando disponível
                const stepData = (result as any)?.step || (result as any)?.template?.[stepId];

                let blocks: any[] = [];
                if (stepData?.blocks && Array.isArray(stepData.blocks)) {
                    blocks = stepData.blocks;
                } else if (stepData?.sections && Array.isArray(stepData.sections)) {
                    const { convertSectionsToBlocks } = await import('@/lib/utils/sectionToBlockConverter');
                    blocks = convertSectionsToBlocks(stepData.sections);
                }

                if (mounted) setTemplateBlocks(blocks);
            } catch (error) {
                appLogger.error('❌ [QuestionStepAdapter] Erro ao carregar template:', { data: [error] });
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [stepId]);

    const currentAnswers: string[] = quizState?.answers?.[stepId]
        || quizState?.answers?.[stepId.replace('step-0', 'step-')]
        || [];

    // ✅ CORREÇÃO: Usar BlockTypeRenderer diretamente (ModularQuestionStep foi deprecado)
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#deac6d]" />
                <span className="ml-3 text-[#5b4135]">Carregando pergunta...</span>
            </div>
        );
    }

    if (templateBlocks.length === 0) {
        return (
            <div className="p-8 text-center text-red-600">
                ⚠️ Nenhum bloco encontrado para {stepId}
            </div>
        );
    }

    // Importar BlockTypeRenderer dinamicamente
    const BlockTypeRenderer = React.lazy(() =>
        import('@/components/editor/quiz/renderers/BlockTypeRenderer').then(m => ({ default: m.BlockTypeRenderer }))
    );

    return (
        <div className="question-step-container">
            <React.Suspense fallback={<div className="flex justify-center p-4"><div className="animate-spin h-6 w-6 border-2 border-[#deac6d] border-t-transparent rounded-full" /></div>}>
                {templateBlocks.map((block: any) => (
                    <BlockTypeRenderer
                        key={block.id}
                        block={block}
                        sessionData={{
                            answers: currentAnswers,
                            userName: quizState?.userName,
                            [`answers_${stepId}`]: currentAnswers,
                        }}
                        onUpdate={(blockId: string, updates: any) => {
                            // Atualizar respostas quando usuário faz seleção
                            if (updates.answers) {
                                onSave({ [stepId]: updates.answers });
                            }
                            // Também aceitar formato alternativo
                            if (updates[`answers_${stepId}`]) {
                                onSave({ [stepId]: updates[`answers_${stepId}`] });
                            }
                        }}
                        mode={isEditable ? 'editable' : 'preview'}
                        {...otherProps}
                    />
                ))}
            </React.Suspense>
        </div>
    );
};

/**
 * 🎯 STRATEGIC QUESTION STEP ADAPTER
 * Converte StrategicQuestionStep para BaseStepProps
 */
const StrategicQuestionStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        isEditable,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    // Carregar blocos do template v3 para este step estratégico
    const [templateBlocks, setTemplateBlocks] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { loadTemplate: loadTemplateFunc } = await import('@/templates/imports');
                const result = await loadTemplateFunc(stepId);
                // Preferir override de registry (result.step) quando disponível
                const stepData = (result as any)?.step || (result as any)?.template?.[stepId];

                let blocks: any[] = [];
                if (stepData?.blocks && Array.isArray(stepData.blocks)) {
                    blocks = stepData.blocks;
                } else if (stepData?.sections && Array.isArray(stepData.sections)) {
                    const { convertSectionsToBlocks } = await import('@/lib/utils/sectionToBlockConverter');
                    blocks = convertSectionsToBlocks(stepData.sections);
                }

                if (mounted) setTemplateBlocks(blocks);
            } catch (error) {
                appLogger.error('❌ [StrategicQuestionStepAdapter] Erro ao carregar template:', { data: [error] });
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [stepId]);

    const currentAnswer: string = quizState?.answers?.[stepId]?.[0]
        || quizState?.answers?.[stepId.replace('step-0', 'step-')]?.[0]
        || '';

    // ✅ CORREÇÃO: Usar BlockTypeRenderer diretamente (ModularStrategicQuestionStep foi deprecado)
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#deac6d]" />
                <span className="ml-3 text-[#5b4135]">Carregando pergunta...</span>
            </div>
        );
    }

    if (templateBlocks.length === 0) {
        return (
            <div className="p-8 text-center text-red-600">
                ⚠️ Nenhum bloco encontrado para {stepId}
            </div>
        );
    }

    // Importar BlockTypeRenderer dinamicamente
    const BlockTypeRenderer = React.lazy(() =>
        import('@/components/editor/quiz/renderers/BlockTypeRenderer').then(m => ({ default: m.BlockTypeRenderer }))
    );

    const currentAnswerArray = currentAnswer ? [currentAnswer] : [];

    return (
        <div className="strategic-question-step-container">
            <React.Suspense fallback={<div className="flex justify-center p-4"><div className="animate-spin h-6 w-6 border-2 border-[#deac6d] border-t-transparent rounded-full" /></div>}>
                {templateBlocks.map((block: any) => (
                    <BlockTypeRenderer
                        key={block.id}
                        block={block}
                        sessionData={{
                            answers: currentAnswerArray,
                            userName: quizState?.userName,
                            [`answers_${stepId}`]: currentAnswerArray,
                        }}
                        onUpdate={(blockId: string, updates: any) => {
                            // Strategic questions aceitam apenas 1 resposta
                            if (updates.answers && Array.isArray(updates.answers)) {
                                onSave({ [stepId]: updates.answers });
                            }
                            if (updates[`answers_${stepId}`] && Array.isArray(updates[`answers_${stepId}`])) {
                                onSave({ [stepId]: updates[`answers_${stepId}`] });
                            }
                        }}
                        mode={isEditable ? 'editable' : 'preview'}
                        {...otherProps}
                    />
                ))}
            </React.Suspense>
        </div>
    );
};

/**
 * ⏳ TRANSITION STEP ADAPTER - ATUALIZADO COM BLOCOS ATÔMICOS
 * ✨ Usa blocos atômicos dos templates JSON
 */
const TransitionStepAdapter: React.FC<BaseStepProps> = (props) => {
    appLogger.info('🔧 [TransitionStepAdapter] Called for', { data: [props.stepId] });

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

    // ✅ Carregar template JSON para obter blocos
    const [template, setTemplate] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        appLogger.info('📦 [TransitionStepAdapter] Loading template for', { data: [stepId] });
        const loadTemplate = async () => {
            try {
                // Carregar template do step
                const { loadTemplate: loadTemplateFunc } = await import('@/templates/imports');
                const result = await loadTemplateFunc(stepId);
                // Preferir override de registry (result.step) quando disponível
                const stepData = (result as any)?.step || (result as any)?.template?.[stepId];

                appLogger.info('📄 [TransitionStepAdapter] Raw template data:', { data: [{
                                    stepId,
                                    hasStepData: !!stepData,
                                    hasSections: !!stepData?.sections,
                                    hasBlocks: !!stepData?.blocks,
                                    type: typeof stepData,
                                }] });

                // ✅ CORREÇÃO: Verificar se tem sections (template TS) ou blocks (template JSON)
                let blocks: any[] = [];

                if (stepData?.blocks && Array.isArray(stepData.blocks)) {
                    // Template JSON moderno com blocks
                    appLogger.info('✅ [TransitionStepAdapter] Using blocks from JSON template');
                    blocks = stepData.blocks;
                } else if (stepData?.sections && Array.isArray(stepData.sections)) {
                    // Template TS legado com sections - converter para blocks
                    appLogger.info('🔄 [TransitionStepAdapter] Converting sections to blocks');
                    const { convertSectionsToBlocks } = await import('@/lib/utils/sectionToBlockConverter');
                    blocks = convertSectionsToBlocks(stepData.sections);
                } else {
                    appLogger.warn('⚠️ [TransitionStepAdapter] No blocks or sections found');
                }

                appLogger.info('✅ [TransitionStepAdapter] Template loaded:', { data: [{ stepId, blocksCount: blocks.length }] });
                setTemplate({ blocks });
            } catch (error) {
                appLogger.error('❌ [TransitionStepAdapter] Erro ao carregar template:', { data: [error] });
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [stepId]);

    // Se template tem blocos, usar blocos atômicos
    if (template?.blocks && template.blocks.length > 0) {
        appLogger.info('🎨 [TransitionStepAdapter] Rendering atomic blocks:', { data: [template.blocks.length] });
        const UniversalBlockRenderer = require('@/components/editor/blocks/UniversalBlockRenderer').default;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf7]">
                <div className="max-w-2xl w-full px-4">
                    {template.blocks.map((block: any, index: number) => (
                        <UniversalBlockRenderer
                            key={block.id || `${block.type}-${index}`}
                            block={block}
                            isSelected={false}
                            mode="production"  // ✅ CORREÇÃO: Usar mode production para comportamento dinâmico completo
                            onUpdate={() => { }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Fallback: usar componente legado (compatibilidade)
    appLogger.info('⚠️ [TransitionStepAdapter] Using legacy fallback (no blocks)');
    if (loading) {
        return <div className="flex items-center justify-center p-12">Carregando...</div>;
    }

    // Se não há blocos, usar TransitionStep legado
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
            ...data,
        },
        onComplete: onNext,
        ...otherProps,
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
 * 🏆 RESULT STEP ADAPTER - ATUALIZADO COM BLOCOS ATÔMICOS
 * ✨ Usa ResultProvider + blocos atômicos dos templates JSON
 */
const ResultStepAdapter: React.FC<BaseStepProps> = (props) => {
    appLogger.info('🏆 [ResultStepAdapter] Called for', { data: [props.stepId] });

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

    // ✅ Carregar template JSON para obter blocos
    const [template, setTemplate] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        appLogger.info('📦 [ResultStepAdapter] Loading template for', { data: [stepId] });
        const loadTemplate = async () => {
            try {
                // Carregar template do step 20
                const { loadTemplate: loadTemplateFunc } = await import('@/templates/imports');
                const result = await loadTemplateFunc(stepId);
                // Preferir override de registry (result.step) quando disponível
                const stepData = (result as any)?.step || (result as any)?.template?.[stepId];

                appLogger.info('📄 [ResultStepAdapter] Raw template data:', { data: [{
                                    stepId,
                                    hasStepData: !!stepData,
                                    hasSections: !!stepData?.sections,
                                    hasBlocks: !!stepData?.blocks,
                                    type: typeof stepData,
                                }] });

                // ✅ CORREÇÃO: Verificar se tem sections (template TS) ou blocks (template JSON)
                let blocks: any[] = [];

                if (stepData?.blocks && Array.isArray(stepData.blocks)) {
                    // Template JSON moderno com blocks
                    appLogger.info('✅ [ResultStepAdapter] Using blocks from JSON template');
                    blocks = stepData.blocks;
                } else if (stepData?.sections && Array.isArray(stepData.sections)) {
                    // Template TS legado com sections - converter para blocks
                    appLogger.info('🔄 [ResultStepAdapter] Converting sections to blocks');
                    const { convertSectionsToBlocks } = await import('@/lib/utils/sectionToBlockConverter');
                    blocks = convertSectionsToBlocks(stepData.sections);
                } else {
                    appLogger.warn('⚠️ [ResultStepAdapter] No blocks or sections found');
                }

                appLogger.info('✅ [ResultStepAdapter] Template loaded:', { data: [{ stepId, blocksCount: blocks.length }] });
                setTemplate({ blocks });
            } catch (error) {
                appLogger.error('❌ [ResultStepAdapter] Erro ao carregar template:', { data: [error] });
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [stepId]);

    // Preparar userProfile para ResultProvider
    const userProfile = {
        userName: quizState?.userName || 'Usuário',
        resultStyle: quizState?.resultStyle || 'classico',
        secondaryStyles: quizState?.secondaryStyles || [],
    };

    // Se template tem blocos, usar blocos atômicos
    if (template?.blocks && template.blocks.length > 0) {
        const { ResultProvider } = require('@/contexts/ResultContext');
        const UniversalBlockRenderer = require('@/components/editor/blocks/UniversalBlockRenderer').default;

        return (
            <ResultProvider
                userProfile={userProfile}
                scores={quizState?.scores}
            >
                <div className="min-h-screen bg-[#fffaf7] relative overflow-hidden">
                    {/* Elementos decorativos */}
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#B89B7A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#a08966]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="container mx-auto px-3 sm:px-5 py-6 md:py-8 max-w-5xl relative z-10">
                        {template.blocks.map((block: any, index: number) => (
                            <UniversalBlockRenderer
                                key={block.id || `${block.type}-${index}`}
                                block={block}
                                isSelected={false}
                                mode="production"  // ✅ CORREÇÃO: Usar mode production para comportamento dinâmico completo
                                onUpdate={() => { }}
                            />
                        ))}
                    </div>
                </div>
            </ResultProvider>
        );
    }

    // Fallback: usar componente legado (compatibilidade)
    if (loading) {
        return <div className="flex items-center justify-center p-12">Carregando resultado...</div>;
    }

    // ⚠️ FALLBACK: Se não há blocos no template, mostrar mensagem
    // (StyleResultCard foi arquivado durante migração v3.1)
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="text-lg font-semibold">Resultado não disponível</div>
            <div className="text-sm text-muted-foreground">
                Nenhum bloco de resultado encontrado para este template
            </div>
        </div>
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

    // ⚠️ FALLBACK: OfferMap foi arquivado durante migração v3.1
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="text-lg font-semibold">Oferta não disponível</div>
            <div className="text-sm text-muted-foreground">
                Componente OfferMap foi arquivado durante migração
            </div>
        </div>
    );
};

/**
 * 🏭 CONFIGURAÇÕES DOS STEPS PARA REGISTRO
 */
const createStepConfig = (overrides: Partial<StepConfig> = {}): StepConfig => ({
    allowNavigation: {
        next: true,
        previous: true,
        ...overrides.allowNavigation,
    },
    validation: {
        required: false,
        rules: [],
        ...overrides.validation,
    },
    metadata: {
        category: 'question',
        ...overrides.metadata,
    },
    ...overrides,
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
            metadata: { category: 'intro' },
        }),
    },
    // Perguntas principais (2–11)
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `step-${String(i + 2).padStart(2, '0')}`,
        name: `Pergunta ${i + 1}`,
        component: QuestionStepAdapter,
        config: createStepConfig({ metadata: { category: 'question' } }),
    })),
    // Transição pós-perguntas (12)
    {
        id: 'step-12',
        name: 'Transição Estratégica',
        component: TransitionStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: false },
            metadata: { category: 'transition' },
        }),
    },
    // Perguntas estratégicas (13–18)
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `step-${String(i + 13).padStart(2, '0')}`,
        name: `Pergunta Estratégica ${i + 1}`,
        component: StrategicQuestionStepAdapter,
        config: createStepConfig({
            validation: { required: true },
            metadata: { category: 'strategic' },
        }),
    })),
    // Transição para resultado (19)
    {
        id: 'step-19',
        name: 'Transição Resultado',
        component: TransitionStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: false },
            // Tipo nos dados é 'transition-result'; categoria no registry permanece 'transition'
            metadata: { category: 'transition' },
        }),
    },
    // Resultado (20)
    {
        id: 'step-20',
        name: 'Seu Resultado',
        component: ResultStepAdapter,
        config: createStepConfig({ metadata: { category: 'result' } }),
    },
    // Oferta (21)
    {
        id: 'step-21',
        name: 'Oferta Personalizada',
        component: OfferStepAdapter,
        config: createStepConfig({
            allowNavigation: { next: false, previous: true },
            metadata: { category: 'offer' },
        }),
    },
];

/**
 * 🚀 FUNÇÃO DE REGISTRO DOS STEPS DE PRODUÇÃO
 * 
 * Registra todos os steps de produção no stepRegistry
 */
// Evita registros duplicados em ambientes onde esta função é chamada mais de uma vez
let __PRODUCTION_STEPS_ALREADY_REGISTERED = false;

export const registerProductionSteps = () => {
    if (__PRODUCTION_STEPS_ALREADY_REGISTERED) {
        if (process.env.NODE_ENV === 'development') {
            appLogger.info('ℹ️ registerProductionSteps() já executado — ignorando chamada duplicada');
        }
        return;
    }
    __PRODUCTION_STEPS_ALREADY_REGISTERED = true;

    appLogger.info('🎯 Registrando steps de produção no StepRegistry...');

    PRODUCTION_STEPS.forEach(step => {
        // Apenas registra IDs canônicos (step-XX); aliases serão aceitos via normalização no StepRegistry
        stepRegistry.register(step);
    });

    appLogger.info(`✅ ${PRODUCTION_STEPS.length} steps de produção registrados com sucesso!`);

    if (process.env.NODE_ENV === 'development') {
        // Tabela tradicional
        stepRegistry.debug();
        // Tabela completa (todas as peças)
        import('./StepDebug').then(m => m.printFullStepsDebug?.());
        // Tabela profunda com templates e blocos (async, pequeno atraso para estabilidade)
        setTimeout(() => {
            try {
                // import dinâmico para evitar pesar o bootstrap
                import('./StepDebug').then(m => m.printFullStepsDebugDeep?.());
            } catch { }
        }, 250);
    }
};

// Auto-registro em desenvolvimento (idempotente via guarda acima)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    registerProductionSteps();
}

export {
    IntroStepAdapter,
    QuestionStepAdapter,
    StrategicQuestionStepAdapter,
    TransitionStepAdapter,
    ResultStepAdapter,
    OfferStepAdapter,
};
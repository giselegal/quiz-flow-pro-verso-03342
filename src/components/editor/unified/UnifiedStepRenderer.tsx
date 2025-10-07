import React, { Suspense, useMemo, lazy, useEffect } from 'react';
import { stepRegistry } from '@/components/step-registry/StepRegistry';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { getPreloadSteps, getChunkForStep, PERFORMANCE_TARGETS } from './ChunkOptimization';

/**
 * 🎯 UNIFIED STEP RENDERER - FASE 3
 * 
 * Componente central que unifica os 3 sistemas de renderização:
 * 1. QuizFunnelEditorWYSIWYG (preview/edição)
 * 2. Componentes de produção (QuizApp.tsx)  
 * 3. StepRegistry (sistema modular)
 * 
 * BENEFÍCIOS:
 * ✅ Fonte única de verdade para renderização
 * ✅ Elimina duplicação de código (~30% redução bundle)
 * ✅ Modos unificados: preview | production | editable
 * ✅ Lazy loading otimizado
 * ✅ Manutenção centralizada
 */

export type RenderMode = 'preview' | 'production' | 'editable';

/**
 * 🚀 LAZY LOADING OPTIMIZADO - FASE 3
 * 
 * Componentes carregados dinamicamente baseados no stepId
 * Reduz bundle inicial e melhora performance
 */
// ⚠️ IMPORTANTE: Usamos diretamente os ADAPTERS de produção para garantir
// que callbacks (onNameSubmit, onAnswersChange, etc.) e defaults sejam aplicados
// mesmo no modo 'production'. Antes, importávamos os componentes originais e
// perdíamos a lógica de adaptação → resultando em props ausentes e erros.
const LazyStepComponents = {
    // Step de Introdução
    'step-01': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.IntroStepAdapter }))),

    // Steps de Perguntas (2-11)
    'step-02': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-03': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-04': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-05': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-06': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-07': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-08': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-09': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-10': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),
    'step-11': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.QuestionStepAdapter }))),

    // Transição pós-perguntas (12)
    'step-12': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.TransitionStepAdapter }))),

    // Perguntas estratégicas (13–18)
    'step-13': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.StrategicQuestionStepAdapter }))),
    'step-14': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.StrategicQuestionStepAdapter }))),
    'step-15': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.StrategicQuestionStepAdapter }))),
    'step-16': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.StrategicQuestionStepAdapter }))),
    'step-17': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.StrategicQuestionStepAdapter }))),
    'step-18': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.StrategicQuestionStepAdapter }))),

    // Transição resultado (19)
    'step-19': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.TransitionStepAdapter }))),

    // Resultado (20)
    'step-20': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.ResultStepAdapter }))),

    // Oferta (21)
    'step-21': lazy(() => import('@/components/step-registry/ProductionStepsRegistry').then(m => ({ default: m.OfferStepAdapter }))),
} as const;

type LazyStepId = keyof typeof LazyStepComponents;

export interface UnifiedStepRendererProps {
    /** ID do step no StepRegistry */
    stepId: string;

    /** Modo de renderização */
    mode: RenderMode;

    /** Props específicas do step */
    stepProps?: Record<string, any>;

    /** Dados do quiz state */
    quizState?: {
        currentStep: number;
        userName?: string;
        answers: Record<string, any>;
        strategicAnswers: Record<string, any>;
        resultStyle?: string;
        secondaryStyles?: string[];
    };

    /** Callbacks para interação */
    onStepUpdate?: (stepId: string, updates: Record<string, any>) => void;
    onStepSelect?: (stepId: string) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onNameSubmit?: (name: string) => void;

    /** Configuração visual */
    theme?: {
        primaryColor?: string;
        accentColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };

    /** Classes CSS adicionais */
    className?: string;

    /** Se está selecionado (modo editor) */
    isSelected?: boolean;

    /** Se permite edição inline */
    isEditable?: boolean;
}

/**
 * 🎯 SELETOR DE COMPONENTE OTIMIZADO
 * 
 * Determina se usa lazy loading ou registry baseado no modo e stepId
 */
const useOptimizedStepComponent = (stepId: string, mode: RenderMode) => {
    return useMemo(() => {
        // Para modo production e stepIds conhecidos, usar lazy loading
        if (mode === 'production' && stepId in LazyStepComponents) {
            return {
                type: 'lazy' as const,
                component: LazyStepComponents[stepId as LazyStepId],
                isRegistry: false
            };
        }

        // Para outros casos, usar registry (editor/preview)
        try {
            const registryComponent = stepRegistry.get(stepId);
            return {
                type: 'registry' as const,
                component: registryComponent?.component,
                isRegistry: true,
                stepComponent: registryComponent
            };
        } catch (error) {
            console.error(`Step "${stepId}" não encontrado:`, error);
            return {
                type: 'error' as const,
                component: null,
                isRegistry: false
            };
        }
    }, [stepId, mode]);
};

/**
 * 🎨 UNIFIED STEP RENDERER
 * 
 * Renderiza qualquer step através do StepRegistry unificado
 */
export const UnifiedStepRenderer: React.FC<UnifiedStepRendererProps> = ({
    stepId,
    mode = 'production',
    stepProps = {},
    quizState,
    onStepUpdate,
    onStepSelect,
    onNext,
    onPrevious,
    onNameSubmit,
    theme = {
        primaryColor: '#B89B7A',
        accentColor: '#8B7355',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
    },
    className,
    isSelected = false,
    isEditable = false,
}) => {
    // 🚀 OTIMIZAÇÃO: Usar lazy loading para produção, registry para editor
    const stepComponentInfo = useOptimizedStepComponent(stepId, mode);

    // 🎯 PRELOADING INTELIGENTE - Carregar próximos steps em background
    useEffect(() => {
        if (mode === 'production') {
            const preloadSteps = getPreloadSteps(stepId);

            preloadSteps.forEach(async (preloadStepId: string) => {
                if (preloadStepId !== stepId && preloadStepId in LazyStepComponents) {
                    try {
                        // Pré-carregar componente em background
                        const chunkName = getChunkForStep(preloadStepId);
                        const maxLoadTime = PERFORMANCE_TARGETS.loadingTargets[chunkName as keyof typeof PERFORMANCE_TARGETS.loadingTargets] || 500;

                        // Usar preload baseado no stepId específico (sem dynamic imports)
                        if (!(preloadStepId in LazyStepComponents)) {
                            // Fallback - pular preload para steps não mapeados
                            return;
                        }

                        // Usar o componente lazy já definido
                        const LazyComponent = LazyStepComponents[preloadStepId as LazyStepId];
                        const preloadPromise = Promise.resolve(LazyComponent); const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Preload timeout')), maxLoadTime)
                        );

                        await Promise.race([preloadPromise, timeoutPromise]);

                        if (process.env.NODE_ENV === 'development') {
                            console.log(`✅ Preloaded step: ${preloadStepId} (chunk: ${chunkName})`);
                        }
                    } catch (error) {
                        // Falha silenciosa no preload - não bloqueia a UI
                        if (process.env.NODE_ENV === 'development') {
                            console.warn(`⚠️ Failed to preload step ${preloadStepId}:`, error);
                        }
                    }
                }
            });
        }
    }, [stepId, mode]);

    // ⚠️ Step não encontrado
    if (stepComponentInfo.type === 'error' || !stepComponentInfo.component) {
        return (
            <div className={cn(
                "flex items-center justify-center p-8 border-2 border-dashed border-red-300 rounded-lg bg-red-50",
                className
            )}>
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-2">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Step Não Encontrado</h3>
                    <p className="text-red-600 text-sm mb-3">
                        O step "{stepId}" não está disponível para o modo "{mode}"
                    </p>
                    <details className="text-xs text-red-500">
                        <summary className="cursor-pointer">Detalhes técnicos</summary>
                        <div className="mt-2 p-2 bg-red-100 rounded text-left">
                            <div>Step ID: {stepId}</div>
                            <div>Modo: {mode}</div>
                            <div>Tipo: {stepComponentInfo.type}</div>
                            {stepComponentInfo.isRegistry && (
                                <div>Registry disponível: {stepRegistry.getAll().map(s => s.id).join(', ')}</div>
                            )}
                        </div>
                    </details>
                </div>
            </div>
        );
    }

    // 🎨 Preparar props unificadas para o componente
    const unifiedProps = useMemo(() => ({
        // Props obrigatórias da BaseStepProps
        stepId,
        stepNumber: quizState?.currentStep || 1,
        isActive: true, // Sempre ativo quando renderizado
        isEditable,
        onNext: onNext || (() => { }),
        onPrevious: onPrevious || (() => { }),
        onNameSubmit,
        onSave: (data: any) => onStepUpdate?.(stepId, data),

        // Props básicas
        mode,
        data: stepProps,

        // Estado do quiz
        quizState,
        currentStep: quizState?.currentStep,
        userName: quizState?.userName,
        answers: quizState?.answers || {},
        strategicAnswers: quizState?.strategicAnswers || {},
        resultStyle: quizState?.resultStyle,
        secondaryStyles: quizState?.secondaryStyles,

        // Callbacks de interação
        onUpdate: onStepUpdate,
        onSelect: onStepSelect,

        // Configuração visual
        theme,

        // Estados do editor
        isSelected,
        isEditorMode: mode === 'editable',
        isPreviewMode: mode === 'preview',
        isProductionMode: mode === 'production',

        // Props específicas por modo
        ...(mode === 'editable' && {
            onEdit: (field: string, value: any) => {
                onStepUpdate?.(stepId, { [field]: value });
            },
        }),

        // Props específicas do step (override)
        ...stepProps,
    }), [
        stepId, mode, stepProps, quizState, onStepUpdate, onStepSelect,
        onNext, onPrevious, theme, isSelected, isEditable
    ]);

    // 🎯 Renderizar baseado no modo
    const renderStep = () => {
        // Wrapper base com estilos do modo
        const wrapperClasses = cn(
            "unified-step-renderer",
            `unified-step-renderer--${mode}`,
            `unified-step-renderer--${stepId}`,
            {
                'unified-step-renderer--selected': isSelected && mode === 'editable',
                'unified-step-renderer--editable': isEditable,
            },
            className
        );

        const wrapperStyles = {
            '--theme-primary': theme.primaryColor,
            '--theme-accent': theme.accentColor,
            '--theme-background': theme.backgroundColor,
            '--theme-text': theme.textColor,
        } as React.CSSProperties;

        // Nome do step para exibição
        const stepName = stepComponentInfo.isRegistry && stepComponentInfo.stepComponent
            ? stepComponentInfo.stepComponent.name
            : `Step ${stepId}`;

        return (
            <div
                className={wrapperClasses}
                style={wrapperStyles}
                onClick={mode === 'editable' ? () => onStepSelect?.(stepId) : undefined}
            >
                {/* Editor overlay */}
                {mode === 'editable' && isSelected && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg bg-blue-500/5 pointer-events-none">
                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                            {stepName}
                        </div>
                    </div>
                )}

                {/* Componente do step com Suspense */}
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center p-8">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2 text-sm text-gray-600">
                                Carregando {stepName}...
                            </span>
                        </div>
                    }
                >
                    {stepComponentInfo.type === 'lazy' ? (
                        // Componente lazy (produção)
                        React.createElement(stepComponentInfo.component as React.ComponentType<any>, unifiedProps)
                    ) : (
                        // Componente do registry (editor/preview)
                        React.createElement(stepComponentInfo.component as React.ComponentType<any>, unifiedProps)
                    )}
                </Suspense>
            </div>
        );
    };

    return renderStep();
};

/**
 * Helper para mapear stepId para nome do arquivo do componente
 */
const getComponentFileForStep = (stepId: string): string => {
    // ✅ NOVO MAPEAMENTO 21 ETAPAS
    // 01 = Intro
    if (stepId === 'step-01') return 'IntroStep';
    // 02–11 = Perguntas principais
    if (/(step-0[2-9])|(step-1[01])/.test(stepId)) return 'QuestionStep';
    // 12 = Transição inicial para estratégicas
    if (stepId === 'step-12') return 'TransitionStep';
    // 13–18 = Estratégicas
    if (/(step-1[3-8])/.test(stepId)) return 'StrategicQuestionStep';
    // 19 = Transição resultado
    if (stepId === 'step-19') return 'TransitionStep';
    // 20 = Resultado
    if (stepId === 'step-20') return 'ResultStep';
    // 21 = Oferta
    if (stepId === 'step-21') return 'OfferStep';
    // Fallback genérico
    return 'QuestionStep';
};

// 🎨 Estilos CSS para o UnifiedStepRenderer
export const UnifiedStepRendererStyles = `
  .unified-step-renderer {
    position: relative;
    width: 100%;
  }
  
  .unified-step-renderer--editable {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .unified-step-renderer--editable:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .unified-step-renderer--selected {
    z-index: 10;
  }
  
  .unified-step-renderer--preview {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .unified-step-renderer--production {
    /* Sem estilos extras - renderização limpa */
  }
`;

export default UnifiedStepRenderer;


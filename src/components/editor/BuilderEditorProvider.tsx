import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { FunnelBuilder, createFunnelFromTemplate } from '@/core/builder';
import type { Block } from '@/types/editor';

/**
 * 🎯 BUILDER-POWERED EDITOR PROVIDER
 * 
 * Estratégia: Usar Builder System internamente mas manter
 * exatamente a mesma interface visual do OptimizedEditorProvider
 * 
 * VANTAGENS:
 * ✅ Zero mudança visual (layout 4 colunas mantido)
 * ✅ Builder System gerencia dados (robust + cálculos)
 * ✅ Compatibilidade 100% com componente atual
 * ✅ Funcionalidade de etapas garantida
 */

// Interfaces compatíveis com OptimizedEditorProvider
export interface BuilderEditorState {
    currentStep: number;
    selectedBlockId: string | null;
    stepBlocks: Record<string, Block[]>;
    stepValidation: Record<number, boolean>;
    isSupabaseEnabled: boolean;
    databaseMode: 'local' | 'supabase';
    isLoading: boolean;
    loadedSteps: Set<number>;
    lastLoadTime: Record<number, number>;
}

export interface BuilderEditorActions {
    setCurrentStep: (step: number) => void;
    setSelectedBlockId: (blockId: string | null) => void;
    ensureStepLoaded: (step: number) => Promise<void>;
    preloadAdjacentSteps: (currentStep: number) => Promise<void>;
    clearUnusedSteps: () => void;
    addBlock: (stepKey: string, block: Block) => Promise<void>;
    updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;
    removeBlock: (stepKey: string, blockId: string) => Promise<void>;
    setStepValid: (step: number, isValid: boolean) => void;
    exportJSON: () => string;
    importJSON: (json: string) => void;
}

export interface BuilderEditorContextValue {
    state: BuilderEditorState;
    actions: BuilderEditorActions;
}

const BuilderEditorContext = createContext<BuilderEditorContextValue | undefined>(undefined);

export const useBuilderEditor = () => {
    const context = useContext(BuilderEditorContext);
    if (!context) {
        throw new Error('useBuilderEditor must be used within BuilderEditorProvider');
    }
    return context;
};

// 🎯 GERAÇÃO DO FUNIL 21 ETAPAS COM BUILDER SYSTEM
const generateQuiz21StepsWithBuilder = (): Record<string, Block[]> => {
    console.log('🏗️ Generating 21-step quiz using Builder System...');

    try {
        // Criar funil completo usando Builder System
        const funil = createFunnelFromTemplate('product-quiz')
            .withDescription('Quiz de Estilo Pessoal - 21 Etapas')
            .withSettings({
                showProgress: true,
                saveProgress: true,
                allowBackward: true,
                requiredSteps: true
            })
            .withAnalytics({
                trackingEnabled: true,
                events: ['step_start', 'step_complete', 'quiz_complete', 'style_calculated'],
                goals: [
                    {
                        id: 'quiz_completion',
                        name: 'Quiz Completion Rate',
                        type: 'completion',
                        triggerCondition: { step: 21 }
                    },
                    {
                        id: 'lead_capture',
                        name: 'Email Capture Rate',
                        type: 'conversion',
                        triggerCondition: { step: 1, hasEmail: true }
                    }
                ]
            });

        // 🎯 STEP 1: Captura de Nome
        funil.addStep('Coleta de Nome')
            .addComponentFromTemplate('text-input')
            .withMetadata({
                stepType: 'data-collection',
                required: true,
                validation: { minLength: 2 }
            })
            .complete();

        // 🎯 STEPS 2-11: Questões Pontuadas (3 seleções obrigatórias)
        for (let i = 2; i <= 11; i++) {
            funil.addStep(`Questão ${i - 1}`)
                .addComponentFromTemplate('multiple-choice')
                .withMetadata({
                    stepType: 'scored-question',
                    questionNumber: i - 1,
                    required: true,
                    minSelections: 3,
                    maxSelections: 3,
                    scoring: true
                })
                .complete();
        }

        // 🎯 STEP 12: Transição para Questões Estratégicas
        funil.addStep('Transição Estratégica')
            .addComponentFromTemplate('hero-section')
            .withMetadata({
                stepType: 'transition',
                content: {
                    title: 'Agora vamos aprofundar...',
                    subtitle: 'Próximas perguntas sobre seu estilo pessoal'
                }
            })
            .complete();

        // 🎯 STEPS 13-18: Questões Estratégicas (1 seleção obrigatória)
        for (let i = 13; i <= 18; i++) {
            funil.addStep(`Questão Estratégica ${i - 12}`)
                .addComponentFromTemplate('multiple-choice')
                .withMetadata({
                    stepType: 'strategic-question',
                    questionNumber: i - 12,
                    required: true,
                    minSelections: 1,
                    maxSelections: 1,
                    scoring: false
                })
                .complete();
        }

        // 🎯 STEP 19: Transição para Resultado
        funil.addStep('Transição para Resultado')
            .addComponentFromTemplate('hero-section')
            .withMetadata({
                stepType: 'transition',
                content: {
                    title: 'Calculando seu resultado...',
                    subtitle: 'Em instantes você descobrirá seu estilo!'
                }
            })
            .complete();

        // 🎯 STEP 20: Página de Resultado com Cálculos
        funil.addStep('Resultado Personalizado')
            .addComponentFromTemplate('info-card')
            .withMetadata({
                stepType: 'result-page',
                calculations: {
                    primaryStyle: 'auto-calculated',
                    secondaryStyles: 'auto-calculated',
                    percentages: 'auto-calculated',
                    recommendations: 'auto-generated'
                }
            })
            .complete();

        // 🎯 STEP 21: Página de Oferta
        funil.addStep('Oferta Personalizada')
            .addComponentFromTemplate('hero-section')
            .withMetadata({
                stepType: 'offer-page',
                content: {
                    title: 'Oferta especial baseada no seu estilo',
                    cta: 'Aproveitaroferta personalizada'
                }
            })
            .complete();

        // Finalizar e otimizar o funil
        const funnelResult = funil
            .autoConnect() // Conecta automaticamente as etapas
            .optimize()    // Aplica otimizações automáticas
            .build();

        console.log('✅ Builder System generated funnel with', funnelResult.steps?.length || 0, 'steps');

        // 🔄 CONVERTER para formato compatível com editor atual
        const stepBlocks: Record<string, Block[]> = {};

        funnelResult.steps?.forEach((step: any, index: number) => {
            const stepKey = `step-${index + 1}`;

            // Converter componentes Builder para formato Block
            const blocks: Block[] = step.components?.map((component: any, blockIndex: number) => ({
                id: `${stepKey}-block-${blockIndex + 1}`,
                type: component.type || 'quiz-question',
                position: { x: 0, y: blockIndex * 100 },
                properties: {
                    ...component.properties,
                    stepNumber: index + 1,
                    blockIndex: blockIndex + 1,
                    builderGenerated: true
                },
                content: {
                    ...component.content,
                    title: step.name,
                    description: step.description || `Conteúdo da etapa ${index + 1}`
                },
                style: component.style || {},
                validation: component.validation || { isValid: true, errors: [], warnings: [] },
                metadata: {
                    ...component.metadata,
                    createdByBuilder: true,
                    builderVersion: '1.0',
                    stepType: step.metadata?.stepType || 'default',
                    generatedAt: new Date().toISOString()
                }
            })) || [];

            stepBlocks[stepKey] = blocks;
        });

        console.log('🔄 Converted to step blocks:', Object.keys(stepBlocks).length, 'steps');

        return stepBlocks;

    } catch (error) {
        console.error('❌ Error generating funnel with Builder System:', error);

        // Fallback: criar estrutura básica se Builder falhar
        const fallbackBlocks: Record<string, Block[]> = {};
        for (let i = 1; i <= 21; i++) {
            fallbackBlocks[`step-${i}`] = [{
                id: `step-${i}-block-1`,
                type: i === 1 ? 'text-input' : i <= 11 ? 'multiple-choice' : 'info-card',
                order: 1, // Add missing order property
                position: { x: 0, y: 0 },
                properties: {
                    stepNumber: i,
                    fallbackGenerated: true,
                    title: `Etapa ${i}`
                },
                content: {
                    question: `Conteúdo da etapa ${i}`,
                    description: 'Gerado automaticamente'
                },
                style: {},
                validation: { isValid: true, errors: [], warnings: [] },
                metadata: {
                    isFallback: true,
                    createdAt: new Date().toISOString()
                }
            }];
        }

        return fallbackBlocks;
    }
};

// 🎯 PROVIDER PRINCIPAL
export const BuilderEditorProvider: React.FC<{
    funnelId?: string;
    enableSupabase?: boolean;
    initial?: Partial<BuilderEditorState>;
    children: React.ReactNode;
}> = ({
    funnelId = 'builder-quiz-21-steps',
    enableSupabase = true,
    initial = {},
    children
}) => {
        // Estado compatível com OptimizedEditorProvider
        const [state, setState] = useState<BuilderEditorState>({
            currentStep: 1,
            selectedBlockId: null,
            stepBlocks: {},
            stepValidation: {},
            isSupabaseEnabled: enableSupabase,
            databaseMode: enableSupabase ? 'supabase' : 'local',
            isLoading: false,
            loadedSteps: new Set(),
            lastLoadTime: {},
            ...initial
        });

        const isInitialized = useRef(false);
        const funnelData = useRef<Record<string, Block[]> | null>(null);

        // 🚀 INICIALIZAÇÃO: Gerar funil com Builder na primeira carga
        useEffect(() => {
            if (!isInitialized.current) {
                console.log('🎯 Initializing BuilderEditorProvider with Builder System...');

                setState(prev => ({ ...prev, isLoading: true }));

                // Gerar funil usando Builder System
                setTimeout(() => {
                    try {
                        const generatedSteps = generateQuiz21StepsWithBuilder();
                        funnelData.current = generatedSteps;

                        setState(prev => ({
                            ...prev,
                            stepBlocks: generatedSteps,
                            loadedSteps: new Set(Array.from({ length: 21 }, (_, i) => i + 1)),
                            stepValidation: Object.fromEntries(
                                Array.from({ length: 21 }, (_, i) => [i + 1, true])
                            ),
                            isLoading: false
                        }));

                        console.log('✅ BuilderEditorProvider initialized successfully');

                    } catch (error) {
                        console.error('❌ Failed to initialize Builder System:', error);
                        setState(prev => ({ ...prev, isLoading: false }));
                    }
                }, 100);

                isInitialized.current = true;
            }
        }, []);

        // Actions compatíveis com OptimizedEditorProvider
        const actions: BuilderEditorActions = {
            setCurrentStep: useCallback((step: number) => {
                setState(prev => ({ ...prev, currentStep: step }));
            }, []),

            setSelectedBlockId: useCallback((blockId: string | null) => {
                setState(prev => ({ ...prev, selectedBlockId: blockId }));
            }, []),

            ensureStepLoaded: useCallback(async (step: number) => {
                // Com Builder System, todos os steps já estão carregados
                if (funnelData.current && !state.loadedSteps.has(step)) {
                    setState(prev => ({
                        ...prev,
                        loadedSteps: new Set([...prev.loadedSteps, step])
                    }));
                }
            }, [state.loadedSteps]),

            preloadAdjacentSteps: useCallback(async (currentStep: number) => {
                // Builder System já carrega tudo, mas simula comportamento original
                const adjacentSteps = [currentStep - 1, currentStep + 1].filter(s => s >= 1 && s <= 21);
                setState(prev => ({
                    ...prev,
                    loadedSteps: new Set([...prev.loadedSteps, ...adjacentSteps])
                }));
            }, []),

            clearUnusedSteps: useCallback(() => {
                // Com Builder System, mantém tudo carregado para performance
                console.log('🧠 Builder System: Keeping all steps loaded for optimal performance');
            }, []),

            addBlock: useCallback(async (stepKey: string, block: Block) => {
                setState(prev => ({
                    ...prev,
                    stepBlocks: {
                        ...prev.stepBlocks,
                        [stepKey]: [...(prev.stepBlocks[stepKey] || []), block]
                    }
                }));
            }, []),

            updateBlock: useCallback(async (stepKey: string, blockId: string, updates: Record<string, any>) => {
                setState(prev => ({
                    ...prev,
                    stepBlocks: {
                        ...prev.stepBlocks,
                        [stepKey]: prev.stepBlocks[stepKey]?.map(block =>
                            block.id === blockId ? { ...block, ...updates } : block
                        ) || []
                    }
                }));
            }, []),

            removeBlock: useCallback(async (stepKey: string, blockId: string) => {
                setState(prev => ({
                    ...prev,
                    stepBlocks: {
                        ...prev.stepBlocks,
                        [stepKey]: prev.stepBlocks[stepKey]?.filter(block => block.id !== blockId) || []
                    }
                }));
            }, []),

            setStepValid: useCallback((step: number, isValid: boolean) => {
                setState(prev => ({
                    ...prev,
                    stepValidation: {
                        ...prev.stepValidation,
                        [step]: isValid
                    }
                }));
            }, []),

            exportJSON: useCallback(() => {
                return JSON.stringify({
                    funnelId,
                    builderSystemGenerated: true,
                    stepBlocks: state.stepBlocks,
                    metadata: {
                        generatedAt: new Date().toISOString(),
                        builderVersion: '1.0',
                        totalSteps: 21
                    }
                }, null, 2);
            }, [state.stepBlocks, funnelId]),

            importJSON: useCallback((json: string) => {
                try {
                    const data = JSON.parse(json);
                    setState(prev => ({
                        ...prev,
                        stepBlocks: data.stepBlocks || {},
                        stepValidation: data.stepValidation || {}
                    }));
                } catch (error) {
                    console.error('❌ Error importing JSON:', error);
                }
            }, [])
        };

        const contextValue: BuilderEditorContextValue = {
            state,
            actions
        };

        // Debug info em desenvolvimento
        useEffect(() => {
            if (process.env.NODE_ENV === 'development') {
                console.log('🏗️ BuilderEditorProvider state:', {
                    currentStep: state.currentStep,
                    loadedSteps: Array.from(state.loadedSteps),
                    totalStepBlocks: Object.keys(state.stepBlocks).length,
                    isLoading: state.isLoading,
                    builderSystemActive: true
                });
            }
        }, [state.currentStep, state.loadedSteps.size, state.isLoading]);

        return (
            <BuilderEditorContext.Provider value={contextValue}>
                {children}
            </BuilderEditorContext.Provider>
        );
    };

// Export hook compatível com useOptimizedEditor
export const useOptimizedEditor = useBuilderEditor;

export default BuilderEditorProvider;
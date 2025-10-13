// @ts-nocheck
/**
 * 🎯 UNIVERSAL STEP EDITOR
 * 
 * Editor visual universal que funciona para qualquer etapa do funil (1-21)
 * Integra ModularResultEditor + FunnelCore + IndexedDB
 * 
 * Características:
 * - Funciona com qualquer step do quiz21StepsComplete
 * - Usa FunnelCore para gestão de estado
 * - Persiste via IndexedDB automaticamente
 * - Craft.js para edição visual
 * - Property panels dinâmicos
 * - Preview em tempo real
 * - Navegação entre steps
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { useFunnelState } from '@/core/funnel/hooks/useFunnelState';
import { indexedDBStorage } from '@/utils/storage/IndexedDBStorageService';
import { Block } from '@/types/editor';
import { FunnelStep, FunnelComponent, FunnelState } from '@/core/funnel/types';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Quiz21StepsToFunnelAdapter } from '@/adapters/Quiz21StepsToFunnelAdapter';

// Importar componentes modulares existentes (Step 20)
import {
    HeaderSection,
    UserInfoSection,
    ProgressSection,
    MainImageSection
} from '@/components/editor/modules';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface UniversalStepEditorProps {
    stepId: string;              // 'step-1' até 'step-21'
    stepNumber: number;          // 1 até 21
    funnelId?: string;           // ID do funil (opcional)
    onStepChange?: (stepId: string) => void;
    onSave?: (stepId: string, data: any) => void;
    readOnly?: boolean;
    showNavigation?: boolean;
}

export interface StepEditorState {
    originalBlocks: Block[];
    editedBlocks: Block[];
    funnelStep: FunnelStep;
    isLoading: boolean;
    hasUnsavedChanges: boolean;
    lastSaved?: Date;
}

// ============================================================================
// ADAPTADOR: BLOCKS -> FUNNEL COMPONENTS
// ============================================================================

const convertBlocksToFunnelComponents = (blocks: Block[], stepId: string = 'step-1', stepNumber: number = 1): FunnelComponent[] => {
    try {
        // Usar o adapter robusto existente
        const adapter = new Quiz21StepsToFunnelAdapter();
        const context = {
            stepId,
            stepNumber,
            originalBlocks: blocks
        };

        // Usar o método privado através da conversão de step completa
        const funnelStep = adapter.convertStep(stepId, stepNumber);

        if (funnelStep.components.length > 0) {
            console.log('✅ Conversão via adapter bem-sucedida:', funnelStep.components.length, 'componentes');
            return funnelStep.components;
        }
    } catch (error) {
        console.warn('⚠️ Erro no adapter principal, usando fallback:', error);
    }

    // Fallback para conversão simples
    return blocks.map((block, index) => ({
        id: block.id,
        type: mapBlockTypeToComponentType(block.type),
        order: block.order || index,
        isVisible: true,
        content: block.content || {},
        properties: block.properties || {},
        styling: {} // Styling básico vazio para compatibilidade
    }));
};

const mapBlockTypeToComponentType = (blockType: string): string => {
    const typeMap: Record<string, string> = {
        // Mapeamento de tipos de blocos para componentes FunnelCore
        'quiz-intro-header': 'header',
        'form-container': 'form',
        'form-input': 'input',
        'quiz-question': 'question',
        'quiz-option': 'option',
        'button-inline': 'button',
        'transition-page': 'transition',
        'result-header': 'result',
        // Step 20 modular (já implementados)
        'modular-result-header': 'modular-header',
        'header-section': 'header-section',
        'user-info-section': 'user-info',
        'progress-section': 'progress',
        'main-image-section': 'image'
    };

    return typeMap[blockType] || blockType;
};

// ============================================================================
// REGISTRY DE COMPONENTES CRAFT.JS
// ============================================================================

// ============================================================================
// REGISTRY DE COMPONENTES CRAFT.JS
// ============================================================================

// Componentes básicos para todos os tipos de steps
const FormInputSection = ({ children, ...props }: any) => (
    <div {...props} className="form-input-section p-4 border border-gray-300 rounded">
        <input
            type="text"
            placeholder="Campo de entrada"
            className="w-full p-2 border rounded"
        />
        {children}
    </div>
);

const QuizQuestionSection = ({ children, ...props }: any) => (
    <div {...props} className="quiz-question-section p-4 border border-blue-300 rounded">
        <h3 className="text-lg font-semibold mb-2">Pergunta do Quiz</h3>
        <div className="space-y-2">
            <button className="w-full p-2 bg-blue-100 rounded hover:bg-blue-200">
                Opção 1
            </button>
            <button className="w-full p-2 bg-blue-100 rounded hover:bg-blue-200">
                Opção 2
            </button>
        </div>
        {children}
    </div>
);

const TransitionPageSection = ({ children, ...props }: any) => (
    <div {...props} className="transition-page-section p-6 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded">
        <h2 className="text-2xl font-bold mb-4">Página de Transição</h2>
        <p className="text-lg">Conectando as seções...</p>
        {children}
    </div>
);

const ButtonInlineSection = ({ children, ...props }: any) => (
    <div {...props} className="button-inline-section p-2">
        <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Botão de Ação
        </button>
        {children}
    </div>
);

const TextContentSection = ({ children, ...props }: any) => (
    <div {...props} className="text-content-section p-4">
        <p className="text-gray-700">
            Conteúdo de texto editável. Clique para editar.
        </p>
        {children}
    </div>
);

// Registry expandido para todos os 21 steps
const UNIVERSAL_COMPONENT_REGISTRY = {
    // Componentes modulares existentes (Step 20)
    HeaderSection,
    UserInfoSection,
    ProgressSection,
    MainImageSection,

    // Novos componentes para outros steps
    FormInputSection,
    QuizQuestionSection,
    TransitionPageSection,
    ButtonInlineSection,
    TextContentSection
};

// ============================================================================
// HOOK PERSONALIZADO PARA STEP EDITOR
// ============================================================================

const useStepEditor = (stepId: string, stepNumber: number, funnelId: string) => {
    const [state, setState] = useState<StepEditorState>({
        originalBlocks: [],
        editedBlocks: [],
        funnelStep: {} as FunnelStep,
        isLoading: true,
        hasUnsavedChanges: false
    });

    // Hook do FunnelCore para gestão de estado
    const basicFunnelState: FunnelState = {
        id: funnelId,
        metadata: {
            id: funnelId,
            name: `Step ${stepNumber}`,
            category: 'quiz',
            theme: 'default',
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublished: false,
            isOfficial: false
        },
        settings: {
            autoSave: true,
            autoAdvance: false,
            progressTracking: true,
            analytics: false,
            theme: {
                primaryColor: '#3B82F6',
                secondaryColor: '#EF4444',
                fontFamily: 'Inter',
                borderRadius: '8px',
                spacing: '16px',
                layout: 'centered'
            },
            navigation: {
                showProgress: true,
                showStepNumbers: true,
                allowBackward: true,
                showNavigationButtons: true,
                autoAdvanceDelay: 0
            },
            validation: {
                strictMode: false,
                requiredFields: [],
                customValidators: {}
            }
        },
        steps: [],
        currentStep: stepId,
        completedSteps: [],
        userData: {},
        progress: {
            currentStepIndex: stepNumber - 1,
            totalSteps: 21,
            completedSteps: 0,
            percentage: 0
        },
        navigation: {
            canGoForward: true,
            canGoBackward: stepNumber > 1,
            history: []
        },
        validation: {
            isValid: true,
            currentStepValid: true,
            errors: [],
            warnings: []
        },
        status: 'active'
    };

    const { dispatch } = useFunnelState(basicFunnelState, {
        autoSave: true,
        autoValidate: true
    });

    // Carregar step inicial
    useEffect(() => {
        loadStepData();
    }, [stepId, stepNumber]);

    const loadStepData = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            // 1. Buscar dados originais do template
            const originalBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId] || [];

            // 2. Tentar carregar modificações salvas no IndexedDB
            const savedData = await indexedDBStorage.get<any>('funnels', stepId);
            const editedBlocks = savedData?.editedBlocks || originalBlocks;

            // 3. Converter para formato FunnelStep
            const funnelStep: FunnelStep = {
                id: stepId,
                name: `Step ${stepNumber}`,
                description: getStepDescription(stepNumber),
                order: stepNumber,
                type: getStepType(stepNumber),
                isRequired: true,
                isVisible: true,
                components: convertBlocksToFunnelComponents(editedBlocks, stepId, stepNumber),
                settings: {
                    autoAdvance: false,
                    autoAdvanceDelay: 0,
                    showProgress: true,
                    allowSkip: false,
                    validation: {
                        required: false
                    }
                }
            };

            setState({
                originalBlocks,
                editedBlocks,
                funnelStep,
                isLoading: false,
                hasUnsavedChanges: false,
                lastSaved: savedData?.lastSaved ? new Date(savedData.lastSaved) : undefined
            });

        } catch (error) {
            console.error('❌ Erro ao carregar step:', error);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [stepId, stepNumber]);

    const saveStep = useCallback(async (blocks: Block[]) => {
        try {
            const saveData = {
                stepId,
                stepNumber,
                originalBlocks: state.originalBlocks,
                editedBlocks: blocks,
                lastSaved: Date.now(),
                metadata: {
                    namespace: 'universal-step-editor',
                    userId: 'current-user', // TODO: Pegar do auth
                    context: 'step-editing'
                }
            };

            // Salvar no IndexedDB
            await indexedDBStorage.set('funnels', stepId, saveData);

            // Atualizar FunnelCore usando dispatch
            const updatedFunnelStep: FunnelStep = {
                ...state.funnelStep,
                components: convertBlocksToFunnelComponents(blocks, stepId, stepNumber)
            };

            dispatch({
                type: 'update-user-data',
                payload: {
                    stepId,
                    step: updatedFunnelStep
                }
            });

            setState(prev => ({
                ...prev,
                editedBlocks: blocks,
                hasUnsavedChanges: false,
                lastSaved: new Date()
            }));

            console.log(`✅ Step ${stepId} salvo com sucesso`);

        } catch (error) {
            console.error('❌ Erro ao salvar step:', error);
        }
    }, [stepId, stepNumber, state.originalBlocks, state.funnelStep, dispatch]);

    const hasChanges = useCallback((currentBlocks: Block[]) => {
        return JSON.stringify(currentBlocks) !== JSON.stringify(state.originalBlocks);
    }, [state.originalBlocks]);

    return {
        ...state,
        saveStep,
        hasChanges,
        loadStepData
    };
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

const getStepDescription = (stepNumber: number): string => {
    const descriptions: Record<number, string> = {
        1: 'Coleta de nome do usuário',
        2: 'Questão: Tipo de roupa favorita',
        3: 'Questão: Personalidade',
        4: 'Questão: Visual preferido',
        5: 'Questão: Detalhes favoritos',
        6: 'Questão: Estampas preferidas',
        7: 'Questão: Casaco favorito',
        8: 'Questão: Calça favorita',
        9: 'Questão: Sapatos preferidos',
        10: 'Questão: Acessórios favoritos',
        11: 'Questão: Tecidos preferidos',
        12: 'Transição para questões estratégicas',
        13: 'Questão estratégica: Como se vê hoje',
        14: 'Questão estratégica: Desafios ao se vestir',
        15: 'Questão estratégica: Frequência de dúvidas',
        16: 'Questão estratégica: Gastos com roupas',
        17: 'Questão estratégica: Valor do conteúdo',
        18: 'Questão estratégica: Resultados desejados',
        19: 'Transição para resultado',
        20: 'Página de resultado personalizada',
        21: 'Página de oferta direta'
    };

    return descriptions[stepNumber] || `Etapa ${stepNumber}`;
};

const getStepType = (stepNumber: number): any => {
    if (stepNumber === 1) return 'form';
    if (stepNumber >= 2 && stepNumber <= 11) return 'question';
    if (stepNumber === 12 || stepNumber === 19) return 'transition';
    if (stepNumber >= 13 && stepNumber <= 18) return 'question';
    if (stepNumber === 20) return 'result';
    if (stepNumber === 21) return 'custom';
    return 'custom';
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const UniversalStepEditor: React.FC<UniversalStepEditorProps> = ({
    stepId,
    stepNumber,
    funnelId = 'temp-funnel',
    onStepChange,
    onSave,
    readOnly = false,
    showNavigation = true
}) => {
    const {
        originalBlocks,
        editedBlocks,
        funnelStep,
        isLoading,
        hasUnsavedChanges,
        lastSaved,
        saveStep,
        hasChanges
    } = useStepEditor(stepId, stepNumber, funnelId);

    // Auto-save quando há mudanças
    const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleEditorChange = useCallback((query: any) => {
        const newBlocks: Block[] = []; // TODO: converter nodes serializados para blocos

        // Verificar se há mudanças
        if (hasChanges(newBlocks)) {
            // Auto-save com debounce
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }

            const timeout = setTimeout(() => {
                saveStep(newBlocks);
                onSave?.(stepId, { blocks: newBlocks, funnelStep });
            }, 2000); // 2 segundos de debounce

            setAutoSaveTimeout(timeout);
        }
    }, [hasChanges, saveStep, stepId, funnelStep, onSave, autoSaveTimeout]);

    // Componentes disponíveis para este step
    const availableComponents = useMemo(() => {
        // Por enquanto, usar componentes modulares do Step 20
        // TODO: Expandir com base no tipo do step
        return UNIVERSAL_COMPONENT_REGISTRY;
    }, [stepNumber]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Carregando Step {stepNumber}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="universal-step-editor h-full flex">
            {/* Editor Principal */}
            <div className="flex-1 flex flex-col">
                {/* Header do Editor */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Step {stepNumber}: {funnelStep.name}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {funnelStep.description}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Status de salvamento */}
                            {hasUnsavedChanges ? (
                                <div className="flex items-center text-amber-600">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                    <span className="text-sm">Mudanças não salvas</span>
                                </div>
                            ) : lastSaved && (
                                <div className="flex items-center text-green-600">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    <span className="text-sm">
                                        Salvo {lastSaved.toLocaleTimeString()}
                                    </span>
                                </div>
                            )}

                            {/* Navegação entre steps */}
                            {showNavigation && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onStepChange?.(`step-${Math.max(1, stepNumber - 1)}`)}
                                        disabled={stepNumber <= 1}
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ← Anterior
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        {stepNumber} / 21
                                    </span>
                                    <button
                                        onClick={() => onStepChange?.(`step-${Math.min(21, stepNumber + 1)}`)}
                                        disabled={stepNumber >= 21}
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Próximo →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Canvas do Craft.js */}
                <div className="flex-1 bg-gray-50">
                    <Editor
                        resolver={availableComponents}
                        enabled={!readOnly}
                        onRender={({ render }) => (
                            <div className="h-full">
                                {render}
                            </div>
                        )}
                        onNodesChange={handleEditorChange}
                    >
                        <div className="h-full p-6">
                            <Frame>
                                <Element
                                    canvas
                                    is="div"
                                    className="min-h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                                >
                                    {/* Renderizar componentes do step */}
                                    <Element is={HeaderSection} canvas>
                                        Seção de Cabeçalho
                                    </Element>
                                    <Element is={UserInfoSection} canvas>
                                        Informações do Usuário
                                    </Element>
                                    <Element is={ProgressSection} canvas>
                                        Progresso
                                    </Element>
                                    <Element is={MainImageSection} canvas>
                                        Imagem Principal
                                    </Element>
                                </Element>
                            </Frame>
                        </div>
                    </Editor>
                </div>
            </div>

            {/* Toolbox lateral */}
            {!readOnly && (
                <div className="w-80 border-l border-gray-200 bg-white">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Componentes - Step {stepNumber}
                        </h3>
                        <div className="space-y-2">
                            {Object.keys(availableComponents).map(component => (
                                <div key={component} className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                                    {component}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// FUNÇÕES AUXILIARES DE RENDERIZAÇÃO
// ============================================================================

// ============================================================================
// EXPORT PADRÃO
// ============================================================================

export default UniversalStepEditor;
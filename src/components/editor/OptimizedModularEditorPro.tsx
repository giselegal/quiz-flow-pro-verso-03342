import React, { useMemo } from 'react';
import { useOptimizedEditor } from '@/components/editor/OptimizedEditorProvider';

/**
 * 🔌 ADAPTER PARA MODULAR EDITOR PRO
 * 
 * Adapta o ModularEditorPro para usar o OptimizedEditorProvider
 * mantendo compatibilidade com a interface existente do useEditor()
 */

interface EditorContextValue {
    state: any;
    actions: any;
}

// Mock do hook useEditor para compatibilidade
const useEditor = (): EditorContextValue => {
    const { state, actions } = useOptimizedEditor();

    // Adaptar interface para compatibilidade com ModularEditorPro
    const adaptedState = useMemo(() => ({
        ...state,
        // Aliases para compatibilidade
        blocks: state.stepBlocks[`step-${state.currentStep}`] || [],
        isPreviewing: false,
        isGlobalStylesOpen: false
    }), [state]);

    const adaptedActions = useMemo(() => ({
        ...actions,
        // Aliases e wrappers para compatibilidade
        blockActions: {
            setSelectedBlockId: actions.setSelectedBlockId,
            deleteBlock: (blockId: string) => {
                const stepKey = `step-${state.currentStep}`;
                return actions.removeBlock(stepKey, blockId);
            },
            updateBlock: (blockId: string, updates: any) => {
                const stepKey = `step-${state.currentStep}`;
                return actions.updateBlock(stepKey, blockId, updates);
            },
            addBlock: (block: any) => {
                const stepKey = `step-${state.currentStep}`;
                return actions.addBlock(stepKey, block);
            }
        },
        uiState: {
            isPreviewing: false,
            setIsPreviewing: () => { },
            viewportSize: 'desktop'
        }
    }), [actions, state.currentStep]);

    return {
        state: adaptedState,
        actions: adaptedActions
    };
};

/**
 * ModularEditorPro adaptado para usar OptimizedEditorProvider
 */
const OptimizedModularEditorPro: React.FC<{ className?: string }> = ({ className }) => {
    const { state, actions } = useOptimizedEditor();

    if (process.env.NODE_ENV === 'development') {
        console.log('🔌 OptimizedModularEditorPro rendered:', {
            currentStep: state.currentStep,
            loadedSteps: Array.from(state.loadedSteps),
            totalStepBlocks: Object.keys(state.stepBlocks).length,
            isLoading: state.isLoading
        });
    }

    // Garantir que o step atual está carregado
    React.useEffect(() => {
        actions.ensureStepLoaded(state.currentStep);
    }, [state.currentStep, actions]);

    return (
        <div className={className}>
            {/* Renderização simplificada que funciona com o OptimizedEditorProvider */}
            <div className="flex h-full">

                {/* Steps Sidebar */}
                <div className="w-64 border-r border-border bg-background">
                    <div className="p-4">
                        <h3 className="font-semibold mb-4">Etapas do Quiz</h3>
                        <div className="space-y-2">
                            {Array.from({ length: 21 }, (_, i) => i + 1).map(step => (
                                <button
                                    key={step}
                                    onClick={() => actions.setCurrentStep(step)}
                                    className={`w-full text-left p-2 rounded text-sm ${step === state.currentStep
                                        ? 'bg-primary text-primary-foreground'
                                        : state.loadedSteps.has(step)
                                            ? 'bg-secondary hover:bg-secondary/80'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    {step === state.currentStep && state.isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                            Etapa {step}
                                        </span>
                                    ) : (
                                        `Etapa ${step}`
                                    )}
                                    {state.loadedSteps.has(step) && (
                                        <div className="text-xs text-muted-foreground">
                                            {state.stepBlocks[`step-${step}`]?.length || 0} blocos
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex">

                    {/* Components Library */}
                    <div className="w-80 border-r border-border bg-background">
                        <div className="p-4">
                            <h3 className="font-semibold mb-4">Componentes</h3>
                            <div className="text-sm text-muted-foreground">
                                Biblioteca de componentes disponível aqui
                            </div>
                        </div>
                    </div>

                    {/* Editor Canvas */}
                    <div className="flex-1 p-6 bg-muted/30">
                        <div className="bg-background rounded-lg shadow-sm p-6 h-full">
                            <h2 className="text-lg font-semibold mb-4">
                                Etapa {state.currentStep} - Editor
                            </h2>

                            {state.isLoading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                                        Carregando etapa...
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {state.stepBlocks[`step-${state.currentStep}`]?.map((block) => (
                                        <div
                                            key={block.id}
                                            onClick={() => actions.setSelectedBlockId(block.id)}
                                            className={`p-4 border rounded-lg cursor-pointer ${state.selectedBlockId === block.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="font-medium">{block.type}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {block.content?.title || block.properties?.question || 'Sem título'}
                                            </div>
                                        </div>
                                    )) || (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <div className="text-lg mb-2">📝</div>
                                                <div>Nenhum bloco nesta etapa</div>
                                                <div className="text-xs mt-1">
                                                    Use a biblioteca de componentes para adicionar conteúdo
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Properties Panel */}
                    <div className="w-80 border-l border-border bg-background">
                        <div className="p-4">
                            <h3 className="font-semibold mb-4">Propriedades</h3>
                            {state.selectedBlockId ? (
                                <div className="space-y-4">
                                    <div className="text-sm">
                                        <div className="font-medium">Bloco Selecionado:</div>
                                        <div className="text-muted-foreground">{state.selectedBlockId}</div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Painel de propriedades será renderizado aqui
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Selecione um bloco para editar suas propriedades
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Debug Info (development only) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 text-xs">
                    <div className="font-semibold mb-1">Debug Info</div>
                    <div>Step: {state.currentStep}/21</div>
                    <div>Loaded: {Array.from(state.loadedSteps).join(', ')}</div>
                    <div>Loading: {state.isLoading ? 'Yes' : 'No'}</div>
                    <div>Selected: {state.selectedBlockId || 'None'}</div>
                </div>
            )}
        </div>
    );
};

export { OptimizedModularEditorPro, useEditor };
export default OptimizedModularEditorPro;
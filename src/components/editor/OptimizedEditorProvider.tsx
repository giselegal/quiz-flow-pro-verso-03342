/**
 * 🎯 OPTIMIZED EDITOR PROVIDER - FASE 4
 * 
 * EditorProvider simplificado e otimizado:
 * ✅ Sistema único de persistência (Supabase via UnifiedCRUD)
 * ✅ Histórico simplificado de undo/redo
 * ✅ Hook useEditor canônico consolidado
 * ✅ Redução de ~1553 para ~500 linhas
 * 
 * REMOVIDO:
 * ❌ DraftPersistence
 * ❌ useHistoryStateIndexedDB  
 * ❌ unifiedQuizStorage
 * ❌ Múltiplos sistemas de save/load
 * ❌ Lógica duplicada de mapeamento
 */

import * as React from 'react';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useUnifiedCRUD } from '@/contexts';
import { Block, BlockType } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

// ============================================================================
// SIMPLIFIED STATE & INTERFACES
// ============================================================================

export interface EditorState {
    /** Blocos organizados por step */
    stepBlocks: Record<string, Block[]>;
    /** Step atual selecionado */
    currentStep: number;
    /** Bloco selecionado para edição */
    selectedBlockId: string | null;
    /** Validação visual por step */
    stepValidation: Record<number, boolean>;
    /** Status de carregamento */
    isLoading: boolean;
    /** Modo de persistência (sempre supabase) */
    databaseMode: 'supabase';
}

export interface EditorActions {
    // Navigation
    setCurrentStep: (step: number) => void;
    setSelectedBlockId: (blockId: string | null) => void;
    setStepValid: (step: number, isValid: boolean) => void;

    // Block operations
    addBlock: (stepKey: string, block: Block) => Promise<void>;
    addBlockAtIndex: (stepKey: string, block: Block, index: number) => Promise<void>;
    removeBlock: (stepKey: string, blockId: string) => Promise<void>;
    reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => Promise<void>;
    updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;

    // Step management
    ensureStepLoaded: (step: number | string) => Promise<void>;
    loadDefaultTemplate: () => void;

    // Simplified history
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

    // Data management
    exportJSON: () => string;
    importJSON: (json: string) => void;
    saveToSupabase: () => Promise<void>;
}

export interface EditorContextValue {
    state: EditorState;
    actions: EditorActions;
}

// ============================================================================
// SIMPLIFIED HISTORY SYSTEM
// ============================================================================

interface HistoryEntry {
    state: EditorState;
    timestamp: number;
}

class SimpleHistory {
    private history: HistoryEntry[] = [];
    private currentIndex: number = -1;
    private maxSize: number = 20; // Reduzido de 30 para otimizar memória

    push(state: EditorState) {
        // Remove future history se estamos no meio
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Adiciona novo state
        this.history.push({
            state: JSON.parse(JSON.stringify(state)), // Deep clone
            timestamp: Date.now()
        });

        // Limita tamanho do histórico
        if (this.history.length > this.maxSize) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
    }

    undo(): EditorState | null {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.history[this.currentIndex].state;
        }
        return null;
    }

    redo(): EditorState | null {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            return this.history[this.currentIndex].state;
        }
        return null;
    }

    get canUndo(): boolean {
        return this.currentIndex > 0;
    }

    get canRedo(): boolean {
        return this.currentIndex < this.history.length - 1;
    }

    clear() {
        this.history = [];
        this.currentIndex = -1;
    }
}

// ============================================================================
// CONTEXT SETUP
// ============================================================================

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export const useEditor = (): EditorContextValue => {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error('🚨 useEditor must be used within an OptimizedEditorProvider');
    }

    return context;
};

// ============================================================================
// OPTIMIZED PROVIDER IMPLEMENTATION
// ============================================================================

export interface OptimizedEditorProviderProps {
    children: ReactNode;
    funnelId?: string;
    quizId?: string;
    storageKey?: string;
    initial?: Partial<EditorState>;
}

const getInitialState = (): EditorState => ({
    stepBlocks: {},
    currentStep: 1,
    selectedBlockId: null,
    stepValidation: {},
    isLoading: false,
    databaseMode: 'supabase'
});

export const OptimizedEditorProvider: React.FC<OptimizedEditorProviderProps> = ({
    children,
    funnelId,
    quizId,
    storageKey = 'optimized-editor',
    initial = {}
}) => {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================

    const [state, setState] = useState<EditorState>(() => ({
        ...getInitialState(),
        ...initial
    }));

    const [history] = useState(() => new SimpleHistory());
    const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

    // UnifiedCRUD integration
    const { currentFunnel, saveFunnel, isLoading, isSaving, error } = useUnifiedCRUD();

    // ============================================================================
    // HISTORY MANAGEMENT
    // ============================================================================

    const pushToHistory = useCallback((newState: EditorState) => {
        history.push(newState);
        setHistoryState({
            canUndo: history.canUndo,
            canRedo: history.canRedo
        });
    }, [history]);

    const undo = useCallback(() => {
        const previousState = history.undo();
        if (previousState) {
            setState(previousState);
            setHistoryState({
                canUndo: history.canUndo,
                canRedo: history.canRedo
            });
        }
    }, [history]);

    const redo = useCallback(() => {
        const nextState = history.redo();
        if (nextState) {
            setState(nextState);
            setHistoryState({
                canUndo: history.canUndo,
                canRedo: history.canRedo
            });
        }
    }, [history]);

    // ============================================================================
    // BLOCK OPERATIONS
    // ============================================================================

    const updateStateWithHistory = useCallback((updater: (prev: EditorState) => EditorState) => {
        setState(prevState => {
            const newState = updater(prevState);
            // Push to history after state update
            setTimeout(() => pushToHistory(newState), 0);
            return newState;
        });
    }, [pushToHistory]);

    const addBlock = useCallback(async (stepKey: string, block: Block) => {
        updateStateWithHistory(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: [...(prev.stepBlocks[stepKey] || []), block]
            }
        }));
    }, [updateStateWithHistory]);

    const addBlockAtIndex = useCallback(async (stepKey: string, block: Block, index: number) => {
        updateStateWithHistory(prev => {
            const blocks = [...(prev.stepBlocks[stepKey] || [])];
            blocks.splice(index, 0, block);
            return {
                ...prev,
                stepBlocks: {
                    ...prev.stepBlocks,
                    [stepKey]: blocks
                }
            };
        });
    }, [updateStateWithHistory]);

    const removeBlock = useCallback(async (stepKey: string, blockId: string) => {
        updateStateWithHistory(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: (prev.stepBlocks[stepKey] || []).filter(block => block.id !== blockId)
            },
            selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId
        }));
    }, [updateStateWithHistory]);

    const reorderBlocks = useCallback(async (stepKey: string, oldIndex: number, newIndex: number) => {
        updateStateWithHistory(prev => {
            const blocks = [...(prev.stepBlocks[stepKey] || [])];
            const [removed] = blocks.splice(oldIndex, 1);
            blocks.splice(newIndex, 0, removed);

            return {
                ...prev,
                stepBlocks: {
                    ...prev.stepBlocks,
                    [stepKey]: blocks
                }
            };
        });
    }, [updateStateWithHistory]);

    const updateBlock = useCallback(async (stepKey: string, blockId: string, updates: Record<string, any>) => {
        updateStateWithHistory(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: (prev.stepBlocks[stepKey] || []).map(block =>
                    block.id === blockId
                        ? { ...block, ...updates }
                        : block
                )
            }
        }));
    }, [updateStateWithHistory]);

    // ============================================================================
    // NAVIGATION & UTILITIES
    // ============================================================================

    const setCurrentStep = useCallback((step: number) => {
        setState(prev => ({ ...prev, currentStep: step }));
    }, []);

    const setSelectedBlockId = useCallback((blockId: string | null) => {
        setState(prev => ({ ...prev, selectedBlockId: blockId }));
    }, []);

    const setStepValid = useCallback((step: number, isValid: boolean) => {
        setState(prev => ({
            ...prev,
            stepValidation: { ...prev.stepValidation, [step]: isValid }
        }));
    }, []);

    const ensureStepLoaded = useCallback(async (step: number | string) => {
        const stepKey = typeof step === 'string' ? step : `step-${step.toString().padStart(2, '0')}`;

        // Se já tem blocos para este step, não fazer nada
        if (state.stepBlocks[stepKey] && state.stepBlocks[stepKey].length > 0) {
            return;
        }

        // Carregar template padrão para o step
        const templateSteps = QUIZ_STYLE_21_STEPS_TEMPLATE.steps as any;
        const templateBlocks = templateSteps[stepKey] || [];

        setState(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: Array.isArray(templateBlocks) ? templateBlocks : []
            }
        }));
    }, [state.stepBlocks]);

    const loadDefaultTemplate = useCallback(() => {
        const templateSteps = QUIZ_STYLE_21_STEPS_TEMPLATE.steps as any;
        const stepBlocks: Record<string, Block[]> = {};

        // Converter template steps para formato correto
        Object.keys(templateSteps).forEach(key => {
            const blocks = templateSteps[key];
            stepBlocks[key] = Array.isArray(blocks) ? blocks : [];
        });

        updateStateWithHistory(() => ({
            ...getInitialState(),
            stepBlocks
        }));
        history.clear();
    }, [updateStateWithHistory, history]);    // ============================================================================
    // DATA PERSISTENCE
    // ============================================================================

    const saveToSupabase = useCallback(async () => {
        if (!currentFunnel) {
            console.warn('⚠️ No funnel to save');
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true }));

            // Convert stepBlocks to format expected by UnifiedCRUD
            const funnelData = {
                ...currentFunnel,
                steps: state.stepBlocks,
                settings: {
                    ...currentFunnel.settings,
                    lastModified: new Date().toISOString(),
                    currentStep: state.currentStep
                }
            }; await saveFunnel(funnelData);
            console.log('✅ Saved to Supabase successfully');

        } catch (error) {
            console.error('❌ Error saving to Supabase:', error);
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [currentFunnel, saveFunnel, state]);

    const exportJSON = useCallback(() => {
        return JSON.stringify({
            version: '4.0.0',
            timestamp: new Date().toISOString(),
            state: state,
            funnelId,
            quizId
        }, null, 2);
    }, [state, funnelId, quizId]);

    const importJSON = useCallback((json: string) => {
        try {
            const data = JSON.parse(json);
            if (data.state) {
                updateStateWithHistory(() => ({
                    ...getInitialState(),
                    ...data.state
                }));
                history.clear();
            }
        } catch (error) {
            console.error('❌ Error importing JSON:', error);
        }
    }, [updateStateWithHistory, history]);

    // ============================================================================
    // AUTO-SAVE EFFECT
    // ============================================================================

    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (funnelId && !isLoading && !isSaving) {
                saveToSupabase();
            }
        }, 10000); // Auto-save every 10 seconds

        return () => clearInterval(autoSaveInterval);
    }, [funnelId, isLoading, isSaving, saveToSupabase]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue: EditorContextValue = {
        state: {
            ...state,
            isLoading: isLoading || state.isLoading
        },
        actions: {
            // Navigation
            setCurrentStep,
            setSelectedBlockId,
            setStepValid,

            // Block operations
            addBlock,
            addBlockAtIndex,
            removeBlock,
            reorderBlocks,
            updateBlock,

            // Step management
            ensureStepLoaded,
            loadDefaultTemplate,

            // History
            undo,
            redo,
            canUndo: historyState.canUndo,
            canRedo: historyState.canRedo,

            // Data management
            exportJSON,
            importJSON,
            saveToSupabase
        }
    };

    return (
        <EditorContext.Provider value={contextValue}>
            {children}
        </EditorContext.Provider>
    );
};

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

export const useEditorOptional = (): EditorContextValue | undefined => {
    try {
        return useEditor();
    } catch {
        return undefined;
    }
};

// Default export for backward compatibility
export default OptimizedEditorProvider;
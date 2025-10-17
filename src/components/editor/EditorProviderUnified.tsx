/**
 * 🎯 EDITOR PROVIDER UNIFIED - SPRINT 1 CONSOLIDAÇÃO
 * 
 * Provider único que consolida EditorProvider + OptimizedEditorProvider
 * ✅ API compatível com ambos os providers anteriores
 * ✅ Sistema único de persistência (UnifiedCRUD)
 * ✅ Histórico simplificado de undo/redo
 * ✅ ~600 linhas (vs 1556 + 497 = 2053 linhas antes)
 * 
 * CONSOLIDADO:
 * ✅ EditorProvider.tsx (1556 linhas)
 * ✅ OptimizedEditorProvider.tsx (497 linhas)
 * ✅ useEditor + useOptimizedEditor hooks unificados
 * 
 * @version 5.0.0
 * @date 2025-10-10
 */

import * as React from 'react';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useUnifiedCRUD } from '@/contexts';
import { Block, BlockType } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { arrayMove } from '@dnd-kit/sortable';
import { safeGetTemplateBlocks, blockComponentsToBlocks } from '@/utils/templateConverter';
import { useToast } from '@/hooks/use-toast';
import { loadStepTemplate, hasModularTemplate } from '@/utils/loadStepTemplates';

// ============================================================================
// TYPES & INTERFACES
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
    /** Modo de persistência */
    databaseMode: 'local' | 'supabase';
    /** Flag Supabase habilitado */
    isSupabaseEnabled: boolean;
}

export interface EditorActions {
    // Navigation
    setCurrentStep: (step: number) => void;
    setSelectedBlockId: (blockId: string | null) => void;
    setStepValid: (step: number, isValid: boolean) => void;

    // Block operations (async para compatibilidade)
    addBlock: (stepKey: string, block: Block) => Promise<void>;
    addBlockAtIndex: (stepKey: string, block: Block, index: number) => Promise<void>;
    removeBlock: (stepKey: string, blockId: string) => Promise<void>;
    reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => Promise<void>;
    updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;

    // Step management
    ensureStepLoaded: (step: number | string) => Promise<void>;
    loadDefaultTemplate: () => void;

    // History
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

    // Data management
    exportJSON: () => string;
    importJSON: (json: string) => void;
    saveToSupabase?: () => Promise<void>;
    loadSupabaseComponents?: () => Promise<void>;
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

class UnifiedHistory {
    private history: HistoryEntry[] = [];
    private currentIndex: number = -1;
    private maxSize: number = 30;

    push(state: EditorState) {
        // Remove future history se estamos no meio
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Adiciona novo state (shallow clone para performance)
        this.history.push({
            state: { ...state, stepBlocks: { ...state.stepBlocks } },
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

export function useEditor(): EditorContextValue;
export function useEditor(options: { optional: true }): EditorContextValue | undefined;
export function useEditor(options?: { optional?: boolean }): EditorContextValue | undefined {
    const context = useContext(EditorContext);

    if (!context && !options?.optional) {
        console.error('❌ useEditor called outside EditorProviderUnified:', {
            location: typeof window !== 'undefined' ? window.location.href : 'ssr',
            timestamp: new Date().toISOString(),
        });
        throw new Error('🚨 useEditor must be used within EditorProviderUnified');
    }

    return context;
}

// Alias para compatibilidade
export const useOptimizedEditor = useEditor;

// Hook opcional que não lança erro (deprecated - use useEditor({ optional: true }))
export const useEditorOptional = (): EditorContextValue | undefined => {
    return useEditor({ optional: true });
};

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

export interface EditorProviderUnifiedProps {
    children: ReactNode;
    funnelId?: string;
    quizId?: string;
    storageKey?: string;
    initial?: Partial<EditorState>;
    enableSupabase?: boolean;
}

const getInitialState = (enableSupabase: boolean = false): EditorState => ({
    stepBlocks: {},
    currentStep: 1,
    selectedBlockId: null,
    stepValidation: {},
    isLoading: false,
    databaseMode: enableSupabase ? 'supabase' : 'local',
    isSupabaseEnabled: enableSupabase
});

export const EditorProviderUnified: React.FC<EditorProviderUnifiedProps> = ({
    children,
    funnelId,
    quizId,
    storageKey = 'unified-editor',
    initial = {},
    enableSupabase = false
}) => {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================

    const [state, setState] = useState<EditorState>(() => ({
        ...getInitialState(enableSupabase),
        ...initial
    }));

    const [history] = useState(() => new UnifiedHistory());
    const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

    // Refs para debounce
    const saveTimeoutRef = useRef<NodeJS.Timeout>();
    const lastSaveRef = useRef<number>(0);

    // UnifiedCRUD integration (optional)
    let unifiedCrud: any = null;
    try {
        unifiedCrud = useUnifiedCRUD();
    } catch (error) {
        console.log('📝 UnifiedCRUD não disponível, usando modo local');
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    useEffect(() => {
        console.log('🎯 EditorProviderUnified montado:', {
            funnelId,
            quizId,
            enableSupabase,
            storageKey,
            timestamp: new Date().toISOString()
        });

        // Global flag para debugging
        if (typeof window !== 'undefined') {
            (window as any).__UNIFIED_EDITOR_PROVIDER__ = {
                mounted: true,
                version: '5.0.0',
                timestamp: new Date().toISOString()
            };
        }

        return () => {
            if (typeof window !== 'undefined') {
                (window as any).__UNIFIED_EDITOR_PROVIDER__ = {
                    mounted: false,
                    timestamp: new Date().toISOString()
                };
            }
        };
    }, [funnelId, quizId, enableSupabase, storageKey]);

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
            // Push to history after next tick
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
            const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);

            return {
                ...prev,
                stepBlocks: {
                    ...prev.stepBlocks,
                    [stepKey]: reorderedBlocks
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
    // NAVIGATION & STEP MANAGEMENT
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
        const stepKey = typeof step === 'string' ? step : `step-${step}`;

        console.group(`🔍 [ensureStepLoaded] ${stepKey}`);

        // ✅ CORREÇÃO CRÍTICA: Usar functional setState para evitar stale closure
        setState(prev => {
            console.log('hasModularTemplate:', hasModularTemplate(stepKey));
            console.log('existingBlocks:', prev.stepBlocks[stepKey]?.length || 0);

            // ✅ PRIORIDADE 1: Templates JSON modulares (steps 12, 19, 20)
            if (hasModularTemplate(stepKey)) {
                const existingBlocks = prev.stepBlocks[stepKey] || [];
                const modularBlocks = loadStepTemplate(stepKey);

                console.log('✅ Loaded modular blocks:', {
                    count: modularBlocks.length,
                    types: modularBlocks.map(b => b.type)
                });

                // Se já tem blocos modulares com mesma estrutura, não recarregar
                const existingTypes = existingBlocks.map(b => b.type).sort().join(',');
                const modularTypes = modularBlocks.map(b => b.type).sort().join(',');

                if (existingBlocks.length > 0 && existingTypes === modularTypes) {
                    console.log('⏭️ Skip: blocos modulares já carregados');
                    console.groupEnd();
                    return prev; // ✅ NO UPDATE = NO LOOP
                }

                // Carregar/substituir com blocos modulares
                console.log('📝 Carregando blocos modulares');
                console.groupEnd();
                return {
                    ...prev,
                    stepBlocks: {
                        ...prev.stepBlocks,
                        [stepKey]: modularBlocks
                    }
                };
            }

            // Se já tem blocos não-modulares, manter
            if (prev.stepBlocks[stepKey]?.length > 0) {
                console.log('⏭️ Skip: blocos legacy já carregados');
                console.groupEnd();
                return prev; // ✅ NO UPDATE
            }

            // Carregar template padrão para outros steps
            const source: any = (QUIZ_STYLE_21_STEPS_TEMPLATE as any);
            const templateSteps: any = source?.steps && typeof source.steps === 'object' ? source.steps : source;
            const templateBlocks = templateSteps?.[stepKey] || [];

            console.log('📝 Carregando template padrão');
            console.groupEnd();
            return {
                ...prev,
                stepBlocks: {
                    ...prev.stepBlocks,
                    [stepKey]: Array.isArray(templateBlocks) ? templateBlocks : []
                }
            };
        });
    }, []); // ✅ EMPTY DEPS AGORA É SEGURO com functional setState

    const loadDefaultTemplate = useCallback(() => {
        console.log('🎨 Loading default template');

        const template = QUIZ_STYLE_21_STEPS_TEMPLATE;

        if (!template || !template.steps) {
            console.error('❌ Template inválido');
            return;
        }

        const newStepBlocks: Record<string, Block[]> = {};
        let totalBlocks = 0;
        let conversionErrors = 0;

        // Carregar todos os steps do template
        Object.entries(template.steps).forEach(([stepKey, stepConfig]) => {
            try {
                // ✅ PRIORIDADE: Templates JSON modulares (steps 12, 19, 20)
                if (hasModularTemplate(stepKey)) {
                    const modularBlocks = loadStepTemplate(stepKey);
                    newStepBlocks[stepKey] = modularBlocks;
                    totalBlocks += modularBlocks.length;
                    console.log(`🎯 Loaded ${modularBlocks.length} modular blocks for ${stepKey}`);
                    return;
                }

                // Carregar templates padrão para outros steps
                const blockComponents = safeGetTemplateBlocks(stepKey, template);

                // Validar conversão
                if (blockComponents.length === 0 && stepConfig) {
                    console.warn(`⚠️ No blocks converted for ${stepKey}`, stepConfig);
                    conversionErrors++;
                }

                // Converter BlockComponent[] para Block[]
                const blocks = blockComponentsToBlocks(blockComponents);

                // Filtrar blocos deprecated
                const validBlocks = blocks.filter(block => {
                    if (block.type === 'quiz-intro-header' as any) {
                        console.warn(`🗑️ Filtered deprecated block: quiz-intro-header from ${stepKey}`);
                        return false;
                    }
                    return true;
                });

                newStepBlocks[stepKey] = validBlocks;
                totalBlocks += validBlocks.length;
                console.log(`📦 Loaded ${validBlocks.length} blocks for ${stepKey}`);
            } catch (error) {
                console.error(`❌ Error converting ${stepKey}:`, error);
                conversionErrors++;
                newStepBlocks[stepKey] = [];
            }
        });

        updateStateWithHistory(() => ({
            ...getInitialState(enableSupabase),
            stepBlocks: newStepBlocks
        }));

        history.clear();
        console.log(`✅ Template loaded: ${totalBlocks} blocos em ${Object.keys(newStepBlocks).length} steps`);

        if (conversionErrors > 0) {
            console.warn(`⚠️ ${conversionErrors} steps tiveram problemas na conversão`);
        }
    }, [updateStateWithHistory, history, enableSupabase]);

    // ============================================================================
    // DATA PERSISTENCE
    // ============================================================================

    const saveToSupabase = useCallback(async () => {
        if (!enableSupabase || !unifiedCrud) {
            console.log('💾 Supabase desabilitado ou UnifiedCRUD indisponível');
            return;
        }

        const now = Date.now();
        if (now - lastSaveRef.current < 2000) {
            console.log('⏱️ Debounce: ignorando save muito frequente');
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true }));
            lastSaveRef.current = now;

            const funnelData = {
                id: funnelId,
                name: `Funnel ${funnelId}`,
                type: 'quiz',
                config: {
                    steps: state.stepBlocks,
                    settings: {
                        currentStep: state.currentStep,
                        selectedBlockId: state.selectedBlockId
                    }
                },
                metadata: {
                    lastSaved: new Date().toISOString(),
                    version: '1.0.0',
                    editorVersion: '5.0.0'
                }
            };

            await unifiedCrud.saveFunnel(funnelData);

            console.log('✅ Salvo no Supabase com sucesso');

            // Salvar também no persistence service local
            if (funnelId) {
                const { editorPersistence } = await import('@/services/persistence/EditorPersistenceService');
                await editorPersistence.saveSnapshot(state.stepBlocks, funnelId);
            }

        } catch (error) {
            console.error('❌ Erro ao salvar no Supabase:', error);
            throw error;
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [enableSupabase, unifiedCrud, funnelId, state.stepBlocks, state.currentStep, state.selectedBlockId]);

    const loadSupabaseComponents = useCallback(async () => {
        if (!enableSupabase || !funnelId) {
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true }));
            console.log('📡 Carregando componentes do Supabase...');

            // Implementar carregamento do Supabase via UnifiedCRUD
            if (unifiedCrud?.loadFunnel) {
                const funnelData = await unifiedCrud.loadFunnel(funnelId);
                if (funnelData?.steps) {
                    setState(prev => ({
                        ...prev,
                        stepBlocks: funnelData.steps,
                        isLoading: false
                    }));
                    console.log('✅ Componentes carregados do Supabase');
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar do Supabase:', error);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [enableSupabase, funnelId, unifiedCrud]);

    const exportJSON = useCallback(() => {
        return JSON.stringify({
            version: '5.0.0-unified',
            timestamp: new Date().toISOString(),
            state: state,
            funnelId,
            quizId,
            meta: {
                stepsCount: Object.keys(state.stepBlocks).length,
                totalBlocks: Object.values(state.stepBlocks).reduce((acc, blocks) => acc + blocks.length, 0)
            }
        }, null, 2);
    }, [state, funnelId, quizId]);

    const importJSON = useCallback((json: string) => {
        try {
            const data = JSON.parse(json);
            if (data.state) {
                updateStateWithHistory(() => ({
                    ...getInitialState(enableSupabase),
                    ...data.state
                }));
                history.clear();
                console.log('✅ JSON importado com sucesso');
            }
        } catch (error) {
            console.error('❌ Erro ao importar JSON:', error);
        }
    }, [updateStateWithHistory, history, enableSupabase]);

    // ============================================================================
    // AUTO-SAVE EFFECT
    // ============================================================================

    useEffect(() => {
        if (!enableSupabase || !funnelId) return;

        const autoSaveInterval = setInterval(() => {
            if (!state.isLoading && unifiedCrud && !unifiedCrud.isSaving) {
                saveToSupabase();
            }
        }, 30000); // Auto-save every 30 seconds

        return () => clearInterval(autoSaveInterval);
    }, [enableSupabase, funnelId, state.isLoading, saveToSupabase, unifiedCrud]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue: EditorContextValue = {
        state: {
            ...state,
            isLoading: state.isLoading || (unifiedCrud?.isLoading ?? false)
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
            saveToSupabase: enableSupabase ? saveToSupabase : undefined,
            loadSupabaseComponents: enableSupabase ? loadSupabaseComponents : undefined
        }
    };

    return (
        <EditorContext.Provider value={contextValue}>
            {children}
        </EditorContext.Provider>
    );
};

// ============================================================================
// EXPORTS & ALIASES
// ============================================================================

// Default export
export default EditorProviderUnified;

// Legacy alias para compatibilidade total
export const EditorProvider = EditorProviderUnified;
export const OptimizedEditorProvider = EditorProviderUnified;

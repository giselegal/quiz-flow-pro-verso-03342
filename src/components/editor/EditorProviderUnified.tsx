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
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { useUnifiedCRUD } from '@/contexts';
import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { safeGetTemplateBlocks, blockComponentsToBlocks } from '@/utils/templateConverter';
import { loadStepTemplate, hasModularTemplate } from '@/utils/loadStepTemplates';
import { unifiedCache } from '@/utils/UnifiedTemplateCache';
import { stepBlocksKey } from '@/utils/cacheKeys';
import { EditorHistoryService } from '@/services/editor/HistoryService';
import { TemplateLoader } from '@/services/editor/TemplateLoader';
import EditorStateManager from '@/services/editor/EditorStateManager';
import type { TemplateSource } from '@/services/editor/TemplateLoader';
import { modularJsonToEditorStepsSafe, editorStepsToModularJson } from '@/lib/modular-json';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface EditorState {
    /** Blocos organizados por step */
    stepBlocks: Record<string, Block[]>;
    /** Origem dos blocos por step (diagnóstico) */
    stepSources?: Record<string, 'normalized-json' | 'modular-json' | 'individual-json' | 'ts-template'>;
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

    // Modular JSON (novo)
    exportModularJson?: () => string;
    importModularJson?: (json: string) => void;
    loadModularPackageUrl?: (url: string) => Promise<void>;
}

export interface EditorContextValue {
    state: EditorState;
    actions: EditorActions;
}

// ============================================================================
// CONTEXT SETUP (History moved to separate service)
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
    stepSources: {},
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

    // Services initialization (memoized)
    const history = useMemo(() => new EditorHistoryService(), []);
    const loader = useMemo(() => new TemplateLoader(), []);
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
    // HISTORY MANAGEMENT & STATE MANAGER
    // ============================================================================

    // State manager (initialized after setState is available)
    const stateManager = useMemo(() => {
        const updateStateCallback = (updater: (prev: EditorState) => EditorState) => {
            setState(prevState => {
                const newState = updater(prevState);
                setTimeout(() => {
                    history.push(newState);
                    setHistoryState({
                        canUndo: history.canUndo,
                        canRedo: history.canRedo
                    });
                }, 0);
                return newState;
            });
        };
        return new EditorStateManager(updateStateCallback, history, loader);
    }, [history, loader]);

    const undo = useCallback(() => {
        const previousState = stateManager.undo();
        if (previousState) {
            setState(previousState);
            setHistoryState({
                canUndo: stateManager.canUndo,
                canRedo: stateManager.canRedo
            });
        }
    }, [stateManager]);

    const redo = useCallback(() => {
        const nextState = stateManager.redo();
        if (nextState) {
            setState(nextState);
            setHistoryState({
                canUndo: stateManager.canUndo,
                canRedo: stateManager.canRedo
            });
        }
    }, [stateManager]);

    // ============================================================================
    // BLOCK OPERATIONS
    // ============================================================================

    // Normaliza a chave do step para o formato step-XX
    const normalizeStepKey = useCallback((stepKey: string): string => {
        const match = String(stepKey).match(/^step-(\d{1,2})$/);
        if (match) {
            return `step-${parseInt(match[1], 10).toString().padStart(2, '0')}`;
        }
        return stepKey;
    }, []);

    const addBlock = useCallback(async (stepKey: string, block: Block) => {
        await stateManager.addBlock(normalizeStepKey(stepKey), block);
    }, [stateManager, normalizeStepKey]);

    const addBlockAtIndex = useCallback(async (stepKey: string, block: Block, index: number) => {
        await stateManager.addBlockAtIndex(normalizeStepKey(stepKey), block, index);
    }, [stateManager, normalizeStepKey]);

    const removeBlock = useCallback(async (stepKey: string, blockId: string) => {
        await stateManager.removeBlock(normalizeStepKey(stepKey), blockId);
    }, [stateManager, normalizeStepKey]);

    const reorderBlocks = useCallback(async (stepKey: string, oldIndex: number, newIndex: number) => {
        await stateManager.reorderBlocks(normalizeStepKey(stepKey), oldIndex, newIndex);
    }, [stateManager, normalizeStepKey]);

    const updateBlock = useCallback(async (stepKey: string, blockId: string, updates: Record<string, any>) => {
        await stateManager.updateBlock(normalizeStepKey(stepKey), blockId, updates);
    }, [stateManager, normalizeStepKey]);

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
        try {
            const updates = await stateManager.ensureStepLoaded(step, state);
            if (Object.keys(updates).length > 0) {
                setState(prev => ({ ...prev, ...updates }));
            }
        } catch (error) {
            console.error('❌ Erro ao carregar step:', error);
        }
    }, [stateManager, state]);

    // ✅ FASE 1.4: EVENT-DRIVEN step loading (elimina polling)
    const autoLoadedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Event-driven: carregar apenas quando step muda via evento
        const handleStepChange = () => {
            const normalizedKey = `step-${state.currentStep.toString().padStart(2, '0')}`;

            // Skip se já foi auto-carregado
            if (autoLoadedRef.current.has(normalizedKey)) return;

            const stepBlocks = state.stepBlocks[normalizedKey];
            const needsLoad = !stepBlocks || stepBlocks.length === 0;

            if (needsLoad) {
                console.log(`🔄 [EditorProvider] Event-driven loading: ${normalizedKey}`);
                ensureStepLoaded(state.currentStep).finally(() => {
                    autoLoadedRef.current.add(normalizedKey);
                });
            } else {
                autoLoadedRef.current.add(normalizedKey);
            }
        };

        // Chamar imediatamente
        handleStepChange();

        // Não precisa de deps - só carrega no mount
    }, [state.currentStep]); // ✅ DEPS MÍNIMAS: apenas currentStep

    // 🚀 Pré-carregar step adjacente para reduzir latência ao navegar
    useEffect(() => {
        const next = state.currentStep + 1;
        if (next <= 21) {
            const normalizedNext = `step-${next.toString().padStart(2, '0')}`;
            const t = setTimeout(() => {
                // Evitar trabalho se já em cache local ou unificado
                const hasLocal = (state.stepBlocks[normalizedNext]?.length || 0) > 0;
                const cached = unifiedCache.get(stepBlocksKey(normalizedNext));
                if (!hasLocal && !(Array.isArray(cached) && cached.length > 0)) {
                    ensureStepLoaded(next);
                } else if (!hasLocal && Array.isArray(cached) && cached.length > 0) {
                    setState(prev => ({
                        ...prev,
                        stepBlocks: { ...prev.stepBlocks, [normalizedNext]: cached as Block[] },
                        stepSources: { ...(prev.stepSources || {}), [normalizedNext]: 'individual-json' }
                    }));
                }
            }, 500);
            return () => clearTimeout(t);
        }
    }, [state.currentStep, ensureStepLoaded]);

    const loadDefaultTemplate = useCallback(async () => {
        console.log('🎨 Loading default template via TemplateLoader/Registry');
        const newStepBlocks: Record<string, Block[]> = {};
        const newStepSources: Record<string, 'modular-json' | 'individual-json' | 'ts-template'> = {};
        let totalBlocks = 0;

        // 21 etapas step-01..step-21
        const keys = Array.from({ length: 21 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);
        for (const stepKey of keys) {
            try {
                const { blocks, source } = await stateManager.ensureStepLoaded(stepKey, {
                    ...state,
                }) as any;
                // ensureStepLoaded retorna Partial<EditorState>; mas usamos loader internamente
                const ensured = await (stateManager as any).loader.loadStep(stepKey);
                newStepBlocks[stepKey] = ensured.blocks;
                newStepSources[stepKey] = ensured.source;
                totalBlocks += ensured.blocks.length;
            } catch (error) {
                console.error(`❌ Error loading ${stepKey}:`, error);
                newStepBlocks[stepKey] = [];
            }
        }

        setState({
            ...getInitialState(enableSupabase),
            stepBlocks: newStepBlocks,
            stepSources: newStepSources
        });

        stateManager.clearHistory();
        console.log(`✅ Template loaded (Registry-first): ${totalBlocks} blocos em ${Object.keys(newStepBlocks).length} steps`);
    }, [stateManager, enableSupabase, state]);

    // 🚀 Auto-carregar template completo quando query ?template=quiz21StepsComplete
    const autoLoadTriggeredRef = useRef(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (autoLoadTriggeredRef.current) return;
        try {
            const sp = new URLSearchParams(window.location.search);
            // Se modularUrl estiver presente, priorizar pacote modular
            const modularUrl = sp.get('modularUrl');
            if (modularUrl) {
                autoLoadTriggeredRef.current = true;
                console.log('🧩 Auto-loading modular package by query param:', modularUrl);
                (async () => {
                    await loadModularPackageUrl(modularUrl);
                })();
                return;
            }
            const tpl = sp.get('template');
            if (tpl && tpl.toLowerCase() === 'quiz21stepscomplete'.toLowerCase()) {
                autoLoadTriggeredRef.current = true;
                console.log('🧩 Auto-loading template by query param:', tpl);
                // Carrega todos os steps usando TemplateLoader com fallback para TS template
                loadDefaultTemplate();
            }
        } catch {
            // ignore query parsing errors
        }
    }, [loadDefaultTemplate]);

    // Carregar pacote Modular JSON de uma URL pública
    const loadModularPackageUrl = useCallback(async (url: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const resp = await fetch(url, { cache: 'no-store' });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const parsed = modularJsonToEditorStepsSafe(data);
            if (!parsed.ok) {
                console.error('❌ Modular package inválido:', parsed.errors);
                throw new Error(parsed.errors.join('\n'));
            }
            // Mapear steps para stepBlocks keyed por step.id
            const stepsArray = parsed.steps as any[];
            const stepBlocks: Record<string, Block[]> = {};
            const stepSources: Record<string, TemplateSource> = {} as any;
            for (const st of stepsArray) {
                const key = st.id; // assume ids do tipo step-01, step-02
                const blocks = (st.blocks || []).map((b: any, idx: number) => ({
                    id: b.id,
                    type: b.type,
                    order: typeof b.order === 'number' ? b.order : idx,
                    properties: b.properties || {},
                    content: b.content || {}
                })) as Block[];
                stepBlocks[key] = blocks;
                stepSources[key] = 'modular-json';
            }
            setState(prev => ({
                ...prev,
                stepBlocks,
                stepSources,
                isLoading: false
            }));
            stateManager.clearHistory();
            console.log(`✅ Modular package carregado: ${Object.keys(stepBlocks).length} steps`);
        } catch (e) {
            console.error('❌ Falha ao carregar pacote modular:', e);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [stateManager]);

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
                setState({
                    ...getInitialState(enableSupabase),
                    ...data.state
                });
                stateManager.clearHistory();
                console.log('✅ JSON importado com sucesso');
            }
        } catch (error) {
            console.error('❌ Erro ao importar JSON:', error);
        }
    }, [stateManager, enableSupabase]);

    // Exportar estado atual do editor como ModularQuiz JSON
    const exportModularJson = useCallback(() => {
        try {
            // Construir array de steps em ordem
            const entries = Object.entries(state.stepBlocks)
                .map(([id, blocks]) => ({
                    id,
                    order: parseInt(id.replace('step-', ''), 10) || 0,
                    type: (blocks[0]?.type ?? 'intro') as any, // fallback simples
                    title: undefined,
                    blocks
                }))
                .sort((a, b) => (a.order - b.order));
            const modular = editorStepsToModularJson(entries as any[], { exportedAt: new Date().toISOString(), version: '1.0.0' });
            return JSON.stringify(modular, null, 2);
        } catch (e) {
            console.error('❌ Erro ao exportar Modular JSON:', e);
            return '{}';
        }
    }, [state.stepBlocks]);

    // Importar ModularQuiz JSON (string)
    const importModularJson = useCallback((json: string) => {
        try {
            const data = JSON.parse(json);
            const res = modularJsonToEditorStepsSafe(data);
            if (!res.ok) throw new Error(res.errors.join('\n'));
            const stepBlocks: Record<string, Block[]> = {};
            const stepSources: Record<string, TemplateSource> = {} as any;
            res.steps.forEach((st: any) => {
                const blocks = (st.blocks || []).map((b: any, idx: number) => ({
                    id: b.id,
                    type: b.type,
                    order: typeof b.order === 'number' ? b.order : idx,
                    properties: b.properties || {},
                    content: b.content || {}
                })) as Block[];
                stepBlocks[st.id] = blocks;
                stepSources[st.id] = 'modular-json';
            });
            setState(prev => ({ ...prev, stepBlocks, stepSources }));
            stateManager.clearHistory();
            console.log('✅ Modular JSON importado com sucesso');
        } catch (e) {
            console.error('❌ Erro ao importar Modular JSON:', e);
        }
    }, [stateManager]);

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
            canUndo: stateManager.canUndo,
            canRedo: stateManager.canRedo,

            // Data management
            exportJSON,
            importJSON,
            exportModularJson,
            importModularJson,
            loadModularPackageUrl,
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

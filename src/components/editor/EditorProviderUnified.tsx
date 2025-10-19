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
import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { arrayMove } from '@dnd-kit/sortable';
import { safeGetTemplateBlocks, blockComponentsToBlocks } from '@/utils/templateConverter';
import { loadStepTemplate, loadStepTemplateAsync, hasModularTemplate, hasStaticBlocksJSON } from '@/utils/loadStepTemplates';
import hydrateSectionsWithQuizSteps from '@/utils/hydrators/hydrateSectionsWithQuizSteps';
import { unifiedCache } from '@/utils/UnifiedTemplateCache';
import { masterTemplateKey, stepBlocksKey, masterBlocksKey, templateKey } from '@/utils/cacheKeys';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface EditorState {
    /** Blocos organizados por step */
    stepBlocks: Record<string, Block[]>;
    /** Origem dos blocos por step (diagnóstico) */
    stepSources?: Record<string, 'normalized-json' | 'modular-json' | 'individual-json' | 'master-hydrated' | 'ts-template'>;
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

    // Normaliza a chave do step para o formato step-XX
    const normalizeStepKey = useCallback((stepKey: string): string => {
        const match = String(stepKey).match(/^step-(\d{1,2})$/);
        if (match) {
            return `step-${parseInt(match[1], 10).toString().padStart(2, '0')}`;
        }
        return stepKey;
    }, []);

    const updateStateWithHistory = useCallback((updater: (prev: EditorState) => EditorState) => {
        setState(prevState => {
            const newState = updater(prevState);
            // Push to history after next tick
            setTimeout(() => pushToHistory(newState), 0);
            return newState;
        });
    }, [pushToHistory]);

    const addBlock = useCallback(async (stepKey: string, block: Block) => {
        const key = normalizeStepKey(stepKey);
        updateStateWithHistory(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [key]: [...(prev.stepBlocks[key] || []), block]
            }
        }));
    }, [updateStateWithHistory, normalizeStepKey]);

    const addBlockAtIndex = useCallback(async (stepKey: string, block: Block, index: number) => {
        const key = normalizeStepKey(stepKey);
        updateStateWithHistory(prev => {
            const blocks = [...(prev.stepBlocks[key] || [])];
            blocks.splice(index, 0, block);
            return {
                ...prev,
                stepBlocks: {
                    ...prev.stepBlocks,
                    [key]: blocks
                }
            };
        });
    }, [updateStateWithHistory, normalizeStepKey]);

    const removeBlock = useCallback(async (stepKey: string, blockId: string) => {
        const key = normalizeStepKey(stepKey);
        updateStateWithHistory(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [key]: (prev.stepBlocks[key] || []).filter(block => block.id !== blockId)
            },
            selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId
        }));
    }, [updateStateWithHistory, normalizeStepKey]);

    const reorderBlocks = useCallback(async (stepKey: string, oldIndex: number, newIndex: number) => {
        const key = normalizeStepKey(stepKey);
        updateStateWithHistory(prev => {
            const blocks = [...(prev.stepBlocks[key] || [])];
            const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);

            return {
                ...prev,
                stepBlocks: {
                    ...prev.stepBlocks,
                    [key]: reorderedBlocks
                }
            };
        });
    }, [updateStateWithHistory, normalizeStepKey]);

    const updateBlock = useCallback(async (stepKey: string, blockId: string, updates: Record<string, any>) => {
        const key = normalizeStepKey(stepKey);
        updateStateWithHistory(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [key]: (prev.stepBlocks[key] || []).map(block =>
                    block.id === blockId
                        ? { ...block, ...updates }
                        : block
                )
            }
        }));
    }, [updateStateWithHistory, normalizeStepKey]);

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

    // ✅ FASE 3: Proteção contra loops - rastrear steps sendo carregados
    const loadingStepsRef = useRef<Set<string>>(new Set());

    const masterTemplateRef = useRef<any | null>(null);

    const ensureStepLoaded = useCallback(async (step: number | string) => {
        // Normaliza a chave do step para o formato step-XX (zero à esquerda para 1–9)
        const rawKey = typeof step === 'string' ? step : `step-${step}`;
        const match = rawKey.match(/^step-(\d{1,2})$/);
        const normalizedKey = match ? `step-${parseInt(match[1], 10).toString().padStart(2, '0')}` : rawKey;

        // ✅ FASE 3: Skip se já está carregando
        if (loadingStepsRef.current.has(normalizedKey)) {
            console.log(`⏭️ Skip: ${normalizedKey} já está sendo carregado`);
            return;
        }

        loadingStepsRef.current.add(normalizedKey);

        try {
            console.group(`🔍 [ensureStepLoaded] ${normalizedKey}`);

            // 🔎 Tentativa 0: servir diretamente de cache unificado por step
            try {
                const cachedStepBlocks = unifiedCache.get(stepBlocksKey(normalizedKey)) || unifiedCache.get(masterBlocksKey(normalizedKey));
                if (Array.isArray(cachedStepBlocks) && cachedStepBlocks.length > 0) {
                    console.log(`📦 UnifiedCache hit (step): ${normalizedKey} → ${cachedStepBlocks.length} blocos`);
                    setState(prev => {
                        if ((prev.stepBlocks[normalizedKey]?.length || 0) > 0) {
                            console.groupEnd();
                            return prev;
                        }
                        console.groupEnd();
                        return {
                            ...prev,
                            stepBlocks: {
                                ...prev.stepBlocks,
                                [normalizedKey]: cachedStepBlocks as Block[]
                            },
                            stepSources: {
                                ...(prev.stepSources || {}),
                                [normalizedKey]: 'master-hydrated'
                            }
                        };
                    });
                    return;
                }
            } catch (e) {
                console.warn('⚠️ Erro ao ler unifiedCache (step blocks):', e);
            }

            // 🔄 Tentar pré-carregar master JSON público uma vez (usa unifiedCache)
            // ✅ RETRY COM EXPONENTIAL BACKOFF - Fix para falhas de rede
            let masterBlocks: Block[] | null = null;
            try {
                if (typeof window !== 'undefined' && window.location) {
                    if (!masterTemplateRef.current) {
                        const cachedMaster = unifiedCache.get(masterTemplateKey());
                        if (cachedMaster) {
                            masterTemplateRef.current = cachedMaster;
                        } else {
                            // ✅ RETRY LOGIC: 3 tentativas com backoff exponencial
                            let lastError: any = null;
                            for (let attempt = 0; attempt < 3; attempt++) {
                                try {
                                    const resp = await fetch('/templates/quiz21-complete.json', {
                                        cache: 'force-cache' // Use browser cache when available
                                    });
                                    if (resp.ok) {
                                        masterTemplateRef.current = await resp.json();
                                        unifiedCache.set(masterTemplateKey(), masterTemplateRef.current);
                                        console.log(`✅ Master JSON carregado (tentativa ${attempt + 1})`);
                                        break;
                                    } else {
                                        lastError = new Error(`HTTP ${resp.status}`);
                                        console.warn(`⚠️ Tentativa ${attempt + 1}/3 falhou:`, resp.status);
                                    }
                                } catch (err) {
                                    lastError = err;
                                    console.warn(`⚠️ Tentativa ${attempt + 1}/3 erro de rede:`, err);
                                }
                                // Exponential backoff: 200ms, 400ms, 800ms
                                if (attempt < 2) {
                                    await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt)));
                                }
                            }
                            if (!masterTemplateRef.current) {
                                console.error('❌ Falha ao carregar master JSON após 3 tentativas:', lastError);
                            }
                        }
                    }
                    const master = masterTemplateRef.current;
                    const stepConfig = master?.steps?.[normalizedKey];
                    if (stepConfig) {
                        // Hidratar sections com quizSteps antes da conversão
                        const hydrated = {
                            ...stepConfig,
                            sections: hydrateSectionsWithQuizSteps(normalizedKey, stepConfig.sections)
                        };
                        // Converter via util existente usando template mínimo
                        const blockComponents = safeGetTemplateBlocks(normalizedKey, { [normalizedKey]: hydrated });
                        masterBlocks = blockComponentsToBlocks(blockComponents);
                        unifiedCache.set(masterBlocksKey(normalizedKey), masterBlocks);
                        unifiedCache.set(stepBlocksKey(normalizedKey), masterBlocks);
                        console.log(`📦 Master JSON → ${normalizedKey}: ${masterBlocks.length} blocos`);
                    }
                }
            } catch (e) {
                console.warn('⚠️ Erro ao preparar masterBlocks:', e);
            }

            // ✅ PRIORIDADE 0 (AGUARDADA): JSON normalizado (public/templates/normalized) ou modular estático
            try {
                const stepNum0 = Number(normalizedKey.replace('step-', ''));
                const isNormalizedRange0 = (stepNum0 >= 2 && stepNum0 <= 11) || (stepNum0 >= 13 && stepNum0 <= 18) || stepNum0 === 19;
                // Tentar cache do normalizado primeiro
                if (isNormalizedRange0) {
                    const normalizedCache0 = unifiedCache.get<Block[]>(templateKey(`normalized:${normalizedKey}`));
                    if (Array.isArray(normalizedCache0) && normalizedCache0.length > 0) {
                        setState(prev => ({
                            ...prev,
                            stepBlocks: { ...prev.stepBlocks, [normalizedKey]: normalizedCache0 },
                            stepSources: { ...(prev.stepSources || {}), [normalizedKey]: 'normalized-json' }
                        }));
                        return;
                    }
                    const normalizedBlocks0 = await loadStepTemplateAsync(normalizedKey);
                    if (Array.isArray(normalizedBlocks0) && normalizedBlocks0.length > 0) {
                        try { unifiedCache.set(templateKey(`normalized:${normalizedKey}`), normalizedBlocks0); } catch { /* noop */ }
                        try { unifiedCache.set(stepBlocksKey(normalizedKey), normalizedBlocks0); } catch { /* noop */ }
                        setState(prev => ({
                            ...prev,
                            stepBlocks: { ...prev.stepBlocks, [normalizedKey]: normalizedBlocks0 },
                            stepSources: { ...(prev.stepSources || {}), [normalizedKey]: 'normalized-json' }
                        }));
                        return;
                    }
                } else if (hasStaticBlocksJSON(normalizedKey)) {
                    const modularBlocks0 = loadStepTemplate(normalizedKey);
                    if (Array.isArray(modularBlocks0) && modularBlocks0.length > 0) {
                        try { unifiedCache.set(stepBlocksKey(normalizedKey), modularBlocks0); } catch { /* noop */ }
                        setState(prev => ({
                            ...prev,
                            stepBlocks: { ...prev.stepBlocks, [normalizedKey]: modularBlocks0 },
                            stepSources: { ...(prev.stepSources || {}), [normalizedKey]: 'modular-json' }
                        }));
                        return;
                    }
                }
            } catch { /* noop */ }

            // ✅ CORREÇÃO CRÍTICA: Usar functional setState para evitar stale closure
            setState(prev => {
                console.log('hasModularTemplate:', hasModularTemplate(normalizedKey));
                console.log('hasStaticBlocksJSON:', hasStaticBlocksJSON(normalizedKey));
                console.log('existingBlocks:', prev.stepBlocks[normalizedKey]?.length || 0);
                console.log('loadingStepsRef:', Array.from(loadingStepsRef.current));

                // ✅ PRIORIDADE 0: JSON normalizado por etapa (public/templates/normalized/step-XX.json)
                try {
                    const stepNum = Number(normalizedKey.replace('step-', ''));
                    const isNormalizedRange = (stepNum >= 2 && stepNum <= 11) || (stepNum >= 13 && stepNum <= 18) || stepNum === 19;
                    if (isNormalizedRange) {
                        const normalizedCache = unifiedCache.get<Block[]>(templateKey(`normalized:${normalizedKey}`));
                        if (Array.isArray(normalizedCache) && normalizedCache.length > 0) {
                            console.log('📝 Aplicando blocos do JSON normalizado (cache):', `/templates/normalized/${normalizedKey}.json`);
                            // Garantir que o cache unificado por step também reflita o normalizado
                            try { unifiedCache.set(stepBlocksKey(normalizedKey), normalizedCache); } catch { /* noop */ }
                            console.groupEnd();
                            return {
                                ...prev,
                                stepBlocks: { ...prev.stepBlocks, [normalizedKey]: normalizedCache },
                                stepSources: { ...(prev.stepSources || {}), [normalizedKey]: 'normalized-json' }
                            };
                        }
                        // Disparar fetch assíncrono do normalizado (não bloqueia aplicação do master/TS)
                        const normalizedUrl = `/templates/normalized/${normalizedKey}.json`;
                        fetch(normalizedUrl)
                            .then(res => res.ok ? res.json() : null)
                            .then(json => {
                                if (!json || !Array.isArray(json.blocks)) return;
                                const blocks = (json.blocks as any[]).map((b, idx) => ({
                                    id: b.id || `block-${idx}`,
                                    type: (b.type || 'text-inline') as any,
                                    order: (b.order != null ? b.order : (b.position != null ? b.position : idx)),
                                    properties: b.properties || b.props || {},
                                    content: b.content || {}
                                })) as Block[];
                                unifiedCache.set(templateKey(`normalized:${normalizedKey}`), blocks);
                                // Sincronizar também no cache unificado por step para evitar preferir master em loads futuros
                                try { unifiedCache.set(stepBlocksKey(normalizedKey), blocks); } catch { /* noop */ }
                                setState(p => ({
                                    ...p,
                                    stepBlocks: { ...p.stepBlocks, [normalizedKey]: blocks },
                                    stepSources: { ...(p.stepSources || {}), [normalizedKey]: 'normalized-json' }
                                }));
                            })
                            .catch(() => { /* silent */ });
                    }
                } catch { }

                // ✅ PRIORIDADE 1: Templates JSON estáticos modulares (12, 19, 20) — síncrono
                if (hasStaticBlocksJSON(normalizedKey)) {
                    const existingBlocks = prev.stepBlocks[normalizedKey] || [];
                    const modularBlocks = loadStepTemplate(normalizedKey);
                    const existingTypes = existingBlocks.map(b => b.type).sort().join(',');
                    const modularTypes = modularBlocks.map(b => b.type).sort().join(',');
                    if (existingBlocks.length > 0 && existingTypes === modularTypes) {
                        console.log('⏭️ Skip: blocos modulares já carregados');
                        console.groupEnd();
                        return prev; // ✅ NO UPDATE = NO LOOP
                    }
                    try { unifiedCache.set(stepBlocksKey(normalizedKey), modularBlocks); } catch { }
                    console.log('📝 Carregando blocos modulares estáticos');
                    console.groupEnd();
                    return {
                        ...prev,
                        stepBlocks: {
                            ...prev.stepBlocks,
                            [normalizedKey]: modularBlocks
                        },
                        stepSources: {
                            ...(prev.stepSources || {}),
                            [normalizedKey]: 'modular-json'
                        }
                    };
                }

                // Se já tem blocos não-modulares, manter
                if (prev.stepBlocks[normalizedKey]?.length > 0) {
                    console.log('⏭️ Skip: blocos legacy já carregados');
                    console.groupEnd();
                    return prev; // ✅ NO UPDATE
                }

                // ✅ PRIORIDADE 2: JSON individual de etapa se existir (public/templates/step-XX.json)
                // Evitar 404s desnecessários: não buscar individual quando a etapa faz parte do intervalo "normalizado"
                try {
                    const stepNumInt = Number(normalizedKey.replace('step-', ''));
                    const isNormalizedRange = (stepNumInt >= 2 && stepNumInt <= 11) || (stepNumInt >= 13 && stepNumInt <= 18) || stepNumInt === 19;
                    if (!isNormalizedRange) {
                        const stepNum = normalizedKey.replace('step-', '');
                        const individualUrl = `/templates/step-${stepNum}.json`;
                        const individualCached = unifiedCache.get<Block[]>(templateKey(`individual:${normalizedKey}`));
                        if (Array.isArray(individualCached) && individualCached.length > 0) {
                            console.log('📝 Aplicando blocos do JSON individual (cache):', individualUrl);
                            console.groupEnd();
                            return {
                                ...prev,
                                stepBlocks: { ...prev.stepBlocks, [normalizedKey]: individualCached },
                                stepSources: { ...(prev.stepSources || {}), [normalizedKey]: 'individual-json' as any }
                            };
                        }
                        // Nota: fetch síncrono não é possível aqui; master será usado e, em paralelo, tentamos hidratar individual
                        fetch(individualUrl)
                            .then(res => res.ok ? res.json() : null)
                            .then(json => {
                                if (!json || !Array.isArray(json.blocks)) return;
                                const blocks = (json.blocks as any[]).map((b, idx) => ({
                                    id: b.id || `block-${idx}`,
                                    type: (b.type || 'text-inline') as any,
                                    order: (b.order != null ? b.order : (b.position != null ? b.position : idx)),
                                    properties: b.properties || b.props || {},
                                    content: b.content || {}
                                })) as Block[];
                                unifiedCache.set(templateKey(`individual:${normalizedKey}`), blocks);
                                setState(p => ({
                                    ...p,
                                    stepBlocks: { ...p.stepBlocks, [normalizedKey]: blocks },
                                    stepSources: { ...(p.stepSources || {}), [normalizedKey]: 'individual-json' as any }
                                }));
                            })
                            .catch(() => { });
                    }
                } catch { }

                // ✅ Se conseguimos masterBlocks (JSON público hidratado), usar
                if (masterBlocks && masterBlocks.length > 0) {
                    console.log('📝 Aplicando blocos do master JSON hidratado');
                    try { unifiedCache.set(stepBlocksKey(normalizedKey), masterBlocks); } catch { }
                    console.groupEnd();
                    return {
                        ...prev,
                        stepBlocks: {
                            ...prev.stepBlocks,
                            [normalizedKey]: masterBlocks
                        },
                        stepSources: {
                            ...(prev.stepSources || {}),
                            [normalizedKey]: 'master-hydrated'
                        }
                    };
                }

                // Fallback: Carregar template padrão TS (sections → blocks)
                const template = QUIZ_STYLE_21_STEPS_TEMPLATE;
                console.log('📝 Carregando template padrão (sections → blocks)');
                const blockComponents = safeGetTemplateBlocks(normalizedKey, template);
                const convertedBlocks = blockComponentsToBlocks(blockComponents);
                try { unifiedCache.set(stepBlocksKey(normalizedKey), convertedBlocks); } catch { }
                console.groupEnd();
                return {
                    ...prev,
                    stepBlocks: {
                        ...prev.stepBlocks,
                        [normalizedKey]: convertedBlocks
                    },
                    stepSources: {
                        ...(prev.stepSources || {}),
                        [normalizedKey]: 'ts-template'
                    }
                };
            });
        } finally {
            // ✅ FASE 1: Evitar loops e travamentos — remover da lista de carregamento e fechar grupos de log
            try { console.groupEnd(); } catch { /* noop */ }
            loadingStepsRef.current.delete(normalizedKey);
        }
    }, []); // ✅ EMPTY DEPS AGORA É SEGURO com functional setState

    // ✅ FASE 2 + FASE 4: Carregar blocos antecipadamente quando step muda
    const autoLoadedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Normaliza a chave usada para auto-carregamento
        const rawKey = `step-${state.currentStep}`;
        const normalizedKey = `step-${state.currentStep.toString().padStart(2, '0')}`;

        // Skip se já foi auto-carregado
        if (autoLoadedRef.current.has(normalizedKey)) return;

        // ✅ CORREÇÃO CRÍTICA: Verificar múltiplas condições de "vazio"
        const stepBlocks = state.stepBlocks[normalizedKey] ?? state.stepBlocks[rawKey];
        const needsLoad = (
            !stepBlocks ||                    // Não existe
            stepBlocks.length === 0 ||        // Array vazio
            stepBlocks === undefined          // Undefined
        );

        if (needsLoad) {
            const reason = !stepBlocks ? 'missing' : 'empty array';
            console.log(`🔄 [EditorProvider] Auto-loading ${normalizedKey} (reason: ${reason})`);
            ensureStepLoaded(state.currentStep).finally(() => {
                autoLoadedRef.current.add(normalizedKey);
            });
        } else {
            // Marcar como carregado mesmo que já tenha blocos
            autoLoadedRef.current.add(normalizedKey);
        }
    }, [state.currentStep]); // ✅ DEPS ESTÁVEIS: apenas currentStep

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
                        stepSources: { ...(prev.stepSources || {}), [normalizedNext]: 'master-hydrated' }
                    }));
                }
            }, 500);
            return () => clearTimeout(t);
        }
    }, [state.currentStep, ensureStepLoaded]);

    const loadDefaultTemplate = useCallback(() => {
        console.log('🎨 Loading default template');

        const template = QUIZ_STYLE_21_STEPS_TEMPLATE;

        if (!template || !template.steps) {
            console.error('❌ Template inválido');
            return;
        }

        const newStepBlocks: Record<string, Block[]> = {};
        const newStepSources: Record<string, 'modular-json' | 'master-hydrated' | 'ts-template'> = {};
        let totalBlocks = 0;
        let conversionErrors = 0;

        // Carregar todos os steps do template
        Object.entries(template.steps).forEach(([stepKey, stepConfig]) => {
            try {
                // ✅ PRIORIDADE: Templates JSON modulares (steps 12, 19, 20)
                if (hasModularTemplate(stepKey)) {
                    const modularBlocks = loadStepTemplate(stepKey);
                    newStepBlocks[stepKey] = modularBlocks;
                    newStepSources[stepKey] = 'modular-json';
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

                // Aceitar blocos conforme conversão; manter 'quiz-intro-header' para Step 01
                const validBlocks = blocks;
                newStepBlocks[stepKey] = validBlocks;
                newStepSources[stepKey] = 'ts-template';
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
            stepBlocks: newStepBlocks,
            stepSources: newStepSources
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

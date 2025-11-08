/**
 * ⚠️ DEPRECATED: EDITOR PROVIDER UNIFIED
 * 
 * @deprecated Este provider foi consolidado em EditorProviderCanonical.
 * Use: import { EditorProviderCanonical } from '@/components/editor/EditorProviderCanonical';
 * 
 * MIGRAÇÃO:
 * ```tsx
 * // ❌ ANTES
 * <EditorProviderCanonical funnelId={id} enableSupabase={true}>
 * 
 * // ✅ DEPOIS
 * <EditorProviderCanonical funnelId={id} enableSupabase={true}>
 * ```
 * 
 * Este arquivo será removido em versão futura.
 * 
 * @version 7.0.0 - DEPRECATED
 * @date 2025-01-17
 */

import * as React from 'react';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { useSuperUnified } from '@/providers/SuperUnifiedProvider';
import { useUnifiedCRUD } from '@/contexts';
import { Block } from '@/types/editor';
import { blockComponentsToBlocks } from '@/utils/templateConverter';
import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
import { stepBlocksKey, masterBlocksKey, masterTemplateKey } from '@/utils/cacheKeys';
import { EditorHistoryService } from '@/services/editor/HistoryService';
import { TemplateLoader, type TemplateSource } from '@/services/editor/TemplateLoader';
import EditorStateManager from '@/services/editor/EditorStateManager';
import { funnelComponentsService } from '@/services/funnelComponentsService';
import type { UnifiedStage, UnifiedFunnel } from '@/services/UnifiedCRUDService';
import { createLogger, appLogger } from '@/utils/logger';
import { UnifiedBlockRegistry } from '@/registry/UnifiedBlockRegistry';
import { templateService, TemplateService } from '@/services/canonical/TemplateService';
import { navigationService } from '@/services/canonical/NavigationService';

// ============================================================================
// TYPES & INTERFACES (FASE 2: Simplificados)
// ============================================================================

/**
 * Estado do Editor - FASE 2: Apenas lógica avançada
 * Estado básico (stepBlocks, currentStep) delegado para SuperUnifiedProvider
 */
export interface EditorState {
    /** Validação visual por step */
    stepValidation: Record<number, boolean>;
    /** Status de carregamento */
    isLoading: boolean;
    /** Modo de persistência */
    databaseMode: 'local' | 'supabase';
    /** Flag Supabase habilitado */
    isSupabaseEnabled: boolean;
    /** Origem dos blocos por step (diagnóstico) */
    stepSources?: Record<string, 'normalized-json' | 'modular-json' | 'individual-json' | 'master-json' | 'consolidated' | 'supabase' | 'ts-template'>;
    
    // ✅ FASE 2: Estado básico vem do SuperUnifiedProvider via proxy
    readonly stepBlocks: Record<string, Block[]>;
    readonly currentStep: number;
    readonly selectedBlockId: string | null;
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
    duplicateBlock?: (stepKey: string, blockId: string) => Promise<string>;
    insertSnippetBlocks?: (stepKey: string, blocks: Block[]) => Promise<string[]>;
    moveBlock?: (stepKey: string, blockId: string, targetParentId: string | null, overBlockId: string | null) => Promise<void>;

    // Step management
    ensureStepLoaded: (step: number | string) => Promise<void>;
    loadDefaultTemplate: () => void;
    reloadStepFromJSON: (step?: number | string) => Promise<void>;
    reloadAllStepsFromJSON: () => Promise<void>;

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
    // ✅ FASE 2: Expor SuperUnifiedProvider para acesso direto
    superUnified?: ReturnType<typeof useSuperUnified>;
}

// ============================================================================
// CONTEXT SETUP (History moved to separate service)
// ============================================================================

export const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function useEditor(): EditorContextValue;
export function useEditor(options: { optional: true }): EditorContextValue | undefined;
export function useEditor(options?: { optional?: boolean }): EditorContextValue | undefined {
    const context = useContext(EditorContext);

    if (!context && !options?.optional) {
        appLogger.error('❌ useEditor called outside EditorProviderUnified:', {
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
    templateId?: string; // ✅ FASE 2: Adicionar templateId
    storageKey?: string;
    initial?: Partial<EditorState>;
    enableSupabase?: boolean; // ✅ FASE 3.0: Habilitado por padrão
}

const getInitialState = (enableSupabase: boolean = true): EditorState => ({
    stepBlocks: {},
    stepSources: {},
    currentStep: 1,
    selectedBlockId: null,
    stepValidation: {},
    isLoading: false,
    databaseMode: enableSupabase ? 'supabase' : 'local',
    isSupabaseEnabled: enableSupabase,
});

export const EditorProviderUnified: React.FC<EditorProviderCanonicalProps> = ({
    children,
    funnelId,
    quizId,
    templateId,
    storageKey = 'unified-editor',
    initial = {},
    enableSupabase = true,
}) => {
    // ============================================================================
    // DEPRECATION WARNING
    // ============================================================================
    
    useEffect(() => {
        console.warn(
            '⚠️ EditorProviderUnified is deprecated. Use EditorProviderCanonical instead.\n' +
            'Migration: Replace "EditorProviderUnified" with "EditorProviderCanonical"\n' +
            'Import: import { EditorProviderCanonical } from "@/components/editor/EditorProviderCanonical";\n' +
            'See: docs/EDITOR_PROVIDERS_REFACTOR_PROPOSAL.md',
        );
    }, []);
    
    // ============================================================================
    // FASE 2: CONECTAR AO SUPERUNIFIEDPROVIDER
    // ============================================================================
    
    const superUnified = useSuperUnified();
    
    // ============================================================================
    // STATE MANAGEMENT (FASE 2: Apenas estado avançado local)
    // ============================================================================

    const [localState, setLocalState] = useState(() => ({
        stepValidation: {} as Record<number, boolean>,
        isLoading: false,
        databaseMode: enableSupabase ? 'supabase' as const : 'local' as const,
        isSupabaseEnabled: enableSupabase,
        stepSources: {} as Record<string, 'normalized-json' | 'modular-json' | 'individual-json' | 'master-json' | 'consolidated' | 'supabase' | 'ts-template'>,
        ...initial,
    }));
    
    // ✅ FASE 2: Estado proxy que lê de SuperUnifiedProvider
    const state: EditorState = useMemo(() => {
        // Converter Record<number, any[]> para Record<string, Block[]>
        const stepBlocksFromSuper = Object.entries(superUnified.state.editor.stepBlocks).reduce((acc, [key, blocks]) => {
            const stepKey = key.startsWith('step-') ? key : `step-${key.padStart(2, '0')}`;
            acc[stepKey] = blocks as Block[];
            return acc;
        }, {} as Record<string, Block[]>);
        
        return {
            ...localState,
            // Estado básico vem do SuperUnifiedProvider
            stepBlocks: stepBlocksFromSuper,
            currentStep: superUnified.state.editor.currentStep,
            selectedBlockId: superUnified.state.editor.selectedBlockId,
        };
    }, [localState, superUnified.state.editor]);

    // Services initialization (memoized)
    const history = useMemo(() => new EditorHistoryService(), []);
    const loader = useMemo(() => new TemplateLoader(), []);
    const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });
    const blockRegistry = useMemo(() => UnifiedBlockRegistry.getInstance(), []);

    // Refs para debounce
    const saveTimeoutRef = useRef<NodeJS.Timeout>();
    const lastSaveRef = useRef<number>(0);

    // UnifiedCRUD integration (optional)
    let unifiedCrud: any = null;
    try {
        unifiedCrud = useUnifiedCRUD();
    } catch (error) {
        appLogger.debug('📝 UnifiedCRUD não disponível, usando modo local');
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    useEffect(() => {
        appLogger.debug('🎯 EditorProviderUnified montado:', {
            funnelId,
            quizId,
            enableSupabase,
            storageKey,
            timestamp: new Date().toISOString(),
        });

        // Global flag para debugging
        if (typeof window !== 'undefined') {
            (window as any).__UNIFIED_EDITOR_PROVIDER__ = {
                mounted: true,
                version: '5.0.0',
                timestamp: new Date().toISOString(),
            };
        }

        // 🔌 Quando o editor é aberto com ?template=quiz21StepsComplete,
        // pré-carregar componentes críticos para evitar atrasos/404 de chunks.
        try {
            if (typeof window !== 'undefined' && window.location?.search) {
                const sp = new URLSearchParams(window.location.search);
                const isQuiz21Template = (sp.get('template') || '').toLowerCase() === 'quiz21stepscomplete';
                if (isQuiz21Template) {
                    // Import dinâmico para não pesar o bundle inicial
                    setTimeout(() => {
                        import('@/registry/UnifiedComponentRegistry')
                            .then(mod => mod.preloadCriticalComponents?.())
                            .catch(() => { });
                    }, 100);
                }
            }
        } catch { /* ignore */ }

        return () => {
            if (typeof window !== 'undefined') {
                (window as any).__UNIFIED_EDITOR_PROVIDER__ = {
                    mounted: false,
                    timestamp: new Date().toISOString(),
                };
            }
        };
    }, [funnelId, quizId, enableSupabase, storageKey]);

    // ============================================================================
    // HISTORY MANAGEMENT & STATE MANAGER
    // ============================================================================

    // State manager (initialized after setLocalState is available)
    const stateManager = useMemo(() => {
        const updateStateCallback = (updater: (prev: EditorState) => EditorState) => {
            const currentState: EditorState = state;
            const newState = updater(currentState);
            
            // Atualizar apenas campos locais no localState
            setLocalState({
                stepValidation: newState.stepValidation,
                isLoading: newState.isLoading,
                databaseMode: newState.databaseMode,
                isSupabaseEnabled: newState.isSupabaseEnabled,
                stepSources: newState.stepSources || {},
            });
            
            setTimeout(() => {
                history.push(newState);
                setHistoryState({
                    canUndo: history.canUndo,
                    canRedo: history.canRedo,
                });
            }, 0);
        };
        return new EditorStateManager(updateStateCallback, history, loader);
    }, [history, loader, state]);

    const undo = useCallback(() => {
        const previousState = stateManager.undo();
        if (previousState) {
            setLocalState({
                stepValidation: previousState.stepValidation,
                isLoading: previousState.isLoading,
                databaseMode: previousState.databaseMode,
                isSupabaseEnabled: previousState.isSupabaseEnabled,
                stepSources: previousState.stepSources || {},
            });
            setHistoryState({
                canUndo: stateManager.canUndo,
                canRedo: stateManager.canRedo,
            });
        }
    }, [stateManager]);

    const redo = useCallback(() => {
        const nextState = stateManager.redo();
        if (nextState) {
            setLocalState({
                stepValidation: nextState.stepValidation,
                isLoading: nextState.isLoading,
                databaseMode: nextState.databaseMode,
                isSupabaseEnabled: nextState.isSupabaseEnabled,
                stepSources: nextState.stepSources || {},
            });
            setHistoryState({
                canUndo: stateManager.canUndo,
                canRedo: stateManager.canRedo,
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
        
        // ✅ SPRINT 1 DIA 2: Emitir evento para forçar re-render do PropertiesPanel
        const { emitBlockUpdate } = await import('@/utils/editorEventBus');
        emitBlockUpdate({
            stepKey: normalizeStepKey(stepKey),
            blockId,
            patch: { properties: updates, content: updates },
        });
    }, [stateManager, normalizeStepKey]);

    const duplicateBlock = useCallback(async (stepKey: string, blockId: string) => {
        return await stateManager.duplicateBlock(normalizeStepKey(stepKey), blockId);
    }, [stateManager, normalizeStepKey]);

    const insertSnippetBlocks = useCallback(async (stepKey: string, blocks: Block[]) => {
        return await stateManager.insertSnippetBlocks(normalizeStepKey(stepKey), blocks);
    }, [stateManager, normalizeStepKey]);

    const moveBlock = useCallback(async (stepKey: string, blockId: string, targetParentId: string | null, overBlockId: string | null) => {
        await stateManager.moveBlock(normalizeStepKey(stepKey), blockId, targetParentId, overBlockId);
    }, [stateManager, normalizeStepKey]);

    // ============================================================================
    // NAVIGATION & STEP MANAGEMENT
    // ============================================================================

    const setCurrentStep = useCallback((step: number) => {
        superUnified?.setCurrentStep?.(step);
    }, [superUnified]);

    const setSelectedBlockId = useCallback((blockId: string | null) => {
        superUnified?.setSelectedBlock?.(blockId);
    }, [superUnified]);

    const setStepValid = useCallback((step: number, isValid: boolean) => {
        setLocalState(prev => ({
            ...prev,
            stepValidation: { ...prev.stepValidation, [step]: isValid },
        }));
    }, []);

    const ensureStepLoaded = useCallback(async (step: number | string) => {
        try {
            const normalizedKey = typeof step === 'number'
                ? `step-${step.toString().padStart(2, '0')}`
                : (String(step).match(/^step-(\d{1,2})$/) ? `step-${parseInt(String(step).replace('step-', ''), 10).toString().padStart(2, '0')}` : String(step));

            // ✅ FASE 2.1: Usar templateService canonical
            const result = await templateService.getStep(normalizedKey);

            if (!result.success || !result.data) {
                appLogger.warn(`⚠️ Step ${normalizedKey} não encontrado no templateService`);
                return;
            }

            const blocks = result.data;

            if (blocks && blocks.length > 0) {
                // ✅ CORREÇÃO: Obter source real do loader ao invés de forçar 'master-hydrated'
                let actualSource: TemplateSource = 'individual-json'; // default
                try {
                    const loaderResult = await (stateManager as any).loader?.loadStep(normalizedKey);
                    if (loaderResult?.source) {
                        actualSource = loaderResult.source;
                    }
                } catch {
                    // fallback ao default
                }

                setLocalState(prev => ({
                    ...prev,
                    stepBlocks: {
                        ...prev.stepBlocks,
                        [normalizedKey]: blocks as Block[],
                    },
                    stepSources: {
                        ...(prev.stepSources || {}),
                        [normalizedKey]: actualSource,
                    },
                }));

                appLogger.debug(`✅ Step ${normalizedKey} carregado via templateService: ${blocks.length} blocos (source: ${actualSource})`);
            } else {
                appLogger.warn(`⚠️ Step ${normalizedKey} não retornou blocos do templateService`);
            }
        } catch (error) {
            appLogger.error('❌ Erro ao carregar step:', error);
        }
    }, []);

    // 🔄 Forçar recarregamento do step a partir dos JSONs públicos
    const reloadStepFromJSON = useCallback(async (step?: number | string) => {
        const s = step ?? state.currentStep;
        const normalizedKey = typeof s === 'number'
            ? `step-${s.toString().padStart(2, '0')}`
            : (String(s).match(/^step-(\d{1,2})$/) ? `step-${parseInt(String(s).replace('step-', ''), 10).toString().padStart(2, '0')}` : String(s));

        // Invalida caches relacionados
        unifiedCacheService.delete(stepBlocksKey(normalizedKey));
        unifiedCacheService.delete(masterBlocksKey(normalizedKey));

        // Remove do estado local para forçar ensureStepLoaded a buscar novamente
        setLocalState(prev => {
            const { [normalizedKey]: _removed, ...restBlocks } = prev.stepBlocks || {};
            const { [normalizedKey]: _removedSrc, ...restSources } = prev.stepSources || {};
            return {
                ...prev,
                stepBlocks: restBlocks,
                stepSources: restSources,
            };
        });

        // Carregar novamente
        await ensureStepLoaded(normalizedKey);
    }, [state.currentStep, ensureStepLoaded]);

    // 🔄 Recarrega todos os steps 01–20 a partir dos JSONs públicos
    const reloadAllStepsFromJSON = useCallback(async () => {
        // Limpa caches globais relacionados ao master e steps
        unifiedCacheService.delete(masterTemplateKey());
        for (let i = 1; i <= 21; i++) {
            const key = `step-${i.toString().padStart(2, '0')}`;
            unifiedCacheService.delete(stepBlocksKey(key));
            unifiedCacheService.delete(masterBlocksKey(key));
        }

        // Zera estado local
        setLocalState(prev => ({
            ...prev,
            stepBlocks: {},
            stepSources: {},
        }));

        // Recarrega em sequência para evitar corridas
        for (let i = 1; i <= 20; i++) {
            const key = `step-${i.toString().padStart(2, '0')}`;
            await ensureStepLoaded(key);
        }
    }, [ensureStepLoaded]);

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
                appLogger.debug(`🔄 [EditorProvider] Event-driven loading: ${normalizedKey}`);
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
        if (next <= 20) {
            const normalizedNext = `step-${next.toString().padStart(2, '0')}`;
            const t = setTimeout(() => {
                // Evitar trabalho se já em cache local ou unificado
                const hasLocal = (state.stepBlocks[normalizedNext]?.length || 0) > 0;
                const cached = unifiedCacheService.get(stepBlocksKey(normalizedNext));
                if (!hasLocal && !(Array.isArray(cached) && cached.length > 0)) {
                    ensureStepLoaded(next);
                } else if (!hasLocal && Array.isArray(cached) && cached.length > 0) {
                    // ⚠️ REMOVIDO: Não forçar source como 'master-hydrated' aqui
                    // A fonte correta será determinada pelo TemplateLoader
                    setLocalState(prev => ({
                        ...prev,
                        stepBlocks: { ...prev.stepBlocks, [normalizedNext]: cached as Block[] },
                        // stepSources será atualizado pelo ensureStepLoaded quando necessário
                    }));
                }
            }, 500);
            return () => clearTimeout(t);
        }
    }, [state.currentStep, ensureStepLoaded]);

    const loadDefaultTemplate = useCallback(async () => {
        appLogger.debug('🎨 Loading default template via TemplateLoader/Registry');
        const newStepBlocks: Record<string, Block[]> = {};
        const newStepSources: Record<string, 'modular-json' | 'master-json' | 'ts-template'> = {};
        let totalBlocks = 0;

        // 20 etapas step-01..step-20
        const keys = Array.from({ length: 20 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);
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
                appLogger.error(`❌ Error loading ${stepKey}:`, error);
                newStepBlocks[stepKey] = [];
            }
        }

        setLocalState({
            ...getInitialState(enableSupabase),
            stepBlocks: newStepBlocks,
            stepSources: newStepSources,
        });

        stateManager.clearHistory();
        appLogger.debug(`✅ Template loaded (Registry-first): ${totalBlocks} blocos em ${Object.keys(newStepBlocks).length} steps`);
    }, [stateManager, enableSupabase, state]);

    // ============================================================================
    // DATA PERSISTENCE
    // ============================================================================

    const saveToSupabase = useCallback(async () => {
        const log = createLogger({ namespace: 'SaveToSupabase' });
        // Log explícito no console para facilitar diagnóstico em qualquer nível de logger
        appLogger.debug('💾 [SaveToSupabase] called', {
            enableSupabase,
            hasUnifiedCrud: !!unifiedCrud,
            funnelId,
            stepsCount: Object.keys(state.stepBlocks).length,
        });
        if (!enableSupabase || !unifiedCrud) {
            log.info('Supabase desabilitado ou UnifiedCRUD indisponível', {
                enableSupabase,
                hasUnifiedCrud: !!unifiedCrud,
                funnelId,
            });
            // Garantir visibilidade mesmo se nível do logger estiver alto
            appLogger.warn('⚠️ [SaveToSupabase] Supabase desabilitado ou UnifiedCRUD indisponível');
            return;
        }

        const now = Date.now();
        if (now - lastSaveRef.current < 2000) {
            log.info('Debounce: ignorando save muito frequente');
            return;
        }

        log.info('Iniciando salvamento...', {
            funnelId,
            stepsCount: Object.keys(state.stepBlocks).length,
            totalBlocks: Object.values(state.stepBlocks).reduce((acc, blocks) => acc + blocks.length, 0),
            currentStep: state.currentStep,
        });

        try {
            setLocalState(prev => ({ ...prev, isLoading: true }));
            lastSaveRef.current = now;

            // 1) Converter stepBlocks -> UnifiedFunnel.stages (shape esperado pelo UnifiedCRUDService)
            const stages: UnifiedStage[] = Object.entries(state.stepBlocks).map(([stepKey, blocks], idx) => {
                const match = stepKey.match(/step-(\d{1,2})/);
                const stepNumber = match ? parseInt(match[1], 10) : idx + 1;
                return {
                    id: stepKey,
                    name: `Etapa ${String(stepNumber).padStart(2, '0')}`,
                    description: '',
                    blocks: (blocks || []) as any,
                    order: stepNumber - 1,
                    isRequired: true,
                    settings: {},
                    metadata: {
                        blocksCount: (blocks || []).length,
                        isValid: true,
                    },
                };
            });

            const funnelData: UnifiedFunnel = {
                id: funnelId || `funnel-${Date.now()}`,
                name: `Funnel ${funnelId || ''}`.trim(),
                description: '',
                stages,
                settings: {},
                status: 'draft',
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: { totalBlocks: stages.reduce((s, st) => s + st.blocks.length, 0), completedStages: 0, isValid: true },
            } as any;

            if (!unifiedCrud.saveFunnel) {
                throw new Error('UnifiedCRUD.saveFunnel não está disponível');
            }
            // Retry básico (x3) para aumentar robustez em casos transitórios
            let result: any = null;
            let attempt = 0;
            let lastErr: any = null;
            while (attempt < 3) {
                attempt++;
                try {
                    log.info(`Tentativa de saveFunnel (${attempt}/3)`);
                    result = await unifiedCrud.saveFunnel(funnelData);
                    break;
                } catch (e) {
                    lastErr = e;
                    log.warn('Falha ao salvar no UnifiedCRUD - retry agendado', { attempt, err: (e as any)?.message });
                    await new Promise(res => setTimeout(res, 300 * attempt));
                }
            }
            if (!result && lastErr) {
                throw lastErr;
            }

            log.info('Salvo no UnifiedCRUD (cache + sync)', {
                funnelId: funnelData.id,
                opSuccess: result?.success,
            });

            // 2) Persistir snapshot local (para recuperação rápida)
            if (funnelData.id) {
                const { editorPersistence } = await import('@/services/persistence/EditorPersistenceService');
                await editorPersistence.saveSnapshot(state.stepBlocks, funnelData.id);
            }

            // 3) Sincronizar com Supabase component_instances (fonte atual de verdade)
            try {
                if (funnelData.id) {
                    for (const [stepKey, blocks] of Object.entries(state.stepBlocks)) {
                        const match = stepKey.match(/step-(\d{1,2})/);
                        const stepNumber = match ? parseInt(match[1], 10) : 0;
                        if (!stepNumber) continue;

                        // Limpar existentes
                        try {
                            const existing = await funnelComponentsService.getComponents({ funnelId: funnelData.id, stepNumber });
                            for (const c of existing) {
                                await funnelComponentsService.deleteComponent(c.id);
                            }
                        } catch (e) {
                            log.warn('Falha ao limpar componentes existentes (seguindo)...', { stepNumber, err: (e as any)?.message });
                        }

                        // Inserir na ordem
                        for (let i = 0; i < (blocks?.length || 0); i++) {
                            const b: any = (blocks as any)[i];
                            try {
                                await funnelComponentsService.addComponent({
                                    funnelId: funnelData.id,
                                    stepNumber,
                                    instanceKey: b.id || `${stepKey}-block-${i + 1}`,
                                    componentTypeKey: b.type || 'text',
                                    orderIndex: i + 1,
                                    properties: { ...(b.properties || {}), ...(b.content || {}) },
                                });
                            } catch (e) {
                                log.warn('Falha ao inserir componente', { stepNumber, blockIndex: i, err: (e as any)?.message });
                            }
                        }
                    }
                    log.info('Sincronização com component_instances concluída', { funnelId: funnelData.id });
                }
            } catch (e) {
                log.warn('Sincronização com component_instances falhou', { err: (e as any)?.message });
            }

        } catch (error) {
            appLogger.error('❌ [SaveToSupabase] Erro ao salvar:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                funnelId,
                enableSupabase,
                hasUnifiedCrud: !!unifiedCrud,
            });
            throw error;
        } finally {
            setLocalState(prev => ({ ...prev, isLoading: false }));
        }
    }, [enableSupabase, unifiedCrud, funnelId, state.stepBlocks, state.currentStep, state.selectedBlockId]);

    const loadSupabaseComponents = useCallback(async () => {
        if (!enableSupabase || !funnelId) {
            return;
        }

        try {
            setLocalState(prev => ({ ...prev, isLoading: false }));
            appLogger.debug('📡 Carregando componentes do Supabase...');

            // Implementar carregamento do Supabase via UnifiedCRUD
            if (unifiedCrud?.loadFunnel) {
                const funnelData = await unifiedCrud.loadFunnel(funnelId);
                if (funnelData?.steps) {
                    setLocalState(prev => ({
                        ...prev,
                        stepBlocks: funnelData.steps,
                        isLoading: false,
                    }));
                    appLogger.debug('✅ Componentes carregados do Supabase');
                }
            }
        } catch (error) {
            appLogger.error('❌ Erro ao carregar do Supabase:', error);
            setLocalState(prev => ({ ...prev, isLoading: false }));
        }
    }, [enableSupabase, funnelId, unifiedCrud]);

    const exportJSON = useCallback(() => {
        // ✅ CORRIGIDO: Exportar os blocos REAIS do editor ao invés de estrutura vazia
        const templates: Record<string, any> = {};

        for (const [stepKey, blocks] of Object.entries(state.stepBlocks)) {
            if (!blocks || blocks.length === 0) continue;

            // Normalizar stepKey para formato step-XX
            const stepId = stepKey.startsWith('step-') ? stepKey : `step-${stepKey}`;
            const stepNumber = parseInt(stepId.replace('step-', ''), 10);

            // Metadata básica
            const metadata = {
                id: stepId,
                name: `Etapa ${stepId}`,
                description: `Etapa ${stepId} do quiz`,
                category: 'question',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: 'Quiz Flow Builder',
                version: '3.0.1',
            };

            templates[stepId] = {
                id: stepId,
                type: 'question',
                order: stepNumber,
                blocks: blocks,
                nextStep: `step-${stepNumber + 1}`,
                metadata: metadata,
            };
        }

        return JSON.stringify(Object.values(templates), null, 2);
    }, [state.stepBlocks]);

    const importJSON = useCallback((json: string) => {
        try {
            const data = JSON.parse(json);
            if (data.state) {
                setLocalState({
                    ...getInitialState(enableSupabase),
                    ...data.state,
                });
                stateManager.clearHistory();
                appLogger.debug('✅ JSON importado com sucesso');
            }
        } catch (error) {
            appLogger.error('❌ Erro ao importar JSON:', error);
        }
    }, [stateManager, enableSupabase]);

    // ============================================================================
    // AUTO-SAVE EFFECT
    // ============================================================================

    useEffect(() => {
        // Se o editor já está controlando auto-save (hook), não agendar o interval aqui
        try {
            if (typeof window !== 'undefined' && (window as any).__EDITOR_AUTOSAVE_ACTIVE) {
                appLogger.debug('⏭️ [EditorProviderUnified] Auto-save interval pulado (hook ativo)');
                return;
            }
        } catch { }

        if (!enableSupabase || !funnelId) {
            if (enableSupabase && !funnelId) {
                appLogger.warn('⚠️ [EditorProviderUnified] Auto-save desabilitado: funnelId não fornecido');
            }
            return;
        }

        appLogger.info('✅ [EditorProviderUnified] Auto-save habilitado', {
            funnelId,
            enableSupabase,
            interval: '30s'
        });

        const autoSaveInterval = setInterval(() => {
            if (!state.isLoading && unifiedCrud && !unifiedCrud.isSaving) {
                appLogger.debug('⏰ [EditorProviderUnified] Executando auto-save...');
                saveToSupabase().catch((error) => {
                    appLogger.error('❌ [EditorProviderUnified] Erro no auto-save:', error);
                });
            } else {
                appLogger.debug('⏸️ [EditorProviderUnified] Auto-save pulado', {
                    isLoading: state.isLoading,
                    hasUnifiedCrud: !!unifiedCrud,
                    isSaving: unifiedCrud?.isSaving,
                });
            }
        }, 30000); // Auto-save every 30 seconds

        return () => {
            appLogger.debug('🛑 [EditorProviderUnified] Auto-save desabilitado (cleanup)');
            clearInterval(autoSaveInterval);
        };
    }, [enableSupabase, funnelId, state.isLoading, saveToSupabase, unifiedCrud]);

    // ============================================================================
    // CONTEXT VALUE (✅ FASE 2.1: Memoização agressiva para -50% re-renders)
    // ============================================================================

    // Memoizar actions separadamente para estabilidade
    const actions = useMemo<EditorActions>(() => ({
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
        duplicateBlock,
        insertSnippetBlocks,
        moveBlock,

        // Step management
        ensureStepLoaded,
        loadDefaultTemplate,
        reloadStepFromJSON,
        reloadAllStepsFromJSON,

        // History
        undo,
        redo,
        canUndo: stateManager.canUndo,
        canRedo: stateManager.canRedo,

        // Data management
        exportJSON,
        importJSON,
        ...(enableSupabase ? { saveToSupabase, loadSupabaseComponents } : {}),
    }), [
        // Apenas funções estáveis - não incluir state!
        setCurrentStep, setSelectedBlockId, setStepValid,
        addBlock, addBlockAtIndex, removeBlock, reorderBlocks, updateBlock,
        duplicateBlock, insertSnippetBlocks, moveBlock,
        ensureStepLoaded, loadDefaultTemplate, reloadStepFromJSON, reloadAllStepsFromJSON,
        undo, redo, exportJSON, importJSON,
        stateManager.canUndo, stateManager.canRedo,
        enableSupabase, saveToSupabase, loadSupabaseComponents,
    ]);

    // Context value memoizado com state e actions separados
    const contextValue = useMemo<EditorContextValue>(() => ({
        state: {
            ...state,
            isLoading: state.isLoading || (unifiedCrud?.isLoading ?? false),
        },
        actions,
    }), [state, unifiedCrud?.isLoading, actions]);

    return (
        <EditorContext.Provider value={contextValue}>
            {children}
        </EditorContext.Provider>
    );
};

// Nota: Helpers de dev não expostos aqui para evitar uso indevido de hooks fora de contexto

// ============================================================================
// EXPORTS & ALIASES
// ============================================================================

// Default export
export default EditorProviderUnified;

// Legacy alias para compatibilidade total
export const EditorProvider = EditorProviderUnified;
export const OptimizedEditorProvider = EditorProviderUnified;

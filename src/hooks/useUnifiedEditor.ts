/**
 * 🎯 UNIFIED EDITOR HOOK - FASE 4
 * 
 * Hook canônico que consolida TODAS as implementações de useEditor:
 * ✅ Fonte única de verdade para todo o sistema
 * ✅ Compatibilidade com todos os padrões existentes
 * ✅ Auto-detecção do provider ativo
 * ✅ Fallbacks inteligentes
 * ✅ TypeScript rigoroso
 * 
 * SUBSTITUI:
 * ❌ EditorProviderMigrationAdapter.useEditor
 * ❌ EditorProvider.useEditor  
 * ❌ EditorContext.useEditor
 * ❌ SuperUnifiedProvider.useEditor
 * ❌ Múltiplas implementações espalhadas
 */

import { useContext } from 'react';
import { EditorContextValue } from '@/components/editor/OptimizedEditorProvider';

// ============================================================================
// UNIFIED EDITOR CONTEXT TYPE
// ============================================================================

export interface UnifiedEditorContext extends EditorContextValue {
    // Core functionality from OptimizedEditorProvider
    state: EditorContextValue['state'];
    actions: EditorContextValue['actions'];

    // Legacy compatibility layer
    legacy?: {
        // EditorProviderMigrationAdapter compatibility
        funnelId?: string;
        setFunnelId?: (id: string) => void;
        isPreviewing?: boolean;
        setIsPreviewing?: (preview: boolean) => void;

        // Original EditorProvider compatibility
        rawState?: any;
        setState?: (state: any) => void;
        storageReady?: boolean;

        // EditorCore compatibility
        core?: any;
        elements?: any;
        selection?: any;
        viewport?: any;
    };
}

// ============================================================================
// CONTEXT DETECTION & PROVIDER RESOLUTION
// ============================================================================

/**
 * Detecta automaticamente qual provider está ativo e retorna o contexto apropriado
 */
const detectActiveEditorContext = (): UnifiedEditorContext | null => {
    // 1. Tentar OptimizedEditorProvider (preferência)
    try {
        const optimizedContext = require('@/components/editor/OptimizedEditorProvider').useEditor?.();
        if (optimizedContext) {
            return {
                ...optimizedContext,
                legacy: {}
            };
        }
    } catch (error) {
        // Context not available, continue
    }

    // 2. Tentar EditorProvider original (fallback)
    try {
        const originalContext = require('@/components/editor/EditorProvider').useEditor?.();
        if (originalContext) {
            return {
                state: originalContext.state,
                actions: originalContext.actions,
                legacy: {
                    rawState: originalContext.state,
                    setState: originalContext.actions?.setState,
                    storageReady: true
                }
            };
        }
    } catch (error) {
        // Context not available, continue
    }

    // 3. Tentar EditorProviderMigrationAdapter (fallback)
    try {
        const migrationContext = require('@/components/editor/EditorProviderMigrationAdapter').useEditor?.();
        if (migrationContext) {
            return {
                state: migrationContext.state,
                actions: migrationContext.actions,
                legacy: {
                    funnelId: migrationContext.legacy?.funnelId,
                    setFunnelId: migrationContext.legacy?.setFunnelId,
                    isPreviewing: migrationContext.legacy?.isPreviewing,
                    setIsPreviewing: migrationContext.legacy?.setIsPreviewing
                }
            };
        }
    } catch (error) {
        // Context not available, continue
    }

    // 4. Tentar EditorCore (fallback)
    try {
        const coreContext = require('@/components/editor/core/EditorCore').useEditorCore?.();
        if (coreContext) {
            return {
                state: {
                    stepBlocks: {},
                    currentStep: 1,
                    selectedBlockId: null,
                    stepValidation: {},
                    isLoading: false,
                    databaseMode: 'supabase' as const
                },
                actions: {
                    setCurrentStep: () => { },
                    setSelectedBlockId: () => { },
                    setStepValid: () => { },
                    addBlock: async () => { },
                    addBlockAtIndex: async () => { },
                    removeBlock: async () => { },
                    reorderBlocks: async () => { },
                    updateBlock: async () => { },
                    ensureStepLoaded: async () => { },
                    loadDefaultTemplate: () => { },
                    undo: () => { },
                    redo: () => { },
                    canUndo: false,
                    canRedo: false,
                    exportJSON: () => '{}',
                    importJSON: () => { },
                    saveToSupabase: async () => { }
                },
                legacy: {
                    core: coreContext.core,
                    elements: coreContext.elements,
                    selection: coreContext.selection,
                    viewport: coreContext.viewport
                }
            };
        }
    } catch (error) {
        // Context not available, continue
    }

    return null;
};

// ============================================================================
// UNIFIED HOOK IMPLEMENTATION
// ============================================================================

/**
 * 🎯 HOOK CANÔNICO useEditor
 * 
 * Este é o ÚNICO hook useEditor que deve ser usado em todo o sistema.
 * Detecta automaticamente o provider ativo e fornece interface unificada.
 */
export const useEditor = (): UnifiedEditorContext => {
    const context = detectActiveEditorContext();

    if (!context) {
        // Fornece um contexto de erro detalhado para debugging
        const errorDetails: {
            timestamp: string;
            location: string;
            availableProviders: string[];
            suggestions: string[];
        } = {
            timestamp: new Date().toISOString(),
            location: typeof window !== 'undefined' ? window.location?.href : 'server',
            availableProviders: [],
            suggestions: [
                'Verifique se o componente está dentro de um EditorProvider',
                'Use OptimizedEditorProvider para melhor performance',
                'Considere usar useEditorOptional se o contexto é opcional'
            ]
        };

        // Tentar detectar provedores disponíveis
        try {
            if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                const fiberNode = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots(1);
                errorDetails.availableProviders.push('React DevTools detectado');
            }
        } catch (e) {
            // Silently ignore
        }

        console.error('🚨 useEditor: Nenhum EditorProvider encontrado', errorDetails);

        throw new Error(
            `🚨 useEditor must be used within an EditorProvider\n\n` +
            `Providers suportados:\n` +
            `✅ OptimizedEditorProvider (recomendado)\n` +
            `⚠️  EditorProvider (legacy)\n` +
            `⚠️  EditorProviderMigrationAdapter (legacy)\n\n` +
            `Debug info: ${JSON.stringify(errorDetails, null, 2)}`
        );
    }

    return context;
};

/**
 * 🔧 HOOK OPCIONAL useEditorOptional
 * 
 * Versão opcional que retorna undefined em vez de lançar erro.
 * Útil para componentes que podem funcionar com ou sem editor.
 */
export const useEditorOptional = (): UnifiedEditorContext | undefined => {
    try {
        return useEditor();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ useEditorOptional: Editor context not available:', error);
        }
        return undefined;
    }
};

// ============================================================================
// COMPATIBILITY HOOKS
// ============================================================================

/**
 * 🔄 LEGACY COMPATIBILITY HOOKS
 * 
 * Estes hooks mantêm compatibilidade com padrões antigos
 * durante a migração. DEPRECADOS - use useEditor() diretamente.
 */

/** @deprecated Use useEditor() instead */
export const useEditorCore = () => {
    const context = useEditor();
    return context.legacy?.core || {};
};

/** @deprecated Use useEditor() instead */
export const useEditorElements = () => {
    const context = useEditor();
    return context.legacy?.elements || { elements: [], updateElement: () => { } };
};

/** @deprecated Use useEditor() instead */
export const useEditorSelection = () => {
    const context = useEditor();
    return context.legacy?.selection || { selection: null, selectedElements: [] };
};

/** @deprecated Use useEditor() instead */
export const useEditorViewport = () => {
    const context = useEditor();
    return context.legacy?.viewport || { viewport: {}, setViewport: () => { } };
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================


// Default export for convenience
export default useEditor;
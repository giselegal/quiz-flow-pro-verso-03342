/**
 * 🎯 FASE 2.3: Hook de compatibilidade legado
 * 
 * Substitui LegacyCompatibilityWrapper com hook simples que delega para EditorProviderUnified
 * Mantém compatibilidade com código antigo sem overhead de Provider adicional
 */

import { useEditor } from '@/hooks/useEditor';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { appLogger } from '@/lib/utils/appLogger';

export interface LegacyEditorAPI {
    funnelContext: FunnelContext;
    // Métodos delegados para EditorProviderUnified (compatibilidade)
    getCurrentStep: () => number;
    getStepBlocks: (step: number) => any[];
    updateBlock: (stepKey: string, blockId: string, updates: any) => Promise<void>;
    addBlock: (stepKey: string, block: any) => Promise<void>;
    removeBlock: (stepKey: string, blockId: string) => Promise<void>;
}

/**
 * Hook de compatibilidade que expõe API legada usando EditorProviderUnified
 * 
 * ✅ BENEFÍCIOS:
 * - Remove 1 nível de Provider desnecessário
 * - Mantém compatibilidade com código existente
 * - Facilita migração gradual
 * 
 * @param enableWarnings - Habilitar avisos de uso de API legada (default: false)
 * @returns API legada compatível
 */
export function useLegacyEditor(enableWarnings = false): LegacyEditorAPI {
    const editorContext = useEditor();

    if (!editorContext) {
        throw new Error('useLegacyEditor must be used within an EditorProvider');
    }

    if (enableWarnings) {
        appLogger.warn('⚠️ [LEGACY] useLegacyEditor em uso. Considere migrar para useEditor diretamente.');
    }

    return {
        funnelContext: FunnelContext.EDITOR,
        
        getCurrentStep: () => {
            return editorContext.state.currentStep;
        },

        getStepBlocks: (step: number) => {
            const stepKey = `step-${step}`;
            return editorContext.state.stepBlocks[stepKey] || [];
        },

        // Legacy API: updateBlock(stepKey, blockId, updates) -> new API: updateBlock(blockId, updates)
        updateBlock: async (_stepKey: string, blockId: string, updates: any) => {
            await editorContext.actions.updateBlock(blockId, updates);
        },

        // Legacy API: addBlock(stepKey, block) -> new API: addBlock(type) returns id
        addBlock: async (_stepKey: string, block: any) => {
            await editorContext.actions.addBlock(block.type || 'text');
        },

        // Legacy API: removeBlock(stepKey, blockId) -> new API: removeBlock(blockId)
        removeBlock: async (_stepKey: string, blockId: string) => {
            await editorContext.actions.removeBlock(blockId);
        },
    };
}

/**
 * Hook opcional que retorna null se Provider não estiver disponível
 * Útil para componentes que podem funcionar fora do editor
 */
export function useOptionalLegacyEditor(enableWarnings = false): LegacyEditorAPI | null {
    try {
        return useLegacyEditor(enableWarnings);
    } catch {
        return null;
    }
}

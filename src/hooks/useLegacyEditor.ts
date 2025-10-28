/**
 * 🎯 FASE 2.3: Hook de compatibilidade legado
 * 
 * Substitui LegacyCompatibilityWrapper com hook simples que delega para EditorProviderUnified
 * Mantém compatibilidade com código antigo sem overhead de Provider adicional
 */

import { useEditorContext } from '@/components/editor/EditorProviderUnified';
import { FunnelContext } from '@/core/contexts/FunnelContext';

export interface LegacyEditorAPI {
    funnelContext: FunnelContext;
    // Métodos delegados para EditorProviderUnified
    getCurrentStep: () => any;
    updateStep: (stepId: string, updates: any) => void;
    addStep: (step: any) => void;
    deleteStep: (stepId: string) => void;
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
    const editorContext = useEditorContext();

    if (enableWarnings) {
        console.warn(
            '⚠️ [LEGACY] useLegacyEditor em uso. Considere migrar para useEditorContext diretamente.'
        );
    }

    return {
        funnelContext: FunnelContext.EDITOR,
        
        getCurrentStep: () => {
            return editorContext.state.currentStepId 
                ? editorContext.state.steps[editorContext.state.currentStepId]
                : null;
        },

        updateStep: (stepId: string, updates: any) => {
            editorContext.actions.updateStep(stepId, updates);
        },

        addStep: (step: any) => {
            editorContext.actions.addStep(step);
        },

        deleteStep: (stepId: string) => {
            editorContext.actions.deleteStep(stepId);
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

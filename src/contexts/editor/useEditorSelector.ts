/**
 * 🎯 EDITOR SELECTOR HOOK (Sprint 1 - TK-ED-02)
 * 
 * Hook simplificado para acesso ao state do editor
 */

import { useEditor } from '@/hooks/useEditor';
import type { Block } from '@/types/editor';

interface LightweightEditorStateCompat {
    stepBlocks: Record<string, Block[]>;
    selectedBlockId: string | null;
    isLoading: boolean;
    currentStep: number;
}

type Selector<T> = (state: LightweightEditorStateCompat) => T;

/**
 * Hook para selecionar partes específicas do state do editor
 */
export function useEditorSelector<T>(selector: Selector<T>): T {
    const editor = useEditor();
    if (!editor) throw new Error('useEditorSelector must be used within EditorProvider');
    // Adaptar estrutura migrada
    const compat: LightweightEditorStateCompat = {
        stepBlocks: editor.state.stepBlocks,
        selectedBlockId: editor.state.selectedBlockId,
        isLoading: editor.state.isLoading,
        currentStep: editor.state.currentStep,
    };
    return selector(compat);
}

/**
 * Seletores pré-definidos para casos comuns
 */
export const editorSelectors = {
    stepBlocks: (state: LightweightEditorStateCompat) => state.stepBlocks,
    selectedBlockId: (state: LightweightEditorStateCompat) => state.selectedBlockId,
    isLoading: (state: LightweightEditorStateCompat) => state.isLoading,
    currentStep: (state: LightweightEditorStateCompat) => state.currentStep,
};

/**
 * Hooks especializados para casos comuns
 */
export const useEditorStepBlocks = () => useEditorSelector(editorSelectors.stepBlocks);
export const useSelectedBlockId = () => useEditorSelector(editorSelectors.selectedBlockId);
export const useEditorLoading = () => useEditorSelector(editorSelectors.isLoading);
export const useCurrentStep = () => useEditorSelector(editorSelectors.currentStep);

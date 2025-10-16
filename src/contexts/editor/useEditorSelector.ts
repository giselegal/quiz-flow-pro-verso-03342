/**
 * 🎯 EDITOR SELECTOR HOOK (Sprint 1 - TK-ED-02)
 * 
 * Hook simplificado para acesso ao state do editor
 */

import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import type { EditorState } from '@/components/editor/EditorProviderUnified';

type Selector<T> = (state: EditorState) => T;

/**
 * Hook para selecionar partes específicas do state do editor
 */
export function useEditorSelector<T>(selector: Selector<T>): T {
    const editor = useEditor();
    if (!editor) throw new Error('useEditorSelector must be used within EditorProvider');
    return selector(editor.state);
}

/**
 * Seletores pré-definidos para casos comuns
 */
export const editorSelectors = {
    stepBlocks: (state: EditorState) => state.stepBlocks,
    selectedBlockId: (state: EditorState) => state.selectedBlockId,
    isLoading: (state: EditorState) => state.isLoading,
    currentStep: (state: EditorState) => state.currentStep,
};

/**
 * Hooks especializados para casos comuns
 */
export const useEditorStepBlocks = () => useEditorSelector(editorSelectors.stepBlocks);
export const useSelectedBlockId = () => useEditorSelector(editorSelectors.selectedBlockId);
export const useEditorLoading = () => useEditorSelector(editorSelectors.isLoading);
export const useCurrentStep = () => useEditorSelector(editorSelectors.currentStep);

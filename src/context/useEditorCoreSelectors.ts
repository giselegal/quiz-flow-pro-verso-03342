import { useEditorCore } from './EditorCoreProvider';

/**
 * Hook de selectors derivados do estado core (fase incremental).
 */
export function useEditorCoreSelectors() {
    const { state } = useEditorCore();
    const progress = state.totalSteps > 0 ? Math.min(100, Math.round((state.currentStep / state.totalSteps) * 100)) : 0;
    return {
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
        stepKeys: state.stepKeys,
        hash: state.stepBlocksHash,
        progress,
        initialized: state.initialized,
        version: state.version,
        selectedBlockId: state.selectedBlockId || null
    };
}

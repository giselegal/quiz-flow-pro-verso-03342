import { useEditorCore } from './EditorCoreProvider';
import { useCallback, useMemo } from 'react';

/**
 * useCoreSelection
 * Fornece acesso e mutação para currentStep e selectedBlockId dentro do Core.
 */
export function useCoreSelection() {
    const { state, coreActions } = useEditorCore();
    const setCurrentStep = useCallback((step: number) => {
        coreActions.setCurrentStep(step);
    }, [coreActions]);
    const selectBlock = useCallback((blockId: string | null) => {
        coreActions.selectBlock(blockId);
    }, [coreActions]);

    return useMemo(() => ({
        currentStep: state.currentStep,
        selectedBlockId: state.selectedBlockId || null,
        setCurrentStep,
        selectBlock
    }), [state.currentStep, state.selectedBlockId, setCurrentStep, selectBlock]);
}

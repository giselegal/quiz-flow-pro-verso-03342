import { useEditorCore } from './EditorCoreProvider';
import { useMemo } from 'react';

export function useCoreStepDiff(step: number) {
    const { getStepDiff, state } = useEditorCore();
    const stepKey = `step-${step}`;
    return useMemo(() => getStepDiff(stepKey), [getStepDiff, stepKey, state.stepBlocksHash]);
}

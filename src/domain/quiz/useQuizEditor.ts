import { useEffect, useState, useCallback } from 'react';
import { quizEditingService, AppliedQuizState } from './QuizEditingService';

interface UseQuizEditorOptions {
    autoSave?: boolean;
}

export function useQuizEditor(opts: UseQuizEditorOptions = {}) {
    const { autoSave = false } = opts;
    const [state, setState] = useState<AppliedQuizState>(() => quizEditingService.getState());
    const [selectedStepId, setSelectedStepId] = useState<string | null>(state.steps[0]?.id || null);

    useEffect(() => {
        return quizEditingService.subscribe(s => setState(s));
    }, []);

    const selectStep = useCallback((id: string) => setSelectedStepId(id), []);

    const updateStep = useCallback((patch: any) => {
        if (!selectedStepId) return;
        quizEditingService.updateStep(selectedStepId, patch);
        if (autoSave) quizEditingService.save();
    }, [selectedStepId, autoSave]);

    const updateBlock = useCallback((blockIndex: number, patch: any) => {
        if (!selectedStepId) return;
        quizEditingService.updateBlock(selectedStepId, blockIndex, patch);
        if (autoSave) quizEditingService.save();
    }, [selectedStepId, autoSave]);

    const resetStep = useCallback(() => {
        if (!selectedStepId) return;
        quizEditingService.resetStep(selectedStepId);
    }, [selectedStepId]);

    return {
        state,
        selectedStepId,
        selectStep,
        updateStep,
        updateBlock,
        resetStep,
        save: () => quizEditingService.save(),
        publish: () => quizEditingService.publish(),
        dirty: quizEditingService.isDirty()
    };
}

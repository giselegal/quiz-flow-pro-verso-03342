import { useMemo, useState, useCallback } from 'react';
import canonicalDef from '@/domain/quiz/quiz-definition';
import { QUIZ_STEPS } from '@/data/quizSteps';

export interface UnifiedEditableStep {
    id: string;
    type: string;
    title?: string;
    questionText?: string;
    buttonText?: string;
    requiredSelections?: number;
    image?: string;
    options?: { id: string; text: string; image?: string }[];
}

interface UseUnifiedStepsAdapterOptions {
    preferCanonical?: boolean; // futuro feature flag
}

interface UseUnifiedStepsAdapterResult {
    steps: UnifiedEditableStep[];
    updateStep: (id: string, updates: Partial<UnifiedEditableStep>) => void;
    getStep: (id: string) => UnifiedEditableStep | undefined;
    dirty: boolean;
    reset: () => void;
}

/**
 * Adapter unifica fonte de steps (canonicalDef vs QUIZ_STEPS legacy) e expõe API editável simples
 * para o ModernUnifiedEditor sem acoplar ao runtime do quiz.
 */
export function useUnifiedStepsAdapter(opts: UseUnifiedStepsAdapterOptions = {}): UseUnifiedStepsAdapterResult {
    const preferCanonical = opts.preferCanonical !== false; // default true

    const baseSteps: UnifiedEditableStep[] = useMemo(() => {
        const source = preferCanonical && canonicalDef ? canonicalDef.steps : Object.entries(QUIZ_STEPS).map(([id, s]) => ({ id, ...(s as any) }));
        return source
            .filter((s: any) => s.type === 'question' || s.type === 'strategic-question' || s.type === 'intro' || s.type === 'offer')
            .map((s: any) => ({
                id: s.id,
                type: s.type,
                title: s.title,
                questionText: s.questionText,
                buttonText: s.buttonText,
                requiredSelections: s.requiredSelections,
                image: s.image,
                options: s.options
            }));
    }, [preferCanonical]);

    const [localSteps, setLocalSteps] = useState<UnifiedEditableStep[]>(baseSteps);
    const [dirty, setDirty] = useState(false);

    const updateStep = useCallback((id: string, updates: Partial<UnifiedEditableStep>) => {
        setLocalSteps(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
        setDirty(true);
    }, []);

    const getStep = useCallback((id: string) => localSteps.find(s => s.id === id), [localSteps]);

    const reset = useCallback(() => {
        setLocalSteps(baseSteps);
        setDirty(false);
    }, [baseSteps]);

    return { steps: localSteps, updateStep, getStep, dirty, reset };
}

export default useUnifiedStepsAdapter;

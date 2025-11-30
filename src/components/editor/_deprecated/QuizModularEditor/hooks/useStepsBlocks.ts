import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export interface StepLike {
    id: string;
    type: string;
    order: number;
    blocks: any[];
    [k: string]: any;
}

interface UseStepsOptions<T extends StepLike> {
    steps: T[];
    setSteps: React.Dispatch<React.SetStateAction<T[]>>;
    pushHistory?: (next: T[]) => void;
    setDirty?: (dirty: boolean) => void;
    onSelectStep?: (id: string) => void;
}

export function useStepsBlocks<T extends StepLike>({ steps, setSteps, pushHistory, setDirty, onSelectStep }: UseStepsOptions<T>) {
    const recomputeOrders = useCallback((list: T[]) => list.map((s, i) => ({ ...s, order: i + 1 })) as T[], []);

    const generateNextStepId = useCallback(() => {
        let n = 1;
        const existing = steps.map(s => s.id);
        while (true) {
            const id = `step-${String(n).padStart(2, '0')}`;
            if (!existing.includes(id)) return id;
            n++;
        }
    }, [steps]);

    const addStep = useCallback(() => {
        setSteps(prev => {
            const newId = generateNextStepId();
            const newStep: any = { id: newId, type: 'question', order: prev.length + 1, blocks: [], title: newId, options: [], nextStep: undefined };
            const next = [...prev, newStep];
            pushHistory?.(next);
            setDirty?.(true);
            onSelectStep?.(newId);
            return next;
        });
    }, [generateNextStepId, pushHistory, setDirty, onSelectStep, setSteps]);

    const moveStep = useCallback((stepId: string, direction: 'up' | 'down') => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === stepId);
            if (idx < 0) return prev;
            if (direction === 'up' && idx === 0) return prev;
            if (direction === 'down' && idx === prev.length - 1) return prev;
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            const arr = [...prev];
            const [moved] = arr.splice(idx, 1);
            arr.splice(targetIdx, 0, moved);
            const withOrders = recomputeOrders(arr);
            pushHistory?.(withOrders);
            setDirty?.(true);
            return withOrders;
        });
    }, [pushHistory, setDirty, setSteps, recomputeOrders]);

    const deleteStep = useCallback((stepId: string) => {
        setSteps(prev => {
            if (prev.length <= 1) return prev; // impedir apagar última
            const filtered = prev.filter(s => s.id !== stepId);
            if (filtered.length === prev.length) return prev;
            const remainingIds = new Set(filtered.map(s => s.id));
            const adjusted = recomputeOrders(filtered.map(s => ({ ...s, nextStep: s.nextStep && remainingIds.has(s.nextStep) ? s.nextStep : undefined })) as T[]);
            pushHistory?.(adjusted);
            setDirty?.(true);
            if (onSelectStep && stepId) {
                const prevIdx = prev.findIndex(s => s.id === stepId);
                const fallback = adjusted[Math.max(0, prevIdx - 1)] || adjusted[0];
                onSelectStep(fallback.id);
            }
            return adjusted;
        });
    }, [pushHistory, setDirty, onSelectStep, setSteps, recomputeOrders]);

    return { addStep, moveStep, deleteStep, generateNextStepId };
}

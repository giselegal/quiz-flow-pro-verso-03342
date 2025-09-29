import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { quizEditingService, AppliedQuizState } from '@/domain/quiz/QuizEditingService';
import { eventBus } from '@/core/events/eventBus';

interface QuizEditorContextValue {
    state: AppliedQuizState | null;
    loading: boolean;
    dirty: boolean;
    lastPersistedAt: string | null;
    storageMedium: string | null;
    lastReloadAt: string | null;
    lastHash: string | null;
    persistedFlash: boolean; // true por alguns segundos após persistência
    selectStep(stepId: string): void;
    updateStep(patch: any): void;
    updateBlock(blockIndex: number, patch: any): void;
    save(): void;
    publish(): void;
    updateScoring(patch: any): void;
    updateProgress(patch: any): void;
    updateOfferMapping(patch: any): void;
}

const QuizEditorContext = createContext<QuizEditorContextValue | undefined>(undefined);

export const QuizEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppliedQuizState | null>(() => quizEditingService.isInitialized() ? quizEditingService.getState() : null);
    const [selectedStep, setSelectedStep] = useState<string | null>(null);
    const [lastPersistedAt, setLastPersistedAt] = useState<string | null>(null);
    const [storageMedium, setStorageMedium] = useState<string | null>(null);
    const [lastReloadAt, setLastReloadAt] = useState<string | null>(null);
    const [lastHash, setLastHash] = useState<string | null>(null);
    const [persistedFlash, setPersistedFlash] = useState(false);

    useEffect(() => {
        const unsub = quizEditingService.subscribe(s => {
            setState(s);
            if (!selectedStep && s.steps.length) setSelectedStep(s.steps[0].id);
        });
        return unsub;
    }, [selectedStep]);

    useEffect(() => {
        const offPersist = eventBus.subscribe('quiz.overrides.persisted' as any, (e: any) => {
            setLastPersistedAt(new Date().toISOString());
            setPersistedFlash(true);
            setTimeout(() => setPersistedFlash(false), 2000);
        });
        const offReload = eventBus.subscribe('quiz.definition.reload' as any, (e: any) => {
            setLastReloadAt(new Date().toISOString());
            if ((e as any).hash) setLastHash((e as any).hash);
        });
        const offStep = eventBus.subscribe('editor.step.modified' as any, () => {
            // Poderíamos no futuro granularizar step last modified
        });
        return () => { offPersist(); offReload(); offStep(); };
    }, []);

    useEffect(() => {
        // lazy import para evitar dependência circular direta se existir
        (async () => {
            try {
                const mod = await import('@/domain/quiz/storage/QuizOverridesStorage');
                // @ts-ignore
                setStorageMedium(mod.quizOverridesStorage.getMedium());
            } catch {/* ignore */ }
        })();
    }, []);

    const value: QuizEditorContextValue = useMemo(() => ({
        state,
        loading: !state,
        dirty: quizEditingService.isDirty(),
        lastPersistedAt,
        storageMedium,
        lastReloadAt,
        lastHash,
        persistedFlash,
        selectStep: (id: string) => setSelectedStep(id),
        updateStep: (patch: any) => { if (selectedStep) quizEditingService.updateStep(selectedStep, patch); },
        updateBlock: (blockIndex: number, patch: any) => { if (selectedStep) quizEditingService.updateBlock(selectedStep, blockIndex, patch); },
        save: () => quizEditingService.save(),
        publish: () => quizEditingService.publish(),
        updateScoring: (p: any) => (quizEditingService as any).updateScoring(p),
        updateProgress: (p: any) => (quizEditingService as any).updateProgress(p),
        updateOfferMapping: (p: any) => (quizEditingService as any).updateOfferMapping(p)
    }), [state, selectedStep, lastPersistedAt, storageMedium, lastReloadAt, lastHash, persistedFlash]);

    return (
        <QuizEditorContext.Provider value={value}>
            {children}
        </QuizEditorContext.Provider>
    );
};

export function useQuizEditorContext() {
    const ctx = useContext(QuizEditorContext);
    if (!ctx) throw new Error('useQuizEditorContext deve ser usado dentro de QuizEditorProvider');
    return ctx;
}

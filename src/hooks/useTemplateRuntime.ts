import { useCallback, useEffect, useRef, useState } from 'react';
import { templateRuntimeService, PublishedSnapshot, AnswerResponse, CompleteResponse } from '@/services/TemplateRuntimeService';

interface RuntimeState {
    loading: boolean;
    error?: string;
    snapshot?: PublishedSnapshot;
    sessionId?: string;
    currentStageId?: string;
    score: number;
    outcome?: CompleteResponse['outcome'];
    branchedLast?: boolean;
}

interface UseTemplateRuntimeOptions {
    autoStart?: boolean;
    enabled?: boolean;
}

export function useTemplateRuntime(slug: string, options: UseTemplateRuntimeOptions = {}) {
    const { autoStart = true, enabled = true } = options;
    const [state, setState] = useState<RuntimeState>({ loading: true, score: 0 });
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    const safeSet = useCallback((patch: Partial<RuntimeState>) => {
        if (!mounted.current) return;
        setState(s => ({ ...s, ...patch }));
    }, []);

    // Carregar snapshot
    useEffect(() => {
        if (!enabled) return;
        safeSet({ loading: true, error: undefined });
        templateRuntimeService.getSnapshot(slug)
            .then(snapshot => {
                safeSet({ snapshot, loading: false });
                if (autoStart) {
                    start();
                }
            })
            .catch(e => safeSet({ error: e.message, loading: false }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, enabled]);

    const start = useCallback(async () => {
        try {
            safeSet({ loading: true, error: undefined });
            const res = await templateRuntimeService.start(slug);
            safeSet({ sessionId: res.sessionId, currentStageId: res.currentStageId, loading: false, score: 0, branchedLast: false, outcome: undefined });
        } catch (e: any) {
            safeSet({ error: e.message, loading: false });
        }
    }, [slug, safeSet]);

    const answer = useCallback(async (stageId: string, answers: string[]) => {
        if (!state.sessionId) throw new Error('NO_SESSION');
        try {
            safeSet({ loading: true, error: undefined });
            const res: AnswerResponse = await templateRuntimeService.answer(slug, state.sessionId, stageId, answers);
            safeSet({ currentStageId: res.nextStageId, score: res.score, branchedLast: res.branched, loading: false });
            return res;
        } catch (e: any) {
            safeSet({ error: e.message, loading: false });
            throw e;
        }
    }, [slug, state.sessionId, safeSet]);

    const complete = useCallback(async () => {
        if (!state.sessionId) throw new Error('NO_SESSION');
        try {
            safeSet({ loading: true, error: undefined });
            const res: CompleteResponse = await templateRuntimeService.complete(slug, state.sessionId);
            safeSet({ outcome: res.outcome, loading: false });
            return res;
        } catch (e: any) {
            safeSet({ error: e.message, loading: false });
            throw e;
        }
    }, [slug, state.sessionId, safeSet]);

    return {
        ...state,
        start,
        answer,
        complete,
    };
}

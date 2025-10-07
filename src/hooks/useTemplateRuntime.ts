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

    const storageKey = `runtimeSession:${slug}`;

    // Carregar snapshot
    useEffect(() => {
        if (!enabled) return;
        safeSet({ loading: true, error: undefined });
        templateRuntimeService.getSnapshot(slug)
            .then(snapshot => {
                // Restaurar sessão previamente salva (se existir) somente se snapshot corresponde
                const persisted = sessionStorage.getItem(storageKey);
                if (persisted) {
                    try {
                        const parsed = JSON.parse(persisted) as { sessionId: string; currentStageId: string; score: number };
                        safeSet({ snapshot, loading: false, sessionId: parsed.sessionId, currentStageId: parsed.currentStageId, score: parsed.score });
                        return; // não autoStart se restaurou
                    } catch {
                        sessionStorage.removeItem(storageKey);
                    }
                }
                safeSet({ snapshot, loading: false });
                if (autoStart) start();
            })
            .catch(e => safeSet({ error: e.message, loading: false }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, enabled]);

    const start = useCallback(async () => {
        try {
            safeSet({ loading: true, error: undefined });
            const res = await templateRuntimeService.start(slug);
            safeSet({ sessionId: res.sessionId, currentStageId: res.currentStageId, loading: false, score: 0, branchedLast: false, outcome: undefined });
            sessionStorage.setItem(storageKey, JSON.stringify({ sessionId: res.sessionId, currentStageId: res.currentStageId, score: 0 }));
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
            sessionStorage.setItem(storageKey, JSON.stringify({ sessionId: state.sessionId, currentStageId: res.nextStageId, score: res.score }));
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
            // manter storage para permitir visualizar resultado após reload
            return res;
        } catch (e: any) {
            safeSet({ error: e.message, loading: false });
            throw e;
        }
    }, [slug, state.sessionId, safeSet]);

    const restart = useCallback(async () => {
        sessionStorage.removeItem(storageKey);
        await start();
    }, [start, storageKey]);

    return { ...state, start, answer, complete, restart };
}

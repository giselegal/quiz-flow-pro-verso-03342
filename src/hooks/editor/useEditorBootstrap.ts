import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
import { useUnifiedCRUD } from '@/contexts';
import { editorEvents } from '@/events/editorEvents';
import { QUIZ_STEPS } from '@/data/quizSteps';

// Reusar tipo de modo localmente (evitar import circular se houver)
export type EditorMode = 'visual' | 'builder' | 'funnel' | 'headless' | 'admin-integrated' | 'quiz';

// Fases de bootstrap do editor
export type BootstrapPhase = 'parsing' | 'funnel' | 'seed' | 'ready' | 'error';

interface BootstrapParams {
    funnelId?: string | null;
    templateId?: string | null;
    mode: EditorMode;
}

interface UseEditorBootstrapResult {
    params: BootstrapParams;
    phase: BootstrapPhase;
    error: Error | null;
    progress: { step: number; total: number; label: string };
    seedApplied: boolean;
    effectiveFunnelId?: string;
    setMode: (mode: EditorMode) => void;
}

const EditorParamsSchema = z.object({
    funnel: z.string().min(1).optional(),
    template: z.string().min(1).optional(),
    mode: z.enum(['visual', 'builder', 'funnel', 'headless', 'admin-integrated', 'quiz']).optional()
});

// Parse e normaliza parâmetros da URL de forma resiliente
export function parseAndNormalizeParams(): BootstrapParams {
    if (typeof window === 'undefined') {
        return { funnelId: null, templateId: null, mode: 'visual' };
    }
    const search = window.location.search;
    const query = Object.fromEntries(new URLSearchParams(search).entries());
    const safe = EditorParamsSchema.safeParse(query);
    const path = window.location.pathname;

    let funnelId: string | null = null;
    let templateId: string | null = null;

    if (safe.success) {
        funnelId = safe.data.funnel || null;
        templateId = safe.data.template || null;
    }

    // Path /editor/:id
    if (path.startsWith('/editor/') && path.length > '/editor/'.length) {
        const identifier = path.replace('/editor/', '');
        if (!funnelId && !templateId) {
            // Heurística simples: se começa com 'template-' tratar como template
            if (/^(template-|quiz|lead|webinar|roi|npse)/i.test(identifier)) {
                templateId = identifier;
            } else {
                funnelId = identifier;
            }
        }
    }

    const mode: EditorMode = safe.success && safe.data.mode ? safe.data.mode : (funnelId ? 'quiz' : 'visual');
    return { funnelId, templateId, mode };
}

export function useEditorBootstrap(): UseEditorBootstrapResult {
    const crud = useUnifiedCRUD();
    const [phase, setPhase] = useState<BootstrapPhase>('parsing');
    const [error, setError] = useState<Error | null>(null);
    const [params, setParams] = useState<BootstrapParams>(() => parseAndNormalizeParams());
    const [seedApplied, setSeedApplied] = useState(false);
    const seedGuardRef = useRef(false);

    // Perf marks
    useEffect(() => {
        try { performance.mark('editor_bootstrap_start'); } catch { }
    }, []);

    // Parsing inicial já feito; avançar para funnel
    useEffect(() => {
        editorEvents.emit('EDITOR_BOOTSTRAP_PHASE', { phase });
        if (phase === 'parsing') {
            setPhase('funnel');
        }
    }, [phase]);

    // Carregar/criar funnel se necessário
    useEffect(() => {
        if (phase !== 'funnel') return;

        let active = true;
        (async () => {
            try {
                // Se já existe currentFunnel carregado e corresponde, avançar
                if (crud.currentFunnel?.id) {
                    setPhase('seed');
                    return;
                }
                if (params.funnelId) {
                    await crud.loadFunnel(params.funnelId).catch(() => {/* tolerar erro inicial; pode ser inexistente */ });
                    if (!active) return;
                    if (!crud.currentFunnel?.id) {
                        // Criar se não carregar
                        const created = await crud.createFunnel('Novo Funil', { templateId: params.templateId || undefined });
                        if (created?.id) {
                            setParams(p => ({ ...p, funnelId: created.id }));
                        }
                    }
                    if (!active) return;
                    setPhase('seed');
                    return;
                }
                // Sem funnelId: criar novo se template
                const created = await crud.createFunnel('Novo Funil', { templateId: params.templateId || undefined });
                if (created?.id && active) {
                    setParams(p => ({ ...p, funnelId: created.id }));
                }
                if (!active) return;
                setPhase('seed');
            } catch (e: any) {
                if (!active) return;
                setError(e instanceof Error ? e : new Error(String(e)));
                setPhase('error');
            }
        })();
        return () => { active = false; };
    }, [phase, params.funnelId, params.templateId, crud]);

    // Aplicar seed quizSteps de forma idempotente
    useEffect(() => {
        if (phase !== 'seed') return;
        if (seedGuardRef.current) {
            setPhase('ready');
            return;
        }
        const funnel = crud.currentFunnel as any;
        if (!funnel) return; // aguardar

        // Se já tem quizSteps não crescer
        if (Array.isArray(funnel.quizSteps) && funnel.quizSteps.length > 0) {
            seedGuardRef.current = true;
            setSeedApplied(false);
            setPhase('ready');
            try { performance.mark('editor_bootstrap_ready'); performance.measure('editor_TTI', 'editor_bootstrap_start', 'editor_bootstrap_ready'); } catch { }
            editorEvents.emit('EDITOR_BOOTSTRAP_READY', { funnelId: funnel.id });
            return;
        }

        try {
            const quizSeedArray = Array.isArray(QUIZ_STEPS) ? QUIZ_STEPS as any[] : Object.values(QUIZ_STEPS as any);
            funnel.quizSteps = quizSeedArray.map(s => ({ ...s }));
            seedGuardRef.current = true;
            setSeedApplied(true);
            // Salvar async sem bloquear
            if (funnel.id) {
                crud.saveFunnel().catch(err => console.warn('[bootstrap] Falha ao salvar seed inicial', err));
            }
            setPhase('ready');
            try { performance.mark('editor_bootstrap_ready'); performance.measure('editor_TTI', 'editor_bootstrap_start', 'editor_bootstrap_ready'); } catch { }
            editorEvents.emit('EDITOR_BOOTSTRAP_READY', { funnelId: funnel.id });
        } catch (e: any) {
            setError(e instanceof Error ? e : new Error(String(e)));
            setPhase('error');
            editorEvents.emit('EDITOR_BOOTSTRAP_ERROR', { error: String(e) });
        }
    }, [phase, crud]);

    // Progresso derivado da phase
    const progress = useMemo(() => {
        const map: Record<BootstrapPhase, { step: number; label: string }> = {
            parsing: { step: 1, label: 'Analisando parâmetros' },
            funnel: { step: 2, label: 'Carregando funil' },
            seed: { step: 3, label: 'Aplicando seed' },
            ready: { step: 4, label: 'Pronto' },
            error: { step: 4, label: 'Erro' }
        };
        const total = 4;
        const { step, label } = map[phase];
        return { step, total, label };
    }, [phase]);

    const setMode = (mode: EditorMode) => setParams(p => ({ ...p, mode }));

    return {
        params,
        phase,
        error,
        progress,
        seedApplied,
        effectiveFunnelId: params.funnelId || crud.currentFunnel?.id,
        setMode
    };
}

export default useEditorBootstrap;

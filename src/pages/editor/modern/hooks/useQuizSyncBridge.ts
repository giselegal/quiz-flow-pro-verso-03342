import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { getSupabase } from '@/supabase/config';
import { QuizEditorSyncService, QuizStateLike } from '@/components/editor/services/QuizEditorSyncService';
import { QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';

interface UseQuizSyncBridgeParams {
    extractedInfo: { templateId?: string | null; funnelId?: string | null; type?: string };
    unifiedEditor: any; // tipagem interna futura
    crudContext: any;   // tipagem interna futura
}

interface QuizBridgeState {
    active: boolean;            // indica se o modo quiz está ativo
    currentStepKey?: string;    // step-1
    scores?: Record<string, number>;
    answersCount?: number;
    service?: QuizEditorSyncService;
    applyAnswer?: (stepKey: string, answerIds: string[]) => void; // exposto diretamente
}

/**
 * useQuizSyncBridge
 * Faz a ponte entre o EditorProvider / Unified Editor e o QuizEditorSyncService.
 * Inicializa o serviço quando o template for o quiz estilo (ou detectar funil quiz no futuro).
 */
export default function useQuizSyncBridge({ extractedInfo, unifiedEditor, crudContext }: UseQuizSyncBridgeParams): QuizBridgeState {
    const [state, setState] = useState<QuizBridgeState>({ active: false });
    const serviceRef = useRef<QuizEditorSyncService | null>(null);
    const persistTimer = useRef<any>(null);
    const lastPersistHash = useRef<string>('');

    // Determinar se devemos ativar o modo quiz
    const isQuizTemplate = extractedInfo?.templateId === QUIZ_ESTILO_TEMPLATE_ID;

    // Inicialização lazy do serviço
    useEffect(() => {
        if (!isQuizTemplate) return;
        if (serviceRef.current) return; // já inicializado

        const svc = new QuizEditorSyncService({ enableScoreRecompute: true });

        // Montar adapter mínimo do editor para blocks (interface EditorLikeAPI)
        const editorAdapter = {
            getStepBlocks(stepKey: string) {
                return unifiedEditor?.getBlocksByStep?.(stepKey) || [];
            },
            updateBlock(stepKey: string, blockId: string, updates: Record<string, any>) {
                return unifiedEditor?.updateBlock?.(stepKey, blockId, updates) ?? Promise.resolve();
            },
            listAllSteps() {
                return unifiedEditor?.listSteps?.() || [];
            },
            markDirty() {
                unifiedEditor?.markDirty?.();
            }
        };

        svc.attachEditor(editorAdapter);

        // Tentar carregar estado persistido antes de inicializar padrão
        (async () => {
            try {
                const supabase = getSupabase();
                const funnelId = extractedInfo.funnelId || unifiedEditor?.funnel?.id || null;
                if (supabase && funnelId) {
                    const { data, error } = await supabase
                        .from('quiz_editor_states')
                        .select('state_json')
                        .eq('funnel_id', funnelId)
                        .maybeSingle();
                    if (!error && data?.state_json) {
                        svc.loadQuizState(data.state_json as QuizStateLike);
                        return; // carregado persistido
                    }
                }
            } catch {
                // silencioso
            }
            const initial: QuizStateLike = {
                currentStep: 'step-1',
                answers: {},
                scores: { styleA: 0, styleB: 0 },
                userProfile: {}
            };
            svc.loadQuizState(initial);
        })();

        // Subscription
        const unsub = svc.subscribe(() => {
            const exported = svc.exportQuizState();
            setState(prev => ({
                ...prev,
                active: true,
                currentStepKey: exported?.currentStep,
                scores: exported?.scores,
                answersCount: Object.values(exported?.answers || {}).reduce((acc, arr) => acc + (arr?.length || 0), 0),
                service: svc
            }));

            // Debounce persistência
            if (persistTimer.current) clearTimeout(persistTimer.current);
            persistTimer.current = setTimeout(() => {
                if (!exported) return;
                const hash = JSON.stringify(exported);
                if (hash === lastPersistHash.current) return; // evitar persist redundante
                lastPersistHash.current = hash;
                persistQuizState(exported).catch(() => { });
            }, 600);
        });

        // Emit initial state
        const exported = svc.exportQuizState();
        setState({
            active: true,
            currentStepKey: exported?.currentStep,
            scores: exported?.scores,
            answersCount: 0,
            service: svc
        });

        serviceRef.current = svc;
        return () => {
            unsub();
        };
    }, [isQuizTemplate, unifiedEditor]);

    // Persistência Supabase (upsert tabela quiz_editor_states)
    const persistQuizState = useCallback(async (quizState: QuizStateLike) => {
        const supabase = getSupabase();
        if (!supabase) return; // ambiente sem supabase
        try {
            const funnelId = extractedInfo.funnelId || unifiedEditor?.funnel?.id || null;
            if (!funnelId) return; // sem chave para persistir
            await supabase.from('quiz_editor_states').upsert({
                funnel_id: funnelId,
                template_id: extractedInfo.templateId,
                state_json: quizState,
                updated_at: new Date().toISOString()
            }, { onConflict: 'funnel_id' });
        } catch (e) {
            // Log silencioso
            if ((import.meta as any)?.env?.DEV) {
                console.warn('[useQuizSyncBridge] Falha ao persistir estado quiz', e);
            }
        }
    }, [extractedInfo.funnelId, extractedInfo.templateId, unifiedEditor]);

    // Sincronizar mudança de passo do editor (se unifiedEditor expõe currentStep/stepKey)
    useEffect(() => {
        if (!isQuizTemplate) return;
        const svc = serviceRef.current; if (!svc) return;
        const editorStep = unifiedEditor?.currentStepKey || unifiedEditor?.currentStep || null;
        if (editorStep) {
            svc.setCurrentStep(editorStep);
        }
    }, [isQuizTemplate, unifiedEditor?.currentStepKey, unifiedEditor?.currentStep]);

    // API auxiliar: aplicar resposta
    const applyAnswer = useCallback((stepKey: string, answerIds: string[]) => {
        const svc = serviceRef.current; if (!svc) return;
        svc.applyAnswer(stepKey, answerIds);
    }, []);

    return useMemo(() => ({
        ...state,
        service: serviceRef.current || undefined,
        applyAnswer
    } as QuizBridgeState), [state, applyAnswer]);
}

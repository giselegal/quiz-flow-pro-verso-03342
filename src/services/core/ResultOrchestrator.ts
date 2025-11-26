import { ResultEngine } from './ResultEngine';
import { StorageService } from './StorageService';
import EVENTS from '@/core/constants/events';
import { quizSupabaseService } from '@/services/aliases';
import { isUUID } from '@/core/utils/id';
import { toCanonicalAny } from './adapters';
import { accumulateScores as accumulateCanonicalScores } from './CanonicalScorer';
import { STYLE_TIEBREAK_ORDER, stabilizeScoresOrder } from '@/lib/utils/styleKeywordMap';
import { appLogger } from '@/lib/utils/appLogger';

export interface OrchestrateOptions {
    selectionsByQuestion: Record<string, string[]>;
    weightQuestions?: number;
    userName?: string;
    persistToSupabase?: boolean;
    sessionId?: string | null;
}

// Contrato sucinto
// input: selections (+ optional weights), userName, persist flag, sessionId
// output: payload persistido no StorageService, id de resultado (se salvo) e total
export const ResultOrchestrator = {
    run: async (opts: OrchestrateOptions) => {
        const { selectionsByQuestion, weightQuestions, persistToSupabase, sessionId } = opts;

        // c\x1blculo
        let scores: Record<string, number> = {};
        let total = 0;

        // 1) Tentar sempre o motor por prefixos/ids (funciona com ids como "natural_q1")
        const primaryTry = ResultEngine.computeScoresFromSelections(selectionsByQuestion, { weightQuestions });
        scores = primaryTry.scores;
        total = primaryTry.total;

        // 2) Se nada foi pontuado (total 0), fazer fallback canônico por template
        const summed = Object.values(scores).reduce((a, b) => a + b, 0);
        if (!summed) {
            try {
                // 🔄 Migrado para novo sistema de funis (lazy loader)
                const { loadFunnel } = await import('@/templates/loaders/dynamic');
                const funnel = await loadFunnel('quiz21StepsComplete', { validate: true, useCache: true });
                // Montar mapa de steps; se vazio, carregar steps 1..21 (fallback)
                const steps: Record<string, any[]> = {};
                const total = (funnel.metadata as any)?.totalSteps || 21;
                const existing = funnel.steps || {} as Record<string, any[]>;
                if (Object.keys(existing).length > 0) {
                    for (const [k, v] of Object.entries(existing)) steps[k] = v as any[];
                } else {
                    for (let i = 1; i <= total; i++) {
                        const id = `step-${String(i).padStart(2, '0')}`;
                        try {
                            const mod = await import(`@/templates/funnels/quiz21Steps/steps/${id}.ts`);
                            steps[id] = (mod as any).default ?? mod;
                        } catch {
                            // tolerar ausência de step
                        }
                    }
                }
                const canonical = toCanonicalAny(steps);
                const canonTotals = accumulateCanonicalScores(canonical, selectionsByQuestion);
                const compat: Record<string, string> = {
                    natural: 'Natural',
                    classico: 'Clássico',
                    contemporaneo: 'Contemporâneo',
                    elegante: 'Elegante',
                    romantico: 'Romântico',
                    sexy: 'Sexy',
                    dramatico: 'Dramático',
                    criativo: 'Criativo',
                };
                const mapped: Record<string, number> = {};
                for (const [code, pts] of Object.entries(canonTotals)) {
                    const friendly = compat[code] || code;
                    mapped[friendly] = (mapped[friendly] || 0) + (typeof pts === 'number' ? pts : 0);
                }
                for (const name of STYLE_TIEBREAK_ORDER) {
                    if (mapped[name] == null) mapped[name] = 0;
                }
                scores = mapped;
                // atualizar total local
                const newTotal = Object.values(mapped).reduce((a, b) => a + b, 0) || 1;
                total = newTotal;
            } catch (e) {
                // manter pontuação zero se adapter falhar; payload lida com isso
            }
        }
        // Aplicar ordenação determinística por desempate
        scores = stabilizeScoresOrder(scores);
        const name = (opts.userName || '').trim() || StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName') || '';
        const payload = ResultEngine.toPayload(scores, total, name);

        // 🔎 Snapshot de diagnóstico no localStorage para análise (não afeta UX)
        try {
            const debug = {
                ts: new Date().toISOString(),
                // total bruto (antes de toPayload)
                selectionsKeys: Object.keys(selectionsByQuestion || {}),
                sample: Object.fromEntries(
                    Object.entries(selectionsByQuestion || {})
                        .slice(0, 3)
                        .map(([k, v]) => [k, (v || []).slice(0, 3)]),
                ),
                scores,
                total,
                primary: (payload as any)?.primaryStyle,
            };
            StorageService.safeSetJSON('debug_orchestrator_last', debug);
        } catch { /* noop */ }
        // persist local
        ResultEngine.persist(payload);
        StorageService.safeSetString('quizUserName', name);
        try { window.dispatchEvent(new Event(EVENTS.QUIZ_RESULT_UPDATED)); } catch { }

        let resultId: string | undefined;
        // persist remoto (guardado) se for sessão UUID válida
        if (persistToSupabase && sessionId && isUUID(sessionId)) {
            try {
                resultId = await quizSupabaseService.saveQuizResult({
                    sessionId,
                    resultType: 'style-profile',
                    resultTitle: (payload as any).primaryStyle?.style || 'Resultado',
                    resultDescription: `Perfil principal: ${(payload as any).primaryStyle?.style || ''}`,
                    resultData: payload,
                    recommendation: undefined,
                    nextSteps: [],
                });
            } catch (e) {
                appLogger.warn('[ResultOrchestrator] Falha ao persistir no Supabase:', { data: [e] });
            }
        }
        return { payload, total, resultId } as const;
    },
};

export default ResultOrchestrator;

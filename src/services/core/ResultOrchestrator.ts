import { ResultEngine } from './ResultEngine';
import { StorageService } from './StorageService';
import EVENTS from '@/core/constants/events';
import { quizSupabaseService } from '@/services/quizSupabaseService';
import { isUUID } from '@/core/utils/id';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { toCanonicalAny } from './adapters';
import { accumulateScores as accumulateCanonicalScores } from './CanonicalScorer';
import { STYLE_TIEBREAK_ORDER, stabilizeScoresOrder } from '@/utils/styleKeywordMap';

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

        // Detectar se selections usam prefixos (ex.: "natural_q1...")
        const STYLE_PREFIXES = [
            'natural', 'classico', 'contemporaneo', 'elegante', 'romantico', 'sexy', 'dramatico', 'criativo'
        ];
        const hasPrefixBased = Object.values(selectionsByQuestion || {}).some(list =>
            (list || []).some(id => {
                const key = String(id || '').toLowerCase();
                return STYLE_PREFIXES.some(p => key.startsWith(p + '_'));
            })
        );

        // clculo
    let scores: Record<string, number> = {};
        let total = 0;

        if (hasPrefixBased) {
            const res = ResultEngine.computeScoresFromSelections(selectionsByQuestion, { weightQuestions });
            scores = res.scores;
            total = res.total;
        } else {
            // Fallback can3nico: usar adapters + CanonicalScorer
            try {
                const canonical = toCanonicalAny(QUIZ_STYLE_21_STEPS_TEMPLATE);
                const canonTotals = accumulateCanonicalScores(canonical, selectionsByQuestion);
                // Mapear c3digos para nomes amig3veis esperados pelo ResultEngine
                // manter compat com códigos canônicos conhecidos
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
                // Garantir todas as chaves com zero (ordenação consistente)
                for (const name of STYLE_TIEBREAK_ORDER) {
                    if (mapped[name] == null) mapped[name] = 0;
                }
                scores = mapped;
                total = Object.values(mapped).reduce((a, b) => a + b, 0) || 1;
            } catch (e) {
                // Como fallback final, manter lgica antiga para n3o quebrar
                const res = ResultEngine.computeScoresFromSelections(selectionsByQuestion, { weightQuestions });
                scores = res.scores;
                total = res.total;
            }
        }
        // Aplicar ordenação determinística por desempate
        scores = stabilizeScoresOrder(scores);
    const name = (opts.userName || '').trim() || StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName') || '';
    const payload = ResultEngine.toPayload(scores, total, name);
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
                console.warn('[ResultOrchestrator] Falha ao persistir no Supabase:', e);
            }
        }
        return { payload, total, resultId } as const;
    },
};

export default ResultOrchestrator;

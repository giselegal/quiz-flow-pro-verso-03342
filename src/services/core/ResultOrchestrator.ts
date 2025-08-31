import { ResultEngine } from './ResultEngine';
import { StorageService } from './StorageService';
import EVENTS from '@/core/constants/events';
import { quizSupabaseService } from '@/services/quizSupabaseService';
import { isUUID } from '@/core/utils/id';

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
        // cálculo
        const { scores, total } = ResultEngine.computeScoresFromSelections(
            selectionsByQuestion,
            { weightQuestions }
        );
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

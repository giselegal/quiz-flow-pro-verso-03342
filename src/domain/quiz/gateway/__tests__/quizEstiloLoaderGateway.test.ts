import { describe, it, expect, vi, beforeEach } from 'vitest';
import { quizEstiloLoaderGateway } from '../QuizEstiloLoaderGateway';
import * as publishedLoader from '@/domain/quiz/quizEstiloPublishedFirstLoader';
import * as runtimeDef from '@/domain/quiz/runtime';

function resetGateway() {
    quizEstiloLoaderGateway.invalidate();
}

describe('quizEstiloLoaderGateway', () => {
    beforeEach(() => {
        resetGateway();
        vi.restoreAllMocks();
    });

    it('usa published-first quando disponível', async () => {
        vi.spyOn(publishedLoader, 'loadQuizEstiloCanonical').mockResolvedValue({
            questions: [{ title: 'Pergunta 1', options: ['A', 'B'] }]
        } as any);
        vi.spyOn(runtimeDef, 'getQuizDefinition').mockReturnValue(null as any);

        const def = await quizEstiloLoaderGateway.load();
        expect(def.source).toBe('published');
        expect(def.steps.length).toBeGreaterThan(0);
        expect(def.steps[0].id).toBe('step-1');
    });

    it('fallback para runtime quando published-first falha', async () => {
        vi.spyOn(publishedLoader, 'loadQuizEstiloCanonical').mockRejectedValue(new Error('fail pf'));
        vi.spyOn(runtimeDef, 'getQuizDefinition').mockReturnValue({
            steps: [{ id: 'step-1', type: 'question', title: 'Runtime Q1', options: [] }],
            progress: { countedStepIds: ['step-1'] },
            version: 'runtime-x'
        } as any);

        const def = await quizEstiloLoaderGateway.load();
        expect(def.source).toBe('runtime');
        expect(def.steps[0].title).toContain('Runtime');
    });

    it('fallback legacy quando published-first e runtime indisponíveis', async () => {
        vi.spyOn(publishedLoader, 'loadQuizEstiloCanonical').mockRejectedValue(new Error('pf fail'));
        vi.spyOn(runtimeDef, 'getQuizDefinition').mockReturnValue(null as any);

        const def = await quizEstiloLoaderGateway.load();
        expect(def.source).toBe('legacy-fallback');
        expect(def.steps.length).toBeGreaterThan(0);
    });
});

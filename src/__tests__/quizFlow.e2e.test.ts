// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { renderHook, act } from '@testing-library/react';
import { StorageService } from '@/services/core/StorageService';
import caktoquizQuestions from '@/data/caktoquizQuestions';

/**
 * E2E leve do núcleo lógico: coleta de nome, respostas q1–q10, cálculo e persistência do resultado.
 * Não renderiza UI; valida Storage e shape do resultado.
 */

describe('Quiz Flow core (name + results)', () => {
    beforeEach(() => {
        try {
            // limpar chaves conhecidas
            localStorage.clear();
        } catch { }
    });

    it('captura userName, calcula e persiste quizResult com primaryStyle e percentage', async () => {
        const { result } = renderHook(() => useQuizLogic());

        // 1) definir nome do usuário (Etapa 1)
        act(() => {
            result.current.setUserNameFromInput('Alice');
        });

        expect(StorageService.safeGetString('userName')).toBe('Alice');

        // 2) responder questões q1–q10 (uma opção por pergunta suficiente para pontuar)
        const pick = (qid: string) => caktoquizQuestions.find((q: any) => q.id === qid)!;

        act(() => {
            // Escolhas tendendo para "natural" para validar agregação
            result.current.answerQuestion('q1', pick('q1').options.find((o: any) => o.style === 'natural')!.id);
            result.current.answerQuestion('q2', pick('q2').options.find((o: any) => o.style === 'natural')!.id);
            result.current.answerQuestion('q3', pick('q3').options.find((o: any) => o.style === 'natural') ? pick('q3').options.find((o: any) => o.style === 'natural')!.id : pick('q3').options[1].id);
            result.current.answerQuestion('q4', pick('q4').options.find((o: any) => o.style === 'natural')!.id);
            result.current.answerQuestion('q5', pick('q5').options.find((o: any) => o.style === 'natural')!.id);
            result.current.answerQuestion('q6', pick('q6').options.find((o: any) => o.style === 'natural')!.id);
            result.current.answerQuestion('q7', pick('q7').options.find((o: any) => o.style === 'natural') ? pick('q7').options.find((o: any) => o.style === 'natural')!.id : pick('q7').options[1].id);
            result.current.answerQuestion('q8', pick('q8').options.find((o: any) => o.style === 'natural')!.id);
            result.current.answerQuestion('q9', pick('q9').options.find((o: any) => o.style === 'natural')!.id);
            result.current.answerQuestion('q10', pick('q10').options.find((o: any) => o.style === 'natural')!.id);

            // concluir
            result.current.completeQuiz();
        });

        const quizResult = StorageService.safeGetJSON<any>('quizResult');
        expect(quizResult).toBeTruthy();
        expect(quizResult.primaryStyle).toBeTruthy();

        // Deve conter percentuais coerentes (0-100) e nome do usuário nos metadados
        expect(typeof quizResult.primaryStyle.percentage).toBe('number');
        expect(quizResult.primaryStyle.percentage).toBeGreaterThanOrEqual(0);
        expect(quizResult.primaryStyle.percentage).toBeLessThanOrEqual(100);

        const name = (quizResult.userData && quizResult.userData.name) || '';
        expect(name).toBe('Alice');
    });
});

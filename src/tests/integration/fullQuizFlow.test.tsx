import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizState } from '@/hooks/useQuizState';
import { QUIZ_STEPS } from '@/data/quizSteps';

/**
 * 🔗 TESTE DE INTEGRAÇÃO - FLUXO COMPLETO 21 ETAPAS
 * Valida navegação linear, preenchimento mínimo para avançar e presença de resultado/oferta.
 */

describe('Full Quiz Flow (21 steps)', () => {
    it('deve percorrer do step-01 ao step-21 com dados mínimos', () => {
        const { result } = renderHook(() => useQuizState());

        // Helper para acessar estado atual
        const get = () => result.current;

        // Step 01 - Intro: definir nome
        act(() => {
            get().setUserName('Teste');
            get().nextStep();
        });
        expect(get().currentStep).toBe('step-02');

        // Steps 2-11: perguntas principais (simular 3 seleções fictícias cada)
        for (let i = 2; i <= 11; i++) {
            const stepId = `step-${String(i).padStart(2, '0')}`;
            act(() => {
                get().addAnswer(stepId, ['natural', 'classico', 'elegante']);
                get().nextStep();
            });
        }
        expect(get().currentStep).toBe('step-12');

        // Step 12 transition → avançar
        act(() => { get().nextStep(); });
        expect(get().currentStep).toBe('step-13');

        // Steps 13-18 estratégicas: 1 resposta cada
        for (let i = 13; i <= 18; i++) {
            const stepId = `step-${i}`;
            act(() => {
                get().addAnswer(stepId, ['resp']); // usa addAnswer pois adaptador salva em answers
                get().nextStep();
            });
        }
        expect(get().currentStep).toBe('step-19');

        // Step 19 transition-result
        act(() => { get().nextStep(); });
        expect(get().currentStep).toBe('step-20');

        // Calcular resultado antes de avançar
        act(() => { get().calculateResult(); });
        expect(get().resultStyle).toBeTruthy();

        // Step 20 → Resultado
        act(() => { get().nextStep(); });
        expect(get().currentStep).toBe('step-21');

        // Oferta final: garantir que chave de oferta derivável
        act(() => { get().addStrategicAnswer('Qual desses resultados você mais gostaria de alcançar?', 'montar-looks-facilidade'); });
        const offerKey = get().getOfferKey?.();
        expect(typeof offerKey).toBe('string');
    });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { calculateAndSaveQuizResult } from '@/utils/quizResultCalculator';
import { StorageService } from '@/services/core/StorageService';

// Helper para limpar chaves usadas pelo calculador
const clearStorage = () => {
    try {
        localStorage.clear();
    } catch { }
    StorageService.safeRemove('quizResult');
    StorageService.safeRemove('userSelections');
    StorageService.safeRemove('quizAnswers');
    StorageService.safeRemove('unifiedQuizData');
};

describe('quizResultCalculator smoke', () => {
    beforeEach(() => {
        clearStorage();
    });

    afterEach(() => {
        clearStorage();
    });

    it('calcula e salva resultado usando seleções prefixadas e nome do usuário', async () => {
        // Simular seleções no formato esperado (prefix-based)
        const selections: Record<string, string[]> = {
            'step-2': ['natural_q2_a'],
            'step-3': ['natural_q3_b'],
            'step-4': ['classico_q4_a'],
            'step-5': ['natural_q5_c'],
            'step-6': ['contemporaneo_q6_b'],
            'step-7': ['natural_q7_a'],
            'step-8': ['elegante_q8_a'],
            'step-9': ['natural_q9_b'],
            'step-10': ['romantico_q10_c'],
            'step-11': ['natural_q11_a'],
        };

        // Simular dados legados esperados na migração
        StorageService.safeSetJSON('userSelections', selections);
        StorageService.safeSetJSON('quizAnswers', { userName: 'Teste' });

        const result = await calculateAndSaveQuizResult();

        // Deve existir um resultado e ser persistido
        expect(result).toBeTruthy();
        const persisted = StorageService.safeGetJSON<any>('quizResult');
        expect(persisted).toBeTruthy();

        // Verificações básicas do payload
        expect(persisted.primaryStyle).toBeTruthy();
        expect(typeof persisted.primaryStyle.style).toBe('string');
        expect(persisted.scores).toBeTruthy();

        // Como natural tem maioria nas seleções, idealmente ele é o principal
        // (não forçamos igualdade rígida para não acoplar a política; apenas checamos que percentuais fazem sentido)
        expect(persisted.primaryStyle.percentage).toBeGreaterThan(0);
    });
});

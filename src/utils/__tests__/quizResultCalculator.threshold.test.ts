import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock StorageService e unifiedQuizStorage
vi.mock('@/services/core/StorageService', () => ({
    StorageService: {
        safeGetString: vi.fn(() => null),
        safeGetJSON: vi.fn(() => null),
        safeSetJSON: vi.fn(() => true),
    },
}));

vi.mock('@/services/core/UnifiedQuizStorage', () => ({
    unifiedQuizStorage: {
        loadData: vi.fn(() => ({ selections: {}, formData: {}, metadata: { currentStep: 1, completedSteps: [], startedAt: '', lastUpdated: '', version: '2.0' } })),
        hasEnoughDataForResult: vi.fn(() => false),
        saveResult: vi.fn(() => true),
    },
}));

describe('quizResultCalculator threshold', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('não persiste fallback quando dados insuficientes', async () => {
        const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
        const result = await calculateAndSaveQuizResult();
        expect(result).toBeDefined();
        // fallback retornado mas não persistido (não chama saveResult)
        const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
        expect(unifiedQuizStorage.saveResult).not.toHaveBeenCalled();
    });
});

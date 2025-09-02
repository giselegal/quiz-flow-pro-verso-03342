import { describe, it, expect, vi, beforeEach } from 'vitest';

// Variável de controle do cenário de progresso
let currentStep = 19;

// Mock do StorageService para evitar uso de localStorage real
vi.mock('@/services/core/StorageService', () => ({
  StorageService: {
    safeGetString: vi.fn(() => null),
    safeGetJSON: vi.fn(() => null),
    safeSetJSON: vi.fn(() => true),
    safeRemove: vi.fn(() => true),
  },
}));

// Mock do UnifiedQuizStorage com gating dependente de currentStep
vi.mock('@/services/core/UnifiedQuizStorage', () => ({
  unifiedQuizStorage: {
    loadData: vi.fn(() => {
      // criar um número de seleções coerente com o passo
      const selections: Record<string, string[]> = {};
      const count = currentStep >= 20 ? 9 : 6; // 6 respostas no passo 19, 9 no 20
      for (let i = 2; i < 2 + count; i++) {
        selections[`step-${i}`] = [`natural_q${i}_a`];
      }
      return {
        selections,
        formData: { userName: 'Teste Usuário' },
        metadata: { currentStep, completedSteps: [], startedAt: '', lastUpdated: '', version: '2.0' },
      } as any;
    }),
    hasEnoughDataForResult: vi.fn(() => currentStep >= 20),
    saveResult: vi.fn(() => true),
    getDataStats: vi.fn(() => ({ selectionsCount: currentStep >= 20 ? 9 : 6, formDataCount: 1 })),
  },
}));

// Mock do ResultOrchestrator para retornar um payload determinístico
vi.mock('@/services/core/ResultOrchestrator', () => ({
  ResultOrchestrator: {
    run: vi.fn(async () => ({
      payload: {
        version: 'v1',
        primaryStyle: { style: 'Natural', category: 'Natural', score: 10, percentage: 85 },
        secondaryStyles: [ { style: 'Clássico', category: 'Clássico', score: 7, percentage: 65 } ],
        scores: { Natural: 10, 'Clássico': 7, 'Romântico': 4, 'Dramático': 3, 'Criativo': 1 },
        totalQuestions: currentStep >= 20 ? 10 : 6,
        userData: { name: 'Teste Usuário' },
      },
      total: 25,
      resultId: undefined,
    })),
  },
}));

describe('quizResultCalculator gating 19→20', () => {
  beforeEach(() => {
    currentStep = 19;
    vi.resetModules();
  });

  it('no passo 19: retorna fallback e NÃO persiste nem chama orquestrador', async () => {
    const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
    const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
    const { ResultOrchestrator } = await import('@/services/core/ResultOrchestrator');
    const { StorageService } = await import('@/services/core/StorageService');

    const result = await calculateAndSaveQuizResult();

    expect(result).toBeTruthy();
    // é um fallback: percent normalmente ~80 e estilo Natural pelo createFallbackResult
    expect(result.primaryStyle).toBeTruthy();
    expect(typeof result.primaryStyle.percentage).toBe('number');

    // gating: não deve chamar orquestrador
    expect(ResultOrchestrator.run).not.toHaveBeenCalled();
    // fallback NÃO é persistido quando dados insuficientes
    expect(unifiedQuizStorage.saveResult).not.toHaveBeenCalled();
    // e também não deve gravar quizResult no StorageService
    expect(StorageService.safeSetJSON).not.toHaveBeenCalledWith('quizResult', expect.anything());
  });

  it('no passo 20: calcula com orquestrador e persiste no unificado', async () => {
    currentStep = 20;
    const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
    const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
    const { ResultOrchestrator } = await import('@/services/core/ResultOrchestrator');

    const result = await calculateAndSaveQuizResult();

    expect(ResultOrchestrator.run).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
    expect(result.primaryStyle.style).toBe('Natural');

    // deve persistir quando há dados suficientes
    expect(unifiedQuizStorage.saveResult).toHaveBeenCalledTimes(1);
    expect(unifiedQuizStorage.saveResult).toHaveBeenCalledWith(expect.objectContaining({ primaryStyle: expect.any(Object) }));
  });
});

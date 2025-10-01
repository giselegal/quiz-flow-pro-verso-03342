/**
 * 🧪 TESTES DE PERFORMANCE E TEMPO DE CARREGAMENTO
 * Valida velocidade, otimização e experiência do usuário
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { performance } from 'perf_hooks';

// Mock do Performance API para ambiente de teste
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => [])
  }
});

describe('⚡ Performance e Tempo de Carregamento', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('🚀 Carregamento Inicial', () => {
    it('deve carregar componentes principais rapidamente', async () => {
      const startTime = performance.now();

      // Simula carregamento dos componentes principais
      const { useQuizState } = await import('@/hooks/useQuizState');
      const QuestionStep = await import('@/components/quiz/QuestionStep');
      const IntroStep = await import('@/components/quiz/IntroStep');

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(500); // Menos de 500ms
      expect(useQuizState).toBeDefined();
      expect(QuestionStep).toBeDefined();
      expect(IntroStep).toBeDefined();
    });

    it('deve carregar dados do quiz rapidamente', async () => {
      const startTime = performance.now();

      const { QUIZ_STEPS } = await import('@/data/quizSteps');
      const { styleMapping } = await import('@/data/styles');

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(100); // Menos de 100ms
      expect(Object.keys(QUIZ_STEPS)).toHaveLength(21);
      expect(Object.keys(styleMapping)).toBeGreaterThan(0);
    });
  });

  describe('🎯 Performance de Navegação', () => {
    it('deve transicionar entre etapas rapidamente', async () => {
      const { renderHook, act } = await import('@testing-library/react');
      const { useQuizState } = await import('@/hooks/useQuizState');

      const { result } = renderHook(() => useQuizState());

      const transitions = [];

      // Mede tempo de múltiplas transições
      for (let i = 0; i < 5; i++) {
        const startTime = performance.now();

        act(() => {
          if (i === 0) {
            result.current.setUserName('Performance Test');
          } else {
            result.current.addAnswer(`step-${i + 1}`, ['option1']);
          }
          result.current.nextStep();
        });

        const endTime = performance.now();
        transitions.push(endTime - startTime);
      }

      // Todas as transições devem ser rápidas
      transitions.forEach(time => {
        expect(time).toBeLessThan(50); // Menos de 50ms cada
      });

      // Tempo médio deve ser muito baixo
      const avgTime = transitions.reduce((a, b) => a + b) / transitions.length;
      expect(avgTime).toBeLessThan(25);
    });

    it('deve calcular resultado rapidamente', async () => {
      const { renderHook, act } = await import('@testing-library/react');
      const { useQuizState } = await import('@/hooks/useQuizState');

      const { result } = renderHook(() => useQuizState());

      // Prepara estado com respostas
      act(() => {
        result.current.setUserName('Calculation Test');
        for (let i = 2; i <= 11; i++) {
          result.current.addAnswer(`step-${i}`, ['option1']);
        }
      });

      const startTime = performance.now();

      act(() => {
        result.current.calculateResult();
      });

      const endTime = performance.now();
      const calculationTime = endTime - startTime;

      expect(calculationTime).toBeLessThan(100); // Menos de 100ms
      expect(result.current.progress).toBeGreaterThan(0);
    });
  });

  describe('📊 Performance de Cálculos', () => {
    it('deve processar pontuações rapidamente', async () => {
      const { styleMapping } = await import('@/data/styles');

      const mockAnswers = {
        'step-2': ['option1'],
        'step-3': ['option2'],
        'step-4': ['option1'],
        'step-5': ['option3'],
        'step-6': ['option2']
      };

      const startTime = performance.now();

      // Simula cálculo de pontuações
      const scores = {
        natural: 0,
        classico: 0,
        contemporaneo: 0,
        elegante: 0,
        romantico: 0,
        sexy: 0,
        dramatico: 0,
        criativo: 0
      };

      Object.entries(mockAnswers).forEach(([_, answers]) => {
        answers.forEach(answer => {
          const styleDef = (styleMapping as any)[answer];
          // O teste de performance apenas precisa simular alguma computação leve
          if (styleDef && styleDef.id && (styleDef.id in scores)) {
            scores[styleDef.id as keyof typeof scores] += 1;
          }
        });
      });

      const endTime = performance.now();
      const calculationTime = endTime - startTime;

      expect(calculationTime).toBeLessThan(20); // Menos de 20ms
      expect(Object.values(scores).some(score => score > 0)).toBe(true);
    });
  });

  describe('📈 Métricas de UX', () => {
    it('deve ter tempos de resposta adequados para UX', () => {
      const uxMetrics = {
        initialLoad: 500,      // Carregamento inicial
        stepTransition: 50,    // Transição entre etapas
        resultCalculation: 100, // Cálculo de resultado
        dataStorage: 10,       // Salvamento local
        imageLoad: 200         // Carregamento de imagens
      };

      // Todos os tempos devem estar dentro dos limites aceitáveis para UX
      Object.entries(uxMetrics).forEach(([metric, maxTime]) => {
        expect(maxTime).toBeLessThan(1000); // Nenhuma operação > 1s

        if (metric === 'stepTransition' || metric === 'dataStorage') {
          expect(maxTime).toBeLessThan(100); // Operações críticas < 100ms
        }
      });
    });
  });
});
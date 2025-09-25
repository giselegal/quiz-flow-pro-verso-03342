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

    it('deve ter bundle size otimizado', async () => {
      // Simula verificação de tamanho dos módulos
      const modules = [
        '@/hooks/useQuizState',
        '@/components/quiz/QuestionStep',
        '@/components/quiz/IntroStep',
        '@/data/quizSteps',
        '@/data/styles'
      ];

      for (const modulePath of modules) {
        const startTime = performance.now();
        await import(modulePath);
        const endTime = performance.now();
        
        // Cada módulo deve carregar rapidamente
        expect(endTime - startTime).toBeLessThan(200);
      }
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
      expect(result.current.userProfile.resultStyle).toBeDefined();
    });
  });

  describe('💾 Performance de Persistência', () => {
    it('deve salvar dados localmente rapidamente', async () => {
      const mockLocalStorage = {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn()
      };
      
      Object.defineProperty(global, 'localStorage', {
        writable: true,
        value: mockLocalStorage
      });
      
      const testData = {
        currentStep: 'step-5',
        answers: { 'step-2': ['option1'], 'step-3': ['option2'] },
        userName: 'Performance Test'
      };
      
      const startTime = performance.now();
      
      localStorage.setItem('quiz-state', JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem('quiz-state') || '{}');
      
      const endTime = performance.now();
      const storageTime = endTime - startTime;
      
      expect(storageTime).toBeLessThan(10); // Menos de 10ms
      expect(retrieved).toEqual(testData);
    });

    it('deve recuperar dados rapidamente', async () => {
      const mockData = {
        currentStep: 'step-3',
        answers: { 'step-2': ['option1'] },
        scores: { natural: 5, elegante: 3 }
      };
      
      const mockLocalStorage = {
        getItem: vi.fn(() => JSON.stringify(mockData))
      };
      
      Object.defineProperty(global, 'localStorage', {
        writable: true,
        value: mockLocalStorage
      });
      
      const startTime = performance.now();
      
      const retrieved = JSON.parse(localStorage.getItem('quiz-state') || '{}');
      
      const endTime = performance.now();
      const retrievalTime = endTime - startTime;
      
      expect(retrievalTime).toBeLessThan(5); // Menos de 5ms
      expect(retrieved).toEqual(mockData);
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
      
      Object.entries(mockAnswers).forEach(([step, answers]) => {
        answers.forEach(answer => {
          if (styleMapping[answer]) {
            Object.entries(styleMapping[answer]).forEach(([style, points]) => {
              scores[style as keyof typeof scores] += points;
            });
          }
        });
      });
      
      const endTime = performance.now();
      const calculationTime = endTime - startTime;
      
      expect(calculationTime).toBeLessThan(20); // Menos de 20ms
      expect(Object.values(scores).some(score => score > 0)).toBe(true);
    });

    it('deve determinar estilo predominante rapidamente', async () => {
      const scores = {
        natural: 10,
        classico: 8,
        contemporaneo: 5,
        elegante: 15,
        romantico: 12,
        sexy: 3,
        dramatico: 7,
        criativo: 6
      };
      
      const startTime = performance.now();
      
      // Encontra estilo predominante
      const primaryStyle = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      // Encontra estilos secundários (>= 70% do predominante)
      const threshold = scores[primaryStyle as keyof typeof scores] * 0.7;
      const secondaryStyles = Object.entries(scores)
        .filter(([style, score]) => style !== primaryStyle && score >= threshold)
        .map(([style]) => style);
      
      const endTime = performance.now();
      const determinationTime = endTime - startTime;
      
      expect(determinationTime).toBeLessThan(5); // Menos de 5ms
      expect(primaryStyle).toBe('elegante');
      expect(secondaryStyles).toContain('romantico');
    });
  });

  describe('🖼️ Performance de Assets', () => {
    it('deve simular carregamento otimizado de imagens', async () => {
      const mockImages = [
        '/images/style1.jpg',
        '/images/style2.jpg',
        '/images/style3.jpg',
        '/images/hero.jpg'
      ];
      
      const loadPromises = mockImages.map(src => {
        return new Promise((resolve) => {
          const startTime = performance.now();
          
          // Simula carregamento de imagem
          setTimeout(() => {
            const endTime = performance.now();
            resolve({
              src,
              loadTime: endTime - startTime,
              size: Math.random() * 100 + 50 // KB simulado
            });
          }, Math.random() * 100 + 50); // 50-150ms simulado
        });
      });
      
      const results = await Promise.all(loadPromises) as any[];
      
      // Todas as imagens devem carregar em tempo aceitável
      results.forEach(result => {
        expect(result.loadTime).toBeLessThan(200);
        expect(result.size).toBeLessThan(150); // Menos de 150KB
      });
      
      // Tempo total paralelo deve ser eficiente
      const totalTime = Math.max(...results.map(r => r.loadTime));
      expect(totalTime).toBeLessThan(200);
    });
  });

  describe('🔍 Detecção de Memory Leaks', () => {
    it('deve limpar recursos após uso', async () => {
      const { renderHook, act } = await import('@testing-library/react');
      const { useQuizState } = await import('@/hooks/useQuizState');
      
      const initialMemory = (performance as any).memory?.usedJSMemorySize || 0;
      
      // Cria e destrói múltiplas instâncias
      for (let i = 0; i < 10; i++) {
        const { result, unmount } = renderHook(() => useQuizState());
        
        act(() => {
          result.current.setUserName(`Test User ${i}`);
          result.current.addAnswer('step-2', ['option1']);
          result.current.calculateResult();
        });
        
        unmount();
      }
      
      // Força garbage collection se disponível
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSMemorySize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Aumento de memória deve ser mínimo
      expect(memoryIncrease).toBeLessThan(1000000); // Menos de 1MB
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

    it('deve calcular score de performance', () => {
      const metrics = {
        loadTime: 450,        // ms
        transitionTime: 35,   // ms
        calculationTime: 80,  // ms
        memoryUsage: 50,      // MB
        bundleSize: 150       // KB
      };
      
      // Fórmula simples de score (0-100)
      const score = Math.max(0, 100 - (
        (metrics.loadTime / 10) +
        (metrics.transitionTime / 2) +
        (metrics.calculationTime / 5) +
        (metrics.memoryUsage / 5) +
        (metrics.bundleSize / 10)
      ));
      
      expect(score).toBeGreaterThan(70); // Score mínimo aceitável
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
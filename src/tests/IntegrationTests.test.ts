/**
 * 🧪 TESTE DE INTEGRAÇÃO COMPLETO
 *
 * Testa todo o sistema integrado: Supabase + CORE + Adaptador + Feature Flags
 * Valida compatibilidade e performance dos dois sistemas
 */

import { useSupabaseCompatibleQuiz } from '@/adapters/SupabaseToUnifiedAdapter';
import { useQuizFlow } from '@/components/core/QuizFlow';
import { QuizDataService } from '@/services/core/QuizDataService';
import { useSystemValidation } from '@/testing/SystemValidation';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';

describe('🎯 Integração Completa do Sistema', () => {
  beforeEach(() => {
    // Limpar localStorage/sessionStorage antes de cada teste
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('🔄 Sistema Core Unificado', () => {
    test('deve inicializar corretamente', () => {
      const { result } = renderHook(() => useQuizFlow());

      expect(result.current.quizState.currentStep).toBe(1);
      expect(result.current.quizState.isCompleted).toBe(false);
      expect(result.current.quizState.answers).toEqual({});
    });

    test('deve navegar entre etapas', () => {
      const { result } = renderHook(() => useQuizFlow());

      act(() => {
        result.current.actions.navigateToStep(5);
      });

      expect(result.current.quizState.currentStep).toBe(5);
    });

    test('deve salvar respostas', () => {
      const { result } = renderHook(() => useQuizFlow());

      act(() => {
        result.current.actions.answerScoredQuestion('q1', {
          value: 'teste',
          scores: { styleA: 3 },
        });
      });

      expect(result.current.quizState.answers['q1']).toEqual({
        value: 'teste',
        scores: { styleA: 3 },
      });
    });

    test('deve calcular resultado final', () => {
      const { result } = renderHook(() => useQuizFlow());

      // Adicionar algumas respostas
      act(() => {
        result.current.actions.answerScoredQuestion('q1', { scores: { styleA: 5, styleB: 1 } });
        result.current.actions.answerScoredQuestion('q2', { scores: { styleA: 4, styleB: 2 } });
        result.current.actions.generateResult();
      });

      expect(result.current.quizState.quizResult).toBeDefined();
      expect(result.current.quizState.isCompleted).toBe(true);
    });
  });

  describe('🔗 Adaptador de Compatibilidade', () => {
    test('deve simular interface do Supabase', () => {
      const { result } = renderHook(() => useSupabaseCompatibleQuiz());

      expect(result.current.session).toBeDefined();
      expect(result.current.actions).toBeDefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('deve manter compatibilidade de métodos', () => {
      const { result } = renderHook(() => useSupabaseCompatibleQuiz());

      act(() => {
        result.current.actions.submitAnswer('test_q', { value: 'test' });
      });

      expect(result.current.session.responses['test_q']).toEqual({ value: 'test' });
    });

    test('deve calcular resultado via adaptador', () => {
      const { result } = renderHook(() => useSupabaseCompatibleQuiz());

      act(() => {
        result.current.actions.submitAnswer('q1', { scores: { styleA: 5 } });
        result.current.actions.calculateResult();
      });

      expect(result.current.session.result).toBeDefined();
      expect(result.current.session.isCompleted).toBe(true);
    });
  });

  describe('🎛️ Feature Flags', () => {
    test('deve carregar flags do ambiente', () => {
      const { result } = renderHook(() => useFeatureFlags());

      expect(result.current.flags).toBeDefined();
      expect(typeof result.current.getFlag).toBe('function');
    });

    test('deve alternar sistemas via flags', () => {
      const { result } = renderHook(() => useFeatureFlags());

      act(() => {
        result.current.setFlag('useUnifiedQuizSystem', true);
      });

      expect(result.current.shouldUseUnifiedSystem()).toBe(true);
    });

    test('deve resetar flags', () => {
      const { result } = renderHook(() => useFeatureFlags());

      act(() => {
        result.current.setFlag('useUnifiedQuizSystem', true);
        result.current.resetFlags();
      });

      // Após reset, deve voltar ao padrão do ambiente
      expect(result.current.flags).toBeDefined();
    });
  });

  describe('🧪 Sistema de Validação', () => {
    test('deve executar suite de validação', async () => {
      const { result } = renderHook(() => useSystemValidation());

      let report;
      await act(async () => {
        report = await result.current.runValidationSuite();
      });

      expect(report).toBeDefined();
      expect(report.totalTests).toBeGreaterThan(0);
      expect(report.compatibilityScore).toBeGreaterThanOrEqual(0);
      expect(report.compatibilityScore).toBeLessThanOrEqual(100);
    });
  });

  describe('📊 Serviços Core', () => {
    test('QuizDataService deve carregar dados', () => {
      const service = QuizDataService.getInstance();
      const template = service.getQuizTemplate();

      expect(template).toBeDefined();
      expect(template.metadata).toBeDefined();
      expect(template.steps).toBeDefined();
      expect(template.steps.length).toBeGreaterThan(0);
    });

    test('deve validar respostas', () => {
      const service = QuizDataService.getInstance();
      const validation = service.validateAnswer('q1', { value: 'test' });

      expect(validation).toBeDefined();
      expect(typeof validation.isValid).toBe('boolean');
    });
  });

  describe('⚡ Testes de Performance', () => {
    test('sistema Core deve ser rápido', () => {
      const start = performance.now();

      const { result } = renderHook(() => useQuizFlow());

      act(() => {
        // Simular 10 respostas
        for (let i = 1; i <= 10; i++) {
          result.current.actions.answerScoredQuestion(`q${i}`, {
            scores: { styleA: Math.random() * 5 },
          });
        }
        result.current.actions.generateResult();
      });

      const end = performance.now();
      const duration = end - start;

      // Deve completar em menos de 100ms
      expect(duration).toBeLessThan(100);
    });

    test('adaptador deve adicionar overhead mínimo', () => {
      const coreStart = performance.now();
      const { result: coreResult } = renderHook(() => useQuizFlow());
      const coreEnd = performance.now();

      const adapterStart = performance.now();
      const { result: adapterResult } = renderHook(() => useSupabaseCompatibleQuiz());
      const adapterEnd = performance.now();

      const coreDuration = coreEnd - coreStart;
      const adapterDuration = adapterEnd - adapterStart;

      // Adaptador deve adicionar menos de 50% de overhead
      expect(adapterDuration).toBeLessThan(coreDuration * 1.5);
    });
  });

  describe('💾 Persistência de Dados', () => {
    test('deve salvar estado no localStorage', () => {
      const { result } = renderHook(() => useQuizFlow());

      act(() => {
        result.current.actions.answerScoredQuestion('test_q', { value: 'test_value' });
      });

      // Verificar se foi salvo
      const saved = localStorage.getItem('quiz_unified_state');
      expect(saved).toBeDefined();

      const state = JSON.parse(saved!);
      expect(state.answers.test_q).toEqual({ value: 'test_value' });
    });

    test('deve restaurar estado do localStorage', () => {
      // Pré-popular localStorage
      const initialState = {
        currentStep: 5,
        answers: { q1: { value: 'saved_answer' } },
        isCompleted: false,
      };
      localStorage.setItem('quiz_unified_state', JSON.stringify(initialState));

      const { result } = renderHook(() => useQuizFlow());

      expect(result.current.quizState.currentStep).toBe(5);
      expect(result.current.quizState.answers.q1).toEqual({ value: 'saved_answer' });
    });
  });

  describe('🔄 Migração Entre Sistemas', () => {
    test('deve manter dados ao alternar sistemas', () => {
      // Usar sistema unificado
      const { result: unifiedResult } = renderHook(() => useQuizFlow());

      act(() => {
        unifiedResult.current.actions.answerScoredQuestion('migration_test', {
          value: 'test_data',
        });
      });

      // Alternar para adaptador (simula sistema Supabase)
      const { result: adapterResult } = renderHook(() => useSupabaseCompatibleQuiz());

      // Dados devem estar disponíveis
      expect(adapterResult.current.session.responses['migration_test']).toEqual({
        value: 'test_data',
      });
    });
  });
});

/**
 * 🧪 Testes de Integração E2E (End-to-End)
 */
describe('🎯 Testes End-to-End', () => {
  test('fluxo completo: inicialização → navegação → respostas → resultado', async () => {
    const { result } = renderHook(() => useQuizFlow());

    // 1. Verificar inicialização
    expect(result.current.quizState.currentStep).toBe(1);

    // 2. Navegar pelas etapas respondendo
    for (let step = 1; step <= 5; step++) {
      act(() => {
        result.current.actions.navigateToStep(step);
        result.current.actions.answerScoredQuestion(`q${step}`, {
          scores: { styleA: Math.random() * 5, styleB: Math.random() * 5 },
        });
      });
    }

    // 3. Gerar resultado
    act(() => {
      result.current.actions.generateResult();
    });

    // 4. Verificar resultado final
    expect(result.current.quizState.isCompleted).toBe(true);
    expect(result.current.quizState.quizResult).toBeDefined();
    expect(result.current.quizState.quizResult.primaryStyle).toBeDefined();
  });

  test('compatibilidade completa entre sistemas', async () => {
    // Executar mesmo fluxo nos dois sistemas
    const unifiedResults = [];
    const adapterResults = [];

    // Sistema Unificado
    const { result: unifiedResult } = renderHook(() => useQuizFlow());
    for (let i = 1; i <= 3; i++) {
      act(() => {
        unifiedResult.current.actions.answerScoredQuestion(`q${i}`, { scores: { styleA: i * 2 } });
      });
    }
    act(() => {
      unifiedResult.current.actions.generateResult();
    });
    unifiedResults.push(unifiedResult.current.quizState);

    // Sistema Adaptador (Supabase-compatível)
    const { result: adapterResult } = renderHook(() => useSupabaseCompatibleQuiz());
    for (let i = 1; i <= 3; i++) {
      act(() => {
        adapterResult.current.actions.submitAnswer(`q${i}`, { scores: { styleA: i * 2 } });
      });
    }
    act(() => {
      adapterResult.current.actions.calculateResult();
    });
    adapterResults.push(adapterResult.current.session);

    // Comparar resultados
    const unified = unifiedResults[0];
    const adapted = adapterResults[0];

    expect(unified.isCompleted).toBe(adapted.isCompleted);
    expect(Object.keys(unified.answers)).toEqual(Object.keys(adapted.responses));
  });
});

export default {
  // Export para uso em outros testes
  testQuizFlow: () => renderHook(() => useQuizFlow()),
  testAdapter: () => renderHook(() => useSupabaseCompatibleQuiz()),
  testFlags: () => renderHook(() => useFeatureFlags()),
};

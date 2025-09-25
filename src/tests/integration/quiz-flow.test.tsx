/**
 * 🧪 TESTES DE INTEGRAÇÃO DO FLUXO COMPLETO DO QUIZ
 * Valida navegação através das 21 etapas, cálculo de resultado e personalização
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizState } from '@/hooks/useQuizState';

// Mock do router para navegação
vi.mock('wouter', () => ({
  useLocation: () => ['/quiz', vi.fn()],
  useRoute: () => [true, {}]
}));

describe('🎯 Fluxo Completo do Quiz (21 Etapas)', () => {
  let hook: any;

  beforeEach(() => {
    const { result } = renderHook(() => useQuizState());
    hook = result;
  });

  describe('📋 Navegação Sequencial (Etapas 1-21)', () => {
    it('deve navegar através de todas as etapas principais', async () => {
      // Etapa 1: Introdução
      expect(hook.current.currentStep).toBe('step-1');
      
      act(() => {
        hook.current.setUserName('Maria Silva');
        hook.current.nextStep();
      });

      // Etapas 2-11: Perguntas principais
      for (let step = 2; step <= 11; step++) {
        expect(hook.current.currentStep).toBe(`step-${step}`);
        
        act(() => {
          hook.current.addAnswer(`step-${step}`, ['option1']);
          hook.current.nextStep();
        });
      }

      // Etapa 12: Transição
      expect(hook.current.currentStep).toBe('step-12');
      
      act(() => {
        hook.current.nextStep();
      });

      // Etapas 13-18: Perguntas estratégicas
      for (let step = 13; step <= 18; step++) {
        expect(hook.current.currentStep).toBe(`step-${step}`);
        
        act(() => {
          hook.current.addStrategicAnswer(`step-${step}`, 'strategic-answer');
          hook.current.nextStep();
        });
      }

      // Etapa 19: Transição para resultado
      expect(hook.current.currentStep).toBe('step-19');
      
      act(() => {
        hook.current.nextStep();
      });

      // Etapa 20: Resultado
      expect(hook.current.currentStep).toBe('step-20');
    });

    it('deve calcular progresso corretamente durante navegação', () => {
      expect(hook.current.progress).toBe(0);

      // Avança 5 etapas
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.nextStep(); // step-2
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.nextStep(); // step-3
        hook.current.addAnswer('step-3', ['option1']);
        hook.current.nextStep(); // step-4
        hook.current.addAnswer('step-4', ['option1']);
        hook.current.nextStep(); // step-5
      });

      // Progresso deve ser 20% (4/20 * 100)
      expect(hook.current.progress).toBe(20);
    });
  });

  describe('🎯 Validação de Etapas', () => {
    it('deve bloquear avanço sem nome na etapa 1', () => {
      expect(hook.current.canProceed).toBe(false);
      
      act(() => {
        hook.current.nextStep();
      });
      
      // Deve permanecer na etapa 1
      expect(hook.current.currentStep).toBe('step-1');
    });

    it('deve bloquear avanço sem resposta nas perguntas', () => {
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.nextStep(); // vai para step-2
      });

      expect(hook.current.canProceed).toBe(false);
      
      act(() => {
        hook.current.nextStep(); // não deve avançar
      });
      
      expect(hook.current.currentStep).toBe('step-2');
    });

    it('deve permitir avanço após completar requisitos', () => {
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.nextStep();
        hook.current.addAnswer('step-2', ['option1']);
      });

      expect(hook.current.canProceed).toBe(true);
      
      act(() => {
        hook.current.nextStep();
      });
      
      expect(hook.current.currentStep).toBe('step-3');
    });
  });

  describe('🏆 Cálculo de Resultado Completo', () => {
    it('deve calcular estilo predominante baseado nas respostas', () => {
      // Simula respostas que favorecem estilo elegante
      act(() => {
        hook.current.setUserName('Maria');
        
        // Responde todas as perguntas principais
        for (let step = 2; step <= 11; step++) {
          hook.current.addAnswer(`step-${step}`, ['elegante-option']);
        }
        
        hook.current.calculateResult();
      });

      expect(hook.current.userProfile.resultStyle).toBeDefined();
      expect(hook.current.userProfile.resultStyle.length).toBeGreaterThan(0);
    });

    it('deve identificar estilos secundários', () => {
      act(() => {
        hook.current.setUserName('Maria');
        
        // Mix de respostas para gerar estilos secundários
        hook.current.addAnswer('step-2', ['elegante-option']);
        hook.current.addAnswer('step-3', ['romantico-option']);
        hook.current.addAnswer('step-4', ['classico-option']);
        hook.current.addAnswer('step-5', ['elegante-option']);
        hook.current.addAnswer('step-6', ['romantico-option']);
        
        hook.current.calculateResult();
      });

      expect(Array.isArray(hook.current.userProfile.secondaryStyles)).toBe(true);
      expect(hook.current.userProfile.secondaryStyles.length).toBeGreaterThan(0);
    });
  });

  describe('🎨 Personalização de Ofertas', () => {
    it('deve gerar chave de oferta baseada em respostas estratégicas', () => {
      const strategicAnswers = {
        'step-13': 'answer1',
        'step-14': 'answer2',
        'step-15': 'answer3',
        'step-16': 'answer4',
        'step-17': 'answer5',
        'step-18': 'answer6'
      };

      act(() => {
        Object.entries(strategicAnswers).forEach(([step, answer]) => {
          hook.current.addStrategicAnswer(step, answer);
        });
      });

      const offerKey = hook.current.getOfferKey();
      expect(typeof offerKey).toBe('string');
      expect(offerKey.length).toBeGreaterThan(0);
    });

    it('deve ter ofertas diferentes para respostas estratégicas diferentes', () => {
      const { result: hook1 } = renderHook(() => useQuizState());
      const { result: hook2 } = renderHook(() => useQuizState());

      act(() => {
        // Primeiro conjunto de respostas estratégicas
        hook1.current.addStrategicAnswer('step-13', 'answer1');
        hook1.current.addStrategicAnswer('step-14', 'answer2');
        
        // Segundo conjunto diferente
        hook2.current.addStrategicAnswer('step-13', 'answer3');
        hook2.current.addStrategicAnswer('step-14', 'answer4');
      });

      const offerKey1 = hook1.current.getOfferKey();
      const offerKey2 = hook2.current.getOfferKey();

      expect(offerKey1).not.toBe(offerKey2);
    });
  });

  describe('🔄 Navegação Bidirecional', () => {
    it('deve permitir voltar e manter respostas', () => {
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.nextStep();
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.nextStep();
        hook.current.addAnswer('step-3', ['option2']);
        hook.current.previousStep(); // volta para step-2
      });

      expect(hook.current.currentStep).toBe('step-2');
      expect(hook.current.answers['step-2']).toEqual(['option1']);
      expect(hook.current.answers['step-3']).toEqual(['option2']);
    });

    it('deve permitir alterar respostas e recalcular', () => {
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.nextStep();
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.nextStep();
        hook.current.previousStep();
        hook.current.addAnswer('step-2', ['option2']); // altera resposta
      });

      expect(hook.current.answers['step-2']).toEqual(['option2']);
    });
  });

  describe('💾 Persistência de Estado', () => {
    it('deve manter estado consistente durante toda a sessão', () => {
      const userName = 'Maria Silva';
      const step2Answer = ['natural-option'];
      const strategicAnswer = 'business-focused';

      act(() => {
        hook.current.setUserName(userName);
        hook.current.nextStep();
        hook.current.addAnswer('step-2', step2Answer);
        hook.current.nextStep();
        hook.current.nextStep();
        // ... avança até questões estratégicas
        hook.current.addStrategicAnswer('step-13', strategicAnswer);
      });

      // Verifica consistência
      expect(hook.current.userProfile.userName).toBe(userName);
      expect(hook.current.answers['step-2']).toEqual(step2Answer);
      expect(hook.current.userProfile.strategicAnswers['step-13']).toBe(strategicAnswer);
    });
  });

  describe('🔧 Cenários de Erro', () => {
    it('deve lidar com dados de etapa inválidos', () => {
      expect(() => {
        act(() => {
          hook.current.addAnswer('step-invalid', ['option1']);
        });
      }).not.toThrow();
    });

    it('deve resetar estado completamente', () => {
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.nextStep();
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.addStrategicAnswer('step-13', 'strategic');
        hook.current.resetQuiz();
      });

      expect(hook.current.currentStep).toBe('step-1');
      expect(hook.current.userProfile.userName).toBe('');
      expect(Object.keys(hook.current.answers)).toHaveLength(0);
      expect(Object.keys(hook.current.userProfile.strategicAnswers)).toHaveLength(0);
    });
  });
});
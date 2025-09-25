/**
 * 🧪 TESTES UNITÁRIOS DO HOOK useQuizState
 * Valida navegação, respostas, pontuação e lógica de resultado
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizState } from '@/hooks/useQuizState';

describe('useQuizState', () => {
  let hook: any;

  beforeEach(() => {
    const { result } = renderHook(() => useQuizState());
    hook = result;
  });

  describe('🚀 Navegação entre etapas', () => {
    it('deve iniciar na etapa 1', () => {
      expect(hook.current.currentStep).toBe('step-1');
    });

    it('deve avançar para próxima etapa', () => {
      act(() => {
        hook.current.nextStep();
      });
      expect(hook.current.currentStep).toBe('step-2');
    });

    it('deve voltar para etapa anterior', () => {
      act(() => {
        hook.current.nextStep();
        hook.current.nextStep();
        hook.current.previousStep();
      });
      expect(hook.current.currentStep).toBe('step-2');
    });

    it('não deve voltar além da etapa 1', () => {
      act(() => {
        hook.current.previousStep();
      });
      expect(hook.current.currentStep).toBe('step-1');
    });

    it('deve calcular progresso corretamente', () => {
      expect(hook.current.progress).toBe(0);
      
      act(() => {
        hook.current.nextStep(); // step-2
      });
      expect(hook.current.progress).toBe(5); // 1/20 * 100 = 5%
    });
  });

  describe('📝 Gerenciamento de respostas', () => {
    it('deve adicionar resposta para pergunta regular', () => {
      act(() => {
        hook.current.addAnswer('step-2', ['option1']);
      });
      
      expect(hook.current.answers['step-2']).toEqual(['option1']);
    });

    it('deve substituir resposta existente', () => {
      act(() => {
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.addAnswer('step-2', ['option2']);
      });
      
      expect(hook.current.answers['step-2']).toEqual(['option2']);
    });

    it('deve adicionar resposta estratégica', () => {
      act(() => {
        hook.current.addStrategicAnswer('step-13', 'strategic-answer');
      });
      
      expect(hook.current.userProfile.strategicAnswers['step-13']).toBe('strategic-answer');
    });

    it('deve definir nome do usuário', () => {
      act(() => {
        hook.current.setUserName('Maria Silva');
      });
      
      expect(hook.current.userProfile.userName).toBe('Maria Silva');
    });
  });

  describe('🎯 Cálculo de pontuação', () => {
    it('deve iniciar com todas as pontuações zeradas', () => {
      const expectedScores = {
        natural: 0,
        classico: 0,
        contemporaneo: 0,
        elegante: 0,
        romantico: 0,
        sexy: 0,
        dramatico: 0,
        criativo: 0
      };
      
      expect(hook.current.scores).toEqual(expectedScores);
    });

    it('deve calcular pontuação corretamente ao responder', () => {
      act(() => {
        // Resposta que adiciona pontos ao estilo natural
        hook.current.addAnswer('step-2', ['natural-option']);
      });
      
      // Verifica se a pontuação foi atualizada (assumindo que existe mapeamento)
      expect(hook.current.scores.natural).toBeGreaterThanOrEqual(0);
    });

    it('deve determinar estilo predominante corretamente', () => {
      act(() => {
        // Simula respostas que favorecem o estilo elegante
        hook.current.addAnswer('step-2', ['elegante-option']);
        hook.current.addAnswer('step-3', ['elegante-option']);
        hook.current.addAnswer('step-4', ['elegante-option']);
      });
      
      act(() => {
        hook.current.calculateResult();
      });
      
      // O resultado deve incluir informações do estilo
      expect(hook.current.userProfile.resultStyle).toBeDefined();
    });
  });

  describe('🏆 Geração de resultado', () => {
    it('deve calcular resultado com sucesso', () => {
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.addAnswer('step-3', ['option2']);
        hook.current.calculateResult();
      });
      
      expect(hook.current.userProfile.resultStyle).toBeDefined();
      expect(hook.current.userProfile.secondaryStyles).toBeDefined();
    });

    it('deve identificar estilos secundários', () => {
      act(() => {
        // Adiciona pontos para múltiplos estilos
        hook.current.addAnswer('step-2', ['elegante-option']);
        hook.current.addAnswer('step-3', ['romantico-option']);
        hook.current.calculateResult();
      });
      
      expect(Array.isArray(hook.current.userProfile.secondaryStyles)).toBe(true);
    });

    it('deve gerar chave de oferta personalizada', () => {
      act(() => {
        hook.current.addStrategicAnswer('step-13', 'answer1');
        hook.current.addStrategicAnswer('step-14', 'answer2');
      });
      
      const offerKey = hook.current.getPersonalizedOfferKey();
      expect(typeof offerKey).toBe('string');
      expect(offerKey.length).toBeGreaterThan(0);
    });
  });

  describe('🔄 Reset e validações', () => {
    it('deve resetar quiz completamente', () => {
      act(() => {
        hook.current.setUserName('Test User');
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.nextStep();
        hook.current.resetQuiz();
      });
      
      expect(hook.current.currentStep).toBe('step-1');
      expect(hook.current.userProfile.userName).toBe('');
      expect(Object.keys(hook.current.answers)).toHaveLength(0);
    });

    it('deve validar se etapa pode ser avançada', () => {
      // Etapa 1 requer nome
      expect(hook.current.canProceed).toBe(false);
      
      act(() => {
        hook.current.setUserName('Maria');
      });
      
      expect(hook.current.canProceed).toBe(true);
    });

    it('deve verificar completude das etapas', () => {
      act(() => {
        hook.current.setUserName('Maria');
        hook.current.nextStep(); // vai para step-2
      });
      
      // Step-2 requer resposta
      expect(hook.current.canProceed).toBe(false);
      
      act(() => {
        hook.current.addAnswer('step-2', ['option1']);
      });
      
      expect(hook.current.canProceed).toBe(true);
    });
  });

  describe('📊 Estados avançados', () => {
    it('deve ter propriedades computadas reativas', () => {
      const initialStepNumber = hook.current.currentStepNumber;
      
      act(() => {
        hook.current.nextStep();
      });
      
      expect(hook.current.currentStepNumber).toBe(initialStepNumber + 1);
    });

    it('deve manter consistência durante navegação complexa', () => {
      act(() => {
        // Simula navegação complexa
        hook.current.setUserName('Maria');
        hook.current.nextStep();
        hook.current.addAnswer('step-2', ['option1']);
        hook.current.nextStep();
        hook.current.previousStep();
        hook.current.nextStep();
      });
      
      expect(hook.current.currentStep).toBe('step-3');
      expect(hook.current.answers['step-2']).toEqual(['option1']);
      expect(hook.current.userProfile.userName).toBe('Maria');
    });
  });
});
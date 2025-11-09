/**
 * 🧪 Testes para FlowCore
 * 
 * Testa funções de mapeamento de etapas e auto-avanço
 */

import { describe, it, expect } from 'vitest';
import { FlowCore } from '@/services/core/FlowCore';

describe('FlowCore', () => {
  describe('mapStepToQuestionId', () => {
    it('deve mapear etapa 2 para q1', () => {
      expect(FlowCore.mapStepToQuestionId(2)).toBe('q1');
    });

    it('deve mapear etapa 11 para q10', () => {
      expect(FlowCore.mapStepToQuestionId(11)).toBe('q10');
    });

    it('deve mapear etapas intermediárias corretamente', () => {
      expect(FlowCore.mapStepToQuestionId(3)).toBe('q2');
      expect(FlowCore.mapStepToQuestionId(5)).toBe('q4');
      expect(FlowCore.mapStepToQuestionId(8)).toBe('q7');
    });

    it('deve retornar null para etapa 1 (fora do range)', () => {
      expect(FlowCore.mapStepToQuestionId(1)).toBeNull();
    });

    it('deve retornar null para etapa 12 (fora do range)', () => {
      expect(FlowCore.mapStepToQuestionId(12)).toBeNull();
    });

    it('deve retornar null para etapa 0', () => {
      expect(FlowCore.mapStepToQuestionId(0)).toBeNull();
    });

    it('deve retornar null para números negativos', () => {
      expect(FlowCore.mapStepToQuestionId(-1)).toBeNull();
    });

    it('deve retornar null para números muito grandes', () => {
      expect(FlowCore.mapStepToQuestionId(100)).toBeNull();
    });
  });

  describe('shouldAutoAdvance', () => {
    describe('quando isValid é false', () => {
      it('não deve auto-avançar mesmo com configs habilitadas', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: false,
          stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 1000 },
          blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 500 },
        });

        expect(result.proceed).toBe(false);
      });

      it('deve retornar delay padrão de 1500ms', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: false,
        });

        expect(result.delay).toBe(1500);
      });
    });

    describe('quando isValid é true', () => {
      it('deve auto-avançar quando blockConfig.autoAdvanceOnComplete é true', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          blockConfig: { autoAdvanceOnComplete: true },
        });

        expect(result.proceed).toBe(true);
      });

      it('deve auto-avançar quando stepConfig.autoAdvanceOnComplete é true', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: true },
        });

        expect(result.proceed).toBe(true);
      });

      it('não deve auto-avançar quando ambos configs são false', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: false },
          blockConfig: { autoAdvanceOnComplete: false },
        });

        expect(result.proceed).toBe(false);
      });

      it('não deve auto-avançar quando nenhuma config está presente', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
        });

        expect(result.proceed).toBe(false);
      });
    });

    describe('prioridade de configuração', () => {
      it('blockConfig deve ter prioridade sobre stepConfig para autoAdvanceOnComplete', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: false },
          blockConfig: { autoAdvanceOnComplete: true },
        });

        expect(result.proceed).toBe(true);
      });

      it('deve usar stepConfig quando blockConfig não está definido', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: true },
          blockConfig: {},
        });

        expect(result.proceed).toBe(true);
      });
    });

    describe('delay personalizado', () => {
      it('deve usar delay do blockConfig quando disponível', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 2000 },
        });

        expect(result.delay).toBe(2000);
      });

      it('deve usar delay do stepConfig quando blockConfig não tem delay', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 3000 },
          blockConfig: { autoAdvanceOnComplete: true },
        });

        expect(result.delay).toBe(3000);
      });

      it('blockConfig.delay deve ter prioridade sobre stepConfig.delay', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 3000 },
          blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 500 },
        });

        expect(result.delay).toBe(500);
      });

      it('deve usar delay padrão de 1500ms quando nenhum está configurado', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          blockConfig: { autoAdvanceOnComplete: true },
        });

        expect(result.delay).toBe(1500);
      });

      it('deve aceitar delay de 0ms', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 0 },
        });

        expect(result.delay).toBe(0);
      });
    });

    describe('casos edge', () => {
      it('deve tratar undefined configs corretamente', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: undefined,
          blockConfig: undefined,
        });

        expect(result.proceed).toBe(false);
        expect(result.delay).toBe(1500);
      });

      it('deve tratar configs vazias corretamente', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: {},
          blockConfig: {},
        });

        expect(result.proceed).toBe(false);
        expect(result.delay).toBe(1500);
      });

      it('deve funcionar com apenas stepConfig', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 2500 },
        });

        expect(result.proceed).toBe(true);
        expect(result.delay).toBe(2500);
      });

      it('deve funcionar com apenas blockConfig', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 1000 },
        });

        expect(result.proceed).toBe(true);
        expect(result.delay).toBe(1000);
      });
    });

    describe('cenários de uso real', () => {
      it('deve simular múltipla escolha com auto-avanço rápido', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 500 },
        });

        expect(result).toEqual({ proceed: true, delay: 500 });
      });

      it('deve simular pergunta única com auto-avanço lento', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 3000 },
        });

        expect(result).toEqual({ proceed: true, delay: 3000 });
      });

      it('deve simular resposta incompleta sem auto-avanço', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: false,
          blockConfig: { autoAdvanceOnComplete: true },
        });

        expect(result.proceed).toBe(false);
      });

      it('deve simular modo manual (sem auto-avanço)', () => {
        const result = FlowCore.shouldAutoAdvance({
          isValid: true,
          stepConfig: { autoAdvanceOnComplete: false },
          blockConfig: { autoAdvanceOnComplete: false },
        });

        expect(result.proceed).toBe(false);
      });
    });
  });
});

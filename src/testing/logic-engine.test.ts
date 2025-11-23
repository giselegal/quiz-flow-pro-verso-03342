/**
 * 🧪 TESTES - LOGIC ENGINE
 * 
 * Suite de testes para o Logic Engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LogicEngine, LogicHelpers, type Condition } from '../lib/logic-engine';

describe('LogicEngine', () => {
  let engine: LogicEngine;

  beforeEach(() => {
    engine = new LogicEngine();
  });

  describe('Context Management', () => {
    it('deve inicializar com contexto vazio', () => {
      expect(engine.getContext()).toEqual({});
    });

    it('deve atualizar contexto', () => {
      engine.updateContext('name', 'Maria');
      expect(engine.getValue('name')).toBe('Maria');
    });

    it('deve atualizar múltiplos valores', () => {
      engine.updateMultiple({
        name: 'Maria',
        age: 30,
        style: 'natural'
      });
      
      expect(engine.getValue('name')).toBe('Maria');
      expect(engine.getValue('age')).toBe(30);
      expect(engine.getValue('style')).toBe('natural');
    });

    it('deve suportar dot notation', () => {
      engine.updateContext('scores.natural', 25);
      expect(engine.getValue('scores.natural')).toBe(25);
    });

    it('deve limpar contexto', () => {
      engine.updateContext('name', 'Maria');
      engine.clearContext();
      expect(engine.getContext()).toEqual({});
    });
  });

  describe('Condition Evaluation', () => {
    it('deve avaliar condição "equals"', () => {
      engine.updateContext('style', 'natural');
      
      const condition: Condition = {
        id: 'test-1',
        if: { operator: 'equals', field: 'style', value: 'natural' },
        then: { action: 'goto', target: 'step-10' }
      };
      
      expect(engine.evaluateCondition(condition)).toBe(true);
    });

    it('deve avaliar condição "notEquals"', () => {
      engine.updateContext('style', 'natural');
      
      const condition: Condition = {
        id: 'test-2',
        if: { operator: 'notEquals', field: 'style', value: 'classico' },
        then: { action: 'goto', target: 'step-10' }
      };
      
      expect(engine.evaluateCondition(condition)).toBe(true);
    });

    it('deve avaliar condição "greaterThan"', () => {
      engine.updateContext('score', 25);
      
      const condition: Condition = {
        id: 'test-3',
        if: { operator: 'greaterThan', field: 'score', value: 20 },
        then: { action: 'showResult', target: 'result-high' }
      };
      
      expect(engine.evaluateCondition(condition)).toBe(true);
    });

    it('deve avaliar condição "lessThan"', () => {
      engine.updateContext('score', 15);
      
      const condition: Condition = {
        id: 'test-4',
        if: { operator: 'lessThan', field: 'score', value: 20 },
        then: { action: 'showResult', target: 'result-low' }
      };
      
      expect(engine.evaluateCondition(condition)).toBe(true);
    });

    it('deve avaliar condição "contains" com array', () => {
      engine.updateContext('selected', ['natural', 'classico']);
      
      const condition: Condition = {
        id: 'test-5',
        if: { operator: 'contains', field: 'selected', value: 'natural' },
        then: { action: 'goto', target: 'step-10' }
      };
      
      expect(engine.evaluateCondition(condition)).toBe(true);
    });

    it('deve avaliar condição "contains" com string', () => {
      engine.updateContext('text', 'Hello World');
      
      const condition: Condition = {
        id: 'test-6',
        if: { operator: 'contains', field: 'text', value: 'World' },
        then: { action: 'goto', target: 'step-10' }
      };
      
      expect(engine.evaluateCondition(condition)).toBe(true);
    });

    it('deve avaliar condição "in"', () => {
      engine.updateContext('style', 'natural');
      
      const condition: Condition = {
        id: 'test-7',
        if: { operator: 'in', field: 'style', value: ['natural', 'classico'] },
        then: { action: 'goto', target: 'step-10' }
      };
      
      expect(engine.evaluateCondition(condition)).toBe(true);
    });
  });

  describe('Multiple Conditions', () => {
    it('deve retornar primeira condição que passar', () => {
      engine.updateMultiple({
        'scores.natural': 25,
        'scores.classico': 15
      });
      
      const conditions: Condition[] = [
        {
          id: 'high-natural',
          if: { operator: 'greaterThan', field: 'scores.natural', value: 20 },
          then: { action: 'showResult', target: 'result-natural' }
        },
        {
          id: 'high-classico',
          if: { operator: 'greaterThan', field: 'scores.classico', value: 20 },
          then: { action: 'showResult', target: 'result-classico' }
        }
      ];
      
      const matched = engine.evaluateConditions(conditions);
      expect(matched?.id).toBe('high-natural');
    });

    it('deve retornar null se nenhuma condição passar', () => {
      engine.updateContext('score', 10);
      
      const conditions: Condition[] = [
        {
          id: 'high-score',
          if: { operator: 'greaterThan', field: 'score', value: 20 },
          then: { action: 'showResult', target: 'result-high' }
        }
      ];
      
      const matched = engine.evaluateConditions(conditions);
      expect(matched).toBeNull();
    });
  });

  describe('Navigation Logic', () => {
    it('deve retornar target da condição que passar', () => {
      engine.updateContext('score', 25);
      
      const conditions: Condition[] = [
        {
          id: 'high-score',
          if: { operator: 'greaterThan', field: 'score', value: 20 },
          then: { action: 'goto', target: 'step-15' }
        }
      ];
      
      const nextStep = engine.getNextStep('step-05', conditions, 'step-06');
      expect(nextStep).toBe('step-15');
    });

    it('deve retornar defaultNext se nenhuma condição passar', () => {
      engine.updateContext('score', 10);
      
      const conditions: Condition[] = [
        {
          id: 'high-score',
          if: { operator: 'greaterThan', field: 'score', value: 20 },
          then: { action: 'goto', target: 'step-15' }
        }
      ];
      
      const nextStep = engine.getNextStep('step-05', conditions, 'step-06');
      expect(nextStep).toBe('step-06');
    });

    it('deve retornar null para action "end"', () => {
      engine.updateContext('shouldEnd', true);
      
      const conditions: Condition[] = [
        {
          id: 'end-quiz',
          if: { operator: 'equals', field: 'shouldEnd', value: true },
          then: { action: 'end', target: '' }
        }
      ];
      
      const nextStep = engine.getNextStep('step-05', conditions, 'step-06');
      expect(nextStep).toBeNull();
    });
  });

  describe('Result Logic', () => {
    it('deve identificar se deve mostrar resultado', () => {
      engine.updateContext('scores.natural', 30);
      
      const conditions: Condition[] = [
        {
          id: 'show-natural',
          if: { operator: 'greaterThan', field: 'scores.natural', value: 25 },
          then: { action: 'showResult', target: 'result-natural' }
        }
      ];
      
      const shouldShow = engine.shouldShowResult(conditions, 'result-natural');
      expect(shouldShow).toBe(true);
    });

    it('deve retornar false se resultado não corresponder', () => {
      engine.updateContext('scores.natural', 30);
      
      const conditions: Condition[] = [
        {
          id: 'show-natural',
          if: { operator: 'greaterThan', field: 'scores.natural', value: 25 },
          then: { action: 'showResult', target: 'result-natural' }
        }
      ];
      
      const shouldShow = engine.shouldShowResult(conditions, 'result-classico');
      expect(shouldShow).toBe(false);
    });
  });

  describe('History', () => {
    it('deve registrar histórico de mudanças', () => {
      engine.updateContext('name', 'Maria');
      engine.updateContext('age', 30);
      
      const history = engine.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].field).toBe('name');
      expect(history[1].field).toBe('age');
    });
  });

  describe('Export/Import', () => {
    it('deve exportar estado', () => {
      engine.updateContext('name', 'Maria');
      engine.updateContext('score', 25);
      
      const exported = engine.export();
      expect(exported.context).toEqual({ name: 'Maria', score: 25 });
      expect(exported.history).toHaveLength(2);
    });

    it('deve importar estado', () => {
      const state = {
        context: { name: 'Maria', score: 25 },
        history: []
      };
      
      engine.import(state);
      expect(engine.getValue('name')).toBe('Maria');
      expect(engine.getValue('score')).toBe(25);
    });
  });

  describe('LogicHelpers', () => {
    it('deve criar condição equals', () => {
      const condition = LogicHelpers.equals('test', 'style', 'natural', 'step-10');
      
      expect(condition.id).toBe('test');
      expect(condition.if.operator).toBe('equals');
      expect(condition.then.action).toBe('goto');
    });

    it('deve criar condição scoreGreaterThan', () => {
      const condition = LogicHelpers.scoreGreaterThan(
        'test',
        'natural',
        20,
        'result-natural'
      );
      
      expect(condition.if.field).toBe('scores.natural');
      expect(condition.then.action).toBe('showResult');
    });

    it('deve criar condição optionIn', () => {
      const condition = LogicHelpers.optionIn(
        'test',
        'style',
        ['natural', 'classico'],
        'step-10'
      );
      
      expect(condition.if.operator).toBe('in');
      expect(condition.if.value).toEqual(['natural', 'classico']);
    });
  });
});

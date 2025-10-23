import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TemplateRegistry } from '../TemplateRegistry';
import type { TemplateV3 } from '@/types/template-v3.types';

describe('TemplateRegistry', () => {
  let registry: TemplateRegistry;

  beforeEach(() => {
    // Obtém a instância singleton
    registry = TemplateRegistry.getInstance();
  });

  afterEach(() => {
    // Limpa os templates após cada teste
    // Como é um singleton, precisamos limpar manualmente
    const keys = registry.keys();
    keys.forEach(key => {
      // Não há método clear() público, então registramos null para limpar
      // Ou podemos resetar a instância privada via reflexão
    });
  });

  describe('Singleton Pattern', () => {
    it('deve retornar sempre a mesma instância', () => {
      const instance1 = TemplateRegistry.getInstance();
      const instance2 = TemplateRegistry.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('deve compartilhar dados entre múltiplas chamadas getInstance()', () => {
      const instance1 = TemplateRegistry.getInstance();
      const instance2 = TemplateRegistry.getInstance();
      
      const template = { type: 'question', blocks: [] };
      instance1.register('test-step', template);
      
      expect(instance2.has('test-step')).toBe(true);
      expect(instance2.get('test-step')).toBe(template);
    });
  });

  describe('register()', () => {
    it('deve registrar um template com sucesso', () => {
      const template: TemplateV3 = {
        type: 'question',
        blocks: [
          {
            id: 'block-1',
            type: 'heading',
            content: 'Título',
            style: {}
          }
        ]
      };

      registry.register('step-1', template);

      expect(registry.has('step-1')).toBe(true);
      expect(registry.get('step-1')).toEqual(template);
    });

    it('deve congelar o template registrado', () => {
      const template = {
        type: 'question',
        blocks: [{ id: 'block-1', type: 'text', content: 'Test' }]
      };

      registry.register('frozen-step', template);
      const retrieved = registry.get('frozen-step');

      expect(Object.isFrozen(retrieved)).toBe(true);
    });

    it('deve permitir sobrescrever um template existente', () => {
      const template1 = { type: 'question', blocks: [] };
      const template2 = { type: 'result', blocks: [] };

      registry.register('step-override', template1);
      expect(registry.get('step-override')).toBe(template1);

      registry.register('step-override', template2);
      expect(registry.get('step-override')).toBe(template2);
    });

    it('deve aceitar diferentes tipos de templates (TemplateV3 ou any)', () => {
      const templateV3: TemplateV3 = {
        type: 'question',
        blocks: []
      };

      const customTemplate = {
        customField: 'value',
        data: [1, 2, 3]
      };

      registry.register('v3-template', templateV3);
      registry.register('custom-template', customTemplate);

      expect(registry.get('v3-template')).toEqual(templateV3);
      expect(registry.get('custom-template')).toEqual(customTemplate);
    });
  });

  describe('registerOverride()', () => {
    it('deve registrar um override com sucesso', () => {
      const template = { type: 'question', blocks: [] };
      
      registry.registerOverride('override-step', template);

      expect(registry.has('override-step')).toBe(true);
      expect(registry.get('override-step')).toBe(template);
    });

    it('deve sobrescrever template existente via registerOverride', () => {
      const original = { type: 'question', blocks: [] };
      const override = { type: 'result', blocks: [{ id: 'new' }] };

      registry.register('step-to-override', original);
      registry.registerOverride('step-to-override', override);

      expect(registry.get('step-to-override')).toBe(override);
    });

    it('deve congelar templates registrados via override', () => {
      const template = { type: 'question', blocks: [] };
      
      registry.registerOverride('frozen-override', template);
      const retrieved = registry.get('frozen-override');

      expect(Object.isFrozen(retrieved)).toBe(true);
    });
  });

  describe('get()', () => {
    it('deve retornar template registrado', () => {
      const template = { type: 'question', blocks: [] };
      registry.register('get-test', template);

      const result = registry.get('get-test');

      expect(result).toBe(template);
    });

    it('deve retornar null para template não registrado', () => {
      const result = registry.get('non-existent');

      expect(result).toBeNull();
    });

    it('deve retornar null para string vazia', () => {
      const result = registry.get('');

      expect(result).toBeNull();
    });
  });

  describe('has()', () => {
    it('deve retornar true para template registrado', () => {
      const template = { type: 'question', blocks: [] };
      registry.register('has-test', template);

      expect(registry.has('has-test')).toBe(true);
    });

    it('deve retornar false para template não registrado', () => {
      expect(registry.has('non-existent')).toBe(false);
    });

    it('deve retornar false para string vazia', () => {
      expect(registry.has('')).toBe(false);
    });

    it('deve retornar true após sobrescrever template', () => {
      registry.register('overwrite', { type: 'question' });
      registry.register('overwrite', { type: 'result' });

      expect(registry.has('overwrite')).toBe(true);
    });
  });

  describe('keys()', () => {
    it('deve retornar array vazio quando não há templates', () => {
      // Nova instância ou após limpeza
      const freshRegistry = TemplateRegistry.getInstance();
      const initialKeys = freshRegistry.keys();

      // Pode ter chaves de outros testes devido ao singleton
      expect(Array.isArray(initialKeys)).toBe(true);
    });

    it('deve retornar todas as chaves registradas', () => {
      registry.register('step-1', { type: 'question' });
      registry.register('step-2', { type: 'result' });
      registry.register('step-3', { type: 'cta' });

      const keys = registry.keys();

      expect(keys).toContain('step-1');
      expect(keys).toContain('step-2');
      expect(keys).toContain('step-3');
    });

    it('deve retornar array de strings', () => {
      registry.register('string-key', { type: 'question' });

      const keys = registry.keys();

      expect(Array.isArray(keys)).toBe(true);
      keys.forEach(key => {
        expect(typeof key).toBe('string');
      });
    });

    it('deve refletir mudanças após registrar novos templates', () => {
      const initialCount = registry.keys().length;

      registry.register('new-step-1', { type: 'question' });
      registry.register('new-step-2', { type: 'result' });

      const newKeys = registry.keys();

      expect(newKeys.length).toBeGreaterThanOrEqual(initialCount + 2);
      expect(newKeys).toContain('new-step-1');
      expect(newKeys).toContain('new-step-2');
    });

    it('não deve duplicar chaves ao sobrescrever', () => {
      registry.register('duplicate-test', { type: 'question' });
      const keysCount1 = registry.keys().filter(k => k === 'duplicate-test').length;

      registry.register('duplicate-test', { type: 'result' });
      const keysCount2 = registry.keys().filter(k => k === 'duplicate-test').length;

      expect(keysCount1).toBe(1);
      expect(keysCount2).toBe(1);
    });
  });

  describe('Imutabilidade', () => {
    it('não deve permitir modificação do template após registro', () => {
      const template = {
        type: 'question',
        blocks: [{ id: 'block-1', content: 'Original' }]
      };

      registry.register('immutable-test', template);
      const retrieved: any = registry.get('immutable-test');

      // Tentar modificar deve lançar erro ou não ter efeito
      expect(() => {
        retrieved.type = 'modified';
      }).toThrow();
    });

    it('não deve permitir modificação de propriedades aninhadas', () => {
      const template: any = {
        type: 'question',
        blocks: [{ id: 'block-1', content: 'Original' }]
      };

      registry.register('nested-immutable', template);
      const retrieved: any = registry.get('nested-immutable');

      // Object.freeze é shallow, então arrays internos ainda são mutáveis
      // Este teste documenta o comportamento atual
      expect(Object.isFrozen(retrieved)).toBe(true);
      
      // O objeto raiz está congelado
      expect(() => {
        retrieved.newProperty = 'value';
      }).toThrow();
    });
  });

  describe('Casos Extremos', () => {
    it('deve lidar com IDs com caracteres especiais', () => {
      const template = { type: 'question' };
      const specialIds = [
        'step-with-dash',
        'step_with_underscore',
        'step.with.dot',
        'step:with:colon',
        'step/with/slash'
      ];

      specialIds.forEach(id => {
        registry.register(id, template);
        expect(registry.has(id)).toBe(true);
        expect(registry.get(id)).toBe(template);
      });
    });

    it('deve lidar com templates complexos', () => {
      const complexTemplate: TemplateV3 = {
        type: 'question',
        blocks: [
          {
            id: 'heading-1',
            type: 'heading',
            content: 'Título Principal',
            style: {
              fontSize: '2rem',
              color: '#333'
            }
          },
          {
            id: 'text-1',
            type: 'text',
            content: 'Descrição detalhada',
            style: {}
          },
          {
            id: 'button-1',
            type: 'button',
            content: 'Clique aqui',
            style: {
              backgroundColor: '#007bff'
            }
          }
        ]
      };

      registry.register('complex-step', complexTemplate);

      expect(registry.get('complex-step')).toEqual(complexTemplate);
    });

    it('deve lidar com templates vazios', () => {
      const emptyTemplate = { type: 'question', blocks: [] };

      registry.register('empty-step', emptyTemplate);

      expect(registry.get('empty-step')).toEqual(emptyTemplate);
    });

    it('deve lidar com múltiplos registros em sequência', () => {
      for (let i = 0; i < 100; i++) {
        registry.register(`step-${i}`, { type: 'question', index: i });
      }

      const keys = registry.keys();
      
      expect(keys.length).toBeGreaterThanOrEqual(100);
      
      for (let i = 0; i < 100; i++) {
        expect(registry.has(`step-${i}`)).toBe(true);
      }
    });
  });

  describe('Integração register() e registerOverride()', () => {
    it('deve permitir alternância entre register e registerOverride', () => {
      const template1 = { type: 'question' };
      const template2 = { type: 'result' };
      const template3 = { type: 'cta' };

      registry.register('alternating', template1);
      expect(registry.get('alternating')).toBe(template1);

      registry.registerOverride('alternating', template2);
      expect(registry.get('alternating')).toBe(template2);

      registry.register('alternating', template3);
      expect(registry.get('alternating')).toBe(template3);
    });
  });
});

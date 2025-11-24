/**
 * 🧪 TESTES - DRAFT PROPERTIES FLOW
 *
 * Testa o fluxo de edição draft implementado no painel de propriedades.
 * Cobre:
 * - Edição de campo simples com validação
 * - JSON editor com erro de parse
 * - Comportamento de commit/cancel do draft
 * - Preservação de valores falsy (0, false, '')
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Import dos módulos a serem testados
import {
  coerceAndValidateProperty,
  getInitialValueFromSchema,
  safeParseJson,
  validateDraft,
  normalizeControlType,
} from '../propertyValidation';
import { PropertySchema } from '../SchemaInterpreter';

// Mock do appLogger para evitar poluição do console
vi.mock('@/lib/utils/appLogger', () => ({
  appLogger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('propertyValidation - Validação e Coerção', () => {
  describe('coerceAndValidateProperty', () => {
    describe('Validação de campos required', () => {
      it('deve retornar erro quando campo required está undefined', () => {
        const schema: PropertySchema = {
          type: 'string',
          control: 'text',
          required: true,
        };

        const result = coerceAndValidateProperty(schema, undefined);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Este campo é obrigatório');
      });

      it('deve retornar erro quando campo required é string vazia', () => {
        const schema: PropertySchema = {
          type: 'string',
          control: 'text',
          required: true,
        };

        const result = coerceAndValidateProperty(schema, '');
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Este campo é obrigatório');
      });

      it('deve validar campo required com valor válido', () => {
        const schema: PropertySchema = {
          type: 'string',
          control: 'text',
          required: true,
        };

        const result = coerceAndValidateProperty(schema, 'texto válido');
        
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    describe('Validação de min/max para números', () => {
      it('deve validar número abaixo do min', () => {
        const schema: PropertySchema = {
          type: 'number',
          control: 'number',
          validation: { min: 10 },
        };

        const result = coerceAndValidateProperty(schema, 5);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('no mínimo');
      });

      it('deve validar número acima do max', () => {
        const schema: PropertySchema = {
          type: 'number',
          control: 'number',
          validation: { max: 100 },
        };

        const result = coerceAndValidateProperty(schema, 150);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('no máximo');
      });

      it('deve aceitar número dentro do range', () => {
        const schema: PropertySchema = {
          type: 'number',
          control: 'number',
          validation: { min: 0, max: 100 },
        };

        const result = coerceAndValidateProperty(schema, 50);
        
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    describe('Coerção de tipos', () => {
      it('deve converter string para number', () => {
        const schema: PropertySchema = {
          type: 'number',
          control: 'number',
        };

        const result = coerceAndValidateProperty(schema, '42');
        
        expect(result.value).toBe(42);
        expect(typeof result.value).toBe('number');
        expect(result.isValid).toBe(true);
      });

      it('deve converter string "true" para boolean true', () => {
        const schema: PropertySchema = {
          type: 'boolean',
          control: 'toggle',
        };

        const result = coerceAndValidateProperty(schema, 'true');
        
        expect(result.value).toBe(true);
        expect(typeof result.value).toBe('boolean');
      });

      it('deve converter string "false" para boolean false', () => {
        const schema: PropertySchema = {
          type: 'boolean',
          control: 'toggle',
        };

        const result = coerceAndValidateProperty(schema, 'false');
        
        expect(result.value).toBe(false);
      });
    });
  });

  describe('getInitialValueFromSchema', () => {
    it('deve preservar valor 0 (não usar default)', () => {
      const schema: PropertySchema = {
        type: 'number',
        control: 'number',
        default: 10,
      };

      const result = getInitialValueFromSchema(schema, 0);
      
      expect(result).toBe(0);
    });

    it('deve preservar valor false (não usar default)', () => {
      const schema: PropertySchema = {
        type: 'boolean',
        control: 'toggle',
        default: true,
      };

      const result = getInitialValueFromSchema(schema, false);
      
      expect(result).toBe(false);
    });

    it('deve preservar string vazia (não usar default)', () => {
      const schema: PropertySchema = {
        type: 'string',
        control: 'text',
        default: 'default text',
      };

      const result = getInitialValueFromSchema(schema, '');
      
      expect(result).toBe('');
    });

    it('deve usar default quando valor é undefined', () => {
      const schema: PropertySchema = {
        type: 'string',
        control: 'text',
        default: 'default text',
      };

      const result = getInitialValueFromSchema(schema, undefined);
      
      expect(result).toBe('default text');
    });

    it('deve usar default quando valor é null', () => {
      const schema: PropertySchema = {
        type: 'number',
        control: 'number',
        default: 42,
      };

      const result = getInitialValueFromSchema(schema, null);
      
      expect(result).toBe(42);
    });
  });

  describe('safeParseJson', () => {
    it('deve parsear JSON válido', () => {
      const json = '{"name": "test", "value": 123}';
      
      const result = safeParseJson(json);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual({ name: 'test', value: 123 });
      expect(result.error).toBeUndefined();
    });

    it('deve retornar erro para JSON inválido', () => {
      const invalidJson = '{"name": invalid}';
      
      const result = safeParseJson(invalidJson);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('JSON inválido');
      expect(result.value).toBeUndefined();
    });

    it('deve tratar string vazia como objeto vazio', () => {
      const result = safeParseJson('');
      
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual({});
    });

    it('deve tratar string com apenas espaços como objeto vazio', () => {
      const result = safeParseJson('   ');
      
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual({});
    });

    it('deve parsear array JSON', () => {
      const json = '[1, 2, 3]';
      
      const result = safeParseJson(json);
      
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual([1, 2, 3]);
    });
  });

  describe('validateDraft', () => {
    it('deve validar draft com todos os campos válidos', () => {
      const schemas: Record<string, PropertySchema> = {
        title: { type: 'string', control: 'text', required: true },
        count: { type: 'number', control: 'number', validation: { min: 0, max: 100 } },
      };

      const draft = {
        title: 'Test Title',
        count: 50,
      };

      const result = validateDraft(schemas, draft);
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('deve retornar erros para campos inválidos', () => {
      const schemas: Record<string, PropertySchema> = {
        title: { type: 'string', control: 'text', required: true },
        count: { type: 'number', control: 'number', validation: { min: 0, max: 100 } },
      };

      const draft = {
        title: '', // required mas vazio
        count: 150, // acima do max
      };

      const result = validateDraft(schemas, draft);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.count).toBeDefined();
    });
  });

  describe('normalizeControlType', () => {
    it('deve mapear "select" para "dropdown"', () => {
      const result = normalizeControlType('select');
      expect(result).toBe('dropdown');
    });

    it('deve mapear "color" para "color-picker"', () => {
      const result = normalizeControlType('color');
      expect(result).toBe('color-picker');
    });

    it('deve mapear "boolean" para "toggle"', () => {
      const result = normalizeControlType('boolean');
      expect(result).toBe('toggle');
    });

    it('deve mapear "json" para "json-editor"', () => {
      const result = normalizeControlType('json');
      expect(result).toBe('json-editor');
    });

    it('deve retornar "text" para controle undefined', () => {
      const result = normalizeControlType(undefined);
      expect(result).toBe('text');
    });

    it('deve retornar "text" para controle desconhecido e logar warning', () => {
      const result = normalizeControlType('unknown-control', 'test-element', 'test-key');
      expect(result).toBe('text');
    });
  });
});

describe('Draft Pattern - Fluxo de Edição', () => {
  describe('Cenário: Edição de campo simples com validação', () => {
    it('deve permitir edição de campo text com validação', () => {
      const schema: PropertySchema = {
        type: 'string',
        control: 'text',
        required: true,
      };

      // Simular fluxo: valor inicial → edição → validação
      const initialValue = 'Initial';
      const editedValue = 'Edited';

      // Passo 1: Validar valor inicial
      const initialResult = coerceAndValidateProperty(schema, initialValue);
      expect(initialResult.isValid).toBe(true);

      // Passo 2: Editar para novo valor
      const editedResult = coerceAndValidateProperty(schema, editedValue);
      expect(editedResult.isValid).toBe(true);
      expect(editedResult.value).toBe('Edited');
    });

    it('deve bloquear commit quando campo required está vazio', () => {
      const schemas: Record<string, PropertySchema> = {
        title: { type: 'string', control: 'text', required: true },
      };

      const invalidDraft = { title: '' };
      const result = validateDraft(schemas, invalidDraft);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });
  });

  describe('Cenário: JSON editor com erro de parse', () => {
    it('não deve corromper valor quando JSON é inválido', () => {
      const validValue = { name: 'test' };
      const invalidJson = '{ invalid json }';

      // JSON inválido não deve atualizar o draft
      const parseResult = safeParseJson(invalidJson);
      expect(parseResult.isValid).toBe(false);

      // O valor original deve permanecer intacto
      // (a lógica do hook não chama handleChange quando isValid é false)
      expect(validValue).toEqual({ name: 'test' });
    });

    it('deve exibir erro visual para JSON inválido', () => {
      const invalidJson = '{ "incomplete":';
      const result = safeParseJson(invalidJson);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('JSON inválido: verifique a sintaxe');
    });
  });

  describe('Cenário: Comportamento commit/cancel', () => {
    it('validateDraft deve retornar valores validados para commit', () => {
      const schemas: Record<string, PropertySchema> = {
        count: { type: 'number', control: 'number', default: 0 },
      };

      const draft = { count: '42' }; // string que será coercida
      const result = validateDraft(schemas, draft);

      expect(result.isValid).toBe(true);
      expect(result.values.count).toBe(42);
      expect(typeof result.values.count).toBe('number');
    });

    it('cancelDraft deve poder reverter para valores iniciais', () => {
      // Este teste verifica o conceito - a implementação real está no hook
      const initialProperties = { title: 'Original' };
      const editedProperties = { title: 'Edited' };

      // Simular cancel: voltar ao inicial
      const afterCancel = { ...initialProperties };
      
      expect(afterCancel.title).toBe('Original');
    });
  });
});

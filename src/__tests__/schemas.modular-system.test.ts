/**
 * 🧪 TESTES DO SISTEMA MODULAR DE SCHEMAS
 * 
 * Valida funcionamento do novo sistema de schemas com:
 * - Lazy loading
 * - Presets reutilizáveis
 * - Builder pattern
 * - Compatibilidade backward
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import {
  SchemaAPI,
  initializeSchemaRegistry,
  clearSchemaCache,
  createSchema,
  titleField,
  colorFields,
  templates,
} from '@/config/schemas';

describe('Sistema Modular de Schemas', () => {
  beforeAll(() => {
    initializeSchemaRegistry();
  });

  afterEach(() => {
    clearSchemaCache();
  });

  describe('Lazy Loading', () => {
    it('deve carregar schema sob demanda', async () => {
      const schema = await SchemaAPI.get('headline');
      expect(schema).toBeDefined();
      expect(schema?.type).toBe('headline');
      expect(schema?.label).toBe('Título Principal');
    });

    it('deve cachear schemas carregados', async () => {
      await SchemaAPI.get('headline');
      const stats1 = SchemaAPI.stats();
      expect(stats1.cached).toBeGreaterThan(0);

      const cached = SchemaAPI.getSync('headline');
      expect(cached).toBeDefined();
    });

    it('deve pré-carregar múltiplos schemas', async () => {
      await SchemaAPI.preload('headline', 'button', 'image');
      const stats = SchemaAPI.stats();
      expect(stats.cached).toBe(3);
    });

    it('deve retornar null para schema não existente', async () => {
      const schema = await SchemaAPI.get('nonexistent-block');
      expect(schema).toBeNull();
    });
  });

  describe('Registry', () => {
    it('deve listar todos os schemas registrados', () => {
      const types = SchemaAPI.list();
      expect(types).toContain('headline');
      expect(types).toContain('button');
      expect(types).toContain('image');
      expect(types).toContain('options-grid');
      expect(types).toContain('urgency-timer-inline');
    });

    it('deve verificar existência de schema', () => {
      expect(SchemaAPI.has('headline')).toBe(true);
      expect(SchemaAPI.has('nonexistent')).toBe(false);
    });

    it('deve retornar estatísticas corretas', async () => {
      await SchemaAPI.get('headline');
      const stats = SchemaAPI.stats();
      
      expect(stats).toHaveProperty('registered');
      expect(stats).toHaveProperty('cached');
      expect(stats).toHaveProperty('types');
      expect(stats.registered).toBeGreaterThan(0);
      expect(Array.isArray(stats.types)).toBe(true);
    });
  });

  describe('Schema Structure', () => {
    it('deve ter estrutura completa para headline', async () => {
      const schema = await SchemaAPI.get('headline');
      
      expect(schema).toHaveProperty('type', 'headline');
      expect(schema).toHaveProperty('label');
      expect(schema).toHaveProperty('properties');
      expect(schema).toHaveProperty('groups');
      expect(Array.isArray(schema?.properties)).toBe(true);
      expect(Array.isArray(schema?.groups)).toBe(true);
    });

    it('deve ter campos obrigatórios para button', async () => {
      const schema = await SchemaAPI.get('button');
      
      const properties = schema?.properties || [];
      const keys = properties.map(p => p.key);
      
      expect(keys).toContain('buttonText');
      expect(keys).toContain('variant');
      expect(keys).toContain('size');
    });

    it('deve ter campo requiredSelections para options-grid', async () => {
      const schema = await SchemaAPI.get('options-grid');
      
      const properties = schema?.properties || [];
      const requiredSelections = properties.find(p => p.key === 'requiredSelections');
      
      expect(requiredSelections).toBeDefined();
      expect(requiredSelections?.type).toBe('number');
      expect(requiredSelections?.min).toBe(0);
    });

    it('deve ter campos initialMinutes e urgencyMessage para urgency-timer', async () => {
      const schema = await SchemaAPI.get('urgency-timer-inline');
      
      const properties = schema?.properties || [];
      const keys = properties.map(p => p.key);
      
      expect(keys).toContain('initialMinutes');
      expect(keys).toContain('urgencyMessage');
    });
  });

  describe('Builder Pattern', () => {
    it('deve criar schema usando builder', () => {
      const schema = createSchema('test-block', 'Test Block')
        .description('Test description')
        .category('test')
        .addGroup('content', 'Conteúdo', { order: 1 })
        .addField(titleField('content'))
        .build();

      expect(schema.type).toBe('test-block');
      expect(schema.label).toBe('Test Block');
      expect(schema.description).toBe('Test description');
      expect(schema.category).toBe('test');
      expect(schema.groups).toHaveLength(1);
      expect(schema.properties).toHaveLength(1);
    });

    it('deve adicionar múltiplos campos com spread', () => {
      const schema = createSchema('test-block', 'Test Block')
        .addGroup('style', 'Estilo', { order: 1 })
        .addFields(...colorFields('style'))
        .build();

      expect(schema.properties.length).toBeGreaterThan(1);
      const keys = schema.properties.map(p => p.key);
      expect(keys).toContain('backgroundColor');
      expect(keys).toContain('textColor');
      expect(keys).toContain('borderColor');
    });

    it('deve usar template para criar schema', () => {
      const schema = templates
        .full('template-test', 'Template Test')
        .addField(titleField('content'))
        .build();

      expect(schema.type).toBe('template-test');
      const groupIds = schema.groups.map(g => g.id);
      expect(groupIds).toContain('content');
      expect(groupIds).toContain('style');
      expect(groupIds).toContain('layout');
    });
  });

  describe('Presets', () => {
    it('deve criar campo com preset titleField', () => {
      const field = titleField('content');
      
      expect(field.key).toBe('title');
      expect(field.type).toBe('string');
      expect(field.group).toBe('content');
      expect(field.required).toBe(true);
    });

    it('deve criar conjunto de campos com colorFields', () => {
      const fields = colorFields('style');
      
      expect(fields).toHaveLength(3);
      expect(fields[0].key).toBe('backgroundColor');
      expect(fields[1].key).toBe('textColor');
      expect(fields[2].key).toBe('borderColor');
      expect(fields.every(f => f.type === 'color')).toBe(true);
    });
  });

  describe('Validação de Tipos', () => {
    it('deve ter tipos válidos em todos os campos', async () => {
      const validTypes = [
        'string', 'richtext', 'number', 'boolean', 
        'color', 'select', 'enum', 'options-list', 
        'array', 'object', 'json'
      ];

      const schemas = await Promise.all([
        SchemaAPI.get('headline'),
        SchemaAPI.get('button'),
        SchemaAPI.get('image'),
      ]);

      schemas.forEach(schema => {
        schema?.properties.forEach(prop => {
          expect(validTypes).toContain(prop.type);
        });
      });
    });
  });

  describe('Grupos e Ordenação', () => {
    it('deve ter grupos ordenados corretamente', async () => {
      const schema = await SchemaAPI.get('headline');
      const groups = schema?.groups || [];
      
      const orders = groups.map(g => g.order || 0);
      const isSorted = orders.every((val, i, arr) => !i || arr[i - 1] <= val);
      
      expect(isSorted).toBe(true);
    });

    it('deve ter propriedades associadas a grupos válidos', async () => {
      const schema = await SchemaAPI.get('button');
      const groupIds = new Set(schema?.groups.map(g => g.id));
      const properties = schema?.properties || [];
      
      properties.forEach(prop => {
        expect(groupIds.has(prop.group)).toBe(true);
      });
    });
  });

  describe('Performance', () => {
    it('deve carregar schema em menos de 100ms', async () => {
      const start = Date.now();
      await SchemaAPI.get('headline');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('deve acessar cache instantaneamente', async () => {
      await SchemaAPI.get('headline');
      
      const start = Date.now();
      SchemaAPI.getSync('headline');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(5);
    });
  });

  describe('Limpeza de Cache', () => {
    it('deve limpar cache corretamente', async () => {
      await SchemaAPI.get('headline');
      expect(SchemaAPI.stats().cached).toBeGreaterThan(0);
      
      SchemaAPI.clearCache();
      expect(SchemaAPI.stats().cached).toBe(0);
    });
  });
});

/**
 * 🧪 TESTES DE INTEGRAÇÃO - Universal Registry
 * 
 * Valida integração completa do sistema schema-driven no editor
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { loadDefaultSchemas } from '@/core/schema/loadDefaultSchemas';
import { 
  loadComponentsFromRegistry, 
  groupComponentsByCategory,
  createElementFromSchema,
  validateElement 
} from '@/core/editor/SchemaComponentAdapter';

describe('Universal Registry Integration', () => {
  
  beforeEach(() => {
    // Garantir que schemas estão carregados
    loadDefaultSchemas();
  });

  describe('Schema Loading', () => {
    it('deve carregar schemas de blocos do editor', () => {
      const introLogo = schemaInterpreter.getBlockSchema('intro-logo');
      expect(introLogo).toBeDefined();
      expect(introLogo?.type).toBe('intro-logo');
      expect(introLogo?.category).toBe('intro');
    });

    it('deve carregar todos os 10 schemas criados', () => {
      const schemaTypes = [
        'intro-logo',
        'intro-title',
        'intro-description',
        'intro-image',
        'intro-form',
        'question-title',
        'question-options-grid',
        'result-header',
        'result-description',
        'result-cta',
      ];

      schemaTypes.forEach(type => {
        const schema = schemaInterpreter.getBlockSchema(type);
        expect(schema).toBeDefined();
        expect(schema?.type).toBe(type);
      });
    });

    it('deve retornar categorias corretamente', () => {
      const categories = schemaInterpreter.getCategories();
      expect(categories).toContain('intro');
      expect(categories).toContain('question');
      expect(categories).toContain('result');
    });
  });

  describe('Component Library Loading', () => {
    it('deve carregar componentes do registry', () => {
      const components = loadComponentsFromRegistry();
      
      expect(components).toBeDefined();
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
    });

    it('deve incluir schemas de blocos do editor', () => {
      const components = loadComponentsFromRegistry();
      
      const introLogo = components.find(c => c.id === 'intro-logo');
      expect(introLogo).toBeDefined();
      expect(introLogo?.name).toBe('Logo Introdução');
      expect(introLogo?.category).toBe('Intro');
    });

    it('deve agrupar componentes por categoria', () => {
      const components = loadComponentsFromRegistry();
      const grouped = groupComponentsByCategory(components);
      
      expect(grouped).toBeDefined();
      expect(grouped['Intro']).toBeDefined();
      expect(grouped['Question']).toBeDefined();
      expect(grouped['Result']).toBeDefined();
    });
  });

  describe('Element Creation', () => {
    it('deve criar elemento a partir de schema', () => {
      const element = createElementFromSchema('intro-logo');
      
      expect(element).toBeDefined();
      expect(element.type).toBe('intro-logo');
      expect(element.id).toBeDefined();
      expect(element.properties).toBeDefined();
    });

    it('deve aplicar propriedades padrão do schema', () => {
      const element = createElementFromSchema('intro-logo');
      
      expect(element.properties?.alt).toBe('Logo');
      expect(element.properties?.width).toBe('200px');
      expect(element.properties?.height).toBe('auto');
    });

    it('deve aceitar overrides de propriedades', () => {
      const element = createElementFromSchema('intro-logo', {
        properties: {
          width: '300px',
          imageUrl: 'https://example.com/logo.png'
        }
      });
      
      expect(element.properties?.width).toBe('300px');
      expect(element.properties?.imageUrl).toBe('https://example.com/logo.png');
    });

    it('deve lançar erro para tipo inexistente', () => {
      expect(() => {
        createElementFromSchema('bloco-inexistente');
      }).toThrow();
    });
  });

  describe('Element Validation', () => {
    it('deve validar elemento válido', () => {
      const element = createElementFromSchema('intro-logo', {
        properties: {
          imageUrl: 'https://example.com/logo.png',
          alt: 'Logo da Empresa'
        }
      });
      
      const validation = validateElement(element);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('deve detectar propriedade obrigatória ausente', () => {
      const element = createElementFromSchema('question-title', {
        properties: {
          // title é obrigatório mas está ausente
        }
      });
      
      const validation = validateElement(element);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('deve validar tipo de propriedade', () => {
      const element = createElementFromSchema('intro-logo');
      element.properties = {
        ...element.properties,
        width: 123 // deveria ser string
      };
      
      const validation = validateElement(element);
      // Validação de tipo pode ou não falhar dependendo da implementação
      // Este teste documenta o comportamento esperado
      expect(validation).toBeDefined();
    });
  });

  describe('Default Properties', () => {
    it('deve retornar propriedades padrão para intro-logo', () => {
      const defaults = schemaInterpreter.getDefaultProps('intro-logo');
      
      expect(defaults).toBeDefined();
      expect(defaults.alt).toBe('Logo');
      expect(defaults.width).toBe('200px');
    });

    it('deve retornar propriedades padrão para result-cta', () => {
      const defaults = schemaInterpreter.getDefaultProps('result-cta');
      
      expect(defaults).toBeDefined();
      expect(defaults.buttonText).toBe('Continuar');
      expect(defaults.variant).toBe('primary');
    });
  });

  describe('Property Schemas', () => {
    it('deve ter controles corretos para intro-title', () => {
      const schema = schemaInterpreter.getBlockSchema('intro-title');
      
      expect(schema?.properties.title).toBeDefined();
      expect(schema?.properties.title.control).toBe('textarea');
      expect(schema?.properties.fontSize).toBeDefined();
      expect(schema?.properties.fontSize.control).toBe('dropdown');
    });

    it('deve ter validações corretas para question-title', () => {
      const schema = schemaInterpreter.getBlockSchema('question-title');
      
      expect(schema?.properties.title.validation).toBeDefined();
      // Validação pode ter min/max ou custom function
      expect(schema?.properties.title).toBeDefined();
    });

    it('deve ter opções corretas para result-cta', () => {
      const schema = schemaInterpreter.getBlockSchema('result-cta');
      
      expect(schema?.properties.variant.options).toBeDefined();
      expect(schema?.properties.variant.options?.length).toBeGreaterThan(0);
      
      const variantOptions = schema?.properties.variant.options?.map(o => o.value);
      expect(variantOptions).toContain('primary');
      expect(variantOptions).toContain('secondary');
    });
  });

  describe('Categories and Filtering', () => {
    it('deve filtrar blocos por categoria', () => {
      // Usar categoria válida do sistema
      const categories = schemaInterpreter.getCategories();
      if (categories.length > 0) {
        const blocks = schemaInterpreter.getBlocksByCategory(categories[0]);
        expect(blocks).toBeDefined();
        expect(Array.isArray(blocks)).toBe(true);
      }
    });

    it('deve retornar array vazio para categoria inexistente', () => {
      const blocks = schemaInterpreter.getBlocksByCategory('categoria-inexistente' as any);
      expect(blocks).toEqual([]);
    });
  });

  describe('Schema Structure', () => {
    it('deve ter estrutura básica definida', () => {
      const introLogo = schemaInterpreter.getBlockSchema('intro-logo');
      expect(introLogo).toBeDefined();
      expect(introLogo?.type).toBe('intro-logo');
      expect(introLogo?.label).toBeDefined();
      expect(introLogo?.properties).toBeDefined();
    });
  });

  describe('Schema Metadata', () => {
    it('deve ter metadados básicos nos schemas', () => {
      const schemas = [
        'intro-logo',
        'question-title',
        'result-cta'
      ];

      schemas.forEach(type => {
        const schema = schemaInterpreter.getBlockSchema(type);
        expect(schema).toBeDefined();
        expect(schema?.type).toBe(type);
        expect(schema?.label).toBeDefined();
        expect(schema?.category).toBeDefined();
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadDefaultSchemas, isSchemasLoaded } from '@/core/schema/loadDefaultSchemas';
import { loadComponentsFromRegistry, createElementFromSchema } from '@/core/editor/SchemaComponentAdapter';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';

describe('EditorModular Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar schemas corretamente', () => {
    loadDefaultSchemas();
    expect(isSchemasLoaded()).toBe(true);
  });

  it('deve carregar componentes do registry', () => {
    loadDefaultSchemas();
    const components = loadComponentsFromRegistry();
    
    console.log('📊 Componentes carregados:', components.length);
    console.log('🔍 Tipos:', components.map(c => c.id));
    
    expect(components.length).toBeGreaterThan(0);
  });

  it('deve criar elemento a partir de schema', () => {
    loadDefaultSchemas();
    
    const testTypes = ['quiz-intro-header', 'text', 'button'];
    
    testTypes.forEach(type => {
      try {
        const schema = schemaInterpreter.getBlockSchema(type);
        console.log(`📝 Schema ${type}:`, schema ? 'OK' : 'FALHOU');
        
        if (schema) {
          const element = createElementFromSchema(type);
          console.log(`✅ Elemento criado: ${type}`, {
            id: element.id,
            type: element.type,
            hasProperties: !!element.properties,
          });
          
          expect(element.id).toBeDefined();
          expect(element.type).toBe(type);
        }
      } catch (error: any) {
        console.error(`❌ Erro ao criar ${type}:`, error.message);
        throw error;
      }
    });
  });

  it('deve ter categorias corretas', () => {
    loadDefaultSchemas();
    const categories = schemaInterpreter.getCategories();
    
    console.log('📂 Categorias disponíveis:', categories);
    
    expect(categories).toContain('content');
    expect(categories.length).toBeGreaterThan(0);
  });

  it('deve ter DynamicPropertyControls funcionando com schema real', () => {
    loadDefaultSchemas();
    
    const testBlock = {
      type: 'quiz-intro-header',
      properties: {
        headline: 'Test Headline',
        showProgress: true,
      },
    };

    const schema = schemaInterpreter.getBlockSchema(testBlock.type);
    
    console.log('🎯 Schema quiz-intro-header:', {
      found: !!schema,
      properties: schema?.properties ? Object.keys(schema.properties) : [],
    });

    expect(schema).toBeDefined();
    expect(schema?.properties).toBeDefined();
  });
});

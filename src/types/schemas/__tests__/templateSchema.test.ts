/**
 * Testes Automatizados - Validação de Schema Zod
 * 
 * Testa todas as funcionalidades de validação do sistema de templates:
 * - Validação de blocos individuais
 * - Validação de steps
 * - Validação de templates completos
 * - Type guards e helpers
 * 
 * @module __tests__/schemas/templateSchema.test
 */

import { describe, it, expect } from 'vitest';
import {
  validateTemplate,
  validateStep,
  validateBlock,
  isValidTemplate,
  safeParseTemplate,
  normalizeTemplate,
  type Template,
  type Step,
  type Block,
} from '@/types/schemas/templateSchema';

describe('templateSchema - Validação de Blocos', () => {
  describe('validateBlock - Casos de Sucesso', () => {
    it('deve validar bloco mínimo com apenas id e type', () => {
      const block = {
        id: 'block-1',
        type: 'IntroLogo',
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('block-1');
      expect(result.data?.type).toBe('IntroLogo');
    });

    it('deve validar bloco com order', () => {
      const block = {
        id: 'block-1',
        type: 'IntroLogo',
        order: 0,
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(true);
      expect(result.data?.order).toBe(0);
    });

    it('deve validar bloco com config', () => {
      const block = {
        id: 'block-1',
        type: 'IntroLogo',
        config: {
          imageUrl: '/logo.png',
          altText: 'Logo',
          width: 200,
          height: 100,
        },
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(true);
      expect(result.data?.config).toBeDefined();
      expect((result.data?.config as any).imageUrl).toBe('/logo.png');
    });

    it('deve validar bloco com properties', () => {
      const block = {
        id: 'block-1',
        type: 'IntroTitle',
        properties: {
          text: 'Título do Quiz',
          fontSize: 32,
          fontWeight: 'bold',
          color: '#000000',
        },
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(true);
      expect(result.data?.properties).toBeDefined();
    });

    it('deve validar bloco com parentId', () => {
      const block = {
        id: 'block-2',
        type: 'SubBlock',
        parentId: 'block-1',
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(true);
      expect(result.data?.parentId).toBe('block-1');
    });

    it('deve aceitar propriedades adicionais (passthrough)', () => {
      const block = {
        id: 'block-1',
        type: 'CustomBlock',
        customProp: 'custom value',
        anotherProp: 123,
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(true);
      expect((result.data as any).customProp).toBe('custom value');
    });
  });

  describe('validateBlock - Casos de Falha', () => {
    it('deve rejeitar bloco sem id', () => {
      const block = {
        type: 'IntroLogo',
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(e => e.includes('id'))).toBe(true);
    });

    it('deve rejeitar bloco sem type', () => {
      const block = {
        id: 'block-1',
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('type'))).toBe(true);
    });

    it('deve rejeitar bloco com id vazio', () => {
      const block = {
        id: '',
        type: 'IntroLogo',
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('id'))).toBe(true);
    });

    it('deve rejeitar bloco com type vazio', () => {
      const block = {
        id: 'block-1',
        type: '',
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('type'))).toBe(true);
    });

    it('deve rejeitar bloco com order negativo', () => {
      const block = {
        id: 'block-1',
        type: 'IntroLogo',
        order: -1,
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('order'))).toBe(true);
    });

    it('deve rejeitar bloco com order não inteiro', () => {
      const block = {
        id: 'block-1',
        type: 'IntroLogo',
        order: 1.5,
      };

      const result = validateBlock(block);
      
      expect(result.success).toBe(false);
    });
  });
});

describe('templateSchema - Validação de Steps', () => {
  describe('validateStep - Formato v3.1', () => {
    it('deve validar step v3.1 com metadata e blocks', () => {
      const step = {
        templateVersion: '3.1',
        metadata: {
          id: 'step-01',
          name: 'Introdução',
          description: 'Tela inicial',
          category: 'intro',
          tags: ['intro', 'welcome'],
          order: 1,
        },
        blocks: [
          { id: 'block-1', type: 'IntroLogo' },
          { id: 'block-2', type: 'IntroTitle' },
        ],
      };

      const result = validateStep(step);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('deve validar step v3.1 com metadata mínimo', () => {
      const step = {
        metadata: {
          id: 'step-01',
          name: 'Step 1',
        },
        blocks: [
          { id: 'block-1', type: 'IntroLogo' },
        ],
      };

      const result = validateStep(step);
      
      expect(result.success).toBe(true);
    });

    it('deve rejeitar step v3.1 sem metadata.id', () => {
      const step = {
        metadata: {
          name: 'Step 1',
        },
        blocks: [
          { id: 'block-1', type: 'IntroLogo' },
        ],
      };

      const result = validateStep(step);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('id'))).toBe(true);
    });

    it('deve rejeitar step v3.1 sem metadata.name', () => {
      const step = {
        metadata: {
          id: 'step-01',
        },
        blocks: [
          { id: 'block-1', type: 'IntroLogo' },
        ],
      };

      const result = validateStep(step);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('name'))).toBe(true);
    });

    it('deve rejeitar step v3.1 sem blocos', () => {
      const step = {
        metadata: {
          id: 'step-01',
          name: 'Step 1',
        },
        blocks: [],
      };

      const result = validateStep(step);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('bloco'))).toBe(true);
    });
  });

  describe('validateStep - Formato Simples (Array)', () => {
    it('deve validar step como array de blocos', () => {
      const step = [
        { id: 'block-1', type: 'IntroLogo' },
        { id: 'block-2', type: 'IntroTitle' },
        { id: 'block-3', type: 'IntroButton' },
      ];

      const result = validateStep(step);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('deve rejeitar step como array vazio', () => {
      const step: any[] = [];

      const result = validateStep(step);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('bloco'))).toBe(true);
    });
  });
});

describe('templateSchema - Validação de Templates', () => {
  describe('validateTemplate - Casos de Sucesso', () => {
    it('deve validar template completo válido', () => {
      const template = {
        metadata: {
          id: 'quiz-test',
          name: 'Quiz de Teste',
          version: '3.1',
          totalSteps: 2,
          category: 'quiz',
          tags: ['teste', 'quiz'],
          author: 'Test Author',
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Intro' },
            blocks: [{ id: 'block-1', type: 'IntroLogo' }],
          },
          'step-02': {
            metadata: { id: 'step-02', name: 'Question' },
            blocks: [{ id: 'block-2', type: 'QuestionText' }],
          },
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.metadata.id).toBe('quiz-test');
      expect(Object.keys(result.data?.steps || {}).length).toBe(2);
    });

    it('deve validar template com metadata mínimo', () => {
      const template = {
        metadata: {
          id: 'quiz-minimal',
          name: 'Quiz Mínimo',
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(true);
      expect(result.data?.metadata.version).toBe('3.1'); // default
    });

    it('deve validar template com steps em formato array', () => {
      const template = {
        metadata: {
          id: 'quiz-array',
          name: 'Quiz Array Format',
        },
        steps: {
          'step-01': [
            { id: 'block-1', type: 'IntroLogo' },
            { id: 'block-2', type: 'IntroTitle' },
          ],
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(true);
    });

    it('deve gerar warning se totalSteps não corresponder', () => {
      const template = {
        metadata: {
          id: 'quiz-mismatch',
          name: 'Quiz com Mismatch',
          totalSteps: 10, // Errado (só tem 2 steps)
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step 1' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
          'step-02': {
            metadata: { id: 'step-02', name: 'Step 2' },
            blocks: [{ id: 'b2', type: 'Block' }],
          },
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.includes('totalSteps'))).toBe(true);
    });

    it('deve gerar warning se version não especificada', () => {
      const template = {
        metadata: {
          id: 'quiz-no-version',
          name: 'Quiz Sem Versão',
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.includes('version'))).toBe(true);
    });
  });

  describe('validateTemplate - Casos de Falha', () => {
    it('deve rejeitar template sem metadata.id', () => {
      const template = {
        metadata: {
          name: 'Quiz Sem ID',
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('id'))).toBe(true);
    });

    it('deve rejeitar template sem metadata.name', () => {
      const template = {
        metadata: {
          id: 'quiz-no-name',
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('name'))).toBe(true);
    });

    it('deve rejeitar template sem steps', () => {
      const template = {
        metadata: {
          id: 'quiz-no-steps',
          name: 'Quiz Sem Steps',
        },
        steps: {},
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('step'))).toBe(true);
    });

    it('deve rejeitar template com step inválida', () => {
      const template = {
        metadata: {
          id: 'quiz-invalid-step',
          name: 'Quiz com Step Inválida',
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [], // Array vazio - inválido
          },
        },
      };

      const result = validateTemplate(template);
      
      expect(result.success).toBe(false);
    });
  });
});

describe('templateSchema - Type Guards e Helpers', () => {
  describe('isValidTemplate', () => {
    it('deve retornar true para template válido', () => {
      const template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      expect(isValidTemplate(template)).toBe(true);
    });

    it('deve retornar false para template inválido', () => {
      const template = {
        metadata: { name: 'Test' }, // Falta id
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      expect(isValidTemplate(template)).toBe(false);
    });

    it('deve retornar false para objeto vazio', () => {
      expect(isValidTemplate({})).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(isValidTemplate(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(isValidTemplate(undefined)).toBe(false);
    });
  });

  describe('safeParseTemplate', () => {
    it('deve retornar template para dados válidos', () => {
      const template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const result = safeParseTemplate(template);
      
      expect(result).not.toBeNull();
      expect(result?.metadata.id).toBe('test');
    });

    it('deve retornar null para dados inválidos', () => {
      const invalidTemplate = {
        metadata: { name: 'Test' }, // Falta id
        steps: {},
      };

      const result = safeParseTemplate(invalidTemplate);
      
      expect(result).toBeNull();
    });

    it('deve retornar null para dados vazios', () => {
      expect(safeParseTemplate({})).toBeNull();
      expect(safeParseTemplate(null)).toBeNull();
      expect(safeParseTemplate(undefined)).toBeNull();
    });
  });

  describe('normalizeTemplate', () => {
    it('deve preencher version com default 3.1', () => {
      const template: Template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const normalized = normalizeTemplate(template);
      
      expect(normalized.metadata.version).toBe('3.1');
    });

    it('deve calcular totalSteps automaticamente', () => {
      const template: Template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step 1' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
          'step-02': {
            metadata: { id: 'step-02', name: 'Step 2' },
            blocks: [{ id: 'b2', type: 'Block' }],
          },
          'step-03': {
            metadata: { id: 'step-03', name: 'Step 3' },
            blocks: [{ id: 'b3', type: 'Block' }],
          },
        },
      };

      const normalized = normalizeTemplate(template);
      
      expect(normalized.metadata.totalSteps).toBe(3);
    });

    it('deve preencher tags com array vazio', () => {
      const template: Template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const normalized = normalizeTemplate(template);
      
      expect(normalized.metadata.tags).toEqual([]);
    });

    it('deve preservar valores existentes', () => {
      const template: Template = {
        metadata: {
          id: 'test',
          name: 'Test',
          version: '2.0',
          totalSteps: 10,
          tags: ['custom', 'tags'],
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      const normalized = normalizeTemplate(template);
      
      expect(normalized.metadata.version).toBe('2.0'); // Preserva
      expect(normalized.metadata.totalSteps).toBe(10); // Preserva
      expect(normalized.metadata.tags).toEqual(['custom', 'tags']); // Preserva
    });
  });
});

describe('templateSchema - Casos Especiais', () => {
  it('deve aceitar blocos com propriedades customizadas', () => {
    const template = {
      metadata: { id: 'custom', name: 'Custom Template' },
      steps: {
        'step-01': {
          metadata: { id: 'step-01', name: 'Custom Step' },
          blocks: [
            {
              id: 'custom-block',
              type: 'CustomType',
              customProp1: 'value1',
              customProp2: 123,
              customProp3: { nested: 'object' },
              customProp4: ['array', 'of', 'values'],
            },
          ],
        },
      },
    };

    const result = validateTemplate(template);
    
    expect(result.success).toBe(true);
  });

  it('deve validar template com múltiplas steps complexas', () => {
    const template = {
      metadata: {
        id: 'complex-quiz',
        name: 'Quiz Complexo',
        version: '3.1',
        totalSteps: 5,
        category: 'quiz',
        tags: ['complexo', 'teste'],
        author: 'Test System',
      },
      steps: {
        'step-01-intro': {
          metadata: {
            id: 'step-01-intro',
            name: 'Introdução',
            description: 'Tela de boas-vindas',
            category: 'intro',
            order: 1,
          },
          blocks: [
            { id: 'logo', type: 'IntroLogo', order: 0 },
            { id: 'title', type: 'IntroTitle', order: 1 },
            { id: 'subtitle', type: 'IntroSubtitle', order: 2 },
            { id: 'button', type: 'IntroButton', order: 3 },
          ],
        },
        'step-02-question-1': {
          metadata: {
            id: 'step-02-question-1',
            name: 'Questão 1',
            category: 'question',
            order: 2,
          },
          blocks: [
            { id: 'q1-text', type: 'QuestionText' },
            { id: 'q1-options', type: 'QuestionOptions' },
          ],
        },
        'step-03-question-2': [
          { id: 'q2-text', type: 'QuestionText' },
          { id: 'q2-options', type: 'QuestionOptions' },
        ],
        'step-04-result': {
          metadata: { id: 'step-04-result', name: 'Resultado' },
          blocks: [
            { id: 'result-title', type: 'ResultTitle' },
            { id: 'result-description', type: 'ResultDescription' },
            { id: 'result-cta', type: 'ResultCTA' },
          ],
        },
        'step-05-final': {
          metadata: { id: 'step-05-final', name: 'Final' },
          blocks: [{ id: 'thank-you', type: 'ThankYou' }],
        },
      },
    };

    const result = validateTemplate(template);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(Object.keys(result.data?.steps || {}).length).toBe(5);
  });

  it('deve validar template com blocos aninhados (parentId)', () => {
    const template = {
      metadata: { id: 'nested', name: 'Nested Blocks' },
      steps: {
        'step-01': {
          metadata: { id: 'step-01', name: 'Nested Step' },
          blocks: [
            { id: 'parent-1', type: 'Container' },
            { id: 'child-1', type: 'Text', parentId: 'parent-1' },
            { id: 'child-2', type: 'Image', parentId: 'parent-1' },
            { id: 'parent-2', type: 'Container' },
            { id: 'child-3', type: 'Button', parentId: 'parent-2' },
          ],
        },
      },
    };

    const result = validateTemplate(template);
    
    expect(result.success).toBe(true);
  });
});

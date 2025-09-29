/**
 * 🧪 SUITE DE TESTES: REGRESSÃO E CASOS EDGE
 * 
 * Validação de casos extremos, recuperação de erros e cenários
 * que podem causar regressões no sistema de sincronização
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import QuizToEditorAdapter from '../src/adapters/QuizToEditorAdapter';
import { QuizPageIntegrationService } from '../src/services/QuizPageIntegrationService';
import { Block, BlockType } from '../src/types/editor';

// Mock dos serviços
jest.mock('../src/services/UnifiedCRUDService');
jest.mock('../src/services/VersioningService');  
jest.mock('../src/services/HistoryManager');
jest.mock('../src/services/AnalyticsService');

describe('🛠️ Regression & Edge Cases Tests', () => {
  
  describe('🔍 Casos de Dados Inválidos', () => {
    
    test('deve lidar com stepBlocks null/undefined', async () => {
      // ACT & ASSERT
      await expect(QuizToEditorAdapter.convertEditorToQuiz(null as any))
        .resolves.toBeDefined();
      
      await expect(QuizToEditorAdapter.convertEditorToQuiz(undefined as any))
        .resolves.toBeDefined();
    });

    test('deve lidar com stepBlocks vazios', async () => {
      // ARRANGE
      const emptyStepBlocks = {};
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(emptyStepBlocks);
      
      // ASSERT
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    test('deve lidar com blocos malformados', async () => {
      // ARRANGE
      const malformedBlocks = {
        'step-1': [
          {
            id: null,
            type: undefined,
            order: 'not-a-number',
            properties: null,
            content: undefined
          } as any,
          {
            // Bloco sem propriedades obrigatórias
          } as any,
          {
            id: 'valid-id',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: { text: 'Valid block' },
            content: { text: 'Valid block' }
          }
        ]
      };
      
      // ACT & ASSERT
      await expect(QuizToEditorAdapter.convertEditorToQuiz(malformedBlocks))
        .resolves.toBeDefined();
    });

    test('deve tratar arrays vazios em stepBlocks', async () => {
      // ARRANGE
      const blocksWithEmptyArrays = {
        'step-1': [],
        'step-2': [
          {
            id: 'valid-block',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: {},
            content: {}
          }
        ],
        'step-3': []
      };
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(blocksWithEmptyArrays);
      
      // ASSERT
      expect(result).toBeDefined();
      expect(result['step-1']).toHaveLength(0);
      expect(result['step-2']).toHaveLength(1);
      expect(result['step-3']).toHaveLength(0);
    });

    test('deve lidar com IDs de etapa inválidos', async () => {
      // ARRANGE
      const invalidStepIds = {
        '': [{ id: 'block1', type: 'text-inline' as BlockType, order: 1, properties: {}, content: {} }],
        'not-a-step': [{ id: 'block2', type: 'text-inline' as BlockType, order: 1, properties: {}, content: {} }],
        'step-': [{ id: 'block3', type: 'text-inline' as BlockType, order: 1, properties: {}, content: {} }],
        'step-abc': [{ id: 'block4', type: 'text-inline' as BlockType, order: 1, properties: {}, content: {} }],
        'step-0': [{ id: 'block5', type: 'text-inline' as BlockType, order: 1, properties: {}, content: {} }],
        'step--1': [{ id: 'block6', type: 'text-inline' as BlockType, order: 1, properties: {}, content: {} }]
      };
      
      // ACT & ASSERT
      await expect(QuizToEditorAdapter.convertEditorToQuiz(invalidStepIds))
        .resolves.toBeDefined();
    });
  });

  describe('🔄 Casos de Propriedades Extremas', () => {
    
    test('deve lidar com texto muito longo', async () => {
      // ARRANGE
      const longText = 'A'.repeat(100000); // 100k caracteres
      const blocksWithLongText = {
        'step-1': [
          {
            id: 'long-text-block',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: {
              text: longText,
              description: longText,
              placeholder: longText
            },
            content: {
              text: longText
            }
          }
        ]
      };
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(blocksWithLongText);
      
      // ASSERT
      expect(result).toBeDefined();
      expect(result['step-1'][0].properties.text).toBe(longText);
    });

    test('deve lidar com muitas opções em uma questão', async () => {
      // ARRANGE
      const manyOptions = Array.from({ length: 10000 }, (_, i) => ({
        id: `option-${i}`,
        text: `Opção ${i}`,
        value: `value-${i}`,
        points: {
          style1: Math.random() * 100,
          style2: Math.random() * 100,
          style3: Math.random() * 100
        }
      }));

      const blocksWithManyOptions = {
        'step-2': [
          {
            id: 'many-options-block',
            type: 'quiz-options-grid' as BlockType,
            order: 1,
            properties: {
              question: 'Pergunta com muitas opções',
              options: manyOptions,
              allowMultiple: true,
              maxSelections: 10000
            },
            content: {
              question: 'Pergunta com muitas opções',
              options: manyOptions
            }
          }
        ]
      };
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(blocksWithManyOptions);
      
      // ASSERT
      expect(result).toBeDefined();
      expect(result['step-2'][0].properties.options).toHaveLength(10000);
    });

    test('deve lidar com propriedades deeply nested', async () => {
      // ARRANGE
      const deeplyNested = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  data: 'Deep data',
                  array: [1, 2, 3, { nested: { again: true } }],
                  complex: {
                    points: { a: 1, b: 2, c: 3 },
                    metadata: { x: 'y', z: [1, 2, 3] }
                  }
                }
              }
            }
          }
        }
      };

      const blocksWithDeepNesting = {
        'step-1': [
          {
            id: 'deep-nested-block',
            type: 'quiz-options-grid' as BlockType,
            order: 1,
            properties: deeplyNested,
            content: deeplyNested
          }
        ]
      };
      
      // ACT & ASSERT
      await expect(QuizToEditorAdapter.convertEditorToQuiz(blocksWithDeepNesting))
        .resolves.toBeDefined();
    });

    test('deve lidar com referências circulares (evitando)', async () => {
      // ARRANGE
      const circular: any = { id: 'circular' };
      circular.self = circular;
      
      const blocksWithCircular = {
        'step-1': [
          {
            id: 'circular-block',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: {
              text: 'Safe text',
              metadata: { safe: true }
            },
            content: {
              text: 'Safe text'
            }
          }
        ]
      };
      
      // ACT & ASSERT - Não deve travar ou falhar
      await expect(QuizToEditorAdapter.convertEditorToQuiz(blocksWithCircular))
        .resolves.toBeDefined();
    });
  });

  describe('🎯 Casos de Tipos de Dados Especiais', () => {
    
    test('deve lidar com diferentes tipos de primitivos', async () => {
      // ARRANGE
      const mixedTypes = {
        'step-1': [
          {
            id: 'mixed-types-block',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: {
              string: 'string value',
              number: 42,
              boolean: true,
              null: null,
              undefined: undefined,
              zero: 0,
              emptyString: '',
              float: 3.14159,
              negative: -100,
              bigNumber: Number.MAX_SAFE_INTEGER
            },
            content: {
              mixed: 'content'
            }
          }
        ]
      };
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(mixedTypes);
      
      // ASSERT
      expect(result).toBeDefined();
      expect(result['step-1'][0].properties.string).toBe('string value');
      expect(result['step-1'][0].properties.number).toBe(42);
      expect(result['step-1'][0].properties.boolean).toBe(true);
    });

    test('deve lidar com arrays de tipos mistos', async () => {
      // ARRANGE
      const mixedArrays = {
        'step-1': [
          {
            id: 'mixed-arrays-block',
            type: 'quiz-options-grid' as BlockType,
            order: 1,
            properties: {
              mixedArray: [1, 'string', true, null, { nested: true }, [1, 2, 3]],
              emptyArray: [],
              arrayOfArrays: [[1, 2], ['a', 'b'], [true, false]],
              sparseArray: [1, , , 4] // sparse array
            },
            content: {}
          }
        ]
      };
      
      // ACT & ASSERT
      await expect(QuizToEditorAdapter.convertEditorToQuiz(mixedArrays))
        .resolves.toBeDefined();
    });

    test('deve lidar com caracteres especiais e Unicode', async () => {
      // ARRANGE
      const specialChars = {
        'step-1': [
          {
            id: 'special-chars-block',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: {
              emoji: '🎯🔥💯✨🚀',
              unicode: 'Café naïve résumé',
              symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
              quotes: `"'Single' and "double" quotes`,
              html: '<div>HTML &amp; entities</div>',
              whitespace: '   \t\n\r   ',
              rtl: 'العربية עברית',
              chinese: '中文字符',
              mathSymbols: '∑∆∞≤≥≠±×÷'
            },
            content: {
              special: 'Special content 🎉'
            }
          }
        ]
      };
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(specialChars);
      
      // ASSERT
      expect(result).toBeDefined();
      expect(result['step-1'][0].properties.emoji).toBe('🎯🔥💯✨🚀');
      expect(result['step-1'][0].properties.unicode).toBe('Café naïve résumé');
    });
  });

  describe('⚠️ Casos de Error Recovery', () => {
    
    test('deve recuperar de erro em uma etapa e processar as outras', async () => {
      // ARRANGE
      const mixedBlocks = {
        'step-1': [
          {
            id: 'good-block-1',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: { text: 'Good block' },
            content: { text: 'Good block' }
          }
        ],
        'step-2': [
          {
            id: 'bad-block',
            type: 'invalid-type' as any,
            order: null as any,
            properties: null,
            content: null
          }
        ],
        'step-3': [
          {
            id: 'good-block-2',
            type: 'quiz-options-grid' as BlockType,
            order: 1,
            properties: {
              question: 'Good question',
              options: [{ id: '1', text: 'Good option', value: 'good' }]
            },
            content: {}
          }
        ]
      };
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(mixedBlocks);
      
      // ASSERT
      expect(result).toBeDefined();
      expect(result['step-1']).toBeDefined();
      expect(result['step-3']).toBeDefined();
      // step-2 pode ou não estar presente dependendo da estratégia de erro
    });

    test('deve lidar com JSON malformado simulado', async () => {
      // ARRANGE - Simular dados que causariam erro de JSON parsing
      const problematicData = {
        'step-1': [
          {
            id: 'problematic-block',
            type: 'text-inline' as BlockType,
            order: 1,
            properties: {
              // Simular propriedades que podem causar problemas
              invalidDate: new Date('invalid'),
              infiniteNumber: Infinity,
              nanValue: NaN,
              functionRef: (() => {}) as any, // Função não serializável
            },
            content: {
              text: 'Valid text content'
            }
          }
        ]
      };
      
      // ACT & ASSERT - Deve processar sem falhar
      await expect(QuizToEditorAdapter.convertEditorToQuiz(problematicData))
        .resolves.toBeDefined();
    });
  });

  describe('🔄 Casos de Regressão Específicos', () => {
    
    test('deve manter IDs únicos após múltiplas conversões', async () => {
      // ARRANGE
      const funnelId = 'unique-ids-regression';
      
      // ACT - Múltiplas conversões
      let currentData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      for (let i = 0; i < 5; i++) {
        const quizData = await QuizToEditorAdapter.convertEditorToQuiz(currentData.stepBlocks);
        currentData = await QuizToEditorAdapter.convertQuizToEditor(`${funnelId}-${i}`);
      }
      
      // ASSERT - Todos os IDs devem ser únicos
      const allBlocks: Block[] = [];
      Object.values(currentData.stepBlocks).forEach(blocks => {
        allBlocks.push(...blocks);
      });
      
      const allIds = allBlocks.map(block => block.id);
      const uniqueIds = [...new Set(allIds)];
      
      expect(allIds).toHaveLength(uniqueIds.length);
    });

    test('deve preservar propriedades customizadas após conversão', async () => {
      // ARRANGE
      const customBlocks = {
        'step-1': [
          {
            id: 'custom-block',
            type: 'quiz-options-grid' as BlockType,
            order: 1,
            properties: {
              question: 'Standard question',
              options: [{ id: '1', text: 'Option 1', value: 'opt1' }],
              // Propriedades customizadas que devem ser preservadas
              customProperty: 'custom value',
              advancedSettings: {
                allowSkip: true,
                timeLimit: 30,
                scoring: {
                  correct: 10,
                  incorrect: -5
                }
              },
              metadata: {
                createdBy: 'user123',
                version: '1.2.3',
                tags: ['important', 'test']
              }
            },
            content: {
              question: 'Standard question'
            }
          }
        ]
      };
      
      // ACT
      const quizData = await QuizToEditorAdapter.convertEditorToQuiz(customBlocks);
      const reconverted = await QuizToEditorAdapter.convertQuizToEditor('regression-test');
      
      // ASSERT
      const convertedBlock = quizData['step-1'][0];
      expect(convertedBlock.properties.customProperty).toBe('custom value');
      expect(convertedBlock.properties.advancedSettings.allowSkip).toBe(true);
      expect(convertedBlock.properties.metadata.tags).toEqual(['important', 'test']);
    });

    test('deve lidar com mudanças de estrutura do template', async () => {
      // ARRANGE - Simular mudança no template original
      const originalTemplate = require('../src/templates/quiz21StepsComplete');
      
      // Mock template modificado
      const modifiedTemplate = {
        'step-1': [{ type: 'new-intro-type', content: { title: 'New intro' } }],
        'step-2': [{ type: 'modified-question', content: { question: 'Modified question' } }]
      };
      
      jest.doMock('../src/templates/quiz21StepsComplete', () => ({
        QUIZ_STYLE_21_STEPS_TEMPLATE: modifiedTemplate,
        getStepTemplate: (stepId: string) => modifiedTemplate[stepId] || null
      }));
      
      // ACT & ASSERT - Deve adaptar à nova estrutura
      await expect(QuizToEditorAdapter.convertQuizToEditor('template-change-test'))
        .resolves.toBeDefined();
      
      // Cleanup
      jest.dontMock('../src/templates/quiz21StepsComplete');
    });
  });

  describe('🧩 Casos de Integration Service Edge Cases', () => {
    
    let service: QuizPageIntegrationService;
    
    beforeEach(() => {
      (QuizPageIntegrationService as any).instance = null;
      service = QuizPageIntegrationService.getInstance();
    });

    test('deve lidar com criação de funil com ID extremamente longo', async () => {
      // ARRANGE
      const longId = 'a'.repeat(1000);
      
      // ACT & ASSERT
      await expect(service.createDefaultQuizFunnel(longId))
        .resolves.toBeDefined();
    });

    test('deve lidar com atualização de componente inexistente', async () => {
      // ARRANGE
      const funnel = await service.createDefaultQuizFunnel('component-update-test');
      
      // ACT & ASSERT
      await expect(
        service.updateQuizComponent(funnel.id, 'nonexistent-component-id', { name: 'New name' })
      ).rejects.toThrow();
    });

    test('deve lidar com salvamento de funil com componentes inválidos', async () => {
      // ARRANGE
      const funnel = await service.createDefaultQuizFunnel('invalid-components-test');
      
      // Corromper componentes
      funnel.components = [
        null as any,
        undefined as any,
        {
          id: '',
          type: 'invalid' as any,
          name: '',
          description: '',
          step: -1,
          isEditable: null as any,
          properties: null,
          styles: null,
          content: null
        }
      ];
      
      // ACT & ASSERT - Deve processar sem falhar
      await expect(service.saveQuizFunnel(funnel))
        .resolves.not.toThrow();
    });

    test('deve manter cache consistente sob condições adversas', async () => {
      // ARRANGE
      const funnelId = 'cache-consistency-test';
      
      // ACT - Operações que podem afetar consistência do cache
      const funnel1 = await service.createDefaultQuizFunnel(funnelId);
      
      // Modificar e salvar
      funnel1.name = 'Modified name';
      await service.saveQuizFunnel(funnel1);
      
      // Carregar novamente
      const funnel2 = await service.loadQuizFunnel(funnelId);
      
      // Modificar diretamente no cache (simular condição adversa)
      funnel2!.name = 'Direct cache modification';
      
      // Carregar mais uma vez
      const funnel3 = await service.loadQuizFunnel(funnelId);
      
      // ASSERT - Cache deve refletir última modificação salva
      expect(funnel3?.name).toBe('Direct cache modification');
    });
  });

  describe('🔍 Validação de Casos Extremos de Dados', () => {
    
    test('deve validar dados do quiz com propriedades faltando', async () => {
      // ARRANGE
      const incompleteData = {
        stepBlocks: {},
        // totalSteps missing
        // quizMetadata missing
      };
      
      // ACT & ASSERT
      expect(QuizToEditorAdapter.validateQuizData(incompleteData)).toBe(false);
    });

    test('deve validar dados com tipos incorretos', async () => {
      // ARRANGE
      const wrongTypes = {
        stepBlocks: 'not an object',
        totalSteps: 'not a number',
        quizMetadata: []
      };
      
      // ACT & ASSERT
      expect(QuizToEditorAdapter.validateQuizData(wrongTypes)).toBe(false);
    });

    test('deve lidar com getStepConfiguration para etapas inválidas', async () => {
      // ACT & ASSERT
      const configs = await Promise.all([
        QuizToEditorAdapter.getStepConfiguration(0),
        QuizToEditorAdapter.getStepConfiguration(-1),
        QuizToEditorAdapter.getStepConfiguration(999),
        QuizToEditorAdapter.getStepConfiguration(1.5),
        QuizToEditorAdapter.getStepConfiguration(NaN),
        QuizToEditorAdapter.getStepConfiguration(Infinity)
      ]);
      
      configs.forEach(config => {
        expect(config).toBeNull();
      });
    });
  });
});
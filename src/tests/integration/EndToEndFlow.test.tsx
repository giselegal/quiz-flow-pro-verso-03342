/**
 * 🧪 SUITE DE TESTES: INTEGRAÇÃO END-TO-END
 * 
 * Testes completos do fluxo Editor → Quiz → Salvamento → Carregamento
 * Validação de toda a cadeia de sincronização bidirecional
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Imports dos componentes e serviços
import QuizToEditorAdapter from '../src/adapters/QuizToEditorAdapter';
import { QuizPageIntegrationService } from '../src/services/QuizPageIntegrationService';
import { unifiedCRUDService } from '../src/services/UnifiedCRUDService';
import { QuizFlowController } from '../src/components/editor/quiz/QuizStateController';
import { EditorProvider } from '../src/components/editor/EditorProviderMigrationAdapter';
import { PureBuilderProvider } from '../src/components/editor/PureBuilderProvider';

// Mock dos serviços externos
jest.mock('../src/services/UnifiedCRUDService');
jest.mock('../src/services/VersioningService');
jest.mock('../src/services/HistoryManager');
jest.mock('../src/services/AnalyticsService');

describe('🌍 End-to-End Integration Tests', () => {
  
  let mockCRUDService: jest.Mocked<typeof unifiedCRUDService>;
  let integrationService: QuizPageIntegrationService;
  
  // Mock data
  const mockQuizFunnelData = {
    id: 'e2e-test-funnel',
    name: 'E2E Test Quiz',
    description: 'End-to-end test funnel',
    type: 'quiz' as const,
    status: 'draft' as const,
    version: '1.0.0',
    totalSteps: 21,
    components: [
      {
        id: 'intro-component',
        type: 'intro' as const,
        name: 'Introduction',
        description: 'Quiz introduction',
        step: 1,
        isEditable: true,
        properties: {
          title: 'Original Title',
          subtitle: 'Original Subtitle'
        },
        styles: {},
        content: {
          title: 'Original Title',
          description: 'Original Subtitle'
        }
      },
      {
        id: 'question-component-1',
        type: 'question' as const,
        name: 'First Question',
        description: 'First quiz question',
        step: 2,
        isEditable: true,
        properties: {
          question: 'Original Question',
          options: [
            { id: 'opt1', text: 'Original Option 1', value: 'opt1' },
            { id: 'opt2', text: 'Original Option 2', value: 'opt2' }
          ]
        },
        styles: {},
        content: {
          title: 'Original Question',
          options: [
            { id: 'opt1', text: 'Original Option 1', value: 'opt1' },
            { id: 'opt2', text: 'Original Option 2', value: 'opt2' }
          ]
        }
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockCRUDService = unifiedCRUDService as jest.Mocked<typeof unifiedCRUDService>;
    mockCRUDService.getFunnel.mockResolvedValue(null);
    mockCRUDService.saveFunnel.mockResolvedValue(undefined);
    mockCRUDService.getAllFunnels.mockResolvedValue([]);
    
    // Reset service instance
    (QuizPageIntegrationService as any).instance = null;
    integrationService = QuizPageIntegrationService.getInstance();
  });

  describe('🔄 Fluxo Completo: Quiz → Editor → Modificação → Salvamento', () => {
    
    test('deve converter quiz para editor, modificar e salvar corretamente', async () => {
      // PHASE 1: CONVERSÃO QUIZ → EDITOR
      // =========================================
      
      const funnelId = 'full-flow-test';
      
      // ACT - Converter quiz para editor
      const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // ASSERT - Verificar conversão
      expect(editorData).toEqual(
        expect.objectContaining({
          stepBlocks: expect.any(Object),
          totalSteps: 21,
          quizMetadata: expect.objectContaining({
            styles: expect.arrayContaining(['Natural', 'Clássico']),
            scoringSystem: expect.any(Object)
          })
        })
      );

      // PHASE 2: SIMULAÇÃO DE EDIÇÃO NO EDITOR
      // =========================================
      
      // Simular mudanças feitas no editor
      const modifiedStepBlocks = { ...editorData.stepBlocks };
      
      // Modificar step-1 (introdução)
      if (modifiedStepBlocks['step-1'] && modifiedStepBlocks['step-1'][0]) {
        modifiedStepBlocks['step-1'][0] = {
          ...modifiedStepBlocks['step-1'][0],
          content: {
            ...modifiedStepBlocks['step-1'][0].content,
            text: 'Título Editado no Editor'
          },
          properties: {
            ...modifiedStepBlocks['step-1'][0].properties,
            text: 'Título Editado no Editor'
          }
        };
      }

      // Modificar step-2 (primeira questão)
      if (modifiedStepBlocks['step-2'] && modifiedStepBlocks['step-2'][0]) {
        modifiedStepBlocks['step-2'][0] = {
          ...modifiedStepBlocks['step-2'][0],
          properties: {
            ...modifiedStepBlocks['step-2'][0].properties,
            question: 'Pergunta Editada no Editor',
            options: [
              { id: '1', text: 'Nova Opção 1 Editada', points: { classico: 15 } },
              { id: '2', text: 'Nova Opção 2 Editada', points: { romantico: 12 } }
            ]
          }
        };
      }

      // PHASE 3: CONVERSÃO EDITOR → QUIZ
      // =========================================
      
      // ACT - Converter de volta para quiz
      const convertedQuizData = await QuizToEditorAdapter.convertEditorToQuiz(modifiedStepBlocks);
      
      // ASSERT - Verificar que modificações foram preservadas
      expect(convertedQuizData['step-1'][0]).toEqual(
        expect.objectContaining({
          properties: expect.objectContaining({
            text: 'Título Editado no Editor'
          })
        })
      );

      expect(convertedQuizData['step-2'][0]).toEqual(
        expect.objectContaining({
          properties: expect.objectContaining({
            question: 'Pergunta Editada no Editor',
            options: expect.arrayContaining([
              expect.objectContaining({ text: 'Nova Opção 1 Editada' }),
              expect.objectContaining({ text: 'Nova Opção 2 Editada' })
            ])
          })
        })
      );

      // PHASE 4: SALVAMENTO VIA INTEGRATION SERVICE
      // =========================================
      
      // Simular criação e salvamento do funil
      const savedFunnel = await integrationService.createDefaultQuizFunnel(funnelId);
      
      // Aplicar mudanças do editor ao funil
      savedFunnel.name = 'Funil Editado';
      savedFunnel.components[0].content.title = 'Título Editado no Editor';
      
      // ACT - Salvar funil modificado
      await integrationService.saveQuizFunnel(savedFunnel);
      
      // ASSERT - Verificar que salvamento foi chamado
      expect(mockCRUDService.saveFunnel).toHaveBeenCalledWith(
        expect.objectContaining({
          id: funnelId,
          name: 'Funil Editado',
          type: 'quiz'
        })
      );
    });

    test('deve preservar pontuação do quiz durante todo o fluxo', async () => {
      // ARRANGE
      const funnelId = 'scoring-preservation-test';
      
      // PHASE 1: Conversão inicial
      const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // PHASE 2: Modificar opções com pontuações específicas
      const modifiedBlocks = { ...editorData.stepBlocks };
      if (modifiedBlocks['step-2'] && modifiedBlocks['step-2'][0]) {
        modifiedBlocks['step-2'][0].properties = {
          ...modifiedBlocks['step-2'][0].properties,
          options: [
            { 
              id: 'custom-1', 
              text: 'Estilo Clássico Intenso', 
              points: { classico: 25, elegante: 15 } 
            },
            { 
              id: 'custom-2', 
              text: 'Romântico Puro', 
              points: { romantico: 30, sexy: 10 } 
            }
          ]
        };
      }

      // PHASE 3: Conversão de volta
      const convertedQuiz = await QuizToEditorAdapter.convertEditorToQuiz(modifiedBlocks);
      
      // ASSERT - Verificar preservação das pontuações
      const questionBlock = convertedQuiz['step-2'][0];
      expect(questionBlock.properties.options).toEqual([
        expect.objectContaining({
          text: 'Estilo Clássico Intenso',
          points: { classico: 25, elegante: 15 }
        }),
        expect.objectContaining({
          text: 'Romântico Puro',
          points: { romantico: 30, sexy: 10 }
        })
      ]);
    });
  });

  describe('🔄 Fluxo de Carregamento: Persistência → Quiz → Editor', () => {
    
    test('deve carregar funil salvo e converter para editor', async () => {
      // PHASE 1: SETUP - Simular funil salvo
      // =========================================
      
      const funnelId = 'load-flow-test';
      mockCRUDService.getFunnel.mockResolvedValue({
        id: funnelId,
        name: 'Funil Salvo',
        description: 'Descrição do funil salvo',
        type: 'quiz',
        status: 'published',
        stages: [
          {
            id: 'saved-stage-1',
            type: 'intro',
            name: 'Introdução Salva',
            order: 1,
            blocks: [
              {
                id: 'saved-block-1',
                type: 'text-inline',
                content: { text: 'Texto Salvo' }
              }
            ]
          }
        ]
      });

      // PHASE 2: CARREGAMENTO VIA INTEGRATION SERVICE
      // =========================================
      
      // ACT - Carregar funil
      const loadedFunnel = await integrationService.loadQuizFunnel(funnelId);
      
      // ASSERT - Verificar carregamento
      expect(loadedFunnel).not.toBeNull();
      expect(loadedFunnel?.name).toBe('Funil Salvo');
      expect(loadedFunnel?.type).toBe('quiz');
      expect(loadedFunnel?.components).toHaveLength(1);

      // PHASE 3: CONVERSÃO PARA EDITOR
      // =========================================
      
      // Simular stepBlocks baseados no funil carregado
      const mockStepBlocks = {
        'step-1': [
          {
            id: 'loaded-block-1',
            type: 'text-inline' as const,
            order: 1,
            properties: { text: 'Texto Salvo' },
            content: { text: 'Texto Salvo' }
          }
        ]
      };

      // ACT - Converter para formato editor
      const editorFormat = await QuizToEditorAdapter.convertEditorToQuiz(mockStepBlocks);
      
      // ASSERT - Verificar conversão
      expect(editorFormat['step-1']).toHaveLength(1);
      expect(editorFormat['step-1'][0]).toEqual(
        expect.objectContaining({
          properties: expect.objectContaining({
            text: 'Texto Salvo'
          })
        })
      );
    });
  });

  describe('🧪 Cenários de Integração Complexos', () => {
    
    test('deve lidar com múltiplas modificações sequenciais', async () => {
      // ARRANGE
      const funnelId = 'sequential-changes-test';
      
      // ACT - Série de modificações
      let currentData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // Modificação 1: Alterar título
      currentData.stepBlocks['step-1'][0].content = { text: 'Título v1' };
      let quizData1 = await QuizToEditorAdapter.convertEditorToQuiz(currentData.stepBlocks);
      currentData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // Modificação 2: Alterar questão
      currentData.stepBlocks['step-2'][0].properties = {
        ...currentData.stepBlocks['step-2'][0].properties,
        question: 'Questão v2'
      };
      let quizData2 = await QuizToEditorAdapter.convertEditorToQuiz(currentData.stepBlocks);
      currentData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // Modificação 3: Adicionar mais opções
      currentData.stepBlocks['step-2'][0].properties = {
        ...currentData.stepBlocks['step-2'][0].properties,
        options: [
          { id: '1', text: 'Opção A v3', points: { classico: 10 } },
          { id: '2', text: 'Opção B v3', points: { romantico: 8 } },
          { id: '3', text: 'Opção C v3', points: { criativo: 12 } }
        ]
      };
      let quizData3 = await QuizToEditorAdapter.convertEditorToQuiz(currentData.stepBlocks);
      
      // ASSERT - Verificar que cada modificação foi aplicada
      expect(quizData3['step-2'][0].properties.options).toHaveLength(3);
      expect(quizData3['step-2'][0].properties.options[2]).toEqual(
        expect.objectContaining({
          text: 'Opção C v3',
          points: { criativo: 12 }
        })
      );
    });

    test('deve manter sincronização com simulação de concorrência', async () => {
      // ARRANGE
      const funnelId = 'concurrency-test';
      
      // ACT - Simular operações concorrentes
      const operations = [
        // Operação 1: Modificar step-1
        (async () => {
          const data = await QuizToEditorAdapter.convertQuizToEditor(`${funnelId}-1`);
          data.stepBlocks['step-1'][0].content = { text: 'Concurrent Edit 1' };
          return QuizToEditorAdapter.convertEditorToQuiz(data.stepBlocks);
        })(),
        
        // Operação 2: Modificar step-2
        (async () => {
          const data = await QuizToEditorAdapter.convertQuizToEditor(`${funnelId}-2`);
          data.stepBlocks['step-2'][0].properties.question = 'Concurrent Question 2';
          return QuizToEditorAdapter.convertEditorToQuiz(data.stepBlocks);
        })(),
        
        // Operação 3: Criar e salvar funil
        (async () => {
          const funnel = await integrationService.createDefaultQuizFunnel(`${funnelId}-3`);
          funnel.name = 'Concurrent Funnel 3';
          await integrationService.saveQuizFunnel(funnel);
          return funnel;
        })()
      ];
      
      // ASSERT - Todas as operações devem completar sem erro
      const results = await Promise.all(operations);
      
      expect(results).toHaveLength(3);
      expect(results[0]['step-1'][0].content.text).toBe('Concurrent Edit 1');
      expect(results[1]['step-2'][0].properties.question).toBe('Concurrent Question 2');
      expect(results[2].name).toBe('Concurrent Funnel 3');
    });

    test('deve validar integridade de dados em fluxo completo', async () => {
      // ARRANGE
      const funnelId = 'integrity-validation-test';
      
      // PHASE 1: Criar estrutura complexa
      const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // Adicionar dados complexos
      const complexOptions = [
        { 
          id: 'complex-1', 
          text: 'Opção Complexa 1',
          imageUrl: '/images/complex1.jpg',
          points: { classico: 15, elegante: 10, natural: 5 }
        },
        { 
          id: 'complex-2', 
          text: 'Opção Complexa 2',
          imageUrl: '/images/complex2.jpg',
          points: { romantico: 20, sexy: 15, dramatico: 8 }
        }
      ];

      editorData.stepBlocks['step-2'][0].properties = {
        ...editorData.stepBlocks['step-2'][0].properties,
        question: 'Pergunta Complexa com Múltiplas Propriedades',
        options: complexOptions,
        allowMultiple: true,
        maxSelections: 2,
        required: true,
        customValidation: {
          minSelections: 1,
          errorMessage: 'Selecione pelo menos uma opção'
        }
      };

      // PHASE 2: Conversão e verificação
      const convertedQuiz = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);
      
      // PHASE 3: Reconversão para verificar consistência
      const reconvertedEditor = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // ASSERT - Verificar integridade completa
      const questionBlock = convertedQuiz['step-2'][0];
      
      expect(questionBlock.properties).toEqual(
        expect.objectContaining({
          question: 'Pergunta Complexa com Múltiplas Propriedades',
          allowMultiple: true,
          maxSelections: 2,
          required: true,
          options: expect.arrayContaining([
            expect.objectContaining({
              text: 'Opção Complexa 1',
              imageUrl: '/images/complex1.jpg',
              points: { classico: 15, elegante: 10, natural: 5 }
            }),
            expect.objectContaining({
              text: 'Opção Complexa 2',
              imageUrl: '/images/complex2.jpg', 
              points: { romantico: 20, sexy: 15, dramatico: 8 }
            })
          ])
        })
      );
    });
  });

  describe('⚠️ Cenários de Recuperação de Erro', () => {
    
    test('deve lidar com falha na conversão e fazer fallback', async () => {
      // ARRANGE
      const originalMethod = QuizToEditorAdapter.convertEditorToQuiz;
      let callCount = 0;
      
      // Mock para falhar na primeira tentativa
      jest.spyOn(QuizToEditorAdapter, 'convertEditorToQuiz').mockImplementation(async (stepBlocks) => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Falha na conversão');
        }
        return originalMethod(stepBlocks);
      });

      // ACT & ASSERT
      const funnelId = 'error-recovery-test';
      const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
      
      // Primeira tentativa deve falhar
      await expect(
        QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks)
      ).rejects.toThrow('Falha na conversão');
      
      // Segunda tentativa deve funcionar
      const result = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);
      expect(result).toBeDefined();
    });

    test('deve lidar com dados corrompidos graciosamente', async () => {
      // ARRANGE
      const corruptedStepBlocks = {
        'step-1': [
          {
            id: null as any,
            type: 'invalid-type' as any,
            order: 'not-a-number' as any,
            properties: null,
            content: undefined
          }
        ]
      };

      // ACT & ASSERT
      await expect(
        QuizToEditorAdapter.convertEditorToQuiz(corruptedStepBlocks)
      ).resolves.toBeDefined();
    });

    test('deve manter funcionalidade básica mesmo com erros parciais', async () => {
      // ARRANGE
      const partiallyCorruptedData = await QuizToEditorAdapter.convertQuizToEditor('partial-error-test');
      
      // Corromper apenas uma parte dos dados
      partiallyCorruptedData.stepBlocks['step-1'] = null as any;
      
      // ACT
      const result = await QuizToEditorAdapter.convertEditorToQuiz(partiallyCorruptedData.stepBlocks);
      
      // ASSERT - Deve processar as partes válidas
      expect(result).toBeDefined();
      expect(result['step-2']).toBeDefined(); // Partes válidas devem estar presentes
    });
  });
});

describe('📊 Métricas de Performance End-to-End', () => {
  
  test('deve completar fluxo completo em tempo aceitável', async () => {
    // ARRANGE
    const startTime = Date.now();
    const funnelId = 'performance-e2e-test';
    
    // ACT - Fluxo completo
    const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
    
    // Simular modificações
    editorData.stepBlocks['step-1'][0].content = { text: 'Performance Test' };
    
    const convertedQuiz = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);
    
    const integrationService = QuizPageIntegrationService.getInstance();
    const funnel = await integrationService.createDefaultQuizFunnel(funnelId);
    await integrationService.saveQuizFunnel(funnel);
    
    const endTime = Date.now();
    
    // ASSERT
    expect(endTime - startTime).toBeLessThan(3000); // < 3 segundos
    expect(convertedQuiz).toBeDefined();
  });

  test('deve manter performance com dados grandes', async () => {
    // ARRANGE
    const funnelId = 'large-data-test';
    const startTime = Date.now();
    
    // Criar dados grandes
    const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
    
    // Adicionar muitas opções a cada questão
    Object.keys(editorData.stepBlocks).forEach(stepId => {
      editorData.stepBlocks[stepId].forEach(block => {
        if (block.type === 'quiz-options-grid') {
          block.properties.options = Array.from({ length: 20 }, (_, i) => ({
            id: `option-${i}`,
            text: `Opção ${i} com texto longo que simula conteúdo real do quiz`,
            points: {
              classico: Math.floor(Math.random() * 20),
              romantico: Math.floor(Math.random() * 20),
              natural: Math.floor(Math.random() * 20),
              elegante: Math.floor(Math.random() * 20)
            }
          }));
        }
      });
    });

    // ACT
    const convertedQuiz = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);
    const reconverted = await QuizToEditorAdapter.convertQuizToEditor(`${funnelId}-reconvert`);
    
    const endTime = Date.now();
    
    // ASSERT
    expect(endTime - startTime).toBeLessThan(5000); // < 5 segundos mesmo com dados grandes
    expect(convertedQuiz).toBeDefined();
    expect(reconverted).toBeDefined();
  });
});
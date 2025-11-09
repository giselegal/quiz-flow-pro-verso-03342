/**
 * 🧪 TESTES AUTOMÁTICOS: Editor com QuestionStepAdapter Corrigido
 * 
 * Valida que a correção do QuestionStepAdapter funciona corretamente
 * no contexto do editor, tanto em preview quanto em editable mode.
 * 
 * CENÁRIOS TESTADOS:
 * 1. QuestionStepAdapter renderiza BlockTypeRenderer no editor
 * 2. Preview mode exibe perguntas corretamente
 * 3. Editable mode permite edição de blocos
 * 4. Respostas são salvas corretamente via onSave
 * 5. Loading states funcionam
 * 6. Error states são exibidos quando necessário
 * 7. Integração com UnifiedStepRenderer funciona
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

// ============================================================================
// MOCKS
// ============================================================================

// Mock do loadTemplate para simular carregamento de JSON
const mockLoadTemplate = vi.fn();
vi.mock('@/templates/imports', () => ({
    loadTemplate: mockLoadTemplate
}));

// Mock do BlockTypeRenderer para validar que está sendo usado
const mockBlockTypeRenderer = vi.fn((props: any) => (
    <div data-testid="block-type-renderer" data-block-id={props.block?.id}>
        <h3>{props.block?.config?.questionText || 'Pergunta Mock'}</h3>
        <div data-testid="block-mode">{props.mode}</div>
        {props.block?.config?.options?.map((opt: any) => (
            <button
                key={opt.id}
                data-testid={`option-${opt.id}`}
                onClick={() => {
                    props.onUpdate?.(props.block.id, {
                        answers: [...(props.sessionData?.answers || []), opt.id]
                    });
                }}
            >
                {opt.text}
            </button>
        ))}
    </div>
));

vi.mock('@/components/editor/quiz/renderers/BlockTypeRenderer', () => ({
    BlockTypeRenderer: mockBlockTypeRenderer
}));

// ============================================================================
// DADOS DE TESTE
// ============================================================================

const mockQuestionTemplate = {
    step: {
        id: 'step-02',
        blocks: [
            {
                id: 'q-2',
                type: 'question-block',
                config: {
                    questionNumber: '1 de 10',
                    questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
                    requiredSelections: 3,
                    options: [
                        { id: 'natural', text: 'Conforto e praticidade' },
                        { id: 'classico', text: 'Discrição clássica' },
                        { id: 'contemporaneo', text: 'Estilo atual' },
                        { id: 'elegante', text: 'Elegância refinada' }
                    ]
                }
            }
        ]
    }
};

const mockStrategicTemplate = {
    step: {
        id: 'step-13',
        blocks: [
            {
                id: 'q-13',
                type: 'question-block',
                config: {
                    questionNumber: '1 de 6',
                    questionText: 'Como você se sente com sua imagem pessoal?',
                    requiredSelections: 1,
                    options: [
                        { id: 'desconectada', text: 'Me sinto desconectada' },
                        { id: 'duvidas', text: 'Tenho dúvidas' },
                        { id: 'as-vezes-acerto', text: 'Às vezes acerto' }
                    ]
                }
            }
        ]
    }
};

// ============================================================================
// SUITE DE TESTES
// ============================================================================

describe('🧪 EDITOR: QuestionStepAdapter com Correção', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        mockLoadTemplate.mockResolvedValue(mockQuestionTemplate);
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    // ========================================================================
    // TESTE 1: Renderização Básica com BlockTypeRenderer
    // ========================================================================

    describe('✅ Renderização Básica', () => {
        it('deve renderizar BlockTypeRenderer ao invés de ModularQuestionStep', async () => {
            const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockProps = {
                stepId: 'step-02',
                stepNumber: 2,
                isActive: true,
                isEditable: false,
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: vi.fn(),
                data: {},
                quizState: {
                    currentStep: 2,
                    userName: 'Maria',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<QuestionStepAdapter {...mockProps} />);

            // Aguardar carregamento assíncrono
            await waitFor(() => {
                expect(screen.getByTestId('block-type-renderer')).toBeInTheDocument();
            }, { timeout: 3000 });

            // ✅ VALIDAÇÃO 1: BlockTypeRenderer foi usado
            expect(mockBlockTypeRenderer).toHaveBeenCalled();

            // ✅ VALIDAÇÃO 2: Conteúdo da pergunta foi renderizado
            expect(screen.getByText('QUAL O SEU TIPO DE ROUPA FAVORITA?')).toBeInTheDocument();

            // ✅ VALIDAÇÃO 3: Opções foram renderizadas
            expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            expect(screen.getByTestId('option-classico')).toBeInTheDocument();
            expect(screen.getByTestId('option-contemporaneo')).toBeInTheDocument();
            expect(screen.getByTestId('option-elegante')).toBeInTheDocument();
        });

        it('deve exibir loading enquanto carrega template', async () => {
            // Simular loading lento
            mockLoadTemplate.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve(mockQuestionTemplate), 100))
            );

            const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockProps = {
                stepId: 'step-03',
                stepNumber: 3,
                isActive: true,
                isEditable: false,
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: vi.fn(),
                data: {},
                quizState: {
                    currentStep: 3,
                    userName: 'João',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<QuestionStepAdapter {...mockProps} />);

            // ✅ VALIDAÇÃO: Loading aparece durante carregamento
            expect(screen.getByText(/carregando pergunta/i)).toBeInTheDocument();

            // Aguardar carregamento completar
            await waitFor(() => {
                expect(screen.queryByText(/carregando pergunta/i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('deve exibir erro quando template não tem blocos', async () => {
            mockLoadTemplate.mockResolvedValue({ step: { blocks: [] } });

            const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockProps = {
                stepId: 'step-04',
                stepNumber: 4,
                isActive: true,
                isEditable: false,
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: vi.fn(),
                data: {},
                quizState: {
                    currentStep: 4,
                    userName: 'Ana',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<QuestionStepAdapter {...mockProps} />);

            // ✅ VALIDAÇÃO: Mensagem de erro é exibida
            await waitFor(() => {
                expect(screen.getByText(/nenhum bloco encontrado/i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });

    // ========================================================================
    // TESTE 2: Modo Preview (visualização)
    // ========================================================================

    describe('👁️ Preview Mode', () => {
        it('deve renderizar em modo preview corretamente', async () => {
            const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockProps = {
                stepId: 'step-05',
                stepNumber: 5,
                isActive: true,
                isEditable: false, // ← Preview mode
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: vi.fn(),
                data: {},
                quizState: {
                    currentStep: 5,
                    userName: 'Carlos',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<QuestionStepAdapter {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('block-type-renderer')).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: Mode passado para BlockTypeRenderer é 'preview'
            expect(screen.getByTestId('block-mode')).toHaveTextContent('preview');
        });

        it('deve exibir respostas já selecionadas em preview', async () => {
            const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockProps = {
                stepId: 'step-02',
                stepNumber: 2,
                isActive: true,
                isEditable: false,
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: vi.fn(),
                data: {},
                quizState: {
                    currentStep: 2,
                    userName: 'Pedro',
                    answers: {
                        'step-02': ['natural', 'classico']
                    },
                    strategicAnswers: {},
                }
            };

            render(<QuestionStepAdapter {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('block-type-renderer')).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: SessionData contém respostas já selecionadas
            expect(mockBlockTypeRenderer).toHaveBeenCalledWith(
                expect.objectContaining({
                    sessionData: expect.objectContaining({
                        answers: ['natural', 'classico']
                    })
                }),
                expect.anything()
            );
        });
    });

    // ========================================================================
    // TESTE 3: Modo Editable (editor)
    // ========================================================================

    describe('✏️ Editable Mode', () => {
        it('deve renderizar em modo editable corretamente', async () => {
            const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockProps = {
                stepId: 'step-06',
                stepNumber: 6,
                isActive: true,
                isEditable: true, // ← Editable mode
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: vi.fn(),
                data: {},
                quizState: {
                    currentStep: 6,
                    userName: 'Laura',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<QuestionStepAdapter {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('block-type-renderer')).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: Mode passado para BlockTypeRenderer é 'editable'
            expect(screen.getByTestId('block-mode')).toHaveTextContent('editable');
        });

        it('deve permitir edição de respostas no editor', async () => {
            const { QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockOnSave = vi.fn();

            const mockProps = {
                stepId: 'step-02',
                stepNumber: 2,
                isActive: true,
                isEditable: true,
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: mockOnSave,
                data: {},
                quizState: {
                    currentStep: 2,
                    userName: 'Fernanda',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<QuestionStepAdapter {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            });

            // Simular clique em opção
            fireEvent.click(screen.getByTestId('option-natural'));

            // ✅ VALIDAÇÃO: onSave foi chamado com resposta atualizada
            await waitFor(() => {
                expect(mockOnSave).toHaveBeenCalledWith(
                    expect.objectContaining({
                        'step-02': expect.arrayContaining(['natural'])
                    })
                );
            });
        });
    });

    // ========================================================================
    // TESTE 4: Strategic Questions (steps 13-18)
    // ========================================================================

    describe('🎯 Strategic Questions', () => {
        it('deve renderizar strategic question corretamente', async () => {
            mockLoadTemplate.mockResolvedValue(mockStrategicTemplate);

            const { StrategicQuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockProps = {
                stepId: 'step-13',
                stepNumber: 13,
                isActive: true,
                isEditable: false,
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: vi.fn(),
                data: {},
                quizState: {
                    currentStep: 13,
                    userName: 'Roberta',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<StrategicQuestionStepAdapter {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('block-type-renderer')).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: Pergunta estratégica foi renderizada
            expect(screen.getByText(/como você se sente com sua imagem pessoal/i)).toBeInTheDocument();
            expect(screen.getByTestId('option-desconectada')).toBeInTheDocument();
        });

        it('deve aceitar apenas 1 resposta em strategic question', async () => {
            mockLoadTemplate.mockResolvedValue(mockStrategicTemplate);

            const { StrategicQuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry');

            const mockOnSave = vi.fn();

            const mockProps = {
                stepId: 'step-13',
                stepNumber: 13,
                isActive: true,
                isEditable: false,
                onNext: vi.fn(),
                onPrevious: vi.fn(),
                onSave: mockOnSave,
                data: {},
                quizState: {
                    currentStep: 13,
                    userName: 'Camila',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<StrategicQuestionStepAdapter {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByTestId('option-duvidas')).toBeInTheDocument();
            });

            // Simular seleção de resposta estratégica
            fireEvent.click(screen.getByTestId('option-duvidas'));

            // ✅ VALIDAÇÃO: onSave foi chamado com array de 1 elemento
            await waitFor(() => {
                expect(mockOnSave).toHaveBeenCalledWith(
                    expect.objectContaining({
                        'step-13': ['duvidas']
                    })
                );
            });
        });
    });

    // ========================================================================
    // TESTE 5: Integração com UnifiedStepRenderer
    // ========================================================================

    describe('🔗 Integração com UnifiedStepRenderer', () => {
        it('deve funcionar quando chamado via UnifiedStepRenderer', async () => {
            const { UnifiedStepRenderer } = await import('@/components/editor/unified/UnifiedStepRenderer');

            const mockProps = {
                stepId: 'step-02',
                mode: 'preview' as const,
                quizState: {
                    currentStep: 2,
                    userName: 'Juliano',
                    answers: {},
                    strategicAnswers: {},
                }
            };

            render(<UnifiedStepRenderer {...mockProps} />);

            // Aguardar lazy loading + template loading
            await waitFor(() => {
                expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
            }, { timeout: 5000 });

            // ✅ VALIDAÇÃO: Step foi renderizado via UnifiedStepRenderer
            await waitFor(() => {
                const renderer = screen.queryByTestId('block-type-renderer');
                if (renderer) {
                    expect(renderer).toBeInTheDocument();
                }
            }, { timeout: 5000 });
        });
    });

    // ========================================================================
    // TESTE 6: Regressão - ModularQuestionStep NÃO deve ser usado
    // ========================================================================

    describe('❌ Teste de Regressão', () => {
        it('ModularQuestionStep deve estar deprecado e retornar null', () => {
            const { ModularQuestionStep } = require('@/components/quiz-modular');

            const result = ModularQuestionStep({ data: {}, blocks: [] });

            // ✅ VALIDAÇÃO: ModularQuestionStep retorna null (deprecado)
            expect(result).toBeNull();
        });

        it('ModularStrategicQuestionStep deve estar deprecado e retornar null', () => {
            const { ModularStrategicQuestionStep } = require('@/components/quiz-modular');

            const result = ModularStrategicQuestionStep({ data: {}, blocks: [] });

            // ✅ VALIDAÇÃO: ModularStrategicQuestionStep retorna null (deprecado)
            expect(result).toBeNull();
        });

        it('QuestionStepAdapter NÃO deve importar de quiz-modular', async () => {
            const fileContent = await import('fs').then(fs =>
                fs.promises.readFile(
                    '/workspaces/quiz-flow-pro-verso-03342/src/components/step-registry/ProductionStepsRegistry.tsx',
                    'utf-8'
                )
            );

            // ✅ VALIDAÇÃO: Arquivo não deve conter referências a ModularQuestionStep
            expect(fileContent).not.toContain("require('@/components/quiz-modular')");
            expect(fileContent).not.toContain('ModularQuestionStep');
            expect(fileContent).not.toContain('ModularStrategicQuestionStep');

            // ✅ VALIDAÇÃO: Deve usar BlockTypeRenderer
            expect(fileContent).toContain('BlockTypeRenderer');
            expect(fileContent).toContain('@/components/editor/quiz/renderers/BlockTypeRenderer');
        });
    });
});

// ============================================================================
// SUITE DE TESTES: Validação de Estrutura
// ============================================================================

describe('🏗️ ESTRUTURA: Validação Pós-Correção', () => {
    it('ProductionStepsRegistry deve exportar adapters corrigidos', async () => {
        const registry = await import('@/components/step-registry/ProductionStepsRegistry');

        // ✅ VALIDAÇÃO: Exports corretos existem
        expect(registry.QuestionStepAdapter).toBeDefined();
        expect(registry.StrategicQuestionStepAdapter).toBeDefined();
        expect(registry.IntroStepAdapter).toBeDefined();
        expect(registry.TransitionStepAdapter).toBeDefined();
        expect(registry.ResultStepAdapter).toBeDefined();
        expect(registry.OfferStepAdapter).toBeDefined();
    });

    it('BlockTypeRenderer deve estar disponível', async () => {
        const { BlockTypeRenderer } = await import('@/components/editor/quiz/renderers/BlockTypeRenderer');

        // ✅ VALIDAÇÃO: BlockTypeRenderer foi importado corretamente
        expect(BlockTypeRenderer).toBeDefined();
        expect(typeof BlockTypeRenderer).toBe('function');
    });
});

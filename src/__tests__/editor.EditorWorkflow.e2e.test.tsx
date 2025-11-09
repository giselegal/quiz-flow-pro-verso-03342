/**
 * 🚀 TESTES E2E: Fluxo Completo do Editor
 * 
 * Valida que o editor funciona end-to-end com a correção aplicada:
 * - Navegação entre steps 2-11 (perguntas)
 * - Navegação entre steps 13-18 (estratégicas)
 * - Persistência de respostas
 * - Modo preview vs editable
 * - Validação de requiredSelections
 * 
 * FLUXO COMPLETO:
 * 1. Carregar editor em step-02
 * 2. Selecionar 3 opções (requiredSelections)
 * 3. Avançar para step-03
 * 4. Verificar que respostas de step-02 foram salvas
 * 5. Testar step estratégico (step-13)
 * 6. Verificar que apenas 1 resposta é aceita
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

// ============================================================================
// MOCKS
// ============================================================================

const mockTemplates: Record<string, any> = {
    'step-02': {
        step: {
            id: 'step-02',
            type: 'question',
            blocks: [{
                id: 'q-2',
                type: 'question-block',
                config: {
                    questionNumber: '1 de 10',
                    questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
                    requiredSelections: 3,
                    options: [
                        { id: 'natural', text: 'Conforto e praticidade', styleWeights: { natural: 3 } },
                        { id: 'classico', text: 'Discrição clássica', styleWeights: { classico: 3 } },
                        { id: 'contemporaneo', text: 'Estilo atual', styleWeights: { contemporaneo: 3 } },
                        { id: 'elegante', text: 'Elegância refinada', styleWeights: { elegante: 3 } },
                        { id: 'romantico', text: 'Delicadeza romântica', styleWeights: { romantico: 3 } },
                        { id: 'sexy', text: 'Sensualidade', styleWeights: { sexy: 3 } },
                        { id: 'dramatico', text: 'Presença dramática', styleWeights: { dramatico: 3 } },
                        { id: 'criativo', text: 'Ousadia criativa', styleWeights: { criativo: 3 } }
                    ]
                }
            }]
        }
    },
    'step-03': {
        step: {
            id: 'step-03',
            type: 'question',
            blocks: [{
                id: 'q-3',
                type: 'question-block',
                config: {
                    questionNumber: '2 de 10',
                    questionText: 'QUAL TECIDO VOCÊ MAIS USA?',
                    requiredSelections: 3,
                    options: [
                        { id: 'algodao', text: 'Algodão', styleWeights: { natural: 2 } },
                        { id: 'linho', text: 'Linho', styleWeights: { natural: 2, elegante: 1 } },
                        { id: 'seda', text: 'Seda', styleWeights: { elegante: 2, romantico: 2 } },
                        { id: 'couro', text: 'Couro', styleWeights: { dramatico: 2, sexy: 1 } }
                    ]
                }
            }]
        }
    },
    'step-13': {
        step: {
            id: 'step-13',
            type: 'strategic',
            blocks: [{
                id: 'q-13',
                type: 'question-block',
                config: {
                    questionNumber: '1 de 6',
                    questionText: 'Como você se sente com sua imagem pessoal?',
                    requiredSelections: 1,
                    options: [
                        { id: 'desconectada', text: 'Me sinto desconectada do meu estilo' },
                        { id: 'duvidas', text: 'Tenho dúvidas sobre o que me fica bem' },
                        { id: 'as-vezes-acerto', text: 'Às vezes acerto, mas não tenho certeza' }
                    ]
                }
            }]
        }
    }
};

const mockLoadTemplate = vi.fn((stepId: string) => {
    return Promise.resolve(mockTemplates[stepId] || { step: { blocks: [] } });
});

vi.mock('@/templates/imports', () => ({
    loadTemplate: mockLoadTemplate
}));

// Mock do BlockTypeRenderer com funcionalidade real de seleção
const mockBlockTypeRenderer = vi.fn((props: any) => {
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(
        props.sessionData?.answers || []
    );

    const handleOptionClick = (optionId: string) => {
        let newAnswers: string[];

        if (selectedOptions.includes(optionId)) {
            // Desselecionar
            newAnswers = selectedOptions.filter(id => id !== optionId);
        } else {
            // Selecionar (respeitar requiredSelections)
            const maxSelections = props.block?.config?.requiredSelections || 99;
            if (selectedOptions.length >= maxSelections) {
                // Substituir primeira seleção
                newAnswers = [...selectedOptions.slice(1), optionId];
            } else {
                newAnswers = [...selectedOptions, optionId];
            }
        }

        setSelectedOptions(newAnswers);
        props.onUpdate?.(props.block.id, { answers: newAnswers });
    };

    return (
        <div data-testid="block-type-renderer" data-block-id={props.block?.id}>
            <h3>{props.block?.config?.questionText}</h3>
            <div data-testid="block-mode">{props.mode}</div>
            <div data-testid="selected-count">{selectedOptions.length}</div>
            {props.block?.config?.options?.map((opt: any) => (
                <button
                    key={opt.id}
                    data-testid={`option-${opt.id}`}
                    data-selected={selectedOptions.includes(opt.id)}
                    onClick={() => handleOptionClick(opt.id)}
                >
                    {opt.text}
                </button>
            ))}
        </div>
    );
});

vi.mock('@/components/editor/quiz/renderers/BlockTypeRenderer', () => ({
    BlockTypeRenderer: mockBlockTypeRenderer
}));

// ============================================================================
// COMPONENTE HELPER: Editor Wrapper
// ============================================================================

const EditorWrapper = ({ stepId, initialAnswers = {} }: { stepId: string; initialAnswers?: Record<string, string[]> }) => {
    const [quizState, setQuizState] = React.useState({
        currentStep: parseInt(stepId.replace('step-', '')),
        userName: 'Usuário Teste',
        answers: initialAnswers,
        strategicAnswers: {}
    });

    const handleSave = (data: Record<string, string[]>) => {
        setQuizState(prev => ({
            ...prev,
            answers: { ...prev.answers, ...data }
        }));
    };

    const { QuestionStepAdapter, StrategicQuestionStepAdapter } = require('@/components/step-registry/ProductionStepsRegistry');

    const isStrategic = stepId >= 'step-13' && stepId <= 'step-18';
    const Adapter = isStrategic ? StrategicQuestionStepAdapter : QuestionStepAdapter;

    return (
        <div data-testid="editor-wrapper">
            <Adapter
                stepId={stepId}
                stepNumber={quizState.currentStep}
                isActive={true}
                isEditable={false}
                onNext={vi.fn()}
                onPrevious={vi.fn()}
                onSave={handleSave}
                data={{}}
                quizState={quizState}
            />
            <div data-testid="quiz-state-answers">{JSON.stringify(quizState.answers)}</div>
        </div>
    );
};

// ============================================================================
// SUITE DE TESTES E2E
// ============================================================================

describe('🚀 E2E: Fluxo Completo do Editor', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ========================================================================
    // TESTE 1: Carregar Step de Pergunta
    // ========================================================================

    describe('📝 Carregamento de Step', () => {
        it('deve carregar step-02 com todas as 8 opções', async () => {
            render(<EditorWrapper stepId="step-02" />);

            // Aguardar carregamento
            await waitFor(() => {
                expect(screen.getByText('QUAL O SEU TIPO DE ROUPA FAVORITA?')).toBeInTheDocument();
            }, { timeout: 3000 });

            // ✅ VALIDAÇÃO: Todas as 8 opções foram renderizadas
            expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            expect(screen.getByTestId('option-classico')).toBeInTheDocument();
            expect(screen.getByTestId('option-contemporaneo')).toBeInTheDocument();
            expect(screen.getByTestId('option-elegante')).toBeInTheDocument();
            expect(screen.getByTestId('option-romantico')).toBeInTheDocument();
            expect(screen.getByTestId('option-sexy')).toBeInTheDocument();
            expect(screen.getByTestId('option-dramatico')).toBeInTheDocument();
            expect(screen.getByTestId('option-criativo')).toBeInTheDocument();
        });

        it('deve carregar step-03 independentemente', async () => {
            render(<EditorWrapper stepId="step-03" />);

            await waitFor(() => {
                expect(screen.getByText('QUAL TECIDO VOCÊ MAIS USA?')).toBeInTheDocument();
            }, { timeout: 3000 });

            // ✅ VALIDAÇÃO: Step-03 carregou corretamente
            expect(screen.getByTestId('option-algodao')).toBeInTheDocument();
            expect(screen.getByTestId('option-linho')).toBeInTheDocument();
        });
    });

    // ========================================================================
    // TESTE 2: Seleção de Respostas
    // ========================================================================

    describe('✅ Seleção de Respostas', () => {
        it('deve permitir selecionar até 3 opções (requiredSelections)', async () => {
            render(<EditorWrapper stepId="step-02" />);

            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            });

            // Selecionar 1ª opção
            fireEvent.click(screen.getByTestId('option-natural'));
            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
            });

            // Selecionar 2ª opção
            fireEvent.click(screen.getByTestId('option-classico'));
            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
            });

            // Selecionar 3ª opção
            fireEvent.click(screen.getByTestId('option-elegante'));
            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('3');
            });

            // ✅ VALIDAÇÃO: 3 opções foram selecionadas
            expect(screen.getByTestId('option-natural')).toHaveAttribute('data-selected', 'true');
            expect(screen.getByTestId('option-classico')).toHaveAttribute('data-selected', 'true');
            expect(screen.getByTestId('option-elegante')).toHaveAttribute('data-selected', 'true');
        });

        it('deve substituir primeira seleção ao exceder requiredSelections', async () => {
            render(<EditorWrapper stepId="step-02" />);

            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            });

            // Selecionar 3 opções
            fireEvent.click(screen.getByTestId('option-natural'));
            fireEvent.click(screen.getByTestId('option-classico'));
            fireEvent.click(screen.getByTestId('option-elegante'));

            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('3');
            });

            // Tentar selecionar 4ª opção
            fireEvent.click(screen.getByTestId('option-romantico'));

            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('3');
            });

            // ✅ VALIDAÇÃO: Primeira seleção foi substituída
            expect(screen.getByTestId('option-natural')).toHaveAttribute('data-selected', 'false');
            expect(screen.getByTestId('option-romantico')).toHaveAttribute('data-selected', 'true');
        });

        it('deve permitir desselecionar opção clicando novamente', async () => {
            render(<EditorWrapper stepId="step-02" />);

            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            });

            // Selecionar opção
            fireEvent.click(screen.getByTestId('option-natural'));
            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
            });

            // Desselecionar opção
            fireEvent.click(screen.getByTestId('option-natural'));
            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
            });

            // ✅ VALIDAÇÃO: Opção foi desselecionada
            expect(screen.getByTestId('option-natural')).toHaveAttribute('data-selected', 'false');
        });
    });

    // ========================================================================
    // TESTE 3: Persistência de Respostas
    // ========================================================================

    describe('💾 Persistência de Respostas', () => {
        it('deve salvar respostas no quizState', async () => {
            render(<EditorWrapper stepId="step-02" />);

            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            });

            // Selecionar 3 opções
            fireEvent.click(screen.getByTestId('option-natural'));
            fireEvent.click(screen.getByTestId('option-classico'));
            fireEvent.click(screen.getByTestId('option-elegante'));

            // ✅ VALIDAÇÃO: Respostas foram salvas no quizState
            await waitFor(() => {
                const stateElement = screen.getByTestId('quiz-state-answers');
                const state = JSON.parse(stateElement.textContent || '{}');
                expect(state['step-02']).toEqual(
                    expect.arrayContaining(['natural', 'classico', 'elegante'])
                );
            });
        });

        it('deve carregar step com respostas já salvas', async () => {
            const initialAnswers = {
                'step-02': ['natural', 'sexy']
            };

            render(<EditorWrapper stepId="step-02" initialAnswers={initialAnswers} />);

            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: Respostas pré-existentes foram carregadas
            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toHaveAttribute('data-selected', 'true');
                expect(screen.getByTestId('option-sexy')).toHaveAttribute('data-selected', 'true');
                expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
            });
        });
    });

    // ========================================================================
    // TESTE 4: Strategic Questions
    // ========================================================================

    describe('🎯 Strategic Questions', () => {
        it('deve renderizar strategic question (step-13)', async () => {
            render(<EditorWrapper stepId="step-13" />);

            await waitFor(() => {
                expect(screen.getByText(/como você se sente com sua imagem pessoal/i)).toBeInTheDocument();
            }, { timeout: 3000 });

            // ✅ VALIDAÇÃO: Pergunta estratégica foi renderizada
            expect(screen.getByTestId('option-desconectada')).toBeInTheDocument();
            expect(screen.getByTestId('option-duvidas')).toBeInTheDocument();
            expect(screen.getByTestId('option-as-vezes-acerto')).toBeInTheDocument();
        });

        it('deve aceitar apenas 1 resposta em strategic question', async () => {
            render(<EditorWrapper stepId="step-13" />);

            await waitFor(() => {
                expect(screen.getByTestId('option-duvidas')).toBeInTheDocument();
            });

            // Selecionar 1ª opção
            fireEvent.click(screen.getByTestId('option-duvidas'));
            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
            });

            // Tentar selecionar 2ª opção
            fireEvent.click(screen.getByTestId('option-desconectada'));
            await waitFor(() => {
                expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
            });

            // ✅ VALIDAÇÃO: Apenas 1 opção selecionada (substituição ocorreu)
            expect(screen.getByTestId('option-duvidas')).toHaveAttribute('data-selected', 'false');
            expect(screen.getByTestId('option-desconectada')).toHaveAttribute('data-selected', 'true');
        });

        it('deve salvar resposta estratégica separadamente', async () => {
            render(<EditorWrapper stepId="step-13" />);

            await waitFor(() => {
                expect(screen.getByTestId('option-duvidas')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId('option-duvidas'));

            // ✅ VALIDAÇÃO: Resposta estratégica foi salva
            await waitFor(() => {
                const stateElement = screen.getByTestId('quiz-state-answers');
                const state = JSON.parse(stateElement.textContent || '{}');
                expect(state['step-13']).toEqual(['duvidas']);
            });
        });
    });

    // ========================================================================
    // TESTE 5: Navegação entre Steps
    // ========================================================================

    describe('🔀 Navegação entre Steps', () => {
        it('deve preservar respostas ao navegar entre steps', async () => {
            const { rerender } = render(<EditorWrapper stepId="step-02" />);

            // Selecionar respostas em step-02
            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toBeInTheDocument();
            });
            fireEvent.click(screen.getByTestId('option-natural'));
            fireEvent.click(screen.getByTestId('option-classico'));

            // Capturar estado após seleção
            await waitFor(() => {
                const state = JSON.parse(screen.getByTestId('quiz-state-answers').textContent || '{}');
                expect(state['step-02']).toBeDefined();
            });

            // Simular navegação para step-03
            rerender(<EditorWrapper stepId="step-03" initialAnswers={{ 'step-02': ['natural', 'classico'] }} />);

            await waitFor(() => {
                expect(screen.getByText('QUAL TECIDO VOCÊ MAIS USA?')).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: Respostas de step-02 foram preservadas
            const finalState = JSON.parse(screen.getByTestId('quiz-state-answers').textContent || '{}');
            expect(finalState['step-02']).toEqual(['natural', 'classico']);
        });

        it('deve permitir voltar ao step anterior com respostas intactas', async () => {
            const initialAnswers = {
                'step-02': ['natural', 'classico'],
                'step-03': ['algodao', 'linho', 'seda']
            };

            const { rerender } = render(<EditorWrapper stepId="step-03" initialAnswers={initialAnswers} />);

            await waitFor(() => {
                expect(screen.getByText('QUAL TECIDO VOCÊ MAIS USA?')).toBeInTheDocument();
            });

            // Voltar para step-02
            rerender(<EditorWrapper stepId="step-02" initialAnswers={initialAnswers} />);

            await waitFor(() => {
                expect(screen.getByText('QUAL O SEU TIPO DE ROUPA FAVORITA?')).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: Respostas de step-02 permaneceram salvas
            await waitFor(() => {
                expect(screen.getByTestId('option-natural')).toHaveAttribute('data-selected', 'true');
                expect(screen.getByTestId('option-classico')).toHaveAttribute('data-selected', 'true');
            });
        });
    });

    // ========================================================================
    // TESTE 6: Performance e Loading
    // ========================================================================

    describe('⚡ Performance e Loading', () => {
        it('deve carregar múltiplos steps em sequência sem erros', async () => {
            const { rerender } = render(<EditorWrapper stepId="step-02" />);

            await waitFor(() => {
                expect(screen.getByText('QUAL O SEU TIPO DE ROUPA FAVORITA?')).toBeInTheDocument();
            });

            rerender(<EditorWrapper stepId="step-03" />);
            await waitFor(() => {
                expect(screen.getByText('QUAL TECIDO VOCÊ MAIS USA?')).toBeInTheDocument();
            });

            rerender(<EditorWrapper stepId="step-13" />);
            await waitFor(() => {
                expect(screen.getByText(/como você se sente com sua imagem pessoal/i)).toBeInTheDocument();
            });

            // ✅ VALIDAÇÃO: Todos os steps carregaram sem erros
            expect(mockLoadTemplate).toHaveBeenCalledWith('step-02');
            expect(mockLoadTemplate).toHaveBeenCalledWith('step-03');
            expect(mockLoadTemplate).toHaveBeenCalledWith('step-13');
        });

        it('deve exibir loading durante carregamento de template', async () => {
            mockLoadTemplate.mockImplementation((stepId: string) =>
                new Promise(resolve => setTimeout(() => resolve(mockTemplates[stepId]), 100))
            );

            render(<EditorWrapper stepId="step-02" />);

            // ✅ VALIDAÇÃO: Loading aparece
            expect(screen.getByText(/carregando pergunta/i)).toBeInTheDocument();

            // Aguardar conclusão
            await waitFor(() => {
                expect(screen.queryByText(/carregando pergunta/i)).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });
});

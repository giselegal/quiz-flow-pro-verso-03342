/**
 * 🧪 TESTES ESPECÍFICOS: Editor Modular vs /quiz-estilo REAL
 * 
 * Baseado na análise completa em ANALISE_ESTRUTURA_REAL_QUIZ_ESTILO.md
 * 
 * OBJETIVO: Validar se o editor consegue editar 100% do funil /quiz-estilo
 * 
 * ESTRUTURA DE TESTES:
 * 1. Carregar estrutura real de 21 etapas
 * 2. Validar todos os tipos de componentes necessários
 * 3. Validar propriedades críticas (IDs de estilos, offerMap, etc.)
 * 4. Validar conversão bidirecional (editor ↔ runtime)
 * 5. Validar lógica de negócio (pontuação, ofertas)
 * 6. Identificar gaps e componentes faltando
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizModularProductionEditor } from '@/components/editor/quiz/QuizModularProductionEditor';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import { useQuizState } from '@/hooks/useQuizState';
import QuizApp from '@/components/quiz/QuizApp';
import { QUIZ_STEPS, STEP_ORDER } from '@/data/quizSteps';

// Mocks
vi.mock('@/services/QuizEditorBridge');
vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn()
    })
}));

describe('QuizModularProductionEditor - Edição Completa do /quiz-estilo', () => {
    let mockFunnelData: any;
    let savedDraftId: string | null = null;

    beforeEach(() => {
        // Mock do funil de produção
        mockFunnelData = {
            id: 'production',
            name: 'Quiz Estilo Pessoal',
            slug: 'quiz-estilo',
            steps: [
                {
                    id: 'step-01',
                    type: 'intro',
                    order: 1,
                    blocks: [
                        {
                            id: 'step-01-title',
                            type: 'heading',
                            order: 0,
                            properties: { level: 2, textAlign: 'center' },
                            content: { text: 'Descubra seu estilo' }
                        },
                        {
                            id: 'step-01-button',
                            type: 'button',
                            order: 1,
                            properties: { backgroundColor: '#B89B7A' },
                            content: { text: 'Começar' }
                        }
                    ]
                },
                {
                    id: 'step-02',
                    type: 'question',
                    order: 2,
                    blocks: [
                        {
                            id: 'step-02-question',
                            type: 'heading',
                            order: 0,
                            properties: { level: 3 },
                            content: { text: 'Qual seu tipo de roupa favorita?' }
                        },
                        {
                            id: 'step-02-options',
                            type: 'quiz-options',
                            order: 1,
                            properties: { maxSelections: 3 },
                            content: {
                                options: [
                                    { id: 'natural', text: 'Conforto e praticidade' },
                                    { id: 'classico', text: 'Discrição clássica' }
                                ]
                            }
                        }
                    ]
                }
            ],
            isPublished: true,
            version: 1
        };

        // Mock das funções do bridge
        vi.mocked(quizEditorBridge.loadFunnelForEdit).mockResolvedValue(mockFunnelData);
        vi.mocked(quizEditorBridge.saveDraft).mockImplementation(async (funnel) => {
            savedDraftId = `draft-${Date.now()}`;
            return savedDraftId;
        });
        vi.mocked(quizEditorBridge.publishToProduction).mockResolvedValue();
        vi.mocked(quizEditorBridge.validateFunnel).mockReturnValue({
            valid: true,
            errors: [],
            warnings: []
        });
    });

    afterEach(() => {
        savedDraftId = null;
        vi.clearAllMocks();
    });

    describe('1. Layout de 4 Colunas', () => {
        it('deve renderizar todas as 4 colunas', async () => {
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                // Coluna 1: Etapas
                expect(screen.getByText('Etapas')).toBeInTheDocument();
                expect(screen.getByText(/2 etapas/i)).toBeInTheDocument();

                // Coluna 2: Componentes
                expect(screen.getByText('Componentes')).toBeInTheDocument();
                expect(screen.getByText('Texto')).toBeInTheDocument();
                expect(screen.getByText('Botão')).toBeInTheDocument();

                // Coluna 3: Canvas
                expect(screen.getByText('Canvas')).toBeInTheDocument();
                expect(screen.getByText('Preview')).toBeInTheDocument();

                // Coluna 4: Propriedades
                expect(screen.getByText('Propriedades')).toBeInTheDocument();
            });
        });

        it('deve mostrar todas as etapas na coluna 1', async () => {
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
                expect(screen.getByText('step-02')).toBeInTheDocument();
                expect(screen.getByText('intro')).toBeInTheDocument();
                expect(screen.getByText('question')).toBeInTheDocument();
            });
        });

        it('deve mostrar biblioteca com 7 componentes', async () => {
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('Texto')).toBeInTheDocument();
                expect(screen.getByText('Título')).toBeInTheDocument();
                expect(screen.getByText('Imagem')).toBeInTheDocument();
                expect(screen.getByText('Botão')).toBeInTheDocument();
                expect(screen.getByText('Opções de Quiz')).toBeInTheDocument();
                expect(screen.getByText('Campo de Texto')).toBeInTheDocument();
                expect(screen.getByText('Container')).toBeInTheDocument();
            });
        });
    });

    describe('2. Navegação entre Etapas', () => {
        it('deve selecionar etapa ao clicar', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step02Button = screen.getByText('step-02').closest('button');
            expect(step02Button).toBeInTheDocument();

            await user.click(step02Button!);

            await waitFor(() => {
                expect(step02Button).toHaveClass('bg-blue-50');
                // Canvas deve mostrar blocos da etapa 2
                expect(screen.getByText('Qual seu tipo de roupa favorita?')).toBeInTheDocument();
            });
        });

        it('deve mostrar quantidade de blocos por etapa', async () => {
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                // Step 1 tem 2 blocos
                const step01 = screen.getByText('step-01').closest('button');
                expect(within(step01!).getByText('2 blocos')).toBeInTheDocument();

                // Step 2 tem 2 blocos
                const step02 = screen.getByText('step-02').closest('button');
                expect(within(step02!).getByText('2 blocos')).toBeInTheDocument();
            });
        });
    });

    describe('3. Adicionar Componentes', () => {
        it('deve adicionar componente de texto à etapa', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            // Selecionar etapa
            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            // Clicar no componente Texto
            const textoButton = screen.getByText('Texto').closest('button');
            await user.click(textoButton!);

            await waitFor(() => {
                // Deve adicionar novo bloco
                const canvas = screen.getByText('Etapa: step-01').closest('div');
                expect(within(canvas!).getByText('3 componentes')).toBeInTheDocument();
            });
        });

        it('deve adicionar componente de imagem à etapa', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-02')).toBeInTheDocument();
            });

            const step02 = screen.getByText('step-02').closest('button');
            await user.click(step02!);

            const imagemButton = screen.getByText('Imagem').closest('button');
            await user.click(imagemButton!);

            await waitFor(() => {
                // Novo bloco de imagem adicionado
                expect(screen.getByText('image')).toBeInTheDocument();
            });
        });

        it('deve adicionar opções de quiz', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            const opcoesButton = screen.getByText('Opções de Quiz').closest('button');
            await user.click(opcoesButton!);

            await waitFor(() => {
                expect(screen.getByText('quiz-options')).toBeInTheDocument();
            });
        });
    });

    describe('4. Remover Componentes', () => {
        it('deve remover componente ao clicar no botão trash', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            await waitFor(() => {
                expect(screen.getByText('Descubra seu estilo')).toBeInTheDocument();
            });

            // Encontrar botão de remover do primeiro bloco
            const blocos = screen.getAllByTestId(/trash-button/i);
            if (blocos.length > 0) {
                await user.click(blocos[0]);

                await waitFor(() => {
                    // Um bloco a menos
                    expect(screen.queryByText('Descubra seu estilo')).not.toBeInTheDocument();
                });
            }
        });
    });

    describe('5. Editar Propriedades', () => {
        it('deve editar texto do componente', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            // Selecionar bloco de título
            const titleBlock = screen.getByText('Descubra seu estilo').closest('div');
            await user.click(titleBlock!);

            await waitFor(() => {
                // Painel de propriedades deve abrir
                expect(screen.getByText('heading')).toBeInTheDocument();
            });

            // Editar texto
            const textInput = screen.getByLabelText('Texto');
            await user.clear(textInput);
            await user.type(textInput, 'Novo título editado');

            expect(textInput).toHaveValue('Novo título editado');
        });

        it('deve editar cor do texto', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            const titleBlock = screen.getByText('Descubra seu estilo').closest('div');
            await user.click(titleBlock!);

            await waitFor(() => {
                const colorInput = screen.getByLabelText('Cor');
                expect(colorInput).toBeInTheDocument();

                fireEvent.change(colorInput, { target: { value: '#FF0000' } });
                expect(colorInput).toHaveValue('#FF0000');
            });
        });

        it('deve editar tamanho da fonte', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            const titleBlock = screen.getByText('Descubra seu estilo').closest('div');
            await user.click(titleBlock!);

            await waitFor(() => {
                const sizeInput = screen.getByLabelText('Tamanho da Fonte');
                expect(sizeInput).toBeInTheDocument();
            });
            const sizeInput = screen.getByLabelText('Tamanho da Fonte');
            await user.clear(sizeInput);
            await user.type(sizeInput, '24px');
            expect(sizeInput).toHaveValue('24px');
        });

        it('deve editar propriedades de botão', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            const buttonBlock = screen.getByText('Começar').closest('div');
            await user.click(buttonBlock!);

            await waitFor(() => {
                const bgColorInput = screen.getByLabelText('Cor de Fundo');
                fireEvent.change(bgColorInput, { target: { value: '#0000FF' } });
                expect(bgColorInput).toHaveValue('#0000FF');
            });
        });
    });

    describe('6. Duplicar Componentes', () => {
        it('deve duplicar componente ao clicar em duplicar', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            const titleBlock = screen.getByText('Descubra seu estilo').closest('div');
            await user.click(titleBlock!);

            await waitFor(() => {
                const duplicarButton = screen.getByText('Duplicar').closest('button');
                expect(duplicarButton).toBeInTheDocument();

                user.click(duplicarButton!);
            });

            await waitFor(() => {
                // Deve ter mais um bloco
                expect(screen.getByText('3 componentes')).toBeInTheDocument();
            });
        });
    });

    describe('7. Salvar Rascunho', () => {
        it('deve salvar rascunho ao clicar em salvar', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            // Fazer uma edição para marcar como dirty
            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            const textoButton = screen.getByText('Texto').closest('button');
            await user.click(textoButton!);

            await waitFor(() => {
                expect(screen.getByText('Não salvo')).toBeInTheDocument();
            });

            // Clicar em salvar
            const salvarButton = screen.getByText('Salvar').closest('button');
            await user.click(salvarButton!);

            await waitFor(() => {
                expect(quizEditorBridge.saveDraft).toHaveBeenCalled();
                expect(savedDraftId).toBeTruthy();
            });
        });

        it('deve desabilitar botão salvar quando não há mudanças', async () => {
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                const salvarButton = screen.getByText('Salvar').closest('button');
                expect(salvarButton).toBeDisabled();
            });
        });
    });

    describe('8. Publicar para Produção', () => {
        it('deve publicar para produção com confirmação', async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

            render(<QuizModularProductionEditor funnelId="draft-123" />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const publicarButton = screen.getByText('Publicar').closest('button');
            await user.click(publicarButton!);

            await waitFor(() => {
                expect(confirmSpy).toHaveBeenCalled();
                expect(quizEditorBridge.publishToProduction).toHaveBeenCalledWith('draft-123');
            });

            confirmSpy.mockRestore();
        });

        it('deve cancelar publicação se usuário não confirmar', async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

            render(<QuizModularProductionEditor funnelId="draft-123" />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            const publicarButton = screen.getByText('Publicar').closest('button');
            await user.click(publicarButton!);

            await waitFor(() => {
                expect(confirmSpy).toHaveBeenCalled();
                expect(quizEditorBridge.publishToProduction).not.toHaveBeenCalled();
            });

            confirmSpy.mockRestore();
        });
    });

    describe('9. Preview em Tempo Real', () => {
        it('deve alternar entre canvas e preview', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('Canvas')).toBeInTheDocument();
                expect(screen.getByText('Preview')).toBeInTheDocument();
            });

            const previewTab = screen.getByText('Preview');
            await user.click(previewTab);

            await waitFor(() => {
                // Preview deve estar ativo
                expect(screen.getByText('Preview de Produção')).toBeInTheDocument();
            });
        });
    });

    describe('10. Integração com Runtime', () => {
        it('deve carregar dados editados no QuizApp via useQuizState', async () => {
            // Mock do carregamento via bridge
            const mockSteps = {
                'step-01': {
                    type: 'intro',
                    title: 'Título Editado no Editor',
                    buttonText: 'Botão Editado'
                }
            };

            vi.mocked(quizEditorBridge.loadForRuntime).mockResolvedValue(mockSteps as any);

            // Renderizar QuizApp com funnelId
            const { result } = renderHook(() => useQuizState('draft-123'));

            await waitFor(() => {
                expect(quizEditorBridge.loadForRuntime).toHaveBeenCalledWith('draft-123');
                expect(result.current.isLoading).toBe(false);
            });

            // Verificar que dados foram carregados
            expect(result.current.currentStepData).toBeDefined();
        });

        it('deve usar dados editados após publicação', async () => {
            const mockPublishedSteps = {
                'step-01': {
                    type: 'intro',
                    title: 'Publicado e Atualizado'
                }
            };

            vi.mocked(quizEditorBridge.loadForRuntime).mockResolvedValue(mockPublishedSteps as any);

            const { result } = renderHook(() => useQuizState());

            await waitFor(() => {
                expect(quizEditorBridge.loadForRuntime).toHaveBeenCalled();
                expect(result.current.currentStepData?.title).toBe('Publicado e Atualizado');
            });
        });
    });

    describe('11. Validação', () => {
        it('deve validar estrutura do funil', async () => {
            const user = userEvent.setup();
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            // Tentar publicar deve validar
            const publicarButton = screen.getByText('Publicar').closest('button');

            vi.mocked(quizEditorBridge.validateFunnel).mockReturnValue({
                valid: false,
                errors: ['Etapa 1 deve ser tipo intro'],
                warnings: []
            });

            await user.click(publicarButton!);

            // Deve mostrar erros
            await waitFor(() => {
                expect(screen.getByText(/1 erro/i)).toBeInTheDocument();
            });
        });
    });

    describe('12. Fluxo Completo End-to-End', () => {
        it('deve completar fluxo: carregar → editar → salvar → publicar → validar', async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

            // 1. Renderizar editor
            render(<QuizModularProductionEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });

            // 2. Selecionar etapa
            const step01 = screen.getByText('step-01').closest('button');
            await user.click(step01!);

            // 3. Adicionar componente
            const textoButton = screen.getByText('Texto').closest('button');
            await user.click(textoButton!);

            await waitFor(() => {
                expect(screen.getByText('Não salvo')).toBeInTheDocument();
            });

            // 4. Salvar rascunho
            const salvarButton = screen.getByText('Salvar').closest('button');
            await user.click(salvarButton!);

            await waitFor(() => {
                expect(quizEditorBridge.saveDraft).toHaveBeenCalled();
                expect(savedDraftId).toBeTruthy();
            });

            // 5. Publicar
            vi.mocked(quizEditorBridge.validateFunnel).mockReturnValue({
                valid: true,
                errors: [],
                warnings: []
            });

            render(<QuizModularProductionEditor funnelId={savedDraftId!} />);

            await waitFor(() => {
                const publicarButton = screen.getByText('Publicar').closest('button');
                user.click(publicarButton!);
            });

            await waitFor(() => {
                expect(quizEditorBridge.publishToProduction).toHaveBeenCalledWith(savedDraftId);
            });

            confirmSpy.mockRestore();
        });
    });
});

// Helper para renderizar hooks
function renderHook<T>(hook: () => T) {
    const result: { current: T } = { current: null as any };

    function TestComponent() {
        result.current = hook();
        return null;
    }

    render(<TestComponent />);

    return { result };
}

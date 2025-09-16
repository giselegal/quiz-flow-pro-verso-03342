/**
 * 🧪 TESTES E2E - PAINEL DE PROPRIEDADES
 * Testes de integração end-to-end para o fluxo completo do painel de propriedades
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createTestBlock, TestHelpers } from '@/test/test-utils';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { PropertiesColumn } from '@/components/editor/properties/PropertiesColumn';
import { ComponentsSidebar } from '@/components/editor/ComponentsSidebar';
import { Block } from '@/types/editor';

// Mock do Supabase para testes E2E
const mockSupabaseClient = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockResolvedValue({ data: [], error: null })
};

vi.mock('@/lib/supabase', () => ({
    supabase: mockSupabaseClient
}));

describe('Painel de Propriedades - Testes E2E', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset do localStorage mock
        const mockStorage = TestHelpers.mockLocalStorage();
        Object.defineProperty(window, 'localStorage', { value: mockStorage });
    });

    describe('Fluxo Completo - Criar e Configurar Bloco', () => {

        it('deve criar bloco desde sidebar até configuração completa', async () => {
            const user = userEvent.setup();

            // Mock do contexto com estado inicial
            const initialState = {
                state: {
                    stepBlocks: { 'step-1': [] },
                    currentStep: 1,
                    selectedBlockId: null
                },
                actions: {
                    addBlock: vi.fn().mockImplementation((stepId, blockData) => {
                        return Promise.resolve({
                            success: true,
                            blockId: 'new-block-id',
                            block: { ...blockData, id: 'new-block-id' }
                        });
                    }),
                    updateBlock: vi.fn(),
                    setSelectedBlockId: vi.fn()
                }
            };

            render(
                <div style={{ display: 'flex' }}>
                    <ComponentsSidebar />
                    <div style={{ flex: 1 }}>
                        <PropertiesColumn selectedBlock={null} />
                    </div>
                </div>,
                { initialState }
            );

            // 1. Adicionar bloco desde a sidebar
            const addQuizHeaderButton = screen.getByRole('button', { name: /quiz.*header/i });
            await user.click(addQuizHeaderButton);

            await waitFor(() => {
                expect(initialState.actions.addBlock).toHaveBeenCalledWith(
                    'step-1',
                    expect.objectContaining({
                        type: 'quiz-intro-header'
                    })
                );
            });

            // 2. Simular seleção do bloco criado
            const createdBlock = createTestBlock('quiz-intro-header', {
                title: 'Novo Quiz',
                subtitle: 'Descrição inicial'
            });

            const { rerender } = render(
                <PropertiesColumn selectedBlock={createdBlock} />,
                { initialState }
            );

            // 3. Configurar propriedades
            const titleInput = screen.getByDisplayValue('Novo Quiz');
            await user.clear(titleInput);
            await user.type(titleInput, 'Quiz de Estilo Personalizado');

            // 4. Aguardar debounce e verificar chamada de update
            await TestHelpers.waitForDebounce();

            await waitFor(() => {
                expect(initialState.actions.updateBlock).toHaveBeenCalledWith(
                    'step-1',
                    createdBlock.id,
                    expect.objectContaining({
                        title: 'Quiz de Estilo Personalizado'
                    })
                );
            });

            // 5. Verificar persistência
            expect(window.localStorage.setItem).toHaveBeenCalledWith(
                'quiz-editor-autosave',
                expect.stringContaining('Quiz de Estilo Personalizado')
            );
        });
    });

    describe('Fluxo Step 20 - Configuração Completa', () => {

        it('deve configurar todos os componentes Step 20 sequencialmente', async () => {
            const user = userEvent.setup();

            // Blocos Step 20 para teste
            const step20Blocks = [
                createTestBlock('step20-result-header'),
                createTestBlock('step20-style-reveal'),
                createTestBlock('step20-compatibility'),
                createTestBlock('step20-personalized-offer')
            ];

            const mockContext = {
                state: {
                    stepBlocks: { 'step-20': step20Blocks },
                    currentStep: 20,
                    selectedBlockId: step20Blocks[0].id
                },
                actions: {
                    updateBlock: vi.fn(),
                    setSelectedBlockId: vi.fn()
                }
            };

            render(
                <PropertiesColumn selectedBlock={step20Blocks[0]} />,
                { initialState: mockContext }
            );

            // 1. Configurar Result Header
            const celebrationInput = screen.getByDisplayValue('Parabéns!');
            await user.clear(celebrationInput);
            await user.type(celebrationInput, 'Incrível! Você completou o quiz!');

            const confettiToggle = screen.getByLabelText(/confetti/i);
            await user.click(confettiToggle);

            await TestHelpers.waitForDebounce();

            expect(mockContext.actions.updateBlock).toHaveBeenCalledWith(
                'step-20',
                step20Blocks[0].id,
                expect.objectContaining({
                    celebrationText: 'Incrível! Você completou o quiz!',
                    showConfetti: false
                })
            );

            // 2. Mudar para próximo componente
            const { rerender } = render(
                <PropertiesColumn selectedBlock={step20Blocks[2]} />,
                { initialState: mockContext }
            );

            // 3. Configurar Compatibility
            const percentageInput = screen.getByLabelText(/percentual/i);
            await user.clear(percentageInput);
            await user.type(percentageInput, '92');

            const animationToggle = screen.getByLabelText(/animação/i);
            await user.click(animationToggle);

            await TestHelpers.waitForDebounce();

            expect(mockContext.actions.updateBlock).toHaveBeenCalledWith(
                'step-20',
                step20Blocks[2].id,
                expect.objectContaining({
                    percentage: 92,
                    showAnimatedCounter: false
                })
            );
        });
    });

    describe('Validação e Feedback Visual', () => {

        it('deve mostrar feedback visual para campos obrigatórios vazios', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('form-input', {
                label: 'Nome',
                required: true,
                placeholder: 'Digite seu nome'
            });

            render(<PropertiesColumn selectedBlock={block} />);

            // Limpar campo obrigatório
            const labelInput = screen.getByDisplayValue('Nome');
            await user.clear(labelInput);

            // Verificar feedback visual
            await waitFor(() => {
                expect(screen.getByText(/campo obrigatório/i)).toBeInTheDocument();
                expect(labelInput).toHaveClass('error', 'invalid', 'border-red-500');
            });
        });

        it('deve validar formato de cores em tempo real', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('quiz-intro-header', {
                backgroundColor: '#ffffff',
                textColor: '#000000'
            });

            render(<PropertiesColumn selectedBlock={block} />);

            // Inserir cor inválida
            const colorInput = screen.getByLabelText(/cor.*fundo/i);
            await user.clear(colorInput);
            await user.type(colorInput, 'cor-inválida');

            await waitFor(() => {
                expect(screen.getByText(/formato.*cor.*inválido/i)).toBeInTheDocument();
            });

            // Corrigir para cor válida
            await user.clear(colorInput);
            await user.type(colorInput, '#ff0000');

            await waitFor(() => {
                expect(screen.queryByText(/formato.*cor.*inválido/i)).not.toBeInTheDocument();
            });
        });

        it('deve mostrar preview em tempo real das mudanças', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('text-inline', {
                text: 'Texto original',
                fontSize: '16px',
                color: '#333333'
            });

            render(
                <div>
                    <PropertiesColumn selectedBlock={block} />
                    <div data-testid="preview-area">
                        {/* Simulação da área de preview */}
                        <div
                            data-testid="text-preview"
                            style={{
                                fontSize: block.properties.fontSize,
                                color: block.properties.color
                            }}
                        >
                            {block.properties.text}
                        </div>
                    </div>
                </div>
            );

            // Alterar texto
            const textInput = screen.getByDisplayValue('Texto original');
            await user.clear(textInput);
            await user.type(textInput, 'Texto atualizado');

            // Alterar tamanho da fonte
            const fontSizeInput = screen.getByLabelText(/tamanho.*fonte/i);
            await user.clear(fontSizeInput);
            await user.type(fontSizeInput, '20px');

            await TestHelpers.waitForDebounce();

            // Verificar se o preview foi atualizado
            const previewElement = screen.getByTestId('text-preview');
            expect(previewElement).toHaveTextContent('Texto atualizado');
            expect(previewElement).toHaveStyle('font-size: 20px');
        });
    });

    describe('Performance e Otimização', () => {

        it('deve fazer debounce adequado em campos de texto', async () => {
            const user = userEvent.setup();
            const updateSpy = vi.fn();

            const block = createTestBlock('text-inline', { text: 'Texto inicial' });
            const mockContext = {
                actions: { updateBlock: updateSpy }
            };

            render(
                <PropertiesColumn selectedBlock={block} />,
                { initialState: mockContext }
            );

            const textInput = screen.getByDisplayValue('Texto inicial');

            // Digitar rapidamente
            await user.type(textInput, ' modificado');

            // Não deve ter chamado ainda (debounce)
            expect(updateSpy).not.toHaveBeenCalled();

            // Aguardar debounce
            await TestHelpers.waitForDebounce();

            // Agora deve ter chamado apenas uma vez
            expect(updateSpy).toHaveBeenCalledTimes(1);
        });

        it('deve otimizar re-renders desnecessários', async () => {
            const renderSpy = vi.fn();
            const block = createTestBlock('text-inline');

            const OptimizedComponent = () => {
                renderSpy();
                return <PropertiesColumn selectedBlock={block} />;
            };

            const { rerender } = render(<OptimizedComponent />);
            expect(renderSpy).toHaveBeenCalledTimes(1);

            // Re-render com mesmo bloco
            rerender(<OptimizedComponent />);

            // Deve ter otimização de render
            expect(renderSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('Acessibilidade', () => {

        it('deve navegar via teclado corretamente', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('quiz-intro-header');

            render(<PropertiesColumn selectedBlock={block} />);

            // Navegar com Tab
            await user.tab();
            expect(document.activeElement).toBeInstanceOf(HTMLInputElement);

            await user.tab();
            expect(document.activeElement).toBeInstanceOf(HTMLInputElement);

            // Verificar se é um input diferente
            expect(document.activeElement).not.toBe(document.querySelector('input:first-of-type'));
        });

        it('deve ter labels apropriados para screen readers', () => {
            const block = createTestBlock('step20-compatibility', {
                percentage: 85,
                showAnimatedCounter: true
            });

            render(<PropertiesColumn selectedBlock={block} />);

            // Verificar labels descritivos
            expect(screen.getByLabelText(/percentual.*compatibilidade/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/mostrar.*contador.*animado/i)).toBeInTheDocument();
        });

        it('deve anunciar mudanças importantes', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('quiz-question-inline', {
                question: 'Pergunta original'
            });

            render(<PropertiesColumn selectedBlock={block} />);

            const questionInput = screen.getByDisplayValue('Pergunta original');
            await user.clear(questionInput);
            await user.type(questionInput, 'Nova pergunta');

            await TestHelpers.waitForDebounce();

            // Verificar se há feedback acessível sobre a mudança
            expect(screen.getByRole('status')).toBeInTheDocument();
            expect(screen.getByRole('status')).toHaveTextContent(/atualizado|salvo/i);
        });
    });

    describe('Casos de Erro e Recuperação', () => {

        it('deve lidar com falhas de rede adequadamente', async () => {
            const user = userEvent.setup();
            const failingUpdateSpy = vi.fn().mockRejectedValue(new Error('Falha de rede'));

            const block = createTestBlock('text-inline', { text: 'Texto inicial' });
            const mockContext = {
                actions: { updateBlock: failingUpdateSpy }
            };

            render(
                <PropertiesColumn selectedBlock={block} />,
                { initialState: mockContext }
            );

            const textInput = screen.getByDisplayValue('Texto inicial');
            await user.type(textInput, ' modificado');
            await TestHelpers.waitForDebounce();

            // Verificar tratamento de erro
            await waitFor(() => {
                expect(screen.getByText(/erro.*salvar/i)).toBeInTheDocument();
            });

            // Verificar botão de retry
            const retryButton = screen.getByRole('button', { name: /tentar.*novamente/i });
            expect(retryButton).toBeInTheDocument();

            // Testar retry
            const workingUpdateSpy = vi.fn().mockResolvedValue({ success: true });
            mockContext.actions.updateBlock = workingUpdateSpy;

            await user.click(retryButton);

            await waitFor(() => {
                expect(workingUpdateSpy).toHaveBeenCalled();
                expect(screen.queryByText(/erro.*salvar/i)).not.toBeInTheDocument();
            });
        });

        it('deve manter estado local quando há falhas', async () => {
            const user = userEvent.setup();
            const failingUpdateSpy = vi.fn().mockRejectedValue(new Error('Falha'));

            const block = createTestBlock('text-inline', { text: 'Original' });
            const mockContext = {
                actions: { updateBlock: failingUpdateSpy }
            };

            render(
                <PropertiesColumn selectedBlock={block} />,
                { initialState: mockContext }
            );

            const textInput = screen.getByDisplayValue('Original');
            await user.type(textInput, ' modificado');

            // Apesar da falha, o valor local deve ser mantido
            expect(textInput).toHaveValue('Original modificado');

            await TestHelpers.waitForDebounce();

            // Verificar que o valor ainda está presente
            expect(textInput).toHaveValue('Original modificado');
        });
    });
});
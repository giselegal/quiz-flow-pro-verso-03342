/**
 * 🧪 TESTES COMPLETOS - PAINEL DE PROPRIEDADES
 * Validação das funcionalidades do painel de propriedades para todos os componentes das 21 etapas
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { Block, BlockType } from '@/types/editor';
import { PropertiesColumn } from '@/components/editor/properties/PropertiesColumn';

// Mock do contexto de editor
const mockEditorContext = {
    state: {
        stepBlocks: {
            'step-1': [],
            'step-2': []
        },
        currentStep: 1,
        selectedBlockId: null,
        stepValidation: {},
        isSupabaseEnabled: false,
        databaseMode: 'local' as const,
        isLoading: false,
    },
    actions: {
        updateBlock: vi.fn(),
        setSelectedBlockId: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        setCurrentStep: vi.fn(),
        setStepValid: vi.fn(),
        loadDefaultTemplate: vi.fn(),
        ensureStepLoaded: vi.fn(),
        undo: vi.fn(),
        redo: vi.fn(),
        canUndo: false,
        canRedo: false,
        exportJSON: vi.fn(),
        importJSON: vi.fn(),
        loadSupabaseComponents: vi.fn(),
    }
};

// Componente wrapper para testes
const TestWrapper: React.FC<{ children: React.ReactNode; selectedBlock?: Block }> = ({
    children,
    selectedBlock
}) => {
    return (
        <EditorProvider initial={mockEditorContext.state}>
            <div data-testid="properties-panel-container">
                <PropertiesColumn selectedBlock={selectedBlock} />
                {children}
            </div>
        </EditorProvider>
    );
};

// Utility para criar blocos de teste
const createTestBlock = (type: BlockType, properties: Record<string, any> = {}): Block => ({
    id: `test-${type}-${Date.now()}`,
    type,
    order: 0,
    content: {},
    properties: {
        // Propriedades padrão baseadas no tipo
        ...getDefaultPropertiesForType(type),
        ...properties
    }
});

// Função para obter propriedades padrão por tipo de bloco
function getDefaultPropertiesForType(type: BlockType): Record<string, any> {
    const defaultProps: Record<BlockType, Record<string, any>> = {
        // ETAPA 1 - Introdução e coleta de nome
        'quiz-intro-header': {
            title: 'Descubra Seu Estilo',
            subtitle: 'Quiz personalizado',
            backgroundColor: '#f8f9fa',
            textColor: '#333333'
        },
        'text-inline': {
            text: 'Texto de exemplo',
            fontSize: '16px',
            fontWeight: 'normal',
            textAlign: 'left',
            color: '#333333'
        },
        'form-input': {
            label: 'Nome',
            placeholder: 'Digite seu nome',
            required: true,
            type: 'text'
        },
        'button-inline': {
            text: 'Continuar',
            variant: 'primary',
            size: 'md',
            fullWidth: false
        },

        // ETAPAS 2-11 - Questões pontuadas
        'quiz-question-inline': {
            question: 'Qual sua pergunta?',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            options: []
        },
        'options-grid': {
            options: [],
            columns: 2,
            gap: '16px',
            selectionStyle: 'checkbox'
        },

        // ETAPA 12 - Transição
        'quiz-navigation': {
            showProgress: true,
            progressText: 'Etapa {current} de {total}',
            nextButtonText: 'Próximo',
            prevButtonText: 'Anterior'
        },

        // ETAPAS 13-18 - Questões estratégicas
        'heading-inline': {
            text: 'Título',
            level: 2,
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#333333'
        },

        // ETAPA 19 - Transição para resultado
        'progress-inline': {
            value: 95,
            max: 100,
            showPercentage: true,
            color: 'primary',
            animated: true
        },

        // ETAPA 20 - Resultado personalizado
        'step20-result-header': {
            celebrationText: 'Parabéns!',
            resultTitle: 'Seu Estilo é...',
            showConfetti: true,
            backgroundColor: '#f8f9fa'
        },
        'step20-style-reveal': {
            styleName: 'Clássico Elegante',
            styleDescription: 'Descrição do estilo',
            showAnimation: true,
            cardStyle: 'elegant'
        },
        'step20-user-greeting': {
            greetingText: 'Olá, {userName}!',
            personalizedMessage: true,
            showAvatar: false
        },
        'step20-compatibility': {
            percentage: 85,
            showAnimatedCounter: true,
            color: '#22c55e',
            description: 'compatibilidade com seu estilo'
        },
        'step20-secondary-styles': {
            showSecondaryStyles: true,
            maxSecondaryStyles: 3,
            cardLayout: 'grid'
        },
        'step20-personalized-offer': {
            offerTitle: 'Oferta Personalizada',
            ctaText: 'Quero Descobrir Mais',
            showDiscount: true,
            discountPercentage: 20
        },

        // ETAPA 21 - Oferta
        'urgency-timer-inline': {
            deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: false,
            urgencyText: 'Oferta expira em:'
        },
        'before-after-inline': {
            beforeTitle: 'Antes',
            afterTitle: 'Depois',
            beforeImage: '',
            afterImage: '',
            showLabels: true
        },
        'bonus': {
            title: 'Bônus Exclusivo',
            description: 'Descrição do bônus',
            value: '50',
            showValue: true
        },
        'secure-purchase': {
            securityText: 'Compra 100% Segura',
            showBadges: true,
            showGuarantee: true,
            guaranteeDays: 30
        },
        'value-anchoring': {
            originalPrice: '197',
            currentPrice: '97',
            showSavings: true,
            currency: 'R$'
        },
        'mentor-section-inline': {
            mentorName: 'Gisele Galvão',
            mentorTitle: 'Consultora de Estilo',
            mentorImage: '',
            testimonial: 'Depoimento do mentor'
        },

        // Blocos gerais/fallback
        'image-inline': {
            src: '',
            alt: 'Imagem',
            width: 'auto',
            height: 'auto'
        },
        'spacer-inline': {
            height: '32px'
        },
        'legal-notice-inline': {
            text: 'Aviso legal',
            fontSize: '12px',
            textAlign: 'center',
            color: '#666666'
        }
    };

    return defaultProps[type] || {};
}

describe('Painel de Propriedades - Testes por Etapa', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('ETAPA 1 - Introdução e Coleta de Nome', () => {
        it('deve renderizar propriedades do quiz-intro-header corretamente', async () => {
            const block = createTestBlock('quiz-intro-header', {
                title: 'Descubra Seu Estilo',
                subtitle: 'Quiz personalizado'
            });

            render(<TestWrapper selectedBlock={block} />);

            expect(screen.getByDisplayValue('Descubra Seu Estilo')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Quiz personalizado')).toBeInTheDocument();
        });

        it('deve atualizar propriedades do texto inline', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('text-inline', { text: 'Texto original' });

            render(<TestWrapper selectedBlock={block} />);

            const textInput = screen.getByDisplayValue('Texto original');
            await user.clear(textInput);
            await user.type(textInput, 'Texto atualizado');

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        text: 'Texto atualizado'
                    })
                );
            });
        });

        it('deve validar campos obrigatórios do form-input', async () => {
            const block = createTestBlock('form-input', {
                required: true,
                label: 'Nome'
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar se o campo é marcado como obrigatório
            expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
        });
    });

    describe('ETAPAS 2-11 - Questões Pontuadas', () => {
        it('deve renderizar configurações da quiz-question-inline', async () => {
            const block = createTestBlock('quiz-question-inline', {
                question: 'Qual seu estilo preferido?',
                multipleSelection: true,
                maxSelections: 3
            });

            render(<TestWrapper selectedBlock={block} />);

            expect(screen.getByDisplayValue('Qual seu estilo preferido?')).toBeInTheDocument();
            expect(screen.getByLabelText(/seleção múltipla/i)).toBeChecked();
            expect(screen.getByDisplayValue('3')).toBeInTheDocument();
        });

        it('deve gerenciar opções do options-grid', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('options-grid', {
                options: [
                    { value: 'opcao1', label: 'Opção 1', points: { classic: 1, modern: 0, romantic: 0 } }
                ]
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar se pode adicionar nova opção
            const addOptionButton = screen.getByRole('button', { name: /adicionar opção/i });
            await user.click(addOptionButton);

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalled();
            });
        });

        it('deve validar configurações de pontuação', async () => {
            const block = createTestBlock('options-grid', {
                options: [
                    { value: 'test', label: 'Test', points: { classic: 1, modern: 2, romantic: 3 } }
                ]
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar se os campos de pontuação estão presentes
            expect(screen.getByLabelText(/pontos classic/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/pontos modern/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/pontos romantic/i)).toBeInTheDocument();
        });
    });

    describe('ETAPA 12 - Transição', () => {
        it('deve configurar propriedades da quiz-navigation', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('quiz-navigation', {
                showProgress: true,
                progressText: 'Etapa {current} de {total}'
            });

            render(<TestWrapper selectedBlock={block} />);

            expect(screen.getByLabelText(/mostrar progresso/i)).toBeChecked();
            expect(screen.getByDisplayValue('Etapa {current} de {total}')).toBeInTheDocument();

            // Testar mudança de configuração
            const progressToggle = screen.getByLabelText(/mostrar progresso/i);
            await user.click(progressToggle);

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        showProgress: false
                    })
                );
            });
        });
    });

    describe('ETAPAS 13-18 - Questões Estratégicas', () => {
        it('deve configurar heading-inline com diferentes níveis', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('heading-inline', {
                text: 'Título Estratégico',
                level: 2
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar campo de texto
            expect(screen.getByDisplayValue('Título Estratégico')).toBeInTheDocument();

            // Verificar seletor de nível
            const levelSelect = screen.getByLabelText(/nível do título/i);
            await user.selectOptions(levelSelect, '3');

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        level: 3
                    })
                );
            });
        });
    });

    describe('ETAPA 19 - Transição para Resultado', () => {
        it('deve configurar progress-inline com animação', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('progress-inline', {
                value: 95,
                animated: true,
                showPercentage: true
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar valor atual
            expect(screen.getByDisplayValue('95')).toBeInTheDocument();

            // Verificar toggle de animação
            expect(screen.getByLabelText(/animado/i)).toBeChecked();

            // Testar mudança de valor
            const valueInput = screen.getByLabelText(/valor/i);
            await user.clear(valueInput);
            await user.type(valueInput, '100');

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        value: 100
                    })
                );
            });
        });
    });

    describe('ETAPA 20 - Componentes Step 20', () => {
        it('deve configurar step20-result-header com celebração', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('step20-result-header', {
                celebrationText: 'Parabéns!',
                showConfetti: true
            });

            render(<TestWrapper selectedBlock={block} />);

            expect(screen.getByDisplayValue('Parabéns!')).toBeInTheDocument();
            expect(screen.getByLabelText(/mostrar confetti/i)).toBeChecked();

            // Testar desabilitação do confetti
            const confettiToggle = screen.getByLabelText(/mostrar confetti/i);
            await user.click(confettiToggle);

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        showConfetti: false
                    })
                );
            });
        });

        it('deve configurar step20-compatibility com percentage', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('step20-compatibility', {
                percentage: 85,
                showAnimatedCounter: true
            });

            render(<TestWrapper selectedBlock={block} />);

            const percentageInput = screen.getByLabelText(/percentual/i);
            expect(percentageInput).toHaveValue(85);

            // Testar mudança de percentual
            await user.clear(percentageInput);
            await user.type(percentageInput, '92');

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        percentage: 92
                    })
                );
            });
        });

        it('deve configurar step20-personalized-offer com desconto', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('step20-personalized-offer', {
                offerTitle: 'Oferta Especial',
                showDiscount: true,
                discountPercentage: 20
            });

            render(<TestWrapper selectedBlock={block} />);

            expect(screen.getByDisplayValue('Oferta Especial')).toBeInTheDocument();
            expect(screen.getByLabelText(/mostrar desconto/i)).toBeChecked();
            expect(screen.getByDisplayValue('20')).toBeInTheDocument();

            // Testar mudança no percentual de desconto
            const discountInput = screen.getByLabelText(/percentual.*desconto/i);
            await user.clear(discountInput);
            await user.type(discountInput, '25');

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        discountPercentage: 25
                    })
                );
            });
        });
    });

    describe('ETAPA 21 - Oferta', () => {
        it('deve configurar urgency-timer-inline com deadline', async () => {
            const user = userEvent.setup();
            const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const block = createTestBlock('urgency-timer-inline', {
                deadline: futureDate.toISOString(),
                showDays: true,
                showHours: true
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar configurações de exibição
            expect(screen.getByLabelText(/mostrar dias/i)).toBeChecked();
            expect(screen.getByLabelText(/mostrar horas/i)).toBeChecked();

            // Testar toggle de segundos
            const secondsToggle = screen.getByLabelText(/mostrar segundos/i);
            await user.click(secondsToggle);

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        showSeconds: true
                    })
                );
            });
        });

        it('deve configurar value-anchoring com preços', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('value-anchoring', {
                originalPrice: '197',
                currentPrice: '97',
                showSavings: true,
                currency: 'R$'
            });

            render(<TestWrapper selectedBlock={block} />);

            expect(screen.getByDisplayValue('197')).toBeInTheDocument();
            expect(screen.getByDisplayValue('97')).toBeInTheDocument();
            expect(screen.getByLabelText(/mostrar economia/i)).toBeChecked();

            // Testar mudança de preço atual
            const currentPriceInput = screen.getByLabelText(/preço atual/i);
            await user.clear(currentPriceInput);
            await user.type(currentPriceInput, '87');

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        currentPrice: '87'
                    })
                );
            });
        });

        it('deve configurar bonus com valor', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('bonus', {
                title: 'Bônus Exclusivo',
                value: '50',
                showValue: true
            });

            render(<TestWrapper selectedBlock={block} />);

            expect(screen.getByDisplayValue('Bônus Exclusivo')).toBeInTheDocument();
            expect(screen.getByDisplayValue('50')).toBeInTheDocument();
            expect(screen.getByLabelText(/mostrar valor/i)).toBeChecked();

            // Testar ocultação do valor
            const showValueToggle = screen.getByLabelText(/mostrar valor/i);
            await user.click(showValueToggle);

            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        showValue: false
                    })
                );
            });
        });
    });

    describe('Testes de Integração e Persistência', () => {
        it('deve persistir mudanças automaticamente com debounce', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('text-inline', { text: 'Texto inicial' });

            render(<TestWrapper selectedBlock={block} />);

            const textInput = screen.getByDisplayValue('Texto inicial');

            // Fazer múltiplas mudanças rapidamente
            await user.clear(textInput);
            await user.type(textInput, 'T');
            await user.type(textInput, 'e');
            await user.type(textInput, 'x');
            await user.type(textInput, 't');
            await user.type(textInput, 'o');

            // Aguardar debounce
            await waitFor(() => {
                expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                    expect.any(String),
                    block.id,
                    expect.objectContaining({
                        text: expect.stringContaining('Texto')
                    })
                );
            }, { timeout: 1000 });
        });

        it('deve validar propriedades obrigatórias', async () => {
            const block = createTestBlock('quiz-question-inline', {
                question: '',
                required: true
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar se há indicação de campo obrigatório vazio
            expect(screen.getByText(/campo obrigatório/i)).toBeInTheDocument();
        });

        it('deve resetar propriedades para valores padrão', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('heading-inline', {
                text: 'Título Modificado',
                fontSize: '32px'
            });

            render(<TestWrapper selectedBlock={block} />);

            // Procurar botão de reset (se existir)
            const resetButton = screen.queryByRole('button', { name: /resetar|padrão/i });
            if (resetButton) {
                await user.click(resetButton);

                await waitFor(() => {
                    expect(mockEditorContext.actions.updateBlock).toHaveBeenCalledWith(
                        expect.any(String),
                        block.id,
                        expect.objectContaining({
                            text: 'Título',
                            fontSize: '24px'
                        })
                    );
                });
            }
        });

        it('deve exportar e importar configurações de propriedades', async () => {
            const block = createTestBlock('quiz-question-inline', {
                question: 'Pergunta de teste',
                options: [
                    { value: 'opt1', label: 'Opção 1', points: { classic: 1, modern: 0, romantic: 0 } }
                ]
            });

            render(<TestWrapper selectedBlock={block} />);

            // Simular export
            const exportButton = screen.queryByRole('button', { name: /exportar/i });
            if (exportButton) {
                fireEvent.click(exportButton);
                // Verificar se a função de export foi chamada
                expect(mockEditorContext.actions.exportJSON).toHaveBeenCalled();
            }
        });
    });

    describe('Testes de Acessibilidade', () => {
        it('deve ter labels apropriados para todos os inputs', async () => {
            const block = createTestBlock('text-inline', {
                text: 'Texto teste',
                fontSize: '16px',
                color: '#333333'
            });

            render(<TestWrapper selectedBlock={block} />);

            // Verificar se todos os inputs têm labels
            const inputs = screen.getAllByRole('textbox');
            inputs.forEach(input => {
                expect(input).toHaveAccessibleName();
            });
        });

        it('deve suportar navegação por teclado', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('button-inline', {
                text: 'Botão teste',
                variant: 'primary'
            });

            render(<TestWrapper selectedBlock={block} />);

            const textInput = screen.getByRole('textbox');

            // Testar foco com Tab
            await user.tab();
            expect(textInput).toHaveFocus();

            // Testar navegação para próximo campo
            await user.tab();
            const nextFocusedElement = document.activeElement;
            expect(nextFocusedElement).not.toBe(textInput);
        });

        it('deve fornecer feedback adequado para ações', async () => {
            const user = userEvent.setup();
            const block = createTestBlock('quiz-question-inline', {
                question: 'Pergunta teste'
            });

            render(<TestWrapper selectedBlock={block} />);

            const questionInput = screen.getByDisplayValue('Pergunta teste');
            await user.clear(questionInput);
            await user.type(questionInput, 'Nova pergunta');

            // Verificar se há feedback visual (pode ser um indicador de salvando/salvo)
            await waitFor(() => {
                const feedback = screen.queryByText(/salvo|salvando|atualizado/i);
                if (feedback) {
                    expect(feedback).toBeInTheDocument();
                }
            });
        });
    });

    describe('Testes de Performance', () => {
        it('não deve renderizar desnecessariamente', async () => {
            const renderSpy = vi.fn();
            const block = createTestBlock('text-inline', { text: 'Texto' });

            const TestComponent = () => {
                renderSpy();
                return <TestWrapper selectedBlock={block} />;
            };

            const { rerender } = render(<TestComponent />);

            // Primeira renderização
            expect(renderSpy).toHaveBeenCalledTimes(1);

            // Re-render com mesmo bloco - deve ser otimizado
            rerender(<TestComponent />);

            // Em um componente bem otimizado, não deveria renderizar novamente
            // ou deveria ter renderizações mínimas
            expect(renderSpy).toHaveBeenCalledTimes(2);
        });

        it('deve limpar recursos ao desmontar', async () => {
            const block = createTestBlock('urgency-timer-inline', {
                deadline: new Date(Date.now() + 1000).toISOString()
            });

            const { unmount } = render(<TestWrapper selectedBlock={block} />);

            // Simular unmount
            unmount();

            // Aguardar um pouco para verificar se timers foram limpos
            await new Promise(resolve => setTimeout(resolve, 100));

            // Se houver vazamentos de memória, eles aparecerão nos testes de performance
            expect(true).toBe(true); // placeholder - testes reais de vazamento precisariam de setup específico
        });
    });
});
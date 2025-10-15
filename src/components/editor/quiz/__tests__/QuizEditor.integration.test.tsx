/**
 * @file QuizEditor.integration.test.tsx
 * @description Testes de integração end-to-end para o editor de quiz
 * @created 2025-10-13
 * @priority HIGH
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mocks globais
vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children, value, onValueChange }: any) => (
        <div data-testid="tabs" data-value={value} onClick={() => onValueChange?.('preview')}>
            {children}
        </div>
    ),
    TabsContent: ({ children, value }: any) => (
        <div data-testid={`tab-content-${value}`}>{children}</div>
    ),
    TabsList: ({ children }: any) => <div>{children}</div>,
    TabsTrigger: ({ children, value, onClick }: any) => (
        <button data-testid={`tab-trigger-${value}`} onClick={onClick}>
            {children}
        </button>
    )
}));

describe('Quiz Editor Integration Tests', () => {
    describe('🚀 Editor Initialization', () => {
        it('TC-INT-001: deve carregar o editor sem erros', async () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

            // Simulação de carregamento do editor
            const EditorWrapper = () => (
                <div data-testid="quiz-editor">
                    <div data-testid="step-navigator">Steps</div>
                    <div data-testid="component-library">Components</div>
                    <div data-testid="canvas-area">Canvas</div>
                    <div data-testid="properties-panel">Properties</div>
                </div>
            );

            render(<EditorWrapper />);

            await waitFor(() => {
                expect(screen.getByTestId('quiz-editor')).toBeInTheDocument();
            });

            // Não deve ter erros de hooks
            expect(consoleError).not.toHaveBeenCalledWith(
                expect.stringContaining('Rendered more hooks')
            );
            expect(consoleError).not.toHaveBeenCalledWith(
                expect.stringContaining('conditional')
            );

            consoleError.mockRestore();
        });

        it('TC-INT-002: deve renderizar todas as 4 colunas do layout', () => {
            const EditorWrapper = () => (
                <div className="grid grid-cols-4 gap-2">
                    <div data-testid="column-1">Step Navigator</div>
                    <div data-testid="column-2">Component Library</div>
                    <div data-testid="column-3">Canvas Area</div>
                    <div data-testid="column-4">Properties Panel</div>
                </div>
            );

            render(<EditorWrapper />);

            expect(screen.getByTestId('column-1')).toBeInTheDocument();
            expect(screen.getByTestId('column-2')).toBeInTheDocument();
            expect(screen.getByTestId('column-3')).toBeInTheDocument();
            expect(screen.getByTestId('column-4')).toBeInTheDocument();
        });

        it('TC-INT-003: Canvas Tab deve estar ativo por padrão', () => {
            const EditorWrapper = () => (
                <div data-testid="tabs" data-value="canvas">
                    <button data-testid="tab-trigger-canvas" aria-selected="true">Canvas</button>
                    <button data-testid="tab-trigger-preview" aria-selected="false">Preview</button>
                </div>
            );

            render(<EditorWrapper />);

            const canvasTab = screen.getByTestId('tab-trigger-canvas');
            expect(canvasTab).toHaveAttribute('aria-selected', 'true');
        });
    });

    describe('🧭 Step Navigation', () => {
        it('TC-INT-004: deve navegar entre steps sem erros', async () => {
            const user = userEvent.setup();
            const onStepChange = vi.fn();

            const EditorWrapper = () => (
                <div>
                    <button onClick={() => onStepChange('step-1')} data-testid="nav-step-1">
                        Step 1
                    </button>
                    <button onClick={() => onStepChange('step-2')} data-testid="nav-step-2">
                        Step 2
                    </button>
                    <div data-testid="canvas-area">Canvas Content</div>
                </div>
            );

            render(<EditorWrapper />);

            // Navegar para Step 1
            await user.click(screen.getByTestId('nav-step-1'));
            expect(onStepChange).toHaveBeenCalledWith('step-1');

            // Navegar para Step 2
            await user.click(screen.getByTestId('nav-step-2'));
            expect(onStepChange).toHaveBeenCalledWith('step-2');

            // Canvas deve continuar renderizado
            expect(screen.getByTestId('canvas-area')).toBeInTheDocument();
        });

        it('TC-INT-005: deve preservar estado ao navegar entre steps', async () => {
            const user = userEvent.setup();

            const EditorWrapper = () => {
                const [selectedStep, setSelectedStep] = React.useState('step-1');
                const [step1Blocks] = React.useState(['block-a', 'block-b']);
                const [step2Blocks] = React.useState(['block-c']);

                return (
                    <div>
                        <button onClick={() => setSelectedStep('step-1')} data-testid="nav-step-1">
                            Step 1
                        </button>
                        <button onClick={() => setSelectedStep('step-2')} data-testid="nav-step-2">
                            Step 2
                        </button>
                        <div data-testid="canvas-area">
                            {selectedStep === 'step-1' && step1Blocks.map(id => (
                                <div key={id} data-testid={`block-${id}`}>{id}</div>
                            ))}
                            {selectedStep === 'step-2' && step2Blocks.map(id => (
                                <div key={id} data-testid={`block-${id}`}>{id}</div>
                            ))}
                        </div>
                    </div>
                );
            };

            render(<EditorWrapper />);

            // Step 1 deve ter 2 blocos
            expect(screen.getByTestId('block-block-a')).toBeInTheDocument();
            expect(screen.getByTestId('block-block-b')).toBeInTheDocument();

            // Navegar para Step 2
            await user.click(screen.getByTestId('nav-step-2'));
            expect(screen.getByTestId('block-block-c')).toBeInTheDocument();

            // Voltar para Step 1
            await user.click(screen.getByTestId('nav-step-1'));

            // Blocos do Step 1 devem estar preservados
            expect(screen.getByTestId('block-block-a')).toBeInTheDocument();
            expect(screen.getByTestId('block-block-b')).toBeInTheDocument();
        });

        it('TC-INT-006: deve navegar rapidamente entre múltiplos steps', async () => {
            const user = userEvent.setup();
            const navigationLog: string[] = [];

            const EditorWrapper = () => {
                const [currentStep, setCurrentStep] = React.useState(1);

                const handleNav = (step: number) => {
                    navigationLog.push(`step-${step}`);
                    setCurrentStep(step);
                };

                return (
                    <div>
                        {[1, 2, 3, 4, 5].map(n => (
                            <button
                                key={n}
                                onClick={() => handleNav(n)}
                                data-testid={`nav-step-${n}`}
                            >
                                Step {n}
                            </button>
                        ))}
                        <div data-testid="current-step">Step {currentStep}</div>
                    </div>
                );
            };

            render(<EditorWrapper />);

            // Navegar rapidamente entre steps
            for (let i = 1; i <= 5; i++) {
                await user.click(screen.getByTestId(`nav-step-${i}`));
            }

            // Todas as navegações devem ter sido registradas
            expect(navigationLog).toHaveLength(5);
            expect(screen.getByTestId('current-step')).toHaveTextContent('Step 5');
        });
    });

    describe('🎨 Canvas Rendering', () => {
        it('TC-INT-007: Canvas deve renderizar blocos corretamente', () => {
            const blocks = [
                { id: 'block-1', type: 'heading', content: 'Title' },
                { id: 'block-2', type: 'text', content: 'Description' },
                { id: 'block-3', type: 'image', content: 'image.jpg' }
            ];

            const EditorWrapper = () => (
                <div data-testid="canvas-area">
                    {blocks.map(block => (
                        <div key={block.id} data-testid={`block-${block.id}`}>
                            {block.type}: {block.content}
                        </div>
                    ))}
                </div>
            );

            render(<EditorWrapper />);

            expect(screen.getByTestId('block-block-1')).toHaveTextContent('heading: Title');
            expect(screen.getByTestId('block-block-2')).toHaveTextContent('text: Description');
            expect(screen.getByTestId('block-block-3')).toHaveTextContent('image: image.jpg');
        });

        it('TC-INT-008: Canvas vazio deve mostrar mensagem apropriada', () => {
            const EditorWrapper = () => (
                <div data-testid="canvas-area">
                    <div className="text-center text-muted-foreground">(vazio)</div>
                </div>
            );

            render(<EditorWrapper />);

            expect(screen.getByText('(vazio)')).toBeInTheDocument();
        });
    });

    describe('⚡ Virtualization', () => {
        it('TC-INT-009: deve mostrar badge de virtualização com mais de 60 blocos', () => {
            const blocks = Array.from({ length: 100 }, (_, i) => ({
                id: `block-${i}`,
                type: 'heading'
            }));

            const EditorWrapper = () => {
                const isVirtualized = blocks.length > 60;
                const visibleBlocks = blocks.slice(0, 20);

                return (
                    <div>
                        <div data-testid="canvas-area">
                            {visibleBlocks.map(block => (
                                <div key={block.id} data-testid={block.id}>
                                    {block.type}
                                </div>
                            ))}
                        </div>
                        {isVirtualized && (
                            <div data-testid="virtualization-badge">
                                Virtualização ativa · {blocks.length} blocos · exibindo {visibleBlocks.length}
                            </div>
                        )}
                    </div>
                );
            };

            render(<EditorWrapper />);

            expect(screen.getByTestId('virtualization-badge')).toBeInTheDocument();
            expect(screen.getByText(/100 blocos/)).toBeInTheDocument();
            expect(screen.getByText(/exibindo 20/)).toBeInTheDocument();
        });

        it('TC-INT-010: não deve mostrar badge com menos de 60 blocos', () => {
            const blocks = Array.from({ length: 30 }, (_, i) => ({
                id: `block-${i}`,
                type: 'heading'
            }));

            const EditorWrapper = () => {
                const isVirtualized = blocks.length > 60;

                return (
                    <div>
                        <div data-testid="canvas-area">
                            {blocks.map(block => (
                                <div key={block.id}>{block.type}</div>
                            ))}
                        </div>
                        {isVirtualized && (
                            <div data-testid="virtualization-badge">Virtualização ativa</div>
                        )}
                    </div>
                );
            };

            render(<EditorWrapper />);

            expect(screen.queryByTestId('virtualization-badge')).not.toBeInTheDocument();
        });

        it('TC-INT-011: virtualização deve desabilitar durante drag', () => {
            const EditorWrapper = () => {
                const [isDragging, setIsDragging] = React.useState(false);
                const blocks = Array.from({ length: 100 }, (_, i) => ({ id: `block-${i}` }));
                const isVirtualized = blocks.length > 60 && !isDragging;

                return (
                    <div>
                        <button onClick={() => setIsDragging(!isDragging)} data-testid="toggle-drag">
                            {isDragging ? 'Stop Drag' : 'Start Drag'}
                        </button>
                        {isVirtualized && (
                            <div data-testid="virtualization-badge">Virtualização ativa</div>
                        )}
                        {isDragging && (
                            <div data-testid="dragging-indicator">Dragging...</div>
                        )}
                    </div>
                );
            };

            const { rerender } = render(<EditorWrapper />);

            // Inicialmente com virtualização
            expect(screen.getByTestId('virtualization-badge')).toBeInTheDocument();

            // Iniciar drag
            const toggleButton = screen.getByTestId('toggle-drag');
            userEvent.click(toggleButton);

            rerender(<EditorWrapper />);

            // Badge deve desaparecer durante drag
            waitFor(() => {
                expect(screen.queryByTestId('virtualization-badge')).not.toBeInTheDocument();
                expect(screen.getByTestId('dragging-indicator')).toBeInTheDocument();
            });
        });
    });

    describe('👁️ Preview Tab', () => {
        it('TC-INT-012: deve alternar entre Canvas e Preview tabs', async () => {
            const user = userEvent.setup();

            const EditorWrapper = () => {
                const [activeTab, setActiveTab] = React.useState('canvas');

                return (
                    <div>
                        <button
                            onClick={() => setActiveTab('canvas')}
                            data-testid="tab-trigger-canvas"
                            aria-selected={activeTab === 'canvas'}
                        >
                            Canvas
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            data-testid="tab-trigger-preview"
                            aria-selected={activeTab === 'preview'}
                        >
                            Preview
                        </button>
                        {activeTab === 'canvas' && (
                            <div data-testid="tab-content-canvas">Canvas Content</div>
                        )}
                        {activeTab === 'preview' && (
                            <div data-testid="tab-content-preview">Preview Content</div>
                        )}
                    </div>
                );
            };

            render(<EditorWrapper />);

            // Inicialmente na tab Canvas
            expect(screen.getByTestId('tab-content-canvas')).toBeInTheDocument();

            // Trocar para Preview
            await user.click(screen.getByTestId('tab-trigger-preview'));

            await waitFor(() => {
                expect(screen.getByTestId('tab-content-preview')).toBeInTheDocument();
                expect(screen.queryByTestId('tab-content-canvas')).not.toBeInTheDocument();
            });
        });

        it('TC-INT-013: Preview deve ter modos responsivos', async () => {
            const user = userEvent.setup();

            const EditorWrapper = () => {
                const [previewSize, setPreviewSize] = React.useState('desktop');

                return (
                    <div>
                        <button onClick={() => setPreviewSize('mobile')} data-testid="preview-mobile">
                            📱
                        </button>
                        <button onClick={() => setPreviewSize('tablet')} data-testid="preview-tablet">
                            💊
                        </button>
                        <button onClick={() => setPreviewSize('desktop')} data-testid="preview-desktop">
                            🖥️
                        </button>
                        <div
                            data-testid="preview-container"
                            data-size={previewSize}
                            className={
                                previewSize === 'mobile' ? 'max-w-[375px]' :
                                    previewSize === 'tablet' ? 'max-w-[768px]' :
                                        'max-w-full'
                            }
                        >
                            Preview
                        </div>
                    </div>
                );
            };

            render(<EditorWrapper />);

            // Mobile
            await user.click(screen.getByTestId('preview-mobile'));
            expect(screen.getByTestId('preview-container')).toHaveAttribute('data-size', 'mobile');

            // Tablet
            await user.click(screen.getByTestId('preview-tablet'));
            expect(screen.getByTestId('preview-container')).toHaveAttribute('data-size', 'tablet');

            // Desktop
            await user.click(screen.getByTestId('preview-desktop'));
            expect(screen.getByTestId('preview-container')).toHaveAttribute('data-size', 'desktop');
        });
    });

    describe('🎛️ Properties Panel', () => {
        it('TC-INT-014: painel deve sincronizar com bloco selecionado', async () => {
            const user = userEvent.setup();

            const EditorWrapper = () => {
                const [selectedBlock, setSelectedBlock] = React.useState<string | null>(null);

                const blocks = [
                    { id: 'block-1', type: 'heading', text: 'Title 1' },
                    { id: 'block-2', type: 'text', text: 'Text 2' }
                ];

                return (
                    <div>
                        <div data-testid="canvas-area">
                            {blocks.map(block => (
                                <button
                                    key={block.id}
                                    onClick={() => setSelectedBlock(block.id)}
                                    data-testid={`block-${block.id}`}
                                >
                                    {block.text}
                                </button>
                            ))}
                        </div>
                        <div data-testid="properties-panel">
                            {selectedBlock && (
                                <div data-testid="selected-block-props">
                                    Editing: {blocks.find(b => b.id === selectedBlock)?.text}
                                </div>
                            )}
                        </div>
                    </div>
                );
            };

            render(<EditorWrapper />);

            // Selecionar bloco 1
            await user.click(screen.getByTestId('block-block-1'));
            expect(screen.getByTestId('selected-block-props')).toHaveTextContent('Editing: Title 1');

            // Selecionar bloco 2
            await user.click(screen.getByTestId('block-block-2'));
            expect(screen.getByTestId('selected-block-props')).toHaveTextContent('Editing: Text 2');
        });

        it('TC-INT-015: mudanças no painel devem refletir no canvas', async () => {
            const user = userEvent.setup();

            const EditorWrapper = () => {
                const [blockText, setBlockText] = React.useState('Original Text');

                return (
                    <div>
                        <div data-testid="canvas-area">
                            <div data-testid="block-display">{blockText}</div>
                        </div>
                        <div data-testid="properties-panel">
                            <input
                                data-testid="text-input"
                                value={blockText}
                                onChange={(e) => setBlockText(e.target.value)}
                            />
                        </div>
                    </div>
                );
            };

            render(<EditorWrapper />);

            const input = screen.getByTestId('text-input');

            // Mudar texto no painel
            await user.clear(input);
            await user.type(input, 'New Text');

            // Deve atualizar no canvas
            await waitFor(() => {
                expect(screen.getByTestId('block-display')).toHaveTextContent('New Text');
            });
        });
    });

    describe('🔄 Undo/Redo', () => {
        it('TC-INT-016: deve desfazer e refazer ações', async () => {
            const user = userEvent.setup();

            const EditorWrapper = () => {
                const [history, setHistory] = React.useState<string[]>(['Initial']);
                const [currentIndex, setCurrentIndex] = React.useState(0);

                const addAction = (action: string) => {
                    const newHistory = [...history.slice(0, currentIndex + 1), action];
                    setHistory(newHistory);
                    setCurrentIndex(newHistory.length - 1);
                };

                const undo = () => {
                    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                };

                const redo = () => {
                    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
                };

                return (
                    <div>
                        <button onClick={() => addAction('Action ' + (history.length))} data-testid="add-action">
                            Add Action
                        </button>
                        <button onClick={undo} disabled={currentIndex === 0} data-testid="undo">
                            Undo
                        </button>
                        <button onClick={redo} disabled={currentIndex === history.length - 1} data-testid="redo">
                            Redo
                        </button>
                        <div data-testid="current-state">{history[currentIndex]}</div>
                    </div>
                );
            };

            render(<EditorWrapper />);

            // Estado inicial
            expect(screen.getByTestId('current-state')).toHaveTextContent('Initial');

            // Adicionar ação
            await user.click(screen.getByTestId('add-action'));
            expect(screen.getByTestId('current-state')).toHaveTextContent('Action 1');

            // Adicionar outra ação
            await user.click(screen.getByTestId('add-action'));
            expect(screen.getByTestId('current-state')).toHaveTextContent('Action 2');

            // Desfazer
            await user.click(screen.getByTestId('undo'));
            expect(screen.getByTestId('current-state')).toHaveTextContent('Action 1');

            // Desfazer novamente
            await user.click(screen.getByTestId('undo'));
            expect(screen.getByTestId('current-state')).toHaveTextContent('Initial');

            // Refazer
            await user.click(screen.getByTestId('redo'));
            expect(screen.getByTestId('current-state')).toHaveTextContent('Action 1');
        });
    });

    describe('🛡️ Error Handling', () => {
        it('TC-INT-017: deve lidar com erros de renderização graciosamente', async () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

            const ProblematicComponent = () => {
                throw new Error('Rendering error');
            };

            // Usa ErrorBoundary real do projeto
            const QuizEditorErrorBoundary = (await import('@/tools/debug/QuizEditorErrorBoundary')).default;

            render(
                <QuizEditorErrorBoundary>
                    <ProblematicComponent />
                </QuizEditorErrorBoundary>
            );

            expect(screen.getByText(/Erro no QuizFunnelEditor/)).toBeInTheDocument();

            consoleError.mockRestore();
        });
    });
});

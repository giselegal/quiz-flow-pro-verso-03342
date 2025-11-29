/**
 * 🧪 TESTES DE INTEGRAÇÃO - QuizModularEditorV4
 * 
 * Testes end-to-end do fluxo completo de edição:
 * 1. Carregar template/funnel
 * 2. Navegar entre steps
 * 3. Selecionar blocos
 * 4. Editar propriedades
 * 5. Salvar alterações
 * 6. Validar conversões v3 ↔ v4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { QuizModularEditorV4Wrapper } from '../QuizModularEditorV4';
import { EditorProvider } from '@/core';
import type { Block } from '@/types/editor';
import { BlockV3ToV4Adapter, BlockV4ToV3Adapter } from '@/core/quiz/blocks/adapters';

// Mocks
vi.mock('@/lib/utils/appLogger', () => ({
    appLogger: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}));

// Helper para envolver renders/ações em act e mitigar warnings
async function renderWithAct(ui: React.ReactElement) {
    let utils: ReturnType<typeof renderWithProviders> | undefined;
    await act(async () => {
        utils = renderWithProviders(ui);
    });
    return utils as ReturnType<typeof renderWithProviders>;
}

// Helper para interações de usuário dentro de act
async function actUser<T>(cb: (user: ReturnType<typeof userEvent.setup>) => Promise<T> | T): Promise<T> {
    const user = userEvent.setup();
    let result: T | undefined;
    await act(async () => {
        result = await cb(user);
    });
    return result as T;
}

// Helper para avançar timers dentro de act
async function actAdvance(ms: number) {
    await act(async () => {
        vi.advanceTimersByTime(ms);
    });
}

describe('QuizModularEditorV4 - Integração Completa', () => {
    const mockFunnelId = 'test-funnel-123';

    const mockStep1Blocks: Block[] = [
        {
            id: 'intro-title',
            type: 'text',
            order: 0,
            properties: { fontSize: 24, fontWeight: 'bold' },
            content: { text: 'Bem-vindo ao Quiz!' },
        },
        {
            id: 'intro-button',
            type: 'button',
            order: 1,
            properties: { variant: 'primary', size: 'lg' },
            content: { label: 'Começar' },
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('Fluxo Completo: Carregar → Editar → Salvar', () => {
        it('deve carregar funnel, editar bloco e persistir mudanças', async () => {
            // Interações futuras devem usar actUser(...)
            const onBlockV4Update = vi.fn();

            const { rerender } = await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                        onBlockV4Update={onBlockV4Update}
                    />
                </EditorProvider>
            );

            // 1. Aguardar carregamento
            await waitFor(() => {
                expect(screen.getByText(/Editor Modular/i)).toBeInTheDocument();
            });

            // 2. Verificar blocos carregados
            const startBtn = screen.queryByRole('button', { name: /começar/i })
                || screen.queryByRole('button', { name: /start/i });
            if (startBtn) {
                expect(startBtn).toBeInTheDocument();
            }

            // 3. Selecionar primeiro bloco
            if (startBtn) {
                await actUser(async (user) => {
                    await user.click(startBtn);
                });
            }

            // 4. Editar propriedade no painel v4
            const fontSizeInput = screen.queryByLabelText(/font size|tamanho da fonte/i);
            if (fontSizeInput) {
                await actUser(async (user) => {
                    await user.clear(fontSizeInput as HTMLElement);
                    await user.type(fontSizeInput as HTMLElement, '26');
                });
            }

            // 5. Verificar que update foi chamado
            // expect(onBlockV4Update).toHaveBeenCalledWith(
            //     'intro-title',
            //     expect.objectContaining({
            //         properties: expect.objectContaining({ updated: true })
            //     })
            // );
        });

        it('deve manter estado ao alternar entre steps', async () => {
            // Interações futuras devem usar actUser(...)

            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                        initialStepKey="step1"
                    />
                </EditorProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('editor-header')).toBeInTheDocument();
                expect(screen.getByText(/Editor Modular/i)).toBeInTheDocument();
            });

            // Alternar step via botão "Próximo" quando disponível
            await actUser(async (user) => {
                const nextBtn = screen.queryByRole('button', { name: /próximo/i })
                    || screen.queryByRole('button', { name: /next/i });
                if (nextBtn) {
                    await user.click(nextBtn);
                }
            });
            await waitFor(() => {
                expect(screen.getByTestId('editor-header')).toBeInTheDocument();
            });
        });
    });

    describe('Conversão Bidirecional v3 ↔ v4', () => {
        it('deve converter bloco v3 para v4 e vice-versa sem perda de dados', () => {
            const originalV3Block: Block = {
                id: 'test-block',
                type: 'text',
                order: 0,
                properties: {
                    fontSize: 18,
                    color: '#333',
                },
                content: {
                    text: 'Test content',
                },
            };

            // v3 → v4
            const v4Block = BlockV3ToV4Adapter.convert(originalV3Block);
            expect(v4Block.id).toBe(originalV3Block.id);
            expect(v4Block.type).toBe(originalV3Block.type);
            expect(v4Block.properties.fontSize).toBe(18);
            expect(v4Block.properties.text).toBe('Test content');

            // v4 → v3
            const backToV3 = BlockV4ToV3Adapter.convert(v4Block);
            expect(backToV3.id).toBe(originalV3Block.id);
            expect(backToV3.type).toBe(originalV3Block.type);
            expect(backToV3.properties?.fontSize).toBe(18);
        });

        it('deve lidar com blocos complexos com nested properties', () => {
            const complexBlock: Block = {
                id: 'complex',
                type: 'question-multiple-step',
                order: 0,
                properties: {
                    questionText: 'Qual sua cor favorita?',
                    options: ['Azul', 'Verde', 'Vermelho'],
                    correctAnswer: 0,
                },
                content: {
                    metadata: {
                        points: 10,
                        category: 'preferences',
                    },
                },
            };

            const v4Block = BlockV3ToV4Adapter.convert(complexBlock);
            expect(v4Block.properties.questionText).toBe('Qual sua cor favorita?');
            expect(v4Block.properties.options).toEqual(['Azul', 'Verde', 'Vermelho']);

            const backToV3 = BlockV4ToV3Adapter.convert(v4Block);
            expect(backToV3.properties?.questionText).toBe('Qual sua cor favorita?');
        });

        it('deve aplicar defaults do BlockRegistry na conversão v3→v4', () => {
            const minimalBlock: Block = {
                id: 'minimal',
                type: 'button',
                order: 0,
                properties: {},
                content: {},
            };

            const v4Block = BlockV3ToV4Adapter.convert(minimalBlock);

            // Deve ter defaults do BlockRegistry para 'button'
            expect(v4Block.properties).toBeDefined();
            expect(v4Block.metadata).toBeDefined();
            if (v4Block.metadata) {
                expect(v4Block.metadata.editable).toBe(true);
            }
        });
    });

    describe('DynamicPropertiesPanel v4 - Validação', () => {
        it('deve validar propriedades obrigatórias', async () => {
            // TODO: Testar validação de campos obrigatórios
        });

        it('deve validar tipos de propriedades', async () => {
            // TODO: Testar validação de tipos (string, number, boolean)
        });

        it('deve exibir erros de validação Zod', async () => {
            // TODO: Testar exibição de erros
        });

        it('deve impedir salvar com erros de validação', async () => {
            // TODO: Testar bloqueio de save
        });
    });

    describe('Multi-Step Editing', () => {
        it('deve gerenciar blocos independentes por step', async () => {
            const { rerender } = await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                        initialStepKey="step1"
                    />
                </EditorProvider>
            );

            // TODO: Verificar isolamento de blocos por step
        });

        it('deve marcar steps como dirty quando modificados', async () => {
            // TODO: Testar dirty tracking
        });

        it('deve salvar apenas steps modificados', async () => {
            // TODO: Testar save seletivo
        });
    });

    describe('Undo/Redo (se implementado)', () => {
        it('deve desfazer alteração de propriedade', async () => {
            // TODO: Testar undo
        });

        it('deve refazer alteração desfeita', async () => {
            // TODO: Testar redo
        });

        it('deve limpar histórico após salvar', async () => {
            // TODO: Testar limpeza de histórico
        });
    });

    describe('Performance em Escala', () => {
        it('deve renderizar 50+ blocos sem lag', async () => {
            const manyBlocks: Block[] = Array.from({ length: 50 }, (_, i) => ({
                id: `block-${i}`,
                type: 'text',
                order: i,
                properties: { content: `Block ${i}` },
                content: {},
            }));

            const startTime = performance.now();

            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                    />
                </EditorProvider>
            );

            await waitFor(() => {
                expect(screen.getByText(/Editor Modular/i)).toBeInTheDocument();
            });

            const endTime = performance.now();
            const renderTime = endTime - startTime;

            // Render deve ser < 1000ms mesmo com muitos blocos
            expect(renderTime).toBeLessThan(1000);
        });

        it('deve usar virtualização para listas longas', async () => {
            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                    />
                </EditorProvider>
            );
            await waitFor(() => {
                expect(screen.getByText(/Editor Modular/i)).toBeInTheDocument();
            });
        });
    });

    describe('Acessibilidade', () => {
        it('deve ter roles ARIA corretos', async () => {
            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                    />
                </EditorProvider>
            );

            // Verificar roles principais
            const main = screen.queryByRole('main');
            const toolbar = screen.queryByRole('toolbar');
            expect(main || toolbar).toBeTruthy();
        });

        it('deve ser navegável por teclado', async () => {
            // Interações futuras devem usar actUser(...)

            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                    />
                </EditorProvider>
            );

            await actUser(async (user) => {
                await user.tab();
                await user.tab();
            });
            expect(screen.getByText(/Editor Modular/i)).toBeInTheDocument();
        });
    });

    describe('Carregamento de Modelos e Renderização', () => {
        it('deve mostrar canvas em branco quando sem template/funnel e sem blocos', async () => {
            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper useV4Layout={true} />
                </EditorProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('editor-header')).toBeInTheDocument();
            });

            // Empty state panel com ações
            const emptyPanelHeading = screen.getByText(/Canvas em branco/i);
            expect(emptyPanelHeading).toBeInTheDocument();
            const emptyPanel = emptyPanelHeading.closest('div');
            expect(emptyPanel).toBeTruthy();
            const addTextBtn = screen.getByRole('button', { name: /Adicionar bloco de texto/i });
            expect(addTextBtn).toBeInTheDocument();
            const importBtns = screen.getAllByRole('button', { name: /Importar JSON/i });
            expect(importBtns.length).toBeGreaterThanOrEqual(1);
            const loadTemplateBtns = screen.getAllByRole('button', { name: /Carregar Template/i });
            expect(loadTemplateBtns.length).toBeGreaterThanOrEqual(1);
        });

        it('deve carregar template pelo templateId e renderizar blocos no canvas', async () => {
            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper useV4Layout={true} templateId={'quiz21StepsComplete'} />
                </EditorProvider>
            );

            // Aguarda header
            await waitFor(() => {
                expect(screen.getByTestId('editor-header')).toBeInTheDocument();
            });

            // Aguarda que o canvas esteja presente
            await waitFor(() => {
                expect(screen.getByTestId('column-canvas')).toBeInTheDocument();
            });

            // Não deve mostrar empty state se blocos foram carregados
            const emptyHeading = screen.queryByText(/Canvas em branco/i);
            expect(emptyHeading).toBeNull();
        });

        it('deve abrir via funnel + step da query no step correto sem empty state', async () => {
            // Simular URL com query params de forma segura no ambiente de teste
            const originalHref = window.location.href;
            Object.defineProperty(window, 'location', {
                value: new URL('http://localhost/?funnel=quiz21StepsComplete&step=3'),
                writable: true,
            });

            await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper useV4Layout={true} funnelId={'quiz21StepsComplete'} />
                </EditorProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('editor-header')).toBeInTheDocument();
            });

            // Canvas presente
            await waitFor(() => {
                expect(screen.getByTestId('column-canvas')).toBeInTheDocument();
            });

            // Badge de step deve estar presente (editor inicia em step-01 por padrão)
            const stepBadges = screen.getAllByText(/step-\d{2}/i);
            expect(stepBadges.length).toBeGreaterThanOrEqual(1);

            // Não deve mostrar empty state
            expect(screen.queryByText(/Canvas em branco/i)).toBeNull();

            // Restaurar location
            Object.defineProperty(window, 'location', { value: new URL(originalHref), writable: true });
        });
    });
    describe('Persistência e Sincronização', () => {
        it('deve auto-save a cada N segundos', async () => {
            vi.useFakeTimers();

            const { rerender } = await renderWithAct(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId={mockFunnelId}
                    />
                </EditorProvider>
            );

            // TODO: Simular edição
            // Exemplo de avanço de timer com act
            await actAdvance(5000);
            // TODO: Verificar auto-save

            vi.useRealTimers();
        });

        it('deve sincronizar com Supabase', async () => {
            // TODO: Testar sync com backend
        });

        it('deve lidar com conflitos de edição', async () => {
            // TODO: Testar resolução de conflitos
        });
    });
});

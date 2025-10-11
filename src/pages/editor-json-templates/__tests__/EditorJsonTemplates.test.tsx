import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorJsonTemplatesPage from '../index';

// Mock do EditorLayout
vi.mock('@/components/layout/EditorLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="editor-layout">{children}</div>
}));

// Mock do QuizStepAdapter
vi.mock('@/adapters/QuizStepAdapter', () => ({
    QuizStepAdapter: {
        fromJSON: vi.fn((json) => {
            if (json.metadata?.id === 'invalid') {
                throw new Error('JSON inválido');
            }
            return json;
        })
    }
}));

// Mock do fetch
global.fetch = vi.fn();

describe('EditorJsonTemplatesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Mock de templates para testes
        (global.fetch as any).mockResolvedValue({
            ok: false
        });
    });

    describe('Renderização Inicial', () => {
        it('deve renderizar o título principal', () => {
            render(<EditorJsonTemplatesPage />);
            expect(screen.getByText('Editor de Templates JSON')).toBeInTheDocument();
        });

        it('deve renderizar a descrição', () => {
            render(<EditorJsonTemplatesPage />);
            expect(screen.getByText(/Edite visualmente os templates do Quiz de Estilo/i)).toBeInTheDocument();
        });

        it('deve renderizar o campo de busca', () => {
            render(<EditorJsonTemplatesPage />);
            expect(screen.getByPlaceholderText(/Buscar por nome/i)).toBeInTheDocument();
        });

        it('deve renderizar o botão de refresh', () => {
            render(<EditorJsonTemplatesPage />);
            const refreshButton = screen.getByRole('button', { name: /atualizar lista/i });
            expect(refreshButton).toBeInTheDocument();
        });

        it('deve renderizar o botão de importar', () => {
            render(<EditorJsonTemplatesPage />);
            expect(screen.getByText(/Importar Template/i)).toBeInTheDocument();
        });
    });

    describe('Listagem de Templates', () => {
        it('deve carregar templates padrão quando o fetch falhar', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });
        });

        it('deve exibir a contagem de blocos para cada template', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                const blockCounts = screen.getAllByText(/\d+ blocos?/i);
                expect(blockCounts.length).toBeGreaterThan(0);
            });
        });

        it('deve exibir badges de categoria', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                const categories = screen.getAllByText(/quiz-/i);
                expect(categories.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Busca e Filtros', () => {
        it('deve filtrar templates ao digitar no campo de busca', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/Buscar por nome/i);
            fireEvent.change(searchInput, { target: { value: 'step-02' } });

            await waitFor(() => {
                expect(screen.queryByText(/Step step-01/i)).not.toBeInTheDocument();
                expect(screen.getByText(/Step step-02/i)).toBeInTheDocument();
            });
        });

        it('deve filtrar por ID do template', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/Buscar por nome/i);
            fireEvent.change(searchInput, { target: { value: 'quiz-step-01' } });

            await waitFor(() => {
                const visibleTemplates = screen.queryAllByText(/Step step-/i);
                expect(visibleTemplates.length).toBe(1);
            });
        });

        it('deve filtrar por categoria', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/Buscar por nome/i);
            fireEvent.change(searchInput, { target: { value: 'question' } });

            await waitFor(() => {
                const categories = screen.getAllByText(/quiz-question/i);
                expect(categories.length).toBeGreaterThan(0);
            });
        });

        it('deve exibir mensagem quando nenhum template for encontrado', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/Buscar por nome/i);
            fireEvent.change(searchInput, { target: { value: 'inexistente123' } });

            await waitFor(() => {
                expect(screen.getByText(/Nenhum template encontrado/i)).toBeInTheDocument();
            });
        });
    });

    describe('Seleção de Template', () => {
        it('deve selecionar um template ao clicar', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                // Verifica se o preview JSON está visível
                expect(screen.getByText(/templateVersion/i)).toBeInTheDocument();
            });
        });

        it('deve exibir metadados do template selecionado', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                expect(screen.getByText(/Nome do Template/i)).toBeInTheDocument();
                expect(screen.getByText(/Categoria/i)).toBeInTheDocument();
                expect(screen.getByText(/Descrição/i)).toBeInTheDocument();
            });
        });

        it('deve exibir botões de ação quando um template está selecionado', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                expect(screen.getByText(/Preview/i)).toBeInTheDocument();
                expect(screen.getByText(/Duplicar/i)).toBeInTheDocument();
                expect(screen.getByText(/Exportar/i)).toBeInTheDocument();
                expect(screen.getByText(/Editar/i)).toBeInTheDocument();
            });
        });
    });

    describe('Modo de Edição', () => {
        it('deve entrar no modo de edição ao clicar em Editar', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Salvar/i)).toBeInTheDocument();
                expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
            });
        });

        it('deve permitir editar o nome do template', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                const nameInput = screen.getByDisplayValue(/Step step-01/i);
                fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });
                expect(nameInput).toHaveValue('Novo Nome');
            });
        });

        it('deve permitir editar a categoria do template', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                const categoryInput = screen.getByDisplayValue(/quiz-/i);
                fireEvent.change(categoryInput, { target: { value: 'nova-categoria' } });
                expect(categoryInput).toHaveValue('nova-categoria');
            });
        });

        it('deve cancelar edição ao clicar em Cancelar', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                const nameInput = screen.getByDisplayValue(/Step step-01/i);
                fireEvent.change(nameInput, { target: { value: 'Nome Temporário' } });
            });

            const cancelButton = screen.getByText(/Cancelar/i);
            fireEvent.click(cancelButton);

            await waitFor(() => {
                // Deve voltar ao modo de visualização
                expect(screen.getByText(/Editar/i)).toBeInTheDocument();
                expect(screen.queryByText(/Salvar/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Validação e Salvamento', () => {
        it('deve validar JSON antes de salvar', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                const saveButton = screen.getByText(/Salvar/i);
                fireEvent.click(saveButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });
        });

        it('deve exibir erro ao tentar salvar JSON inválido', async () => {
            const { QuizStepAdapter } = await import('@/adapters/QuizStepAdapter');

            // Forçar erro de validação
            vi.mocked(QuizStepAdapter.fromJSON).mockImplementationOnce(() => {
                throw new Error('JSON inválido: estrutura incorreta');
            });

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                const saveButton = screen.getByText(/Salvar/i);
                fireEvent.click(saveButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Erro ao validar template/i)).toBeInTheDocument();
            });
        });

        it('deve salvar template no localStorage', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                const nameInput = screen.getByDisplayValue(/Step step-01/i);
                fireEvent.change(nameInput, { target: { value: 'Template Editado' } });
            });

            await waitFor(() => {
                const saveButton = screen.getByText(/Salvar/i);
                fireEvent.click(saveButton);
            });

            await waitFor(() => {
                expect(localStorage.getItem('json-template-quiz-step-01')).toBeTruthy();
            });
        });
    });

    describe('Funcionalidades de Template', () => {
        it('deve duplicar template ao clicar em Duplicar', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const duplicateButton = screen.getByText(/Duplicar/i);
                fireEvent.click(duplicateButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Template duplicado!/i)).toBeInTheDocument();
                expect(screen.getByText(/\(Cópia\)/i)).toBeInTheDocument();
            });
        });

        it('deve exportar template como JSON', async () => {
            // Mock do createElement e click para download
            const mockLink = {
                click: vi.fn(),
                href: '',
                download: '',
                style: { display: '' }
            };

            vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
            vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
            vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const exportButton = screen.getByText(/Exportar/i);
                fireEvent.click(exportButton);
            });

            expect(mockLink.click).toHaveBeenCalled();
        });

        it('deve abrir preview em nova aba', async () => {
            const mockOpen = vi.fn();
            window.open = mockOpen;

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const previewButton = screen.getByText(/Preview/i);
                fireEvent.click(previewButton);
            });

            expect(mockOpen).toHaveBeenCalledWith(
                expect.stringContaining('/quiz-estilo?step=1&preview=true'),
                '_blank'
            );
        });

        it('deve excluir template após confirmação', async () => {
            const mockConfirm = vi.fn(() => true);
            window.confirm = mockConfirm;

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const deleteButton = screen.getByText(/Excluir Template/i);
                fireEvent.click(deleteButton);
            });

            expect(mockConfirm).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.getByText(/Template excluído!/i)).toBeInTheDocument();
            });
        });

        it('não deve excluir template se cancelar confirmação', async () => {
            const mockConfirm = vi.fn(() => false);
            window.confirm = mockConfirm;

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const deleteButton = screen.getByText(/Excluir Template/i);
                fireEvent.click(deleteButton);
            });

            expect(mockConfirm).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText(/Template excluído!/i)).not.toBeInTheDocument();
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });
        });
    });

    describe('Importação de Templates', () => {
        it('deve permitir importar arquivo JSON', async () => {
            render(<EditorJsonTemplatesPage />);

            const importButton = screen.getByText(/Importar Template/i);

            const file = new File(
                [JSON.stringify({
                    templateVersion: '1.0.0',
                    metadata: {
                        id: 'imported-template',
                        name: 'Template Importado',
                        description: 'Template vindo de arquivo',
                        category: 'quiz-imported',
                        tags: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    layout: {
                        containerWidth: '100%',
                        spacing: 'normal',
                        backgroundColor: '#ffffff',
                        responsive: true
                    },
                    validation: {},
                    analytics: {
                        events: [],
                        trackingId: '',
                        utmParams: false,
                        customEvents: []
                    },
                    blocks: []
                })],
                'template.json',
                { type: 'application/json' }
            );

            const input = importButton.parentElement?.querySelector('input[type="file"]');
            if (input) {
                fireEvent.change(input, { target: { files: [file] } });
            }

            await waitFor(() => {
                expect(screen.getByText(/Template importado com sucesso!/i)).toBeInTheDocument();
            });
        });
    });

    describe('Atualização de Templates', () => {
        it('deve recarregar templates ao clicar em refresh', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const refreshButton = screen.getByRole('button', { name: /atualizar lista/i });
            fireEvent.click(refreshButton);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });
        });
    });

    describe('Estados de UI', () => {
        it('deve mostrar indicador de salvamento durante save', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            const saveButton = screen.getByText(/Salvar/i);
            fireEvent.click(saveButton);

            // Durante o salvamento, o botão deve estar desabilitado
            expect(saveButton).toBeDisabled();
        });

        it('deve limpar mensagens de sucesso após alguns segundos', async () => {
            vi.useFakeTimers();

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                const saveButton = screen.getByText(/Salvar/i);
                fireEvent.click(saveButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });

            // Avançar 4 segundos
            vi.advanceTimersByTime(4000);

            await waitFor(() => {
                expect(screen.queryByText(/Template salvo com sucesso!/i)).not.toBeInTheDocument();
            });

            vi.useRealTimers();
        });
    });

    describe('Acessibilidade', () => {
        it('deve ter labels acessíveis nos campos de formulário', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            const firstTemplate = screen.getByText(/Step step-01/i);
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                const editButton = screen.getByText(/Editar/i);
                fireEvent.click(editButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Nome do Template/i)).toBeInTheDocument();
                expect(screen.getByText(/Categoria/i)).toBeInTheDocument();
                expect(screen.getByText(/Descrição/i)).toBeInTheDocument();
            });
        });

        it('deve ter botões com textos descritivos', () => {
            render(<EditorJsonTemplatesPage />);

            expect(screen.getByText(/Importar Template/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /atualizar lista/i })).toBeInTheDocument();
        });
    });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorJsonTemplatesPage from '../index';
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';

// Mock do EditorLayout
vi.mock('@/components/layout/EditorLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="editor-layout">{children}</div>
}));

describe('EditorJsonTemplatesPage - Testes de Integração', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Mock de fetch para retornar templates reais
        global.fetch = vi.fn();
    });

    describe('Fluxo Completo de Edição', () => {
        it('deve completar ciclo completo: selecionar -> editar -> salvar -> visualizar', async () => {
            const { container } = render(<EditorJsonTemplatesPage />);

            // 1. Aguardar carregamento dos templates
            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            }, { timeout: 3000 });

            // 2. Selecionar um template
            const templateCard = screen.getByText(/Step step-01/i);
            fireEvent.click(templateCard);

            await waitFor(() => {
                expect(screen.getByText(/Nome do Template/i)).toBeInTheDocument();
            });

            // 3. Entrar em modo de edição
            const editButton = screen.getByText(/Editar/i);
            fireEvent.click(editButton);

            await waitFor(() => {
                expect(screen.getByText(/Salvar/i)).toBeInTheDocument();
            });

            // 4. Editar campos
            const nameInput = screen.getByDisplayValue(/Step step-01/i);
            fireEvent.change(nameInput, { target: { value: 'Template Editado Completo' } });

            const descriptionTextarea = screen.getByText(/Template para/i).closest('textarea');
            if (descriptionTextarea) {
                fireEvent.change(descriptionTextarea, {
                    target: { value: 'Descrição editada no teste de integração' }
                });
            }

            // 5. Salvar alterações
            const saveButton = screen.getByText(/Salvar/i);
            fireEvent.click(saveButton);

            // 6. Verificar mensagem de sucesso
            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            }, { timeout: 3000 });

            // 7. Verificar que voltou ao modo visualização
            await waitFor(() => {
                expect(screen.getByText(/Editar/i)).toBeInTheDocument();
                expect(screen.queryByText(/Salvar/i)).not.toBeInTheDocument();
            });

            // 8. Verificar que o template atualizado aparece na lista
            expect(screen.getByText(/Template Editado Completo/i)).toBeInTheDocument();
        });

        it('deve permitir editar JSON diretamente e validar', async () => {
            render(<EditorJsonTemplatesPage />);

            // Selecionar template
            await waitFor(() => {
                expect(screen.getByText(/Step step-02/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-02/i));

            // Entrar em modo de edição
            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            // Encontrar editor JSON (textarea grande)
            await waitFor(() => {
                const jsonTextarea = screen.getAllByRole('textbox').find(
                    (element) => element.getAttribute('rows') === '20'
                );
                expect(jsonTextarea).toBeInTheDocument();

                if (jsonTextarea) {
                    const currentValue = (jsonTextarea as HTMLTextAreaElement).value;
                    const parsed = JSON.parse(currentValue);

                    // Modificar JSON
                    parsed.metadata.name = 'Template Editado via JSON';

                    fireEvent.change(jsonTextarea, {
                        target: { value: JSON.stringify(parsed, null, 2) }
                    });
                }
            });

            // Salvar
            fireEvent.click(screen.getByText(/Salvar/i));

            // Verificar sucesso
            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });
        });
    });

    describe('Fluxo de Duplicação e Edição', () => {
        it('deve duplicar template e permitir edição imediata', async () => {
            render(<EditorJsonTemplatesPage />);

            // Selecionar template
            await waitFor(() => {
                expect(screen.getByText(/Step step-03/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-03/i));

            // Duplicar
            await waitFor(() => {
                fireEvent.click(screen.getByText(/Duplicar/i));
            });

            await waitFor(() => {
                expect(screen.getByText(/Template duplicado!/i)).toBeInTheDocument();
            });

            // Verificar que a cópia aparece na lista
            await waitFor(() => {
                expect(screen.getByText(/\(Cópia\)/i)).toBeInTheDocument();
            });

            // Selecionar a cópia
            const copiedTemplate = screen.getByText(/\(Cópia\)/i);
            fireEvent.click(copiedTemplate.closest('div[role="button"]') || copiedTemplate);

            // Editar a cópia
            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            const nameInput = screen.getByDisplayValue(/\(Cópia\)/i);
            fireEvent.change(nameInput, { target: { value: 'Template Duplicado Editado' } });

            fireEvent.click(screen.getByText(/Salvar/i));

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });

            // Verificar que ambos templates existem
            expect(screen.getByText(/Step step-03/i)).toBeInTheDocument();
            expect(screen.getByText(/Template Duplicado Editado/i)).toBeInTheDocument();
        });
    });

    describe('Fluxo de Exportação e Importação', () => {
        it('deve exportar e depois importar o mesmo template', async () => {
            let exportedData: string = '';

            // Mock do Blob e URL
            const mockBlob = vi.fn((content) => {
                exportedData = content[0];
                return new Blob(content, { type: 'application/json' });
            });
            global.Blob = mockBlob as any;

            const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
            global.URL.createObjectURL = mockCreateObjectURL;

            // Mock do createElement para capturar o download
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

            // Selecionar e exportar template
            await waitFor(() => {
                expect(screen.getByText(/Step step-04/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-04/i));

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Exportar/i));
            });

            expect(mockLink.click).toHaveBeenCalled();
            expect(exportedData).toBeTruthy();

            // Criar arquivo do dado exportado
            const file = new File([exportedData], 'template.json', {
                type: 'application/json'
            });

            // Importar o arquivo
            const importButton = screen.getByText(/Importar Template/i);
            const input = importButton.parentElement?.querySelector('input[type="file"]');

            if (input) {
                fireEvent.change(input, { target: { files: [file] } });
            }

            await waitFor(() => {
                expect(screen.getByText(/Template importado com sucesso!/i)).toBeInTheDocument();
            }, { timeout: 3000 });

            // Verificar que o template importado está disponível
            const importedTemplate = JSON.parse(exportedData);
            expect(screen.getByText(importedTemplate.metadata.name)).toBeInTheDocument();
        });
    });

    describe('Fluxo de Busca e Edição Múltipla', () => {
        it('deve buscar templates de uma categoria e editar vários', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-01/i)).toBeInTheDocument();
            });

            // Buscar por categoria 'question'
            const searchInput = screen.getByPlaceholderText(/Buscar por nome/i);
            fireEvent.change(searchInput, { target: { value: 'question' } });

            await waitFor(() => {
                const questionTemplates = screen.getAllByText(/quiz-question/i);
                expect(questionTemplates.length).toBeGreaterThan(0);
            });

            // Pegar primeiro template da busca
            const templates = screen.getAllByText(/Step step-/i);
            const firstTemplate = templates[0];

            // Editar primeiro
            fireEvent.click(firstTemplate);

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            const nameInput = screen.getByDisplayValue(/Step step-/i);
            fireEvent.change(nameInput, { target: { value: 'Question Template 1' } });

            fireEvent.click(screen.getByText(/Salvar/i));

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });

            // Limpar busca e editar outro
            fireEvent.change(searchInput, { target: { value: '' } });

            await waitFor(() => {
                const allTemplates = screen.getAllByText(/Step step-/i);
                expect(allTemplates.length).toBeGreaterThan(5);
            });
        });
    });

    describe('Fluxo de Validação e Correção de Erros', () => {
        it('deve detectar erro, corrigir e salvar com sucesso', async () => {
            // Mock do QuizStepAdapter para primeiro falhar, depois passar
            let callCount = 0;
            const mockFromJSON = vi.fn((json) => {
                callCount++;
                if (callCount === 1) {
                    throw new Error('Erro de validação: campo obrigatório ausente');
                }
                return json;
            });

            vi.spyOn(QuizStepAdapter, 'fromJSON').mockImplementation(mockFromJSON);

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-05/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-05/i));

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            // Primeira tentativa de salvar (deve falhar)
            fireEvent.click(screen.getByText(/Salvar/i));

            await waitFor(() => {
                expect(screen.getByText(/Erro ao validar template/i)).toBeInTheDocument();
            });

            // Fazer uma edição (correção simulada)
            const nameInput = screen.getByDisplayValue(/Step step-05/i);
            fireEvent.change(nameInput, { target: { value: 'Template Corrigido' } });

            // Segunda tentativa (deve passar)
            fireEvent.click(screen.getByText(/Salvar/i));

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });

            vi.restoreAllMocks();
        });
    });

    describe('Fluxo de Preview', () => {
        it('deve abrir preview com stepNumber correto', async () => {
            const mockOpen = vi.fn();
            window.open = mockOpen;

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-07/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-07/i));

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Preview/i));
            });

            expect(mockOpen).toHaveBeenCalledWith(
                '/quiz-estilo?step=7&preview=true',
                '_blank'
            );
        });

        it('deve permitir preview após edição sem salvar', async () => {
            const mockOpen = vi.fn();
            window.open = mockOpen;

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-08/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-08/i));

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            // Fazer edição mas não salvar
            const nameInput = screen.getByDisplayValue(/Step step-08/i);
            fireEvent.change(nameInput, { target: { value: 'Template Modificado' } });

            // Tentar preview (deve permitir)
            const previewButton = screen.getByText(/Preview/i);
            expect(previewButton).not.toBeDisabled();
        });
    });

    describe('Persistência no localStorage', () => {
        it('deve manter templates editados após refresh simulado', async () => {
            const { unmount, rerender } = render(<EditorJsonTemplatesPage />);

            // Editar e salvar
            await waitFor(() => {
                expect(screen.getByText(/Step step-09/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-09/i));

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            const nameInput = screen.getByDisplayValue(/Step step-09/i);
            fireEvent.change(nameInput, { target: { value: 'Template Persistido' } });

            fireEvent.click(screen.getByText(/Salvar/i));

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });

            // Verificar localStorage
            const savedData = localStorage.getItem('json-template-quiz-step-09');
            expect(savedData).toBeTruthy();

            if (savedData) {
                const parsed = JSON.parse(savedData);
                expect(parsed.metadata.name).toBe('Template Persistido');
            }

            // Simular refresh (remount)
            unmount();
            rerender(<EditorJsonTemplatesPage />);

            // Verificar que o template editado ainda está lá
            await waitFor(() => {
                expect(screen.getByText(/Template Persistido/i)).toBeInTheDocument();
            });
        });
    });

    describe('Fluxo de Exclusão', () => {
        it('deve excluir template e remover da lista', async () => {
            const mockConfirm = vi.fn(() => true);
            window.confirm = mockConfirm;

            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-10/i)).toBeInTheDocument();
            });

            const initialTemplates = screen.getAllByText(/Step step-/i);
            const initialCount = initialTemplates.length;

            fireEvent.click(screen.getByText(/Step step-10/i));

            await waitFor(() => {
                const deleteButton = screen.getByText(/Excluir Template/i);
                fireEvent.click(deleteButton);
            });

            expect(mockConfirm).toHaveBeenCalledWith(
                expect.stringContaining('Tem certeza')
            );

            await waitFor(() => {
                expect(screen.getByText(/Template excluído!/i)).toBeInTheDocument();
            });

            // Verificar que o template foi removido
            await waitFor(() => {
                const remainingTemplates = screen.queryAllByText(/Step step-/i);
                expect(remainingTemplates.length).toBe(initialCount - 1);
            });

            expect(screen.queryByText(/Step step-10/i)).not.toBeInTheDocument();
        });
    });

    describe('Fluxo com Múltiplos Templates', () => {
        it('deve gerenciar múltiplos templates simultaneamente', async () => {
            render(<EditorJsonTemplatesPage />);

            await waitFor(() => {
                expect(screen.getByText(/Step step-11/i)).toBeInTheDocument();
            });

            // Editar primeiro template
            fireEvent.click(screen.getByText(/Step step-11/i));

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            const input1 = screen.getByDisplayValue(/Step step-11/i);
            fireEvent.change(input1, { target: { value: 'Template A' } });
            fireEvent.click(screen.getByText(/Salvar/i));

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });

            // Editar segundo template
            await waitFor(() => {
                expect(screen.getByText(/Step step-12/i)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/Step step-12/i));

            await waitFor(() => {
                fireEvent.click(screen.getByText(/Editar/i));
            });

            const input2 = screen.getByDisplayValue(/Step step-12/i);
            fireEvent.change(input2, { target: { value: 'Template B' } });
            fireEvent.click(screen.getByText(/Salvar/i));

            await waitFor(() => {
                expect(screen.getByText(/Template salvo com sucesso!/i)).toBeInTheDocument();
            });

            // Verificar ambos na lista
            expect(screen.getByText(/Template A/i)).toBeInTheDocument();
            expect(screen.getByText(/Template B/i)).toBeInTheDocument();
        });
    });
});

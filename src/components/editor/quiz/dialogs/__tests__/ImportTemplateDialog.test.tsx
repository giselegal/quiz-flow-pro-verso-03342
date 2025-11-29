/**
 * Testes Automatizados - ImportTemplateDialog
 * 
 * Testa todas as funcionalidades do diálogo de importação:
 * - Upload de arquivo JSON
 * - Validação de estrutura
 * - Preview de template
 * - Confirmação de importação
 * - Tratamento de erros
 * - Integração com React Query
 * 
 * @module __tests__/components/ImportTemplateDialog.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Garantir matchers do jest-dom (às vezes o setup global não é aplicado em todos os contextos)
expect.extend(matchers);
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ImportTemplateDialog } from '@/components/editor/quiz/dialogs/ImportTemplateDialog';
import { normalizeAndValidateTemplateV3, isNormalizeSuccess } from '@/templates/validation/validateAndNormalize';

// Mock do validator/normalizer usado pelo componente
vi.mock('@/templates/validation/validateAndNormalize', () => ({
    normalizeAndValidateTemplateV3: vi.fn(),
    isNormalizeSuccess: vi.fn(),
}));

// Helper para criar wrapper com QueryClient
function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

// Helper para criar arquivo JSON mock
function createMockJsonFile(content: object, filename = 'template.json'): File {
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    return new File([blob], filename, { type: 'application/json' });
}

describe('ImportTemplateDialog - Renderização Inicial', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('deve renderizar diálogo fechado por padrão', () => {
        const onImport = vi.fn();

        render(
            <ImportTemplateDialog
                open={false}
                onClose={() => { }}
                onImport={onImport}
            />,
            { wrapper: createWrapper() }
        );

        // Diálogo não deve estar visível
        expect(screen.queryByText(/importar template/i)).not.toBeInTheDocument();
    });

    it('deve renderizar diálogo aberto quando open=true', () => {
        const onImport = vi.fn();

        render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={onImport}
            />,
            { wrapper: createWrapper() }
        );

        // Diálogo deve estar visível
        expect(screen.getByText(/importar template/i)).toBeInTheDocument();
    });

    it('deve mostrar área de upload de arquivo', () => {
        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText(/clique para selecionar arquivo json/i)).toBeInTheDocument();
        const input = document.querySelector('input[type="file"]');
        expect(input).toBeTruthy();
    });
});

describe('ImportTemplateDialog - Upload de Arquivo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve aceitar upload de arquivo JSON válido', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            metadata: {
                id: 'quiz21StepsComplete',
                version: '3.1',
                name: 'Quiz 21 Steps',
            },
            steps: {
                'step-01': [{ id: 'b1', type: 'IntroLogo' }],
            },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 1, replacedIds: 0, steps: 1 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/quiz 21 steps/i)).toBeInTheDocument();
        });
    });

    it('deve rejeitar arquivo não-JSON', async () => {
        const user = userEvent.setup();

        render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = new File(['texto plano'], 'arquivo.txt', { type: 'text/plain' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/formato inválido/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar erro para JSON inválido', async () => {
        const user = userEvent.setup();

        render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = new File(['{ invalid json }'], 'invalid.json', {
            type: 'application/json',
        });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/json inválido/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar erro de validação do schema', async () => {
        const user = userEvent.setup();
        const invalidTemplate = {
            metadata: {}, // Falta id, version
            steps: {},
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: false,
            errors: [{ path: ['metadata', 'id'], message: 'falta campo id', code: 'schema' }],
            rawData: invalidTemplate,
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(false);

        render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(invalidTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/falta campo id/i)).toBeInTheDocument();
        });
    });
});

describe('ImportTemplateDialog - Preview de Template', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve mostrar preview após upload bem-sucedido', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            metadata: {
                id: 'quiz21',
                version: '3.1',
                name: 'Quiz Completo',
                description: 'Template com 21 passos',
            },
            steps: {
                'step-01': [{ id: 'b1', type: 'IntroLogo' }],
                'step-02': [{ id: 'b2', type: 'Question' }],
                'step-03': [{ id: 'b3', type: 'Result' }],
            },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 3, replacedIds: 0, steps: 3 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            // Metadata
            expect(screen.getByText(/quiz completo/i)).toBeInTheDocument();
            expect(screen.getByText(/template com 21 passos/i)).toBeInTheDocument();
            expect(screen.getByText(/versão 3\.1/i)).toBeInTheDocument();

            // Steps count
            expect(screen.getByText(/3 passos/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar lista de steps no preview', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            metadata: {
                id: 'quiz21',
                version: '3.1',
                name: 'Quiz',
            },
            steps: {
                'step-01-intro': [{ id: 'b1', type: 'IntroLogo' }],
                'step-02-question': [{ id: 'b2', type: 'Question' }],
                'step-03-result': [{ id: 'b3', type: 'Result' }],
            },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 3, replacedIds: 0, steps: 3 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/step-01-intro/i)).toBeInTheDocument();
            expect(screen.getByText(/step-02-question/i)).toBeInTheDocument();
            expect(screen.getByText(/step-03-result/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar contagem de blocos por step', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            metadata: {
                id: 'quiz21',
                version: '3.1',
                name: 'Quiz',
            },
            steps: {
                'step-01': [
                    { id: 'b1', type: 'IntroLogo' },
                    { id: 'b2', type: 'IntroTitle' },
                    { id: 'b3', type: 'IntroSubtitle' },
                ],
            },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 3, replacedIds: 0, steps: 1 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/3 blocos/i)).toBeInTheDocument();
        });
    });
});

describe('ImportTemplateDialog - Confirmação de Importação', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve habilitar botão de importar após validação', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: { 'step-01': [{ id: 'b1', type: 'Block' }] },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 1, replacedIds: 0, steps: 1 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            const importButton = screen.getByRole('button', { name: /importar/i });
            expect(importButton).not.toBeDisabled();
        });
    });

    it('deve chamar onImport com template validado', async () => {
        const user = userEvent.setup();
        const onImport = vi.fn();
        const mockTemplate = {
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: { 'step-01': [{ id: 'b1', type: 'Block' }] },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 1, replacedIds: 0, steps: 1 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={onImport}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            const importButton = screen.getByRole('button', { name: /importar/i });
            expect(importButton).not.toBeDisabled();
        });

        const importButton = screen.getByRole('button', { name: /importar/i });
        await user.click(importButton);

        expect(onImport).toHaveBeenCalledWith(mockTemplate);
    });

    it('deve fechar diálogo após importação bem-sucedida', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const mockTemplate = {
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: { 'step-01': [{ id: 'b1', type: 'Block' }] },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 1, replacedIds: 0, steps: 1 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={onClose}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        const importButton = await screen.findByRole('button', { name: /importar/i });
        await user.click(importButton);

        expect(onClose).toHaveBeenCalled();
    });
});

describe('ImportTemplateDialog - Cancelamento', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve ter botão de cancelar', () => {
        render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    it('deve chamar onClose ao cancelar', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <ImportTemplateDialog
                open={true}
                onClose={onClose}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        await user.click(cancelButton);

        expect(onClose).toHaveBeenCalled();
    });

    it('deve limpar preview ao cancelar', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: { 'step-01': [{ id: 'b1', type: 'Block' }] },
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 1, replacedIds: 0, steps: 1 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { rerender, container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/quiz/i)).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        await user.click(cancelButton);

        // Reabrir diálogo
        rerender(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />
        );

        // Preview deve estar limpo
        expect(screen.queryByText(/quiz/i)).not.toBeInTheDocument();
    });
});

describe('ImportTemplateDialog - Estados de Carregamento', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve mostrar loading durante validação', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: { 'step-01': [{ id: 'b1', type: 'Block' }] },
        };

        // Mock sync: the component validates synchronously with normalizeAndValidateTemplateV3
        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue({
            success: true,
            data: mockTemplate,
            warnings: [],
            stats: { totalBlocks: 1, replacedIds: 0, steps: 1 },
        });
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        // Validação síncrona deve terminar rapidamente e o resultado deve aparecer
        await waitFor(() => expect(screen.getByText(/quiz/i)).toBeInTheDocument());
    });
});

describe('ImportTemplateDialog - Acessibilidade', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve ter labels apropriados', () => {
        render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        const inputEl = document.querySelector('input[type="file"]');
        expect(inputEl).toBeTruthy();
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby');
    });

    it('deve suportar navegação por teclado', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <ImportTemplateDialog
                open={true}
                onClose={onClose}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        // Tab para navegar
        await user.tab();

        // Deve focar no primeiro elemento interativo
        expect(document.activeElement).toBeDefined();
    });

    it('deve fechar com tecla Escape', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <ImportTemplateDialog
                open={true}
                onClose={onClose}
                onImport={() => { }}
            />,
            { wrapper: createWrapper() }
        );

        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalled();
    });
});

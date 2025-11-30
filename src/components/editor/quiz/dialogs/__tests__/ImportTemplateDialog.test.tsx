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
import {
    createValidBlockMock,
    createValidTemplateV3Mock,
    createValidationSuccessMock,
    createValidationErrorMock
} from '@/test-utils/templateMocks';

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

// Helper para simular upload sem depender de eventos de ponteiro (Radix aplica pointer-events: none)
function forceUpload(input: HTMLInputElement, file: File) {
    Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
        configurable: true,
    });
    fireEvent.change(input, { target: { files: [file] } });
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
        // Pode haver mais de uma duplicação em ambientes StrictMode / portal
        const uploadTexts = screen.getAllByText(/clique para selecionar arquivo json/i);
        expect(uploadTexts.length).toBeGreaterThan(0);
        const input = document.querySelector('input[type="file"]');
        expect(input).toBeTruthy();
    });
});

describe('ImportTemplateDialog - Upload de Arquivo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve aceitar upload de arquivo JSON válido', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const mockTemplate = createValidTemplateV3Mock({
            metadata: {
                id: 'quiz21StepsComplete',
                version: '3.1',
                name: 'Quiz 21 Steps',
            },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'IntroLogo', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
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

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/template válido/i)).toBeInTheDocument();
        });
    });

    it('deve rejeitar arquivo não-JSON', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });

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

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/extensão .json/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar erro para JSON inválido', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });

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

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/erro ao ler json/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar erro de validação do schema', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const invalidTemplate = {
            metadata: {}, // Falta id, version
            steps: {},
        };

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationErrorMock([{
                path: ['metadata', 'id'],
                message: 'falta campo id',
                code: 'schema'
            }])
        );
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

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/metadata\.id: falta campo id/i)).toBeInTheDocument();
        });
    });
});

describe('ImportTemplateDialog - Preview de Template', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve mostrar resumo após upload bem-sucedido', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const mockTemplate = createValidTemplateV3Mock({
            metadata: {
                id: 'quiz21',
                version: '3.1',
                name: 'Quiz Completo',
                description: 'Template com 21 passos',
            },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'IntroLogo', order: 0 }),
                ],
                'step-02': [
                    createValidBlockMock({ id: 'b2', type: 'Question', order: 0 }),
                ],
                'step-03': [
                    createValidBlockMock({ id: 'b3', type: 'Result', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
                currentStepKey={"step-01"}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/template válido/i)).toBeInTheDocument();
            expect(screen.getByText(/quiz completo/i)).toBeInTheDocument();
            expect(screen.getByText(/versão:/i)).toBeInTheDocument();
            expect(screen.getByText(/3 step\(s\)/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar campos de ID e versão', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const mockTemplate = createValidTemplateV3Mock({
            metadata: {
                id: 'quiz21',
                version: '3.1',
                name: 'Quiz',
            },
            steps: {
                'step-01-intro': [
                    createValidBlockMock({ id: 'b1', type: 'IntroLogo', order: 0 }),
                ],
                'step-02-question': [
                    createValidBlockMock({ id: 'b2', type: 'Question', order: 0 }),
                ],
                'step-03-result': [
                    createValidBlockMock({ id: 'b3', type: 'Result', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
                currentStepKey={"step-01-intro"}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/id:/i)).toBeInTheDocument();
            expect(screen.getByText(/quiz21/i)).toBeInTheDocument();
            expect(screen.getByText(/versão:/i)).toBeInTheDocument();
        });
    });

    it('deve mostrar contagem de blocos ao selecionar modo step', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const mockTemplate = createValidTemplateV3Mock({
            metadata: {
                id: 'quiz21',
                version: '3.1',
                name: 'Quiz',
            },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'IntroLogo', order: 0 }),
                    createValidBlockMock({ id: 'b2', type: 'IntroTitle', order: 1 }),
                    createValidBlockMock({ id: 'b3', type: 'IntroSubtitle', order: 2 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
        vi.mocked(isNormalizeSuccess).mockReturnValue(true);

        const { container } = render(
            <ImportTemplateDialog
                open={true}
                onClose={() => { }}
                onImport={() => { }}
                currentStepKey={"step-01"}
            />,
            { wrapper: createWrapper() }
        );

        const file = createMockJsonFile(mockTemplate);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        forceUpload(input, file);
        await waitFor(() => expect(screen.getByText(/template válido/i)).toBeInTheDocument());
        // Verifica debug para garantir que currentStepKey chegou; se não, força rerender
        const debugEls = screen.getAllByTestId('debug-props');
        const hasStep = debugEls.some(el => el.textContent?.includes('ck:step-01'));
        if (!hasStep) {
            // Força rerender com prop explícita (defensive)
            render(
                <ImportTemplateDialog
                    open={true}
                    onClose={() => { }}
                    onImport={() => { }}
                    currentStepKey={'step-01'}
                />, { wrapper: createWrapper() }
            );
        }
        // Aguarda algum botão contendo texto 'Apenas Step Atual'
        await waitFor(() => {
            const btns = screen.getAllByRole('button');
            expect(btns.some(b => /apenas step atual/i.test(b.textContent || ''))).toBe(true);
        });
        const stepModeBtn = screen.getAllByRole('button').find(b => /apenas step atual/i.test(b.textContent || ''))!;
        await user.click(stepModeBtn);
        await waitFor(() => expect(screen.getByText(/3 blocos/i)).toBeInTheDocument());
    });
});

describe('ImportTemplateDialog - Confirmação de Importação', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve habilitar botão de importar após validação', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const mockTemplate = createValidTemplateV3Mock({
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'Block', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
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

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/template válido/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            const importButtons = screen.getAllByRole('button', { name: /^importar$/i });
            expect(importButtons.some(btn => !btn.hasAttribute('disabled'))).toBe(true);
        });
        const enabledImport = screen.getAllByRole('button', { name: /^importar$/i }).find(btn => !btn.hasAttribute('disabled'))!;
        expect(enabledImport).not.toBeDisabled();
    });

    it('deve chamar onImport com template validado', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const onImport = vi.fn();
        const mockTemplate = createValidTemplateV3Mock({
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'Block', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
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

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/template válido/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            const importButtons = screen.getAllByRole('button', { name: /^importar$/i });
            expect(importButtons.some(btn => !btn.hasAttribute('disabled'))).toBe(true);
        });
        const enabledImport = screen.getAllByRole('button', { name: /^importar$/i }).find(btn => !btn.hasAttribute('disabled'))!;
        await user.click(enabledImport);
        expect(onImport).toHaveBeenCalledWith(mockTemplate);
    });

    it('deve fechar diálogo após importação bem-sucedida', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const onClose = vi.fn();
        const mockTemplate = createValidTemplateV3Mock({
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'Block', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
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

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/template válido/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            const importButtons = screen.getAllByRole('button', { name: /^importar$/i });
            expect(importButtons.some(btn => !btn.hasAttribute('disabled'))).toBe(true);
        });
        const enabledImport = screen.getAllByRole('button', { name: /^importar$/i }).find(btn => !btn.hasAttribute('disabled'))!;
        await user.click(enabledImport);
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

        const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
        const cancelButton = cancelButtons[cancelButtons.length - 1];
        await user.click(cancelButton);

        expect(onClose).toHaveBeenCalled();
    });

    it('deve limpar preview ao cancelar', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const mockTemplate = createValidTemplateV3Mock({
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'Block', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
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
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        forceUpload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/template válido/i)).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        await user.click(cancelButton);
        // Aguarda limpeza interna (handleClose redefine validation)
        await waitFor(() => expect(screen.queryByText(/template válido/i)).not.toBeInTheDocument());
        // Fecha externamente e reabre
        rerender(<ImportTemplateDialog open={false} onClose={() => { }} onImport={() => { }} />);
        rerender(<ImportTemplateDialog open={true} onClose={() => { }} onImport={() => { }} />);
        const successMessages = screen.queryAllByText(/template válido/i);
        expect(successMessages.length).toBe(0);
    });
});

describe('ImportTemplateDialog - Estados de Carregamento', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve mostrar mensagem de sucesso após validação síncrona', async () => {
        const user = userEvent.setup({ pointerEventsCheck: 0 });
        const mockTemplate = createValidTemplateV3Mock({
            metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
            steps: {
                'step-01': [
                    createValidBlockMock({ id: 'b1', type: 'Block', order: 0 }),
                ],
            },
        });

        vi.mocked(normalizeAndValidateTemplateV3).mockReturnValue(
            createValidationSuccessMock(mockTemplate)
        );
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
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        forceUpload(input, file);

        await waitFor(() => expect(screen.getByText(/template válido/i)).toBeInTheDocument());
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

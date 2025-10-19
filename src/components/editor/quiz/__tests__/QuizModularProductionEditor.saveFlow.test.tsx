/* @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizModularProductionEditor } from '@/components/editor/quiz/QuizModularProductionEditor';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import * as contexts from '@/contexts';

vi.mock('@/services/QuizEditorBridge');

// Mock de CRUD mínimo
const mockCRUD: any = {
    saveFunnel: vi.fn(async (funnel: any) => ({ id: 'funnel_123', status: 'ok' })),
    getActiveFunnel: vi.fn(() => ({ id: 'funnel_123', name: 'Teste' })),
};

describe('QuizModularProductionEditor - fluxo de salvar (CRUD e fallback)', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        // Mock do loadFunnelForEdit para inicializar o editor
        vi.mocked(quizEditorBridge.loadFunnelForEdit).mockResolvedValue({
            id: 'production',
            name: 'Quiz Estilo Pessoal',
            slug: 'quiz-estilo',
            steps: [
                { id: 'step-01', order: 1, type: 'intro', blocks: [] },
                { id: 'step-02', order: 2, type: 'question', blocks: [] },
            ],
            isPublished: true,
            version: 1,
        } as any);
        vi.mocked(quizEditorBridge.saveDraft).mockResolvedValue('draft-1');
        vi.mocked(quizEditorBridge.publishToProduction).mockResolvedValue();
    });

    it('usa CRUD saveFunnel quando provider está disponível', async () => {
        const user = userEvent.setup();
        // Força o hook opcional a retornar nosso mock CRUD
        const spy = vi.spyOn(contexts, 'useUnifiedCRUDOptional').mockReturnValue(mockCRUD as any);
        render(<QuizModularProductionEditor />);

        await waitFor(() => {
            expect(screen.getByText('Etapas')).toBeInTheDocument();
        });

        const salvar = screen.getAllByText('Salvar')[0].closest('button');
        expect(salvar).toBeInTheDocument();
        await user.click(salvar!);

        await waitFor(() => {
            expect(mockCRUD.saveFunnel).toHaveBeenCalled();
        });
        spy.mockRestore();
    });

    it('faz fallback para bridge.saveDraft quando CRUD não existe', async () => {
        const user = userEvent.setup();
        // Render sem provider CRUD
        render(<QuizModularProductionEditor />);

        await waitFor(() => {
            expect(screen.getByText('Etapas')).toBeInTheDocument();
        });

        const salvar = screen.getAllByText('Salvar')[0].closest('button');
        expect(salvar).toBeInTheDocument();
        await user.click(salvar!);

        await waitFor(() => {
            expect(quizEditorBridge.saveDraft).toHaveBeenCalled();
        });
    });
});

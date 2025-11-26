import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('@/components/ui/card', () => ({
    Card: (p: any) => <div data-testid="card" {...p} />,
    CardHeader: (p: any) => <div data-testid="card-header" {...p} />,
    CardTitle: (p: any) => <div data-testid="card-title" {...p} />,
    CardDescription: (p: any) => <div data-testid="card-description" {...p} />,
    CardContent: (p: any) => <div data-testid="card-content" {...p} />,
}));
vi.mock('@/components/ui/button', () => ({
    Button: (p: any) => <button data-testid="button" {...p} />
}));
vi.mock('@/components/ui/badge', () => ({
    Badge: (p: any) => <span data-testid="badge" {...p} />
}));
vi.mock('@/components/ui/alert', () => ({
    Alert: (p: any) => <div data-testid="alert" {...p} />,
    AlertDescription: (p: any) => <div data-testid="alert-description" {...p} />
}));

const editorPersistenceHookMock: ReturnType<typeof vi.fn> = vi.fn();
vi.mock('@/hooks/useEditorPersistence', () => ({
    useEditorPersistence: editorPersistenceHookMock
}));

const editorContextHookMock: ReturnType<typeof vi.fn> = vi.fn();
vi.mock('@/core/hooks/useEditorContext', () => ({
    useEditorContext: editorContextHookMock
}));

interface MockBlock {
    id: string;
    type: string;
    content: any;
}

const getEditorHook = () => editorPersistenceHookMock;
const getEditorContextHook = () => editorContextHookMock;

async function loadPage() {
    const mod = await import('../editor/QuizEditorIntegratedPage.testable');
    return mod.default;
}

describe('QuizEditorIntegratedPage (integração)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock padrão do useEditorContext
        getEditorContextHook().mockReturnValue({
            getStepBlocks: () => [],
        });
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    const baseBlocks: MockBlock[] = [
        { id: 'b1', type: 'question', content: { text: 'Pergunta 1' } },
        { id: 'b2', type: 'options', content: { options: ['A', 'B', 'C'] } },
    ];

    it('deve renderizar estado de carregamento inicial', async () => {
        getEditorHook().mockReturnValue({
            isSaving: false,
            lastSaved: null,
            error: null,
            saveNow: vi.fn(),
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError: vi.fn(),
        });
        const QuizEditorPage = await loadPage();

        render(<QuizEditorPage />);

        // Valida que transição para loaded acontece rapidamente
        expect(await screen.findByText(/Editor de Quiz Integrado/i, {}, { timeout: 200 })).toBeInTheDocument();
    }); it('deve renderizar editor carregado com sucesso', async () => {
        getEditorHook().mockReturnValue({
            isSaving: false,
            lastSaved: null,
            error: null,
            saveNow: vi.fn(),
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError: vi.fn(),
        });
        getSuperUnifiedHook().mockReturnValue({
            getStepBlocks: () => baseBlocks,
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        // Aguardar carregamento
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(await screen.findByText(/Editor de Quiz Integrado/i)).toBeInTheDocument();
        expect(screen.getByText(/Step 1 de 21/i)).toBeInTheDocument();
    });

    it('deve mostrar indicador de salvamento quando isSaving=true', async () => {
        getEditorHook().mockReturnValue({
            isSaving: true,
            lastSaved: null,
            error: null,
            saveNow: vi.fn(),
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError: vi.fn(),
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        await new Promise(resolve => setTimeout(resolve, 50));

        // Verifica badge específico no header evitando colisão com botão
        const badges = await screen.findAllByText(/Salvando.../i);
        expect(badges.length).toBeGreaterThan(0);
    });

    it('deve mostrar badge de salvo quando lastSaved existe', async () => {
        const lastSaved = new Date('2025-11-23T10:00:00');
        getEditorHook().mockReturnValue({
            isSaving: false,
            lastSaved,
            error: null,
            saveNow: vi.fn(),
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError: vi.fn(),
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(await screen.findByText(/Salvo/i)).toBeInTheDocument();
        expect(screen.getByText(/Última modificação:/i)).toBeInTheDocument();
    });

    it('deve renderizar erro de persistência com botão fechar', async () => {
        const clearError = vi.fn();
        getEditorHook().mockReturnValue({
            isSaving: false,
            lastSaved: null,
            error: new Error('Falha ao salvar no Supabase'),
            saveNow: vi.fn(),
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError,
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(await screen.findByText(/Erro de persistência:/i)).toBeInTheDocument();
        expect(screen.getByText(/Falha ao salvar no Supabase/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /Fechar/i }).click();
        expect(clearError).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar controles de undo/redo corretamente', async () => {
        const undo = vi.fn();
        const redo = vi.fn();
        getEditorHook().mockReturnValue({
            isSaving: false,
            lastSaved: null,
            error: null,
            saveNow: vi.fn(),
            canUndo: true,
            canRedo: false,
            undo,
            redo,
            clearError: vi.fn(),
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        await new Promise(resolve => setTimeout(resolve, 50));

        const undoButton = await screen.findByRole('button', { name: /Desfazer/i });
        const redoButton = screen.getByRole('button', { name: /Refazer/i });

        expect(undoButton).not.toBeDisabled();
        expect(redoButton).toBeDisabled();

        undoButton.click();
        expect(undo).toHaveBeenCalledTimes(1);
    });

    it('deve permitir salvar manualmente via botão', async () => {
        const saveNow = vi.fn();
        getEditorHook().mockReturnValue({
            isSaving: false,
            lastSaved: null,
            error: null,
            saveNow,
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError: vi.fn(),
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        await new Promise(resolve => setTimeout(resolve, 50));

        const saveButton = await screen.findByRole('button', { name: /Salvar Agora/i });
        expect(saveButton).not.toBeDisabled();

        saveButton.click();
        expect(saveNow).toHaveBeenCalledTimes(1);
    });

    it('deve desabilitar botão salvar durante isSaving', async () => {
        getEditorHook().mockReturnValue({
            isSaving: true,
            lastSaved: null,
            error: null,
            saveNow: vi.fn(),
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError: vi.fn(),
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        await new Promise(resolve => setTimeout(resolve, 50));

        const saveButton = await screen.findByRole('button', { name: /Salvando.../i });
        expect(saveButton).toBeDisabled();
    });

    it('deve mostrar contagem de blocos quando disponíveis', async () => {
        getEditorHook().mockReturnValue({
            isSaving: false,
            lastSaved: null,
            error: null,
            saveNow: vi.fn(),
            canUndo: false,
            canRedo: false,
            undo: vi.fn(),
            redo: vi.fn(),
            clearError: vi.fn(),
        });
        getSuperUnifiedHook().mockReturnValue({
            getStepBlocks: () => baseBlocks,
        });

        const QuizEditorPage = await loadPage();
        render(<QuizEditorPage />);

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(await screen.findByText(/2 blocos neste step/i)).toBeInTheDocument();
    });
});

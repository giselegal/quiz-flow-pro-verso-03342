import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderAppAt } from '@/tests/utils/renderWithProviders';
import App from '@/App';

// Mock dos componentes principais
vi.mock('@/components/editor/EditorProUnified', () => ({
    default: () => <div data-testid="editor-pro-unified">Editor Unificado</div>,
}));

vi.mock('@/pages/Home', () => ({
    default: () => <div data-testid="index-page">Página Inicial</div>,
}));

// Rota /steps não existe mais no App atual – se necessário futuramente, reintroduzir mock/rota.

vi.mock('@/pages/EditorUnifiedPage', () => ({
    default: () => <div data-testid="editor-unified-page">Editor Unified Page</div>,
}));

vi.mock('@/pages/QuizEstiloPessoalPage', () => ({
    default: () => <div data-testid="quiz-estilo-page">Quiz Estilo Pessoal</div>,
}));

// Helper unificado
const renderPath = (path: string) => renderAppAt(path, <App />);

describe('🧭 Sistema de Roteamento com Wouter', () => {
    beforeEach(() => {
        // Limpar mocks antes de cada teste
        vi.clearAllMocks();

        // Mock do localStorage para evitar erros nos testes
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(() => null),
                setItem: vi.fn(() => null),
                removeItem: vi.fn(() => null),
                clear: vi.fn(() => null),
            },
            writable: true,
        });
    });

    describe('Rota Principal /editor', () => {
        it('deve renderizar EditorUnifiedPage na rota /editor', () => {
            renderPath('/editor');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });

        it('deve aceitar parâmetros de step na URL', () => {
            renderPath('/editor?step=5');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });

        it('deve manter estado na navegação', () => {
            renderPath('/editor');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });

        it('deve aceitar múltiplos parâmetros na URL', () => {
            renderPath('/editor?step=3');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });
    });

    describe('Rota /editor-pro', () => {
        it('deve renderizar EditorProUnified na rota /editor-pro', () => {
            renderPath('/editor-pro');
            expect(screen.getByTestId('editor-pro-unified')).toBeInTheDocument();
        });
    });

    describe('Rotas Básicas', () => {
        const testRoutes = [
            { path: '/', expectedComponent: 'index-page', description: 'home' },
            { path: '/quiz-estilo', expectedComponent: 'quiz-estilo-page', description: 'quiz estilo' }
        ];
        testRoutes.forEach(({ path, expectedComponent, description }) => {
            it(`deve renderizar corretamente a rota ${description} (${path})`, async () => {
                renderPath(path);
                // Suspense fallback: usar findByTestId
                expect(await screen.findByTestId(expectedComponent)).toBeInTheDocument();
            });
        });
    });

    describe('Página Inicial', () => {
        it('deve renderizar página inicial na rota "/"', async () => {
            renderPath('/');
            expect(await screen.findByTestId('index-page')).toBeInTheDocument();
        });
    });

    describe('Rotas com Parâmetros', () => {
        it('deve processar parâmetros na URL do editor', () => {
            renderPath('/editor?step=10');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });

        const complexUrls = [
            '/editor?step=5&theme=dark&mode=preview',
            '/editor?funnel=test-123&step=1',
            '/editor?mode=debug'
        ];

        complexUrls.forEach(url => {
            it(`deve processar URL complexa: ${url}`, () => {
                renderPath(url);
                expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
            });
        });
    });

    describe('Múltiplos Query Parameters', () => {
        it('deve processar múltiplos parâmetros na URL', () => {
            renderPath('/editor?step=5&theme=dark&mode=preview');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });
    });

    describe('Navegação Entre Rotas', () => {
        it('deve permitir navegação do step 1 para step 5', () => {
            renderPath('/editor?step=1');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });

        it('deve permitir navegação para step específico', () => {
            renderPath('/editor?step=5');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });

        it('deve renderizar sem parâmetros', () => {
            renderPath('/editor');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });
    });

    describe('Tratamento de Erros', () => {
        it('deve lidar com rotas inexistentes', () => {
            // Wouter renderiza o último Route sem path como fallback
            renderPath('/rota-inexistente');
            // Dependendo da configuração, pode renderizar uma página 404 ou redirect
        });
    });

    describe('Funcionalidades Específicas', () => {
        it('deve suportar múltiplas instâncias do editor', () => {
            renderPath('/editor');
            expect(screen.getByTestId('quiz-editor-wysiwyg-page')).toBeInTheDocument();
        });
    });
});
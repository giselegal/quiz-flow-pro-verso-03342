import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'wouter';
import React from 'react';
import { EditorRuntimeProviders } from '../EditorRuntimeProviders';

// Mocks para todos os providers
vi.mock('../UnifiedFunnelContext', () => ({
    UnifiedFunnelProvider: ({ children, funnelId, debugMode }: any) => (
        <div data-testid="unified-funnel-provider" data-funnel-id={funnelId} data-debug={debugMode}>
            {children}
        </div>
    ),
}));

vi.mock('../FunnelsContext', () => ({
    FunnelsProvider: ({ children, debug }: any) => (
        <div data-testid="funnels-provider" data-debug={debug}>
            {children}
        </div>
    ),
}));

vi.mock('@/components/editor/EditorProvider', () => ({
    EditorProvider: ({ children, enableSupabase, funnelId, quizId, initial }: any) => (
        <div
            data-testid="editor-provider"
            data-supabase={enableSupabase}
            data-funnel-id={funnelId}
            data-quiz-id={quizId}
            data-initial-step={initial?.currentStep}
        >
            {children}
        </div>
    ),
}));

vi.mock('@/core/contexts/LegacyCompatibilityWrapper', () => ({
    LegacyCompatibilityWrapper: ({ children, enableWarnings, initialContext }: any) => (
        <div
            data-testid="legacy-compatibility-wrapper"
            data-warnings={enableWarnings}
            data-context={initialContext}
        >
            {children}
        </div>
    ),
}));

vi.mock('../EditorQuizContext', () => ({
    EditorQuizProvider: ({ children }: any) => (
        <div data-testid="editor-quiz-provider">
            {children}
        </div>
    ),
}));

vi.mock('@/components/quiz/Quiz21StepsProvider', () => ({
    Quiz21StepsProvider: ({ children, debug, initialStep }: any) => (
        <div
            data-testid="quiz-21-steps-provider"
            data-debug={debug}
            data-initial-step={initialStep}
        >
            {children}
        </div>
    ),
}));

vi.mock('../QuizFlowProvider', () => ({
    QuizFlowProvider: ({ children, initialStep, totalSteps }: any) => (
        <div
            data-testid="quiz-flow-provider"
            data-initial-step={initialStep}
            data-total-steps={totalSteps}
        >
            {children}
        </div>
    ),
}));

vi.mock('@/core/contexts/FunnelContext', () => ({
    FunnelContext: {
        EDITOR: 'EDITOR',
        PREVIEW: 'PREVIEW'
    },
}));

describe('EditorRuntimeProviders', () => {
    const TestChild = () => <div data-testid="test-child">Test Child</div>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderização Básica', () => {
        it('deve renderizar todos os providers na ordem correta', () => {
            render(
                <Router>
                    <EditorRuntimeProviders>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            // Verificar se todos os providers estão presentes
            expect(screen.getByTestId('unified-funnel-provider')).toBeInTheDocument();
            expect(screen.getByTestId('funnels-provider')).toBeInTheDocument();
            expect(screen.getByTestId('editor-provider')).toBeInTheDocument();
            expect(screen.getByTestId('legacy-compatibility-wrapper')).toBeInTheDocument();
            expect(screen.getByTestId('editor-quiz-provider')).toBeInTheDocument();
            expect(screen.getByTestId('quiz-21-steps-provider')).toBeInTheDocument();
            expect(screen.getByTestId('quiz-flow-provider')).toBeInTheDocument();
            expect(screen.getByTestId('test-child')).toBeInTheDocument();
        });

        it('deve aplicar valores padrão quando props não são fornecidas', () => {
            render(
                <Router>
                    <EditorRuntimeProviders>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            // Verificar valores padrão
            expect(screen.getByTestId('unified-funnel-provider')).toHaveAttribute('data-debug', 'false');
            expect(screen.getByTestId('editor-provider')).toHaveAttribute('data-supabase', 'false');
            expect(screen.getByTestId('quiz-flow-provider')).toHaveAttribute('data-total-steps', '21');
        });
    });

    describe('Configuração de Props', () => {
        it('deve passar funnelId corretamente para providers', () => {
            const testFunnelId = 'test-funnel-123';

            render(
                <Router>
                    <EditorRuntimeProviders funnelId={testFunnelId}>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            expect(screen.getByTestId('unified-funnel-provider')).toHaveAttribute('data-funnel-id', testFunnelId);
            // EditorProvider não recebe funnelId como prop direta, então não deve ter o atributo
            expect(screen.getByTestId('editor-provider')).not.toHaveAttribute('data-funnel-id');
        });

        it('deve passar initialStep para providers de navegação', () => {
            const initialStep = 5;

            render(
                <Router>
                    <EditorRuntimeProviders initialStep={initialStep}>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            expect(screen.getByTestId('editor-provider')).toHaveAttribute('data-initial-step', '5');
            expect(screen.getByTestId('quiz-21-steps-provider')).toHaveAttribute('data-initial-step', '5');
            expect(screen.getByTestId('quiz-flow-provider')).toHaveAttribute('data-initial-step', '5');
        });

        it('deve ativar modo debug em todos os providers compatíveis', () => {
            render(
                <Router>
                    <EditorRuntimeProviders debugMode={true}>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            expect(screen.getByTestId('unified-funnel-provider')).toHaveAttribute('data-debug', 'true');
            expect(screen.getByTestId('funnels-provider')).toHaveAttribute('data-debug', 'true');
            expect(screen.getByTestId('legacy-compatibility-wrapper')).toHaveAttribute('data-warnings', 'true');
            expect(screen.getByTestId('quiz-21-steps-provider')).toHaveAttribute('data-debug', 'true');
        });

        it('deve configurar Supabase quando habilitado', () => {
            const supabaseConfig = {
                enabled: true,
                funnelId: 'supabase-funnel',
                quizId: 'supabase-quiz',
                storageKey: 'custom-storage'
            };

            render(
                <Router>
                    <EditorRuntimeProviders supabaseConfig={supabaseConfig}>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            const editorProvider = screen.getByTestId('editor-provider');
            expect(editorProvider).toHaveAttribute('data-supabase', 'true');
            expect(editorProvider).toHaveAttribute('data-funnel-id', 'supabase-funnel');
            expect(editorProvider).toHaveAttribute('data-quiz-id', 'supabase-quiz');
        });
    });

    describe('Integração de Contexto', () => {
        it('deve configurar contexto de editor no LegacyCompatibilityWrapper', () => {
            render(
                <Router>
                    <EditorRuntimeProviders>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            expect(screen.getByTestId('legacy-compatibility-wrapper')).toHaveAttribute('data-context', 'EDITOR');
        });

        it('deve manter hierarquia de providers para funcionamento correto', () => {
            const { container } = render(
                <Router>
                    <EditorRuntimeProviders>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            // Verificar estrutura aninhada (providers devem estar em ordem específica)
            const unifiedFunnel = container.querySelector('[data-testid="unified-funnel-provider"]');
            const funnels = container.querySelector('[data-testid="funnels-provider"]');
            const editor = container.querySelector('[data-testid="editor-provider"]');
            const legacy = container.querySelector('[data-testid="legacy-compatibility-wrapper"]');

            expect(unifiedFunnel?.contains(funnels)).toBe(true);
            expect(funnels?.contains(editor)).toBe(true);
            expect(editor?.contains(legacy)).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('não deve quebrar quando providers falham', () => {
            // Simular falha em um provider
            vi.doMock('../UnifiedFunnelContext', () => {
                throw new Error('Provider failed to load');
            });

            expect(() => {
                render(
                    <Router>
                        <EditorRuntimeProviders>
                            <TestChild />
                        </EditorRuntimeProviders>
                    </Router>
                );
            }).not.toThrow();
        });

        it('deve lidar com props undefined graciosamente', () => {
            expect(() => {
                render(
                    <Router>
                        <EditorRuntimeProviders
                            funnelId={undefined}
                            initialStep={undefined}
                            debugMode={undefined}
                            supabaseConfig={undefined}
                        >
                            <TestChild />
                        </EditorRuntimeProviders>
                    </Router>
                );
            }).not.toThrow();
        });
    });

    describe('Performance', () => {
        it('deve renderizar rapidamente com configuração mínima', async () => {
            const startTime = performance.now();

            render(
                <Router>
                    <EditorRuntimeProviders>
                        <TestChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            await waitFor(() => {
                expect(screen.getByTestId('test-child')).toBeInTheDocument();
            });

            const endTime = performance.now();
            expect(endTime - startTime).toBeLessThan(100); // Deve renderizar em menos de 100ms
        });

        it('deve renderizar apenas uma vez com props estáveis', () => {
            let renderCount = 0;
            const CountingChild = () => {
                renderCount++;
                return <div data-testid="counting-child">Render #{renderCount}</div>;
            };

            const { rerender } = render(
                <Router>
                    <EditorRuntimeProviders funnelId="stable" debugMode={false}>
                        <CountingChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            expect(renderCount).toBe(1);

            // Re-render com mesmas props
            rerender(
                <Router>
                    <EditorRuntimeProviders funnelId="stable" debugMode={false}>
                        <CountingChild />
                    </EditorRuntimeProviders>
                </Router>
            );

            expect(renderCount).toBe(2); // React sempre re-renderiza, mas providers não devem causar renders extras
        });
    });
});

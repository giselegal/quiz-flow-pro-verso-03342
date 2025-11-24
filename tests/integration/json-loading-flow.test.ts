/**
 * 🧪 TESTE DE INTEGRAÇÃO: Fluxo Completo de Carregamento JSON
 * 
 * Testa o fluxo end-to-end:
 * useQuizState → TemplateService → JSON → Renderização
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useQuizState } from '../../src/hooks/useQuizState';
import { templateService } from '../../src/services/canonical/TemplateService';

// Mock do fetch para simular carregamento do JSON
global.fetch = vi.fn();

describe('Fluxo Completo de Carregamento JSON', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock do quiz21-complete.json
        (global.fetch as any).mockImplementation((url: string) => {
            if (url.includes('quiz21-complete.json')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        steps: generateMockSteps()
                    })
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    describe('useQuizState com funnelId', () => {
        it('deve carregar steps quando funnelId é fornecido', async () => {
            const { result } = renderHook(() => useQuizState('quiz-estilo-21-steps'));

            // Aguardar carregamento
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: 5000 });

            // Deve ter step atual
            expect(result.current.currentStep).toBeDefined();
            expect(result.current.currentStepData).toBeDefined();
        });

        it('deve funcionar com alias quiz-estilo-completo', async () => {
            const { result } = renderHook(() => useQuizState('quiz-estilo-completo'));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: 5000 });

            expect(result.current.currentStep).toBe('step-01');
            expect(result.current.currentStepData).toBeDefined();
        });

        it('deve funcionar com quiz21StepsComplete', async () => {
            const { result } = renderHook(() => useQuizState('quiz21StepsComplete'));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: 5000 });

            expect(result.current.currentStep).toBe('step-01');
        });
    });

    describe('TemplateService Integration', () => {
        it('deve carregar 21 steps via getAllSteps', async () => {
            templateService.setActiveFunnel('quiz-estilo-21-steps');

            const steps = await templateService.getAllSteps();

            expect(Object.keys(steps)).toHaveLength(21);
        });

        it('deve normalizar ID legado internamente', async () => {
            // Usar ID legado
            templateService.setActiveFunnel('quiz-estilo-21-steps');

            const steps = await templateService.getAllSteps();

            // Deve retornar 21 steps mesmo com ID normalizado
            expect(Object.keys(steps)).toHaveLength(21);
            expect(steps['step-01']).toBeDefined();
            expect(steps['step-21']).toBeDefined();
        });

        it('deve incluir blocks de cada step', async () => {
            templateService.setActiveFunnel('quiz21StepsComplete');

            const steps = await templateService.getAllSteps();

            // Verificar alguns steps críticos
            expect(steps['step-01'].blocks).toBeDefined();
            expect(steps['step-02'].blocks).toBeDefined();
            expect(steps['step-20'].blocks).toBeDefined();
            expect(steps['step-21'].blocks).toBeDefined();
        });
    });

    describe('Progresso do Quiz', () => {
        it('deve calcular progresso baseado em 21 steps', async () => {
            const { result } = renderHook(() => useQuizState('quiz-estilo-21-steps'));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Step 1: progresso deve ser próximo de 0%
            expect(result.current.progress).toBeLessThan(10);

            // Simular navegação para step 11 (meio do quiz)
            result.current.nextStep('step-11');

            await waitFor(() => {
                // Progresso deve estar entre 45-55% (meio do quiz)
                expect(result.current.progress).toBeGreaterThan(40);
                expect(result.current.progress).toBeLessThan(60);
            });
        });
    });

    describe('Error Handling', () => {
        it('deve usar fallback se JSON falhar', async () => {
            // Simular erro no fetch
            (global.fetch as any).mockImplementation(() =>
                Promise.reject(new Error('Network error'))
            );

            templateService.setActiveFunnel('quiz-estilo-21-steps');

            const steps = await templateService.getAllSteps();

            // Deve retornar fallback (21 steps vazios)
            expect(Object.keys(steps)).toHaveLength(21);
        });

        it('deve continuar funcionando com templateId inválido', async () => {
            const { result } = renderHook(() => useQuizState('template-invalido-12345'));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            }, { timeout: 5000 });

            // Deve usar fallback
            expect(result.current.currentStep).toBeDefined();
        });
    });
});

describe('Normalização de IDs', () => {
    it('deve normalizar quiz-estilo-21-steps para quiz21StepsComplete', async () => {
        templateService.setActiveFunnel('quiz-estilo-21-steps');

        const steps = await templateService.getAllSteps();

        // Deve carregar corretamente
        expect(Object.keys(steps)).toHaveLength(21);
    });

    it('deve normalizar quiz-estilo-completo para quiz21StepsComplete', async () => {
        templateService.setActiveFunnel('quiz-estilo-completo');

        const steps = await templateService.getAllSteps();

        expect(Object.keys(steps)).toHaveLength(21);
    });

    it('deve manter quiz21StepsComplete sem alteração', async () => {
        templateService.setActiveFunnel('quiz21StepsComplete');

        const steps = await templateService.getAllSteps();

        expect(Object.keys(steps)).toHaveLength(21);
    });
});

// Helper: Gerar mock de steps
function generateMockSteps() {
    const steps: Record<string, any> = {};

    for (let i = 1; i <= 21; i++) {
        const stepId = `step-${i.toString().padStart(2, '0')}`;
        steps[stepId] = {
            blocks: [
                {
                    id: `${stepId}-block-1`,
                    type: 'text',
                    properties: { text: `Step ${i} content` }
                }
            ]
        };
    }

    return steps;
}

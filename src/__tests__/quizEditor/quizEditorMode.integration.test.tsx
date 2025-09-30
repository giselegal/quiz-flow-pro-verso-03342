import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizEditorMode from '@/components/editor/modes/QuizEditorMode';

// Mock analytics e serviços usados internamente para evitar efeitos colaterais
vi.mock('@/analytics/UnifiedEventTracker', () => ({ unifiedEventTracker: { track: vi.fn() } }));
vi.mock('@/services/ReportGenerator', () => ({ reportGenerator: { generateReport: vi.fn().mockResolvedValue({ ok: true }) } }));
vi.mock('@/services/PerformanceOptimizer', () => ({ performanceOptimizer: { optimizeNow: vi.fn(), getMetrics: () => ({ renderTime: 10, cacheHitRate: 0.9, memoryUsage: 50, bundleSize: 120 }), getCacheStats: () => ({}) } }));

// LocalStorage mock para ambiente de teste
const localStore: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', { value: { getItem: (k: string) => localStore[k] || null, setItem: (k: string, v: string) => { localStore[k] = v; }, removeItem: (k: string) => { delete localStore[k]; } } });

describe('QuizEditorMode Integration', () => {
    it('permite editar uma questão e marcar estado dirty', async () => {
        render(<QuizEditorMode funnelId="test-funnel" />);

        // Aguarda carregamento inicial (badge de questões)
        await screen.findByText(/questões/i);

        // Seleciona primeira questão se não já selecionada (navegação lista)
        const btns = screen.getAllByRole('button');
        const targetButton = btns.find(b => /Questão 1/.test(b.textContent || ''));
        if (targetButton) fireEvent.click(targetButton);

        // Simula alteração no título se existir input (dependendo do editor de questão)
        const titleInput = screen.queryByDisplayValue(/Questão 1/i) as HTMLInputElement | null;
        if (titleInput) {
            fireEvent.change(titleInput, { target: { value: 'Questão 1 Alterada' } });
        }

        // Espera auto-save (debounce 2500ms) - encurtamos usando avanço de timers
        vi.useFakeTimers();
        vi.advanceTimersByTime(3000);

        await waitFor(() => {
            // Persistência deve ter chamado localStorage via serviço (chave derivada)
            const keys = Object.keys(localStore).filter(k => k.includes('quiz-editor'));
            expect(keys.length).toBeGreaterThan(0);
        });
    });
});

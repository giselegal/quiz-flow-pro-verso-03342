import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as BridgeModule from '@/services/QuizEditorBridge';
import QuizModularProductionEditor from '@/components/editor/quiz/QuizModularProductionEditor';

// Mock toast (usado dentro do editor)
vi.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({ toast: vi.fn() })
}));

// Mock do quizEditorBridge.saveDraft
const saveDraftMock = vi.fn().mockResolvedValue('draft-123');
vi.spyOn(BridgeModule, 'quizEditorBridge', 'get').mockReturnValue({
    saveDraft: saveDraftMock,
    publishToProduction: vi.fn(),
    loadFunnelForEdit: vi.fn().mockResolvedValue({
        id: 'draft-123',
        name: 'Draft',
        slug: 'quiz-estilo',
        steps: [
            { id: 'step-01', order: 1, type: 'intro', nextStep: 'step-02', blocks: [] },
            { id: 'step-02', order: 2, type: 'question', nextStep: undefined, blocks: [] },
            { id: 'step-03', order: 3, type: 'question', nextStep: undefined, blocks: [] },
        ],
        isPublished: false,
        version: 1
    }),
    loadForRuntime: vi.fn()
} as any);

// Simplificar animações/dnd - mock mínimo necessário
vi.mock('@dnd-kit/core', () => ({
    DndContext: (p: any) => <div>{p.children}</div>,
    useSensors: (...args: any[]) => args,
    useSensor: (sensor: any, opts?: any) => ({ sensor, opts }),
    PointerSensor: function PointerSensor() { /* noop */ },
}));
vi.mock('@dnd-kit/sortable', () => ({ SortableContext: (p: any) => <div>{p.children}</div>, verticalListSortingStrategy: vi.fn() }));

// Mock sub-componentes pesados não essenciais para o teste
vi.mock('@/components/editor/quiz/FixedProgressHeader', () => ({ default: () => <div data-testid="fixed-progress" /> }));

// Forçar date.now determinístico
vi.spyOn(Date, 'now').mockReturnValue(1730000000000);

describe('QuizEditor auto-link nextStep ao salvar', () => {
    beforeEach(() => {
        saveDraftMock.mockClear();
    });

    it('preenche nextStep ausentes antes de chamar saveDraft', async () => {
        render(<QuizModularProductionEditor />);

        // Botão Salvar
        const saveButton = await screen.findByRole('button', { name: /salvar/i });

        // Forçar dirty state: simulamos alteração adicionando atributo data para disparar isDirty (atalho: clique no canvas)
        // Se o editor exige mudanças reais, este passo pode precisar ajuste posterior
        fireEvent.click(saveButton); // primeira tentativa (pode estar disabled se !isDirty)

        // Se estava disabled, habilita via mudança indireta (hack: dispatch custom event se exposto futuramente)
        // Aqui assumimos que ao montar já há dirty ou ajustaríamos via future util; seguimos tentando salvar.

        await waitFor(() => expect(saveDraftMock).toHaveBeenCalledTimes(1), { timeout: 3000 });

        const arg = saveDraftMock.mock.calls[0][0];
        expect(arg.steps.length).toBeGreaterThan(0);

        // Verifica preenchimento: step-02 deve apontar para step-03 se estava undefined
        const step02 = arg.steps.find((s: any) => s.id === 'step-02');
        const step03 = arg.steps.find((s: any) => s.id === 'step-03');
        expect(step02?.nextStep).toBe(step03?.id);
    });
});

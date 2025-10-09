import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { PropsWithChildren } from 'react';
import { renderHook, act } from '@testing-library/react';
import { useSelectionClipboard } from '../useSelectionClipboard';
import { EditableQuizStep, BlockComponent } from '../../types';

function makeBlock(id: string, order: number, extra?: Partial<BlockComponent>): BlockComponent {
    return {
        id,
        type: extra?.type || 'text',
        order,
        parentId: extra?.parentId || null,
        properties: extra?.properties || {},
        content: extra?.content || { text: id },
    };
}

function cloneSteps<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }

describe('useSelectionClipboard', () => {
    let stepsInitial: EditableQuizStep[];
    let steps: EditableQuizStep[];
    let setSteps: React.Dispatch<React.SetStateAction<EditableQuizStep[]>>;
    let pushHistory: (next: EditableQuizStep[]) => void;
    let historyCalls: EditableQuizStep[][];

    beforeEach(() => {
        stepsInitial = [
            {
                id: 'step-1',
                type: 'intro',
                order: 1,
                blocks: [
                    makeBlock('b1', 0),
                    makeBlock('b2', 1),
                    makeBlock('b3', 2),
                    makeBlock('b4', 3)
                ]
            }
        ];
        steps = cloneSteps(stepsInitial);
        historyCalls = [];
        pushHistory = (next) => { historyCalls.push(cloneSteps(next)); };
        setSteps = (updater) => {
            if (typeof updater === 'function') {
                // @ts-ignore
                steps = updater(steps);
            } else {
                steps = updater;
            }
        };
    });

    const wrapper: React.FC<PropsWithChildren<{ selectedStepId: string }>> = ({ children, selectedStepId }) => {
        return <>{children}</>;
    };

    function ordered(step: EditableQuizStep) {
        return step.blocks.filter(b => !b.parentId).sort((a, b) => a.order - b.order);
    }

    it('seleção simples substitui seleção anterior e limpa multi', () => {
        const { result } = renderHook(() => useSelectionClipboard({ steps, selectedStepId: 'step-1', setSteps, pushHistory }), { wrapper, initialProps: { selectedStepId: 'step-1' } });
        const step = steps[0];
        act(() => {
            // click normal em b2
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: false, ctrlKey: false } as any, step.blocks[1], ordered(step));
        });
        expect(result.current.selectedBlockId).toBe('b2');
        expect(result.current.multiSelectedIds.length).toBe(0);
    });

    it('meta click alterna multi seleção mantendo selectedBlockId atualizado', () => {
        const { result } = renderHook(() => useSelectionClipboard({ steps, selectedStepId: 'step-1', setSteps, pushHistory }), { wrapper, initialProps: { selectedStepId: 'step-1' } });
        const step = steps[0];
        act(() => {
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: true, ctrlKey: true } as any, step.blocks[0], ordered(step));
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: true, ctrlKey: true } as any, step.blocks[2], ordered(step));
        });
        expect(result.current.multiSelectedIds.sort()).toEqual(['b1', 'b3']);
        expect(result.current.selectedBlockId).toBe('b3');
        // toggle off b1
        act(() => {
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: true, ctrlKey: true } as any, step.blocks[0], ordered(step));
        });
        expect(result.current.multiSelectedIds).toEqual(['b3']);
    });

    it('shift click cria range entre última e atual', () => {
        const { result } = renderHook(() => useSelectionClipboard({ steps, selectedStepId: 'step-1', setSteps, pushHistory }), { wrapper, initialProps: { selectedStepId: 'step-1' } });
        const step = steps[0];
        act(() => {
            // primeira seleção simples b1
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: false, ctrlKey: false } as any, step.blocks[0], ordered(step));
            // shift até b3 (inclui b1,b2,b3)
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: true, metaKey: false, ctrlKey: false } as any, step.blocks[2], ordered(step));
        });
        expect(result.current.multiSelectedIds.sort()).toEqual(['b1', 'b2', 'b3']);
        expect(result.current.selectedBlockId).toBe('b3');
    });

    it('copy + paste clona blocos com novos ids', () => {
        const { result } = renderHook(() => useSelectionClipboard({ steps, selectedStepId: 'step-1', setSteps, pushHistory }), { wrapper, initialProps: { selectedStepId: 'step-1' } });
        const step = steps[0];
        act(() => {
            // selecionar dois
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: true, ctrlKey: true } as any, step.blocks[0], ordered(step));
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: true, ctrlKey: true } as any, step.blocks[1], ordered(step));
            result.current.copy();
            result.current.paste('step-1');
        });
        const updated = steps[0];
        expect(updated.blocks.length).toBe(6); // 4 originais + 2 colados
        const pasted = updated.blocks.slice(-2);
        expect(pasted[0].id).toMatch(/-paste-/);
        expect(historyCalls.length).toBeGreaterThan(0);
    });

    it('removeSelected elimina blocos selecionados', () => {
        const { result } = renderHook(() => useSelectionClipboard({ steps, selectedStepId: 'step-1', setSteps, pushHistory }), { wrapper, initialProps: { selectedStepId: 'step-1' } });
        const step = steps[0];
        act(() => {
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: true, ctrlKey: true } as any, step.blocks[1], ordered(step));
            result.current.handleBlockClick({ stopPropagation() { }, shiftKey: false, metaKey: true, ctrlKey: true } as any, step.blocks[2], ordered(step));
            result.current.removeSelected();
        });
        const updated = steps[0];
        expect(updated.blocks.map(b => b.id)).toEqual(['b1', 'b4']);
    });
});

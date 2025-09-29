import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizEditor } from '@/domain/quiz/useQuizEditor';

const tick = () => new Promise(r => setTimeout(r, 0));

describe('useQuizEditor hook', () => {
    it('expõe estado inicial e permite updateStep', async () => {
        const { result } = renderHook(() => useQuizEditor());
        await tick();
        const firstStepId = result.current.state.steps[0].id;
        act(() => { result.current.selectStep(firstStepId); });
        act(() => { result.current.updateStep({ title: 'Nova Intro' }); });
        await tick();
        expect(result.current.state.steps[0].title).toBe('Nova Intro');
    });

    it('updateBlock altera propriedades do primeiro block', async () => {
        const { result } = renderHook(() => useQuizEditor());
        await tick();
        const firstStepId = result.current.state.steps[0].id;
        act(() => { result.current.selectStep(firstStepId); });
        act(() => { result.current.updateBlock(0, { emphasis: true }); });
        await tick();
        const blocks = result.current.state.blocks[firstStepId];
        expect(blocks[0].properties.emphasis).toBe(true);
    });
});

import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderComponent } from '../../features/templateEngine/render/registry';

// Smoke test: garante que cada kind básico renderiza sem crash

const baseDraft: any = { id: 'd1' };

function mk(kind: string, props: any = {}) {
    return { id: `cmp_${kind}`, kind, version: '1.0.0', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), props };
}

describe('render registry smoke', () => {
    const KINDS = [
        'Header',
        'Navigation',
        'QuestionSingle',
        'QuestionMulti',
        'Transition',
        'ResultPlaceholder',
        'RawLegacyBundle'
    ];

    for (const k of KINDS) {
        it(`render ${k}`, () => {
            const comp = mk(k, k === 'RawLegacyBundle' ? { blocks: [] } : {});
            const el = renderComponent(comp, { draft: baseDraft, stageId: 'stage_1' });
            expect(el).toBeTruthy();
        });
    }

    it('fallback para tipo desconhecido', () => {
        const comp: any = { id: 'x', type: 'legacyBlocksBundle', props: { blocks: [] } };
        const el = renderComponent(comp, { draft: baseDraft });
        expect(el).toBeTruthy();
    });
});

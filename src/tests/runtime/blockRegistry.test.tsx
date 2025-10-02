import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { BlockRegistryProvider, defineBlock, useBlockRegistry, DEFAULT_BLOCK_DEFINITIONS } from '@/runtime/quiz/blocks/BlockRegistry';
import { z } from 'zod';
import React from 'react';

describe('BlockRegistry', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BlockRegistryProvider definitions={DEFAULT_BLOCK_DEFINITIONS}>{children}</BlockRegistryProvider>
    );

    it('lista blocos default e permite get()', () => {
        const { result } = renderHook(() => useBlockRegistry(), { wrapper });
        expect(result.current.list.length).toBeGreaterThanOrEqual(2);
        const byId = result.current.get('result.headline');
        expect(byId?.id).toBe('result.headline');
    });

    it('aceita bloco custom dinâmico', () => {
        const Custom = defineBlock({
            id: 'test.block',
            label: 'Teste',
            schema: z.object({ value: z.string().default('x') }),
            defaultConfig: { value: 'x' },
            render: ({ config }) => React.createElement('div', null, config.value)
        });
        const wrapCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <BlockRegistryProvider definitions={[...DEFAULT_BLOCK_DEFINITIONS, Custom]}>{children}</BlockRegistryProvider>
        );
        const { result } = renderHook(() => useBlockRegistry(), { wrapper: wrapCustom });
        expect(result.current.get('test.block')?.label).toBe('Teste');
    });
});

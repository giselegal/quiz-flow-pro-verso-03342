import { SuperUnifiedProvider } from '@/contexts/providers/SuperUnifiedProviderV2';
import { useSuperUnified } from '@/hooks/useSuperUnified';
import type { Block } from '@/types/editor';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

// Helper consumer to expose context to the test via refs
const ConsumerBridge = ({ ctxRef, stateRef }: any) => {
  const ctx = useSuperUnified();
  // keep refs updated
  React.useEffect(() => {
    if (ctx) {
      ctxRef.current = ctx;
      stateRef.current = ctx.state;
    }
  }, [ctx, ctxRef, stateRef]);
  return null;
};

describe('EditorProvider actions (unit)', () => {
  it('addBlockAtIndex inserts block at the requested position and reorder works', async () => {
    const ctxRef: any = { current: null };
    const stateRef: any = { current: null };

    render(
      <SuperUnifiedProvider>
        <ConsumerBridge ctxRef={ctxRef} stateRef={stateRef} />
      </SuperUnifiedProvider>,
    );

    // Wait until context is populated
    await waitFor(() => {
      if (!ctxRef.current) throw new Error('context not ready');
    });

    const blockA: Block = {
      id: 'temp-a',
      type: 'text',
      properties: {},
      order: 0,
      content: {},
    } as any;
    const blockB: Block = {
      id: 'temp-b',
      type: 'text',
      properties: {},
      order: 1,
      content: {},
    } as any;

    // Use um step sem blocos pré-carregados no template por padrão
    const targetStep = 99;
    // Add A at position 0
    ctxRef.current.addBlock(targetStep, blockA);
    // Add B at position 1
    ctxRef.current.addBlock(targetStep, blockB);

    // Check current state (aguarda refletir no ConsumerBridge)
    await waitFor(() => {
      const list = stateRef.current?.editor?.stepBlocks?.[targetStep] || [];
      expect(list.length).toBeGreaterThanOrEqual(2);
      expect(String(list[0].id)).toBe('temp-a');
      expect(String(list[1].id)).toBe('temp-b');
    });

    // Reorder: swap blocks by passing reordered array
    const currentBlocks = stateRef.current?.editor?.stepBlocks?.[targetStep] || [];
    const reordered = [currentBlocks[1], currentBlocks[0]];
    ctxRef.current.reorderBlocks(targetStep, reordered);

    await waitFor(() => {
      const list2 = stateRef.current?.editor?.stepBlocks?.[targetStep] || [];
      expect(list2.length).toBeGreaterThanOrEqual(2);
      expect(String(list2[0].id)).toBe('temp-b');
      expect(String(list2[1].id)).toBe('temp-a');
    });
  });
});

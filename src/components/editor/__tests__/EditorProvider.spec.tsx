import { EditorProvider as MigrationEditorProvider, useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import type { Block } from '@/types/editor';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

// Helper consumer to expose context actions/state to the test via refs
const ConsumerBridge = ({ actionsRef, stateRef }: any) => {
  const ctx = useEditor({ optional: true });
  // keep refs updated
  React.useEffect(() => {
    if (ctx) {
      actionsRef.current = ctx.actions;
      stateRef.current = ctx.state;
    }
  }, [ctx, actionsRef, stateRef]);
  return null;
};

describe('EditorProvider actions (unit)', () => {
  it('addBlockAtIndex inserts block at the requested position and reorder works', async () => {
    const actionsRef: any = { current: null };
    const stateRef: any = { current: null };

    render(
      <MigrationEditorProvider enableSupabase={false}>
        <ConsumerBridge actionsRef={actionsRef} stateRef={stateRef} />
      </MigrationEditorProvider>
    );

    // Wait until actions are populated
    await waitFor(() => {
      if (!actionsRef.current) throw new Error('actions not ready');
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

    // Add A at position 0
    await actionsRef.current.addBlockAtIndex('step-1', blockA, 0);
    // Add B at position 1
    await actionsRef.current.addBlockAtIndex('step-1', blockB, 1);

    // Check current state (aguarda refletir no ConsumerBridge)
    await waitFor(() => {
      const list = stateRef.current.stepBlocks['step-1'] || [];
      expect(list.length).toBeGreaterThanOrEqual(2);
      expect(String(list[0].id)).toBe('temp-a');
      expect(String(list[1].id)).toBe('temp-b');
    });

    // Reorder: move index 0 to 1
    await actionsRef.current.reorderBlocks('step-1', 0, 1);

    await waitFor(() => {
      const list2 = stateRef.current.stepBlocks['step-1'] || [];
      expect(list2.length).toBeGreaterThanOrEqual(2);
      expect(String(list2[0].id)).toBe('temp-b');
      expect(String(list2[1].id)).toBe('temp-a');
    });
  });
});

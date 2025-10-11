import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { EditorProvider, useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import type { EditorState } from '@/components/editor/EditorProviderMigrationAdapter';
import type { Block } from '@/types/editor';

// Helpers
const ProviderHarness: React.FC<React.PropsWithChildren> = ({ children }) => (
  <EditorProvider funnelId="test-funnel">
    {children}
  </EditorProvider>
);

const EditorActionsProbe: React.FC<{ onReady: (ctx: ReturnType<typeof useEditor>) => void }> = ({ onReady }) => {
  const ctx = useEditor();
  React.useEffect(() => {
    onReady(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div data-testid="probe" />;
};

const EditorStateProbe: React.FC<{ onUpdate: (state: EditorState) => void }> = ({ onUpdate }) => {
  const { state } = useEditor();
  React.useEffect(() => {
    onUpdate(state);
  }, [state, onUpdate]);
  return null;
};

describe('QuizEditorPro integration: reorder and insert between blocks', () => {
  let ctxRef: ReturnType<typeof useEditor> | null = null;
  let lastState: EditorState | null = null;

  beforeEach(() => {
    ctxRef = null;
  });

  const mount = async () => {
    render(
      <ProviderHarness>
        <EditorActionsProbe onReady={c => (ctxRef = c)} />
        <EditorStateProbe onUpdate={s => (lastState = s)} />
      </ProviderHarness>
    );
    // aguardar ciclo de efeitos
    await act(async () => { });
    expect(ctxRef).toBeTruthy();
    return ctxRef!;
  };

  it('insere blocos e reordena dentro da mesma etapa', async () => {
    const ctx = await mount();
    const { actions } = ctx;
    const stepKey = 'step-1';

    // 1) Adiciona dois blocos
    const a: Block = {
      id: 'A',
      type: 'text',
      order: 1,
      content: {},
      properties: { text: 'A' },
    };
    const b: Block = {
      id: 'B',
      type: 'text',
      order: 2,
      content: {},
      properties: { text: 'B' },
    };

    await act(async () => {
      await actions.addBlock(stepKey, a);
      await actions.addBlock(stepKey, b);
    });

    await waitFor(() => {
      expect(lastState?.stepBlocks[stepKey].map(b => b.id)).toEqual(['A', 'B']);
    });

    // 2) Inserir entre A e B (na posição 1)
    const c: Block = {
      id: 'C',
      type: 'text',
      order: 3,
      content: {},
      properties: { text: 'C' },
    };

    await act(async () => {
      await actions.addBlockAtIndex(stepKey, c, 1);
    });

    await waitFor(() => {
      expect(lastState?.stepBlocks[stepKey].map(b => b.id)).toEqual(['A', 'C', 'B']);
    });

    // 3) Reordenar: mover C para o fim (índice 1 -> 2)
    await act(async () => {
      await actions.reorderBlocks(stepKey, 1, 2);
    });

    await waitFor(() => {
      expect(lastState?.stepBlocks[stepKey].map(b => b.id)).toEqual(['A', 'B', 'C']);
    });
  });
});

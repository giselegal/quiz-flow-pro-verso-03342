import type { Block } from '@/types/editor';
import { validateDrop } from '@/utils/dragDropUtils';
import { describe, expect, it } from 'vitest';

// Helpers para criar Active/Over mínimos aceitos pelo validateDrop
const makeActive = (data: any) =>
  ({
    id: data?.id || 'active-id',
    data: { current: data },
  }) as any;

const makeOver = (id: string, data?: any) =>
  ({
    id,
    data: { current: data },
  }) as any;

describe('dragDropUtils.validateDrop', () => {
  const blocks: Block[] = [
    { id: 'block-aaa-12345678', type: 'text', order: 0, properties: {}, content: {} },
    { id: 'block-bbb-ABCDEFGH', type: 'button', order: 1, properties: {}, content: {} },
  ];

  it('permite adicionar componente da sidebar no canvas root', () => {
    const active = makeActive({ type: 'sidebar-component', blockType: 'text' });
    const over = makeOver('canvas-drop-zone', { type: 'dropzone', position: blocks.length });
    const res = validateDrop(active, over, blocks);
    expect(res.isValid).toBe(true);
    expect(res.action).toBe('add');
  });

  it('permite adicionar sobre um bloco existente (insere antes), normalizando id dnd-block-<id>', () => {
    const targetId = blocks[0].id;
    const active = makeActive({ type: 'sidebar-component', blockType: 'button' });
    const over = makeOver(`dnd-block-${targetId}`);
    const res = validateDrop(active, over, blocks);
    expect(res.isValid).toBe(true);
    expect(res.action).toBe('add');
  });

  it('permite reordenar bloco do canvas ao soltar em drop-zone-<n>', () => {
    const active = makeActive({ type: 'canvas-block', blockId: blocks[0].id });
    const over = makeOver('drop-zone-1', { type: 'dropzone', position: 1 });
    const res = validateDrop(active, over, blocks);
    expect(res.isValid).toBe(true);
    expect(res.action).toBe('reorder');
  });

  it('rejeita drag com dados inválidos', () => {
    const active = makeActive(undefined);
    const over = makeOver('canvas-drop-zone');
    const res = validateDrop(active, over, blocks);
    expect(res.isValid).toBe(false);
  });
});

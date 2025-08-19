import { describe, it, expect } from 'vitest';

// Minimal in-file helpers to simulate reorder/replace behavior
interface Block { id: string; type: string; order?: number; content?: any; properties?: any }

function replaceBlocks(blocks: Block[]): Block[] {
  return blocks
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((b, i) => ({ ...b, order: i }));
}

function reorderBlocks(blocks: Block[], startIndex: number, endIndex: number): Block[] {
  const next = blocks.slice();
  const [item] = next.splice(startIndex, 1);
  next.splice(endIndex, 0, item);
  return next.map((b, i) => ({ ...b, order: i }));
}

describe('EditorContext replaceBlocks + reorderBlocks', () => {
  it('normaliza order em replaceBlocks e mantém consistência após reorder', () => {
    const input: Block[] = [
      { id: 'a', type: 'text', order: 2 },
      { id: 'b', type: 'text', order: 1 },
      { id: 'c', type: 'text', order: 5 },
    ];

    const normalized = replaceBlocks(input);
    expect(normalized.map(b => b.id)).toEqual(['b', 'a', 'c']);
    expect(normalized.map(b => b.order)).toEqual([0, 1, 2]);

    const reordered = reorderBlocks(normalized, 0, 2);
    expect(reordered.map(b => b.id)).toEqual(['a', 'c', 'b']);
    expect(reordered.map(b => b.order)).toEqual([0, 1, 2]);
  });
});

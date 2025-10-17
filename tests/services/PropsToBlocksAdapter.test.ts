// tests/services/PropsToBlocksAdapter.test.ts
import { describe, expect, test } from 'vitest';
import { PropsToBlocksAdapter } from '@/services/editor/PropsToBlocksAdapter';

describe('PropsToBlocksAdapter', () => {
  test('converts question props to blocks', () => {
    const step = {
      id: 'step-01',
      type: 'question',
      meta: {
        props: {
          question: 'Qual a cor?',
          options: [{ label: 'Vermelho' }, { label: 'Azul' }],
        },
      },
    } as any;

    const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);
    expect(converted.blocks).toBeDefined();
    expect(converted.blocks.some((b: any) => b.type === 'quiz-options')).toBe(true);
    const quizBlock = converted.blocks.find((b: any) => b.type === 'quiz-options');
    expect(quizBlock.content.options.length).toBe(2);
  });
});

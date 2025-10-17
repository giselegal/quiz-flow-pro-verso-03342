import { describe, it, expect } from 'vitest';
import { PropsToBlocksAdapter } from '@/services/editor/PropsToBlocksAdapter';

describe('PropsToBlocksAdapter.applyPropsToBlocks', () => {
  it('converts question props to heading + quiz-options', () => {
    const step = {
      id: 'step-02',
      type: 'question',
      meta: { props: { question: 'Qual cor?', options: [{ label: 'Azul' }, { label: 'Vermelho' }] } },
      blocks: []
    };
    const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);
    expect(converted.blocks).toBeDefined();
    expect(converted.blocks[0].type).toBe('heading');
    const optsBlock = converted.blocks.find((b: any) => b.type === 'quiz-options');
    expect(optsBlock).toBeTruthy();
    expect((optsBlock as any).content.options.length).toBe(2);
  });

  it('converts intro props to heading + button', () => {
    const step = { id: 'step-01', type: 'intro', meta: { props: { title: 'Bem-vindo', cta: 'Começar' } }, blocks: [] };
    const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);
    expect(converted.blocks.some((b: any) => b.type === 'heading')).toBe(true);
    expect(converted.blocks.some((b: any) => b.type === 'button')).toBe(true);
  });

  it('converts offer props to quiz-offer-cta-inline blocks', () => {
    const step = { id: 'step-21', type: 'offer', meta: { props: { offerMap: { key1: { title: 'A' }, key2: { id: 'fixo', title: 'B' } } } }, blocks: [] };
    const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);
    const offerBlocks = converted.blocks.filter((b: any) => b.type === 'quiz-offer-cta-inline');
    expect(offerBlocks.length).toBeGreaterThan(0);
  });
});

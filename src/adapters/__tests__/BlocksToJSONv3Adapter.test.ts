import { describe, it, expect } from 'vitest';
import BlocksToJSONv3Adapter, { JSONv3Template } from '@/adapters/BlocksToJSONv3Adapter';

const makeJSON = (over: Partial<JSONv3Template> = {}): JSONv3Template => ({
  templateVersion: '3.0',
  metadata: { id: 'step-02', name: 'Step 02', category: 'question' },
  sections: [
    { id: 'a', type: 'question-hero', content: { title: 'Pergunta' } },
    { id: 'b', type: 'options-grid', content: { options: [{ id: 'x' }] } },
  ],
  navigation: { nextStep: 'step-03', allowBack: true, requiresUserInput: true },
  ...over,
});

describe('BlocksToJSONv3Adapter', () => {
  it('faz round-trip preservando contagem de sections e nextStep', () => {
    const original = makeJSON();
    const { valid, errors } = BlocksToJSONv3Adapter.validateRoundTrip(original);
    expect(valid).toBe(true);
    expect(errors).toEqual([]);
  });

  it('mapeia tipos desconhecidos para fallback seguro no retorno a blocks', () => {
    const json = makeJSON({ sections: [ { id: 'z', type: 'desconhecido', content: { foo: 'bar' } } ]});
    const blocks = BlocksToJSONv3Adapter.jsonv3ToBlocks(json);
    // SECTION_TO_BLOCK_TYPE_MAP não conhece 'desconhecido' -> cai em 'text-inline' e normaliza
    expect(blocks[0].type).toBe('text-inline');
    expect(blocks[0].content.foo).toBe('bar');
  });

  it('tolera sections inválidas superficialmente (schema avisa via console.warn, mas converte)', () => {
    const json = makeJSON({ sections: [
      // faltar "content" intencionalmente
      { id: 'x', type: 'image-display' } as any,
    ]});
    const blocks = BlocksToJSONv3Adapter.jsonv3ToBlocks(json);
    expect(blocks.length).toBe(1);
    // sectionToBlock mergeia content/style -> sem content vira undefined, mas objeto ainda retorna
    expect(blocks[0].id).toBe('x');
  });
});

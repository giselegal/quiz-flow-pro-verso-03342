import { describe, it, expect } from 'vitest';
import { normalizeOptions, normalizeOfferMap } from '@/utils/normalize';

describe('normalize utils', () => {
  it('normalizeOptions generates deterministic ids and values', () => {
    const out = normalizeOptions([
      { label: 'Azul' },
      { label: 'Vermelho', value: 'red' },
    ], 'step-01');
    expect(out[0].id).toBe('step-01-opt-0');
    expect(out[0].value).toBe('azul');
    expect(out[1].id).toBe('step-01-opt-1');
    expect(out[1].value).toBe('red');
  });

  it('normalizeOfferMap keys by entry id', () => {
    const out = normalizeOfferMap({
      a: { title: 'Oferta A', ctaLabel: 'Comprar' },
      b: { id: 'fixo', title: 'Oferta B' }
    });
    expect(out['fixo']).toBeDefined();
    const ids = Object.keys(out);
    expect(ids.length).toBe(2);
  });
});

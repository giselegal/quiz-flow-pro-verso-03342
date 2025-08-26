import { describe, expect, it } from 'vitest';
import { getStepNumberFromKey, makeStepKey, normalizeStepBlocksMap } from '../stepKey';

describe('stepKey utils', () => {
  it('makeStepKey normaliza números e strings', () => {
    expect(makeStepKey(1)).toBe('step-1');
    expect(makeStepKey('1')).toBe('step-1');
    expect(makeStepKey('01')).toBe('step-1');
    expect(makeStepKey('step-2')).toBe('step-2');
    expect(makeStepKey('step02')).toBe('step-2');
  });

  it('getStepNumberFromKey extrai número corretamente', () => {
    expect(getStepNumberFromKey(3)).toBe(3);
    expect(getStepNumberFromKey('3')).toBe(3);
    expect(getStepNumberFromKey('step-4')).toBe(4);
    expect(getStepNumberFromKey('step04')).toBe(4);
  });

  it('normalizeStepBlocksMap converte chaves variantes para step-<n>', () => {
    const raw: any = {
      step1: [{ id: 'a' }],
      'step-02': [{ id: 'b' }],
      3: [{ id: 'c' }],
    };
    const norm = normalizeStepBlocksMap(raw);
    expect(Object.keys(norm).sort()).toEqual(['step-1', 'step-2', 'step-3']);
    expect(norm['step-1'][0].id).toBe('a');
    expect(norm['step-2'][0].id).toBe('b');
    expect(norm['step-3'][0].id).toBe('c');
  });
});

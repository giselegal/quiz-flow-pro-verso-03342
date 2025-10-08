import { describe, it, expect } from 'vitest';
import { autoFillNextSteps } from '@/utils/autoFillNextSteps';

describe('autoFillNextSteps', () => {
  it('não altera quando todos nextStep já definidos', () => {
    const steps = [
      { id: 'a', order: 1, nextStep: 'b' },
      { id: 'b', order: 2, nextStep: 'c' },
      { id: 'c', order: 3 }
    ];
    const { steps: result, adjusted } = autoFillNextSteps(steps);
    expect(adjusted).toBe(false);
    expect(result[0].nextStep).toBe('b');
  });

  it('preenche lacunas sequenciais de nextStep', () => {
    const steps = [
      { id: 'a', order: 1 },
      { id: 'b', order: 2 },
      { id: 'c', order: 3 }
    ];
    const { steps: result, adjusted } = autoFillNextSteps(steps);
    expect(adjusted).toBe(true);
    expect(result[0].nextStep).toBe('b');
    expect(result[1].nextStep).toBe('c');
    expect(result[2].nextStep).toBeUndefined();
  });

  it('mantém imutabilidade do array original', () => {
    const steps = [
      { id: 'a', order: 2 },
      { id: 'b', order: 1 }
    ];
    const cloneJson = JSON.stringify(steps);
    autoFillNextSteps(steps);
    expect(JSON.stringify(steps)).toBe(cloneJson);
  });
});
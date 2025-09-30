import { describe, it, expect } from 'vitest';
import { toStepKey, toStepNumber, normalizeStep, isValidStepKey } from '../stepMapping';

describe('stepMapping utilities', () => {
    it('converte número para chave', () => {
        expect(toStepKey(1)).toBe('step-1');
        expect(toStepKey(7)).toBe('step-7');
    });

    it('normaliza chave para número', () => {
        expect(toStepNumber('step-1')).toBe(1);
        expect(toStepNumber('step-21')).toBe(21);
        expect(toStepNumber('invalid')).toBe(1);
    });

    it('normalizeStep gera par coerente', () => {
        expect(normalizeStep('step-5')).toEqual({ key: 'step-5', number: 5 });
        expect(normalizeStep(3)).toEqual({ key: 'step-3', number: 3 });
    });

    it('valida step key corretamente', () => {
        expect(isValidStepKey('step-1', 25)).toBe(true);
        expect(isValidStepKey('step-21', 21)).toBe(true);
        expect(isValidStepKey('step-22', 21)).toBe(false);
        expect(isValidStepKey('x-step-1', 21)).toBe(false);
    });
});

import { describe, it, expect } from 'vitest';
import { replacePlaceholders, extractPlaceholders, hasPlaceholders } from '@/utils/placeholderParser';

describe('placeholderParser', () => {
    it('substitui placeholders básicos', () => {
        const txt = 'Olá {userName}, seu estilo é {resultStyle}!';
        const out = replacePlaceholders(txt, { userName: 'Ana', resultStyle: 'clássico' });
        expect(out).toBe('Olá Ana, seu estilo é clássico!');
    });

    it('substitui score:estilo com fallback 0', () => {
        const out = replacePlaceholders('Pontuação {score:urbano}', { scores: { classico: 10 } });
        expect(out).toBe('Pontuação 0');
    });

    it('extrai placeholders únicos', () => {
        const placeholders = extractPlaceholders('A {x} e {y} e {x} novamente');
        expect(placeholders.sort()).toEqual(['x', 'y']);
    });

    it('detecta existência de placeholders', () => {
        expect(hasPlaceholders('Sem nada')).toBe(false);
        expect(hasPlaceholders('Tem {algo}')).toBe(true);
    });
});

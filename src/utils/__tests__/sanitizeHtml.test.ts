import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../sanitizeHtml';

describe('sanitizeHtml', () => {
    it('remove script tag mantendo texto', () => {
        const input = '<p>Olá <script>alert(1)</script>Mundo</p>';
        const out = sanitizeHtml(input);
        expect(out).toBe('<p>Olá Mundo</p>');
    });

    it('remove atributos on*', () => {
        const input = '<p onClick="evil()">Texto</p>';
        const out = sanitizeHtml(input);
        expect(out).toBe('<p>Texto</p>');
    });

    it('remove javascript: em href', () => {
        const input = '<p><a href="javascript:alert(1)">Link</a></p>';
        const out = sanitizeHtml(input);
        // Anchor vira texto simples porque <a> não está na lista ALLOWED_TAGS
        expect(out).toBe('<p>Link</p>');
    });

    it('mantém tags permitidas', () => {
        const input = '<p><strong>Negrito</strong> e <em>itálico</em></p>';
        const out = sanitizeHtml(input);
        expect(out).toBe('<p><strong>Negrito</strong> e <em>itálico</em></p>');
    });
});

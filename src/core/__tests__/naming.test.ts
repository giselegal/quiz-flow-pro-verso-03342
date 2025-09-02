import { describe, it, expect } from 'vitest';
import { mapToFriendlyStyle, sanitizeStyleMentions } from '../style/naming';

describe('style/naming', () => {
  it('mapToFriendlyStyle converte slugs e variações para nomes amigáveis', () => {
    expect(mapToFriendlyStyle('estilo-neutro')).toBe('Natural');
    expect(mapToFriendlyStyle('neutro')).toBe('Natural');
    expect(mapToFriendlyStyle('classico')).toBe('Clássico');
    expect(mapToFriendlyStyle('Estilo Romântico')).toBe('Romântico');
    expect(mapToFriendlyStyle('DRAMÁTICO')).toBe('Dramático');
  });

  it('sanitizeStyleMentions troca menções de "neutro" pelo label amigável', () => {
    const input = 'O estilo estilo-neutro se caracteriza por. Também neutro aparece aqui';
    const out = sanitizeStyleMentions(input, 'Natural');
    expect(out).toContain('estilo Natural');
    expect(out).not.toContain('estilo-neutro');
    expect(out).not.toContain('neutro');
  });
});

import { describe, it, expect } from 'vitest';
import { mapToFriendlyStyle, sanitizeStyleMentions } from './naming';

describe('style/naming', () => {
  it('mapToFriendlyStyle mapeia slugs e tokens para nomes amigáveis', () => {
    expect(mapToFriendlyStyle('estilo-neutro')).toBe('Natural');
    expect(mapToFriendlyStyle('neutro')).toBe('Natural');
    expect(mapToFriendlyStyle('neutral')).toBe('Natural');
    expect(mapToFriendlyStyle('classico')).toBe('Clássico');
    expect(mapToFriendlyStyle('Estilo Criativo')).toBe('Criativo');
    expect(mapToFriendlyStyle('romântico')).toBe('Romântico');
  });

  it('sanitizeStyleMentions substitui menções de slug por label amigável', () => {
    const input = 'O estilo estilo-neutro se caracteriza por:';
    const out = sanitizeStyleMentions(input, 'Natural');
    expect(out).toContain('Natural');
    expect(out).not.toContain('estilo-neutro');
  });
});

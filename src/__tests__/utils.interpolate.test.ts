import { describe, it, expect } from 'vitest';
import { interpolate } from '@/lib/utils/interpolate';

describe('interpolate', () => {
  it('substitui tokens simples', () => {
    const out = interpolate('Olá, {username}!', { username: 'Maria' });
    expect(out).toBe('Olá, Maria!');
  });
  it('suporta caminhos aninhados', () => {
    const out = interpolate('Estilo: {result.styleName}', { result: { styleName: 'Visionária' } });
    expect(out).toBe('Estilo: Visionária');
  });
  it('mantém token desconhecido', () => {
    const out = interpolate('Olá, {user}!', {});
    expect(out).toBe('Olá, {user}!');
  });
  it('suporta default com pipe', () => {
    const out = interpolate('Olá, {username|Convidado}!', {});
    expect(out).toBe('Olá, Convidado!');
  });
});

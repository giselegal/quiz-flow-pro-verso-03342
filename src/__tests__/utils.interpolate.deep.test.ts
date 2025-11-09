import { describe, it, expect } from 'vitest';
import { interpolate, interpolateDeep } from '@/lib/utils/interpolate';

describe('interpolate (strings)', () => {
  it('substitui tokens simples', () => {
    expect(interpolate('Olá, {username}!', { username: 'Maria' })).toBe('Olá, Maria!');
  });
  it('suporta caminho aninhado', () => {
    expect(interpolate('Estilo: {result.styleName}', { result: { styleName: 'Visionária' } })).toBe('Estilo: Visionária');
  });
  it('mantém token desconhecido e usa default quando disponível', () => {
    expect(interpolate('Olá, {user}!', {})).toBe('Olá, {user}!');
    expect(interpolate('Olá, {username|Convidado}!', {})).toBe('Olá, Convidado!');
  });
});

describe('interpolateDeep (estruturas)', () => {
  it('interpola objetos recursivamente', () => {
    const value = { title: 'Olá, {user.name}!', items: ['{greet}', '{user.name}'] };
    const out = interpolateDeep(value, { user: { name: 'Ana' }, greet: 'Oi' });
    expect(out).toEqual({ title: 'Olá, Ana!', items: ['Oi', 'Ana'] });
  });
});

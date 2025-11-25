import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Home from '../Home';

vi.mock('@/contexts', () => ({
  useAuth: () => ({ user: null, logout: vi.fn() }),
}));

vi.mock('wouter', async () => {
  const actual = await vi.importActual<any>('wouter');
  return { ...actual, useLocation: () => [null, vi.fn()] };
});

describe('Home page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renderiza seções principais após loading', () => {
    render(<Home />);
    vi.runAllTimers();
    expect(screen.getByText('Confiado por líderes do setor')).toBeDefined();
    expect(screen.getByText('Tudo o que você precisa para ter sucesso')).toBeDefined();
    expect(screen.getByText('O que nossos clientes dizem')).toBeDefined();
    expect(screen.getByText('Planos simples e transparentes')).toBeDefined();
    expect(screen.getByText('Iniciar teste gratuito')).toBeDefined();
  });
});

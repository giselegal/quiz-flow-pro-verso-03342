import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import Home from '../Home';
import { HelmetProvider } from 'react-helmet-async';

vi.mock('@/contexts/auth/AuthProvider', () => ({
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
    render(
      <HelmetProvider>
        <Home />
      </HelmetProvider>,
    );
    act(() => vi.runAllTimers());
    expect(screen.getByText('Confiado por líderes do setor')).toBeDefined();
    expect(screen.getByText('Tudo o que você precisa para ter sucesso')).toBeDefined();
    expect(screen.getByText('O que nossos clientes dizem')).toBeDefined();
    expect(screen.getByText('Planos simples e transparentes')).toBeDefined();
    const ctas = screen.getAllByText('Iniciar teste gratuito');
    expect(ctas.length).toBeGreaterThan(0);
  });
});

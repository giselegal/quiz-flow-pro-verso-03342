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
    expect(screen.getByText('Confiado por Líderes da Indústria')).toBeDefined();
    expect(screen.getByText('Tudo Que Você Precisa Para Ter Sucesso')).toBeDefined();
    expect(screen.getByText('O que Nossos Clientes Dizem')).toBeDefined();
    expect(screen.getByText('Planos Simples e Transparentes')).toBeDefined();
    expect(screen.getByText('Começar Teste Grátis')).toBeDefined();
  });
});

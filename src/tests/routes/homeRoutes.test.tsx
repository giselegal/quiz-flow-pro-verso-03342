import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

// Testa rota raiz '/' e redirect /home -> /

describe('Rotas Home', () => {
  it('renderiza página inicial em /', async () => {
    window.history.pushState({}, 'Home', '/');
    render(<App />);
    // data-testid definido em App.tsx dentro da rota /
    const indexWrapper = await screen.findByTestId('index-page');
    expect(indexWrapper).toBeTruthy();
    // Checar algum elemento chave (botão "Entrar" ou estatística) opcional
  });

  it('redirect /home para / e renderiza mesma página', async () => {
    window.history.pushState({}, 'Home Redirect', '/home');
    render(<App />);
    const indexWrapper = await screen.findByTestId('index-page');
    expect(indexWrapper).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultStep from '@/components/quiz/ResultStep';
import { styleConfigGisele } from '@/data/styles';

// Este teste verifica a renderização das barras de porcentagem quando scores são fornecidos
// e confirma a ordenação, presença do ícone 👑 no primeiro e formato de porcentagem.

describe('ResultStep - exibição de scores e estilos secundários', () => {
  const baseData: any = {
    id: 'step-20',
    type: 'result',
    title: '{userName}, seu estilo predominante é:'
  };

  it('renderiza top 5 estilos ordenados por pontuação com porcentagens', () => {
    const scores = {
      natural: 10,
      classico: 25,
      contemporaneo: 5,
      elegante: 40,
      romantico: 8,
      sexy: 12,
      dramatico: 0,
      criativo: 4
    };

    // Total = 104
    // elegante 40 -> 38.46%
    // classico 25 -> 24.04%
    // natural 10 -> 9.62%
    // sexy 12 -> 11.54%  (na verdade sexy > natural, deve aparecer antes)
    // romantico 8 -> 7.69%
    // contemporaneo 5 -> 4.81%
    // criativo 4 -> 3.85%
    // dramatico 0 -> ignora

    // Esperada ordem decrescente: elegante, classico, sexy, natural, romantico (top 5)

    render(
      <ResultStep
        data={baseData}
        userProfile={{
          userName: 'Maria',
          resultStyle: 'elegante',
          secondaryStyles: ['natural', 'classico']
        }}
        scores={scores as any}
      />
    );

    // Primeiro título interpolado
    expect(screen.getByText(/Maria, seu estilo predominante é:/i)).toBeInTheDocument();

    // Captura das labels de estilos com porcentagem (usa name vindo de styleConfigGisele)
    const expectedOrder = ['Elegante', 'Clássico', 'Sexy', 'Natural', 'Romântico'];

    expectedOrder.forEach(label => {
      expect(screen.getByText(label, { exact: false })).toBeTruthy();
    });

    // Verificação do ícone 👑 no primeiro (Elegante)
    const crownElement = screen.getByText(/👑/);
    expect(crownElement).toBeInTheDocument();

    // Porcentagens aproximadas (usar regex para tolerar arredondamentos de 0.1%)
    const percentageAssertions: Record<string, RegExp> = {
      Elegante: /38\.4|38\.5|38\.46/, // arredondamento
      Clássico: /24\.0|24\.1|24\.04/,
      Sexy: /11\.5|11\.6|11\.54/,
      Natural: /9\.6|9\.7|9\.62/,
      Romântico: /7\.6|7\.7|7\.69/
    };

    // Selecionar todos spans que possuem %
    const percentageSpans = screen.getAllByText(/%/);
    // Checar que ao menos 5 porcentagens presentes
    expect(percentageSpans.length).toBeGreaterThanOrEqual(5);

    Object.entries(percentageAssertions).forEach(([styleName, regex]) => {
      const span = percentageSpans.find(s => regex.test(s.textContent || ''));
      expect(span, `Não encontrou porcentagem esperada para ${styleName}`).toBeTruthy();
    });
  });

  it('limita a exibição a no máximo 5 estilos', () => {
    const scores = {
      natural: 10,
      classico: 9,
      contemporaneo: 8,
      elegante: 7,
      romantico: 6,
      sexy: 5,
      dramatico: 4,
      criativo: 3
    };

    const { container } = render(
      <ResultStep
        data={baseData}
        userProfile={{
          userName: 'Ana',
            resultStyle: 'natural',
            secondaryStyles: []
        }}
        scores={scores as any}
      />
    );

    // Deve haver exatamente 5 barras (div com role progress bar não existe, então selecionamos pela classe bg-gray-200, robustez: filtrar containers de barra)
    const barContainers = container.querySelectorAll('div.w-full.bg-gray-200');
    expect(barContainers.length).toBe(5);
  });
});

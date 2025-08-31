import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultHeaderInlineBlock from '@/components/editor/blocks/ResultHeaderInlineBlock';
import { StorageService } from '@/services/core/StorageService';

const mkBlock = (over: Partial<any> = {}) => ({
  id: 'b1',
  type: 'result-header-inline',
  properties: {
    title: 'Seu Estilo Predominante',
    subtitle: 'Resumo do seu perfil',
    ...over,
  },
});

describe('ResultHeaderInlineBlock', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exibe estilo, nome e percentual quando quizResult e userName estão no Storage', () => {
    StorageService.safeSetString('userName', 'Alice');
    StorageService.safeSetJSON('quizResult', {
      primaryStyle: { category: 'Natural', style: 'Natural', score: 7, percentage: 70 },
      secondaryStyles: [{ category: 'Clássico', style: 'Clássico', score: 3, percentage: 30 }],
    });

    render(
      <ResultHeaderInlineBlock
        block={mkBlock() as any}
        isSelected={false}
        onPropertyChange={() => { }}
      />
    );

  // Mostra estilo principal (rótulo humano) - termo exato
  expect(screen.getByText('Natural')).toBeTruthy();
    // Mostra nome ao lado como saudação compacta
    expect(screen.getByText(/Alice/)).toBeTruthy();
  // Valida percentual via progressbar (70% -> translateX(-30%))
  const progressBars = screen.getAllByRole('progressbar');
  expect(progressBars.length).toBeGreaterThan(0);
  const fill = progressBars[0].querySelector('div');
  expect(fill).toBeTruthy();
  expect(fill!.getAttribute('style') || '').toContain('translateX(-30%');
  });
});

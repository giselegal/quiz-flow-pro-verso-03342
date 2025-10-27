import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComponentLibraryColumn, ComponentLibraryItem } from '../ComponentLibraryColumn';

describe('ComponentLibraryColumn', () => {
  it('exibe estado vazio quando não há componentes', () => {
    render(
      <ComponentLibraryColumn components={[]} />,
    );

    expect(screen.getByText('Componentes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar componentes...')).toBeInTheDocument();
    expect(screen.getByText('Nenhum componente encontrado')).toBeInTheDocument();
  });

  it('lista componentes por categoria', () => {
    const components: ComponentLibraryItem[] = [
      { id: 'c1', type: 'text', label: 'Título', category: 'Básico' },
      { id: 'c2', type: 'image', label: 'Imagem', category: 'Mídia' },
    ];

    render(<ComponentLibraryColumn components={components} />);

    expect(screen.getByText('Básico')).toBeInTheDocument();
    expect(screen.getByText('Mídia')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Imagem')).toBeInTheDocument();
  });
});

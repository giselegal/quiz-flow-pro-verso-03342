import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RegistryPropertiesPanel from '../RegistryPropertiesPanel';

const mockBlock = {
  id: 'block-1',
  type: 'quiz-intro-header',
  properties: {
    title: 'Título Original',
    subtitle: 'Subtítulo',
    showLogo: true,
    logoUrl: '',
    textAlign: 'center'
  }
};

describe('RegistryPropertiesPanel', () => {
  it('renderiza mensagem quando nenhum bloco está selecionado', () => {
    const { getByText } = render(
      <RegistryPropertiesPanel
        selectedBlock={null as any}
        onUpdate={() => {}}
        onClose={() => {}}
        onDelete={() => {}}
      />
    );
    expect(getByText('Selecione um componente para editar suas propriedades')).toBeInTheDocument();
  });

  it('renderiza campos do bloco selecionado', () => {
    const { getByText } = render(
      <RegistryPropertiesPanel
        selectedBlock={mockBlock as any}
        onUpdate={() => {}}
        onClose={() => {}}
        onDelete={() => {}}
      />
    );
    expect(getByText('Header do Quiz')).toBeInTheDocument();
    expect(getByText(/Título/i)).toBeInTheDocument();
  });

  it('dispara onUpdate ao alterar campo de texto', async () => {
    const onUpdate = vi.fn();
    const { getByLabelText } = render(
      <RegistryPropertiesPanel
        selectedBlock={mockBlock as any}
        onUpdate={onUpdate}
        onClose={() => {}}
        onDelete={() => {}}
      />
    );

    const input = getByLabelText('Título') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Novo Título' } });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});

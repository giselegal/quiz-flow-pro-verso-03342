import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import PropertiesColumn from '../index';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { onBlockUpdate } from '@/lib/utils/editorEventBus';
import { normalizeBlockData } from '@/core/adapters/BlockDataNormalizer';

// Mocks das dependências
vi.mock('@/core/schema/SchemaInterpreter', () => ({
  schemaInterpreter: {
    getBlockSchema: vi.fn(),
  },
}));

vi.mock('@/lib/utils/editorEventBus', () => ({
  onBlockUpdate: vi.fn(() => () => {}), // Retorna função de unsubscribe
}));

vi.mock('@/core/adapters/BlockDataNormalizer', () => ({
  normalizeBlockData: vi.fn((block) => block),
  createSynchronizedBlockUpdate: vi.fn((block, props) => ({ properties: props })),
  normalizerLogger: { debug: vi.fn() },
}));

vi.mock('@/lib/utils/appLogger', () => ({
  appLogger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock dos componentes de UI para simplificar
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={`mock-card ${className}`}>{children}</div>,
}));

vi.mock('@/components/ui/collapsible', () => ({
  Collapsible: ({ children, open, onOpenChange }: any) => (
    <div className="mock-collapsible">
      <button onClick={() => onOpenChange(!open)}>Toggle</button>
      {open && children}
    </div>
  ),
  CollapsibleTrigger: ({ children }: any) => <div>{children}</div>,
  CollapsibleContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock dos componentes usados pelo DynamicPropertyControls
vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, id, ...props }: any) => (
    <input
      id={id}
      data-testid={`input-${id}`}
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, ...props }: any) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  ),
}));

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, id, ...props }: any) => (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      Switch
    </button>
  ),
}));

describe('PropertiesColumn Integration', () => {
  const mockOnBlockUpdate = vi.fn();
  const mockOnClearSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar DynamicPropertyControls quando schema existe', () => {
    const mockBlock = {
      id: 'block-1',
      type: 'test-block',
      properties: { title: 'Initial Title' },
      content: {},
    };

    const mockSchema = {
      type: 'test-block',
      label: 'Test Block',
      category: 'content',
      properties: {
        title: {
          type: 'string',
          control: 'text',
          label: 'Título',
        },
      },
    };

    (schemaInterpreter.getBlockSchema as any).mockReturnValue(mockSchema);
    (normalizeBlockData as any).mockReturnValue(mockBlock);

    render(
      <PropertiesColumn
        selectedBlock={mockBlock}
        onBlockUpdate={mockOnBlockUpdate}
        onClearSelection={mockOnClearSelection}
      />
    );

    // Verifica se o input do título foi renderizado
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
  });

  it('deve atualizar propriedades e chamar onBlockUpdate', async () => {
    const mockBlock = {
      id: 'block-1',
      type: 'test-block',
      properties: { title: 'Initial Title' },
      content: {},
    };

    const mockSchema = {
      type: 'test-block',
      label: 'Test Block',
      category: 'content',
      properties: {
        title: {
          type: 'string',
          control: 'text',
          label: 'Título',
        },
      },
    };

    (schemaInterpreter.getBlockSchema as any).mockReturnValue(mockSchema);
    (normalizeBlockData as any).mockReturnValue(mockBlock);

    render(
      <PropertiesColumn
        selectedBlock={mockBlock}
        onBlockUpdate={mockOnBlockUpdate}
        onClearSelection={mockOnClearSelection}
      />
    );

    const input = screen.getByLabelText('Título');
    fireEvent.change(input, { target: { value: 'New Title' } });

    // PropertiesColumn tem um debounce ou botão de salvar?
    // Olhando o código, tem um botão de salvar e um auto-save debounced.
    
    // Vamos verificar se o botão de salvar fica habilitado
    const saveButton = screen.getByText(/Salvar Alterações/i);
    expect(saveButton).toBeInTheDocument();
    
    // Clicar em salvar
    fireEvent.click(saveButton);

    // Verificar se onBlockUpdate foi chamado
    expect(mockOnBlockUpdate).toHaveBeenCalledWith('block-1', expect.objectContaining({
        properties: expect.objectContaining({ title: 'New Title' })
    }));
  });

  it('deve mostrar fallback quando schema não existe', () => {
    const mockBlock = {
      id: 'block-1',
      type: 'unknown-block',
      properties: {},
      content: {},
    };

    (schemaInterpreter.getBlockSchema as any).mockReturnValue(null);
    (normalizeBlockData as any).mockReturnValue(mockBlock);

    render(
      <PropertiesColumn
        selectedBlock={mockBlock}
        onBlockUpdate={mockOnBlockUpdate}
        onClearSelection={mockOnClearSelection}
      />
    );

    expect(screen.getByText('Schema não encontrado')).toBeInTheDocument();
    expect(screen.queryByLabelText('Título')).not.toBeInTheDocument();
  });
});

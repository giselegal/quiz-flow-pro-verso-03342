import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
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
  onBlockUpdate: vi.fn(() => () => { }), // Retorna função de unsubscribe
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
      order: 0,
      properties: { title: 'Initial Title' },
      content: {},
    } as any;

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
      order: 0,
      properties: { title: 'Initial Title' },
      content: {},
    } as any;

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
    // Olhando o código, tem um botão de aplicar e um padrão draft.

    // Vamos verificar se o botão de aplicar fica habilitado
    const saveButton = screen.getByRole('button', { name: /Aplicar/i });
    expect(saveButton).toBeInTheDocument();

    // Clicar em aplicar
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
      order: 0,
      properties: {},
      content: {},
    } as any;

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

  it('deve respeitar valor booleano false vindo do modelo JSON', () => {
    const mockBlock = {
      id: 'block-boolean-1',
      type: 'quiz:boolean-block',
      order: 0,
      properties: { showDescription: false },
      content: {},
    } as any;

    const mockSchema = {
      type: 'quiz:boolean-block',
      label: 'Boolean Block',
      category: 'content',
      properties: {
        showDescription: {
          type: 'boolean',
          control: 'toggle',
          label: 'Mostrar Descrição',
          default: true,
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

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    // Alternar o toggle para marcar como dirty e habilitar o botão de aplicar
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    const saveButton = screen.getByRole('button', { name: /Aplicar/i });
    fireEvent.click(saveButton);

    expect(mockOnBlockUpdate).toHaveBeenCalledWith(
      'block-boolean-1',
      expect.objectContaining({
        properties: expect.objectContaining({ showDescription: true }),
      })
    );
  });

  it('deve renderizar e persistir lista de opções (options-list) do modelo JSON', () => {
    const mockBlock = {
      id: 'block-options-1',
      type: 'quiz:options-grid',
      order: 0,
      properties: {
        options: [
          { id: 'opt-1', text: 'Opção 1', value: 'option-1' },
          { id: 'opt-2', text: 'Opção 2', value: 'option-2' },
        ],
      },
      content: {},
    } as any;

    const mockSchema = {
      type: 'quiz:options-grid',
      label: 'Options Grid',
      category: 'content',
      properties: {
        options: {
          type: 'array',
          control: 'options-list',
          label: 'Opções',
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

    // Deve haver inputs para as opções existentes
    expect(screen.getByDisplayValue('Opção 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Opção 2')).toBeInTheDocument();

    // Editar a primeira opção
    const firstOptionInput = screen.getByDisplayValue('Opção 1') as HTMLInputElement;
    fireEvent.change(firstOptionInput, { target: { value: 'Opção 1 editada' } });

    const saveButton = screen.getByRole('button', { name: /Aplicar/i });
    fireEvent.click(saveButton);

    expect(mockOnBlockUpdate).toHaveBeenCalledWith(
      'block-options-1',
      expect.objectContaining({
        properties: expect.objectContaining({
          options: expect.arrayContaining([
            expect.objectContaining({ text: 'Opção 1 editada' }),
          ]),
        }),
      })
    );
  });
});

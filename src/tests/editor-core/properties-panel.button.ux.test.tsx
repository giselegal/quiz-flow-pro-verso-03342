import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { PropertiesPanel } from '@/components/editor/quiz/components/PropertiesPanel';
import { initializeSchemaRegistry } from '@/config/schemas';

beforeAll(() => {
  initializeSchemaRegistry();
});

function PanelWrapper(initial: Partial<any> = {}) {
  const [block, setBlock] = React.useState<any>({
    id: 'b-btn',
    type: 'button',
    order: 0,
    properties: {
      text: 'Comprar agora',
      url: 'https://exemplo.com/checkout',
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      ...initial.properties,
    },
    content: { ...(initial.content || {}) },
  });
  const step = { id: 's1', type: 'question', order: 1, blocks: [block] } as any;

  return (
    <div>
      <PropertiesPanel
        selectedStep={step}
        selectedBlock={block}
        headerConfig={{ showLogo: false, progressEnabled: false }}
        onHeaderConfigChange={() => {}}
        clipboard={null}
        canPaste={false}
        onPaste={() => {}}
        multiSelectedIds={[]}
        onDuplicateInline={() => {}}
        onPrepareDuplicateToAnother={() => {}}
        onCopyMultiple={() => {}}
        onRemoveMultiple={() => {}}
        onRemoveBlock={() => {}}
        onSaveAsSnippet={() => {}}
        snippets={[]}
        snippetFilter={''}
        onSnippetFilterChange={() => {}}
        onSnippetInsert={() => {}}
        onSnippetRename={() => {}}
        onSnippetDelete={() => {}}
        onRefreshSnippets={() => {}}
        onBlockPatch={(patch) => {
          setBlock((prev: any) => ({
            ...prev,
            properties: { ...prev.properties, ...patch },
            content: prev.content,
          }));
        }}
        isOfferStep={false}
        OfferMapComponent={() => null as any}
        onOfferMapUpdate={() => {}}
        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
        onApplyTheme={() => {}}
      />

      <pre data-testid="props-state">{JSON.stringify(block.properties)}</pre>
    </div>
  );
}

describe('PropertiesPanel UX (button)', () => {
  it('edita label/url via aliases e alterna variant/size/fullWidth', async () => {
    render(<PanelWrapper />);

    // Abrir grupo Conteúdo
    const contentTrigger = await screen.findByText(/Conteúdo/i);
    await act(async () => { fireEvent.click(contentTrigger); });

    // Editar label (alias)
    const labelInput = await screen.findByLabelText(/Label \(alias\)|Texto \(alias v3\)|Texto do botão|Texto/i);
    await act(async () => { fireEvent.change(labelInput, { target: { value: 'Quero minha vaga' } }); });

    // Editar href/url
    const urlInput = await screen.findByLabelText(/Href \(alias\)|URL \(alias v3\)|URL|Link|Endereço/i);
    await act(async () => { fireEvent.change(urlInput, { target: { value: 'https://meuapp.com/pagar' } }); });

    // Abrir grupo Style
    const styleTrigger = await screen.findByText(/Style|Estilo/i);
    await act(async () => { fireEvent.click(styleTrigger); });

    // Trocar variant para outline
    const variantSelect = screen.getByLabelText(/Variante/i) as HTMLSelectElement;
    await act(async () => { fireEvent.change(variantSelect, { target: { value: 'outline' } }); });

    // Trocar size para lg
    const sizeSelect = screen.getByLabelText(/Tamanho/i) as HTMLSelectElement;
    await act(async () => { fireEvent.change(sizeSelect, { target: { value: 'lg' } }); });

    // Abrir grupo Layout e marcar fullWidth
    const layoutTrigger = await screen.findByText(/Layout/i);
    await act(async () => { fireEvent.click(layoutTrigger); });

    const fullWidthSwitch = screen.getByLabelText(/Largura Total/i) as HTMLInputElement;
    await act(async () => { fireEvent.click(fullWidthSwitch); });

    const propsState = screen.getByTestId('props-state').textContent || '{}';
    const props = JSON.parse(propsState);

    // Verificações
    expect(props.text === 'Quero minha vaga' || props.label === 'Quero minha vaga').toBeTruthy();
    expect(props.url === 'https://meuapp.com/pagar' || props.href === 'https://meuapp.com/pagar').toBeTruthy();
    expect(props.variant).toBe('outline');
    expect(props.size === 'lg' || props.size === 'large').toBeTruthy();
    expect(props.fullWidth).toBe(true);
  });
});

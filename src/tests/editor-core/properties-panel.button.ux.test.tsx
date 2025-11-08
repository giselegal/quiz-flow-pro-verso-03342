import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';
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
                onHeaderConfigChange={() => { }}
                clipboard={null}
                canPaste={false}
                onPaste={() => { }}
                multiSelectedIds={[]}
                onDuplicateInline={() => { }}
                onPrepareDuplicateToAnother={() => { }}
                onCopyMultiple={() => { }}
                onRemoveMultiple={() => { }}
                onRemoveBlock={() => { }}
                onSaveAsSnippet={() => { }}
                snippets={[]}
                snippetFilter={''}
                onSnippetFilterChange={() => { }}
                onSnippetInsert={() => { }}
                onSnippetRename={() => { }}
                onSnippetDelete={() => { }}
                onRefreshSnippets={() => { }}
                onBlockPatch={(patch) => {
                    setBlock((prev: any) => ({
                        ...prev,
                        properties: { ...prev.properties, ...patch },
                        content: prev.content,
                    }));
                }}
                isOfferStep={false}
                OfferMapComponent={() => null as any}
                onOfferMapUpdate={() => { }}
                ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                onApplyTheme={() => { }}
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

        // Editar texto do botão (campo canônico buttonText)
        const buttonTextField = document.querySelector('[data-field-key="buttonText"]') as HTMLElement;
        const textInput = within(buttonTextField).getByRole('textbox') as HTMLInputElement;
        await act(async () => { fireEvent.change(textInput, { target: { value: 'Quero minha vaga' } }); });

        // Editar URL do botão (campo canônico buttonUrl)
        const buttonUrlField = document.querySelector('[data-field-key="buttonUrl"]') as HTMLElement;
        const urlInput = within(buttonUrlField).getByRole('textbox') as HTMLInputElement;
        await act(async () => { fireEvent.change(urlInput, { target: { value: 'https://meuapp.com/pagar' } }); });

        // Abrir grupo Style
        const styleTrigger = await screen.findByText(/Style|Estilo/i);
        await act(async () => { fireEvent.click(styleTrigger); });

        // Trocar variant para outline
        const variantContainer = document.querySelector('[data-field-key="variant"]') as HTMLElement;
        const variantSelect = within(variantContainer).getByRole('combobox') as HTMLSelectElement;
        await act(async () => { fireEvent.change(variantSelect, { target: { value: 'outline' } }); });

        // Trocar size para lg
        const sizeContainer = document.querySelector('[data-field-key="size"]') as HTMLElement;
        const sizeSelect = within(sizeContainer).getByRole('combobox') as HTMLSelectElement;
        await act(async () => { fireEvent.change(sizeSelect, { target: { value: 'lg' } }); });

        // Abrir grupo Layout e marcar fullWidth
        const layoutTrigger = await screen.findByText(/Layout/i);
        await act(async () => { fireEvent.click(layoutTrigger); });

        const fullWidthContainer = document.querySelector('[data-field-key="fullWidth"]') as HTMLElement;
        const fullWidthSwitch = within(fullWidthContainer).getByRole('switch');
        await act(async () => { fireEvent.click(fullWidthSwitch); });

        const propsState = screen.getByTestId('props-state').textContent || '{}';
        const props = JSON.parse(propsState);

        // Verificações
        expect(props.buttonText === 'Quero minha vaga' || props.text === 'Quero minha vaga' || props.label === 'Quero minha vaga').toBeTruthy();
        expect(props.buttonUrl === 'https://meuapp.com/pagar' || props.url === 'https://meuapp.com/pagar' || props.href === 'https://meuapp.com/pagar').toBeTruthy();
        expect(props.variant).toBe('outline');
        expect(props.size === 'lg' || props.size === 'large').toBeTruthy();
        expect(props.fullWidth).toBe(true);
    });
});

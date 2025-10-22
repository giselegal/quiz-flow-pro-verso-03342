import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { PropertiesPanel } from '@/components/editor/quiz/components/PropertiesPanel';
import { initializeSchemaRegistry } from '@/config/schemas';

beforeAll(() => {
    initializeSchemaRegistry();
});

function PanelWrapper(initial: Partial<any> = {}) {
    const [block, setBlock] = React.useState<any>({
        id: 'b1',
        type: 'options-grid',
        order: 0,
        properties: {
            question: 'Escolha',
            columns: 2,
            showImages: true,
            imageSize: 'medium',
            ...initial.properties,
        },
        content: {
            options: [
                { id: 'o1', text: 'Primeira', imageUrl: '', points: 0, category: '' },
                { id: 'o2', text: 'Segunda', imageUrl: '', points: 0, category: '' },
            ],
            ...initial.content,
        },
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
                    setBlock((prev: any) => {
                        const nextContent = 'options' in patch ? { ...prev.content, options: patch.options } : prev.content;
                        const { options, ...rest } = patch as any;
                        const nextProps = Object.keys(rest).length ? { ...prev.properties, ...rest } : prev.properties;
                        return { ...prev, properties: nextProps, content: nextContent };
                    });
                }}
                isOfferStep={false}
                OfferMapComponent={() => null as any}
                onOfferMapUpdate={() => { }}
                ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                onApplyTheme={() => { }}
            />

            <pre data-testid="props-state">{JSON.stringify(block.properties)}</pre>
            <pre data-testid="first-option">{JSON.stringify(block.content.options?.[0] || {})}</pre>
        </div>
    );
}

describe('PropertiesPanel UX (options-grid)', () => {
    it('colunas: controle segmentado 1-4 atualiza properties.columns', async () => {
        render(<PanelWrapper />);

        // Abrir grupo "Layout"
        const layoutTrigger = await screen.findByText(/Layout/i);
        await act(async () => { fireEvent.click(layoutTrigger); });

        // Dentro do campo "Colunas do Grid", clicar em "4"
        const label = await screen.findByText(/Colunas do Grid/i);
        const field = label.closest('[data-field-key="columns"]') as HTMLElement;
        const btn4 = within(field).getByRole('button', { name: '4' });
        await act(async () => { fireEvent.click(btn4); });

        const propsState = screen.getByTestId('props-state').textContent || '{}';
        const props = JSON.parse(propsState);
        expect(props.columns).toBe(4);
    });

    it('imageSize: controle segmentado muda preset e exibe campos custom quando selecionado', async () => {
        render(<PanelWrapper />);

        // Abrir grupo "Layout"
        const layoutTrigger = await screen.findByText(/Layout/i);
        await act(async () => { fireEvent.click(layoutTrigger); });

        // Selecionar "custom" no campo Tamanho da imagem
        const sizeField = (await screen.findByTestId('props-state')) && (document.querySelector('[data-field-key="imageSize"]') as HTMLElement);
        const customBtn = within(sizeField).getByRole('button', { name: /custom/i });
        await act(async () => { fireEvent.click(customBtn); });

        // Deve aparecer os campos de largura/altura (custom)
        const largura = await screen.findByText(/Largura \(custom\)/i);
        const altura = await screen.findByText(/Altura \(custom\)/i);
        expect(largura).toBeTruthy();
        expect(altura).toBeTruthy();

        const propsState = screen.getByTestId('props-state').textContent || '{}';
        const props = JSON.parse(propsState);
        expect(props.imageSize).toBe('custom');
    });

    it('options como objeto (map) é carregado e exibe points/category via aliases', async () => {
        const objOptions = {
            k1: { id: 'k1', label: 'ObjText', image: 'https://x/img.png', score: 9, category: 'C' },
            k2: { id: 'k2', label: 'Obj2', image: '', score: 0, category: '' },
        };
        render(<PanelWrapper content={{ options: objOptions }} />);

        // Abrir grupo "Conteúdo" (garantia)
        const contentTrigger = await screen.findByText(/Conteúdo/i);
        await act(async () => { fireEvent.click(contentTrigger); });

        // Encontrar o primeiro cartão e seus campos
        const allTextboxes = await screen.findAllByRole('textbox');
        const textInput = allTextboxes.find((el) => (el as HTMLInputElement).value === 'ObjText') as HTMLInputElement;
        expect(textInput).toBeTruthy();
        const card = textInput.closest('.p-4') as HTMLElement;
        const scoped = within(card);
        const inputs = scoped.getAllByRole('textbox') as HTMLInputElement[];
        // Estrutura: [Texto, Imagem(URL), Categoria] + um spinbutton para Pontos
        const urlInput = inputs[1];
        const numberInput = scoped.getByRole('spinbutton') as HTMLInputElement;
        const categoryInput = inputs[2];

        expect(urlInput.value).toBe('https://x/img.png');
        expect(numberInput.value).toBe('9');
        expect(categoryInput.value).toBe('C');

        // Ao alterar, deve emitir patch normal
        await act(async () => {
            fireEvent.change(numberInput, { target: { value: '11' } });
            fireEvent.change(categoryInput, { target: { value: 'Z' } });
        });

        const first = screen.getByTestId('first-option').textContent || '{}';
        const opt = JSON.parse(first);
        expect(opt.points).toBe(11);
        expect(opt.category).toBe('Z');
    });
});

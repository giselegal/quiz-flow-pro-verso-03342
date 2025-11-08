import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';
import { initializeSchemaRegistry } from '@/config/schemas';

beforeAll(() => {
    initializeSchemaRegistry();
});

function OptionsGridWrapper() {
    const [block, setBlock] = React.useState<any>({
        id: 'b-options-grid',
        type: 'options-grid',
        order: 0,
        properties: {
            question: 'Escolha uma opção',
            columns: 2,
            showImages: true,
        },
        content: {
            options: [
                { id: 'opt1', text: 'A', imageUrl: '', points: 0, category: '' },
                { id: 'opt2', text: 'B', imageUrl: '', points: 0, category: '' },
            ],
        },
    });
    const step = { id: 's03', type: 'question', order: 3, blocks: [block] } as any;

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
                    // Emular lógica do editor: options → content.options; demais → properties
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

            <div data-testid="preview">
                {/* Preview mínimo: mostra imagem, pontos e categoria da primeira opção */}
                {block.content.options[0]?.imageUrl && (

                    <img alt="preview" src={block.content.options[0].imageUrl} />
                )}
                {(block.content.options[0]?.category || typeof block.content.options[0]?.points === 'number') && (
                    <div>
                        {block.content.options[0]?.category && <span>Cat: {block.content.options[0].category}</span>}
                        {typeof block.content.options[0]?.points === 'number' && <span>Pontos: {block.content.options[0].points}</span>}
                    </div>
                )}
                <pre data-testid="state">{JSON.stringify(block.content.options[0])}</pre>
            </div>
        </div>
    );
}

function QuizOptionsWrapper() {
    const [block, setBlock] = React.useState<any>({
        id: 'b-quiz-options',
        type: 'quiz-options',
        order: 0,
        properties: { question: 'Escolha', multipleSelection: true, showImages: true },
        content: {
            options: [
                { id: 'qa1', text: '1', imageUrl: '', points: 0, category: '' },
                { id: 'qa2', text: '2', imageUrl: '', points: 0, category: '' },
            ],
        },
    });
    const step = { id: 's04', type: 'question', order: 4, blocks: [block] } as any;

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

            <div data-testid="preview-quiz-options">
                {block.content.options[0]?.imageUrl && (

                    <img alt="preview-qo" src={block.content.options[0].imageUrl} />
                )}
                {(block.content.options[0]?.category || typeof block.content.options[0]?.points === 'number') && (
                    <div>
                        {block.content.options[0]?.category && <span>Cat: {block.content.options[0].category}</span>}
                        {typeof block.content.options[0]?.points === 'number' && <span>Pontos: {block.content.options[0].points}</span>}
                    </div>
                )}
                <pre data-testid="state-qo">{JSON.stringify(block.content.options[0])}</pre>
            </div>
        </div>
    );
}

describe('PropertiesPanel → edição de options reflete no preview e content', () => {
    it('options-grid: edita imageUrl/points/category e reflete no preview + content.options', async () => {
        render(<OptionsGridWrapper />);

        // Localizar o card da primeira opção pelo valor inicial do campo de texto ("A")
        const firstTextInput = await screen.findByDisplayValue('A');
        const firstCard = firstTextInput.closest('.p-4'); // Card usa className="p-4"
        expect(firstCard).toBeTruthy();
        const scoped = within(firstCard as HTMLElement);

        const textboxes = scoped.getAllByRole('textbox');
        const numberInput = scoped.getByRole('spinbutton');
        // Ordem dos campos: text (0), imageUrl (1), category (2)
        await act(async () => {
            fireEvent.change(textboxes[1], { target: { value: 'https://example.com/img.jpg' } });
            fireEvent.change(numberInput, { target: { value: '42' } });
            fireEvent.change(textboxes[2], { target: { value: 'Z' } });
        });

        // Preview
        const img = await screen.findByAltText('preview');
        expect((img as HTMLImageElement).src).toContain('https://example.com/img.jpg');
        expect(screen.getByTestId('preview')).toHaveTextContent('Cat: Z');
        expect(screen.getByTestId('preview')).toHaveTextContent('Pontos: 42');

        // Estado content.options
        const state = screen.getByTestId('state').textContent || '';
        const parsed = JSON.parse(state);
        expect(parsed.imageUrl).toBe('https://example.com/img.jpg');
        expect(parsed.points).toBe(42);
        expect(parsed.category).toBe('Z');
    });

    it('quiz-options: edita imageUrl/points/category e reflete no preview + content.options', async () => {
        render(<QuizOptionsWrapper />);

        const valueOnes = await screen.findAllByDisplayValue('1');
        const firstTextInput = valueOnes.find((el) => (el as HTMLInputElement).getAttribute('type') === 'text') as HTMLElement;
        expect(firstTextInput).toBeTruthy();
        const firstCard = firstTextInput.closest('.p-4');
        expect(firstCard).toBeTruthy();
        const scoped = within(firstCard as HTMLElement);
        const textboxes = scoped.getAllByRole('textbox');
        const numberInput = scoped.getByRole('spinbutton');
        await act(async () => {
            fireEvent.change(textboxes[1], { target: { value: 'https://example.com/pic.png' } });
            fireEvent.change(numberInput, { target: { value: '7' } });
            fireEvent.change(textboxes[2], { target: { value: 'A' } });
        });

        const img = await screen.findByAltText('preview-qo');
        expect((img as HTMLImageElement).src).toContain('https://example.com/pic.png');
        expect(screen.getByTestId('preview-quiz-options')).toHaveTextContent('Cat: A');
        expect(screen.getByTestId('preview-quiz-options')).toHaveTextContent('Pontos: 7');

        const state = screen.getByTestId('state-qo').textContent || '';
        const parsed = JSON.parse(state);
        expect(parsed.imageUrl).toBe('https://example.com/pic.png');
        expect(parsed.points).toBe(7);
        expect(parsed.category).toBe('A');
    });

    it('options-grid: carrega valores via aliases (label/image/score) nos campos', async () => {
        const AliasWrapper: React.FC = () => {
            const [block] = React.useState<any>({
                id: 'b-alias-grid',
                type: 'options-grid',
                order: 0,
                properties: { columns: 2, showImages: true },
                content: {
                    options: [
                        { id: 'o1', label: 'AliasText', image: 'https://img/1.png', score: 5, category: 'K' },
                    ],
                },
            });
            const step = { id: 'sAlias', type: 'question', order: 1, blocks: [block] } as any;
            return (
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
                    onBlockPatch={() => { }}
                    isOfferStep={false}
                    OfferMapComponent={() => null as any}
                    onOfferMapUpdate={() => { }}
                    ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                    onApplyTheme={() => { }}
                />
            );
        };

        render(<AliasWrapper />);
        const textInput = await screen.findByDisplayValue('AliasText');
        expect(textInput).toBeTruthy();
        const card = textInput.closest('.p-4') as HTMLElement;
        const scoped = within(card);
        const urlInput = scoped.getAllByRole('textbox')[1] as HTMLInputElement;
        const numberInput = scoped.getByRole('spinbutton') as HTMLInputElement;
        const categoryInput = scoped.getAllByRole('textbox')[2] as HTMLInputElement;
        expect(urlInput.value).toBe('https://img/1.png');
        expect(numberInput.value).toBe('5');
        expect(categoryInput.value).toBe('K');
    });
});

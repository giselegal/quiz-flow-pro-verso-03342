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
        id: 'b-qh',
        type: 'question-hero',
        order: 0,
        properties: {
            title: 'P1 - Escolhas',
            subtitle: 'Escolha uma opção',
            questionNumber: 1,
            totalQuestions: 10,
            showProgress: true,
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

describe('PropertiesPanel UX (question-hero)', () => {
    it('edita título/subtítulo, número/total e showProgress', async () => {
        render(<PanelWrapper />);

        // Abrir grupo Conteúdo
        const contentTrigger = await screen.findByText(/Conteúdo|Content/i);
        await act(async () => { fireEvent.click(contentTrigger); });

        // Editar título e subtítulo pelos campos canônicos (title/subtitle)
        const titleContainer = document.querySelector('[data-field-key="title"]') as HTMLElement;
        const titulo = titleContainer.querySelector('input') as HTMLInputElement;
        await act(async () => { fireEvent.change(titulo, { target: { value: 'Pergunta 1 - Preferências' } }); });

        const subtitleContainer = document.querySelector('[data-field-key="subtitle"]') as HTMLElement;
        const subtitulo = subtitleContainer.querySelector('input') as HTMLInputElement;
        await act(async () => { fireEvent.change(subtitulo, { target: { value: 'Escolha o que mais combina com você' } }); });

        // Números
        const numberContainer = document.querySelector('[data-field-key="questionNumber"]') as HTMLElement;
        const numero = numberContainer.querySelector('input') as HTMLInputElement;
        await act(async () => { fireEvent.change(numero, { target: { value: '3' } }); });

        const totalContainer = document.querySelector('[data-field-key="totalQuestions"]') as HTMLElement;
        const total = totalContainer.querySelector('input') as HTMLInputElement;
        await act(async () => { fireEvent.change(total, { target: { value: '13' } }); });

        // showProgress
        // Abrir grupo Layout para exibir o switch
        const layoutTrigger = await screen.findByText(/Layout/i);
        await act(async () => { fireEvent.click(layoutTrigger); });
        const progressContainer = document.querySelector('[data-field-key="showProgress"]') as HTMLElement;
        const showProgress = progressContainer.querySelector('[role="switch"]') as HTMLElement;
        await act(async () => { fireEvent.click(showProgress); });

        const propsState = screen.getByTestId('props-state').textContent || '{}';
        const props = JSON.parse(propsState);

        expect(props.title).toBe('Pergunta 1 - Preferências');
        expect(props.subtitle).toBe('Escolha o que mais combina com você');
        expect(props.questionNumber).toBe(3);
        expect(props.totalQuestions).toBe(13);
        expect(props.showProgress).toBe(false); // estava true, clicamos para alternar
    });
});

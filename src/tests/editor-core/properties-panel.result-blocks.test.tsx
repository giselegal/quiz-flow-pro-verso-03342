import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PropertiesPanel } from '@/components/editor/quiz/components/PropertiesPanel';
import ResultHeaderBlock from '@/components/editor/blocks/atomic/ResultHeaderBlock';
import ResultDescriptionBlock from '@/components/editor/blocks/atomic/ResultDescriptionBlock';
import ResultCTABlock from '@/components/editor/blocks/atomic/ResultCTABlock';
import ResultImageBlock from '@/components/editor/blocks/atomic/ResultImageBlock';

function WrapperHeaderTest() {
    const [block, setBlock] = React.useState<any>({
        id: 'b1',
        type: 'result-header',
        order: 0,
        properties: {
            title: 'Seu Estilo Predominante é:',
            subtitle: 'Baseado nas suas respostas',
            emoji: '🎉',
            titleColor: '#5b4135',
            subtitleColor: '#8F7A6A',
            textAlign: 'center',
        },
        content: {},
    });
    const step = { id: 's20', type: 'result', order: 20, blocks: [block] } as any;

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
                    // Aplicar patch nas propriedades (para result-header usamos properties.title)
                    setBlock((prev: any) => ({ ...prev, properties: { ...prev.properties, ...patch } }));
                }}
                isOfferStep={false}
                OfferMapComponent={() => null as any}
                onOfferMapUpdate={() => { }}
                ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                onApplyTheme={() => { }}
            />

            <div data-testid="preview">
                <ResultHeaderBlock block={block} isSelected={false} onClick={() => { }} />
            </div>
        </div>
    );
}

function WrapperDescriptionTest() {
    const [block, setBlock] = React.useState<any>({
        id: 'b2',
        type: 'result-description',
        order: 1,
        properties: { fontSize: 'base', color: '#5b4135', textAlign: 'left' },
        content: { text: 'Descrição do seu estilo principal' },
    });
    const step = { id: 's20', type: 'result', order: 20, blocks: [block] } as any;

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
                    // Para result-description, o componente lê content.text → aplicar em content
                    setBlock((prev: any) => ({ ...prev, content: { ...prev.content, ...patch } }));
                }}
                isOfferStep={false}
                OfferMapComponent={() => null as any}
                onOfferMapUpdate={() => { }}
                ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                onApplyTheme={() => { }}
            />

            <div data-testid="preview">
                <ResultDescriptionBlock block={block} isSelected={false} onClick={() => { }} />
            </div>
        </div>
    );
}


describe('PropertiesPanel → Result blocks quick edit', () => {
    it('edita título do result-header e reflete no preview', async () => {
        render(<WrapperHeaderTest />);

        // Busca pelo valor inicial do campo (fallback do schema do editor)
        const input = await screen.findByDisplayValue(/Seu Estilo Predominante é:/);
        expect(input).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(input, { target: { value: 'Meu Título Editado' } });
        });

        // Preview deve conter o novo título
        expect(screen.getByTestId('preview')).toHaveTextContent('Meu Título Editado');
    });

    it('edita texto do result-description e reflete no preview', async () => {
        render(<WrapperDescriptionTest />);

        // Busca pelo valor inicial do campo de texto (conteúdo inicial)
        const textarea = await screen.findByDisplayValue('Descrição do seu estilo principal');
        expect(textarea).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(textarea, { target: { value: 'Nova descrição detalhada' } });
        });

        // Preview deve conter a nova descrição
        expect(screen.getByTestId('preview')).toHaveTextContent('Nova descrição detalhada');
    });

    it('edita texto do botão no result-cta e reflete no preview', async () => {
        function WrapperCTATest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b3',
                type: 'result-cta',
                order: 2,
                properties: { text: 'Ver Recomendações', backgroundColor: '#B89B7A', textColor: '#FFFFFF', size: 'lg' },
                content: {},
            });
            const step = { id: 's20', type: 'result', order: 20, blocks: [block] } as any;

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
                            // result-cta lê properties.text
                            setBlock((prev: any) => ({ ...prev, properties: { ...prev.properties, ...patch } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-cta">
                        <ResultCTABlock block={block} isSelected={false} onClick={() => { }} />
                    </div>
                </div>
            );
        }

        render(<WrapperCTATest />);

        // Campo inicial com texto do botão
        const input = await screen.findByDisplayValue('Ver Recomendações');
        expect(input).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(input, { target: { value: 'Ir para Oferta' } });
        });

        // Preview deve refletir o texto do botão
        expect(screen.getByTestId('preview-cta')).toHaveTextContent('Ir para Oferta');
    });

    it('edita URL e alt do result-image e reflete no preview', async () => {
        function WrapperImageTest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b4',
                type: 'result-image',
                order: 3,
                properties: { url: 'https://example.com/old.png', alt: 'Imagem do resultado', borderRadius: '12px', maxHeight: '400px' },
                content: {},
            });
            const step = { id: 's20', type: 'result', order: 20, blocks: [block] } as any;

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
                            // result-image lê properties.url e properties.alt
                            setBlock((prev: any) => ({ ...prev, properties: { ...prev.properties, ...patch } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-image">
                        <ResultImageBlock block={block} isSelected={false} onClick={() => { }} />
                    </div>
                </div>
            );
        }

        render(<WrapperImageTest />);

        // Inicialmente já deve renderizar a imagem antiga
        let img = screen.getByTestId('preview-image').querySelector('img');
        expect(img).not.toBeNull();
        expect(img?.getAttribute('src')).toBe('https://example.com/old.png');

        // Abrir campo de URL manual do ImageUploadField
        const toggleManualUrl = screen.getByTitle('Inserir URL manualmente');
        await act(async () => {
            fireEvent.click(toggleManualUrl);
        });

        // Atualiza URL da imagem
        const urlInput = await screen.findByDisplayValue('https://example.com/old.png');

        await act(async () => {
            fireEvent.change(urlInput as HTMLElement, { target: { value: 'https://example.com/image.png' } });
        });

        // Atualiza alt
        const altInput = await screen.findByLabelText(/Alternativo|Alt|Texto Alternativo/i).catch(async () => {
            return await screen.findByDisplayValue('Imagem do resultado');
        });
        await act(async () => {
            fireEvent.change(altInput as HTMLElement, { target: { value: 'Foto de resultado' } });
        });

        // Deve renderizar <img> no preview com src e alt atualizados
        img = screen.getByTestId('preview-image').querySelector('img');
        expect(img).not.toBeNull();
        expect(img?.getAttribute('src')).toBe('https://example.com/image.png');
        expect(img?.getAttribute('alt')).toBe('Foto de resultado');
    });
});

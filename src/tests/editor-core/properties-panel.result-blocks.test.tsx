import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PropertiesPanel } from '@/components/editor/quiz/components/PropertiesPanel';
import ResultHeaderBlock from '@/components/editor/blocks/atomic/ResultHeaderBlock';
import ResultDescriptionBlock from '@/components/editor/blocks/atomic/ResultDescriptionBlock';
import ResultCTABlock from '@/components/editor/blocks/atomic/ResultCTABlock';
import ResultImageBlock from '@/components/editor/blocks/atomic/ResultImageBlock';
import ResultProgressBarsBlock from '@/components/editor/blocks/ResultProgressBarsBlock';
import ResultStyleBlock from '@/components/editor/blocks/atomic/ResultStyleBlock';
import ResultMainBlock from '@/components/editor/blocks/atomic/ResultMainBlock';
import ResultCharacteristicsBlock from '@/components/editor/blocks/atomic/ResultCharacteristicsBlock';
import ResultSecondaryStylesBlock from '@/components/editor/blocks/atomic/ResultSecondaryStylesBlock';
import ResultShareBlock from '@/components/editor/blocks/atomic/ResultShareBlock';
import { initializeSchemaRegistry } from '@/config/schemas';

beforeAll(() => {
    // Garante que os schemas result-* estejam registrados para o Properties Panel
    initializeSchemaRegistry();
});

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

    it('edita título, showTop3 e cor das barras no result-progress-bars', async () => {
        function WrapperProgressBarsTest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b5',
                type: 'result-progress-bars',
                order: 4,
                properties: { title: 'Compatibilidade com estilos:', showTop3: true, barColor: '#00ff00', marginBottom: '8' },
                content: {
                    scores: [
                        { name: 'A', score: 80 },
                        { name: 'B', score: 70 },
                        { name: 'C', score: 60 },
                        { name: 'D', score: 50 },
                        { name: 'E', score: 40 },
                    ]
                },
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
                            // result-progress-bars lê de properties
                            setBlock((prev: any) => ({ ...prev, properties: { ...prev.properties, ...patch } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-bars">
                        <ResultProgressBarsBlock properties={block.properties} content={block.content} />
                    </div>
                </div>
            );
        }

        render(<WrapperProgressBarsTest />);

        // Verifica título inicial
        expect(screen.getByTestId('preview-bars')).toHaveTextContent('Compatibilidade com estilos:');

        // Atualiza título
        const titleInput = await screen.findByDisplayValue('Compatibilidade com estilos:');
        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Compatibilidade Top 5' } });
        });
        expect(screen.getByTestId('preview-bars')).toHaveTextContent('Compatibilidade Top 5');

        // Alterna showTop3 para false (deve mostrar 5 barras)
        const checkbox = screen.getByLabelText(/Exibir apenas Top 3|Top 3/i);
        await act(async () => {
            fireEvent.click(checkbox);
        });
        // Conta as barras internas (div que tem width:% e backgroundColor)
        let bars = screen.getByTestId('preview-bars').querySelectorAll('div[style*="width:"]');
        expect(bars.length).toBeGreaterThanOrEqual(5);

        // Atualiza cor das barras
        const colorInput = screen.getByDisplayValue('#00ff00');
        await act(async () => {
            fireEvent.change(colorInput, { target: { value: '#ff0000' } });
        });

        // Verifica que as barras refletem a nova cor
        bars = screen.getByTestId('preview-bars').querySelectorAll('div[style*="background-color:"]');
        expect(Array.from(bars).some((el) => (el as HTMLElement).style.backgroundColor === '#ff0000')).toBe(true);
    });

    it('altera cor em result-style e reflete nas barras de progresso', async () => {
        function WrapperResultStyleTest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b6',
                type: 'result-style',
                order: 5,
                properties: {},
                content: { color: '#00aaee' },
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
                            // Mapear campo de schema 'color' para content.color do bloco
                            if (typeof patch.color === 'string') {
                                setBlock((prev: any) => ({ ...prev, content: { ...prev.content, color: patch.color } }));
                                return;
                            }
                            setBlock((prev: any) => ({ ...prev, content: { ...prev.content, ...patch } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-style">
                        <ResultStyleBlock block={block} isSelected={false} onClick={() => { }} />
                    </div>
                </div>
            );
        }

        render(<WrapperResultStyleTest />);

        // Muda a cor e valida nas barras internas
        const colorInput = await screen.findByDisplayValue('#00aaee');
        await act(async () => {
            fireEvent.change(colorInput, { target: { value: '#ff00ff' } });
        });

        const bars = screen.getByTestId('preview-style').querySelectorAll('div[style*="background-color:"]');
        expect(Array.from(bars).some((el) => (el as HTMLElement).style.backgroundColor === '#ff00ff')).toBe(true);
    });

    it('edita styleName no result-main e reflete no preview', async () => {
        function WrapperResultMainTest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b7',
                type: 'result-main',
                order: 6,
                properties: {},
                content: { userName: 'Você', styleName: 'Estilo Dominante', percentage: '85%', backgroundColor: '#F5EDE4', textColor: '#5b4135', accentColor: '#B89B7A', showCelebration: true },
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
                            // Mapear campos do schema de properties para content lido pelo componente
                            const mapped: any = { ...patch };
                            if (patch.styleName !== undefined) mapped.styleName = patch.styleName;
                            if (patch.backgroundColor !== undefined) mapped.backgroundColor = patch.backgroundColor;
                            setBlock((prev: any) => ({ ...prev, content: { ...prev.content, ...mapped } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-main">
                        <ResultMainBlock block={block} isSelected={false} onClick={() => { }} />
                    </div>
                </div>
            );
        }

        render(<WrapperResultMainTest />);

        // Atualiza o nome do estilo
        const styleNameInput = await screen.findByDisplayValue('Estilo Dominante');
        await act(async () => {
            fireEvent.change(styleNameInput, { target: { value: 'Estilo Premium' } });
        });
        expect(screen.getByTestId('preview-main')).toHaveTextContent('Estilo Premium');
    });

    it('adiciona característica em result-characteristics e reflete no preview', async () => {
        function WrapperResultCharacteristicsTest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b8',
                type: 'result-characteristics',
                order: 7,
                properties: { title: 'Características', items: [] },
                content: { items: ['Confortável', 'Versátil'] },
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
                            if (Array.isArray(patch.items)) {
                                setBlock((prev: any) => ({ ...prev, content: { ...prev.content, items: patch.items } }));
                                return;
                            }
                            setBlock((prev: any) => ({ ...prev, properties: { ...prev.properties, ...patch } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-characteristics">
                        <ResultCharacteristicsBlock block={block} isSelected={false} onClick={() => { }} />
                    </div>
                </div>
            );
        }

        render(<WrapperResultCharacteristicsTest />);
        // Preview inicial com 2 itens
        expect(screen.getByTestId('preview-characteristics')).toHaveTextContent('Confortável');
        expect(screen.getByTestId('preview-characteristics')).toHaveTextContent('Versátil');

        // Adiciona item e edita texto
        const addButton = await screen.findByText(/Adicionar item/i);
        await act(async () => { fireEvent.click(addButton); });
        const inputs = screen.getAllByPlaceholderText('Item');
        const last = inputs[inputs.length - 1];
        await act(async () => {
            fireEvent.change(last, { target: { value: 'Elegante' } });
        });

        // Preview deve conter o novo item
        expect(screen.getByTestId('preview-characteristics')).toHaveTextContent('Elegante');
    });

    it('adiciona estilo em result-secondary-styles e reflete no preview', async () => {
        function WrapperSecondaryStylesTest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b9',
                type: 'result-secondary-styles',
                order: 8,
                properties: { title: 'Outros Estilos', styles: [] },
                content: {
                    styles: [
                        { name: 'Clássico', percentage: '40%' },
                        { name: 'Romântico', percentage: '35%' },
                    ], backgroundColor: '#FFFFFF', borderColor: '#E5D5C3'
                },
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
                            // Transformar options-list do editor (array de {text}) -> content.styles esperado { name, percentage }
                            if (Array.isArray((patch as any).styles)) {
                                const mapped = (patch as any).styles.map((it: any) => ({ name: it.text || String(it), percentage: '50%' }));
                                setBlock((prev: any) => ({ ...prev, content: { ...prev.content, styles: mapped } }));
                                return;
                            }
                            setBlock((prev: any) => ({ ...prev, properties: { ...prev.properties, ...patch } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-secondary-styles">
                        <ResultSecondaryStylesBlock block={block} isSelected={false} onClick={() => { }} />
                    </div>
                </div>
            );
        }

        render(<WrapperSecondaryStylesTest />);
        // Confirmar itens iniciais
        expect(screen.getByTestId('preview-secondary-styles')).toHaveTextContent('Clássico');
        expect(screen.getByTestId('preview-secondary-styles')).toHaveTextContent('Romântico');

        // Adicionar novo estilo via options-list
        const addButton = await screen.findByText(/Adicionar item/i);
        await act(async () => { fireEvent.click(addButton); });
        const inputs = screen.getAllByPlaceholderText('Item');
        const last = inputs[inputs.length - 1];
        await act(async () => {
            fireEvent.change(last, { target: { value: 'Criativo' } });
        });

        expect(screen.getByTestId('preview-secondary-styles')).toHaveTextContent('Criativo');
    });

    it('edita título e plataformas em result-share e reflete no preview', async () => {
        function WrapperResultShareTest() {
            const [block, setBlock] = React.useState<any>({
                id: 'b10',
                type: 'result-share',
                order: 9,
                properties: { title: 'Compartilhe seu resultado', platforms: ['facebook', 'twitter'], message: 'Confira!' },
                content: { title: 'Compartilhe seu resultado', platforms: ['facebook', 'twitter'], message: 'Confira!' },
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
                            const nextContent: any = { ...block.content };
                            if (typeof (patch as any).title === 'string') nextContent.title = (patch as any).title;
                            if (typeof (patch as any).message === 'string') nextContent.message = (patch as any).message;
                            if (Array.isArray((patch as any).platforms)) {
                                // options-list simples devolve [{text}], converter para array de strings
                                nextContent.platforms = (patch as any).platforms.map((it: any) => it.text || String(it)).filter(Boolean);
                            }
                            setBlock((prev: any) => ({ ...prev, content: nextContent, properties: { ...prev.properties, ...patch } }));
                        }}
                        isOfferStep={false}
                        OfferMapComponent={() => null as any}
                        onOfferMapUpdate={() => { }}
                        ThemeEditorPanel={({ onApply }: any) => (<button onClick={() => onApply({})}>apply</button>)}
                        onApplyTheme={() => { }}
                    />

                    <div data-testid="preview-share">
                        <ResultShareBlock block={block} isSelected={false} onClick={() => { }} />
                    </div>
                </div>
            );
        }

        render(<WrapperResultShareTest />);

        // Atualiza título
        const titleInput = await screen.findByDisplayValue('Compartilhe seu resultado');
        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Compartilhe com seus amigos' } });
        });
        expect(screen.getByTestId('preview-share')).toHaveTextContent('Compartilhe com seus amigos');

        // Adiciona plataforma via options-list
        const addButton = await screen.findAllByText(/Adicionar item/i);
        await act(async () => { fireEvent.click(addButton[addButton.length - 1]); });
        const inputs = screen.getAllByPlaceholderText('Item');
        const last = inputs[inputs.length - 1];
        await act(async () => {
            fireEvent.change(last, { target: { value: 'whatsapp' } });
        });

        // Preview deve conter o botão "WhatsApp"
        expect(screen.getByTestId('preview-share')).toHaveTextContent('WhatsApp');
    });
});

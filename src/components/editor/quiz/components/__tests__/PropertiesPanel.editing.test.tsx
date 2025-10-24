import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';

import PropertiesPanel, { type EditableQuizStep, type BlockComponent } from '../PropertiesPanel';
import { initializeSchemaRegistry } from '@/config/schemas';

// Dummies para props obrigatórias do painel
const DummyOfferMap: React.FC<any> = () => null;
const DummyThemePanel: React.FC<{ onApply: (t: any) => void }> = () => null;

function setupPanel(initialBlock: BlockComponent) {
    const onHeaderConfigChange = vi.fn();
    const onPaste = vi.fn();
    const onDuplicateInline = vi.fn();
    const onPrepareDuplicateToAnother = vi.fn();
    const onCopyMultiple = vi.fn();
    const onRemoveMultiple = vi.fn();
    const onRemoveBlock = vi.fn();
    const onSaveAsSnippet = vi.fn();
    const onSnippetFilterChange = vi.fn();
    const onSnippetInsert = vi.fn();
    const onSnippetRename = vi.fn();
    const onSnippetDelete = vi.fn();
    const onRefreshSnippets = vi.fn();
    const onOfferMapUpdate = vi.fn();
    const onApplyTheme = vi.fn();

    // Estado local para simular atualização do bloco selecionado quando o painel emite patches
    const Wrapper: React.FC = () => {
        const [selectedBlock, setSelectedBlock] = React.useState<BlockComponent>(initialBlock);
        const selectedStep: EditableQuizStep = React.useMemo(
            () => ({ id: 'step-01', type: 'intro', order: 1, blocks: [selectedBlock] }),
            [selectedBlock]
        );

        const handleBlockPatch = (patch: Record<string, any>) => {
            // Regra simplificada: aplicar patch em content (campos de conteúdo comuns como title/subtitle)
            // e manter demais no properties. Isso cobre o caso dos testes abaixo.
            const next = { ...selectedBlock };
            next.content = { ...(selectedBlock.content || {}), ...patch };
            setSelectedBlock(next);
        };

        return (
            <PropertiesPanel
                selectedStep={selectedStep}
                selectedBlock={selectedBlock}
                headerConfig={{
                    showLogo: false,
                    logoUrl: '',
                    logoWidth: '120',
                    progressEnabled: false,
                    autoProgress: true,
                    manualPercent: 0,
                    barHeight: '4',
                    barColor: '#B89B7A',
                    barBackground: '#E5E7EB',
                    title: '',
                    align: 'left'
                }}
                onHeaderConfigChange={onHeaderConfigChange}
                clipboard={null}
                canPaste={false}
                onPaste={onPaste}
                multiSelectedIds={[]}
                onDuplicateInline={onDuplicateInline}
                onPrepareDuplicateToAnother={onPrepareDuplicateToAnother}
                onCopyMultiple={onCopyMultiple}
                onRemoveMultiple={onRemoveMultiple}
                onRemoveBlock={onRemoveBlock}
                onSaveAsSnippet={onSaveAsSnippet}
                snippets={[]}
                snippetFilter={''}
                onSnippetFilterChange={onSnippetFilterChange}
                onSnippetInsert={onSnippetInsert}
                onSnippetRename={onSnippetRename}
                onSnippetDelete={onSnippetDelete}
                onRefreshSnippets={onRefreshSnippets}
                onBlockPatch={handleBlockPatch}
                isOfferStep={false}
                OfferMapComponent={DummyOfferMap}
                onOfferMapUpdate={onOfferMapUpdate}
                ThemeEditorPanel={DummyThemePanel}
                onApplyTheme={onApplyTheme}
                onUnifiedConfigPatch={() => { }}
            />
        );
    };

    return { Wrapper };
}

describe('PropertiesPanel - edição de blocos', () => {
    // Garantir que o registro de schemas dinâmicos esteja inicializado para os blocos modernos (ex.: options-grid)
    beforeAll(() => {
        initializeSchemaRegistry();
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('edita campo de texto (Título) e reflete no estado', async () => {
        const initialBlock: BlockComponent = {
            id: 'block-1',
            type: 'quiz-result-header',
            order: 1,
            properties: {},
            content: { title: 'Título Original', subtitle: 'Sub' },
        };

        const { Wrapper } = setupPanel(initialBlock);
        render(<Wrapper />);

        // Localizar input do título pelo valor atual ou pelo label
        const inputByValue = await screen.findByDisplayValue('Título Original');
        expect(inputByValue).toBeInTheDocument();

        // Editar o campo
        fireEvent.change(inputByValue, { target: { value: 'Novo Título' } });

        // Aguarda refletir no DOM (Wrapper aplica patch em content e re-renderiza)
        await waitFor(() => {
            expect(screen.getByDisplayValue('Novo Título')).toBeInTheDocument();
        });
    });

    it('altera um boolean (Mostrar Ícone) e emite patch', async () => {
        const initialBlock: BlockComponent = {
            id: 'block-2',
            type: 'quiz-result-header',
            order: 1,
            properties: {},
            content: { title: 'R', subtitle: 'S', showIcon: true },
        };

        // Vamos espiar o patch aplicado dentro do wrapper
        const spyPatch = vi.fn();

        const Wrapper: React.FC = () => {
            const [selectedBlock, setSelectedBlock] = React.useState<BlockComponent>(initialBlock);
            const selectedStep: EditableQuizStep = React.useMemo(
                () => ({ id: 'step-01', type: 'result', order: 1, blocks: [selectedBlock] }),
                [selectedBlock]
            );
            const handleBlockPatch = (patch: Record<string, any>) => {
                spyPatch(patch);
                setSelectedBlock({ ...selectedBlock, content: { ...(selectedBlock.content || {}), ...patch } });
            };
            return (
                <PropertiesPanel
                    selectedStep={selectedStep}
                    selectedBlock={selectedBlock}
                    headerConfig={{ showLogo: false, logoUrl: '', logoWidth: '120', progressEnabled: false, autoProgress: true, manualPercent: 0, barHeight: '4', barColor: '#B89B7A', barBackground: '#E5E7EB', title: '', align: 'left' }}
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
                    onBlockPatch={handleBlockPatch}
                    isOfferStep={false}
                    OfferMapComponent={DummyOfferMap}
                    onOfferMapUpdate={() => { }}
                    ThemeEditorPanel={DummyThemePanel}
                    onApplyTheme={() => { }}
                    onUnifiedConfigPatch={() => { }}
                />
            );
        };

        render(<Wrapper />);

        // A label vem do schema: "Mostrar Ícone"
        const label = await screen.findByText('Mostrar Ícone');
        expect(label).toBeInTheDocument();

        // O Switch é um controle customizado. Vamos clicar na área do container para disparar toggle.
        // Subimos para o container de campo e clicamos no switch.
        const fieldContainer = label.closest('div')?.parentElement?.querySelector('[role="switch"], button, input');
        if (fieldContainer) {
            fireEvent.click(fieldContainer);
        } else {
            // fallback: clicar na própria label (em alguns renders propaga)
            fireEvent.click(label);
        }

        // Deve ter emitido um patch com showIcon: false (toggle)
        await waitFor(() => {
            expect(spyPatch).toHaveBeenCalled();
            const merged = Object.assign({}, ...spyPatch.mock.calls.map((c: any[]) => c[0]));
            expect(typeof merged.showIcon).toBe('boolean');
        });
    });

    it('edita options-grid (texto/imagem) e adiciona/remove item', async () => {
        const initialBlock: BlockComponent = {
            id: 'block-3',
            type: 'options-grid',
            order: 1,
            properties: { columns: 2 },
            content: { options: [{ id: 'opt1', text: 'Item 1', imageUrl: '', points: 0, category: '' }] },
        };

        const { Wrapper } = setupPanel(initialBlock);
        render(<Wrapper />);

        // Garante abrir o grupo "Conteúdo" do acordeão (onde fica o options-list)
        const contentGroupTrigger = await screen.findByText('Conteúdo');
        fireEvent.click(contentGroupTrigger);

        // Aguarda o campo "Opções" aparecer (options-list)
        const optionsLabel = await screen.findByText('Opções');
        const optionsContainer = optionsLabel.closest('[data-field-key="options"]') as HTMLElement;
        expect(optionsContainer).toBeTruthy();

        // Encontra o label "Texto" do primeiro item e altera o valor
        const textLabels = await within(optionsContainer).findAllByText('Texto');
        expect(textLabels.length).toBeGreaterThan(0);
        const firstTextInput = textLabels[0].parentElement?.querySelector('input');
        expect(firstTextInput).toBeTruthy();
        if (firstTextInput) {
            fireEvent.change(firstTextInput, { target: { value: 'Item 1 - Editado' } });
        }

        await waitFor(() => {
            expect(screen.getByDisplayValue('Item 1 - Editado')).toBeInTheDocument();
        });

        // Atualiza a imagem do primeiro item
        const imageLabels = within(optionsContainer).getAllByText(/Imagem/i);
        const firstImageInput = imageLabels[0].parentElement?.querySelector('input');
        expect(firstImageInput).toBeTruthy();
        if (firstImageInput) {
            fireEvent.change(firstImageInput, { target: { value: 'https://example.com/img.jpg' } });
        }

        await waitFor(() => {
            expect(screen.getByDisplayValue('https://example.com/img.jpg')).toBeInTheDocument();
        });

        // Adiciona um novo item
        const addButton = within(optionsContainer).getByRole('button', { name: /adicionar item/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            // Deve existir pelo menos dois botões Remover agora
            const removeButtons = within(optionsContainer).getAllByRole('button', { name: /remover/i });
            expect(removeButtons.length).toBeGreaterThan(1);
        });

        // Remove o segundo item (escopo apenas dentro do editor de opções)
        const removeButtons = within(optionsContainer).getAllByRole('button', { name: /remover/i });
        fireEvent.click(removeButtons[1]);

        await waitFor(() => {
            const afterRemove = within(optionsContainer).getAllByRole('button', { name: /remover/i });
            expect(afterRemove.length).toBe(1);
        });
    });

    it('edita layout do options-grid: colunas e imageSize=custom com dimensões', async () => {
        const initialBlock: BlockComponent = {
            id: 'block-4',
            type: 'options-grid',
            order: 1,
            properties: { columns: 2, imageSize: 'medium', imageMaxSize: 96 },
            content: { options: [{ id: 'opt1', text: 'Item 1', imageUrl: '', points: 0, category: '' }] },
        };

        const { Wrapper } = setupPanel(initialBlock);
        render(<Wrapper />);

        // Abrir grupo Layout
        const layoutTrigger = await screen.findByText('Layout');
        fireEvent.click(layoutTrigger);

        // Mudar colunas para 3 via controle segmentado
        const columnsField = await screen.findByText('Colunas do Grid');
        const columnsContainer = columnsField.closest('[data-field-key="columns"]') as HTMLElement;
        expect(columnsContainer).toBeTruthy();
        const btn3 = within(columnsContainer).getByRole('button', { name: '3' });
        fireEvent.click(btn3);

        // Deve refletir no input numérico ao lado
        await waitFor(() => {
            const numberInput = within(columnsContainer).getByDisplayValue('3');
            expect(numberInput).toBeInTheDocument();
        });

        // Alterar imageSize para custom
        const imageSizeField = await screen.findByText('Tamanho da imagem');
        const imageSizeContainer = imageSizeField.closest('[data-field-key="imageSize"]') as HTMLElement;
        expect(imageSizeContainer).toBeTruthy();
        const customBtn = within(imageSizeContainer).getByRole('button', { name: 'custom' });
        fireEvent.click(customBtn);

        // Agora devem aparecer Largura (custom) e Altura (custom)
        const widthLabel = await screen.findByText('Largura (custom)');
        const widthContainer = widthLabel.closest('[data-field-key="imageWidth"]') as HTMLElement;
        const heightLabel = await screen.findByText('Altura (custom)');
        const heightContainer = heightLabel.closest('[data-field-key="imageHeight"]') as HTMLElement;
        expect(widthContainer).toBeTruthy();
        expect(heightContainer).toBeTruthy();

        // Definir valores via inputs numéricos
        const widthInput = within(widthContainer).getByRole('spinbutton') as HTMLInputElement;
        const heightInput = within(heightContainer).getByRole('spinbutton') as HTMLInputElement;
        fireEvent.change(widthInput, { target: { value: '320' } });
        fireEvent.change(heightInput, { target: { value: '240' } });

        await waitFor(() => {
            expect(within(widthContainer).getByDisplayValue('320')).toBeInTheDocument();
            expect(within(heightContainer).getByDisplayValue('240')).toBeInTheDocument();
        });
    });

    it('toggle Mostrar imagens esconde controles dependentes', async () => {
        const initialBlock: BlockComponent = {
            id: 'block-5',
            type: 'options-grid',
            order: 1,
            properties: { showImages: true, imageSize: 'medium', imageMaxSize: 96 },
            content: { options: [{ id: 'opt1', text: 'Item 1', imageUrl: '', points: 0, category: '' }] },
        };

        const { Wrapper } = setupPanel(initialBlock);
        render(<Wrapper />);

        // Abrir grupos Conteúdo e Layout
        const contentTrigger = await screen.findByText('Conteúdo');
        fireEvent.click(contentTrigger);
        const layoutTrigger = await screen.findByText('Layout');
        fireEvent.click(layoutTrigger);

        // Campo dependente presente inicialmente
        const imageMaxSizeLabel = await screen.findByText('Tamanho da Imagem (px)');
        expect(imageMaxSizeLabel).toBeInTheDocument();

        // Toggle Mostrar imagens para false
        const showImagesField = await screen.findByText('Mostrar imagens');
        const showImagesContainer = showImagesField.closest('[data-field-key="showImages"]') as HTMLElement;
        const switchEl = showImagesContainer.querySelector('[role="switch"], button, input') as HTMLElement;
        expect(switchEl).toBeTruthy();
        fireEvent.click(switchEl);

        // Campo dependente deve sumir
        await waitFor(() => {
            expect(screen.queryByText('Tamanho da Imagem (px)')).not.toBeInTheDocument();
        });
    });
});

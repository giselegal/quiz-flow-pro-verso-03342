/**
 * 🔍 TESTE DE DIAGNÓSTICO: Painel de Propriedades
 * 
 * Detecta por que o painel de propriedades não está funcionando
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SuperUnifiedProvider } from '@/contexts/providers/SuperUnifiedProviderV2';
import { UIProvider, useUI } from '@/contexts/providers/UIProvider';
import { useEditorContext } from '@/core/hooks/useEditorContext';
import type { Block } from '@/types/editor';
import React from 'react';

const baseBlocks: Block[] = [
    {
        id: 'block-test-123',
        type: 'text',
        order: 0,
        properties: { text: 'Hello World' },
        content: { text: 'Hello World' },
    },
    {
        id: 'block-abc',
        type: 'headline',
        order: 1,
        properties: { text: 'Title', level: 1 },
        content: { text: 'Title' },
    },
    {
        id: 'block-def',
        type: 'text',
        order: 2,
        properties: { text: 'Content' },
        content: { text: 'Content' },
    },
];

const Providers = ({ children }: { children: React.ReactNode }) => (
    <SuperUnifiedProvider>
        <UIProvider>{children}</UIProvider>
    </SuperUnifiedProvider>
);

const renderUnifiedHook = () => renderHook(() => useEditorContext(), { wrapper: Providers });
const renderUIHook = () => renderHook(() => useUI(), { wrapper: Providers });

const seedStepBlocks = (editor: ReturnType<typeof useEditorContext>['editor'], blocks: Block[] = baseBlocks) => {
    act(() => {
        editor.setStepBlocks(1, blocks);
    });
};

describe('🔍 Diagnóstico do Painel de Propriedades', () => {
    it('✅ DEVE ter estado showPropertiesPanel', () => {
        const { result } = renderUIHook();

        expect(result.current.state).toBeDefined();
        expect(result.current.state.showPropertiesPanel).toBeDefined();

        console.log('📊 Estado UI:', {
            showPropertiesPanel: result.current.state.showPropertiesPanel,
            showSidebar: result.current.state.showSidebar,
            activeModal: result.current.state.activeModal
        });
    });

    it('✅ DEVE ter selectedBlockId no estado do editor', () => {
        const { result } = renderUnifiedHook();
        const { editor } = result.current;

        expect(editor).toBeDefined();
        expect(editor.selectedBlockId).toBeDefined();

        console.log('📊 Estado Editor:', {
            selectedBlockId: editor.selectedBlockId,
            currentStep: editor.currentStep,
            stepBlocks: Object.keys(editor.stepBlocks)
        });
    });

    it('✅ DEVE permitir selecionar um bloco', () => {
        const { result } = renderUnifiedHook();
        const { editor } = result.current;

        seedStepBlocks(editor, baseBlocks);

        act(() => {
            editor.selectBlock('block-test-123');
        });

        expect(editor.selectedBlockId).toBe('block-test-123');

        console.log('✅ Bloco selecionado:', {
            selectedBlockId: editor.selectedBlockId,
            blocks: editor.stepBlocks[1]
        });
    });

    it('⚠️ DEVE identificar se setSelectedBlock está disponível no contexto', () => {
        const { result } = renderUnifiedHook();
        const { editor } = result.current;

        expect(editor.selectBlock).toBeDefined();
        expect(typeof editor.selectBlock).toBe('function');

        console.log('✅ Funções disponíveis no contexto:', {
            hasSelectBlock: !!editor.selectBlock,
            hasAddBlock: !!editor.addBlock,
            hasUpdateBlock: !!editor.updateBlock,
            hasRemoveBlock: !!editor.removeBlock,
            hasGetStepBlocks: !!editor.getStepBlocks
        });
    });

    it('❌ DEVE detectar se o PropertiesColumn está recebendo selectedBlock', async () => {
        const { result } = renderUnifiedHook();
        const { editor } = result.current;

        seedStepBlocks(editor, baseBlocks);

        act(() => {
            editor.selectBlock('block-abc');
        });

        const blocks = editor.getStepBlocks(1);
        const selectedBlockId = editor.selectedBlockId;
        const selectedBlock = blocks.find(block => block.id === selectedBlockId);

        console.log('🔍 DIAGNÓSTICO - Estado após seleção:', {
            selectedBlockId,
            hasSelectedBlock: !!selectedBlock,
            selectedBlockType: selectedBlock?.type,
            totalBlocks: blocks.length,
            blockIds: blocks.map(block => block.id)
        });

        // ✅ ASSERT: selectedBlock deve estar disponível
        expect(selectedBlock).toBeDefined();
        expect(selectedBlock?.id).toBe('block-abc');
        expect(selectedBlock?.type).toBe('headline');
    });
});

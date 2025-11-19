/**
 * 🔍 TESTE DE DIAGNÓSTICO: Painel de Propriedades
 * 
 * Detecta por que o painel de propriedades não está funcionando
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SuperUnifiedProvider, useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
import React from 'react';

describe('🔍 Diagnóstico do Painel de Propriedades', () => {
    it('✅ DEVE ter estado showPropertiesPanel', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider debugMode={true}>
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => useSuperUnified(), { wrapper });

        // ✅ ASSERT: Estado UI deve existir
        expect(result.current.state.ui).toBeDefined();
        expect(result.current.state.ui.showPropertiesPanel).toBeDefined();

        console.log('📊 Estado UI:', {
            showPropertiesPanel: result.current.state.ui.showPropertiesPanel,
            showSidebar: result.current.state.ui.showSidebar,
            activeModal: result.current.state.ui.activeModal
        });
    });

    it('✅ DEVE ter selectedBlockId no estado do editor', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider
                debugMode={true}
                initialData={{
                    id: 'test-funnel',
                    name: 'Test',
                    user_id: null,
                    pages: [{
                        id: 'page-1',
                        funnel_id: 'test-funnel',
                        page_type: 'quiz-step',
                        page_order: 1,
                        blocks: [{
                            id: 'block-1',
                            type: 'text',
                            properties: { text: 'Hello' }
                        }]
                    }]
                }}
            >
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => useSuperUnified(), { wrapper });

        // ✅ ASSERT: Estado do editor deve ter selectedBlockId
        expect(result.current.state.editor).toBeDefined();
        expect(result.current.state.editor.selectedBlockId).toBeDefined();

        console.log('📊 Estado Editor:', {
            selectedBlockId: result.current.state.editor.selectedBlockId,
            currentStep: result.current.state.editor.currentStep,
            stepBlocks: Object.keys(result.current.state.editor.stepBlocks)
        });
    });

    it('✅ DEVE permitir selecionar um bloco', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider
                debugMode={true}
                initialData={{
                    id: 'test-funnel',
                    name: 'Test',
                    user_id: null,
                    pages: [{
                        id: 'page-1',
                        funnel_id: 'test-funnel',
                        page_type: 'quiz-step',
                        page_order: 1,
                        blocks: [{
                            id: 'block-test-123',
                            type: 'text',
                            properties: { text: 'Hello World' }
                        }]
                    }]
                }}
            >
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => useSuperUnified(), { wrapper });

        // Selecionar bloco
        act(() => {
            result.current.setSelectedBlock('block-test-123');
        });

        // ✅ ASSERT: selectedBlockId deve ser atualizado
        expect(result.current.state.editor.selectedBlockId).toBe('block-test-123');

        console.log('✅ Bloco selecionado:', {
            selectedBlockId: result.current.state.editor.selectedBlockId,
            blocks: result.current.state.editor.stepBlocks[1]
        });
    });

    it('⚠️ DEVE identificar se setSelectedBlock está disponível no contexto', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider debugMode={true}>
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => useSuperUnified(), { wrapper });

        // ✅ ASSERT: setSelectedBlock deve existir
        expect(result.current.setSelectedBlock).toBeDefined();
        expect(typeof result.current.setSelectedBlock).toBe('function');

        console.log('✅ Funções disponíveis no contexto:', {
            hasSetSelectedBlock: !!result.current.setSelectedBlock,
            hasAddBlock: !!result.current.addBlock,
            hasUpdateBlock: !!result.current.updateBlock,
            hasRemoveBlock: !!result.current.removeBlock,
            hasGetStepBlocks: !!result.current.getStepBlocks
        });
    });

    it('❌ DEVE detectar se o PropertiesColumn está recebendo selectedBlock', async () => {
        // Este teste simula o comportamento do QuizModularEditor
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider
                debugMode={true}
                initialData={{
                    id: 'test-funnel',
                    name: 'Test',
                    user_id: null,
                    pages: [{
                        id: 'page-1',
                        funnel_id: 'test-funnel',
                        page_type: 'quiz-step',
                        page_order: 1,
                        blocks: [{
                            id: 'block-abc',
                            type: 'heading',
                            properties: { text: 'Title', level: 1 }
                        }, {
                            id: 'block-def',
                            type: 'text',
                            properties: { text: 'Content' }
                        }]
                    }]
                }}
            >
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => useSuperUnified(), { wrapper });

        // Simular seleção de bloco
        act(() => {
            result.current.setSelectedBlock('block-abc');
        });

        // Obter blocos do step atual
        const blocks = result.current.getStepBlocks(1);
        const selectedBlockId = result.current.state.editor.selectedBlockId;
        const selectedBlock = blocks.find(b => b.id === selectedBlockId);

        console.log('🔍 DIAGNÓSTICO - Estado após seleção:', {
            selectedBlockId,
            hasSelectedBlock: !!selectedBlock,
            selectedBlockType: selectedBlock?.type,
            totalBlocks: blocks.length,
            blockIds: blocks.map(b => b.id)
        });

        // ✅ ASSERT: selectedBlock deve estar disponível
        expect(selectedBlock).toBeDefined();
        expect(selectedBlock?.id).toBe('block-abc');
        expect(selectedBlock?.type).toBe('heading');
    });
});

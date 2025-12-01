/**
 * 🧪 DIAGNÓSTICO: Painel de Propriedades - Conexão com Blocos
 * 
 * Testa se o PropertiesPanel está conectado corretamente ao quizStore
 * e se as edições realmente atualizam os blocos
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModernQuizEditor } from '../ModernQuizEditor';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

describe('🔍 DIAGNÓSTICO: Painel de Propriedades', () => {
    let testQuiz: QuizSchema;

    beforeEach(() => {
        // Limpar stores antes de cada teste
        useQuizStore.getState().clearQuiz();
        useEditorStore.getState().clearSelection();

        testQuiz = {
            version: '4.0.0',
            schemaVersion: '4.0',
            metadata: {
                id: 'test-properties',
                name: 'Quiz Teste Propriedades',
                description: 'Teste de edição',
                author: 'Test',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            theme: {
                colors: {
                    primary: '#3B82F6',
                    secondary: '#8B5CF6',
                    background: '#FFFFFF',
                    text: '#1F2937',
                    border: '#E5E7EB',
                },
                fonts: { heading: 'Inter', body: 'Inter' },
                spacing: {},
                borderRadius: {},
            },
            settings: {
                scoring: { enabled: false, method: 'sum' },
                navigation: { allowBack: true, autoAdvance: false, showProgress: true },
                validation: { required: true, strictMode: false },
            },
            steps: [
                {
                    id: 'step-test',
                    type: 'intro',
                    order: 1,
                    title: 'Step Teste',
                    blocks: [
                        {
                            id: 'block-test-title',
                            type: 'intro-title',
                            order: 1,
                            properties: {
                                fontSize: '24px',
                                textAlign: 'center',
                                padding: 16,
                            },
                            content: {
                                title: 'Título Original',
                            },
                            parentId: null,
                            metadata: {
                                editable: true,
                                reorderable: true,
                                reusable: true,
                                deletable: true,
                            },
                        },
                        {
                            id: 'block-test-description',
                            type: 'intro-description',
                            order: 2,
                            properties: {
                                padding: 16,
                            },
                            content: {
                                text: 'Descrição original',
                            },
                            parentId: null,
                            metadata: {
                                editable: true,
                                reorderable: true,
                                reusable: true,
                                deletable: true,
                            },
                        },
                    ],
                    navigation: { nextStep: null, conditions: [] },
                    validation: { required: true, rules: {} },
                },
            ],
        };
    });

    it('❌ DEVE DETECTAR: PropertiesPanel não renderiza', async () => {
        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);

        await waitFor(() => {
            // Verificar se PropertiesPanel existe no DOM
            const propertiesPanel = container.querySelector('[data-testid="properties-panel"]') ||
                container.querySelector('.properties-panel') ||
                screen.queryByText(/propriedades/i);

            if (!propertiesPanel) {
                console.error('❌ PROBLEMA CRÍTICO: PropertiesPanel não renderizado!');
                console.error('Possíveis causas:');
                console.error('1. PropertiesPanel não está no EditorLayout');
                console.error('2. Coluna de propriedades está oculta');
                console.error('3. Renderização condicional incorreta');
            } else {
                console.log('✅ PropertiesPanel encontrado no DOM');
            }

            expect(propertiesPanel).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('❌ DEVE DETECTAR: Bloco não é selecionado ao clicar', async () => {
        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);
        const user = userEvent.setup();

        await waitFor(() => {
            // Encontrar um bloco no canvas
            const block = container.querySelector('[data-block-id="block-test-title"]');

            if (!block) {
                console.error('❌ Bloco não encontrado no canvas');
                throw new Error('Bloco não renderizado');
            }

            console.log('✅ Bloco encontrado:', block);
            return block;
        }, { timeout: 3000 });

        // Clicar no bloco
        const block = container.querySelector('[data-block-id="block-test-title"]');
        await user.click(block!);

        // Verificar se foi selecionado no editorStore
        await waitFor(() => {
            const { selectedBlockId } = useEditorStore.getState();

            console.log('Estado após clique:');
            console.log('- selectedBlockId:', selectedBlockId);

            if (!selectedBlockId) {
                console.error('❌ PROBLEMA: Bloco não foi selecionado!');
                console.error('Verificar:');
                console.error('1. onClick handler no LazyBlockRenderer');
                console.error('2. selectBlock() no editorStore');
                console.error('3. Event bubbling bloqueado');
            } else {
                console.log('✅ Bloco selecionado:', selectedBlockId);
            }

            expect(selectedBlockId).toBe('block-test-title');
        }, { timeout: 2000 });
    });

    it('❌ DEVE DETECTAR: PropertiesPanel não mostra campos do bloco selecionado', async () => {
        // Carregar quiz e selecionar bloco manualmente
        useQuizStore.getState().loadQuiz(testQuiz);
        useEditorStore.getState().selectStep('step-test');
        useEditorStore.getState().selectBlock('block-test-title');

        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);

        await waitFor(() => {
            // Verificar se campos de propriedades aparecem
            const fontSizeInput = screen.queryByLabelText(/fontSize|tamanho da fonte/i) ||
                container.querySelector('input[name="fontSize"]');

            const textAlignInput = screen.queryByLabelText(/textAlign|alinhamento/i) ||
                container.querySelector('select[name="textAlign"]');

            if (!fontSizeInput && !textAlignInput) {
                console.error('❌ PROBLEMA CRÍTICO: Campos de propriedades não renderizados!');
                console.error('Estado atual:');
                console.error('- selectedBlockId:', useEditorStore.getState().selectedBlockId);
                console.error('- selectedStepId:', useEditorStore.getState().selectedStepId);
                console.error('');
                console.error('Possíveis causas:');
                console.error('1. PropertiesPanel não lê selectedBlockId do editorStore');
                console.error('2. getFieldsForType() não retorna campos para intro-title');
                console.error('3. Componente não re-renderiza ao selecionar bloco');
                console.error('4. Blocos intro-title não têm schema de propriedades definido');
            } else {
                console.log('✅ Campos de propriedades encontrados');
            }

            expect(fontSizeInput || textAlignInput).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('❌ DEVE DETECTAR: Edição no painel não atualiza o bloco', async () => {
        // Setup: carregar quiz e selecionar bloco
        useQuizStore.getState().loadQuiz(testQuiz);
        useEditorStore.getState().selectStep('step-test');
        useEditorStore.getState().selectBlock('block-test-title');

        const updateBlockSpy = vi.spyOn(useQuizStore.getState(), 'updateBlock');

        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);
        const user = userEvent.setup();

        await waitFor(() => {
            // Encontrar input de fontSize
            const fontSizeInput = container.querySelector('input[name="fontSize"]') as HTMLInputElement;

            if (!fontSizeInput) {
                console.error('❌ Campo fontSize não encontrado para testar edição');
                throw new Error('Campo não renderizado');
            }

            return fontSizeInput;
        }, { timeout: 3000 });

        const fontSizeInput = container.querySelector('input[name="fontSize"]') as HTMLInputElement;

        // Editar valor
        await user.clear(fontSizeInput);
        await user.type(fontSizeInput, '32px');

        // Aguardar debounce (300ms)
        await waitFor(() => {
            console.log('Verificando se updateBlock foi chamado...');
            console.log('Chamadas:', updateBlockSpy.mock.calls.length);

            if (updateBlockSpy.mock.calls.length === 0) {
                console.error('❌ PROBLEMA CRÍTICO: updateBlock NÃO foi chamado!');
                console.error('');
                console.error('Possíveis causas:');
                console.error('1. PropertiesPanel não tem onChange handler');
                console.error('2. Debounce não está funcionando');
                console.error('3. updateBlock não está conectado ao quizStore');
                console.error('4. Event handler bloqueado');
            } else {
                console.log('✅ updateBlock foi chamado');
                console.log('Argumentos:', updateBlockSpy.mock.calls[0]);
            }

            expect(updateBlockSpy).toHaveBeenCalled();
        }, { timeout: 1000 });

        // Verificar se o bloco foi realmente atualizado no store
        const updatedQuiz = useQuizStore.getState().quiz;
        const updatedBlock = updatedQuiz?.steps[0]?.blocks.find((b) => b.id === 'block-test-title');

        console.log('Bloco após edição:', updatedBlock?.properties);

        if (updatedBlock?.properties?.fontSize !== '32px') {
            console.error('❌ PROBLEMA: Propriedade não foi atualizada no quizStore!');
            console.error('Valor esperado: 32px');
            console.error('Valor atual:', updatedBlock?.properties?.fontSize);
        } else {
            console.log('✅ Propriedade atualizada corretamente');
        }

        expect(updatedBlock?.properties?.fontSize).toBe('32px');
    });

    it('🔍 DEVE VERIFICAR: isDirty flag após edição', async () => {
        useQuizStore.getState().loadQuiz(testQuiz);
        useEditorStore.getState().selectStep('step-test');
        useEditorStore.getState().selectBlock('block-test-title');

        // isDirty deve iniciar como false
        expect(useQuizStore.getState().isDirty).toBe(false);

        // Simular edição
        useQuizStore.getState().updateBlock('step-test', 'block-test-title', {
            fontSize: '32px',
        });

        // isDirty deve virar true
        await waitFor(() => {
            const isDirty = useQuizStore.getState().isDirty;

            console.log('isDirty após edição:', isDirty);

            if (!isDirty) {
                console.error('❌ PROBLEMA: isDirty não foi setado como true!');
                console.error('Isso impede o auto-save de funcionar');
            } else {
                console.log('✅ isDirty = true (correto)');
            }

            expect(isDirty).toBe(true);
        });
    });

    it('📊 RELATÓRIO: Estado completo do editor', () => {
        useQuizStore.getState().loadQuiz(testQuiz);
        useEditorStore.getState().selectStep('step-test');
        useEditorStore.getState().selectBlock('block-test-title');

        const quizState = useQuizStore.getState();
        const editorState = useEditorStore.getState();

        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('📊 ESTADO COMPLETO DO EDITOR');
        console.log('═══════════════════════════════════════');
        console.log('');
        console.log('🎯 QUIZ STORE:');
        console.log('- Quiz carregado:', !!quizState.quiz);
        console.log('- Steps:', quizState.quiz?.steps.length || 0);
        console.log('- isDirty:', quizState.isDirty);
        console.log('- História:', quizState.history.length, 'snapshots');
        console.log('- historyIndex:', quizState.historyIndex);
        console.log('');
        console.log('🎨 EDITOR STORE:');
        console.log('- Step selecionado:', editorState.selectedStepId);
        console.log('- Bloco selecionado:', editorState.selectedBlockId);
        console.log('- isPropertiesPanelOpen:', editorState.isPropertiesPanelOpen);
        console.log('');
        console.log('📦 BLOCOS DO STEP SELECIONADO:');
        const selectedStep = quizState.quiz?.steps.find((s) => s.id === editorState.selectedStepId);
        selectedStep?.blocks.forEach((block, idx) => {
            console.log(`  ${idx + 1}. ${block.type} (${block.id})`);
            console.log(`     Propriedades:`, Object.keys(block.properties || {}).length, 'campos');
            console.log(`     Editável:`, block.metadata?.editable ?? true);
        });
        console.log('');
        console.log('═══════════════════════════════════════');

        expect(quizState.quiz).toBeTruthy();
        expect(editorState.selectedStepId).toBeTruthy();
    });
});

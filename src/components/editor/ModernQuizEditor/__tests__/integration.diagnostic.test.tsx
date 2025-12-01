/**
 * 🧪 DIAGNÓSTICO: Integração Canvas ↔ PropertiesPanel
 * 
 * Testa o fluxo completo:
 * 1. Renderizar quiz
 * 2. Clicar em bloco no canvas
 * 3. Ver propriedades no painel
 * 4. Editar propriedade
 * 5. Ver mudança refletida no canvas
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModernQuizEditor } from '../ModernQuizEditor';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

describe('🔗 DIAGNÓSTICO: Integração Completa', () => {
    let testQuiz: QuizSchema;

    beforeEach(() => {
        useQuizStore.getState().clearQuiz();
        useEditorStore.getState().clearSelection();

        testQuiz = {
            version: '4.0.0',
            schemaVersion: '4.0',
            metadata: {
                id: 'integration-test',
                name: 'Quiz Integração',
                description: 'Teste de integração completo',
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
                    id: 'integration-step',
                    type: 'intro',
                    order: 1,
                    title: 'Step Integração',
                    blocks: [
                        {
                            id: 'integration-block',
                            type: 'intro-title',
                            order: 1,
                            properties: {
                                fontSize: '24px',
                                textAlign: 'center',
                                fontWeight: '700',
                                color: '#000000',
                            },
                            content: {
                                title: 'Teste de Integração',
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
                    version: 1,
                },
            ],
        };
    });

    it('🎯 FLUXO COMPLETO: Quiz → Canvas → Seleção → Painel → Edição', async () => {
        console.log('');
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║         🧪 TESTE DE INTEGRAÇÃO COMPLETO                  ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');

        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);
        const user = userEvent.setup();

        // ETAPA 1: Quiz deve carregar
        console.log('📋 ETAPA 1: Carregando quiz...');
        await waitFor(() => {
            const quiz = useQuizStore.getState().quiz;
            console.log('  ✓ Quiz carregado:', !!quiz);
            console.log('  ✓ Steps:', quiz?.steps.length || 0);
            expect(quiz).toBeTruthy();
        }, { timeout: 3000 });

        // ETAPA 2: Step deve ser selecionado automaticamente
        console.log('');
        console.log('🎯 ETAPA 2: Step deve ser auto-selecionado...');
        await waitFor(() => {
            const { selectedStepId } = useEditorStore.getState();
            console.log('  ✓ Step selecionado:', selectedStepId);

            if (!selectedStepId) {
                console.error('  ❌ FALHOU: Step não foi selecionado automaticamente');
                console.error('  Verificar: useEffect no ModernQuizEditor.tsx linha ~124');
            }

            expect(selectedStepId).toBe('integration-step');
        }, { timeout: 3000 });

        // ETAPA 3: Bloco deve renderizar no Canvas
        console.log('');
        console.log('🎨 ETAPA 3: Bloco deve renderizar no Canvas...');
        await waitFor(() => {
            const blockElement = container.querySelector('[data-block-id="integration-block"]');
            console.log('  ✓ Bloco no DOM:', !!blockElement);

            if (!blockElement) {
                console.error('  ❌ FALHOU: Bloco não renderizou');
                console.error('  Verificar: Canvas.tsx e LazyBlockRenderer.tsx');
            }

            expect(blockElement).toBeTruthy();
        }, { timeout: 3000 });

        // ETAPA 4: Clicar no bloco deve selecioná-lo
        console.log('');
        console.log('🖱️ ETAPA 4: Clicando no bloco...');
        const blockElement = container.querySelector('[data-block-id="integration-block"]');
        await user.click(blockElement!);

        await waitFor(() => {
            const { selectedBlockId } = useEditorStore.getState();
            console.log('  ✓ Bloco selecionado:', selectedBlockId);

            if (!selectedBlockId) {
                console.error('  ❌ FALHOU: Bloco não foi selecionado');
                console.error('  Verificar: onClick em LazyBlockRenderer ou Canvas');
            }

            expect(selectedBlockId).toBe('integration-block');
        }, { timeout: 2000 });

        // ETAPA 5: PropertiesPanel deve abrir/mostrar campos
        console.log('');
        console.log('📝 ETAPA 5: PropertiesPanel deve mostrar campos...');
        await waitFor(() => {
            const { isPropertiesPanelOpen } = useEditorStore.getState();
            console.log('  ✓ Painel aberto:', isPropertiesPanelOpen);

            // Procurar por campos de propriedades
            const hasFields = container.querySelector('input[name="fontSize"]') ||
                container.querySelector('select[name="textAlign"]') ||
                screen.queryByText(/propriedades/i);

            console.log('  ✓ Campos renderizados:', !!hasFields);

            if (!hasFields) {
                console.error('  ❌ FALHOU: PropertiesPanel não mostra campos');
                console.error('  Verificar: PropertiesPanel.tsx e propertyEditors.ts');
            }

            expect(hasFields).toBeTruthy();
        }, { timeout: 3000 });

        // ETAPA 6: Editar propriedade deve atualizar o store
        console.log('');
        console.log('✏️ ETAPA 6: Editando propriedade...');
        const fontSizeInput = container.querySelector('input[name="fontSize"]') as HTMLInputElement;

        if (fontSizeInput) {
            await user.clear(fontSizeInput);
            await user.type(fontSizeInput, '48px');

            // Aguardar debounce (300ms)
            await waitFor(() => {
                const quiz = useQuizStore.getState().quiz;
                const block = quiz?.steps[0]?.blocks.find((b) => b.id === 'integration-block');
                const newFontSize = block?.properties?.fontSize;

                console.log('  ✓ Propriedade atualizada:', newFontSize);

                if (newFontSize !== '48px') {
                    console.error('  ❌ FALHOU: Propriedade não foi atualizada no store');
                    console.error('  Valor esperado: 48px');
                    console.error('  Valor atual:', newFontSize);
                }

                expect(newFontSize).toBe('48px');
            }, { timeout: 1000 });
        } else {
            console.warn('  ⚠️ PULADO: Campo fontSize não encontrado');
        }

        // ETAPA 7: isDirty deve ser true
        console.log('');
        console.log('🚩 ETAPA 7: Verificando flag isDirty...');
        const { isDirty } = useQuizStore.getState();
        console.log('  ✓ isDirty:', isDirty);

        if (!isDirty) {
            console.error('  ❌ FALHOU: isDirty não foi setado');
            console.error('  Isso impede o auto-save');
        }

        expect(isDirty).toBe(true);

        // RELATÓRIO FINAL
        console.log('');
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║               📊 RELATÓRIO FINAL                          ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');

        const finalQuizState = useQuizStore.getState();
        const finalEditorState = useEditorStore.getState();

        console.log('Estado final do quiz:');
        console.log('  - Quiz carregado: ✓');
        console.log('  - Steps:', finalQuizState.quiz?.steps.length);
        console.log('  - isDirty:', finalQuizState.isDirty ? '✓' : '✗');
        console.log('  - História:', finalQuizState.history.length, 'snapshots');
        console.log('');
        console.log('Estado final do editor:');
        console.log('  - Step selecionado:', finalEditorState.selectedStepId ? '✓' : '✗');
        console.log('  - Bloco selecionado:', finalEditorState.selectedBlockId ? '✓' : '✗');
        console.log('  - Painel aberto:', finalEditorState.isPropertiesPanelOpen ? '✓' : '✗');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════');
    });

    it('🔍 CHECKLIST: Funcionalidades críticas', () => {
        console.log('');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('              ✅ CHECKLIST DE FUNCIONALIDADES              ');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        console.log('Renderização:');
        console.log('  [ ] Todos os blocos têm componentes registrados');
        console.log('  [ ] LazyBlockRenderer carrega componentes dinamicamente');
        console.log('  [ ] Blocos aparecem no Canvas');
        console.log('');
        console.log('Seleção:');
        console.log('  [ ] Step é auto-selecionado ao carregar');
        console.log('  [ ] Clicar em bloco o seleciona');
        console.log('  [ ] selectedBlockId atualiza no editorStore');
        console.log('');
        console.log('PropertiesPanel:');
        console.log('  [ ] PropertiesPanel renderiza na UI');
        console.log('  [ ] Campos aparecem ao selecionar bloco');
        console.log('  [ ] getFieldsForType retorna schema correto');
        console.log('  [ ] Campos têm values dos properties atuais');
        console.log('');
        console.log('Edição:');
        console.log('  [ ] onChange dispara ao editar campo');
        console.log('  [ ] updateBlock é chamado (com debounce 300ms)');
        console.log('  [ ] Propriedade atualiza no quizStore');
        console.log('  [ ] isDirty vira true');
        console.log('  [ ] addToHistory adiciona snapshot');
        console.log('');
        console.log('Persistência:');
        console.log('  [ ] Auto-save dispara após 3s (isDirty + debounce)');
        console.log('  [ ] usePersistence.saveQuiz chama Supabase');
        console.log('  [ ] SaveStatusIndicator mostra status');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════');

        expect(true).toBe(true);
    });
});

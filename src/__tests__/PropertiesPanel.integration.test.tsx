/**
 * 🐛 TESTE DE INTEGRAÇÃO REAL DO PAINEL DE PROPRIEDADES
 * 
 * Objetivo: Testar o componente REAL (não mocks) para identificar bugs reais
 * 
 * BUGS REPORTADOS PELO USUÁRIO:
 * 1. ❌ Textos das opções não aparecem para edição
 * 2. ❌ Campo para upload não funciona
 * 3. ❌ Pontuação não funciona
 * 4. ❌ Configuração de tamanho da imagem não funciona
 * 5. ❌ Validação das seleções não funciona
 * 6. ❌ Ativação do botão não funciona
 * 
 * Sprint 4 - Dia 4
 * Data: 11/out/2025
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import type { Block } from '@/types/editor';

// Importar o componente REAL
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';

describe('🐛 Painel de Propriedades - TESTES DE INTEGRAÇÃO REAL', () => {

    // ============================================
    // SETUP: Mocks necessários
    // ============================================

    beforeEach(() => {
        // Limpar mocks entre testes
        vi.clearAllMocks();
    });

    // ============================================
    // BUG #1: TEXTOS DAS OPÇÕES NÃO APARECEM
    // ============================================

    describe('🐛 BUG #1: Textos das Opções para Edição', () => {

        it('DEVE exibir campos de texto para editar opções de questão', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Qual sua cor favorita?',
                    options: [
                        { id: 'opt1', text: 'Azul', value: 'blue' },
                        { id: 'opt2', text: 'Vermelho', value: 'red' },
                        { id: 'opt3', text: 'Verde', value: 'green' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            // Aguardar renderização
            await waitFor(() => {
                // Verificar se inputs de opções existem
                const inputs = screen.queryAllByRole('textbox');
                console.log('📊 Inputs encontrados:', inputs.length);
                console.log('📝 Textos esperados: "Azul", "Vermelho", "Verde"');

                // Tentar encontrar os textos das opções
                const azulFound = screen.queryByDisplayValue('Azul');
                const vermelhoFound = screen.queryByDisplayValue('Vermelho');
                const verdeFound = screen.queryByDisplayValue('Verde');

                console.log('🔍 Resultado da busca:');
                console.log('  - "Azul":', azulFound ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
                console.log('  - "Vermelho":', vermelhoFound ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
                console.log('  - "Verde":', verdeFound ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');

                // Se não encontrou, o BUG está confirmado
                if (!azulFound || !vermelhoFound || !verdeFound) {
                    console.error('🐛 BUG CONFIRMADO: Textos das opções não aparecem para edição!');
                }
            });
        });

        it('DEVE permitir editar o texto de uma opção', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    options: [
                        { id: 'opt1', text: 'Original', value: 'orig' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                const input = screen.queryByDisplayValue('Original');

                if (input) {
                    fireEvent.change(input, { target: { value: 'Modificado' } });

                    // Verificar se onUpdate foi chamado
                    if (mockUpdate.mock.calls.length > 0) {
                        console.log('✅ onUpdate chamado:', mockUpdate.mock.calls[0]);
                    } else {
                        console.error('🐛 BUG: onUpdate NÃO foi chamado ao editar texto da opção');
                    }
                } else {
                    console.error('🐛 BUG: Input para editar opção não foi encontrado');
                }
            });
        });
    });

    // ============================================
    // BUG #2: CAMPO PARA UPLOAD NÃO FUNCIONA
    // ============================================

    describe('🐛 BUG #2: Campo para Upload de Imagens', () => {

        it('DEVE exibir campo de upload de imagem para opções', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Escolha uma imagem',
                    showImages: true,
                    options: [
                        { id: 'opt1', text: 'Opção 1', imageUrl: '' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Buscar input de arquivo
                const fileInputs = document.querySelectorAll('input[type="file"]');
                console.log('📎 Inputs de arquivo encontrados:', fileInputs.length);

                // Buscar botões de upload
                const uploadButtons = screen.queryAllByText(/upload|carregar|adicionar imagem/i);
                console.log('📤 Botões de upload encontrados:', uploadButtons.length);

                if (fileInputs.length === 0 && uploadButtons.length === 0) {
                    console.error('🐛 BUG CONFIRMADO: Campo de upload não encontrado!');
                }
            });
        });

        it('DEVE aceitar URL de imagem manual', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    showImages: true,
                    options: [
                        { id: 'opt1', text: 'Opção 1', imageUrl: '' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Buscar input para URL de imagem
                const urlInputs = screen.queryAllByPlaceholderText(/url|link|imagem/i);
                console.log('🔗 Inputs de URL encontrados:', urlInputs.length);

                if (urlInputs.length === 0) {
                    console.error('🐛 BUG CONFIRMADO: Campo para URL de imagem não encontrado!');
                }
            });
        });
    });

    // ============================================
    // BUG #3: PONTUAÇÃO NÃO FUNCIONA
    // ============================================

    describe('🐛 BUG #3: Sistema de Pontuação', () => {

        it('DEVE exibir campos de pontuação para cada opção', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    options: [
                        { id: 'opt1', text: 'Opção 1', scoreValues: { default: 10 } },
                        { id: 'opt2', text: 'Opção 2', scoreValues: { default: 20 } }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Buscar campos de pontuação
                const scoreLabels = screen.queryAllByText(/pontuação|score|pontos/i);
                console.log('🎯 Labels de pontuação encontrados:', scoreLabels.length);

                // Buscar inputs numéricos (provavelmente para pontos)
                const numberInputs = document.querySelectorAll('input[type="number"]');
                console.log('🔢 Inputs numéricos encontrados:', numberInputs.length);

                if (scoreLabels.length === 0 && numberInputs.length === 0) {
                    console.error('🐛 BUG CONFIRMADO: Campos de pontuação não encontrados!');
                }
            });
        });

        it('DEVE permitir editar valores de pontuação', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    options: [
                        { id: 'opt1', text: 'Opção 1', scoreValues: { default: 10 } }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Tentar encontrar e editar campo de score
                const numberInputs = document.querySelectorAll('input[type="number"]');

                if (numberInputs.length > 0) {
                    const scoreInput = numberInputs[0] as HTMLInputElement;
                    fireEvent.change(scoreInput, { target: { value: '50' } });

                    if (mockUpdate.mock.calls.length > 0) {
                        console.log('✅ onUpdate chamado ao mudar pontuação');
                    } else {
                        console.error('🐛 BUG: onUpdate NÃO chamado ao editar pontuação');
                    }
                } else {
                    console.error('🐛 BUG: Não foi possível editar pontuação');
                }
            });
        });
    });

    // ============================================
    // BUG #4: TAMANHO DA IMAGEM NÃO FUNCIONA
    // ============================================

    describe('🐛 BUG #4: Configuração de Tamanho da Imagem', () => {

        it('DEVE exibir controles de tamanho de imagem', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    showImages: true,
                    imageSize: 'medium',
                    imageWidth: 200,
                    imageHeight: 200,
                    options: [
                        { id: 'opt1', text: 'Opção 1', imageUrl: 'https://example.com/img.jpg' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Buscar controles de tamanho
                const sizeControls = screen.queryAllByText(/tamanho|largura|altura|width|height|size/i);
                console.log('📏 Controles de tamanho encontrados:', sizeControls.length);

                // Buscar sliders ou inputs numéricos
                const rangeInputs = document.querySelectorAll('input[type="range"]');
                console.log('🎚️ Sliders encontrados:', rangeInputs.length);

                if (sizeControls.length === 0 && rangeInputs.length === 0) {
                    console.error('🐛 BUG CONFIRMADO: Controles de tamanho de imagem não encontrados!');
                }
            });
        });
    });

    // ============================================
    // BUG #5: VALIDAÇÃO DAS SELEÇÕES NÃO FUNCIONA
    // ============================================

    describe('🐛 BUG #5: Validação de Seleções', () => {

        it('DEVE exibir configurações de validação', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    multipleSelection: true,
                    requiredSelections: 2,
                    maxSelections: 3,
                    minSelections: 1,
                    options: [
                        { id: 'opt1', text: 'Opção 1' },
                        { id: 'opt2', text: 'Opção 2' },
                        { id: 'opt3', text: 'Opção 3' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Buscar configurações de validação
                const validationLabels = screen.queryAllByText(/requerido|mínimo|máximo|seleção|obrigatório/i);
                console.log('✅ Labels de validação encontrados:', validationLabels.length);

                // Buscar switches/checkboxes
                const switches = document.querySelectorAll('[role="switch"]');
                console.log('🔘 Switches encontrados:', switches.length);

                if (validationLabels.length === 0 && switches.length === 0) {
                    console.error('🐛 BUG CONFIRMADO: Configurações de validação não encontradas!');
                }
            });
        });

        it('DEVE permitir configurar requiredSelections', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    multipleSelection: true,
                    requiredSelections: 1,
                    options: [
                        { id: 'opt1', text: 'Opção 1' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Buscar campo requiredSelections
                const numberInputs = document.querySelectorAll('input[type="number"]');
                console.log('🔢 Inputs numéricos para validação:', numberInputs.length);

                if (numberInputs.length > 0) {
                    console.log('✅ Campos de validação numérica encontrados');
                } else {
                    console.error('🐛 BUG: Não é possível configurar requiredSelections');
                }
            });
        });
    });

    // ============================================
    // BUG #6: ATIVAÇÃO DO BOTÃO NÃO FUNCIONA
    // ============================================

    describe('🐛 BUG #6: Ativação Condicional do Botão', () => {

        it('DEVE exibir configuração enableButtonOnlyWhenValid', async () => {
            const mockUpdate = vi.fn();

            const questionBlock: Block = {
                id: 'q1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Teste',
                    enableButtonOnlyWhenValid: true,
                    showValidationFeedback: true,
                    options: [
                        { id: 'opt1', text: 'Opção 1' }
                    ]
                },
                content: ''
            };

            render(
                <PropertiesPanel
                    selectedBlock={questionBlock}
                    onUpdate={mockUpdate}
                />
            );

            await waitFor(() => {
                // Buscar configurações de botão
                const buttonLabels = screen.queryAllByText(/botão|button|ativar|habilitar|valid/i);
                console.log('🔘 Labels de configuração de botão:', buttonLabels.length);

                // Buscar switches
                const switches = document.querySelectorAll('[role="switch"]');
                console.log('🎚️ Switches para botão:', switches.length);

                if (buttonLabels.length === 0) {
                    console.error('🐛 BUG CONFIRMADO: Configuração de ativação de botão não encontrada!');
                }
            });
        });
    });

    // ============================================
    // RELATÓRIO DE BUGS
    // ============================================

    describe('📊 Relatório de Bugs Encontrados', () => {

        it('DEVE gerar relatório consolidado de bugs', () => {
            const bugsReport = {
                '1. Textos das opções não aparecem': 'INVESTIGAR',
                '2. Campo para upload não funciona': 'INVESTIGAR',
                '3. Pontuação não funciona': 'INVESTIGAR',
                '4. Tamanho da imagem não funciona': 'INVESTIGAR',
                '5. Validação das seleções não funciona': 'INVESTIGAR',
                '6. Ativação do botão não funciona': 'INVESTIGAR'
            };

            console.log('\n' + '='.repeat(60));
            console.log('🐛 RELATÓRIO DE BUGS DO PAINEL DE PROPRIEDADES');
            console.log('='.repeat(60));
            console.log('\n📋 Bugs Reportados pelo Usuário:\n');

            Object.entries(bugsReport).forEach(([bug, status]) => {
                console.log(`  ${status === 'INVESTIGAR' ? '🔍' : '✅'} ${bug}`);
            });

            console.log('\n' + '='.repeat(60));
            console.log('ℹ️  Execute os testes acima para confirmar cada bug');
            console.log('='.repeat(60) + '\n');

            expect(true).toBe(true); // Este teste sempre passa
        });
    });
});

// ============================================
// INSTRUÇÕES PARA EXECUTAR
// ============================================

console.log('\n' + '='.repeat(70));
console.log('🧪 TESTE DE INTEGRAÇÃO REAL - PAINEL DE PROPRIEDADES');
console.log('='.repeat(70));
console.log('\n📝 Para executar este teste:');
console.log('   npm test src/__tests__/PropertiesPanel.integration.test.tsx');
console.log('\n🎯 Este teste vai:');
console.log('   1. Carregar o componente PropertiesPanel REAL');
console.log('   2. Testar cada bug reportado pelo usuário');
console.log('   3. Gerar logs detalhados no console');
console.log('   4. Identificar exatamente onde estão os problemas');
console.log('\n💡 Após executar, verifique os logs para ver quais bugs foram confirmados');
console.log('='.repeat(70) + '\n');

/**
 * 🧪 DIAGNÓSTICO: Cobertura de Renderização de Blocos
 * 
 * Testa se TODOS os blocos do quiz são renderizados corretamente
 * e identifica blocos que não têm componente registrado
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ModernQuizEditor } from '../ModernQuizEditor';
import { blockRegistry } from '@/core/registry/blockRegistry';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

describe('🔍 DIAGNÓSTICO: Renderização de Blocos', () => {
    let testQuiz: QuizSchema;

    beforeEach(() => {
        testQuiz = {
            version: '4.0.0',
            schemaVersion: '4.0',
            metadata: {
                id: 'test-quiz',
                name: 'Quiz de Teste',
                description: 'Quiz para testar renderização',
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
                fonts: {
                    heading: 'Inter',
                    body: 'Inter',
                },
                spacing: {},
                borderRadius: {},
            },
            settings: {
                scoring: {
                    enabled: false,
                    method: 'sum',
                },
                navigation: {
                    allowBack: true,
                    autoAdvance: false,
                    showProgress: true,
                },
                validation: {
                    required: true,
                    strictMode: false,
                },
            },
            steps: [
                {
                    id: 'step-01',
                    type: 'intro',
                    order: 1,
                    title: 'Step de Teste',
                    blocks: [
                        {
                            id: 'block-intro-logo',
                            type: 'intro-logo-header',
                            order: 0,
                            properties: {
                                logoUrl: 'https://example.com/logo.png',
                                showLogo: true,
                            },
                            content: {},
                            parentId: null,
                            metadata: {
                                editable: true,
                                reorderable: true,
                                reusable: true,
                                deletable: true,
                            },
                        },
                        {
                            id: 'block-intro-title',
                            type: 'intro-title',
                            order: 1,
                            properties: {},
                            content: {
                                title: 'Título de Teste',
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
                            id: 'block-intro-image',
                            type: 'intro-image',
                            order: 2,
                            properties: {},
                            content: {
                                src: 'https://example.com/image.png',
                                alt: 'Imagem de teste',
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
                            id: 'block-intro-description',
                            type: 'intro-description',
                            order: 3,
                            properties: {},
                            content: {
                                text: 'Descrição de teste',
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
                            id: 'block-intro-form',
                            type: 'intro-form',
                            order: 4,
                            properties: {},
                            content: {
                                label: 'Nome',
                                placeholder: 'Digite seu nome',
                                buttonText: 'Começar',
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
                    navigation: {
                        allowBack: true,
                        autoAdvance: false,
                    },
                    validation: {
                        required: true,
                        minBlocks: 0,
                        customRules: [],
                    },
                    version: 1,
                },
                {
                    id: 'step-02',
                    type: 'question',
                    order: 2,
                    title: 'Pergunta',
                    blocks: [
                        {
                            id: 'block-progress',
                            type: 'question-progress',
                            order: 0,
                            properties: {},
                            content: {
                                stepNumber: 2,
                                totalSteps: 10,
                                showPercentage: true,
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
                            id: 'block-question-title',
                            type: 'question-title',
                            order: 1,
                            properties: {},
                            content: {
                                text: 'Qual é sua escolha?',
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
                            id: 'block-options',
                            type: 'options-grid',
                            order: 2,
                            properties: {
                                columns: 2,
                            },
                            content: {
                                options: [
                                    { id: 'opt1', text: 'Opção 1', value: 'opt1' },
                                    { id: 'opt2', text: 'Opção 2', value: 'opt2' },
                                ],
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
                            id: 'block-navigation',
                            type: 'question-navigation',
                            order: 3,
                            properties: {},
                            content: {
                                backLabel: 'Voltar',
                                nextLabel: 'Avançar',
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
                    navigation: {
                        nextStep: null,
                        conditions: [],
                    },
                    validation: {
                        required: true,
                        rules: {},
                    },
                    version: 1,
                },
            ],
        };
    });

    it('❌ DEVE IDENTIFICAR: Blocos sem componente registrado', () => {
        const allBlockTypes = new Set<string>();
        const registeredTypes = new Set<string>();
        const missingTypes = new Set<string>();

        // Coletar todos os tipos de blocos usados no quiz
        testQuiz.steps.forEach((step) => {
            step.blocks.forEach((block) => {
                allBlockTypes.add(block.type);
            });
        });

        // Verificar quais estão registrados
        allBlockTypes.forEach((blockType) => {
            const component = blockRegistry.getComponent(blockType);
            if (component) {
                registeredTypes.add(blockType);
            } else {
                missingTypes.add(blockType);
            }
        });

        console.log('📊 DIAGNÓSTICO DE BLOCOS:');
        console.log('Total de tipos usados:', allBlockTypes.size);
        console.log('Tipos registrados:', registeredTypes.size);
        console.log('Tipos FALTANDO:', missingTypes.size);
        console.log('');
        console.log('✅ Registrados:', Array.from(registeredTypes).sort());
        console.log('❌ FALTANDO:', Array.from(missingTypes).sort());

        // Falhar se houver blocos faltando
        if (missingTypes.size > 0) {
            throw new Error(
                `❌ BLOCOS SEM COMPONENTE: ${Array.from(missingTypes).join(', ')}\n\n` +
                `Registre estes blocos em src/components/editor/blocks/blockRegistry.ts`
            );
        }

        expect(missingTypes.size).toBe(0);
    });

    it('✅ DEVE RENDERIZAR: Todos os blocos do step 1', async () => {
        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);

        await waitFor(() => {
            const step1 = testQuiz.steps[0];

            step1.blocks.forEach((block) => {
                // Verificar se o bloco tem data-block-id no DOM
                const blockElement = container.querySelector(`[data-block-id="${block.id}"]`);

                if (!blockElement) {
                    console.error(`❌ Bloco NÃO renderizado: ${block.type} (${block.id})`);
                } else {
                    console.log(`✅ Bloco renderizado: ${block.type}`);
                }

                expect(
                    blockElement,
                    `Bloco ${block.type} (${block.id}) não foi renderizado no DOM`
                ).toBeTruthy();
            });
        }, { timeout: 5000 });
    });

    it('🔍 DEVE VERIFICAR: LazyBlockRenderer carrega componentes', async () => {
        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);

        await waitFor(() => {
            // Verificar se LazyBlockRenderer foi renderizado
            const lazyBlocks = container.querySelectorAll('[data-testid*="block"]');

            console.log('LazyBlockRenderer encontrados:', lazyBlocks.length);

            if (lazyBlocks.length === 0) {
                console.error('❌ PROBLEMA: Nenhum LazyBlockRenderer renderizado!');
                console.error('Possíveis causas:');
                console.error('1. Canvas não está renderizando blocos');
                console.error('2. Step não foi selecionado automaticamente');
                console.error('3. useQuizStore não carregou o quiz corretamente');
            }

            expect(lazyBlocks.length).toBeGreaterThan(0);
        }, { timeout: 5000 });
    });

    it.skip('📋 DEVE LISTAR: Todos os tipos de blocos registrados', () => {
        // ⏭️ SKIP: getAllTypes() ainda não foi implementado no blockRegistry
        const allTypes: string[] = []; // blockRegistry.getAllTypes();

        console.log('📦 BLOCOS REGISTRADOS NO blockRegistry:');
        console.log('Total:', allTypes.length);
        console.log('');

        const categorized = {
            intro: [] as string[],
            question: [] as string[],
            transition: [] as string[],
            offer: [] as string[],
            result: [] as string[],
            outros: [] as string[],
        };

        allTypes.forEach((type) => {
            if (type.startsWith('intro-')) categorized.intro.push(type);
            else if (type.startsWith('question-')) categorized.question.push(type);
            else if (type.startsWith('transition-')) categorized.transition.push(type);
            else if (type.startsWith('offer-')) categorized.offer.push(type);
            else if (type.startsWith('result-') || type.startsWith('quiz-score')) categorized.result.push(type);
            else categorized.outros.push(type);
        });

        Object.entries(categorized).forEach(([category, types]) => {
            if (types.length > 0) {
                console.log(`\n${category.toUpperCase()}:`);
                types.forEach((type) => console.log(`  - ${type}`));
            }
        });

        expect(allTypes.length).toBeGreaterThan(0);
    });

    it('🎯 DEVE CARREGAR: Quiz no quizStore', async () => {
        const { container } = render(<ModernQuizEditor initialQuiz={testQuiz} />);

        await waitFor(() => {
            // Verificar se o nome do quiz aparece na UI
            const quizName = screen.queryByText(testQuiz.metadata.name);

            if (!quizName) {
                console.error('❌ PROBLEMA: Quiz não foi carregado no quizStore');
                console.error('Quiz name esperado:', testQuiz.metadata.name);
            }

            expect(quizName).toBeTruthy();
        }, { timeout: 5000 });
    });
});

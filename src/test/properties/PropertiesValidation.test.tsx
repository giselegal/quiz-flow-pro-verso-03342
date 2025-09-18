/**
 * 🧪 TESTES DE VALIDAÇÃO - CONFIGURAÇÕES DE PROPRIEDADES
 * Validação dos schemas e configurações das propriedades dos componentes
 */

import { describe, it, expect } from 'vitest';
import {
    validateBlockProperties,
    getDefaultPropertiesForBlock,
    sanitizeBlockProperties
} from '@/utils/blockValidation';
import { BlockType, Block } from '@/types/editor';

describe('Validação de Propriedades dos Blocos', () => {

    describe('Schema de Validação por Tipo de Bloco', () => {

        it('deve validar propriedades do quiz-intro-header', () => {
            const validProperties = {
                title: 'Título do Quiz',
                subtitle: 'Subtítulo',
                backgroundColor: '#ffffff',
                textColor: '#000000'
            };

            const result = validateBlockProperties('quiz-intro-header', validProperties);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('deve rejeitar propriedades inválidas do quiz-intro-header', () => {
            const invalidProperties = {
                title: '', // título vazio
                subtitle: 'a'.repeat(201), // muito longo
                backgroundColor: 'invalid-color', // cor inválida
                textColor: null // tipo inválido
            };

            const result = validateBlockProperties('quiz-intro-header', invalidProperties);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('deve validar propriedades do text-inline', () => {
            const validProperties = {
                text: 'Texto válido',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#333333'
            };

            const result = validateBlockProperties('text-inline', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar propriedades do form-input', () => {
            const validProperties = {
                label: 'Nome',
                placeholder: 'Digite seu nome',
                required: true,
                type: 'text',
                minLength: 2,
                maxLength: 50
            };

            const result = validateBlockProperties('form-input', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar propriedades do quiz-question-inline', () => {
            const validProperties = {
                question: 'Qual sua cor favorita?',
                multipleSelection: true,
                maxSelections: 3,
                minSelections: 1,
                options: [
                    {
                        value: 'azul',
                        label: 'Azul',
                        points: { classic: 1, modern: 2, romantic: 0 }
                    }
                ]
            };

            const result = validateBlockProperties('quiz-question-inline', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar estrutura das opções com pontuação', () => {
            const invalidOptions = [
                {
                    value: 'test',
                    label: 'Test',
                    points: { classic: 'invalid' } // deve ser número
                }
            ];

            const properties = {
                question: 'Teste',
                options: invalidOptions
            };

            const result = validateBlockProperties('quiz-question-inline', properties);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('points'))).toBe(true);
        });
    });

    describe('Componentes Step 20 - Validação', () => {

        it('deve validar propriedades do step20-result-header', () => {
            const validProperties = {
                celebrationText: 'Parabéns!',
                resultTitle: 'Seu Estilo é...',
                showConfetti: true,
                backgroundColor: '#f8f9fa',
                textColor: '#333333'
            };

            const result = validateBlockProperties('step20-result-header', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar propriedades do step20-compatibility', () => {
            const validProperties = {
                percentage: 85,
                showAnimatedCounter: true,
                color: '#22c55e',
                description: 'compatibilidade',
                animationDuration: 2000
            };

            const result = validateBlockProperties('step20-compatibility', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar range do percentual de compatibilidade', () => {
            const invalidPercentages = [-1, 101, 'invalid'];

            invalidPercentages.forEach(percentage => {
                const properties = {
                    percentage,
                    showAnimatedCounter: true,
                    color: '#22c55e'
                };

                const result = validateBlockProperties('step20-compatibility', properties);
                expect(result.isValid).toBe(false);
            });
        });

        it('deve validar propriedades do step20-personalized-offer', () => {
            const validProperties = {
                offerTitle: 'Consultoria Personalizada',
                offerDescription: 'Descrição da oferta',
                ctaText: 'Aceitar Oferta',
                showDiscount: true,
                discountPercentage: 20,
                originalPrice: '297',
                discountedPrice: '237'
            };

            const result = validateBlockProperties('step20-personalized-offer', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar consistência de preços', () => {
            const inconsistentPrices = {
                offerTitle: 'Oferta',
                showDiscount: true,
                discountPercentage: 20,
                originalPrice: '100',
                discountedPrice: '120' // preço com desconto maior que original
            };

            const result = validateBlockProperties('step20-personalized-offer', inconsistentPrices);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('preço'))).toBe(true);
        });

        it('deve validar propriedades do step20-secondary-styles', () => {
            const validProperties = {
                showSecondaryStyles: true,
                maxSecondaryStyles: 3,
                cardLayout: 'grid',
                secondaryStyles: [
                    {
                        name: 'Moderno',
                        percentage: 75,
                        description: 'Estilo moderno',
                        imageUrl: '/images/modern.jpg'
                    }
                ]
            };

            const result = validateBlockProperties('step20-secondary-styles', validProperties);
            expect(result.isValid).toBe(true);
        });
    });

    describe('Etapa 21 - Validação', () => {

        it('deve validar propriedades do urgency-timer-inline', () => {
            const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const validProperties = {
                deadline: futureDate.toISOString(),
                showDays: true,
                showHours: true,
                showMinutes: true,
                showSeconds: false,
                urgencyText: 'Oferta expira em:'
            };

            const result = validateBlockProperties('urgency-timer-inline', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve rejeitar deadline no passado', () => {
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const invalidProperties = {
                deadline: pastDate.toISOString(),
                showDays: true
            };

            const result = validateBlockProperties('urgency-timer-inline', invalidProperties);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('deadline'))).toBe(true);
        });

        it('deve validar propriedades do value-anchoring', () => {
            const validProperties = {
                originalPrice: '197',
                currentPrice: '97',
                showSavings: true,
                currency: 'R$',
                savingsText: 'Você economiza'
            };

            const result = validateBlockProperties('value-anchoring', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar propriedades do bonus', () => {
            const validProperties = {
                title: 'Bônus Exclusivo',
                description: 'Descrição do bônus',
                value: '50',
                showValue: true,
                bonusImage: '/images/bonus.jpg'
            };

            const result = validateBlockProperties('bonus', validProperties);
            expect(result.isValid).toBe(true);
        });

        it('deve validar propriedades do mentor-section-inline', () => {
            const validProperties = {
                mentorName: 'Gisele Galvão',
                mentorTitle: 'Consultora de Estilo',
                mentorImage: '/images/mentor.jpg',
                testimonial: 'Depoimento inspirador',
                showSocialProof: true
            };

            const result = validateBlockProperties('mentor-section-inline', validProperties);
            expect(result.isValid).toBe(true);
        });
    });

    describe('Valores Padrão dos Blocos', () => {

        it('deve fornecer valores padrão para cada tipo de bloco', () => {
            const blockTypes: BlockType[] = [
                'quiz-intro-header',
                'text-inline',
                'form-input',
                'quiz-question-inline',
                'step20-result-header',
                'step20-compatibility',
                'urgency-timer-inline',
                'value-anchoring'
            ];

            blockTypes.forEach(type => {
                const defaults = getDefaultPropertiesForBlock(type);
                expect(defaults).toBeDefined();
                expect(typeof defaults).toBe('object');

                // Validar que os valores padrão passam na validação
                const validation = validateBlockProperties(type, defaults);
                expect(validation.isValid).toBe(true);
            });
        });

        it('deve gerar propriedades padrão específicas por contexto', () => {
            // Teste para geração contextual de propriedades padrão
            const contextualDefaults = getDefaultPropertiesForBlock('quiz-question-inline', {
                stepNumber: 5,
                totalSteps: 21,
                previousAnswers: ['resposta1', 'resposta2']
            });

            expect(contextualDefaults).toHaveProperty('question');
            expect(contextualDefaults.question).not.toBe('');
        });
    });

    describe('Sanitização de Propriedades', () => {

        it('deve sanitizar propriedades de texto', () => {
            const unsafeProperties = {
                title: '<script>alert("xss")</script>Título Seguro',
                description: 'Texto com\n\n\nmúltiplas quebras',
                userInput: '  espaços desnecessários  '
            };

            const sanitized = sanitizeBlockProperties('text-inline', unsafeProperties);

            expect(sanitized.title).not.toContain('<script>');
            expect(sanitized.title).toContain('Título Seguro');
            expect(sanitized.description).not.toMatch(/\n{3,}/);
            expect(sanitized.userInput).toBe('espaços desnecessários');
        });

        it('deve sanitizar URLs', () => {
            const unsafeProperties = {
                imageUrl: 'javascript:alert("xss")',
                linkUrl: 'data:text/html,<script>alert("xss")</script>',
                safeUrl: 'https://example.com/image.jpg'
            };

            const sanitized = sanitizeBlockProperties('image-inline', unsafeProperties);

            expect(sanitized.imageUrl).toBe('');
            expect(sanitized.linkUrl).toBe('');
            expect(sanitized.safeUrl).toBe('https://example.com/image.jpg');
        });

        it('deve validar e corrigir valores numéricos', () => {
            const invalidNumbers = {
                percentage: '85%', // deve ser número
                maxSelections: -1, // deve ser positivo
                fontSize: 'abc', // deve ser válido
                order: 1.5 // deve ser inteiro
            };

            const sanitized = sanitizeBlockProperties('quiz-question-inline', invalidNumbers);

            expect(typeof sanitized.percentage).toBe('number');
            expect(sanitized.percentage).toBe(85);
            expect(sanitized.maxSelections).toBeGreaterThan(0);
            expect(sanitized.fontSize).toMatch(/^\d+px$/);
            expect(Number.isInteger(sanitized.order)).toBe(true);
        });
    });

    describe('Validação Cross-Component', () => {

        it('deve validar consistência entre questões e opções', () => {
            const questionBlock: Block = {
                id: 'question-1',
                type: 'quiz-question-inline',
                order: 0,
                content: {},
                properties: {
                    question: 'Qual sua cor favorita?',
                    maxSelections: 2,
                    options: []
                }
            };

            const optionsBlock: Block = {
                id: 'options-1',
                type: 'options-grid',
                order: 1,
                content: {},
                properties: {
                    options: [
                        { value: 'azul', label: 'Azul', points: { classic: 1 } },
                        { value: 'verde', label: 'Verde', points: { classic: 2 } },
                        { value: 'vermelho', label: 'Vermelho', points: { classic: 1 } }
                    ]
                }
            };

            const crossValidation = validateBlockProperties('quiz-question-inline',
                questionBlock.properties || null,
                { relatedBlocks: [optionsBlock] }
            );

            expect(crossValidation.isValid).toBe(true);
            expect(crossValidation.warnings).toContain('Máximo de seleções (2) é menor que opções disponíveis (3)');
        });

        it('deve validar fluxo de dados entre Step 20 components', () => {
            const resultHeaderBlock: Block = {
                id: 'header',
                type: 'step20-result-header',
                order: 0,
                content: {},
                properties: {
                    celebrationText: 'Parabéns!',
                    resultTitle: 'Seu estilo é {styleName}'
                }
            };

            const styleRevealBlock: Block = {
                id: 'reveal',
                type: 'step20-style-reveal',
                order: 1,
                content: {},
                properties: {
                    styleName: 'Clássico Elegante'
                }
            };

            const dataFlowValidation = validateBlockProperties('step20-result-header',
                resultHeaderBlock.properties || null,
                { relatedBlocks: [styleRevealBlock] }
            );

            expect(dataFlowValidation.isValid).toBe(true);
            expect(dataFlowValidation.dataBindings).toContain('styleName -> Clássico Elegante');
        });
    });

    describe('Performance de Validação', () => {

        it('deve validar propriedades rapidamente para blocos grandes', () => {
            const largeOptionsBlock = {
                question: 'Pergunta teste',
                options: Array.from({ length: 100 }, (_, i) => ({
                    value: `option-${i}`,
                    label: `Opção ${i}`,
                    points: { classic: i % 3, modern: (i + 1) % 3, romantic: (i + 2) % 3 }
                }))
            };

            const startTime = Date.now();
            const result = validateBlockProperties('quiz-question-inline', largeOptionsBlock);
            const endTime = Date.now();

            expect(result.isValid).toBe(true);
            expect(endTime - startTime).toBeLessThan(100); // Deve validar em menos de 100ms
        });

        it('deve cachear validações repetidas', () => {
            const properties = {
                title: 'Título teste',
                subtitle: 'Subtítulo teste'
            };

            // Primeira validação
            const startTime1 = Date.now();
            validateBlockProperties('quiz-intro-header', properties);
            const duration1 = Date.now() - startTime1;

            // Segunda validação (deve usar cache)
            const startTime2 = Date.now();
            validateBlockProperties('quiz-intro-header', properties);
            const duration2 = Date.now() - startTime2;

            expect(duration2).toBeLessThan(duration1);
        });
    });

    describe('Casos Extremos', () => {

        it('deve lidar com propriedades undefined/null', () => {
            const result = validateBlockProperties('text-inline', null);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Propriedades não fornecidas');
        });

        it('deve lidar com tipos de bloco inválidos', () => {
            const result = validateBlockProperties('invalid-block-type' as BlockType, {});
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Tipo de bloco não reconhecido');
        });

        it('deve lidar com propriedades circulares', () => {
            const circularProps: any = { name: 'test' };
            circularProps.self = circularProps;

            const result = validateBlockProperties('text-inline', circularProps);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('circular'))).toBe(true);
        });

        it('deve lidar com propriedades muito grandes', () => {
            const hugeText = 'a'.repeat(100000);
            const properties = {
                text: hugeText
            };

            const result = validateBlockProperties('text-inline', properties);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('muito longo'))).toBe(true);
        });
    });
});
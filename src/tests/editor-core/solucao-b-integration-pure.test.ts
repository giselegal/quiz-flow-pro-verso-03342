import { describe, it, expect } from 'vitest';

/**
 * 🎯 TESTE DE INTEGRAÇÃO SOLUÇÃO B - LÓGICA PURA
 * 
 * Sem dependência de React/DOM - Apenas validação, migração, normalização e adapter
 */

// Importações dos módulos da Solução B
import { SCHEMAS, migrateProps, LATEST_SCHEMA_VERSION } from '@/schemas';
import { normalizeByType } from '@/utils/normalizeByType';

describe('✅ INTEGRAÇÃO SOLUÇÃO B - LÓGICA PURA', () => {

    describe('1️⃣ Question Step - Fluxo Completo', () => {

        it('deve validar question props corretamente', () => {
            // 1. Raw props editadas
            const rawProps = {
                question: 'Qual é seu estilo?',
                multiSelect: true,
                requiredSelections: 2,
                maxSelections: 3,
                options: [
                    { label: 'Clássico' },
                    { label: 'Moderno' },
                    { label: 'Boho' }
                ]
            };

            // 2. Validar com Zod
            const schema = SCHEMAS['question'];
            expect(schema).toBeDefined();
            const validated = schema.parse(rawProps);

            expect(validated.question).toBe('Qual é seu estilo?');
            expect(validated.options.length).toBe(3);
            expect(validated.multiSelect).toBe(true);
        });

        it('deve rejeitar requiredSelections > maxSelections', () => {
            const invalidProps = {
                question: 'Q?',
                requiredSelections: 5,
                maxSelections: 2,
                options: [{ label: 'A' }]
            };

            const schema = SCHEMAS['question'];
            expect(() => schema.parse(invalidProps)).toThrow();
        });

        it('deve normalizar options com IDs e slugs determinísticos', () => {
            const props = {
                question: 'Q?',
                options: [
                    { label: 'Meu Estilo Clássico' },
                    { label: 'Bem Moderno' }
                ]
            };

            const schema = SCHEMAS['question'];
            const validated = schema.parse(props);
            const normalized = normalizeByType('question', validated, 'step-02');

            // IDs determinísticos
            expect(normalized.options[0].id).toBe('step-02-opt-0');
            expect(normalized.options[1].id).toBe('step-02-opt-1');

            // Slugs determinísticos
            expect(normalized.options[0].value).toBe('meu-estilo-classico');
            expect(normalized.options[1].value).toBe('bem-moderno');
        });

        it('deve preservar points e metadata durante normalização', () => {
            const props = {
                question: 'Q?',
                options: [
                    { label: 'A', points: 10, metadata: { category: 'natural' } },
                    { label: 'B', points: 20, metadata: { category: 'elegante' } }
                ]
            };

            const schema = SCHEMAS['question'];
            const validated = schema.parse(props);
            const normalized = normalizeByType('question', validated, 'step-02');

            expect(normalized.options[0].points).toBe(10);
            expect(normalized.options[0].metadata?.category).toBe('natural');
            expect(normalized.options[1].points).toBe(20);
            expect(normalized.options[1].metadata?.category).toBe('elegante');
        });
    });

    describe('2️⃣ Intro Step - Fluxo Completo', () => {

        it('deve validar intro props', () => {
            const rawProps = {
                title: 'Bem-vindo',
                subtitle: 'ao Quiz',
                cta: 'Começar',
                layout: 'centered'
            };

            const schema = SCHEMAS['intro'];
            const validated = schema.parse(rawProps);

            expect(validated.title).toBe('Bem-vindo');
            expect(validated.subtitle).toBe('ao Quiz');
            expect(validated.cta).toBe('Começar');
        });

        it('deve validar URLs em intro', () => {
            const props = {
                title: 'Título',
                logoUrl: 'https://example.com/logo.png',
                backgroundImage: 'https://example.com/bg.jpg'
            };

            const schema = SCHEMAS['intro'];
            const validated = schema.parse(props);
            expect(validated.logoUrl).toBe('https://example.com/logo.png');
        });

        it('deve rejeitar URLs inválidas em intro', () => {
            const props = {
                title: 'Título',
                logoUrl: 'not-a-valid-url'
            };

            const schema = SCHEMAS['intro'];
            expect(() => schema.parse(props)).toThrow();
        });
    });

    describe('3️⃣ Result Step - Fluxo Completo', () => {

        it('deve validar result props', () => {
            const props = {
                titleTemplate: 'Seu Estilo: {{resultStyle}}',
                showPrimaryStyleCard: true,
                primaryStyleId: 'natural',
                showSecondaryStyles: true,
                secondaryStylesCount: 2
            };

            const schema = SCHEMAS['result'];
            const validated = schema.parse(props);

            expect(validated.titleTemplate).toContain('{{resultStyle}}');
            expect(validated.primaryStyleId).toBe('natural');
        });

        it('deve validar offersToShow como array de strings', () => {
            const props = {
                titleTemplate: 'Resultado',
                offersToShow: ['offer-1', 'offer-2', 'offer-3']
            };

            const schema = SCHEMAS['result'];
            const validated = schema.parse(props);
            expect(validated.offersToShow).toHaveLength(3);
        });
    });

    describe('4️⃣ Offer Step - Fluxo Completo', () => {

        it('deve validar offer map', () => {
            const props = {
                offerMap: {
                    offer1: {
                        title: 'Guia de Estilos',
                        description: 'Aprenda',
                        price: 49.90,
                        ctaLabel: 'Comprar'
                    },
                    offer2: {
                        title: 'Consultoria',
                        description: 'Sessão 1:1',
                        price: 199.00,
                        ctaLabel: 'Agendar'
                    }
                }
            };

            const schema = SCHEMAS['offer'];
            const validated = schema.parse(props);

            expect(Object.keys(validated.offerMap)).toHaveLength(2);
            expect(validated.offerMap.offer1.title).toBe('Guia de Estilos');
            expect(validated.offerMap.offer2.price).toBe(199.00);
        });

        it('deve rejeitar preços negativos em offers', () => {
            const props = {
                offerMap: {
                    offer1: {
                        title: 'Oferta',
                        price: -50,
                        ctaLabel: 'Comprar'
                    }
                }
            };

            const schema = SCHEMAS['offer'];
            expect(() => schema.parse(props)).toThrow();
        });
    });

    describe('5️⃣ Transition Step - Fluxo Completo', () => {

        it('deve validar transition props', () => {
            const props = {
                title: 'Quase lá!',
                text: 'Falta pouco',
                showContinueButton: true,
                continueButtonText: 'Ver Resultado'
            };

            const schema = SCHEMAS['transition'];
            const validated = schema.parse(props);

            expect(validated.title).toBe('Quase lá!');
            expect(validated.showContinueButton).toBe(true);
        });
    });

    describe('6️⃣ Strategic Question Step - Fluxo Completo', () => {

        it('deve validar strategic-question props', () => {
            const props = {
                question: 'Pergunta estratégica?',
                options: [
                    { label: 'Opção 1' },
                    { label: 'Opção 2' }
                ]
            };

            const schema = SCHEMAS['strategic-question'];
            const validated = schema.parse(props);

            expect(validated.question).toBe('Pergunta estratégica?');
            expect(validated.options).toHaveLength(2);
        });
    });

    describe('7️⃣ Schema Versioning', () => {

        it('deve ter LATEST_SCHEMA_VERSION definido', () => {
            expect(LATEST_SCHEMA_VERSION).toBeDefined();
            expect(typeof LATEST_SCHEMA_VERSION).toBe('number');
            expect(LATEST_SCHEMA_VERSION).toBeGreaterThanOrEqual(1);
        });

        it('deve preservar schemaVersion após parsing', () => {
            const props = {
                question: 'Q?',
                options: [{ label: 'A' }]
            };

            const schema = SCHEMAS['question'];
            const validated = schema.parse(props);

            expect(validated.schemaVersion).toBe(LATEST_SCHEMA_VERSION);
        });

        it('deve migrar props corretamente', () => {
            const props = {
                question: 'Q?',
                options: [{ label: 'A' }],
                schemaVersion: 1
            };

            const schema = SCHEMAS['question'];
            const validated = schema.parse(props);
            const migrated = migrateProps('question', validated);

            expect(migrated.schemaVersion).toBe(LATEST_SCHEMA_VERSION);
        });
    });

    describe('8️⃣ Normalização Determinística', () => {

        it('deve gerar slugs idênticos para labels idênticos', () => {
            const props1 = {
                question: 'Q?',
                options: [{ label: 'Meu Estilo Natural' }]
            };
            const props2 = {
                question: 'Q?',
                options: [{ label: 'Meu Estilo Natural' }]
            };

            const schema = SCHEMAS['question'];
            const n1 = normalizeByType('question', schema.parse(props1), 'step-X');
            const n2 = normalizeByType('question', schema.parse(props2), 'step-X');

            expect(n1.options[0].value).toBe(n2.options[0].value);
            expect(n1.options[0].value).toBe('meu-estilo-natural');
        });

        it('deve gerar IDs idênticos para mesmo stepId', () => {
            const props = {
                question: 'Q?',
                options: [
                    { label: 'A' },
                    { label: 'B' },
                    { label: 'C' }
                ]
            };

            const schema = SCHEMAS['question'];
            const normalized = normalizeByType('question', schema.parse(props), 'step-02');

            expect(normalized.options[0].id).toBe('step-02-opt-0');
            expect(normalized.options[1].id).toBe('step-02-opt-1');
            expect(normalized.options[2].id).toBe('step-02-opt-2');
        });

        it('deve converter labels com caracteres especiais para slugs válidos', () => {
            const props = {
                question: 'Q?',
                options: [
                    { label: 'Estilo "Premium" (Exclusivo)' },
                    { label: 'Com Acentuação: Açúcar & Mel' },
                    { label: '  Espaços  Extras  ' }
                ]
            };

            const schema = SCHEMAS['question'];
            const normalized = normalizeByType('question', schema.parse(props), 'step-X');

            expect(normalized.options[0].value).toMatch(/^[a-z0-9\-]+$/);
            expect(normalized.options[1].value).toMatch(/^[a-z0-9\-]+$/);
            expect(normalized.options[2].value).toMatch(/^[a-z0-9\-]+$/);
        });
    });

    describe('9️⃣ Validações Cross-Field', () => {

        it('deve validar que requiredSelections ≤ options.length', () => {
            const props = {
                question: 'Q?',
                requiredSelections: 10,
                options: [
                    { label: 'A' },
                    { label: 'B' }
                ]
            };

            const schema = SCHEMAS['question'];
            expect(() => schema.parse(props)).toThrow();
        });

        it('deve validar que maxSelections ≤ options.length', () => {
            const props = {
                question: 'Q?',
                maxSelections: 10,
                options: [
                    { label: 'A' },
                    { label: 'B' }
                ]
            };

            const schema = SCHEMAS['question'];
            expect(() => schema.parse(props)).toThrow();
        });
    });

    describe('🔟 Edge Cases', () => {

        it('deve rejeitar options vazias', () => {
            const props = {
                question: 'Q?',
                options: []
            };

            const schema = SCHEMAS['question'];
            expect(() => schema.parse(props)).toThrow();
        });

        it('deve aceitar question sem layout explícito', () => {
            const props = {
                question: 'Q?',
                options: [{ label: 'A' }]
            };

            const schema = SCHEMAS['question'];
            const validated = schema.parse(props);
            expect(validated.question).toBe('Q?');
        });

        it('deve aceitar offer map com múltiplas entradas', () => {
            const offerMap = {};
            for (let i = 1; i <= 10; i++) {
                offerMap[`offer${i}`] = {
                    title: `Oferta ${i}`,
                    ctaLabel: 'Comprar'
                };
            }

            const props = { offerMap };
            const schema = SCHEMAS['offer'];
            const validated = schema.parse(props);

            expect(Object.keys(validated.offerMap)).toHaveLength(10);
        });

        it('deve normalizar offer map com IDs determinísticos', () => {
            const props = {
                offerMap: {
                    offer1: { title: 'Oferta 1', ctaLabel: 'Comprar' },
                    offer2: { title: 'Oferta 2', ctaLabel: 'Comprar' }
                }
            };

            const schema = SCHEMAS['offer'];
            const validated = schema.parse(props);
            const normalized = normalizeByType('offer', validated, 'step-21');

            expect(Object.keys(normalized.offerMap)).toHaveLength(2);
            expect(normalized.offerMap.offer1).toBeDefined();
            expect(normalized.offerMap.offer2).toBeDefined();
        });
    });
});

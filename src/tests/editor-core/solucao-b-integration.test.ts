import { describe, it, expect } from 'vitest';

/**
 * 🎯 TESTE DE INTEGRAÇÃO - SOLUÇÃO B
 * 
 * Valida o fluxo completo:
 * Props → Zod Validation → Migration → Normalization → Adapter → Blocks
 */

// Import dos módulos reais da Solução B
import { SCHEMAS, migrateProps } from '@/schemas';
import { normalizeByType } from '@/utils/normalizeByType';
import { PropsToBlocksAdapter } from '@/services/editor/PropsToBlocksAdapter';

describe('✅ INTEGRAÇÃO SOLUÇÃO B: Props → Blocks Completo', () => {

    describe('1️⃣ Question Step - Fluxo Completo', () => {

        it('deve validar, normalizar e converter question props para blocks', () => {
            // 1. Raw props editadas pelo usuário
            const rawProps = {
                question: 'Qual é seu estilo predominante?',
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
            expect(validated.question).toBe('Qual é seu estilo predominante?');
            expect(validated.options.length).toBe(3);

            // 3. Migrar schemaVersion
            const migrated = migrateProps('question', validated);
            expect(migrated.schemaVersion).toBe(1);

            // 4. Normalizar
            const normalized = normalizeByType('question', migrated, 'step-02');
            expect(normalized.options[0].id).toBe('step-02-opt-0');
            expect(normalized.options[0].value).toBe('classico');
            expect(normalized.options[1].id).toBe('step-02-opt-1');
            expect(normalized.options[1].value).toBe('moderno');

            // 5. Aplicar adapter → blocks
            const step = {
                id: 'step-02',
                type: 'question',
                meta: { props: normalized },
                blocks: []
            };
            const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);

            // 6. Validações finais
            expect(converted.blocks).toBeDefined();
            expect(converted.blocks.length).toBeGreaterThan(0);

            // Deve ter heading
            const headingBlock = converted.blocks.find(b => b.type === 'heading');
            expect(headingBlock).toBeDefined();
            expect(headingBlock?.content.text).toContain('estilo predominante');

            // Deve ter quiz-options
            const optionsBlock = converted.blocks.find(b => b.type === 'quiz-options');
            expect(optionsBlock).toBeDefined();
            expect(optionsBlock?.content.options.length).toBe(3);
            expect(optionsBlock?.properties.multiSelect).toBe(true);
            expect(optionsBlock?.properties.maxSelections).toBe(3);
        });

        it('deve rejeitar props inválidas com requiredSelections > maxSelections', () => {
            const invalidProps = {
                question: 'Pergunta?',
                requiredSelections: 5,
                maxSelections: 2,
                options: [{ label: 'A' }]
            };

            const schema = SCHEMAS['question'];
            expect(() => schema.parse(invalidProps)).toThrow();
        });

        it('deve gerar IDs determinísticos (mesmo step = mesmo ID)', () => {
            const props1 = {
                question: 'Q?',
                options: [{ label: 'Azul' }, { label: 'Vermelho' }]
            };
            const props2 = {
                question: 'Q?',
                options: [{ label: 'Azul' }, { label: 'Vermelho' }]
            };

            const schema = SCHEMAS['question'];
            const v1 = schema.parse(props1);
            const v2 = schema.parse(props2);
            const n1 = normalizeByType('question', v1, 'step-02');
            const n2 = normalizeByType('question', v2, 'step-02');

            expect(n1.options[0].id).toBe(n2.options[0].id);
            expect(n1.options[0].value).toBe('azul');
        });
    });

    describe('2️⃣ Intro Step - Fluxo Completo', () => {

        it('deve converter intro props para heading + button blocks', () => {
            const rawProps = {
                title: 'Bem-vindo ao Quiz',
                subtitle: 'Descubra seu estilo',
                cta: 'Começar Agora',
                layout: 'centered'
            };

            const schema = SCHEMAS['intro'];
            const validated = schema.parse(rawProps);
            const migrated = migrateProps('intro', validated);
            const normalized = normalizeByType('intro', migrated, 'step-01');

            const step = {
                id: 'step-01',
                type: 'intro',
                meta: { props: normalized },
                blocks: []
            };
            const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);

            expect(converted.blocks.length).toBeGreaterThan(0);
            const headingBlock = converted.blocks.find(b => b.type === 'heading');
            expect(headingBlock?.content.text).toBe('Bem-vindo ao Quiz');

            const buttonBlock = converted.blocks.find(b => b.type === 'button');
            expect(buttonBlock?.content.text).toBe('Começar Agora');
        });
    });

    describe('3️⃣ Result Step - Fluxo Completo', () => {

        it('deve converter result props com ofertas', () => {
            const rawProps = {
                titleTemplate: 'Seu Estilo: {{resultStyle}}',
                showPrimaryStyleCard: true,
                primaryStyleId: 'natural',
                showSecondaryStyles: true,
                secondaryStylesCount: 2,
                offersToShow: ['offer-1', 'offer-2']
            };

            const schema = SCHEMAS['result'];
            const validated = schema.parse(rawProps);
            const migrated = migrateProps('result', validated);
            const normalized = normalizeByType('result', migrated, 'step-19');

            const step = {
                id: 'step-19',
                type: 'result',
                meta: { props: normalized },
                blocks: []
            };
            const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);

            expect(converted.blocks.length).toBeGreaterThan(0);

            // Verificar resultado header
            const headerBlock = converted.blocks.find(b => b.type === 'result-header-inline');
            expect(headerBlock).toBeDefined();

            // Verificar style card
            const styleBlock = converted.blocks.find(b => b.type === 'style-card-inline');
            expect(styleBlock).toBeDefined();

            // Verificar ofertas
            const offerBlocks = converted.blocks.filter(b => b.type === 'quiz-offer-cta-inline');
            expect(offerBlocks.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('4️⃣ Offer Step - Fluxo Completo', () => {

        it('deve converter offer map para múltiplos offer blocks', () => {
            const rawProps = {
                offerMap: {
                    offer1: {
                        title: 'Guia de Estilos',
                        description: 'Aprenda combinar looks',
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
            const validated = schema.parse(rawProps);
            const migrated = migrateProps('offer', validated);
            const normalized = normalizeByType('offer', migrated, 'step-21');

            const step = {
                id: 'step-21',
                type: 'offer',
                meta: { props: normalized },
                blocks: []
            };
            const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);

            const offerBlocks = converted.blocks.filter(b => b.type === 'quiz-offer-cta-inline');
            expect(offerBlocks.length).toBe(2);

            expect(offerBlocks[0].content.title).toBe('Guia de Estilos');
            expect(offerBlocks[1].content.title).toBe('Consultoria');
        });
    });

    describe('5️⃣ Validações Cross-Field', () => {

        it('deve validar requiredSelections ≤ maxSelections', () => {
            const invalidProps = {
                question: 'Pergunta?',
                requiredSelections: 10,
                maxSelections: 3,
                options: [{ label: 'A' }]
            };

            const schema = SCHEMAS['question'];
            expect(() => schema.parse(invalidProps)).toThrow(/requiredSelections/i);
        });
    });

    describe('6️⃣ Normalização e Determinismo', () => {

        it('deve gerar slugs determinísticos', () => {
            const props1 = {
                question: 'Q?',
                options: [{ label: 'Meu Estilo Clássico' }]
            };
            const props2 = {
                question: 'Q?',
                options: [{ label: 'Meu Estilo Clássico' }]
            };

            const schema = SCHEMAS['question'];
            const n1 = normalizeByType('question', schema.parse(props1), 'step-X');
            const n2 = normalizeByType('question', schema.parse(props2), 'step-X');

            expect(n1.options[0].value).toBe('meu-estilo-classico');
            expect(n2.options[0].value).toBe('meu-estilo-classico');
            expect(n1.options[0].value).toBe(n2.options[0].value);
        });

        it('deve preservar points e metadata', () => {
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
            expect(normalized.options[0].metadata.category).toBe('natural');
            expect(normalized.options[1].points).toBe(20);
        });
    });

    describe('7️⃣ Schema Versioning', () => {

        it('deve manter e atualizar schemaVersion', () => {
            const props = {
                question: 'Q?',
                options: [{ label: 'A' }]
            };

            const schema = SCHEMAS['question'];
            const validated = schema.parse(props);
            expect(validated.schemaVersion).toBe(1);

            const migrated = migrateProps('question', validated);
            expect(migrated.schemaVersion).toBe(1); // Sem migrations, mantém mesma versão
        });
    });

    describe('8️⃣ Transition e Strategic Question', () => {

        it('deve converter transition props corretamente', () => {
            const rawProps = {
                title: 'Quase lá!',
                text: 'Falta pouco para ver seu resultado',
                showContinueButton: true,
                continueButtonText: 'Ver Resultado'
            };

            const schema = SCHEMAS['transition'];
            const validated = schema.parse(rawProps);
            const migrated = migrateProps('transition', validated);
            const normalized = normalizeByType('transition', migrated, 'step-18');

            const step = {
                id: 'step-18',
                type: 'transition',
                meta: { props: normalized },
                blocks: []
            };
            const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);

            expect(converted.blocks.length).toBeGreaterThan(0);
            const heading = converted.blocks.find(b => b.type === 'heading');
            expect(heading?.content.text).toBe('Quase lá!');
        });

        it('deve converter strategic-question com single-select', () => {
            const rawProps = {
                question: 'Qual é seu estilo predominante?',
                options: [
                    { label: 'Natural' },
                    { label: 'Elegante' }
                ]
            };

            const schema = SCHEMAS['strategic-question'];
            const validated = schema.parse(rawProps);
            const migrated = migrateProps('strategic-question', validated);
            const normalized = normalizeByType('strategic-question', migrated, 'step-12');

            const step = {
                id: 'step-12',
                type: 'strategic-question',
                meta: { props: normalized },
                blocks: []
            };
            const converted = PropsToBlocksAdapter.applyPropsToBlocks(step);

            const optionsBlock = converted.blocks.find(b => b.type === 'quiz-options');
            expect(optionsBlock?.properties.multiSelect).toBe(false);
            expect(optionsBlock?.properties.maxSelections).toBe(1);
        });
    });

    describe('9️⃣ Adapter Idempotency', () => {

        it('deve produzir os mesmos blocos em múltiplas chamadas', () => {
            const step = {
                id: 'step-02',
                type: 'question',
                meta: {
                    props: {
                        question: 'Pergunta?',
                        options: [{ label: 'Opção', id: 'opt-1', value: 'opt' }]
                    }
                },
                blocks: []
            };

            const converted1 = PropsToBlocksAdapter.applyPropsToBlocks(step);
            const converted2 = PropsToBlocksAdapter.applyPropsToBlocks(step);

            expect(converted1.blocks.length).toBe(converted2.blocks.length);
            expect(converted1.blocks[0].id).toBe(converted2.blocks[0].id);
            expect(converted1.blocks[0].type).toBe(converted2.blocks[0].type);
        });
    });

    describe('🔟 Edge Cases', () => {

        it('deve lidar com opções vazias em question', () => {
            const props = {
                question: 'Q?',
                options: []
            };

            const schema = SCHEMAS['question'];
            expect(() => schema.parse(props)).toThrow(/options/i);
        });

        it('deve lidar com URLs válidas em intro', () => {
            const props = {
                title: 'Título',
                logoUrl: 'https://example.com/logo.png',
                backgroundImage: 'https://example.com/bg.jpg'
            };

            const schema = SCHEMAS['intro'];
            const validated = schema.parse(props);
            expect(validated.logoUrl).toBe('https://example.com/logo.png');
        });

        it('deve rejeitar URLs inválidas em offer', () => {
            const props = {
                offerMap: {
                    offer1: {
                        title: 'Oferta',
                        ctaUrl: 'not-a-valid-url'
                    }
                }
            };

            const schema = SCHEMAS['offer'];
            expect(() => schema.parse(props)).toThrow();
        });
    });
});

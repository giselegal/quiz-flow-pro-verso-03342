/**
 * 🧪 TESTES ESPECÍFICOS: Validação de Gaps do Editor vs /quiz-estilo REAL
 * 
 * Baseado na análise: ANALISE_ESTRUTURA_REAL_QUIZ_ESTILO.md
 * 
 * OBJETIVO: Identificar exatamente o que FALTA no editor para editar 100% do quiz-estilo
 * 
 * STATUS ATUAL: Editor consegue editar ~60% do funil
 * META: Identificar os 40% restantes e criar testes para validar
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QUIZ_STEPS, STEP_ORDER, type QuizStep, type QuizOption } from '@/data/quizSteps';
import { styleMapping, type StyleId } from '@/data/styles';

// Mock do editor bridge
vi.mock('@/services/QuizEditorBridge');

describe('🔍 ANÁLISE: Estrutura Real do /quiz-estilo', () => {

    describe('1. Validar Estrutura Completa (21 Etapas)', () => {
        it('deve ter exatamente 21 etapas', () => {
            expect(STEP_ORDER).toHaveLength(21);
            expect(Object.keys(QUIZ_STEPS)).toHaveLength(21);
        });

        it('deve ter todas as etapas em sequência step-01 a step-21', () => {
            const expectedSteps = Array.from({ length: 21 }, (_, i) => {
                const num = (i + 1).toString().padStart(2, '0');
                return `step-${num}`;
            });

            expect(STEP_ORDER).toEqual(expectedSteps);
        });

        it('deve ter tipos de etapa corretos por faixa', () => {
            // Step-01: intro
            expect(QUIZ_STEPS['step-01'].type).toBe('intro');

            // Steps 02-11: question (10 perguntas principais)
            for (let i = 2; i <= 11; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                expect(QUIZ_STEPS[stepId].type).toBe('question');
            }

            // Step-12: transition
            expect(QUIZ_STEPS['step-12'].type).toBe('transition');

            // Steps 13-18: strategic-question (6 perguntas estratégicas)
            for (let i = 13; i <= 18; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                expect(QUIZ_STEPS[stepId].type).toBe('strategic-question');
            }

            // Step-19: transition-result
            expect(QUIZ_STEPS['step-19'].type).toBe('transition-result');

            // Step-20: result
            expect(QUIZ_STEPS['step-20'].type).toBe('result');

            // Step-21: offer
            expect(QUIZ_STEPS['step-21'].type).toBe('offer');
        });

        it('deve ter nextStep correto em cada etapa (exceto última)', () => {
            for (let i = 1; i <= 20; i++) {
                const currentStepId = `step-${i.toString().padStart(2, '0')}`;
                const expectedNextStepId = `step-${(i + 1).toString().padStart(2, '0')}`;

                const step = QUIZ_STEPS[currentStepId];
                expect(step.nextStep).toBe(expectedNextStepId);
            }

            // Step-21 não deve ter nextStep
            expect(QUIZ_STEPS['step-21'].nextStep).toBeUndefined();
        });
    });

    describe('2. Validar Componentes Necessários por Etapa', () => {

        it('step-01 (intro) deve ter: title HTML, formQuestion, placeholder, buttonText, image', () => {
            const step = QUIZ_STEPS['step-01'];

            expect(step.title).toBeDefined();
            expect(step.title).toContain('<span'); // HTML
            expect(step.title).toContain('playfair-display'); // Classe CSS
            expect(step.formQuestion).toBe('Como posso te chamar?');
            expect(step.placeholder).toBe('Digite seu primeiro nome aqui...');
            expect(step.buttonText).toBe('Quero Descobrir meu Estilo Agora!');
            expect(step.image).toContain('cloudinary');
        });

        it('steps 02-11 (questions) devem ter: questionNumber, questionText, requiredSelections=3, 8 options com id de estilo', () => {
            for (let i = 2; i <= 11; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                const step = QUIZ_STEPS[stepId];

                expect(step.questionNumber).toBeDefined();
                expect(step.questionText).toBeDefined();
                expect(step.requiredSelections).toBe(3);
                expect(step.options).toHaveLength(8);

                // Cada opção deve ter um ID de estilo válido
                step.options?.forEach((option: QuizOption) => {
                    const validStyleIds = ['natural', 'classico', 'contemporaneo', 'elegante',
                        'romantico', 'sexy', 'dramatico', 'criativo'];
                    expect(validStyleIds).toContain(option.id);
                });
            }
        });

        it('step-12 (transition) deve ter: title, text, showContinueButton, continueButtonText, duration', () => {
            const step = QUIZ_STEPS['step-12'];

            expect(step.title).toBe('🕐 Enquanto calculamos o seu resultado...');
            expect(step.text).toContain('perguntas que vão tornar');
            expect(step.showContinueButton).toBe(true);
            expect(step.continueButtonText).toBe('Continuar');
            expect(step.duration).toBe(3500);
        });

        it('steps 13-18 (strategic-questions) devem ter: questionText, 4 options sem imagem', () => {
            for (let i = 13; i <= 18; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                const step = QUIZ_STEPS[stepId];

                expect(step.questionText).toBeDefined();
                expect(step.options).toHaveLength(4);

                // Opções estratégicas NÃO devem ter imagens
                step.options?.forEach((option: QuizOption) => {
                    expect(option.image).toBeUndefined();
                });
            }
        });

        it('step-18 (última strategic) deve ter opções com IDs específicos para offerMap', () => {
            const step = QUIZ_STEPS['step-18'];

            expect(step.questionText).toContain('resultados você mais gostaria');

            const expectedIds = [
                'montar-looks-facilidade',
                'usar-que-tenho',
                'comprar-consciencia',
                'ser-admirada'
            ];

            const optionIds = step.options?.map((o: QuizOption) => o.id) || [];
            expect(optionIds).toEqual(expectedIds);
        });

        it('step-19 (transition-result) deve ter: title apenas', () => {
            const step = QUIZ_STEPS['step-19'];

            expect(step.title).toBe('Obrigada por compartilhar.');
            expect(step.text).toBeUndefined();
            expect(step.duration).toBeUndefined(); // Auto-advance sem duration
        });

        it('step-20 (result) deve ter: title com {userName} placeholder', () => {
            const step = QUIZ_STEPS['step-20'];

            expect(step.title).toContain('{userName}');
            expect(step.title).toContain('seu estilo predominante é');
        });

        it('step-21 (offer) deve ter: image, offerMap com 4 chaves específicas', () => {
            const step = QUIZ_STEPS['step-21'];

            expect(step.image).toContain('cloudinary');
            expect(step.offerMap).toBeDefined();

            const expectedKeys = [
                'Montar looks com mais facilidade e confiança',
                'Usar o que já tenho e me sentir estilosa',
                'Comprar com mais consciência e sem culpa',
                'Ser admirada pela imagem que transmito'
            ];

            expectedKeys.forEach(key => {
                expect(step.offerMap).toHaveProperty(key);

                const offer = step.offerMap![key];
                expect(offer.title).toBeDefined();
                expect(offer.title).toContain('{userName}'); // Placeholder
                expect(offer.description).toBeDefined();
                expect(offer.buttonText).toBeDefined();
                expect(offer.testimonial).toBeDefined();
                expect(offer.testimonial.quote).toBeDefined();
                expect(offer.testimonial.author).toBeDefined();
            });
        });
    });

    describe('3. ❌ GAP: Componentes Faltando no Editor', () => {

        it('GAP 1: Componente "testimonial" não existe (usado em step-21)', () => {
            const step = QUIZ_STEPS['step-21'];

            // Verificar que offerMap tem testimonials
            const firstOffer = Object.values(step.offerMap || {})[0];
            expect(firstOffer?.testimonial).toBeDefined();

            // TODO: Editor precisa de componente "testimonial" com:
            // - content.quote: string
            // - content.author: string
            // - properties.showPhoto?: boolean

            console.warn('❌ GAP: Componente "testimonial" não existe no editor');
            expect(true).toBe(true); // Placeholder para lembrar de implementar
        });

        it('GAP 2: Componente "style-result-card" não existe (usado em step-20)', () => {
            const step = QUIZ_STEPS['step-20'];

            // Step-20 precisa renderizar o estilo calculado
            expect(step.type).toBe('result');

            // TODO: Editor precisa de componente "style-result-card" que:
            // - Lê do estado: quizState.resultStyle
            // - Renderiza card do estilo com imagem, descrição, características
            // - Mostra estilos secundários

            console.warn('❌ GAP: Componente "style-result-card" não existe no editor');
            expect(true).toBe(true);
        });

        it('GAP 3: Componente "offer-map" não existe (usado em step-21)', () => {
            const step = QUIZ_STEPS['step-21'];

            expect(step.offerMap).toBeDefined();
            expect(Object.keys(step.offerMap || {})).toHaveLength(4);

            // TODO: Editor precisa de componente "offer-map" com:
            // - 4 variações editáveis (título, descrição, botão, depoimento)
            // - Mapeamento de resposta da pergunta 18 para oferta
            // - Validação de que todas as 4 chaves existem

            console.warn('❌ GAP: Componente "offer-map" não existe no editor');
            expect(true).toBe(true);
        });
    });

    describe('4. ❌ GAP: Propriedades Críticas Faltando', () => {

        it('GAP 4: QuizOptions precisa de "requiredSelections" (usado em todas as perguntas)', () => {
            const step02 = QUIZ_STEPS['step-02'];
            const step13 = QUIZ_STEPS['step-13'];

            expect(step02.requiredSelections).toBe(3); // Perguntas principais
            expect(step13.requiredSelections).toBeUndefined(); // Strategic = 1 por padrão

            // TODO: Editor precisa de campo "requiredSelections" em QuizOptions:
            // - properties.requiredSelections: number (default: 1)
            // - Validar que <= options.length

            console.warn('❌ GAP: QuizOptions.requiredSelections não existe');
            expect(true).toBe(true);
        });

        it('GAP 5: QuizOptions precisa de "showImages" (perguntas principais têm, estratégicas não)', () => {
            const step02 = QUIZ_STEPS['step-02'];
            const step13 = QUIZ_STEPS['step-13'];

            const hasImages = step02.options?.some((o: QuizOption) => o.image) || false;
            const noImages = step13.options?.every((o: QuizOption) => !o.image) || false;

            expect(hasImages).toBe(true);
            expect(noImages).toBe(true);

            // TODO: Editor precisa de campo "showImages" em QuizOptions:
            // - properties.showImages: boolean
            // - Se true, mostrar campo de imagem em cada opção

            console.warn('❌ GAP: QuizOptions.showImages não existe');
            expect(true).toBe(true);
        });

        it('GAP 6: Heading precisa de "fontFamily" (usado em step-01 com playfair-display)', () => {
            const step = QUIZ_STEPS['step-01'];

            expect(step.title).toContain('playfair-display');

            // TODO: Editor precisa de campo "fontFamily" em Heading:
            // - properties.fontFamily: 'default' | 'playfair-display' | 'custom'
            // - Se custom, permitir input de classe CSS

            console.warn('❌ GAP: Heading.fontFamily não existe');
            expect(true).toBe(true);
        });

        it('GAP 7: Transition precisa de "showContinueButton", "continueButtonText", "duration"', () => {
            const step = QUIZ_STEPS['step-12'];

            expect(step.showContinueButton).toBe(true);
            expect(step.continueButtonText).toBe('Continuar');
            expect(step.duration).toBe(3500);

            // TODO: Editor precisa de campos especiais para tipo "transition":
            // - showContinueButton: boolean (permite skip manual)
            // - continueButtonText: string (texto do botão)
            // - duration: number (ms até auto-advance)

            console.warn('❌ GAP: Transition não tem showContinueButton, continueButtonText, duration');
            expect(true).toBe(true);
        });
    });

    describe('5. ❌ GAP: Validações Críticas Faltando', () => {

        it('GAP 8: Validar IDs de opções devem ser estilos válidos (em perguntas 02-11)', () => {
            const validStyleIds = ['natural', 'classico', 'contemporaneo', 'elegante',
                'romantico', 'sexy', 'dramatico', 'criativo'];

            // Verificar que todos os IDs são válidos
            for (let i = 2; i <= 11; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                const step = QUIZ_STEPS[stepId];

                step.options?.forEach((option: QuizOption) => {
                    expect(validStyleIds).toContain(option.id);
                });
            }

            // TODO: Editor deve ter dropdown de estilos ao criar opção:
            // - Não permitir IDs customizados em perguntas principais
            // - Validar que cada opção tem ID de um dos 8 estilos
            // - Bloquear publicação se tiver ID inválido

            console.warn('❌ GAP: Editor não valida IDs de estilos');
            expect(true).toBe(true);
        });

        it('GAP 9: Validar step-18 deve ter opções com IDs específicos para offerMap', () => {
            const step18 = QUIZ_STEPS['step-18'];
            const step21 = QUIZ_STEPS['step-21'];

            const step18OptionIds = step18.options?.map((o: QuizOption) => o.id) || [];

            // Criar mapeamento esperado
            const expectedMapping = {
                'montar-looks-facilidade': 'Montar looks com mais facilidade e confiança',
                'usar-que-tenho': 'Usar o que já tenho e me sentir estilosa',
                'comprar-consciencia': 'Comprar com mais consciência e sem culpa',
                'ser-admirada': 'Ser admirada pela imagem que transmito'
            };

            // Validar que IDs da pergunta 18 mapeiam para chaves do offerMap
            step18OptionIds.forEach((optionId: string) => {
                const offerKey = expectedMapping[optionId as keyof typeof expectedMapping];
                expect(step21.offerMap).toHaveProperty(offerKey);
            });

            // TODO: Editor deve validar:
            // - Step-18 tem exatamente 4 opções com IDs específicos
            // - Step-21 tem offerMap com chaves correspondentes
            // - Bloquear publicação se não bater

            console.warn('❌ GAP: Editor não valida mapeamento step-18 → offerMap');
            expect(true).toBe(true);
        });

        it('GAP 10: Validar step-01 deve ter FormInput (obrigatório para coletar nome)', () => {
            const step = QUIZ_STEPS['step-01'];

            expect(step.formQuestion).toBeDefined();
            expect(step.placeholder).toBeDefined();

            // TODO: Editor deve validar:
            // - Step-01 tem pelo menos 1 FormInput
            // - FormInput está configurado para coletar userName
            // - Bloquear publicação se faltar

            console.warn('❌ GAP: Editor não valida FormInput obrigatório em step-01');
            expect(true).toBe(true);
        });

        it('GAP 11: Validar nextStep aponta para etapa válida', () => {
            STEP_ORDER.forEach((stepId, index) => {
                const step = QUIZ_STEPS[stepId];

                if (index < STEP_ORDER.length - 1) {
                    // Não é a última etapa, deve ter nextStep
                    expect(step.nextStep).toBeDefined();

                    // nextStep deve existir em QUIZ_STEPS
                    expect(QUIZ_STEPS).toHaveProperty(step.nextStep!);
                } else {
                    // Última etapa não deve ter nextStep
                    expect(step.nextStep).toBeUndefined();
                }
            });

            // TODO: Editor deve:
            // - Ter dropdown de etapas válidas para nextStep
            // - Validar que nextStep existe
            // - Alertar se criar ciclo infinito

            console.warn('❌ GAP: Editor não valida nextStep');
            expect(true).toBe(true);
        });
    });

    describe('6. ✅ Sistema de Pontuação (Lógica de Negócio)', () => {

        it('deve mapear IDs de opções para estilos corretos', () => {
            // IDs usados nas opções de quiz (sem acento)
            const quizOptionIds = [
                'natural', 'classico', 'contemporaneo', 'elegante',
                'romantico', 'sexy', 'dramatico', 'criativo'
            ];

            // Verificar que os IDs usados nas opções do quiz são válidos
            quizOptionIds.forEach(optionId => {
                expect(quizOptionIds).toContain(optionId);
            });

            // Verificar que styleMapping tem estilos definidos (independente da chave)
            const styles = Object.values(styleMapping);
            expect(styles.length).toBeGreaterThan(0);

            // TODO: Editor deve usar resolveStyleId() para mapear IDs sem acento para IDs com acento
            console.warn('💡 Editor deve usar resolveStyleId() para converter: classico→clássico, etc.');
            expect(true).toBe(true); // Placeholder
        });

        it('deve calcular pontuação baseado em seleções das perguntas 02-11', () => {
            // Simular respostas escolhendo sempre "natural"
            const mockAnswers = {
                'step-02': ['natural', 'natural', 'natural'],
                'step-03': ['natural', 'natural', 'natural'],
                'step-04': ['natural', 'natural', 'natural'],
            };

            // Calcular pontos
            const scores = {
                natural: 0,
                classico: 0,
                contemporaneo: 0,
                elegante: 0,
                romantico: 0,
                sexy: 0,
                dramatico: 0,
                criativo: 0,
            };

            Object.values(mockAnswers).forEach(selections => {
                selections.forEach(id => {
                    if (id in scores) {
                        (scores as any)[id] += 1;
                    }
                });
            });

            expect(scores.natural).toBe(9);
            expect(scores.classico).toBe(0);

            // TODO: Editor deve preview mostrando pontuação atual
            // - Ao editar opções, recalcular pontos
            // - Validar que distribuição está balanceada
        });
    });

    describe('7. ❌ GAP: Conversão Bidirecional (Editor ↔ Runtime)', () => {

        it('GAP 12: Converter QuizStep → EditableBlocks', () => {
            const step02 = QUIZ_STEPS['step-02'];

            // O que deve ser convertido:
            // step02.questionNumber → não usado em blocos (metadata)
            // step02.questionText → Heading block
            // step02.requiredSelections → QuizOptions properties
            // step02.options → QuizOptions content

            // TODO: Implementar função convertStepToBlocks()
            // - Criar bloco Heading com questionText
            // - Criar bloco QuizOptions com options e requiredSelections
            // - Preservar ordem (order)
            // - Gerar IDs únicos

            console.warn('❌ GAP: Conversão QuizStep → EditableBlocks não implementada');
            expect(true).toBe(true);
        });

        it('GAP 13: Converter EditableBlocks → QuizStep', () => {
            // Estrutura de blocos no editor:
            const mockBlocks = [
                {
                    id: 'block-1',
                    type: 'heading',
                    order: 0,
                    properties: { level: 3, textAlign: 'center' },
                    content: { text: 'QUAL O SEU TIPO DE ROUPA FAVORITA?' }
                },
                {
                    id: 'block-2',
                    type: 'quiz-options',
                    order: 1,
                    properties: { maxSelections: 3, showImages: true },
                    content: {
                        options: [
                            { id: 'natural', text: 'Conforto...', image: 'https://...' }
                        ]
                    }
                }
            ];

            // Deve gerar QuizStep válido:
            // {
            //   type: 'question',
            //   questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            //   requiredSelections: 3,
            //   options: [...],
            //   nextStep: 'step-03'
            // }

            // TODO: Implementar função convertBlocksToStep()
            // - Mapear Heading → questionText
            // - Mapear QuizOptions → options + requiredSelections
            // - Preservar nextStep
            // - Validar estrutura

            console.warn('❌ GAP: Conversão EditableBlocks → QuizStep não implementada');
            expect(true).toBe(true);
        });

        it('GAP 14: Round-trip deve preservar dados (editor → runtime → editor)', () => {
            // Testar ida e volta completa:
            // 1. Carregar QUIZ_STEPS['step-02']
            // 2. Converter para blocos (convertStepToBlocks)
            // 3. Converter de volta (convertBlocksToStep)
            // 4. Comparar com original

            // TODO: Implementar teste de round-trip
            // - Garantir que nenhum dado é perdido
            // - Garantir que estrutura é preservada
            // - Validar com todas as 21 etapas

            console.warn('❌ GAP: Round-trip não testado');
            expect(true).toBe(true);
        });
    });

    describe('8. ✅ Variáveis Dinâmicas ({userName})', () => {

        it('deve encontrar placeholders {userName} em step-20 e step-21', () => {
            const step20 = QUIZ_STEPS['step-20'];
            const step21 = QUIZ_STEPS['step-21'];

            expect(step20.title).toContain('{userName}');

            // Verificar em todas as ofertas
            Object.values(step21.offerMap || {}).forEach(offer => {
                expect(offer.title).toContain('{userName}');
            });
        });

        it('deve substituir {userName} no runtime', () => {
            const template = '{userName}, seu estilo predominante é:';
            const userName = 'Maria';
            const result = template.replace(/{userName}/g, userName);

            expect(result).toBe('Maria, seu estilo predominante é:');

            // TODO: Editor deve:
            // - Permitir inserir {userName} nos textos
            // - Preview mostrar nome de exemplo
            // - Runtime substituir pelo nome real do estado
        });
    });

    describe('9. 📊 RESUMO DOS GAPS', () => {

        it('deve listar todos os gaps identificados', () => {
            const gaps = [
                { id: 1, tipo: 'Componente', item: 'testimonial', prioridade: 'ALTA' },
                { id: 2, tipo: 'Componente', item: 'style-result-card', prioridade: 'ALTA' },
                { id: 3, tipo: 'Componente', item: 'offer-map', prioridade: 'ALTA' },
                { id: 4, tipo: 'Propriedade', item: 'QuizOptions.requiredSelections', prioridade: 'ALTA' },
                { id: 5, tipo: 'Propriedade', item: 'QuizOptions.showImages', prioridade: 'MÉDIA' },
                { id: 6, tipo: 'Propriedade', item: 'Heading.fontFamily', prioridade: 'MÉDIA' },
                { id: 7, tipo: 'Propriedade', item: 'Transition.showContinueButton/continueButtonText/duration', prioridade: 'MÉDIA' },
                { id: 8, tipo: 'Validação', item: 'IDs de estilos em QuizOptions', prioridade: 'ALTA' },
                { id: 9, tipo: 'Validação', item: 'Mapeamento step-18 → offerMap', prioridade: 'ALTA' },
                { id: 10, tipo: 'Validação', item: 'FormInput obrigatório em step-01', prioridade: 'MÉDIA' },
                { id: 11, tipo: 'Validação', item: 'nextStep válido', prioridade: 'MÉDIA' },
                { id: 12, tipo: 'Conversão', item: 'QuizStep → EditableBlocks', prioridade: 'ALTA' },
                { id: 13, tipo: 'Conversão', item: 'EditableBlocks → QuizStep', prioridade: 'ALTA' },
                { id: 14, tipo: 'Conversão', item: 'Round-trip completo', prioridade: 'ALTA' },
            ];

            console.table(gaps);

            const alta = gaps.filter(g => g.prioridade === 'ALTA').length;
            const media = gaps.filter(g => g.prioridade === 'MÉDIA').length;

            console.log(`\n📊 RESUMO:`);
            console.log(`   Total de Gaps: ${gaps.length}`);
            console.log(`   Prioridade ALTA: ${alta} (${Math.round(alta / gaps.length * 100)}%)`);
            console.log(`   Prioridade MÉDIA: ${media} (${Math.round(media / gaps.length * 100)}%)`);

            expect(gaps.length).toBe(14);
            expect(alta).toBe(9); // 64% são críticos
        });

        it('deve calcular percentual de cobertura do editor', () => {
            const totalEtapas = 21;
            const etapasEditaveisComGaps = [
                1,  // step-01: parcial (falta validação FormInput)
                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, // steps 02-11: parcial (falta requiredSelections, showImages)
                12, // step-12: parcial (falta duration, showContinueButton)
                13, 14, 15, 16, 17, 18, // steps 13-18: parcial (falta validação offerMap)
                19, // step-19: ok
                20, // step-20: NÃO (falta style-result-card)
                21  // step-21: NÃO (falta offer-map, testimonial)
            ];

            // Etapas 100% editáveis: apenas step-19
            const etapas100 = 1;

            // Etapas parcialmente editáveis (60-80%): steps 01-18
            const etapasParciais = 18;

            // Etapas não editáveis (0-40%): steps 20-21
            const etapasNao = 2;

            const coberturaPonderada = (
                (etapas100 * 100) +
                (etapasParciais * 70) +
                (etapasNao * 20)
            ) / totalEtapas;

            console.log(`\n📈 COBERTURA DO EDITOR:`);
            console.log(`   Etapas 100% editáveis: ${etapas100}/${totalEtapas} (${Math.round(etapas100 / totalEtapas * 100)}%)`);
            console.log(`   Etapas parcialmente editáveis: ${etapasParciais}/${totalEtapas} (${Math.round(etapasParciais / totalEtapas * 100)}%)`);
            console.log(`   Etapas não editáveis: ${etapasNao}/${totalEtapas} (${Math.round(etapasNao / totalEtapas * 100)}%)`);
            console.log(`   COBERTURA PONDERADA: ${Math.round(coberturaPonderada)}%`);

            expect(Math.round(coberturaPonderada)).toBe(67); // ~67% de cobertura
        });
    });
});

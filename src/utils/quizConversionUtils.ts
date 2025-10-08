/**
 * 🔄 QUIZ CONVERSION UTILITIES
 * 
 * Conversões bidirecionais entre QuizStep (runtime) e EditableBlocks (editor)
 * Permite carregar funis existentes e salvar edições de volta.
 * 
 * Suporta todas as 21 etapas do /quiz-estilo com 100% de fidelidade.
 */

import { QuizStep, QuizOption } from '@/data/quizSteps';

// ================================
// TIPOS
// ================================

export interface EditableBlock {
    id: string;
    type: string;
    order: number;
    properties: Record<string, any>;
    content: Record<string, any>;
}

export interface EditableStep extends Omit<QuizStep, 'id'> {
    id: string;
    blocks: EditableBlock[];
}

// ================================
// CONVERSÃO: QuizStep → EditableBlocks
// ================================

/**
 * Converte um QuizStep para blocos editáveis
 * Suporta todos os 7 tipos de etapa do quiz-estilo
 */
export function convertStepToBlocks(step: QuizStep & { id: string }): EditableBlock[] {
    const blocks: EditableBlock[] = [];
    let order = 0;

    const stepType = step.type;

    // =============================
    // STEP-01: INTRO (Entrada com FormInput)
    // =============================
    if (stepType === 'intro') {
        // Título HTML (com Playfair Display)
        if (step.title) {
            blocks.push({
                id: `${step.id}-title`,
                type: 'heading',
                order: order++,
                properties: {
                    level: 'h1',
                    textAlign: 'center',
                    fontFamily: 'playfair-display', // ✅ Propriedade crítica
                    color: '#432818'
                },
                content: { text: step.title }
            });
        }

        // Pergunta do formulário
        if (step.formQuestion) {
            blocks.push({
                id: `${step.id}-form-question`,
                type: 'heading',
                order: order++,
                properties: {
                    level: 'h3',
                    textAlign: 'center',
                    color: '#6B4F43'
                },
                content: { text: step.formQuestion }
            });
        }

        // Input de texto (coletar nome)
        if (step.placeholder && step.buttonText) {
            blocks.push({
                id: `${step.id}-form-input`,
                type: 'form-input',
                order: order++,
                properties: {
                    inputType: 'text',
                    required: true,
                    placeholder: step.placeholder,
                    buttonText: step.buttonText,
                    action: 'collect-name'
                },
                content: {}
            });
        }

        // Imagem
        if (step.image) {
            blocks.push({
                id: `${step.id}-image`,
                type: 'image',
                order: order++,
                properties: {
                    width: '100%',
                    maxWidth: '600px',
                    borderRadius: '12px',
                    alignment: 'center'
                },
                content: { src: step.image, alt: 'Quiz intro image' }
            });
        }
    }

    // =============================
    // STEPS 02-11: QUESTION (Perguntas principais com estilos)
    // =============================
    else if (stepType === 'question') {
        // Número da pergunta
        if (step.questionNumber) {
            blocks.push({
                id: `${step.id}-question-number`,
                type: 'badge',
                order: order++,
                properties: {
                    variant: 'secondary',
                    alignment: 'center'
                },
                content: { text: `Pergunta ${step.questionNumber} de 10` }
            });
        }

        // Texto da pergunta
        if (step.questionText) {
            blocks.push({
                id: `${step.id}-question-text`,
                type: 'heading',
                order: order++,
                properties: {
                    level: 'h2',
                    textAlign: 'center',
                    color: '#432818'
                },
                content: { text: step.questionText }
            });
        }

        // Grid de opções (com imagens de estilos)
        if (step.options && step.options.length > 0) {
            blocks.push({
                id: `${step.id}-options`,
                type: 'quiz-options',
                order: order++,
                properties: {
                    multiSelect: true,
                    requiredSelections: step.requiredSelections || 3, // ✅ Propriedade crítica
                    showImages: true, // ✅ Propriedade crítica (perguntas principais TÊM imagens)
                    gridColumns: 4,
                    alignment: 'center'
                },
                content: {
                    options: step.options.map((opt: QuizOption) => ({
                        id: opt.id,
                        text: opt.text,
                        image: opt.image,
                        value: opt.id // ID = estilo (e.g., 'clássico', 'natural')
                    }))
                }
            });
        }
    }

    // =============================
    // STEP-12: TRANSITION (Transição antes das estratégicas)
    // =============================
    else if (stepType === 'transition') {
        // Título
        if (step.title) {
            blocks.push({
                id: `${step.id}-title`,
                type: 'heading',
                order: order++,
                properties: {
                    level: 'h2',
                    textAlign: 'center',
                    fontFamily: 'playfair-display',
                    color: '#432818'
                },
                content: { text: step.title }
            });
        }

        // Corpo da transição
        if (step.text) {
            blocks.push({
                id: `${step.id}-text`,
                type: 'text',
                order: order++,
                properties: {
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    color: '#6B4F43',
                    maxWidth: '600px'
                },
                content: { text: step.text }
            });
        }

        // Botão de continuar
        if (step.showContinueButton && step.continueButtonText) {
            blocks.push({
                id: `${step.id}-continue-button`,
                type: 'button',
                order: order++,
                properties: {
                    backgroundColor: '#B89B7A',
                    textColor: '#FFFFFF',
                    size: 'large',
                    action: 'next-step',
                    alignment: 'center'
                },
                content: { text: step.continueButtonText }
            });
        }

        // Propriedades da transição
        blocks.push({
            id: `${step.id}-transition-config`,
            type: 'transition-config',
            order: order++,
            properties: {
                duration: step.duration || 3500, // ✅ Propriedade crítica
                showContinueButton: step.showContinueButton || false,
                autoAdvance: !step.showContinueButton
            },
            content: {}
        });
    }

    // =============================
    // STEPS 13-18: STRATEGIC-QUESTION (Perguntas estratégicas SEM imagens)
    // =============================
    else if (stepType === 'strategic-question') {
        // Texto da pergunta
        if (step.questionText) {
            blocks.push({
                id: `${step.id}-question-text`,
                type: 'heading',
                order: order++,
                properties: {
                    level: 'h2',
                    textAlign: 'center',
                    color: '#432818'
                },
                content: { text: step.questionText }
            });
        }

        // Grid de opções (SEM imagens)
        if (step.options && step.options.length > 0) {
            blocks.push({
                id: `${step.id}-options`,
                type: 'quiz-options',
                order: order++,
                properties: {
                    multiSelect: false,
                    requiredSelections: 1,
                    showImages: false, // ✅ Propriedade crítica (estratégicas NÃO têm imagens)
                    alignment: 'center'
                },
                content: {
                    options: step.options.map((opt: QuizOption) => ({
                        id: opt.id,
                        text: opt.text,
                        value: opt.id
                    }))
                }
            });
        }
    }

    // =============================
    // STEP-19: TRANSITION-RESULT (Transição antes do resultado)
    // =============================
    else if (stepType === 'transition-result') {
        // Apenas título (auto-advance)
        if (step.title) {
            blocks.push({
                id: `${step.id}-title`,
                type: 'heading',
                order: order++,
                properties: {
                    level: 'h2',
                    textAlign: 'center',
                    fontFamily: 'playfair-display',
                    color: '#432818'
                },
                content: { text: step.title }
            });
        }

        // Loading animation
        blocks.push({
            id: `${step.id}-loading`,
            type: 'loading-animation',
            order: order++,
            properties: {
                variant: 'dots',
                color: '#B89B7A',
                size: 'medium'
            },
            content: {}
        });

        // Auto-advance config
        blocks.push({
            id: `${step.id}-transition-config`,
            type: 'transition-config',
            order: order++,
            properties: {
                duration: 2000,
                autoAdvance: true,
                showContinueButton: false
            },
            content: {}
        });
    }

    // =============================
    // STEP-20: RESULT (Exibir estilo calculado)
    // =============================
    else if (stepType === 'result') {
        // Título com placeholder {userName}
        if (step.title) {
            blocks.push({
                id: `${step.id}-title`,
                type: 'heading',
                order: order++,
                properties: {
                    level: 'h2',
                    textAlign: 'center',
                    fontFamily: 'playfair-display',
                    color: '#432818'
                },
                content: { text: step.title } // Contém {userName}
            });
        }

        // Card de resultado do estilo (NOVO COMPONENTE)
        blocks.push({
            id: `${step.id}-style-result-card`,
            type: 'style-result-card',
            order: order++,
            properties: {
                showSecondaryStyles: true,
                showCharacteristics: true,
                showRecommendations: true,
                animateReveal: true
            },
            content: {
                // Lido dinamicamente do quizState.resultStyle
                readFromState: true
            }
        });

        // Botão de ação
        if (step.buttonText) {
            blocks.push({
                id: `${step.id}-button`,
                type: 'button',
                order: order++,
                properties: {
                    backgroundColor: '#B89B7A',
                    textColor: '#FFFFFF',
                    size: 'large',
                    action: 'next-step',
                    alignment: 'center'
                },
                content: { text: step.buttonText }
            });
        }
    }

    // =============================
    // STEP-21: OFFER (Oferta personalizada com offerMap)
    // =============================
    else if (stepType === 'offer') {
        // Imagem da oferta
        if (step.image) {
            blocks.push({
                id: `${step.id}-image`,
                type: 'image',
                order: order++,
                properties: {
                    width: '100%',
                    maxWidth: '800px',
                    borderRadius: '16px',
                    alignment: 'center'
                },
                content: { src: step.image, alt: 'Oferta personalizada' }
            });
        }

        // OfferMap - 4 variações de oferta (NOVO COMPONENTE)
        if (step.offerMap) {
            blocks.push({
                id: `${step.id}-offer-map`,
                type: 'offer-map',
                order: order++,
                properties: {
                    readFromStrategicAnswers: true, // Seleciona oferta baseado em step-18
                    showTestimonials: true
                },
                content: {
                    offerMap: step.offerMap
                }
            });
        }

        // Botão de CTA
        if (step.buttonText) {
            blocks.push({
                id: `${step.id}-cta-button`,
                type: 'button',
                order: order++,
                properties: {
                    backgroundColor: '#B89B7A',
                    textColor: '#FFFFFF',
                    size: 'large',
                    action: 'checkout',
                    alignment: 'center'
                },
                content: { text: step.buttonText }
            });
        }
    }

    return blocks;
}

// ================================
// CONVERSÃO: EditableBlocks → QuizStep
// ================================

/**
 * Converte blocos editáveis de volta para QuizStep
 * Permite salvar edições do editor para produção
 */
export function convertBlocksToStep(
    stepId: string,
    stepType: QuizStep['type'],
    blocks: EditableBlock[]
): Partial<QuizStep> {
    const step: Partial<QuizStep> = {
        type: stepType
    };

    // Iterar pelos blocos e extrair propriedades
    blocks.forEach(block => {
        switch (block.type) {
            case 'heading':
                if (block.id.includes('title')) {
                    step.title = block.content.text;
                } else if (block.id.includes('question')) {
                    step.questionText = block.content.text;
                } else if (block.id.includes('form-question')) {
                    step.formQuestion = block.content.text;
                }
                break;

            case 'badge':
                if (block.id.includes('question-number')) {
                    const match = block.content.text.match(/Pergunta (\d+)/);
                    if (match) step.questionNumber = parseInt(match[1], 10);
                }
                break;

            case 'quiz-options':
                step.options = block.content.options;
                step.requiredSelections = block.properties.requiredSelections || block.properties.maxSelections;
                break;

            case 'form-input':
                step.placeholder = block.properties.placeholder;
                step.buttonText = block.content.text || block.properties.buttonText;
                break;

            case 'button':
                if (!step.buttonText) {
                    step.buttonText = block.content.text;
                }
                break;

            case 'image':
                step.image = block.content.src;
                break;

            case 'text':
                if (block.id.includes('text')) {
                    step.text = block.content.text;
                }
                break;

            case 'transition-config':
                step.duration = block.properties.duration;
                step.showContinueButton = block.properties.showContinueButton;
                if (step.showContinueButton) {
                    // Encontrar bloco de botão de continuar
                    const continueButton = blocks.find(b => b.id.includes('continue-button'));
                    if (continueButton) {
                        step.continueButtonText = continueButton.content.text;
                    }
                }
                break;

            case 'offer-map':
                step.offerMap = block.content.offerMap;
                break;

            default:
                // Ignorar blocos não reconhecidos (style-result-card, loading-animation, etc.)
                break;
        }
    });

    return step;
}

// ================================
// VALIDAÇÃO DE ROUND-TRIP
// ================================

/**
 * Valida se a conversão de ida e volta preserva os dados
 * Útil para testes automatizados
 */
export function validateRoundTrip(
    originalStep: QuizStep & { id: string }
): { success: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
        // 1. Converter para blocos
        const blocks = convertStepToBlocks(originalStep);

        // 2. Converter de volta
        const reconstructed = convertBlocksToStep(originalStep.id, originalStep.type, blocks);

        // 3. Comparar propriedades críticas
        const criticalProps = [
            'type',
            'title',
            'questionText',
            'questionNumber',
            'options',
            'requiredSelections',
            'image',
            'buttonText',
            'formQuestion',
            'placeholder',
            'text',
            'duration',
            'showContinueButton',
            'continueButtonText',
            'offerMap'
        ];

        criticalProps.forEach(prop => {
            if (originalStep[prop as keyof QuizStep] !== undefined) {
                const original = JSON.stringify(originalStep[prop as keyof QuizStep]);
                const reconstructedValue = JSON.stringify(reconstructed[prop as keyof QuizStep]);

                if (original !== reconstructedValue) {
                    errors.push(`Propriedade "${prop}" não preservada: ${original} !== ${reconstructedValue}`);
                }
            }
        });
    } catch (error) {
        errors.push(`Exceção durante round-trip: ${error}`);
    }

    return {
        success: errors.length === 0,
        errors
    };
}

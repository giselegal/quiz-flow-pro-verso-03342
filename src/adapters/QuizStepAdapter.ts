// src/adapters/QuizStepAdapter.ts

import type { QuizStep, QuizOption } from '@/data/quizSteps';

interface JSONTemplate {
    templateVersion: string;
    metadata?: {
        id: string;
        name: string;
        category: string;
        tags?: string[];
    };
    layout?: {
        containerWidth: string;
        spacing: string;
        backgroundColor: string;
    };
    validation?: Record<string, any>;
    analytics?: Record<string, any>;
    blocks: JSONBlock[];
}

interface JSONBlock {
    id: string;
    type: string;
    position: number;
    properties: Record<string, any>;
}

/**
 * Adaptador para converter templates JSON para formato QuizStep
 */
export class QuizStepAdapter {
    /**
     * Converte template JSON para QuizStep
     */
    static fromJSON(json: JSONTemplate): QuizStep {
        const { blocks, metadata } = json;

        // Detectar tipo de step baseado nos blocos
        const stepType = this.detectStepType(blocks, metadata);

        // Construir QuizStep baseado no tipo
        switch (stepType) {
            case 'intro':
                return this.convertIntroStep(blocks, metadata);

            case 'question':
                return this.convertQuestionStep(blocks, metadata);

            case 'strategic-question':
                return this.convertStrategicQuestionStep(blocks, metadata);

            case 'transition':
                return this.convertTransitionStep(blocks, metadata);

            case 'result':
                return this.convertResultStep(blocks, metadata);

            case 'offer':
                return this.convertOfferStep(blocks, metadata);

            default:
                throw new Error(`Unknown step type: ${stepType}`);
        }
    }

    /**
     * Detecta tipo de step baseado nos blocos
     */
    private static detectStepType(blocks: JSONBlock[], metadata?: any): QuizStep['type'] {
        // Verificar por tipo de bloco característico
        const hasFormInput = blocks.some(b => b.type === 'form-input');
        const hasOptionsGrid = blocks.some(b => b.type === 'options-grid' || b.type === 'quiz-question');
        const hasResultDisplay = blocks.some(b => b.type === 'result-display');
        const hasOfferCard = blocks.some(b => b.type === 'offer-card');

        // Verificar metadata
        const category = metadata?.category || '';

        if (category.includes('intro') || hasFormInput) {
            return 'intro';
        }

        if (category.includes('question') || hasOptionsGrid) {
            // Diferenciar question de strategic-question
            const questionBlock = blocks.find(b =>
                b.type === 'text-inline' &&
                b.properties.content?.includes('QUAL') ||
                b.properties.content?.includes('RESUMA')
            );

            if (questionBlock?.properties.content?.includes('importante')) {
                return 'strategic-question';
            }

            return 'question';
        }

        if (category.includes('transition')) {
            return 'transition';
        }

        if (category.includes('result') || hasResultDisplay) {
            return 'result';
        }

        if (category.includes('offer') || hasOfferCard) {
            return 'offer';
        }

        // Default
        return 'intro';
    }

    /**
     * Converte step de introdução
     */
    private static convertIntroStep(blocks: JSONBlock[], metadata?: any): QuizStep {
        const titleBlock = blocks.find(b => b.type === 'text-inline' && b.position <= 4);
        const imageBlock = blocks.find(b => b.type === 'image-display-inline');
        const inputBlock = blocks.find(b => b.type === 'form-input');
        const buttonBlock = blocks.find(b => b.type === 'button-inline');

        return {
            id: metadata?.id || 'step-01',
            type: 'intro',
            title: titleBlock?.properties.content || '',
            formQuestion: inputBlock?.properties.label || 'Como posso te chamar?',
            placeholder: inputBlock?.properties.placeholder || 'Digite seu primeiro nome...',
            buttonText: buttonBlock?.properties.text || 'Continuar',
            image: imageBlock?.properties.src || '',
            nextStep: 'step-02',
        };
    }

    /**
     * Converte step de pergunta
     */
    private static convertQuestionStep(blocks: JSONBlock[], metadata?: any): QuizStep {
        const questionBlock = blocks.find(b =>
            b.type === 'text-inline' &&
            (b.properties.content?.includes('?') || b.properties.content?.includes('QUAL'))
        );

        const optionsBlock = blocks.find(b =>
            b.type === 'options-grid' ||
            b.type === 'quiz-question'
        );

        // Extrair número da pergunta do metadata ou do bloco
        const stepNumber = metadata?.id?.match(/\d+/)?.[0] || '1';
        const questionNumber = `${parseInt(stepNumber) - 1} de 10`;

        // Converter opções
        const options: QuizOption[] = [];
        if (optionsBlock?.properties.options) {
            optionsBlock.properties.options.forEach((opt: any) => {
                options.push({
                    id: opt.styleId || opt.id || '',
                    text: opt.text || opt.label || '',
                    image: opt.image || opt.imageUrl || '',
                });
            });
        }

        return {
            id: metadata?.id || `step-${stepNumber}`,
            type: 'question',
            questionNumber,
            questionText: questionBlock?.properties.content?.replace(/<[^>]*>/g, '') || '',
            requiredSelections: optionsBlock?.properties.requiredSelections || 3,
            options,
            nextStep: `step-${String(parseInt(stepNumber) + 1).padStart(2, '0')}`,
        };
    }

    /**
     * Converte step de pergunta estratégica
     */
    private static convertStrategicQuestionStep(blocks: JSONBlock[], metadata?: any): QuizStep {
        const questionBlock = blocks.find(b => b.type === 'text-inline');
        const inputBlock = blocks.find(b => b.type === 'form-input' || b.type === 'textarea');
        const buttonBlock = blocks.find(b => b.type === 'button-inline');

        const stepNumber = metadata?.id?.match(/\d+/)?.[0] || '13';

        return {
            id: metadata?.id || `step-${stepNumber}`,
            type: 'strategic-question',
            questionText: questionBlock?.properties.content?.replace(/<[^>]*>/g, '') || '',
            placeholder: inputBlock?.properties.placeholder || 'Digite sua resposta...',
            buttonText: buttonBlock?.properties.text || 'Próxima',
            nextStep: `step-${String(parseInt(stepNumber) + 1).padStart(2, '0')}`,
        };
    }

    /**
     * Converte step de transição
     */
    private static convertTransitionStep(blocks: JSONBlock[], metadata?: any): QuizStep {
        const textBlock = blocks.find(b => b.type === 'text-inline');
        const buttonBlock = blocks.find(b => b.type === 'button-inline');

        return {
            id: metadata?.id || 'step-12',
            type: 'transition',
            text: textBlock?.properties.content?.replace(/<[^>]*>/g, '') || '',
            showContinueButton: !!buttonBlock,
            continueButtonText: buttonBlock?.properties.text || 'Continuar',
            duration: 3000,
            nextStep: metadata?.id === 'step-12' ? 'step-13' : 'step-20',
        };
    }

    /**
     * Converte step de resultado
     */
    private static convertResultStep(blocks: JSONBlock[], metadata?: any): QuizStep {
        return {
            id: metadata?.id || 'step-20',
            type: 'result',
            nextStep: 'step-21',
        };
    }

    /**
     * Converte step de oferta
     */
    private static convertOfferStep(blocks: JSONBlock[], metadata?: any): QuizStep {
        return {
            id: metadata?.id || 'step-21',
            type: 'offer',
            offerMap: {}, // Será populado dinamicamente
        };
    }

    /**
     * Converte QuizStep para blocos JSON (operação inversa)
     */
    static toJSONBlocks(step: QuizStep): JSONBlock[] {
        const blocks: JSONBlock[] = [];
        let position = 0;

        switch (step.type) {
            case 'intro':
                // Header
                blocks.push({
                    id: `${step.id}-header`,
                    type: 'quiz-intro-header',
                    position: position++,
                    properties: {
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                        logoAlt: 'Logo Gisele Galvão',
                        showProgress: false,
                    },
                });

                // Title
                if (step.title) {
                    blocks.push({
                        id: `${step.id}-title`,
                        type: 'text-inline',
                        position: position++,
                        properties: {
                            content: step.title,
                            fontSize: 'text-2xl',
                            fontWeight: 'font-bold',
                            textAlign: 'text-center',
                        },
                    });
                }

                // Image
                if (step.image) {
                    blocks.push({
                        id: `${step.id}-image`,
                        type: 'image-display-inline',
                        position: position++,
                        properties: {
                            src: step.image,
                            alt: 'Quiz image',
                        },
                    });
                }

                // Input
                if (step.formQuestion) {
                    blocks.push({
                        id: `${step.id}-input`,
                        type: 'form-input',
                        position: position++,
                        properties: {
                            label: step.formQuestion,
                            placeholder: step.placeholder || '',
                            inputType: 'text',
                            required: true,
                        },
                    });
                }

                // Button
                if (step.buttonText) {
                    blocks.push({
                        id: `${step.id}-button`,
                        type: 'button-inline',
                        position: position++,
                        properties: {
                            text: step.buttonText,
                            variant: 'primary',
                        },
                    });
                }
                break;

            case 'question':
                // Question text
                if (step.questionText) {
                    blocks.push({
                        id: `${step.id}-question`,
                        type: 'text-inline',
                        position: position++,
                        properties: {
                            content: step.questionText,
                            fontSize: 'text-xl',
                            fontWeight: 'font-bold',
                        },
                    });
                }

                // Options grid
                if (step.options) {
                    blocks.push({
                        id: `${step.id}-options`,
                        type: 'options-grid',
                        position: position++,
                        properties: {
                            options: step.options.map(opt => ({
                                id: opt.id,
                                text: opt.text,
                                image: opt.image,
                                styleId: opt.id,
                            })),
                            requiredSelections: step.requiredSelections || 3,
                            columns: 2,
                        },
                    });
                }
                break;

            case 'strategic-question':
                // Question text
                if (step.questionText) {
                    blocks.push({
                        id: `${step.id}-question`,
                        type: 'text-inline',
                        position: position++,
                        properties: {
                            content: step.questionText,
                            fontSize: 'text-xl',
                            fontWeight: 'font-bold',
                        },
                    });
                }

                // Input
                blocks.push({
                    id: `${step.id}-input`,
                    type: 'form-input',
                    position: position++,
                    properties: {
                        placeholder: step.placeholder || '',
                        inputType: 'text',
                    },
                });

                // Button
                if (step.buttonText) {
                    blocks.push({
                        id: `${step.id}-button`,
                        type: 'button-inline',
                        position: position++,
                        properties: {
                            text: step.buttonText,
                        },
                    });
                }
                break;

            case 'transition':
                // Text
                if (step.text) {
                    blocks.push({
                        id: `${step.id}-text`,
                        type: 'text-inline',
                        position: position++,
                        properties: {
                            content: step.text,
                        },
                    });
                }

                // Button (se tiver)
                if (step.showContinueButton && step.continueButtonText) {
                    blocks.push({
                        id: `${step.id}-button`,
                        type: 'button-inline',
                        position: position++,
                        properties: {
                            text: step.continueButtonText,
                        },
                    });
                }
                break;

            case 'result':
                blocks.push({
                    id: `${step.id}-result`,
                    type: 'result-display',
                    position: position++,
                    properties: {},
                });
                break;

            case 'offer':
                blocks.push({
                    id: `${step.id}-offer`,
                    type: 'offer-card',
                    position: position++,
                    properties: {},
                });
                break;
        }

        return blocks;
    }
}

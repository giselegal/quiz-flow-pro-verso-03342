/**
 * 🎯 STEP TO BLOCKS - Decomposição de Steps em Blocos
 * 
 * Funções para converter steps do formato antigo (EditableQuizStep)
 * para o formato novo (array de BlockData).
 * 
 * Cada propriedade do step vira um bloco modular independente.
 */

import { BlockData, StepData } from '@/types/blockTypes';
import { QuizStep } from '@/data/quizSteps';

type EditableQuizStep = QuizStep & { id: string };

/**
 * Gera ID único para bloco
 */
function generateBlockId(stepId: string, blockType: string, index: number): string {
    return `${stepId}-block-${blockType}-${index}`;
}

/**
 * Decompõe step INTRO em blocos
 */
function decomposeIntroStep(step: EditableQuizStep): BlockData[] {
    const blocks: BlockData[] = [];
    let order = 1;

    // Bloco 1: Título
    if (step.title) {
        blocks.push({
            id: generateBlockId(step.id, 'title', order),
            type: 'title',
            component: 'TitleBlock',
            order: order++,
            props: {
                text: step.title,
                html: step.title,
                fontSize: '2xl',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#432818',
            },
            metadata: {
                label: 'Título Principal',
                icon: '📝',
                category: 'intro'
            }
        });
    }

    // Bloco 2: Imagem
    if (step.image) {
        blocks.push({
            id: generateBlockId(step.id, 'image', order),
            type: 'image',
            component: 'ImageBlock',
            order: order++,
            props: {
                src: step.image,
                alt: 'Quiz',
                width: '100%',
                objectFit: 'cover',
                rounded: true,
            },
            metadata: {
                label: 'Imagem de Destaque',
                icon: '🖼️',
                category: 'intro'
            }
        });
    }

    // Bloco 3: Campo de Input
    if (step.formQuestion) {
        blocks.push({
            id: generateBlockId(step.id, 'form-input', order),
            type: 'form-input',
            component: 'FormInputBlock',
            order: order++,
            props: {
                label: step.formQuestion,
                placeholder: step.placeholder || '',
                type: 'text',
                required: true,
            },
            metadata: {
                label: 'Campo de Nome',
                icon: '📥',
                category: 'intro'
            }
        });
    }

    // Bloco 4: Botão
    if (step.buttonText) {
        blocks.push({
            id: generateBlockId(step.id, 'button', order),
            type: 'button',
            component: 'ButtonBlock',
            order: order++,
            props: {
                text: step.buttonText,
                variant: 'default',
                size: 'lg',
            },
            metadata: {
                label: 'Botão de Ação',
                icon: '🔘',
                category: 'intro'
            }
        });
    }

    return blocks;
}

/**
 * Decompõe step QUESTION em blocos
 */
function decomposeQuestionStep(step: EditableQuizStep): BlockData[] {
    const blocks: BlockData[] = [];
    let order = 1;

    // Bloco 1: Texto da Pergunta
    if (step.questionText) {
        blocks.push({
            id: generateBlockId(step.id, 'question-text', order),
            type: 'question-text',
            component: 'QuestionTextBlock',
            order: order++,
            props: {
                text: step.questionText,
                number: step.questionNumber || '',
                fontSize: 'xl',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#432818',
            },
            metadata: {
                label: 'Texto da Pergunta',
                icon: '❓',
                category: 'question'
            }
        });
    }

    // Bloco 2: Opções (AGRUPADAS)
    if (step.options && step.options.length > 0) {
        blocks.push({
            id: generateBlockId(step.id, 'options', order),
            type: 'options',
            component: 'OptionsBlock',
            order: order++,
            props: {
                options: step.options,
                requiredSelections: step.requiredSelections || 1,
                layout: 'grid',
                columns: 2,
            },
            metadata: {
                label: `Opções (${step.options.length})`,
                icon: '✅',
                category: 'question'
            }
        });
    }

    return blocks;
}

/**
 * Decompõe step STRATEGIC-QUESTION em blocos
 */
function decomposeStrategicQuestionStep(step: EditableQuizStep): BlockData[] {
    // Mesma lógica que question
    return decomposeQuestionStep(step);
}

/**
 * Decompõe step TRANSITION em blocos
 */
function decomposeTransitionStep(step: EditableQuizStep): BlockData[] {
    const blocks: BlockData[] = [];
    let order = 1;

    // Bloco: Título/Texto
    if (step.title || step.text) {
        blocks.push({
            id: generateBlockId(step.id, 'title', order),
            type: 'title',
            component: 'TitleBlock',
            order: order++,
            props: {
                text: step.title || step.text || 'Aguarde...',
                fontSize: 'xl',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#432818',
            },
            metadata: {
                label: 'Mensagem de Transição',
                icon: '⏳',
                category: 'transition'
            }
        });
    }

    return blocks;
}

/**
 * Decompõe step RESULT em blocos
 */
function decomposeResultStep(step: EditableQuizStep): BlockData[] {
    const blocks: BlockData[] = [];
    let order = 1;

    // Bloco: Título do Resultado
    if (step.title) {
        blocks.push({
            id: generateBlockId(step.id, 'title', order),
            type: 'title',
            component: 'TitleBlock',
            order: order++,
            props: {
                text: step.title,
                fontSize: '2xl',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#432818',
            },
            metadata: {
                label: 'Título do Resultado',
                icon: '🏆',
                category: 'result'
            }
        });
    }

    return blocks;
}

/**
 * Decompõe step OFFER em blocos
 */
function decomposeOfferStep(step: EditableQuizStep): BlockData[] {
    const blocks: BlockData[] = [];
    let order = 1;

    // Bloco: Imagem da Oferta
    if (step.image) {
        blocks.push({
            id: generateBlockId(step.id, 'image', order),
            type: 'image',
            component: 'ImageBlock',
            order: order++,
            props: {
                src: step.image,
                alt: 'Oferta',
                width: '100%',
                objectFit: 'cover',
                rounded: true,
            },
            metadata: {
                label: 'Imagem da Oferta',
                icon: '🎁',
                category: 'offer'
            }
        });
    }

    return blocks;
}

/**
 * Decompõe step em blocos (função principal)
 */
export function stepToBlocks(step: EditableQuizStep): BlockData[] {
    switch (step.type) {
        case 'intro':
            return decomposeIntroStep(step);

        case 'question':
            return decomposeQuestionStep(step);

        case 'strategic-question':
            return decomposeStrategicQuestionStep(step);

        case 'transition':
        case 'transition-result':
            return decomposeTransitionStep(step);

        case 'result':
            return decomposeResultStep(step);

        case 'offer':
            return decomposeOfferStep(step);

        default:
            console.warn(`Tipo de step não suportado: ${step.type}`);
            return [];
    }
}

/**
 * Converte EditableQuizStep para StepData (com blocos)
 */
export function convertStepToStepData(step: EditableQuizStep): StepData {
    const blocks = stepToBlocks(step);

    return {
        id: step.id,
        type: step.type,
        blocks,
        nextStep: step.nextStep,
        metadata: {
            name: `Step ${step.type}`,
            description: `Step do tipo ${step.type}`,
        }
    };
}

/**
 * Converte array de EditableQuizStep para array de StepData
 */
export function convertStepsToStepData(steps: EditableQuizStep[]): StepData[] {
    return steps.map(convertStepToStepData);
}

export default stepToBlocks;

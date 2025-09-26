/**
 * QUIZ 21 STEPS SIMPLIFIED TEMPLATE INTEGRATION
 */

import { getStepTemplate, QUIZ_STYLE_21_STEPS_TEMPLATE } from './quiz21StepsComplete';
import type { Block } from '../types/editor';

// Função para converter Block[] para QuizStep
function convertBlocksToQuizStep(blocks: Block[]): any {
    if (!blocks || blocks.length === 0) return null;

    // Encontrar blocos principais
    const titleBlock = blocks.find(block => block.id?.includes('title') || block.type === 'text');
    const imageBlock = blocks.find(block => block.type === 'image');
    const formBlock = blocks.find(block => block.type === 'form-container');

    // Construir objeto QuizStep compatível
    const quizStep: any = {
        type: 'intro', // Para step-1
        title: titleBlock?.content?.text || '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você.</span>',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: imageBlock?.properties?.src || 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
        nextStep: 'step-2',
    };

    return quizStep;
}

export function getPersonalizedStepTemplate(stepId: string, funnelId?: string): any {
    // Para step-1, sempre retornar a configuração correta
    if (stepId === 'step-1') {
        const blocks = getStepTemplate('step-1');
        if (blocks) {
            return convertBlocksToQuizStep(blocks);
        }

        // Fallback hardcoded para garantir que funciona
        return {
            type: 'intro',
            title: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você.</span>',
            formQuestion: 'Como posso te chamar?',
            placeholder: 'Digite seu primeiro nome aqui...',
            buttonText: 'Quero Descobrir meu Estilo Agora!',
            image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
            nextStep: 'step-2',
        };
    }

    // Para outras etapas, usar o template personalizado se disponível
    if (funnelId) {
        const blocks = getStepTemplate(stepId);
        if (blocks) {
            return convertBlocksToQuizStep(blocks);
        }
    }

    return null; // Fallback para QUIZ_STEPS padrão
}

export function getStepTemplateSimplified(stepId: string): any {
    return getPersonalizedStepTemplate(stepId);
}
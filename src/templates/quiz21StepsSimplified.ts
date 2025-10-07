/**
 * QUIZ 21 STEPS SIMPLIFIED TEMPLATE INTEGRATION
 */

import { getStepTemplate } from './quiz21StepsComplete';
import type { Block } from '../types/editor';

// Função para converter Block[] para QuizStep
function convertBlocksToQuizStep(blocks: Block[]): any {
    if (!blocks || blocks.length === 0) return null;

    // Encontrar blocos principais
    const titleBlock = blocks.find(block => block.id?.includes('title') || block.type === 'text');
    const imageBlock = blocks.find(block => block.type === 'image');
    // const formBlock = blocks.find(block => block.type === 'form-container'); // Não utilizado

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
    // ⚠️ Correção: Só personalizamos a primeira etapa.
    // As demais estavam retornando um objeto do tipo 'intro' indevido, quebrando o fluxo
    // (progressão, tipos de pergunta e cálculo de pontuação).
    if (stepId === 'step-1') {
        const blocks = getStepTemplate('step-1');
        if (blocks) {
            return convertBlocksToQuizStep(blocks);
        }
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
    // Para qualquer outra etapa devolvemos null → useQuizState fará fallback para QUIZ_STEPS.
    return null;
}

export function getStepTemplateSimplified(stepId: string): any {
    return getPersonalizedStepTemplate(stepId);
}
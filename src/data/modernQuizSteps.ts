/**
 * 🎯 ESTRUTURA MODERNIZADA DAS ETAPAS DO QUIZ
 * 
 * Versão atualizada que utiliza os novos componentes:
 * - Header: Para cabeçalho com logo, progresso e botão voltar
 * - Heading: Para títulos das questões
 * - Question: Para as questões originais
 * - Spacer: Para espaçamentos visuais
 * - Button: Para botões customizados
 * - Script: Para códigos específicos
 */

import { QuizStep, QuizOption, OfferContent } from './quizSteps';

export interface ModernQuizStep extends QuizStep {
    components?: Array<{
        id: string;
        type: 'header' | 'heading' | 'spacer' | 'question' | 'button' | 'script';
        props: any;
        order: number;
    }>;
}

export const MODERN_QUIZ_STEPS: Record<string, ModernQuizStep> = {
    'step-1': {
        type: 'intro',
        title: '<span style="color: #B89B7A; font-weight: 700;" class="playfair-display">Chega</span> <span class="playfair-display">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700;" class="playfair-display">nada combina com você.</span>',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
        nextStep: 'step-2',
        components: [
            {
                id: 'header-step1',
                type: 'header',
                order: 1,
                props: {
                    logo: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
                    progress: 5, // 1 de 21 etapas
                    showLogo: true,
                    showProgress: true,
                    allowReturn: false // Primeira etapa não permite voltar
                }
            },
            {
                id: 'spacer-1',
                type: 'spacer',
                order: 2,
                props: {
                    height: 32
                }
            }
        ]
    },

    'step-2': {
        type: 'question',
        questionNumber: '1 de 10',
        questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Conforto, leveza e praticidade no vestir', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp' },
            { id: 'classico', text: 'Discrição, caimento clássico e sobriedade', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp' },
            { id: 'contemporaneo', text: 'Praticidade com um toque de estilo atual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp' },
            { id: 'elegante', text: 'Elegância refinada, moderna e sem exageros', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp' },
            { id: 'romantico', text: 'Delicadeza em tecidos suaves e fluidos', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp' },
            { id: 'sexy', text: 'Sensualidade com destaque para o corpo', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp' },
            { id: 'dramatico', text: 'Impacto visual com peças estruturadas e assimétricas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp' },
            { id: 'criativo', text: 'Mix criativo com formas ousadas e originais', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp' },
        ],
        nextStep: 'step-3',
        components: [
            {
                id: 'header-step2',
                type: 'header',
                order: 1,
                props: {
                    logo: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
                    progress: 10, // 2 de 21 etapas
                    showLogo: true,
                    showProgress: true,
                    allowReturn: true
                }
            },
            {
                id: 'heading-step2',
                type: 'heading',
                order: 2,
                props: {
                    content: '1 de 10 - QUAL O SEU TIPO DE ROUPA FAVORITA?',
                    alignment: 'center',
                    headingLevel: 1,
                    textColor: '#000000',
                    backgroundColor: '#ffffff',
                    maxWidth: 100,
                    generalAlignment: 'center'
                }
            },
            {
                id: 'spacer-2',
                type: 'spacer',
                order: 3,
                props: {
                    height: 24
                }
            }
        ]
    },

    'step-3': {
        type: 'question',
        questionNumber: '2 de 10',
        questionText: 'RESUMA A SUA PERSONALIDADE:',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Informal, espontânea, alegre, essencialista' },
            { id: 'classico', text: 'Conservadora, séria, organizada' },
            { id: 'contemporaneo', text: 'Informada, ativa, prática' },
            { id: 'elegante', text: 'Exigente, sofisticada, seletiva' },
            { id: 'romantico', text: 'Feminina, meiga, delicada, sensível' },
            { id: 'sexy', text: 'Glamorosa, vaidosa, sensual' },
            { id: 'dramatico', text: 'Cosmopolita, moderna e audaciosa' },
            { id: 'criativo', text: 'Exótica, aventureira, livre' },
        ],
        nextStep: 'step-4',
        components: [
            {
                id: 'header-step3',
                type: 'header',
                order: 1,
                props: {
                    logo: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
                    progress: 15, // 3 de 21 etapas
                    showLogo: true,
                    showProgress: true,
                    allowReturn: true
                }
            },
            {
                id: 'heading-step3',
                type: 'heading',
                order: 2,
                props: {
                    content: '2 de 10 - RESUMA A SUA PERSONALIDADE:',
                    alignment: 'center',
                    headingLevel: 1,
                    textColor: '#000000',
                    backgroundColor: '#ffffff',
                    maxWidth: 100,
                    generalAlignment: 'center'
                }
            },
            {
                id: 'spacer-3',
                type: 'spacer',
                order: 3,
                props: {
                    height: 24
                }
            }
        ]
    },

    'step-4': {
        type: 'question',
        questionNumber: '3 de 10',
        questionText: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Visual leve, despojado e natural', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp' },
            { id: 'classico', text: 'Visual clássico, elegante e atemporal', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735318/3_blqgrt.webp' },
            { id: 'contemporaneo', text: 'Visual moderno, urbano e funcional', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp' },
            { id: 'elegante', text: 'Visual sofisticado, refinado e polido', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_yrxfgw.webp' },
            { id: 'romantico', text: 'Visual delicado, feminino e poético', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/6_acofsv.webp' },
            { id: 'sexy', text: 'Visual sensual, glamoroso e marcante', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/7_brbvkn.webp' },
            { id: 'dramatico', text: 'Visual impactante, geométrico e ousado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/8_s2bdfp.webp' },
            { id: 'criativo', text: 'Visual artístico, excêntrico e único', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735318/9_v8fmep.webp' },
        ],
        nextStep: 'step-5',
        components: [
            {
                id: 'header-step4',
                type: 'header',
                order: 1,
                props: {
                    logo: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
                    progress: 20, // 4 de 21 etapas
                    showLogo: true,
                    showProgress: true,
                    allowReturn: true
                }
            },
            {
                id: 'heading-step4',
                type: 'heading',
                order: 2,
                props: {
                    content: '3 de 10 - QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
                    alignment: 'center',
                    headingLevel: 1,
                    textColor: '#000000',
                    backgroundColor: '#ffffff',
                    maxWidth: 100,
                    generalAlignment: 'center'
                }
            },
            {
                id: 'spacer-4',
                type: 'spacer',
                order: 3,
                props: {
                    height: 24
                }
            }
        ]
    }
};

/**
 * 🔧 UTILITÁRIOS PARA TRABALHAR COM ETAPAS MODERNAS
 */

export function convertToModernStep(step: QuizStep, stepId: string, stepNumber: number, totalSteps: number = 21): ModernQuizStep {
    const progressPercentage = Math.round((stepNumber / totalSteps) * 100);

    const modernStep: ModernQuizStep = {
        ...step,
        components: [
            {
                id: `header-${stepId}`,
                type: 'header',
                order: 1,
                props: {
                    logo: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
                    progress: progressPercentage,
                    showLogo: true,
                    showProgress: true,
                    allowReturn: stepNumber > 1
                }
            }
        ]
    };

    // Adicionar heading para questões
    if (step.type === 'question' && step.questionText) {
        modernStep.components!.push({
            id: `heading-${stepId}`,
            type: 'heading',
            order: 2,
            props: {
                content: step.questionNumber ? `${step.questionNumber} - ${step.questionText}` : step.questionText,
                alignment: 'center',
                headingLevel: 1,
                textColor: '#000000',
                backgroundColor: '#ffffff',
                maxWidth: 100,
                generalAlignment: 'center'
            }
        });

        modernStep.components!.push({
            id: `spacer-${stepId}`,
            type: 'spacer',
            order: 3,
            props: {
                height: 24
            }
        });
    }

    return modernStep;
}

export function getStepComponents(stepId: string): ModernQuizStep['components'] {
    return MODERN_QUIZ_STEPS[stepId]?.components || [];
}

export function addComponentToStep(stepId: string, component: ModernQuizStep['components'][0]): void {
    if (MODERN_QUIZ_STEPS[stepId]) {
        if (!MODERN_QUIZ_STEPS[stepId].components) {
            MODERN_QUIZ_STEPS[stepId].components = [];
        }
        MODERN_QUIZ_STEPS[stepId].components!.push(component);
        // Reordenar por order
        MODERN_QUIZ_STEPS[stepId].components!.sort((a, b) => a.order - b.order);
    }
}

export function removeComponentFromStep(stepId: string, componentId: string): void {
    if (MODERN_QUIZ_STEPS[stepId] && MODERN_QUIZ_STEPS[stepId].components) {
        MODERN_QUIZ_STEPS[stepId].components = MODERN_QUIZ_STEPS[stepId].components!.filter(
            comp => comp.id !== componentId
        );
    }
}

export function updateComponentInStep(stepId: string, componentId: string, newProps: any): void {
    if (MODERN_QUIZ_STEPS[stepId] && MODERN_QUIZ_STEPS[stepId].components) {
        const component = MODERN_QUIZ_STEPS[stepId].components!.find(comp => comp.id === componentId);
        if (component) {
            component.props = { ...component.props, ...newProps };
        }
    }
}
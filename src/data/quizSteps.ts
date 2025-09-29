/**
 * 🎯 ESTRUTURA DAS ETAPAS DO QUIZ - GISELE GALVÃO
 * 
 * Este arquivo contém todas as 21 etapas do quiz de estilo pessoal:
 * - Etapa 1: Introdução e coleta do nome
 * - Etapas 2-11: 10 perguntas principais do quiz (pontuação por estilo)
 * - Etapa 12: Transição para perguntas estratégicas
 * - Etapas 13-18: 6 perguntas estratégicas para personalização da oferta
 * - Etapa 19: Transição para resultado
 * - Etapa 20: Exibição do resultado personalizado
 * - Etapa 21: Oferta personalizada baseada nas respostas estratégicas
 */

export interface QuizOption {
    id: string;
    text: string;
    image?: string;
}

export interface QuizStep {
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
    title?: string;
    questionNumber?: string;
    questionText?: string;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    text?: string;
    image?: string;
    requiredSelections?: number;
    options?: QuizOption[];
    nextStep?: string;
    offerMap?: Record<string, OfferContent>;
}

/**
 * Adaptador legacy -> canonical
 * Este arquivo preserva a API usada amplamente no código existente (QUIZ_STEPS, STEP_ORDER, getStepById, etc.)
 * porém sem duplicar a definição das 21 etapas. Tudo é derivado de `quiz-definition.json`.
 */
import canonicalDef from '../domain/quiz/quiz-definition.json';

export interface QuizOption { id: string; text: string; image?: string; }
export interface OfferContent { title: string; description: string; buttonText: string; testimonial: { quote: string; author: string }; }
export interface QuizStep {
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
    title?: string;
    questionNumber?: string;
    questionText?: string;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    text?: string;
    image?: string;
    requiredSelections?: number;
    options?: QuizOption[];
    nextStep?: string; // legacy compatibility (derivado de 'next')
    offerMap?: Record<string, OfferContent>; // apenas em offer
}

// Constrói mapping de estilos de pergunta (1..10) para questionNumber
const QUESTION_NUMBER_INDEX: Record<string, number> = {};
let questionCounter = 0;

// Primeiro passe para numerar apenas steps type=question
canonicalDef.steps.forEach(s => { if (s.type === 'question') { questionCounter++; QUESTION_NUMBER_INDEX[s.id] = questionCounter; } });

const QUIZ_STEPS: Record<string, QuizStep> = {};

for (const step of canonicalDef.steps) {
    const base: QuizStep = {
        type: step.type as QuizStep['type'],
        title: (step as any).title,
        questionText: (step as any).questionText,
        questionNumber: step.type === 'question' ? `${QUESTION_NUMBER_INDEX[step.id]} de ${questionCounter}` : undefined,
        formQuestion: (step as any).formQuestion,
        placeholder: (step as any).placeholder,
        buttonText: (step as any).buttonText,
        text: (step as any).text,
        image: (step as any).image,
        requiredSelections: (step as any).requiredSelections,
        options: (step as any).options,
        nextStep: (step as any).next // compat
    };

    if (step.type === 'offer') {
        const variants = (step as any).variants || [];
        base.offerMap = variants.reduce((acc: Record<string, OfferContent>, v: any) => {
            acc[v.matchValue] = {
                title: v.title,
                description: v.description,
                buttonText: v.buttonText,
                testimonial: v.testimonial
            };
            return acc;
        }, {});
    }

    QUIZ_STEPS[step.id] = base;
}

// STEP_ORDER direto da fonte canonical
export const STEP_ORDER = canonicalDef.steps.map(s => s.id);

// STRATEGIC_ANSWER_TO_OFFER_KEY derivado do step estratégico final
const finalStrategicId = canonicalDef.offerMapping.strategicFinalStepId;
const finalStrategic = canonicalDef.steps.find(s => s.id === finalStrategicId);
export const STRATEGIC_ANSWER_TO_OFFER_KEY = (() => {
    if (finalStrategic && (finalStrategic as any).options) {
        return (finalStrategic as any).options.reduce((acc: Record<string,string>, opt: any) => {
            acc[opt.id] = opt.text; // id -> texto (matchValue)
            return acc;
        }, {});
    }
    return {} as const;
})();

export { QUIZ_STEPS };

export const getStepById = (stepId: string): QuizStep | undefined => QUIZ_STEPS[stepId];
export const getAllSteps = (): { id: string; step: QuizStep }[] => Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, step }));
export const getNextStep = (currentStepId: string): string | undefined => QUIZ_STEPS[currentStepId]?.nextStep;

// Nota: após remoção total das dependências legacy, este arquivo poderá ser simplificado ou removido.

    'step-6': {
        type: 'question',
        questionNumber: '5 de 10',
        questionText: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Estampas clean, com poucas informações', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp' },
            { id: 'classico', text: 'Estampas clássicas e atemporais', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp' },
            { id: 'contemporaneo', text: 'Atemporais, mas que tenham uma pegada atual e moderna', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp' },
            { id: 'elegante', text: 'Estampas clássicas e atemporais, mas sofisticadas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp' },
            { id: 'romantico', text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp' },
            { id: 'sexy', text: 'Estampas de animal print, como onça, zebra e cobra', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp' },
            { id: 'dramatico', text: 'Estampas geométricas, abstratas e exageradas como grandes poás', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp' },
            { id: 'criativo', text: 'Estampas diferentes do usual, como africanas, xadrez grandes', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp' },
        ],
        nextStep: 'step-7',
    },

    'step-7': {
        type: 'question',
        questionNumber: '6 de 10',
        questionText: 'QUAL CASACO É SEU FAVORITO?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Cardigã bege confortável e casual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp' },
            { id: 'classico', text: 'Blazer verde estruturado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp' },
            { id: 'contemporaneo', text: 'Trench coat bege tradicional', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp' },
            { id: 'elegante', text: 'Blazer branco refinado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp' },
            { id: 'romantico', text: 'Casaco pink vibrante e moderno', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp' },
            { id: 'sexy', text: 'Jaqueta vinho de couro estilosa', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp' },
            { id: 'dramatico', text: 'Jaqueta preta estilo rocker', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp' },
            { id: 'criativo', text: 'Casaco estampado criativo e colorido', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp' },
        ],
        nextStep: 'step-8',
    },

    'step-8': {
        type: 'question',
        questionNumber: '7 de 10',
        questionText: 'QUAL SUA CALÇA FAVORITA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Calça fluida acetinada bege', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp' },
            { id: 'classico', text: 'Calça de alfaiataria cinza', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp' },
            { id: 'contemporaneo', text: 'Jeans reto e básico', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp' },
            { id: 'elegante', text: 'Calça reta bege de tecido', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp' },
            { id: 'romantico', text: 'Calça ampla rosa alfaiatada', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp' },
            { id: 'sexy', text: 'Legging preta de couro', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp' },
            { id: 'dramatico', text: 'Calça reta preta de couro', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp' },
            { id: 'criativo', text: 'Calça estampada floral leve e ampla', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp' },
        ],
        nextStep: 'step-9',
    },

    'step-9': {
        type: 'question',
        questionNumber: '8 de 10',
        questionText: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Tênis nude casual e confortável', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp' },
            { id: 'classico', text: 'Scarpin nude de salto baixo', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp' },
            { id: 'contemporaneo', text: 'Sandália dourada com salto bloco', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp' },
            { id: 'elegante', text: 'Scarpin nude salto alto e fino', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp' },
            { id: 'romantico', text: 'Sandália anabela off white', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp' },
            { id: 'sexy', text: 'Sandália rosa de tiras finas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp' },
            { id: 'dramatico', text: 'Scarpin preto moderno com vinil transparente', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp' },
            { id: 'criativo', text: 'Scarpin colorido estampado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp' },
        ],
        nextStep: 'step-10',
    },

    'step-10': {
        type: 'question',
        questionNumber: '9 de 10',
        questionText: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Pequenos e discretos, às vezes nem uso', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.png' },
            { id: 'classico', text: 'Brincos pequenos e discretos. Corrente fininha', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.png' },
            { id: 'contemporaneo', text: 'Acessórios que elevem meu look com um toque moderno', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.png' },
            { id: 'elegante', text: 'Acessórios sofisticados, joias ou semijoias', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.png' },
            { id: 'romantico', text: 'Peças delicadas e com um toque feminino', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/59_dwaqrx.png' },
            { id: 'sexy', text: 'Brincos longos, colares que valorizem minha beleza', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735487/63_lwgokn.png' },
            { id: 'dramatico', text: 'Acessórios pesados, que causem um impacto', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735485/62_mno8wg.png' },
            { id: 'criativo', text: 'Acessórios diferentes, grandes e marcantes', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735480/58_njdjoh.png' },
        ],
        nextStep: 'step-11',
    },

    'step-11': {
        type: 'question',
        questionNumber: '10 de 10',
        questionText: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'São fáceis de cuidar' },
            { id: 'classico', text: 'São de excelente qualidade' },
            { id: 'contemporaneo', text: 'São fáceis de cuidar e modernos' },
            { id: 'elegante', text: 'São sofisticados' },
            { id: 'romantico', text: 'São delicados' },
            { id: 'sexy', text: 'São perfeitos ao meu corpo' },
            { id: 'dramatico', text: 'São diferentes, e trazem um efeito para minha roupa' },
            { id: 'criativo', text: 'São exclusivos, criam identidade no look' },
        ],
        nextStep: 'step-12',
    },

    'step-12': {
        type: 'transition',
        title: '🕐 Enquanto calculamos o seu resultado...',
        text: 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão.',
        nextStep: 'step-13',
    },

    'step-13': {
        type: 'strategic-question',
        questionText: 'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
        options: [
            { id: 'desconectada', text: 'Me sinto desconectada da mulher que sou hoje' },
            { id: 'duvidas', text: 'Tenho dúvidas sobre o que realmente me valoriza' },
            { id: 'as-vezes-acerto', text: 'Às vezes acerto, às vezes erro' },
            { id: 'segura-evoluir', text: 'Me sinto segura, mas sei que posso evoluir' }
        ],
        nextStep: 'step-14',
    },

    'step-14': {
        type: 'strategic-question',
        questionText: 'O que mais te desafia na hora de se vestir?',
        options: [
            { id: 'combinar-pecas', text: 'Tenho peças, mas não sei como combiná-las' },
            { id: 'comprar-impulso', text: 'Compro por impulso e me arrependo depois' },
            { id: 'imagem-nao-reflete', text: 'Minha imagem não reflete quem eu sou' },
            { id: 'perco-tempo', text: 'Perco tempo e acabo usando sempre os mesmos looks' }
        ],
        nextStep: 'step-15',
    },

    'step-15': {
        type: 'strategic-question',
        questionText: 'Com que frequência você se pega pensando: "Com que roupa eu vou?" — mesmo com o guarda-roupa cheio?',
        options: [
            { id: 'quase-todos-dias', text: 'Quase todos os dias — é sempre uma indecisão' },
            { id: 'compromissos-importantes', text: 'Sempre que tenho um compromisso importante' },
            { id: 'as-vezes-limitada', text: 'Às vezes, mas me sinto limitada nas escolhas' },
            { id: 'raramente-segura', text: 'Raramente — já me sinto segura ao me vestir' }
        ],
        nextStep: 'step-16',
    },

    'step-16': {
        type: 'strategic-question',
        questionText: 'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?',
        options: [
            { id: 'sim-quero', text: 'Sim! Se existisse algo assim, eu quero' },
            { id: 'sim-momento-certo', text: 'Sim, mas teria que ser no momento certo' },
            { id: 'tenho-duvidas', text: 'Tenho dúvidas se funcionaria pra mim' },
            { id: 'nao-prefiro-continuar', text: 'Não, prefiro continuar como estou' }
        ],
        nextStep: 'step-17',
    },

    'step-17': {
        type: 'strategic-question',
        questionText: 'Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?',
        options: [
            { id: 'sim-vale-muito', text: 'Sim! Por esse resultado, vale muito' },
            { id: 'sim-se-certeza', text: 'Sim, mas só se eu tiver certeza de que funciona pra mim' },
            { id: 'talvez-depende', text: 'Talvez — depende do que está incluso' },
            { id: 'nao-nao-pronta', text: 'Não, ainda não estou pronta para investir' }
        ],
        nextStep: 'step-18',
    },

    'step-18': {
        type: 'strategic-question',
        questionText: 'Qual desses resultados você mais gostaria de alcançar?',
        options: [
            { id: 'montar-looks-facilidade', text: 'Montar looks com mais facilidade e confiança' },
            { id: 'usar-que-tenho', text: 'Usar o que já tenho e me sentir estilosa' },
            { id: 'comprar-consciencia', text: 'Comprar com mais consciência e sem culpa' },
            { id: 'ser-admirada', text: 'Ser admirada pela imagem que transmito' }
        ],
        nextStep: 'step-19',
    },

    'step-19': {
        type: 'transition-result',
        title: 'Obrigada por compartilhar.',
        nextStep: 'step-20',
    },

    'step-20': {
        type: 'result',
        title: '{userName}, seu estilo predominante é:',
        nextStep: 'step-21',
    },

    'step-21': {
        type: 'offer',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/offer_image_main_jkldsd.webp',
        offerMap: {
            'Montar looks com mais facilidade e confiança': {
                title: `{userName}, encontramos a solução para **combinar as suas peças com confiança!**`,
                description: `Chega de incertezas. Liberamos uma oferta especial que vai te guiar passo a passo para criar looks harmoniosos e incríveis, usando o que você já tem.`,
                buttonText: `Quero aprender a combinar as minhas peças agora!`,
                testimonial: {
                    quote: "Finalmente entendi o meu estilo e parei de gastar dinheiro com roupas que não combinavam comigo. Agora consigo montar looks com mais facilidade.",
                    author: "Márcia Silva, 38 anos, Advogada"
                }
            },
            'Usar o que já tenho e me sentir estilosa': {
                title: `{userName}, encontramos a solução para **se sentir estilosa com o que já tem!**`,
                description: `Descubra o potencial escondido no seu próprio guarda-roupa. Esta oferta vai te ensinar a resgatar e transformar as peças esquecidas em looks incríveis, cheios de estilo e personalidade.`,
                buttonText: `Quero me sentir mais estilosa com o que já tenho!`,
                testimonial: {
                    quote: "Economizei muito dinheiro depois que aprendi a combinar e usar as minhas roupas de formas que nunca imaginei. É incrível a liberdade de ter um guarda-roupa que funciona para mim.",
                    author: "Ana G., 29 anos, Designer"
                }
            },
            'Comprar com mais consciência e sem culpa': {
                title: `{userName}, a solução para você **comprar com consciência e sem culpa!**`,
                description: `Pare de desperdiçar dinheiro com peças que não usa. A nossa oferta vai te ensinar a identificar exatamente o que te valoriza, transformando a sua forma de comprar para sempre.`,
                buttonText: `Quero fazer compras inteligentes!`,
                testimonial: {
                    quote: "Economizei muito dinheiro depois que aprendi a comprar apenas o que realmente combina com o meu estilo.",
                    author: "Carolina Mendes, 42 anos, Empresária"
                }
            },
            'Ser admirada pela imagem que transmito': {
                title: `{userName}, a chave para você **alinhar a sua imagem à sua essência!**`,
                description: `A sua imagem é a sua maior ferramenta de comunicação. Esta oferta vai te ajudar a construir um estilo que não apenas te veste, mas que te representa, com autenticidade e propósito.`,
                buttonText: `Quero que a minha imagem me represente!`,
                testimonial: {
                    quote: "Hoje visto-me com mais confiança e praticidade, sem perder tempo a pensar no que vestir. A minha imagem agora reflete a pessoa que sou de verdade.",
                    author: "Juliana Costa, 35 anos, Professora"
                }
            }
        },
    }
};

// Helper para obter etapa por ID
export const getStepById = (stepId: string): QuizStep | undefined => {
    return QUIZ_STEPS[stepId];
};

// Helper para obter todas as etapas como array
export const getAllSteps = (): { id: string; step: QuizStep }[] => {
    return Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, step }));
};

// Helper para obter próxima etapa
export const getNextStep = (currentStepId: string): string | undefined => {
    const currentStep = QUIZ_STEPS[currentStepId];
    return currentStep?.nextStep;
};

// Lista de IDs de etapas em ordem
export const STEP_ORDER = [
    'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7',
    'step-8', 'step-9', 'step-10', 'step-11', 'step-12', 'step-13', 'step-14',
    'step-15', 'step-16', 'step-17', 'step-18', 'step-19', 'step-20', 'step-21'
];

// Mapear resposta da pergunta estratégica final para chave da oferta
export const STRATEGIC_ANSWER_TO_OFFER_KEY = {
    'montar-looks-facilidade': 'Montar looks com mais facilidade e confiança',
    'usar-que-tenho': 'Usar o que já tenho e me sentir estilosa',
    'comprar-consciencia': 'Comprar com mais consciência e sem culpa',
    'ser-admirada': 'Ser admirada pela imagem que transmito'
} as const;
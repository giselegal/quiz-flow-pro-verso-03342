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

export interface OfferContent {
    title: string;
    description: string;
    buttonText: string;
    testimonial: {
        quote: string;
        author: string;
    };
}

// Estrutura completa das 21 etapas baseada no HTML fornecido
export const QUIZ_STEPS: Record<string, QuizStep> = {
    'step-1': {
        type: 'intro',
        title: '<span style="color: #B89B7A; font-weight: 700;" class="playfair-display">Chega</span> <span class="playfair-display">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700;" class="playfair-display">nada combina com você.</span>',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
        nextStep: 'step-2',
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
    },

    'step-4': {
        type: 'question',
        questionNumber: '3 de 10',
        questionText: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Visual leve, despojado e natural', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp' },
            { id: 'classico', text: 'Visual clássico e tradicional', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp' },
            { id: 'contemporaneo', text: 'Visual casual com toque atual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp' },
            { id: 'elegante', text: 'Visual refinado e imponente', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp' },
            { id: 'romantico', text: 'Visual romântico, feminino e delicado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp' },
            { id: 'sexy', text: 'Visual sensual, com saia justa e decote', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp' },
            { id: 'dramatico', text: 'Visual marcante e urbano (jeans + jaqueta)', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp' },
            { id: 'criativo', text: 'Visual criativo, colorido e ousado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp' },
        ],
        nextStep: 'step-5',
    },

    'step-5': {
        type: 'question',
        questionNumber: '4 de 10',
        questionText: 'QUAIS DETALHES VOCÊ GOSTA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Poucos detalhes, básico e prático' },
            { id: 'classico', text: 'Bem discretos e sutis, clean e clássico' },
            { id: 'contemporaneo', text: 'Básico, mas com um toque de estilo' },
            { id: 'elegante', text: 'Detalhes refinados, chic e que deem status' },
            { id: 'romantico', text: 'Detalhes delicados, laços, babados' },
            { id: 'sexy', text: 'Roupas que valorizem meu corpo: couro, zíper, fendas' },
            { id: 'dramatico', text: 'Detalhes marcantes, firmeza e peso' },
            { id: 'criativo', text: 'Detalhes diferentes do convencional, produções ousadas' },
        ],
        nextStep: 'step-6',
    },

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
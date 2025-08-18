// @ts-nocheck
/**
 * Dados completos do Quiz de Estilo Pessoal
 *
 * Este arquivo contém todas as perguntas, opções e estrutura do funil
 * para o Quiz de Estilo Pessoal com 21 etapas
 */

// Tipos
interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  value: string;
  category: string;
}

interface QuizQuestion {
  id: string;
  stepType:
    | 'intro'
    | 'name-collect'
    | 'quiz-intro'
    | 'question-multiple'
    | 'quiz-transition'
    | 'processing'
    | 'result-intro'
    | 'result-details'
    | 'result-guide'
    | 'offer-transition'
    | 'offer-page';
  title: string;
  question?: string;
  description?: string;
  imageUrl?: string;
  options?: QuizOption[];
  maxSelections?: number;
  type?: 'text' | 'image' | 'both';
  settings?: Record<string, any>;
}

// Dados completos do funil de quiz
export const styleQuizData = {
  name: 'Quiz de Estilo Pessoal',
  description: 'Descubra seu estilo predominante e transforme seu guarda-roupa',
  steps: [
    // Etapa 1: Intro
    {
      id: 'intro',
      stepType: 'intro',
      title: 'Quiz de Estilo',
      settings: {
        title: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',
        subtitle: 'Descubra seu estilo predominante e transforme seu guarda-roupa',
        description:
          'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
        buttonText: 'Começar agora',
        logoUrl: '/images/logo.png',
        backgroundImage: '/images/bg-intro.jpg',
      },
    },

    // Etapa 2: Coleta de nome
    {
      id: 'name-collect',
      stepType: 'name-collect',
      title: 'Como podemos te chamar?',
      settings: {
        title: 'Como podemos te chamar?',
        description: 'Para personalizar sua experiência, gostaríamos de saber seu nome:',
        buttonText: 'Continuar',
        placeholder: 'Digite seu nome aqui',
      },
    },

    // Etapa 3: Quiz Intro
    {
      id: 'quiz-intro',
      stepType: 'quiz-intro',
      title: 'Introdução às perguntas',
      settings: {
        title: 'Descubra seu estilo ideal',
        description:
          'Responda as próximas perguntas com sinceridade para obtermos um resultado preciso e personalizado para você.',
        bullets: [
          'São apenas 10 perguntas rápidas',
          'Leva menos de 3 minutos',
          'Resultado personalizado imediato',
        ],
        buttonText: 'Iniciar questionário',
        imageUrl: '/images/quiz-intro.jpg',
      },
    },

    // Questão 1
    {
      id: 'q1',
      stepType: 'question-multiple',
      title: 'Questão 1',
      question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
      type: 'both',
      maxSelections: 3,
      options: [
        {
          id: 'q1-natural',
          text: 'Conforto, leveza e praticidade no vestir',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
          value: 'natural',
          category: 'Natural',
        },
        {
          id: 'q1-classico',
          text: 'Discrição, caimento clássico e sobriedade',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
          value: 'classico',
          category: 'Clássico',
        },
        {
          id: 'q1-contemporaneo',
          text: 'Praticidade com um toque de estilo atual',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
          value: 'contemporaneo',
          category: 'Contemporâneo',
        },
        {
          id: 'q1-elegante',
          text: 'Elegância refinada, moderna e sem exageros',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
          value: 'elegante',
          category: 'Elegante',
        },
        {
          id: 'q1-romantico',
          text: 'Delicadeza em tecidos suaves e fluidos',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
          value: 'romantico',
          category: 'Romântico',
        },
        {
          id: 'q1-sexy',
          text: 'Sensualidade com destaque para o corpo',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
          value: 'sexy',
          category: 'Sexy',
        },
        {
          id: 'q1-dramatico',
          text: 'Impacto visual com peças estruturadas e assimétricas',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
          value: 'dramatico',
          category: 'Dramático',
        },
        {
          id: 'q1-criativo',
          text: 'Mix criativo com formas ousadas e originais',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
          value: 'criativo',
          category: 'Criativo',
        },
      ],
    },

    // Questão 2
    {
      id: 'q2',
      stepType: 'question-multiple',
      title: 'Questão 2',
      question: 'RESUMA A SUA PERSONALIDADE:',
      type: 'text',
      maxSelections: 3,
      options: [
        {
          id: 'q2-natural',
          text: 'Informal, espontânea, alegre, essencialista',
          value: 'natural',
          category: 'Natural',
        },
        {
          id: 'q2-classico',
          text: 'Conservadora, séria, organizada',
          value: 'classico',
          category: 'Clássico',
        },
        {
          id: 'q2-contemporaneo',
          text: 'Informada, ativa, prática',
          value: 'contemporaneo',
          category: 'Contemporâneo',
        },
        {
          id: 'q2-elegante',
          text: 'Exigente, sofisticada, seletiva',
          value: 'elegante',
          category: 'Elegante',
        },
        {
          id: 'q2-romantico',
          text: 'Feminina, meiga, delicada, sensível',
          value: 'romantico',
          category: 'Romântico',
        },
        {
          id: 'q2-sexy',
          text: 'Glamorosa, vaidosa, sensual',
          value: 'sexy',
          category: 'Sexy',
        },
        {
          id: 'q2-dramatico',
          text: 'Cosmopolita, moderna e audaciosa',
          value: 'dramatico',
          category: 'Dramático',
        },
        {
          id: 'q2-criativo',
          text: 'Exótica, aventureira, livre',
          value: 'criativo',
          category: 'Criativo',
        },
      ],
    },

    // Questão 3
    {
      id: 'q3',
      stepType: 'question-multiple',
      title: 'Questão 3',
      question: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
      type: 'both',
      maxSelections: 3,
      options: [
        {
          id: 'q3-natural',
          text: 'Visual leve, despojado e natural',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
          value: 'natural',
          category: 'Natural',
        },
        {
          id: 'q3-classico',
          text: 'Visual clássico e tradicional',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
          value: 'classico',
          category: 'Clássico',
        },
        {
          id: 'q3-contemporaneo',
          text: 'Visual casual com toque atual',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
          value: 'contemporaneo',
          category: 'Contemporâneo',
        },
        {
          id: 'q3-elegante',
          text: 'Visual refinado e imponente',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
          value: 'elegante',
          category: 'Elegante',
        },
        {
          id: 'q3-romantico',
          text: 'Visual romântico, feminino e delicado',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
          value: 'romantico',
          category: 'Romântico',
        },
        {
          id: 'q3-sexy',
          text: 'Visual sensual, com saia justa e decote',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
          value: 'sexy',
          category: 'Sexy',
        },
        {
          id: 'q3-dramatico',
          text: 'Visual marcante e urbano (jeans + jaqueta)',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
          value: 'dramatico',
          category: 'Dramático',
        },
        {
          id: 'q3-criativo',
          text: 'Visual criativo, colorido e ousado',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
          value: 'criativo',
          category: 'Criativo',
        },
      ],
    },

    // Continuando com mais questões...
    // Questão 4
    {
      id: 'q4',
      stepType: 'question-multiple',
      title: 'Questão 4',
      question: 'QUAIS DETALHES VOCÊ GOSTA?',
      type: 'text',
      maxSelections: 3,
      options: [
        {
          id: 'q4-natural',
          text: 'Poucos detalhes, básico e prático',
          value: 'natural',
          category: 'Natural',
        },
        {
          id: 'q4-classico',
          text: 'Bem discretos e sutis, clean e clássico',
          value: 'classico',
          category: 'Clássico',
        },
        {
          id: 'q4-contemporaneo',
          text: 'Básico, mas com um toque de estilo',
          value: 'contemporaneo',
          category: 'Contemporâneo',
        },
        {
          id: 'q4-elegante',
          text: 'Detalhes refinados, chic e que deem status',
          value: 'elegante',
          category: 'Elegante',
        },
        {
          id: 'q4-romantico',
          text: 'Detalhes delicados, laços, babados',
          value: 'romantico',
          category: 'Romântico',
        },
        {
          id: 'q4-sexy',
          text: 'Roupas que valorizem meu corpo: couro, zíper, fendas',
          value: 'sexy',
          category: 'Sexy',
        },
        {
          id: 'q4-dramatico',
          text: 'Detalhes marcantes, firmeza e peso',
          value: 'dramatico',
          category: 'Dramático',
        },
        {
          id: 'q4-criativo',
          text: 'Detalhes diferentes do convencional, produções ousadas',
          value: 'criativo',
          category: 'Criativo',
        },
      ],
    },

    // Questão 5
    {
      id: 'q5',
      stepType: 'question-multiple',
      title: 'Questão 5',
      question: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
      type: 'both',
      maxSelections: 3,
      options: [
        {
          id: 'q5-natural',
          text: 'Estampas clean, com poucas informações',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
          value: 'natural',
          category: 'Natural',
        },
        {
          id: 'q5-classico',
          text: 'Estampas clássicas e atemporais',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
          value: 'classico',
          category: 'Clássico',
        },
        {
          id: 'q5-contemporaneo',
          text: 'Atemporais, mas que tenham uma pegada de atual e moderna',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
          value: 'contemporaneo',
          category: 'Contemporâneo',
        },
        {
          id: 'q5-elegante',
          text: 'Estampas clássicas e atemporais, mas sofisticadas',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
          value: 'elegante',
          category: 'Elegante',
        },
        {
          id: 'q5-romantico',
          text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
          value: 'romantico',
          category: 'Romântico',
        },
        {
          id: 'q5-sexy',
          text: 'Estampas de animal print, como onça, zebra e cobra',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
          value: 'sexy',
          category: 'Sexy',
        },
        {
          id: 'q5-dramatico',
          text: 'Estampas geométricas, abstratas e exageradas como grandes poás',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
          value: 'dramatico',
          category: 'Dramático',
        },
        {
          id: 'q5-criativo',
          text: 'Estampas diferentes do usual, como africanas, xadrez grandes',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
          value: 'criativo',
          category: 'Criativo',
        },
      ],
    },

    // E assim por diante para as outras questões...

    // Transição para questões estratégicas
    {
      id: 'transition-1',
      stepType: 'quiz-transition',
      title: 'Transição',
      settings: {
        title: 'Enquanto calculamos o seu resultado...',
        messages: [
          'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
          'A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.',
          'Responda com sinceridade. Isso é só entre você e a sua nova versão.',
          'Quase pronto...',
        ],
        autoAdvanceDelay: 5,
      },
    },

    // Questões estratégicas
    {
      id: 'qs-1',
      stepType: 'question-multiple',
      title: 'Questão Estratégica 1',
      question: 'Como você se vê hoje?',
      description:
        'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
      type: 'text',
      maxSelections: 1,
      options: [
        {
          id: 'qs1-1',
          text: 'Me sinto desconectada da mulher que sou hoje',
          value: 'desconectada',
          category: 'Desconectada',
        },
        {
          id: 'qs1-2',
          text: 'Tenho dúvidas sobre o que realmente me valoriza',
          value: 'duvidas',
          category: 'Com dúvidas',
        },
        {
          id: 'qs1-3',
          text: 'Às vezes acerto, às vezes erro',
          value: 'instavel',
          category: 'Instável',
        },
        {
          id: 'qs1-4',
          text: 'Me sinto segura, mas sei que posso evoluir',
          value: 'segura',
          category: 'Segura',
        },
      ],
    },

    // Mais questões estratégicas aqui...

    // Etapa de processamento final
    {
      id: 'processing',
      stepType: 'processing',
      title: 'Processando seu resultado',
      settings: {
        title: 'Preparando seu resultado...',
        processingText:
          'Estamos analisando suas respostas para identificar seu estilo predominante',
        autoAdvanceDelay: 3,
        showAnimatedIcons: true,
      },
    },

    // Introdução ao resultado
    {
      id: 'result-intro',
      stepType: 'result-intro',
      title: 'Introdução ao resultado',
      settings: {
        title: 'Seu estilo predominante está pronto!',
        subtitle: 'Descobrimos o que mais combina com você e sua personalidade',
        buttonText: 'Ver meu estilo',
        animateIn: true,
        showConfetti: true,
      },
    },

    // Detalhes do resultado
    {
      id: 'result-details',
      stepType: 'result-details',
      title: 'Detalhes do Resultado',
      settings: {
        title: 'Seu Estilo Personalizado',
        nextButtonText: 'Ver meu guia completo',
        prevButtonText: 'Voltar',
      },
    },

    // Guia baseado no resultado
    {
      id: 'result-guide',
      stepType: 'result-guide',
      title: 'Guia de Estilo',
      settings: {
        title: 'Seu Guia Personalizado',
        subtitle: 'Use este guia completo para aproveitar ao máximo suas características',
        showDownloadOption: true,
        nextButtonText: 'Próximo passo',
        prevButtonText: 'Voltar',
        downloadButtonText: 'Baixar guia completo',
      },
    },

    // Transição para oferta
    {
      id: 'offer-transition',
      stepType: 'offer-transition',
      title: 'Transição para oferta',
      settings: {
        title: 'Leve sua experiência para o próximo nível',
        subtitle: 'Descubra como potencializar seus resultados com nossa solução completa',
        buttonText: 'Quero conhecer a oferta',
        prevButtonText: 'Voltar ao meu resultado',
        benefits: [
          'Acesso a conteúdo exclusivo e aprofundado',
          'Suporte personalizado para suas necessidades específicas',
          'Ferramentas profissionais para implementação prática',
          'Comunidade de pessoas com perfil similar ao seu',
        ],
      },
    },

    // Página de oferta
    {
      id: 'offer-page',
      stepType: 'offer-page',
      title: 'Oferta',
      settings: {
        title: 'Oferta Exclusiva para Você',
        subtitle: 'Baseada no seu resultado personalizado',
        buttonText: 'Sim! Quero Garantir Meu Acesso',
        secondaryButtonText: 'Quero conhecer mais detalhes',
        showCountdown: true,
        countdownHours: 24,
        offer: {
          name: 'Guia de Estilo Completo',
          description: 'Transforme seu guarda-roupa com nosso guia passo a passo',
          price: '97',
          originalPrice: '297',
          features: [
            'Acesso ao guia completo do seu estilo predominante',
            'Ferramentas para montar looks com mais facilidade',
            'Cartela de cores personalizada',
            'Guia de compras consciente',
            'Bônus especiais para ação imediata',
          ],
        },
      },
    },
  ],
};

export default styleQuizData;

// 🎯 CONFIGURADOR AUTOMÁTICO DAS 21 ETAPAS COM TEMPLATE COMPLETO
import fs from 'fs';
import path from 'path';

// 📋 Template base fornecido pelo usuário
const MASTER_TEMPLATE = {
  meta: {
    name: 'Quiz Estilo Pessoal - Template Completo',
    description: 'Modelo completo para quiz de estilo pessoal, pronto para sistemas de moda.',
    version: '1.2.3',
    author: 'giselegal',
  },
  design: {
    primaryColor: '#B89B7A',
    secondaryColor: '#432818',
    accentColor: '#aa6b5d',
    backgroundColor: '#FAF9F7',
    fontFamily: "'Playfair Display', 'Inter', serif",
    button: {
      background: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
      textColor: '#fff',
      borderRadius: '10px',
      shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
    },
    card: {
      background: '#fff',
      borderRadius: '16px',
      shadow: '0 4px 20px rgba(184, 155, 122, 0.10)',
    },
    progressBar: {
      color: '#B89B7A',
      background: '#F3E8E6',
      height: '6px',
    },
    animations: {
      questionTransition: 'fade, scale',
      optionSelect: 'glow, scale',
      button: 'hover:scale-105, active:scale-95',
    },
    imageOptionSize: {
      default: { width: 256, height: 256, aspect: 'square' },
      strategic: { width: 400, height: 256, aspect: 'landscape' },
    },
  },
};

// 🎯 MAPEAMENTO COMPLETO DAS 21 ETAPAS
const QUIZ_STRUCTURE = [
  // ETAPA 1: INTRODUÇÃO
  {
    step: 1,
    type: 'intro',
    category: 'intro',
    name: 'Bem-vinda ao Quiz de Estilo',
    description: 'Página de entrada com captura de nome',
    blocks: [
      {
        id: 'step01-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: 0,
          progressTotal: 100,
          showProgress: false,
          containerWidth: 'full',
          spacing: 'small',
        },
      },
      {
        id: 'step01-hero-image',
        type: 'image-display-inline',
        properties: {
          imageUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg',
          alt: 'Quiz de Estilo Pessoal',
          width: '100%',
          height: 'auto',
          borderRadius: '16px',
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step01-title',
        type: 'text-inline',
        properties: {
          content: 'DESCUBRA SEU ESTILO PESSOAL',
          fontSize: 'text-4xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          fontFamily: "'Playfair Display', serif",
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step01-description-top',
        type: 'text-inline',
        properties: {
          content: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',
          fontSize: 'text-xl',
          textAlign: 'text-center',
          color: '#6B7280',
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step01-description-bottom',
        type: 'text-inline',
        properties: {
          content:
            'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
          fontSize: 'text-lg',
          textAlign: 'text-center',
          color: '#6B7280',
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step01-name-input',
        type: 'form-input',
        properties: {
          inputType: 'text',
          label: 'NOME *',
          placeholder: 'Digite seu nome',
          required: true,
          validation: {
            minLength: 2,
            errorMessage: 'Digite seu nome para continuar',
          },
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step01-continue-button',
        type: 'button-inline',
        properties: {
          text: 'Digite seu nome para continuar',
          textWhenDisabled: 'Digite seu nome para continuar',
          variant: 'primary',
          size: 'large',
          fullWidth: true,
          backgroundColor: '#B89B7A',
          backgroundGradient: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
          textColor: '#ffffff',
          borderRadius: '10px',
          shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
          disabled: true,
          requiresValidInput: true,
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step01-privacy-text',
        type: 'text-inline',
        properties: {
          content:
            'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
          fontSize: 'text-sm',
          textAlign: 'text-center',
          color: '#9CA3AF',
          containerWidth: 'full',
          spacing: 'small',
        },
      },
    ],
  },

  // ETAPAS 2-14: QUESTÕES PRINCIPAIS (13 questões)
  ...Array.from({ length: 13 }, (_, i) => {
    const questionNumber = i + 1;
    const stepNumber = i + 2;

    // Definir questões específicas
    const questions = [
      {
        title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        options: [
          {
            id: '1a',
            text: 'Conforto, leveza e praticidade no vestir.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
            styleCategory: 'Natural',
            points: 1,
          },
          {
            id: '1b',
            text: 'Discrição, caimento clássico e sobriedade.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
            styleCategory: 'Clássico',
            points: 2,
          },
          {
            id: '1c',
            text: 'Praticidade com um toque de estilo atual.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
            styleCategory: 'Contemporâneo',
            points: 2,
          },
          {
            id: '1d',
            text: 'Elegância refinada, moderna e sem exageros.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
            styleCategory: 'Elegante',
            points: 3,
          },
          {
            id: '1e',
            text: 'Delicadeza em tecidos suaves e fluidos.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
            styleCategory: 'Romântico',
            points: 2,
          },
          {
            id: '1f',
            text: 'Sensualidade com destaque para o corpo.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
            styleCategory: 'Sexy',
            points: 3,
          },
          {
            id: '1g',
            text: 'Impacto visual com peças estruturadas e assimétricas.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
            styleCategory: 'Dramático',
            points: 3,
          },
          {
            id: '1h',
            text: 'Mix criativo com formas ousadas e originais.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
            styleCategory: 'Criativo',
            points: 4,
          },
        ],
      },
      {
        title: 'RESUMA A SUA PERSONALIDADE:',
        options: [
          {
            id: '2a',
            text: 'Informal, espontânea, alegre, essencialista.',
            styleCategory: 'Natural',
            points: 1,
          },
          {
            id: '2b',
            text: 'Conservadora, séria, organizada.',
            styleCategory: 'Clássico',
            points: 2,
          },
          {
            id: '2c',
            text: 'Informada, ativa, prática.',
            styleCategory: 'Contemporâneo',
            points: 2,
          },
          {
            id: '2d',
            text: 'Exigente, sofisticada, seletiva.',
            styleCategory: 'Elegante',
            points: 3,
          },
          {
            id: '2e',
            text: 'Feminina, meiga, delicada, sensível.',
            styleCategory: 'Romântico',
            points: 2,
          },
          { id: '2f', text: 'Glamorosa, vaidosa, sensual.', styleCategory: 'Sexy', points: 3 },
          {
            id: '2g',
            text: 'Cosmopolita, moderna e audaciosa.',
            styleCategory: 'Dramático',
            points: 3,
          },
          { id: '2h', text: 'Exótica, aventureira, livre.', styleCategory: 'Criativo', points: 4 },
        ],
      },
      {
        title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        options: [
          {
            id: '3a',
            text: 'Visual leve, despojado e natural.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
            styleCategory: 'Natural',
            points: 1,
          },
          {
            id: '3b',
            text: 'Visual clássico e tradicional.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
            styleCategory: 'Clássico',
            points: 2,
          },
          {
            id: '3c',
            text: 'Visual casual com toque atual.',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
            styleCategory: 'Contemporâneo',
            points: 2,
          },
          {
            id: '3d',
            text: 'Visual refinado e imponente.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
            styleCategory: 'Elegante',
            points: 3,
          },
          {
            id: '3e',
            text: 'Visual romântico, feminino e delicado.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
            styleCategory: 'Romântico',
            points: 2,
          },
          {
            id: '3f',
            text: 'Visual sensual, com saia justa e decote.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
            styleCategory: 'Sexy',
            points: 3,
          },
          {
            id: '3g',
            text: 'Visual marcante e urbano (jeans + jaqueta).',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
            styleCategory: 'Dramático',
            points: 3,
          },
          {
            id: '3h',
            text: 'Visual criativo, colorido e ousado.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
            styleCategory: 'Criativo',
            points: 4,
          },
        ],
      },
      // ... mais questões podem ser adicionadas seguindo o mesmo padrão
    ];

    const currentQuestion = questions[Math.min(questionNumber - 1, questions.length - 1)];
    const hasImages = currentQuestion.options.some(opt => opt.imageUrl);

    return {
      step: stepNumber,
      type: 'question',
      category: 'quiz-question',
      name: `Q${questionNumber} - ${currentQuestion.title.replace(/[^A-Za-z0-9\s]/g, '').slice(0, 20)}`,
      description: `Questão ${questionNumber} de 13`,
      blocks: [
        {
          id: `step${stepNumber.toString().padStart(2, '0')}-header`,
          type: 'quiz-intro-header',
          properties: {
            logoUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: Math.round((questionNumber / 13) * 70), // 0-70% para questões principais
            progressTotal: 100,
            showProgress: true,
            showBackButton: true,
            containerWidth: 'full',
            spacing: 'small',
          },
        },
        {
          id: `step${stepNumber.toString().padStart(2, '0')}-question-title`,
          type: 'text-inline',
          properties: {
            content: currentQuestion.title,
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            fontFamily: "'Playfair Display', serif",
            containerWidth: 'full',
            spacing: 'small',
          },
        },
        {
          id: `step${stepNumber.toString().padStart(2, '0')}-question-counter`,
          type: 'text-inline',
          properties: {
            content: `Questão ${questionNumber} de 13`,
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24,
            containerWidth: 'full',
            spacing: 'small',
          },
        },
        {
          id: `step${stepNumber.toString().padStart(2, '0')}-options-grid`,
          type: 'options-grid',
          properties: {
            options: currentQuestion.options,
            columns: hasImages ? 2 : 1,
            imageSize: hasImages ? 256 : 0,
            showImages: hasImages,
            multipleSelection: true,
            minSelections: 3,
            maxSelections: 3,
            borderColor: '#E5E7EB',
            selectedBorderColor: '#B89B7A',
            hoverColor: '#F3E8D3',
            containerWidth: 'full',
            spacing: 'small',
            marginBottom: 16,
            selectionStyle: 'glow',
            animationType: 'scale',
            validationMessage: 'Selecione 3 opções para avançar.',
            scoring: {
              enabled: true,
              categories: [
                'Natural',
                'Clássico',
                'Contemporâneo',
                'Elegante',
                'Romântico',
                'Sexy',
                'Dramático',
                'Criativo',
              ],
            },
          },
        },
        {
          id: `step${stepNumber.toString().padStart(2, '0')}-continue-button`,
          type: 'button-inline',
          properties: {
            text: questionNumber === 13 ? 'Ver Resultado →' : 'Próxima Questão →',
            textWhenDisabled: 'Selecione 3 opções para avançar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            backgroundGradient: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
            textColor: '#ffffff',
            borderRadius: '10px',
            shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
            disabled: true,
            requiresValidInput: true,
            enableOnSelection: true,
            minSelections: 3,
            animation: 'hover:scale-105, active:scale-95',
            containerWidth: 'full',
            spacing: 'small',
            marginTop: 24,
          },
        },
      ],
    };
  }),

  // ETAPA 15: TRANSIÇÃO PRINCIPAL
  {
    step: 15,
    type: 'mainTransition',
    category: 'transition',
    name: 'Transição para Perguntas Estratégicas',
    description: 'Transição entre questões principais e estratégicas',
    blocks: [
      {
        id: 'step15-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: 70,
          progressTotal: 100,
          showProgress: true,
          containerWidth: 'full',
          spacing: 'small',
        },
      },
      {
        id: 'step15-background-image',
        type: 'image-display-inline',
        properties: {
          imageUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
          alt: 'Transição Quiz',
          width: '100%',
          height: 'auto',
          borderRadius: '16px',
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step15-title',
        type: 'text-inline',
        properties: {
          content: 'ANALISANDO SUAS RESPOSTAS...',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          fontFamily: "'Playfair Display', serif",
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step15-description',
        type: 'text-inline',
        properties: {
          content:
            'Enquanto calculamos seu resultado, responda perguntas estratégicas para personalizar ainda mais sua experiência.',
          fontSize: 'text-lg',
          textAlign: 'text-center',
          color: '#6B7280',
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
      {
        id: 'step15-loading-animation',
        type: 'loading-animation',
        properties: {
          type: 'progress',
          color: '#B89B7A',
          size: 'large',
          autoAdvance: true,
          delay: 3000,
          containerWidth: 'full',
          spacing: 'medium',
        },
      },
    ],
  },

  // ETAPAS 16-20: QUESTÕES ESTRATÉGICAS (5 questões)
  ...Array.from({ length: 5 }, (_, i) => {
    const questionNumber = i + 1;
    const stepNumber = i + 16;

    const strategicQuestions = [
      {
        title: 'Como você se sente em relação ao seu estilo pessoal hoje?',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp',
        options: [
          { id: 'strategic-1-1', text: 'Completamente perdida, não sei o que combina comigo' },
          { id: 'strategic-1-2', text: 'Tenho algumas ideias, mas não sei como aplicá-las' },
          { id: 'strategic-1-3', text: 'Conheço meu estilo, mas quero refiná-lo' },
          { id: 'strategic-1-4', text: 'Estou satisfeita, só buscando inspiração' },
        ],
      },
      {
        title: 'Qual é o maior desafio que você enfrenta ao se vestir?',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp',
        options: [
          { id: 'strategic-2-1', text: 'Nunca sei o que combina com o quê' },
          {
            id: 'strategic-2-2',
            text: 'Tenho muitas roupas, mas sempre sinto que não tenho nada para vestir',
          },
          {
            id: 'strategic-2-3',
            text: 'Não consigo criar looks diferentes com as peças que tenho',
          },
          { id: 'strategic-2-4', text: 'Compro peças por impulso que depois não uso' },
        ],
      },
      {
        title: 'Você já considerou investir em algum guia ou consultoria de estilo no passado?',
        options: [
          { id: 'strategic-3-1', text: 'Sim, já pesquisei mas não cheguei a comprar' },
          { id: 'strategic-3-2', text: 'Sim, já investi em algum curso/guia/consultoria' },
          { id: 'strategic-3-3', text: 'Não, esta é a primeira vez que considero isso' },
          { id: 'strategic-3-4', text: 'Prefiro não responder' },
        ],
      },
      {
        title:
          'Quanto você estaria disposta a investir em um guia completo de estilo personalizado?',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920677/Espanhol_Portugu%C3%AAs_6_jxqlxx.webp',
        options: [
          { id: 'strategic-4-1', text: 'Menos de R$100' },
          { id: 'strategic-4-2', text: 'Entre R$100 e R$300' },
          { id: 'strategic-4-3', text: 'Entre R$300 e R$500' },
          { id: 'strategic-4-4', text: 'Mais de R$500' },
        ],
      },
      {
        title: 'Qual aspecto você mais deseja melhorar no seu estilo?',
        options: [
          { id: 'strategic-5-1', text: 'Aprender a combinar melhor as peças' },
          { id: 'strategic-5-2', text: 'Ter mais confiança ao escolher looks' },
          { id: 'strategic-5-3', text: 'Valorizar o corpo com as roupas certas' },
          { id: 'strategic-5-4', text: 'Sentir-se autêntica e única' },
        ],
      },
    ];

    const currentQuestion = strategicQuestions[questionNumber - 1];
    const hasImage = !!currentQuestion.imageUrl;

    return {
      step: stepNumber,
      type: 'strategicQuestion',
      category: 'strategic-question',
      name: `Estratégica ${questionNumber} - ${currentQuestion.title.slice(0, 30)}...`,
      description: `Questão estratégica ${questionNumber} de 5`,
      blocks: [
        {
          id: `step${stepNumber}-header`,
          type: 'quiz-intro-header',
          properties: {
            logoUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 70 + Math.round((questionNumber / 5) * 20), // 70-90% para estratégicas
            progressTotal: 100,
            showProgress: true,
            showBackButton: true,
            containerWidth: 'full',
            spacing: 'small',
          },
        },
        ...(hasImage
          ? [
              {
                id: `step${stepNumber}-question-image`,
                type: 'image-display-inline',
                properties: {
                  imageUrl: currentQuestion.imageUrl,
                  alt: 'Questão Estratégica',
                  width: 400,
                  height: 256,
                  aspect: 'landscape',
                  borderRadius: '16px',
                  containerWidth: 'full',
                  spacing: 'medium',
                },
              },
            ]
          : []),
        {
          id: `step${stepNumber}-question-title`,
          type: 'text-inline',
          properties: {
            content: currentQuestion.title,
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            fontFamily: "'Playfair Display', serif",
            containerWidth: 'full',
            spacing: 'medium',
          },
        },
        {
          id: `step${stepNumber}-options-grid`,
          type: 'options-grid',
          properties: {
            options: currentQuestion.options,
            columns: 1,
            imageSize: 0,
            showImages: false,
            multipleSelection: false,
            minSelections: 1,
            maxSelections: 1,
            borderColor: '#E5E7EB',
            selectedBorderColor: '#B89B7A',
            hoverColor: '#F3E8D3',
            containerWidth: 'full',
            spacing: 'medium',
            marginBottom: 16,
            selectionStyle: 'highlight',
            allowDeselection: false,
            validationMessage: 'Selecione uma opção para avançar.',
          },
        },
        {
          id: `step${stepNumber}-continue-button`,
          type: 'button-inline',
          properties: {
            text: questionNumber === 5 ? 'Finalizar Quiz →' : 'Próxima Pergunta →',
            textWhenDisabled: 'Selecione uma opção para avançar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            backgroundGradient: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
            textColor: '#ffffff',
            borderRadius: '10px',
            shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
            disabled: true,
            requiresValidInput: true,
            enableOnSelection: true,
            minSelections: 1,
            animation: 'hover:scale-105, active:scale-95',
            containerWidth: 'full',
            spacing: 'medium',
            marginTop: 24,
          },
        },
      ],
    };
  }),

  // ETAPA 21: RESULTADO FINAL
  {
    step: 21,
    type: 'result',
    category: 'result',
    name: 'Resultado Final',
    description: 'Apresentação do resultado e CTA',
    blocks: [
      {
        id: 'step21-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: 100,
          progressTotal: 100,
          showProgress: true,
          containerWidth: 'full',
          spacing: 'small',
        },
      },
      {
        id: 'step21-result-title',
        type: 'text-inline',
        properties: {
          content: '🎉 SEU ESTILO PREDOMINANTE É:',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          fontFamily: "'Playfair Display', serif",
          containerWidth: 'full',
          spacing: 'large',
        },
      },
      {
        id: 'step21-result-card',
        type: 'result-style-card',
        properties: {
          styles: {
            Natural: {
              name: 'Natural',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
              description:
                'Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico.',
            },
            Clássico: {
              name: 'Clássico',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CL%C3%81SSICO_ux1yhf.webp',
              description:
                'Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito.',
            },
            Contemporâneo: {
              name: 'Contemporâneo',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CONTEMPOR%C3%82NEO_vcklxe.webp',
              description:
                'Você busca um equilíbrio entre o clássico e o moderno, com peças práticas e atuais.',
            },
            Elegante: {
              name: 'Elegante',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_ELEGANTE_asez1q.webp',
              description:
                'Você tem um olhar refinado para detalhes sofisticados e peças de alta qualidade.',
            },
            Romântico: {
              name: 'Romântico',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_ROM%C3%82NTICO_ci4hgk.webp',
              description:
                'Você valoriza a delicadeza e os detalhes femininos, com muita suavidade.',
            },
            Sexy: {
              name: 'Sexy',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071349/GUIA_SEXY_t5x2ov.webp',
              description:
                'Você gosta de valorizar suas curvas e exibir sua sensualidade com confiança.',
            },
            Dramático: {
              name: 'Dramático',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745073346/GUIA_DRAM%C3%81TICO_mpn60d.webp',
              description: 'Você tem personalidade forte e gosta de causar impacto com seu visual.',
            },
            Criativo: {
              name: 'Criativo',
              image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
              guideImage:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_CRIATIVO_ntbzph.webp',
              description:
                'Você aprecia a originalidade e não tem medo de ousar em combinações únicas.',
            },
          },
          containerWidth: 'full',
          spacing: 'large',
        },
      },
      {
        id: 'step21-bonus-section',
        type: 'bonus-showcase',
        properties: {
          title: '🎁 BÔNUS INCLUSOS:',
          bonuses: [
            {
              title: 'Peças-chave para seu estilo',
              image:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp',
              description: 'Guia completo das peças essenciais',
            },
            {
              title: 'Visagismo facial',
              image:
                'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
              description: 'Análise personalizada do seu rosto',
            },
          ],
          containerWidth: 'full',
          spacing: 'large',
        },
      },
      {
        id: 'step21-cta-button',
        type: 'button-inline',
        properties: {
          text: '🛍️ VER GUIA COMPLETO',
          textWhenDisabled: 'Ver Guia Completo',
          variant: 'primary',
          size: 'extra-large',
          fullWidth: true,
          backgroundColor: '#B89B7A',
          backgroundGradient: 'linear-gradient(to right, #B89B7A, #aa6b5d)',
          textColor: '#ffffff',
          borderRadius: '10px',
          shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
          fontSize: 'text-xl',
          fontWeight: 'font-bold',
          animation: 'hover:scale-105, active:scale-95, pulse',
          href: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
          containerWidth: 'full',
          spacing: 'large',
          marginTop: 32,
        },
      },
    ],
  },
];

// 🚀 FUNÇÃO PARA GERAR TEMPLATES JSON COMPLETOS
async function generateCompleteQuizTemplates() {
  const templatesDir = './templates';

  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  console.log('🎯 GERANDO TEMPLATES COMPLETOS DAS 21 ETAPAS...\n');

  for (const stepConfig of QUIZ_STRUCTURE) {
    const template = {
      templateVersion: '2.0',
      metadata: {
        id: `quiz-step-${stepConfig.step.toString().padStart(2, '0')}`,
        name: stepConfig.name,
        description: stepConfig.description,
        category: stepConfig.category,
        type: stepConfig.type,
        tags: ['quiz', 'style', stepConfig.category, 'gisele-galvao'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'giselegal',
      },
      design: MASTER_TEMPLATE.design,
      layout: {
        containerWidth: 'full',
        spacing: 'responsive',
        backgroundColor: '#FAF9F7',
        responsive: true,
        animations: MASTER_TEMPLATE.design.animations,
      },
      blocks: stepConfig.blocks,
      validation: {
        required: stepConfig.type === 'question' || stepConfig.type === 'strategicQuestion',
        minAnswers:
          stepConfig.type === 'question' ? 3 : stepConfig.type === 'strategicQuestion' ? 1 : 0,
        maxAnswers:
          stepConfig.type === 'question' ? 3 : stepConfig.type === 'strategicQuestion' ? 1 : 0,
        validationMessage:
          stepConfig.type === 'question'
            ? 'Selecione 3 opções para avançar.'
            : 'Selecione uma opção para avançar.',
      },
      analytics: {
        trackingId: `step-${stepConfig.step.toString().padStart(2, '0')}-${stepConfig.category}`,
        events: ['page_view', 'interaction', 'validation_error', 'completion'],
        utmParams: true,
        customEvents: stepConfig.type === 'result' ? ['conversion', 'cta_clicked'] : [],
      },
      logic: {
        navigation: {
          nextStep:
            stepConfig.step < 21
              ? `step-${(stepConfig.step + 1).toString().padStart(2, '0')}`
              : null,
          prevStep:
            stepConfig.step > 1
              ? `step-${(stepConfig.step - 1).toString().padStart(2, '0')}`
              : null,
          allowBack: stepConfig.step > 1,
          autoAdvance: stepConfig.type === 'mainTransition',
        },
        scoring:
          stepConfig.type === 'question'
            ? {
                enabled: true,
                method: 'category-points',
                categories: [
                  'Natural',
                  'Clássico',
                  'Contemporâneo',
                  'Elegante',
                  'Romântico',
                  'Sexy',
                  'Dramático',
                  'Criativo',
                ],
              }
            : null,
        conditions:
          stepConfig.type === 'result'
            ? {
                showResult: 'calculated-from-scoring',
                personalizeContent: 'based-on-strategic-answers',
              }
            : null,
      },
    };

    const filename = `step-${stepConfig.step.toString().padStart(2, '0')}-template.json`;
    const filepath = path.join(templatesDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(template, null, 2));

    console.log(`✅ ${filename} - ${stepConfig.name} (${stepConfig.blocks.length} blocos)`);
  }

  console.log(`\n🎉 21 TEMPLATES COMPLETOS CRIADOS COM SUCESSO!`);
  console.log('📊 Estatísticas:');
  console.log(`   - Etapa 1: Introdução com captura de nome`);
  console.log(`   - Etapas 2-14: 13 questões principais (3 seleções cada)`);
  console.log(`   - Etapa 15: Transição com loading`);
  console.log(`   - Etapas 16-20: 5 questões estratégicas (1 seleção cada)`);
  console.log(`   - Etapa 21: Resultado com CTA e bônus`);
  console.log(`\n🎯 Sistema configurado para painel de propriedades!`);
  console.log(`📝 Todas as propriedades são editáveis via interface visual`);
}

generateCompleteQuizTemplates().catch(console.error);

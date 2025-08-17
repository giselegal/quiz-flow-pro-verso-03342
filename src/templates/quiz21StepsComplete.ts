/**
 * 🎯 TEMPLATE COMPLETO - QUIZ DE ESTILO PESSOAL (21 ETAPAS)
 *
 * Este template contém a configuração completa do quiz de estilo com:
 * - Etapa 1: Coleta de nome
 * - Etapas 2-11: 10 questões pontuadas (3 seleções obrigatórias)
 * - Etapa 12: Transição para questões estratégicas
 * - Etapas 13-18: 6 questões estratégicas (1 seleção obrigatória)
 * - Etapa 19: Transição para resultado
 * - Etapa 20: Página de resultado personalizada
 * - Etapa 21: Página de oferta
 */

import { Block } from '@/types/editor';

export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = {
  // 🎯 ETAPA 1: COLETA DO NOME
  'step-1': [
    {
      id: 'step1-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Descubra seu Estilo Predominante',
        subtitle: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',
        description:
          'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        animation: 'fadeIn',
        animationDuration: '0.8s',
      },
    },
    {
      id: 'step1-lead-form',
      type: 'form-container',
      order: 1,
      content: {
        title: 'NOME',
        placeholder: 'Digite seu nome',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
      },
      properties: {
        requiredMessage: 'Por favor, digite seu nome para continuar',
        validationMessage: 'Digite seu nome para continuar',
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        fieldType: 'text',
        required: true,
        autoAdvanceOnComplete: true,
        dataKey: 'userName',
      },
    },
    {
      id: 'step1-privacy-text',
      type: 'text',
      order: 2,
      content: {
        text: 'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
      },
      properties: {
        fontSize: '12px',
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 16,
      },
    },
    {
      id: 'step1-footer',
      type: 'text',
      order: 3,
      content: {
        text: '2025 - Gisele Galvão - Todos os direitos reservados',
      },
      properties: {
        fontSize: '12px',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 24,
      },
    },
  ],

  // 🎯 ETAPA 2: QUESTÃO 1 - TIPO DE ROUPA FAVORITA
  'step-2': [
    {
      id: 'step2-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Questão 1 de 10',
        subtitle: 'Descubra seu Estilo Predominante',
        description: 'Responda com honestidade para obter um resultado mais preciso.',
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: 'sm',
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        showLogo: true,
        enableProgressBar: true,
        progressValue: 10,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: 'step2-question',
      type: 'options-grid',
      order: 1,
      content: {
        question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        options: [
          {
            id: 'natural_q1',
            text: 'Conforto, leveza e praticidade no vestir',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
          },
          {
            id: 'classico_q1',
            text: 'Discrição, caimento clássico e sobriedade',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
          },
          {
            id: 'contemporaneo_q1',
            text: 'Praticidade com um toque de estilo atual',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
          },
          {
            id: 'elegante_q1',
            text: 'Elegância refinada, moderna e sem exageros',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
          },
          {
            id: 'romantico_q1',
            text: 'Delicadeza em tecidos suaves e fluidos',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
          },
          {
            id: 'sexy_q1',
            text: 'Sensualidade com destaque para o corpo',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
          },
          {
            id: 'dramatico_q1',
            text: 'Impacto visual com peças estruturadas e assimétricas',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
          },
          {
            id: 'criativo_q1',
            text: 'Mix criativo com formas ousadas e originais',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
          },
        ],
      },
      properties: {
        questionId: 'q1_roupa_favorita',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        // Pontuação por opção
        scoreValues: {
          natural_q1: 1,
          classico_q1: 1,
          contemporaneo_q1: 1,
          elegante_q1: 1,
          romantico_q1: 1,
          sexy_q1: 1,
          dramatico_q1: 1,
          criativo_q1: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 4: QUESTÃO 3 - QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
  'step-4': [
    {
      id: 'step4-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        options: [
          {
            id: 'natural_q3',
            text: 'Visual leve, despojado e natural',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
          },
          {
            id: 'classico_q3',
            text: 'Visual clássico e tradicional',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
          },
          {
            id: 'contemporaneo_q3',
            text: 'Visual casual com toque atual',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
          },
          {
            id: 'elegante_q3',
            text: 'Visual refinado e imponente',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
          },
          {
            id: 'romantico_q3',
            text: 'Visual romântico, feminino e delicado',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
          },
          {
            id: 'sexy_q3',
            text: 'Visual sensual, com saia justa e decote',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
          },
          {
            id: 'dramatico_q3',
            text: 'Visual marcante e urbano (jeans + jaqueta)',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
          },
          {
            id: 'criativo_q3',
            text: 'Visual criativo, colorido e ousado',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
          },
        ],
      },
      properties: {
        questionId: 'q3_visual_identificacao',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q3: 1,
          classico_q3: 1,
          contemporaneo_q3: 1,
          elegante_q3: 1,
          romantico_q3: 1,
          sexy_q3: 1,
          dramatico_q3: 1,
          criativo_q3: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 5: QUESTÃO 4 - QUAIS DETALHES VOCÊ GOSTA?
  'step-5': [
    {
      id: 'step5-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAIS DETALHES VOCÊ GOSTA?',
        options: [
          {
            id: 'natural_q4',
            text: 'Poucos detalhes, básico e prático',
          },
          {
            id: 'classico_q4',
            text: 'Bem discretos e sutis, clean e clássico',
          },
          {
            id: 'contemporaneo_q4',
            text: 'Básico, mas com um toque de estilo',
          },
          {
            id: 'elegante_q4',
            text: 'Detalhes refinados, chic e que deem status',
          },
          {
            id: 'romantico_q4',
            text: 'Detalhes delicados, laços, babados',
          },
          {
            id: 'sexy_q4',
            text: 'Roupas que valorizem meu corpo: couro, zíper, fendas',
          },
          {
            id: 'dramatico_q4',
            text: 'Detalhes marcantes, firmeza e peso',
          },
          {
            id: 'criativo_q4',
            text: 'Detalhes diferentes do convencional, produções ousadas',
          },
        ],
      },
      properties: {
        questionId: 'q4_detalhes',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        scoreValues: {
          natural_q4: 1,
          classico_q4: 1,
          contemporaneo_q4: 1,
          elegante_q4: 1,
          romantico_q4: 1,
          sexy_q4: 1,
          dramatico_q4: 1,
          criativo_q4: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 3: QUESTÃO 2 - PERSONALIDADE
  'step-3': [
    {
      id: 'step3-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'RESUMA A SUA PERSONALIDADE:',
        options: [
          {
            id: 'natural_q2',
            text: 'Informal, espontânea, alegre, essencialista',
          },
          {
            id: 'classico_q2',
            text: 'Conservadora, séria, organizada',
          },
          {
            id: 'contemporaneo_q2',
            text: 'Informada, ativa, prática',
          },
          {
            id: 'elegante_q2',
            text: 'Exigente, sofisticada, seletiva',
          },
          {
            id: 'romantico_q2',
            text: 'Feminina, meiga, delicada, sensível',
          },
          {
            id: 'sexy_q2',
            text: 'Glamorosa, vaidosa, sensual',
          },
          {
            id: 'dramatico_q2',
            text: 'Cosmopolita, moderna e audaciosa',
          },
          {
            id: 'criativo_q2',
            text: 'Exótica, aventureira, livre',
          },
        ],
      },
      properties: {
        questionId: 'q2_personalidade',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        scoreValues: {
          natural_q2: 1,
          classico_q2: 1,
          contemporaneo_q2: 1,
          elegante_q2: 1,
          romantico_q2: 1,
          sexy_q2: 1,
          dramatico_q2: 1,
          criativo_q2: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 6: QUESTÃO 5 - QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
  'step-6': [
    {
      id: 'step6-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
        options: [
          {
            id: 'natural_q5',
            text: 'Estampas clean, com poucas informações',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
          },
          {
            id: 'classico_q5',
            text: 'Estampas clássicas e atemporais',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
          },
          {
            id: 'contemporaneo_q5',
            text: 'Atemporais, mas que tenham uma pegada atual e moderna',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
          },
          {
            id: 'elegante_q5',
            text: 'Estampas clássicas e atemporais, mas sofisticadas',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
          },
          {
            id: 'romantico_q5',
            text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
          },
          {
            id: 'sexy_q5',
            text: 'Estampas de animal print, como onça, zebra e cobra',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
          },
          {
            id: 'dramatico_q5',
            text: 'Estampas geométricas, abstratas e exageradas como grandes poás',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
          },
          {
            id: 'criativo_q5',
            text: 'Estampas diferentes do usual, como africanas, xadrez grandes',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
          },
        ],
      },
      properties: {
        questionId: 'q5_estampas',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q5: 1,
          classico_q5: 1,
          contemporaneo_q5: 1,
          elegante_q5: 1,
          romantico_q5: 1,
          sexy_q5: 1,
          dramatico_q5: 1,
          criativo_q5: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 7: QUESTÃO 6 - QUAL CASACO É SEU FAVORITO?
  'step-7': [
    {
      id: 'step7-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAL CASACO É SEU FAVORITO?',
        options: [
          {
            id: 'natural_q6',
            text: 'Cardigã bege confortável e casual',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp',
          },
          {
            id: 'classico_q6',
            text: 'Blazer verde estruturado',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp',
          },
          {
            id: 'contemporaneo_q6',
            text: 'Trench coat bege tradicional',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp',
          },
          {
            id: 'elegante_q6',
            text: 'Blazer branco refinado',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp',
          },
          {
            id: 'romantico_q6',
            text: 'Casaco pink vibrante e moderno',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp',
          },
          {
            id: 'sexy_q6',
            text: 'Jaqueta vinho de couro estilosa',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp',
          },
          {
            id: 'dramatico_q6',
            text: 'Jaqueta preta estilo rocker',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp',
          },
          {
            id: 'criativo_q6',
            text: 'Casaco estampado criativo e colorido',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp',
          },
        ],
      },
      properties: {
        questionId: 'q6_casaco',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q6: 1,
          classico_q6: 1,
          contemporaneo_q6: 1,
          elegante_q6: 1,
          romantico_q6: 1,
          sexy_q6: 1,
          dramatico_q6: 1,
          criativo_q6: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 8: QUESTÃO 7 - QUAL ESTILO DE CALÇA MAIS COMBINA COM VOCÊ?
  'step-8': [
    {
      id: 'step8-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAL SUA CALÇA FAVORITA?',
        options: [
          {
            id: 'natural_q7',
            text: 'Calça fluida acetinada bege',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp',
          },
          {
            id: 'classico_q7',
            text: 'Calça de alfaiataria cinza',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp',
          },
          {
            id: 'contemporaneo_q7',
            text: 'Jeans reto e básico',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp',
          },
          {
            id: 'elegante_q7',
            text: 'Calça reta bege de tecido',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp',
          },
          {
            id: 'romantico_q7',
            text: 'Calça ampla rosa alfaiatada',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp',
          },
          {
            id: 'sexy_q7',
            text: 'Legging preta de couro',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp',
          },
          {
            id: 'dramatico_q7',
            text: 'Calça reta preta de couro',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp',
          },
          {
            id: 'criativo_q7',
            text: 'Calça estampada floral leve e ampla',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp',
          },
        ],
      },
      properties: {
        questionId: 'q7_calca',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q7: 1,
          classico_q7: 1,
          contemporaneo_q7: 1,
          elegante_q7: 1,
          romantico_q7: 1,
          sexy_q7: 1,
          dramatico_q7: 1,
          criativo_q7: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 9: QUESTÃO 8 - SAPATOS
  'step-9': [
    {
      id: 'step9-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
        options: [
          {
            id: 'natural_q8',
            text: 'Tênis nude casual e confortável',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp',
          },
          {
            id: 'classico_q8',
            text: 'Scarpin nude de salto baixo',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp',
          },
          {
            id: 'contemporaneo_q8',
            text: 'Sandália dourada com salto bloco',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp',
          },
          {
            id: 'elegante_q8',
            text: 'Scarpin nude salto alto e fino',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp',
          },
          {
            id: 'romantico_q8',
            text: 'Sandália anabela off white',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp',
          },
          {
            id: 'sexy_q8',
            text: 'Sandália rosa de tiras finas',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp',
          },
          {
            id: 'dramatico_q8',
            text: 'Scarpin preto moderno com vinil transparente',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp',
          },
          {
            id: 'criativo_q8',
            text: 'Scarpin colorido estampado',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp',
          },
        ],
      },
      properties: {
        questionId: 'q8_sapatos',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q8: 1,
          classico_q8: 1,
          contemporaneo_q8: 1,
          elegante_q8: 1,
          romantico_q8: 1,
          sexy_q8: 1,
          dramatico_q8: 1,
          criativo_q8: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 10: QUESTÃO 9 - ACESSÓRIOS (TEXTO)
  'step-10': [
    {
      id: 'step10-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
        options: [
          {
            id: 'natural_q9',
            text: 'Pequenos e discretos, às vezes nem uso',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735431/56_acessorios_natural_zghkwe.webp',
          },
          {
            id: 'classico_q9',
            text: 'Brincos pequenos e discretos. Corrente fininha',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735431/57_acessorios_classico_kfhmwp.webp',
          },
          {
            id: 'contemporaneo_q9',
            text: 'Acessórios que elevem meu look com um toque moderno',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735431/58_acessorios_contemporaneo_lmsnqw.webp',
          },
          {
            id: 'elegante_q9',
            text: 'Acessórios sofisticados, joias ou semijoias',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735432/59_acessorios_elegante_hxkmpq.webp',
          },
          {
            id: 'romantico_q9',
            text: 'Peças delicadas e com um toque feminino',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735432/60_acessorios_romantico_ytrpnm.webp',
          },
          {
            id: 'sexy_q9',
            text: 'Brincos longos, colares que valorizem minha beleza',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735432/61_acessorios_sexy_qplmkn.webp',
          },
          {
            id: 'dramatico_q9',
            text: 'Acessórios pesados, que causem um impacto',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735433/62_acessorios_dramatico_mnbvcx.webp',
          },
          {
            id: 'criativo_q9',
            text: 'Acessórios diferentes, grandes e marcantes',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735433/63_acessorios_criativo_poiuyt.webp',
          },
        ],
      },
      properties: {
        questionId: 'q9_acessorios',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true,
        scoreValues: {
          natural_q9: 1,
          classico_q9: 1,
          contemporaneo_q9: 1,
          elegante_q9: 1,
          romantico_q9: 1,
          sexy_q9: 1,
          dramatico_q9: 1,
          criativo_q9: 1,
        },
      },
    },
  ],

  // 🎯 ETAPA 11: QUESTÃO 10 - TECIDOS
  'step-11': [
    {
      id: 'step11-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
        options: [
          {
            id: 'natural_q10',
            text: 'São fáceis de cuidar',
          },
          {
            id: 'classico_q10',
            text: 'São de excelente qualidade',
          },
          {
            id: 'contemporaneo_q10',
            text: 'São fáceis de cuidar e modernos',
          },
          {
            id: 'elegante_q10',
            text: 'São sofisticados',
          },
          {
            id: 'romantico_q10',
            text: 'São delicados',
          },
          {
            id: 'sexy_q10',
            text: 'São perfeitos ao meu corpo',
          },
          {
            id: 'dramatico_q10',
            text: 'São diferentes, e trazem um efeito para minha roupa',
          },
          {
            id: 'criativo_q10',
            text: 'São exclusivos, criam identidade no look',
          },
        ],
      },
      properties: {
        questionId: 'q10_tecidos',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        scoreValues: {
          natural_q10: 1,
          classico_q10: 1,
          contemporaneo_q10: 1,
          elegante_q10: 1,
          romantico_q10: 1,
          sexy_q10: 1,
          dramatico_q10: 1,
          criativo_q10: 1,
        },
      },
    },
  ],
  // 🎯 ETAPA 12: TRANSIÇÃO PARA QUESTÕES ESTRATÉGICAS
  'step-12': [
    {
      id: 'step12-transition',
      type: 'hero',
      order: 0,
      content: {
        title: 'Enquanto calculamos o seu resultado...',
        subtitle: 'Só mais alguns passos para personalizar ainda mais sua experiência',
        description:
          'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão.',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/transition_analysis_dkqmpw.webp',
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        imageWidth: 260,
        imageHeight: 260,
        showButton: true,
        buttonText: 'Vamos lá?',
        buttonColor: '#3B82F6',
        buttonTextColor: '#FFFFFF',
        autoAdvance: false,
        borderRadius: 16,
        boxShadow: 'md',
        padding: 24,
      },
    },
  ],

  // 🎯 ETAPA 13: QUESTÃO ESTRATÉGICA 1 - AUTOAVALIAÇÃO
  'step-13': [
    {
      id: 'step13-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
        options: [
          { id: 'q13_opt1', text: 'Me sinto desconectada da mulher que sou hoje' },
          { id: 'q13_opt2', text: 'Tenho dúvidas sobre o que realmente me valoriza' },
          { id: 'q13_opt3', text: 'Às vezes acerto, às vezes erro' },
          { id: 'q13_opt4', text: 'Me sinto segura, mas sei que posso evoluir' },
        ],
      },
      properties: {
        questionId: 'qs1_autoavaliacao',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: false,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: true,
      },
    },
  ],

  // 🎯 ETAPA 14: QUESTÃO ESTRATÉGICA 2 - DESAFIO PRINCIPAL
  'step-14': [
    {
      id: 'step14-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'O que mais te desafia na hora de se vestir?',
        options: [
          { id: 'q14_opt1', text: 'Tenho peças, mas não sei como combiná-las' },
          { id: 'q14_opt2', text: 'Compro por impulso e me arrependo depois' },
          { id: 'q14_opt3', text: 'Minha imagem não reflete quem eu sou' },
          { id: 'q14_opt4', text: 'Perco tempo e acabo usando sempre os mesmos looks' },
        ],
      },
      properties: {
        questionId: 'qs2_desafio',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: false,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: true,
      },
    },
  ],

  // 🎯 ETAPA 15: QUESTÃO ESTRATÉGICA 3 - FREQUÊNCIA DE INDECISÃO
  'step-15': [
    {
      id: 'step15-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Com que frequência você se pega pensando: “Com que roupa eu vou?” — mesmo com o guarda-roupa cheio?',
        options: [
          { id: 'q15_opt1', text: 'Quase todos os dias — é sempre uma indecisão' },
          { id: 'q15_opt2', text: 'Sempre que tenho um compromisso importante' },
          { id: 'q15_opt3', text: 'Às vezes, mas me sinto limitada nas escolhas' },
          { id: 'q15_opt4', text: 'Raramente — já me sinto segura ao me vestir' },
        ],
      },
      properties: {
        questionId: 'qs3_frequencia',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: false,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: true,
      },
    },
  ],

  // 🎯 ETAPA 16: QUESTÃO ESTRATÉGICA 4 - INVESTIMENTO
  'step-16': [
    {
      id: 'step16-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?',
        options: [
          { id: 'q16_opt1', text: 'Sim! Se existisse algo assim, eu quero' },
          { id: 'q16_opt2', text: 'Sim, mas teria que ser no momento certo' },
          { id: 'q16_opt3', text: 'Tenho dúvidas se funcionaria pra mim' },
          { id: 'q16_opt4', text: 'Não, prefiro continuar como estou' },
        ],
      },
      properties: {
        questionId: 'qs4_material',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: false,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: true,
      },
    },
  ],

  // 🎯 ETAPA 17: QUESTÃO ESTRATÉGICA 5 - PREÇO
  'step-17': [
    {
      id: 'step17-question',
      type: 'options-grid',
      order: 0,
      content: {
        question:
          'Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?',
        options: [
          { id: 'q17_opt1', text: 'Sim! Por esse resultado, vale muito' },
          { id: 'q17_opt2', text: 'Sim, mas só se eu tiver certeza de que funciona pra mim' },
          { id: 'q17_opt3', text: 'Talvez — depende do que está incluso' },
          { id: 'q17_opt4', text: 'Não, ainda não estou pronta para investir' },
        ],
      },
      properties: {
        questionId: 'qs5_preco',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: false,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: true,
      },
    },
  ],

  // 🎯 ETAPA 18: QUESTÃO ESTRATÉGICA 6 - OBJETIVO PRINCIPAL
  'step-18': [
    {
      id: 'step18-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'Qual desses resultados você mais gostaria de alcançar?',
        options: [
          { id: 'q18_opt1', text: 'Montar looks com mais facilidade e confiança' },
          { id: 'q18_opt2', text: 'Usar o que já tenho e me sentir estilosa' },
          { id: 'q18_opt3', text: 'Comprar com mais consciência e sem culpa' },
          { id: 'q18_opt4', text: 'Ser admirada pela imagem que transmito' },
          { id: 'q18_opt5', text: 'Resgatar peças esquecidas e criar novos looks com estilo' },
        ],
      },
      properties: {
        questionId: 'qs6_objetivo',
        showImages: false,
        columns: 1,
        requiredSelections: 1,
        maxSelections: 1,
        minSelections: 1,
        multipleSelection: false,
        autoAdvanceOnComplete: false,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 1 opção para continuar',
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false,
        nextButtonText: 'Avançar',
        showNextButton: true,
      },
    },
  ],

  // 🎯 ETAPA 19: TRANSIÇÃO PARA RESULTADO
  'step-19': [
    {
      id: 'step19-transition',
      type: 'hero',
      order: 0,
      content: {
        title: 'Estamos quase lá!',
        subtitle: 'Preparando seu resultado personalizado...',
        description:
          'Estamos calculando seu estilo predominante e preparando recomendações exclusivas. Isso levará apenas alguns segundos.',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/calculating_result_jksldq.webp',
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        imageWidth: 280,
        imageHeight: 280,
        showButton: true,
        buttonText: 'Ver meu resultado',
        buttonColor: '#3B82F6',
        buttonTextColor: '#FFFFFF',
        autoAdvance: false,
        borderRadius: 16,
        boxShadow: 'md',
        padding: 24,
      },
    },
  ],

  // 🎯 ETAPA 20: RESULTADO PERSONALIZADO + OFERTA (Teste A)
  'step-20': [
    {
      id: 'step20-result-header',
      type: 'result-header-inline',
      order: 0,
      content: {
        title: '{userName}, seu estilo predominante é:',
        subtitle: 'Estilo {resultStyle}',
        description:
          'Com base nas suas respostas, identificamos que seu estilo predominante é o {resultStyle}.',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/result_style_photo_kjsdlq.webp',
        styleGuideImageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/style_guide_examples_mdkeud.webp',
        showBothImages: true,
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        imageWidth: 380,
        imageHeight: 380,
        borderRadius: 16,
        boxShadow: 'md',
        padding: 24,
        marginBottom: 24,
      },
    },
    {
      id: 'step20-style-card',
      type: 'style-card-inline',
      order: 1,
      content: {
        title: 'Características do seu estilo',
        description: 'O estilo {resultStyle} se caracteriza por:',
        features: [
          'Personalidade: {resultPersonality}',
          'Cores: {resultColors}',
          'Tecidos: {resultFabrics}',
          'Estampas: {resultPrints}',
          'Acessórios: {resultAccessories}',
        ],
      },
      properties: {
        backgroundColor: '#FFFFFF',
        textAlign: 'left',
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 24,
        showIcon: true,
        iconName: 'sparkles',
        iconColor: '#3B82F6',
      },
    },
    {
      id: 'step20-secondary-styles',
      type: 'secondary-styles',
      order: 2,
      content: {
        title: 'Seus estilos complementares',
        subtitle: 'Você também apresenta elementos destes estilos:',
        secondaryStyles: [
          {
            name: '{secondaryStyle1}',
            percentage: '{secondaryPercentage1}%',
            description: '{secondaryDescription1}',
          },
          {
            name: '{secondaryStyle2}',
            percentage: '{secondaryPercentage2}%',
            description: '{secondaryDescription2}',
          },
        ],
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 24,
      },
    },
    {
      id: 'step20-cta',
      type: 'button',
      order: 3,
      content: {
        buttonText: 'Quero saber mais sobre meu estilo',
        buttonUrl: '#next-step',
      },
      properties: {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderRadius: 8,
        width: '100%',
        padding: '16px 24px',
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 16,
        showShadow: true,
      },
    },
  ],

  // 🎯 ETAPA 21: PÁGINA DE OFERTA (Teste B)
  'step-21': [
    {
      id: 'step21-offer-header',
      type: 'quiz-offer-cta-inline',
      order: 0,
      content: {
        title: 'Libere todo o potencial do seu estilo pessoal',
        subtitle:
          'Descubra como montar looks que realçam sua beleza natural e expressam sua personalidade!',
        description:
          'Parabéns por descobrir seu estilo predominante! Este é só o primeiro passo. Que tal aprofundar esse conhecimento e transformar seu guarda-roupa?',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/offer_image_main_jkldsd.webp',
        buttonText: 'Quero transformar meu estilo agora',
        buttonUrl: 'https://checkout.stylequest.com.br/oferta-especial',
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        imageWidth: 500,
        imageHeight: 300,
        buttonColor: '#3B82F6',
        buttonTextColor: '#FFFFFF',
        borderRadius: 16,
        boxShadow: 'lg',
        padding: 32,
        marginBottom: 32,
        highlightColor: '#F59E0B',
        showPrice: true,
        regularPrice: 'R$ 197,00',
        salePrice: 'R$ 97,00',
        showTimer: true,
        timerDuration: 900,
        timerLabel: 'Esta oferta expira em:',
      },
    },
    {
      id: 'step21-benefits',
      type: 'benefits',
      order: 1,
      content: {
        title: 'O que você vai receber',
        benefits: [
          {
            id: 'benefit1',
            title: 'E-book Completo de Estilo Pessoal',
            description:
              'Guia detalhado com todas as características do seu estilo e como aplicá-las no dia a dia.',
            icon: 'book',
          },
          {
            id: 'benefit2',
            title: 'Paleta de Cores Personalizada',
            description:
              'Descubra exatamente quais cores valorizam seu tom de pele, cabelo e olhos.',
            icon: 'palette',
          },
          {
            id: 'benefit3',
            title: 'Guia de Compras Inteligentes',
            description: 'Aprenda a investir nas peças certas e economizar dinheiro.',
            icon: 'shopping-bag',
          },
          {
            id: 'benefit4',
            title: 'Acesso ao Grupo VIP',
            description: 'Participe da nossa comunidade exclusiva com dicas semanais e suporte.',
            icon: 'users',
          },
        ],
      },
      properties: {
        backgroundColor: '#FFFFFF',
        textAlign: 'left',
        showIcons: true,
        iconColor: '#3B82F6',
        layout: 'cards',
        borderRadius: 12,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 32,
      },
    },
    {
      id: 'step21-testimonials',
      type: 'testimonials',
      order: 2,
      content: {
        title: 'O que dizem nossas clientes',
        testimonials: [
          {
            id: 'testimonial1',
            quote:
              'Finalmente entendi meu estilo e parei de gastar dinheiro com roupas que não combinavam comigo.',
            author: 'Márcia Silva',
            authorTitle: '38 anos, Advogada',
            rating: 5,
          },
          {
            id: 'testimonial2',
            quote:
              'Economizei muito dinheiro depois que aprendi a comprar apenas o que realmente combina com meu estilo.',
            author: 'Carolina Mendes',
            authorTitle: '42 anos, Empresária',
            rating: 5,
          },
          {
            id: 'testimonial3',
            quote:
              'Hoje me visto com mais confiança e praticidade, sem perder tempo pensando no que vestir.',
            author: 'Juliana Costa',
            authorTitle: '35 anos, Professora',
            rating: 5,
          },
        ],
      },
      properties: {
        backgroundColor: '#F0F9FF',
        textAlign: 'center',
        layout: 'card',
        showQuotes: true,
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 32,
      },
    },
    {
      id: 'step21-guarantee',
      type: 'guarantee',
      order: 3,
      content: {
        title: 'Garantia incondicional de 7 dias',
        description:
          'Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu dinheiro.',
        imageUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/guarantee_seal_klsjda.webp',
      },
      properties: {
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        imageWidth: 150,
        imageHeight: 150,
        borderRadius: 16,
        boxShadow: 'sm',
        padding: 24,
        marginBottom: 32,
        borderColor: '#3B82F6',
        borderWidth: '2px',
        borderStyle: 'dashed',
      },
    },
    {
      id: 'step21-final-cta',
      type: 'button',
      order: 4,
      content: {
        buttonText: 'Quero transformar meu estilo agora',
        buttonUrl: 'https://checkout.stylequest.com.br/oferta-especial',
      },
      properties: {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderRadius: 8,
        width: '100%',
        padding: '16px 24px',
        fontSize: '20px',
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 32,
        showShadow: true,
      },
    },
    {
      id: 'step21-footer',
      type: 'text',
      order: 5,
      content: {
        text: '© 2025 Gisele Galvão - Todos os direitos reservados',
      },
      properties: {
        fontSize: '12px',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 32,
      },
    },
  ],
};

// Lista completa das questões do quiz

export const QUIZ_QUESTIONS_COMPLETE: Record<number, string> = {
  1: 'Coleta do nome',
  2: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
  3: 'RESUMA A SUA PERSONALIDADE:',
  4: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
  5: 'QUAIS DETALHES VOCÊ GOSTA?',
  6: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
  7: 'QUAL CASACO É SEU FAVORITO?',
  8: 'QUAL SUA CALÇA FAVORITA?',
  9: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
  10: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
  11: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
  12: 'Página de transição para questões estratégicas',
  13: 'Como você se vê hoje?',
  14: 'O que mais te desafia na hora de se vestir?',
  15: 'Com que frequência você se pega pensando: "Com que roupa eu vou?"',
  16: 'Pense no quanto você já gastou com roupas que não usa...',
  17: 'Se esse conteúdo completo custasse R$ 97,00...',
  18: 'Qual desses resultados você mais gostaria de alcançar?',
  19: 'Página de transição para resultado',
  20: 'Página de resultado personalizada',
  21: 'Página de oferta direta',
};

export default QUIZ_STYLE_21_STEPS_TEMPLATE;

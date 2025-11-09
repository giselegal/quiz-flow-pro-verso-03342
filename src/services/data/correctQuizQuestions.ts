/**
 * ✅ FLUXO COMPLETO DO QUIZ DE ESTILO PESSOAL - 18 ETAPAS
 * BASEADO NO FLUXO CORRETO: QuizIntro → Nome → 10 Questões → Transição → 7 Estratégicas
 */

import { QuizQuestion } from '@/types/quiz';

export const COMPLETE_QUIZ_QUESTIONS: QuizQuestion[] = [
  // ETAPA 0: COLETA DE NOME (NÃO PONTUA)
  {
    id: 'q0',
    text: 'VAMOS NOS CONHECER?',
    order: 0,
    title: 'VAMOS NOS CONHECER?',
    type: 'name-input',
    required: true,
    options: [], // Input de texto para nome
  },

  // ✅ ETAPAS 1-10: QUESTÕES PRINCIPAIS QUE PONTUAM (10 questões)

  // QUESTÃO 1: QUAL O SEU TIPO DE ROUPA FAVORITA?
  {
    id: 'q1',
    text: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    order: 1,
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '1a',
        label: 'Conforto, leveza e praticidade no vestir',
        value: '1a',
        text: 'Conforto, leveza e praticidade no vestir',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
        style: 'natural',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '1b',
        label: 'Discrição, caimento clássico e sobriedade',
        value: '1b',
        text: 'Discrição, caimento clássico e sobriedade',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '1c',
        label: 'Praticidade com um toque de estilo atual',
        value: '1c',
        text: 'Praticidade com um toque de estilo atual',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '1d',
        label: 'Sofisticação em looks estruturados e refinados',
        value: '1d',
        text: 'Sofisticação em looks estruturados e refinados',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_mjrfcl.webp',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '1e',
        label: 'Delicadeza em tecidos suaves e fluidos',
        value: '1e',
        text: 'Delicadeza em tecidos suaves e fluidos',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '1f',
        label: 'Sensualidade com destaque para o corpo',
        value: '1f',
        text: 'Sensualidade com destaque para o corpo',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '1g',
        label: 'Impacto visual com peças estruturadas e assimétricas',
        value: '1g',
        text: 'Impacto visual com peças estruturadas e assimétricas',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '1h',
        label: 'Mix criativo com formas ousadas e originais',
        value: '1h',
        text: 'Mix criativo com formas ousadas e originais',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 2: RESUMA A SUA PERSONALIDADE
  {
    id: 'q2',
    text: 'RESUMA A SUA PERSONALIDADE:',
    title: 'RESUMA A SUA PERSONALIDADE:',
    order: 2,
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '2a',
        label: 'Informal, espontânea, alegre, essencialista',
        value: '2a',
        text: 'Informal, espontânea, alegre, essencialista',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '2b',
        label: 'Conservadora, séria, organizada',
        value: '2b',
        text: 'Conservadora, séria, organizada',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '2c',
        label: 'Informada, ativa, prática',
        value: '2c',
        text: 'Informada, ativa, prática',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '2d',
        label: 'Exigente, sofisticada, seletiva',
        value: '2d',
        text: 'Exigente, sofisticada, seletiva',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '2e',
        label: 'Feminina, meiga, delicada, sensível',
        value: '2e',
        text: 'Feminina, meiga, delicada, sensível',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '2f',
        label: 'Glamorosa, vaidosa, sensual',
        value: '2f',
        text: 'Glamorosa, vaidosa, sensual',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '2g',
        label: 'Cosmopolita, moderna e audaciosa',
        value: '2g',
        text: 'Cosmopolita, moderna e audaciosa',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '2h',
        label: 'Exótica, aventureira, livre',
        value: '2h',
        text: 'Exótica, aventureira, livre',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 3: QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
  {
    id: 'q3',
    text: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '3a',
        label: 'Visual leve, despojado e natural',
        value: '3a',
        text: 'Visual leve, despojado e natural',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '3b',
        label: 'Visual clássico e tradicional',
        value: '3b',
        text: 'Visual clássico e tradicional',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '3c',
        label: 'Visual casual com toque atual',
        value: '3c',
        text: 'Visual casual com toque atual',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '3d',
        label: 'Visual refinado e imponente',
        value: '3d',
        text: 'Visual refinado e imponente',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '3e',
        label: 'Visual romântico, feminino e delicado',
        value: '3e',
        text: 'Visual romântico, feminino e delicado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '3f',
        label: 'Visual sensual, com saia justa e decote',
        value: '3f',
        text: 'Visual sensual, com saia justa e decote',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '3g',
        label: 'Visual marcante e urbano (jeans + jaqueta)',
        value: '3g',
        text: 'Visual marcante e urbano (jeans + jaqueta)',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '3h',
        label: 'Visual criativo, colorido e ousado',
        value: '3h',
        text: 'Visual criativo, colorido e ousado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 4: QUAIS DETALHES VOCÊ GOSTA?
  {
    id: 'q4',
    text: 'QUAIS DETALHES VOCÊ GOSTA?',
    title: 'QUAIS DETALHES VOCÊ GOSTA?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '4a',
        label: 'Poucos detalhes, básico e prático',
        value: '4a',
        text: 'Poucos detalhes, básico e prático',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '4b',
        label: 'Bem discretos e sutis, clean e clássico',
        value: '4b',
        text: 'Bem discretos e sutis, clean e clássico',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '4c',
        label: 'Básico, mas com um toque de estilo',
        value: '4c',
        text: 'Básico, mas com um toque de estilo',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '4d',
        label: 'Detalhes refinados, chic e que deem status',
        value: '4d',
        text: 'Detalhes refinados, chic e que deem status',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '4e',
        label: 'Detalhes delicados, laços, babados',
        value: '4e',
        text: 'Detalhes delicados, laços, babados',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '4f',
        label: 'Roupas que valorizem meu corpo: couro, zíper, fendas',
        value: '4f',
        text: 'Roupas que valorizem meu corpo: couro, zíper, fendas',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '4g',
        label: 'Detalhes marcantes, firmeza e peso',
        value: '4g',
        text: 'Detalhes marcantes, firmeza e peso',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '4h',
        label: 'Detalhes diferentes do convencional, produções ousadas',
        value: '4h',
        text: 'Detalhes diferentes do convencional, produções ousadas',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 5: QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
  {
    id: 'q5',
    text: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    title: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '5a',
        label: 'Estampas clean, com poucas informações',
        value: '5a',
        text: 'Estampas clean, com poucas informações',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '5b',
        label: 'Estampas clássicas e atemporais',
        value: '5b',
        text: 'Estampas clássicas e atemporais',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '5c',
        label: 'Atemporais, mas que tenham uma pegada de atual e moderna',
        value: '5c',
        text: 'Atemporais, mas que tenham uma pegada de atual e moderna',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '5d',
        label: 'Estampas clássicas e atemporais, mas sofisticadas',
        value: '5d',
        text: 'Estampas clássicas e atemporais, mas sofisticadas',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '5e',
        label: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações',
        value: '5e',
        text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '5f',
        label: 'Estampas de animal print, como onça, zebra e cobra',
        value: '5f',
        text: 'Estampas de animal print, como onça, zebra e cobra',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '5g',
        label: 'Estampas geométricas, abstratas e exageradas como grandes poás',
        value: '5g',
        text: 'Estampas geométricas, abstratas e exageradas como grandes poás',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '5h',
        label: 'Estampas diferentes do usual, como africanas, xadrez grandes',
        value: '5h',
        text: 'Estampas diferentes do usual, como africanas, xadrez grandes',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 6: QUAL CASACO É SEU FAVORITO?
  {
    id: 'q6',
    text: 'QUAL CASACO É SEU FAVORITO?',
    title: 'QUAL CASACO É SEU FAVORITO?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '6a',
        label: 'Cardigã bege confortável e casual',
        value: '6a',
        text: 'Cardigã bege confortável e casual',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '6b',
        label: 'Blazer clássico e elegante',
        value: '6b',
        text: 'Blazer clássico e elegante',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735374/30_lbfjk5.webp',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '6c',
        label: 'Blazer moderno e atual',
        value: '6c',
        text: 'Blazer moderno e atual',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735375/31_d6xo3f.webp',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '6d',
        label: 'Casaco elegante e sofisticado',
        value: '6d',
        text: 'Casaco elegante e sofisticado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735376/32_dxhxon.webp',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '6e',
        label: 'Casaco rosa romântico e delicado',
        value: '6e',
        text: 'Casaco rosa romântico e delicado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_ejhsra.webp',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '6f',
        label: 'Jaqueta vinho de couro estilosa',
        value: '6f',
        text: 'Jaqueta vinho de couro estilosa',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '6g',
        label: 'Jaqueta preta estilo rocker',
        value: '6g',
        text: 'Jaqueta preta estilo rocker',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '6h',
        label: 'Casaco estampado criativo e colorido',
        value: '6h',
        text: 'Casaco estampado criativo e colorido',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 7: QUAL SUA CALÇA FAVORITA?
  {
    id: 'q7',
    text: 'QUAL SUA CALÇA FAVORITA?',
    title: 'QUAL SUA CALÇA FAVORITA?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '7a',
        label: 'Calça jeans clara e confortável',
        value: '7a',
        text: 'Calça jeans clara e confortável',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735418/39_wlkzbo.webp',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '7b',
        label: 'Calça social clássica e elegante',
        value: '7b',
        text: 'Calça social clássica e elegante',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '7c',
        label: 'Jeans reto e básico',
        value: '7c',
        text: 'Jeans reto e básico',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '7d',
        label: 'Calça reta bege de tecido',
        value: '7d',
        text: 'Calça reta bege de tecido',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '7e',
        label: 'Calça ampla rosa alfaiatada',
        value: '7e',
        text: 'Calça ampla rosa alfaiatada',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '7f',
        label: 'Legging preta de couro',
        value: '7f',
        text: 'Legging preta de couro',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '7g',
        label: 'Calça reta preta de couro',
        value: '7g',
        text: 'Calça reta preta de couro',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '7h',
        label: 'Calça estampada floral leve e ampla',
        value: '7h',
        text: 'Calça estampada floral leve e ampla',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 8: QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?
  {
    id: 'q8',
    text: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
    title: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '8a',
        label: 'Tênis nude casual e confortável',
        value: '8a',
        text: 'Tênis nude casual e confortável',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '8b',
        label: 'Scarpin nude de salto baixo',
        value: '8b',
        text: 'Scarpin nude de salto baixo',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '8c',
        label: 'Sandália dourada com salto bloco',
        value: '8c',
        text: 'Sandália dourada com salto bloco',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '8d',
        label: 'Scarpin nude salto alto e fino',
        value: '8d',
        text: 'Scarpin nude salto alto e fino',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '8e',
        label: 'Sandália anabela off white',
        value: '8e',
        text: 'Sandália anabela off white',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '8f',
        label: 'Sandália rosa de tiras finas',
        value: '8f',
        text: 'Sandália rosa de tiras finas',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '8g',
        label: 'Scarpin preto moderno com vinil transparente',
        value: '8g',
        text: 'Scarpin preto moderno com vinil transparente',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '8h',
        label: 'Scarpin colorido estampado',
        value: '8h',
        text: 'Scarpin colorido estampado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 9: QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?
  {
    id: 'q9',
    text: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
    title: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '9a',
        label: 'Poucos e básicos',
        value: '9a',
        text: 'Poucos e básicos',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '9b',
        label: 'Clássicos e atemporais',
        value: '9b',
        text: 'Clássicos e atemporais',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '9c',
        label: 'Práticos e atuais',
        value: '9c',
        text: 'Práticos e atuais',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '9d',
        label: 'Sofisticados',
        value: '9d',
        text: 'Sofisticados',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '9e',
        label: 'Delicados',
        value: '9e',
        text: 'Delicados',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '9f',
        label: 'Perfeitos ao meu corpo',
        value: '9f',
        text: 'Perfeitos ao meu corpo',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '9g',
        label: 'Diferentes, e trazem um efeito para minha roupa',
        value: '9g',
        text: 'Diferentes, e trazem um efeito para minha roupa',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '9h',
        label: 'Exclusivos, criam identidade no look',
        value: '9h',
        text: 'Exclusivos, criam identidade no look',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // QUESTÃO 10: O QUE MAIS VALORIZAS NOS ACESSÓRIOS?
  {
    id: 'q10',
    text: 'O QUE MAIS VALORIZAS NOS ACESSÓRIOS?',
    title: 'O QUE MAIS VALORIZAS NOS ACESSÓRIOS?',
    type: 'multiple-choice',
    required: true,
    multiSelect: 3,
    options: [
      {
        id: '10a',
        label: 'São fáceis de cuidar',
        value: '10a',
        text: 'São fáceis de cuidar',
        styleCategory: 'Natural',
        weight: 1,
      },
      {
        id: '10b',
        label: 'São de excelente qualidade',
        value: '10b',
        text: 'São de excelente qualidade',
        styleCategory: 'Clássico',
        weight: 1,
      },
      {
        id: '10c',
        label: 'São fáceis de cuidar e modernos',
        value: '10c',
        text: 'São fáceis de cuidar e modernos',
        styleCategory: 'Contemporâneo',
        weight: 1,
      },
      {
        id: '10d',
        label: 'São sofisticados',
        value: '10d',
        text: 'São sofisticados',
        styleCategory: 'Elegante',
        weight: 1,
      },
      {
        id: '10e',
        label: 'São delicados',
        value: '10e',
        text: 'São delicados',
        styleCategory: 'Romântico',
        weight: 1,
      },
      {
        id: '10f',
        label: 'São perfeitos ao meu corpo',
        value: '10f',
        text: 'São perfeitos ao meu corpo',
        styleCategory: 'Sexy',
        weight: 1,
      },
      {
        id: '10g',
        label: 'São diferentes, e trazem um efeito para minha roupa',
        value: '10g',
        text: 'São diferentes, e trazem um efeito para minha roupa',
        styleCategory: 'Dramático',
        weight: 1,
      },
      {
        id: '10h',
        label: 'São exclusivos, criam identidade no look',
        value: '10h',
        text: 'São exclusivos, criam identidade no look',
        styleCategory: 'Criativo',
        weight: 1,
      },
    ],
  },

  // ✅ ETAPA 11: PÁGINA DE TRANSIÇÃO PARA QUESTÕES ESTRATÉGICAS
  {
    id: 'transition1',
    text: 'Enquanto calculamos o seu resultado...',
    title: 'Enquanto calculamos o seu resultado...',
    order: 11,
    type: 'text',
    required: false,
    options: [],
  },

  // ✅ QUESTÕES ESTRATÉGICAS (12-17) - 1 seleção obrigatória, pontuação 0

  // QUESTÃO ESTRATÉGICA 1: Como você se vê hoje?
  {
    id: 'strategic1',
    text: 'Como você se vê hoje?',
    title: 'Como você se vê hoje?',
    order: 12,
    type: 'single-choice',
    required: true,
    multiSelect: 1,
    options: [
      {
        id: 'st1a',
        label: 'Me sinto desconectada da mulher que sou hoje',
        value: 'st1a',
        text: 'Me sinto desconectada da mulher que sou hoje',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st1b',
        label: 'Tenho dúvidas sobre o que realmente me valoriza',
        value: 'st1b',
        text: 'Tenho dúvidas sobre o que realmente me valoriza',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st1c',
        label: 'Às vezes acerto, às vezes erro',
        value: 'st1c',
        text: 'Às vezes acerto, às vezes erro',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st1d',
        label: 'Me sinto segura, mas sei que posso evoluir',
        value: 'st1d',
        text: 'Me sinto segura, mas sei que posso evoluir',
        styleCategory: 'Strategic',
        weight: 0,
      },
    ],
  },

  // QUESTÃO ESTRATÉGICA 2: O que mais te desafia na hora de se vestir?
  {
    id: 'strategic2',
    text: 'O que mais te desafia na hora de se vestir?',
    title: 'O que mais te desafia na hora de se vestir?',
    order: 13,
    type: 'single-choice',
    required: true,
    multiSelect: 1,
    options: [
      {
        id: 'st2a',
        label: 'Tenho peças, mas não sei como combiná-las',
        value: 'st2a',
        text: 'Tenho peças, mas não sei como combiná-las',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st2b',
        label: 'Compro por impulso e me arrependo depois',
        value: 'st2b',
        text: 'Compro por impulso e me arrependo depois',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st2c',
        label: 'Minha imagem não reflete quem eu sou',
        value: 'st2c',
        text: 'Minha imagem não reflete quem eu sou',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st2d',
        label: 'Perco tempo e acabo usando sempre os mesmos looks',
        value: 'st2d',
        text: 'Perco tempo e acabo usando sempre os mesmos looks',
        styleCategory: 'Strategic',
        weight: 0,
      },
    ],
  },

  // QUESTÃO ESTRATÉGICA 3: Frequência de indecisão
  {
    id: 'strategic3',
    text: 'Com que frequência você se pega pensando: "Com que roupa eu vou?" — mesmo com o guarda-roupa cheio?',
    title:
      'Com que frequência você se pega pensando: "Com que roupa eu vou?" — mesmo com o guarda-roupa cheio?',
    order: 14,
    type: 'single-choice',
    required: true,
    multiSelect: 1,
    options: [
      {
        id: 'st3a',
        label: 'Quase todos os dias — é sempre uma indecisão',
        value: 'st3a',
        text: 'Quase todos os dias — é sempre uma indecisão',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st3b',
        label: 'Sempre que tenho um compromisso importante',
        value: 'st3b',
        text: 'Sempre que tenho um compromisso importante',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st3c',
        label: 'Às vezes, mas me sinto limitada nas escolhas',
        value: 'st3c',
        text: 'Às vezes, mas me sinto limitada nas escolhas',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st3d',
        label: 'Raramente — já me sinto segura ao me vestir',
        value: 'st3d',
        text: 'Raramente — já me sinto segura ao me vestir',
        styleCategory: 'Strategic',
        weight: 0,
      },
    ],
  },

  // QUESTÃO ESTRATÉGICA 4: Interesse em material estratégico
  {
    id: 'strategic4',
    text: 'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é...',
    title:
      'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é...',
    order: 15,
    type: 'single-choice',
    required: true,
    multiSelect: 1,
    options: [
      {
        id: 'st4a',
        label: 'Sim! Se existisse algo assim, eu quero',
        value: 'st4a',
        text: 'Sim! Se existisse algo assim, eu quero',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st4b',
        label: 'Sim, mas teria que ser no momento certo',
        value: 'st4b',
        text: 'Sim, mas teria que ser no momento certo',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st4c',
        label: 'Tenho dúvidas se funcionaria pra mim',
        value: 'st4c',
        text: 'Tenho dúvidas se funcionaria pra mim',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st4d',
        label: 'Não, prefiro continuar como estou',
        value: 'st4d',
        text: 'Não, prefiro continuar como estou',
        styleCategory: 'Strategic',
        weight: 0,
      },
    ],
  },

  // QUESTÃO ESTRATÉGICA 5: Investimento em estilo
  {
    id: 'strategic5',
    text: 'Se esse conteúdo completo custasse R$ 97,00 — incluindo Guia de Estilo, bônus especiais e um passo a passo prático para transformar sua imagem pessoal — você consideraria um bom investimento?',
    title:
      'Se esse conteúdo completo custasse R$ 97,00 — incluindo Guia de Estilo, bônus especiais e um passo a passo prático para transformar sua imagem pessoal — você consideraria um bom investimento?',
    order: 16,
    type: 'single-choice',
    required: true,
    multiSelect: 1,
    options: [
      {
        id: 'st5a',
        label: 'Sim! Por esse resultado, vale muito',
        value: 'st5a',
        text: 'Sim! Por esse resultado, vale muito',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st5b',
        label: 'Sim, mas só se eu tiver certeza de que funciona pra mim',
        value: 'st5b',
        text: 'Sim, mas só se eu tiver certeza de que funciona pra mim',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st5c',
        label: 'Talvez — depende do que está incluso',
        value: 'st5c',
        text: 'Talvez — depende do que está incluso',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st5d',
        label: 'Não, ainda não estou pronta para investir',
        value: 'st5d',
        text: 'Não, ainda não estou pronta para investir',
        styleCategory: 'Strategic',
        weight: 0,
      },
    ],
  },

  // QUESTÃO ESTRATÉGICA 6: Resultados desejados
  {
    id: 'strategic6',
    text: 'Qual desses resultados você mais gostaria de alcançar com os Guias de Estilo e Imagem?',
    title: 'Qual desses resultados você mais gostaria de alcançar com os Guias de Estilo e Imagem?',
    order: 17,
    type: 'single-choice',
    required: true,
    multiSelect: 1,
    options: [
      {
        id: 'st6a',
        label: 'Montar looks com mais facilidade e confiança',
        value: 'st6a',
        text: 'Montar looks com mais facilidade e confiança',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st6b',
        label: 'Usar o que já tenho e me sentir estilosa',
        value: 'st6b',
        text: 'Usar o que já tenho e me sentir estilosa',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st6c',
        label: 'Comprar com mais consciência e sem culpa',
        value: 'st6c',
        text: 'Comprar com mais consciência e sem culpa',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st6d',
        label: 'Ser admirada pela imagem que transmito',
        value: 'st6d',
        text: 'Ser admirada pela imagem que transmito',
        styleCategory: 'Strategic',
        weight: 0,
      },
      {
        id: 'st6e',
        label: 'Resgatar peças esquecidas e criar novos looks com estilo',
        value: 'st6e',
        text: 'Resgatar peças esquecidas e criar novos looks com estilo',
        styleCategory: 'Strategic',
        weight: 0,
      },
    ],
  },

  // ✅ ETAPA 18: PÁGINA DE TRANSIÇÃO PARA RESULTADO
  {
    id: 'transition2',
    text: 'Obrigada por compartilhar...',
    title: 'Obrigada por compartilhar...',
    order: 18,
    type: 'text',
    required: false,
    options: [],
  },
];

// Categorias de estilo disponíveis
export const STYLE_CATEGORIES = [
  'Natural',
  'Clássico',
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo',
] as const;

export type StyleCategory = (typeof STYLE_CATEGORIES)[number];

// ✅ FUNÇÃO DE CÁLCULO DE PONTUAÇÃO DO QUIZ
export interface QuizScoreResult {
  profile: string;
  percentage: number;
  scores: Record<string, number>;
  totalAnswers: number;
  recommendedStyle: string;
}

export const calculateQuizScore = (userAnswers: Record<string, string>): QuizScoreResult => {
  const styleScores: Record<string, number> = {};
  let totalAnswers = 0;

  // Inicializar contadores para todas as categorias
  STYLE_CATEGORIES.forEach(category => {
    styleScores[category] = 0;
  });

  // Calcular pontuação baseada nas respostas
  Object.entries(userAnswers).forEach(([questionId, answerId]) => {
    // Encontrar a questão
    const question = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    // Só contar questões que pontuam (q1-q10 = etapas 2-11)
    const scorableQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
    if (!scorableQuestions.includes(questionId)) return;

    // Encontrar a opção selecionada
    const option = question.options?.find(opt => opt.id === answerId);
    if (!option) return;

    totalAnswers++;

    // Adicionar pontuação baseada no style da opção
    if (option.style) {
      const styleKey = option.style.charAt(0).toUpperCase() + option.style.slice(1).toLowerCase();
      if (styleScores.hasOwnProperty(styleKey)) {
        styleScores[styleKey] += option.weight || 1;
      }
    }

    // Também considerar styleCategory se disponível
    if (option.styleCategory) {
      const categoryKey = option.styleCategory;
      if (styleScores.hasOwnProperty(categoryKey)) {
        styleScores[categoryKey] += option.weight || 1;
      }
    }
  });

  // Encontrar o estilo com maior pontuação
  let maxScore = 0;
  let dominantStyle = 'Natural';

  Object.entries(styleScores).forEach(([style, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantStyle = style;
    }
  });

  // Calcular porcentagem
  const maxPossibleScore = totalAnswers * 3; // Assumindo peso máximo de 3
  const percentage = maxPossibleScore > 0 ? Math.round((maxScore / maxPossibleScore) * 100) : 0;

  return {
    profile: dominantStyle,
    percentage: Math.max(percentage, 25), // Mínimo de 25% para melhor UX
    scores: styleScores,
    totalAnswers,
    recommendedStyle: dominantStyle,
  };
};

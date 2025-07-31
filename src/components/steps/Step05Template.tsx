import React from 'react';

// Template para a Etapa 5 - Questão 5: QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
export const getStep05Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 50,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
      level: 'h2',
      fontSize: 'text-2xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 8
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Questão 5 de 10',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      options: [
        { 
          id: "5a", 
          text: "Estampas naturais orgânicas com elementos da natureza",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/20_prsrss.webp",
          value: "5a",
          category: "Natural",
          styleCategory: "Natural",
          points: 1
        },
        { 
          id: "5b", 
          text: "Estampas clássicas como listras, xadrez e poá tradicionais",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_jlqjgw.webp",
          value: "5b",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 1
        },
        { 
          id: "5c", 
          text: "Estampas geométricas modernas e minimalistas",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp",
          value: "5c",
          category: "Contemporâneo",
          styleCategory: "Contemporâneo",
          points: 1
        },
        { 
          id: "5d", 
          text: "Estampas clássicas e atemporais, mas sofisticadas",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp",
          value: "5d",
          category: "Elegante",
          styleCategory: "Elegante",
          points: 1
        },
        { 
          id: "5e", 
          text: "Estampas florais e/ou delicadas como bolinhas, borboletas e corações",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp",
          value: "5e",
          category: "Romântico",
          styleCategory: "Romântico",
          points: 1
        },
        { 
          id: "5f", 
          text: "Estampas sensuais como animal print e rendas",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_ym5yrp.webp",
          value: "5f",
          category: "Sexy",
          styleCategory: "Sexy",
          points: 1
        },
        { 
          id: "5g", 
          text: "Estampas marcantes e impactantes em preto e branco",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/26_qrfkjn.webp",
          value: "5g",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 1
        },
        { 
          id: "5h", 
          text: "Estampas criativas, artísticas e não convencionais",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_xjffrp.webp",
          value: "5h",
          category: "Criativo",
          styleCategory: "Criativo",
          points: 1
        }
      ],
      columns: 2,
      showImages: true,
      imageSize: 'large',
      multipleSelection: true,
      maxSelections: 3,
      minSelections: 1,
      validationMessage: 'Selecione até 3 opções',
      gridGap: 16,
      responsiveColumns: true
    }
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Continuar',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      disabled: true,
      requiresValidSelection: true
    }
  }
];

export default getStep05Template;

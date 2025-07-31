
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 2 - QUESTÃO 1: ROUPA FAVORITA
export const getStep02Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 10,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'QUAL DESSAS ROUPAS TE FAZ SENTIR MAIS CONFIANTE?',
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
      content: 'Questão 1 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'question-1',
      options: [
        {
          id: "q1-natural",
          text: "Vestido fluido e confortável",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/vestido-fluido-natural_z1c2up.webp",
          value: "natural",
          category: "Natural",
          styleCategory: "Natural",
          points: 3
        },
        {
          id: "q1-classico",
          text: "Blazer estruturado com calça social",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/blazer-classico_z1c2up.webp",
          value: "classico",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 3
        },
        {
          id: "q1-dramatico",
          text: "Vestido preto com detalhes marcantes",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/vestido-dramatico_z1c2up.webp",
          value: "dramatico",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 3
        },
        {
          id: "q1-romantico",
          text: "Blusa de renda com saia midi",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/blusa-romantica_z1c2up.webp",
          value: "romantico",
          category: "Romântico",
          styleCategory: "Romântico",
          points: 3
        }
      ],
      columns: 2,
      showImages: true,
      multipleSelection: false,
      maxSelections: 1,
      minSelections: 1,
      validationMessage: 'Selecione uma opção',
      gridGap: 16,
      responsiveColumns: true,
      autoAdvanceOnComplete: false,
      autoAdvanceDelay: 800,
      requiredSelections: 1,
      enableButtonOnlyWhenValid: true,
      showValidationFeedback: true
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

export default getStep02Template;

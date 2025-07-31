
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 10 - QUESTÃO 9: OCASIÕES
export const getStep10Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 48,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'PARA QUAL OCASIÃO VOCÊ MAIS PRECISA DE LOOKS?',
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
      content: 'Questão 9 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'question-9',
      options: [
        {
          id: "q9-natural",
          text: "Dia a dia casual e fins de semana",
          value: "natural",
          category: "Natural",
          styleCategory: "Natural",
          points: 3
        },
        {
          id: "q9-classico",
          text: "Ambiente corporativo e eventos formais",
          value: "classico",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 3
        },
        {
          id: "q9-dramatico",
          text: "Eventos sociais e noturenos",
          value: "dramatico",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 3
        },
        {
          id: "q9-romantico",
          text: "Encontros românticos e comemorações",
          value: "romantico",
          category: "Romântico",
          styleCategory: "Romântico",
          points: 3
        }
      ],
      columns: 1,
      showImages: false,
      multipleSelection: false,
      maxSelections: 1,
      minSelections: 1,
      validationMessage: 'Selecione uma opção',
      gridGap: 12,
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

export default getStep10Template;

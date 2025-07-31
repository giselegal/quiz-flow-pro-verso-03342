
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 5 - QUESTÃO 4: ESTILO DE VIDA
export const getStep05Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 24,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'COMO É SEU DIA A DIA?',
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
      content: 'Questão 4 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'question-4',
      options: [
        {
          id: "q4-natural",
          text: "Casual e descontraído",
          value: "natural",
          category: "Natural",
          styleCategory: "Natural",
          points: 3
        },
        {
          id: "q4-classico",
          text: "Formal e profissional",
          value: "classico",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 3
        },
        {
          id: "q4-dramatico",
          text: "Urbano e dinâmico",
          value: "dramatico",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 3
        },
        {
          id: "q4-romantico",
          text: "Versátil entre casa e trabalho",
          value: "romantico",
          category: "Romântico",
          styleCategory: "Romântico",
          points: 3
        }
      ],
      columns: 2,
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

export default getStep05Template;

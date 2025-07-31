
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 3 - QUESTÃO 2: PERSONALIDADE
export const getStep03Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 14,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'COMO VOCÊ SE DESCREVERIA?',
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
      content: 'Questão 2 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'question-2',
      options: [
        {
          id: "q2-natural",
          text: "Espontânea e autêntica",
          value: "natural",
          category: "Natural",
          styleCategory: "Natural",
          points: 3
        },
        {
          id: "q2-classico",
          text: "Elegante e sofisticada",
          value: "classico",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 3
        },
        {
          id: "q2-dramatico",
          text: "Marcante e confiante",
          value: "dramatico",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 3
        },
        {
          id: "q2-romantico",
          text: "Delicada e feminina",
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

export default getStep03Template;

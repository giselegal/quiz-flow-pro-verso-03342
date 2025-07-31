
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 8 - QUESTÃO 7: ACESSÓRIOS
export const getStep08Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 38,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'QUE TIPO DE ACESSÓRIO COMPLETA SEU LOOK?',
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
      content: 'Questão 7 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'question-7',
      options: [
        {
          id: "q7-natural",
          text: "Bolsa de couro e sapatos confortáveis",
          value: "natural",
          category: "Natural",
          styleCategory: "Natural",
          points: 3
        },
        {
          id: "q7-classico",
          text: "Relógio clássico e bolsa estruturada",
          value: "classico",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 3
        },
        {
          id: "q7-dramatico",
          text: "Óculos escuros e joias minimalistas",
          value: "dramatico",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 3
        },
        {
          id: "q7-romantico",
          text: "Joias delicadas e lenços sedosos",
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

export default getStep08Template;


import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 4 - QUESTÃO 3: BIOTIPO CORPORAL
export const getStep04Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 19,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'QUAL SILHUETA VOCÊ MAIS GOSTA DE VALORIZAR?',
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
      content: 'Questão 3 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'question-3',
      options: [
        {
          id: "q3-natural",
          text: "Linhas relaxadas e fluidas",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/silhueta-natural_z1c2up.webp",
          value: "natural",
          category: "Natural",
          styleCategory: "Natural",
          points: 3
        },
        {
          id: "q3-classico",
          text: "Cintura marcada e estrutura",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/silhueta-classica_z1c2up.webp",
          value: "classico",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 3
        },
        {
          id: "q3-dramatico",
          text: "Linhas retas e minimalistas",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/silhueta-dramatica_z1c2up.webp",
          value: "dramatico",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 3
        },
        {
          id: "q3-romantico",
          text: "Curvas suaves e femininas",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/silhueta-romantica_z1c2up.webp",
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

export default getStep04Template;


import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 6 - QUESTÃO 5: CORES FAVORITAS
export const getStep06Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 29,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'QUAL PALETA DE CORES TE ATRAI MAIS?',
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
      content: 'Questão 5 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'question-5',
      options: [
        {
          id: "q5-natural",
          text: "Tons terrosos e neutros",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/paleta-natural_z1c2up.webp",
          value: "natural",
          category: "Natural",
          styleCategory: "Natural",
          points: 3
        },
        {
          id: "q5-classico",
          text: "Azul marinho, branco e bege",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/paleta-classica_z1c2up.webp",
          value: "classico",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 3
        },
        {
          id: "q5-dramatico",
          text: "Preto, branco e vermelho",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/paleta-dramatica_z1c2up.webp",
          value: "dramatico",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 3
        },
        {
          id: "q5-romantico",
          text: "Rosa, lavanda e tons suaves",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/paleta-romantica_z1c2up.webp",
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

export default getStep06Template;

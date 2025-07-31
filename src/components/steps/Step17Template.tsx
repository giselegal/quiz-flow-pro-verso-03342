import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 17 - QUESTÃO ESTRATÉGICA 5
export const getStep17Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 81,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'QUAL ORÇAMENTO VOCÊ COSTUMA DESTINAR PARA ROUPAS POR MÊS?',
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
      content: 'Questão 17 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'strategic-10',
      options: [
        { 
          id: "strategic-10-1", 
          text: "Até R$ 200", 
          value: "strategic-10-1", 
          category: "Strategic", 
          styleCategory: "Strategic", 
          points: 0 
        },
        { 
          id: "strategic-10-2", 
          text: "De R$ 200 a R$ 500", 
          value: "strategic-10-2", 
          category: "Strategic", 
          styleCategory: "Strategic", 
          points: 0 
        },
        { 
          id: "strategic-10-3", 
          text: "De R$ 500 a R$ 1.000", 
          value: "strategic-10-3", 
          category: "Strategic", 
          styleCategory: "Strategic", 
          points: 0 
        },
        { 
          id: "strategic-10-4", 
          text: "Mais de R$ 1.000", 
          value: "strategic-10-4", 
          category: "Strategic", 
          styleCategory: "Strategic", 
          points: 0 
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

export { getStep17Template };
export default getStep17Template;

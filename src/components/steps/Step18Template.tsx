import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 18 - QUESTÃO ESTRATÉGICA 6
export const getStep18Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 86,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'O QUE VOCÊ MAIS DESEJA ALCANÇAR COM SEU NOVO ESTILO?',
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
      content: 'Questão 18 de 21',
      fontSize: 'text-sm',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24
    }
  },
  {
    type: 'options-grid',
    properties: {
      questionId: 'strategic-11',
      options: [
        { 
          id: "strategic-11-1", 
          text: "Mais confiança e autoestima no dia a dia", 
          value: "strategic-11-1", 
          category: "Strategic", 
          styleCategory: "Strategic", 
          points: 0 
        },
        { 
          id: "strategic-11-2", 
          text: "Praticidade e facilidade para me vestir", 
          value: "strategic-11-2", 
          category: "Strategic", 
          styleCategory: "Strategic", 
          points: 0 
        },
        { 
          id: "strategic-11-3", 
          text: "Uma imagem mais profissional e elegante", 
          value: "strategic-11-3", 
          category: "Strategic", 
          styleCategory: "Strategic", 
          points: 0 
        },
        { 
          id: "strategic-11-4", 
          text: "Expressar melhor minha personalidade através das roupas", 
          value: "strategic-11-4", 
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

export default getStep18Template;

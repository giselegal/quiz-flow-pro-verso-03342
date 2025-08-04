import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 15 - QUESTÃO ESTRATÉGICA 3
export const getStep15Template = () => [
  {
    id: "step15-header",
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 71,
      progressMax: 100,
      showBackButton: true,
    },
  },
  {
    id: "step15-title",
    type: "heading",
    properties: {
      content:
        'QUANDO VOCÊ TEM UM COMPROMISSO, COM QUE FREQUÊNCIA BATE AQUELE PENSAMENTO: "COM QUE ROUPA EU VOU?"',
      level: "h2",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 8,
    },
  },
  {
    id: "step15-text",
    type: "text",
    properties: {
      content: "Questão 15 de 21",
      fontSize: "text-sm",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 24,
    },
  },
  {
    id: "step15-options",
    type: "options-grid",
    properties: {
      questionId: "strategic-8",
      options: [
        {
          id: "strategic-8-1",
          text: "Sempre! É uma batalha diária, não importa a ocasião.",
          value: "strategic-8-1",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-8-2",
          text: "Quase sempre, principalmente para eventos importantes ou quando quero causar uma boa impressão.",
          value: "strategic-8-2",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-8-3",
          text: "Às vezes, quando estou sem criatividade ou inspiração.",
          value: "strategic-8-3",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-8-4",
          text: "Raramente, meu guarda-roupa já é bem organizado e prático.",
          value: "strategic-8-4",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
      ],
      columns: 1,
      showImages: false,
      multipleSelection: false,
      maxSelections: 1,
      minSelections: 1,
      validationMessage: "Selecione uma opção",
      gridGap: 12,
      responsiveColumns: true,
      autoAdvanceOnComplete: false,
      autoAdvanceDelay: 800,
      requiredSelections: 1,
      enableButtonOnlyWhenValid: true,
      showValidationFeedback: true,
    },
  },
  {
    id: "step15-button",
    type: "button",
    properties: {
      text: "Continuar",
      variant: "primary",
      size: "large",
      fullWidth: true,
      backgroundColor: "#B89B7A",
      textColor: "#ffffff",
      disabled: true,
      requiresValidSelection: true,
    },
  },
];

export default getStep15Template;

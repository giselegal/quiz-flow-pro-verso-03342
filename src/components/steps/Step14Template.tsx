import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 14 - QUESTÃO ESTRATÉGICA 2
export const getStep14Template = () => [
  {
    id: "step14-header",
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 67,
      progressMax: 100,
      showBackButton: true,
    },
  },
  {
    id: "step14-question-title",
    type: "heading",
    properties: {
      content: "QUAL É A SUA PRINCIPAL DIFICULDADE NA HORA DE SE ARRUMAR PARA SAIR?",
      level: "h2",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 8,
    },
  },
  {
    id: "step14-question-counter",
    type: "text",
    properties: {
      content: "Questão 14 de 21",
      fontSize: "text-sm",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 24,
    },
  },
  {
    id: "step14-final-options",
    type: "options-grid",
    properties: {
      questionId: "strategic-2",
      options: [
        {
          id: "strategic-2-1",
          text: "Demoro uma eternidade pra escolher e no fim nem gosto do que visto.",
          value: "strategic-2-1",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-2-2",
          text: "Meu guarda-roupa está lotado, mas sinto que nunca tenho NADA pra vestir.",
          value: "strategic-2-2",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-2-3",
          text: "Compro roupas por impulso que acabam paradas no armário, sem uso.",
          value: "strategic-2-3",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-2-4",
          text: "Não consigo passar a imagem que eu gostaria através das minhas roupas.",
          value: "strategic-2-4",
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
    id: "step14-continue-button",
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

export default getStep14Template;

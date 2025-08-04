import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 13 - QUESTÃO ESTRATÉGICA 1
export const getStep13Template = () => [
  {
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 62,
      progressMax: 100,
      showBackButton: true,
    },
  },
  {
    type: "heading",
    properties: {
      content: "QUANDO VOCÊ OLHA PARA O SEU GUARDA-ROUPA, QUAL DESSAS FRASES TE VEM A CABEÇA?",
      level: "h2",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 8,
    },
  },
  {
    type: "text",
    properties: {
      content: "Questão 13 de 21",
      fontSize: "text-sm",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 24,
    },
  },
  {
    type: "options-grid",
    properties: {
      questionId: "strategic-1",
      options: [
        {
          id: "strategic-1-1",
          text: "Me sinto totalmente perdida, sem saber o que combina comigo.",
          value: "strategic-1-1",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-1-2",
          text: "Tenho algumas peças que gosto, mas montar um look completo é sempre um desafio.",
          value: "strategic-1-2",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-1-3",
          text: "Até conheço meu estilo, mas sinto que falta um 'toque' para realmente me destacar.",
          value: "strategic-1-3",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-1-4",
          text: "Estou bem satisfeita com meu estilo, só busco umas inspirações novas.",
          value: "strategic-1-4",
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

export default getStep13Template;

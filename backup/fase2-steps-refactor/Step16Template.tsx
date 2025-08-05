import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 16 - QUESTÃO ESTRATÉGICA 4
export const getStep16Template = () => [
  {
    id: "step16-header",
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 76,
      progressMax: 100,
      showBackButton: true,
    },
  },
  {
    id: "step16-question-title",
    type: "heading",
    properties: {
      content: "QUANDO VOCÊ PENSA EM INVESTIR EM ROUPAS NOVAS, CONSIDERA:",
      level: "h2",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 8,
    },
  },
  {
    id: "step16-question-counter",
    type: "text",
    properties: {
      content: "Questão 16 de 21",
      fontSize: "text-sm",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 24,
    },
  },
  {
    id: "step16-final-options",
    type: "options-grid",
    properties: {
      questionId: "strategic-9",
      options: [
        {
          id: "strategic-9-1",
          text: "Necessidade imediata (preciso de algo específico para um evento ou ocasião)",
          value: "strategic-9-1",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-9-2",
          text: "Qualidade e durabilidade das peças (prefiro investir em peças que durem)",
          value: "strategic-9-2",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-9-3",
          text: "Tendências da moda (gosto de estar sempre atualizada)",
          value: "strategic-9-3",
          category: "Strategic",
          styleCategory: "Strategic",
          points: 0,
        },
        {
          id: "strategic-9-4",
          text: "Versatilidade das peças (que combinem com o que já tenho)",
          value: "strategic-9-4",
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
    id: "step16-continue-button",
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

export default getStep16Template;

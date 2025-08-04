import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 9 - QUESTÃO 8: SAPATOS (REAL)
export const getStep09Template = () => [
  {
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 80,
      progressMax: 100,
      showBackButton: true,
    },
  },
  {
    type: "heading-inline",
    properties: {
      content: "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
      level: "h2",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 8,
    },
  },
  {
    type: "text-inline",
    properties: {
      content: "Questão 8 de 10",
      fontSize: "text-sm",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 24,
    },
  },
  {
    type: "options-grid",
    properties: {
      questionId: "q8",
      options: [
        {
          id: "8a",
          text: "Tênis nude casual e confortável",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp",
          value: "8a",
          category: "Natural",
          styleCategory: "Natural",
          points: 1,
        },
        {
          id: "8b",
          text: "Scarpin nude de salto baixo",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp",
          value: "8b",
          category: "Clássico",
          styleCategory: "Clássico",
          points: 1,
        },
        {
          id: "8c",
          text: "Sandália dourada com salto bloco",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp",
          value: "8c",
          category: "Contemporâneo",
          styleCategory: "Contemporâneo",
          points: 1,
        },
        {
          id: "8d",
          text: "Scarpin nude salto alto e fino",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp",
          value: "8d",
          category: "Elegante",
          styleCategory: "Elegante",
          points: 1,
        },
        {
          id: "8e",
          text: "Sandália anabela off white",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp",
          value: "8e",
          category: "Romântico",
          styleCategory: "Romântico",
          points: 1,
        },
        {
          id: "8f",
          text: "Sandália rosa de tiras finas",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp",
          value: "8f",
          category: "Sexy",
          styleCategory: "Sexy",
          points: 1,
        },
        {
          id: "8g",
          text: "Scarpin preto moderno com vinil transparente",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp",
          value: "8g",
          category: "Dramático",
          styleCategory: "Dramático",
          points: 1,
        },
        {
          id: "8h",
          text: "Scarpin colorido estampado",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp",
          value: "8h",
          category: "Criativo",
          styleCategory: "Criativo",
          points: 1,
        },
      ],
      columns: 2,
      showImages: true,
      imageSize: "large",
      multipleSelection: true,
      maxSelections: 3,
      minSelections: 1,
      validationMessage: "Selecione até 3 opções",
      gridGap: 16,
      responsiveColumns: true,
      autoAdvanceOnComplete: true,
      autoAdvanceDelay: 800,
      requiredSelections: 3,
      enableButtonOnlyWhenValid: true,
      showValidationFeedback: true,
    },
  },
  {
    type: "button-inline",
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

export default getStep09Template;

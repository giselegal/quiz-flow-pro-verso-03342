import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 12 - TRANSIÇÃO PRINCIPAL
export const getStep12Template = () => [
  {
    id: "step12-header",
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 60,
      progressMax: 100,
      showBackButton: true,
    },
  },
  {
    id: "step12-title",
    type: "heading",
    properties: {
      content: "Agora vamos conhecer você melhor",
      level: "h2",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 16,
    },
  },
  {
    id: "step12-text",
    type: "text",
    properties: {
      content:
        "Suas escolhas até agora já revelam muito sobre seu estilo. Agora vamos aprofundar para criar um perfil ainda mais preciso.",
      fontSize: "text-lg",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 32,
    },
  },
  {
    id: "step12-button",
    type: "button",
    properties: {
      text: "Continuar Análise",
      variant: "primary",
      size: "large",
      fullWidth: true,
      backgroundColor: "#B89B7A",
      textColor: "#ffffff",
    },
  },
];

export default getStep12Template;

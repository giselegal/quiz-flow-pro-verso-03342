import React from "react";

// Template para a Etapa 21
export const getStep21Template = () => [
  {
    id: "step21-header",
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 100,
      progressMax: 100,
      showBackButton: true,
    },
  },
  {
    id: "step21-title",
    type: "heading",
    properties: {
      content: "Etapa 21 - Template em Desenvolvimento",
      level: "h2",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 8,
    },
  },
  {
    id: "step21-text",
    type: "text",
    properties: {
      content: "Este template será personalizado em breve",
      fontSize: "text-lg",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 32,
    },
  },
  {
    id: "step21-button",
    type: "button",
    properties: {
      text: "Continuar",
      variant: "primary",
      size: "large",
      fullWidth: true,
      backgroundColor: "#B89B7A",
      textColor: "#ffffff",
    },
  },
];

export default getStep21Template;

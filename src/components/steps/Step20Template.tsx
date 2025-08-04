import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 20 - RESULTADO
export const getStep20Template = () => [
  {
    id: "step20-header",
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 100,
      progressMax: 100,
      showBackButton: false,
    },
  },
  {
    id: "step20-result-header",
    type: "result-header",
    properties: {
      title: "Seu Resultado Personalizado",
      subtitle: "Baseado nas suas 18 respostas",
      showConfetti: true,
    },
  },
  {
    id: "step20-result-card",
    type: "result-card",
    properties: {
      styleType: "Contemporâneo Elegante",
      description: "Você tem um estilo que combina modernidade com sofisticação",
      showImage: true,
      showDescription: true,
      showCharacteristics: true,
    },
  },
  {
    id: "step20-button",
    type: "button",
    properties: {
      text: "Ver Oferta Especial",
      variant: "primary",
      size: "large",
      fullWidth: true,
      backgroundColor: "#B89B7A",
      textColor: "#ffffff",
    },
  },
];

export default getStep20Template;

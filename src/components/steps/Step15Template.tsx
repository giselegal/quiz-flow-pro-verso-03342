import React from "react";

export interface Step15Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step15 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step15Props) => {
  return <div className="step-15">{/* Conteúdo da Etapa 15 renderizado aqui */}</div>;
};
// 🎯 TEMPLATE DE BLOCOS DA ETAPA 15 - undefined
export const getStep15Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "progress-header-step15",
      type: "quiz-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 75,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: "15 de 21",
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step15",
      type: "decorative-bar-inline",
      properties: {
        width: "100%",
        height: 4,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 3,
        marginTop: 8,
        marginBottom: 32,
        showShadow: true,
      },
    },

    // 📱 TÍTULO DA TRANSIÇÃO
    {
      id: "transition-title-step15",
      type: "text-inline",
      properties: {
        content: "undefined",
        fontSize: "text-3xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 24,
        lineHeight: "1.2",
      },
    },

    // 🖼️ IMAGEM DE LOADING/TRANSIÇÃO
    {
      id: "transition-image-step15",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838160/20250509_2151_Profiss%C3%A3o_e_Carreira_simple_compose_01jtvtecg7bmy8r4q9b6vhx3py_ktdzhz.webp",
        alt: "undefined",
        width: 500,
        height: 350,
        className: "object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg",
        textAlign: "text-center",
        marginBottom: 32,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: "transition-description-step15",
      type: "text-inline",
      properties: {
        content: "undefined",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 40,
        lineHeight: "1.6",
      },
    },
  ];
};

export default Step15;

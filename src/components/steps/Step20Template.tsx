import React from "react";

export interface Step20Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step20 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step20Props) => {
  return <div className="step-20">{/* Conteúdo da Etapa 20 renderizado aqui */}</div>;
};
// 🎯 TEMPLATE DE BLOCOS DA ETAPA 20 - Seu Resultado Está Pronto!
export const getStep20Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "progress-header-step20",
      type: "quiz-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 100,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: "20 de 21",
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step20",
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
      id: "transition-title-step20",
      type: "text-inline",
      properties: {
        content: "Seu Resultado Está Pronto!",
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
      id: "transition-image-step20",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838175/20250509_2156_Resultado_Final_simple_compose_01jtvtjm8wn0q6r9p3b7k2mvcl_hdz8kt.webp",
        alt: "Seu Resultado Está Pronto!",
        width: 500,
        height: 350,
        className: "object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg",
        textAlign: "text-center",
        marginBottom: 32,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: "transition-description-step20",
      type: "text-inline",
      properties: {
        content:
          "Parabéns! Descobrimos seu estilo predominante e criamos um guia personalizado para você.",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 40,
        lineHeight: "1.6",
      },
    },
  ];
};

export default Step20;

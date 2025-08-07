import React from "react";

export interface Step21Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step21 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step21Props) => {
  return <div className="step-21">{/* Conteúdo da Etapa 21 renderizado aqui */}</div>;
};
// 🎯 TEMPLATE DE BLOCOS DA ETAPA 21 - Transforme seu Guarda-Roupa Agora!
export const getStep21Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "progress-header-step21",
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
        stepNumber: "21 de 21",
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step21",
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
      id: "transition-title-step21",
      type: "text-inline",
      properties: {
        content: "Transforme seu Guarda-Roupa Agora!",
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
      id: "transition-image-step21",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838178/20250509_2157_Oferta_Especial_simple_compose_01jtvtkoxf9n4q6r7bnz5z4mvd_pnqrsm.webp",
        alt: "Transforme seu Guarda-Roupa Agora!",
        width: 500,
        height: 350,
        className: "object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg",
        textAlign: "text-center",
        marginBottom: 32,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: "transition-description-step21",
      type: "text-inline",
      properties: {
        content:
          "Com base no seu estilo, temos uma oferta especial para você começar sua transformação hoje mesmo.",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 40,
        lineHeight: "1.6",
      },
    },
  ];
};

export default Step21;

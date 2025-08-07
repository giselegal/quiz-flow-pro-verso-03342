import React from "react";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Step12Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step12 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step12Props) => {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  return <div className="step-12">{/* Conteúdo da Etapa 12 renderizado aqui */}</div>;
};
// 🎯 TEMPLATE DE BLOCOS DA ETAPA 12 - Analisando seu Perfil...
export const getStep12Template = () => {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "progress-header-step12",
      type: "quiz-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 60,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: "12 de 21",
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step12",
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
      id: "transition-title-step12",
      type: "text-inline",
      properties: {
        content: "Analisando seu Perfil...",
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
      id: "transition-image-step12",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838151/20250509_2148_An%C3%A1lise_de_Dados_simple_compose_01jtvtb6j93t4r2hvdza0n0fqm_axmjjx.webp",
        alt: "Analisando seu Perfil...",
        width: 500,
        height: 350,
        className: "object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg",
        textAlign: "text-center",
        marginBottom: 32,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: "transition-description-step12",
      type: "text-inline",
      properties: {
        content: "Estamos processando suas respostas para identificar seu estilo único.",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 40,
        lineHeight: "1.6",
      },
    },
  ];
};

export default Step12;

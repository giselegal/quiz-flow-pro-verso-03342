// 🎯 TEMPLATE DE BLOCOS DA ETAPA 17
import React from "react";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

export const getStep17Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "progress-header-step17",
      type: "quiz-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 85,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: "17 de 21",
        spacing: "small",
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step17",
      type: "decorative-bar-inline",
      properties: {
        width: "100%",
        height: 4,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 3,
        marginTop: 0,
        marginBottom: 32,
        showShadow: true,
        spacing: "small",
      },
    },

    // 📱 TÍTULO DA TRANSIÇÃO
    {
      id: "transition-title-step17",
      type: "text-inline",
      properties: {
        content: "Finalizando sua Análise...",
        fontSize: "text-3xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 24,
        lineHeight: "1.2",
        spacing: "small",
        marginTop: 0,
      },
    },

    // 🖼️ IMAGEM DE LOADING/TRANSIÇÃO
    {
      id: "transition-image-step17",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838166/20250509_2153_Finaliza%C3%A7%C3%A3o_simple_compose_01jtvtggn0nvy3q7bnz5z4mvcj_q4bgjl.webp",
        alt: "Finalizando sua Análise...",
        width: 500,
        height: 350,
        className: "object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg",
        textAlign: "text-center",
        marginBottom: 32,
        spacing: "small",
        marginTop: 0,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: "transition-description-step17",
      type: "text-inline",
      properties: {
        content: "Estamos cruzando todos os dados para criar seu perfil de estilo personalizado.",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 40,
        lineHeight: "1.6",
        spacing: "small",
        marginTop: 0,
      },
    },
  ];
};


// 🎯 TEMPLATE DE BLOCOS DA ETAPA 18
import React from "react";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

export const getStep18Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "progress-header-step18",
      type: "quiz-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 90,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: "18 de 21",
        spacing: "small",
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step18",
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
      id: "transition-title-step18",
      type: "text-inline",
      properties: {
        content: "Calculando seu Resultado...",
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
      id: "transition-image-step18",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838169/20250509_2154_C%C3%A1lculo_Final_simple_compose_01jtvthhq8wcbj2q6r9f8g3jrm_dqbdpt.webp",
        alt: "Calculando seu Resultado...",
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
      id: "transition-description-step18",
      type: "text-inline",
      properties: {
        content: "Seus dados estão sendo processados por nosso algoritmo de estilo. Aguarde...",
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

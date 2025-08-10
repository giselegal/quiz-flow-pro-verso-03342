// 🎯 TEMPLATE DE BLOCOS DA ETAPA 09
import React from "react";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

export const getStep09Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "quiz-header-step09",
      type: "quiz-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 45,
        progressMax: 100,
        showBackButton: true,
        showProgress: true,
        stepNumber: "9 de 21",
        spacing: "small",
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step09",
      type: "decorative-bar-inline",
      properties: {
        width: "100%",
        height: 3,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 2,
        marginTop: 0,
        marginBottom: 20,
        showShadow: true,
        spacing: "small",
      },
    },

    // 📝 PERGUNTA PRINCIPAL
    {
      id: "question-text-step09",
      type: "text-inline",
      properties: {
        content: "Seus calçados preferidos para o dia a dia:",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 24,
        lineHeight: "1.3",
        spacing: "small",
        marginTop: 0,
      },
    },

    // 🖼️ IMAGEM DA PERGUNTA
    {
      id: "question-image-step09",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838142/20250509_2145_Cal%C3%A7ados_e_Conforto_simple_compose_01jtvt805qp6r9vbhm0ny4qp3g_lf4grr.webp",
        alt: "Imagem da pergunta 9",
        width: 400,
        height: 300,
        className: "object-cover w-full max-w-md h-64 rounded-lg mx-auto shadow-md",
        textAlign: "text-center",
        marginBottom: 24,
        spacing: "small",
        marginTop: 0,
      },
    },

    // 🎯 OPÇÕES DE RESPOSTA

    {
      id: "option-1-step09",
      type: "quiz-option",
      properties: {
        optionId: "salto-alto",
        label: "Salto alto - sempre elegante",
        value: "salto-alto",
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 2,
          romantico: 3,
          minimalista: 1,
          boho: 1,
          spacing: "small",
          marginTop: 0,
          marginBottom: 0,
        },

        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },
    {
      id: "option-2-step09",
      type: "quiz-option",
      properties: {
        optionId: "tenis-estiloso",
        label: "Tênis estiloso e confortável",
        value: "tenis-estiloso",
        points: {
          elegante: 1,
          casual: 3,
          criativo: 2,
          classico: 1,
          romantico: 1,
          minimalista: 2,
          boho: 2,
          spacing: "small",
          marginTop: 0,
          marginBottom: 0,
        },

        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },
    {
      id: "option-3-step09",
      type: "quiz-option",
      properties: {
        optionId: "sapatilha-delicada",
        label: "Sapatilha delicada",
        value: "sapatilha-delicada",
        points: {
          elegante: 2,
          casual: 2,
          criativo: 1,
          classico: 3,
          romantico: 3,
          minimalista: 3,
          boho: 1,
          spacing: "small",
          marginTop: 0,
          marginBottom: 0,
        },

        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },
    {
      id: "option-4-step09",
      type: "quiz-option",
      properties: {
        optionId: "botas-personalizadas",
        label: "Botas ou sapatos com personalidade",
        value: "botas-personalizadas",
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 1,
          boho: 3,
          spacing: "small",
          marginTop: 0,
          marginBottom: 0,
        },

        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },

    // 🎯 BOTÃO CONTINUAR
    {
      id: "continue-button-step09",
      type: "button-inline",
      properties: {
        text: "Continuar →",
        variant: "primary",
        size: "large",
        fullWidth: true,
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        requiresSelection: true,
        textAlign: "text-center",
        borderRadius: "rounded-full",
        padding: "py-3 px-6",
        fontSize: "text-base",
        fontWeight: "font-semibold",
        marginTop: 24,
        disabled: true,
        spacing: "small",
        marginBottom: 0,
      },
    },
  ];
};

export default Step09;

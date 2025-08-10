// 🎯 TEMPLATE DE BLOCOS DA ETAPA 11
import React from "react";

export const getStep11Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "quiz-header-step11",
      type: "quiz-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 55,
        progressMax: 100,
        showBackButton: true,
        showProgress: true,
        stepNumber: "11 de 21",
        spacing: "small",
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step11",
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
      id: "question-text-step11",
      type: "text-inline",
      properties: {
        content: "No ambiente de trabalho, você se veste:",
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
      id: "question-image-step11",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838148/20250509_2147_Trabalho_e_Profissionalismo_simple_compose_01jtvta4gb3qhd4d6v3xr3jvtw_wnpshv.webp",
        alt: "Imagem da pergunta 11",
        width: 400,
        height: 300,
        className:
          "object-cover w-full max-w-md h-64 rounded-lg mx-auto shadow-md",
        textAlign: "text-center",
        marginBottom: 24,
        spacing: "small",
        marginTop: 0,
      },
    },

    // 🎯 OPÇÕES DE RESPOSTA

    {
      id: "option-1-step11",
      type: "quiz-option",
      properties: {
        optionId: "executiva-formal",
        label: "Executiva e formal",
        value: "executiva-formal",
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 2,
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
      id: "option-2-step11",
      type: "quiz-option",
      properties: {
        optionId: "smart-casual",
        label: "Smart casual - elegante mas descontraída",
        value: "smart-casual",
        points: {
          elegante: 2,
          casual: 2,
          criativo: 2,
          classico: 2,
          romantico: 2,
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
      id: "option-3-step11",
      type: "quiz-option",
      properties: {
        optionId: "feminina-profissional",
        label: "Feminina e profissional",
        value: "feminina-profissional",
        points: {
          elegante: 2,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 3,
          minimalista: 2,
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
      id: "option-4-step11",
      type: "quiz-option",
      properties: {
        optionId: "criativa-autentica",
        label: "Criativa e autêntica",
        value: "criativa-autentica",
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
      id: "continue-button-step11",
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

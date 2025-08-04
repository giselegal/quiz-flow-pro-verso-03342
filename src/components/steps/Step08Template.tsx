import React from "react";

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 8 - QUESTÃO 7: CALÇA FAVORITA (REAL)
export const getStep08Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step08-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 70,
        progressMax: 100,
        showBackButton: true,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step08-title",
      type: "heading",
      properties: {
        content: "QUAL SUA CALÇA FAVORITA?",
        level: "h2",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 8,
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step08-text",
      type: "text",
      properties: {
        content: "Questão 7 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: "step08-options",
      type: "options-grid",
      properties: {
        questionId: "q7",
        options: [
          {
            id: "7a",
            text: "Calça fluida acetinada bege",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp",
            value: "7a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1,
          },
          {
            id: "7b",
            text: "Calça de alfaiataria cinza",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp",
            value: "7b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
          },
          {
            id: "7c",
            text: "Jeans reto e básico",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp",
            value: "7c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1,
          },
          {
            id: "7d",
            text: "Calça reta bege de tecido",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp",
            value: "7d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1,
          },
          {
            id: "7e",
            text: "Calça ampla rosa alfaiatada",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp",
            value: "7e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1,
          },
          {
            id: "7f",
            text: "Legging preta de couro",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp",
            value: "7f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1,
          },
          {
            id: "7g",
            text: "Calça reta preta de couro",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp",
            value: "7g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1,
          },
          {
            id: "7h",
            text: "Calça estampada floral leve e ampla",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp",
            value: "7h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1,
          },
        ],
        columns: 2,
        showImages: true,
        imageSize: "large",
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: "Selecione até 3 opções",
        gridGap: 16,
        responsiveColumns: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 800,
        requiredSelections: 3,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
      },
    },

    // 🔘 BOTÃO DE NAVEGAÇÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step08-button",
      type: "button",
      properties: {
        text: "Continuar",
        variant: "primary",
        size: "large",
        fullWidth: true,
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        disabled: true,
        requiresValidSelection: true,
      },
    },
  ];
};

export default getStep08Template;

import React from "react";

export interface Step02Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step02 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step02Props) => {
  return <div className="step-02">{/* Conteúdo da Etapa 2 renderizado aqui */}</div>;
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 2 - QUESTÃO 1: TIPO DE ROUPA FAVORITA
export const getStep02Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step02-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 10,
        progressMax: 100,
        showBackButton: true,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-question-title",
      type: "heading",
      properties: {
        content: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
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
      id: "step02-question-counter",
      type: "text",
      properties: {
        content: "Questão 1 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: "step02-clothing-options",
      type: "options-grid",
      properties: {
        questionId: "q1",
        options: [
          {
            id: "1a",
            text: "Conforto, leveza e praticidade no vestir",
            value: "1a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
          },
          {
            id: "1b",
            text: "Discrição, caimento clássico e sobriedade",
            value: "1b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
          },
          {
            id: "1c",
            text: "Praticidade com um toque de estilo atual",
            value: "1c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
          },
          {
            id: "1d",
            text: "Sofisticação em looks estruturados e refinados",
            value: "1d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_mjrfcl.webp",
          },
          {
            id: "1e",
            text: "Delicadeza em tecidos suaves e fluidos",
            value: "1e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
          },
          {
            id: "1f",
            text: "Sensualidade com destaque para o corpo",
            value: "1f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
          },
          {
            id: "1g",
            text: "Impacto visual com peças estruturadas e assimétricas",
            value: "1g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
          },
          {
            id: "1h",
            text: "Mix criativo com formas ousadas e originais",
            value: "1h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
          },
        ],
        columns: 2,
        showImages: true,
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
      id: "step02-continue-button",
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

export default getStep02Template;

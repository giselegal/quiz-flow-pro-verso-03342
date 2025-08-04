import React from "react";

export interface Step07Question06Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step07Question06: React.FC<Step07Question06Props> = ({
  onNext,
  onPrevious,
  onBlockAdd,
}) => {
  return <div className="step-07-question-06">{/* Conteúdo da Etapa 7 renderizado aqui */}</div>;
};

// �� TEMPLATE DE BLOCOS DA ETAPA 7 - QUESTÃO 6: QUAL CASACO É SEU FAVORITO?
export const getStep07Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step07-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 60,
        progressMax: 100,
        showBackButton: true,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step07-question-title",
      type: "heading",
      properties: {
        content: "QUAL CASACO É SEU FAVORITO?",
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
      id: "step07-question-counter",
      type: "text",
      properties: {
        content: "Questão 6 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: "step07-jacket-options",
      type: "options-grid",
      properties: {
        questionId: "q6",
        options: [
          {
            id: "6a",
            text: "Casaco Clássico",
            value: "6a",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911571/CASACO_CLASSICO_MARROM_z9vhq3.webp",
          },
          {
            id: "6b",
            text: "Casaco Moderno",
            value: "6b",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911571/CASACO_MODERNO_BEGE_xlk4v7.webp",
          },
          {
            id: "6c",
            text: "Casaco Elegante",
            value: "6c",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911571/CASACO_ELEGANTE_CARAMELO_j1p8hz.webp",
          },
          {
            id: "6d",
            text: "Casaco Casual",
            value: "6d",
            category: "Natural",
            styleCategory: "Natural",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911571/CASACO_CASUAL_DOURADO_w8qy0x.webp",
          },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: false,
        maxSelections: 1,
        minSelections: 1,
        validationMessage: "Selecione uma opção",
        gridGap: 16,
        responsiveColumns: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 800,
        requiredSelections: 1,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
      },
    },

    // 🔘 BOTÃO DE NAVEGAÇÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step07-continue-button",
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

export default Step07Question06;

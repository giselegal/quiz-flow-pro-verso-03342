import React from "react";

export interface Step06Question05Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step06Question05: React.FC<Step06Question05Props> = ({
  onNext,
  onPrevious,
  onBlockAdd,
}) => {
  return <div className="step-06-question-05">{/* Conteúdo da Etapa 6 renderizado aqui */}</div>;
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 6 - QUESTÃO 5: QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
export const getStep06Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 50,
        progressMax: 100,
        showBackButton: true,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      type: "heading",
      properties: {
        content: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
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
      type: "text",
      properties: {
        content: "Questão 5 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      type: "options-grid",
      properties: {
        questionId: "q5",
        options: [
          {
            id: "5a",
            text: "Cardigã bege confortável e casual",
            value: "5a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp",
          },
          {
            id: "5b",
            text: "Blazer clássico e elegante",
            value: "5b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735374/30_lbfjk5.webp",
          },
          {
            id: "5c",
            text: "Blazer moderno e atual",
            value: "5c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735375/31_d6xo3f.webp",
          },
          {
            id: "5d",
            text: "Casaco elegante e sofisticado",
            value: "5d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735376/32_dxhxon.webp",
          },
          {
            id: "5e",
            text: "Casaco rosa romântico e delicado",
            value: "5e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_ejhsra.webp",
          },
          {
            id: "5f",
            text: "Jaqueta vinho de couro estilosa",
            value: "5f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp",
          },
          {
            id: "5g",
            text: "Jaqueta preta estilo rocker",
            value: "5g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp",
          },
          {
            id: "5h",
            text: "Casaco estampado criativo e colorido",
            value: "5h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp",
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

export default Step06Question05;

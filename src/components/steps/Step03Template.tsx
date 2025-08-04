import React from "react";

export interface Step03Question02Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step03Question02: React.FC<Step03Question02Props> = ({
  onNext,
  onPrevious,
  onBlockAdd,
}) => {
  return <div className="step-03-question-02">{/* Conteúdo da Etapa 3 renderizado aqui */}</div>;
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 3 - QUESTÃO 2: PERSONALIDADE (REAL)
export const getStep03Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step03-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 20,
        progressMax: 100,
        showBackButton: true,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step03-title",
      type: "heading",
      properties: {
        content: "RESUMA A SUA PERSONALIDADE:",
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
      id: "step03-text",
      type: "text",
      properties: {
        content: "Questão 2 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: "step03-options",
      type: "options-grid",
      properties: {
        questionId: "q2",
        options: [
          {
            id: "2a",
            text: "Informal, espontânea, alegre, essencialista",
            value: "2a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1,
          },
          {
            id: "2b",
            text: "Conservadora, séria, organizada",
            value: "2b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
          },
          {
            id: "2c",
            text: "Informada, ativa, prática",
            value: "2c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1,
          },
          {
            id: "2d",
            text: "Exigente, sofisticada, seletiva",
            value: "2d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1,
          },
          {
            id: "2e",
            text: "Feminina, meiga, delicada, sensível",
            value: "2e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1,
          },
          {
            id: "2f",
            text: "Glamorosa, vaidosa, sensual",
            value: "2f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1,
          },
          {
            id: "2g",
            text: "Cosmopolita, moderna e audaciosa",
            value: "2g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1,
          },
          {
            id: "2h",
            text: "Exótica, aventureira, livre",
            value: "2h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1,
          },
        ],
        columns: 1,
        showImages: false,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: "Selecione até 3 opções",
        gridGap: 12,
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
      id: "step03-button",
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

export default Step03Question02;

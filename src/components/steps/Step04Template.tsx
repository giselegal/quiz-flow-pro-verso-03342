import React from "react";

export interface Step04TemplateProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step04Template: React.FC<Step04TemplateProps> = ({
  onNext,
  onPrevious,
  onBlockAdd,
}) => {
  return <div className="step-04-template">{/* Conteúdo da Etapa 4 renderizado aqui */}</div>;
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 4 - QUESTÃO 3: QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
export const getStep04Template = () => {
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
        progressValue: 30,
        progressMax: 100,
        showBackButton: true,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      type: "heading",
      properties: {
        content: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
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
        content: "Questão 3 de 10",
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
        questionId: "q3",
        options: [
          {
            id: "3a",
            text: "Visual leve, despojado e natural",
            value: "3a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
          },
          {
            id: "3b",
            text: "Visual clássico e tradicional",
            value: "3b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp",
          },
          {
            id: "3c",
            text: "Visual casual com toque atual",
            value: "3c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp",
          },
          {
            id: "3d",
            text: "Visual refinado e imponente",
            value: "3d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp",
          },
          {
            id: "3e",
            text: "Visual romântico, feminino e delicado",
            value: "3e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp",
          },
          {
            id: "3f",
            text: "Visual sensual, com saia justa e decote",
            value: "3f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp",
          },
          {
            id: "3g",
            text: "Visual marcante e urbano (jeans + jaqueta)",
            value: "3g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp",
          },
          {
            id: "3h",
            text: "Visual criativo, colorido e ousado",
            value: "3h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp",
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

export default Step04Template;

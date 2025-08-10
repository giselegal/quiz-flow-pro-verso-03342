// 🎯 TEMPLATE DE BLOCOS DA ETAPA 04
export const getStep04Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step04-header",
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
        marginTop: 0,
        spacing: "small",
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step04-question-title",
      type: "text-inline",
      properties: {
        content: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
        level: "h2",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 0,
        marginTop: 0,
        spacing: "small",
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step04-question-counter",
      type: "text-inline",
      properties: {
        content: "Questão 3 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
        marginTop: 0,
        spacing: "small",
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: "step04-visual-options",
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
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
            marginTop: 0,
            spacing: "small",
            marginBottom: 0,
          },
          {
            id: "3b",
            text: "Visual clássico e tradicional",
            value: "3b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp",
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
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp",
          },
          {
            id: "3e",
            text: "Visual romântico, feminino e delicado",
            value: "3e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp",
          },
          {
            id: "3f",
            text: "Visual sensual, com saia justa e decote",
            value: "3f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp",
          },
          {
            id: "3g",
            text: "Visual marcante e urbano (jeans + jaqueta)",
            value: "3g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp",
          },
          {
            id: "3h",
            text: "Visual criativo, colorido e ousado",
            value: "3h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp",
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
        autoAdvanceDelay: 0,
        requiredSelections: 3,
        enableButtonOnlyWhenValid: false,
        instantActivation: true,
        showValidationFeedback: true,
      },
    },
    // 🔘 BOTÃO DE NAVEGAÇÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step04-continue-button",
      type: "button-inline",
      properties: {
        text: "Continuar",
        variant: "primary",
        size: "large",
        fullWidth: true,
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        disabled: true,
        requiresValidSelection: true,
        marginTop: 0,
        spacing: "small",
        marginBottom: 0,
      },
    },
  ];
};

export default getStep04Template;

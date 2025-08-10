// 🎯 TEMPLATE DE BLOCOS DA ETAPA 07
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
        progressValue: 35,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: "small",
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step07-question-title",
      type: "text-inline",
      properties: {
        content: "QUAL CASACO É SEU FAVORITO?",
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
      id: "step07-question-counter",
      type: "text-inline",
      properties: {
        content: "Questão 6 de 10",
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
            marginTop: 0,
            spacing: "small",
            marginBottom: 0,
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
        autoAdvanceDelay: 0,
        requiredSelections: 1,
        enableButtonOnlyWhenValid: false,
        instantActivation: true,
        showValidationFeedback: true,
      },
    },

    // 🔘 BOTÃO DE NAVEGAÇÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step07-continue-button",
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

export default getStep07Template;

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
        spacing: "small",
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-question-title",
      type: "text-inline",
      properties: {
        content: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 0,
        spacing: "small",
        marginTop: 0,
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-question-counter",
      type: "text-inline",
      properties: {
        content: "Questão 1 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
        spacing: "small",
        marginTop: 0,
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES OTIMIZADO (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: "step02-clothing-options",
      type: "options-grid",
      properties: {
        questionId: "q1",
        options: [
          {
            id: "1a",
            text: "Conforto, leveza e praticidade no vestir.",
            value: "1a",
            category: "Natural",
            styleCategory: "Natural",
            keyword: "natural",
            points: 1,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            spacing: "small",
            marginTop: 0,
            marginBottom: 0,
          },
          {
            id: "1b",
            text: "Discrição, caimento clássico e sobriedade.",
            value: "1b",
            category: "Clássico",
            styleCategory: "Clássico",
            keyword: "classico",
            points: 2,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
          },
          {
            id: "1c",
            text: "Praticidade com um toque de estilo atual.",
            value: "1c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            keyword: "contemporaneo",
            points: 2,
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
          },
          {
            id: "1d",
            text: "Elegância refinada, moderna e sem exageros.",
            value: "1d",
            category: "Elegante",
            styleCategory: "Elegante",
            keyword: "elegante",
            points: 3,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
          },
          {
            id: "1e",
            text: "Delicadeza em tecidos suaves e fluidos.",
            value: "1e",
            category: "Romântico",
            styleCategory: "Romântico",
            keyword: "romantico",
            points: 2,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
          },
          {
            id: "1f",
            text: "Sensualidade com destaque para o corpo.",
            value: "1f",
            category: "Sexy",
            styleCategory: "Sexy",
            keyword: "sexy",
            points: 3,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
          },
          {
            id: "1g",
            text: "Impacto visual com peças estruturadas e assimétricas.",
            value: "1g",
            category: "Dramático",
            styleCategory: "Dramático",
            keyword: "dramatico",
            points: 3,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
          },
          {
            id: "1h",
            text: "Mix criativo com formas ousadas e originais.",
            value: "1h",
            category: "Criativo",
            styleCategory: "Criativo",
            keyword: "criativo",
            points: 4,
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
          },
        ],

        // 🎨 LAYOUT RESPONSIVO OTIMIZADO - 256x256px
        columns: "2",
        responsiveColumns: true,
        gridGap: 8,

        // 🖼️ CONTROLES DE IMAGEM OTIMIZADOS
        showImages: true,
        imageSize: "256",
        imagePosition: "top",
        imageWidth: 256,
        imageHeight: 256,

        // 🎯 VALIDAÇÃO INTELIGENTE (1-3 SELEÇÕES)
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        requiredSelections: 1,

        // 📝 FEEDBACK OTIMIZADO
        validationMessage: "Selecione de 1 a 3 opções que representam você!",
        progressMessage: "{selected} de {maxSelections} selecionados",

        // 🚀 AUTO-ADVANCE CONFIGURÁVEL
        autoAdvanceOnComplete: false,
        autoAdvanceDelay: 0,
        instantActivation: true,

        // 🔘 ATIVAÇÃO INTELIGENTE DO BOTÃO
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,

        // 🎨 ESTILO VISUAL AVANÇADO
        selectionStyle: "border",
        selectedColor: "#B89B7A",
        hoverColor: "#D4C2A8",

        // 📊 UX MELHORADA
        showSelectionCount: true,
        allowDeselection: true,
        trackSelectionOrder: true,
      },
    },

    // 🔘 BOTÃO AVANÇADO OTIMIZADO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-continue-button",
      type: "button-inline",
      properties: {
        // 📝 TEXTO DINÂMICO
        text: "Próxima Questão →",
        textWhenDisabled: "Selecione pelo menos 1 opção",
        textWhenComplete: "Continuar",

        // 🎨 ESTILO AVANÇADO
        variant: "primary",
        size: "large",
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        disabledBackgroundColor: "#d1d5db",
        disabledTextColor: "#9ca3af",

        // 🎯 COMPORTAMENTO INTELIGENTE
        disabled: true,
        requiresValidInput: true,
        instantActivation: false,
        noDelay: false,

        // 📏 DIMENSÕES E LAYOUT
        fullWidth: true,
        padding: "py-3 px-6",
        borderRadius: "7px",
        fontSize: "text-base",
        fontWeight: "font-semibold",

        // ✨ EFEITOS VISUAIS
        shadowType: "small",
        shadowColor: "#B89B7A",
        effectType: "hover-lift",
        hoverOpacity: "75%",

        // 🚀 AUTO-ADVANCE
        autoAdvanceAfterActivation: false,
        autoAdvanceDelay: 0,

        // 📊 FEEDBACK
        showSuccessAnimation: false,
        showPulseWhenEnabled: false,
        quickFeedback: true,

        // 📱 RESPONSIVIDADE,
        marginTop: 24,
        textAlign: "text-center",
        spacing: "small",
        marginBottom: 0,
      },
    },
  ];
};

export default getStep02Template;

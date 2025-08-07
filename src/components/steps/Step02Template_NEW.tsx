export interface Step02Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step02 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step02Props) => {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  return <div className="step-02">{/* Conteúdo da Etapa 2 renderizado aqui */}</div>;
};

// 🎯 TEMPLATE OTIMIZADO DA ETAPA 2 - PREFERÊNCIAS DE VESTUÁRIO
export const Step02Template = {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  id: "step02-quiz-clothing-preferences",
  meta: {
    createdAt: "2024-01-10T12:00:00Z",
    version: "2.0",
  },
  properties: {
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: "16px",
    textColor: "#374151",
    padding: "24px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  layout: {
    type: "grid",
    gridTemplate: "auto 1fr auto",
    gap: "24px",
  },
  components: [
    {
      id: "quiz-intro-header",
      type: "text-inline",
      content: "Qual tipo de roupa você usa no trabalho?",
      properties: {
        fontSize: "28px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "12px",
        color: "#1f2937",
        lineHeight: "1.3",
        fontFamily: "Inter",
      },
    },
    {
      id: "question-context",
      type: "text-inline",
      content:
        "Escolha uma ou mais opções que mais se adequam ao seu dia a dia profissional. (Selecione de 1 a 3 opções)",
      properties: {
        fontSize: "18px",
        textAlign: "center",
        marginBottom: "32px",
        color: "#6b7280",
        lineHeight: "1.5",
        maxWidth: "600px",
        margin: "0 auto 32px auto",
      },
    },
    {
      id: "options-grid",
      type: "options-grid",
      properties: {
        multiple: true,
        minSelections: 1,
        maxSelections: 3,
        layout: "responsive",
        gridCols: 2,
        gridColsMobile: 1,
        gap: 8,
        className: "w-full h-full gap-2",
        options: [
          {
            id: "casual-confortavel",
            text: "Casual Confortável",
            value: "casual-confortavel",
            category: "clothing-style",
            keyword: "casual",
            points: 1,
            imageUrl: "/images/clothing/casual-confortavel.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
          {
            id: "executivo-elegante",
            text: "Executivo Elegante",
            value: "executivo-elegante",
            category: "clothing-style",
            keyword: "executivo",
            points: 2,
            imageUrl: "/images/clothing/executivo-elegante.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
          {
            id: "uniforme-padrao",
            text: "Uniforme Padrão",
            value: "uniforme-padrao",
            category: "clothing-style",
            keyword: "uniforme",
            points: 1,
            imageUrl: "/images/clothing/uniforme-padrao.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
          {
            id: "criativo-artistico",
            text: "Criativo Artístico",
            value: "criativo-artistico",
            category: "clothing-style",
            keyword: "criativo",
            points: 3,
            imageUrl: "/images/clothing/criativo-artistico.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
          {
            id: "esportivo-ativo",
            text: "Esportivo Ativo",
            value: "esportivo-ativo",
            category: "clothing-style",
            keyword: "esportivo",
            points: 2,
            imageUrl: "/images/clothing/esportivo-ativo.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
          {
            id: "formal-tradicional",
            text: "Formal Tradicional",
            value: "formal-tradicional",
            category: "clothing-style",
            keyword: "formal",
            points: 3,
            imageUrl: "/images/clothing/formal-tradicional.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
          {
            id: "moderno-inovador",
            text: "Moderno Inovador",
            value: "moderno-inovador",
            category: "clothing-style",
            keyword: "moderno",
            points: 4,
            imageUrl: "/images/clothing/moderno-inovador.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
          {
            id: "minimalista-clean",
            text: "Minimalista Clean",
            value: "minimalista-clean",
            category: "clothing-style",
            keyword: "minimalista",
            points: 2,
            imageUrl: "/images/clothing/minimalista-clean.webp",
            imageProps: {
              width: "256px",
              height: "256px",
              className: "w-full h-full object-cover rounded-lg",
            },
          },
        ],
        optionProps: {
          className:
            "flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer",
          selectedClassName: "border-blue-500 bg-blue-100",
          textClassName: "text-center font-medium text-gray-700 mt-3",
          imageClassName: "w-full h-full object-cover rounded-lg",
        },
      },
    },
    {
      id: "advance-button",
      type: "button-inline",
      content: "Avançar",
      properties: {
        backgroundColor: "#059669",
        color: "#ffffff",
        padding: "14px 36px",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "600",
        border: "none",
        cursor: "pointer",
        marginTop: "32px",
        disabled: true,
        disabledOpacity: 0.5,
        disabledBackgroundColor: "#d1d5db",
        disabledColor: "#9ca3af",
        hoverBackgroundColor: "#047857",
        activeScale: 0.98,
        transition: "all 0.2s ease",
        className: "px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200",
        enabledClassName:
          "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl",
        disabledClassName: "bg-gray-300 text-gray-500 cursor-not-allowed",
      },
      actions: {
        onClick: "nextStep",
      },
    },
  ],
  navigation: {
    nextStep: "step03-quiz-work-environment",
    autoAdvanceDelay: 0,
    instantActivation: true,
    condition: "hasMinimumSelections",
  },
  validation: {
    required: true,
    minSelections: 1,
    maxSelections: 3,
    errorMessage: "Selecione pelo menos 1 e no máximo 3 opções",
    successMessage: "Seleções válidas!",
  },
  analytics: {
    trackSelections: true,
    category: "quiz-clothing-preferences",
    trackInteractions: true,
  },
};

// 📊 FUNÇÃO ALTERNATIVA PARA COMPATIBILIDADE
export const getStep02Template = () => {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
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
      type: "text-inline",
      properties: {
        text: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
        fontSize: "2xl",
        fontWeight: "bold",
        textAlign: "center",
        textColor: "#432818",
        marginBottom: 8,
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-question-counter",
      type: "text-inline",
      properties: {
        text: "Questão 1 de 10",
        fontSize: "sm",
        textAlign: "center",
        textColor: "#6B7280",
        marginBottom: 24,
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
            id: "casual-confortavel",
            text: "Casual Confortável",
            value: "casual-confortavel",
            category: "clothing-style",
            keyword: "casual",
            points: 1,
            imageUrl: "/images/clothing/casual-confortavel.webp",
          },
          {
            id: "executivo-elegante",
            text: "Executivo Elegante",
            value: "executivo-elegante",
            category: "clothing-style",
            keyword: "executivo",
            points: 2,
            imageUrl: "/images/clothing/executivo-elegante.webp",
          },
          {
            id: "uniforme-padrao",
            text: "Uniforme Padrão",
            value: "uniforme-padrao",
            category: "clothing-style",
            keyword: "uniforme",
            points: 1,
            imageUrl: "/images/clothing/uniforme-padrao.webp",
          },
          {
            id: "criativo-artistico",
            text: "Criativo Artístico",
            value: "criativo-artistico",
            category: "clothing-style",
            keyword: "criativo",
            points: 3,
            imageUrl: "/images/clothing/criativo-artistico.webp",
          },
          {
            id: "esportivo-ativo",
            text: "Esportivo Ativo",
            value: "esportivo-ativo",
            category: "clothing-style",
            keyword: "esportivo",
            points: 2,
            imageUrl: "/images/clothing/esportivo-ativo.webp",
          },
          {
            id: "formal-tradicional",
            text: "Formal Tradicional",
            value: "formal-tradicional",
            category: "clothing-style",
            keyword: "formal",
            points: 3,
            imageUrl: "/images/clothing/formal-tradicional.webp",
          },
          {
            id: "moderno-inovador",
            text: "Moderno Inovador",
            value: "moderno-inovador",
            category: "clothing-style",
            keyword: "moderno",
            points: 4,
            imageUrl: "/images/clothing/moderno-inovador.webp",
          },
          {
            id: "minimalista-clean",
            text: "Minimalista Clean",
            value: "minimalista-clean",
            category: "clothing-style",
            keyword: "minimalista",
            points: 2,
            imageUrl: "/images/clothing/minimalista-clean.webp",
          },
        ],
        // 🎨 LAYOUT BASEADO EM IMAGENS - OTIMIZADO
        columns: 2, // 2 colunas para melhor visualização das imagens
        responsiveColumns: true, // Mobile sempre 1 coluna
        gridGap: 8, // gap-2 do Tailwind

        // 🖼️ CONTROLES DE IMAGEM OTIMIZADOS - 256x256px
        showImages: true,
        imageSize: "256px",
        imagePosition: "top",
        imageLayout: "vertical",
        imageProps: {
          width: "256px",
          height: "256px",
          className: "w-full h-full object-cover rounded-lg",
        },

        // 🎯 REGRAS DE SELEÇÃO - ATIVAÇÃO INSTANTÂNEA
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        requiredSelections: 1,

        // 📝 FEEDBACK OTIMIZADO
        validationMessage: "Selecione de 1 a 3 opções que representam você!",
        progressMessage: "{selected} de {maxSelections} selecionados",

        // 🚀 AUTOAVANÇO INSTANTÂNEO
        autoAdvanceOnComplete: false,
        autoAdvanceDelay: 0,
        instantActivation: true,
        showAutoAdvanceIndicator: false,

        // 🔘 ATIVAÇÃO INTELIGENTE DO BOTÃO
        enableButtonOnlyWhenValid: false,
        instantButtonActivation: true,
        showValidationFeedback: true,
        buttonTextWhenInvalid: "Selecione pelo menos 1 opção",
        buttonTextWhenValid: "Continuar →",

        // 🎨 ESTILO VISUAL APRIMORADO
        selectionStyle: "border",
        selectedColor: "#3b82f6",
        hoverColor: "#60a5fa",
        className: "w-full h-full gap-2",

        // 📊 UX MELHORADA
        showSelectionCount: true,
        allowDeselection: true,
        trackSelectionOrder: true,
      },
    },

    // 🔘 BOTÃO COM ATIVAÇÃO INSTANTÂNEA (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-continue-button",
      type: "button-inline",
      properties: {
        text: "Próxima Etapa",
        textWhenDisabled: "Selecione pelo menos 1 opção",
        textWhenComplete: "Continuar",

        // 🎨 ESTILO OTIMIZADO
        variant: "primary",
        size: "large",
        backgroundColor: "#059669",
        textColor: "#ffffff",
        disabledBackgroundColor: "#d1d5db",
        disabledTextColor: "#9ca3af",

        // ⚡ ATIVAÇÃO INSTANTÂNEA
        disabled: true,
        requiresValidInput: true,
        instantActivation: true,
        noDelay: true,

        // 🚀 AUTOAVANÇO IMEDIATO
        autoAdvanceAfterActivation: false,
        autoAdvanceDelay: 0,

        // 🎯 FEEDBACK MÍNIMO
        showSuccessAnimation: false,
        showPulseWhenEnabled: false,
        quickFeedback: true,
      },
    },
  ];
};

export default Step02Template;

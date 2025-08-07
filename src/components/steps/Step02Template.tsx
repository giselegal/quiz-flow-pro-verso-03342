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

    // 🖼️ IMAGEM ILUSTRATIVA (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-clothing-image",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/elegante-6_u1ghdr.jpg",
        alt: "Tipos de roupas e estilos",
        width: "75%",
        height: "300px",
        alignment: "center",
        borderRadius: 12,
        shadow: true,
        marginBottom: 32,
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
        // 🎨 LAYOUT BASEADO EM IMAGENS - REGRA: 2 COLUNAS COM IMAGENS, 1 COLUNA SEM IMAGENS
        columns: 2, // 2 colunas porque TEM IMAGENS
        responsiveColumns: true, // Mobile sempre 1 coluna
        gridGap: 20,

        // 🖼️ CONTROLES DE IMAGEM - OPÇÕES COM IMAGENS
        showImages: true, // TEM IMAGENS = 2 COLUNAS
        imageSize: "medium",
        imagePosition: "top",
        imageLayout: "vertical",

        // 🎯 REGRAS DE SELEÇÃO - ATIVAÇÃO INSTANTÂNEA
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        requiredSelections: 3,

        // 📝 FEEDBACK OTIMIZADO
        validationMessage: "Escolha até 3 estilos que mais combinam com você",
        progressMessage: "{selected} de {required} selecionados",

        // 🚀 AUTOAVANÇO INSTANTÂNEO APÓS COMPLETAR
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 0, // INSTANTÂNEO após última seleção
        instantActivation: true, // Botão ativa na hora
        showAutoAdvanceIndicator: false, // Sem indicador pois é instantâneo

        // 🔘 ATIVAÇÃO IMEDIATA DO BOTÃO
        enableButtonOnlyWhenValid: false,
        instantButtonActivation: true, // Ativa assim que completar
        showValidationFeedback: true,
        buttonTextWhenInvalid: "Selecione 3 estilos",
        buttonTextWhenValid: "Continuar →",

        // 🎨 ESTILO VISUAL APRIMORADO
        selectionStyle: "border",
        selectedColor: "#B89B7A",
        hoverColor: "#D4B896",

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
        // 📝 TEXTO DINÂMICO
        text: "Continuar →",
        textWhenDisabled: "Selecione 3 estilos",
        textWhenComplete: "Continuar →",

        // 🎨 ESTILO
        variant: "primary",
        size: "large",
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        disabledBackgroundColor: "#E5E7EB",
        disabledTextColor: "#9CA3AF",

        // ⚡ ATIVAÇÃO INSTANTÂNEA - SEM DELAYS
        disabled: true,
        requiresValidInput: true,
        instantActivation: true, // Ativa na hora que completar
        noDelay: true, // Sem atraso para ativar

        // � AUTOAVANÇO IMEDIATO
        autoAdvanceAfterActivation: true, // Avança logo após ativar
        autoAdvanceDelay: 0, // Instantâneo

        // � FEEDBACK MÍNIMO (RÁPIDO)
        showSuccessAnimation: false, // Sem animação para não atrasar
        showPulseWhenEnabled: false, // Sem pulse para não atrasar
        quickFeedback: true, // Feedback rápido apenas
      },
    },
  ];
};

export default getStep02Template;

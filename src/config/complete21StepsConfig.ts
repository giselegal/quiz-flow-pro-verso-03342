// ✅ CONFIGURAÇÃO COMPLETA DAS 21 ETAPAS - SISTEMA MODULAR
// Configurações avançadas baseadas na especificação fornecida

export interface QuizTemplateConfig {
  meta: {
    name: string;
    description: string;
    version: string;
    author: string;
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    button: {
      background: string;
      textColor: string;
      borderRadius: string;
      shadow: string;
      activationRule?: string;
    };
    card: {
      background: string;
      borderRadius: string;
      shadow: string;
    };
    progressBar: {
      color: string;
      background: string;
      height: string;
    };
    animations: {
      questionTransition: string;
      optionSelect: string;
      button: string;
      autoAdvance?: {
        enabled: boolean;
        stages: number[];
        description: string;
      };
    };
    imageOptionSize: {
      default: { width: number; height: number; aspect: string };
      strategic: { width: number; height: number; aspect: string };
    };
    grid: {
      optionsWithImages: {
        internalMargin: number;
        containerPadding: number;
        imageFill: string;
        imageHighlight: string;
        imageSize: { width: number; height: number };
      };
    };
    canvas?: {
      backgroundColor: string;
      backgroundColorOptions: string[];
      scale: number;
      scaleMin: number;
      scaleMax: number;
      scaleSlider: {
        enabled: boolean;
        style: string;
        step: number;
      };
      alignment: {
        options: string[];
        default: string;
      };
    };
  };
  order: string[];
  components: {
    [key: string]: any;
  };
  logic: {
    selection: {
      normal: string;
      strategic: string;
      customRules: string;
    };
    calculation: {
      method: string;
      resultado: string;
      estrategicas: string;
    };
    transitions: {
      betweenSteps: string;
      toStrategic: string;
      toResult: string;
    };
  };
  config: {
    localStorageKeys: string[];
    analyticsEvents: string[];
    tracking: {
      utmParams: boolean;
      variant: string;
      events: string;
    };
  };
}

// 🎯 CONFIGURAÇÃO COMPLETA DO TEMPLATE DE 21 ETAPAS
export const COMPLETE_21_STEPS_CONFIG: QuizTemplateConfig = {
  meta: {
    name: "Quiz Estilo Pessoal - Funil Modular",
    description:
      "Template modular, cada etapa como componente independente e editável para painéis.",
    version: "1.4.0",
    author: "giselegal",
  },
  design: {
    primaryColor: "#B89B7A",
    secondaryColor: "#432818",
    accentColor: "#aa6b5d",
    backgroundColor: "#FAF9F7",
    fontFamily: "'Playfair Display', 'Inter', serif",
    button: {
      background: "linear-gradient(90deg, #B89B7A, #aa6b5d)",
      textColor: "#fff",
      borderRadius: "10px",
      shadow: "0 4px 14px rgba(184, 155, 122, 0.15)",
      activationRule:
        "Etapa 1: Ativa após nome preenchido; Etapas 2-11: Ativa após 3 seleções; Etapas estratégicas: Ativa após 1 seleção (com clique manual)",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      shadow: "0 4px 20px rgba(184, 155, 122, 0.10)",
    },
    progressBar: {
      color: "#B89B7A",
      background: "#F3E8E6",
      height: "6px",
    },
    animations: {
      questionTransition: "fade, scale",
      optionSelect: "glow, scale",
      button: "hover:scale-105, active:scale-95",
      autoAdvance: {
        enabled: true,
        stages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        description: "Avança automaticamente para próxima etapa após a 3ª seleção",
      },
    },
    imageOptionSize: {
      default: { width: 256, height: 256, aspect: "square" },
      strategic: { width: 400, height: 256, aspect: "landscape" },
    },
    grid: {
      optionsWithImages: {
        internalMargin: 0,
        containerPadding: 0,
        imageFill: "cover",
        imageHighlight:
          "A imagem deve ocupar todo o espaço disponível do grid, sem margens internas, e ser bem destacada.",
        imageSize: { width: 256, height: 256 },
      },
    },
    canvas: {
      backgroundColor: "#FAF9F7",
      backgroundColorOptions: ["#FAF9F7", "#fff", "#F3E8E6", "#B89B7A", "#aa6b5d"],
      scale: 100,
      scaleMin: 50,
      scaleMax: 110,
      scaleSlider: {
        enabled: true,
        style: "barra fina e elegante",
        step: 1,
      },
      alignment: {
        options: ["left", "center", "right", "justify"],
        default: "center",
      },
    },
  },
  order: [
    "quiz-intro-header",
    "intro",
    "questions",
    "mainTransition",
    "strategicQuestions",
    "finalTransition",
    "result",
  ],
  components: {
    "quiz-intro-header": {
      defaultEnabled: true,
      props: {
        enabled: { type: "boolean", editable: true, default: true },
        showLogo: { type: "boolean", editable: true, default: true },
        showBar: { type: "boolean", editable: true, default: true },
        onlyLogo: { type: "boolean", editable: true, default: false },
        onlyBar: { type: "boolean", editable: true, default: false },
        logoUpload: { type: "string", editable: true, format: "image-url" },
        barColor: {
          type: "string",
          editable: true,
          format: "color-picker",
          palette: ["#B89B7A", "#aa6b5d", "#432818", "#F3E8E6", "#fff"],
        },
        alignment: {
          type: "string",
          editable: true,
          options: ["left", "center", "right"],
          default: "center",
        },
      },
    },
    Intro: {
      props: {
        title: { type: "string", editable: true },
        descriptionTop: { type: "string", editable: true },
        imageIntro: { type: "string", editable: true },
        descriptionBottom: { type: "string", editable: true },
        inputType: { type: "string", editable: true, options: ["text", "email"] },
        inputLabel: { type: "string", editable: true },
        inputPlaceholder: { type: "string", editable: true },
        buttonText: { type: "string", editable: true },
        required: { type: "boolean", editable: true },
        validation: {
          minLength: { type: "number", editable: true },
          errorMessage: { type: "string", editable: true },
        },
        privacyText: { type: "string", editable: true },
        footerText: { type: "string", editable: true },
        buttonActivationRule: {
          type: "string",
          editable: false,
          value: "Ativa apenas após o usuário preencher o nome",
        },
      },
    },
    QuestionGroup: {
      props: {
        title: { type: "string", editable: true },
        description: { type: "string", editable: true },
        progressBar: {
          show: { type: "boolean", editable: true },
          color: { type: "string", editable: true },
          background: { type: "string", editable: true },
          height: { type: "string", editable: true },
        },
        animations: {
          transition: { type: "string", editable: true },
          optionSelect: { type: "string", editable: true },
        },
        rules: {
          multiSelect: { type: "number", editable: true, default: 3 },
          colunas: { type: "number", editable: true, default: 2 },
          buttonActivation: {
            type: "string",
            editable: false,
            value: "Ativa após 3 seleções obrigatórias",
          },
          autoAdvance: { type: "boolean", editable: true, default: true },
          errorMessage: { type: "string", editable: true },
        },
        layout: {
          type: "string",
          editable: true,
          options: ["1col", "2col"],
          default: "2col",
        },
        direction: {
          type: "string",
          editable: true,
          options: ["vertical", "horizontal"],
          default: "vertical",
        },
        contentOrder: {
          type: "string",
          editable: true,
          options: ["image-text", "text-only", "image-only"],
          default: "image-text",
        },
        questions: {
          type: "array",
          editable: true,
          itemProps: {
            id: { type: "string", editable: true },
            title: { type: "string", editable: true },
            options: {
              type: "array",
              editable: true,
              itemProps: {
                text: { type: "string", editable: true },
                imageUrl: { type: "string", editable: true },
                imagePreview: { type: "string", editable: true },
                score: { type: "number", editable: true, options: [0, 1], default: 1 },
                category: { type: "string", editable: true },
              },
            },
            addOptionButton: {
              type: "boolean",
              editable: true,
              default: true,
            },
          },
        },
      },
    },
    Transition: {
      props: {
        title: { type: "string", editable: true },
        description: { type: "string", editable: true },
        progressBar: {
          show: { type: "boolean", editable: true },
        },
        animations: {
          transition: { type: "string", editable: true },
        },
        backgroundImage: { type: "string", editable: true },
        textColor: { type: "string", editable: true },
      },
    },
    StrategicQuestionGroup: {
      props: {
        title: { type: "string", editable: true },
        description: { type: "string", editable: true },
        progressBar: {
          show: { type: "boolean", editable: true },
          color: { type: "string", editable: true },
          background: { type: "string", editable: true },
          height: { type: "string", editable: true },
        },
        animations: {
          transition: { type: "string", editable: true },
          optionSelect: { type: "string", editable: true },
        },
        rules: {
          multiSelect: { type: "number", editable: true, default: 1 },
          colunas: { type: "number", editable: true, default: 1 },
          buttonActivation: {
            type: "string",
            editable: false,
            value: "Ativa após 1 seleção obrigatória, avança apenas com clique manual",
          },
          autoAdvance: { type: "boolean", editable: true, default: false },
          errorMessage: { type: "string", editable: true },
        },
        layout: {
          type: "string",
          editable: true,
          options: ["1col", "2col"],
          default: "1col",
        },
        direction: {
          type: "string",
          editable: true,
          options: ["vertical", "horizontal"],
          default: "vertical",
        },
        contentOrder: {
          type: "string",
          editable: true,
          options: ["image-text", "text-only", "image-only"],
          default: "image-text",
        },
        questions: {
          type: "array",
          editable: true,
          itemProps: {
            id: { type: "string", editable: true },
            title: { type: "string", editable: true },
            options: {
              type: "array",
              editable: true,
              itemProps: {
                text: { type: "string", editable: true },
                imageUrl: { type: "string", editable: true },
                imagePreview: { type: "string", editable: true },
              },
            },
            addOptionButton: {
              type: "boolean",
              editable: true,
              default: true,
            },
          },
        },
      },
    },
    Result: {
      props: {
        title: { type: "string", editable: true },
        description: { type: "string", editable: true },
        progressBar: {
          show: { type: "boolean", editable: true },
        },
        animations: {
          transition: { type: "string", editable: true },
        },
        styles: {
          type: "array",
          editable: true,
          itemProps: {
            name: { type: "string", editable: true },
            image: { type: "string", editable: true },
            guideImage: { type: "string", editable: true },
            description: { type: "string", editable: true },
          },
        },
        cta: {
          text: { type: "string", editable: true },
          url: { type: "string", editable: true },
          buttonColor: { type: "string", editable: true },
        },
        bonus: {
          type: "array",
          editable: true,
          itemProps: {
            title: { type: "string", editable: true },
            image: { type: "string", editable: true },
          },
        },
      },
    },
  },
  logic: {
    selection: {
      normal:
        "Etapas normais: botão só ativa após número de seleções obrigatórias; auto avanço após seleção.",
      strategic:
        "Etapas estratégicas: botão só ativa após seleção, avanço apenas com clique manual.",
      customRules:
        "Usuário pode ativar/desativar regras de avanço, número obrigatório de seleções, ativação automática ou manual.",
    },
    calculation: {
      method: "Soma ponto por categoria de cada opção marcada em todas as perguntas principais.",
      resultado:
        "O estilo com maior pontuação é o predominante. Os demais estilos são exibidos como secundários, se houver empate, o desempate é pela opção clicada primeira.",
      estrategicas: "As respostas estratégicas podem influenciar o CTA, bônus e copy do resultado.",
    },
    transitions: {
      betweenSteps:
        "Usa animação fade/scale, preload de imagens da próxima etapa, barra de progresso animada.",
      toStrategic: "Exibe tela de transição especial com mensagem/efeito visual.",
      toResult: "Tela final revela resultado com animação, CTA e guia visual.",
    },
  },
  config: {
    localStorageKeys: ["userName", "quizAnswers", "strategicAnswers", "quizCompletedAt"],
    analyticsEvents: [
      "quiz_started",
      "question_answered",
      "quiz_completed",
      "quiz_abandoned",
      "result_viewed",
      "cta_clicked",
      "conversion",
    ],
    tracking: {
      utmParams: true,
      variant: "A/B",
      events: "start, answer, complete, abandon, conversion",
    },
  },
};

// 🔄 MAPEAMENTO DAS 21 ETAPAS COM CONFIGURAÇÃO AVANÇADA
export interface AdvancedStepConfig {
  stepNumber: number;
  id: string;
  name: string;
  description: string;
  type: "intro" | "question" | "transition" | "processing" | "result" | "lead" | "offer";
  category: "start" | "questions" | "strategic" | "results" | "conversion";
  component: keyof typeof COMPLETE_21_STEPS_CONFIG.components;
  autoAdvance: boolean;
  multiSelect: number;
  buttonActivation: "input" | "selection" | "manual";
  layout: "1col" | "2col";
}

export const ADVANCED_21_STEPS: AdvancedStepConfig[] = [
  // ✨ ETAPA 1 - INTRODUÇÃO
  {
    stepNumber: 1,
    id: "step-01",
    name: "Introdução",
    description: "Tela inicial do quiz de estilo com captura de nome",
    type: "intro",
    category: "start",
    component: "Intro",
    autoAdvance: false,
    multiSelect: 0,
    buttonActivation: "input",
    layout: "1col",
  },

  // 📋 ETAPAS 2-11 - PERGUNTAS PRINCIPAIS (AUTO-AVANÇO)
  {
    stepNumber: 2,
    id: "step-02",
    name: "Roupa Favorita",
    description: "Tipo de roupa preferida no guarda-roupa",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 3,
    id: "step-03",
    name: "Estilo Pessoal",
    description: "Identificação do estilo pessoal predominante",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 4,
    id: "step-04",
    name: "Cores Preferidas",
    description: "Paleta de cores favoritas",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 5,
    id: "step-05",
    name: "Ocasiões Especiais",
    description: "Roupas para eventos importantes",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 6,
    id: "step-06",
    name: "Acessórios",
    description: "Preferências de acessórios e complementos",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 7,
    id: "step-07",
    name: "Estações do Ano",
    description: "Adaptação do estilo às estações",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 8,
    id: "step-08",
    name: "Ambiente de Trabalho",
    description: "Roupas para ambiente profissional",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 9,
    id: "step-09",
    name: "Estilo Casual",
    description: "Preferências para o dia a dia",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 10,
    id: "step-10",
    name: "Inspirações",
    description: "Fontes de inspiração para o estilo",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },
  {
    stepNumber: 11,
    id: "step-11",
    name: "Personalidade",
    description: "Como o estilo reflete a personalidade",
    type: "question",
    category: "questions",
    component: "QuestionGroup",
    autoAdvance: true,
    multiSelect: 3,
    buttonActivation: "selection",
    layout: "2col",
  },

  // 🔄 ETAPA 12 - TRANSIÇÃO PRINCIPAL
  {
    stepNumber: 12,
    id: "step-12",
    name: "Transição Principal",
    description: "Transição para perguntas estratégicas",
    type: "transition",
    category: "questions",
    component: "Transition",
    autoAdvance: false,
    multiSelect: 0,
    buttonActivation: "manual",
    layout: "1col",
  },

  // 🎯 ETAPAS 13-19 - PERGUNTAS ESTRATÉGICAS (CLIQUE MANUAL)
  {
    stepNumber: 13,
    id: "step-13",
    name: "Orçamento",
    description: "Investimento em roupas e acessórios",
    type: "question",
    category: "strategic",
    component: "StrategicQuestionGroup",
    autoAdvance: false,
    multiSelect: 1,
    buttonActivation: "manual",
    layout: "1col",
  },
  {
    stepNumber: 14,
    id: "step-14",
    name: "Desafios",
    description: "Principais dificuldades com o guarda-roupa",
    type: "question",
    category: "strategic",
    component: "StrategicQuestionGroup",
    autoAdvance: false,
    multiSelect: 1,
    buttonActivation: "manual",
    layout: "1col",
  },
  {
    stepNumber: 15,
    id: "step-15",
    name: "Objetivos",
    description: "O que deseja alcançar com o novo estilo",
    type: "question",
    category: "strategic",
    component: "StrategicQuestionGroup",
    autoAdvance: false,
    multiSelect: 1,
    buttonActivation: "manual",
    layout: "1col",
  },
  {
    stepNumber: 16,
    id: "step-16",
    name: "Tempo Disponível",
    description: "Tempo para cuidar do visual e compras",
    type: "question",
    category: "strategic",
    component: "StrategicQuestionGroup",
    autoAdvance: false,
    multiSelect: 1,
    buttonActivation: "manual",
    layout: "1col",
  },
  {
    stepNumber: 17,
    id: "step-17",
    name: "Prioridades",
    description: "O que é mais importante no visual",
    type: "question",
    category: "strategic",
    component: "StrategicQuestionGroup",
    autoAdvance: false,
    multiSelect: 1,
    buttonActivation: "manual",
    layout: "1col",
  },
  {
    stepNumber: 18,
    id: "step-18",
    name: "Experiência",
    description: "Experiência anterior com consultoria de estilo",
    type: "question",
    category: "strategic",
    component: "StrategicQuestionGroup",
    autoAdvance: false,
    multiSelect: 1,
    buttonActivation: "manual",
    layout: "1col",
  },
  {
    stepNumber: 19,
    id: "step-19",
    name: "Motivação",
    description: "O que mais te motiva a mudar o visual",
    type: "question",
    category: "strategic",
    component: "StrategicQuestionGroup",
    autoAdvance: false,
    multiSelect: 1,
    buttonActivation: "manual",
    layout: "1col",
  },

  // ⚡ ETAPA 20 - PROCESSAMENTO
  {
    stepNumber: 20,
    id: "step-20",
    name: "Processamento",
    description: "Calculando seu estilo predominante",
    type: "processing",
    category: "results",
    component: "Transition",
    autoAdvance: true,
    multiSelect: 0,
    buttonActivation: "manual",
    layout: "1col",
  },

  // 🎊 ETAPA 21 - RESULTADO E OFERTA
  {
    stepNumber: 21,
    id: "step-21",
    name: "Seu Estilo + Oferta",
    description: "Resultado do quiz e proposta comercial",
    type: "result",
    category: "conversion",
    component: "Result",
    autoAdvance: false,
    multiSelect: 0,
    buttonActivation: "manual",
    layout: "1col",
  },
];

// 📊 UTILITÁRIOS PARA ANÁLISE DAS CONFIGURAÇÕES
export const getStepsByCategory = (category: string) => {
  return ADVANCED_21_STEPS.filter(step => step.category === category);
};

export const getAutoAdvanceSteps = () => {
  return ADVANCED_21_STEPS.filter(step => step.autoAdvance);
};

export const getManualAdvanceSteps = () => {
  return ADVANCED_21_STEPS.filter(step => !step.autoAdvance);
};

export const getStepConfig = (stepNumber: number) => {
  return ADVANCED_21_STEPS.find(step => step.stepNumber === stepNumber);
};

export const getStepsStatistics = () => {
  const total = ADVANCED_21_STEPS.length;
  const byCategory = {
    start: getStepsByCategory("start").length,
    questions: getStepsByCategory("questions").length,
    strategic: getStepsByCategory("strategic").length,
    results: getStepsByCategory("results").length,
    conversion: getStepsByCategory("conversion").length,
  };
  const autoAdvance = getAutoAdvanceSteps().length;
  const manualAdvance = getManualAdvanceSteps().length;

  return {
    total,
    byCategory,
    autoAdvance,
    manualAdvance,
    isValidConfiguration: total === 21,
  };
};

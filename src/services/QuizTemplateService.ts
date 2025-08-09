import { generateSemanticId } from "@/utils/semanticIdGenerator";

export interface QuizTemplate {
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
  };
  order: string[];
  steps: Array<{
    type: string;
    title: string;
    [key: string]: any;
  }>;
  logic: {
    selection: Record<string, any>;
    calculation: Record<string, any>;
    transitions: Record<string, any>;
  };
  config: {
    localStorageKeys: string[];
    analyticsEvents: string[];
    tracking: Record<string, any>;
  };
}

// Template padrão do Quiz de Estilo
export const STYLE_QUIZ_TEMPLATE: QuizTemplate = {
  meta: {
    name: "Quiz Estilo Pessoal - Template Completo",
    description: "Modelo completo para quiz de estilo pessoal, pronto para sistemas de moda.",
    version: "1.2.3",
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
  },
  order: [
    "intro",
    "questions",
    "mainTransition",
    "strategicQuestions",
    "finalTransition",
    "result",
  ],
  steps: [
    {
      type: "intro",
      title: "Bem-vinda ao Quiz de Estilo",
      descriptionTop: "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
      imageIntro:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg",
      descriptionBottom:
        "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
      inputType: "text",
      inputLabel: "NOME *",
      inputPlaceholder: "Digite seu nome",
      buttonText: "Digite seu nome para continuar",
      required: true,
      validation: {
        minLength: 2,
        errorMessage: "Digite seu nome para continuar",
      },
      privacyText:
        "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",
      footerText: "© 2025 Gisele Galvão - Todos os direitos reservados",
    },
    {
      type: "questions",
      title: "Perguntas Principais",
      description: "Selecione 3 opções por pergunta para avançar.",
      progressBar: {
        show: true,
        color: "#B89B7A",
        background: "#F3E8E6",
        height: "6px",
      },
      animations: {
        transition: "fade, scale",
        optionSelect: "glow, scale",
      },
      rules: {
        multiSelect: 3,
        colunas: 2,
        buttonActivation: "O botão 'Avançar' só ativa quando o usuário seleciona 3 opções",
        visualValidation: "Opções selecionadas recebem borda e sombra especial",
        errorMessage: "Selecione 3 opções para avançar.",
      },
      questions: [
        {
          id: "1",
          title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
          layout: "2col",
          multiSelect: 3,
          options: [
            {
              id: "1a",
              text: "Conforto, leveza e praticidade no vestir.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Natural",
            },
            {
              id: "1b",
              text: "Discrição, caimento clássico e sobriedade.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Clássico",
            },
            {
              id: "1c",
              text: "Praticidade com um toque de estilo atual.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Contemporâneo",
            },
            {
              id: "1d",
              text: "Elegância refinada, moderna e sem exageros.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Elegante",
            },
            {
              id: "1e",
              text: "Delicadeza em tecidos suaves e fluidos.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Romântico",
            },
            {
              id: "1f",
              text: "Sensualidade com destaque para o corpo.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Sexy",
            },
            {
              id: "1g",
              text: "Impacto visual com peças estruturadas e assimétricas.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Dramático",
            },
            {
              id: "1h",
              text: "Mix criativo com formas ousadas e originais.",
              imageUrl:
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
              imageSize: { width: 256, height: 256 },
              styleCategory: "Criativo",
            },
          ],
        },
      ],
    },
    {
      type: "mainTransition",
      title: "Transição para Perguntas Estratégicas",
      description:
        "Enquanto calculamos seu resultado, responda perguntas estratégicas para personalizar ainda mais sua experiência.",
      progressBar: { show: false },
      animations: { transition: "fade" },
      backgroundImage:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp",
      textColor: "#432818",
    },
    {
      type: "strategicQuestions",
      title: "Perguntas Estratégicas",
      description: "Escolha UMA opção para avançar.",
      progressBar: { show: true, color: "#B89B7A", background: "#F3E8E6", height: "6px" },
      animations: { transition: "fade, scale", optionSelect: "glow, scale" },
      rules: {
        multiSelect: 1,
        colunas: 1,
        buttonActivation: "Só ativa ao selecionar uma opção",
        errorMessage: "Selecione uma opção para avançar.",
      },
      questions: [
        {
          id: "strategic-1",
          title: "Como você se sente em relação ao seu estilo pessoal hoje?",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp",
          imageSize: { width: 400, height: 256 },
          layout: "1col",
          options: [
            { id: "strategic-1-1", text: "Completamente perdida, não sei o que combina comigo" },
            { id: "strategic-1-2", text: "Tenho algumas ideias, mas não sei como aplicá-las" },
            { id: "strategic-1-3", text: "Conheço meu estilo, mas quero refiná-lo" },
            { id: "strategic-1-4", text: "Estou satisfeita, só buscando inspiração" },
          ],
        },
        {
          id: "strategic-2",
          title: "Qual é o maior desafio que você enfrenta ao se vestir?",
          imageUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp",
          imageSize: { width: 400, height: 256 },
          layout: "1col",
          options: [
            { id: "strategic-2-1", text: "Nunca sei o que combina com o quê" },
            {
              id: "strategic-2-2",
              text: "Tenho muitas roupas, mas sempre sinto que não tenho nada para vestir",
            },
            {
              id: "strategic-2-3",
              text: "Não consigo criar looks diferentes com as peças que tenho",
            },
            { id: "strategic-2-4", text: "Compro peças por impulso que depois não uso" },
          ],
        },
      ],
    },
    {
      type: "finalTransition",
      title: "Preparando Resultado",
      description:
        "Seu resultado está quase pronto! Calculando respostas e preparando seu guia personalizado.",
      progressBar: { show: false },
      animations: { transition: "fade" },
      backgroundImage:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp",
      textColor: "#432818",
    },
    {
      type: "result",
      title: "Resultado",
      description: "Baseado nas suas respostas, seu estilo predominante é:",
      progressBar: { show: false },
      animations: { transition: "fade" },
      styles: [
        {
          name: "Natural",
          image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
          guideImage:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
          description:
            "Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico.",
        },
        {
          name: "Clássico",
          image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
          guideImage:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CL%C3%81SSICO_ux1yhf.webp",
          description:
            "Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito.",
        },
      ],
      cta: {
        text: "Ver Guia Completo",
        url: "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
        buttonColor: "linear-gradient(to right, #B89B7A, #aa6b5d)",
      },
      bonus: [
        {
          title: "Peças-chave para seu estilo",
          image:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp",
        },
        {
          title: "Visagismo facial",
          image:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp",
        },
      ],
    },
  ],
  logic: {
    selection: {
      normal:
        "Avança apenas se o mínimo de seleções (multiSelect) for atingido; botão de avançar desativado até lá.",
      strategic: "Só avança se selecionar uma opção; não permite desmarcar opção já marcada.",
      visualValidation: "Opções selecionadas mudam cor/borda; erro visual caso não atinja mínimo.",
    },
    calculation: {
      method: "Soma ponto por categoria de cada opção marcada em todas as perguntas principais.",
      resultado:
        "O estilo com maior pontuação é o predominante. Os demais estilos são exibidos como secundários.",
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

export class QuizTemplateService {
  private static instance: QuizTemplateService;
  private currentTemplate: QuizTemplate = STYLE_QUIZ_TEMPLATE;

  static getInstance(): QuizTemplateService {
    if (!QuizTemplateService.instance) {
      QuizTemplateService.instance = new QuizTemplateService();
    }
    return QuizTemplateService.instance;
  }

  getCurrentTemplate(): QuizTemplate {
    return this.currentTemplate;
  }

  updateTemplate(updates: Partial<QuizTemplate>): void {
    this.currentTemplate = { ...this.currentTemplate, ...updates };
  }

  getStepsForEditor() {
    return this.currentTemplate.steps.map((step, index) => ({
      id: generateSemanticId({
        context: "quiz-template",
        type: step.type,
        identifier: step.title.toLowerCase().replace(/\s+/g, "-"),
        index,
      }),
      type: `QuizStep${step.type.charAt(0).toUpperCase()}${step.type.slice(1)}`,
      name: step.title,
      category: "quiz-steps",
      properties: step,
      content: {
        description: step.description || "",
        ...step,
      },
    }));
  }

  createEditorStage(stepType: string) {
    const step = this.currentTemplate.steps.find(s => s.type === stepType);
    if (!step) return null;

    return {
      id: generateSemanticId({
        context: "quiz-stage",
        type: stepType,
        identifier: step.title.toLowerCase().replace(/\s+/g, "-"),
      }),
      name: step.title,
      type: "quiz-step",
      config: {
        template: step,
        design: this.currentTemplate.design,
        logic: this.currentTemplate.logic,
      },
      blocks: [],
    };
  }
}

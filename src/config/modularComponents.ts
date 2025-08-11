// 🎯 MAPEAMENTO DE COMPONENTES MODULARES BASEADO NO QUIZINTRO REAL
// Transformação do componente React em configuração JSON modular

export interface ModularComponent {
  id: string;
  name: string;
  category: "Structure" | "Content" | "Form" | "Media" | "Layout" | "Interactive";
  description: string;
  type: string;
  icon: string;
  properties: {
    [key: string]: {
      type: string;
      editable: boolean;
      default?: any;
      options?: any[];
      description?: string;
    };
  };
  preview: string;
  usageExample: any;
}

// 📦 COMPONENTES MODULARES EXTRAÍDOS DO QUIZINTRO
export const MODULAR_COMPONENTS: ModularComponent[] = [
  // 🏗️ ESTRUTURAIS
  {
    id: "accessibility-skip-link",
    name: "Skip Link",
    category: "Structure",
    description: "Link de pulo para acessibilidade - primeira interação focável",
    type: "accessibility-skip-link",
    icon: "♿",
    properties: {
      target: {
        type: "string",
        editable: true,
        default: "#quiz-form",
        description: "ID do elemento de destino",
      },
      text: { type: "string", editable: true, default: "Pular para o formulário" },
      className: {
        type: "string",
        editable: true,
        default: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50",
      },
    },
    preview: "Link invisível que aparece no foco",
    usageExample: {
      id: "intro-skip-link",
      type: "accessibility-skip-link",
      properties: { target: "#quiz-form", text: "Pular para o formulário" },
    },
  },
  {
    id: "header-section",
    name: "Header Section",
    category: "Structure",
    description: "Container principal do cabeçalho com logo e título",
    type: "header-section",
    icon: "🏛️",
    properties: {
      className: {
        type: "string",
        editable: true,
        default: "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto",
      },
      spacing: {
        type: "string",
        editable: true,
        options: ["small", "medium", "large"],
        default: "large",
      },
    },
    preview: "Container responsivo com espaçamento padrão",
    usageExample: {
      id: "intro-header",
      type: "header-section",
      properties: { spacing: "large" },
    },
  },
  {
    id: "main-section",
    name: "Main Section",
    category: "Structure",
    description: "Seção principal com conteúdo central",
    type: "main-section",
    icon: "📄",
    properties: {
      className: {
        type: "string",
        editable: true,
        default: "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto",
      },
    },
    preview: "Container principal responsivo",
    usageExample: {
      id: "intro-main-section",
      type: "main-section",
      properties: {},
    },
  },
  {
    id: "footer-section",
    name: "Footer Section",
    category: "Structure",
    description: "Rodapé com copyright e informações legais",
    type: "footer-section",
    icon: "🦶",
    properties: {
      content: {
        type: "string",
        editable: true,
        default: "© {{currentYear}} Gisele Galvão - Todos os direitos reservados",
      },
      className: {
        type: "string",
        editable: true,
        default: "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto",
      },
      textClassName: { type: "string", editable: true, default: "text-xs text-gray-500" },
    },
    preview: "Rodapé centralizado com copyright",
    usageExample: {
      id: "intro-footer",
      type: "footer-section",
      properties: { content: "© 2025 Gisele Galvão" },
    },
  },

  // 🎨 CONTEÚDO
  {
    id: "main-title",
    name: "Título Principal",
    category: "Content",
    description: "Título principal com destaques coloridos e fonte Playfair Display",
    type: "main-title",
    icon: "📝",
    properties: {
      content: { type: "string", editable: true, default: "Seu título aqui" },
      tag: { type: "string", editable: true, options: ["h1", "h2", "h3"], default: "h1" },
      fontFamily: { type: "string", editable: true, default: "Playfair Display, serif" },
      className: {
        type: "string",
        editable: true,
        default: "text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl",
      },
      highlights: {
        type: "array",
        editable: true,
        default: [
          { text: "Chega", color: "#B89B7A" },
          { text: "Você", color: "#B89B7A" },
        ],
      },
    },
    preview: "Título grande com palavras em destaque dourado",
    usageExample: {
      id: "intro-main-title",
      type: "main-title",
      properties: {
        content: '<span class="text-[#B89B7A]">Chega</span> de um guarda-roupa lotado...',
      },
    },
  },
  {
    id: "description-text",
    name: "Texto Descritivo",
    category: "Content",
    description: "Parágrafo descritivo com destaques e formatação responsiva",
    type: "description-text",
    icon: "📖",
    properties: {
      content: { type: "string", editable: true, default: "Seu texto descritivo aqui" },
      className: {
        type: "string",
        editable: true,
        default: "text-sm text-center leading-relaxed px-2 sm:text-base text-gray-600",
      },
      highlights: {
        type: "array",
        editable: true,
        default: [{ text: "Estilo Predominante", className: "font-semibold text-[#B89B7A]" }],
      },
    },
    preview: "Texto com palavras destacadas em cores específicas",
    usageExample: {
      id: "intro-description",
      type: "description-text",
      properties: { content: "Em poucos minutos, descubra seu estilo..." },
    },
  },
  {
    id: "decorative-bar",
    name: "Barra Decorativa",
    category: "Content",
    description: "Barra colorida decorativa abaixo do logo",
    type: "decorative-bar",
    icon: "➖",
    properties: {
      height: { type: "string", editable: true, default: "3px" },
      backgroundColor: { type: "string", editable: true, default: "#B89B7A" },
      width: { type: "string", editable: true, default: "300px" },
      maxWidth: { type: "string", editable: true, default: "90%" },
      borderRadius: { type: "string", editable: true, default: "rounded-full" },
    },
    preview: "Linha dourada decorativa",
    usageExample: {
      id: "intro-decorative-bar",
      type: "decorative-bar",
      properties: { backgroundColor: "#B89B7A" },
    },
  },

  // 🖼️ MÍDIA
  {
    id: "optimized-image",
    name: "Imagem Otimizada",
    category: "Media",
    description: "Imagem com múltiplos formatos (WebP/PNG) e carregamento otimizado",
    type: "optimized-image",
    icon: "🖼️",
    properties: {
      baseUrl: {
        type: "string",
        editable: true,
        default: "https://res.cloudinary.com/der8kogzu/image/upload/",
      },
      imageId: {
        type: "string",
        editable: true,
        default: "v1752430327/LOGO_DA_MARCA_GISELE_l78gin",
      },
      formats: {
        type: "object",
        editable: true,
        default: {
          webp: "f_webp,q_70,w_120,h_50,c_fit",
          png: "f_png,q_70,w_120,h_50,c_fit",
        },
      },
      alt: { type: "string", editable: true, default: "Imagem" },
      loading: { type: "string", editable: true, options: ["eager", "lazy"], default: "lazy" },
      fetchPriority: {
        type: "string",
        editable: true,
        options: ["high", "low", "auto"],
        default: "auto",
      },
    },
    preview: "Imagem responsiva multi-formato",
    usageExample: {
      id: "intro-logo-image",
      type: "optimized-image",
      properties: { alt: "Logo Gisele Galvão", loading: "eager" },
    },
  },
  {
    id: "lcp-optimized-image",
    name: "Imagem LCP Otimizada",
    category: "Media",
    description: "Imagem hero otimizada para Largest Contentful Paint (AVIF/WebP/PNG)",
    type: "lcp-optimized-image",
    icon: "🚀",
    properties: {
      baseUrl: {
        type: "string",
        editable: true,
        default: "https://res.cloudinary.com/der8kogzu/image/upload/",
      },
      imageId: {
        type: "string",
        editable: true,
        default: "v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb",
      },
      formats: {
        type: "object",
        editable: true,
        default: {
          avif: "f_avif,q_85,w_300,c_limit",
          webp: "f_webp,q_85,w_300,c_limit",
          png: "f_png,q_85,w_300,c_limit",
        },
      },
      isLcp: { type: "boolean", editable: true, default: true },
      loading: { type: "string", editable: false, default: "eager" },
      fetchPriority: { type: "string", editable: false, default: "high" },
    },
    preview: "Imagem hero com máxima otimização de performance",
    usageExample: {
      id: "intro-hero-image",
      type: "lcp-optimized-image",
      properties: { alt: "Descubra seu estilo", isLcp: true },
    },
  },

  // 📝 FORMULÁRIOS
  {
    id: "name-input-field",
    name: "Campo de Nome",
    category: "Form",
    description: "Campo de entrada para nome com validação em tempo real",
    type: "name-input-field",
    icon: "👤",
    properties: {
      label: {
        type: "object",
        editable: true,
        default: {
          text: "NOME *",
          required: true,
          className: "block text-xs font-semibold text-[#432818] mb-1.5",
        },
      },
      input: {
        type: "object",
        editable: true,
        default: {
          placeholder: "Digite seu nome",
          maxLength: 32,
          autoComplete: "off",
          validation: {
            required: true,
            minLength: 1,
            errorMessage: "Por favor, digite seu nome para continuar",
          },
        },
      },
    },
    preview: "Campo de nome com label e validação",
    usageExample: {
      id: "intro-name-field",
      type: "name-input-field",
      properties: { input: { placeholder: "Digite seu nome" } },
    },
  },
  {
    id: "submit-button",
    name: "Botão de Envio",
    category: "Form",
    description: "Botão de envio com estados dinâmicos e animações hover",
    type: "submit-button",
    icon: "▶️",
    properties: {
      text: {
        type: "object",
        editable: true,
        default: {
          enabled: "Quero Descobrir meu Estilo Agora!",
          disabled: "Digite seu nome para continuar",
        },
      },
      className: {
        type: "object",
        editable: true,
        default: {
          base: "w-full py-2 px-3 text-sm font-semibold rounded-md shadow-md transition-all duration-300",
          enabled:
            "bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg transform hover:scale-[1.01]",
          disabled: "bg-[#B89B7A]/50 text-white/90 cursor-not-allowed",
        },
      },
      states: {
        type: "object",
        editable: true,
        default: {
          enabledCondition: "name.trim().length > 0",
          disabledState: "cursor-not-allowed",
        },
      },
    },
    preview: "Botão que muda com base no estado do formulário",
    usageExample: {
      id: "intro-submit-button",
      type: "submit-button",
      properties: { text: { enabled: "Começar Quiz!" } },
    },
  },
  {
    id: "quiz-form",
    name: "Formulário do Quiz",
    category: "Form",
    description: "Container do formulário com validação e manipulação de eventos",
    type: "quiz-form",
    icon: "📋",
    properties: {
      className: { type: "string", editable: true, default: "w-full space-y-6" },
      autoComplete: { type: "string", editable: true, options: ["on", "off"], default: "off" },
      onSubmit: { type: "string", editable: true, default: "handleQuizStart" },
    },
    preview: "Formulário completo com campos e botão",
    usageExample: {
      id: "intro-form",
      type: "quiz-form",
      properties: { onSubmit: "handleQuizStart" },
    },
  },
  {
    id: "privacy-notice",
    name: "Aviso de Privacidade",
    category: "Form",
    description: "Texto informativo sobre política de privacidade com link",
    type: "privacy-notice",
    icon: "🔒",
    properties: {
      content: {
        type: "string",
        editable: true,
        default: "Seu nome é necessário para personalizar sua experiência...",
      },
      className: {
        type: "string",
        editable: true,
        default: "text-xs text-center text-gray-500 pt-1",
      },
    },
    preview: "Texto pequeno com link de política",
    usageExample: {
      id: "intro-privacy-text",
      type: "privacy-notice",
      properties: { content: "Sua privacidade é importante..." },
    },
  },

  // 📐 LAYOUT
  {
    id: "logo-container",
    name: "Container do Logo",
    category: "Layout",
    description: "Container flexível centralizado para logo e elementos decorativos",
    type: "logo-container",
    icon: "🏷️",
    properties: {
      className: {
        type: "string",
        editable: true,
        default: "flex flex-col items-center space-y-2",
      },
      alignment: {
        type: "string",
        editable: true,
        options: ["left", "center", "right"],
        default: "center",
      },
    },
    preview: "Container centralizado para logo",
    usageExample: {
      id: "intro-logo-container",
      type: "logo-container",
      properties: { alignment: "center" },
    },
  },
  {
    id: "hero-image-container",
    name: "Container da Imagem Hero",
    category: "Layout",
    description: "Container responsivo para imagem principal com aspect ratio",
    type: "hero-image-container",
    icon: "🖼️",
    properties: {
      className: {
        type: "string",
        editable: true,
        default: "mt-2 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto",
      },
    },
    preview: "Container responsivo para imagem hero",
    usageExample: {
      id: "intro-hero-image-container",
      type: "hero-image-container",
      properties: {},
    },
  },
  {
    id: "image-wrapper",
    name: "Wrapper de Imagem",
    category: "Layout",
    description: "Wrapper com aspect ratio e estilização para imagens",
    type: "image-wrapper",
    icon: "🎁",
    properties: {
      className: {
        type: "string",
        editable: true,
        default: "w-full overflow-hidden rounded-lg shadow-sm",
      },
      aspectRatio: { type: "string", editable: true, default: "1.47" },
      maxHeight: { type: "string", editable: true, default: "204px" },
    },
    preview: "Wrapper com bordas arredondadas e sombra",
    usageExample: {
      id: "intro-hero-image-wrapper",
      type: "image-wrapper",
      properties: { aspectRatio: "1.47" },
    },
  },
  {
    id: "form-container",
    name: "Container do Formulário",
    category: "Layout",
    description: "Container principal para o formulário com ID para skip link",
    type: "form-container",
    icon: "📦",
    properties: {
      elementId: { type: "string", editable: true, default: "quiz-form" },
      className: { type: "string", editable: true, default: "mt-8" },
    },
    preview: "Container com ID para acessibilidade",
    usageExample: {
      id: "intro-form-container",
      type: "form-container",
      properties: { elementId: "quiz-form" },
    },
  },
];

// 🏷️ CATEGORIAS DE COMPONENTES
export const COMPONENT_CATEGORIES = {
  Structure: {
    name: "Estrutura",
    description: "Componentes estruturais básicos",
    icon: "🏗️",
    color: "#6366F1",
  },
  Content: {
    name: "Conteúdo",
    description: "Textos, títulos e elementos de conteúdo",
    icon: "📝",
    color: "#059669",
  },
  Form: {
    name: "Formulário",
    description: "Elementos de formulário e interação",
    icon: "📋",
    color: "#DC2626",
  },
  Media: {
    name: "Mídia",
    description: "Imagens otimizadas e elementos visuais",
    icon: "🖼️",
    color: "#7C2D12",
  },
  Layout: {
    name: "Layout",
    description: "Containers e estruturas de layout",
    icon: "📐",
    color: "#9333EA",
  },
  Interactive: {
    name: "Interativo",
    description: "Componentes com comportamento dinâmico",
    icon: "⚡",
    color: "#EA580C",
  },
};

// 🔄 MAPEAMENTO PARA O SISTEMA DE 21 ETAPAS
export const mapComponentsToSteps = () => {
  const stepComponents: { [key: string]: ModularComponent[] } = {};

  // Etapa 1 - Introdução (todos os componentes do QuizIntro)
  stepComponents["step-01"] = MODULAR_COMPONENTS;

  // Etapas 2-11 - Perguntas principais (componentes de questão)
  for (let i = 2; i <= 11; i++) {
    stepComponents[`step-${i.toString().padStart(2, "0")}`] = MODULAR_COMPONENTS.filter(comp =>
      ["Structure", "Content", "Interactive"].includes(comp.category)
    );
  }

  // Etapas 12, 20 - Transições (componentes de transição)
  [12, 20].forEach(i => {
    stepComponents[`step-${i.toString().padStart(2, "0")}`] = MODULAR_COMPONENTS.filter(comp =>
      ["Structure", "Content", "Media"].includes(comp.category)
    );
  });

  // Etapas 13-19 - Estratégicas (componentes específicos)
  for (let i = 13; i <= 19; i++) {
    stepComponents[`step-${i.toString().padStart(2, "0")}`] = MODULAR_COMPONENTS.filter(comp =>
      ["Structure", "Content", "Interactive"].includes(comp.category)
    );
  }

  // Etapa 21 - Resultado + Oferta (todos os componentes)
  stepComponents["step-21"] = MODULAR_COMPONENTS;

  return stepComponents;
};

export const getComponentsByCategory = (category: string) => {
  return MODULAR_COMPONENTS.filter(comp => comp.category === category);
};

export const getComponentById = (id: string) => {
  return MODULAR_COMPONENTS.find(comp => comp.id === id);
};

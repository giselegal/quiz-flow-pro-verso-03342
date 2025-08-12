/**
 * Definições de Blocos do Sistema de Funil - Quiz Quest Challenge Verse
 *
 * Sistema completo de blocos para funis configuráveis baseado no modelo fornecido
 * Integra com os componentes existentes e adiciona novos tipos específicos para quiz
 */

import {
  Award,
  Gift,
  Heading1,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  Monitor,
  Palette,
  Play,
  RectangleHorizontal,
  Settings,
  Square,
  StretchHorizontal,
  Target,
  Timer,
  Type,
  Users
} from "lucide-react";

// =====================================================================
// TYPES - Tipos estendidos baseados no modelo
// =====================================================================

export type PropertyType =
  | "text"
  | "number"
  | "color"
  | "select"
  | "boolean"
  | "url"
  | "array-of-objects"
  | "image"
  | "slider"
  | "textarea"
  | "rich-text";

export type LayoutType = "1-column" | "2-columns" | "3-columns" | "4-columns";
export type DirectionType = "vertical" | "horizontal";
export type DispositionType = "image-text" | "text-image" | "text-only" | "image-only";
export type BorderSizeType = "none" | "small" | "medium" | "large";
export type ShadowSizeType = "none" | "small" | "medium" | "large";
export type SpacingType = "small" | "medium" | "large";
export type DetailType = "none" | "line" | "dot";
export type StyleType = "simple" | "card" | "modern" | "minimal";

export interface PropertySchema {
  key: string;
  label: string;
  type: PropertyType;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  nestedPath?: string;
  itemSchema?: PropertySchema[];
  min?: number;
  max?: number;
  description?: string;
  hidden?: boolean;
  group?: string; // Para agrupar propriedades em cards
}

export interface Block {
  id: string;
  type: string;
  properties: Record<string, any>;
}

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  nextStepId?: string;
  value?: string; // Para pontuação/resultado
}

export interface Funnel {
  id: string;
  name: string;
  pages: Page[];
  config: Record<string, any>;
  version: number;
  isPublished: boolean;
  type: "quiz" | "survey" | "lead-gen" | "sales"; // Tipo do funil
}

export interface Page {
  id: string;
  title: string;
  blocks: Block[];
  type?: "intro" | "question" | "result" | "offer" | "custom";
}

// =====================================================================
// DEFINIÇÕES DE BLOCOS - Sistema completo baseado no modelo
// =====================================================================

export const funnelBlockDefinitions = [
  // BLOCOS BÁSICOS
  {
    type: "text",
    label: "Texto",
    icon: Type,
    category: "basic",
    description: "Bloco de texto simples com formatação",
    propertiesSchema: [
      {
        key: "content",
        label: "Conteúdo do Texto",
        type: "textarea",
        defaultValue: "Parágrafo de texto editável.",
        group: "content",
      },
      {
        key: "fontSize",
        label: "Tamanho da Fonte",
        type: "number",
        defaultValue: 16,
        group: "style",
      },
      {
        key: "textColor",
        label: "Cor do Texto",
        type: "color",
        defaultValue: "#333333",
        group: "style",
      },
      {
        key: "textAlign",
        label: "Alinhamento",
        type: "select",
        defaultValue: "left",
        options: [
          { label: "Esquerda", value: "left" },
          { label: "Centro", value: "center" },
          { label: "Direita", value: "right" },
        ],
        group: "style",
      },
    ],
  },

  {
    type: "rich-text",
    label: "Texto Rico",
    icon: Palette,
    category: "basic",
    description: "Editor de texto com formatação avançada (Quill)",
    propertiesSchema: [
      {
        key: "content",
        label: "Conteúdo",
        type: "rich-text",
        defaultValue: "<p>Texto com <strong>formatação</strong> rica</p>",
        group: "content",
      },
      {
        key: "minHeight",
        label: "Altura Mínima (px)",
        type: "number",
        defaultValue: 100,
        group: "style",
      },
    ],
  },

  {
    type: "heading",
    label: "Título",
    icon: Heading1,
    category: "basic",
    description: "Títulos e subtítulos com diferentes níveis",
    propertiesSchema: [
      {
        key: "level",
        label: "Nível do Título",
        type: "select",
        defaultValue: "h1",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
        ],
        group: "content",
      },
      {
        key: "content",
        label: "Texto do Título",
        type: "text",
        defaultValue: "Seu Título Aqui",
        group: "content",
      },
      {
        key: "fontSize",
        label: "Tamanho da Fonte",
        type: "number",
        defaultValue: 32,
        group: "style",
      },
      {
        key: "textColor",
        label: "Cor do Título",
        type: "color",
        defaultValue: "#1a202c",
        group: "style",
      },
      {
        key: "textAlign",
        label: "Alinhamento",
        type: "select",
        defaultValue: "center",
        options: [
          { label: "Esquerda", value: "left" },
          { label: "Centro", value: "center" },
          { label: "Direita", value: "right" },
        ],
        group: "style",
      },
    ],
  },

  {
    type: "button",
    label: "Botão",
    icon: RectangleHorizontal,
    category: "basic",
    description: "Botão interativo com link ou ação",
    propertiesSchema: [
      {
        key: "text",
        label: "Texto do Botão",
        type: "text",
        defaultValue: "Clique Aqui",
        group: "content",
      },
      {
        key: "link",
        label: "URL do Link",
        type: "url",
        defaultValue: "#",
        group: "content",
      },
      {
        key: "backgroundColor",
        label: "Cor de Fundo",
        type: "color",
        defaultValue: "#B89B7A",
        group: "style",
      },
      {
        key: "textColor",
        label: "Cor do Texto",
        type: "color",
        defaultValue: "#ffffff",
        group: "style",
      },
      {
        key: "paddingX",
        label: "Padding Horizontal (px)",
        type: "number",
        defaultValue: 24,
        group: "style",
      },
      {
        key: "paddingY",
        label: "Padding Vertical (px)",
        type: "number",
        defaultValue: 12,
        group: "style",
      },
      {
        key: "borderRadius",
        label: "Raio da Borda (px)",
        type: "number",
        defaultValue: 8,
        group: "style",
      },
      {
        key: "fullWidth",
        label: "Largura Total",
        type: "boolean",
        defaultValue: false,
        group: "layout",
      },
    ],
  },

  {
    type: "image",
    label: "Imagem",
    icon: ImageIcon,
    category: "basic",
    description: "Bloco de imagem com configurações de layout",
    propertiesSchema: [
      {
        key: "src",
        label: "URL da Imagem",
        type: "image",
        defaultValue: "",
        group: "content",
      },
      {
        key: "alt",
        label: "Texto Alternativo",
        type: "text",
        defaultValue: "Imagem",
        group: "content",
      },
      {
        key: "width",
        label: "Largura (px)",
        type: "number",
        defaultValue: 300,
        group: "layout",
      },
      {
        key: "height",
        label: "Altura (px)",
        type: "number",
        defaultValue: 200,
        group: "layout",
      },
      {
        key: "objectFit",
        label: "Ajuste da Imagem",
        type: "select",
        defaultValue: "cover",
        options: [
          { label: "Cobrir", value: "cover" },
          { label: "Conter", value: "contain" },
          { label: "Preencher", value: "fill" },
          { label: "Nenhum", value: "none" },
        ],
        group: "layout",
      },
      {
        key: "borderRadius",
        label: "Raio da Borda (px)",
        type: "number",
        defaultValue: 8,
        group: "style",
      },
    ],
  },

  {
    type: "spacer",
    label: "Espaçador",
    icon: StretchHorizontal,
    category: "basic",
    description: "Espaço vazio para separar conteúdo",
    propertiesSchema: [
      {
        key: "height",
        label: "Altura (px)",
        type: "number",
        defaultValue: 20,
        group: "layout",
      },
      {
        key: "backgroundColor",
        label: "Cor de Fundo",
        type: "color",
        defaultValue: "transparent",
        group: "style",
      },
      {
        key: "borderStyle",
        label: "Estilo da Borda",
        type: "select",
        defaultValue: "none",
        options: [
          { label: "Nenhum", value: "none" },
          { label: "Sólida", value: "solid" },
          { label: "Tracejada", value: "dashed" },
          { label: "Pontilhada", value: "dotted" },
        ],
        group: "style",
      },
      {
        key: "borderColor",
        label: "Cor da Borda",
        type: "color",
        defaultValue: "#facc15",
        group: "style",
      },
    ],
  },

  // BLOCOS DE QUIZ
  {
    type: "quiz-intro",
    label: "Introdução do Quiz",
    icon: Play,
    category: "quiz",
    description: "Página inicial do quiz com título e descrição",
    propertiesSchema: [
      // Header
      {
        key: "headerEnabled",
        label: "Habilitar Cabeçalho",
        type: "boolean",
        defaultValue: true,
        group: "header",
      },
      {
        key: "logoUrl",
        label: "URL do Logotipo",
        type: "image",
        defaultValue: "",
        group: "header",
      },

      // Content
      {
        key: "title",
        label: "Título Principal",
        type: "text",
        defaultValue: "Descubra Seu Estilo Pessoal",
        group: "content",
      },
      {
        key: "subtitle",
        label: "Subtítulo",
        type: "textarea",
        defaultValue: "Responda algumas perguntas e descubra qual estilo combina mais com você!",
        group: "content",
      },
      {
        key: "description",
        label: "Descrição Detalhada",
        type: "rich-text",
        defaultValue:
          "<p>Este quiz foi desenvolvido para ajudar você a descobrir seu estilo único...</p>",
        group: "content",
      },
      {
        key: "buttonText",
        label: "Texto do Botão",
        type: "text",
        defaultValue: "Começar Quiz",
        group: "content",
      },

      // Style
      {
        key: "primaryColor",
        label: "Cor Primária",
        type: "color",
        defaultValue: "#B89B7A",
        group: "style",
      },
      {
        key: "textColor",
        label: "Cor do Texto",
        type: "color",
        defaultValue: "#333333",
        group: "style",
      },
      {
        key: "backgroundColor",
        label: "Cor de Fundo",
        type: "color",
        defaultValue: "#ffffff",
        group: "style",
      },
    ],
  },

  {
    type: "quiz-question",
    label: "Pergunta do Quiz",
    icon: HelpCircle,
    category: "quiz",
    description: "Pergunta completa com opções configuráveis",
    propertiesSchema: [
      // Header
      {
        key: "headerEnabled",
        label: "Habilitar Cabeçalho",
        type: "boolean",
        defaultValue: true,
        group: "header",
      },
      {
        key: "logoUrl",
        label: "URL do Logotipo",
        type: "image",
        defaultValue: "",
        group: "header",
      },
      {
        key: "showProgressBar",
        label: "Mostrar Barra de Progresso",
        type: "boolean",
        defaultValue: true,
        group: "header",
      },
      {
        key: "showBackButton",
        label: "Mostrar Botão Voltar",
        type: "boolean",
        defaultValue: true,
        group: "header",
      },
      {
        key: "progressValue",
        label: "Valor do Progresso (%)",
        type: "slider",
        defaultValue: 25,
        min: 0,
        max: 100,
        group: "header",
      },

      // Question
      {
        key: "questionText",
        label: "Texto da Pergunta",
        type: "rich-text",
        defaultValue: "Qual é o seu tipo de roupa favorita?",
        group: "question",
      },
      {
        key: "questionTextSize",
        label: "Tamanho da Fonte da Pergunta",
        type: "number",
        defaultValue: 28,
        group: "question",
      },
      {
        key: "questionTextColor",
        label: "Cor do Texto da Pergunta",
        type: "color",
        defaultValue: "#000000",
        group: "question",
      },
      {
        key: "questionTextAlign",
        label: "Alinhamento da Pergunta",
        type: "select",
        defaultValue: "center",
        options: [
          { label: "Esquerda", value: "left" },
          { label: "Centro", value: "center" },
          { label: "Direita", value: "right" },
        ],
        group: "question",
      },

      // Options Layout
      {
        key: "layout",
        label: "Layout das Opções",
        type: "select",
        defaultValue: "2-columns",
        options: [
          { label: "1 Coluna", value: "1-column" },
          { label: "2 Colunas", value: "2-columns" },
          { label: "3 Colunas", value: "3-columns" },
          { label: "4 Colunas", value: "4-columns" },
        ],
        group: "layout",
      },
      {
        key: "direction",
        label: "Direção das Opções",
        type: "select",
        defaultValue: "vertical",
        options: [
          { label: "Vertical", value: "vertical" },
          { label: "Horizontal", value: "horizontal" },
        ],
        group: "layout",
      },
      {
        key: "disposition",
        label: "Disposição da Opção",
        type: "select",
        defaultValue: "image-text",
        options: [
          { label: "Imagem + Texto", value: "image-text" },
          { label: "Texto + Imagem", value: "text-image" },
          { label: "Somente Texto", value: "text-only" },
          { label: "Somente Imagem", value: "image-only" },
        ],
        group: "layout",
      },

      // Options Content
      {
        key: "options",
        label: "Opções de Resposta",
        type: "array-of-objects",
        defaultValue: [],
        itemSchema: [
          {
            key: "id",
            label: "ID da Opção",
            type: "text",
            defaultValue: "",
            hidden: true,
          },
          {
            key: "text",
            label: "Texto da Opção",
            type: "rich-text",
            defaultValue: "Nova Opção",
          },
          {
            key: "imageUrl",
            label: "URL da Imagem",
            type: "image",
            defaultValue: "",
          },
          {
            key: "value",
            label: "Valor/Pontos",
            type: "text",
            defaultValue: "",
          },
          {
            key: "nextStepId",
            label: "Próxima Etapa ID",
            type: "text",
            defaultValue: "",
          },
        ],
        group: "options",
      },

      // Validation
      {
        key: "isMultipleChoice",
        label: "Múltipla Escolha",
        type: "boolean",
        defaultValue: false,
        description: "Permite selecionar múltiplas opções",
        group: "validation",
      },
      {
        key: "isRequired",
        label: "Obrigatório",
        type: "boolean",
        defaultValue: true,
        description: "Campo obrigatório para prosseguir",
        group: "validation",
      },
      {
        key: "autoProceed",
        label: "Auto-avançar",
        type: "boolean",
        defaultValue: false,
        description: "Avança automaticamente após seleção",
        group: "validation",
      },
      {
        key: "minSelections",
        label: "Mínimo de Seleções",
        type: "number",
        defaultValue: 1,
        group: "validation",
      },
      {
        key: "maxSelections",
        label: "Máximo de Seleções",
        type: "number",
        defaultValue: 3,
        group: "validation",
      },

      // Styling
      {
        key: "borderRadius",
        label: "Bordas das Opções",
        type: "select",
        defaultValue: "small",
        options: [
          { label: "Nenhuma", value: "none" },
          { label: "Pequena", value: "small" },
          { label: "Média", value: "medium" },
          { label: "Grande", value: "large" },
        ],
        group: "styling",
      },
      {
        key: "boxShadow",
        label: "Sombras",
        type: "select",
        defaultValue: "medium",
        options: [
          { label: "Nenhuma", value: "none" },
          { label: "Pequena", value: "small" },
          { label: "Média", value: "medium" },
          { label: "Grande", value: "large" },
        ],
        group: "styling",
      },
      {
        key: "spacing",
        label: "Espaçamento",
        type: "select",
        defaultValue: "medium",
        options: [
          { label: "Pequeno", value: "small" },
          { label: "Médio", value: "medium" },
          { label: "Grande", value: "large" },
        ],
        group: "styling",
      },
      {
        key: "optionStyle",
        label: "Estilo da Opção",
        type: "select",
        defaultValue: "card",
        options: [
          { label: "Simples", value: "simple" },
          { label: "Card", value: "card" },
          { label: "Moderno", value: "modern" },
          { label: "Minimal", value: "minimal" },
        ],
        group: "styling",
      },

      // Colors
      {
        key: "primaryColor",
        label: "Cor Primária",
        type: "color",
        defaultValue: "#B89B7A",
        group: "colors",
      },
      {
        key: "secondaryColor",
        label: "Cor Secundária",
        type: "color",
        defaultValue: "#ffffff",
        group: "colors",
      },
      {
        key: "borderColor",
        label: "Cor da Borda",
        type: "color",
        defaultValue: "#e5e7eb",
        group: "colors",
      },
      {
        key: "hoverColor",
        label: "Cor do Hover",
        type: "color",
        defaultValue: "#a08965",
        group: "colors",
      },

      // Advanced
      {
        key: "componentId",
        label: "ID do Componente",
        type: "text",
        defaultValue: "",
        group: "advanced",
      },
      {
        key: "maxWidth",
        label: "Largura Máxima (%)",
        type: "slider",
        defaultValue: 90,
        min: 30,
        max: 100,
        group: "advanced",
      },
    ],
  },

  {
    type: "quiz-progress",
    label: "Barra de Progresso",
    icon: Timer,
    category: "quiz",
    description: "Indicador visual do progresso do quiz",
    propertiesSchema: [
      {
        key: "currentStep",
        label: "Etapa Atual",
        type: "number",
        defaultValue: 1,
        group: "content",
      },
      {
        key: "totalSteps",
        label: "Total de Etapas",
        type: "number",
        defaultValue: 10,
        group: "content",
      },
      {
        key: "showNumbers",
        label: "Mostrar Números",
        type: "boolean",
        defaultValue: true,
        group: "content",
      },
      {
        key: "progressColor",
        label: "Cor do Progresso",
        type: "color",
        defaultValue: "#B89B7A",
        group: "style",
      },
      {
        key: "backgroundColor",
        label: "Cor de Fundo",
        type: "color",
        defaultValue: "#e5e7eb",
        group: "style",
      },
      {
        key: "height",
        label: "Altura (px)",
        type: "number",
        defaultValue: 8,
        group: "style",
      },
    ],
  },

  // BLOCOS DE RESULTADO
  {
    type: "quiz-result",
    label: "Resultado do Quiz",
    icon: Award,
    category: "result",
    description: "Exibição do resultado personalizado",
    propertiesSchema: [
      // Content
      {
        key: "resultTitle",
        label: "Título do Resultado",
        type: "text",
        defaultValue: "Seu Resultado",
        group: "content",
      },
      {
        key: "resultSubtitle",
        label: "Subtítulo do Resultado",
        type: "text",
        defaultValue: "Parabéns! Aqui está seu resultado personalizado",
        group: "content",
      },
      {
        key: "resultDescription",
        label: "Descrição do Resultado",
        type: "rich-text",
        defaultValue: "<p>Baseado em suas respostas...</p>",
        group: "content",
      },
      {
        key: "resultImage",
        label: "Imagem do Resultado",
        type: "image",
        defaultValue: "",
        group: "content",
      },

      // Actions
      {
        key: "showShareButton",
        label: "Mostrar Botão Compartilhar",
        type: "boolean",
        defaultValue: true,
        group: "actions",
      },
      {
        key: "showRetakeButton",
        label: "Mostrar Botão Refazer",
        type: "boolean",
        defaultValue: true,
        group: "actions",
      },
      {
        key: "ctaButtonText",
        label: "Texto do CTA Principal",
        type: "text",
        defaultValue: "Ver Oferta Personalizada",
        group: "actions",
      },
      {
        key: "ctaButtonLink",
        label: "Link do CTA Principal",
        type: "url",
        defaultValue: "#",
        group: "actions",
      },

      // Style
      {
        key: "primaryColor",
        label: "Cor Primária",
        type: "color",
        defaultValue: "#B89B7A",
        group: "style",
      },
      {
        key: "backgroundColor",
        label: "Cor de Fundo",
        type: "color",
        defaultValue: "#ffffff",
        group: "style",
      },
    ],
  },

  // BLOCOS DE OFERTA
  {
    type: "product-offer",
    label: "Oferta de Produto",
    icon: Gift,
    category: "offer",
    description: "Apresentação de produto ou serviço",
    propertiesSchema: [
      // Product
      {
        key: "productName",
        label: "Nome do Produto",
        type: "text",
        defaultValue: "Produto Exclusivo",
        group: "product",
      },
      {
        key: "productDescription",
        label: "Descrição do Produto",
        type: "rich-text",
        defaultValue: "<p>Descrição detalhada do produto...</p>",
        group: "product",
      },
      {
        key: "productImage",
        label: "Imagem do Produto",
        type: "image",
        defaultValue: "",
        group: "product",
      },

      // Pricing
      {
        key: "originalPrice",
        label: "Preço Original",
        type: "text",
        defaultValue: "R$ 197,00",
        group: "pricing",
      },
      {
        key: "salePrice",
        label: "Preço Promocional",
        type: "text",
        defaultValue: "R$ 97,00",
        group: "pricing",
      },
      {
        key: "showDiscount",
        label: "Mostrar Desconto",
        type: "boolean",
        defaultValue: true,
        group: "pricing",
      },

      // CTA
      {
        key: "ctaText",
        label: "Texto do Botão",
        type: "text",
        defaultValue: "Comprar Agora",
        group: "cta",
      },
      {
        key: "ctaLink",
        label: "Link de Compra",
        type: "url",
        defaultValue: "#",
        group: "cta",
      },

      // Features
      {
        key: "features",
        label: "Características do Produto",
        type: "array-of-objects",
        defaultValue: [],
        itemSchema: [
          {
            key: "id",
            label: "ID",
            type: "text",
            defaultValue: "",
            hidden: true,
          },
          {
            key: "text",
            label: "Característica",
            type: "text",
            defaultValue: "Nova característica",
          },
          {
            key: "icon",
            label: "Ícone (opcional)",
            type: "text",
            defaultValue: "",
          },
        ],
        group: "features",
      },
    ],
  },

  {
    type: "testimonials",
    label: "Depoimentos",
    icon: Users,
    category: "social-proof",
    description: "Seção de depoimentos de clientes",
    propertiesSchema: [
      {
        key: "title",
        label: "Título da Seção",
        type: "text",
        defaultValue: "O que nossos clientes dizem",
        group: "content",
      },
      {
        key: "testimonials",
        label: "Depoimentos",
        type: "array-of-objects",
        defaultValue: [],
        itemSchema: [
          {
            key: "id",
            label: "ID",
            type: "text",
            defaultValue: "",
            hidden: true,
          },
          {
            key: "name",
            label: "Nome do Cliente",
            type: "text",
            defaultValue: "Cliente Satisfeito",
          },
          {
            key: "text",
            label: "Depoimento",
            type: "textarea",
            defaultValue: "Excelente produto!",
          },
          {
            key: "image",
            label: "Foto do Cliente",
            type: "image",
            defaultValue: "",
          },
          {
            key: "rating",
            label: "Avaliação (1-5)",
            type: "number",
            defaultValue: 5,
          },
        ],
        group: "content",
      },
      {
        key: "layout",
        label: "Layout dos Depoimentos",
        type: "select",
        defaultValue: "2-columns",
        options: [
          { label: "1 Coluna", value: "1-column" },
          { label: "2 Colunas", value: "2-columns" },
          { label: "3 Colunas", value: "3-columns" },
        ],
        group: "layout",
      },
    ],
  },

  {
    type: "urgency-timer",
    label: "Contador de Urgência",
    icon: Timer,
    category: "urgency",
    description: "Timer de contagem regressiva para criar urgência",
    propertiesSchema: [
      {
        key: "title",
        label: "Título do Timer",
        type: "text",
        defaultValue: "Oferta termina em:",
        group: "content",
      },
      {
        key: "endTime",
        label: "Data/Hora de Término",
        type: "text",
        defaultValue: "2024-12-31 23:59:59",
        description: "Formato: YYYY-MM-DD HH:MM:SS",
        group: "content",
      },
      {
        key: "showDays",
        label: "Mostrar Dias",
        type: "boolean",
        defaultValue: true,
        group: "display",
      },
      {
        key: "showHours",
        label: "Mostrar Horas",
        type: "boolean",
        defaultValue: true,
        group: "display",
      },
      {
        key: "showMinutes",
        label: "Mostrar Minutos",
        type: "boolean",
        defaultValue: true,
        group: "display",
      },
      {
        key: "showSeconds",
        label: "Mostrar Segundos",
        type: "boolean",
        defaultValue: true,
        group: "display",
      },
      {
        key: "primaryColor",
        label: "Cor Principal",
        type: "color",
        defaultValue: "#dc2626",
        group: "style",
      },
    ],
  },

  {
    type: "faq-section",
    label: "Perguntas Frequentes",
    icon: HelpCircle,
    category: "support",
    description: "Seção de perguntas e respostas frequentes",
    propertiesSchema: [
      {
        key: "title",
        label: "Título da Seção",
        type: "text",
        defaultValue: "Perguntas Frequentes",
        group: "content",
      },
      {
        key: "faqs",
        label: "Perguntas e Respostas",
        type: "array-of-objects",
        defaultValue: [],
        itemSchema: [
          {
            key: "id",
            label: "ID",
            type: "text",
            defaultValue: "",
            hidden: true,
          },
          {
            key: "question",
            label: "Pergunta",
            type: "text",
            defaultValue: "Sua pergunta aqui?",
          },
          {
            key: "answer",
            label: "Resposta",
            type: "rich-text",
            defaultValue: "Sua resposta aqui...",
          },
        ],
        group: "content",
      },
      {
        key: "expandMultiple",
        label: "Permitir Múltiplas Abertas",
        type: "boolean",
        defaultValue: false,
        group: "behavior",
      },
    ],
  },

  {
    type: "quiz-step",
    label: "Etapa de Quiz Avançada",
    icon: LayoutGrid,
    category: "quiz",
    description: "Etapa completa de quiz com todas as configurações avançadas baseadas no modelo",
    propertiesSchema: [
      // Header Properties (Integradas)
      {
        key: "headerEnabled",
        label: "Habilitar Cabeçalho",
        type: "boolean",
        defaultValue: true,
        group: "header",
      },
      {
        key: "logoUrl",
        label: "URL do Logotipo",
        type: "image",
        defaultValue:
          "https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png",
        group: "header",
      },
      {
        key: "showProgressBar",
        label: "Mostrar Barra de Progresso",
        type: "boolean",
        defaultValue: true,
        group: "header",
      },
      {
        key: "showBackButton",
        label: "Mostrar Botão Voltar",
        type: "boolean",
        defaultValue: true,
        group: "header",
      },

      // Question Properties
      {
        key: "questionText",
        label: "Texto da Pergunta",
        type: "text",
        defaultValue: "2- Qual é o seu tipo de roupa favorita?",
        group: "question",
      },
      {
        key: "questionTextColor",
        label: "Cor do Texto da Pergunta",
        type: "color",
        defaultValue: "#000000",
        group: "question",
      },
      {
        key: "questionTextSize",
        label: "Tamanho da Fonte da Pergunta",
        type: "number",
        defaultValue: 28,
        group: "question",
      },
      {
        key: "questionTextAlign",
        label: "Alinhamento do Texto da Pergunta",
        type: "select",
        defaultValue: "center",
        options: [
          { label: "Esquerda", value: "left" },
          { label: "Centro", value: "center" },
          { label: "Direita", value: "right" },
        ],
        group: "question",
      },

      // Options Layout & Content
      {
        key: "layout",
        label: "Layout das Opções",
        type: "select",
        defaultValue: "2-columns",
        options: [
          { label: "1 Coluna", value: "1-column" },
          { label: "2 Colunas", value: "2-columns" },
          { label: "3 Colunas", value: "3-columns" },
        ],
        group: "layout",
      },
      {
        key: "direction",
        label: "Direção das Opções",
        type: "select",
        defaultValue: "vertical",
        options: [
          { label: "Vertical", value: "vertical" },
          { label: "Horizontal", value: "horizontal" },
        ],
        group: "layout",
      },
      {
        key: "disposition",
        label: "Disposição da Opção",
        type: "select",
        defaultValue: "image-text",
        options: [
          { label: "Imagem | Texto", value: "image-text" },
          { label: "Texto | Imagem", value: "text-image" },
          { label: "Somente Texto", value: "text-only" },
          { label: "Somente Imagem", value: "image-only" },
        ],
        group: "layout",
      },
      {
        key: "options",
        label: "Opções de Resposta",
        type: "array-of-objects",
        defaultValue: [],
        itemSchema: [
          {
            key: "id",
            label: "ID da Opção",
            type: "text",
            defaultValue: "",
            hidden: true,
          },
          {
            key: "text",
            label: "Texto da Opção",
            type: "text",
            defaultValue: "Nova Opção",
          },
          {
            key: "imageUrl",
            label: "URL da Imagem",
            type: "image",
            defaultValue: "",
          },
          {
            key: "nextStepId",
            label: "Ir para Etapa",
            type: "text",
            defaultValue: "",
          },
        ],
        group: "options",
      },

      // Validations
      {
        key: "isMultipleChoice",
        label: "Múltipla Escolha",
        type: "boolean",
        defaultValue: false,
        description: "O usuário poderá selecionar múltiplas opções.",
        group: "validation",
      },
      {
        key: "isRequired",
        label: "Obrigatório",
        type: "boolean",
        defaultValue: true,
        description: "O usuário é obrigado a selecionar alguma opção.",
        group: "validation",
      },
      {
        key: "autoProceed",
        label: "Auto-avançar",
        type: "boolean",
        defaultValue: false,
        description:
          "Avança para a próxima etapa automaticamente após seleção (se não for múltipla escolha).",
        group: "validation",
      },

      // Styling
      {
        key: "borderRadius",
        label: "Bordas",
        type: "select",
        defaultValue: "small",
        options: [
          { label: "Nenhuma", value: "none" },
          { label: "Pequena", value: "small" },
          { label: "Média", value: "medium" },
          { label: "Grande", value: "large" },
        ],
        group: "style",
      },
      {
        key: "boxShadow",
        label: "Sombras",
        type: "select",
        defaultValue: "medium",
        options: [
          { label: "Nenhuma", value: "none" },
          { label: "Pequena", value: "small" },
          { label: "Média", value: "medium" },
          { label: "Grande", value: "large" },
        ],
        group: "style",
      },
      {
        key: "spacing",
        label: "Espaçamento",
        type: "select",
        defaultValue: "small",
        options: [
          { label: "Pequeno", value: "small" },
          { label: "Médio", value: "medium" },
          { label: "Grande", value: "large" },
        ],
        group: "style",
      },
      {
        key: "detail",
        label: "Detalhe",
        type: "select",
        defaultValue: "none",
        options: [
          { label: "Nenhum", value: "none" },
          { label: "Linha", value: "line" },
          { label: "Ponto", value: "dot" },
        ],
        group: "style",
      },
      {
        key: "optionStyle",
        label: "Estilo da Opção",
        type: "select",
        defaultValue: "simple",
        options: [
          { label: "Simples", value: "simple" },
          { label: "Card", value: "card" },
        ],
        group: "style",
      },

      // Customization (Colors)
      {
        key: "primaryColor",
        label: "Cor Primária (Fundo da Opção)",
        type: "color",
        defaultValue: "#B89B7A",
        group: "colors",
      },
      {
        key: "secondaryColor",
        label: "Cor Secundária (Texto da Opção)",
        type: "color",
        defaultValue: "#ffffff",
        group: "colors",
      },
      {
        key: "borderColor",
        label: "Cor da Borda",
        type: "color",
        defaultValue: "#e5e7eb",
        group: "colors",
      },

      // Advanced
      {
        key: "componentId",
        label: "ID do Componente",
        type: "text",
        defaultValue: "",
        group: "advanced",
      },
      {
        key: "maxWidth",
        label: "Tamanho Máximo do Conteúdo (%)",
        type: "slider",
        defaultValue: 100,
        min: 10,
        max: 100,
        group: "advanced",
      },
    ],
  },

  // Fim das definições de blocos
];

// =====================================================================
// CATEGORIAS E GRUPOS
// =====================================================================

export const BLOCK_CATEGORIES = {
  basic: {
    label: "Básicos",
    description: "Componentes fundamentais",
    blocks: ["text", "rich-text", "heading", "button", "image", "spacer"],
  },
  quiz: {
    label: "Quiz",
    description: "Componentes específicos para quiz",
    blocks: ["quiz-intro", "quiz-question", "quiz-step", "quiz-progress"],
  },
  result: {
    label: "Resultado",
    description: "Exibição de resultados",
    blocks: ["quiz-result"],
  },
  offer: {
    label: "Oferta",
    description: "Produtos e vendas",
    blocks: ["product-offer"],
  },
  "social-proof": {
    label: "Prova Social",
    description: "Depoimentos e validação",
    blocks: ["testimonials"],
  },
  urgency: {
    label: "Urgência",
    description: "Elementos de escassez",
    blocks: ["urgency-timer"],
  },
  support: {
    label: "Suporte",
    description: "Ajuda e FAQ",
    blocks: ["faq-section"],
  },
};

export const PROPERTY_GROUPS = {
  header: { label: "Cabeçalho", icon: Heading1 },
  content: { label: "Conteúdo", icon: Type },
  question: { label: "Pergunta", icon: HelpCircle },
  options: { label: "Opções", icon: LayoutGrid },
  layout: { label: "Layout", icon: LayoutGrid },
  validation: { label: "Validação", icon: Square },
  styling: { label: "Estilo Visual", icon: Palette },
  colors: { label: "Cores", icon: Palette },
  advanced: { label: "Avançado", icon: Settings },
  product: { label: "Produto", icon: Gift },
  pricing: { label: "Preços", icon: Target },
  cta: { label: "Call to Action", icon: RectangleHorizontal },
  features: { label: "Características", icon: Award },
  actions: { label: "Ações", icon: Play },
  style: { label: "Estilo", icon: Palette },
  display: { label: "Exibição", icon: Monitor },
  behavior: { label: "Comportamento", icon: Settings },
};

// Helper functions
export const getBlockDefinition = (type: string) => {
  return funnelBlockDefinitions.find(def => def.type === type);
};

export const getBlocksByCategory = (category: string) => {
  return funnelBlockDefinitions.filter(def => def.category === category);
};

export const getAllBlockTypes = () => {
  return funnelBlockDefinitions.map(def => def.type);
};

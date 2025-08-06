import { BlockDefinition } from "@/types/editor";
import {
  BarChart,
  Check,
  Clock,
  CreditCard,
  Heading,
  Image,
  Minus,
  MousePointer,
  Space,
  Tag,
  TrendingUp,
  Type,
  Zap,
} from "lucide-react";
import React from "react";

/**
 * ENHANCED BLOCK REGISTRY - APENAS COMPONENTES PRINCIPAIS
 * ✅ Foco nos componentes mais usados e estáveis
 * ✅ Sem duplicatas ou imports quebrados
 * ✅ Compatível com stepTemplatesMapping atualizado
 */

// === IMPORTS DE COMPONENTES PRINCIPAIS ===

// Componentes Inline mais usados
import BadgeInlineBlock from "../components/editor/blocks/inline/BadgeInlineBlock";
import ButtonInlineBlock from "../components/editor/blocks/inline/ButtonInlineBlock";
import CountdownInlineBlock from "../components/editor/blocks/inline/CountdownInlineBlock";
import CTAInlineBlock from "../components/editor/blocks/inline/CTAInlineBlock";
import DividerInlineBlock from "../components/editor/blocks/inline/DividerInlineBlock";
import HeadingInlineBlock from "../components/editor/blocks/inline/HeadingInlineBlock";
import ImageDisplayInlineBlock from "../components/editor/blocks/inline/ImageDisplayInlineBlock";
import PricingCardInlineBlock from "../components/editor/blocks/inline/PricingCardInlineBlock";
import ProgressInlineBlock from "../components/editor/blocks/inline/ProgressInlineBlock";
import SpacerInlineBlock from "../components/editor/blocks/inline/SpacerInlineBlock";
import StatInlineBlock from "../components/editor/blocks/inline/StatInlineBlock";
import TextInlineBlock from "../components/editor/blocks/inline/TextInlineBlock";

// Componentes específicos da Etapa 1
import DecorativeBarInlineBlock from "../components/editor/blocks/DecorativeBarInlineBlock";
import FormInputBlock from "../components/editor/blocks/FormInputBlock";
import LegalNoticeInlineBlock from "../components/editor/blocks/LegalNoticeInlineBlock";
import QuizIntroHeaderBlock from "../components/editor/blocks/QuizIntroHeaderBlock";

// Componentes de Quiz - para compatibilidade com DynamicStepTemplate
import QuizResultsBlock from "../components/blocks/quiz/QuizResultsBlock";
import StyleResultsBlock from "../components/blocks/quiz/StyleResultsBlock";
import FinalStepEditor from "../components/editor/blocks/FinalStepEditor";
import OptionsGridBlock from "../components/editor/blocks/OptionsGridBlock";
import QuizProgressBlock from "../components/editor/blocks/QuizProgressBlock";
import QuizResultsEditor from "../components/editor/blocks/QuizResultsEditor";
import QuizStepBlock from "../components/editor/blocks/QuizStepBlock";
import StyleResultsEditor from "../components/editor/blocks/StyleResultsEditor";

// === REGISTRY PRINCIPAL - SEM DUPLICATAS ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  text: TextInlineBlock,
  "text-inline": TextInlineBlock,
  heading: HeadingInlineBlock,
  image: ImageDisplayInlineBlock,
  "image-display-inline": ImageDisplayInlineBlock,

  // Interactive Elements
  button: ButtonInlineBlock,
  "button-inline": ButtonInlineBlock,
  cta: CTAInlineBlock,

  // Layout and Design
  spacer: SpacerInlineBlock,
  divider: DividerInlineBlock,
  "decorative-bar-inline": DecorativeBarInlineBlock,
  badge: BadgeInlineBlock,

  // Commerce and Pricing
  "pricing-card": PricingCardInlineBlock,
  countdown: CountdownInlineBlock,

  // Data and Stats
  progress: ProgressInlineBlock,
  stat: StatInlineBlock,

  // Quiz Components específicos
  "quiz-intro-header": QuizIntroHeaderBlock,
  "quiz-step": QuizStepBlock,
  "quiz-progress": QuizProgressBlock,
  "options-grid": OptionsGridBlock,
  "quiz-results": QuizResultsEditor,
  "quiz-results-block": QuizResultsBlock,
  "style-results": StyleResultsEditor,
  "style-results-block": StyleResultsBlock,
  "final-step": FinalStepEditor,

  // Form Components
  "form-input": FormInputBlock,
  "legal-notice-inline": LegalNoticeInlineBlock,
};

/**
 * Obter componente por tipo
 */
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return ENHANCED_BLOCK_REGISTRY[type] || null;
};

/**
 * Listar todos os tipos disponíveis
 */
export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

/**
 * Verificar se um tipo de bloco existe
 */
export const blockTypeExists = (type: string): boolean => {
  return type in ENHANCED_BLOCK_REGISTRY;
};

/**
 * Gerar definições de blocos para o sidebar
 */
export const generateBlockDefinitions = (): BlockDefinition[] => {
  return [
    // Text and Content
    {
      type: "text",
      name: "TextInlineBlock",
      label: "Texto",
      category: "Conteúdo",
      description: "Bloco de texto editável",
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY["text"],
      properties: {},
      defaultProps: { content: "Digite seu texto aqui..." },
    },
    {
      type: "text-inline",
      name: "TextInlineBlock",
      label: "Texto Inline",
      category: "Conteúdo",
      description: "Bloco de texto inline editável",
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY["text-inline"],
      properties: {},
      defaultProps: { content: "Digite seu texto aqui..." },
    },
    {
      type: "heading",
      name: "HeadingInlineBlock",
      label: "Título",
      category: "Conteúdo",
      description: "Título com diferentes tamanhos",
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY["heading"],
      properties: {},
      defaultProps: { content: "Seu título aqui", level: 2 },
    },
    {
      type: "image",
      name: "ImageDisplayInlineBlock",
      label: "Imagem",
      category: "Mídia",
      description: "Exibição de imagens",
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY["image"],
      properties: {},
      defaultProps: { src: "", alt: "Imagem" },
    },
    {
      type: "image-display-inline",
      name: "ImageDisplayInlineBlock",
      label: "Imagem Inline",
      category: "Mídia",
      description: "Exibição de imagens inline",
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY["image-display-inline"],
      properties: {},
      defaultProps: { src: "", alt: "Imagem" },
    },

    // Interactive Elements
    {
      type: "button",
      name: "ButtonInlineBlock",
      label: "Botão",
      category: "Interativo",
      description: "Botão clicável",
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY["button"],
      properties: {},
      defaultProps: { text: "Clique aqui", variant: "primary" },
    },
    {
      type: "button-inline",
      name: "ButtonInlineBlock",
      label: "Botão Inline",
      category: "Interativo",
      description: "Botão clicável inline",
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY["button-inline"],
      properties: {},
      defaultProps: { text: "Clique aqui", variant: "primary" },
    },
    {
      type: "cta",
      name: "CTAInlineBlock",
      label: "Call to Action",
      category: "Interativo",
      description: "Chamada para ação",
      icon: Zap,
      component: ENHANCED_BLOCK_REGISTRY["cta"],
      properties: {},
      defaultProps: { title: "Ação Especial", description: "Aproveite agora!" },
    },

    // Layout and Design
    {
      type: "spacer",
      name: "SpacerInlineBlock",
      label: "Espaçador",
      category: "Layout",
      description: "Espaçamento vertical",
      icon: Space,
      component: ENHANCED_BLOCK_REGISTRY["spacer"],
      properties: {},
      defaultProps: { height: 40 },
    },
    {
      type: "divider",
      name: "DividerInlineBlock",
      label: "Divisor",
      category: "Layout",
      description: "Linha divisória",
      icon: Minus,
      component: ENHANCED_BLOCK_REGISTRY["divider"],
      properties: {},
      defaultProps: { style: "solid" },
    },
    {
      type: "decorative-bar-inline",
      name: "DecorativeBarInlineBlock",
      label: "Barra Decorativa",
      category: "Layout",
      description: "Barra decorativa dourada",
      icon: Minus,
      component: ENHANCED_BLOCK_REGISTRY["decorative-bar-inline"],
      properties: {},
      defaultProps: { color: "#B89B7A", height: 4 },
    },
    {
      type: "badge",
      name: "BadgeInlineBlock",
      label: "Badge",
      category: "Design",
      description: "Etiqueta colorida",
      icon: Tag,
      component: ENHANCED_BLOCK_REGISTRY["badge"],
      properties: {},
      defaultProps: { text: "Novo", variant: "primary" },
    },

    // Quiz Components
    {
      type: "quiz-intro-header",
      name: "QuizIntroHeaderBlock",
      label: "Cabeçalho do Quiz",
      category: "Quiz",
      description: "Cabeçalho com logo e progresso",
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY["quiz-intro-header"],
      properties: {},
      defaultProps: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo",
        progressValue: 0,
      },
    },
    {
      type: "quiz-results-block",
      name: "QuizResultsBlock",
      label: "Resultados do Quiz",
      category: "Quiz",
      description: "Exibe os resultados do quiz com pontuações e categorias",
      icon: TrendingUp,
      component: ENHANCED_BLOCK_REGISTRY["quiz-results-block"],
      properties: {},
      defaultProps: {
        result: {
          id: "default-result",
          title: "Seu Resultado",
          description: "Parabéns por completar o quiz!",
          category: "Geral",
          minScore: 0,
          maxScore: 100,
          displayOrder: 1,
          imageUrl: undefined,
        },
        showScores: true,
        categoryScores: [],
        onReset: undefined,
        onShare: undefined,
      },
    },
    {
      type: "style-results-block",
      name: "StyleResultsBlock",
      label: "Resultados de Estilo",
      category: "Quiz",
      description: "Exibe os resultados do quiz de estilo com guia personalizado",
      icon: TrendingUp,
      component: ENHANCED_BLOCK_REGISTRY["style-results-block"],
      properties: {},
      defaultProps: {
        result: {
          id: "style-Natural",
          title: "Natural",
          description:
            "Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
          category: "Natural",
          minScore: 0,
          maxScore: 100,
          displayOrder: 1,
        },
        categoryScores: {
          Natural: 10,
          Clássico: 7,
          Elegante: 5,
        },
        showAllStyles: false,
        showGuideImage: true,
        guideImageUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
      },
    },
    {
      type: "final-step",
      name: "FinalStepEditor",
      label: "Etapa Final (21)",
      category: "Quiz",
      description: "Etapa final do funil com resultado de estilo",
      icon: Check,
      component: ENHANCED_BLOCK_REGISTRY["final-step"],
      properties: {},
      defaultProps: {
        stepNumber: 21,
        title: "Seu Estilo Predominante",
        subtitle: "Descubra seu estilo de moda único",
        styleResult: {
          selectedStyle: "Natural",
          showAllStyles: false,
          showGuideImage: true,
        },
      },
    },

    // Form Components
    {
      type: "form-input",
      name: "FormInputBlock",
      label: "Campo de Entrada",
      category: "Formulário",
      description: "Campo de entrada de dados",
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY["form-input"],
      properties: {},
      defaultProps: {
        label: "Campo de Input",
        placeholder: "Digite aqui...",
        required: false,
      },
    },
    {
      type: "legal-notice-inline",
      name: "LegalNoticeInlineBlock",
      label: "Aviso Legal",
      category: "Formulário",
      description: "Aviso legal e termos",
      icon: Tag,
      component: ENHANCED_BLOCK_REGISTRY["legal-notice-inline"],
      properties: {},
      defaultProps: {
        privacyText: "Política de privacidade",
        copyrightText: "© 2025 Todos os direitos reservados",
      },
    },

    // Commerce and Pricing
    {
      type: "pricing-card",
      name: "PricingCardInlineBlock",
      label: "Card de Preço",
      category: "E-commerce",
      description: "Card de preços com recursos",
      icon: CreditCard,
      component: ENHANCED_BLOCK_REGISTRY["pricing-card"],
      properties: {},
      defaultProps: { title: "Plano Premium", price: "R$ 97", features: [] },
    },
    {
      type: "countdown",
      name: "CountdownInlineBlock",
      label: "Contador Regressivo",
      category: "E-commerce",
      description: "Timer de urgência",
      icon: Clock,
      component: ENHANCED_BLOCK_REGISTRY["countdown"],
      properties: {},
      defaultProps: { targetDate: "2024-12-31" },
    },

    // Data and Stats
    {
      type: "progress",
      name: "ProgressInlineBlock",
      label: "Barra de Progresso",
      category: "Dados",
      description: "Indicador de progresso",
      icon: TrendingUp,
      component: ENHANCED_BLOCK_REGISTRY["progress"],
      properties: {},
      defaultProps: { value: 75, max: 100 },
    },
    {
      type: "stat",
      name: "StatInlineBlock",
      label: "Estatística",
      category: "Dados",
      description: "Número com destaque",
      icon: BarChart,
      component: ENHANCED_BLOCK_REGISTRY["stat"],
      properties: {},
      defaultProps: { value: "1000+", label: "Clientes satisfeitos" },
    },
  ];
};

/**
 * Obter estatísticas do registry
 */
export const getRegistryStats = () => {
  const totalComponents = Object.keys(ENHANCED_BLOCK_REGISTRY).length;
  const definitions = generateBlockDefinitions();
  const categoriesSet = new Set(definitions.map(d => d.category));
  const categories = Array.from(categoriesSet);

  return {
    totalComponents,
    totalDefinitions: definitions.length,
    categories: categories.length,
    categoriesList: categories,
  };
};

/**
 * Registry padrão para compatibilidade
 */
export default ENHANCED_BLOCK_REGISTRY;

import { BlockDefinition } from "@/types/editor";
import {
  BarChart,
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

// Componentes de Quiz - para compatibilidade com DynamicStepTemplate
import OptionsGridBlock from "../components/editor/blocks/OptionsGridBlock";
import QuizProgressBlock from "../components/editor/blocks/QuizProgressBlock";
import QuizStepBlock from "../components/editor/blocks/QuizStepBlock";

// === REGISTRY PRINCIPAL - SEM DUPLICATAS ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  text: TextInlineBlock,
  heading: HeadingInlineBlock,
  image: ImageDisplayInlineBlock,

  // Interactive Elements
  button: ButtonInlineBlock,
  cta: CTAInlineBlock,

  // Layout and Design
  spacer: SpacerInlineBlock,
  divider: DividerInlineBlock,
  badge: BadgeInlineBlock,

  // Commerce and Pricing
  "pricing-card": PricingCardInlineBlock,
  countdown: CountdownInlineBlock,

  // Data and Stats
  progress: ProgressInlineBlock,
  stat: StatInlineBlock,

  // Quiz Components (para DynamicStepTemplate)
  "quiz-step": QuizStepBlock,
  "quiz-progress": QuizProgressBlock,
  "options-grid": OptionsGridBlock,
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

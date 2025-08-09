import { BlockDefinition } from "@/types/editor";
import { Heading, Image, Minus, MousePointer, Type } from "lucide-react";
import React from "react";

/**
 * ENHANCED BLOCK REGISTRY - APENAS COMPONENTES PRINCIPAIS
 * ✅ Foco nos componentes mais usados e estáveis
 * ✅ Sem duplicatas ou imports quebrados
 * ✅ Compatível com stepTemplatesMapping atualizado
 */

// === IMPORTS DE COMPONENTES PRINCIPAIS ===

// Componentes Inline existentes
import ButtonInlineFixed from "../components/blocks/inline/ButtonInlineFixed";
import CountdownInlineBlock from "../components/blocks/inline/CountdownInlineBlock";
import DecorativeBarInline from "../components/blocks/inline/DecorativeBarInline";
import DividerInlineBlock from "../components/blocks/inline/DividerInlineBlock";
import HeadingInline from "../components/blocks/inline/HeadingInline";
import ImageDisplayInline from "../components/blocks/inline/ImageDisplayInline";
import ImageDisplayInlineBlock from "../components/blocks/inline/ImageDisplayInlineBlock";
import LegalNoticeInline from "../components/blocks/inline/LegalNoticeInline";
import PricingCardInlineBlock from "../components/blocks/inline/PricingCardInlineBlock";
import TextInline from "../components/blocks/inline/TextInline";

// Componentes Editor Blocks
import DecorativeBarInlineBlock from "../components/editor/blocks/DecorativeBarInlineBlock";
import FinalStepEditor from "../components/editor/blocks/FinalStepEditor";
import FormInputBlock from "../components/editor/blocks/FormInputBlock";
import HeadingInlineBlock from "../components/editor/blocks/HeadingInlineBlock";
import LegalNoticeInlineBlock from "../components/editor/blocks/LegalNoticeInlineBlock";
import OptionsGridBlock from "../components/editor/blocks/OptionsGridBlock";
import QuizOptionBlock from "../components/editor/blocks/QuizOptionBlock";
import QuizIntroHeaderBlock from "../components/editor/blocks/QuizIntroHeaderBlock";
import QuizProgressBlock from "../components/editor/blocks/QuizProgressBlock";
import QuizResultsEditor from "../components/editor/blocks/QuizResultsEditor";
import SpacerInlineBlock from "../components/editor/blocks/SpacerInlineBlock";
import StyleResultsEditor from "../components/editor/blocks/StyleResultsEditor";
import TextInlineBlock from "../components/editor/blocks/TextInlineBlock";

// === REGISTRY PRINCIPAL - SEM DUPLICATAS ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  "text-inline": TextInlineBlock,
  "heading-inline": HeadingInlineBlock,
  "image-display-inline": ImageDisplayInlineBlock,

  // Quiz Components
  "quiz-intro-header": QuizIntroHeaderBlock,
  "quiz-header": QuizIntroHeaderBlock,
  "form-input": FormInputBlock,

  // Interactive Elements
  "button-inline": ButtonInlineFixed,
  "decorative-bar-inline": DecorativeBarInlineBlock,

  // Layout and Design
  divider: DividerInlineBlock,
  spacer: SpacerInlineBlock,

  // Commerce and Pricing
  "pricing-card": PricingCardInlineBlock,
  countdown: CountdownInlineBlock,

  // Legal
  "legal-notice-inline": LegalNoticeInlineBlock,

  // Quiz Advanced
  "options-grid": OptionsGridBlock,
  "quiz-option": QuizOptionBlock,
  "quiz-progress": QuizProgressBlock,
  "quiz-results": QuizResultsEditor,
  "style-results": StyleResultsEditor,
  "final-step": FinalStepEditor,

  // Legacy inline components (para compatibilidade)
  text: TextInline,
  heading: HeadingInline,
  button: ButtonInlineFixed,
  image: ImageDisplayInline,
  "decorative-bar": DecorativeBarInline,
  "legal-notice": LegalNoticeInline,
};

/**
 * Obter componente por tipo
 */
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  const component = ENHANCED_BLOCK_REGISTRY[type];

  if (!component) {
    console.warn(`⚠️ Componente não registrado: ${type}`);
    console.log("📋 Componentes disponíveis:", Object.keys(ENHANCED_BLOCK_REGISTRY));
  }

  return component || null;
};

/**
 * Listar todos os tipos disponíveis
 */
export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

/**
 * Alias para compatibilidade com editorBlocksMapping
 */
export const getAllBlockTypes = getAvailableBlockTypes;

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
    {
      type: "text-inline",
      name: "Texto",
      icon: Type,
      category: "content",
      description: "Adicionar texto formatado",
      component: TextInline,
      label: "Texto",
      properties: {},
      defaultProps: {},
    },
    {
      type: "heading-inline",
      name: "Título",
      icon: Heading,
      category: "content",
      description: "Adicionar título",
      component: HeadingInline,
      label: "Título",
      properties: {},
      defaultProps: {},
    },
    {
      type: "button-inline",
      name: "Botão",
      icon: MousePointer,
      category: "interactive",
      description: "Botão clicável",
      component: ButtonInlineFixed,
      label: "Botão",
      properties: {},
      defaultProps: {},
    },
    {
      type: "image-display-inline",
      name: "Imagem",
      icon: Image,
      category: "media",
      description: "Exibir imagem",
      component: ImageDisplayInline,
      label: "Imagem",
      properties: {},
      defaultProps: {},
    },
    {
      type: "decorative-bar-inline",
      name: "Barra Decorativa",
      icon: Minus,
      category: "design",
      description: "Barra decorativa colorida",
      component: DecorativeBarInline,
      label: "Barra Decorativa",
      properties: {},
      defaultProps: {},
    },
  ];
};

/**
 * Obter definição de um bloco específico (para compatibilidade)
 */
export const getBlockDefinition = (type: string) => {
  const definitions = generateBlockDefinitions();
  return definitions.find(def => def.type === type) || null;
};

/**
 * Obter estatísticas do registry
 */
export const getRegistryStats = () => {
  const types = Object.keys(ENHANCED_BLOCK_REGISTRY);
  const definitions = generateBlockDefinitions();
  const categories = Array.from(new Set(definitions.map(def => def.category)));

  return {
    totalBlocks: types.length,
    categories,
    types,
  };
};

export default ENHANCED_BLOCK_REGISTRY;

import { BlockDefinition } from "@/types/editor";
import {
  Check,
  Clock,
  CreditCard,
  Heading,
  Image,
  Minus,
  MousePointer,
  Type,
} from "lucide-react";
import React from "react";

/**
 * ENHANCED BLOCK REGISTRY - APENAS COMPONENTES PRINCIPAIS
 * ✅ Foco nos componentes mais usados e estáveis
 * ✅ Sem duplicatas ou imports quebrados
 * ✅ Compatível com stepTemplatesMapping atualizado
 */

// === IMPORTS DE COMPONENTES PRINCIPAIS ===

// Componentes Inline existentes
import ButtonInline from "../components/blocks/inline/ButtonInline";
import TextInline from "../components/blocks/inline/TextInline";
import HeadingInline from "../components/blocks/inline/HeadingInline";
import CountdownInlineBlock from "../components/blocks/inline/CountdownInlineBlock";
import DividerInlineBlock from "../components/blocks/inline/DividerInlineBlock";
import ImageDisplayInlineBlock from "../components/blocks/inline/ImageDisplayInlineBlock";
import PricingCardInlineBlock from "../components/blocks/inline/PricingCardInlineBlock";
import DecorativeBarInline from "../components/blocks/inline/DecorativeBarInline";
import LegalNoticeInline from "../components/blocks/inline/LegalNoticeInline";
import ImageDisplayInline from "../components/blocks/inline/ImageDisplayInline";

// === REGISTRY PRINCIPAL - SEM DUPLICATAS ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  "text-inline": TextInline,
  "heading-inline": HeadingInline,
  "image-display-inline": ImageDisplayInline,

  // Interactive Elements  
  "button-inline": ButtonInline,
  "decorative-bar-inline": DecorativeBarInline,
  
  // Layout and Design
  "divider": DividerInlineBlock,
  
  // Commerce and Pricing
  "pricing-card": PricingCardInlineBlock,
  "countdown": CountdownInlineBlock,

  // Legal
  "legal-notice-inline": LegalNoticeInline,
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
      component: ButtonInline,
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
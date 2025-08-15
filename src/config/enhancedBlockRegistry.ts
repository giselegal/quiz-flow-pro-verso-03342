import { BlockDefinition } from '@/types/editor';
import React from 'react';
import { Type, Heading, Image, Sparkles } from 'lucide-react';
import TextInline from '../components/blocks/inline/TextInline';
import HeadingBlock from '../components/blocks/inline/HeadingBlock';
import ImageDisplayInlineBlockClean from '../components/blocks/inline/ImageDisplayInlineBlock.clean';

// Template Blocks - Wrappers para templates TSX conectados
import Step01TemplateBlock from "../components/blocks/templates/Step01TemplateBlock";

// Registry simplificado
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  'text-inline': TextInline,
  heading: HeadingBlock,
  'image-display-inline': ImageDisplayInlineBlockClean,
  
  // ✅ Template Wrappers - Conectados aos hooks  
  "step01-template": Step01TemplateBlock,
  "quiz-intro": Step01TemplateBlock, // Alias for compatibility
};

// Fallback component
const FallbackComponent: React.ComponentType<any> = () => 
  React.createElement('div', 
    { className: "p-4 border border-dashed border-gray-300 rounded text-center text-gray-500" },
    'Component not found'
  );

export const getBlockComponent = (type: string): React.ComponentType<any> => {
  return ENHANCED_BLOCK_REGISTRY[type] || FallbackComponent;
};

export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

export const blockTypeExists = (type: string): boolean => {
  return type in ENHANCED_BLOCK_REGISTRY;
};

export const generateBlockDefinitions = (): BlockDefinition[] => {
  return [
    {
      type: "text-inline",
      name: "TextInline",
      label: "Texto",
      category: "Conteúdo",
      description: "Bloco de texto editável",
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY["text-inline"],
      properties: {},
      defaultProps: { content: "Digite seu texto aqui..." },
    },
    {
      type: "heading",
      name: "HeadingBlock",
      label: "Título",
      category: "Conteúdo",
      description: "Título com diferentes tamanhos",
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY["heading"],
      properties: {},
      defaultProps: { text: "Seu título aqui", level: "h2" },
    },
    {
      type: "image-display-inline",
      name: "ImageDisplayInlineBlockClean",
      label: "Imagem",
      category: "Mídia",
      description: "Exibição de imagens",
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY["image-display-inline"],
      properties: {},
      defaultProps: { src: "", alt: "Imagem" },
    },
    {
      type: "step01-template",
      name: "Step01TemplateBlock",
      label: "Template Etapa 1",
      category: "Templates",
      description: "Template conectado da Etapa 1",
      icon: Sparkles,
      component: ENHANCED_BLOCK_REGISTRY["step01-template"],
      properties: {},
      defaultProps: { stepNumber: 1, stepName: "Quiz de Estilo Pessoal" },
    }
  ];
};

export default ENHANCED_BLOCK_REGISTRY;
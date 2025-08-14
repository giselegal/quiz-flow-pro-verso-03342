import React from 'react';
import { BlockDefinition } from "@/types/editor";
import {
  Heading,
  Image,
  MousePointer,
  Type,
  FormInput,
  Minus,
  LayoutTemplate,
  FileText
} from "lucide-react";

// === COMPONENTES BÁSICOS FUNCIONAIS ===
import TextInline from '../components/blocks/inline/TextInline';
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import HeadingBlock from '../components/blocks/inline/HeadingBlock';
import ImageDisplayInlineBlockClean from '../components/blocks/inline/ImageDisplayInlineBlock.clean';

// === CRIAÇÃO DE COMPONENTES PLACEHOLDER (OS ARQUIVOS NÃO EXISTIAM) ===
// Estes componentes são criados aqui para evitar erros de importação.

const PlaceholderBlock: React.FC<{ type: string, props: any }> = ({ type, props }) => {
  return React.createElement('div', {
    style: {
      padding: '12px',
      margin: '8px 0',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      color: '#6b7280'
    }
  }, [
    React.createElement('p', { 
      key: 'title',
      style: { fontWeight: 'bold', fontSize: '14px' }
    }, ['Componente Placeholder: ', React.createElement('code', { key: 'type' }, type)]),
    React.createElement('pre', {
      key: 'props',
      style: { fontSize: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
    }, JSON.stringify(props, null, 2))
  ]);
};

const QuizIntroHeaderBlock: React.FC<any> = (props) => React.createElement(HeadingBlock, { ...props, level: "h1", text: props.title || 'Cabeçalho do Quiz' });

const DecorativeBarInlineBlock: React.FC<any> = () => {
  return React.createElement('hr', { 
    style: { border: '2px solid #ccc', margin: '16px 0' } 
  });
};

const FormInputBlock: React.FC<any> = (props) => {
  return React.createElement('input', { 
    placeholder: props.placeholder || 'Campo de formulário',
    style: { padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }
  });
};

const FormContainerBlock: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return React.createElement('div', { 
    style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' } 
  }, children);
};

const TextInlineBlock: React.FC<{ content?: string }> = ({ content }) => {
  return React.createElement(TextInline, { content: content || 'Texto' });
};

const HeadingInlineBlock: React.FC<any> = (props) => {
  return React.createElement(HeadingBlock, props);
};

/**
 * Registry de Blocos - Versão Corrigida e Unificada
 * Define um nome "canônico" para cada componente.
 */
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Componentes básicos
  'text': TextInline,
  'heading': HeadingBlock,
  'image': ImageDisplayInlineBlockClean,
  'button': ButtonInlineFixed,

  // Componentes para templates (Step 01 e outros)
  'quiz-intro-header': QuizIntroHeaderBlock,
  'decorative-bar': DecorativeBarInlineBlock,
  'form-container': FormContainerBlock,
  'form-input': FormInputBlock,

  // Variações e componentes avançados
  'text-advanced': TextInlineBlock,
  'heading-advanced': HeadingInlineBlock,
};

// Mapeamento de aliases e nomes antigos para os nomes canônicos do registry
const BLOCK_ALIASES: Record<string, string> = {
  'text-inline': 'text',
  'heading-inline': 'heading-advanced',
  'image-display-inline': 'image',
  'button-inline': 'button',
  'decorative-bar-inline': 'decorative-bar',
  'form': 'form-input',
  
  // Aliases do template JSON em português
  'cabeçalho-introdução-do-questionário': 'quiz-intro-header',
  'texto-embutido': 'text',
  'imagem-em-linha': 'image',
  'formulário-de-chumbo': 'form-container', // Mapeado para container
};

/**
 * Obtém um componente pelo seu tipo, usando o registry e os aliases.
 */
export const getBlockComponent = (type: string): React.ComponentType<any> => {
  if (!type) {
    console.warn('getBlockComponent: Tipo de bloco não fornecido. Usando placeholder.');
    return (props) => React.createElement(PlaceholderBlock, { type: 'undefined', props });
  }

  // 1. Tenta encontrar o tipo diretamente no registry
  let component = ENHANCED_BLOCK_REGISTRY[type];
  if (component) {
    console.log(`✅ Componente encontrado: ${type}`);
    return component;
  }

  // 2. Se não encontrar, tenta usar um alias
  const alias = BLOCK_ALIASES[type];
  if (alias) {
    component = ENHANCED_BLOCK_REGISTRY[alias];
    if (component) {
      console.log(`🔄 Mapeado via alias: "${type}" → "${alias}"`);
      return component;
    }
  }

  // 3. Se ainda não encontrar, retorna um placeholder para não quebrar a UI
  console.warn(`❗️ Componente para o tipo "${type}" não foi encontrado. Renderizando placeholder.`);
  return (props) => React.createElement(PlaceholderBlock, { type, props });
  if (alias) {
    component = ENHANCED_BLOCK_REGISTRY[alias];
    if (component) {
      console.log(`� Mapeado via alias: "${type}" → "${alias}"`);
      return component;
    }
  }

  // 3. Se ainda não encontrar, retorna TextInline como fallback
  console.warn(`❗️ Componente para o tipo "${type}" não foi encontrado. Usando TextInline como fallback.`);
  return TextInline;
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
  return type in ENHANCED_BLOCK_REGISTRY || type in BLOCK_ALIASES;
};

/**
 * Gera definições de blocos para a barra lateral do editor.
 * Atualizado para incluir os novos componentes.
 */
export const generateBlockDefinitions = (): BlockDefinition[] => {
  return [
    {
      type: "text",
      name: "Texto Simples",
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
      name: "Título",
      label: "Título",
      category: "Conteúdo",
      description: "Título com diferentes tamanhos",
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY["heading"],
      properties: {},
      defaultProps: { text: "Seu título aqui", level: "h2" },
    },
    {
      type: "image",
      name: "Imagem",
      label: "Imagem",
      category: "Mídia",
      description: "Exibição de imagens",
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY["image"],
      properties: {},
      defaultProps: { src: "", alt: "Imagem" },
    },
    {
      type: "button",
      name: "Botão",
      label: "Botão",
      category: "Interativo",
      description: "Botão clicável",
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY["button"],
      properties: {},
      defaultProps: { text: "Clique aqui", variant: "primary" },
    },
    {
      type: "form-container",
      name: "Container de Formulário",
      label: "Container Form",
      category: "Formulário",
      description: "Container para agrupar elementos de formulário",
      icon: LayoutTemplate,
      component: ENHANCED_BLOCK_REGISTRY["form-container"],
      properties: {},
      defaultProps: {},
    },
    {
      type: "form-input",
      name: "Campo de Texto",
      label: "Input",
      category: "Formulário",
      description: "Campo de entrada de texto",
      icon: FormInput,
      component: ENHANCED_BLOCK_REGISTRY["form-input"],
      properties: {},
      defaultProps: { placeholder: "Digite aqui" },
    },
    {
      type: "decorative-bar",
      name: "Barra Decorativa",
      label: "Barra",
      category: "Visual",
      description: "Linha decorativa para separar seções",
      icon: Minus,
      component: ENHANCED_BLOCK_REGISTRY["decorative-bar"],
      properties: {},
      defaultProps: {},
    },
  ];
};

export default ENHANCED_BLOCK_REGISTRY;
import { BlockDefinition } from "@/types/editor";
import {
  Heading,
  Image,
  MousePointer,
  Type,
} from "lucide-react";
import React from "react";

// === COMPONENTES BÁSICOS EXISTENTES ===
import HeadingBlock from "../components/blocks/inline/HeadingBlock";
import ImageDisplayInlineBlock from "../components/blocks/inline/ImageDisplayInlineBlock";
import LeadFormBlock from "../components/editor/blocks/LeadFormBlock";

// === CRIAÇÃO DE COMPONENTES PLACEHOLDER ===
const TextInlineBlock: React.FC<any> = ({ content }) => {
  return React.createElement('div', { className: "p-2 border rounded bg-white" },
    React.createElement('p', null, content || "Digite seu texto aqui...")
  );
};

const ButtonInlineBlock: React.FC<any> = ({ text }) => {
  return React.createElement('button', { 
    className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
  }, text || "Clique aqui");
};

const DecorativeBarInlineBlock: React.FC<any> = () => {
  return React.createElement('hr', { className: "border-2 border-gray-300 my-4" });
};

const FormInputBlock: React.FC<any> = ({ label, placeholder }) => {
  return React.createElement('div', { className: "mb-4" }, [
    label && React.createElement('label', { 
      key: 'label',
      className: "block text-sm font-medium mb-1" 
    }, label),
    React.createElement('input', {
      key: 'input',
      type: "text",
      placeholder: placeholder || "Digite aqui...",
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    })
  ]);
};

const QuizIntroHeaderBlock: React.FC<any> = ({ title }) => {
  return React.createElement('div', { 
    className: "text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg" 
  },
    React.createElement('h1', { className: "text-2xl font-bold" }, title || "Título do Quiz")
  );
};

const LegalNoticeInlineBlock: React.FC<any> = ({ text }) => {
  return React.createElement('div', { 
    className: "text-xs text-gray-500 p-2 border-l-4 border-gray-300" 
  }, text || "Aviso legal aqui");
};

const ResultCardBlock: React.FC<any> = ({ title, description }) => {
  return React.createElement('div', { className: "p-4 border rounded-lg bg-green-50" }, [
    React.createElement('h3', { 
      key: 'title',
      className: "font-bold text-green-800" 
    }, title || "Resultado"),
    React.createElement('p', { 
      key: 'desc',
      className: "text-green-600" 
    }, description || "Descrição do resultado")
  ]);
};

const ResultHeaderBlock: React.FC<any> = ({ title }) => {
  return React.createElement('div', { className: "text-center p-4 bg-green-100 rounded-lg" },
    React.createElement('h2', { className: "text-xl font-bold text-green-800" }, title || "Seus Resultados")
  );
};

const QuizOptionsGridBlock: React.FC<any> = ({ options }) => {
  const opts = options || ["Opção 1", "Opção 2", "Opção 3", "Opção 4"];
  return React.createElement('div', { className: "grid grid-cols-2 gap-4 p-4" },
    opts.map((option: string, i: number) =>
      React.createElement('button', {
        key: i,
        className: "p-3 border rounded hover:bg-gray-50"
      }, option)
    )
  );
};

const StyleResultsBlock: React.FC<any> = ({ results }) => {
  return React.createElement('div', { className: "p-4 bg-purple-50 rounded-lg" }, [
    React.createElement('h3', { 
      key: 'title',
      className: "font-bold text-purple-800" 
    }, "Resultados de Estilo"),
    React.createElement('p', { 
      key: 'results',
      className: "text-purple-600" 
    }, results || "Seus resultados aparecem aqui")
  ]);
};

// === REGISTRY PRINCIPAL ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  "text-inline": TextInlineBlock,
  heading: HeadingBlock,
  "image-display-inline": ImageDisplayInlineBlock,

  // Interactive Elements
  "button-inline": ButtonInlineBlock,

  // Layout and Design
  "decorative-bar-inline": DecorativeBarInlineBlock,

  // Quiz Components específicos
  "quiz-intro-header": QuizIntroHeaderBlock,
  "result-header": ResultHeaderBlock,
  "result-card": ResultCardBlock,

  // Form Components
  "form-input": FormInputBlock,
  "lead-form": LeadFormBlock,
  "legal-notice-inline": LegalNoticeInlineBlock,

  // Quiz Components para compatibilidade
  "quiz-options-grid": QuizOptionsGridBlock,
  "style-results-block": StyleResultsBlock,
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
      name: "TextInlineBlock",
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
      name: "ImageDisplayInlineBlock",
      label: "Imagem",
      category: "Mídia",
      description: "Exibição de imagens",
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY["image-display-inline"],
      properties: {},
      defaultProps: { src: "", alt: "Imagem" },
    },
    {
      type: "button-inline",
      name: "ButtonInlineBlock",
      label: "Botão",
      category: "Interativo",
      description: "Botão clicável",
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY["button-inline"],
      properties: {},
      defaultProps: { text: "Clique aqui", variant: "primary" },
    },
    {
      type: "quiz-intro-header",
      name: "QuizIntroHeaderBlock", 
      label: "Cabeçalho Quiz",
      category: "Quiz",
      description: "Cabeçalho principal do quiz",
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY["quiz-intro-header"],
      properties: {},
      defaultProps: { title: "Título do Quiz" },
    },
    {
      type: "form-input",
      name: "FormInputBlock",
      label: "Campo de Entrada",
      category: "Formulário",
      description: "Campo de entrada de dados",
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY["form-input"],
      properties: {},
      defaultProps: { label: "Nome", placeholder: "Digite aqui..." },
    }
  ];
};

/**
 * Obter estatísticas do registry
 */
export const getRegistryStats = () => {
  const stats = {
    totalComponents: Object.keys(ENHANCED_BLOCK_REGISTRY).length,
    categories: new Set<string>(),
    componentsByCategory: {} as Record<string, number>,
  };

  generateBlockDefinitions().forEach(def => {
    stats.categories.add(def.category);
    stats.componentsByCategory[def.category] = 
      (stats.componentsByCategory[def.category] || 0) + 1;
  });

  return {
    ...stats,
    categories: Array.from(stats.categories),
  };
};
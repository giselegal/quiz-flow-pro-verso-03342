import { BlockDefinition } from "@/types/editor";
import { AlignLeft, Heading, Image, Minus, Square, Type } from "lucide-react";

// Import real components instead of placeholder
import BadgeInlineBlock from "@/components/blocks/inline/BadgeInlineBlock";
import SpacerInlineBlock from "@/components/blocks/inline/SpacerInlineBlock";
import StyleCardInlineBlock from "@/components/blocks/inline/StyleCardInlineBlock";
import TextInlineBlock from "@/components/blocks/inline/TextInlineBlock";
import DecorativeBarInlineBlock from "@/components/editor/blocks/DecorativeBarInlineBlock";
import HeadingInlineBlock from "@/components/editor/blocks/HeadingInlineBlock";

export const blockDefinitions: BlockDefinition[] = [
  {
    type: "heading",
    name: "Título",
    description: "Título principal com diferentes níveis (H1-H6)",
    category: "Text",
    icon: Heading,
    component: HeadingInlineBlock, // ✅ CONECTADO ao componente correto
    properties: {
      content: {
        type: "string",
        default: "Título Principal",
        label: "Conteúdo",
        description: "Texto do título",
      },
      level: {
        type: "select",
        default: "h2",
        label: "Nível do Título",
        options: [
          { value: "h1", label: "Título 1 (H1)" },
          { value: "h2", label: "Título 2 (H2)" },
          { value: "h3", label: "Título 3 (H3)" },
          { value: "h4", label: "Título 4 (H4)" },
          { value: "h5", label: "Título 5 (H5)" },
          { value: "h6", label: "Título 6 (H6)" },
        ],
      },
      textAlign: {
        type: "select",
        default: "left",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
        ],
      },
      fontWeight: {
        type: "select",
        default: "bold",
        label: "Peso da Fonte",
        options: [
          { value: "light", label: "Leve" },
          { value: "normal", label: "Normal" },
          { value: "medium", label: "Médio" },
          { value: "semibold", label: "Semi-negrito" },
          { value: "bold", label: "Negrito" },
          { value: "extrabold", label: "Extra-negrito" },
        ],
      },
      color: {
        type: "color",
        default: "#1f2937",
        label: "Cor do Texto",
        description: "Cor do texto do título",
      },
      backgroundColor: {
        type: "color",
        default: "transparent",
        label: "Cor de Fundo",
        description: "Cor de fundo do título",
      },
      maxWidth: {
        type: "select",
        default: "full",
        label: "Largura Máxima",
        options: [
          { value: "sm", label: "Pequena" },
          { value: "md", label: "Média" },
          { value: "lg", label: "Grande" },
          { value: "xl", label: "Extra Grande" },
          { value: "2xl", label: "2X Grande" },
          { value: "full", label: "Total" },
        ],
      },
    },
    label: "Título",
    defaultProps: {
      content: "Título Principal",
      level: "h2",
      textAlign: "left",
      fontWeight: "bold",
      color: "#1f2937",
      backgroundColor: "transparent",
      maxWidth: "full",
    },
  },
  {
    type: "headline",
    name: "Título Legado",
    description: "Título principal e subtítulo (versão legada)",
    category: "Text",
    icon: Type,
    component: TextInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      title: {
        type: "string",
        default: "Novo Título",
        label: "Título",
        description: "Título principal",
      },
      subtitle: {
        type: "string",
        default: "",
        label: "Subtítulo",
        description: "Subtítulo opcional",
      },
      alignment: {
        type: "select",
        default: "left",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
          { value: "justify", label: "Justificado" },
        ],
      },
    },
    label: "Título Legado",
    defaultProps: {
      title: "Novo Título",
      subtitle: "",
      alignment: "left",
    },
  },
  {
    type: "text",
    name: "Texto",
    description: "Parágrafo de texto simples",
    category: "Text",
    icon: AlignLeft,
    component: TextInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      text: {
        type: "textarea",
        default: "Digite seu texto aqui...",
        label: "Texto",
        description: "Conteúdo do texto",
      },
      fontSize: {
        type: "select",
        default: "1rem",
        label: "Tamanho da fonte",
        options: [
          { value: "0.875rem", label: "Pequeno" },
          { value: "1rem", label: "Normal" },
          { value: "1.125rem", label: "Médio" },
          { value: "1.25rem", label: "Grande" },
          { value: "1.5rem", label: "Extra Grande" },
        ],
      },
      alignment: {
        type: "select",
        default: "left",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
          { value: "justify", label: "Justificado" },
        ],
      },
    },
    label: "Texto",
    defaultProps: {
      text: "Digite seu texto aqui...",
      fontSize: "1rem",
      alignment: "left",
    },
  },
  {
    type: "decorative-bar-inline",
    name: "Barra Decorativa",
    description: "Barra dourada decorativa com controles de altura e cor",
    category: "Layout",
    icon: Minus,
    component: DecorativeBarInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      height: {
        type: "number",
        default: 4,
        label: "Altura",
        description: "Altura da barra em pixels (1-50px)",
        min: 1,
        max: 50,
        step: 1,
      },
      width: {
        type: "string",
        default: "100%",
        label: "Largura",
        description: "Largura da barra",
      },
      color: {
        type: "color",
        default: "#B89B7A",
        label: "Cor Principal",
        description: "Cor da barra decorativa",
      },
      borderRadius: {
        type: "number",
        default: 3,
        label: "Borda Arredondada",
        description: "Raio da borda em pixels (0-25px)",
        min: 0,
        max: 25,
        step: 1,
      },
      marginTop: {
        type: "number",
        default: 8,
        label: "Margem Superior",
        description: "Espaçamento acima da barra (0-100px)",
        min: 0,
        max: 100,
        step: 1,
      },
      marginBottom: {
        type: "number",
        default: 24,
        label: "Margem Inferior",
        description: "Espaçamento abaixo da barra (0-100px)",
        min: 0,
        max: 100,
        step: 1,
      },
      showShadow: {
        type: "boolean",
        default: true,
        label: "Mostrar Sombra",
        description: "Adicionar sombra à barra",
      },
    },
    label: "Barra Decorativa",
    defaultProps: {
      height: 4,
      width: "100%",
      color: "#B89B7A",
      borderRadius: 3,
      marginTop: 8,
      marginBottom: 24,
      showShadow: true,
    },
  },
  {
    type: "image",
    name: "Imagem",
    description: "Componente de imagem",
    category: "Media",
    icon: Image,
    component: StyleCardInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      url: {
        type: "string",
        default: "",
        label: "URL da imagem",
        description: "Endereço da imagem",
      },
      alt: {
        type: "string",
        default: "Imagem",
        label: "Texto alternativo",
        description: "Descrição da imagem para acessibilidade",
      },
      width: {
        type: "string",
        default: "100%",
        label: "Largura",
        description: "Largura da imagem",
      },
      height: {
        type: "string",
        default: "auto",
        label: "Altura",
        description: "Altura da imagem",
      },
      borderRadius: {
        type: "string",
        default: "0.5rem",
        label: "Borda arredondada",
        description: "Raio da borda",
      },
      objectFit: {
        type: "select",
        default: "cover",
        label: "Ajuste da imagem",
        options: [
          { value: "cover", label: "Cobrir" },
          { value: "contain", label: "Conter" },
          { value: "fill", label: "Preencher" },
          { value: "none", label: "Nenhum" },
          { value: "scale-down", label: "Reduzir" },
        ],
      },
    },
    label: "Imagem",
    defaultProps: {
      url: "",
      alt: "Imagem",
      width: "100%",
      height: "auto",
      borderRadius: "0.5rem",
      objectFit: "cover",
    },
  },
  {
    type: "button",
    name: "Botão",
    description: "Botão de ação",
    category: "Interactive",
    icon: Square,
    component: BadgeInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      text: {
        type: "string",
        default: "Clique aqui",
        label: "Texto do botão",
        description: "Texto exibido no botão",
      },
      url: {
        type: "string",
        default: "#",
        label: "URL de destino",
        description: "Link para onde o botão deve levar",
      },
      style: {
        type: "select",
        default: "primary",
        label: "Estilo",
        options: [
          { value: "primary", label: "Primário" },
          { value: "secondary", label: "Secundário" },
          { value: "outline", label: "Contorno" },
          { value: "ghost", label: "Fantasma" },
        ],
      },
    },
    label: "Botão",
    defaultProps: {
      text: "Clique aqui",
      url: "#",
      style: "primary",
    },
  },
  {
    type: "spacer",
    name: "Espaçador",
    description: "Espaço em branco vertical",
    category: "Layout",
    icon: Minus,
    component: SpacerInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      height: {
        type: "number",
        default: 40,
        label: "Altura (px)",
        description: "Altura do espaçamento em pixels",
      },
    },
    label: "Espaçador",
    defaultProps: {
      height: 40,
    },
  },
];

export const getCategories = (): string[] => {
  const categories = new Set<string>();
  blockDefinitions.forEach(block => {
    categories.add(block.category);
  });
  return Array.from(categories);
};

export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return blockDefinitions.filter(block => block.category === category);
};

export const getBlockByType = (type: string): BlockDefinition | undefined => {
  return blockDefinitions.find(block => block.type === type);
};

import { BlockDefinition } from "@/types/blocks";

// Basic block definitions without defaultContent
const headerBlockDefinition: BlockDefinition = {
  type: "header",
  name: "Cabeçalho",
  description: "Título principal da seção",
  category: "Texto",
  icon: "Heading",
  defaultProps: {},
  properties: [
    {
      key: "text",
      label: "Texto",
      type: "string",
      default: "Título Principal",
    },
    {
      key: "level",
      label: "Nível",
      type: "select",
      options: ["1", "2", "3", "4", "5", "6"],
      default: "1",
    },
    {
      key: "alignment",
      label: "Alinhamento",
      type: "select",
      options: ["left", "center", "right"],
      default: "center",
    },
    {
      key: "textColor",
      label: "Cor do Texto",
      type: "color",
      default: "#000000",
    },
    { key: "fontSize", label: "Tamanho da Fonte", type: "number", default: 32 },
  ],
};

const textBlockDefinition: BlockDefinition = {
  type: "text",
  name: "Texto",
  description: "Parágrafo de texto formatado",
  category: "Texto",
  icon: "Text",
  defaultProps: {},
  properties: [
    {
      key: "text",
      label: "Texto",
      type: "richtext",
      default: "Texto do parágrafo...",
    },
    {
      key: "alignment",
      label: "Alinhamento",
      type: "select",
      options: ["left", "center", "right", "justify"],
      default: "left",
    },
    {
      key: "textColor",
      label: "Cor do Texto",
      type: "color",
      default: "#000000",
    },
    { key: "fontSize", label: "Tamanho da Fonte", type: "number", default: 16 },
    {
      key: "lineHeight",
      label: "Altura da Linha",
      type: "number",
      default: 1.5,
    },
  ],
};

export const blockDefinitions = [headerBlockDefinition, textBlockDefinition];

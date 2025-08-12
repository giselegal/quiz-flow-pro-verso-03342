/**
 * Configuração de propriedades de container para o painel de propriedades
 * Essas propriedades controlam largura, posição e espaçamento dos containers
 */

export interface ContainerPropertyOption {
  value: string;
  label: string;
}

// 🔧 Opções de largura do container
export const CONTAINER_WIDTH_OPTIONS: ContainerPropertyOption[] = [
  { value: "full", label: "Completa (100%)" },
  { value: "large", label: "Grande (1024px)" },
  { value: "medium", label: "Média (672px)" },
  { value: "small", label: "Pequena (448px)" },
];

// 🎯 Opções de posicionamento do container
export const CONTAINER_POSITION_OPTIONS: ContainerPropertyOption[] = [
  { value: "left", label: "Esquerda" },
  { value: "center", label: "Centralizado" },
  { value: "right", label: "Direita" },
];

// 📦 Opções de espaçamento interno
export const SPACING_OPTIONS: ContainerPropertyOption[] = [
  { value: "none", label: "Nenhum" },
  { value: "compact", label: "Compacto (8px)" },
  { value: "normal", label: "Normal (16px)" },
  { value: "comfortable", label: "Confortável (24px)" },
  { value: "spacious", label: "Espaçoso (32px)" },
];

// 🎨 Opções de cor de fundo
export const BACKGROUND_COLOR_OPTIONS: ContainerPropertyOption[] = [
  { value: "transparent", label: "Transparente" },
  { value: "white", label: "Branco" },
  { value: "gray-50", label: "Cinza Claro" },
  { value: "brand-light", label: "Cor da Marca" },
];

// 📐 Opções de grid
export const GRID_COLUMNS_OPTIONS: ContainerPropertyOption[] = [
  { value: "auto", label: "Automático" },
  { value: "full", label: "Linha Completa" },
  { value: "half", label: "Metade da Linha" },
];

// 🏗️ Propriedades de container completas para o painel
export const getContainerProperties = (currentBlock: any) => {
  return [
    {
      key: "containerWidth",
      value: currentBlock?.properties?.containerWidth || "full",
      type: "SELECT",
      label: "Largura do Container",
      category: "LAYOUT",
      options: CONTAINER_WIDTH_OPTIONS,
    },
    {
      key: "containerPosition",
      value: currentBlock?.properties?.containerPosition || "center",
      type: "SELECT",
      label: "Posição do Container",
      category: "LAYOUT",
      options: CONTAINER_POSITION_OPTIONS,
    },
    {
      key: "spacing",
      value: currentBlock?.properties?.spacing || "normal",
      type: "SELECT",
      label: "Espaçamento Interno",
      category: "LAYOUT",
      options: SPACING_OPTIONS,
    },
    {
      key: "backgroundColor",
      value: currentBlock?.properties?.backgroundColor || "transparent",
      type: "SELECT",
      label: "Cor de Fundo",
      category: "STYLE",
      options: BACKGROUND_COLOR_OPTIONS,
    },
    {
      key: "marginTop",
      value: currentBlock?.properties?.marginTop || 0,
      type: "RANGE",
      label: "Margem Superior",
      category: "LAYOUT",
      min: 0,
      max: 80,
      step: 8,
      unit: "px",
    },
    {
      key: "marginBottom",
      value: currentBlock?.properties?.marginBottom || 0,
      type: "RANGE",
      label: "Margem Inferior",
      category: "LAYOUT",
      min: 0,
      max: 80,
      step: 8,
      unit: "px",
    },
  ];
};

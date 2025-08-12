import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * 🎯 Enumerações e tipos fundamentais
 */
export enum PropertyType {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  RANGE = "range",
  COLOR = "color",
  SELECT = "select",
  SWITCH = "switch",
  ARRAY = "array",
  OBJECT = "object",
  UPLOAD = "upload",
  URL = "url",
  DATE = "date",
  TIME = "time",
  DATETIME = "datetime",
  JSON = "json",
  RICH_TEXT = "rich_text",
  MARKDOWN = "markdown",
  CODE = "code",
  EMAIL = "email",
  PHONE = "phone",
}

export enum PropertyCategory {
  CONTENT = "content",
  STYLE = "style",
  LAYOUT = "layout",
  BEHAVIOR = "behavior",
  ADVANCED = "advanced",
  ANIMATION = "animation",
  ACCESSIBILITY = "accessibility",
  SEO = "seo",
}

export type PropertyCategoryOrString = PropertyCategory | string;

/**
 * 🔧 Interface principal da propriedade
 */
export interface UnifiedProperty {
  key: string;
  value: any;
  type: PropertyType;
  label: string;
  category: PropertyCategoryOrString;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  validation?: (value: any) => boolean | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: Array<{ value: any; label: string; disabled?: boolean }>;
  dependencies?: string[];
  conditional?: {
    key: string;
    value: any;
  };
}

export interface UnifiedBlock {
  id: string;
  type: string;
  properties?: Record<string, any>;
  content?: Record<string, any>; // 🎯 FIX: Adicionar support para content
  children?: string[];
  parentId?: string;
}

export interface UseUnifiedPropertiesReturn {
  properties: UnifiedProperty[];
  updateProperty: (key: string, value: any) => void;
  resetProperties: () => void;
  validateProperties: () => boolean;
  getPropertyByKey: (key: string) => UnifiedProperty | undefined;
  getPropertiesByCategory: (category: PropertyCategoryOrString) => UnifiedProperty[];
  exportProperties: () => Record<string, any>;
  applyBrandColors: () => void;
}

/**
 * ✨ Constantes de cores da marca
 */
const BRAND_COLORS = {
  primary: "#B89B7A",
  secondary: "#D4C2A8",
  accent: "#F3E8D3",
  text: "#432818",
  textPrimary: "#2c1810",
  textSecondary: "#8F7A6A",
  background: "#FEFDFB",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  white: "#FFFFFF",
  border: "#E5E7EB",
};

/**
 * 🏷️ Utilitários de criação
 */
const createProperty = (
  key: string,
  value: any,
  type: PropertyType,
  label: string,
  category: PropertyCategory,
  options?: any
): UnifiedProperty => ({
  key,
  value,
  type,
  label,
  category,
  ...options,
});

const createSelectOptions = (options: Array<{ value: string; label: string }>) => options;

/**
 * 🌟 Funções de propriedades universais
 */
const getUniversalProperties = (): UnifiedProperty[] => [
  // 1. Controles de margens (4 direções)
  createProperty("marginTop", 0, PropertyType.RANGE, "Margem Superior", PropertyCategory.LAYOUT, {
    min: 0,
    max: 100,
    step: 2,
    unit: "px",
  }),
  createProperty(
    "marginBottom",
    0,
    PropertyType.RANGE,
    "Margem Inferior",
    PropertyCategory.LAYOUT,
    { min: 0, max: 100, step: 2, unit: "px" }
  ),
  createProperty("marginLeft", 0, PropertyType.RANGE, "Margem Esquerda", PropertyCategory.LAYOUT, {
    min: 0,
    max: 100,
    step: 2,
    unit: "px",
  }),
  createProperty("marginRight", 0, PropertyType.RANGE, "Margem Direita", PropertyCategory.LAYOUT, {
    min: 0,
    max: 100,
    step: 2,
    unit: "px",
  }),

  // 2. Escala Bloco (controle de escala)
  createProperty("scale", 1, PropertyType.RANGE, "Escala Bloco", PropertyCategory.LAYOUT, {
    min: 0.5,
    max: 2,
    step: 0.1,
  }),

  // 3. Cor de fundo do Container
  createProperty(
    "containerBackgroundColor",
    "transparent",
    PropertyType.COLOR,
    "Cor de Fundo Container",
    PropertyCategory.STYLE
  ),

  // 4. Cor de fundo do Componente
  createProperty(
    "componentBackgroundColor",
    "transparent",
    PropertyType.COLOR,
    "Cor de Fundo Componente",
    PropertyCategory.STYLE
  ),

  // 5. Elementos centralizados no container
  createProperty(
    "textAlign",
    "center",
    PropertyType.SELECT,
    "Alinhamento",
    PropertyCategory.LAYOUT,
    {
      options: [
        { value: "left", label: "Esquerda" },
        { value: "center", label: "Centro" },
        { value: "right", label: "Direita" },
      ],
    }
  ),

  // 6. Largura do texto 100%
  createProperty(
    "textWidth",
    "100%",
    PropertyType.SELECT,
    "Largura do Texto",
    PropertyCategory.LAYOUT,
    {
      options: [
        { value: "auto", label: "Automática" },
        { value: "100%", label: "Total (100%)" },
        { value: "80%", label: "80%" },
        { value: "60%", label: "60%" },
      ],
    }
  ),
];

/**
 * 🎨 Propriedades básicas de texto
 */
const getTextProperties = (): UnifiedProperty[] => [
  createProperty(
    "text",
    "Digite seu texto aqui...",
    PropertyType.TEXT,
    "Texto",
    PropertyCategory.CONTENT
  ),
  createProperty("fontSize", 16, PropertyType.RANGE, "Tamanho da Fonte", PropertyCategory.STYLE, {
    min: 10,
    max: 48,
    step: 1,
    unit: "px",
  }),
  createProperty(
    "fontWeight",
    "400",
    PropertyType.SELECT,
    "Peso da Fonte",
    PropertyCategory.STYLE,
    {
      options: createSelectOptions([
        { value: "300", label: "Leve (300)" },
        { value: "400", label: "Normal (400)" },
        { value: "500", label: "Médio (500)" },
        { value: "600", label: "Semi-negrito (600)" },
        { value: "700", label: "Negrito (700)" },
      ]),
    }
  ),
  createProperty(
    "textColor",
    BRAND_COLORS.text,
    PropertyType.COLOR,
    "Cor do Texto",
    PropertyCategory.STYLE
  ),
];

/**
 * 🎯 Hook principal para propriedades unificadas
 */
export const useUnifiedProperties = (
  blockType: string,
  blockId?: string,
  block?: UnifiedBlock | null,
  onUpdateExternal?: (blockId: string, updates: Partial<UnifiedBlock>) => void
): UseUnifiedPropertiesReturn => {
  const currentBlock = block;

  const generatedProperties = useMemo(() => {
    if (!blockType) return [];

    switch (blockType) {
      case "text-inline":
        return [
          // Conteúdo
          createProperty(
            "content",
            currentBlock?.properties?.content ?? currentBlock?.content?.text ?? "Digite seu texto aqui...",
            PropertyType.TEXTAREA,
            "Conteúdo",
            PropertyCategory.CONTENT,
            { rows: 4 }
          ),

          // Tipografia
          createProperty(
            "fontSize",
            currentBlock?.properties?.fontSize ?? "medium",
            PropertyType.SELECT,
            "Tamanho da Fonte",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "xs", label: "XS" },
                { value: "sm", label: "SM" },
                { value: "medium", label: "Médio" },
                { value: "lg", label: "LG" },
                { value: "xl", label: "XL" },
                { value: "2xl", label: "2XL" },
                { value: "3xl", label: "3XL" },
              ],
            }
          ),
          createProperty(
            "fontWeight",
            currentBlock?.properties?.fontWeight ?? "normal",
            PropertyType.SELECT,
            "Peso da Fonte",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "light", label: "Leve" },
                { value: "normal", label: "Normal" },
                { value: "medium", label: "Médio" },
                { value: "semibold", label: "Semi-negrito" },
                { value: "bold", label: "Negrito" },
              ],
            }
          ),
          createProperty(
            "lineHeight",
            currentBlock?.properties?.lineHeight ?? "leading-normal",
            PropertyType.SELECT,
            "Altura da Linha",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "leading-none", label: "Muito compacta" },
                { value: "leading-tight", label: "Compacta" },
                { value: "leading-snug", label: "Ajustada" },
                { value: "leading-normal", label: "Normal" },
                { value: "leading-relaxed", label: "Relaxada" },
                { value: "leading-loose", label: "Solta" },
              ],
            }
          ),

          // Cores
          createProperty(
            "color",
            currentBlock?.properties?.color ?? BRAND_COLORS.text,
            PropertyType.COLOR,
            "Cor do Texto",
            PropertyCategory.STYLE
          ),
          createProperty(
            "backgroundColor",
            currentBlock?.properties?.backgroundColor ?? "transparent",
            PropertyType.COLOR,
            "Cor de Fundo",
            PropertyCategory.STYLE
          ),

          // Layout
          createProperty(
            "textAlign",
            currentBlock?.properties?.textAlign ?? "left",
            PropertyType.SELECT,
            "Alinhamento",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: "left", label: "Esquerda" },
                { value: "center", label: "Centro" },
                { value: "right", label: "Direita" },
                { value: "justify", label: "Justificado" },
              ],
            }
          ),
          createProperty(
            "gridColumns",
            currentBlock?.properties?.gridColumns ?? "full",
            PropertyType.SELECT,
            "Largura do Bloco",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: "full", label: "100% (linha inteira)" },
                { value: "half", label: "50% (duas colunas)" },
                { value: "auto", label: "Automática" },
              ],
            }
          ),
          createProperty(
            "maxWidth",
            currentBlock?.properties?.maxWidth ?? "auto",
            PropertyType.SELECT,
            "Largura Máxima",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: "auto", label: "Automática" },
                { value: "32rem", label: "32rem (~512px)" },
                { value: "40rem", label: "40rem (~640px)" },
                { value: "48rem", label: "48rem (~768px)" },
              ],
            }
          ),
          createProperty(
            "spacing",
            currentBlock?.properties?.spacing ?? "normal",
            PropertyType.SELECT,
            "Espaçamento Interno",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "tight", label: "Apertado" },
                { value: "normal", label: "Normal" },
                { value: "loose", label: "Solto" },
              ],
            }
          ),

          // Margens
          createProperty(
            "marginTop",
            currentBlock?.properties?.marginTop ?? 8,
            PropertyType.RANGE,
            "Margem Superior",
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: "px" }
          ),
          createProperty(
            "marginBottom",
            currentBlock?.properties?.marginBottom ?? 8,
            PropertyType.RANGE,
            "Margem Inferior",
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: "px" }
          ),
          createProperty(
            "marginLeft",
            currentBlock?.properties?.marginLeft ?? 0,
            PropertyType.RANGE,
            "Margem Esquerda",
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: "px" }
          ),
          createProperty(
            "marginRight",
            currentBlock?.properties?.marginRight ?? 0,
            PropertyType.RANGE,
            "Margem Direita",
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: "px" }
          ),
        ];

      case "quiz-intro-header":
        return [
          ...getUniversalProperties(),

          // Logo
          createProperty(
            "logoUrl",
            currentBlock?.properties?.logoUrl || "",
            PropertyType.URL,
            "URL da Logo",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "logoAlt",
            currentBlock?.properties?.logoAlt || "Logo",
            PropertyType.TEXT,
            "Texto Alternativo",
            PropertyCategory.ACCESSIBILITY
          ),
          createProperty(
            "logoWidth",
            currentBlock?.properties?.logoWidth ?? 96,
            PropertyType.RANGE,
            "Largura da Logo (px)",
            PropertyCategory.STYLE,
            { min: 24, max: 240, step: 2 }
          ),
          createProperty(
            "logoHeight",
            currentBlock?.properties?.logoHeight ?? 96,
            PropertyType.RANGE,
            "Altura da Logo (px)",
            PropertyCategory.STYLE,
            { min: 24, max: 240, step: 2 }
          ),

          // Comportamento
          createProperty(
            "showBackButton",
            currentBlock?.properties?.showBackButton ?? true,
            PropertyType.SWITCH,
            "Mostrar botão Voltar",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "showProgress",
            currentBlock?.properties?.showProgress ?? true,
            PropertyType.SWITCH,
            "Mostrar barra de progresso",
            PropertyCategory.BEHAVIOR
          ),

          // Progresso
          createProperty(
            "progressValue",
            currentBlock?.properties?.progressValue ?? 0,
            PropertyType.RANGE,
            "Progresso (%)",
            PropertyCategory.BEHAVIOR,
            { min: 0, max: 100, step: 1 }
          ),
          createProperty(
            "progressMax",
            currentBlock?.properties?.progressMax ?? 100,
            PropertyType.NUMBER,
            "Máximo (%)",
            PropertyCategory.BEHAVIOR,
            { min: 1, max: 100 }
          ),

          // Estilo
          createProperty(
            "backgroundColor",
            currentBlock?.properties?.backgroundColor ?? "transparent",
            PropertyType.COLOR,
            "Cor de Fundo",
            PropertyCategory.STYLE
          ),
        ];
      case "step01-intro":
        return [
          ...getUniversalProperties(),
          // Conteúdo configurável
          createProperty(
            "title",
            currentBlock?.properties?.title || "Bem-vindo ao Quiz",
            PropertyType.TEXT,
            "Título Principal",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "descriptionTop",
            currentBlock?.properties?.descriptionTop || "",
            PropertyType.TEXTAREA,
            "Descrição Superior",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "descriptionBottom",
            currentBlock?.properties?.descriptionBottom || "",
            PropertyType.TEXTAREA,
            "Descrição Inferior",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "imageIntro",
            currentBlock?.properties?.imageIntro || "",
            PropertyType.UPLOAD,
            "Imagem de Introdução",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "inputLabel",
            currentBlock?.properties?.inputLabel || "Seu Nome",
            PropertyType.TEXT,
            "Label do Input",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "inputPlaceholder",
            currentBlock?.properties?.inputPlaceholder || "Digite aqui...",
            PropertyType.TEXT,
            "Placeholder do Input",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "buttonText",
            currentBlock?.properties?.buttonText || "Continuar",
            PropertyType.TEXT,
            "Texto do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "privacyText",
            currentBlock?.properties?.privacyText || "",
            PropertyType.TEXTAREA,
            "Texto de Privacidade",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "footerText",
            currentBlock?.properties?.footerText || "",
            PropertyType.TEXT,
            "Texto do Rodapé",
            PropertyCategory.CONTENT
          ),
          // Configurações visuais
          createProperty(
            "showImage",
            currentBlock?.properties?.showImage !== false,
            PropertyType.SWITCH,
            "Mostrar Imagem",
            PropertyCategory.STYLE
          ),
          createProperty(
            "showInput",
            currentBlock?.properties?.showInput !== false,
            PropertyType.SWITCH,
            "Mostrar Campo de Input",
            PropertyCategory.STYLE
          ),
          createProperty(
            "required",
            currentBlock?.properties?.required !== false,
            PropertyType.SWITCH,
            "Campo Obrigatório",
            PropertyCategory.BEHAVIOR
          ),
        ];

      case "image-display-inline":
        return [
          ...getUniversalProperties(),
          createProperty(
            "src",
            currentBlock?.properties?.src || "",
            PropertyType.UPLOAD,
            "Imagem",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "alt",
            currentBlock?.properties?.alt || "",
            PropertyType.TEXT,
            "Texto Alternativo",
            PropertyCategory.ACCESSIBILITY
          ),
          createProperty(
            "width",
            currentBlock?.properties?.width || "auto",
            PropertyType.TEXT,
            "Largura",
            PropertyCategory.LAYOUT
          ),
          createProperty(
            "height",
            currentBlock?.properties?.height || "auto",
            PropertyType.TEXT,
            "Altura",
            PropertyCategory.LAYOUT
          ),
          createProperty(
            "borderRadius",
            currentBlock?.properties?.borderRadius ?? 12,
            PropertyType.RANGE,
            "Arredondamento",
            PropertyCategory.STYLE,
            { min: 0, max: 50, step: 2, unit: "px" }
          ),
          createProperty(
            "shadow",
            currentBlock?.properties?.shadow !== false,
            PropertyType.SWITCH,
            "Sombra",
            PropertyCategory.STYLE
          ),
        ];

      case "form-input":
        return [
          ...getUniversalProperties(),
          createProperty(
            "label",
            currentBlock?.properties?.label || "Campo de Input",
            PropertyType.TEXT,
            "Rótulo do Campo",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "placeholder",
            currentBlock?.properties?.placeholder || "Digite aqui...",
            PropertyType.TEXT,
            "Texto de Placeholder",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "inputType",
            currentBlock?.properties?.inputType || "text",
            PropertyType.SELECT,
            "Tipo de Input",
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: "text", label: "Texto" },
                { value: "email", label: "E-mail" },
                { value: "tel", label: "Telefone" },
                { value: "number", label: "Número" },
                { value: "password", label: "Senha" },
              ],
            }
          ),
          createProperty(
            "required",
            currentBlock?.properties?.required === true,
            PropertyType.SWITCH,
            "Campo Obrigatório",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "borderColor",
            currentBlock?.properties?.borderColor || BRAND_COLORS.primary,
            PropertyType.COLOR,
            "Cor da Borda",
            PropertyCategory.STYLE
          ),
          // 🔹 CONFIGURAÇÕES DO BOTÃO ASSOCIADO
          createProperty(
            "buttonText",
            currentBlock?.properties?.buttonText || "Continuar",
            PropertyType.TEXT,
            "Texto do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "buttonStyle",
            currentBlock?.properties?.buttonStyle || "primary",
            PropertyType.SELECT,
            "Estilo do Botão",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "primary", label: "Primário" },
                { value: "secondary", label: "Secundário" },
                { value: "outline", label: "Contorno" },
                { value: "ghost", label: "Fantasma" },
              ],
            }
          ),
          createProperty(
            "buttonSize",
            currentBlock?.properties?.buttonSize || "medium",
            PropertyType.SELECT,
            "Tamanho do Botão",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "small", label: "Pequeno" },
                { value: "medium", label: "Médio" },
                { value: "large", label: "Grande" },
                { value: "full", label: "Largura Total (Responsivo)" },
              ],
            }
          ),
          createProperty(
            "enableButtonWhenFilled",
            currentBlock?.properties?.enableButtonWhenFilled !== false,
            PropertyType.SWITCH,
            "Ativar Botão Apenas Quando Preenchido",
            PropertyCategory.BEHAVIOR
          ),
          // 🔹 CONFIGURAÇÕES DE NAVEGAÇÃO
          createProperty(
            "nextStepAction",
            currentBlock?.properties?.nextStepAction || "next-step",
            PropertyType.SELECT,
            "Ação ao Avançar",
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: "next-step", label: "Próxima Etapa Automática" },
                { value: "specific-step", label: "Etapa Específica" },
                { value: "url", label: "Abrir URL" },
                { value: "submit", label: "Enviar Formulário" },
              ],
            }
          ),
          createProperty(
            "specificStep",
            currentBlock?.properties?.specificStep || "",
            PropertyType.SELECT,
            "Etapa de Destino",
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: "step-01", label: "Etapa 1" },
                { value: "step-02", label: "Etapa 2" },
                { value: "step-03", label: "Etapa 3" },
                { value: "step-04", label: "Etapa 4" },
                { value: "step-05", label: "Etapa 5" },
                { value: "step-06", label: "Etapa 6" },
                { value: "step-07", label: "Etapa 7" },
                { value: "step-08", label: "Etapa 8" },
                { value: "step-09", label: "Etapa 9" },
                { value: "step-10", label: "Etapa 10" },
                { value: "results", label: "Resultados" },
                { value: "thank-you", label: "Página de Agradecimento" },
              ],
            }
          ),
          createProperty(
            "targetUrl",
            currentBlock?.properties?.targetUrl || "",
            PropertyType.URL,
            "URL de Destino",
            PropertyCategory.BEHAVIOR
          ),
          // 🔹 CONFIGURAÇÕES AVANÇADAS
          createProperty(
            "minLength",
            currentBlock?.properties?.minLength || 1,
            PropertyType.RANGE,
            "Mínimo de Caracteres",
            PropertyCategory.BEHAVIOR,
            { min: 0, max: 50, step: 1 }
          ),
          createProperty(
            "maxLength",
            currentBlock?.properties?.maxLength || 255,
            PropertyType.RANGE,
            "Máximo de Caracteres",
            PropertyCategory.BEHAVIOR,
            { min: 1, max: 1000, step: 10 }
          ),
          createProperty(
            "validationPattern",
            currentBlock?.properties?.validationPattern || "",
            PropertyType.TEXT,
            "Padrão de Validação (RegEx)",
            PropertyCategory.ADVANCED
          ),
          createProperty(
            "errorMessage",
            currentBlock?.properties?.errorMessage || "Por favor, preencha este campo",
            PropertyType.TEXT,
            "Mensagem de Erro",
            PropertyCategory.CONTENT
          ),
        ];

      case "form-container":
        return [
          ...getUniversalProperties(),
          createProperty(
            "elementId",
            currentBlock?.properties?.elementId || "",
            PropertyType.TEXT,
            "ID do Elemento",
            PropertyCategory.ADVANCED
          ),
          createProperty(
            "className",
            currentBlock?.properties?.className || "",
            PropertyType.TEXT,
            "Classe CSS",
            PropertyCategory.ADVANCED
          ),
          createProperty(
            "backgroundColor",
            currentBlock?.properties?.backgroundColor ?? currentBlock?.properties?.containerBackgroundColor ?? "transparent",
            PropertyType.COLOR,
            "Cor de Fundo",
            PropertyCategory.STYLE
          ),
        ];
      case "button-inline":
        return [
          ...getUniversalProperties(),
          ...getTextProperties(),
          createProperty(
            "variant",
            currentBlock?.properties?.variant || "primary",
            PropertyType.SELECT,
            "Variante",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "primary", label: "Primário" },
                { value: "secondary", label: "Secundário" },
                { value: "success", label: "Sucesso" },
                { value: "warning", label: "Aviso" },
                { value: "danger", label: "Perigo" },
                { value: "outline", label: "Contorno" },
                { value: "ghost", label: "Fantasma" },
              ],
            }
          ),
          createProperty(
            "size",
            currentBlock?.properties?.size || "medium",
            PropertyType.SELECT,
            "Tamanho",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "small", label: "Pequeno" },
                { value: "medium", label: "Médio" },
                { value: "large", label: "Grande" },
                { value: "full", label: "Largura Total (Responsivo)" },
              ],
            }
          ),
          // 🔹 SISTEMA DE NAVEGAÇÃO AVANÇADO
          createProperty(
            "action",
            currentBlock?.properties?.action || "next-step",
            PropertyType.SELECT,
            "Ação do Botão",
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: "none", label: "Nenhuma Ação" },
                { value: "next-step", label: "Próxima Etapa Automática" },
                { value: "specific-step", label: "Etapa Específica" },
                { value: "url", label: "Abrir URL" },
                { value: "submit", label: "Enviar Formulário" },
                { value: "download", label: "Download de Arquivo" },
              ],
            }
          ),
          createProperty(
            "specificStep",
            currentBlock?.properties?.specificStep || "",
            PropertyType.SELECT,
            "Etapa de Destino",
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: "step-01", label: "Etapa 1" },
                { value: "step-02", label: "Etapa 2" },
                { value: "step-03", label: "Etapa 3" },
                { value: "step-04", label: "Etapa 4" },
                { value: "step-05", label: "Etapa 5" },
                { value: "step-06", label: "Etapa 6" },
                { value: "step-07", label: "Etapa 7" },
                { value: "step-08", label: "Etapa 8" },
                { value: "step-09", label: "Etapa 9" },
                { value: "step-10", label: "Etapa 10" },
                { value: "results", label: "Resultados" },
                { value: "thank-you", label: "Página de Agradecimento" },
              ],
            }
          ),
          createProperty(
            "url",
            currentBlock?.properties?.url || "",
            PropertyType.URL,
            "URL de Destino",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "downloadUrl",
            currentBlock?.properties?.downloadUrl || "",
            PropertyType.URL,
            "URL do Arquivo para Download",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "openInNewTab",
            currentBlock?.properties?.openInNewTab !== false,
            PropertyType.SWITCH,
            "Abrir em Nova Aba",
            PropertyCategory.BEHAVIOR
          ),
          // 🔹 CONFIGURAÇÕES VISUAIS AVANÇADAS
          createProperty(
            "icon",
            currentBlock?.properties?.icon || "",
            PropertyType.TEXT,
            "Ícone (Nome ou SVG)",
            PropertyCategory.STYLE
          ),
          createProperty(
            "iconPosition",
            currentBlock?.properties?.iconPosition || "left",
            PropertyType.SELECT,
            "Posição do Ícone",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "left", label: "Esquerda" },
                { value: "right", label: "Direita" },
                { value: "top", label: "Acima" },
                { value: "bottom", label: "Abaixo" },
              ],
            }
          ),
          createProperty(
            "loading",
            currentBlock?.properties?.loading === true,
            PropertyType.SWITCH,
            "Estado de Carregamento",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "disabled",
            currentBlock?.properties?.disabled === true,
            PropertyType.SWITCH,
            "Botão Desabilitado",
            PropertyCategory.BEHAVIOR
          ),
        ];

      case "decorative-bar-inline":
        return [
          ...getUniversalProperties(),
          createProperty(
            "width",
            currentBlock?.properties?.width || "100%",
            PropertyType.SELECT,
            "Largura",
            PropertyCategory.LAYOUT,
            {
              options: createSelectOptions([
                { value: "25%", label: "Pequena (25%)" },
                { value: "50%", label: "Média (50%)" },
                { value: "75%", label: "Grande (75%)" },
                { value: "100%", label: "Total (100%)" },
                { value: "300px", label: "Fixa 300px" },
                { value: "500px", label: "Fixa 500px" },
              ]),
            }
          ),
          createProperty(
            "height",
            currentBlock?.properties?.height ?? 4,
            PropertyType.RANGE,
            "Altura",
            PropertyCategory.LAYOUT,
            { min: 1, max: 20, step: 1, unit: "px" }
          ),
          createProperty(
            "color",
            currentBlock?.properties?.color || BRAND_COLORS.primary,
            PropertyType.COLOR,
            "Cor Principal",
            PropertyCategory.STYLE
          ),
          createProperty(
            "gradientColors",
            JSON.stringify(
              currentBlock?.properties?.gradientColors || [
                BRAND_COLORS.primary,
                "#D4C2A8",
                BRAND_COLORS.primary,
              ]
            ),
            PropertyType.TEXTAREA,
            "Cores do Gradiente (JSON)",
            PropertyCategory.STYLE
          ),
          createProperty(
            "borderRadius",
            currentBlock?.properties?.borderRadius ?? 3,
            PropertyType.RANGE,
            "Arredondamento",
            PropertyCategory.STYLE,
            { min: 0, max: 20, step: 1, unit: "px" }
          ),
          createProperty(
            "showShadow",
            currentBlock?.properties?.showShadow !== false,
            PropertyType.SWITCH,
            "Mostrar Sombra",
            PropertyCategory.STYLE
          ),
        ];

      case "legal-notice-inline":
        return [
          ...getUniversalProperties(),
          ...getTextProperties(),
          createProperty(
            "privacyText",
            currentBlock?.properties?.privacyText || "Política de Privacidade",
            PropertyType.TEXT,
            "Texto Política de Privacidade",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "copyrightText",
            currentBlock?.properties?.copyrightText || "© 2025 Gisele Galvão Consultoria",
            PropertyType.TEXT,
            "Texto de Copyright",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "termsText",
            currentBlock?.properties?.termsText || "Termos de Uso",
            PropertyType.TEXT,
            "Texto Termos de Uso",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "fontFamily",
            currentBlock?.properties?.fontFamily || "inherit",
            PropertyType.SELECT,
            "Família da Fonte",
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: "inherit", label: "Padrão" },
                { value: "Inter", label: "Inter" },
                { value: "Roboto", label: "Roboto" },
                { value: "Open Sans", label: "Open Sans" },
                { value: "Playfair Display", label: "Playfair Display" },
              ]),
            }
          ),
          createProperty(
            "linkColor",
            currentBlock?.properties?.linkColor || BRAND_COLORS.accent,
            PropertyType.COLOR,
            "Cor dos Links",
            PropertyCategory.STYLE
          ),
          createProperty(
            "separatorText",
            currentBlock?.properties?.separatorText || " | ",
            PropertyType.TEXT,
            "Separador",
            PropertyCategory.CONTENT
          ),
        ];

      case "options-grid":
        return [
          ...getUniversalProperties(),
          // 📊 LAYOUT DO GRID
          createProperty(
            "gridColumns",
            currentBlock?.properties?.gridColumns ?? 2,
            PropertyType.SELECT,
            "Colunas do Grid",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 1, label: "1 Coluna" },
                { value: 2, label: "2 Colunas" },
              ],
            }
          ),
          createProperty(
            "contentDirection",
            currentBlock?.properties?.contentDirection || "vertical",
            PropertyType.SELECT,
            "Direção do Conteúdo",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: "vertical", label: "Vertical (Imagem → Texto)" },
                { value: "horizontal", label: "Horizontal (Lado a Lado)" },
              ],
            }
          ),
          createProperty(
            "contentLayout",
            currentBlock?.properties?.contentLayout || "image-text",
            PropertyType.SELECT,
            "Disposição Texto",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: "image-text", label: "Imagem | Texto" },
                { value: "text-only", label: "Apenas | Texto" },
                { value: "image-only", label: "Apenas | Imagem" },
              ],
            }
          ),
          createProperty(
            "imageSize",
            currentBlock?.properties?.imageSize || "256x256",
            PropertyType.SELECT,
            "Tamanho da Imagem (256x256px)",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: "200x200", label: "200x200 pixels" },
                { value: "256x256", label: "256x256 pixels (Padrão)" },
                { value: "300x300", label: "300x300 pixels" },
              ],
            }
          ),
          createProperty(
            "imageClasses",
            currentBlock?.properties?.imageClasses || "w-full h-full object-cover rounded-lg",
            PropertyType.TEXT,
            "Classes CSS da Imagem",
            PropertyCategory.ADVANCED
          ),
          createProperty(
            "gridGap",
            currentBlock?.properties?.gridGap ?? 8,
            PropertyType.SELECT,
            "Espaçamento Grid (gap-2 = 8px)",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 2, label: "gap-0.5 (2px)" },
                { value: 4, label: "gap-1 (4px)" },
                { value: 8, label: "gap-2 (8px) - Padrão" },
                { value: 16, label: "gap-4 (16px)" },
              ],
            }
          ),

          // 📝 EDITOR DE OPÇÕES
          createProperty(
            "options",
            // 🎯 FIX: Não sobrescrever opções existentes com valor padrão
            currentBlock?.properties?.options && currentBlock.properties.options.length > 0
              ? currentBlock.properties.options // Usar opções existentes
              : currentBlock?.content?.options && currentBlock.content.options.length > 0
                ? currentBlock.content.options // Fallback para content.options
                : [
                    // Só usar padrão se não houver opções em lugar nenhum
                    {
                      id: "option-a",
                      text: "Amo roupas confortáveis e práticas para o dia a dia.",
                      image: "",
                      points: 1,
                      category: "Casual",
                    },
                  ],
            PropertyType.ARRAY,
            "Lista de Opções",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "enableAddOption",
            currentBlock?.properties?.enableAddOption !== false,
            PropertyType.SWITCH,
            "Permitir Adicionar Opções",
            PropertyCategory.BEHAVIOR
          ),

          // ⚖️ VALIDAÇÕES
          createProperty(
            "multipleSelection",
            currentBlock?.properties?.multipleSelection !== false,
            PropertyType.SWITCH,
            "Múltipla Escolha",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "minSelections",
            currentBlock?.properties?.minSelections ?? 1,
            PropertyType.RANGE,
            "Mínimo de Seleções",
            PropertyCategory.BEHAVIOR,
            { min: 1, max: 8, step: 1 }
          ),
          createProperty(
            "maxSelections",
            currentBlock?.properties?.maxSelections ?? 3,
            PropertyType.RANGE,
            "Máximo de Seleções",
            PropertyCategory.BEHAVIOR,
            { min: 1, max: 8, step: 1 }
          ),
          createProperty(
            "autoAdvance",
            currentBlock?.properties?.autoAdvance === true,
            PropertyType.SWITCH,
            "Auto-avançar",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "autoAdvanceDelay",
            currentBlock?.properties?.autoAdvanceDelay ?? 1000,
            PropertyType.RANGE,
            "Delay do Auto-avanço (ms)",
            PropertyCategory.BEHAVIOR,
            { min: 500, max: 3000, step: 100 }
          ),
          createProperty(
            "enableButtonWhenValid",
            currentBlock?.properties?.enableButtonWhenValid !== false,
            PropertyType.SWITCH,
            "Ativar Botão Apenas Quando Válido",
            PropertyCategory.BEHAVIOR
          ),

          // 🎨 ESTILIZAÇÃO
          createProperty(
            "borderWidth",
            currentBlock?.properties?.borderWidth || "medium",
            PropertyType.SELECT,
            "Espessura das Bordas",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "thin", label: "Fina (1px)" },
                { value: "medium", label: "Média (2px)" },
                { value: "thick", label: "Grossa (3px)" },
              ],
            }
          ),
          createProperty(
            "shadowSize",
            currentBlock?.properties?.shadowSize || "small",
            PropertyType.SELECT,
            "Tamanho da Sombra",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "none", label: "Sem Sombra" },
                { value: "small", label: "Pequena" },
                { value: "medium", label: "Média" },
                { value: "large", label: "Grande" },
              ],
            }
          ),
          createProperty(
            "optionSpacing",
            currentBlock?.properties?.optionSpacing || "none",
            PropertyType.SELECT,
            "Espaçamento entre Opções",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "none", label: "Nenhum (0px)" },
                { value: "small", label: "Pequeno (4px)" },
                { value: "medium", label: "Médio (8px)" },
                { value: "large", label: "Grande (16px)" },
              ],
            }
          ),
          createProperty(
            "visualDetail",
            currentBlock?.properties?.visualDetail || "simple",
            PropertyType.SELECT,
            "Estilo do Detalhe Visual",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "simple", label: "Simples" },
                { value: "modern", label: "Moderno" },
                { value: "elegant", label: "Elegante" },
              ],
            }
          ),

          // 🔘 PROPRIEDADES DO BOTÃO
          createProperty(
            "buttonText",
            currentBlock?.properties?.buttonText || "Continuar",
            PropertyType.TEXT,
            "Texto do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "buttonScale",
            currentBlock?.properties?.buttonScale || "100%",
            PropertyType.SELECT,
            "Tamanho Uniforme",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "50%", label: "50%" },
                { value: "100%", label: "100%" },
                { value: "200%", label: "200%" },
              ],
            }
          ),
          createProperty(
            "buttonTextColor",
            currentBlock?.properties?.buttonTextColor || "#FFFFFF",
            PropertyType.COLOR,
            "Cor de Fundo do Texto",
            PropertyCategory.STYLE
          ),
          createProperty(
            "buttonContainerColor",
            currentBlock?.properties?.buttonContainerColor || BRAND_COLORS.primary,
            PropertyType.COLOR,
            "Cor de Fundo do Container",
            PropertyCategory.STYLE
          ),
          createProperty(
            "buttonBorderColor",
            currentBlock?.properties?.buttonBorderColor || BRAND_COLORS.primary,
            PropertyType.COLOR,
            "Cor da Borda",
            PropertyCategory.STYLE
          ),
          createProperty(
            "fontFamily",
            currentBlock?.properties?.fontFamily || "inherit",
            PropertyType.SELECT,
            "Família da Fonte",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "inherit", label: "Padrão" },
                { value: "Inter", label: "Inter" },
                { value: "Roboto", label: "Roboto" },
                { value: "Open Sans", label: "Open Sans" },
              ],
            }
          ),
          createProperty(
            "buttonAlignment",
            currentBlock?.properties?.buttonAlignment || "center",
            PropertyType.SELECT,
            "Alinhamento",
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: "left", label: "Esquerda" },
                { value: "center", label: "Centro" },
                { value: "right", label: "Direita" },
              ],
            }
          ),
          createProperty(
            "shadowType",
            currentBlock?.properties?.shadowType || "none",
            PropertyType.SELECT,
            "Tipo de Sombra",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "none", label: "Sem Sombra" },
                { value: "small", label: "Pequena" },
                { value: "medium", label: "Média" },
              ],
            }
          ),
          createProperty(
            "shadowColor",
            currentBlock?.properties?.shadowColor || "#000000",
            PropertyType.COLOR,
            "Cor da Sombra",
            PropertyCategory.STYLE
          ),
          createProperty(
            "visualEffect",
            currentBlock?.properties?.visualEffect || "shine",
            PropertyType.SELECT,
            "Efeito Visual",
            PropertyCategory.STYLE,
            {
              options: [
                { value: "none", label: "Nenhum" },
                { value: "shine", label: "Brilho Deslizante" },
                { value: "pulse", label: "Pulsação" },
                { value: "hover", label: "Efeito Hover" },
              ],
            }
          ),
          createProperty(
            "borderRadius",
            currentBlock?.properties?.borderRadius ?? 7,
            PropertyType.RANGE,
            "Raio da Borda",
            PropertyCategory.STYLE,
            { min: 0, max: 50, step: 1, unit: "px" }
          ),
          createProperty(
            "hoverOpacity",
            currentBlock?.properties?.hoverOpacity ?? 75,
            PropertyType.RANGE,
            "Opacidade no Hover",
            PropertyCategory.STYLE,
            { min: 50, max: 100, step: 5, unit: "%" }
          ),
          createProperty(
            "buttonAction",
            currentBlock?.properties?.buttonAction || "next-step",
            PropertyType.SELECT,
            "Ação do Botão",
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: "next-step", label: "Próxima Etapa" },
                { value: "specific-step", label: "Etapa Específica" },
                { value: "url", label: "URL Externa" },
              ],
            }
          ),
          createProperty(
            "targetUrl",
            currentBlock?.properties?.targetUrl || "",
            PropertyType.URL,
            "URL de Destino",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "linkTarget",
            currentBlock?.properties?.linkTarget || "_blank",
            PropertyType.SELECT,
            "Destino do Link",
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: "_self", label: "Mesma Aba (_self)" },
                { value: "_blank", label: "Nova Aba (_blank)" },
              ],
            }
          ),
          createProperty(
            "requireValidInput",
            currentBlock?.properties?.requireValidInput !== false,
            PropertyType.SWITCH,
            "Requer Input Válido",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "disabled",
            currentBlock?.properties?.disabled === true,
            PropertyType.SWITCH,
            "Desabilitado",
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            "componentId",
            currentBlock?.properties?.componentId || "step-2-block-options-grid-pos-1",
            PropertyType.TEXT,
            "ID do Componente",
            PropertyCategory.ADVANCED
          ),
        ];

      default:
        console.warn(
          `🔧 useUnifiedProperties: Tipo de bloco "${blockType}" não tem propriedades específicas definidas.`
        );
        return getUniversalProperties();
    }
  }, [blockType, blockId, currentBlock]);

  const [properties, setProperties] = useState<UnifiedProperty[]>([]);

  // Sincronizar propriedades quando mudarem
  useEffect(() => {
    if (generatedProperties && Array.isArray(generatedProperties)) {
      setProperties(generatedProperties);
    }
  }, [generatedProperties]);

  const updateProperty = useCallback(
    (key: string, value: any) => {
      setProperties(prev => prev.map(prop => (prop.key === key ? { ...prop, value } : prop)));

      if (onUpdateExternal && block) {
        const updatedProps = { ...block.properties, [key]: value };
        onUpdateExternal(block.id, { properties: updatedProps });
      }
    },
    [onUpdateExternal, block]
  );

  const resetProperties = useCallback(() => {
    const resetProps = generatedProperties?.map(prop => ({
      ...prop,
      value: prop.defaultValue ?? prop.value,
    }));
    if (resetProps) {
      setProperties(resetProps);
    }
  }, [generatedProperties]);

  const validateProperty = (property: UnifiedProperty): boolean => {
    if (!property.key || property.value === undefined) {
      return false;
    }

    switch (property.type) {
      case PropertyType.RANGE:
        const numValue = Number(property.value);
        return (
          !isNaN(numValue) &&
          (property.min === undefined || numValue >= property.min) &&
          (property.max === undefined || numValue <= property.max)
        );
      case PropertyType.SELECT:
        return property.options?.some(opt => opt.value === property.value) ?? true;
      case PropertyType.COLOR:
        return typeof property.value === "string" && property.value.length > 0;
      case PropertyType.SWITCH:
        return typeof property.value === "boolean";
      default:
        return true;
    }
  };

  const validateProperties = useCallback(() => {
    return properties.every(prop => validateProperty(prop));
  }, [properties]);

  const getPropertyByKey = useCallback(
    (key: string) => {
      return properties.find(prop => prop.key === key);
    },
    [properties]
  );

  const getPropertiesByCategory = useCallback(
    (category: PropertyCategoryOrString) => {
      if (!properties || !Array.isArray(properties)) {
        return [];
      }
      return properties.filter(prop => prop.category === category);
    },
    [properties]
  );

  const exportProperties = useCallback(() => {
    return properties.reduce(
      (acc, prop) => {
        acc[prop.key] = prop.value;
        return acc;
      },
      {} as Record<string, any>
    );
  }, [properties]);

  const applyBrandColors = useCallback(() => {
    if (!properties.length || !block) return;

    setProperties(prev =>
      prev.map(prop => {
        if (prop.type === PropertyType.COLOR) {
          if (prop.key.includes("text") || prop.key.includes("Text")) {
            return { ...prop, value: BRAND_COLORS.textPrimary };
          }
          if (prop.key.includes("background") || prop.key.includes("Background")) {
            return { ...prop, value: BRAND_COLORS.primary };
          }
          if (prop.key.includes("border") || prop.key.includes("Border")) {
            return { ...prop, value: BRAND_COLORS.primary };
          }
        }
        return prop;
      })
    );

    if (onUpdateExternal && block) {
      const updatedProps = properties.reduce(
        (acc, prop) => {
          if (prop.type === PropertyType.COLOR) {
            if (prop.key.includes("text") || prop.key.includes("Text")) {
              acc[prop.key] = BRAND_COLORS.textPrimary;
            } else if (prop.key.includes("background") || prop.key.includes("Background")) {
              acc[prop.key] = BRAND_COLORS.primary;
            } else if (prop.key.includes("border") || prop.key.includes("Border")) {
              acc[prop.key] = BRAND_COLORS.primary;
            } else {
              acc[prop.key] = prop.value;
            }
          } else {
            acc[prop.key] = prop.value;
          }
          return acc;
        },
        {} as Record<string, any>
      );
      onUpdateExternal(block.id, { properties: updatedProps });
    }
  }, [properties, block?.id, onUpdateExternal]);

  return {
    properties,
    updateProperty,
    resetProperties,
    validateProperties,
    getPropertyByKey,
    getPropertiesByCategory,
    exportProperties,
    applyBrandColors,
  };
};

/**
 * 🎯 Helper para componentes inline otimizados
 */
export const getInlineComponentProperties = (type: string, currentProps: any = {}) => {
  const inlineDefaults = {
    "heading-inline": {
      content: "Título",
      level: "h2",
      textAlign: "center",
      color: "#432818",
      fontWeight: "normal",
    },
    "text-inline": {
      text: "Digite seu texto aqui...",
      fontSize: "1rem",
      alignment: "center",
      color: "#6B5B4E",
      fontWeight: "normal",
    },
    "button-inline": {
      text: "Clique aqui",
      style: "primary",
      size: "medium",
      backgroundColor: "#B89B7A",
      textColor: "#FFFFFF",
      action: "next-step",
      borderRadius: 8,
      padding: "12px 24px",
      fontWeight: "medium",
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s ease",
    },
    "image-display-inline": {
      src: "",
      alt: "Imagem",
      width: "auto",
      height: "auto",
      borderRadius: 12,
      shadow: true,
      alignment: "center",
    },
    "legal-notice-inline": {
      privacyText: "Política de Privacidade",
      copyrightText: "© 2025 Gisele Galvão Consultoria",
      termsText: "Termos de Uso",
      fontSize: "0.75rem",
      textAlign: "center",
      color: "#8F7A6A",
      linkColor: "#B89B7A",
    },
  } as const;

  type InlineDefaultsKey = keyof typeof inlineDefaults;

  return {
    ...((inlineDefaults[type as InlineDefaultsKey] || {}) as object),
    ...currentProps,
  };
};

export default useUnifiedProperties;

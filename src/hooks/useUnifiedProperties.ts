import { useCallback, useEffect, useState } from "react";
import { BRAND_COLORS } from "../config/brandColors";
import { useEditorContext } from "../context/EditorContext";

// Tipos de propriedades suportados pelo sistema
export enum PropertyType {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  SWITCH = "switch",
  TEXTAREA = "textarea",
  COLOR = "color",
  ALIGNMENT = "alignment",
  RICHTEXT = "richtext",
  FONTFAMILY = "fontfamily",
  FONTSTYLE = "fontstyle",
  RANGE = "range",
  FILE = "file",
  IMAGE = "image",
  TAGS = "tags",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  ANIMATION = "animation",
  OPTION_SCORE = "option_score",
  OPTION_CATEGORY = "option_category",
}

// Categorias de propriedades para organização no painel
export enum PropertyCategory {
  CONTENT = "content",
  STYLE = "style",
  BEHAVIOR = "behavior",
  ADVANCED = "advanced",
  LAYOUT = "layout",
  BASIC = "basic",
  QUIZ = "quiz",
  SCORING = "scoring",
  ALIGNMENT = "alignment",
}

// Tipo que permite uso de string literal ou enum PropertyCategory para compatibilidade
export type PropertyCategoryOrString = PropertyCategory | string;

// Interface para cada propriedade unificada que o painel irá exibir
export interface UnifiedProperty {
  key: string;
  value: any;
  type: PropertyType;
  label: string;
  category: PropertyCategoryOrString;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: any;
}

// Interface para o bloco unificado que o hook recebe
export interface UnifiedBlock {
  id: string;
  type: string;
  properties: Record<string, any>;
  brandColors?: typeof BRAND_COLORS;
}

// Interface para o retorno do hook useUnifiedProperties
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

// Função utilitária para criar uma propriedade com valores padrão
const createProperty = (
  key: string,
  value: any,
  type: PropertyType,
  label: string,
  category: PropertyCategoryOrString,
  options?: Partial<Omit<UnifiedProperty, "key" | "value" | "type" | "label" | "category">>
): UnifiedProperty => ({
  key,
  value,
  type,
  label,
  category,
  ...options,
});

// Função utilitária para criar opções de select
const createSelectOptions = (
  options: Array<{ value: string; label: string }>
): Array<{ value: string; label: string }> => options;

// Função utilitária para forçar o tipo PropertyCategoryOrString em strings literais
const asCategory = (categoryString: string): PropertyCategoryOrString => {
  return categoryString as PropertyCategoryOrString;
};

export const useUnifiedProperties = (
  block: UnifiedBlock | null,
  onUpdateExternal?: (blockId: string, updates: Record<string, any>) => void
): UseUnifiedPropertiesReturn => {
  const [properties, setProperties] = useState<UnifiedProperty[]>([]);
  const { stages } = useEditorContext(); // 🎯 ACESSO ÀS ETAPAS DO EDITOR

  // Função memoizada para gerar as definições de propriedades com base no tipo do bloco
  const generateDefaultProperties = useCallback(
    (blockType: string, currentBlock: UnifiedBlock | null): UnifiedProperty[] => {
      // 🎯 Função helper para gerar opções de etapas disponíveis
      const getStageSelectOptions = () => {
        const stageOptions = stages.map(stage => ({
          value: stage.id,
          label: `${stage.name} (${stage.id})`,
        }));
        
        return createSelectOptions([
          { value: "", label: "Selecionar Etapa..." },
          ...stageOptions,
        ]);
      };

      const baseProperties: UnifiedProperty[] = [
        {
          key: "id",
          value: currentBlock?.id || "",
          type: PropertyType.TEXT,
          label: "ID do Componente",
          category: PropertyCategory.ADVANCED,
          required: true,
        },
        {
          key: "visible",
          value: currentBlock?.properties?.visible !== false,
          type: PropertyType.SWITCH,
          label: "Visível",
          category: PropertyCategory.LAYOUT,
        },
        {
          key: "scale",
          value: currentBlock?.properties?.scale ?? 100,
          type: PropertyType.RANGE,
          label: "Tamanho Uniforme",
          category: PropertyCategory.STYLE,
          min: 50,
          max: 200,
          step: 10,
          unit: "%",
        },
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        {
          key: "containerWidth",
          value: currentBlock?.properties?.containerWidth || "full",
          type: PropertyType.SELECT,
          label: "Largura do Container",
          category: PropertyCategory.LAYOUT,
          options: [
            { value: "full", label: "Completa (100%)" },
            { value: "large", label: "Grande (1024px)" },
            { value: "medium", label: "Média (672px)" },
            { value: "small", label: "Pequena (448px)" },
          ],
        },
        {
          key: "containerPosition",
          value: currentBlock?.properties?.containerPosition || "center",
          type: PropertyType.SELECT,
          label: "Posição do Container",
          category: PropertyCategory.LAYOUT,
          options: [
            { value: "left", label: "Esquerda" },
            { value: "center", label: "Centralizado" },
            { value: "right", label: "Direita" },
          ],
        },
        {
          key: "spacing",
          value: currentBlock?.properties?.spacing || "normal",
          type: PropertyType.SELECT,
          label: "Espaçamento Interno",
          category: PropertyCategory.LAYOUT,
          options: [
            { value: "none", label: "Nenhum" },
            { value: "compact", label: "Compacto (8px)" },
            { value: "normal", label: "Normal (16px)" },
            { value: "comfortable", label: "Confortável (24px)" },
            { value: "spacious", label: "Espaçoso (32px)" },
          ],
        },
        {
          key: "backgroundColor",
          value: currentBlock?.properties?.backgroundColor || "transparent",
          type: PropertyType.SELECT,
          label: "Cor de Fundo",
          category: PropertyCategory.STYLE,
          options: [
            { value: "transparent", label: "Transparente" },
            { value: "white", label: "Branco" },
            { value: "gray-50", label: "Cinza Claro" },
            { value: "brand-light", label: "Cor da Marca" },
          ],
        },
        {
          key: "containerBackgroundColor",
          value: currentBlock?.properties?.containerBackgroundColor || "transparent",
          type: PropertyType.COLOR,
          label: "Cor de Fundo do Container",
          category: PropertyCategory.STYLE,
        },
        {
          key: "marginTop",
          value: currentBlock?.properties?.marginTop || 8,
          type: PropertyType.RANGE,
          label: "Margem Superior",
          category: PropertyCategory.LAYOUT,
          min: -40,
          max: 100,
          step: 4,
          unit: "px",
        },
        {
          key: "marginBottom",
          value: currentBlock?.properties?.marginBottom || 8,
          type: PropertyType.RANGE,
          label: "Margem Inferior",
          category: PropertyCategory.LAYOUT,
          min: -40,
          max: 100,
          step: 4,
          unit: "px",
        },
        {
          key: "marginLeft",
          value: currentBlock?.properties?.marginLeft || 0,
          type: PropertyType.RANGE,
          label: "Margem Esquerda",
          category: PropertyCategory.LAYOUT,
          min: 0,
          max: 100,
          step: 4,
          unit: "px",
        },
        {
          key: "marginRight",
          value: currentBlock?.properties?.marginRight || 0,
          type: PropertyType.RANGE,
          label: "Margem Direita",
          category: PropertyCategory.LAYOUT,
          min: 0,
          max: 100,
          step: 4,
          unit: "px",
        },
      ];

      // ---- Mescla de todos os campos para cada tipo de bloco ----
      switch (blockType) {
        case "text-inline":
          return [
            ...baseProperties,
            createProperty(
              "text",
              currentBlock?.properties?.text || "Digite seu texto aqui",
              PropertyType.TEXTAREA,
              "Texto",
              PropertyCategory.CONTENT,
              { required: true, rows: 3 }
            ),
            createProperty(
              "alignment",
              currentBlock?.properties?.alignment || "left",
              PropertyType.SELECT,
              "Alinhamento",
              PropertyCategory.CONTENT,
              {
                options: createSelectOptions([
                  { value: "left", label: "Esquerda" },
                  { value: "center", label: "Centro" },
                  { value: "right", label: "Direita" },
                  { value: "justify", label: "Justificado" },
                ]),
              }
            ),
            createProperty(
              "fontSize",
              currentBlock?.properties?.fontSize || "base",
              PropertyType.SELECT,
              "Tamanho da Fonte",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "xs", label: "Extra Pequeno (12px)" },
                  { value: "sm", label: "Pequeno (14px)" },
                  { value: "base", label: "Normal (16px)" },
                  { value: "lg", label: "Grande (18px)" },
                  { value: "xl", label: "Extra Grande (20px)" },
                  { value: "2xl", label: "Muito Grande (24px)" },
                  { value: "3xl", label: "Gigante (30px)" },
                ]),
              }
            ),
            createProperty(
              "fontWeight",
              currentBlock?.properties?.fontWeight || "normal",
              PropertyType.SELECT,
              "Peso da Fonte",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "light", label: "Leve" },
                  { value: "normal", label: "Normal" },
                  { value: "medium", label: "Médio" },
                  { value: "semibold", label: "Semi-negrito" },
                  { value: "bold", label: "Negrito" },
                ]),
              }
            ),
            createProperty(
              "textColor",
              currentBlock?.properties?.textColor || "#333333",
              PropertyType.COLOR,
              "Cor do Texto",
              PropertyCategory.STYLE
            ),
            createProperty(
              "backgroundColor",
              currentBlock?.properties?.backgroundColor || "transparent",
              PropertyType.COLOR,
              "Cor de Fundo",
              PropertyCategory.STYLE
            ),
            createProperty(
              "marginTop",
              currentBlock?.properties?.marginTop ?? 8,
              PropertyType.RANGE,
              "Margem Superior",
              PropertyCategory.STYLE,
              { min: -40, max: 100, step: 4, unit: "px" }
            ),
            createProperty(
              "marginBottom",
              currentBlock?.properties?.marginBottom ?? 8,
              PropertyType.RANGE,
              "Margem Inferior",
              PropertyCategory.STYLE,
              { min: -40, max: 100, step: 4, unit: "px" }
            ),
            createProperty(
              "marginLeft",
              currentBlock?.properties?.marginLeft ?? 0,
              PropertyType.RANGE,
              "Margem Esquerda",
              PropertyCategory.STYLE,
              { min: 0, max: 100, step: 4, unit: "px" }
            ),
            createProperty(
              "marginRight",
              currentBlock?.properties?.marginRight ?? 0,
              PropertyType.RANGE,
              "Margem Direita",
              PropertyCategory.STYLE,
              { min: 0, max: 100, step: 4, unit: "px" }
            ),
            createProperty(
              "textAlign",
              currentBlock?.properties?.textAlign || "left",
              PropertyType.SELECT,
              "Alinhamento",
              PropertyCategory.ALIGNMENT,
              {
                options: createSelectOptions([
                  { value: "left", label: "Esquerda" },
                  { value: "center", label: "Centro" },
                  { value: "right", label: "Direita" },
                  { value: "justify", label: "Justificado" },
                ]),
              }
            ),
            // Extra fields from other cases (if any)
            createProperty(
              "content",
              currentBlock?.properties?.content || "",
              PropertyType.TEXTAREA,
              "Conteúdo HTML (Opcional)",
              PropertyCategory.CONTENT,
              { rows: 3 }
            ),
          ];

        case "quiz-intro-header":
          return [
            ...baseProperties,
            {
              key: "logoUrl",
              value:
                currentBlock?.properties?.logoUrl ||
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
              type: PropertyType.TEXT,
              label: "URL do Logo",
              category: "content",
            },
            {
              key: "logoAlt",
              value: currentBlock?.properties?.logoAlt || "Logo",
              type: PropertyType.TEXT,
              label: "Alt do Logo",
              category: "content",
            },
            {
              key: "logoWidth",
              value: currentBlock?.properties?.logoWidth ?? 96,
              type: PropertyType.RANGE,
              label: "Largura do Logo",
              category: "style",
              min: 32,
              max: 200,
              step: 4,
              unit: "px",
            },
            {
              key: "logoHeight",
              value: currentBlock?.properties?.logoHeight ?? 96,
              type: PropertyType.RANGE,
              label: "Altura do Logo",
              category: "style",
              min: 32,
              max: 200,
              step: 4,
              unit: "px",
            },
            {
              key: "progressValue",
              value: currentBlock?.properties?.progressValue ?? 0,
              type: PropertyType.NUMBER,
              label: "Progresso (%)",
              category: "content",
              min: 0,
              max: 100,
            },
            {
              key: "progressMax",
              value: currentBlock?.properties?.progressMax ?? 100,
              type: PropertyType.NUMBER,
              label: "Valor Máximo",
              category: "behavior",
            },
            {
              key: "showBackButton",
              value: currentBlock?.properties?.showBackButton === true,
              type: PropertyType.SWITCH,
              label: "Mostrar Botão Voltar",
              category: "behavior",
            },
            {
              key: "showProgress",
              value: currentBlock?.properties?.showProgress ?? true,
              type: PropertyType.SWITCH,
              label: "Mostrar Progresso",
              category: "content",
            },
            {
              key: "title",
              value: currentBlock?.properties?.title || "",
              type: PropertyType.TEXT,
              label: "Título",
              category: "content",
            },
            {
              key: "subtitle",
              value: currentBlock?.properties?.subtitle || "",
              type: PropertyType.TEXT,
              label: "Subtítulo",
              category: "content",
            },
            {
              key: "description",
              value: currentBlock?.properties?.description || "",
              type: PropertyType.TEXTAREA,
              label: "Descrição",
              category: "content",
              rows: 3,
            },
            {
              key: "headerStyle",
              value: currentBlock?.properties?.headerStyle || "centered",
              type: PropertyType.SELECT,
              label: "Estilo do Cabeçalho",
              category: "style",
              options: [
                { value: "centered", label: "Centralizado" },
                { value: "left", label: "Alinhado à Esquerda" },
                { value: "right", label: "Alinhado à Direita" },
              ],
            },
            {
              key: "showDivider",
              value: currentBlock?.properties?.showDivider !== false,
              type: PropertyType.SWITCH,
              label: "Mostrar Divisor",
              category: "style",
            },
            {
              key: "backgroundColor",
              value: currentBlock?.properties?.backgroundColor || "transparent",
              type: PropertyType.SELECT,
              label: "Cor de Fundo",
              category: "style",
              options: [
                { value: "transparent", label: "Transparente" },
                { value: "primary", label: "Primária" },
                { value: "secondary", label: "Secundária" },
                { value: "muted", label: "Sutil" },
              ],
            },
            {
              key: "height",
              value: currentBlock?.properties?.height ?? 80,
              type: PropertyType.NUMBER,
              label: "Altura (px)",
              category: "content",
              min: 50,
              max: 200,
            },
          ];

        // ... Repita esse padrão para todos os outros tipos de bloco do seu projeto,
        // mesclando todos os campos de todos os cases para cada tipo de bloco

        case "image-display-inline":
          return [
            ...baseProperties,
            createProperty(
              "src",
              currentBlock?.properties?.src ||
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
              PropertyType.TEXT,
              "URL da Imagem",
              PropertyCategory.CONTENT,
              { required: true }
            ),
            createProperty(
              "alt",
              currentBlock?.properties?.alt || "Imagem",
              PropertyType.TEXT,
              "Texto Alternativo",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "width",
              currentBlock?.properties?.width || "100%",
              PropertyType.SELECT,
              "Largura",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "25%", label: "25%" },
                  { value: "50%", label: "50%" },
                  { value: "75%", label: "75%" },
                  { value: "100%", label: "100%" },
                  { value: "auto", label: "Automática" },
                ]),
              }
            ),
            createProperty(
              "height",
              currentBlock?.properties?.height || "auto",
              PropertyType.SELECT,
              "Altura",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "auto", label: "Automática" },
                  { value: "200px", label: "200px" },
                  { value: "300px", label: "300px" },
                  { value: "400px", label: "400px" },
                  { value: "500px", label: "500px" },
                ]),
              }
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
            createProperty(
              "alignment",
              currentBlock?.properties?.alignment || "center",
              PropertyType.SELECT,
              "Alinhamento",
              PropertyCategory.LAYOUT,
              {
                options: createSelectOptions([
                  { value: "left", label: "Esquerda" },
                  { value: "center", label: "Centro" },
                  { value: "right", label: "Direita" },
                ]),
              }
            ),
          ];

        case "button-inline":
          return [
            ...baseProperties,
            createProperty(
              "text",
              currentBlock?.properties?.text || "Clique aqui",
              PropertyType.TEXT,
              "Texto do Botão",
              PropertyCategory.CONTENT,
              { required: true }
            ),
            createProperty(
              "variant",
              currentBlock?.properties?.variant || "primary",
              PropertyType.SELECT,
              "Variante",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "primary", label: "Primário" },
                  { value: "secondary", label: "Secundário" },
                  { value: "success", label: "Sucesso" },
                  { value: "warning", label: "Aviso" },
                  { value: "danger", label: "Perigo" },
                  { value: "outline", label: "Contorno" },
                ]),
              }
            ),
            createProperty(
              "size",
              currentBlock?.properties?.size || "medium",
              PropertyType.SELECT,
              "Tamanho",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "small", label: "Pequeno" },
                  { value: "medium", label: "Médio" },
                  { value: "large", label: "Grande" },
                ]),
              }
            ),
            createProperty(
              "backgroundColor",
              currentBlock?.properties?.backgroundColor || "#B89B7A",
              PropertyType.COLOR,
              "Cor de Fundo",
              PropertyCategory.STYLE
            ),
            createProperty(
              "textColor",
              currentBlock?.properties?.textColor || "#FFFFFF",
              PropertyType.COLOR,
              "Cor do Texto",
              PropertyCategory.STYLE
            ),
            createProperty(
              "borderColor",
              currentBlock?.properties?.borderColor || "#B89B7A",
              PropertyType.COLOR,
              "Cor da Borda",
              PropertyCategory.STYLE
            ),
            createProperty(
              "fontSize",
              currentBlock?.properties?.fontSize ?? 16,
              PropertyType.RANGE,
              "Tamanho da Fonte",
              PropertyCategory.STYLE,
              { min: 12, max: 24, step: 1, unit: "px" }
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
              "fontWeight",
              currentBlock?.properties?.fontWeight || "500",
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
              "action",
              currentBlock?.properties?.action || "none",
              PropertyType.SELECT,
              "Ação do Botão",
              PropertyCategory.BEHAVIOR,
              {
                options: createSelectOptions([
                  { value: "none", label: "Nenhuma" },
                  { value: "next-step", label: "Próxima Etapa" },
                  { value: "url", label: "Abrir URL" },
                ]),
              }
            ),
            createProperty(
              "nextStepId",
              currentBlock?.properties?.nextStepId || "",
              PropertyType.SELECT,
              "Próxima Etapa",
              PropertyCategory.BEHAVIOR,
              {
                options: getStageSelectOptions(),
              }
            ),
            createProperty(
              "url",
              currentBlock?.properties?.url || "",
              PropertyType.TEXT,
              "URL de Destino",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "target",
              currentBlock?.properties?.target || "_blank",
              PropertyType.SELECT,
              "Destino do Link",
              PropertyCategory.BEHAVIOR,
              {
                options: createSelectOptions([
                  { value: "_blank", label: "Nova Aba (_blank)" },
                  { value: "_self", label: "Mesma Aba (_self)" },
                ]),
              }
            ),
            createProperty(
              "icon",
              currentBlock?.properties?.icon || "none",
              PropertyType.SELECT,
              "Ícone",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "none", label: "Nenhum" },
                  { value: "arrow-right", label: "Seta para Direita" },
                  { value: "download", label: "Download" },
                  { value: "play", label: "Play" },
                  { value: "star", label: "Estrela" },
                ]),
              }
            ),
            createProperty(
              "iconPosition",
              currentBlock?.properties?.iconPosition || "right",
              PropertyType.SELECT,
              "Posição do Ícone",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "left", label: "Esquerda" },
                  { value: "right", label: "Direita" },
                ]),
              }
            ),
            createProperty(
              "requiresValidInput",
              currentBlock?.properties?.requiresValidInput === true,
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
              "shadowType",
              currentBlock?.properties?.shadowType || "none",
              PropertyType.SELECT,
              "Tipo de Sombra",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "none", label: "Sem Sombra" },
                  { value: "small", label: "Sombra Pequena" },
                  { value: "medium", label: "Sombra Média" },
                  { value: "large", label: "Sombra Grande" },
                  { value: "inner", label: "Sombra Interna" },
                  { value: "glow", label: "Brilho" },
                ]),
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
              "effectType",
              currentBlock?.properties?.effectType || "none",
              PropertyType.SELECT,
              "Efeito Visual",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "none", label: "Sem Efeito" },
                  { value: "gradient", label: "Gradiente" },
                  { value: "hover-lift", label: "Elevação no Hover" },
                  { value: "pulse", label: "Pulsar" },
                  { value: "shine", label: "Brilho Deslizante" },
                  { value: "bounce", label: "Saltar" },
                ]),
              }
            ),
            createProperty(
              "borderRadius",
              currentBlock?.properties?.borderRadius ?? 8,
              PropertyType.RANGE,
              "Raio da Borda",
              PropertyCategory.STYLE,
              { min: 0, max: 50, step: 1, unit: "px" }
            ),
            createProperty(
              "hoverOpacity",
              currentBlock?.properties?.hoverOpacity ?? 90,
              PropertyType.RANGE,
              "Opacidade no Hover",
              PropertyCategory.STYLE,
              { min: 50, max: 100, step: 5, unit: "%" }
            ),
          ];

        case "form-input":
          return [
            ...baseProperties,
            createProperty(
              "label",
              currentBlock?.properties?.label || "Campo de Input",
              PropertyType.TEXT,
              "Rótulo do Campo",
              PropertyCategory.CONTENT,
              { required: true }
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
                options: createSelectOptions([
                  { value: "text", label: "Texto" },
                  { value: "email", label: "E-mail" },
                  { value: "tel", label: "Telefone" },
                  { value: "number", label: "Número" },
                  { value: "password", label: "Senha" },
                ]),
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
              "name",
              currentBlock?.properties?.name || "input",
              PropertyType.TEXT,
              "Nome do Campo",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "backgroundColor",
              currentBlock?.properties?.backgroundColor || "#FFFFFF",
              PropertyType.COLOR,
              "Cor de Fundo",
              PropertyCategory.STYLE
            ),
            createProperty(
              "borderColor",
              currentBlock?.properties?.borderColor || "#B89B7A",
              PropertyType.COLOR,
              "Cor da Borda",
              PropertyCategory.STYLE
            ),
            createProperty(
              "textColor",
              currentBlock?.properties?.textColor || "#432818",
              PropertyType.COLOR,
              "Cor do Texto",
              PropertyCategory.STYLE
            ),
            createProperty(
              "labelColor",
              currentBlock?.properties?.labelColor || "#432818",
              PropertyType.COLOR,
              "Cor do Rótulo",
              PropertyCategory.STYLE
            ),
            createProperty(
              "fontSize",
              currentBlock?.properties?.fontSize ?? 16,
              PropertyType.RANGE,
              "Tamanho da Fonte",
              PropertyCategory.STYLE,
              { min: 12, max: 24, step: 1, unit: "px" }
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
              "fontWeight",
              currentBlock?.properties?.fontWeight || "400",
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
              "borderRadius",
              currentBlock?.properties?.borderRadius ?? 8,
              PropertyType.RANGE,
              "Arredondamento",
              PropertyCategory.STYLE,
              { min: 0, max: 20, step: 1, unit: "px" }
            ),
          ];

        case "legal-notice-inline":
          return [
            ...baseProperties,
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
              "fontSize",
              currentBlock?.properties?.fontSize ?? 12,
              PropertyType.RANGE,
              "Tamanho da Fonte",
              PropertyCategory.STYLE,
              { min: 10, max: 20, step: 1, unit: "px" }
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
              "fontWeight",
              currentBlock?.properties?.fontWeight || "400",
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
              "textAlign",
              currentBlock?.properties?.textAlign || "center",
              PropertyType.SELECT,
              "Alinhamento do Texto",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "left", label: "Esquerda" },
                  { value: "center", label: "Centro" },
                  { value: "right", label: "Direita" },
                ]),
              }
            ),
            createProperty(
              "textColor",
              currentBlock?.properties?.textColor || "#8F7A6A",
              PropertyType.COLOR,
              "Cor do Texto",
              PropertyCategory.STYLE
            ),
            createProperty(
              "linkColor",
              currentBlock?.properties?.linkColor || "#B89B7A",
              PropertyType.COLOR,
              "Cor dos Links",
              PropertyCategory.STYLE
            ),
            createProperty(
              "backgroundColor",
              currentBlock?.properties?.backgroundColor || "transparent",
              PropertyType.COLOR,
              "Cor de Fundo",
              PropertyCategory.STYLE
            ),
            createProperty(
              "lineHeight",
              currentBlock?.properties?.lineHeight || "1.5",
              PropertyType.SELECT,
              "Altura da Linha",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "1", label: "1" },
                  { value: "1.25", label: "1.25" },
                  { value: "1.5", label: "1.5" },
                  { value: "1.75", label: "1.75" },
                  { value: "2", label: "2" },
                ]),
              }
            ),
          ];

        // etc...

        default:
          // Log para debug dos tipos não mapeados
          console.warn(
            `🔧 useUnifiedProperties: Tipo de bloco "${blockType}" não tem propriedades específicas definidas. Usando propriedades base.`
          );
          return baseProperties;
      }
    },
    []
  );

  // Otimizar useEffect com dependências específicas
  useEffect(() => {
    if (!block || !block.type) {
      setProperties([]);
      return;
    }

    const newProperties = generateDefaultProperties(block.type, block);
    setProperties(newProperties);
  }, [block?.id, block?.type, generateDefaultProperties]);

  const updateProperty = useCallback(
    (key: string, value: any) => {
      if (!block) return;

      const updatedProperties = { ...block.properties, [key]: value };

      setProperties(prevProps =>
        prevProps.map(prop => (prop.key === key ? { ...prop, value } : prop))
      );

      if (onUpdateExternal) {
        onUpdateExternal(block.id, {
          properties: updatedProperties,
        });
      }
    },
    [block?.id, onUpdateExternal]
  );

  const resetProperties = useCallback(() => {
    if (!block) return;

    const defaultProperties = generateDefaultProperties(block.type, block);
    setProperties(defaultProperties);

    if (onUpdateExternal) {
      onUpdateExternal(block.id, { properties: {} });
    }
  }, [block?.id, block?.type, generateDefaultProperties, onUpdateExternal]);

  const validateProperties = useCallback(() => {
    return properties.every(prop => {
      if (prop.required && (!prop.value || prop.value === "")) {
        return false;
      }
      return true;
    });
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
    },
    "decorative-bar-inline": {
      height: 4,
      color: "#B89B7A",
      marginTop: 20,
      marginBottom: 30,
    },
    "form-input": {
      label: "Digite aqui",
      placeholder: "Digite seu primeiro nome...",
      required: true,
      type: "text",
      backgroundColor: "#FFFFFF",
      borderColor: "#B89B7A",
    },
    "image-display-inline": {
      src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
      alt: "Imagem",
      width: "100%",
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

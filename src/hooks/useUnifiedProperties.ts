import { useCallback, useEffect, useState } from "react";
import { BRAND_COLORS } from "../config/brandColors";
import { useEditor } from "../context/EditorContext";
import type { FunnelStage } from "../types/editor";

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
): Array<{ value: string; label: string }> =>
  options.filter(option => option.value != null && option.value.trim() !== "");

// Função utilitária para forçar o tipo PropertyCategoryOrString em strings literais
const asCategory = (categoryString: string): PropertyCategoryOrString => {
  return categoryString as PropertyCategoryOrString;
};

export const useUnifiedProperties = (
  block: UnifiedBlock | null,
  onUpdateExternal?: (blockId: string, updates: Record<string, any>) => void
): UseUnifiedPropertiesReturn => {
  const [properties, setProperties] = useState<UnifiedProperty[]>([]);
  const { stages } = useEditor(); // 🎯 ACESSO ÀS ETAPAS DO EDITOR

  // Função memoizada para gerar as definições de propriedades com base no tipo do bloco
  const generateDefaultProperties = useCallback(
    (blockType: string, currentBlock: UnifiedBlock | null): UnifiedProperty[] => {
      // 🎯 Função helper para gerar opções de etapas disponíveis
      const getStageSelectOptions = () => {
        const stageOptions = stages.map((stage: FunnelStage) => ({
          value: stage.id,
          label: `${stage.name} (${stage.id})`,
        }));

        return createSelectOptions([
          { value: "none", label: "Selecionar Etapa..." },
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
        // 🎯 1. ESCALA DO BLOCO (renomeado)
        {
          key: "scale",
          value: currentBlock?.properties?.scale ?? 100,
          type: PropertyType.RANGE,
          label: "Escala Bloco",
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
          value: currentBlock?.properties?.spacing || "small", // 🎯 Padrão alterado para "small" (0.75rem)
          type: PropertyType.SELECT,
          label: "Espaçamento Interno",
          category: PropertyCategory.LAYOUT,
          options: [
            { value: "none", label: "Nenhum" },
            { value: "small", label: "Pequeno (12px)" },
            { value: "compact", label: "Compacto (8px)" },
            { value: "normal", label: "Normal (16px)" },
            { value: "comfortable", label: "Confortável (24px)" },
            { value: "spacious", label: "Espaçoso (32px)" },
          ],
        },
        // 🎯 3. COR DE FUNDO DO CONTAINER (ColorPicker)
        {
          key: "containerBackgroundColor",
          value: currentBlock?.properties?.containerBackgroundColor || "transparent",
          type: PropertyType.COLOR,
          label: "Cor de Fundo do Container",
          category: PropertyCategory.STYLE,
        },
        // 🎯 4. COR DE FUNDO DO COMPONENTE (ColorPicker)
        {
          key: "backgroundColor",
          value: currentBlock?.properties?.backgroundColor || "transparent",
          type: PropertyType.COLOR,
          label: "Cor de Fundo do Componente",
          category: PropertyCategory.STYLE,
        },
        // 🎯 1. CONTROLES DE MARGENS (4 controles obrigatórios)
        {
          key: "marginTop",
          value: currentBlock?.properties?.marginTop || 0, // 🎯 Padrão alterado para 0
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
          value: currentBlock?.properties?.marginBottom || 0, // 🎯 Padrão alterado para 0
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
          min: -40, // 🎯 Permitir valores negativos como as outras margens
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
          min: -40, // 🎯 Permitir valores negativos como as outras margens
          max: 100,
          step: 4,
          unit: "px",
        },
        // 🎯 7. CONFIGURAÇÕES BÁSICAS DE TEXTO (para todos os componentes com texto)
        {
          key: "text",
          value: currentBlock?.properties?.text || currentBlock?.properties?.content || "Texto",
          type: PropertyType.TEXTAREA,
          label: "Texto",
          category: PropertyCategory.CONTENT,
          required: true,
          rows: 3,
        },
        {
          key: "fontSize",
          value: currentBlock?.properties?.fontSize || "text-base",
          type: PropertyType.SELECT,
          label: "Tamanho da Fonte",
          category: PropertyCategory.STYLE,
          options: [
            { value: "text-xs", label: "Extra Pequeno (12px)" },
            { value: "text-sm", label: "Pequeno (14px)" },
            { value: "text-base", label: "Normal (16px)" },
            { value: "text-lg", label: "Grande (18px)" },
            { value: "text-xl", label: "Extra Grande (20px)" },
            { value: "text-2xl", label: "Muito Grande (24px)" },
            { value: "text-3xl", label: "Gigante (30px)" },
          ],
        },
        {
          key: "fontWeight",
          value: currentBlock?.properties?.fontWeight || "font-normal",
          type: PropertyType.SELECT,
          label: "Peso da Fonte",
          category: PropertyCategory.STYLE,
          options: [
            { value: "font-light", label: "Leve" },
            { value: "font-normal", label: "Normal" },
            { value: "font-medium", label: "Médio" },
            { value: "font-semibold", label: "Semi-negrito" },
            { value: "font-bold", label: "Negrito" },
            { value: "font-extrabold", label: "Extra Negrito" },
          ],
        },
        {
          key: "textColor",
          value: currentBlock?.properties?.textColor || currentBlock?.properties?.color || "#333333",
          type: PropertyType.COLOR,
          label: "Cor do Texto",
          category: PropertyCategory.STYLE,
        },
        // 🎯 5. ALINHAMENTO CENTRALIZADO POR PADRÃO
        {
          key: "textAlign",
          value: currentBlock?.properties?.textAlign || "text-center",
          type: PropertyType.SELECT,
          label: "Alinhamento do Texto",
          category: PropertyCategory.LAYOUT,
          options: [
            { value: "text-left", label: "Esquerda" },
            { value: "text-center", label: "Centro" },
            { value: "text-right", label: "Direita" },
            { value: "text-justify", label: "Justificado" },
          ],
        },
        // 🎯 6. LARGURA DO TEXTO 100% POR PADRÃO
        {
          key: "textWidth",
          value: currentBlock?.properties?.textWidth || "w-full",
          type: PropertyType.SELECT,
          label: "Largura do Texto",
          category: PropertyCategory.LAYOUT,
          options: [
            { value: "w-full", label: "100%" },
            { value: "w-3/4", label: "75%" },
            { value: "w-1/2", label: "50%" },
            { value: "w-1/4", label: "25%" },
          ],
        },
      ];

      // ---- Mescla de todos os campos para cada tipo de bloco ----
      switch (blockType) {
        case "text-inline":
          return [
            ...baseProperties,
            // Propriedades específicas do texto (além das básicas já incluídas)
            {
              key: "lineHeight",
              value: currentBlock?.properties?.lineHeight || "1.2",
              type: PropertyType.SELECT,
              label: "Altura da Linha",
              category: PropertyCategory.STYLE,
              options: [
                { value: "1", label: "1" },
                { value: "1.2", label: "1.2" },
                { value: "1.5", label: "1.5" },
                { value: "1.75", label: "1.75" },
                { value: "2", label: "2" },
              ],
            },
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
            // Propriedades específicas da imagem
            {
              key: "src",
              value: currentBlock?.properties?.src ||
                "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
              type: PropertyType.TEXT,
              label: "URL da Imagem",
              category: PropertyCategory.CONTENT,
              required: true,
            },
            {
              key: "alt",
              value: currentBlock?.properties?.alt || "Imagem",
              type: PropertyType.TEXT,
              label: "Texto Alternativo",
              category: PropertyCategory.CONTENT,
            },
            {
              key: "width",
              value: currentBlock?.properties?.width || "100%",
              type: PropertyType.SELECT,
              label: "Largura",
              category: PropertyCategory.STYLE,
              options: [
                { value: "25%", label: "25%" },
                { value: "50%", label: "50%" },
                { value: "75%", label: "75%" },
                { value: "100%", label: "100%" },
                { value: "auto", label: "Automática" },
              ],
            },
            {
              key: "height",
              value: currentBlock?.properties?.height || "auto",
              type: PropertyType.SELECT,
              label: "Altura",
              category: PropertyCategory.STYLE,
              options: [
                { value: "auto", label: "Automática" },
                { value: "200px", label: "200px" },
                { value: "300px", label: "300px" },
                { value: "400px", label: "400px" },
                { value: "500px", label: "500px" },
              ],
            },
            {
              key: "borderRadius",
              value: currentBlock?.properties?.borderRadius ?? 12,
              type: PropertyType.RANGE,
              label: "Arredondamento",
              category: PropertyCategory.STYLE,
              min: 0,
              max: 50,
              step: 2,
              unit: "px",
            },
            {
              key: "shadow",
              value: currentBlock?.properties?.shadow !== false,
              type: PropertyType.SWITCH,
              label: "Sombra",
              category: PropertyCategory.STYLE,
            },
          ];

        case "button-inline":
          return [
            ...baseProperties,
            // Propriedades específicas do botão
            {
              key: "variant",
              value: currentBlock?.properties?.variant || "primary",
              type: PropertyType.SELECT,
              label: "Variante",
              category: PropertyCategory.STYLE,
              options: [
                { value: "primary", label: "Primário" },
                { value: "secondary", label: "Secundário" },
                { value: "success", label: "Sucesso" },
                { value: "warning", label: "Aviso" },
                { value: "danger", label: "Perigo" },
                { value: "outline", label: "Contorno" },
              ],
            },
            {
              key: "size",
              value: currentBlock?.properties?.size || "medium",
              type: PropertyType.SELECT,
              label: "Tamanho",
              category: PropertyCategory.STYLE,
              options: [
                { value: "small", label: "Pequeno" },
                { value: "medium", label: "Médio" },
                { value: "large", label: "Grande" },
              ],
            },
            {
              key: "borderColor",
              value: currentBlock?.properties?.borderColor || "#B89B7A",
              type: PropertyType.COLOR,
              label: "Cor da Borda",
              category: PropertyCategory.STYLE,
            },
            {
              key: "action",
              value: currentBlock?.properties?.action || "none",
              type: PropertyType.SELECT,
              label: "Ação do Botão",
              category: PropertyCategory.BEHAVIOR,
              options: [
                { value: "none", label: "Nenhuma" },
                { value: "next-step", label: "Próxima Etapa" },
                { value: "url", label: "Abrir URL" },
              ],
            },
            {
              key: "url",
              value: currentBlock?.properties?.url || "",
              type: PropertyType.TEXT,
              label: "URL de Destino",
              category: PropertyCategory.BEHAVIOR,
            },
            {
              key: "disabled",
              value: currentBlock?.properties?.disabled === true,
              type: PropertyType.SWITCH,
              label: "Desabilitado",
              category: PropertyCategory.BEHAVIOR,
            },
          ];

        case "form-input":
          return [
            ...baseProperties,
            // Propriedades específicas do formulário
            {
              key: "label",
              value: currentBlock?.properties?.label || "Campo de Input",
              type: PropertyType.TEXT,
              label: "Rótulo do Campo",
              category: PropertyCategory.CONTENT,
              required: true,
            },
            {
              key: "placeholder",
              value: currentBlock?.properties?.placeholder || "Digite aqui...",
              type: PropertyType.TEXT,
              label: "Texto de Placeholder",
              category: PropertyCategory.CONTENT,
            },
            {
              key: "inputType",
              value: currentBlock?.properties?.inputType || "text",
              type: PropertyType.SELECT,
              label: "Tipo de Input",
              category: PropertyCategory.BEHAVIOR,
              options: [
                { value: "text", label: "Texto" },
                { value: "email", label: "E-mail" },
                { value: "tel", label: "Telefone" },
                { value: "number", label: "Número" },
                { value: "password", label: "Senha" },
              ],
            },
            {
              key: "required",
              value: currentBlock?.properties?.required === true,
              type: PropertyType.SWITCH,
              label: "Campo Obrigatório",
              category: PropertyCategory.BEHAVIOR,
            },
            {
              key: "borderColor",
              value: currentBlock?.properties?.borderColor || "#B89B7A",
              type: PropertyType.COLOR,
              label: "Cor da Borda",
              category: PropertyCategory.STYLE,
            },
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
            createProperty(
              "showIcon",
              currentBlock?.properties?.showIcon !== false,
              PropertyType.SWITCH,
              "Mostrar Ícone",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "iconType",
              currentBlock?.properties?.iconType || "shield",
              PropertyType.SELECT,
              "Tipo do Ícone",
              PropertyCategory.CONTENT,
              {
                options: createSelectOptions([
                  { value: "shield", label: "Escudo (Privacidade)" },
                  { value: "lock", label: "Cadeado (Segurança)" },
                  { value: "info", label: "Informação" },
                  { value: "warning", label: "Aviso" },
                  { value: "none", label: "Nenhum" },
                ]),
              }
            ),
            createProperty(
              "textSize",
              currentBlock?.properties?.textSize || "text-sm",
              PropertyType.SELECT,
              "Tamanho do Texto",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "text-xs", label: "Extra Pequeno (12px)" },
                  { value: "text-sm", label: "Pequeno (14px)" },
                  { value: "text-base", label: "Normal (16px)" },
                ]),
              }
            ),
          ];

        case "options-grid":
          return [
            ...baseProperties,
            // 🔧 COMPORTAMENTO
            createProperty(
              "multipleSelection",
              currentBlock?.properties?.multipleSelection ?? false,
              PropertyType.SWITCH,
              "Seleção Múltipla",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "requiredSelections",
              currentBlock?.properties?.requiredSelections ?? 1,
              PropertyType.SELECT,
              "Seleções Obrigatórias",
              PropertyCategory.BEHAVIOR,
              {
                options: createSelectOptions([
                  { value: "1", label: "1 seleção" },
                  { value: "2", label: "2 seleções" },
                  { value: "3", label: "3 seleções" },
                  { value: "4", label: "4 seleções" },
                ]),
              }
            ),
            // 🎨 LAYOUT
            createProperty(
              "columns",
              currentBlock?.properties?.columns ?? 2,
              PropertyType.SELECT,
              "Colunas no Desktop",
              PropertyCategory.LAYOUT,
              {
                options: createSelectOptions([
                  { value: "1", label: "1 coluna" },
                  { value: "2", label: "2 colunas" },
                  { value: "3", label: "3 colunas" },
                  { value: "4", label: "4 colunas" },
                ]),
              }
            ),
            createProperty(
              "responsiveColumns",
              currentBlock?.properties?.responsiveColumns ?? true,
              PropertyType.SWITCH,
              "Layout Responsivo",
              PropertyCategory.LAYOUT
            ),
            createProperty(
              "gridGap",
              currentBlock?.properties?.gridGap ?? 8,
              PropertyType.SELECT,
              "Espaçamento entre Cards",
              PropertyCategory.LAYOUT,
              {
                options: createSelectOptions([
                  { value: "2", label: "Pequeno (2px)" },
                  { value: "4", label: "Médio (4px)" },
                  { value: "8", label: "Grande (8px)" },
                  { value: "16", label: "Muito Grande (16px)" },
                ]),
              }
            ),
            // 🖼️ IMAGENS
            createProperty(
              "showImages",
              currentBlock?.properties?.showImages ?? true,
              PropertyType.SWITCH,
              "Mostrar Imagens",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "imageSize",
              currentBlock?.properties?.imageSize || "256px",
              PropertyType.SELECT,
              "Tamanho das Imagens",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "128px", label: "Pequeno (128px)" },
                  { value: "192px", label: "Médio (192px)" },
                  { value: "256px", label: "Grande (256px)" },
                  { value: "320px", label: "Muito Grande (320px)" },
                ]),
              }
            ),
            createProperty(
              "imagePosition",
              currentBlock?.properties?.imagePosition || "top",
              PropertyType.SELECT,
              "Posição da Imagem",
              PropertyCategory.LAYOUT,
              {
                options: createSelectOptions([
                  { value: "top", label: "Acima do Texto" },
                  { value: "left", label: "À Esquerda" },
                  { value: "right", label: "À Direita" },
                  { value: "background", label: "Como Fundo" },
                ]),
              }
            ),
            // 🎨 CORES E ESTILO
            createProperty(
              "selectionStyle",
              currentBlock?.properties?.selectionStyle || "border",
              PropertyType.SELECT,
              "Estilo de Seleção",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "border", label: "Borda Colorida" },
                  { value: "background", label: "Fundo Colorido" },
                  { value: "shadow", label: "Sombra" },
                  { value: "scale", label: "Aumentar Tamanho" },
                ]),
              }
            ),
            createProperty(
              "selectedColor",
              currentBlock?.properties?.selectedColor || "#B89B7A",
              PropertyType.COLOR,
              "Cor Quando Selecionado",
              PropertyCategory.STYLE
            ),
            createProperty(
              "hoverColor",
              currentBlock?.properties?.hoverColor || "#D4C2A8",
              PropertyType.COLOR,
              "Cor ao Passar o Mouse",
              PropertyCategory.STYLE
            ),
          ];

        case "quiz-option":
          return [
            ...baseProperties,
            createProperty(
              "text",
              currentBlock?.properties?.text || "Opção do Quiz",
              PropertyType.TEXT,
              "Texto da Opção",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "value",
              currentBlock?.properties?.value || "",
              PropertyType.TEXT,
              "Valor da Opção",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "description",
              currentBlock?.properties?.description || "",
              PropertyType.TEXTAREA,
              "Descrição",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "color",
              currentBlock?.properties?.color || BRAND_COLORS.textPrimary,
              PropertyType.COLOR,
              "Cor do Texto",
              PropertyCategory.STYLE
            ),
            createProperty(
              "backgroundColor",
              currentBlock?.properties?.backgroundColor || "#ffffff",
              PropertyType.COLOR,
              "Cor de Fundo",
              PropertyCategory.STYLE
            ),
            createProperty(
              "borderColor",
              currentBlock?.properties?.borderColor || BRAND_COLORS.primary,
              PropertyType.COLOR,
              "Cor da Borda",
              PropertyCategory.STYLE
            ),
            createProperty(
              "fontSize",
              currentBlock?.properties?.fontSize || "text-base",
              PropertyType.SELECT,
              "Tamanho da Fonte",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "text-sm", label: "Pequeno (14px)" },
                  { value: "text-base", label: "Normal (16px)" },
                  { value: "text-lg", label: "Grande (18px)" },
                  { value: "text-xl", label: "Extra Grande (20px)" },
                  { value: "text-2xl", label: "XXL (24px)" },
                ]),
              }
            ),
            createProperty(
              "fontWeight",
              currentBlock?.properties?.fontWeight || "font-medium",
              PropertyType.SELECT,
              "Peso da Fonte",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "font-light", label: "Leve" },
                  { value: "font-normal", label: "Normal" },
                  { value: "font-medium", label: "Médio" },
                  { value: "font-semibold", label: "Semi-negrito" },
                  { value: "font-bold", label: "Negrito" },
                ]),
              }
            ),
            createProperty(
              "textAlign",
              currentBlock?.properties?.textAlign || "text-left",
              PropertyType.SELECT,
              "Alinhamento do Texto",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "text-left", label: "Esquerda" },
                  { value: "text-center", label: "Centro" },
                  { value: "text-right", label: "Direita" },
                ]),
              }
            ),
            createProperty(
              "borderRadius",
              currentBlock?.properties?.borderRadius || "rounded-lg",
              PropertyType.SELECT,
              "Arredondamento",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "rounded-none", label: "Sem" },
                  { value: "rounded-sm", label: "Pequeno" },
                  { value: "rounded", label: "Normal" },
                  { value: "rounded-lg", label: "Grande" },
                  { value: "rounded-xl", label: "Extra Grande" },
                  { value: "rounded-full", label: "Circular" },
                ]),
              }
            ),
            createProperty(
              "borderWidth",
              currentBlock?.properties?.borderWidth || "border",
              PropertyType.SELECT,
              "Espessura da Borda",
              PropertyCategory.STYLE,
              {
                options: createSelectOptions([
                  { value: "border-0", label: "Sem borda" },
                  { value: "border", label: "Padrão (1px)" },
                  { value: "border-2", label: "Média (2px)" },
                  { value: "border-4", label: "Grossa (4px)" },
                ]),
              }
            ),
            createProperty(
              "padding",
              currentBlock?.properties?.padding || "p-4",
              PropertyType.SELECT,
              "Espaçamento Interno",
              PropertyCategory.LAYOUT,
              {
                options: createSelectOptions([
                  { value: "p-2", label: "Pequeno" },
                  { value: "p-4", label: "Normal" },
                  { value: "p-6", label: "Grande" },
                  { value: "p-8", label: "Extra Grande" },
                ]),
              }
            ),
            createProperty(
              "margin",
              currentBlock?.properties?.margin || "m-2",
              PropertyType.SELECT,
              "Espaçamento Externo",
              PropertyCategory.LAYOUT,
              {
                options: createSelectOptions([
                  { value: "m-1", label: "Mínimo" },
                  { value: "m-2", label: "Pequeno" },
                  { value: "m-4", label: "Normal" },
                  { value: "m-6", label: "Grande" },
                ]),
              }
            ),
            createProperty(
              "isSelectable",
              currentBlock?.properties?.isSelectable !== false,
              PropertyType.SWITCH,
              "Opção Selecionável",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "isCorrect",
              currentBlock?.properties?.isCorrect || false,
              PropertyType.SWITCH,
              "Resposta Correta",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "points",
              currentBlock?.properties?.points ?? 10,
              PropertyType.RANGE,
              "Pontos",
              PropertyCategory.BEHAVIOR,
              { min: 0, max: 100, step: 5, unit: "pts" }
            ),
            createProperty(
              "hoverEffect",
              currentBlock?.properties?.hoverEffect !== false,
              PropertyType.SWITCH,
              "Efeito Hover",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "animationDuration",
              currentBlock?.properties?.animationDuration || "duration-200",
              PropertyType.SELECT,
              "Duração da Animação",
              PropertyCategory.BEHAVIOR,
              {
                options: createSelectOptions([
                  { value: "duration-75", label: "Muito Rápida" },
                  { value: "duration-150", label: "Rápida" },
                  { value: "duration-200", label: "Normal" },
                  { value: "duration-300", label: "Lenta" },
                  { value: "duration-500", label: "Muito Lenta" },
                ]),
              }
            ),
          ];

        case "quiz-header":
          return [
            ...baseProperties,
            createProperty(
              "logoUrl",
              currentBlock?.properties?.logoUrl || "",
              PropertyType.TEXT,
              "URL do Logo",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "logoAlt",
              currentBlock?.properties?.logoAlt || "Logo",
              PropertyType.TEXT,
              "Texto Alternativo do Logo",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "logoWidth",
              currentBlock?.properties?.logoWidth ?? 80,
              PropertyType.RANGE,
              "Largura do Logo",
              PropertyCategory.LAYOUT,
              { min: 40, max: 200, step: 10, unit: "px" }
            ),
            createProperty(
              "logoHeight",
              currentBlock?.properties?.logoHeight ?? 80,
              PropertyType.RANGE,
              "Altura do Logo",
              PropertyCategory.LAYOUT,
              { min: 40, max: 200, step: 10, unit: "px" }
            ),
            createProperty(
              "progressValue",
              currentBlock?.properties?.progressValue ?? 50,
              PropertyType.RANGE,
              "Valor do Progresso",
              PropertyCategory.BEHAVIOR,
              { min: 0, max: 100, step: 5, unit: "%" }
            ),
            createProperty(
              "progressMax",
              currentBlock?.properties?.progressMax ?? 100,
              PropertyType.RANGE,
              "Máximo do Progresso",
              PropertyCategory.BEHAVIOR,
              { min: 50, max: 200, step: 10, unit: "pts" }
            ),
            createProperty(
              "stepNumber",
              currentBlock?.properties?.stepNumber || "1 de 21",
              PropertyType.TEXT,
              "Número da Etapa",
              PropertyCategory.CONTENT
            ),
            createProperty(
              "showBackButton",
              currentBlock?.properties?.showBackButton !== false,
              PropertyType.SWITCH,
              "Mostrar Botão Voltar",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "showProgress",
              currentBlock?.properties?.showProgress !== false,
              PropertyType.SWITCH,
              "Mostrar Barra de Progresso",
              PropertyCategory.BEHAVIOR
            ),
            createProperty(
              "backgroundColor",
              currentBlock?.properties?.backgroundColor || "#ffffff",
              PropertyType.COLOR,
              "Cor de Fundo",
              PropertyCategory.STYLE
            ),
            createProperty(
              "borderColor",
              currentBlock?.properties?.borderColor || BRAND_COLORS.primary,
              PropertyType.COLOR,
              "Cor da Borda",
              PropertyCategory.STYLE
            ),
          ];

        case "decorative-bar-inline":
          return [
            ...baseProperties,
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
              "marginTop",
              currentBlock?.properties?.marginTop ?? 8,
              PropertyType.RANGE,
              "Margem Superior",
              PropertyCategory.LAYOUT,
              { min: 0, max: 50, step: 2, unit: "px" }
            ),
            createProperty(
              "marginBottom",
              currentBlock?.properties?.marginBottom ?? 32,
              PropertyType.RANGE,
              "Margem Inferior",
              PropertyCategory.LAYOUT,
              { min: 0, max: 100, step: 4, unit: "px" }
            ),
            createProperty(
              "showShadow",
              currentBlock?.properties?.showShadow !== false,
              PropertyType.SWITCH,
              "Mostrar Sombra",
              PropertyCategory.STYLE
            ),
          ];

        default:
          // Log para debug dos tipos não mapeados
          console.warn(
            `🔧 useUnifiedProperties: Tipo de bloco "${blockType}" não tem propriedades específicas definidas. Usando propriedades base.`
          );
          return baseProperties;
      }
    },
    [stages] // 🎯 Dependência das etapas para atualizar as opções dinamicamente
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

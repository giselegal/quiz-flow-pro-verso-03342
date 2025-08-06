import { useCallback, useEffect, useState } from "react";
import { BRAND_COLORS } from "../config/brandColors";

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
// Esta função é usada apenas para compatibilidade e será removida quando todas as strings forem atualizadas
const asCategory = (categoryString: string): PropertyCategoryOrString => {
  return categoryString as PropertyCategoryOrString;
};

export const useUnifiedProperties = (
  block: UnifiedBlock | null,
  onUpdateExternal?: (blockId: string, updates: Record<string, any>) => void // Callback para notificar o sistema externo
): UseUnifiedPropertiesReturn => {
  // Estado interno para armazenar as propriedades do bloco
  const [properties, setProperties] = useState<UnifiedProperty[]>([]);

  // Função memoizada para gerar as definições de propriedades com base no tipo do bloco
  const generateDefaultProperties = useCallback(
    (blockType: string, currentBlock: UnifiedBlock | null): UnifiedProperty[] => {
      // Propriedades base que todo bloco pode ter
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
          value: currentBlock?.properties?.visible !== false, // Padrão é visível, a menos que seja explicitamente false
          type: PropertyType.SWITCH,
          label: "Visível",
          category: PropertyCategory.LAYOUT,
        },
        {
          key: "scale",
          value: currentBlock?.properties?.scale || 100, // Valor padrão de 100%
          type: PropertyType.RANGE,
          label: "Tamanho Uniforme",
          category: PropertyCategory.STYLE,
          min: 50,
          max: 200,
          step: 10,
          unit: "%",
        },
      ];

      // Propriedades específicas adicionadas com base no tipo do bloco
      switch (blockType) {
        case "text-inline": {
          // ✅ NO-CODE: Propriedades de conteúdo simples (sem HTML)
          const contentProps = [
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
          ];

          // ✅ NO-CODE: Propriedades de estilo visuais
          const styleProps = [
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
              currentBlock?.properties?.marginTop || 0,
              PropertyType.RANGE,
              "Margem Superior",
              PropertyCategory.STYLE,
              { min: 0, max: 100, step: 4, unit: "px" }
            ),
            createProperty(
              "marginBottom",
              currentBlock?.properties?.marginBottom || 0,
              PropertyType.RANGE,
              "Margem Inferior",
              PropertyCategory.STYLE,
              { min: 0, max: 100, step: 4, unit: "px" }
            ),
          ];

          // Propriedades de alinhamento
          const alignmentProps = [
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
          ];

          return [...baseProperties, ...contentProps, ...styleProps, ...alignmentProps];
        }

        case "final-step": {
          // ✅ CORREÇÃO: Garantir que final-step tenha stepConfig estruturado corretamente
          const stepConfig = currentBlock?.properties?.stepConfig || {};
          return [
            ...baseProperties,
            {
              key: "stepNumber",
              value: stepConfig.stepNumber || currentBlock?.properties?.stepNumber || 21,
              type: PropertyType.NUMBER,
              label: "Número da Etapa",
              category: "content",
              required: true,
              min: 1,
              max: 99,
            },
            {
              key: "title", 
              value: stepConfig.title || currentBlock?.properties?.title || "Seu Resultado",
              type: PropertyType.TEXT,
              label: "Título",
              category: "content",
              required: true,
            },
            {
              key: "subtitle",
              value: stepConfig.subtitle || currentBlock?.properties?.subtitle || "Descubra seu estilo predominante",
              type: PropertyType.TEXT,
              label: "Subtítulo",
              category: "content",
            },
          ];
        }

        case "quiz-intro-header":
          return [
            ...baseProperties,
            {
              key: "title",
              value: currentBlock?.properties?.title || "",
              type: PropertyType.TEXT,
              label: "Título",
              category: "content",
              required: true,
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
          ];

        case "decorative-bar-inline":
          return [
            ...baseProperties,
            {
              key: "height",
              value: currentBlock?.properties?.height || 4,
              type: PropertyType.RANGE,
              label: "Altura",
              category: "style",
              min: 1,
              max: 20,
              step: 1,
              unit: "px",
            },
            {
              key: "color",
              value: currentBlock?.properties?.color || "primary",
              type: PropertyType.SELECT,
              label: "Cor",
              category: "style",
              options: [
                { value: "primary", label: "Primária" },
                { value: "secondary", label: "Secundária" },
                { value: "accent", label: "Destaque" },
                { value: "muted", label: "Sutil" },
              ],
            },
            {
              key: "pattern",
              value: currentBlock?.properties?.pattern || "solid",
              type: PropertyType.SELECT,
              label: "Padrão",
              category: "style",
              options: [
                { value: "solid", label: "Sólido" },
                { value: "dashed", label: "Tracejado" },
                { value: "dotted", label: "Pontilhado" },
                { value: "gradient", label: "Gradiente" },
              ],
            },
            {
              key: "marginY",
              value: currentBlock?.properties?.marginY || 16,
              type: PropertyType.RANGE,
              label: "Margem Vertical",
              category: "style",
              min: 0,
              max: 64,
              step: 4,
              unit: "px",
            },
          ];

        case "quiz-options-grid":
          return [
            ...baseProperties,
            {
              key: "question",
              value: currentBlock?.properties?.question || "",
              type: PropertyType.TEXTAREA,
              label: "Pergunta",
              category: "content",
              required: true,
              rows: 3,
            },
            {
              key: "options",
              value: currentBlock?.properties?.options || "",
              type: PropertyType.TEXTAREA,
              label: "Opções",
              category: "content",
              required: true,
              rows: 4,
            },
            {
              key: "requireOption",
              value: currentBlock?.properties?.requireOption !== false,
              type: PropertyType.SWITCH,
              label: "Seleção Obrigatória",
              category: "behavior",
            },
            {
              key: "autoAdvance",
              value: currentBlock?.properties?.autoAdvance === true,
              type: PropertyType.SWITCH,
              label: "Avançar Automaticamente",
              category: "behavior",
            },
            {
              key: "showCorrectAnswer",
              value: currentBlock?.properties?.showCorrectAnswer !== false,
              type: PropertyType.SWITCH,
              label: "Mostrar Resposta Correta",
              category: "behavior",
            },
            {
              key: "correctOptionIndex",
              value: currentBlock?.properties?.correctOptionIndex || 0,
              type: PropertyType.NUMBER,
              label: "Índice da Opção Correta",
              category: "content",
              min: 0,
              max: 10,
              step: 1,
            },
            {
              key: "useLetterOptions",
              value: currentBlock?.properties?.useLetterOptions === true,
              type: PropertyType.SWITCH,
              label: "Usar Letras nas Opções (A-H)",
              category: "style",
            },
            // Propriedades de pontuação para opções A-H
            ...Array.from({ length: 8 }).flatMap((_, i) => {
              const char = String.fromCharCode(65 + i); // A, B, C...
              return [
                {
                  key: `option${char}Score`,
                  value: currentBlock?.properties?.[`option${char}Score`] || 0,
                  type: PropertyType.NUMBER,
                  label: `Pontuação da Opção ${char}`,
                  category: "scoring",
                  min: 0,
                  max: 100,
                  step: 1,
                },
                {
                  key: `option${char}Category`,
                  value: currentBlock?.properties?.[`option${char}Category`] || "",
                  type: PropertyType.TEXT,
                  label: `Categoria da Opção ${char}`,
                  category: "scoring",
                },
              ];
            }),
            {
              key: "optionsLayout",
              value: currentBlock?.properties?.optionsLayout || "vertical",
              type: PropertyType.SELECT,
              label: "Layout das Opções",
              category: "style",
              options: [
                { value: "vertical", label: "Vertical" },
                { value: "horizontal", label: "Horizontal" },
                { value: "grid", label: "Grade 2x2" },
              ],
            },
            {
              key: "optionsPerRow",
              value: currentBlock?.properties?.optionsPerRow || 1,
              type: PropertyType.RANGE,
              label: "Opções por Linha",
              category: "style",
              min: 1,
              max: 4,
              step: 1,
            },
            {
              key: "showOptionImages",
              value: currentBlock?.properties?.showOptionImages === true,
              type: PropertyType.SWITCH,
              label: "Mostrar Imagens nas Opções",
              category: "style",
            },
            {
              key: "optionImageSize",
              value: currentBlock?.properties?.optionImageSize || "medium",
              type: PropertyType.SELECT,
              label: "Tamanho das Imagens",
              category: "style",
              options: [
                { value: "small", label: "Pequeno" },
                { value: "medium", label: "Médio" },
                { value: "large", label: "Grande" },
              ],
            },
          ];

        case "button-inline":
          return [
            ...baseProperties,
            {
              key: "text",
              value: currentBlock?.properties?.text || "",
              type: PropertyType.TEXT,
              label: "Texto do Botão",
              category: "content",
              required: true,
            },
            {
              key: "variant",
              value: currentBlock?.properties?.variant || "default",
              type: PropertyType.SELECT,
              label: "Variante",
              category: "style",
              options: [
                { value: "default", label: "Padrão" },
                { value: "destructive", label: "Destrutivo" },
                { value: "outline", label: "Contorno" },
                { value: "secondary", label: "Secundário" },
                { value: "ghost", label: "Fantasma" },
                { value: "link", label: "Link" },
              ],
            },
            {
              key: "size",
              value: currentBlock?.properties?.size || "default",
              type: PropertyType.SELECT,
              label: "Tamanho",
              category: "style",
              options: [
                { value: "sm", label: "Pequeno" },
                { value: "default", label: "Padrão" },
                { value: "lg", label: "Grande" },
                { value: "icon", label: "Ícone" },
              ],
            },
            {
              key: "onClick",
              value: currentBlock?.properties?.onClick || "",
              type: PropertyType.TEXT,
              label: "Ação ao Clicar",
              category: "behavior",
            },
            {
              key: "disabled",
              value: currentBlock?.properties?.disabled === true,
              type: PropertyType.SWITCH,
              label: "Desabilitado",
              category: "behavior",
            },
            {
              key: "fullWidth",
              value: currentBlock?.properties?.fullWidth === true,
              type: PropertyType.SWITCH,
              label: "Largura Completa",
              category: "style",
            },
          ];

        case "image-display-inline":
          return [
            ...baseProperties,
            {
              key: "src",
              value: currentBlock?.properties?.src || "",
              type: PropertyType.TEXT,
              label: "URL da Imagem",
              category: "content",
              required: true,
            },
            {
              key: "alt",
              value: currentBlock?.properties?.alt || "",
              type: PropertyType.TEXT,
              label: "Texto Alternativo",
              category: "content",
              required: true,
            },
            {
              key: "width",
              value: currentBlock?.properties?.width || 600,
              type: PropertyType.NUMBER,
              label: "Largura",
              category: "style",
            },
            {
              key: "height",
              value: currentBlock?.properties?.height || 400,
              type: PropertyType.NUMBER,
              label: "Altura",
              category: "style",
            },
            {
              key: "className",
              value: currentBlock?.properties?.className || "",
              type: PropertyType.TEXT,
              label: "Classes CSS",
              category: "style",
            },
            {
              key: "textAlign",
              value: currentBlock?.properties?.textAlign || "text-center",
              type: PropertyType.SELECT,
              label: "Alinhamento",
              category: "alignment",
              options: [
                { value: "text-left", label: "Esquerda" },
                { value: "text-center", label: "Centro" },
                { value: "text-right", label: "Direita" },
              ],
            },
            {
              key: "marginBottom",
              value: currentBlock?.properties?.marginBottom || 32,
              type: PropertyType.NUMBER,
              label: "Margem Inferior",
              category: "style",
            },
          ];

        case "quiz-intro-image":
          return [
            ...baseProperties,
            {
              key: "src",
              value: currentBlock?.properties?.src || "",
              type: PropertyType.TEXT,
              label: "URL da Imagem",
              category: "content",
              required: true,
            },
            {
              key: "alt",
              value: currentBlock?.properties?.alt || "",
              type: PropertyType.TEXT,
              label: "Texto Alternativo",
              category: "content",
              required: true,
            },
            {
              key: "caption",
              value: currentBlock?.properties?.caption || "",
              type: PropertyType.TEXT,
              label: "Legenda",
              category: "content",
            },
            {
              key: "aspectRatio",
              value: currentBlock?.properties?.aspectRatio || "auto",
              type: PropertyType.SELECT,
              label: "Proporção",
              category: "style",
              options: [
                { value: "auto", label: "Automática" },
                { value: "square", label: "Quadrada (1:1)" },
                { value: "video", label: "Vídeo (16:9)" },
                { value: "photo", label: "Foto (4:3)" },
                { value: "portrait", label: "Retrato (3:4)" },
              ],
            },
            {
              key: "objectFit",
              value: currentBlock?.properties?.objectFit || "contain",
              type: PropertyType.SELECT,
              label: "Ajuste da Imagem",
              category: "style",
              options: [
                { value: "contain", label: "Conter (não corta)" },
                { value: "cover", label: "Cobrir (pode cortar)" },
                { value: "fill", label: "Preencher" },
                { value: "scale-down", label: "Reduzir" },
              ],
            },
            {
              key: "borderRadius",
              value: currentBlock?.properties?.borderRadius || "md",
              type: PropertyType.SELECT,
              label: "Bordas Arredondadas",
              category: "style",
              options: [
                { value: "none", label: "Nenhuma" },
                { value: "sm", label: "Pequena" },
                { value: "md", label: "Média" },
                { value: "lg", label: "Grande" },
                { value: "full", label: "Circular" },
              ],
            },
          ];

        case "quiz-multiple-choice":
          return [
            ...baseProperties,
            {
              key: "question",
              value: currentBlock?.properties?.question || "",
              type: PropertyType.TEXTAREA,
              label: "Pergunta",
              category: "content",
              required: true,
              rows: 3,
            },
            {
              key: "explanation",
              value: currentBlock?.properties?.explanation || "",
              type: PropertyType.TEXTAREA,
              label: "Explicação da Resposta",
              category: "content",
              rows: 3,
            },
            {
              key: "options",
              value: currentBlock?.properties?.options || "",
              type: PropertyType.TEXTAREA,
              label: "Opções (uma por linha)",
              category: "content",
              required: true,
              rows: 4,
            },
            {
              key: "optionType",
              value: currentBlock?.properties?.optionType || "radio",
              type: PropertyType.SELECT,
              label: "Tipo de Opção",
              category: "behavior",
              options: [
                { value: "radio", label: "Única Escolha (Radio)" },
                { value: "checkbox", label: "Múltipla Escolha (Checkbox)" },
              ],
            },
            {
              key: "requireSelection",
              value: currentBlock?.properties?.requireSelection !== false,
              type: PropertyType.SWITCH,
              label: "Seleção Obrigatória",
              category: "behavior",
            },
            {
              key: "autoAdvance",
              value: currentBlock?.properties?.autoAdvance === true,
              type: PropertyType.SWITCH,
              label: "Avançar Automaticamente",
              category: "behavior",
            },
            {
              key: "showFeedback",
              value: currentBlock?.properties?.showFeedback !== false,
              type: PropertyType.SWITCH,
              label: "Mostrar Feedback Imediato",
              category: "behavior",
            },
            {
              key: "feedbackDelay",
              value: currentBlock?.properties?.feedbackDelay || 500,
              type: PropertyType.NUMBER,
              label: "Atraso do Feedback (ms)",
              category: "behavior",
              min: 0,
              max: 5000,
              step: 100,
            },
            {
              key: "correctAnswers",
              value: currentBlock?.properties?.correctAnswers || "0",
              type: PropertyType.TEXT,
              label: "Respostas Corretas (índices)",
              category: "content",
              required: true,
            },
            {
              key: "randomizeOptions",
              value: currentBlock?.properties?.randomizeOptions === true,
              type: PropertyType.SWITCH,
              label: "Embaralhar Opções",
              category: "behavior",
            },
            {
              key: "useLetterOptions",
              value: currentBlock?.properties?.useLetterOptions === true,
              type: PropertyType.SWITCH,
              label: "Usar Letras nas Opções (A-H)",
              category: "style",
            },
            // Propriedades de pontuação para opções A-H
            ...Array.from({ length: 8 }).flatMap((_, i) => {
              const char = String.fromCharCode(65 + i);
              return [
                {
                  key: `option${char}Score`,
                  value: currentBlock?.properties?.[`option${char}Score`] || 0,
                  type: PropertyType.NUMBER,
                  label: `Pontuação da Opção ${char}`,
                  category: "scoring",
                  min: 0,
                  max: 100,
                  step: 1,
                },
                {
                  key: `option${char}Category`,
                  value: currentBlock?.properties?.[`option${char}Category`] || "",
                  type: PropertyType.TEXT,
                  label: `Categoria da Opção ${char}`,
                  category: "scoring",
                },
              ];
            }),
            {
              key: "optionStyle",
              value: currentBlock?.properties?.optionStyle || "default",
              type: PropertyType.SELECT,
              label: "Estilo das Opções",
              category: "style",
              options: [
                { value: "default", label: "Padrão" },
                { value: "buttons", label: "Botões" },
                { value: "cards", label: "Cartões" },
                { value: "minimal", label: "Minimalista" },
              ],
            },
            {
              key: "showOptionImages",
              value: currentBlock?.properties?.showOptionImages === true,
              type: PropertyType.SWITCH,
              label: "Mostrar Imagens nas Opções",
              category: "style",
            },
          ];

        case "form-input":
          return [
            ...baseProperties,
            {
              key: "label",
              value: currentBlock?.properties?.label || "",
              type: PropertyType.TEXT,
              label: "Rótulo do Campo",
              category: "content",
            },
            {
              key: "placeholder",
              value: currentBlock?.properties?.placeholder || "",
              type: PropertyType.TEXT,
              label: "Texto de Placeholder",
              category: "content",
            },
            {
              key: "required",
              value: currentBlock?.properties?.required === true,
              type: PropertyType.SWITCH,
              label: "Campo Obrigatório",
              category: "behavior",
            },
            {
              key: "inputType",
              value: currentBlock?.properties?.inputType || "text",
              type: PropertyType.SELECT,
              label: "Tipo de Entrada",
              category: "behavior",
              options: [
                { value: "text", label: "Texto" },
                { value: "email", label: "Email" },
                { value: "password", label: "Senha" },
                { value: "number", label: "Número" },
                { value: "tel", label: "Telefone" },
              ],
            },
            {
              key: "helperText",
              value: currentBlock?.properties?.helperText || "",
              type: PropertyType.TEXT,
              label: "Texto de Ajuda",
              category: "content",
            },
            {
              key: "name",
              value: currentBlock?.properties?.name || "",
              type: PropertyType.TEXT,
              label: "Nome do Campo",
              category: "behavior",
              required: true,
            },
            {
              key: "textAlign",
              value: currentBlock?.properties?.textAlign || "text-left",
              type: PropertyType.SELECT,
              label: "Alinhamento",
              category: "style",
              options: [
                { value: "text-left", label: "Esquerda" },
                { value: "text-center", label: "Centro" },
                { value: "text-right", label: "Direita" },
              ],
            },
            {
              key: "marginBottom",
              value: currentBlock?.properties?.marginBottom || 32,
              type: PropertyType.NUMBER,
              label: "Margem Inferior",
              category: "style",
            },
          ];

        case "legal-notice-inline":
          return [
            ...baseProperties,
            {
              key: "privacyText",
              value: currentBlock?.properties?.privacyText || "",
              type: PropertyType.TEXTAREA,
              label: "Texto de Privacidade",
              category: "content",
              rows: 3,
            },
            {
              key: "copyrightText",
              value: currentBlock?.properties?.copyrightText || "",
              type: PropertyType.TEXT,
              label: "Texto de Copyright",
              category: "content",
            },
            {
              key: "showIcon",
              value: currentBlock?.properties?.showIcon !== false,
              type: PropertyType.SWITCH,
              label: "Mostrar Ícone",
              category: "style",
            },
            {
              key: "iconType",
              value: currentBlock?.properties?.iconType || "shield",
              type: PropertyType.SELECT,
              label: "Tipo de Ícone",
              category: "style",
              options: [
                { value: "shield", label: "Escudo" },
                { value: "lock", label: "Cadeado" },
                { value: "info", label: "Informação" },
              ],
            },
            {
              key: "textAlign",
              value: currentBlock?.properties?.textAlign || "text-center",
              type: PropertyType.SELECT,
              label: "Alinhamento do Texto",
              category: "style",
              options: [
                { value: "text-left", label: "Esquerda" },
                { value: "text-center", label: "Centro" },
                { value: "text-right", label: "Direita" },
              ],
            },
            {
              key: "textSize",
              value: currentBlock?.properties?.textSize || "text-xs",
              type: PropertyType.SELECT,
              label: "Tamanho do Texto",
              category: "style",
              options: [
                { value: "text-xs", label: "Extra Pequeno" },
                { value: "text-sm", label: "Pequeno" },
                { value: "text-base", label: "Normal" },
              ],
            },
            {
              key: "textColor",
              value: currentBlock?.properties?.textColor || "text-gray-600",
              type: PropertyType.SELECT,
              label: "Cor do Texto",
              category: "style",
              options: [
                { value: "text-gray-600", label: "Cinza Padrão" },
                { value: "text-primary", label: "Primária" },
                { value: "text-secondary", label: "Secundária" },
                { value: "text-muted", label: "Sutil" },
              ],
            },
          ];

        // ✅ CORREÇÃO: Adicionar casos para tipos de bloco comuns que estavam faltando
        case "text":
          return [
            ...baseProperties,
            {
              key: "content",
              value: currentBlock?.properties?.content || currentBlock?.properties?.text || "",
              type: PropertyType.TEXTAREA,
              label: "Texto",
              category: "content",
              required: true,
            },
            {
              key: "fontSize",
              value: currentBlock?.properties?.fontSize || "text-base",
              type: PropertyType.SELECT,
              label: "Tamanho da Fonte",
              category: "style",
              options: [
                { value: "text-xs", label: "Extra Pequeno" },
                { value: "text-sm", label: "Pequeno" },
                { value: "text-base", label: "Normal" },
                { value: "text-lg", label: "Grande" },
                { value: "text-xl", label: "Extra Grande" },
              ],
            },
            {
              key: "textAlign",
              value: currentBlock?.properties?.textAlign || "left",
              type: PropertyType.ALIGNMENT,
              label: "Alinhamento",
              category: "style",
            },
            {
              key: "textColor",
              value: currentBlock?.properties?.textColor || "#432818",
              type: PropertyType.COLOR,
              label: "Cor do Texto",
              category: "style",
            },
          ];

        case "heading":
          return [
            ...baseProperties,
            {
              key: "content",
              value: currentBlock?.properties?.content || currentBlock?.properties?.text || "",
              type: PropertyType.TEXT,
              label: "Título",
              category: "content",
              required: true,
            },
            {
              key: "level",
              value: currentBlock?.properties?.level || 2,
              type: PropertyType.SELECT,
              label: "Nível do Título",
              category: "style",
              options: [
                { value: "1", label: "H1 - Principal" },
                { value: "2", label: "H2 - Seção" },
                { value: "3", label: "H3 - Subseção" },
                { value: "4", label: "H4 - Subtítulo" },
              ],
            },
            {
              key: "textAlign",
              value: currentBlock?.properties?.textAlign || "left",
              type: PropertyType.ALIGNMENT,
              label: "Alinhamento",
              category: "style",
            },
            {
              key: "textColor",
              value: currentBlock?.properties?.textColor || "#432818",
              type: PropertyType.COLOR,
              label: "Cor do Texto",
              category: "style",
            },
          ];

        case "image":
          return [
            ...baseProperties,
            {
              key: "src",
              value: currentBlock?.properties?.src || "",
              type: PropertyType.IMAGE,
              label: "URL da Imagem",
              category: "content",
              required: true,
            },
            {
              key: "alt",
              value: currentBlock?.properties?.alt || "",
              type: PropertyType.TEXT,
              label: "Texto Alternativo",
              category: "content",
            },
            {
              key: "width",
              value: currentBlock?.properties?.width || "100%",
              type: PropertyType.TEXT,
              label: "Largura",
              category: "style",
            },
            {
              key: "height",
              value: currentBlock?.properties?.height || "auto",
              type: PropertyType.TEXT,
              label: "Altura",
              category: "style",
            },
            {
              key: "borderRadius",
              value: currentBlock?.properties?.borderRadius || 0,
              type: PropertyType.RANGE,
              label: "Bordas Arredondadas",
              category: "style",
              min: 0,
              max: 50,
              step: 1,
              unit: "px",
            },
          ];

        case "button":
          return [
            ...baseProperties,
            {
              key: "text",
              value: currentBlock?.properties?.text || "",
              type: PropertyType.TEXT,
              label: "Texto do Botão",
              category: "content",
              required: true,
            },
            {
              key: "variant",
              value: currentBlock?.properties?.variant || "primary",
              type: PropertyType.SELECT,
              label: "Estilo do Botão",
              category: "style",
              options: [
                { value: "primary", label: "Primário" },
                { value: "secondary", label: "Secundário" },
                { value: "outline", label: "Contorno" },
                { value: "ghost", label: "Transparente" },
              ],
            },
            {
              key: "size",
              value: currentBlock?.properties?.size || "default",
              type: PropertyType.SELECT,
              label: "Tamanho",
              category: "style",
              options: [
                { value: "sm", label: "Pequeno" },
                { value: "default", label: "Normal" },
                { value: "lg", label: "Grande" },
              ],
            },
            {
              key: "href",
              value: currentBlock?.properties?.href || "",
              type: PropertyType.TEXT,
              label: "Link (URL)",
              category: "behavior",
            },
          ];

        case "spacer":
          return [
            ...baseProperties,
            {
              key: "height",
              value: currentBlock?.properties?.height || 40,
              type: PropertyType.RANGE,
              label: "Altura do Espaçamento",
              category: "style",
              min: 10,
              max: 200,
              step: 5,
              unit: "px",
            },
          ];

        case "divider":
          return [
            ...baseProperties,
            {
              key: "style",
              value: currentBlock?.properties?.style || "solid",
              type: PropertyType.SELECT,
              label: "Estilo da Linha",
              category: "style",
              options: [
                { value: "solid", label: "Sólida" },
                { value: "dashed", label: "Tracejada" },
                { value: "dotted", label: "Pontilhada" },
              ],
            },
            {
              key: "color",
              value: currentBlock?.properties?.color || "#E5E7EB",
              type: PropertyType.COLOR,
              label: "Cor da Linha",
              category: "style",
            },
            {
              key: "thickness",
              value: currentBlock?.properties?.thickness || 1,
              type: PropertyType.RANGE,
              label: "Espessura",
              category: "style",
              min: 1,
              max: 10,
              step: 1,
              unit: "px",
            },
          ];

        case "badge":
          return [
            ...baseProperties,
            {
              key: "text",
              value: currentBlock?.properties?.text || "",
              type: PropertyType.TEXT,
              label: "Texto do Badge",
              category: "content",
              required: true,
            },
            {
              key: "variant",
              value: currentBlock?.properties?.variant || "primary",
              type: PropertyType.SELECT,
              label: "Estilo do Badge",
              category: "style",
              options: [
                { value: "primary", label: "Primário" },
                { value: "secondary", label: "Secundário" },
                { value: "success", label: "Sucesso" },
                { value: "warning", label: "Aviso" },
                { value: "error", label: "Erro" },
              ],
            },
          ];

        case "cta":
          return [
            ...baseProperties,
            {
              key: "title",
              value: currentBlock?.properties?.title || "",
              type: PropertyType.TEXT,
              label: "Título",
              category: "content",
              required: true,
            },
            {
              key: "description",
              value: currentBlock?.properties?.description || "",
              type: PropertyType.TEXTAREA,
              label: "Descrição",
              category: "content",
            },
            {
              key: "buttonText",
              value: currentBlock?.properties?.buttonText || "Clique aqui",
              type: PropertyType.TEXT,
              label: "Texto do Botão",
              category: "content",
            },
            {
              key: "buttonLink",
              value: currentBlock?.properties?.buttonLink || "",
              type: PropertyType.TEXT,
              label: "Link do Botão",
              category: "behavior",
            },
          ];

        case "progress":
          return [
            ...baseProperties,
            {
              key: "value",
              value: currentBlock?.properties?.value || 50,
              type: PropertyType.RANGE,
              label: "Valor do Progresso",
              category: "content",
              min: 0,
              max: 100,
              step: 1,
              unit: "%",
            },
            {
              key: "max",
              value: currentBlock?.properties?.max || 100,
              type: PropertyType.NUMBER,
              label: "Valor Máximo",
              category: "behavior",
            },
            {
              key: "showLabel",
              value: currentBlock?.properties?.showLabel === true,
              type: PropertyType.SWITCH,
              label: "Mostrar Percentual",
              category: "style",
            },
          ];

        case "stat":
          return [
            ...baseProperties,
            {
              key: "value",
              value: currentBlock?.properties?.value || "0",
              type: PropertyType.TEXT,
              label: "Valor da Estatística",
              category: "content",
              required: true,
            },
            {
              key: "label",
              value: currentBlock?.properties?.label || "",
              type: PropertyType.TEXT,
              label: "Rótulo",
              category: "content",
            },
            {
              key: "unit",
              value: currentBlock?.properties?.unit || "",
              type: PropertyType.TEXT,
              label: "Unidade",
              category: "content",
            },
          ];

        // ✅ CORREÇÃO: Tipos com hífen também precisam de casos específicos
        case "text-inline":
          return [
            ...baseProperties,
            {
              key: "content",
              value: currentBlock?.properties?.content || currentBlock?.properties?.text || "",
              type: PropertyType.TEXTAREA,
              label: "Texto",
              category: "content",
              required: true,
            },
            {
              key: "fontSize",
              value: currentBlock?.properties?.fontSize || "text-base",
              type: PropertyType.SELECT,
              label: "Tamanho da Fonte",
              category: "style",
              options: [
                { value: "text-xs", label: "Extra Pequeno" },
                { value: "text-sm", label: "Pequeno" },
                { value: "text-base", label: "Normal" },
                { value: "text-lg", label: "Grande" },
                { value: "text-xl", label: "Extra Grande" },
              ],
            },
            {
              key: "textAlign",
              value: currentBlock?.properties?.textAlign || "left",
              type: PropertyType.ALIGNMENT,
              label: "Alinhamento",
              category: "style",
            },
            {
              key: "textColor",
              value: currentBlock?.properties?.textColor || "#432818",
              type: PropertyType.COLOR,
              label: "Cor do Texto",
              category: "style",
            },
          ];

        case "image-display-inline":
          return [
            ...baseProperties,
            {
              key: "src",
              value: currentBlock?.properties?.src || "",
              type: PropertyType.IMAGE,
              label: "URL da Imagem",
              category: "content",
              required: true,
            },
            {
              key: "alt",
              value: currentBlock?.properties?.alt || "",
              type: PropertyType.TEXT,
              label: "Texto Alternativo",
              category: "content",
            },
            {
              key: "width",
              value: currentBlock?.properties?.width || "100%",
              type: PropertyType.TEXT,
              label: "Largura",
              category: "style",
            },
            {
              key: "height",
              value: currentBlock?.properties?.height || "auto",
              type: PropertyType.TEXT,
              label: "Altura",
              category: "style",
            },
            {
              key: "borderRadius",
              value: currentBlock?.properties?.borderRadius || 0,
              type: PropertyType.RANGE,
              label: "Bordas Arredondadas",
              category: "style",
              min: 0,
              max: 50,
              step: 1,
              unit: "px",
            },
          ];

        case "button-inline":
          return [
            ...baseProperties,
            {
              key: "text",
              value: currentBlock?.properties?.text || "",
              type: PropertyType.TEXT,
              label: "Texto do Botão",
              category: "content",
              required: true,
            },
            {
              key: "variant",
              value: currentBlock?.properties?.variant || "primary",
              type: PropertyType.SELECT,
              label: "Estilo do Botão",
              category: "style",
              options: [
                { value: "primary", label: "Primário" },
                { value: "secondary", label: "Secundário" },
                { value: "outline", label: "Contorno" },
                { value: "ghost", label: "Transparente" },
              ],
            },
            {
              key: "size",
              value: currentBlock?.properties?.size || "default",
              type: PropertyType.SELECT,
              label: "Tamanho",
              category: "style",
              options: [
                { value: "sm", label: "Pequeno" },
                { value: "default", label: "Normal" },
                { value: "lg", label: "Grande" },
              ],
            },
            {
              key: "href",
              value: currentBlock?.properties?.href || "",
              type: PropertyType.TEXT,
              label: "Link (URL)",
              category: "behavior",
            },
          ];

        case "pricing-card":
          return [
            ...baseProperties,
            {
              key: "title",
              value: currentBlock?.properties?.title || "",
              type: PropertyType.TEXT,
              label: "Título do Plano",
              category: "content",
              required: true,
            },
            {
              key: "price",
              value: currentBlock?.properties?.price || "",
              type: PropertyType.TEXT,
              label: "Preço",
              category: "content",
              required: true,
            },
            {
              key: "currency",
              value: currentBlock?.properties?.currency || "R$",
              type: PropertyType.TEXT,
              label: "Moeda",
              category: "content",
            },
            {
              key: "period",
              value: currentBlock?.properties?.period || "mensal",
              type: PropertyType.SELECT,
              label: "Período",
              category: "content",
              options: [
                { value: "mensal", label: "Mensal" },
                { value: "anual", label: "Anual" },
                { value: "único", label: "Pagamento Único" },
              ],
            },
            {
              key: "features",
              value: currentBlock?.properties?.features || "",
              type: PropertyType.TEXTAREA,
              label: "Recursos (um por linha)",
              category: "content",
              rows: 4,
            },
            {
              key: "highlighted",
              value: currentBlock?.properties?.highlighted === true,
              type: PropertyType.SWITCH,
              label: "Plano em Destaque",
              category: "style",
            },
          ];

        case "countdown":
          return [
            ...baseProperties,
            {
              key: "targetDate",
              value: currentBlock?.properties?.targetDate || "",
              type: PropertyType.TEXT,
              label: "Data Alvo (YYYY-MM-DD)",
              category: "content",
              required: true,
            },
            {
              key: "title",
              value: currentBlock?.properties?.title || "Oferta Limitada",
              type: PropertyType.TEXT,
              label: "Título",
              category: "content",
            },
            {
              key: "showLabels",
              value: currentBlock?.properties?.showLabels === true,
              type: PropertyType.SWITCH,
              label: "Mostrar Rótulos",
              category: "style",
            },
          ];

        default:
          // ✅ CORREÇÃO: Log para debug dos tipos não mapeados
          console.warn(`🔧 useUnifiedProperties: Tipo de bloco "${blockType}" não tem propriedades específicas definidas. Usando propriedades base.`);
          return baseProperties;
      }
    },
    [] // Sem dependências, pois `currentBlock` é passado como argumento
  );

  // Adicionar suporte ao bloco de resultados de quiz
  const generateResultsBlockProperties = useCallback(
    (currentBlock: UnifiedBlock | null): UnifiedProperty[] => {
      return [
        {
          key: "calculationMethod",
          value: currentBlock?.properties?.calculationMethod || '{"type":"sum"}',
          type: PropertyType.TEXTAREA,
          label: "Método de Cálculo (JSON)",
          category: "scoring",
          rows: 5,
        },
        {
          key: "results",
          value: currentBlock?.properties?.results || "[]",
          type: PropertyType.TEXTAREA,
          label: "Resultados Possíveis (JSON)",
          category: "scoring",
          rows: 8,
        },
        {
          key: "showScores",
          value: currentBlock?.properties?.showScores !== false,
          type: PropertyType.SWITCH,
          label: "Mostrar Pontuações",
          category: "scoring",
        },
        {
          key: "showAllResults",
          value: currentBlock?.properties?.showAllResults === true,
          type: PropertyType.SWITCH,
          label: "Mostrar Todos os Resultados",
          category: "scoring",
        },
        {
          key: "demoResult",
          value: currentBlock?.properties?.demoResult || "",
          type: PropertyType.TEXT,
          label: "ID do Resultado para Preview",
          category: "scoring",
        },
      ];
    },
    []
  );

  // Efeito para atualizar as propriedades quando o bloco selecionado muda
  useEffect(() => {
    console.log("🔄 useUnifiedProperties - useEffect triggered with block:", block);

    if (block && block.type) {
      console.log("✅ Block has type:", block.type);
      console.log("🏗️ Block properties:", block.properties);

      // Gera as novas propriedades usando os valores do bloco atual
      let newProperties;

      // Para blocos de resultados de quiz, usar o gerador específico
      if (block.type === "quiz-results") {
        newProperties = generateResultsBlockProperties(block);
      } else {
        // Caso contrário, usar o gerador padrão
        newProperties = generateDefaultProperties(block.type, block);
      }

      console.log("🎛️ Generated properties:", newProperties);

      setProperties(newProperties); // Atualiza o estado interno do hook
    } else {
      console.log("❌ No block or no block type, clearing properties");
      setProperties([]); // Limpa as propriedades se nenhum bloco estiver selecionado
    }
  }, [block, generateDefaultProperties, generateResultsBlockProperties]);

  // Função para atualizar uma propriedade específica
  const updateProperty = useCallback(
    (key: string, value: any) => {
      if (!block) return;

      // ✅ CORREÇÃO: Tratar final-step de forma especial para estruturar stepConfig
      let updatedProperties;
      
      if (block.type === "final-step" && ["stepNumber", "title", "subtitle"].includes(key)) {
        // Para final-step, estruturar dentro de stepConfig
        const currentStepConfig = block.properties?.stepConfig || {};
        updatedProperties = {
          ...block.properties,
          stepConfig: {
            ...currentStepConfig,
            [key]: value,
          },
        };
      } else {
        // Para outros tipos, atualizar diretamente
        updatedProperties = { ...block.properties, [key]: value };
      }

      // Atualizar o estado interno
      setProperties(prevProps =>
        prevProps.map(prop => (prop.key === key ? { ...prop, value } : prop))
      );

      // Notificar o sistema externo se o callback for fornecido
      if (onUpdateExternal) {
        // ✅ CORREÇÃO: Passar as propriedades atualizadas completas
        onUpdateExternal(block.id, updatedProperties);
      }
    },
    [block, onUpdateExternal]
  );

  // Função para resetar as propriedades para seus valores padrão
  const resetProperties = useCallback(() => {
    if (block) {
      const defaultProperties = generateDefaultProperties(block.type, block);
      setProperties(defaultProperties); // Atualiza o estado interno do hook
      // Também notifica o sistema externo sobre o reset
      if (onUpdateExternal) {
        onUpdateExternal(block.id, { properties: {} }); // Reseta todas as propriedades no bloco
      }
    }
  }, [block, generateDefaultProperties, onUpdateExternal]);

  // Função para validar se todas as propriedades obrigatórias estão preenchidas
  const validateProperties = useCallback(() => {
    return properties.every(prop => {
      if (prop.required && (!prop.value || prop.value === "")) {
        return false;
      }
      return true;
    });
  }, [properties]);

  // Função para obter uma propriedade específica pela chave
  const getPropertyByKey = useCallback(
    (key: string) => {
      return properties.find(prop => prop.key === key);
    },
    [properties]
  );

  // Função para obter propriedades filtradas por categoria
  const getPropertiesByCategory = useCallback(
    (category: PropertyCategoryOrString) => {
      if (!properties || !Array.isArray(properties)) {
        return [];
      }
      return properties.filter(prop => prop.category === category);
    },
    [properties]
  );

  // Função para exportar as propriedades como um objeto simples (chave: valor)
  const exportProperties = useCallback(() => {
    return properties.reduce(
      (acc, prop) => {
        acc[prop.key] = prop.value;
        return acc;
      },
      {} as Record<string, any>
    );
  }, [properties]);

  // Função para aplicar cores da marca automaticamente a propriedades de cor
  const applyBrandColors = useCallback(() => {
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
    // Notifica o sistema externo sobre a aplicação das cores da marca
    if (block && onUpdateExternal) {
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
  }, [block, properties, onUpdateExternal]);

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

export default useUnifiedProperties;

import { BRAND_COLORS } from "@/config/brandColors";
// Assumindo PropertyDefinition e PropertyType são definidos em "@/types/editor"
// Para simplicidade, vamos definir PropertyType aqui se não for fornecido em outro lugar.
export enum PropertyType {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  BOOLEAN = "boolean",
  COLOR = "color",
  SELECT = "select",
  RANGE = "range",
  IMAGE = "image", // Adicionado tipo de imagem
  OPTION_SCORE = "optionScore", // Assumindo que estes são tipos personalizados para pontuação
  OPTION_CATEGORY = "optionCategory", // Assumindo que estes são tipos personalizados para categorias
}

// Interface para cada propriedade unificada que o painel irá exibir
export interface UnifiedProperty {
  key: string; // Chave única para a propriedade (ex: "htmlContent", "fontSize")
  value: any; // O valor atual da propriedade
  type: PropertyType; // O tipo de controle de UI (text, number, boolean, etc.)
  label: string; // Rótulo exibido no painel
  category:
    | "content"
    | "style"
    | "layout"
    | "advanced"
    | "basic"
    | "quiz"
    | "behavior"
    | "scoring"
    | "alignment"; // Categoria para agrupar no painel
  required?: boolean; // Se o campo é obrigatório
  options?: Array<{ value: string; label: string }>; // Opções para tipos 'select'
  rows?: number; // Número de linhas para 'textarea'
  min?: number; // Valor mínimo para 'number' ou 'range'
  max?: number; // Valor máximo para 'number' ou 'range'
  step?: number; // Incremento para 'number' ou 'range'
  unit?: string; // Unidade de medida (ex: "px", "%")
  defaultValue?: any; // Valor padrão para inicialização
}

// Interface para o bloco unificado que o hook recebe
export interface UnifiedBlock {
  id: string;
  type: string;
  properties: Record<string, any>; // Objeto de propriedades do bloco
  brandColors?: typeof BRAND_COLORS; // Cores da marca (opcional)
}

// Interface para o retorno do hook useUnifiedProperties
export interface UseUnifiedPropertiesReturn {
  properties: UnifiedProperty[]; // Lista de propriedades geradas
  updateProperty: (key: string, value: any) => void; // Função para atualizar uma propriedade
  resetProperties: () => void; // Função para resetar todas as propriedades para seus valores padrão
  validateProperties: () => boolean; // Função para validar se todas as propriedades obrigatórias estão preenchidas
  getPropertyByKey: (key: string) => UnifiedProperty | undefined; // Obtém uma propriedade específica pela chave
  getPropertiesByCategory: (category: string) => UnifiedProperty[]; // Obtém propriedades filtradas por categoria
  exportProperties: () => Record<string, any>; // Exporta as propriedades como um objeto simples
  applyBrandColors: () => void; // Aplica cores da marca a propriedades de cor
}

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
          category: "advanced",
          required: true,
        },
        {
          key: "visible",
          value: currentBlock?.properties?.visible !== false, // Padrão é visível, a menos que seja explicitamente false
          type: PropertyType.BOOLEAN,
          label: "Visível",
          category: "layout",
        },
        {
          key: "scale",
          value: currentBlock?.properties?.scale || 100, // Valor padrão de 100%
          type: PropertyType.RANGE,
          label: "Tamanho Uniforme",
          category: "style",
          min: 50,
          max: 200,
          step: 10,
          unit: "%",
        },
      ];

      // Propriedades específicas adicionadas com base no tipo do bloco
      switch (blockType) {
        case "text-inline":
          return [
            ...baseProperties,
            {
              key: "htmlContent",
              value: currentBlock?.properties?.htmlContent || "Texto exemplo",
              type: PropertyType.TEXTAREA,
              label: "Conteúdo HTML",
              category: "content",
              required: true,
              rows: 6,
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
              value: currentBlock?.properties?.textAlign || "left",
              type: PropertyType.SELECT,
              label: "Alinhamento",
              category: "alignment",
              options: [
                { value: "left", label: "Esquerda" },
                { value: "center", label: "Centro" },
                { value: "right", label: "Direita" },
                { value: "justify", label: "Justificado" },
              ],
            },
            {
              key: "fontSize",
              value: currentBlock?.properties?.fontSize || "base",
              type: PropertyType.SELECT,
              label: "Tamanho da Fonte",
              category: "style",
              options: [
                { value: "xs", label: "Extra Pequeno" },
                { value: "sm", label: "Pequeno" },
                { value: "base", label: "Normal" },
                { value: "lg", label: "Grande" },
                { value: "xl", label: "Extra Grande" },
                { value: "2xl", label: "2X Grande" },
                { value: "3xl", label: "3X Grande" },
              ],
            },
            {
              key: "color",
              value: currentBlock?.properties?.color || "default",
              type: PropertyType.SELECT,
              label: "Cor do Texto",
              category: "style",
              options: [
                { value: "default", label: "Padrão" },
                { value: "primary", label: "Primária" },
                { value: "secondary", label: "Secundária" },
                { value: "muted", label: "Sutil" },
                { value: "accent", label: "Destaque" },
              ],
            },
            {
              key: "marginTop",
              value: currentBlock?.properties?.marginTop || 0,
              type: PropertyType.RANGE,
              label: "Margem Superior",
              category: "style",
              min: 0,
              max: 100,
              step: 4,
              unit: "px",
            },
            {
              key: "marginBottom",
              value: currentBlock?.properties?.marginBottom || 0,
              type: PropertyType.RANGE,
              label: "Margem Inferior",
              category: "style",
              min: 0,
              max: 100,
              step: 4,
              unit: "px",
            },
          ];

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
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
              label: "Seleção Obrigatória",
              category: "behavior",
            },
            {
              key: "autoAdvance",
              value: currentBlock?.properties?.autoAdvance === true,
              type: PropertyType.BOOLEAN,
              label: "Avançar Automaticamente",
              category: "behavior",
            },
            {
              key: "showCorrectAnswer",
              value: currentBlock?.properties?.showCorrectAnswer !== false,
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
              label: "Desabilitado",
              category: "behavior",
            },
            {
              key: "fullWidth",
              value: currentBlock?.properties?.fullWidth === true,
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
              label: "Seleção Obrigatória",
              category: "behavior",
            },
            {
              key: "autoAdvance",
              value: currentBlock?.properties?.autoAdvance === true,
              type: PropertyType.BOOLEAN,
              label: "Avançar Automaticamente",
              category: "behavior",
            },
            {
              key: "showFeedback",
              value: currentBlock?.properties?.showFeedback !== false,
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
              label: "Embaralhar Opções",
              category: "behavior",
            },
            {
              key: "useLetterOptions",
              value: currentBlock?.properties?.useLetterOptions === true,
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
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
              type: PropertyType.BOOLEAN,
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

        default:
          return baseProperties;
      }
    },
    [] // Sem dependências, pois `currentBlock` é passado como argumento
  );

  // Efeito para atualizar as propriedades quando o bloco selecionado muda
  useEffect(() => {
    console.log("🔄 useUnifiedProperties - useEffect triggered with block:", block);

    if (block && block.type) {
      console.log("✅ Block has type:", block.type);
      console.log("🏗️ Block properties:", block.properties);

      // Gera as novas propriedades usando os valores do bloco atual
      const newProperties = generateDefaultProperties(block.type, block);
      console.log("🎛️ Generated properties:", newProperties);

      setProperties(newProperties); // Atualiza o estado interno do hook
    } else {
      console.log("❌ No block or no block type, clearing properties");
      setProperties([]); // Limpa as propriedades se nenhum bloco estiver selecionado
    }
  }, [block, generateDefaultProperties]);

  // Função para atualizar o valor de uma propriedade
  const updateProperty = useCallback(
    (key: string, value: any) => {
      // Atualiza o estado interno do hook (para re-renderizar o painel)
      setProperties(prev => prev.map(prop => (prop.key === key ? { ...prop, value } : prop)));

      // Notifica o sistema externo (EditorProvider) sobre a mudança
      if (block && onUpdateExternal) {
        // ✅ CORREÇÃO CRÍTICA: Enviar updates aninhados sob 'properties'
        onUpdateExternal(block.id, { properties: { ...block.properties, [key]: value } });
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
    (category: string) => {
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

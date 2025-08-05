import { BRAND_COLORS } from "@/config/brandColors";
import { PropertyDefinition, PropertyType } from "@/types/editor";
import { useCallback, useEffect, useState } from "react";

export interface UnifiedProperty {
  key: string;
  value: any;
  type: "text" | "textarea" | "number" | "boolean" | "color" | "select" | "range";
  label: string;
  category: "content" | "style" | "layout" | "advanced";
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface UnifiedBlock {
  id: string;
  type: string;
  properties: Record<string, any>;
  brandColors?: typeof BRAND_COLORS;
}

export interface UseUnifiedPropertiesReturn {
  properties: UnifiedProperty[];
  updateProperty: (key: string, value: any) => void;
  resetProperties: () => void;
  validateProperties: () => boolean;
  getPropertyByKey: (key: string) => UnifiedProperty | undefined;
  getPropertiesByCategory: (category: string) => UnifiedProperty[];
  exportProperties: () => Record<string, any>;
  applyBrandColors: () => void;
  getComponentProperties: (blockType: string) => PropertyDefinition[];
}

export const useUnifiedProperties = (
  block: UnifiedBlock | null,
  onUpdate?: (blockId: string, updates: Record<string, any>) => void
): UseUnifiedPropertiesReturn => {
  const [properties, setProperties] = useState<UnifiedProperty[]>([]);

  // Gerar propriedades padrão baseadas no tipo do bloco
  const generateDefaultProperties = useCallback(
    (blockType: string): UnifiedProperty[] => {
      const baseProperties: UnifiedProperty[] = [
        {
          key: "id",
          value: block?.id || "",
          type: "text",
          label: "ID do Componente",
          category: "advanced",
          required: true,
        },
        {
          key: "visible",
          value: true,
          type: "boolean",
          label: "Visível",
          category: "layout",
        },
      ];

      // Propriedades específicas por tipo
      switch (blockType) {
        case "text":
        case "text-inline":
          return [
            ...baseProperties,
            {
              key: "content",
              value: block?.properties?.content || "Texto exemplo",
              type: "textarea",
              label: "Conteúdo",
              category: "content",
              required: true,
            },
            {
              key: "fontSize",
              value: block?.properties?.fontSize || 16,
              type: "range",
              label: "Tamanho da Fonte",
              category: "style",
              min: 12,
              max: 48,
              step: 1,
            },
            {
              key: "textColor",
              value: block?.properties?.textColor || BRAND_COLORS.textPrimary,
              type: "color",
              label: "Cor do Texto",
              category: "style",
            },
          ];

        case "heading":
        case "heading-inline":
          return [
            ...baseProperties,
            {
              key: "content",
              value: block?.properties?.content || "Título Principal",
              type: "text",
              label: "Título",
              category: "content",
              required: true,
            },
            {
              key: "level",
              value: block?.properties?.level || "h2",
              type: "select",
              label: "Nível do Título",
              category: "content",
              options: ["h1", "h2", "h3", "h4", "h5", "h6"],
            },
            {
              key: "textAlign",
              value: block?.properties?.textAlign || "left",
              type: "select",
              label: "Alinhamento",
              category: "style",
              options: ["left", "center", "right", "justify"],
            },
          ];

        case "button":
        case "button-inline":
          return [
            ...baseProperties,
            {
              key: "text",
              value: block?.properties?.text || "Clique Aqui",
              type: "text",
              label: "Texto do Botão",
              category: "content",
              required: true,
            },
            {
              key: "variant",
              value: block?.properties?.variant || "primary",
              type: "select",
              label: "Estilo",
              category: "style",
              options: ["primary", "secondary", "outline", "ghost"],
            },
            {
              key: "backgroundColor",
              value: block?.properties?.backgroundColor || BRAND_COLORS.primary,
              type: "color",
              label: "Cor de Fundo",
              category: "style",
            },
          ];

        case "image":
        case "image-inline":
          return [
            ...baseProperties,
            {
              key: "src",
              value: block?.properties?.src || "",
              type: "text",
              label: "URL da Imagem",
              category: "content",
              required: true,
            },
            {
              key: "alt",
              value: block?.properties?.alt || "Descrição da imagem",
              type: "text",
              label: "Texto Alternativo",
              category: "content",
            },
            {
              key: "width",
              value: block?.properties?.width || 300,
              type: "range",
              label: "Largura",
              category: "layout",
              min: 50,
              max: 800,
              step: 10,
            },
          ];

        default:
          return baseProperties;
      }
    },
    [block]
  );

  // Atualizar propriedades quando o bloco mudar
  useEffect(() => {
    console.log("🔄 useUnifiedProperties - useEffect triggered with block:", block);

    if (block && block.type) {
      console.log("✅ Block has type:", block.type);
      console.log("🏗️ Block properties:", block.properties);

      const newProperties = generateDefaultProperties(block.type);
      console.log("🎛️ Generated properties:", newProperties);

      setProperties(newProperties);
    } else {
      console.log("❌ No block or no block type, clearing properties");
      setProperties([]);
    }
  }, [block, generateDefaultProperties]);

  // Função para atualizar uma propriedade
  const updateProperty = useCallback(
    (key: string, value: any) => {
      setProperties(prev => prev.map(prop => (prop.key === key ? { ...prop, value } : prop)));

      // Notificar mudança externa
      if (block && onUpdate) {
        onUpdate(block.id, { [key]: value });
      }
    },
    [block, onUpdate]
  );

  // Resetar propriedades
  const resetProperties = useCallback(() => {
    if (block) {
      const defaultProperties = generateDefaultProperties(block.type);
      setProperties(defaultProperties);
    }
  }, [block, generateDefaultProperties]);

  // Validar propriedades
  const validateProperties = useCallback(() => {
    return properties.every(prop => {
      if (prop.required && (!prop.value || prop.value === "")) {
        return false;
      }
      return true;
    });
  }, [properties]);

  // Obter propriedade por chave
  const getPropertyByKey = useCallback(
    (key: string) => {
      return properties.find(prop => prop.key === key);
    },
    [properties]
  );

  // Obter propriedades por categoria
  const getPropertiesByCategory = useCallback(
    (category: string) => {
      if (!properties || !Array.isArray(properties)) {
        return [];
      }
      return properties.filter(prop => prop.category === category);
    },
    [properties]
  );

  // Exportar propriedades como objeto
  const exportProperties = useCallback(() => {
    return properties.reduce(
      (acc, prop) => {
        acc[prop.key] = prop.value;
        return acc;
      },
      {} as Record<string, any>
    );
  }, [properties]);

  // Aplicar cores da marca automaticamente
  const applyBrandColors = useCallback(() => {
    setProperties(prev =>
      prev.map(prop => {
        if (prop.type === "color") {
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
  }, []);

  // Obter propriedades de componente com base no tipo de bloco
  const getComponentProperties = useCallback((blockType: string): PropertyDefinition[] => {
    const baseProperties: PropertyDefinition[] = [
      {
        id: "id",
        type: PropertyType.TEXT,
        label: "ID do Componente",
        category: "advanced",
        required: true,
      },
      {
        id: "visible",
        type: PropertyType.BOOLEAN,
        label: "Visível",
        category: "basic",
        defaultValue: true,
      },
    ];

    // Propriedades específicas por tipo de bloco
    switch (blockType) {
      case "text":
      case "text-inline":
        return [
          ...baseProperties,
          {
            id: "content",
            type: PropertyType.TEXTAREA,
            label: "Conteúdo",
            category: "basic",
            required: true,
            defaultValue: "Texto exemplo",
          },
          {
            id: "fontSize",
            type: PropertyType.NUMBER,
            label: "Tamanho da Fonte",
            category: "style",
            defaultValue: 16,
            min: 12,
            max: 48,
            step: 1,
          },
          {
            id: "textColor",
            type: PropertyType.COLOR,
            label: "Cor do Texto",
            category: "style",
            defaultValue: BRAND_COLORS.textPrimary,
          },
        ];

      case "heading":
      case "heading-inline":
        return [
          ...baseProperties,
          {
            id: "content",
            type: PropertyType.TEXTAREA,
            label: "Título",
            category: "basic",
            required: true,
            defaultValue: "Título exemplo",
          },
          {
            id: "level",
            type: PropertyType.SELECT,
            label: "Nível do Título",
            category: "style",
            defaultValue: "h2",
            options: [
              { value: "h1", label: "H1" },
              { value: "h2", label: "H2" },
              { value: "h3", label: "H3" },
              { value: "h4", label: "H4" },
              { value: "h5", label: "H5" },
              { value: "h6", label: "H6" },
            ],
          },
          {
            id: "fontSize",
            type: PropertyType.NUMBER,
            label: "Tamanho da Fonte",
            category: "style",
            defaultValue: 24,
            min: 16,
            max: 64,
            step: 1,
          },
          {
            id: "textColor",
            type: PropertyType.COLOR,
            label: "Cor do Texto",
            category: "style",
            defaultValue: BRAND_COLORS.textPrimary,
          },
        ];

      case "image":
      case "image-display-inline":
        return [
          ...baseProperties,
          {
            id: "src",
            type: PropertyType.IMAGE,
            label: "URL da Imagem",
            category: "basic",
            required: true,
            defaultValue: "https://via.placeholder.com/400x300",
          },
          {
            id: "alt",
            type: PropertyType.TEXT,
            label: "Texto Alternativo",
            category: "basic",
            defaultValue: "Descrição da imagem",
          },
          {
            id: "width",
            type: PropertyType.NUMBER,
            label: "Largura",
            category: "style",
            defaultValue: 400,
          },
          {
            id: "height",
            type: PropertyType.NUMBER,
            label: "Altura",
            category: "style",
            defaultValue: 300,
          },
          {
            id: "borderRadius",
            type: PropertyType.NUMBER,
            label: "Raio da Borda",
            category: "style",
            defaultValue: 0,
            min: 0,
            max: 50,
          },
        ];

      case "button":
      case "button-inline":
        return [
          ...baseProperties,
          {
            id: "label",
            type: PropertyType.TEXT,
            label: "Texto do Botão",
            category: "basic",
            required: true,
            defaultValue: "Clique Aqui",
          },
          {
            id: "url",
            type: PropertyType.TEXT,
            label: "URL",
            category: "basic",
            defaultValue: "#",
          },
          {
            id: "backgroundColor",
            type: PropertyType.COLOR,
            label: "Cor de Fundo",
            category: "style",
            defaultValue: BRAND_COLORS.primary,
          },
          {
            id: "textColor",
            type: PropertyType.COLOR,
            label: "Cor do Texto",
            category: "style",
            defaultValue: "#FFFFFF",
          },
          {
            id: "borderRadius",
            type: PropertyType.NUMBER,
            label: "Raio da Borda",
            category: "style",
            defaultValue: 4,
            min: 0,
            max: 50,
          },
        ];

      case "quiz-question-inline":
        return [
          ...baseProperties,
          {
            id: "title",
            type: PropertyType.TEXT,
            label: "Título da Pergunta",
            category: "basic",
            required: true,
            defaultValue: "Sua pergunta aqui",
          },
          {
            id: "description",
            type: PropertyType.TEXTAREA,
            label: "Descrição",
            category: "basic",
            defaultValue: "Descrição opcional da pergunta",
          },
          {
            id: "required",
            type: PropertyType.BOOLEAN,
            label: "Resposta Obrigatória",
            category: "quiz",
            defaultValue: true,
          },
          {
            id: "autoAdvance",
            type: PropertyType.BOOLEAN,
            label: "Avançar Automaticamente",
            category: "quiz",
            defaultValue: false,
          },
          {
            id: "optionA",
            type: PropertyType.TEXT,
            label: "Opção A",
            category: "basic",
            required: true,
            defaultValue: "Opção A",
          },
          {
            id: "optionAScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção A",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionACategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção A",
            category: "quiz",
            defaultValue: "",
          },
          {
            id: "optionB",
            type: PropertyType.TEXT,
            label: "Opção B",
            category: "basic",
            required: true,
            defaultValue: "Opção B",
          },
          {
            id: "optionBScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção B",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionBCategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção B",
            category: "quiz",
            defaultValue: "",
          },
          {
            id: "optionC",
            type: PropertyType.TEXT,
            label: "Opção C",
            category: "basic",
            defaultValue: "Opção C",
          },
          {
            id: "optionCScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção C",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionCCategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção C",
            category: "quiz",
            defaultValue: "",
          },
          {
            id: "optionD",
            type: PropertyType.TEXT,
            label: "Opção D",
            category: "basic",
            defaultValue: "Opção D",
          },
          {
            id: "optionDScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção D",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionDCategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção D",
            category: "quiz",
            defaultValue: "",
          },
          {
            id: "optionE",
            type: PropertyType.TEXT,
            label: "Opção E",
            category: "basic",
            defaultValue: "",
          },
          {
            id: "optionEScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção E",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionECategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção E",
            category: "quiz",
            defaultValue: "",
          },
          {
            id: "optionF",
            type: PropertyType.TEXT,
            label: "Opção F",
            category: "basic",
            defaultValue: "",
          },
          {
            id: "optionFScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção F",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionFCategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção F",
            category: "quiz",
            defaultValue: "",
          },
          {
            id: "optionG",
            type: PropertyType.TEXT,
            label: "Opção G",
            category: "basic",
            defaultValue: "",
          },
          {
            id: "optionGScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção G",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionGCategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção G",
            category: "quiz",
            defaultValue: "",
          },
          {
            id: "optionH",
            type: PropertyType.TEXT,
            label: "Opção H",
            category: "basic",
            defaultValue: "",
          },
          {
            id: "optionHScore",
            type: PropertyType.OPTION_SCORE,
            label: "Pontuação Opção H",
            category: "quiz",
            defaultValue: 0,
          },
          {
            id: "optionHCategory",
            type: PropertyType.OPTION_CATEGORY,
            label: "Categoria Opção H",
            category: "quiz",
            defaultValue: "",
          },
        ];

      default:
        return baseProperties;
    }
  }, []);

  return {
    properties,
    updateProperty,
    resetProperties,
    validateProperties,
    getPropertyByKey,
    getPropertiesByCategory,
    exportProperties,
    applyBrandColors,
    getComponentProperties,
  };
};

export default useUnifiedProperties;

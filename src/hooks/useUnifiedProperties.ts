import { useState, useCallback, useEffect } from 'react';
import { BRAND_COLORS } from '@/config/brandColors';

export interface UnifiedProperty {
  key: string;
  value: any;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'color' | 'select' | 'range';
  label: string;
  category: 'content' | 'style' | 'layout' | 'advanced';
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
}

export const useUnifiedProperties = (
  block: UnifiedBlock | null,
  onUpdate?: (blockId: string, updates: Record<string, any>) => void
): UseUnifiedPropertiesReturn => {
  const [properties, setProperties] = useState<UnifiedProperty[]>([]);

  // Gerar propriedades padrão baseadas no tipo do bloco
  const generateDefaultProperties = useCallback((blockType: string): UnifiedProperty[] => {
    const baseProperties: UnifiedProperty[] = [
      {
        key: 'id',
        value: block?.id || '',
        type: 'text',
        label: 'ID do Componente',
        category: 'advanced',
        required: true,
      },
      {
        key: 'visible',
        value: true,
        type: 'boolean',
        label: 'Visível',
        category: 'layout',
      },
    ];

    // Propriedades específicas por tipo
    switch (blockType) {
      case 'text':
      case 'text-inline':
        return [
          ...baseProperties,
          {
            key: 'content',
            value: block?.properties?.content || 'Texto exemplo',
            type: 'textarea',
            label: 'Conteúdo',
            category: 'content',
            required: true,
          },
          {
            key: 'fontSize',
            value: block?.properties?.fontSize || 16,
            type: 'range',
            label: 'Tamanho da Fonte',
            category: 'style',
            min: 12,
            max: 48,
            step: 1,
          },
          {
            key: 'textColor',
            value: block?.properties?.textColor || BRAND_COLORS.brand.text,
            type: 'color',
            label: 'Cor do Texto',
            category: 'style',
          },
        ];

      case 'heading':
      case 'heading-inline':
        return [
          ...baseProperties,
          {
            key: 'content',
            value: block?.properties?.content || 'Título Principal',
            type: 'text',
            label: 'Título',
            category: 'content',
            required: true,
          },
          {
            key: 'level',
            value: block?.properties?.level || 'h2',
            type: 'select',
            label: 'Nível do Título',
            category: 'content',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          },
          {
            key: 'textAlign',
            value: block?.properties?.textAlign || 'left',
            type: 'select',
            label: 'Alinhamento',
            category: 'style',
            options: ['left', 'center', 'right', 'justify'],
          },
        ];

      case 'button':
      case 'button-inline':
        return [
          ...baseProperties,
          {
            key: 'text',
            value: block?.properties?.text || 'Clique Aqui',
            type: 'text',
            label: 'Texto do Botão',
            category: 'content',
            required: true,
          },
          {
            key: 'variant',
            value: block?.properties?.variant || 'primary',
            type: 'select',
            label: 'Estilo',
            category: 'style',
            options: ['primary', 'secondary', 'outline', 'ghost'],
          },
          {
            key: 'backgroundColor',
            value: block?.properties?.backgroundColor || BRAND_COLORS.brand.primary,
            type: 'color',
            label: 'Cor de Fundo',
            category: 'style',
          },
        ];

      case 'image':
      case 'image-inline':
        return [
          ...baseProperties,
          {
            key: 'src',
            value: block?.properties?.src || '',
            type: 'text',
            label: 'URL da Imagem',
            category: 'content',
            required: true,
          },
          {
            key: 'alt',
            value: block?.properties?.alt || 'Descrição da imagem',
            type: 'text',
            label: 'Texto Alternativo',
            category: 'content',
          },
          {
            key: 'width',
            value: block?.properties?.width || 300,
            type: 'range',
            label: 'Largura',
            category: 'layout',
            min: 50,
            max: 800,
            step: 10,
          },
        ];

      default:
        return baseProperties;
    }
  }, [block]);

  // Atualizar propriedades quando o bloco mudar
  useEffect(() => {
    if (block) {
      const newProperties = generateDefaultProperties(block.type);
      setProperties(newProperties);
    } else {
      setProperties([]);
    }
  }, [block, generateDefaultProperties]);

  // Função para atualizar uma propriedade
  const updateProperty = useCallback((key: string, value: any) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.key === key ? { ...prop, value } : prop
      )
    );

    // Notificar mudança externa
    if (block && onUpdate) {
      onUpdate(block.id, { [key]: value });
    }
  }, [block, onUpdate]);

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
      if (prop.required && (!prop.value || prop.value === '')) {
        return false;
      }
      return true;
    });
  }, [properties]);

  // Obter propriedade por chave
  const getPropertyByKey = useCallback((key: string) => {
    return properties.find(prop => prop.key === key);
  }, [properties]);

  // Obter propriedades por categoria
  const getPropertiesByCategory = useCallback((category: string) => {
    return properties.filter(prop => prop.category === category);
  }, [properties]);

  // Exportar propriedades como objeto
  const exportProperties = useCallback(() => {
    return properties.reduce((acc, prop) => {
      acc[prop.key] = prop.value;
      return acc;
    }, {} as Record<string, any>);
  }, [properties]);

  // Aplicar cores da marca automaticamente
  const applyBrandColors = useCallback(() => {
    setProperties(prev => 
      prev.map(prop => {
        if (prop.type === 'color') {
          if (prop.key.includes('text') || prop.key.includes('Text')) {
            return { ...prop, value: BRAND_COLORS.brand.text };
          }
          if (prop.key.includes('background') || prop.key.includes('Background')) {
            return { ...prop, value: BRAND_COLORS.brand.primary };
          }
          if (prop.key.includes('border') || prop.key.includes('Border')) {
            return { ...prop, value: BRAND_COLORS.brand.primary };
          }
        }
        return prop;
      })
    );
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
  };
};

export default useUnifiedProperties;

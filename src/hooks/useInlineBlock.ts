import { useState, useEffect, useCallback } from 'react';
import { 
  InlineBlockProps, 
  InlineBlockBaseProperties, 
  validateInlineProperties,
  SPACING_CLASSES,
  MARGIN_CLASSES,
  GRID_CLASSES,
  FONT_SIZE_CLASSES,
  FONT_WEIGHT_CLASSES,
  TEXT_ALIGN_CLASSES,
  BRAND_COLORS
} from '@/types/inlineBlocks';

/**
 * Hook personalizado para componentes inline das 21 etapas
 * 
 * Centraliza a lógica comum de todos os componentes inline:
 * - Gerenciamento de estado
 * - Validação de propriedades
 * - Classes CSS responsivas
 * - Handlers de mudança
 */
export const useInlineBlock = (props: InlineBlockProps) => {
  const {
    block,
    isSelected = false,
    onClick,
    onPropertyChange,
    className = ''
  } = props;

  // Estado local
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Propriedades validadas
  const validatedProperties = validateInlineProperties(block.properties);

  // Effect para animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, validatedProperties.animationDelay || 0);

    return () => clearTimeout(timer);
  }, [validatedProperties.animationDelay]);

  // Handler para mudança de propriedades
  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  }, [onPropertyChange]);

  // Handler para mudança de propriedades aninhadas
  const handleNestedPropertyChange = useCallback((path: string, value: any) => {
    const pathArray = path.split('.');
    const newProperties = { ...block.properties };
    let current = newProperties;

    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) current[pathArray[i]] = {};
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;

    if (onPropertyChange) {
      onPropertyChange('properties', newProperties);
    }
  }, [block.properties, onPropertyChange]);

  // Gerar classes CSS responsivas
  const getResponsiveClasses = useCallback(() => {
    const {
      gridColumns = 1,
      spacing = 'md',
      padding = 'md',
      margin = 'none',
      fontSize = 'base',
      fontWeight = 'normal',
      textAlign = 'left',
      hidden = false
    } = validatedProperties;

    return {
      container: `
        ${GRID_CLASSES[gridColumns]}
        ${SPACING_CLASSES[spacing]}
        ${MARGIN_CLASSES[margin]}
        transition-all duration-200 ease-in-out
        ${isSelected 
          ? 'ring-2 ring-blue-500/50 bg-blue-50/30 shadow-md' 
          : 'hover:shadow-sm'
        }
        ${hidden ? 'opacity-50' : 'opacity-100'}
        ${className}
      `.trim().replace(/\s+/g, ' '),
      
      content: `
        ${FONT_SIZE_CLASSES[fontSize]}
        ${FONT_WEIGHT_CLASSES[fontWeight]}
        ${TEXT_ALIGN_CLASSES[textAlign]}
        transition-all duration-200
      `.trim().replace(/\s+/g, ' ')
    };
  }, [validatedProperties, isSelected, className]);

  // Estilos inline
  const getInlineStyles = useCallback(() => {
    const {
      backgroundColor = BRAND_COLORS.background,
      textColor = BRAND_COLORS.textDark,
      borderColor = BRAND_COLORS.border
    } = validatedProperties;

    return {
      backgroundColor,
      color: textColor,
      borderColor
    };
  }, [validatedProperties]);

  // Props comuns para elementos HTML
  const getCommonProps = useCallback(() => ({
    onClick,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    'data-block-id': block.id,
    'data-block-type': block.type,
    'data-selected': isSelected,
    style: getInlineStyles()
  }), [onClick, block.id, block.type, isSelected, getInlineStyles]);

  return {
    // Estado
    isLoaded,
    isHovered,
    isSelected,
    
    // Propriedades
    properties: validatedProperties,
    
    // Handlers
    handlePropertyChange,
    handleNestedPropertyChange,
    
    // Classes e estilos
    classes: getResponsiveClasses(),
    styles: getInlineStyles(),
    commonProps: getCommonProps(),
    
    // Utilitários
    block,
    onClick,
    onPropertyChange
  };
};

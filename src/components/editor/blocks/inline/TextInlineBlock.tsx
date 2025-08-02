
import React from 'react';
import { cn } from '@/lib/utils';

interface TextInlineBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      content?: {
        text?: string;
      };
      style?: {
        fontSize?: string;
        fontFamily?: string;
        color?: string;
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        lineHeight?: string;
        letterSpacing?: string;
      };
      layout?: {
        maxWidth?: string;
        margin?: string;
        padding?: string;
      };
    };
  };
  className?: string;
  onClick?: () => void;
  text?: string;
  style?: React.CSSProperties;
}

export const TextInlineBlock: React.FC<TextInlineBlockProps> = ({ 
  block, 
  className, 
  onClick,
  text: directText,
  style: directStyle
}) => {
  console.log('🧱 TextInlineBlock render:', {
    blockId: block?.id,
    properties: block?.properties,
    directText,
    directStyle
  });

  // Obter valores das propriedades do bloco ou usar props diretas
  const properties = block?.properties || {};
  const content = properties.content || {};
  const styleProps = properties.style || {};
  const layoutProps = properties.layout || {};
  
  const text = content.text || directText || 'Digite seu texto aqui...';
  
  // Construir estilos combinados
  const combinedStyle: React.CSSProperties = {
    fontSize: styleProps.fontSize || '16px',
    fontFamily: styleProps.fontFamily || 'Inter, sans-serif',
    color: styleProps.color || '#333333',
    textAlign: styleProps.textAlign || 'left',
    fontWeight: styleProps.fontWeight || 'normal',
    fontStyle: styleProps.fontStyle || 'normal',
    textDecoration: styleProps.textDecoration || 'none',
    lineHeight: styleProps.lineHeight || '1.5',
    letterSpacing: styleProps.letterSpacing || 'normal',
    maxWidth: layoutProps.maxWidth || 'none',
    margin: layoutProps.margin || '0',
    padding: layoutProps.padding || '8px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    ...directStyle
  };

  return (
    <div
      className={cn(
        "inline-text-block transition-all duration-200",
        onClick && "hover:bg-gray-50 hover:shadow-sm",
        className
      )}
      style={combinedStyle}
      onClick={onClick}
      data-block-type="text-inline"
      data-block-id={block?.id}
    >
      {text}
    </div>
  );
};

export default TextInlineBlock;

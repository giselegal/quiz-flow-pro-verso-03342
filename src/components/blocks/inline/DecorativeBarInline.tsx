import React from 'react';

/**
 * 🎨 COMPONENTE BARRA DECORATIVA INLINE
 * =====================================
 *
 * Componente para adicionar elementos visuais de separação
 * totalmente integrado com o sistema de propriedades unificado.
 */

interface DecorativeBarInlineProps {
  height?: number;
  color?: string;
  marginTop?: number;
  marginBottom?: number;
  width?: string;
  borderRadius?: number;
  opacity?: number;
  gradient?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const DecorativeBarInline: React.FC<DecorativeBarInlineProps> = ({
  height = 4,
  color = '#B89B7A',
  marginTop = 20,
  marginBottom = 30,
  width = '100%',
  borderRadius = 2,
  opacity = 1,
  gradient = false,
  className = '',
  style = {},
  ...props
}) => {
  const barStyle: React.CSSProperties = {
    height: `${height}px`,
    width,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    borderRadius: `${borderRadius}px`,
    opacity,
    background: gradient
      ? `linear-gradient(90deg, ${color} 0%, ${color}80 50%, ${color} 100%)`
      : color,
    transition: 'all 0.3s ease',
    ...style,
  };

  return <div className={`decorative-bar-inline ${className}`} style={barStyle} {...props} />;
};

export default DecorativeBarInline;

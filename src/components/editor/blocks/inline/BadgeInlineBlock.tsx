import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tag, Star, Award, Zap } from 'lucide-react';

interface BadgeInlineBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      content?: {
        text?: string;
        icon?: string;
      };
      style?: {
        variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'brand' | 'elegant' | 'minimal' | 'accent';
        backgroundColor?: string;
        color?: string;
        fontSize?: string;
        padding?: string;
        borderRadius?: string;
        glow?: boolean;
        gradient?: boolean;
      };
      layout?: {
        alignment?: 'left' | 'center' | 'right';
        margin?: string;
      };
    };
  };
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

export const BadgeInlineBlock: React.FC<BadgeInlineBlockProps> = ({ 
  block, 
  className, 
  onClick,
  isSelected = false,
  onPropertyChange
}) => {
  const [isHovered, setIsHovered] = useState(false);

  console.log('🧱 BadgeInlineBlock render:', {
    blockId: block?.id,
    properties: block?.properties,
  });

  const properties = block?.properties || {};
  const content = properties.content || {};
  const styleProps = properties.style || {};
  const layoutProps = properties.layout || {};

  const text = content.text || 'Badge';
  const variant = styleProps.variant || 'brand';

  // Função para obter ícone baseado no tipo
  const getIcon = () => {
    if (content.icon) return content.icon;
    
    switch (variant) {
      case 'brand':
        return <Star className="w-3 h-3" />;
      case 'elegant':
        return <Award className="w-3 h-3" />;
      case 'accent':
        return <Zap className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  // Estilos baseados na variante com cores da marca
  const getVariantStyles = () => {
    switch (variant) {
      case 'brand':
        return {
          backgroundColor: '#B89B7A',
          color: 'white',
          border: 'none',
          boxShadow: '0 2px 8px rgba(184, 155, 122, 0.3)',
          fontWeight: '600',
        };
      case 'elegant':
        return {
          background: 'linear-gradient(135deg, #B89B7A 0%, #D4C2A8 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(184, 155, 122, 0.4)',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        };
      case 'minimal':
        return {
          backgroundColor: '#E8D5C4',
          color: '#432818',
          border: '1px solid #B89B7A',
          fontWeight: '500',
        };
      case 'accent':
        return {
          backgroundColor: '#432818',
          color: '#E8D5C4',
          border: 'none',
          boxShadow: '0 2px 8px rgba(67, 40, 24, 0.3)',
          fontWeight: '600',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#B89B7A',
          border: '2px solid #B89B7A',
          fontWeight: '500',
        };
      default:
        return {
          backgroundColor: styleProps.backgroundColor || '#B89B7A',
          color: styleProps.color || 'white',
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Estilos customizados
  const customStyle: React.CSSProperties = {
    fontSize: styleProps.fontSize || '14px',
    padding: styleProps.padding || '6px 12px',
    borderRadius: styleProps.borderRadius || '6px',
    margin: layoutProps.margin || '0 4px',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    transform: isHovered ? 'translateY(-1px) scale(1.05)' : 'translateY(0) scale(1)',
    ...variantStyles,
    ...(styleProps.glow && {
      boxShadow: `${variantStyles.boxShadow || '0 2px 8px rgba(184, 155, 122, 0.3)'}, 0 0 20px rgba(184, 155, 122, 0.2)`,
    }),
  };

  // Container com alinhamento
  const containerClass = cn('badge-container inline-block group', {
    'text-left': layoutProps.alignment === 'left',
    'text-center': layoutProps.alignment === 'center',
    'text-right': layoutProps.alignment === 'right',
  });

  const isEmpty = !text || text === 'Badge';

  return (
    <div
      className={cn(
        containerClass, 
        className,
        isSelected && 'ring-2 ring-[#B89B7A]/40 ring-offset-2',
        isEmpty && 'border-2 border-dashed border-[#B89B7A]/30 rounded p-2'
      )}
      data-block-type="badge-inline"
      data-block-id={block?.id}
      onClick={onClick}
    >
      {isEmpty ? (
        <div className="flex items-center gap-2 text-[#B89B7A]/60 px-2 py-1">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-medium">Badge</span>
        </div>
      ) : (
        <Badge
          className={cn(
            'inline-flex items-center gap-1.5 transition-all duration-300 border-0',
            onClick && 'hover:scale-105 cursor-pointer',
            styleProps.gradient && 'bg-gradient-to-r'
          )}
          style={customStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {getIcon()}
          <span className="relative z-10">{text}</span>
          
          {/* Decorative elements */}
          {variant === 'elegant' && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-md opacity-50" />
          )}
          
          {variant === 'brand' && isHovered && (
            <div className="absolute inset-0 bg-white/10 rounded-md" />
          )}
        </Badge>
      )}
    </div>
  );
};

export default BadgeInlineBlock;

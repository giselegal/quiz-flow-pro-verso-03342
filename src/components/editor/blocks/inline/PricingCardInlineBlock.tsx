import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { safeGetBlockProperties } from '@/utils/blockUtils';
import { cn } from '@/lib/utils';
import { Crown, Zap, Star, ArrowRight, Check, Sparkles } from 'lucide-react';

interface PricingCardInlineBlockProps {
  block: {
    id: string;
    type: string;
    content?: any;
    properties?: {
      style?: {
        variant?: 'default' | 'premium' | 'elegant' | 'minimal';
        showBadge?: boolean;
        showFeatures?: boolean;
        isPopular?: boolean;
      };
    };
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (content: any) => void;
  onPropertyChange?: (key: string, value: any) => void;
}

export const PricingCardInlineBlock: React.FC<PricingCardInlineBlockProps> = ({
  block,
  isSelected = false,
  onSelect,
  onUpdate,
  onPropertyChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const properties = safeGetBlockProperties(block);
  const styleProps = block.properties?.style || {};

  // Valores padrão para evitar undefined
  const title = properties.title || 'Oferta Especial';
  const subtitle = properties.subtitle || 'Aproveite esta oportunidade única';
  const originalPrice = properties.originalPrice || 'R$ 497,00';
  const currentPrice = properties.currentPrice || 'R$ 97,00';
  const discount = properties.discount || '80% OFF';
  const buttonText = properties.buttonText || 'QUERO APROVEITAR';
  const buttonUrl = properties.buttonUrl || '#';
  const features = properties.features || ['Acesso completo', 'Suporte prioritário', 'Garantia 30 dias'];
  
  const variant = styleProps.variant || 'elegant';
  const showBadge = styleProps.showBadge !== false;
  const showFeatures = styleProps.showFeatures !== false;
  const isPopular = styleProps.isPopular || false;

  // Função para calcular desconto
  const calculateDiscountPercentage = () => {
    const original = parseFloat(originalPrice.replace(/[^\d,]/g, '').replace(',', '.'));
    const current = parseFloat(currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
    if (original && current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 80;
  };

  // Estilos baseados na variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return {
          card: 'bg-gradient-to-br from-[#432818] via-[#5C3A29] to-[#432818] text-white border-[#B89B7A] shadow-2xl shadow-[#B89B7A]/20',
          badge: 'bg-gradient-to-r from-[#B89B7A] to-[#E8D5C4] text-[#432818] shadow-lg',
          price: 'text-[#E8D5C4]',
          button: 'bg-gradient-to-r from-[#B89B7A] to-[#D4C2A8] hover:from-[#A08967] hover:to-[#B89B7A] text-[#432818] shadow-lg',
          icon: Crown,
        };
      case 'minimal':
        return {
          card: 'bg-white border-[#B89B7A]/30 hover:border-[#B89B7A] shadow-sm hover:shadow-md',
          badge: 'bg-[#E8D5C4] text-[#432818] border border-[#B89B7A]/30',
          price: 'text-[#432818]',
          button: 'bg-[#B89B7A] hover:bg-[#A08967] text-white',
          icon: Star,
        };
      case 'elegant':
      default:
        return {
          card: 'bg-gradient-to-br from-white via-[#FEFCFA] to-[#E8D5C4]/30 border-2 border-[#B89B7A]/40 shadow-xl hover:shadow-2xl',
          badge: 'bg-gradient-to-r from-[#B89B7A] to-[#D4C2A8] text-white shadow-md',
          price: 'text-[#432818]',
          button: 'bg-gradient-to-r from-[#B89B7A] via-[#C8A882] to-[#B89B7A] hover:from-[#A08967] hover:to-[#A08967] text-white shadow-lg hover:shadow-xl',
          icon: Sparkles,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const IconComponent = variantStyles.icon;

  console.log('🛒 PricingCardInlineBlock render:', {
    blockId: block.id,
    hasProperties: !!properties,
    title,
    currentPrice,
    variant,
  });

  return (
    <div className="relative group">
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-4 py-1 shadow-lg animate-pulse">
            <Crown className="w-3 h-3 mr-1" />
            MAIS POPULAR
          </Badge>
        </div>
      )}

      <Card
        className={cn(
          'p-6 max-w-md mx-auto transition-all duration-300 cursor-pointer relative overflow-hidden',
          variantStyles.card,
          isSelected && 'ring-2 ring-[#B89B7A]/60 ring-offset-2',
          isHovered && 'transform scale-105',
          isPopular && 'mt-4'
        )}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#B89B7A]/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#E8D5C4]/10 rounded-full translate-y-8 -translate-x-8" />

        <div className="text-center space-y-6 relative z-10">
          {/* Badge de desconto */}
          {showBadge && (
            <div className="flex justify-center">
              <Badge className={cn(variantStyles.badge, 'text-sm font-bold px-3 py-1 animate-pulse')}>
                <Zap className="w-3 h-3 mr-1" />
                {calculateDiscountPercentage()}% OFF
              </Badge>
            </div>
          )}

          {/* Ícone */}
          <div className="flex justify-center">
            <div className={cn(
              'p-3 rounded-full transition-all duration-300',
              variant === 'premium' ? 'bg-[#B89B7A]/20' :
              variant === 'minimal' ? 'bg-[#E8D5C4]/50' :
              'bg-gradient-to-br from-[#B89B7A]/20 to-[#E8D5C4]/30'
            )}>
              <IconComponent className={cn(
                'w-6 h-6 transition-all duration-300',
                variant === 'premium' ? 'text-[#E8D5C4]' :
                variant === 'minimal' ? 'text-[#B89B7A]' :
                'text-[#B89B7A]',
                isHovered && 'scale-110'
              )} />
            </div>
          </div>

          {/* Título */}
          <h2
            className={cn(
              'text-2xl font-bold cursor-text transition-all duration-300',
              variant === 'premium' ? 'text-white' : 'text-[#432818]',
              isHovered && 'scale-105'
            )}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => onUpdate?.({ title: e.target.textContent })}
          >
            {title}
          </h2>

          {/* Subtítulo */}
          <p
            className={cn(
              'cursor-text font-medium',
              variant === 'premium' ? 'text-[#E8D5C4]/90' : 'text-[#8F7A6A]'
            )}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => onUpdate?.({ subtitle: e.target.textContent })}
          >
            {subtitle}
          </p>

          {/* Preços */}
          <div className="space-y-3">
            <div className={cn(
              'text-lg line-through',
              variant === 'premium' ? 'text-[#E8D5C4]/60' : 'text-gray-500'
            )}>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => onUpdate?.({ originalPrice: e.target.textContent })}
              >
                {originalPrice}
              </span>
            </div>

            <div className={cn('text-4xl font-bold', variantStyles.price)}>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => onUpdate?.({ currentPrice: e.target.textContent })}
              >
                {currentPrice}
              </span>
            </div>

            <div className="text-sm opacity-80">
              <span className="font-medium">Economize {calculateDiscountPercentage()}%</span>
            </div>
          </div>

          {/* Features (se habilitado) */}
          {showFeatures && (
            <div className="space-y-2 text-left">
              {features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className={cn(
                    'w-4 h-4 flex-shrink-0',
                    variant === 'premium' ? 'text-[#B89B7A]' : 'text-[#B89B7A]'
                  )} />
                  <span className={cn(
                    'text-sm',
                    variant === 'premium' ? 'text-[#E8D5C4]' : 'text-[#432818]'
                  )}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Botão CTA */}
          <Button
            className={cn(
              'w-full font-bold py-3 px-6 text-lg transition-all duration-300 group relative overflow-hidden',
              variantStyles.button,
              isHovered && 'transform scale-105'
            )}
            onClick={e => {
              e.stopPropagation();
              if (buttonUrl && buttonUrl !== '#') {
                window.open(buttonUrl, '_blank');
              }
            }}
          >
            <span className="flex items-center justify-center gap-2 relative z-10">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => onUpdate?.({ buttonText: e.target.textContent })}
              >
                {buttonText}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            
            {/* Button hover effect */}
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Button>

          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-4 text-xs opacity-70">
            <span>🔒 Compra Segura</span>
            <span>⚡ Acesso Imediato</span>
            <span>📱 Suporte 24h</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PricingCardInlineBlock;

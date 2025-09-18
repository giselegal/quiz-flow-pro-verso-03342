// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { safeGetBlockProperties } from '@/utils/blockUtils';
import { ArrowRight, Check, Crown, Sparkles, Star, Zap } from 'lucide-react';
import React, { useState } from 'react';
import type { BlockComponentProps } from '@/types/blocks';

interface Props {
  block: {
    id: string;
    type: string;
    content?: any;
    order?: number; // Adding the missing order property
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
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  isPreviewing?: boolean;
}

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
  const getMarginClass = (value: number | string | undefined, type: string): string => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

    if (!numValue || isNaN(numValue) || numValue === 0) return '';

    const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

    // Margens negativas
    if (numValue < 0) {
      const absValue = Math.abs(numValue);
      if (absValue <= 4) return `-${prefix}-1`;
      if (absValue <= 8) return `-${prefix}-2`;
      if (absValue <= 12) return `-${prefix}-3`;
      if (absValue <= 16) return `-${prefix}-4`;
      if (absValue <= 20) return `-${prefix}-5`;
      if (absValue <= 24) return `-${prefix}-6`;
      if (absValue <= 28) return `-${prefix}-7`;
      if (absValue <= 32) return `-${prefix}-8`;
      if (absValue <= 36) return `-${prefix}-9`;
      if (absValue <= 40) return `-${prefix}-10`;
      return `-${prefix}-10`; // Máximo para negativas
    }

    // Margens positivas (expandido para suportar até 100px)
    if (numValue <= 4) return `${prefix}-1`;
    if (numValue <= 8) return `${prefix}-2`;
    if (numValue <= 12) return `${prefix}-3`;
    if (numValue <= 16) return `${prefix}-4`;
    if (numValue <= 20) return `${prefix}-5`;
    if (numValue <= 24) return `${prefix}-6`;
    if (numValue <= 28) return `${prefix}-7`;
    if (numValue <= 32) return `${prefix}-8`;
    if (numValue <= 36) return `${prefix}-9`;
    if (numValue <= 40) return `${prefix}-10`;
    if (numValue <= 44) return `${prefix}-11`;
    if (numValue <= 48) return `${prefix}-12`;
    if (numValue <= 56) return `${prefix}-14`;
    if (numValue <= 64) return `${prefix}-16`;
    if (numValue <= 80) return `${prefix}-20`;
    if (numValue <= 96) return `${prefix}-24`;
    if (numValue <= 112) return `${prefix}-28`;
    return `${prefix}-32`; // Máximo suportado
  };

const PricingCardInlineBlock: React.FC<Props> = ({
  block,
  isSelected = false,
  onSelect,
  onUpdate,
  onPropertyChange,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  isPreviewing = false,
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
  const features = properties.features || [
    'Acesso completo',
    'Suporte prioritário',
    'Garantia 30 dias',
  ];

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
          card: 'bg-gradient-to-br from-[#432818] via-[#432818] to-[#432818] text-white border-[#432818] shadow-2xl shadow-[#432818]/20',
          badge: 'bg-gradient-to-r from-[#432818] to-[#432818] text-[#432818] shadow-lg',
          price: 'text-[#432818]',
          button:
            'bg-gradient-to-r from-[#432818] to-[#432818] hover:from-[#432818] hover:to-[#432818] text-[#432818] shadow-lg',
          icon: Crown,
        };
      case 'minimal':
        return {
          card: 'bg-white border-[#432818]/30 hover:border-[#432818] shadow-sm hover:shadow-md',
          badge: 'bg-[#432818] text-[#432818] border border-[#432818]/30',
          price: 'text-[#432818]',
          button: 'bg-[#432818] hover:bg-[#432818] text-white',
          icon: Star,
        };
      case 'elegant':
      default:
        return {
          card: 'bg-gradient-to-br from-white via-[#432818] to-[#432818]/30 border-2 border-[#432818]/40 shadow-xl hover:shadow-2xl',
          badge: 'bg-gradient-to-r from-[#432818] to-[#432818] text-white shadow-md',
          price: 'text-[#432818]',
          button:
            'bg-gradient-to-r from-[#432818] via-[#432818] to-[#432818] hover:from-[#432818] hover:to-[#432818] text-white shadow-lg hover:shadow-xl',
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
          isSelected && 'ring-2 ring-[#432818]/60 ring-offset-2',
          isHovered && 'transform scale-105',
          isPopular && 'mt-4',
          // Margens universais com controles deslizantes
          getMarginClass(marginTop, 'top'),
          getMarginClass(marginBottom, 'bottom'),
          getMarginClass(marginLeft, 'left'),
          getMarginClass(marginRight, 'right')
        )}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#432818]/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#432818]/10 rounded-full translate-y-8 -translate-x-8" />

        <div className="text-center space-y-6 relative z-10">
          {/* Badge de desconto */}
          {showBadge && (
            <div className="flex justify-center">
              <Badge
                className={cn(variantStyles.badge, 'text-sm font-bold px-3 py-1 animate-pulse')}
              >
                <Zap className="w-3 h-3 mr-1" />
                {calculateDiscountPercentage()}% OFF
              </Badge>
            </div>
          )}

          {/* Ícone */}
          <div className="flex justify-center">
            <div
              className={cn(
                'p-3 rounded-full transition-all duration-300',
                variant === 'premium'
                  ? 'bg-[#432818]/20'
                  : variant === 'minimal'
                    ? 'bg-[#432818]/50'
                    : 'bg-gradient-to-br from-[#432818]/20 to-[#432818]/30'
              )}
            >
              <IconComponent
                className={cn(
                  'w-6 h-6 transition-all duration-300',
                  variant === 'premium'
                    ? 'text-[#432818]'
                    : variant === 'minimal'
                      ? 'text-[#432818]'
                      : 'text-[#432818]',
                  isHovered && 'scale-110'
                )}
              />
            </div>
          </div>

          {/* Título */}
          <h2
            className={cn(
              'text-2xl font-bold transition-all duration-300',
              isPreviewing ? 'cursor-default' : 'cursor-text',
              variant === 'premium' ? 'text-white' : 'text-[#432818]',
              isHovered && 'scale-105'
            )}
            suppressContentEditableWarning
            onBlur={e => !isPreviewing && onUpdate?.({ title: e.target.textContent })}
          >
            {title}
          </h2>

          {/* Subtítulo */}
          <p
            className={cn(
              'font-medium',
              isPreviewing ? 'cursor-default' : 'cursor-text',
              variant === 'premium' ? 'text-[#432818]/90' : 'text-[#432818]'
            )}
            suppressContentEditableWarning
            onBlur={e => !isPreviewing && onUpdate?.({ subtitle: e.target.textContent })}
          >
            {subtitle}
          </p>

          {/* Preços */}
          <div className="space-y-3">
            <div
              className={cn(
                'text-lg line-through',
                isPreviewing ? 'cursor-default' : 'cursor-text',
                variant === 'premium' ? 'text-[#432818]/60' : 'text-gray-500'
              )}
            >
              <span
                suppressContentEditableWarning
                onBlur={e => !isPreviewing && onUpdate?.({ originalPrice: e.target.textContent })}
              >
                {originalPrice}
              </span>
            </div>

            <div className={cn(
              'text-4xl font-bold',
              isPreviewing ? 'cursor-default' : 'cursor-text',
              variantStyles.price
            )}>
              <span
                suppressContentEditableWarning
                onBlur={e => !isPreviewing && onUpdate?.({ currentPrice: e.target.textContent })}
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
                  <Check
                    className={cn(
                      'w-4 h-4 flex-shrink-0',
                      variant === 'premium' ? 'text-[#432818]' : 'text-[#432818]'
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm',
                      variant === 'premium' ? 'text-[#432818]' : 'text-[#432818]'
                    )}
                  >
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
                className={isPreviewing ? 'cursor-default' : 'cursor-text'}
                suppressContentEditableWarning
                onBlur={e => !isPreviewing && onUpdate?.({ buttonText: e.target.textContent })}
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

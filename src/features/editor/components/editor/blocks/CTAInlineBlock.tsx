// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import InlineBaseWrapper from './base/InlineBaseWrapper';
import InlineEditableText from './base/InlineEditableText';
import type { BlockComponentProps } from '@/types/blocks';
import {
  getPersonalizedText,
  trackComponentView,
  trackComponentClick,
  trackComponentConversion,
  RESPONSIVE_PATTERNS,
  getThemeClasses,
  INLINE_ANIMATIONS,
} from '@/utils/inlineComponentUtils';
import {
  BRAND_COLORS,
  TYPOGRAPHY,
  SPACING,
  ANIMATIONS,
  EFFECTS,
  RESPONSIVE_PATTERNS as BRAND_RESPONSIVE,
} from '@/utils/brandDesignSystem';
import {
  ArrowRight,
  ShoppingCart,
  Zap,
  Star,
  Clock,
  Gift,
  TrendingUp,
  Loader2,
} from 'lucide-react';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

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

const CTAInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    text = 'Transforme seu estilo hoje',
    buttonText = 'Quero meu Guia',
    price = 'R$ 97,00',
    showPrice = true,
    buttonStyle = 'brand',
    size = 'large',
    icon = 'shopping-cart',
    showIcon = true,
    useUsername = false,
    usernamePattern = 'Clique aqui {{username}}!',
    trackingEnabled = false,
    animation = 'scaleIn',
    theme = 'primary',
    urgencyText = '',
    showUrgency = false,
    loadingState = false,
    clickAction = 'redirect',
    redirectUrl = '#',
    conversionValue = 100,
  } = block.properties || {};

  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get username from context (placeholder)
  const username = 'Usuário';

  useEffect(() => {
    if (trackingEnabled) {
      trackComponentView(block.id, 'cta-inline');
    }
  }, [trackingEnabled, block.id]);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const getIcon = () => {
    const iconMap = {
      'arrow-right': ArrowRight,
      'shopping-cart': ShoppingCart,
      zap: Zap,
      star: Star,
      clock: Clock,
      gift: Gift,
      'trending-up': TrendingUp,
    };
    const IconComponent = iconMap[icon as keyof typeof iconMap] || ShoppingCart;
    return <IconComponent className="w-5 h-5" />;
  };

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    if (trackingEnabled) {
      trackComponentClick(block.id, 'cta-inline', 'cta_click');
      trackComponentConversion(block.id, 'cta-inline', conversionValue);
    }

    try {
      if (clickAction === 'redirect' && redirectUrl) {
        window.open(redirectUrl, '_blank');
      }
      // Add more click actions here (modal, form, etc.)
    } catch (error) {
      console.error('CTA click error:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const personalizedText = getPersonalizedText(text, usernamePattern, username, useUsername);

  const personalizedButtonText = getPersonalizedText(buttonText, buttonText, username, useUsername);

  const styleClasses = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg',
    brand:
      'bg-gradient-to-r from-[#B89B7A] to-[#A68B6A] hover:from-[#A68B6A] hover:to-[#8B7355] text-white shadow-lg shadow-[#B89B7A]/20',
    secondary:
      'bg-gradient-to-r from-[#8B7355] to-[#7A6245] hover:from-[#7A6245] hover:to-[#6B5235] text-white',
    success:
      'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white',
    warning:
      'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white',
  };

  return (
    <InlineBaseWrapper
      className={cn(
        className,
        INLINE_ANIMATIONS[animation as keyof typeof INLINE_ANIMATIONS],
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      minHeight="4rem"
      editLabel="Editar CTA"
    >
      <div
        className={cn(
          'w-full flex items-center gap-4 rounded-lg',
          SPACING.padding.md,
          ANIMATIONS.transition,
          'hover:shadow-lg hover:scale-105',
          styleClasses[buttonStyle as keyof typeof styleClasses] || styleClasses.brand
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : getIcon()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <InlineEditableText
            value={personalizedText}
            onChange={value => handlePropertyChange('text', value)}
            placeholder="Texto principal do CTA..."
            fontSize="sm"
            fontWeight="medium"
            className="text-white placeholder-white/70 mb-1"
          />

          <InlineEditableText
            value={personalizedButtonText}
            onChange={value => handlePropertyChange('buttonText', value)}
            placeholder="Texto do botão..."
            fontSize="lg"
            fontWeight="bold"
            className="text-white placeholder-white/70"
          />
        </div>

        {/* Price */}
        {showPrice && (
          <div className="flex-shrink-0 text-right">
            <InlineEditableText
              value={price}
              onChange={value => handlePropertyChange('price', value)}
              placeholder="R$ 97,00"
              fontSize="lg"
              fontWeight="bold"
              className="text-white placeholder-white/70"
            />

            {showUrgency && urgencyText && (
              <div className="text-xs text-white/80 mt-1">⏰ {urgencyText}</div>
            )}
          </div>
        )}

        {/* Arrow Icon */}
        <div
          className={cn(
            'flex-shrink-0 transition-transform duration-300',
            isHovered && 'translate-x-1'
          )}
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </div>
      </div>
    </InlineBaseWrapper>
  );
};

export default CTAInlineBlock;

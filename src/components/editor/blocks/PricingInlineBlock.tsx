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
  INLINE_ANIMATIONS,
} from '@/utils/inlineComponentUtils';
import { Crown, Star, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

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

const PricingInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Plano Premium',
    badge = 'Mais Popular',
    price = 'R$ 39,90',
    originalPrice = 'R$ 47,00',
    discount = '15% Off',
    period = 'à vista',
    isPopular = true,
    icon = 'crown',
    showIcon = true,
    useUsername = false,
    usernamePattern = 'Perfeito para {{username}}!',
    trackingEnabled = false,
    animation = 'scaleIn',
    theme = 'primary',
    showDiscount = true,
    showOriginalPrice = true,
    conversionValue = 39.9,
  } = block?.properties || {};

  const [isHovered, setIsHovered] = useState(false);

  // Get username from context (placeholder)
  const username = 'Usuário';

  useEffect(() => {
    if (trackingEnabled) {
      trackComponentView(block.id, 'pricing-inline');
    }
  }, [trackingEnabled, block.id]);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const getIcon = () => {
    const iconMap = {
      crown: Crown,
      star: Star,
      'trending-up': TrendingUp,
      'check-circle': CheckCircle,
      sparkles: Sparkles,
    };
    const IconComponent = iconMap[icon as keyof typeof iconMap] || Crown;
    return <IconComponent className="w-5 h-5 text-[#B89B7A]" />;
  };

  const handleClick = async () => {
    if (trackingEnabled) {
      trackComponentClick(block.id, 'pricing-inline', 'pricing_click');
      trackComponentConversion(block.id, 'pricing-inline', conversionValue);
    }
  };

  const personalizedTitle = getPersonalizedText(title, usernamePattern, username, useUsername);

  const personalizedBadge = getPersonalizedText(badge, badge, username, useUsername);

  return (
    <InlineBaseWrapper
      block={block}
      isSelected={isSelected}
      onPropertyChange={onPropertyChange}
      className={cn(
        className,
        INLINE_ANIMATIONS[animation as keyof typeof INLINE_ANIMATIONS],
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      minHeight="5rem"
      editLabel="Editar Preço"
    >
      <div
        className="w-full border border-zinc-200 rounded-lg bg-white overflow-hidden hover:shadow-lg transition-all duration-300"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="w-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] flex items-center justify-center py-2">
            <InlineEditableText
              value={personalizedBadge}
              onChange={value => handlePropertyChange('badge', value)}
              placeholder="Badge do plano..."
              fontSize="sm"
              fontWeight="bold"
              textAlign="center"
              className="text-white placeholder-white/70"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center gap-3">
            {showIcon && <div className="flex-shrink-0">{getIcon()}</div>}

            <div>
              <InlineEditableText
                value={personalizedTitle}
                onChange={value => handlePropertyChange('title', value)}
                placeholder="Título do plano..."
                fontSize="xl"
                fontWeight="bold"
                className="text-[#432818]"
              />
            </div>
          </div>

          {/* Price Section */}
          <div className="flex-shrink-0 text-right">
            <div className="bg-[#B89B7A]/10 rounded-lg p-3 border border-[#B89B7A]/20">
              {/* Discount Badge */}
              {showDiscount && discount && (
                <div className="mb-1">
                  <InlineEditableText
                    value={discount}
                    onChange={value => handlePropertyChange('discount', value)}
                    placeholder="Desconto..."
                    fontSize="xs"
                    fontWeight="medium"
                    textAlign="right"
                    className="text-[#aa6b5d]"
                  />
                </div>
              )}

              {/* Price and Original Price */}
              <div className="flex items-center justify-end gap-2">
                <InlineEditableText
                  value={price}
                  onChange={value => handlePropertyChange('price', value)}
                  placeholder="R$ 39,90"
                  fontSize="xl"
                  fontWeight="bold"
                  textAlign="right"
                  className="text-[#432818]"
                />

                {showOriginalPrice && originalPrice && (
                  <InlineEditableText
                    value={originalPrice}
                    onChange={value => handlePropertyChange('originalPrice', value)}
                    placeholder="R$ 47,00"
                    fontSize="sm"
                    textAlign="right"
                    className="text-stone-500 line-through"
                  />
                )}
              </div>

              {/* Period */}
              <div className="mt-1">
                <InlineEditableText
                  value={period}
                  onChange={value => handlePropertyChange('period', value)}
                  placeholder="Período..."
                  fontSize="xs"
                  textAlign="right"
                  className="text-stone-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        {isHovered && (
          <div className="absolute inset-0 border-2 border-brand rounded-lg pointer-events-none" />
        )}
      </div>
    </InlineBaseWrapper>
  );
};

export default PricingInlineBlock;

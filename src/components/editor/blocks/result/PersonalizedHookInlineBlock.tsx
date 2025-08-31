import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

/**
 * PersonalizedHookInlineBlock - Personalized hook section for results
 * Shows personalized message based on style category with CTA
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const PersonalizedHookInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    styleCategory = 'Elegante',
    userName = '',
    showUserName = true,
    title = 'Seu Estilo {styleCategory} foi Revelado!',
    subtitle = 'Agora que descobrimos sua essência estilística, é hora de transformar isso em looks poderosos que comunicam exatamente quem você é.',
    ctaText = 'Quero Transformar Minha Imagem',
    ctaUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    showCTA = true,
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    containerWidth = 'full',
    spacing = 'normal',
    marginTop = 0,
    marginBottom = 16,
    textAlign = 'center',
  } = block?.properties ?? {};

  // Replace placeholders in text
  const processedTitle = title
    .replace('{styleCategory}', styleCategory)
    .replace('{userName}', userName);
  const processedSubtitle = subtitle
    .replace('{styleCategory}', styleCategory)
    .replace('{userName}', userName);

  // Container classes
  const containerClasses = cn(
    'w-full',
    {
      'max-w-sm mx-auto': containerWidth === 'small',
      'max-w-md mx-auto': containerWidth === 'medium',
      'max-w-lg mx-auto': containerWidth === 'large',
      'max-w-2xl mx-auto': containerWidth === 'xlarge',
      'max-w-full': containerWidth === 'full',
    },
    {
      'p-4': spacing === 'small',
      'p-6': spacing === 'normal',
      'p-8': spacing === 'large',
    },
    {
      'mt-0': marginTop === 0,
      'mt-4': marginTop <= 16,
      'mt-6': marginTop <= 24,
      'mt-8': marginTop <= 32,
    },
    {
      'mb-0': marginBottom === 0,
      'mb-4': marginBottom <= 16,
      'mb-6': marginBottom <= 24,
      'mb-8': marginBottom <= 32,
    },
    {
      'text-left': textAlign === 'left',
      'text-center': textAlign === 'center',
      'text-right': textAlign === 'right',
    },
    isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50 rounded-lg',
    'rounded-lg border border-opacity-20',
    className
  );

  const handleCTAClick = () => {
    // Analytics tracking if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'personalized_hook_cta_click', {
        event_category: 'engagement',
        event_label: `${styleCategory}_Hook_CTA`,
        style_category: styleCategory,
      });
    }

    if (ctaUrl) {
      window.open(ctaUrl, '_blank');
    }
  };

  const containerStyle = {
    backgroundColor,
    color: textColor,
    borderColor: accentColor + '33', // 20% opacity
  };

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-4">
        {/* Personalized Greeting */}
        {showUserName && userName && (
          <div className="text-sm opacity-75">
            Olá, <span className="font-medium">{userName}</span>! ✨
          </div>
        )}

        {/* Main Title */}
        <h2 className="text-2xl md:text-3xl font-bold font-playfair" style={{ color: accentColor }}>
          {processedTitle}
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg leading-relaxed opacity-90">{processedSubtitle}</p>

        {/* Style Badge */}
        <div className="inline-block">
          <span
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: accentColor + '20',
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}
          >
            🎨 Estilo: {styleCategory}
          </span>
        </div>

        {/* CTA Button */}
        {showCTA && (
          <div className="pt-4">
            <Button
              onClick={handleCTAClick}
              className="text-white py-3 px-8 rounded-lg transition-all duration-300 text-base font-medium hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${accentColor}, #aa6b5d)`,
                boxShadow: `0 4px 14px ${accentColor}40`,
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>{ctaText}</span>
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedHookInlineBlock;

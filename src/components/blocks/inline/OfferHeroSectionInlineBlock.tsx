import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { Award, ArrowRight, Lock, Shield } from 'lucide-react';

/**
 * OfferHeroSectionInlineBlock - Seção hero da página de oferta
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const OfferHeroSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('OfferHeroSectionInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    badgeText = "3000+ mulheres transformadas",
    badgeIcon = "Award",
    title = "Descubra Seu",
    titleHighlight = "Estilo Predominante",
    titleSuffix = "em 5 Minutos",
    subtitle = "Tenha finalmente um guarda-roupa que **funciona 100%**, onde tudo combina e reflete sua personalidade",
    heroImageUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp",
    heroImageAlt = "Transformação de guarda-roupa",
    heroImageWidth = 600,
    heroImageHeight = 400,
    ctaText = "Descobrir Meu Estilo Agora",
    ctaIcon = "ArrowRight", 
    ctaUrl = "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
    trustElements = [
      { icon: "Lock", text: "100% Seguro" },
      { icon: "Shield", text: "7 Dias Garantia" }
    ],
    spacing = "large"
  } = properties;

  // Icon mapping
  const iconMap = {
    Award,
    ArrowRight,
    Lock,
    Shield
  };

  const spacingClasses = {
    small: "py-8",
    medium: "py-12",
    large: "py-16"
  };

  const handleCtaClick = () => {
    if (ctaUrl) {
      window.open(ctaUrl, "_blank");
    }
  };

  const BadgeIconComponent = iconMap[badgeIcon as keyof typeof iconMap] || Award;
  const CtaIconComponent = iconMap[ctaIcon as keyof typeof iconMap] || ArrowRight;

  return (
    <section
      className={cn(
        'w-full bg-[#FFFBF7]',
        spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.large,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5DDD5]/30 text-center">
          {/* Badge credibilidade */}
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-6">
            <BadgeIconComponent size={18} className="text-green-600" />
            <span className="text-sm font-semibold text-green-700">{badgeText}</span>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#432818] mb-6 font-playfair leading-tight">
            {title} <span className="text-[#B89B7A]">{titleHighlight}</span>
            <br />
            {titleSuffix}
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-[#6B4F43] mb-8 max-w-2xl mx-auto leading-relaxed">
            {subtitle.split('**').map((part: string, index: number) => 
              index % 2 === 1 ? <strong key={index}>{part}</strong> : part
            )}
          </p>

          {/* Imagem hero */}
          {heroImageUrl && (
            <div className="mb-8 max-w-lg mx-auto">
              <img
                src={heroImageUrl}
                alt={heroImageAlt}
                width={heroImageWidth}
                height={heroImageHeight}
                className="w-full h-auto rounded-xl shadow-lg"
                loading="eager"
              />
            </div>
          )}

          {/* CTA principal */}
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg mb-6"
          >
            <CtaIconComponent size={20} />
            {ctaText}
          </button>
          
          {/* Trust elements */}
          {trustElements && trustElements.length > 0 && (
            <div className="flex items-center justify-center gap-6 text-sm text-[#8B7355]">
              {trustElements.map((element: { icon: string; text: string }, index: number) => {
                const TrustIcon = iconMap[element.icon as keyof typeof iconMap] || Lock;
                return (
                  <div key={index} className="flex items-center gap-1">
                    <TrustIcon size={16} className="text-green-600" />
                    <span>{element.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OfferHeroSectionInlineBlock;
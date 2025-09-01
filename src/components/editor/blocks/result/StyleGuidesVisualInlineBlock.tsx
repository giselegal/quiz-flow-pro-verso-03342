import React from 'react';
import { safeStylePlaceholder } from '@/utils/placeholder';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Progress } from '@/components/ui/progress';

/**
 * StyleGuidesVisualInlineBlock - Visual display of style guides
 * Shows primary style guide image with secondary thumbnails and progress
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const StyleGuidesVisualInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    primaryStyleCategory = 'Elegante',
    primaryGuideImage = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/GUIA_ELEGANTE_bcksfq.webp',
    primaryStylePercentage = 75,
    secondaryStyles = [],
    showProgress = true,
    showSecondaryThumbnails = true,
    showExclusiveBadge = true,
    badgeText = 'Exclusivo',
    badgeColor = '#B89B7A',
    description = 'Seu guia de estilo personalizado baseado nas suas respostas',
    backgroundColor = '#ffffff',
    borderColor = '#B89B7A',
    containerWidth = 'large',
    spacing = 'normal',
    marginTop = 0,
    marginBottom = 16,
    textAlign = 'center',
  } = block?.properties ?? {};

  // Container classes
  const containerClasses = cn(
    'w-full',
    {
      'max-w-sm mx-auto': containerWidth === 'small',
      'max-w-md mx-auto': containerWidth === 'medium',
      'max-w-lg mx-auto': containerWidth === 'large',
      'max-w-2xl mx-auto': containerWidth === 'xlarge',
      'max-w-4xl mx-auto': containerWidth === 'xxlarge',
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
    isSelected && 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg',
    'rounded-lg border border-opacity-10',
    className
  );

  const containerStyle = {
    backgroundColor,
    borderColor: borderColor + '20',
  };

  // Process secondary styles for thumbnails
  const secondaryThumbnails = Array.isArray(secondaryStyles)
    ? secondaryStyles.slice(0, 2).map((style: any) => ({
      src: style.guideImage || safeStylePlaceholder(style.category, 80, 120),
      alt: `Guia de Estilo ${style.category}`,
      category: style.category,
    }))
    : [];

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-6">
        {/* Progress Bar */}
        {showProgress && (
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Seu estilo predominante</span>
              <span className="text-[#aa6b5d] font-medium">{primaryStylePercentage}%</span>
            </div>
            <Progress value={primaryStylePercentage} className="h-2 bg-gray-200" />
          </div>
        )}

        {/* Main Visual Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 max-w-[600px] mx-auto relative">
          {/* Primary Style Guide Image */}
          <div className="relative">
            <img
              src={`${primaryGuideImage}?q=auto:best&f=auto&w=540`}
              alt={`Guia de Estilo ${primaryStyleCategory}`}
              loading="lazy"
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 max-w-[300px] md:max-w-[400px] flex-shrink-0"
              width="540"
              height="auto"
            />

            {/* Exclusive Badge */}
            {showExclusiveBadge && (
              <div
                className="absolute -top-4 -right-4 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12"
                style={{
                  background: `linear-gradient(to right, ${badgeColor}, #aa6b5d)`,
                }}
              >
                {badgeText}
              </div>
            )}

            {/* Decorative corners */}
            <div
              className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2"
              style={{ borderColor: borderColor }}
            ></div>
            <div
              className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2"
              style={{ borderColor: borderColor }}
            ></div>
          </div>

          {/* Secondary Style Thumbnails */}
          {showSecondaryThumbnails && secondaryThumbnails.length > 0 && (
            <div className="flex flex-row md:flex-col gap-2 md:gap-3 justify-center md:justify-start flex-wrap">
              {secondaryThumbnails.map((thumbnail, index) => (
                <img
                  key={index}
                  src={`${thumbnail.src}?q=auto:best&f=auto&w=80`}
                  alt={thumbnail.alt}
                  loading="lazy"
                  className="w-[60px] h-auto rounded-md shadow-sm border hover:scale-105 transition-transform duration-300"
                  style={{ borderColor: borderColor + '40' }}
                  width="80"
                  height="auto"
                />
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {description && <p className="text-sm text-gray-600 max-w-lg mx-auto">{description}</p>}

        {/* Style Category Label */}
        <div className="inline-block">
          <span
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: borderColor + '20',
              color: borderColor,
              border: `1px solid ${borderColor}40`,
            }}
          >
            🎨 {primaryStyleCategory}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StyleGuidesVisualInlineBlock;

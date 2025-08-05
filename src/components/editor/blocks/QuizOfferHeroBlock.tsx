import React, { useState, useEffect } from 'react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import type { BlockComponentProps } from '@/types/blocks';

const QuizOfferHeroBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt = 'Logo Gisele Galvão',
    logoHeight = '60px',
    title = 'Descubra Seu Estilo Predominante',
    subtitle = 'Tenha finalmente um guarda-roupa que funciona 100%',
    heroImage = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911574/ELEGANTE_PREDOMINANTE_awmgit.webp',
    backgroundColor = '#FFFBF7',
    textColor = '#432818',
    showLogo = true,
    showImage = true,
  } = block?.properties || {};

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        w-full py-8 px-4 transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          {showLogo && (
            <div className="mb-6">
              <img src={logoUrl} alt={logoAlt} style={{ height: logoHeight }} className="mx-auto" />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: textColor }}>
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">{subtitle}</p>

          {/* Hero Image */}
          {showImage && (
            <div className="max-w-md mx-auto">
              <img src={heroImage} alt="Hero Image" className="w-full rounded-lg shadow-xl" />
            </div>
          )}
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizOfferHeroBlock;

import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Sparkles, Target, Zap } from 'lucide-react';

/**
 * MotivationSectionInlineBlock - Motivation and benefits section
 * Inspirational content with benefits and motivation
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const MotivationSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    title = 'Transforme Sua Imagem, Revele Sua Essência',
    subtitle = 'Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser.',
    benefits = [
      'Construir looks com intenção e identidade visual',
      'Utilizar cores, modelagens e tecidos a seu favor',
      'Alinhar sua imagem aos seus objetivos pessoais e profissionais',
      'Desenvolver um guarda-roupa funcional e inteligente',
    ],
    motivationText = 'Com a orientação certa, você pode transformar completamente a forma como o mundo te vê e, mais importante, como você se vê.',
    showIcons = true,
    backgroundColor = '#f9f4ef',
    textColor = '#432818',
    accentColor = '#B89B7A',
    containerWidth = 'xlarge',
    spacing = 'large',
    marginTop = 0,
    marginBottom = 24,
    textAlign = 'center',
    showMotivationText = true,
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
    'rounded-lg border border-opacity-10',
    isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
    className
  );

  const containerStyle = {
    backgroundColor,
    color: textColor,
    borderColor: accentColor + '20',
  };

  const icons = [Sparkles, Target, Zap, Sparkles]; // Cycling through icons

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h2
            className="text-2xl md:text-3xl font-bold font-playfair"
            style={{ color: accentColor }}
          >
            {title}
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: accentColor }} />
          {subtitle && (
            <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Motivation Text */}
        {showMotivationText && motivationText && (
          <div className="bg-white bg-opacity-50 p-6 rounded-lg max-w-2xl mx-auto">
            <p className="text-lg font-medium italic" style={{ color: accentColor }}>
              "{motivationText}"
            </p>
          </div>
        )}

        {/* Benefits List */}
        <div className="max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-6" style={{ color: accentColor }}>
            Com a orientação certa, você pode:
          </h3>
          <ul className="space-y-4 text-left">
            {benefits.map((benefit: string, index: number) => {
              const IconComponent = showIcons ? icons[index % icons.length] : null;
              return (
                <li key={index} className="flex items-start gap-3">
                  {showIcons && IconComponent && (
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: accentColor + '20' }}
                    >
                      <IconComponent className="w-4 h-4" style={{ color: accentColor }} />
                    </div>
                  )}
                  {!showIcons && (
                    <div
                      className="flex-shrink-0 w-2 h-2 rounded-full mt-2.5"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                  <span className="text-base leading-relaxed">{benefit}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Call to Action Message */}
        <div className="bg-white bg-opacity-70 p-4 rounded-lg max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
            <span className="font-semibold" style={{ color: accentColor }}>
              Sua transformação começa hoje
            </span>
            <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <p className="text-sm opacity-90">
            Descubra como aplicar seu estilo na prática e construa uma imagem que comunica sua
            verdadeira essência.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationSectionInlineBlock;

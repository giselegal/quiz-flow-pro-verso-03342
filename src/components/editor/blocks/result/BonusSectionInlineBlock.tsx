import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Gift, Star, Sparkles } from 'lucide-react';

/**
 * BonusSectionInlineBlock - Bonus section with exclusive offers
 * Shows bonus content and additional value propositions
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const BonusSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    title = 'Bônus Exclusivos para Você',
    subtitle = 'Além do guia principal, você receberá estas ferramentas complementares para potencializar sua jornada de transformação:',
    bonuses = [
      {
        id: 1,
        title: 'Peças-Chave do Guarda-roupa',
        description:
          'Guia completo com as peças essenciais que toda mulher deve ter, adaptadas ao seu estilo pessoal.',
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp',
        value: 'R$ 67,00',
        highlights: ['15 peças essenciais', 'Como combinar', 'Investimentos inteligentes'],
      },
      {
        id: 2,
        title: 'Visagismo e Harmonia Facial',
        description:
          'Descubra as melhores técnicas de maquiagem e cortes de cabelo para realçar sua beleza natural.',
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
        value: 'R$ 29,00',
        highlights: ['Análise facial', 'Maquiagem ideal', 'Cortes que favorecem'],
      },
    ],
    showValues = true,
    showHighlights = true,
    backgroundColor = '#ffffff',
    accentColor = '#B89B7A',
    textColor = '#432818',
    containerWidth = 'xxlarge',
    spacing = 'large',
    marginTop = 0,
    marginBottom = 24,
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
    isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50 rounded-lg',
    className
  );

  const containerStyle = {
    backgroundColor,
    color: textColor,
  };

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-6 h-6" style={{ color: accentColor }} />
            <h2
              className="text-2xl md:text-3xl font-bold font-playfair"
              style={{ color: accentColor }}
            >
              {title}
            </h2>
            <Gift className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          {subtitle && (
            <p className="text-base md:text-lg max-w-3xl mx-auto opacity-90 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: accentColor }} />
        </div>

        {/* Bonuses Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {bonuses.map((bonus: any, index: number) => (
              <div
                key={bonus.id || index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-opacity-10 relative overflow-hidden"
                style={{ borderColor: accentColor }}
              >
                {/* Bonus Image */}
                <div className="flex justify-center mb-4">
                  <img
                    src={`${bonus.image}?q=auto:best&f=auto&w=300`}
                    alt={bonus.title}
                    loading="lazy"
                    className="w-full max-w-[200px] h-auto rounded-lg shadow-sm"
                  />
                </div>

                {/* Bonus Content */}
                <div className="space-y-3">
                  {/* Title and Value */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold" style={{ color: accentColor }}>
                      {bonus.title}
                    </h3>
                    {showValues && bonus.value && (
                      <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {bonus.value}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm opacity-90 leading-relaxed">{bonus.description}</p>

                  {/* Highlights */}
                  {showHighlights && bonus.highlights && bonus.highlights.length > 0 && (
                    <ul className="space-y-1 text-xs">
                      {bonus.highlights.map((highlight: any, highlightIndex: number) => (
                        <li key={highlightIndex} className="flex items-center gap-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Exclusive Badge */}
                <div
                  className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white transform rotate-12 shadow-lg"
                  style={{ background: `linear-gradient(to right, ${accentColor}, #aa6b5d)` }}
                >
                  BÔNUS
                </div>

                {/* Decorative Element */}
                <div
                  className="absolute bottom-0 left-0 w-full h-1"
                  style={{ backgroundColor: accentColor + '20' }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Message */}
        <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
            <span className="font-semibold" style={{ color: accentColor }}>
              Valor total dos bônus: R$ 96,00
            </span>
            <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <p className="text-sm opacity-90">
            Todos estes bônus são <strong>inclusos gratuitamente</strong> quando você adquire seu
            guia de estilo personalizado hoje.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BonusSectionInlineBlock;

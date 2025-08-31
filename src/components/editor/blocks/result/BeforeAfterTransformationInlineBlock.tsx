import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { ArrowRight, Star } from 'lucide-react';

/**
 * BeforeAfterTransformationInlineBlock - Before/After transformation section
 * Shows transformation examples with before/after images
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const BeforeAfterTransformationInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    title = 'Veja as Transformações Reais',
    subtitle = 'Mulheres que aplicaram seu guia de estilo e transformaram completamente sua imagem',
    transformations = [
      {
        id: 1,
        beforeImage:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/ANTES_1_transformation_before.webp',
        afterImage:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/DEPOIS_1_transformation_after.webp',
        name: 'Marina S.',
        category: 'Elegante',
        testimonial: 'Minha autoestima mudou completamente!',
      },
      {
        id: 2,
        beforeImage:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/ANTES_2_transformation_before.webp',
        afterImage:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/DEPOIS_2_transformation_after.webp',
        name: 'Carla M.',
        category: 'Moderno',
        testimonial: 'Agora sei exatamente o que me favorece!',
      },
    ],
    showTestimonials = true,
    backgroundColor = '#ffffff',
    accentColor = '#B89B7A',
    textColor = '#432818',
    containerWidth = 'xlarge',
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
          <h2
            className="text-2xl md:text-3xl font-bold font-playfair"
            style={{ color: accentColor }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg opacity-90 max-w-3xl mx-auto">{subtitle}</p>
          )}
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: accentColor }} />
        </div>

        {/* Transformations Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {transformations.map((transformation: any, index: number) => (
            <div key={transformation.id || index} className="space-y-4">
              {/* Before/After Images */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {/* Before Image */}
                  <div className="relative">
                    <img
                      src={`${transformation.beforeImage}?q=auto:best&f=auto&w=300`}
                      alt={`Antes - ${transformation.name}`}
                      loading="lazy"
                      className="w-full h-auto rounded-lg shadow-md aspect-[3/4] object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ANTES
                    </div>
                  </div>

                  {/* After Image */}
                  <div className="relative">
                    <img
                      src={`${transformation.afterImage}?q=auto:best&f=auto&w=300`}
                      alt={`Depois - ${transformation.name}`}
                      loading="lazy"
                      className="w-full h-auto rounded-lg shadow-md aspect-[3/4] object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      DEPOIS
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              {showTestimonials && transformation.testimonial && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-2">"{transformation.testimonial}"</p>
                  <div className="text-xs font-medium" style={{ color: accentColor }}>
                    {transformation.name} • Estilo {transformation.category}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action Message */}
        <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
            ✨ Sua transformação começa hoje!
          </p>
          <p className="text-sm opacity-90">
            Cada guia é personalizado para seu estilo único, garantindo que você tenha as
            ferramentas certas para sua própria transformação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterTransformationInlineBlock;

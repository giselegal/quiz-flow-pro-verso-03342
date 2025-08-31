import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Star, Quote } from 'lucide-react';

/**
 * TestimonialsInlineBlock - Testimonials section with client feedback
 * Shows client testimonials and social proof
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const TestimonialsInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,

  className = '',
}) => {
  // Destructure properties with defaults
  const {
    title = 'O Que Nossas Clientes Dizem',
    subtitle = 'Depoimentos reais de mulheres que transformaram sua imagem e autoestima',
    testimonials = [
      {
        id: 1,
        name: 'Marina Santos',
        age: 34,
        profession: 'Executiva',
        location: 'São Paulo, SP',
        avatar:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/avatar_marina_testimonial.webp',
        rating: 5,
        text: 'O guia mudou completamente a minha forma de me vestir. Agora tenho confiança para qualquer ocasião e recebo elogios constantemente!',
        highlight: 'Autoestima transformada',
        beforeAfter: {
          before: 'Não sabia o que me favorecia',
          after: 'Looks incríveis todos os dias',
        },
      },
      {
        id: 2,
        name: 'Carla Mendes',
        age: 28,
        profession: 'Empreendedora',
        location: 'Rio de Janeiro, RJ',
        avatar:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/avatar_carla_testimonial.webp',
        rating: 5,
        text: 'Economizei muito dinheiro parando de comprar peças erradas. O guia me ensinou a fazer escolhas certeiras e montar looks perfeitos.',
        highlight: 'Economia inteligente',
        beforeAfter: {
          before: 'Compras por impulso',
          after: 'Guarda-roupa funcional',
        },
      },
      {
        id: 3,
        name: 'Ana Paula Silva',
        age: 41,
        profession: 'Advogada',
        location: 'Brasília, DF',
        avatar:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/avatar_ana_testimonial.webp',
        rating: 5,
        text: 'Finalmente encontrei meu estilo! O guia é muito detalhado e prático. Uso as dicas todos os dias e me sinto muito mais confiante.',
        highlight: 'Confiança profissional',
        beforeAfter: {
          before: 'Looks sem personalidade',
          after: 'Estilo autêntico',
        },
      },
    ],
    showRatings = true,
    showProfession = true,
    showBeforeAfter = true,
    showHighlight = true,
    layout = 'grid', // 'grid' or 'carousel'
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
    isSelected && 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg',
    className
  );

  const containerStyle = {
    backgroundColor,
    color: textColor,
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
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
          <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: accentColor }} />
          {subtitle && (
            <p className="text-base md:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Testimonials */}
        <div
          className={cn(
            'max-w-6xl mx-auto',
            layout === 'grid' ? 'grid md:grid-cols-3 gap-6' : 'space-y-6'
          )}
        >
          {testimonials.map((testimonial: any, index: number) => (
            <div
              key={testimonial.id || index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-opacity-10 relative"
              style={{ borderColor: accentColor }}
            >
              {/* Quote Icon */}
              <div
                className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <Quote className="w-4 h-4 text-white" />
              </div>

              {/* Avatar and Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={
                      testimonial.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=${accentColor.slice(1)}&color=fff&size=48`
                    }
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold" style={{ color: accentColor }}>
                    {testimonial.name}
                  </h4>
                  {showProfession && (
                    <p className="text-xs opacity-75">
                      {testimonial.profession} • {testimonial.age} anos
                    </p>
                  )}
                  <p className="text-xs opacity-60">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              {showRatings && (
                <div className="flex justify-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
              )}

              {/* Highlight Badge */}
              {showHighlight && testimonial.highlight && (
                <div className="mb-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: accentColor + '20',
                      color: accentColor,
                    }}
                  >
                    ✨ {testimonial.highlight}
                  </span>
                </div>
              )}

              {/* Testimonial Text */}
              <blockquote className="text-sm leading-relaxed mb-4 italic text-left">
                "{testimonial.text}"
              </blockquote>

              {/* Before/After */}
              {showBeforeAfter && testimonial.beforeAfter && (
                <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-medium">ANTES:</span>
                    <span className="opacity-75">{testimonial.beforeAfter.before}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-medium">DEPOIS:</span>
                    <span className="opacity-75">{testimonial.beforeAfter.after}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Social Proof Summary */}
        <div className="bg-gray-50 p-6 rounded-lg max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: accentColor }}>
                500+
              </div>
              <div className="opacity-75">Mulheres transformadas</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">{renderStars(5)}</div>
              <div className="opacity-75">Avaliação média</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: accentColor }}>
                98%
              </div>
              <div className="opacity-75">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsInlineBlock;

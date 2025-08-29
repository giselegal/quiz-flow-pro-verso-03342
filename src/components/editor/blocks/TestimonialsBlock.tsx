// @ts-nocheck
import { cn } from '@/lib/utils';
import { Quote, Star } from 'lucide-react';
import { getMarginClass } from '@/utils/margins';

interface TestimonialsBlockProps {
  title?: string;
  showRatings?: boolean;
  layout?: 'grid' | 'carousel';
  className?: string;
}

// Margens agora centralizadas em utils/margins

const TestimonialsBlock: React.FC<TestimonialsBlockProps & { block?: any }> = ({
  title: _title = 'Transformações Reais',
  showRatings: _showRatings = true,
  layout: _layout = 'grid',
  className,
  block,
}) => {
  const properties = (block?.properties as any) || {};
  const title = properties.title ?? _title;
  const showRatings = properties.showRatings ?? _showRatings;
  const layout = properties.layout ?? _layout;
  const marginTop = properties.marginTop ?? 0;
  const marginBottom = properties.marginBottom ?? 0;
  const marginLeft = properties.marginLeft ?? 0;
  const marginRight = properties.marginRight ?? 0;
  // Permitir injectar depoimentos via properties.testimonials
  const testimonials = properties.testimonials ?? [
    {
      name: 'Mariangela',
      role: 'Engenheira',
      text: 'Antes, a roupa me vestia. Hoje, eu me visto com intenção. Essa jornada me reconectou com a mulher que sempre fui.',
      rating: 5,
    },
    {
      name: 'Patrícia Paranhos',
      role: 'Advogada',
      text: 'Aprendi a reconhecer meu valor e refletir isso na forma como me apresento. As pessoas começaram a me enxergar diferente — porque eu estava diferente.',
      rating: 5,
    },
    {
      name: 'Sônia Spier',
      role: 'Terapeuta',
      text: 'Com a Gisele, entendi o poder da linguagem visual. Hoje eu escolho minhas roupas com consciência, propósito e leveza.',
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
          // Margens universais com controles deslizantes
          getMarginClass(marginTop, 'top'),
          getMarginClass(marginBottom, 'bottom'),
          getMarginClass(marginLeft, 'left'),
          getMarginClass(marginRight, 'right')
        )}
      />
    ));
  };

  return (
    <div className={cn('py-10', className)}>
  <div className="text-center mb-10" aria-live="polite">
        <h3 className="text-2xl md:text-3xl font-bold text-[#B89B7A] mb-3">{title}</h3>
        <p className="text-center text-[#8F7A6A] mb-4 max-w-2xl mx-auto">
          O que mulheres como você estão dizendo sobre esta jornada de transformação
        </p>
        <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full"></div>
      </div>

      <div
        className={cn(
          'max-w-6xl mx-auto',
          layout === 'grid'
            ? 'grid md:grid-cols-2 gap-6'
            : 'flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory'
        )}
      >
        {testimonials.map((item, index) => (
          <div
            key={index}
            className={cn(
              'p-8 relative overflow-hidden rounded-xl border border-[#B89B7A]/20 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-white',
              layout === 'carousel' && 'min-w-[300px] snap-start'
            )}
          >
            {/* Decorative elements */}
            <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-[#B89B7A]/40 rounded-tl-md" />
            <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-[#B89B7A]/40 rounded-br-md" />

            {/* Quote icon */}
            <div className="flex justify-center mb-4" aria-hidden>
              <Quote className="w-8 h-8 text-[#B89B7A] opacity-60" />
            </div>

            {/* Testimonial text */}
            <p className="text-[#432818] leading-relaxed text-center mb-6 flex-grow italic">
              "{item.text}"
            </p>

            {/* Rating */}
            {showRatings && (
              <div className="flex justify-center mb-4">{renderStars(item.rating)}</div>
            )}

            {/* Author info */}
            <div className="text-center border-t border-[#B89B7A]/10 pt-4">
              <h4 className="font-semibold text-[#aa6b5d] text-lg">{item.name}</h4>
              <p className="text-[#8F7A6A] text-sm">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsBlock;

// @ts-nocheck
import { cn } from '@/lib/utils';
import { Quote, Star } from 'lucide-react';

interface TestimonialsBlockProps {
  title?: string;
  showRatings?: boolean;
  layout?: 'grid' | 'carousel';
  className?: string;
}

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

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  title = 'Transformações Reais',
  showRatings = true,
  layout = 'grid',
  className,
}) => {
  // Dados reais dos depoimentos da ResultPage
  const testimonials = [
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
      <div className="text-center mb-10">
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
            <div className="flex justify-center mb-4">
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

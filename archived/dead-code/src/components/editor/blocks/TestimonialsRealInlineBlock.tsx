// @ts-nocheck
import { cn } from '@/lib/utils';
import { Star, Quote } from 'lucide-react';
import type { BlockData } from '@/types/blocks';

interface TestimonialsRealInlineBlockProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente inline para depoimentos reais da etapa 20
 * 100% responsivo, mobile-first com máximo 2 colunas
 */

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

const TestimonialsRealInlineBlock: React.FC<TestimonialsRealInlineBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  const properties = block.properties || {};
  const testimonials = properties.testimonials || [
    {
      name: 'Ana Silva',
      text: 'A consultoria mudou completamente minha forma de me vestir. Agora me sinto mais confiante e elegante!',
      rating: 5,
      image: 'https://placehold.co/80x80/cccccc/333333?text=AS',
      occupation: 'Executiva',
    },
  ];
  const title = properties.title || 'Depoimentos Reais';
  const layout = properties.layout || 'grid';
  const showRating = properties.showRating !== false;

  const handleEdit = (field: string, value: any) => {
    if (onPropertyChange && !disabled) {
      onPropertyChange(field, value);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
          // Margens universais com controles deslizantes
          getMarginClass(marginTop, 'top'),
          getMarginClass(marginBottom, 'bottom'),
          getMarginClass(marginLeft, 'left'),
          getMarginClass(marginRight, 'right')
        )}
      />
    ));
  };

  const renderTestimonial = (testimonial: any, index: number) => (
    <div
      key={index}
      className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col"
    >
      {/* Quote Icon */}
      <Quote className="w-6 h-6 text-pink-400 mb-3 flex-shrink-0" />

      {/* Depoimento */}
      <p style={{ color: '#6B4F43' }}>"{testimonial.text}"</p>

      {/* Rating */}
      {showRating && (
        <div className="flex items-center gap-1 mb-3">{renderStars(testimonial.rating || 5)}</div>
      )}

      {/* Cliente Info */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image || 'https://placehold.co/50x50/cccccc/333333?text=?'}
          alt={testimonial.name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-pink-200"
        />
        <div>
          <p style={{ color: '#432818' }}>{testimonial.name}</p>
          {testimonial.occupation && <p style={{ color: '#6B4F43' }}>{testimonial.occupation}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        'w-full p-4 md:p-6 transition-all duration-200',
        'bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg',
        isSelected && 'ring-2 ring-pink-400 bg-pink-50',
        !disabled && 'cursor-pointer hover:bg-pink-50/80',
        className
      )}
      onClick={onClick}
    >
      {/* Título */}
      <div className="mb-6">
        <h3 style={{ color: '#432818' }}>{title}</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full" />
      </div>

      {/* Grid de Depoimentos */}
      <div
        className={cn(
          'grid gap-4 md:gap-6',
          layout === 'grid' && testimonials.length > 1
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1',
          'auto-rows-fr' // Altura uniforme
        )}
      >
        {testimonials.map((testimonial: any, index: number) =>
          renderTestimonial(testimonial, index)
        )}
      </div>
    </div>
  );
};

export default TestimonialsRealInlineBlock;

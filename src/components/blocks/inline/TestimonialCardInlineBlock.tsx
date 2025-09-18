import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * TestimonialCardInlineBlock - Componente modular de depoimento
 * Mostra depoimento de cliente de forma compacta
 */

const TestimonialCardInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  // Validate block and properties
  if (!block || !block.properties) {
    console.warn('TestimonialCardInlineBlock: block or block.properties is undefined');
    return null;
  }

  const properties = block.properties || {};

  const name = properties.name || 'Maria Silva';
  const testimonial =
    properties.testimonial || 'Transformou completamente minha forma de me vestir!';
  const avatar = properties.avatar || 'https://via.placeholder.com/60x60';
  const rating = properties.rating || 5;
  const location = properties.location || 'São Paulo, SP';
  const cardSize = properties.cardSize || 'medium'; // small, medium, large

  const sizeClasses = {
    small: 'w-full sm:w-64 p-4',
    medium: 'w-full sm:w-80 p-6',
    large: 'w-full sm:w-96 p-8',
  };

  return (
    <div
      className={cn(
        // Layout inline responsivo
        'flex-shrink-0',
        sizeClasses[cardSize as keyof typeof sizeClasses],
        // Visual
        'bg-white rounded-xl border border-[#432818]/20',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        // Estados
        isSelected && 'ring-2 ring-[#432818]',
        'cursor-pointer hover:scale-105',
        'relative',
        className
      )}
      onClick={onClick}
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-[#432818]/30 mb-4" />

      {/* Testimonial text */}
      <blockquote className="text-[#432818] text-sm leading-relaxed mb-4 font-medium">
        "{testimonial}"
      </blockquote>

      {/* Rating stars */}
      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={cn('text-lg', star <= rating ? 'text-yellow-400' : 'text-gray-300')}
          >
            ★
          </span>
        ))}
      </div>

      {/* Author info */}
      <div className="flex items-center space-x-3">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#432818]/20"
        />
        <div>
          <p className="font-medium text-[#432818] text-sm">{name}</p>
          <p className="text-xs text-[#432818]">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCardInlineBlock;

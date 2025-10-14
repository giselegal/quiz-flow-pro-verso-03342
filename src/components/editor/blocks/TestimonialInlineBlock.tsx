import { cn } from '@/lib/utils';
import { Quote, Star, Edit3 } from 'lucide-react';

interface TestimonialInlineBlockProps {
  text?: string;
  authorName?: string;
  authorRole?: string;
  rating?: number;
  showStars?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
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

const TestimonialInlineBlock: React.FC<TestimonialInlineBlockProps> = ({
  text = 'Descobri meu estilo autêntico e agora me visto com muito mais confiança!',
  authorName = 'Maria Silva',
  authorRole = 'Cliente satisfeita',
  rating = 5,
  showStars = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-start gap-3 p-4 bg-[#fff7f3] rounded-lg border border-[#B89B7A]/20',
        'transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer',
        'w-full',
        disabled && 'opacity-75 cursor-not-allowed',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Quote Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-[#B89B7A] rounded-full flex items-center justify-center mt-1">
        <Quote className="w-4 h-4 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Stars */}
        {showStars && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3 h-3',
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                )}
              />
            ))}
          </div>
        )}

        {/* Testimonial Text */}
        <p
          className="text-sm text-[#432818] mb-2 line-clamp-3 italic"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newText = prompt('Novo depoimento:', text);
              if (newText !== null) onPropertyChange('text', newText);
            }
          }}
        >
          "{text}"
        </p>

        {/* Author */}
        <div className="text-xs text-[#8F7A6A]">
          <span
            className="font-medium"
            onClick={e => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newName = prompt('Novo nome:', authorName);
                if (newName !== null) onPropertyChange('authorName', newName);
              }
            }}
          >
            {authorName}
          </span>
          {authorRole && (
            <>
              <span className="mx-1">•</span>
              <span
                onClick={e => {
                  e.stopPropagation();
                  if (onPropertyChange && !disabled) {
                    const newRole = prompt('Novo cargo/descrição:', authorRole);
                    if (newRole !== null) onPropertyChange('authorRole', newRole);
                  }
                }}
              >
                {authorRole}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-[#B89B7A]" />
        </div>
      )}
    </div>
  );
};

export default TestimonialInlineBlock;

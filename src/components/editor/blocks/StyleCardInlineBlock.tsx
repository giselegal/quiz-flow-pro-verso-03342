import { cn } from '@/lib/utils';
import { Sparkles, Edit3 } from 'lucide-react';

interface StyleCardInlineBlockProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
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

const StyleCardInlineBlock: React.FC<StyleCardInlineBlockProps> = ({
  title = 'Seu Estilo Único',
  subtitle = 'Descoberto através do quiz',
  description = 'Características principais do seu perfil de estilo pessoal',
  showIcon = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 p-4 bg-white rounded-lg border-l-4 border-[#B89B7A] shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer',
        'w-full',
        disabled && 'opacity-75 cursor-not-allowed',
        className,
        // Margens universais com controles deslizantes
        getMarginClass((marginTop as number | string) ?? 0, 'top'),
        getMarginClass((marginBottom as number | string) ?? 0, 'bottom'),
        getMarginClass((marginLeft as number | string) ?? 0, 'left'),
        getMarginClass((marginRight as number | string) ?? 0, 'right')
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Icon */}
      {showIcon && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-[#432818] text-sm md:text-base truncate"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newTitle = prompt('Novo título:', title);
              if (newTitle !== null) onPropertyChange('title', newTitle);
            }
          }}
        >
          {title}
        </h3>
        <p
          className="text-xs md:text-sm text-[#8F7A6A] truncate"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newSubtitle = prompt('Novo subtítulo:', subtitle);
              if (newSubtitle !== null) onPropertyChange('subtitle', newSubtitle);
            }
          }}
        >
          {subtitle}
        </p>
        {description && (
          <p
            className="text-xs text-[#8F7A6A] mt-1 line-clamp-2"
            onClick={e => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newDescription = prompt('Nova descrição:', description);
                if (newDescription !== null) onPropertyChange('description', newDescription);
              }
            }}
          >
            {description}
          </p>
        )}
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

export default StyleCardInlineBlock;

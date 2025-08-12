// @ts-nocheck
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Edit3 } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * ImageInlineBlock - Componente modular inline horizontal
 * Imagem responsiva e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
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

const ImageInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    src = '',
    alt = 'Imagem',
    width = 'auto',
    height = 'auto',
    objectFit = 'cover', // cover, contain, fill, none, scale-down
    borderRadius = 'medium',
    aspectRatio = 'auto', // auto, square, video, portrait
    maxWidth = 'full',
    alignment = 'center',
    showCaption = false,
    caption = '',
    clickable = false,
    href = '',
    target = '_blank',
  } = block?.properties || {};

  // Object fit classes
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  // Border radius classes
  const borderRadiusClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full',
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  // Alignment classes
  const alignmentClasses = {
    left: 'mx-0 mr-auto',
    center: 'mx-auto',
    right: 'mx-0 ml-auto',
  };

  const handleImageClick = () => {
    if (clickable && href) {
      window.open(href, target);
    }
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível
        'flex-shrink-0 flex-grow-0 relative group',
        // Container editável
        'p-2 rounded-lg border border-transparent',
        'hover:border-gray-200 hover:bg-gray-50/30 transition-all duration-200',
        'cursor-pointer',
        isSelected && 'border-[#B89B7A] bg-[#B89B7A]/10/30',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      {src ? (
        <div className="space-y-2">
          <div
            className={cn(
              'relative overflow-hidden',
              borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses],
              aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
              maxWidthClasses[maxWidth as keyof typeof maxWidthClasses],
              alignmentClasses[alignment as keyof typeof alignmentClasses],
              clickable && 'cursor-pointer'
            )}
            onClick={handleImageClick}
          >
            <img
              src={src}
              alt={alt}
              className={cn(
                'w-full h-full transition-transform duration-200 hover:scale-105',
                objectFitClasses[objectFit as keyof typeof objectFitClasses]
              )}
              style={{
                width: width === 'auto' ? undefined : width,
                height: height === 'auto' ? undefined : height,
              }}
            />
          </div>

          {showCaption && caption && <p style={{ color: '#6B4F43' }}>{caption}</p>}
        </div>
      ) : (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <div style={{ color: '#8B7355' }}>
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Clique para selecionar e adicionar imagem no painel</p>
          </div>
        </div>
      )}

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#B89B7A]/100 text-white rounded-full p-1">
          <Edit3 className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

export default ImageInlineBlock;

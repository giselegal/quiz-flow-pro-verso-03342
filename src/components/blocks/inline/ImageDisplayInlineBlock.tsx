// @ts-nocheck
import { cn } from '@/lib/utils';
import EnhancedOptimizedImage from '@/components/ui/EnhancedOptimizedImage';
// Update the import path below to the correct location of BlockComponentProps
import type { BlockComponentProps } from '@/types/blocks';

/**
 * ImageDisplayInlineBlock - Componente modular inline horizontal
 * Imagem responsiva com aspectos configuráveis
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ImageDisplayInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange, // ✅ Adicionando suporte a edição de propriedades
  className = '',
}) => {
  // Safely extract properties with fallbacks
  const properties = block?.properties || {};

  const {
    src = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
    alt = 'Imagem',
    aspectRatio = 'square', // square, portrait, landscape, auto
    size = 'medium',
    showBadge = false,
    badgeText = 'Destaque',
    objectFit = 'cover',
    borderRadius = 'lg',
    // Propriedades específicas do template
    width,
    height,
    className: customClassName = '',
    textAlign = 'center',
    alignment = 'center',
    // Sistema completo de margens (positivas e negativas)
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = properties;

  // Tamanhos modulares responsivos
  const sizeClasses = {
    small: 'w-full max-w-[12rem] sm:max-w-[14rem] md:max-w-[16rem]',
    medium: 'w-full max-w-md mx-auto',
    large: 'w-full max-w-[28rem] sm:max-w-[32rem] md:max-w-[36rem]',
  };

  // Aspect ratios
  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'h-auto',
  };

  // Object fit
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  // Border radius
  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  // Text align classes
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    'text-left': 'text-left',
    'text-center': 'text-center',
    'text-right': 'text-right',
  };

  // Função para converter valores de margem em classes Tailwind (alinhada com useContainerProperties)
  const getMarginClass = (value: number | string, type: 'top' | 'bottom' | 'left' | 'right') => {
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

  // Usar className customizada se fornecida, senão usar classes padrão
  const containerClasses = cn(
    // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
    'flex-shrink-0 flex-grow-0 relative',
    // Centralização baseada no alignment ou textAlign
    alignment === 'center' || textAlign === 'center' || textAlign === 'text-center'
      ? 'mx-auto flex justify-center'
      : alignment === 'left'
        ? 'justify-start'
        : alignment === 'right'
          ? 'justify-end ml-auto'
          : '',
    // Usar classes customizadas ou responsivo modular
    customClassName || sizeClasses[size as keyof typeof sizeClasses],
    // Estados do editor
    isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2',
    'cursor-pointer transition-all duration-200',
    // Sistema completo de margens
    getMarginClass(marginTop, 'top'),
    getMarginClass(marginBottom, 'bottom'),
    getMarginClass(marginLeft, 'left'),
    getMarginClass(marginRight, 'right'),
    className
  );

  return (
    <div className={containerClasses} onClick={onClick}>
      <div
        className={cn(
          'relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300',
          aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
          borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses]
        )}
      >
        <EnhancedOptimizedImage
          src={src}
          alt={alt}
          width={typeof width === 'number' ? width : width ? parseInt(width) : 400}
          height={typeof height === 'number' ? height : height ? parseInt(height) : 400}
          aspectRatio={aspectRatio === 'square' ? 1 : aspectRatio === 'portrait' ? 3 / 4 : aspectRatio === 'landscape' ? 4 / 3 : 16 / 9}
          className={cn(
            'w-full h-auto transition-transform duration-500 hover:scale-105',
            objectFitClasses[objectFit as keyof typeof objectFitClasses],
            customClassName && 'w-auto h-auto' // Se tem className customizada, não forçar w-full h-full
          )}
          placeholder="blur"
          priority={false}
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Badge flutuante */}
        {showBadge && badgeText && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
            <span className="text-sm font-medium text-[#432818]">{badgeText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplayInlineBlock;

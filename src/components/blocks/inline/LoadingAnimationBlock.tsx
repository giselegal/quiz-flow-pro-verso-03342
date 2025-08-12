// @ts-nocheck
import { cn } from '@/lib/utils';
import type { BlockComponentProps, BlockData } from '@/types/blocks';

interface Props extends BlockComponentProps {
  block: BlockData;
  className?: string;
  onUpdate?: (updates: Partial<BlockData>) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
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

const LoadingAnimationBlock: React.FC<Props> = ({
  block,
  className,
  onUpdate,
  isSelected,
  onSelect,
}) => {
  const properties = block.properties || {};
  const {
    type = 'spinner',
    size = 'medium',
    color = '#432818',
    duration = 3000,
    // Sistema completo de margens com controles deslizantes
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = properties;

  const handleClick = () => {
    onSelect?.();
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-6 h-6';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  const renderSpinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300',
        getSizeClass(size),
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      style={{
        borderTopColor: color,
        animationDuration: `${duration / 1000}s`,
      }}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-4 h-4' : 'w-3 h-3'
          )}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 200}ms`,
            animationDuration: `${duration / 1000}s`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn('rounded-full animate-pulse', getSizeClass(size))}
      style={{
        backgroundColor: color,
        animationDuration: `${duration / 1000}s`,
      }}
    />
  );

  const renderAnimation = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  return (
    <div
      className={cn(
        'loading-animation w-full flex items-center justify-center py-8',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-[#432818] bg-[#432818]/10',
        className
      )}
      onClick={handleClick}
    >
      {renderAnimation()}
    </div>
  );
};

export default LoadingAnimationBlock;

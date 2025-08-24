import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * DecorativeBarInlineBlock - Barra decorativa dourada
 * Componente específico para barras visuais decorativas
 * MODULAR | RESPONSIVO | INDEPENDENTE
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: string | number,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
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

const DecorativeBarInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange: _onPropertyChange, // ✅ Adicionando suporte a edição de propriedades
  className = '',
}) => {
  const {
    width = '100%',
    height = 4,
    color = '#B89B7A',
    gradientColors = ['#B89B7A', '#D4C2A8', '#B89B7A'],
    borderRadius = 3,
    marginTop = 8,
    marginBottom = 24,
    marginLeft = 0,
    marginRight = 0,
    showShadow = true,
  } = (block?.properties as any) || {};

  const resolveWidth = (
    value: string | number
  ): { className?: string; style?: React.CSSProperties } => {
    if (typeof value === 'number') return { style: { width: `${value}px` } };
    if (/^\d+(px|rem|em|%)$/.test(value) || value.includes('min(') || value.includes('max(')) {
      return { style: { width: value } };
    }
    // Assume classe Tailwind custom, p.ex. max-w-[640px]
    return { className: value };
  };

  return (
    <div
      className={cn(
        'w-full flex justify-center items-center',
        isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2 rounded-md p-1',
        'cursor-pointer transition-all duration-200',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
      }}
      onClick={onClick}
    >
      <div
        className={cn('block', resolveWidth(width).className)}
        style={{
          ...resolveWidth(width).style,
          height: `${height}px`,
          background:
            gradientColors.length > 1
              ? `linear-gradient(90deg, ${gradientColors.join(', ')})`
              : color,
          borderRadius: `${borderRadius}px`,
          ...(showShadow && {
            boxShadow: `0 2px 6px rgba(184, 155, 122, 0.4)`,
          }),
        }}
      />
    </div>
  );
};

export default DecorativeBarInlineBlock;

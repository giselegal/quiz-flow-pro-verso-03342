import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '../../../types/blocks';

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

const SectionDividerBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange: _onPropertyChange,
  className = '',
}) => {
  const {
    style = 'solid',
    color = '#e5e7eb',
    thickness = 1,
    margin = 32,
    width = '100%',
  } = block.properties || {};

  const getLineStyle = () => {
    switch (style) {
      case 'dashed':
        return 'border-dashed';
      case 'dotted':
        return 'border-dotted';
      case 'double':
        return 'border-double';
      default:
        return 'border-solid';
    }
  };

  return (
    <div
      className={cn(
        'w-full flex items-center justify-center transition-all duration-200',
        'hover:bg-stone-50 rounded-lg',
        isSelected && 'bg-brand/10 ring-2 ring-brand/30',
        className,
        // Margens universais com controles deslizantes
        getMarginClass((marginTop as number | string) ?? 0, 'top'),
        getMarginClass((marginBottom as number | string) ?? 0, 'bottom'),
        getMarginClass((marginLeft as number | string) ?? 0, 'left'),
        getMarginClass((marginRight as number | string) ?? 0, 'right')
      )}
      style={{ marginTop: margin / 2, marginBottom: margin / 2 }}
      onClick={onClick}
    >
      <hr
        className={cn('border-0 border-t', getLineStyle())}
        style={{
          borderColor: color,
          borderTopWidth: thickness,
          width: width,
          maxWidth: '100%',
        }}
      />
    </div>
  );
};

export default SectionDividerBlock;

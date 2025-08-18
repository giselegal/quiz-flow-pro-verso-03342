// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { ArrowRightLeft } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

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

const MarqueeBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    text = 'Texto rolando na marquise!',
    speed = 50,
    direction = 'left',
    textColor = '#000000',
    backgroundColor = '#f0f0f0',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const animationSpeed = speed ? `${speed / 10}s` : '5s';
  const animationDirection = direction === 'right' ? 'marquee-right' : 'marquee-left';

  return (
    <div
      className={`
        py-2 px-0 relative overflow-hidden cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={{ backgroundColor: backgroundColor || '#f0f0f0' }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div
        className={`whitespace-nowrap inline-block ${animationDirection}`}
        style={{
          animationDuration: animationSpeed,
          color: textColor || '#000000',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        }}
      >
        <span className="px-4">
          <InlineEditableText
            value={text}
            onChange={(value: string) => handlePropertyChange('text', value)}
            className="inline-block"
            placeholder="Texto da marquise"
          />
        </span>
        {/* Duplica o texto para um loop contínuo */}
        <span className="px-4">{text || 'Texto rolando na marquise!'}</span>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .marquee-left {
          animation-name: marquee-left;
        }
        .marquee-right {
          animation-name: marquee-right;
        }
      `}</style>
    </div>
  );
};

export default MarqueeBlock;

// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { AlignHorizontalDistributeEnd } from 'lucide-react';
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

const CompareBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Antes vs Depois',
    value1 = 30,
    label1 = 'Antes',
    value2 = 70,
    label2 = 'Depois',
    color1 = '#B89B7A',
    color2 = '#432818',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const val1 = value1 ?? 30;
  const val2 = value2 ?? 70;
  const total = val1 + val2;
  const percent1 = total > 0 ? (val1 / total) * 100 : 0;
  const percent2 = total > 0 ? (val2 / total) * 100 : 0;

  return (
    <div
      className={`
        py-6 text-center space-y-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <h3 className="text-xl font-bold text-[#432818]">
        <InlineEditableText
          value={title}
          onChange={(value: string) => handlePropertyChange('title', value)}
          className="inline-block"
          placeholder="Título da comparação"
        />
      </h3>
      <div className="flex w-full max-w-md mx-auto h-8 rounded-lg overflow-hidden shadow-md">
        <div
          className="flex items-center justify-center text-white text-sm font-semibold"
          style={{
            width: `${percent1}%`,
            backgroundColor: color1 || '#B89B7A',
          }}
        >
          {label1 || 'Antes'} ({Math.round(percent1)}%)
        </div>
        <div
          className="flex items-center justify-center text-white text-sm font-semibold"
          style={{
            width: `${percent2}%`,
            backgroundColor: color2 || '#432818',
          }}
        >
          {label2 || 'Depois'} ({Math.round(percent2)}%)
        </div>
      </div>
      <div style={{ color: '#6B4F43' }}>
        <div>Valor 1: {val1}</div>
        <div>Valor 2: {val2}</div>
      </div>
      <p style={{ color: '#6B4F43' }}>Compare dois valores visualmente.</p>
    </div>
  );
};

export default CompareBlock;

import React from 'react';
import { InlineEditableText } from './InlineEditableText';
import { AlignHorizontalDistributeEnd } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

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
      <div className="flex justify-center gap-8 text-sm text-gray-600">
        <div>Valor 1: {val1}</div>
        <div>Valor 2: {val2}</div>
      </div>
      <p className="text-sm text-gray-600">Compare dois valores visualmente.</p>
    </div>
  );
};

export default CompareBlock;

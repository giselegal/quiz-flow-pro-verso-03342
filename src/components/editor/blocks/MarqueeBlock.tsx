import React from 'react';
import { InlineEditableText } from './InlineEditableText';
import { ArrowRightLeft } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

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

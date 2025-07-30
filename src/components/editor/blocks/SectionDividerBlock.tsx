import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockComponentProps } from '../../../types/blocks';

const SectionDividerBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    style = 'solid',
    color = '#e5e7eb',
    thickness = 1,
    margin = 32,
    width = '100%'
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
        'hover:bg-gray-50 rounded-lg',
        isSelected && 'bg-blue-50 ring-2 ring-blue-200',
        className
      )}
      style={{ marginTop: margin / 2, marginBottom: margin / 2 }}
      onClick={onClick}
    >
      <hr
        className={cn(
          'border-0 border-t',
          getLineStyle()
        )}
        style={{
          borderColor: color,
          borderTopWidth: thickness,
          width: width,
          maxWidth: '100%'
        }}
      />
    </div>
  );
};

export default SectionDividerBlock;

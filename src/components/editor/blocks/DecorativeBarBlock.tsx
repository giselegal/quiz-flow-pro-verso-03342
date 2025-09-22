import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';

/**
 * 🎨 DecorativeBarBlock - Barra decorativa
 */
const DecorativeBarBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const {
    width = '100%',
    height = '4px',
    backgroundColor = '#B89B7A',
    borderRadius = '2px',
    marginTop = 16,
    marginBottom = 16,
  } = block?.properties || {};

  const barStyle = {
    width: width === 'auto' ? '100%' : width,
    height: `${height}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    margin: '0 auto',
  } as React.CSSProperties;

  return (
    <div
      className={`
        py-2 px-2 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-blue-400 bg-blue-50/30' : 'hover:bg-gray-50/50'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={barStyle} />
      </div>
    </div>
  );
};

export default DecorativeBarBlock;